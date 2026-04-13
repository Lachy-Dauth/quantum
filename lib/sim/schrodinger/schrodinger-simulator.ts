/**
 * 1D Schrödinger Simulator.
 *
 * Manages wavefunction state, potential, time evolution (Crank-Nicolson),
 * eigenstates, observables, and initial state configuration.
 */

import { CrankNicolsonSolver } from './crank-nicolson'
import { findEigenstates } from './eigensolver'
import { createPotential } from './potentials'
import type {
  Wavefunction,
  Potential,
  Eigenstate,
  Observables,
  PotentialType,
  InitialStateConfig,
} from './types'

export class SchrodingerSimulator {
  N: number
  xMin: number
  xMax: number
  dx: number
  x: Float64Array
  dt: number
  time: number

  potential: Potential
  psiRe: Float64Array
  psiIm: Float64Array
  eigenstates: Eigenstate[]

  private solver: CrankNicolsonSolver | null = null

  constructor(
    N = 512,
    domain: [number, number] = [-10, 10],
    potentialType: PotentialType = 'infinite_well',
    potentialParams?: Record<string, number>,
  ) {
    this.N = N
    this.xMin = domain[0]
    this.xMax = domain[1]
    this.dx = (this.xMax - this.xMin) / (N - 1)
    this.x = new Float64Array(N)
    for (let i = 0; i < N; i++) {
      this.x[i] = this.xMin + i * this.dx
    }

    // Auto dt: stable and accurate
    this.dt = 0.5 * this.dx * this.dx
    this.time = 0

    this.psiRe = new Float64Array(N)
    this.psiIm = new Float64Array(N)

    this.potential = createPotential(potentialType, this.x, potentialParams)
    this.eigenstates = []

    this.buildSolver()
  }

  private buildSolver(): void {
    this.solver = new CrankNicolsonSolver(this.N, this.dx, this.dt, this.potential.values)
  }

  /**
   * Set the potential and recompute eigenstates.
   */
  setPotential(type: PotentialType, params?: Record<string, number>): void {
    this.potential = createPotential(type, this.x, params)
    this.buildSolver()
  }

  /**
   * Compute energy eigenstates.
   */
  computeEigenstates(numStates = 5): void {
    this.eigenstates = findEigenstates(this.potential.values, this.dx, numStates)
  }

  /**
   * Initialize the wavefunction from a configuration.
   */
  setInitialState(config: InitialStateConfig): void {
    this.time = 0

    switch (config.type) {
      case 'ground':
      case 'eigenstate': {
        const n = config.type === 'ground' ? 0 : config.n
        if (this.eigenstates.length <= n) {
          this.computeEigenstates(n + 1)
        }
        const es = this.eigenstates[n]
        if (es) {
          for (let j = 0; j < this.N; j++) {
            this.psiRe[j] = es.wavefunction[j]!
            this.psiIm[j] = 0
          }
        }
        break
      }

      case 'gaussian': {
        const { center, width, momentum } = config
        let norm = 0
        for (let j = 0; j < this.N; j++) {
          const xj = this.x[j]!
          const envelope = Math.exp(-((xj - center) ** 2) / (2 * width * width))
          this.psiRe[j] = envelope * Math.cos(momentum * xj)
          this.psiIm[j] = envelope * Math.sin(momentum * xj)
          norm += (this.psiRe[j]! ** 2 + this.psiIm[j]! ** 2) * this.dx
        }
        norm = Math.sqrt(norm)
        if (norm > 1e-15) {
          for (let j = 0; j < this.N; j++) {
            this.psiRe[j] = this.psiRe[j]! / norm
            this.psiIm[j] = this.psiIm[j]! / norm
          }
        }
        // Enforce boundary conditions
        this.psiRe[0] = 0; this.psiIm[0] = 0
        this.psiRe[this.N - 1] = 0; this.psiIm[this.N - 1] = 0
        break
      }

      case 'superposition': {
        if (this.eigenstates.length === 0) {
          this.computeEigenstates(5)
        }
        this.psiRe.fill(0)
        this.psiIm.fill(0)
        for (const coeff of config.coefficients) {
          const es = this.eigenstates[coeff.eigenstateIndex]
          if (!es) continue
          const cRe = coeff.amplitude.re
          const cIm = coeff.amplitude.im
          for (let j = 0; j < this.N; j++) {
            const phi = es.wavefunction[j]!
            this.psiRe[j] = this.psiRe[j]! + cRe * phi
            this.psiIm[j] = this.psiIm[j]! + cIm * phi
          }
        }
        // Normalize
        let norm = 0
        for (let j = 0; j < this.N; j++) {
          norm += (this.psiRe[j]! ** 2 + this.psiIm[j]! ** 2) * this.dx
        }
        norm = Math.sqrt(norm)
        if (norm > 1e-15) {
          for (let j = 0; j < this.N; j++) {
            this.psiRe[j] = this.psiRe[j]! / norm
            this.psiIm[j] = this.psiIm[j]! / norm
          }
        }
        break
      }

      case 'custom': {
        const wf = config.wavefunction
        for (let j = 0; j < this.N; j++) {
          this.psiRe[j] = wf.psiRe[j] ?? 0
          this.psiIm[j] = wf.psiIm[j] ?? 0
        }
        break
      }
    }
  }

