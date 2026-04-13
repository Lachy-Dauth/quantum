import { describe, it, expect } from 'vitest'
import { SchrodingerSimulator } from '../schrodinger-simulator'

describe('SchrodingerSimulator', () => {
  describe('constructor', () => {
    it('creates with default params', () => {
      const sim = new SchrodingerSimulator()
      expect(sim.N).toBe(512)
      expect(sim.xMin).toBe(-10)
      expect(sim.xMax).toBe(10)
      expect(sim.x.length).toBe(512)
      expect(sim.time).toBe(0)
    })

    it('creates with custom params', () => {
      const sim = new SchrodingerSimulator(256, [-5, 5], 'harmonic', { omega: 2 })
      expect(sim.N).toBe(256)
      expect(sim.xMin).toBe(-5)
      expect(sim.xMax).toBe(5)
      expect(sim.potential.type).toBe('harmonic')
    })

    it('auto-computes dt from dx', () => {
      const sim = new SchrodingerSimulator(256, [-5, 5])
      expect(sim.dt).toBeCloseTo(0.5 * sim.dx * sim.dx)
    })
  })

  describe('setPotential', () => {
    it('changes the potential', () => {
      const sim = new SchrodingerSimulator(256, [-5, 5], 'infinite_well')
      expect(sim.potential.type).toBe('infinite_well')

      sim.setPotential('harmonic', { omega: 1 })
      expect(sim.potential.type).toBe('harmonic')
      // V should be nonzero away from origin
      const mid = Math.floor(sim.N / 2)
      expect(sim.potential.values[0]).toBeGreaterThan(0) // x=-5 has V>0
      expect(sim.potential.values[mid]).toBeCloseTo(0, 1) // x≈0 has V≈0
    })
  })

  describe('computeEigenstates', () => {
    it('computes eigenstates and stores them', () => {
      const sim = new SchrodingerSimulator(256, [-5, 5], 'infinite_well')
      expect(sim.eigenstates.length).toBe(0)

      sim.computeEigenstates(3)
      expect(sim.eigenstates.length).toBe(3)
      expect(sim.eigenstates[0]!.energy).toBeLessThan(sim.eigenstates[1]!.energy)
    })
  })

  describe('setInitialState', () => {
    it('sets ground state', () => {
      const sim = new SchrodingerSimulator(256, [-5, 5], 'infinite_well')
      sim.setInitialState({ type: 'ground' })

      // Should have computed eigenstates and loaded ground state
      expect(sim.eigenstates.length).toBeGreaterThan(0)
      expect(sim.time).toBe(0)

      // Wavefunction should be normalized
      let norm = 0
      for (let j = 0; j < sim.N; j++) {
        norm += (sim.psiRe[j]! ** 2 + sim.psiIm[j]! ** 2) * sim.dx
      }
      expect(norm).toBeCloseTo(1, 3)
    })

    it('sets n-th eigenstate', () => {
      const sim = new SchrodingerSimulator(256, [-5, 5], 'infinite_well')
      sim.setInitialState({ type: 'eigenstate', n: 2 })

      expect(sim.eigenstates.length).toBeGreaterThan(2)
      // Imaginary part should be zero for eigenstate
      for (let j = 0; j < sim.N; j++) {
        expect(sim.psiIm[j]).toBe(0)
      }
    })

    it('sets gaussian wave packet', () => {
      const sim = new SchrodingerSimulator(256, [-5, 5], 'infinite_well')
      sim.setInitialState({ type: 'gaussian', center: 0, width: 0.5, momentum: 3 })

      // Should be normalized
      let norm = 0
      for (let j = 0; j < sim.N; j++) {
        norm += (sim.psiRe[j]! ** 2 + sim.psiIm[j]! ** 2) * sim.dx
      }
      expect(norm).toBeCloseTo(1, 3)

      // Boundaries should be zero
      expect(sim.psiRe[0]).toBe(0)
      expect(sim.psiIm[0]).toBe(0)
      expect(sim.psiRe[sim.N - 1]).toBe(0)
      expect(sim.psiIm[sim.N - 1]).toBe(0)
    })

    it('sets superposition state', () => {
      const sim = new SchrodingerSimulator(256, [-5, 5], 'infinite_well')
      sim.computeEigenstates(3)
      sim.setInitialState({
        type: 'superposition',
        coefficients: [
          { eigenstateIndex: 0, amplitude: { re: 1, im: 0 } },
          { eigenstateIndex: 1, amplitude: { re: 1, im: 0 } },
        ],
      })

      // Should be normalized
      let norm = 0
      for (let j = 0; j < sim.N; j++) {
        norm += (sim.psiRe[j]! ** 2 + sim.psiIm[j]! ** 2) * sim.dx
      }
      expect(norm).toBeCloseTo(1, 3)
    })

    it('sets custom wavefunction', () => {
      const sim = new SchrodingerSimulator(64, [-3, 3], 'infinite_well')
      const customRe = new Float64Array(64)
      const customIm = new Float64Array(64)
      for (let j = 0; j < 64; j++) {
        customRe[j] = j === 32 ? 1 : 0
      }

      sim.setInitialState({
        type: 'custom',
        wavefunction: {
          N: 64,
          xMin: -3,
          xMax: 3,
          dx: sim.dx,
          x: sim.x,
          psiRe: customRe,
          psiIm: customIm,
        },
      })

      expect(sim.psiRe[32]).toBe(1)
      expect(sim.psiRe[0]).toBe(0)
    })

    it('resets time to zero', () => {
      const sim = new SchrodingerSimulator(128, [-5, 5])
      sim.setInitialState({ type: 'gaussian', center: 0, width: 1, momentum: 0 })
      sim.step(10)
      expect(sim.time).toBeGreaterThan(0)

      sim.setInitialState({ type: 'gaussian', center: 0, width: 1, momentum: 0 })
      expect(sim.time).toBe(0)
    })
  })

  describe('step', () => {
    it('advances time', () => {
      const sim = new SchrodingerSimulator(128, [-5, 5])
      sim.setInitialState({ type: 'gaussian', center: 0, width: 1, momentum: 0 })
      sim.step(5)
      expect(sim.time).toBeCloseTo(5 * sim.dt)
    })

    it('preserves norm', () => {
      const sim = new SchrodingerSimulator(256, [-5, 5])
      sim.setInitialState({ type: 'gaussian', center: 0, width: 0.5, momentum: 3 })

      const obs0 = sim.getObservables()
      sim.step(100)
      const obs1 = sim.getObservables()

      expect(obs1.norm).toBeCloseTo(obs0.norm, 4)
    })
  })

  describe('getWavefunction', () => {
    it('returns wavefunction data', () => {
      const sim = new SchrodingerSimulator(128, [-5, 5])
      sim.setInitialState({ type: 'ground' })
      const wf = sim.getWavefunction()

      expect(wf.N).toBe(128)
      expect(wf.xMin).toBe(-5)
      expect(wf.xMax).toBe(5)
      expect(wf.psiRe.length).toBe(128)
      expect(wf.psiIm.length).toBe(128)
      expect(wf.x.length).toBe(128)
    })
  })

  describe('getObservables', () => {
    it('computes expectation values for ground state', () => {
      const sim = new SchrodingerSimulator(256, [-5, 5], 'infinite_well')
      sim.setInitialState({ type: 'ground' })
      const obs = sim.getObservables()

      expect(obs.norm).toBeCloseTo(1, 3)
      expect(obs.expectationX).toBeCloseTo(0, 2) // symmetric about origin
      expect(obs.expectationP).toBeCloseTo(0, 2) // stationary state
      expect(obs.time).toBe(0)
    })

    it('computes expectation values for gaussian with momentum', () => {
      const sim = new SchrodingerSimulator(256, [-5, 5], 'infinite_well')
      const center = 1.5
      const momentum = 5
      sim.setInitialState({ type: 'gaussian', center, width: 0.3, momentum })
      const obs = sim.getObservables()

      expect(obs.norm).toBeCloseTo(1, 3)
      expect(obs.expectationX).toBeCloseTo(center, 1)
      // <p> should be approximately equal to the momentum
      expect(obs.expectationP).toBeCloseTo(momentum, 0)
    })

    it('energy is close to eigenvalue for eigenstate', () => {
      const sim = new SchrodingerSimulator(256, [-5, 5], 'infinite_well')
      sim.computeEigenstates(3)
      sim.setInitialState({ type: 'eigenstate', n: 1 })
      const obs = sim.getObservables()

      expect(obs.expectationE).toBeCloseTo(sim.eigenstates[1]!.energy, 1)
    })

    it('updates time after stepping', () => {
      const sim = new SchrodingerSimulator(128, [-5, 5])
      sim.setInitialState({ type: 'gaussian', center: 0, width: 1, momentum: 0 })
      sim.step(10)
      const obs = sim.getObservables()
      expect(obs.time).toBeCloseTo(10 * sim.dt)
    })
  })

  describe('reset', () => {
    it('resets time to zero', () => {
      const sim = new SchrodingerSimulator(128, [-5, 5])
      sim.setInitialState({ type: 'gaussian', center: 0, width: 1, momentum: 0 })
      sim.step(20)
      expect(sim.time).toBeGreaterThan(0)

      sim.reset()
      expect(sim.time).toBe(0)
    })

    it('resets with a new config', () => {
      const sim = new SchrodingerSimulator(128, [-5, 5])
      sim.setInitialState({ type: 'gaussian', center: 0, width: 1, momentum: 0 })
      sim.step(20)

      sim.reset({ type: 'ground' })
      expect(sim.time).toBe(0)
      expect(sim.eigenstates.length).toBeGreaterThan(0)
    })
  })
})
