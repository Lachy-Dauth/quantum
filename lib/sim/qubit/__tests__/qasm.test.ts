import { describe, it, expect } from 'vitest'
import { toQASM, fromQASM } from '../qasm'
import { CircuitSimulator } from '../circuit-simulator'
import { gate } from './helpers'

describe('toQASM', () => {
  it('exports empty circuit', () => {
    const sim = new CircuitSimulator(2)
    const qasm = toQASM(sim.circuit)
    expect(qasm).toContain('OPENQASM 2.0;')
    expect(qasm).toContain('qreg q[2];')
    expect(qasm).toContain('creg c[2];')
  })

  it('exports single-qubit gates', () => {
    const sim = new CircuitSimulator(1)
    sim.addGate(gate('H', [0], 0))
    sim.addGate(gate('X', [0], 1))
    const qasm = toQASM(sim.circuit)
    expect(qasm).toContain('h q[0];')
    expect(qasm).toContain('x q[0];')
  })

  it('exports CNOT', () => {
    const sim = new CircuitSimulator(2)
    sim.addGate(gate('CNOT', [0, 1], 0))
    const qasm = toQASM(sim.circuit)
    expect(qasm).toContain('cx q[0], q[1];')
  })

  it('exports parameterised gates', () => {
    const sim = new CircuitSimulator(1)
    sim.addGate(gate('RX', [0], 0, { theta: 1.5707 }))
    const qasm = toQASM(sim.circuit)
    expect(qasm).toContain('rx(1.5707) q[0];')
  })

  it('exports measurement', () => {
    const sim = new CircuitSimulator(2)
    sim.addGate(gate('MEASURE', [0], 0))
    sim.addGate(gate('MEASURE', [1], 0))
    const qasm = toQASM(sim.circuit)
    expect(qasm).toContain('measure q[0] -> c[0];')
    expect(qasm).toContain('measure q[1] -> c[1];')
  })

  it('exports S†, T†', () => {
    const sim = new CircuitSimulator(1)
    sim.addGate(gate('S_DAG', [0], 0))
    sim.addGate(gate('T_DAG', [0], 1))
    const qasm = toQASM(sim.circuit)
    expect(qasm).toContain('sdg q[0];')
    expect(qasm).toContain('tdg q[0];')
  })
})

describe('fromQASM', () => {
  it('parses qubit count', () => {
    const result = fromQASM('OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[3];\ncreg c[3];\n')
    expect(result.numQubits).toBe(3)
  })

  it('parses single-qubit gates', () => {
    const qasm = `OPENQASM 2.0;
include "qelib1.inc";
qreg q[1];
creg c[1];
h q[0];
x q[0];
`
    const result = fromQASM(qasm)
    expect(result.gates.length).toBe(2)
    expect(result.gates[0]!.type).toBe('H')
    expect(result.gates[1]!.type).toBe('X')
  })

  it('parses CNOT', () => {
    const qasm = `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
cx q[0], q[1];
`
    const result = fromQASM(qasm)
    expect(result.gates.length).toBe(1)
    expect(result.gates[0]!.type).toBe('CNOT')
    expect(result.gates[0]!.targets).toEqual([0, 1])
  })

  it('parses parameterised gates', () => {
    const qasm = `OPENQASM 2.0;
include "qelib1.inc";
qreg q[1];
creg c[1];
rx(1.5707) q[0];
`
    const result = fromQASM(qasm)
    expect(result.gates.length).toBe(1)
    expect(result.gates[0]!.type).toBe('RX')
    expect(result.gates[0]!.params?.theta).toBeCloseTo(1.5707, 4)
  })

  it('parses measurement', () => {
    const qasm = `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
measure q[0] -> c[0];
`
    const result = fromQASM(qasm)
    expect(result.gates.length).toBe(1)
    expect(result.gates[0]!.type).toBe('MEASURE')
    expect(result.gates[0]!.targets).toEqual([0])
  })

  it('barriers advance columns', () => {
    const qasm = `OPENQASM 2.0;
include "qelib1.inc";
qreg q[1];
creg c[1];
h q[0];
barrier q;
x q[0];
`
    const result = fromQASM(qasm)
    expect(result.gates.length).toBe(2)
    expect(result.gates[0]!.column).toBe(0)
    expect(result.gates[1]!.column).toBe(1)
  })
})

describe('round-trip', () => {
  it('export then import preserves circuit structure', () => {
    const sim = new CircuitSimulator(2)
    sim.addGate(gate('H', [0], 0))
    sim.addGate(gate('CNOT', [0, 1], 1))
    sim.addGate(gate('MEASURE', [0], 2))
    sim.addGate(gate('MEASURE', [1], 2))

    const qasm = toQASM(sim.circuit)
    const parsed = fromQASM(qasm)

    expect(parsed.numQubits).toBe(2)
    // Should have H, CNOT, and 2 MEASURE gates
    const types = parsed.gates.map(g => g.type)
    expect(types).toContain('H')
    expect(types).toContain('CNOT')
    expect(types.filter(t => t === 'MEASURE').length).toBe(2)
  })
})
