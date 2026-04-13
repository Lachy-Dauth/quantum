/**
 * Core type definitions for the quantum linear algebra engine.
 * No logic — just interfaces and error classes.
 */

/** A complex number stored as a pair of IEEE 754 doubles. */
export interface Complex {
  readonly re: number
  readonly im: number
}

/**
 * Dense column vector in C^n.
 * Stored as two parallel Float64Arrays for cache-friendly access.
 */
export interface StateVector {
  readonly dim: number
  readonly real: Float64Array
  readonly imag: Float64Array
}

/**
 * Dense matrix in C^{m x n}, stored in row-major order
 * as two parallel Float64Arrays each of length m*n.
 */
export interface DenseMatrix {
  readonly rows: number
  readonly cols: number
  readonly real: Float64Array
  readonly imag: Float64Array
}

/**
 * Sparse matrix in Compressed Sparse Row (CSR) format.
 * Used for Hamiltonians and operators in systems above 4 qubits.
 */
export interface SparseMatrix {
  readonly rows: number
  readonly cols: number
  readonly rowPtr: Uint32Array
  readonly colIdx: Uint32Array
  readonly valRe: Float64Array
  readonly valIm: Float64Array
  readonly nnz: number
}

/** Builder for constructing sparse matrices entry-by-entry before finalising into CSR. */
export interface SparseMatrixBuilder {
  set(row: number, col: number, value: Complex): void
  add(row: number, col: number, value: Complex): void
  build(): SparseMatrix
}

export class DivisionByZeroError extends Error {
  constructor(message = 'Division by zero') {
    super(message)
    this.name = 'DivisionByZeroError'
  }
}

export class ZeroVectorError extends Error {
  constructor(message = 'Cannot normalize a zero vector') {
    super(message)
    this.name = 'ZeroVectorError'
  }
}

export class DimensionMismatchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DimensionMismatchError'
  }
}
