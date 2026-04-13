/**
 * Eigensolver for the 1D Hamiltonian (real symmetric tridiagonal).
 *
 * Uses bisection (Sturm sequences) for eigenvalues and inverse iteration
 * for eigenvectors. Finds the K smallest eigenvalues.
 */

import type { Eigenstate } from './types'

/**
 * Find the first K eigenstates of H = -d²/dx² + V(x)
 * where H is discretized as a tridiagonal matrix:
 *   diagonal[j] = 2/dx² + V[j]
 *   off-diagonal = -1/dx²
 */
export function findEigenstates(
  V: Float64Array,
  dx: number,
  numStates: number,
): Eigenstate[] {
  const N = V.length
  // Interior points only (Dirichlet: psi[0]=psi[N-1]=0)
  const M = N - 2
  if (M < 1) return []

  const offDiag = -1 / (dx * dx)
  const diag = new Float64Array(M)
  for (let j = 0; j < M; j++) {
    diag[j] = 2 / (dx * dx) + V[j + 1]!
  }

  // Find eigenvalue bounds
  let minDiag = diag[0]!
  let maxDiag = diag[0]!
  for (let j = 1; j < M; j++) {
    if (diag[j]! < minDiag) minDiag = diag[j]!
    if (diag[j]! > maxDiag) maxDiag = diag[j]!
  }
  const absOff = Math.abs(offDiag)
  const lower = minDiag - 2 * absOff
  const upper = maxDiag + 2 * absOff

  const K = Math.min(numStates, M)
  const eigenvalues: number[] = []

  // Sturm sequence count: number of eigenvalues < lambda
  function sturmCount(lambda: number): number {
    let count = 0
    let d = diag[0]! - lambda
    if (d < 0) count++

    for (let j = 1; j < M; j++) {
      if (Math.abs(d) < 1e-30) d = 1e-30
      d = (diag[j]! - lambda) - (offDiag * offDiag) / d
      if (d < 0) count++
    }
    return count
  }

  // Find eigenvalues by bisection
  for (let k = 0; k < K; k++) {
    let lo = lower
    let hi = upper

    // Narrow to bracket eigenvalue k (0-indexed)
    // Find smallest interval [lo, hi] where sturmCount(lo) <= k and sturmCount(hi) > k
    for (let iter = 0; iter < 100; iter++) {
      const mid = (lo + hi) / 2
      if (hi - lo < 1e-12 * (Math.abs(lo) + 1)) break
      const count = sturmCount(mid)
      if (count <= k) {
        lo = mid
      } else {
        hi = mid
      }
    }
    eigenvalues.push((lo + hi) / 2)
  }

  // Find eigenvectors by inverse iteration
  const result: Eigenstate[] = []
  for (let k = 0; k < K; k++) {
    const ev = eigenvalues[k]!
    const vec = inverseIteration(diag, offDiag, M, ev)

    // Construct full wavefunction (including boundary zeros)
    const fullVec = new Float64Array(N)
    for (let j = 0; j < M; j++) {
      fullVec[j + 1] = vec[j]!
    }

    // Normalize
    let norm = 0
    for (let j = 0; j < N; j++) {
      norm += fullVec[j]! * fullVec[j]! * dx
    }
    norm = Math.sqrt(norm)
    if (norm > 1e-15) {
      for (let j = 0; j < N; j++) {
        fullVec[j] = fullVec[j]! / norm
      }
    }

    // Convention: first nonzero value should be positive
    for (let j = 0; j < N; j++) {
      if (Math.abs(fullVec[j]!) > 1e-10) {
        if (fullVec[j]! < 0) {
          for (let jj = 0; jj < N; jj++) fullVec[jj] = -fullVec[jj]!
        }
        break
      }
    }

    result.push({
      index: k,
      energy: ev,
      wavefunction: fullVec,
      label: k === 0 ? 'n=0 (ground)' : `n=${k}`,
    })
  }

  return result
}

/**
 * Inverse iteration to find eigenvector for a tridiagonal matrix.
 */
function inverseIteration(
  diag: Float64Array,
  offDiag: number,
  M: number,
  eigenvalue: number,
  maxIter = 20,
): Float64Array {
  // Shift matrix: (A - lambda*I)
  const shiftedDiag = new Float64Array(M)
  for (let j = 0; j < M; j++) {
    shiftedDiag[j] = diag[j]! - eigenvalue
  }

  // Small shift to avoid singular matrix
  for (let j = 0; j < M; j++) {
    if (Math.abs(shiftedDiag[j]!) < 1e-14) {
      shiftedDiag[j] = 1e-14
    }
  }

  // Start with random vector
  let v: Float64Array = new Float64Array(M)
  for (let j = 0; j < M; j++) {
    v[j] = 1 + 0.1 * Math.sin(j * 3.14159)
  }

  for (let iter = 0; iter < maxIter; iter++) {
    // Solve (A - lambda*I) * w = v using Thomas algorithm (real)
    const w: Float64Array = tridiagonalSolveReal(shiftedDiag, offDiag, v)

    // Normalize
    let norm = 0
    for (let j = 0; j < M; j++) {
      norm += w[j]! * w[j]!
    }
    norm = Math.sqrt(norm)
    if (norm < 1e-30) break

    for (let j = 0; j < M; j++) {
      w[j] = w[j]! / norm
    }

    v = w
  }

  return v
}

function tridiagonalSolveReal(diag: Float64Array, offDiag: number, rhs: Float64Array): Float64Array {
  const M = diag.length
  const d = new Float64Array(M)
  const r = new Float64Array(M)
  d[0] = diag[0]!
  r[0] = rhs[0]!

  // Forward sweep
  for (let j = 1; j < M; j++) {
    if (Math.abs(d[j - 1]!) < 1e-30) d[j - 1] = 1e-30
    const m = offDiag / d[j - 1]!
    d[j] = diag[j]! - m * offDiag
    r[j] = rhs[j]! - m * r[j - 1]!
  }

  // Back substitution
  const x = new Float64Array(M)
  x[M - 1] = r[M - 1]! / d[M - 1]!
  for (let j = M - 2; j >= 0; j--) {
    x[j] = (r[j]! - offDiag * x[j + 1]!) / d[j]!
  }

  return x
}
