import { describe, it, expect } from 'vitest'
import { getGateInfo, resolveGateMatrix, getGatesByCategory } from '../gate-registry'
import type { Gate } from '../types'
import {
  PAULI_X, PAULI_Y, PAULI_Z, PAULI_I,
  GATE_H, GATE_S, GATE_T, GATE_S_DAG, GATE_T_DAG,
  GATE_CNOT, GATE_CZ, GATE_SWAP, GATE_TOFFOLI,
  gateRx, gateRy, gateRz,
} from '../../core/gates'

describe('getGateInfo', () => {
  it('returns correct info for single-qubit gates', () => {
    expect(getGateInfo('X').matrix).toBe(PAULI_X)
    expect(getGateInfo('Y').matrix).toBe(PAULI_Y)
    expect(getGateInfo('Z').matrix).toBe(PAULI_Z)
    expect(getGateInfo('I').matrix).toBe(PAULI_I)
    expect(getGateInfo('H').matrix).toBe(GATE_H)
    expect(getGateInfo('S').matrix).toBe(GATE_S)
    expect(getGateInfo('T').matrix).toBe(GATE_T)
    expect(getGateInfo('S_DAG').matrix).toBe(GATE_S_DAG)
    expect(getGateInfo('T_DAG').matrix).toBe(GATE_T_DAG)
  })

  it('returns correct info for multi-qubit gates', () => {
    expect(getGateInfo('CNOT').matrix).toBe(GATE_CNOT)
    expect(getGateInfo('CNOT').numQubits).toBe(2)
    expect(getGateInfo('CZ').matrix).toBe(GATE_CZ)
    expect(getGateInfo('SWAP').matrix).toBe(GATE_SWAP)
    expect(getGateInfo('TOFFOLI').matrix).toBe(GATE_TOFFOLI)
    expect(getGateInfo('TOFFOLI').numQubits).toBe(3)
  })

  it('marks parameterised gates correctly', () => {
    expect(getGateInfo('RX').parameterized).toBe(true)
    expect(getGateInfo('RY').parameterized).toBe(true)
    expect(getGateInfo('RZ').parameterized).toBe(true)
    expect(getGateInfo('PHASE').parameterized).toBe(true)
    expect(getGateInfo('U').parameterized).toBe(true)
    expect(getGateInfo('H').parameterized).toBe(false)
  })

  it('throws for unknown gate type', () => {
    expect(() => getGateInfo('UNKNOWN' as any)).toThrow('Unknown gate type')
  })

  it('categorises gates correctly', () => {
    expect(getGateInfo('H').category).toBe('single')
    expect(getGateInfo('RX').category).toBe('parameterized')
    expect(getGateInfo('CNOT').category).toBe('multi')
    expect(getGateInfo('MEASURE').category).toBe('measurement')
  })
})

describe('resolveGateMatrix', () => {
  function makeGate(type: string, params?: Gate['params']): Gate {
    return { id: 'test', type: type as any, targets: [0], column: 0, params }
  }

  it('resolves static gates directly', () => {
    expect(resolveGateMatrix(makeGate('H'))).toBe(GATE_H)
    expect(resolveGateMatrix(makeGate('X'))).toBe(PAULI_X)
    expect(resolveGateMatrix(makeGate('CNOT'))).toBe(GATE_CNOT)
  })

  it('resolves Rx gate with theta', () => {
    const m = resolveGateMatrix(makeGate('RX', { theta: Math.PI / 2 }))
    const expected = gateRx(Math.PI / 2)
    expect(m).not.toBeNull()
    expect(m!.real[0]).toBeCloseTo(expected.real[0]!, 10)
  })

  it('resolves Ry gate with theta', () => {
    const m = resolveGateMatrix(makeGate('RY', { theta: Math.PI }))
    const expected = gateRy(Math.PI)
    expect(m).not.toBeNull()
    expect(m!.real[0]).toBeCloseTo(expected.real[0]!, 10)
  })

  it('resolves Rz gate with theta', () => {
    const m = resolveGateMatrix(makeGate('RZ', { theta: Math.PI / 4 }))
    const expected = gateRz(Math.PI / 4)
    expect(m).not.toBeNull()
    expect(m!.real[0]).toBeCloseTo(expected.real[0]!, 10)
  })

  it('defaults params to 0 when not provided', () => {
    const m = resolveGateMatrix(makeGate('RX'))
    const expected = gateRx(0) // Rx(0) = I
    expect(m).not.toBeNull()
    expect(m!.real[0]).toBeCloseTo(expected.real[0]!, 10)
  })

  it('returns null for MEASURE', () => {
    expect(resolveGateMatrix(makeGate('MEASURE'))).toBeNull()
  })

  it('returns null for BARRIER', () => {
    expect(resolveGateMatrix(makeGate('BARRIER'))).toBeNull()
  })
})

describe('getGatesByCategory', () => {
  it('returns all categories', () => {
    const cats = getGatesByCategory()
    expect(cats.single).toContain('H')
    expect(cats.single).toContain('X')
    expect(cats.parameterized).toContain('RX')
    expect(cats.multi).toContain('CNOT')
    expect(cats.multi).toContain('TOFFOLI')
    expect(cats.measurement).toContain('MEASURE')
  })
})
