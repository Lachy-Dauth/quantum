/**
 * Sparse matrix operations using Compressed Sparse Row (CSR) format.
 */

import type { Complex, DenseMatrix, SparseMatrix, SparseMatrixBuilder, StateVector } from './types'

// ---------------------------------------------------------------------------
// Builder (COO -> CSR)
// ---------------------------------------------------------------------------

interface COOEntry {
  row: number
  col: number
  re: number
  im: number
}

export function createSparseBuilder(rows: number, cols: number): SparseMatrixBuilder {
  const entries = new Map<string, COOEntry>()

  function key(row: number, col: number): string {
    return `${row},${col}`
  }

  return {
    set(row: number, col: number, value: Complex): void {
      entries.set(key(row, col), { row, col, re: value.re, im: value.im })
    },

    add(row: number, col: number, value: Complex): void {
      const k = key(row, col)
      const existing = entries.get(k)
      if (existing) {
        existing.re += value.re
        existing.im += value.im
      } else {
        entries.set(k, { row, col, re: value.re, im: value.im })
      }
    },

    build(): SparseMatrix {
      // Sort entries by (row, col)
      const sorted = [...entries.values()].sort((a, b) =>
        a.row !== b.row ? a.row - b.row : a.col - b.col
      )
      const nnz = sorted.length
      const rowPtr = new Uint32Array(rows + 1)
      const colIdx = new Uint32Array(nnz)
      const valRe = new Float64Array(nnz)
      const valIm = new Float64Array(nnz)

      for (let i = 0; i < nnz; i++) {
        const e = sorted[i]!
        colIdx[i] = e.col
        valRe[i] = e.re
        valIm[i] = e.im
        rowPtr[e.row + 1] = rowPtr[e.row + 1]! + 1
      }

      // Cumulative sum for rowPtr
      for (let i = 1; i <= rows; i++) {
        rowPtr[i] = rowPtr[i]! + rowPtr[i - 1]!
      }

      return { rows, cols, rowPtr, colIdx, valRe, valIm, nnz }
    },
  }
}

// ---------------------------------------------------------------------------
// Sparse matrix-vector multiply
// ---------------------------------------------------------------------------

export function sparseMatVecMul(A: SparseMatrix, v: StateVector): StateVector {
  const dim = A.rows
  const real = new Float64Array(dim)
  const imag = new Float64Array(dim)

  for (let i = 0; i < dim; i++) {
    let re = 0
    let im = 0
    const start = A.rowPtr[i]!
    const end = A.rowPtr[i + 1]!
    for (let idx = start; idx < end; idx++) {
      const j = A.colIdx[idx]!
      const ar = A.valRe[idx]!
      const ai = A.valIm[idx]!
      const vr = v.real[j]!
      const vi = v.imag[j]!
      re += ar * vr - ai * vi
      im += ar * vi + ai * vr
    }
    real[i] = re
    imag[i] = im
  }

  return { dim, real, imag }
}

// ---------------------------------------------------------------------------
// Format conversion
// ---------------------------------------------------------------------------

export function sparseToDense(A: SparseMatrix): DenseMatrix {
  const real = new Float64Array(A.rows * A.cols)
  const imag = new Float64Array(A.rows * A.cols)

  for (let i = 0; i < A.rows; i++) {
    const start = A.rowPtr[i]!
    const end = A.rowPtr[i + 1]!
    for (let idx = start; idx < end; idx++) {
      const j = A.colIdx[idx]!
      const flatIdx = i * A.cols + j
      real[flatIdx] = A.valRe[idx]!
      imag[flatIdx] = A.valIm[idx]!
    }
  }

  return { rows: A.rows, cols: A.cols, real, imag }
}

export function denseToSparse(A: DenseMatrix, threshold = 1e-15): SparseMatrix {
  const builder = createSparseBuilder(A.rows, A.cols)

  for (let i = 0; i < A.rows; i++) {
    for (let j = 0; j < A.cols; j++) {
      const idx = i * A.cols + j
      const re = A.real[idx]!
      const im = A.imag[idx]!
      if (Math.hypot(re, im) >= threshold) {
        builder.set(i, j, { re, im })
      }
    }
  }

  return builder.build()
}
