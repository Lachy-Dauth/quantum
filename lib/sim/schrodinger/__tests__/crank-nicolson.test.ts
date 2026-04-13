import { describe, it, expect } from 'vitest'
import { CrankNicolsonSolver } from '../crank-nicolson'
import { createPotential } from '../potentials'
import { findEigenstates } from '../eigensolver'

function makeGrid(N: number, xMin: number, xMax: number): { x: Float64Array; dx: number } {
  const dx = (xMax - xMin) / (N - 1)
  const x = new Float64Array(N)
  for (let i = 0; i < N; i++) x[i] = xMin + i * dx
  return { x, dx }
}

function computeNorm(psiRe: Float64Array, psiIm: Float64Array, dx: number): number {
  let norm = 0
  for (let j = 0; j < psiRe.length; j++) {
    norm += (psiRe[j]! ** 2 + psiIm[j]! ** 2) * dx
  }
  return norm
}

describe('CrankNicolsonSolver', () => {
  const N = 256
  const { x, dx } = makeGrid(N, -5, 5)

  describe('norm preservation', () => {
    it('preserves norm for gaussian in infinite well', () => {
      const V = createPotential('infinite_well', x).values
      const dt = 0.5 * dx * dx
      const solver = new CrankNicolsonSolver(N, dx, dt, V)

      const psiRe = new Float64Array(N)
      const psiIm = new Float64Array(N)

      // Gaussian wave packet
      let norm0 = 0
      for (let j = 0; j < N; j++) {
        const envelope = Math.exp(-(x[j]! ** 2) / 2)
        psiRe[j] = envelope
        psiIm[j] = 0
        norm0 += envelope * envelope * dx
      }
      // Normalize
      const s = Math.sqrt(norm0)
      for (let j = 0; j < N; j++) psiRe[j] = psiRe[j]! / s
      psiRe[0] = 0; psiRe[N - 1] = 0

      const initialNorm = computeNorm(psiRe, psiIm, dx)

      // Evolve 100 steps
      solver.evolve(psiRe, psiIm, 100)

      const finalNorm = computeNorm(psiRe, psiIm, dx)
      // Crank-Nicolson is unitary, so norm should be preserved to high precision
      expect(finalNorm).toBeCloseTo(initialNorm, 4)
    })

    it('preserves norm for gaussian with momentum in harmonic potential', () => {
      const V = createPotential('harmonic', x, { omega: 1 }).values
      const dt = 0.5 * dx * dx
      const solver = new CrankNicolsonSolver(N, dx, dt, V)

      const psiRe = new Float64Array(N)
      const psiIm = new Float64Array(N)
      const k0 = 3 // momentum

      let norm0 = 0
      for (let j = 0; j < N; j++) {
        const envelope = Math.exp(-((x[j]! + 2) ** 2) / 2)
        psiRe[j] = envelope * Math.cos(k0 * x[j]!)
        psiIm[j] = envelope * Math.sin(k0 * x[j]!)
        norm0 += (psiRe[j]! ** 2 + psiIm[j]! ** 2) * dx
      }
      const s = Math.sqrt(norm0)
      for (let j = 0; j < N; j++) {
        psiRe[j] = psiRe[j]! / s
        psiIm[j] = psiIm[j]! / s
      }
      psiRe[0] = 0; psiIm[0] = 0
      psiRe[N - 1] = 0; psiIm[N - 1] = 0

      const initialNorm = computeNorm(psiRe, psiIm, dx)

      solver.evolve(psiRe, psiIm, 200)

      const finalNorm = computeNorm(psiRe, psiIm, dx)
      expect(finalNorm).toBeCloseTo(initialNorm, 4)
    })
  })

  describe('eigenstate time evolution', () => {
    // Use a finer grid for eigenstate tests so the FD eigenstates are more accurate
    const Nfine = 512
    const { x: xf, dx: dxf } = makeGrid(Nfine, -5, 5)

    it('eigenstate acquires only a phase (prob density unchanged)', () => {
      // Use the analytic ground state sin(π(x-xMin)/L) / sqrt(L/2) which is
      // very close to the true FD eigenstate on a fine grid
      const L = xf[Nfine - 1]! - xf[0]!
      const psiRe = new Float64Array(Nfine)
      const psiIm = new Float64Array(Nfine)
      const prob0 = new Float64Array(Nfine)

      let norm = 0
      for (let j = 0; j < Nfine; j++) {
        psiRe[j] = Math.sin(Math.PI * (xf[j]! - xf[0]!) / L)
        norm += psiRe[j]! ** 2 * dxf
      }
      const s = Math.sqrt(norm)
      for (let j = 0; j < Nfine; j++) {
        psiRe[j] = psiRe[j]! / s
        prob0[j] = psiRe[j]! ** 2
      }
      psiRe[0] = 0; psiRe[Nfine - 1] = 0

      const V = createPotential('infinite_well', xf).values
      const dt = 0.5 * dxf * dxf
      const solver = new CrankNicolsonSolver(Nfine, dxf, dt, V)
      solver.evolve(psiRe, psiIm, 50)

      // Probability density should be nearly unchanged in the bulk.
      // Near boundaries, the analytic vs FD eigenstate difference is larger,
      // so only check points with significant amplitude.
      const peakProb = Math.max(...prob0)
      let maxRelErr = 0
      for (let j = 1; j < Nfine - 1; j++) {
        const prob = psiRe[j]! ** 2 + psiIm[j]! ** 2
        // Only compare where probability is at least 10% of peak
        if (prob0[j]! > 0.1 * peakProb) {
          const relErr = Math.abs(prob / prob0[j]! - 1)
          if (relErr > maxRelErr) maxRelErr = relErr
        }
      }
      expect(maxRelErr).toBeLessThan(0.01)
    })

    it('eigenstate phase evolves as exp(-i*E*t)', () => {
      const V = createPotential('infinite_well', xf).values
      const dt = 0.5 * dxf * dxf
      const states = findEigenstates(V, dxf, 1)
      const es = states[0]!
      const E = es.energy

      const psiRe = new Float64Array(Nfine)
      const psiIm = new Float64Array(Nfine)

      for (let j = 0; j < Nfine; j++) {
        psiRe[j] = es.wavefunction[j]!
        psiIm[j] = 0
      }

      const solver = new CrankNicolsonSolver(Nfine, dxf, dt, V)
      const numSteps = 20
      solver.evolve(psiRe, psiIm, numSteps)

      const t = numSteps * dt
      const expectedPhaseRe = Math.cos(-E * t)
      const expectedPhaseIm = Math.sin(-E * t)

      // Find a point with significant amplitude to check phase
      let maxJ = 0
      let maxAmp = 0
      for (let j = 1; j < Nfine - 1; j++) {
        const amp = Math.abs(es.wavefunction[j]!)
        if (amp > maxAmp) { maxAmp = amp; maxJ = j }
      }

      // psi(t) = exp(-iEt) * psi(0)
      // At the peak: psi(t)/psi(0) should be exp(-iEt)
      const phi0 = es.wavefunction[maxJ]!
      const actualRe = psiRe[maxJ]! / phi0
      const actualIm = psiIm[maxJ]! / phi0

      expect(actualRe).toBeCloseTo(expectedPhaseRe, 1)
      expect(actualIm).toBeCloseTo(expectedPhaseIm, 1)
    })
  })

  describe('boundary conditions', () => {
    it('maintains Dirichlet BCs (psi[0]=psi[N-1]=0)', () => {
      const V = createPotential('infinite_well', x).values
      const dt = 0.5 * dx * dx
      const solver = new CrankNicolsonSolver(N, dx, dt, V)

      const psiRe = new Float64Array(N)
      const psiIm = new Float64Array(N)
      for (let j = 0; j < N; j++) {
        psiRe[j] = Math.exp(-(x[j]! ** 2))
      }
      psiRe[0] = 0; psiRe[N - 1] = 0

      for (let step = 0; step < 50; step++) {
        solver.step(psiRe, psiIm)
        expect(psiRe[0]).toBe(0)
        expect(psiIm[0]).toBe(0)
        expect(psiRe[N - 1]).toBe(0)
        expect(psiIm[N - 1]).toBe(0)
      }
    })
  })

  describe('evolve method', () => {
    it('evolve(n) is equivalent to n calls to step()', () => {
      const V = createPotential('harmonic', x, { omega: 1 }).values
      const dt = 0.5 * dx * dx

      // Prepare same initial state
      const psiRe1 = new Float64Array(N)
      const psiIm1 = new Float64Array(N)
      const psiRe2 = new Float64Array(N)
      const psiIm2 = new Float64Array(N)

      for (let j = 0; j < N; j++) {
        const v = Math.exp(-(x[j]! ** 2))
        psiRe1[j] = v; psiRe2[j] = v
      }
      psiRe1[0] = 0; psiRe1[N - 1] = 0
      psiRe2[0] = 0; psiRe2[N - 1] = 0

      const solver1 = new CrankNicolsonSolver(N, dx, dt, V)
      const solver2 = new CrankNicolsonSolver(N, dx, dt, V)

      const nSteps = 10
      solver1.evolve(psiRe1, psiIm1, nSteps)
      for (let i = 0; i < nSteps; i++) solver2.step(psiRe2, psiIm2)

      for (let j = 0; j < N; j++) {
        expect(psiRe1[j]).toBeCloseTo(psiRe2[j]!, 12)
        expect(psiIm1[j]).toBeCloseTo(psiIm2[j]!, 12)
      }
    })
  })
})
