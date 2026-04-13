import { describe, it, expect } from 'vitest'
import { createSparseBuilder, sparseMatVecMul, sparseToDense, denseToSparse } from '../sparse'
import { matIdentity, matFromArray, matVecMul, mget } from '../matrix'
import { vecFromArray } from '../vector'
import { complex } from '../complex'
import { expectComplex, expectMatrix, expectStateVec } from './helpers'

describe('createSparseBuilder', () => {
  it('builds CSR from COO entries', () => {
    const builder = createSparseBuilder(3, 3)
    builder.set(0, 0, complex(1))
    builder.set(1, 1, complex(2))
    builder.set(2, 2, complex(3))
    const sparse = builder.build()
    expect(sparse.nnz).toBe(3)
    expect(sparse.rows).toBe(3)
    expect(sparse.cols).toBe(3)
  })

  it('add accumulates values at same position', () => {
    const builder = createSparseBuilder(2, 2)
    builder.add(0, 0, complex(1, 1))
    builder.add(0, 0, complex(2, 3))
    const sparse = builder.build()
    expect(sparse.nnz).toBe(1)
    const dense = sparseToDense(sparse)
    expectComplex(mget(dense, 0, 0), complex(3, 4))
  })
})

describe('sparseMatVecMul', () => {
  it('identity matrix times vector = vector', () => {
    const id = denseToSparse(matIdentity(3))
    const v = vecFromArray([complex(1, 2), complex(3, 4), complex(5, 6)])
    const result = sparseMatVecMul(id, v)
    expectStateVec(result, v)
  })

  it('matches dense matVecMul', () => {
    const dense = matFromArray(3, 3, [
      [complex(1, 1), complex(0), complex(2)],
      [complex(0), complex(3, -1), complex(0)],
      [complex(0, 1), complex(0), complex(4)],
    ])
    const sparse = denseToSparse(dense)
    const v = vecFromArray([complex(1), complex(0, 1), complex(-1)])
    const denseResult = matVecMul(dense, v)
    const sparseResult = sparseMatVecMul(sparse, v)
    expectStateVec(sparseResult, denseResult)
  })
})

describe('format conversion round-trip', () => {
  it('dense -> sparse -> dense preserves matrix', () => {
    const original = matFromArray(3, 3, [
      [complex(1, 1), complex(0), complex(2)],
      [complex(0), complex(3, -1), complex(0)],
      [complex(0, 1), complex(0), complex(4)],
    ])
    const sparse = denseToSparse(original)
    const reconstructed = sparseToDense(sparse)
    expectMatrix(reconstructed, original)
  })

  it('denseToSparse drops near-zero entries', () => {
    const m = matFromArray(2, 2, [
      [complex(1), complex(1e-16)],
      [complex(0), complex(1)],
    ])
    const sparse = denseToSparse(m)
    expect(sparse.nnz).toBe(2) // the 1e-16 entry is dropped
  })
})
