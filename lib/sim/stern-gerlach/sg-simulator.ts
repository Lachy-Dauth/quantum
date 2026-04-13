/**
 * Stern-Gerlach Simulation Engine.
 *
 * Simulates spin-1/2 particles passing through a chain of Stern-Gerlach
 * magnets, each measuring spin along an axis defined by (theta, phi).
 */

import { innerProduct, vecFromArray, STATE_ZERO, STATE_ONE, STATE_PLUS, STATE_MINUS, STATE_PLUS_I, STATE_MINUS_I } from '../core/vector'
import { createRng } from '../core/utils'
import type { StateVector, Complex } from '../core/types'
import type { SGApparatus, SGExperiment, SGSingleResult, SGBatchResult } from './types'

// ---------------------------------------------------------------------------
// Eigenstate computation
// ---------------------------------------------------------------------------

/**
 * Compute the spin-up eigenstate |+n> for axis (theta, phi).
 * |+n> = cos(theta/2)|0> + e^{i*phi}*sin(theta/2)|1>
 */
export function eigenstateUp(theta: number, phi: number): StateVector {
  const cosHalf = Math.cos(theta / 2)
  const sinHalf = Math.sin(theta / 2)
  return vecFromArray([
    { re: cosHalf, im: 0 },
    { re: sinHalf * Math.cos(phi), im: sinHalf * Math.sin(phi) },
  ])
}

/**
 * Compute the spin-down eigenstate |-n> for axis (theta, phi).
 * |-n> = sin(theta/2)|0> - e^{i*phi}*cos(theta/2)|1>
 */
export function eigenstateDown(theta: number, phi: number): StateVector {
  const cosHalf = Math.cos(theta / 2)
  const sinHalf = Math.sin(theta / 2)
  return vecFromArray([
    { re: sinHalf, im: 0 },
    { re: -cosHalf * Math.cos(phi), im: -cosHalf * Math.sin(phi) },
  ])
}

/**
 * Parse an initial state string into a StateVector.
 */
export function parseSGInitialState(input: string | StateVector): StateVector {
  if (typeof input !== 'string') return input

  const s = input.trim()
  switch (s) {
    case '|0>':
    case '|+z>':
      return STATE_ZERO
    case '|1>':
    case '|-z>':
      return STATE_ONE
    case '|+>':
    case '|+x>':
      return STATE_PLUS
    case '|->':
    case '|-x>':
      return STATE_MINUS
    case '|+y>':
    case '|+i>':
      return STATE_PLUS_I
    case '|-y>':
    case '|-i>':
      return STATE_MINUS_I
    default:
      throw new Error(`Unknown SG initial state: "${s}"`)
  }
}

// ---------------------------------------------------------------------------
// Simulator
// ---------------------------------------------------------------------------

export class SGSimulator {
  experiment: SGExperiment
  private rng: () => number

  constructor(seed?: number) {
    this.rng = seed !== undefined ? createRng(seed) : Math.random
    this.experiment = {
      initialState: STATE_ZERO,
      apparatuses: [],
    }
  }

  setExperiment(experiment: SGExperiment): void {
    this.experiment = experiment
  }

  setInitialState(state: string | StateVector): void {
    this.experiment.initialState = parseSGInitialState(state)
  }

  setApparatuses(apparatuses: SGApparatus[]): void {
    this.experiment.apparatuses = apparatuses
  }

  /**
   * Send one particle through the apparatus chain.
   */
  runSingle(): SGSingleResult {
    const outcomes: SGSingleResult['outcomes'] = []
    let state = this.experiment.initialState

    // Build a topological order: follow the chain from 'source'
    const orderedApps = this.getTopologicalOrder()

    // Track which apparatus outputs are available
    const outputStates = new Map<string, StateVector>()

    for (const app of orderedApps) {
      // Determine the input state
      let inputState: StateVector
      if (app.input === 'source') {
        inputState = state
      } else {
        const key = `${app.input.apparatusId}:${app.input.output}`
        const s = outputStates.get(key)
        if (!s) {
          // Particle didn't reach this apparatus (blocked earlier)
          return {
            outcomes,
            blocked: true,
            blockedAt: app.id,
            finalDetector: null,
          }
        }
        inputState = s
      }

      // Compute eigenstates
      const upState = eigenstateUp(app.axis.theta, app.axis.phi)
      const downState = eigenstateDown(app.axis.theta, app.axis.phi)

      // Compute probabilities
      const overlapUp = innerProduct(upState, inputState)
      const pUp = overlapUp.re * overlapUp.re + overlapUp.im * overlapUp.im

      // Sample outcome
      const r = this.rng()
      const output: 'up' | 'down' = r < pUp ? 'up' : 'down'
      const stateAfter = output === 'up' ? upState : downState
      const probability = output === 'up' ? pUp : 1 - pUp

      outcomes.push({
        apparatusId: app.id,
        output,
        probability,
        stateAfter,
      })

      // Check if blocked
      if (app.blocked === output) {
        return {
          outcomes,
          blocked: true,
          blockedAt: app.id,
          finalDetector: null,
        }
      }

      // Store output state for downstream apparatuses
      outputStates.set(`${app.id}:${output}`, stateAfter)
    }

    // Determine final detector
    const lastOutcome = outcomes[outcomes.length - 1]
    const finalDetector = lastOutcome
      ? `${lastOutcome.apparatusId}:${lastOutcome.output}`
      : null

    return {
      outcomes,
      blocked: false,
      finalDetector,
    }
  }

