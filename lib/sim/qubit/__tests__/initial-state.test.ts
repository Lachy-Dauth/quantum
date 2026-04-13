import { describe, it, expect } from 'vitest'
import { parseInitialState } from '../initial-state'
import {
  STATE_ZERO, STATE_ONE, STATE_PLUS, STATE_MINUS,
  STATE_PLUS_I, STATE_MINUS_I,
  BELL_PHI_PLUS, BELL_PHI_MINUS, BELL_PSI_PLUS, BELL_PSI_MINUS,
  tensorProduct, basisState,
} from '../../core/vector'

const eps = 1e-10

function expectStateClose(a: { dim: number; real: Float64Array; imag: Float64Array },
                          b: { dim: number; real: Float64Array; imag: Float64Array }) {
  expect(a.dim).toBe(b.dim)
  for (let i = 0; i < a.dim; i++) {
    expect(a.real[i]).toBeCloseTo(b.real[i]!, eps)
    expect(a.imag[i]).toBeCloseTo(b.imag[i]!, eps)
  }
}

describe('parseInitialState', () => {
  describe('ket strings', () => {
    it('parses |0> for 1 qubit', () => {
      const s = parseInitialState('|0>', 1)
      expectStateClose(s, STATE_ZERO)
    })

    it('parses |1> for 1 qubit', () => {
      const s = parseInitialState('|1>', 1)
      expectStateClose(s, STATE_ONE)
    })

    it('parses |+> for 1 qubit', () => {
      const s = parseInitialState('|+>', 1)
      expectStateClose(s, STATE_PLUS)
    })

    it('parses |-> for 1 qubit', () => {
      const s = parseInitialState('|->', 1)
      expectStateClose(s, STATE_MINUS)
    })

    it('parses |00> for 2 qubits', () => {
      const s = parseInitialState('|00>', 2)
      const expected = tensorProduct(STATE_ZERO, STATE_ZERO)
      expectStateClose(s, expected)
    })

    it('parses |+0> for 2 qubits', () => {
      const s = parseInitialState('|+0>', 2)
      const expected = tensorProduct(STATE_PLUS, STATE_ZERO)
      expectStateClose(s, expected)
    })

    it('parses |01> for 2 qubits', () => {
      const s = parseInitialState('|01>', 2)
      const expected = tensorProduct(STATE_ZERO, STATE_ONE)
      expectStateClose(s, expected)
    })

    it('parses |+-> for 2 qubits', () => {
      const s = parseInitialState('|+->', 2)
      const expected = tensorProduct(STATE_PLUS, STATE_MINUS)
      expectStateClose(s, expected)
    })

    it('parses |+i> for 1 qubit', () => {
      const s = parseInitialState('|+i>', 1)
      expectStateClose(s, STATE_PLUS_I)
    })

    it('parses |-i> for 1 qubit', () => {
      const s = parseInitialState('|-i>', 1)
      expectStateClose(s, STATE_MINUS_I)
    })

    it('parses |+i-i> for 2 qubits', () => {
      const s = parseInitialState('|+i-i>', 2)
      const expected = tensorProduct(STATE_PLUS_I, STATE_MINUS_I)
      expectStateClose(s, expected)
    })

    it('parses |000> for 3 qubits', () => {
      const s = parseInitialState('|000>', 3)
      const expected = basisState(8, 0)
      expectStateClose(s, expected)
    })
  })

  describe('named states', () => {
    it('parses bell_phi_plus', () => {
      const s = parseInitialState('bell_phi_plus', 2)
      expectStateClose(s, BELL_PHI_PLUS)
    })

    it('parses bell_phi_minus', () => {
      const s = parseInitialState('bell_phi_minus', 2)
      expectStateClose(s, BELL_PHI_MINUS)
    })

    it('parses bell_psi_plus', () => {
      const s = parseInitialState('bell_psi_plus', 2)
      expectStateClose(s, BELL_PSI_PLUS)
    })

    it('parses bell_psi_minus', () => {
      const s = parseInitialState('bell_psi_minus', 2)
      expectStateClose(s, BELL_PSI_MINUS)
    })

    it('parses ghz_3', () => {
      const s = parseInitialState('ghz_3', 3)
      // GHZ state: (|000> + |111>) / sqrt(2)
      const sqrt2 = Math.SQRT1_2
      expect(s.dim).toBe(8)
      expect(s.real[0]).toBeCloseTo(sqrt2, eps)
      expect(s.real[7]).toBeCloseTo(sqrt2, eps)
      // All others near zero
      for (let i = 1; i < 7; i++) {
        expect(Math.abs(s.real[i]!)).toBeLessThan(1e-10)
      }
    })

    it('parses ghz_4', () => {
      const s = parseInitialState('ghz_4', 4)
      const sqrt2 = Math.SQRT1_2
      expect(s.dim).toBe(16)
      expect(s.real[0]).toBeCloseTo(sqrt2, eps)
      expect(s.real[15]).toBeCloseTo(sqrt2, eps)
    })
  })

  describe('raw StateVector', () => {
    it('passes through a valid StateVector', () => {
      const sv = basisState(4, 2)
      const result = parseInitialState(sv, 2)
      expect(result).toBe(sv)
    })

    it('throws on dimension mismatch', () => {
      const sv = basisState(4, 0) // 2-qubit
      expect(() => parseInitialState(sv, 3)).toThrow('dimension')
    })
  })

  describe('error cases', () => {
    it('throws on empty ket string', () => {
      expect(() => parseInitialState('|>', 1)).toThrow('Empty ket')
    })

    it('throws on unknown character in ket', () => {
      expect(() => parseInitialState('|a>', 1)).toThrow('Unknown qubit state')
    })

    it('throws on qubit count mismatch', () => {
      expect(() => parseInitialState('|00>', 3)).toThrow('qubits expected')
    })

    it('throws on bell state with wrong qubit count', () => {
      expect(() => parseInitialState('bell_phi_plus', 3)).toThrow('qubits expected')
    })

    it('throws on ghz with wrong qubit count', () => {
      expect(() => parseInitialState('ghz_3', 4)).toThrow('does not match')
    })

    it('throws on unparseable string', () => {
      expect(() => parseInitialState('foobar', 2)).toThrow('Cannot parse')
    })
  })
})