  /**
   * Evolve the wavefunction by numSteps time steps.
   */
  step(numSteps = 1): void {
    if (!this.solver) return
    this.solver.evolve(this.psiRe, this.psiIm, numSteps)
    this.time += numSteps * this.dt
  }

  /**
   * Get the current wavefunction.
   */
  getWavefunction(): Wavefunction {
    return {
      N: this.N,
      xMin: this.xMin,
      xMax: this.xMax,
      dx: this.dx,
      x: this.x,
      psiRe: this.psiRe,
      psiIm: this.psiIm,
    }
  }

  /**
   * Compute current observables.
   */
  getObservables(): Observables {
    let norm = 0
    let expectX = 0
    let expectP_re = 0 // <p> = -i integral psi* dpsi/dx dx

    for (let j = 0; j < this.N; j++) {
      const prob = this.psiRe[j]! ** 2 + this.psiIm[j]! ** 2
      norm += prob * this.dx
      expectX += this.x[j]! * prob * this.dx
    }

    // <p> via finite differences: <p> = -i * integral psi* * dpsi/dx * dx
    for (let j = 1; j < this.N - 1; j++) {
      // dpsi/dx ~ (psi[j+1] - psi[j-1]) / (2*dx)
      const dRe = (this.psiRe[j + 1]! - this.psiRe[j - 1]!) / (2 * this.dx)
      const dIm = (this.psiIm[j + 1]! - this.psiIm[j - 1]!) / (2 * this.dx)

      // psi* * dpsi/dx = (re - i*im)(dRe + i*dIm) = (re*dRe + im*dIm) + i(re*dIm - im*dRe)
      // -i * (psi* * dpsi/dx) has real part = (re*dIm - im*dRe)
      expectP_re += (this.psiRe[j]! * dIm - this.psiIm[j]! * dRe) * this.dx
    }

    // <E> ~ <p²/2> + <V>  (with m=1/2, so T = p²)
    // Actually with ℏ=1, m=1/2: H = -d²/dx² + V(x)
    // <H> = integral psi* * H * psi dx
    let expectE = 0
    for (let j = 1; j < this.N - 1; j++) {
      // -d²psi/dx² ~ -(psi[j+1] - 2*psi[j] + psi[j-1]) / dx²
      const lapRe = -(this.psiRe[j + 1]! - 2 * this.psiRe[j]! + this.psiRe[j - 1]!) / (this.dx * this.dx)
      const lapIm = -(this.psiIm[j + 1]! - 2 * this.psiIm[j]! + this.psiIm[j - 1]!) / (this.dx * this.dx)

      // H*psi = lapRe + V*psiRe + i*(lapIm + V*psiIm)
      const HpsiRe = lapRe + this.potential.values[j]! * this.psiRe[j]!
      const HpsiIm = lapIm + this.potential.values[j]! * this.psiIm[j]!

      // <H> = Re(psi* . H psi)
      expectE += (this.psiRe[j]! * HpsiRe + this.psiIm[j]! * HpsiIm) * this.dx
    }

    return {
      expectationX: expectX,
      expectationP: expectP_re,
      expectationE: expectE,
      norm,
      time: this.time,
    }
  }

  /** Reset time to 0 and re-initialize state. */
  reset(config?: InitialStateConfig): void {
    this.time = 0
    if (config) {
      this.setInitialState(config)
    }
  }
}