  /**
   * Run batch of N particles.
   */
  runBatch(n: number): SGBatchResult {
    const detectorCounts = new Map<string, number>()
    let totalBlocked = 0

    for (let i = 0; i < n; i++) {
      const result = this.runSingle()
      if (result.blocked) {
        totalBlocked++
      } else if (result.finalDetector) {
        detectorCounts.set(
          result.finalDetector,
          (detectorCounts.get(result.finalDetector) ?? 0) + 1,
        )
      }
    }

    const totalDetected = n - totalBlocked
    return { detectorCounts, totalEmitted: n, totalBlocked, totalDetected }
  }

  /**
   * Compute theoretical probabilities for each detector analytically.
   */
  computeTheoreticalProbabilities(): Map<string, number> {
    const probs = new Map<string, number>()
    this.computeTheoreticalRecursive(
      this.experiment.initialState,
      1.0,
      'source',
      null,
      probs,
    )
    return probs
  }

  private computeTheoreticalRecursive(
    state: StateVector,
    branchProbability: number,
    inputSource: string,
    inputOutput: string | null,
    probs: Map<string, number>,
  ): void {
    // Find apparatus that takes this input
    const app = this.experiment.apparatuses.find(a => {
      if (inputSource === 'source') return a.input === 'source'
      return (
        typeof a.input === 'object' &&
        a.input.apparatusId === inputSource &&
        a.input.output === inputOutput
      )
    })

    if (!app) {
      // No apparatus to process; this branch reaches a detector
      if (inputSource !== 'source' && branchProbability > 1e-15) {
        const detectorKey = `${inputSource}:${inputOutput}`
        probs.set(detectorKey, (probs.get(detectorKey) ?? 0) + branchProbability)
      }
      return
    }

    const upState = eigenstateUp(app.axis.theta, app.axis.phi)
    const downState = eigenstateDown(app.axis.theta, app.axis.phi)

    const overlapUp = innerProduct(upState, state)
    const pUp = overlapUp.re * overlapUp.re + overlapUp.im * overlapUp.im
    const pDown = 1 - pUp

    // Up branch
    if (app.blocked !== 'up' && pUp > 1e-15) {
      this.computeTheoreticalRecursive(
        upState,
        branchProbability * pUp,
        app.id,
        'up',
        probs,
      )
    }

    // Down branch
    if (app.blocked !== 'down' && pDown > 1e-15) {
      this.computeTheoreticalRecursive(
        downState,
        branchProbability * pDown,
        app.id,
        'down',
        probs,
      )
    }
  }

  /**
   * Get apparatuses in topological order (following the chain).
   * Simple: first apparatus has input='source', rest follow.
   */
  private getTopologicalOrder(): SGApparatus[] {
    const apps = this.experiment.apparatuses
    if (apps.length === 0) return []

    const ordered: SGApparatus[] = []
    const remaining = new Set(apps.map(a => a.id))
    const resolved = new Set<string>(['source'])

    // Keep resolving until all are ordered
    let safety = 0
    while (remaining.size > 0 && safety < 100) {
      safety++
      for (const app of apps) {
        if (!remaining.has(app.id)) continue

        let canResolve = false
        if (app.input === 'source') {
          canResolve = true
        } else if (typeof app.input === 'object') {
          canResolve = resolved.has(app.input.apparatusId)
        }

        if (canResolve) {
          ordered.push(app)
          remaining.delete(app.id)
          resolved.add(app.id)
        }
      }
    }

    return ordered
  }
}
