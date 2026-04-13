/**
 * Crank-Nicolson time evolution solver for the 1D Schrödinger equation.
 *
 * Solves: i * d/dt psi = (-d²/dx² + V(x)) psi
 * using the Crank-Nicolson implicit scheme (unconditionally stable, unitary).
 *
 * All arrays are pre-allocated and reused for zero-allocation time stepping.
 */

export class CrankNicolsonSolver {
  private N: number
  private dx: number
  private dt: number

  // Pre-allocated work arrays
  private diagRe: Float64Array
  private diagIm: Float64Array
  private offRe: number
  private offIm: number
  private rhsRe: Float64Array
  private rhsIm: Float64Array
  // Thomas algorithm scratch
  private cPrimeRe: Float64Array
  private cPrimeIm: Float64Array
  private dPrimeRe: Float64Array
  private dPrimeIm: Float64Array

  // RHS coefficients
  private rhsDiagRe: Float64Array
  private rhsDiagIm: Float64Array
  private rhsOffRe: number
  private rhsOffIm: number

  constructor(N: number, dx: number, dt: number, V: Float64Array) {
    this.N = N
    this.dx = dx
    this.dt = dt

    // alpha = i * dt / (2 * dx^2)
    // alpha_re = 0, alpha_im = dt / (2 * dx^2)
    const alphaIm = dt / (2 * dx * dx)

    // LHS diagonal: 1 + 2*alpha + i*dt/2 * V_j
    // = (1 + 0) + (0 + 2*alpha_im)*i + (0 + i*dt/2*V_j)
    // = 1 + i*(2*alpha_im + dt/2*V_j)
    // Wait: alpha = i * dt/(2*dx^2), so 2*alpha = i * dt/dx^2
    // LHS: (I + i*dt/2 * H)
    // H = -d²/dx² + V(x)
    // For row j: H psi_j = -(psi_{j+1} - 2*psi_j + psi_{j-1})/dx² + V_j * psi_j
    //
    // (I + i*dt/2 * H) psi_j = psi_j + i*dt/2 * [-(psi_{j+1} - 2*psi_j + psi_{j-1})/dx² + V_j * psi_j]
    //
    // Diagonal (coefficient of psi_j): 1 + i*dt/2 * (2/dx² + V_j)
    // Off-diagonal (coefficient of psi_{j±1}): i*dt/2 * (-1/dx²) = -i*dt/(2*dx²) = -alpha*i

    this.diagRe = new Float64Array(N)
    this.diagIm = new Float64Array(N)
    for (let j = 0; j < N; j++) {
      this.diagRe[j] = 1
      this.diagIm[j] = dt / 2 * (2 / (dx * dx) + V[j]!)
    }

    // Off-diagonal: -i * dt / (2*dx²) = (0) + (-alphaIm)*i
    this.offRe = 0
    this.offIm = -alphaIm

    // RHS diagonal: 1 - i*dt/2 * (2/dx² + V_j)
    this.rhsDiagRe = new Float64Array(N)
    this.rhsDiagIm = new Float64Array(N)
    for (let j = 0; j < N; j++) {
      this.rhsDiagRe[j] = 1
      this.rhsDiagIm[j] = -dt / 2 * (2 / (dx * dx) + V[j]!)
    }

    // RHS off-diagonal: i * dt / (2*dx²) = alphaIm * i
    this.rhsOffRe = 0
    this.rhsOffIm = alphaIm

    // Work arrays
    this.rhsRe = new Float64Array(N)
    this.rhsIm = new Float64Array(N)
    this.cPrimeRe = new Float64Array(N)
    this.cPrimeIm = new Float64Array(N)
    this.dPrimeRe = new Float64Array(N)
    this.dPrimeIm = new Float64Array(N)
  }

