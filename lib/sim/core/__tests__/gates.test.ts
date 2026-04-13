import { describe, it } from 'vitest'
import {
  PAULI_I, PAULI_X, PAULI_Y, PAULI_Z,
  GATE_H, GATE_S, GATE_T, GATE_S_DAG, GATE_T_DAG,
  GATE_CNOT, GATE_CZ, GATE_SWAP, GATE_TOFFOLI,
  gateRx, gateRy, gateRz, gateU, gatePhase,
} from '../gates'
import { matMul, matIdentity, adjoint, mget, matFromArray } from '../matrix'
import { complex } from '../complex'
import { expectMatrix, expectComplex } from './helpers'

const I2 = matIdentity(2)

describe('Pauli gates', () => {
  it('X^2 = I', () => {
    expectMatrix(matMul(PAULI_X, PAULI_X), I2)
  })

  it('Y^2 = I', () => {
    expectMatrix(matMul(PAULI_Y, PAULI_Y), I2)
  })

  it('Z^2 = I', () => {
    expectMatrix(matMul(PAULI_Z, PAULI_Z), I2)
  })

  it('XY = iZ', () => {
    const xy = matMul(PAULI_X, PAULI_Y)
    const iZ = matFromArray(2, 2, [
      [complex(0, 1), complex(0)],
      [complex(0), complex(0, -1)],
    ])
    expectMatrix(xy, iZ)
  })

  it('PAULI_I is identity', () => {
    expectMatrix(PAULI_I, I2)
  })
})

describe('standard gates', () => {
  it('H^2 = I', () => {
    expectMatrix(matMul(GATE_H, GATE_H), I2)
  })

  it('S^2 = Z', () => {
    expectMatrix(matMul(GATE_S, GATE_S), PAULI_Z)
  })

  it('T^2 = S', () => {
    expectMatrix(matMul(GATE_T, GATE_T), GATE_S)
  })

  it('S * S_DAG = I', () => {
    expectMatrix(matMul(GATE_S, GATE_S_DAG), I2)
  })

  it('T * T_DAG = I', () => {
    expectMatrix(matMul(GATE_T, GATE_T_DAG), I2)
  })

  it('adjoint(S) = S_DAG', () => {
    expectMatrix(adjoint(GATE_S), GATE_S_DAG)
  })

  it('adjoint(T) = T_DAG', () => {
    expectMatrix(adjoint(GATE_T), GATE_T_DAG)
  })
})

describe('multi-qubit gates', () => {
  it('CNOT has correct structure', () => {
    expectComplex(mget(GATE_CNOT, 0, 0), complex(1))
    expectComplex(mget(GATE_CNOT, 1, 1), complex(1))
    expectComplex(mget(GATE_CNOT, 2, 3), complex(1))
    expectComplex(mget(GATE_CNOT, 3, 2), complex(1))
    expectComplex(mget(GATE_CNOT, 2, 2), complex(0))
    expectComplex(mget(GATE_CNOT, 3, 3), complex(0))
  })

  it('CNOT^2 = I', () => {
    expectMatrix(matMul(GATE_CNOT, GATE_CNOT), matIdentity(4))
  })

  it('SWAP^2 = I', () => {
    expectMatrix(matMul(GATE_SWAP, GATE_SWAP), matIdentity(4))
  })

  it('CZ is diagonal', () => {
    expectComplex(mget(GATE_CZ, 0, 0), complex(1))
    expectComplex(mget(GATE_CZ, 1, 1), complex(1))
    expectComplex(mget(GATE_CZ, 2, 2), complex(1))
    expectComplex(mget(GATE_CZ, 3, 3), complex(-1))
  })

  it('Toffoli has correct structure (8x8)', () => {
    // Identity everywhere except rows 6,7 are swapped
    const I8 = matIdentity(8)
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i === 6 && j === 7) || (i === 7 && j === 6)) {
          expectComplex(mget(GATE_TOFFOLI, i, j), complex(1))
        } else if (i === 6 && j === 6) {
          expectComplex(mget(GATE_TOFFOLI, i, j), complex(0))
        } else if (i === 7 && j === 7) {
          expectComplex(mget(GATE_TOFFOLI, i, j), complex(0))
        } else {
          expectComplex(mget(GATE_TOFFOLI, i, j), mget(I8, i, j))
        }
      }
    }
  })
})

describe('parameterised gates', () => {
  it('Rx(0) = I', () => {
    expectMatrix(gateRx(0), I2)
  })

  it('Ry(0) = I', () => {
    expectMatrix(gateRy(0), I2)
  })

  it('Rz(0) = I', () => {
    expectMatrix(gateRz(0), I2)
  })

  it('Rx(pi) produces correct gate', () => {
    const rx = gateRx(Math.PI)
    expectComplex(mget(rx, 0, 0), complex(0), 1e-8)
    expectComplex(mget(rx, 0, 1), complex(0, -1), 1e-8)
    expectComplex(mget(rx, 1, 0), complex(0, -1), 1e-8)
    expectComplex(mget(rx, 1, 1), complex(0), 1e-8)
  })

  it('Ry(pi) produces correct gate', () => {
    const ry = gateRy(Math.PI)
    expectComplex(mget(ry, 0, 0), complex(0), 1e-8)
    expectComplex(mget(ry, 0, 1), complex(-1), 1e-8)
    expectComplex(mget(ry, 1, 0), complex(1), 1e-8)
    expectComplex(mget(ry, 1, 1), complex(0), 1e-8)
  })

  it('gatePhase(pi/2) = S gate', () => {
    expectMatrix(gatePhase(Math.PI / 2), GATE_S, 1e-8)
  })

  it('gatePhase(pi/4) = T gate', () => {
    expectMatrix(gatePhase(Math.PI / 4), GATE_T, 1e-8)
  })

  it('gateU(0, 0, 0) = I', () => {
    expectMatrix(gateU(0, 0, 0), I2, 1e-8)
  })

  it('Rx is unitary: Rx * Rx^dag = I', () => {
    const rx = gateRx(1.234)
    expectMatrix(matMul(rx, adjoint(rx)), I2, 1e-8)
  })

  it('Ry is unitary: Ry * Ry^dag = I', () => {
    const ry = gateRy(2.345)
    expectMatrix(matMul(ry, adjoint(ry)), I2, 1e-8)
  })

  it('Rz is unitary: Rz * Rz^dag = I', () => {
    const rz = gateRz(0.567)
    expectMatrix(matMul(rz, adjoint(rz)), I2, 1e-8)
  })
})
