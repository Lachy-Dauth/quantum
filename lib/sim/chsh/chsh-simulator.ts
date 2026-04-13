/**
 * CHSH Inequality Simulation Engine.
 *
 * Simulates the CHSH experiment: two entangled particles measured by Alice and Bob
 * along chosen axes in the x-z plane. The CHSH quantity S is computed from correlations
 * across four setting pairs.
 *
 * Physics:
 * - Bell state |Phi+> = (|00> + |11>)/sqrt(2) distributed to Alice and Bob
 * - Measurement operator: A(a) = cos(a)*sigma_z + sin(a)*sigma_x (eigenvalues +/-1)
 * - Correlation: E(a,b) = -cos(a-b) for |Phi+>
 * - S = E(a1,b1) + E(a1,b2) + E(a2,b1) - E(a2,b2)
 * - Classical bound: |S| <= 2, quantum bound: |S| <= 2*sqrt(2)
 */

import { vecFromArray, innerProduct, tensorProduct } from '../core/vector'
import { createRng } from '../core/utils'
import { BELL_PHI_PLUS, BELL_PHI_MINUS, BELL_PSI_PLUS, BELL_PSI_MINUS, basisState } from '../core/vector'
import type { StateVector } from '../core/types'
import type {
  CHSHTrial,
  SettingPairStats,
  CHSHExperimentState,
  EntangledState,
} from './types'

// ---------------------------------------------------------------------------
// Eigenstates for A(a) = cos(a)*Z + sin(a)*X
// Eigenvalue +1: |+a> = cos(a/2)|0> + sin(a/2)|1>
// Eigenvalue -1: |-a> = -sin(a/2)|0> + cos(a/2)|1>
// ---------------------------------------------------------------------------

function eigenstatePlus(angle: number): StateVector {
  return vecFromArray([
    { re: Math.cos(angle / 2), im: 0 },
    { re: Math.sin(angle / 2), im: 0 },
  ])
}

function eigenstateMinus(angle: number): StateVector {
  return vecFromArray([
    { re: -Math.sin(angle / 2), im: 0 },
    { re: Math.cos(angle / 2), im: 0 },
  ])
}

function getEntangledState(type: EntangledState): StateVector {
  switch (type) {
    case 'phi_plus': return BELL_PHI_PLUS
    case 'phi_minus': return BELL_PHI_MINUS
    case 'psi_plus': return BELL_PSI_PLUS
    case 'psi_minus': return BELL_PSI_MINUS
    case 'product': return tensorProduct(basisState(2, 0), basisState(2, 0))
  }
}

// ---------------------------------------------------------------------------
// Simulator
// ---------------------------------------------------------------------------

function emptyPairStats(a: number, b: number, entState: EntangledState): SettingPairStats {
  return {
    aliceAngle: a,
    bobAngle: b,
    trials: 0,
    sumProduct: 0,
    correlation: 0,
    theoreticalCorrelation: computeCorrelationForState(a, b, getEntangledState(entState)),
  }
}

/**
 * Compute E(a,b) = <psi| (A tensor B) |psi> analytically.
 * A = cos(a)*Z + sin(a)*X, B = cos(b)*Z + sin(b)*X.
 */
function computeCorrelationForState(a: number, b: number, state: StateVector): number {
  // Build the 4 joint projectors and sum outcome*probability
  const aPlus = eigenstatePlus(a)
  const aMinus = eigenstateMinus(a)
  const bPlus = eigenstatePlus(b)
  const bMinus = eigenstateMinus(b)

  // P(+1,+1)
  const pp = tensorProduct(aPlus, bPlus)
  const overlap_pp = innerProduct(pp, state)
  const p_pp = overlap_pp.re * overlap_pp.re + overlap_pp.im * overlap_pp.im

  // P(+1,-1)
  const pm = tensorProduct(aPlus, bMinus)
  const overlap_pm = innerProduct(pm, state)
  const p_pm = overlap_pm.re * overlap_pm.re + overlap_pm.im * overlap_pm.im

  // P(-1,+1)
  const mp = tensorProduct(aMinus, bPlus)
  const overlap_mp = innerProduct(mp, state)
  const p_mp = overlap_mp.re * overlap_mp.re + overlap_mp.im * overlap_mp.im

  // P(-1,-1)
  const mm = tensorProduct(aMinus, bMinus)
  const overlap_mm = innerProduct(mm, state)
  const p_mm = overlap_mm.re * overlap_mm.re + overlap_mm.im * overlap_mm.im

  // E = (+1)(+1)*p_pp + (+1)(-1)*p_pm + (-1)(+1)*p_mp + (-1)(-1)*p_mm
  return p_pp - p_pm - p_mp + p_mm
}

export class CHSHSimulator {
  private entState: EntangledState
  private entangledVec: StateVector
  private rng: () => number
  private aliceAngles: [number, number]
  private bobAngles: [number, number]
  private pairStats: [SettingPairStats, SettingPairStats, SettingPairStats, SettingPairStats]
  private trials: CHSHTrial[] = []
  private totalTrials = 0
  private maxTrials: number

  constructor(seed?: number, maxTrials = 10000) {
    this.rng = seed !== undefined ? createRng(seed) : Math.random
    this.entState = 'phi_plus'
    this.entangledVec = BELL_PHI_PLUS
    this.aliceAngles = [0, Math.PI / 2]
    this.bobAngles = [Math.PI / 4, -Math.PI / 4]
    this.maxTrials = maxTrials
    this.pairStats = this.buildPairStats()
  }

