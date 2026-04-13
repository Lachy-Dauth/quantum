import { describe, it, expect } from 'vitest'
import {
  mget, matIdentity, matFromArray, matAdd, matScale, matMul, matVecMul,
  adjoint, trace, determinant2x2, determinant3x3, kronecker, matExp,
  matInverse2x2,
} from '../matrix'
import { complex } from '../complex'
import { vecFromArray } from '../vector'
import { DimensionMismatchError } from '../types'
import { expectComplex, expectMatrix } from './helpers'

// Convenience: build common matrices
const I2 = matIdentity(2)
const X = matFromArray(2, 2, [
  [complex(0), complex(1)],
  [complex(1), complex(0)],
])
const Y = matFromArray(2, 2, [
  [complex(0), complex(0, -1)],
  [complex(0, 1), complex(0)],
])
const Z = matFromArray(2, 2, [
  [complex(1), complex(0)],
  [complex(0), complex(-1)],
])
const H = matFromArray(2, 2, [
  [complex(Math.SQRT1_2), complex(Math.SQRT1_2)],
  [complex(Math.SQRT1_2), complex(-Math.SQRT1_2)],
])
const S = matFromArray(2, 2, [
  [complex(1), complex(0)],
  [complex(0), complex(0, 1)],
])
const S_DAG = matFromArray(2, 2, [
  [complex(1), complex(0)],
  [complex(0), complex(0, -1)],
])

describe('matrix constructors', () => {
  it('matIdentity creates identity', () => {
    const id = matIdentity(3)
    expect(id.rows).toBe(3)
    expect(id.cols).toBe(3)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const v = mget(id, i, j)
        expectComplex(v, i === j ? complex(1) : complex(0))
      }
    }
  })

  it('matFromArray builds matrix from 2D array', () => {
    const m = matFromArray(2, 2, [
      [complex(1, 2), complex(3, 4)],
      [complex(5, 6), complex(7, 8)],
    ])
    expectComplex(mget(m, 0, 0), complex(1, 2))
    expectComplex(mget(m, 1, 1), complex(7, 8))
  })
})

describe('matrix arithmetic', () => {
  it('matAdd adds element-wise', () => {
    const result = matAdd(I2, I2)
    expectComplex(mget(result, 0, 0), complex(2))
    expectComplex(mget(result, 0, 1), complex(0))
  })

  it('matAdd throws on dimension mismatch', () => {
    expect(() => matAdd(matIdentity(2), matIdentity(3))).toThrow(DimensionMismatchError)
  })

  it('matScale scales by complex', () => {
    const result = matScale(I2, complex(0, 1))
    expectComplex(mget(result, 0, 0), complex(0, 1))
    expectComplex(mget(result, 1, 1), complex(0, 1))
  })
})

describe('matrix multiplication', () => {
  it('I * X = X', () => {
    expectMatrix(matMul(I2, X), X)
  })

  it('X * X = I', () => {
    expectMatrix(matMul(X, X), I2)
  })

  it('H * H = I', () => {
    expectMatrix(matMul(H, H), I2)
  })

  it('matMul throws on dimension mismatch', () => {
    expect(() => matMul(matIdentity(2), matIdentity(3))).toThrow(DimensionMismatchError)
  })
})

describe('matVecMul', () => {
  it('X|0> = |1>', () => {
    const v = vecFromArray([complex(1), complex(0)])
    const result = matVecMul(X, v)
    expect(result.real[0]).toBeCloseTo(0, 12)
    expect(result.real[1]).toBeCloseTo(1, 12)
  })

  it('H|0> = |+>', () => {
    const v = vecFromArray([complex(1), complex(0)])
    const result = matVecMul(H, v)
    expect(result.real[0]).toBeCloseTo(Math.SQRT1_2, 12)
    expect(result.real[1]).toBeCloseTo(Math.SQRT1_2, 12)
  })
})

describe('adjoint', () => {
  it('adjoint(Y) = Y (Hermitian)', () => {
    expectMatrix(adjoint(Y), Y)
  })

  it('adjoint(S) = S_DAG', () => {
    expectMatrix(adjoint(S), S_DAG)
  })
})

describe('trace', () => {
  it('trace(I_2x2) = 2', () => {
    expectComplex(trace(I2), complex(2))
  })

  it('trace(PAULI_X) = 0', () => {
    expectComplex(trace(X), complex(0))
  })
})

describe('determinant', () => {
  it('det(I) = 1', () => {
    expectComplex(determinant2x2(I2), complex(1))
  })

  it('det(X) = -1', () => {
    expectComplex(determinant2x2(X), complex(-1))
  })

  it('det3x3 of identity = 1', () => {
    expectComplex(determinant3x3(matIdentity(3)), complex(1))
  })
})