  /**
   * Advance wavefunction by one time step. Modifies psiRe, psiIm in-place.
   */
  step(psiRe: Float64Array, psiIm: Float64Array): void {
    const N = this.N

    // 1. Compute RHS = B * psi^n
    // Boundary: rhs[0] = 0, rhs[N-1] = 0 (Dirichlet)
    this.rhsRe[0] = 0
    this.rhsIm[0] = 0
    this.rhsRe[N - 1] = 0
    this.rhsIm[N - 1] = 0

    for (let j = 1; j < N - 1; j++) {
      // off * psi[j-1] + diag * psi[j] + off * psi[j+1]
      // Complex multiply: (a+bi)(c+di) = (ac-bd) + (ad+bc)i

      // rhsOff * psi[j-1]
      const pRe_m = psiRe[j - 1]!
      const pIm_m = psiIm[j - 1]!
      const off_m_re = this.rhsOffRe * pRe_m - this.rhsOffIm * pIm_m
      const off_m_im = this.rhsOffRe * pIm_m + this.rhsOffIm * pRe_m

      // rhsDiag * psi[j]
      const pRe = psiRe[j]!
      const pIm = psiIm[j]!
      const d_re = this.rhsDiagRe[j]! * pRe - this.rhsDiagIm[j]! * pIm
      const d_im = this.rhsDiagRe[j]! * pIm + this.rhsDiagIm[j]! * pRe

      // rhsOff * psi[j+1]
      const pRe_p = psiRe[j + 1]!
      const pIm_p = psiIm[j + 1]!
      const off_p_re = this.rhsOffRe * pRe_p - this.rhsOffIm * pIm_p
      const off_p_im = this.rhsOffRe * pIm_p + this.rhsOffIm * pRe_p

      this.rhsRe[j] = off_m_re + d_re + off_p_re
      this.rhsIm[j] = off_m_im + d_im + off_p_im
    }

    // 2. Solve tridiagonal system A * psi^{n+1} = rhs via Thomas algorithm
    // Forward sweep
    this.cPrimeRe[0] = 0
    this.cPrimeIm[0] = 0
    this.dPrimeRe[0] = 0
    this.dPrimeIm[0] = 0

    for (let j = 1; j < N - 1; j++) {
      // m = a[j-1] / b'[j-1]  where a[j-1] = off (sub-diagonal)
      // b'[j-1] is the modified diagonal
      let bRe: number, bIm: number
      if (j === 1) {
        bRe = this.diagRe[0]!
        bIm = this.diagIm[0]!
      } else {
        bRe = this.diagRe[j - 1]! - (this.cPrimeRe[j - 1]! * this.offRe - this.cPrimeIm[j - 1]! * this.offIm)
        bIm = this.diagIm[j - 1]! - (this.cPrimeRe[j - 1]! * this.offIm + this.cPrimeIm[j - 1]! * this.offRe)
      }

      // Actually, let me use the standard Thomas algorithm correctly.
      // For the tridiagonal system with sub-diagonal a, diagonal b, super-diagonal c:
      // a = offRe + i*offIm (same for all j)
      // b[j] = diagRe[j] + i*diagIm[j]
      // c = offRe + i*offIm (same for all j)
      //
      // Standard Thomas: forward sweep modifies b and d.

      // Let me redo this with the standard approach:
      break
    }

    // Redo: standard Thomas algorithm for tridiagonal A*x = rhs
    // A has: sub-diagonal = off, diagonal = diag[j], super-diagonal = off
    // Working with modified diagonal and RHS

    // Copy diagonal into scratch (we'll modify it)
    const modDiagRe = this.cPrimeRe
    const modDiagIm = this.cPrimeIm
    const modRhsRe = this.dPrimeRe
    const modRhsIm = this.dPrimeIm

    // Initialize
    for (let j = 0; j < N; j++) {
      modDiagRe[j] = this.diagRe[j]!
      modDiagIm[j] = this.diagIm[j]!
      modRhsRe[j] = this.rhsRe[j]!
      modRhsIm[j] = this.rhsIm[j]!
    }

    // Forward sweep: for j = 1 to N-1
    for (let j = 1; j < N - 1; j++) {
      // m = off / modDiag[j-1]
      const dRe = modDiagRe[j - 1]!
      const dIm = modDiagIm[j - 1]!
      const dNorm = dRe * dRe + dIm * dIm
      if (dNorm < 1e-30) continue

      // m = (offRe + i*offIm) / (dRe + i*dIm)
      const mRe = (this.offRe * dRe + this.offIm * dIm) / dNorm
      const mIm = (this.offIm * dRe - this.offRe * dIm) / dNorm

      // modDiag[j] -= m * off (super-diagonal at j-1)
      modDiagRe[j] = modDiagRe[j]! - (mRe * this.offRe - mIm * this.offIm)
      modDiagIm[j] = modDiagIm[j]! - (mRe * this.offIm + mIm * this.offRe)

      // modRhs[j] -= m * modRhs[j-1]
      modRhsRe[j] = modRhsRe[j]! - (mRe * modRhsRe[j - 1]! - mIm * modRhsIm[j - 1]!)
      modRhsIm[j] = modRhsIm[j]! - (mRe * modRhsIm[j - 1]! + mIm * modRhsRe[j - 1]!)
    }

    // Back substitution: x[N-2] = modRhs[N-2] / modDiag[N-2], then backwards
    // Boundary: psi[0] = 0, psi[N-1] = 0
    psiRe[0] = 0; psiIm[0] = 0
    psiRe[N - 1] = 0; psiIm[N - 1] = 0

    // x[N-2]
    {
      const j = N - 2
      const dRe = modDiagRe[j]!
      const dIm = modDiagIm[j]!
      const dNorm = dRe * dRe + dIm * dIm
      psiRe[j] = (modRhsRe[j]! * dRe + modRhsIm[j]! * dIm) / dNorm
      psiIm[j] = (modRhsIm[j]! * dRe - modRhsRe[j]! * dIm) / dNorm
    }

    for (let j = N - 3; j >= 1; j--) {
      // x[j] = (modRhs[j] - off * x[j+1]) / modDiag[j]
      const xpRe = psiRe[j + 1]!
      const xpIm = psiIm[j + 1]!
      const numRe = modRhsRe[j]! - (this.offRe * xpRe - this.offIm * xpIm)
      const numIm = modRhsIm[j]! - (this.offRe * xpIm + this.offIm * xpRe)

      const dRe = modDiagRe[j]!
      const dIm = modDiagIm[j]!
      const dNorm = dRe * dRe + dIm * dIm
      psiRe[j] = (numRe * dRe + numIm * dIm) / dNorm
      psiIm[j] = (numIm * dRe - numRe * dIm) / dNorm
    }
  }

  /**
   * Advance by multiple time steps.
   */
  evolve(psiRe: Float64Array, psiIm: Float64Array, numSteps: number): void {
    for (let i = 0; i < numSteps; i++) {
      this.step(psiRe, psiIm)
    }
  }
}