  private buildPairStats(): [SettingPairStats, SettingPairStats, SettingPairStats, SettingPairStats] {
    return [
      emptyPairStats(this.aliceAngles[0], this.bobAngles[0], this.entState),
      emptyPairStats(this.aliceAngles[0], this.bobAngles[1], this.entState),
      emptyPairStats(this.aliceAngles[1], this.bobAngles[0], this.entState),
      emptyPairStats(this.aliceAngles[1], this.bobAngles[1], this.entState),
    ]
  }

  setEntangledState(type: EntangledState): void {
    this.entState = type
    this.entangledVec = getEntangledState(type)
    this.reset()
  }

  setAngles(aliceAngles: [number, number], bobAngles: [number, number]): void {
    this.aliceAngles = aliceAngles
    this.bobAngles = bobAngles
    this.reset()
  }

  /**
   * Run a single trial with random settings.
   */
  runTrial(): CHSHTrial {
    const aliceSetting = (this.rng() < 0.5 ? 0 : 1) as 0 | 1
    const bobSetting = (this.rng() < 0.5 ? 0 : 1) as 0 | 1
    return this.runTrialWithSettings(aliceSetting, bobSetting)
  }

  /**
   * Run a trial with specified settings.
   */
  runTrialWithSettings(aliceSetting: 0 | 1, bobSetting: 0 | 1): CHSHTrial {
    const a = this.aliceAngles[aliceSetting]
    const b = this.bobAngles[bobSetting]

    // Build joint measurement eigenstates and compute probabilities
    const aPlus = eigenstatePlus(a)
    const aMinus = eigenstateMinus(a)
    const bPlus = eigenstatePlus(b)
    const bMinus = eigenstateMinus(b)

    const pp = tensorProduct(aPlus, bPlus)
    const pm = tensorProduct(aPlus, bMinus)
    const mp = tensorProduct(aMinus, bPlus)

    const ov_pp = innerProduct(pp, this.entangledVec)
    const p_pp = ov_pp.re * ov_pp.re + ov_pp.im * ov_pp.im

    const ov_pm = innerProduct(pm, this.entangledVec)
    const p_pm = ov_pm.re * ov_pm.re + ov_pm.im * ov_pm.im

    const ov_mp = innerProduct(mp, this.entangledVec)
    const p_mp = ov_mp.re * ov_mp.re + ov_mp.im * ov_mp.im

    // p_mm = 1 - p_pp - p_pm - p_mp
    const cumulatives = [p_pp, p_pp + p_pm, p_pp + p_pm + p_mp]
    const r = this.rng()

    let aliceOutcome: 1 | -1
    let bobOutcome: 1 | -1

    if (r < cumulatives[0]!) {
      aliceOutcome = 1; bobOutcome = 1
    } else if (r < cumulatives[1]!) {
      aliceOutcome = 1; bobOutcome = -1
    } else if (r < cumulatives[2]!) {
      aliceOutcome = -1; bobOutcome = 1
    } else {
      aliceOutcome = -1; bobOutcome = -1
    }

    const product = (aliceOutcome * bobOutcome) as 1 | -1

    const trial: CHSHTrial = { aliceSetting, bobSetting, aliceOutcome, bobOutcome, product }

    // Update statistics
    const pairIdx = aliceSetting * 2 + bobSetting
    const pair = this.pairStats[pairIdx]!
    pair.trials++
    pair.sumProduct += product
    pair.correlation = pair.trials > 0 ? pair.sumProduct / pair.trials : 0

    this.trials.push(trial)
    this.totalTrials++

    // Cap stored trials
    if (this.trials.length > this.maxTrials) {
      this.trials = this.trials.slice(-this.maxTrials)
    }

    return trial
  }

  /**
   * Run N trials with random settings.
   */
  runBatch(n: number): void {
    for (let i = 0; i < n; i++) {
      this.runTrial()
    }
  }

  /**
   * Compute theoretical S value analytically.
   */
  computeTheoreticalS(): number {
    const e00 = computeCorrelationForState(this.aliceAngles[0], this.bobAngles[0], this.entangledVec)
    const e01 = computeCorrelationForState(this.aliceAngles[0], this.bobAngles[1], this.entangledVec)
    const e10 = computeCorrelationForState(this.aliceAngles[1], this.bobAngles[0], this.entangledVec)
    const e11 = computeCorrelationForState(this.aliceAngles[1], this.bobAngles[1], this.entangledVec)
    return e00 + e01 + e10 - e11
  }

  /**
   * Compute E(a,b) analytically.
   */
  computeCorrelation(a: number, b: number): number {
    return computeCorrelationForState(a, b, this.entangledVec)
  }

  /**
   * Generate correlation vs angle-difference data points.
   */
  correlationCurve(numPoints = 100): Array<{ angleDiff: number; E: number }> {
    const points: Array<{ angleDiff: number; E: number }> = []
    for (let i = 0; i <= numPoints; i++) {
      const diff = (i / numPoints) * Math.PI
      const E = this.computeCorrelation(0, diff)
      points.push({ angleDiff: diff, E })
    }
    return points
  }

  /** Reset all statistics. */
  reset(): void {
    this.pairStats = this.buildPairStats()
    this.trials = []
    this.totalTrials = 0
  }

  /** Get the current state. */
  getState(): CHSHExperimentState {
    const [p0, p1, p2, p3] = this.pairStats
    const empiricalS = p0!.correlation + p1!.correlation + p2!.correlation - p3!.correlation

    return {
      aliceAngles: this.aliceAngles,
      bobAngles: this.bobAngles,
      pairStats: this.pairStats,
      empiricalS,
      theoreticalS: this.computeTheoreticalS(),
      trials: this.trials,
      totalTrials: this.totalTrials,
    }
  }
}
