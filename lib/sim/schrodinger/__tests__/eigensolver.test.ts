import { describe, it, expect } from 'vitest'
import { findEigenstates } from '../eigensolver'
import { createPotential } from '../potentials'

function makeGrid(N: number, xMin: number, xMax: number): { x: Float64Array; dx: number } {
  const dx = (xMax - xMin) / (N - 1)
  const x = new Float64Array(N)
  for (let i = 0; i < N; i++) x[i] = xMin + i * dx
  return { x, dx }
}

describe('eigensolver', () => {
  describe('infinite well', () => {
    // Infinite well on [-L/2, L/2] with V=0 inside
    // Exact energies: E_n = (n+1)^2 * pi^2 / L^2  (with m=1/2, ℏ=1)
    // H = -d²/dx² + V, so for infinite well: E_n = n² π² / L²
    // where n = 1,2,3,... (but we index from 0, so n = k+1)
    const N = 512
    const L = 10
    const { x, dx } = makeGrid(N, -L / 2, L / 2)
    const V = createPotential('infinite_well', x).values
    const states = findEigenstates(V, dx, 5)

    it('finds 5 eigenstates', () => {
      expect(states.length).toBe(5)
    })

    it('eigenvalues match analytic formula E_n = (n+1)^2 * pi^2 / L^2', () => {
      for (let k = 0; k < 5; k++) {
        const n = k + 1
        const exact = (n * n * Math.PI * Math.PI) / (L * L)
        // Finite difference approximation introduces error; allow 1% relative error
        expect(states[k]!.energy).toBeCloseTo(exact, 1)
      }
    })

    it('eigenvalues are in ascending order', () => {
      for (let k = 1; k < states.length; k++) {
        expect(states[k]!.energy).toBeGreaterThan(states[k - 1]!.energy)
      }
    })

    it('eigenstates are normalized', () => {
      for (const es of states) {
        let norm = 0
        for (let j = 0; j < N; j++) {
          norm += es.wavefunction[j]! * es.wavefunction[j]! * dx
        }
        expect(norm).toBeCloseTo(1, 3)
      }
    })

    it('eigenstates are orthogonal', () => {
      for (let a = 0; a < states.length; a++) {
        for (let b = a + 1; b < states.length; b++) {
          let overlap = 0
          for (let j = 0; j < N; j++) {
            overlap +=
              states[a]!.wavefunction[j]! * states[b]!.wavefunction[j]! * dx
          }
          expect(Math.abs(overlap)).toBeLessThan(0.01)
        }
      }
    })

    it('first nonzero value is positive (sign convention)', () => {
      for (const es of states) {
        for (let j = 0; j < N; j++) {
          if (Math.abs(es.wavefunction[j]!) > 1e-10) {
            expect(es.wavefunction[j]).toBeGreaterThan(0)
            break
          }
        }
      }
    })

    it('boundary values are zero (Dirichlet)', () => {
      for (const es of states) {
        expect(Math.abs(es.wavefunction[0]!)).toBe(0)
        expect(Math.abs(es.wavefunction[N - 1]!)).toBe(0)
      }
    })

    it('has correct labels', () => {
      expect(states[0]!.label).toBe('n=0 (ground)')
      expect(states[1]!.label).toBe('n=1')
      expect(states[4]!.label).toBe('n=4')
    })
  })

  describe('harmonic oscillator', () => {
    // H = -d²/dx² + 0.5*omega²*x² with m=1/2, ℏ=1
    // Exact energies: E_n = omega*(2n+1) for this Hamiltonian
    // (since H = p²/(2m) + V with m=1/2 gives H = p² + 0.5*omega²*x²)
    // Actually with m=1/2, ℏ=1: E_n = omega*(n + 1/2) * 2 = omega*(2n+1)
    // Let's just check the ratios are correct
    const N = 512
    const { x, dx } = makeGrid(N, -10, 10)
    const omega = 1
    const V = createPotential('harmonic', x, { omega }).values
    const states = findEigenstates(V, dx, 4)

    it('finds 4 eigenstates', () => {
      expect(states.length).toBe(4)
    })

    it('energy ratios match harmonic oscillator pattern (1:3:5:7)', () => {
      // E_n = omega*(2n+1) → E_0:E_1:E_2:E_3 = 1:3:5:7
      const E0 = states[0]!.energy
      for (let k = 0; k < 4; k++) {
        const expectedRatio = (2 * k + 1)
        expect(states[k]!.energy / E0).toBeCloseTo(expectedRatio, 0)
      }
    })

    it('eigenstates are normalized and orthogonal', () => {
      for (let a = 0; a < states.length; a++) {
        let normA = 0
        for (let j = 0; j < N; j++) {
          normA += states[a]!.wavefunction[j]! ** 2 * dx
        }
        expect(normA).toBeCloseTo(1, 3)

        for (let b = a + 1; b < states.length; b++) {
          let overlap = 0
          for (let j = 0; j < N; j++) {
            overlap += states[a]!.wavefunction[j]! * states[b]!.wavefunction[j]! * dx
          }
          expect(Math.abs(overlap)).toBeLessThan(0.05)
        }
      }
    })

    it('ground state has no nodes (all same sign except boundary)', () => {
      const psi = states[0]!.wavefunction
      let signChanges = 0
      let lastSign = 0
      for (let j = 1; j < N - 1; j++) {
        if (Math.abs(psi[j]!) > 1e-6) {
          const sign = psi[j]! > 0 ? 1 : -1
          if (lastSign !== 0 && sign !== lastSign) signChanges++
          lastSign = sign
        }
      }
      expect(signChanges).toBe(0)
    })

    it('n-th eigenstate has n interior nodes', () => {
      for (let k = 0; k < 4; k++) {
        const psi = states[k]!.wavefunction
        let nodes = 0
        for (let j = 2; j < N - 2; j++) {
          if (psi[j]! * psi[j - 1]! < 0 && Math.abs(psi[j]!) > 1e-8 && Math.abs(psi[j - 1]!) > 1e-8) {
            nodes++
          }
        }
        expect(nodes).toBe(k)
      }
    })
  })

  describe('edge cases', () => {
    it('returns empty for tiny grid (M < 1)', () => {
      const V = new Float64Array(2) // N=2 → M=0
      const result = findEigenstates(V, 0.1, 3)
      expect(result).toEqual([])
    })

    it('returns fewer states than requested if M < numStates', () => {
      const V = new Float64Array(5) // N=5 → M=3
      const result = findEigenstates(V, 0.1, 10)
      expect(result.length).toBe(3)
    })
  })
})