describe('kronecker product', () => {
  it('I x X produces correct 4x4', () => {
    const result = kronecker(I2, X)
    expect(result.rows).toBe(4)
    expect(result.cols).toBe(4)
    // Expected: [[0,1,0,0],[1,0,0,0],[0,0,0,1],[0,0,1,0]]
    expectComplex(mget(result, 0, 0), complex(0))
    expectComplex(mget(result, 0, 1), complex(1))
    expectComplex(mget(result, 1, 0), complex(1))
    expectComplex(mget(result, 1, 1), complex(0))
    expectComplex(mget(result, 2, 2), complex(0))
    expectComplex(mget(result, 2, 3), complex(1))
    expectComplex(mget(result, 3, 2), complex(1))
    expectComplex(mget(result, 3, 3), complex(0))
  })

  it('X x I produces correct 4x4', () => {
    const result = kronecker(X, I2)
    expect(result.rows).toBe(4)
    // Expected: [[0,0,1,0],[0,0,0,1],[1,0,0,0],[0,1,0,0]]
    expectComplex(mget(result, 0, 2), complex(1))
    expectComplex(mget(result, 1, 3), complex(1))
    expectComplex(mget(result, 2, 0), complex(1))
    expectComplex(mget(result, 3, 1), complex(1))
  })

  it('kronecker dimensions: 2x2 x 2x2 = 4x4', () => {
    const result = kronecker(I2, I2)
    expect(result.rows).toBe(4)
    expect(result.cols).toBe(4)
  })

  it('kronecker dimensions: 2x2 x 4x4 = 8x8', () => {
    const result = kronecker(I2, matIdentity(4))
    expect(result.rows).toBe(8)
    expect(result.cols).toBe(8)
  })

  it('kronecker dimensions: 4x4 x 2x2 = 8x8', () => {
    const result = kronecker(matIdentity(4), I2)
    expect(result.rows).toBe(8)
    expect(result.cols).toBe(8)
  })
})

describe('matInverse2x2', () => {
  it('inverse of identity is identity', () => {
    expectMatrix(matInverse2x2(I2), I2)
  })

  it('A * A^{-1} = I', () => {
    const A = matFromArray(2, 2, [
      [complex(1, 1), complex(2, 0)],
      [complex(0, 1), complex(1, -1)],
    ])
    const Ainv = matInverse2x2(A)
    expectMatrix(matMul(A, Ainv), I2)
  })
})

describe('matrix exponential', () => {
  it('matExp(0) = I', () => {
    const zero = matFromArray(2, 2, [
      [complex(0), complex(0)],
      [complex(0), complex(0)],
    ])
    expectMatrix(matExp(zero), I2)
  })

  it('matExp(i*pi*X) = -I', () => {
    const iPiX = matScale(X, complex(0, Math.PI))
    const result = matExp(iPiX)
    const negI = matScale(I2, complex(-1))
    expectMatrix(result, negI, 1e-8)
  })

  it('matExp(-i*pi/2 * Z) = diag(-i, i)', () => {
    const A = matScale(Z, complex(0, -Math.PI / 2))
    const result = matExp(A)
    expectComplex(mget(result, 0, 0), complex(0, -1), 1e-8)
    expectComplex(mget(result, 0, 1), complex(0), 1e-8)
    expectComplex(mget(result, 1, 0), complex(0), 1e-8)
    expectComplex(mget(result, 1, 1), complex(0, 1), 1e-8)
  })

  it('matExp(-i*theta/2 * X) = Rx(theta) for theta=pi/2', () => {
    const theta = Math.PI / 2
    const A = matScale(X, complex(0, -theta / 2))
    const result = matExp(A)
    const ct = Math.cos(theta / 2)
    const st = Math.sin(theta / 2)
    expectComplex(mget(result, 0, 0), complex(ct), 1e-8)
    expectComplex(mget(result, 0, 1), complex(0, -st), 1e-8)
    expectComplex(mget(result, 1, 0), complex(0, -st), 1e-8)
    expectComplex(mget(result, 1, 1), complex(ct), 1e-8)
  })

  it('matExp(-i*theta/2 * Y) = Ry(theta) for theta=pi/3', () => {
    const theta = Math.PI / 3
    const A = matScale(Y, complex(0, -theta / 2))
    const result = matExp(A)
    const ct = Math.cos(theta / 2)
    const st = Math.sin(theta / 2)
    expectComplex(mget(result, 0, 0), complex(ct), 1e-8)
    expectComplex(mget(result, 0, 1), complex(-st), 1e-8)
    expectComplex(mget(result, 1, 0), complex(st), 1e-8)
    expectComplex(mget(result, 1, 1), complex(ct), 1e-8)
  })

  it('matExp(A) * matExp(-A) = I for random Hermitian 3x3', () => {
    // Build a Hermitian matrix: H = M + M^dagger
    const M = matFromArray(3, 3, [
      [complex(1, 0), complex(0.5, 0.3), complex(-0.2, 0.1)],
      [complex(0.1, 0.4), complex(2, 0), complex(0.7, -0.2)],
      [complex(0.3, -0.1), complex(-0.5, 0.6), complex(3, 0)],
    ])
    const Herm = matAdd(M, adjoint(M))

    const expH = matExp(Herm)
    const negH = matScale(Herm, complex(-1))
    const expNegH = matExp(negH)
    const product = matMul(expH, expNegH)
    expectMatrix(product, matIdentity(3), 1e-6)
  })
})

