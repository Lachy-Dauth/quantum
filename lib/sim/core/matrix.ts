/**
 * Dense matrix operations for C^{m x n}.
 * Matrices are stored row-major as parallel Float64Arrays.
 */

import type { Complex, DenseMatrix, StateVector } from './types'
import { DimensionMismatchError, DivisionByZeroError } from './types'
import { cmul, csub, cdiv, cexp, csqrt, cabs } from './complex'

// ---------------------------------------------------------------------------
// Element access helpers
// ---------------------------------------------------------------------------

export function mget(m: DenseMatrix, r: number, c: number): Complex {
  const idx = r * m.cols + c
  return { re: m.real[idx]!, im: m.imag[idx]! }
}

export function mset(m: DenseMatrix, r: number, c: number, v: Complex): void {
  const idx = r * m.cols + c
  m.real[idx] = v.re
  m.imag[idx] = v.im
}

// ---------------------------------------------------------------------------
// Constructors
// ---------------------------------------------------------------------------

export function matIdentity(n: number): DenseMatrix {
  const real = new Float64Array(n * n)
  const imag = new Float64Array(n * n)
  for (let i = 0; i < n; i++) {
    real[i * n + i] = 1
  }
  return { rows: n, cols: n, real, imag }
}

export function matFromArray(rows: number, cols: number, data: Complex[][]): DenseMatrix {
  const real = new Float64Array(rows * cols)
  const imag = new Float64Array(rows * cols)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c
      real[idx] = data[r]![c]!.re
      imag[idx] = data[r]![c]!.im
    }
  }
  return { rows, cols, real, imag }
}

/** Create a matrix from flat real/imag arrays (for internal use). */
function matCreate(rows: number, cols: number, re: Float64Array, im: Float64Array): DenseMatrix {
  return { rows, cols, real: re, imag: im }
}

// ---------------------------------------------------------------------------
// Arithmetic
// ---------------------------------------------------------------------------

export function matAdd(A: DenseMatrix, B: DenseMatrix): DenseMatrix {
  if (A.rows !== B.rows || A.cols !== B.cols) {
    throw new DimensionMismatchError(
      `matAdd: (${A.rows}x${A.cols}) and (${B.rows}x${B.cols}) do not match`
    )
  }
  const len = A.rows * A.cols
  const real = new Float64Array(len)
  const imag = new Float64Array(len)
  for (let i = 0; i < len; i++) {
    real[i] = A.real[i]! + B.real[i]!
    imag[i] = A.imag[i]! + B.imag[i]!
  }
  return { rows: A.rows, cols: A.cols, real, imag }
}

export function matScale(A: DenseMatrix, c: Complex): DenseMatrix {
  const len = A.rows * A.cols
  const real = new Float64Array(len)
  const imag = new Float64Array(len)
  for (let i = 0; i < len; i++) {
    const ar = A.real[i]!
    const ai = A.imag[i]!
    real[i] = ar * c.re - ai * c.im
    imag[i] = ar * c.im + ai * c.re
  }
  return { rows: A.rows, cols: A.cols, real, imag }
}

export function matMul(A: DenseMatrix, B: DenseMatrix): DenseMatrix {
  if (A.cols !== B.rows) {
    throw new DimensionMismatchError(
      `matMul: A.cols=${A.cols} does not match B.rows=${B.rows}`
    )
  }
  const rows = A.rows
  const cols = B.cols
  const inner = A.cols
  const real = new Float64Array(rows * cols)
  const imag = new Float64Array(rows * cols)
  for (let i = 0; i < rows; i++) {
    const iOff = i * inner
    const outOff = i * cols
    for (let k = 0; k < inner; k++) {
      const ar = A.real[iOff + k]!
      const ai = A.imag[iOff + k]!
      const kOff = k * cols
      for (let j = 0; j < cols; j++) {
        const br = B.real[kOff + j]!
        const bi = B.imag[kOff + j]!
        real[outOff + j]! += ar * br - ai * bi
        imag[outOff + j]! += ar * bi + ai * br
      }
    }
  }
  return { rows, cols, real, imag }
}

export function matVecMul(A: DenseMatrix, v: StateVector): StateVector {
  if (A.cols !== v.dim) {
    throw new DimensionMismatchError(
      `matVecMul: A.cols=${A.cols} does not match v.dim=${v.dim}`
    )
  }
  const dim = A.rows
  const cols = A.cols
  const real = new Float64Array(dim)
  const imag = new Float64Array(dim)
  for (let i = 0; i < dim; i++) {
    let re = 0
    let im = 0
    const off = i * cols
    for (let j = 0; j < cols; j++) {
      const ar = A.real[off + j]!
      const ai = A.imag[off + j]!
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
// Adjoint, trace, determinants
// ---------------------------------------------------------------------------

export function adjoint(A: DenseMatrix): DenseMatrix {
  const rows = A.cols
  const cols = A.rows
  const real = new Float64Array(rows * cols)
  const imag = new Float64Array(rows * cols)
  for (let r = 0; r < A.rows; r++) {
    for (let c = 0; c < A.cols; c++) {
      const srcIdx = r * A.cols + c
      const dstIdx = c * cols + r
      real[dstIdx] = A.real[srcIdx]!
      imag[dstIdx] = -A.imag[srcIdx]!
    }
  }
  return { rows, cols, real, imag }
}

export function trace(A: DenseMatrix): Complex {
  const n = Math.min(A.rows, A.cols)
  let re = 0
  let im = 0
  for (let i = 0; i < n; i++) {
    const idx = i * A.cols + i
    re += A.real[idx]!
    im += A.imag[idx]!
  }
  return { re, im }
}

export function determinant2x2(A: DenseMatrix): Complex {
  // det = A[0][0]*A[1][1] - A[0][1]*A[1][0]
  const a00 = mget(A, 0, 0)
  const a01 = mget(A, 0, 1)
  const a10 = mget(A, 1, 0)
  const a11 = mget(A, 1, 1)
  return csub(cmul(a00, a11), cmul(a01, a10))
}

export function determinant3x3(A: DenseMatrix): Complex {
  const a = (r: number, c: number) => mget(A, r, c)
  // Cofactor expansion along first row
  const t1 = cmul(a(0, 0), csub(cmul(a(1, 1), a(2, 2)), cmul(a(1, 2), a(2, 1))))
  const t2 = cmul(a(0, 1), csub(cmul(a(1, 0), a(2, 2)), cmul(a(1, 2), a(2, 0))))
  const t3 = cmul(a(0, 2), csub(cmul(a(1, 0), a(2, 1)), cmul(a(1, 1), a(2, 0))))
  return { re: t1.re - t2.re + t3.re, im: t1.im - t2.im + t3.im }
}

// ---------------------------------------------------------------------------
// Kronecker product
// ---------------------------------------------------------------------------

export function kronecker(A: DenseMatrix, B: DenseMatrix): DenseMatrix {
  const rows = A.rows * B.rows
  const cols = A.cols * B.cols
  const real = new Float64Array(rows * cols)
  const imag = new Float64Array(rows * cols)
  for (let i = 0; i < A.rows; i++) {
    for (let j = 0; j < A.cols; j++) {
      const aIdx = i * A.cols + j
      const ar = A.real[aIdx]!
      const ai = A.imag[aIdx]!
      const rowBase = i * B.rows
      const colBase = j * B.cols
      for (let k = 0; k < B.rows; k++) {
        for (let l = 0; l < B.cols; l++) {
          const bIdx = k * B.cols + l
          const br = B.real[bIdx]!
          const bi = B.imag[bIdx]!
          const outIdx = (rowBase + k) * cols + (colBase + l)
          real[outIdx] = ar * br - ai * bi
          imag[outIdx] = ar * bi + ai * br
        }
      }
    }
  }
  return { rows, cols, real, imag }
}

// ---------------------------------------------------------------------------
// Matrix inverse (2x2)
// ---------------------------------------------------------------------------

export function matInverse2x2(A: DenseMatrix): DenseMatrix {
  const det = determinant2x2(A)
  if (cabs(det) < 1e-15) throw new DivisionByZeroError('Singular 2x2 matrix')
  const a00 = mget(A, 0, 0)
  const a01 = mget(A, 0, 1)
  const a10 = mget(A, 1, 0)
  const a11 = mget(A, 1, 1)
  // A^{-1} = (1/det) * [[a11, -a01], [-a10, a00]]
  const invDet = cdiv({ re: 1, im: 0 }, det)
  return matFromArray(2, 2, [
    [cmul(invDet, a11), cmul(invDet, { re: -a01.re, im: -a01.im })],
    [cmul(invDet, { re: -a10.re, im: -a10.im }), cmul(invDet, a00)],
  ])
}

// ---------------------------------------------------------------------------
// Matrix exponential
// ---------------------------------------------------------------------------

/** Infinity norm of a matrix: max row sum of |entries|. */
function matInfNorm(A: DenseMatrix): number {
  let maxSum = 0
  for (let i = 0; i < A.rows; i++) {
    let rowSum = 0
    const off = i * A.cols
    for (let j = 0; j < A.cols; j++) {
      const idx = off + j
      rowSum += Math.hypot(A.real[idx]!, A.imag[idx]!)
    }
    if (rowSum > maxSum) maxSum = rowSum
  }
  return maxSum
}

/** Frobenius norm of a matrix. */
function matFrobNorm(A: DenseMatrix): number {
  let sum = 0
  const len = A.rows * A.cols
  for (let i = 0; i < len; i++) {
    sum += A.real[i]! * A.real[i]! + A.imag[i]! * A.imag[i]!
  }
  return Math.sqrt(sum)
}

/** Scale a matrix by a real number (in-place-style but returns new). */
function matScaleReal(A: DenseMatrix, s: number): DenseMatrix {
  const len = A.rows * A.cols
  const real = new Float64Array(len)
  const imag = new Float64Array(len)
  for (let i = 0; i < len; i++) {
    real[i] = A.real[i]! * s
    imag[i] = A.imag[i]! * s
  }
  return { rows: A.rows, cols: A.cols, real, imag }
}

/** Subtract matrices. */
function matSub(A: DenseMatrix, B: DenseMatrix): DenseMatrix {
  const len = A.rows * A.cols
  const real = new Float64Array(len)
  const imag = new Float64Array(len)
  for (let i = 0; i < len; i++) {
    real[i] = A.real[i]! - B.real[i]!
    imag[i] = A.imag[i]! - B.imag[i]!
  }
  return { rows: A.rows, cols: A.cols, real, imag }
}

/**
 * Solve A*X = B for X using LU decomposition with partial pivoting.
 * A and B are n x n matrices. Returns X.
 */
function matSolve(A: DenseMatrix, B: DenseMatrix): DenseMatrix {
  const n = A.rows
  // Copy A and B into mutable work arrays
  const aRe = Float64Array.from(A.real)
  const aIm = Float64Array.from(A.imag)
  const xRe = Float64Array.from(B.real)
  const xIm = Float64Array.from(B.imag)

  const piv = new Uint32Array(n)
  for (let i = 0; i < n; i++) piv[i] = i

  // LU factorisation in-place
  for (let k = 0; k < n; k++) {
    // Find pivot
    let maxVal = 0
    let maxRow = k
    for (let i = k; i < n; i++) {
      const idx = i * n + k
      const v = Math.hypot(aRe[idx]!, aIm[idx]!)
      if (v > maxVal) { maxVal = v; maxRow = i }
    }

    // Swap rows in A, X, and piv
    if (maxRow !== k) {
      for (let j = 0; j < n; j++) {
        const idx1 = k * n + j, idx2 = maxRow * n + j
        let tmp: number
        tmp = aRe[idx1]!; aRe[idx1] = aRe[idx2]!; aRe[idx2] = tmp
        tmp = aIm[idx1]!; aIm[idx1] = aIm[idx2]!; aIm[idx2] = tmp
        tmp = xRe[idx1]!; xRe[idx1] = xRe[idx2]!; xRe[idx2] = tmp
        tmp = xIm[idx1]!; xIm[idx1] = xIm[idx2]!; xIm[idx2] = tmp
      }
      const t = piv[k]!; piv[k] = piv[maxRow]!; piv[maxRow] = t
    }

    // Eliminate below pivot
    const pkIdx = k * n + k
    const pkRe = aRe[pkIdx]!
    const pkIm = aIm[pkIdx]!
    const pkDenom = pkRe * pkRe + pkIm * pkIm
    if (pkDenom < 1e-30) continue // near-singular

    for (let i = k + 1; i < n; i++) {
      const ikIdx = i * n + k
      const fRe = (aRe[ikIdx]! * pkRe + aIm[ikIdx]! * pkIm) / pkDenom
      const fIm = (aIm[ikIdx]! * pkRe - aRe[ikIdx]! * pkIm) / pkDenom

      for (let j = k; j < n; j++) {
        const ijIdx = i * n + j
        const kjIdx = k * n + j
        aRe[ijIdx] = aRe[ijIdx]! - (fRe * aRe[kjIdx]! - fIm * aIm[kjIdx]!)
        aIm[ijIdx] = aIm[ijIdx]! - (fRe * aIm[kjIdx]! + fIm * aRe[kjIdx]!)
      }
      for (let j = 0; j < n; j++) {
        const ijIdx = i * n + j
        const kjIdx = k * n + j
        xRe[ijIdx] = xRe[ijIdx]! - (fRe * xRe[kjIdx]! - fIm * xIm[kjIdx]!)
        xIm[ijIdx] = xIm[ijIdx]! - (fRe * xIm[kjIdx]! + fIm * xRe[kjIdx]!)
      }
    }
  }

  // Back substitution
  for (let i = n - 1; i >= 0; i--) {
    const iiIdx = i * n + i
    const dRe = aRe[iiIdx]!
    const dIm = aIm[iiIdx]!
    const dDenom = dRe * dRe + dIm * dIm
    if (dDenom < 1e-30) continue

    for (let j = 0; j < n; j++) {
      const ijIdx = i * n + j
      let sRe = xRe[ijIdx]!
      let sIm = xIm[ijIdx]!

      for (let k = i + 1; k < n; k++) {
        const ikIdx = i * n + k
        const kjIdx = k * n + j
        sRe -= aRe[ikIdx]! * xRe[kjIdx]! - aIm[ikIdx]! * xIm[kjIdx]!
        sIm -= aRe[ikIdx]! * xIm[kjIdx]! + aIm[ikIdx]! * xRe[kjIdx]!
      }

      // sRe + i*sIm divided by dRe + i*dIm
      xRe[ijIdx] = (sRe * dRe + sIm * dIm) / dDenom
      xIm[ijIdx] = (sIm * dRe - sRe * dIm) / dDenom
    }
  }

  return matCreate(n, n, xRe, xIm)
}

/** 2x2 closed-form matrix exponential. */
function matExp2x2(A: DenseMatrix): DenseMatrix {
  const tr = trace(A)
  const halfTr = { re: tr.re / 2, im: tr.im / 2 }

  // B = A - (tr/2)*I
  const I2 = matIdentity(2)
  const B = matSub(A, matScale(I2, halfTr))

  // delta = -det(B) for the formula s = sqrt(-det(B))
  // Actually: s^2 = (B[0][0])^2 + B[0][1]*B[1][0]
  // Simpler: det(B) = B00*B11 - B01*B10, and for traceless B, B11 = -B00
  // So det(B) = -B00^2 - B01*B10
  // s^2 = -det(B) = B00^2 + B01*B10
  const b00 = mget(B, 0, 0)
  const b01 = mget(B, 0, 1)
  const b10 = mget(B, 1, 0)
  const s2 = { re: b00.re * b00.re - b00.im * b00.im + b01.re * b10.re - b01.im * b10.im,
               im: 2 * b00.re * b00.im + b01.re * b10.im + b01.im * b10.re }
  const s = csqrt(s2)

  const expHalfTr = cexp(halfTr)

  let result: DenseMatrix
  if (cabs(s) < 1e-15) {
    // s ≈ 0: e^B ≈ I + B
    result = matAdd(I2, B)
  } else {
    // e^B = cosh(s)*I + (sinh(s)/s)*B
    const expS = cexp(s)
    const expNegS = cexp({ re: -s.re, im: -s.im })
    const coshS = { re: (expS.re + expNegS.re) / 2, im: (expS.im + expNegS.im) / 2 }
    const sinhS = { re: (expS.re - expNegS.re) / 2, im: (expS.im - expNegS.im) / 2 }
    const sinhOverS = cdiv(sinhS, s)

    result = matAdd(matScale(I2, coshS), matScale(B, sinhOverS))
  }

  // Multiply by e^{tr/2}
  return matScale(result, expHalfTr)
}

/** Pade approximant-based matrix exponential (for 3x3 to 8x8). */
function matExpPade(A: DenseMatrix): DenseMatrix {
  const n = A.rows
  const norm = matInfNorm(A)

  // Scale: find s such that ||A/2^s|| <= 1
  let s = 0
  if (norm > 1) {
    s = Math.ceil(Math.log2(norm))
  }
  const scaled = s > 0 ? matScaleReal(A, 1 / (1 << s)) : A

  // Degree-6 Pade coefficients: c_k = (2p - k)! * p! / ((2p)! * k! * (p-k)!)
  // For p = 6: precomputed
  const padeCoeffs = [1, 1 / 2, 1 / 9, 1 / 72, 1 / 1008, 1 / 30240, 1 / 1814400]

  // Compute powers of scaled matrix
  const id = matIdentity(n)
  const A2 = matMul(scaled, scaled)
  const A3 = matMul(A2, scaled)
  const A4 = matMul(A3, scaled)
  const A5 = matMul(A4, scaled)
  const A6 = matMul(A5, scaled)
  const powers = [id, scaled, A2, A3, A4, A5, A6]

  // N = sum_{k=0}^{6} c_k * A^k
  // D = sum_{k=0}^{6} (-1)^k * c_k * A^k
  let N = matScaleReal(id, 0)
  let D = matScaleReal(id, 0)
  for (let k = 0; k <= 6; k++) {
    const term = matScaleReal(powers[k]!, padeCoeffs[k]!)
    N = matAdd(N, term)
    if (k % 2 === 0) {
      D = matAdd(D, term)
    } else {
      D = matSub(D, term)
    }
  }

  // e^{scaled} ≈ D^{-1} * N
  let result = matSolve(D, N)

  // Repeated squaring
  for (let i = 0; i < s; i++) {
    result = matMul(result, result)
  }

  return result
}

/** Taylor series matrix exponential for larger matrices (fallback). */
function matExpTaylor(A: DenseMatrix, maxOrder = 20): DenseMatrix {
  const n = A.rows
  const norm = matInfNorm(A)

  // Scale down
  let s = 0
  if (norm > 1) {
    s = Math.ceil(Math.log2(norm))
  }
  const scaled = s > 0 ? matScaleReal(A, 1 / (1 << s)) : A

  let result = matIdentity(n)
  let term = matIdentity(n)
  const resultNorm = matFrobNorm(result)

  for (let k = 1; k <= maxOrder; k++) {
    term = matScaleReal(matMul(term, scaled), 1 / k)
    result = matAdd(result, term)
    if (matFrobNorm(term) < 1e-14 * resultNorm) break
  }

  // Repeated squaring
  for (let i = 0; i < s; i++) {
    result = matMul(result, result)
  }

  return result
}

export function matExp(A: DenseMatrix, order?: number): DenseMatrix {
  if (A.rows !== A.cols) {
    throw new DimensionMismatchError(`matExp: matrix must be square, got ${A.rows}x${A.cols}`)
  }
  if (A.rows === 1) {
    const v = mget(A, 0, 0)
    const ev = cexp(v)
    return matFromArray(1, 1, [[ev]])
  }
  if (A.rows === 2) return matExp2x2(A)
  if (A.rows <= 8) return matExpPade(A)
  return matExpTaylor(A, order ?? 20)
}
