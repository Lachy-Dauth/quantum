# Interactive Simulator Components -- Technical Specification

**Version:** 1.0  
**Date:** 2026-04-13  
**Status:** Draft  
**Stack:** React 18+ / TypeScript 5+ / Tailwind CSS 3+ / KaTeX / MDX  
**Target runtime:** Modern evergreen browsers (Chrome, Firefox, Safari, Edge). No WASM. Pure TypeScript.

---

## Table of Contents

1. [Shared Core: Complex Linear Algebra Engine](#1-shared-core-complex-linear-algebra-engine)
2. [Qubit Circuit Simulator](#2-qubit-circuit-simulator)
3. [Stern-Gerlach Simulator](#3-sterngerlach-simulator)
4. [CHSH Inequality Simulator](#4-chsh-inequality-simulator)
5. [1D Schrodinger Simulator](#5-1d-schrodinger-simulator)
6. [Performance Budgets](#6-performance-budgets)
7. [Test Plan](#7-test-plan)

---

## 1. Shared Core: Complex Linear Algebra Engine

This module (`@core/linalg`) is a dependency of every simulator. It provides complex number arithmetic, vector and matrix types, standard quantum gates, and measurement primitives. Everything lives in pure TypeScript with no native or WASM dependencies.

### 1.1 Data Model

#### 1.1.1 Complex Number

```typescript
/**
 * A complex number stored as a pair of IEEE 754 doubles.
 * Boxed representation used at API boundaries; hot inner loops
 * should work directly on parallel real/imag Float64Arrays.
 */
interface Complex {
  readonly re: number;
  readonly im: number;
}
```

Factory and convenience:

```typescript
function complex(re: number, im?: number): Complex;
function fromPolar(r: number, theta: number): Complex;

const ZERO: Complex;   // { re: 0, im: 0 }
const ONE: Complex;    // { re: 1, im: 0 }
const I: Complex;      // { re: 0, im: 1 }
const NEG_I: Complex;  // { re: 0, im: -1 }
```

#### 1.1.2 Vector (StateVector)

```typescript
/**
 * Dense column vector in C^n.
 * Internally stored as two parallel Float64Arrays for SIMD-friendly access.
 */
interface StateVector {
  /** Dimension of the vector (2^n for n qubits). */
  readonly dim: number;
  /** Real parts, length = dim. */
  readonly real: Float64Array;
  /** Imaginary parts, length = dim. */
  readonly imag: Float64Array;
}
```

Why parallel arrays instead of `Complex[]`: avoids per-element object allocation, improves cache locality, and allows future SIMD intrinsics if browser support lands. A `Complex[]` convenience wrapper can be provided for small vectors used in display code.

#### 1.1.3 Dense Matrix

```typescript
/**
 * Dense matrix in C^{m x n}, stored in row-major order
 * as two parallel Float64Arrays each of length m*n.
 */
interface DenseMatrix {
  readonly rows: number;
  readonly cols: number;
  readonly real: Float64Array;
  readonly imag: Float64Array;
}
```

Element access helper:

```typescript
function mget(m: DenseMatrix, r: number, c: number): Complex {
  const idx = r * m.cols + c;
  return { re: m.real[idx], im: m.imag[idx] };
}

function mset(m: DenseMatrix, r: number, c: number, v: Complex): void {
  const idx = r * m.cols + c;
  m.real[idx] = v.re;
  m.imag[idx] = v.im;
}
```

#### 1.1.4 Sparse Matrix (COO + CSR hybrid)

Used for the Schrodinger simulator's Hamiltonian and for operators in systems above 4 qubits where most entries are zero.

```typescript
/**
 * Sparse matrix in Compressed Sparse Row format.
 * Stored as parallel typed arrays for performance.
 */
interface SparseMatrix {
  readonly rows: number;
  readonly cols: number;
  /** Length = rows + 1. rowPtr[i] is the index into colIdx/valRe/valIm
      where row i begins. */
  readonly rowPtr: Uint32Array;
  /** Column indices of non-zero entries. */
  readonly colIdx: Uint32Array;
  /** Real parts of non-zero entries. */
  readonly valRe: Float64Array;
  /** Imaginary parts of non-zero entries. */
  readonly valIm: Float64Array;
  /** Total number of stored entries. */
  readonly nnz: number;
}
```

Builder utility for constructing sparse matrices entry-by-entry before finalising into CSR:

```typescript
interface SparseMatrixBuilder {
  set(row: number, col: number, value: Complex): void;
  add(row: number, col: number, value: Complex): void;
  build(): SparseMatrix;
}

function createSparseBuilder(rows: number, cols: number): SparseMatrixBuilder;
```

### 1.2 Operations

Every function below is a named export from `@core/linalg`. Pseudocode is given alongside the TypeScript signature.

#### 1.2.1 Complex Arithmetic

```typescript
function cadd(a: Complex, b: Complex): Complex;
// return { re: a.re + b.re, im: a.im + b.im }

function csub(a: Complex, b: Complex): Complex;
// return { re: a.re - b.re, im: a.im - b.im }

function cmul(a: Complex, b: Complex): Complex;
// return { re: a.re*b.re - a.im*b.im, im: a.re*b.im + a.im*b.re }

function cdiv(a: Complex, b: Complex): Complex;
// denom = b.re*b.re + b.im*b.im
// if denom === 0: throw DivisionByZeroError
// return { re: (a.re*b.re + a.im*b.im)/denom,
//          im: (a.im*b.re - a.re*b.im)/denom }

function conj(a: Complex): Complex;
// return { re: a.re, im: -a.im }

function cabs(a: Complex): number;
// return Math.sqrt(a.re*a.re + a.im*a.im)
// For squared modulus (avoids sqrt): cabsSq(a) = a.re*a.re + a.im*a.im

function cabsSq(a: Complex): number;
// return a.re*a.re + a.im*a.im

function cphase(a: Complex): number;
// return Math.atan2(a.im, a.re)

function fromPolar(r: number, theta: number): Complex;
// return { re: r * Math.cos(theta), im: r * Math.sin(theta) }

function cexp(a: Complex): Complex;
// e^(a.re + i*a.im) = e^a.re * (cos(a.im) + i*sin(a.im))
// return { re: Math.exp(a.re)*Math.cos(a.im),
//          im: Math.exp(a.re)*Math.sin(a.im) }

function csqrt(a: Complex): Complex;
// r = cabs(a), theta = cphase(a)
// return fromPolar(Math.sqrt(r), theta / 2)

function cneg(a: Complex): Complex;
// return { re: -a.re, im: -a.im }

function cscale(a: Complex, s: number): Complex;
// return { re: a.re * s, im: a.im * s }

function ceq(a: Complex, b: Complex, eps?: number): boolean;
// eps defaults to 1e-12
// return Math.abs(a.re - b.re) < eps && Math.abs(a.im - b.im) < eps
```

#### 1.2.2 Vector Operations

All vector operations work on `StateVector`. Functions that produce a new vector allocate fresh typed arrays; in-place variants suffixed `_ip` mutate the first argument.

```typescript
function vecAdd(u: StateVector, v: StateVector): StateVector;
// assert u.dim === v.dim
// out.real[i] = u.real[i] + v.real[i]  for all i
// out.imag[i] = u.imag[i] + v.imag[i]  for all i

function vecScale(v: StateVector, c: Complex): StateVector;
// out.real[i] = v.real[i]*c.re - v.imag[i]*c.im
// out.imag[i] = v.real[i]*c.im + v.imag[i]*c.re

function vecScaleReal(v: StateVector, s: number): StateVector;
// out.real[i] = v.real[i] * s
// out.imag[i] = v.imag[i] * s

function innerProduct(u: StateVector, v: StateVector): Complex;
// <u|v> = sum_i conj(u_i) * v_i
// result.re = sum_i (u.real[i]*v.real[i] + u.imag[i]*v.imag[i])
// result.im = sum_i (u.real[i]*v.imag[i] - u.imag[i]*v.real[i])

function vecNorm(v: StateVector): number;
// return Math.sqrt(innerProduct(v, v).re)
// (imaginary part of <v|v> is always 0 for valid input)

function vecNormalize(v: StateVector): StateVector;
// n = vecNorm(v)
// if n < 1e-15: throw ZeroVectorError
// return vecScaleReal(v, 1/n)

function tensorProduct(u: StateVector, v: StateVector): StateVector;
// out.dim = u.dim * v.dim
// for i in 0..u.dim-1:
//   for j in 0..v.dim-1:
//     idx = i * v.dim + j
//     // (u_i) * (v_j) using complex multiplication
//     out.real[idx] = u.real[i]*v.real[j] - u.imag[i]*v.imag[j]
//     out.imag[idx] = u.real[i]*v.imag[j] + u.imag[i]*v.real[j]

function vecFromArray(components: Complex[]): StateVector;
// Convenience: build a StateVector from a Complex array.

function vecToArray(v: StateVector): Complex[];
// Convenience: extract a Complex array from a StateVector.

function vecZero(dim: number): StateVector;
// All-zeros vector.

function basisState(dim: number, index: number): StateVector;
// Computational basis state |index> in C^dim.
// real[index] = 1, all other entries 0.
```

#### 1.2.3 Matrix Operations

```typescript
function matAdd(A: DenseMatrix, B: DenseMatrix): DenseMatrix;
// Element-wise addition. Dimensions must match.

function matScale(A: DenseMatrix, c: Complex): DenseMatrix;
// Every element multiplied by c.

function matMul(A: DenseMatrix, B: DenseMatrix): DenseMatrix;
// Standard matrix multiplication. A.cols must equal B.rows.
// C[i][j] = sum_k A[i][k] * B[k][j]
// For each element C_{ij}:
//   re = sum_k (A_re[i,k]*B_re[k,j] - A_im[i,k]*B_im[k,j])
//   im = sum_k (A_re[i,k]*B_im[k,j] + A_im[i,k]*B_re[k,j])

function matVecMul(A: DenseMatrix, v: StateVector): StateVector;
// Matrix-vector product. A.cols must equal v.dim.
// out[i] = sum_j A[i][j] * v[j]
// Use fused multiply-add pattern on real/imag arrays:
//   out.real[i] = sum_j (A.real[i*cols+j]*v.real[j] - A.imag[i*cols+j]*v.imag[j])
//   out.imag[i] = sum_j (A.real[i*cols+j]*v.imag[j] + A.imag[i*cols+j]*v.real[j])

function adjoint(A: DenseMatrix): DenseMatrix;
// A^dagger: transpose and conjugate.
// B[i][j] = conj(A[j][i])

function trace(A: DenseMatrix): Complex;
// sum of diagonal: sum_i A[i][i]

function determinant2x2(A: DenseMatrix): Complex;
// A must be 2x2.
// det = A[0][0]*A[1][1] - A[0][1]*A[1][0]

function determinant3x3(A: DenseMatrix): Complex;
// Cofactor expansion along first row.
// det = A[0][0]*(A[1][1]*A[2][2] - A[1][2]*A[2][1])
//     - A[0][1]*(A[1][0]*A[2][2] - A[1][2]*A[2][0])
//     + A[0][2]*(A[1][0]*A[2][1] - A[1][1]*A[2][0])

function kronecker(A: DenseMatrix, B: DenseMatrix): DenseMatrix;
// Tensor (Kronecker) product.
// Result is (A.rows*B.rows) x (A.cols*B.cols).
// C[i*B.rows + k][j*B.cols + l] = A[i][j] * B[k][l]
// for i in 0..A.rows-1, j in 0..A.cols-1,
//     k in 0..B.rows-1, l in 0..B.cols-1

function matExp(A: DenseMatrix, order?: number): DenseMatrix;
// Matrix exponential e^A via scaling-and-squaring with Pade approximant.
// 1. Compute s = max(0, ceil(log2(||A||_inf))) so that ||A/2^s||_inf <= 1
// 2. B = A / 2^s
// 3. Compute [p,q] Pade approximant of e^B:
//    For order p = 6 (default):
//      N = I + B/2 + B^2*c2 + B^3*c3 + ... (numerator polynomial)
//      D = I - B/2 + B^2*c2 - B^3*c3 + ... (denominator polynomial)
//      where c_k are Pade coefficients
//    e^B approx = D^{-1} * N
// 4. Repeated squaring: e^A = (e^B)^{2^s}
//
// For small matrices (2x2): use the closed-form:
//   e^A = e^{tr(A)/2} * [ cosh(s)*I + (sinh(s)/s)*(A - tr(A)/2 * I) ]
//   where s = sqrt(det(A - tr(A)/2 * I)) -- for 2x2 this is always computable.
//
// Maximum supported dimension: 64x64 (6-qubit operator).
// Above 8x8, fall back to Taylor series truncated at order 20 with
// convergence check (||term|| < 1e-14 * ||accumulated||).
//
// Alternative for Hermitian H: e^{-iHt} via eigendecomposition for small dim.

function matIdentity(n: number): DenseMatrix;
// n x n identity matrix.

function matFromArray(rows: number, cols: number, data: Complex[][]): DenseMatrix;
// Convenience: build a DenseMatrix from a 2D Complex array.

function matInverse2x2(A: DenseMatrix): DenseMatrix;
// 2x2 matrix inverse via det.
// A^{-1} = (1/det) * [[A[1][1], -A[0][1]], [-A[1][0], A[0][0]]]
```

#### 1.2.4 Sparse Matrix Operations

```typescript
function sparseMatVecMul(A: SparseMatrix, v: StateVector): StateVector;
// For each row i:
//   for idx in rowPtr[i]..rowPtr[i+1]-1:
//     j = colIdx[idx]
//     out[i] += (valRe[idx] + i*valIm[idx]) * v[j]

function sparseToDense(A: SparseMatrix): DenseMatrix;
function denseToSparse(A: DenseMatrix, threshold?: number): SparseMatrix;
// threshold defaults to 1e-15; entries with |value| < threshold are dropped.
```

#### 1.2.5 Measurement

```typescript
/**
 * Compute the probability of outcome corresponding to projector P
 * when system is in state |psi>.
 * P(outcome) = <psi| P |psi>
 */
function measurementProbability(
  state: StateVector,
  projector: DenseMatrix
): number;
// prob = real part of <psi| P |psi>
// = innerProduct(state, matVecMul(projector, state)).re
// Clamp to [0, 1] to handle floating point drift.

/**
 * Perform a projective measurement on the full system.
 * projectors: array of projectors P_k summing to I.
 * Returns { outcome: k, postState: normalised post-measurement state }.
 * Uses provided RNG or Math.random.
 */
function projectiveMeasurement(
  state: StateVector,
  projectors: DenseMatrix[],
  rng?: () => number
): { outcome: number; postState: StateVector; probability: number };
// 1. For each projector P_k, compute p_k = <psi|P_k|psi>
// 2. Draw r ~ Uniform[0,1) from rng
// 3. Find k such that sum_{j<k} p_j <= r < sum_{j<=k} p_j
// 4. postState = normalize(P_k |psi>)
// 5. Return { outcome: k, postState, probability: p_k }

/**
 * Measure qubit `qubitIndex` in the computational basis within
 * an n-qubit system.
 * Returns outcome (0 or 1) and post-measurement state.
 */
function measureQubit(
  state: StateVector,
  numQubits: number,
  qubitIndex: number,
  rng?: () => number
): { outcome: number; postState: StateVector; probability: number };
// Build projectors |0><0| and |1><1| on the target qubit,
// tensored with I on all other qubits.
// Equivalently, iterate over basis states:
//   p0 = sum_{basis states with bit qubitIndex == 0} |amplitude|^2
//   p1 = 1 - p0
// Draw outcome from {0,1} with probabilities {p0, p1}.
// Collapse: zero out amplitudes inconsistent with outcome, renormalise.

/**
 * Partial measurement: measure a subset of qubits.
 */
function measureQubits(
  state: StateVector,
  numQubits: number,
  qubitIndices: number[],
  rng?: () => number
): { outcomes: number[]; postState: StateVector; probability: number };
```

#### 1.2.6 Partial Trace

```typescript
/**
 * Compute the reduced density matrix by tracing out specified subsystems.
 * 
 * subsystemDims: dimensions of each subsystem, e.g. [2, 2, 2] for 3 qubits.
 * traceOutIndices: which subsystems to trace out (0-indexed).
 * state: pure state vector of the full system.
 * 
 * Returns a DenseMatrix (density matrix) of dimension
 * product(subsystemDims[i] for i NOT in traceOutIndices).
 */
function partialTrace(
  state: StateVector,
  subsystemDims: number[],
  traceOutIndices: number[]
): DenseMatrix;
// 1. Compute density matrix rho = |psi><psi| -- but do NOT materialise
//    the full matrix. Instead compute the reduced density matrix directly.
// 2. Let kept = indices NOT in traceOutIndices.
// 3. Let d_kept = product of dims for kept subsystems.
// 4. Let d_traced = product of dims for traced subsystems.
// 5. For each pair (i, j) in 0..d_kept-1:
//    rho_reduced[i][j] = sum_{k in 0..d_traced-1}
//      conj(psi[multiIndex(i, k)]) * psi[multiIndex(j, k)]
//    where multiIndex maps (kept_index, traced_index) -> flat index
//    by interleaving according to original subsystem ordering.

/**
 * Partial trace from a density matrix (not just pure state).
 */
function partialTraceDensity(
  rho: DenseMatrix,
  subsystemDims: number[],
  traceOutIndices: number[]
): DenseMatrix;
```

#### 1.2.7 Gate Application

```typescript
/**
 * Apply a gate to specified qubit(s) within an n-qubit system.
 *
 * Instead of building the full 2^n x 2^n matrix, we directly compute
 * the output state vector by iterating over basis states and applying
 * the gate to the relevant qubit subspace.
 *
 * gate: the gate matrix (2x2 for single-qubit, 4x4 for two-qubit, etc.)
 * targets: qubit indices the gate acts on (0-indexed, qubit 0 is MSB).
 * numQubits: total number of qubits in the system.
 * state: current state vector (dimension 2^numQubits).
 */
function applyGate(
  gate: DenseMatrix,
  targets: number[],
  numQubits: number,
  state: StateVector
): StateVector;
// OPTIMISED SINGLE-QUBIT CASE (targets.length === 1):
//   Let t = targets[0], stride = 2^(numQubits - t - 1)
//   For each pair of basis states differing only in bit t:
//     Let i0 = basis state with bit t = 0
//     Let i1 = basis state with bit t = 1
//     [out[i0], out[i1]] = gate * [state[i0], state[i1]]
//   This is O(2^n) -- same as the state vector size, no matrix construction.
//
// OPTIMISED TWO-QUBIT CASE (targets.length === 2):
//   Similar approach: iterate over groups of 4 amplitudes corresponding
//   to the 4 combinations of the two target qubits, apply the 4x4 gate
//   submatrix to each group.
//
// GENERAL CASE:
//   Build the full operator via Kronecker products:
//     U_full = I_{2^a} (x) gate (x) I_{2^b}
//   adjusted for non-adjacent targets via SWAP gates.
//   Then matVecMul(U_full, state).
//   Only used for 3-qubit gates (Toffoli) which are rare.

/**
 * Build the full 2^n x 2^n operator for a gate on specified targets.
 * Useful for the "show matrix" feature in the UI.
 */
function buildFullOperator(
  gate: DenseMatrix,
  targets: number[],
  numQubits: number
): DenseMatrix;
```

### 1.3 Predefined Constants

All of these are frozen `DenseMatrix` or `StateVector` instances created at module load time.

#### Pauli Matrices

```typescript
const PAULI_I: DenseMatrix;  // [[1,0],[0,1]]
const PAULI_X: DenseMatrix;  // [[0,1],[1,0]]
const PAULI_Y: DenseMatrix;  // [[0,-i],[i,0]]
const PAULI_Z: DenseMatrix;  // [[1,0],[0,-1]]
```

#### Standard Gates

```typescript
const GATE_H: DenseMatrix;
// (1/sqrt(2)) * [[1,1],[1,-1]]

const GATE_S: DenseMatrix;
// [[1,0],[0,i]]

const GATE_T: DenseMatrix;
// [[1,0],[0,e^{i*pi/4}]]

const GATE_S_DAG: DenseMatrix;
// [[1,0],[0,-i]]

const GATE_T_DAG: DenseMatrix;
// [[1,0],[0,e^{-i*pi/4}]]

const GATE_CNOT: DenseMatrix;
// 4x4: |00><00| + |01><01| + |10><11| + |11><10|
// [[1,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,1,0]]

const GATE_CZ: DenseMatrix;
// 4x4: diag(1,1,1,-1)

const GATE_SWAP: DenseMatrix;
// 4x4: [[1,0,0,0],[0,0,1,0],[0,1,0,0],[0,0,0,1]]

const GATE_TOFFOLI: DenseMatrix;
// 8x8: identity except |110><111| + |111><110|

// Parameterised gate factories:
function gateRx(theta: number): DenseMatrix;
// [[cos(t/2), -i*sin(t/2)], [-i*sin(t/2), cos(t/2)]]

function gateRy(theta: number): DenseMatrix;
// [[cos(t/2), -sin(t/2)], [sin(t/2), cos(t/2)]]

function gateRz(theta: number): DenseMatrix;
// [[e^{-it/2}, 0], [0, e^{it/2}]]

function gateU(theta: number, phi: number, lambda: number): DenseMatrix;
// General single-qubit unitary:
// [[cos(t/2), -e^{i*lam}*sin(t/2)],
//  [e^{i*phi}*sin(t/2), e^{i*(phi+lam)}*cos(t/2)]]

function gatePhase(phi: number): DenseMatrix;
// [[1, 0], [0, e^{i*phi}]]
```

#### Standard States

```typescript
const STATE_ZERO: StateVector;      // |0> = [1, 0]
const STATE_ONE: StateVector;       // |1> = [0, 1]
const STATE_PLUS: StateVector;      // |+> = [1/sqrt(2), 1/sqrt(2)]
const STATE_MINUS: StateVector;     // |-> = [1/sqrt(2), -1/sqrt(2)]
const STATE_PLUS_I: StateVector;    // |i> = [1/sqrt(2), i/sqrt(2)]
const STATE_MINUS_I: StateVector;   // |-i> = [1/sqrt(2), -i/sqrt(2)]

// Bell states (2-qubit):
const BELL_PHI_PLUS: StateVector;   // (|00> + |11>) / sqrt(2)
const BELL_PHI_MINUS: StateVector;  // (|00> - |11>) / sqrt(2)
const BELL_PSI_PLUS: StateVector;   // (|01> + |10>) / sqrt(2)
const BELL_PSI_MINUS: StateVector;  // (|01> - |10>) / sqrt(2)
```

### 1.4 Utility Functions

```typescript
/**
 * Convert a qubit state to its Bloch sphere coordinates (theta, phi)
 * or Cartesian (x, y, z).
 * Only valid for single-qubit pure states.
 */
function stateToBloch(state: StateVector): { x: number; y: number; z: number };
// Write state as alpha|0> + beta|1>.
// Remove global phase: multiply by e^{-i*arg(alpha)} so alpha is real and >= 0.
// Then alpha = cos(theta/2), beta = sin(theta/2) * e^{i*phi}.
// x = sin(theta)*cos(phi) = 2*Re(conj(alpha)*beta)
// y = sin(theta)*sin(phi) = 2*Im(conj(alpha)*beta)
// z = cos(theta) = |alpha|^2 - |beta|^2

/**
 * Convert Bloch coordinates back to a state vector.
 */
function blochToState(x: number, y: number, z: number): StateVector;

/**
 * Compute the reduced single-qubit state for a given qubit in an n-qubit system.
 * Returns the Bloch vector of the reduced density matrix.
 */
function reducedBlochVector(
  state: StateVector,
  numQubits: number,
  qubitIndex: number
): { x: number; y: number; z: number; purity: number };
// 1. Compute reduced density matrix rho via partialTrace.
// 2. x = Tr(rho * sigma_x), y = Tr(rho * sigma_y), z = Tr(rho * sigma_z)
// 3. purity = Tr(rho^2). purity < 1 means the qubit is entangled with others.

/**
 * Seeded pseudo-random number generator for reproducible measurements.
 * Uses xoshiro256** algorithm.
 */
function createRng(seed: number): () => number;

/**
 * Format a complex number for display.
 */
function formatComplex(c: Complex, precision?: number): string;
// e.g. "0.707 + 0.707i", "-1", "i", "0"

/**
 * Format a state vector for display in ket notation.
 */
function formatStateKet(
  state: StateVector,
  numQubits: number,
  threshold?: number
): string;
// threshold for omitting near-zero amplitudes, default 1e-10
// e.g. "0.707|00> + 0.707|11>"
```

### 1.5 Performance Considerations

1. **Maximum practical size:** 6 qubits = 64-dimensional state vector (512 bytes for real+imag), 64x64 matrices (32 KB). This is well within L1 cache on any modern CPU.

2. **Frame budget:** A single gate application on a 6-qubit state must complete in under 16ms. The optimised `applyGate` function (which does not materialise the full operator) performs 64 complex multiply-adds for a single-qubit gate, or 64 groups of 4x4 matmul for a two-qubit gate. Both are orders of magnitude under 1ms.

3. **Pre-computed gates:** All constant gate matrices (`GATE_H`, `GATE_CNOT`, etc.) are allocated once at module initialisation. Parameterised gates (`gateRx(theta)`) should be cached if the angle has not changed since the last call; use a small LRU cache (capacity 16) keyed on `(gateType, theta)`.

4. **Float64Array usage:** All matrix and vector storage uses `Float64Array` for typed memory, better GC behaviour (no per-element boxing), and potential future SIMD benefits.

5. **Avoid GC pressure in hot paths:** The `applyGate` function should accept an optional pre-allocated output `StateVector` to avoid allocation on every gate application during animation.

6. **Web Workers:** For batch simulation (running a circuit 10,000 times for measurement statistics), offload to a Web Worker. The core linalg module must be importable in a Worker context (no DOM dependencies).

---

## 2. Qubit Circuit Simulator

### 2.1 Data Model

```typescript
/** Identifies a gate type. */
type GateType =
  | 'I' | 'X' | 'Y' | 'Z' | 'H' | 'S' | 'T' | 'S_DAG' | 'T_DAG'
  | 'RX' | 'RY' | 'RZ' | 'PHASE' | 'U'
  | 'CNOT' | 'CZ' | 'SWAP'
  | 'TOFFOLI'
  | 'MEASURE'
  | 'BARRIER'
  | 'CUSTOM';

/** A gate instance placed on the circuit. */
interface Gate {
  /** Unique id for this gate placement (used for drag-and-drop). */
  id: string;
  type: GateType;
  /** Qubit wire indices this gate acts on. Length 1 for single-qubit gates,
      2 for two-qubit, 3 for Toffoli. For CNOT: [control, target].
      For Toffoli: [control1, control2, target]. */
  targets: number[];
  /** Parameters for parameterised gates. */
  params?: {
    theta?: number;
    phi?: number;
    lambda?: number;
  };
  /** Column (time step) in the circuit. Gates in the same column execute
      simultaneously if they act on disjoint qubits. */
  column: number;
  /** Display label override. */
  label?: string;
  /** For CUSTOM gate: the unitary matrix. */
  customMatrix?: DenseMatrix;
}

/** The full circuit definition. */
interface Circuit {
  numQubits: number;
  gates: Gate[];
  /** Number of columns (time steps). Derived from gates but cached. */
  numColumns: number;
}

/** A snapshot of the quantum state at a particular point in the circuit. */
interface CircuitSnapshot {
  /** Column index (0 = initial state, 1 = after first column, etc.) */
  column: number;
  /** The full state vector. */
  state: StateVector;
  /** Bloch vectors for each qubit's reduced state. */
  blochVectors: Array<{ x: number; y: number; z: number; purity: number }>;
  /** If a measurement occurred, the outcome for each measured qubit. */
  measurementOutcomes?: Map<number, number>;
}

/** Result of simulating the full circuit. */
interface SimulationResult {
  snapshots: CircuitSnapshot[];
  finalState: StateVector;
}

/** Result of batch simulation (many runs). */
interface BatchResult {
  /** Map from measurement outcome (as binary string, e.g. "011") to count. */
  counts: Map<string, number>;
  totalRuns: number;
}

/** Bloch sphere vector representation. */
interface BlochVector {
  x: number;
  y: number;
  z: number;
  /** How pure the qubit's reduced state is. 1 = pure, 0.5 = maximally mixed. */
  purity: number;
}
```

### 2.2 Component API

```typescript
interface QubitSimulatorProps {
  /** Number of qubit wires (1-6). */
  qubits: number;
  /** Initial state specification. Supports:
   *  - Ket strings: "|00>", "|+0>", "|01>"
   *  - Named states: "bell_phi_plus", "bell_psi_minus", "ghz_3"
   *  - Custom: a StateVector object passed directly.
   *  Defaults to |0...0>. */
  initialState?: string | StateVector;
  /** Pre-loaded circuit. If provided, these gates are placed on the circuit
   *  at mount time. */
  circuit?: Gate[];
  /** If true, user cannot add/remove/move gates. Used for demonstrations. */
  readOnly?: boolean;
  /** Show the Bloch sphere panel (default true for 1-2 qubits, false for 3+). */
  showBlochSphere?: boolean;
  /** Show the state vector table (default true). */
  showStateVector?: boolean;
  /** Show the matrix popup on gate hover (default true). */
  showMatrixView?: boolean;
  /** Initial state of the "show me the algebra" toggle (default false). */
  showAlgebra?: boolean;
  /** Highlight specific gate indices (0-based) in the circuit with a
   *  coloured outline. Used in lessons to draw attention to specific gates. */
  highlightGates?: number[];
  /** Callback fired whenever the state changes (gate added/removed, step
   *  advanced, etc.). Useful for problem set verification. */
  onStateChange?: (state: StateVector, circuit: Gate[]) => void;
  /** Maximum number of time steps (columns) allowed. Default 20. */
  maxSteps?: number;
  /** Target state for "match this state" challenges. When provided, the UI
   *  shows a fidelity meter (|<target|current>|^2) and a success indicator
   *  when fidelity exceeds 0.999. */
  targetState?: StateVector;
  /** Custom verification function for problem sets. Receives the current
   *  circuit and returns { correct: boolean, message?: string }. */
  verifyCircuit?: (circuit: Gate[]) => { correct: boolean; message?: string };
  /** Which basis to display the state vector in.
   *  "computational" (default), "hadamard", or "bell" (2-qubit only). */
  displayBasis?: 'computational' | 'hadamard' | 'bell';
  /** If true, show measurement statistics panel (default true when circuit
   *  contains MEASURE gates). */
  showStatistics?: boolean;
  /** Number of runs for batch measurement mode. Default 1000. */
  batchRuns?: number;
  /** CSS class name for the outer container. */
  className?: string;
}
```

### 2.3 UI Layout

The simulator occupies a full-width content block within the MDX lesson. Minimum width: 720px. On screens below 720px, the layout stacks vertically.

#### Desktop Layout (>= 1024px)

```
+-----------------------------------------------------------------------+
| TOOLBAR                                                               |
| [Step Back] [Step Forward] [Run All] [Reset] [Speed: ___]            |
| [Basis: Computational v] [Show Algebra: toggle] [Batch: 1000 runs]   |
+-----------------------------------------------------------------------+
|                                |                                      |
|  GATE PALETTE (left sidebar)   |  CIRCUIT AREA (centre)              |
|  +-----------+                 |                                      |
|  | Single    |                 |  q0: --|H|----*------[M]---          |
|  | I  X  Y  Z|                 |              |                       |
|  | H  S  T   |                 |  q1: --------|X|----[M]---          |
|  | S+ T+     |                 |                                      |
|  |           |                 |  q2: --------[H]----[M]---          |
|  | Param     |                 |                                      |
|  | Rx Ry Rz  |                 +--------------------------------------+
|  | U(t,p,l)  |                 |                                      |
|  |           |                 |  STATE VECTOR TABLE                  |
|  | Multi     |                 |  Basis  | Amplitude    | Prob | Phase|
|  | CNOT CZ   |                 |  |000>  | 0.707+0i     | 50%  | 0   |
|  | SWAP      |                 |  |111>  | 0.707+0i     | 50%  | 0   |
|  | TOFF      |                 |  ...                                 |
|  |           |                 +--------------------------------------+
|  | Measure   |
|  | [M]       |                  BLOCH SPHERES (below or right of state)
|  +-----------+                  [sphere q0] [sphere q1] [sphere q2]
|                                  (each ~120x120px, rendered via Canvas2D)
+-----------------------------------------------------------------------+
| ALGEBRA PANEL (collapsible, below everything)                         |
| Step 1: H|0> = (1/sqrt(2))(|0> + |1>)                               |
| Step 2: CNOT_{01} (1/sqrt(2))(|0>+|1>) |0> = (1/sqrt(2))(|00>+|11>)|
| (rendered via KaTeX)                                                  |
+-----------------------------------------------------------------------+
```

#### Component Sections in Detail

**Toolbar:**
- Horizontal bar at the top.
- Buttons: Step Back (left arrow icon), Step Forward (right arrow icon), Run All (play icon), Reset (rewind icon).
- Speed slider: controls animation speed for gate-by-gate mode (100ms to 2000ms per step).
- Basis dropdown: "Computational", "Hadamard", "Bell" (the last only if 2 qubits).
- "Show Algebra" toggle switch.
- "Batch Run" button with a number input for N.

**Gate Palette (left sidebar):**
- 160px wide, fixed position.
- Gates displayed as square tiles (40x40px) with the gate symbol inside.
- Organised in sections with dividers: "Single-Qubit", "Parameterised", "Multi-Qubit", "Measurement".
- Parameterised gates show a small "(theta)" label. Clicking a parameterised gate opens a popover with a slider (0 to 2*pi, step 0.01) and a numeric input field.
- Each tile is draggable (HTML5 drag-and-drop API or a library like `@dnd-kit/core`).

**Circuit Area (centre):**
- Horizontal wires, one per qubit, labelled q0..qN-1 on the left.
- Gates appear as boxes on the wires. Single-qubit gates: 40x40px box with label. Two-qubit gates: a vertical line connecting two wires with the gate symbol (circle-plus for CNOT target, dot for control). SWAP: two X marks connected by a line. Toffoli: two control dots and one circle-plus.
- Gates are snapped to a grid (each column is 60px wide).
- Drop zones between existing gates glow on drag-over.
- Clicking a placed gate opens a context menu: "Delete", "Edit Parameters" (if parameterised).
- A vertical "playhead" line shows the current step in step-through mode.
- Right-click or long-press on a gate shows the matrix popup.

**Matrix Popup:**
- Positioned above the hovered gate.
- Renders the gate matrix as a grid of complex numbers.
- For multi-qubit gates, shows the full 4x4 or 8x8 matrix.
- Rendered using KaTeX for proper mathematical formatting.
- Dismisses on mouse leave or tap outside.

**State Vector Table:**
- Below the circuit area (or to the right on wide screens).
- Columns: Basis State (ket notation), Amplitude (complex number), Probability (percentage with bar chart), Phase (angle in radians and as a coloured phase disc).
- Rows with probability below 0.001 are collapsed under a "show more" toggle.
- Table updates in real-time as the user steps through the circuit.
- When step-through mode is active, the table highlights which amplitudes changed at the current step.

**Bloch Spheres:**
- Rendered using Canvas 2D or Three.js (prefer Canvas 2D to avoid dependency weight).
- Each sphere is 120x120px.
- Shows: wireframe sphere, x/y/z axes with labels, the Bloch vector as an arrow from origin to the surface.
- When the qubit is entangled (purity < 1), the arrow is shorter (does not reach the surface), and the arrow is semi-transparent. A text label below reads "purity: 0.XX".
- Animation: when a gate is applied, the Bloch vector smoothly rotates from old position to new position over 300ms (using `requestAnimationFrame` interpolation).

**Algebra Panel:**
- Collapsible panel at the bottom.
- Each circuit step is one line of LaTeX, rendered by KaTeX.
- Format: `Gate * |state_before> = |state_after>`
- Full matrix multiplication shown if the user expands a step.
- Scrollable if there are many steps.

#### Tablet Layout (720px - 1023px)

- Gate palette moves to a horizontal strip at the top (scrollable).
- Circuit area occupies full width.
- State vector table and Bloch spheres are in a tabbed panel below the circuit.
- Algebra panel is a slide-up drawer.

#### Below 720px

- A banner reads "For the best experience, please use a tablet or desktop device."
- The simulator still renders but in a simplified read-only view: circuit diagram + state vector table. No drag-and-drop.

### 2.4 Simulation Engine

```typescript
class CircuitSimulator {
  private circuit: Circuit;
  private numQubits: number;
  private snapshots: CircuitSnapshot[];
  private rng: () => number;

  constructor(numQubits: number, seed?: number);

  /** Set the initial state. */
  setInitialState(state: StateVector | string): void;

  /** Add a gate to the circuit. Returns the gate's assigned id. */
  addGate(gate: Omit<Gate, 'id'>): string;

  /** Remove a gate by id. */
  removeGate(id: string): void;

  /** Move a gate to a new column and/or new target qubits. */
  moveGate(id: string, newColumn: number, newTargets: number[]): void;

  /** Simulate the full circuit from initial state. Populates snapshots. */
  simulate(): SimulationResult;

  /** Get the state at a specific column (step). */
  getStateAtStep(column: number): CircuitSnapshot;

  /** Run the circuit `n` times with measurement, collecting statistics. */
  batchRun(n: number): BatchResult;

  /** Get the unitary matrix representation of the full circuit. */
  getCircuitUnitary(): DenseMatrix;

  /** Export circuit as QASM string. */
  toQASM(): string;

  /** Import circuit from QASM string. */
  fromQASM(qasm: string): void;
}
```

The `simulate()` method proceeds column by column. Within each column, gates on disjoint qubits can be applied in any order (they commute). The method stores a `CircuitSnapshot` after each column, enabling the step-through UI.

### 2.5 Algebra Generation

When "Show Algebra" is enabled, the simulator generates LaTeX strings for each step:

```typescript
interface AlgebraStep {
  column: number;
  latex: string;        // Full rendered equation
  latexExpanded: string; // With matrix entries written out
}

function generateAlgebra(
  circuit: Circuit,
  snapshots: CircuitSnapshot[]
): AlgebraStep[];
```

Example output for step 1 (H on qubit 0, 2-qubit system):

```latex
(H \otimes I)|00\rangle
= \frac{1}{\sqrt{2}}\begin{pmatrix}1&1\\1&-1\end{pmatrix}
  \otimes \begin{pmatrix}1&0\\0&1\end{pmatrix}
  \begin{pmatrix}1\\0\\0\\0\end{pmatrix}
= \frac{1}{\sqrt{2}}\begin{pmatrix}1\\0\\1\\0\end{pmatrix}
= \frac{1}{\sqrt{2}}(|00\rangle + |10\rangle)
```

### 2.6 Challenge / Problem Set Integration

When `targetState` is provided:
1. A "Target State" panel shows the target state in ket notation and as a state vector table.
2. A fidelity meter shows `F = |<target|current>|^2` as a progress bar (0% to 100%).
3. When F > 0.999, a success banner appears with a checkmark.

When `verifyCircuit` is provided:
1. A "Check" button appears in the toolbar.
2. Clicking it calls `verifyCircuit(circuit.gates)`.
3. The result is shown as a green checkmark + message (correct) or red X + message (incorrect).

---

## 3. Stern-Gerlach Simulator

### 3.1 Physics Model

A Stern-Gerlach apparatus measures the spin component of a spin-1/2 particle along an axis defined by a unit vector **n** = (sin(theta)*cos(phi), sin(theta)*sin(phi), cos(theta)).

The measurement operator is **S_n** = (hbar/2)(n_x * sigma_x + n_y * sigma_y + n_z * sigma_z).

Eigenvalues: +hbar/2 (spin-up along **n**) and -hbar/2 (spin-down along **n**).

Eigenstates:
- |+n> = cos(theta/2)|0> + e^{i*phi}*sin(theta/2)|1>
- |-n> = sin(theta/2)|0> - e^{i*phi}*cos(theta/2)|1>

where |0> = spin-up along z, |1> = spin-down along z.

Probability of measuring +n given state |psi>: P(+) = |<+n|psi>|^2.

### 3.2 Data Model

```typescript
/** Configuration of a single Stern-Gerlach magnet. */
interface SGApparatus {
  id: string;
  /** Measurement axis in spherical coordinates. */
  axis: {
    theta: number;  // polar angle from z-axis, [0, pi]
    phi: number;    // azimuthal angle in x-y plane, [0, 2*pi)
  };
  /** Which input beam feeds this apparatus.
   *  For the first apparatus: 'source'.
   *  For subsequent: { apparatusId: string, output: 'up' | 'down' }. */
  input: 'source' | { apparatusId: string; output: 'up' | 'down' };
  /** Whether the 'up' or 'down' output beam is blocked. null = neither blocked. */
  blocked: 'up' | 'down' | null;
}

/** Full configuration of the experiment. */
interface SGExperiment {
  /** Initial spin state of particles from the source. */
  initialState: StateVector;
  /** Chain of apparatuses. Max 4. */
  apparatuses: SGApparatus[];
}

/** Result for a single particle traversing the chain. */
interface SGSingleResult {
  /** For each apparatus, which output the particle took. */
  outcomes: Array<{
    apparatusId: string;
    output: 'up' | 'down';
    probability: number;
    stateAfter: StateVector;
  }>;
  /** Whether the particle was blocked at some apparatus. */
  blocked: boolean;
  blockedAt?: string; // apparatus id
  /** Final output: which detector the particle reached, or null if blocked. */
  finalDetector: string | null;
}

/** Accumulated statistics from batch mode. */
interface SGBatchResult {
  /** Count per final detector (detector identified by apparatus id + output). */
  detectorCounts: Map<string, number>;
  totalEmitted: number;
  totalBlocked: number;
  totalDetected: number;
}
```

### 3.3 Component API

```typescript
interface SternGerlachProps {
  /** Initial spin state. Defaults to |+z> = |0>.
   *  Accepts ket strings: "|0>", "|1>", "|+>", "|->", "|+x>", "|-x>",
   *  "|+y>", "|-y>", or a StateVector. */
  initialState?: string | StateVector;
  /** Pre-configured apparatus chain. If omitted, starts with one Z-axis apparatus. */
  apparatuses?: SGApparatus[];
  /** Maximum number of apparatuses the user can chain. Default 4. */
  maxApparatuses?: number;
  /** Whether the user can modify the apparatus chain. Default true. */
  editable?: boolean;
  /** Show the state vector at each stage. Default true. */
  showStateDisplay?: boolean;
  /** Show the "what's the math?" panel. Default false. */
  showMath?: boolean;
  /** Show particle counter / histogram. Default true. */
  showStatistics?: boolean;
  /** Preset buttons for axis selection (e.g. X, Y, Z). Default true. */
  showPresetAxes?: boolean;
  /** Callback on each single-shot result. */
  onParticleDetected?: (result: SGSingleResult) => void;
  /** Callback when batch completes. */
  onBatchComplete?: (result: SGBatchResult) => void;
  /** CSS class name. */
  className?: string;
}
```

### 3.4 UI Layout

```
+-----------------------------------------------------------------------+
| TOOLBAR                                                               |
| [Send 1 Particle] [Send 100] [Send 1000] [Send 10000] [Reset Stats]  |
| Initial State: [|+z> v]  Speed: [___slider___]                       |
+-----------------------------------------------------------------------+
|                                                                       |
| SCHEMATIC VIEW (centre, full width)                                   |
|                                                                       |
|   [SOURCE]  -->  [MAGNET 1]  --up-->  [MAGNET 2]  --up-->  [DETECTOR]|
|              |   axis: Z     |        axis: X     |        count: 247|
|              |               --down-> [BLOCKED]   --down-> [DETECTOR]|
|              |                                             count: 253|
|              |                                                        |
|   (silver ball icon with arrow showing spin direction)                |
|                                                                       |
+-----------------------------------------------------------------------+
| STATE DISPLAY (below schematic)                                       |
| Stage 0 (source): |psi> = |+z> = (1)|0> + (0)|1>                    |
| Stage 1 (after M1, outcome +z): |psi> = |+z>                        |
| Stage 2 (after M2, outcome +x): |psi> = |+x> = 0.707|0> + 0.707|1> |
+-----------------------------------------------------------------------+
| STATISTICS (histogram)                                                |
| Detector A (M2 up):   |======== 50.2% (502/1000)                    |
| Detector B (M2 down): |======== 49.8% (498/1000)                    |
+-----------------------------------------------------------------------+
| MATH PANEL (collapsible)                                              |
| Measurement axis: n = (1, 0, 0) (x-axis)                            |
| Operator: S_x = (hbar/2) * sigma_x                                  |
| Eigenstates: |+x> = (|0>+|1>)/sqrt(2), |-x> = (|0>-|1>)/sqrt(2)   |
| P(+x) = |<+x|psi>|^2 = |<+x|+z>|^2 = 1/2                          |
| P(-x) = |<-x|psi>|^2 = |<-x|+z>|^2 = 1/2                          |
+-----------------------------------------------------------------------+
```

**Schematic View Details:**
- The schematic is rendered as an SVG or Canvas element.
- The source is a labelled box on the left.
- Each magnet is drawn as a tapered shape (N/S poles labelled) with the axis direction shown as a small Bloch-sphere-style indicator (just an arrow on a circle showing the measurement direction).
- Beams are drawn as lines: a single line enters each magnet, two lines exit (up and down paths).
- A blocked beam has a red X mark over it.
- In single-shot mode, a small dot (particle) animates along the beam path from source to final detector, taking 500ms per stage at default speed. The dot follows the appropriate output path based on the measurement outcome.
- Each detector shows a running count.
- Clicking on a magnet opens an axis picker: a small sphere where the user can drag a point to set (theta, phi), or use preset buttons (X, Y, Z, custom angle input).
- A "+" button at the end of the chain allows adding a new apparatus (if under the maximum).
- Each apparatus has a toggle to block the up or down beam.

**Axis Picker:**
- A 120x120px interactive sphere rendered on a canvas.
- The user clicks/drags on the sphere surface to set the axis direction.
- Alternatively, two sliders: theta (0 to pi) and phi (0 to 2*pi).
- Preset buttons: "X" (theta=pi/2, phi=0), "Y" (theta=pi/2, phi=pi/2), "Z" (theta=0, phi=0), "-X", "-Y", "-Z".
- The selected axis is displayed as a unit vector: "n = (nx, ny, nz)".

### 3.5 Simulation Engine

```typescript
class SGSimulator {
  private experiment: SGExperiment;
  private rng: () => number;

  constructor(seed?: number);

  setExperiment(experiment: SGExperiment): void;

  /**
   * Send one particle through the apparatus chain.
   * Returns the trajectory and outcome at each stage.
   */
  runSingle(): SGSingleResult;
  // Algorithm:
  // 1. state = experiment.initialState
  // 2. For each apparatus in topological order:
  //    a. Compute eigenstates |+n> and |-n> for this apparatus's axis.
  //    b. p_up = |<+n|state>|^2
  //    c. Draw outcome: up with probability p_up, else down.
  //    d. If outcome beam is blocked, mark particle as blocked, stop.
  //    e. state = |+n> if outcome is up, |-n> if outcome is down.
  //    f. Record outcome.
  // 3. Return full trajectory.

  /**
   * Run batch of N particles.
   */
  runBatch(n: number): SGBatchResult;
  // Run runSingle() n times, accumulate detector counts.
  // For n >= 1000, run in a Web Worker to avoid blocking the UI thread.

  /**
   * Compute theoretical probabilities for each detector analytically.
   */
  computeTheoreticalProbabilities(): Map<string, number>;
}
```

---

## 4. CHSH Inequality Simulator

### 4.1 Physics Model

Two particles in a Bell state |Phi+> = (|00> + |11>) / sqrt(2) are distributed to Alice and Bob. Each party measures their particle along an axis in the x-z plane (parameterised by a single angle).

Alice's measurement operator for angle a: A(a) = cos(a)*sigma_z + sin(a)*sigma_x.
Bob's measurement operator for angle b: B(b) = cos(b)*sigma_z + sin(b)*sigma_x.

Each measurement yields +1 or -1.

Correlation: E(a, b) = <Phi+| A(a) tensor B(b) |Phi+> = -cos(a - b).

CHSH quantity: S = E(a1,b1) + E(a1,b2) + E(a2,b1) - E(a2,b2).

Classical bound: |S| <= 2.
Tsirelson bound (quantum maximum): |S| <= 2*sqrt(2) ~ 2.828.
Optimal CHSH angles: a1=0, a2=pi/4, b1=pi/8, b2=3*pi/8 gives S = 2*sqrt(2).

### 4.2 Data Model

```typescript
/** A single trial in the CHSH experiment. */
interface CHSHTrial {
  /** Alice's chosen setting (index 0 or 1). */
  aliceSetting: 0 | 1;
  /** Bob's chosen setting (index 0 or 1). */
  bobSetting: 0 | 1;
  /** Alice's measurement outcome. */
  aliceOutcome: 1 | -1;
  /** Bob's measurement outcome. */
  bobOutcome: 1 | -1;
  /** Product of outcomes. */
  product: 1 | -1;
}

/** Accumulated statistics for one setting pair. */
interface SettingPairStats {
  aliceAngle: number;
  bobAngle: number;
  trials: number;
  sumProduct: number;         // sum of alice*bob outcomes
  correlation: number;        // sumProduct / trials = empirical E(a,b)
  theoreticalCorrelation: number; // -cos(a - b) for Bell state
}

/** Full CHSH experiment state. */
interface CHSHExperimentState {
  /** Alice's two measurement angles. */
  aliceAngles: [number, number];
  /** Bob's two measurement angles. */
  bobAngles: [number, number];
  /** Stats for each of the 4 setting combinations. */
  pairStats: [SettingPairStats, SettingPairStats, SettingPairStats, SettingPairStats];
  // Order: (a1,b1), (a1,b2), (a2,b1), (a2,b2)
  /** Empirical S value. */
  empiricalS: number;
  /** Theoretical S value. */
  theoreticalS: number;
  /** All individual trials (capped at last 10000 for memory). */
  trials: CHSHTrial[];
  totalTrials: number;
}

/** Shared entangled state (configurable). */
type EntangledState = 'phi_plus' | 'phi_minus' | 'psi_plus' | 'psi_minus' | 'product';
```

### 4.3 Component API

```typescript
interface CHSHSimulatorProps {
  /** The entangled state shared by Alice and Bob.
   *  Default: 'phi_plus'. If 'product', uses |00>. */
  entangledState?: EntangledState;
  /** Initial measurement angles for Alice. Default: [0, pi/4]. */
  aliceAngles?: [number, number];
  /** Initial measurement angles for Bob. Default: [pi/8, 3*pi/8]. */
  bobAngles?: [number, number];
  /** Preset configurations available in a dropdown. */
  presets?: Array<{
    name: string;
    aliceAngles: [number, number];
    bobAngles: [number, number];
    description: string;
  }>;
  /** Whether angles are editable. Default true. */
  editable?: boolean;
  /** Show individual trial table. Default true. */
  showTrialTable?: boolean;
  /** Show correlation vs angle plot. Default true. */
  showCorrelationPlot?: boolean;
  /** Show S convergence plot. Default true. */
  showConvergencePlot?: boolean;
  /** Maximum number of stored trials. Default 10000. */
  maxTrials?: number;
  /** Callback after each trial. */
  onTrial?: (trial: CHSHTrial) => void;
  /** Callback when S value changes. */
  onSValueChange?: (empiricalS: number, theoreticalS: number) => void;
  /** CSS class name. */
  className?: string;
}
```

Default presets:

```typescript
const CHSH_PRESETS = [
  {
    name: "Textbook CHSH (maximal violation)",
    aliceAngles: [0, Math.PI / 4] as [number, number],
    bobAngles: [Math.PI / 8, 3 * Math.PI / 8] as [number, number],
    description: "Standard angles that achieve S = 2sqrt(2) with |Phi+>"
  },
  {
    name: "Classical limit demo",
    aliceAngles: [0, Math.PI / 2] as [number, number],
    bobAngles: [0, Math.PI / 2] as [number, number],
    description: "Aligned/orthogonal axes, S = 2 (classical bound)"
  },
  {
    name: "All same axis",
    aliceAngles: [0, 0] as [number, number],
    bobAngles: [0, 0] as [number, number],
    description: "Both measure along Z. Perfect anti-correlation."
  },
  {
    name: "Custom",
    aliceAngles: [0, 0] as [number, number],
    bobAngles: [0, 0] as [number, number],
    description: "Set your own angles."
  }
];
```

### 4.4 UI Layout

```
+-----------------------------------------------------------------------+
| TOOLBAR                                                               |
| Preset: [Textbook CHSH v]                                            |
| [Run 1 Trial] [Run 100] [Run 1000] [Auto-run: toggle] [Reset]       |
| Entangled State: [|Phi+> v]                                          |
+-----------------------------------------------------------------------+
|                                                                       |
| EXPERIMENT SCHEMATIC (centre)                                         |
|                                                                       |
|     ALICE                   SOURCE                    BOB             |
|  +----------+          +------------+          +----------+           |
|  | angle: a1|  <------  | |Phi+>   |  ------>  | angle: b1|          |
|  | [dial]   |           +------------+          | [dial]   |          |
|  | a1 = 0   |                                   | b1 = pi/8|          |
|  | a2 = pi/4|                                   | b2= 3pi/8|          |
|  | outcome: |                                   | outcome: |          |
|  |   +1     |                                   |   -1     |          |
|  +----------+                                   +----------+          |
|                                                                       |
+-----------------------------------------------------------------------+
| CORRELATION TABLE                                                     |
|                                                                       |
|           |   b1 (pi/8)   |   b2 (3pi/8)   |                        |
| a1 (0)    | E = -0.703    | E = -0.698     |  E(a1,b1) + E(a1,b2)  |
|           | (N=250)       | (N=250)        |  = -1.401              |
| a2 (pi/4) | E = -0.712    | E = +0.691     |  E(a2,b1) - E(a2,b2)  |
|           | (N=250)       | (N=250)        |  = -1.403              |
|                                                                       |
|  S = E(a1,b1) + E(a1,b2) + E(a2,b1) - E(a2,b2) = -2.804           |
|  |S| = 2.804                                                         |
|  Classical bound: 2.000  |  Quantum bound: 2.828                    |
|  [=============================|====] 2.804 / 2.828                  |
+-----------------------------------------------------------------------+
| PLOTS (side by side)                                                  |
|                                                                       |
| S Convergence Plot:         | Correlation vs Angle Difference:       |
| S                           | E(a,b)                                 |
| 3|        ...............   | 0|                                     |
|  |       /                  |  |--._                                 |
| 2|------/--- classical --   |-1|    \                                |
|  |     /    bound           |  |     `. quantum curve: -cos(a-b)    |
|  |    /                     |  |       \                             |
|  |   /                      |  |        `.                           |
|  |  /                       |  |          \                          |
|  +---+---+---+---+-----> N |  +--+--+--+--+--+----> (a-b)          |
|   0  200 400 600 800 1000  |   0  pi/4  pi/2  3pi/4   pi           |
|                             |  (dots: empirical, line: theory)       |
+-----------------------------------------------------------------------+
| TRIAL TABLE (collapsible, last 50 trials shown)                       |
| Trial | Alice Setting | Alice Out | Bob Setting | Bob Out | Product  |
|  1    |    a1 (0)     |    +1     |   b2 (3p/8) |   -1    |   -1     |
|  2    |    a2 (pi/4)  |    -1     |   b1 (pi/8) |   +1    |   -1     |
|  ...                                                                  |
+-----------------------------------------------------------------------+
```

**Alice/Bob Angle Dials:**
- Each party has two angle settings displayed as circular dials (SVG-rendered arcs on a unit circle in the x-z plane).
- Draggable handles on the dials to set angles.
- Numeric readout below each dial (radians, with a toggle to show degrees).
- The currently active setting for this trial is highlighted.

**Auto-run mode:**
- When toggled on, trials are generated continuously at a rate of ~10/sec (configurable via speed slider).
- The statistics and plots update in real-time.

### 4.5 Simulation Engine

```typescript
class CHSHSimulator {
  private state: CHSHExperimentState;
  private entangledState: StateVector;
  private rng: () => number;

  constructor(seed?: number);

  setEntangledState(type: EntangledState): void;
  setAngles(
    aliceAngles: [number, number],
    bobAngles: [number, number]
  ): void;

  /**
   * Run a single trial.
   * 1. Randomly choose Alice's setting (a1 or a2) and Bob's setting (b1 or b2)
   *    with equal probability.
   * 2. Construct measurement operators:
   *    A = cos(a)*Z + sin(a)*X (eigenvalues +1, -1)
   *    B = cos(b)*Z + sin(b)*X
   * 3. Build joint projectors for each outcome pair (+1,+1), (+1,-1), (-1,+1), (-1,-1).
   *    P_{ab} = |a><a| tensor |b><b| where |a>, |b> are eigenstates.
   * 4. Compute probabilities p_{ab} = <psi|P_{ab}|psi>.
   * 5. Sample outcome pair from the probability distribution.
   * 6. Record trial and update statistics.
   */
  runTrial(): CHSHTrial;

  /**
   * Run a trial with specified settings (not random).
   */
  runTrialWithSettings(
    aliceSetting: 0 | 1,
    bobSetting: 0 | 1
  ): CHSHTrial;

  /**
   * Run N trials.
   */
  runBatch(n: number): void;

  /**
   * Compute theoretical S value analytically.
   */
  computeTheoreticalS(): number;
  // S = E(a1,b1) + E(a1,b2) + E(a2,b1) - E(a2,b2)
  // where E(a,b) = <psi| (A tensor B) |psi>
  // For |Phi+>: E(a,b) = -cos(a - b)

  /**
   * Compute E(a,b) for arbitrary angle a,b analytically.
   */
  computeCorrelation(a: number, b: number): number;

  /**
   * Generate data points for the correlation vs angle-difference plot.
   */
  correlationCurve(numPoints?: number): Array<{ angleDiff: number; E: number }>;

  /** Reset all statistics. */
  reset(): void;

  getState(): CHSHExperimentState;
}
```

---

## 5. 1D Schrodinger Simulator

### 5.1 Physics Model

We solve the time-dependent Schrodinger equation in 1D:

  i * hbar * d/dt |psi(t)> = H |psi(t)>

where H = -(hbar^2 / 2m) * d^2/dx^2 + V(x).

We work in natural units where hbar = 1, m = 1/2 (so that the kinetic energy operator is just -d^2/dx^2) unless the user picks a specific potential where physical units matter. For the infinite square well and harmonic oscillator, we use dimensionless units.

### 5.2 Data Model

```typescript
/** Discretised 1D wavefunction. */
interface Wavefunction {
  /** Number of grid points. */
  N: number;
  /** Grid boundaries. */
  xMin: number;
  xMax: number;
  /** Grid spacing. */
  dx: number;
  /** Grid points. */
  x: Float64Array;
  /** Real part of psi at each grid point. */
  psiRe: Float64Array;
  /** Imaginary part of psi at each grid point. */
  psiIm: Float64Array;
}

/** A potential function. */
interface Potential {
  type: PotentialType;
  /** V(x) evaluated at each grid point. */
  values: Float64Array;
  /** Human-readable description. */
  label: string;
  /** Parameters specific to this potential type. */
  params: Record<string, number>;
}

type PotentialType =
  | 'infinite_well'
  | 'finite_well'
  | 'harmonic'
  | 'step'
  | 'barrier'
  | 'double_well'
  | 'custom';

/** An energy eigenstate. */
interface Eigenstate {
  index: number;          // quantum number (0-based: n=0 is ground state)
  energy: number;         // energy eigenvalue
  wavefunction: Wavefunction;
  label: string;          // e.g. "n=0 (ground state)"
}

/** Superposition coefficients. */
interface SuperpositionCoeff {
  eigenstateIndex: number;
  amplitude: Complex;     // coefficient c_n in psi = sum_n c_n * phi_n
}

/** Real-time observable values. */
interface Observables {
  expectationX: number;   // <x>
  expectationP: number;   // <p>
  expectationE: number;   // <H>
  norm: number;           // <psi|psi> (should be ~1)
  time: number;           // current simulation time
}
```

### 5.3 Potentials

Each potential type has configurable parameters:

```typescript
const POTENTIAL_CONFIGS: Record<PotentialType, {
  defaultParams: Record<string, number>;
  compute: (x: Float64Array, params: Record<string, number>) => Float64Array;
}> = {
  infinite_well: {
    // V(x) = 0 for |x| < L/2, infinity otherwise.
    // Implemented via Dirichlet boundary conditions (psi=0 at boundaries).
    defaultParams: { L: 10 },
    compute: (x, { L }) => {
      // Return 0 everywhere; the boundary conditions enforce the walls.
      return new Float64Array(x.length); // all zeros
    }
  },
  finite_well: {
    // V(x) = -V0 for |x| < L/2, 0 otherwise.
    defaultParams: { V0: 5, L: 4 },
    compute: (x, { V0, L }) => {
      const v = new Float64Array(x.length);
      for (let i = 0; i < x.length; i++) {
        v[i] = Math.abs(x[i]) < L / 2 ? -V0 : 0;
      }
      return v;
    }
  },
  harmonic: {
    // V(x) = (1/2) * omega^2 * x^2.
    defaultParams: { omega: 1 },
    compute: (x, { omega }) => {
      const v = new Float64Array(x.length);
      for (let i = 0; i < x.length; i++) {
        v[i] = 0.5 * omega * omega * x[i] * x[i];
      }
      return v;
    }
  },
  step: {
    // V(x) = 0 for x < 0, V0 for x >= 0.
    defaultParams: { V0: 2 },
    compute: (x, { V0 }) => {
      const v = new Float64Array(x.length);
      for (let i = 0; i < x.length; i++) {
        v[i] = x[i] >= 0 ? V0 : 0;
      }
      return v;
    }
  },
  barrier: {
    // V(x) = V0 for |x| < w/2, 0 otherwise.
    defaultParams: { V0: 5, width: 1 },
    compute: (x, { V0, width }) => {
      const v = new Float64Array(x.length);
      for (let i = 0; i < x.length; i++) {
        v[i] = Math.abs(x[i]) < width / 2 ? V0 : 0;
      }
      return v;
    }
  },
  double_well: {
    // V(x) = a * (x^2 - b)^2.
    defaultParams: { a: 0.1, b: 4 },
    compute: (x, { a, b }) => {
      const v = new Float64Array(x.length);
      for (let i = 0; i < x.length; i++) {
        const t = x[i] * x[i] - b;
        v[i] = a * t * t;
      }
      return v;
    }
  },
  custom: {
    // User-drawn potential. Values set interactively.
    defaultParams: {},
    compute: (x, _) => new Float64Array(x.length)
  }
};
```

### 5.4 Numerical Methods

#### 5.4.1 Crank-Nicolson Time Evolution (Recommended)

The Crank-Nicolson method is an implicit, unconditionally stable scheme for the 1D time-dependent Schrodinger equation. It is unitary (preserves norm) to machine precision.

**Discretisation:**

Let psi_j^n = psi(x_j, t_n). The Hamiltonian H = -d^2/dx^2 + V(x) is discretised as:

  H psi_j = -(psi_{j+1} - 2*psi_j + psi_{j-1}) / dx^2 + V_j * psi_j

The Crank-Nicolson scheme:

  (I + i*dt/2 * H) psi^{n+1} = (I - i*dt/2 * H) psi^n

Expanding with the finite-difference Laplacian:

Let alpha = i * dt / (2 * dx^2). Then:

Left-hand side (LHS) coefficients for row j:
  - psi_{j-1}^{n+1}: -alpha (i.e., the off-diagonal)
  - psi_j^{n+1}: 1 + 2*alpha + i*dt/2 * V_j (the diagonal)
  - psi_{j+1}^{n+1}: -alpha (the off-diagonal)

Right-hand side (RHS) for row j:
  - rhs_j = alpha * psi_{j-1}^n + (1 - 2*alpha - i*dt/2 * V_j) * psi_j^n + alpha * psi_{j+1}^n

This is a tridiagonal system: A * psi^{n+1} = B * psi^n, where A and B are tridiagonal matrices.

**Tridiagonal solve (Thomas algorithm):**

```
function tridiagonalSolve(
  a: Complex[],  // sub-diagonal, length N-1
  b: Complex[],  // diagonal, length N
  c: Complex[],  // super-diagonal, length N-1
  d: Complex[]   // right-hand side, length N
): Complex[] {
  // Forward sweep:
  for i = 1 to N-1:
    m = a[i-1] / b[i-1]
    b[i] = b[i] - m * c[i-1]
    d[i] = d[i] - m * d[i-1]

  // Back substitution:
  x[N-1] = d[N-1] / b[N-1]
  for i = N-2 downto 0:
    x[i] = (d[i] - c[i] * x[i+1]) / b[i]

  return x
}
```

Complexity: O(N) per time step. For N=512, this is ~512 complex divisions and multiply-adds, well under 1ms.

**Implementation in typed arrays:**

For performance, the tridiagonal solver should work on `Float64Array` pairs (real/imag) rather than `Complex[]` objects. All arrays are pre-allocated once and reused across time steps.

```typescript
class CrankNicolsonSolver {
  private N: number;
  private dx: number;
  private dt: number;
  private V: Float64Array;

  // Pre-allocated work arrays (all length N):
  private diagRe: Float64Array;   // LHS diagonal real parts
  private diagIm: Float64Array;   // LHS diagonal imag parts
  private offDiagRe: number;      // LHS off-diagonal (constant, real part)
  private offDiagIm: number;      // LHS off-diagonal (constant, imag part)
  private rhsRe: Float64Array;    // RHS vector real parts
  private rhsIm: Float64Array;    // RHS vector imag parts
  private tmpRe: Float64Array;    // scratch for Thomas algorithm
  private tmpIm: Float64Array;

  constructor(N: number, dx: number, dt: number, V: Float64Array);

  /**
   * Advance the wavefunction by one time step.
   * Modifies psiRe and psiIm in-place.
   */
  step(psiRe: Float64Array, psiIm: Float64Array): void;
  // 1. Compute RHS = B * psi^n (explicit part).
  //    For each j from 1 to N-2:
  //      rhsRe[j] = alpha_im * psi_Re[j-1]  // alpha is pure imaginary
  //               + (1 - 2*alpha_im + dt/2 * V[j] ... ) * psi_Re[j]
  //               + alpha_im * psi_Re[j+1]
  //      (and similarly for rhsIm, with proper complex arithmetic)
  // 2. Solve tridiagonal system A * psi^{n+1} = rhs using Thomas algorithm.
  // 3. Apply boundary conditions: psi[0] = psi[N-1] = 0 (Dirichlet).

  /**
   * Advance by multiple time steps.
   */
  evolve(psiRe: Float64Array, psiIm: Float64Array, numSteps: number): void;
}
```

**Boundary Conditions:**

- **Dirichlet (infinite well, default):** psi(x_min) = psi(x_max) = 0. The tridiagonal system rows for j=0 and j=N-1 are simply psi_0 = 0, psi_{N-1} = 0.

- **Absorbing (for scattering/tunnelling):** Apply a complex absorbing potential in a layer near the boundaries. In the last 10% of grid points at each boundary, add -i*W(x) to V(x) where W(x) ramps smoothly from 0 to a maximum absorption strength. This causes the wavefunction to decay near the boundaries instead of reflecting.

  ```
  W(x) = W_max * ((x - x_absorb_start) / absorb_width)^2
  ```

  W_max should be chosen such that the absorption is effective but does not cause numerical instability. A value of W_max = 5/dx works well. This modifies the diagonal of the tridiagonal system to include the imaginary absorbing potential.

#### 5.4.2 Split-Operator Method (Alternative)

The split-operator (split-step Fourier) method is an alternative time evolution scheme:

  psi(t + dt) = e^{-iVdt/2} * FFT^{-1} [ e^{-ik^2 dt} * FFT [ e^{-iVdt/2} * psi(t) ] ]

Steps:
1. Multiply psi by exp(-i * V * dt/2) in position space.
2. FFT to momentum space.
3. Multiply by exp(-i * k^2 * dt) where k is the momentum-space frequency.
4. Inverse FFT back to position space.
5. Multiply by exp(-i * V * dt/2) again.

This requires an FFT implementation. For N=512, a radix-2 FFT in TypeScript takes ~0.1ms. The split-operator method has second-order accuracy in dt (same as Crank-Nicolson) and is easier to implement but requires periodic boundary conditions (which can be made absorbing using the same complex-potential trick).

**Recommendation:** Use Crank-Nicolson as the default. It handles Dirichlet boundaries naturally, does not require FFT, and is simpler to debug. Provide the split-operator method as an opt-in for users who want periodic boundary conditions or who are studying momentum-space behaviour.

#### 5.4.3 Computing Energy Eigenstates

To find the first K energy eigenstates for a given potential, discretise the Hamiltonian as a real symmetric tridiagonal matrix:

  H_jj = 2/dx^2 + V_j
  H_{j,j+1} = H_{j+1,j} = -1/dx^2

Then find the K smallest eigenvalues and eigenvectors. For a tridiagonal matrix of size N=512, use the implicit QR algorithm (or more practically, the Lanczos algorithm for finding only the smallest K eigenvalues).

For simplicity and because N <= 512, use a direct approach:
1. Construct the tridiagonal matrix.
2. Use the bisection method (Sturm sequence) to find eigenvalues.
3. Use inverse iteration to find eigenvectors for each eigenvalue.

This needs to be done once per potential configuration, not per frame. Budget: 100ms for finding 10 eigenstates of a 512-point grid.

```typescript
interface EigensolverResult {
  eigenvalues: number[];
  eigenvectors: Float64Array[]; // each is a real array of length N
}

function findEigenstates(
  V: Float64Array,
  dx: number,
  numStates: number
): EigensolverResult;
```

### 5.5 Component API

```typescript
interface SchrodingerSimulatorProps {
  /** Number of spatial grid points. Default 512. Must be a power of 2. */
  gridPoints?: 256 | 512;
  /** Spatial domain boundaries. Default [-10, 10]. */
  domain?: [number, number];
  /** Potential type. Default 'infinite_well'. */
  potential?: PotentialType;
  /** Parameters for the potential. Merged with defaults. */
  potentialParams?: Record<string, number>;
  /** Custom potential function (if potential='custom'). */
  customPotential?: (x: number) => number;
  /** Initial state specification:
   *  - "ground": ground state of the potential
   *  - "gaussian": Gaussian wave packet (specify center, width, momentum)
   *  - "superposition": specify eigenstate coefficients
   *  - A Wavefunction object for full custom control. */
  initialState?: InitialStateConfig;
  /** Time step for evolution. Default: auto-computed for stability. */
  dt?: number;
  /** Evolution method. Default 'crank-nicolson'. */
  method?: 'crank-nicolson' | 'split-operator';
  /** Boundary conditions. Default 'dirichlet'. */
  boundaryConditions?: 'dirichlet' | 'absorbing' | 'periodic';
  /** Number of energy eigenstates to compute and display. Default 5. */
  numEigenstates?: number;
  /** Display options. */
  showProbabilityDensity?: boolean;  // |psi|^2 plot, default true
  showRealPart?: boolean;            // Re(psi) plot, default false
  showImagPart?: boolean;            // Im(psi) plot, default false
  showPotential?: boolean;           // V(x) overlay, default true
  showEigenstates?: boolean;         // eigenstate panel, default true
  showExpectationValues?: boolean;   // <x>, <p> readout, default true
  showSuperpositionBuilder?: boolean; // coefficient sliders, default false
  /** Whether user can draw/edit the potential. Default false. */
  editablePotential?: boolean;
  /** Whether animation controls are shown. Default true. */
  showControls?: boolean;
  /** Callback on each animation frame with current state. */
  onFrame?: (state: Wavefunction, observables: Observables) => void;
  /** CSS class name. */
  className?: string;
}

type InitialStateConfig =
  | { type: 'ground' }
  | { type: 'eigenstate'; n: number }
  | { type: 'gaussian'; center: number; width: number; momentum: number }
  | { type: 'superposition'; coefficients: SuperpositionCoeff[] }
  | { type: 'custom'; wavefunction: Wavefunction };
```

### 5.6 UI Layout

```
+-----------------------------------------------------------------------+
| TOOLBAR                                                               |
| Potential: [Harmonic Oscillator v]  Params: omega = [1.0___]          |
| [Play/Pause] [Step] [Reset] Speed: [___slider___]                    |
| [Show: |psi|^2  Re(psi)  Im(psi)  V(x)]  (toggle buttons)           |
+-----------------------------------------------------------------------+
|                                                                       |
| MAIN PLOT (full width, ~400px tall)                                   |
|                                                                       |
|  V(x) shown as a faint filled region (grey)                          |
|  |psi(x,t)|^2 shown as blue filled area                              |
|  Re(psi) shown as red line (if toggled on)                           |
|  Im(psi) shown as green line (if toggled on)                         |
|  x-axis with tick marks, y-axis with scale                           |
|                                                                       |
|  Overlaid: <x> marker (vertical dashed line),                        |
|            energy level lines (horizontal, for eigenstates)           |
|                                                                       |
+-----------------------------------------------------------------------+
| BOTTOM PANELS (tabbed or side-by-side depending on width)             |
|                                                                       |
| TAB 1: EIGENSTATES                    | TAB 2: SUPERPOSITION BUILDER |
| E0 = 0.500 [plot of phi_0]           | c_0: [===|====] 0.707        |
| E1 = 1.500 [plot of phi_1]           | phase_0: [=====|=] 0 rad     |
| E2 = 2.500 [plot of phi_2]           | c_1: [===|====] 0.707        |
| E3 = 3.500 [plot of phi_3]           | phase_1: [=====|=] 0 rad     |
| E4 = 4.500 [plot of phi_4]           | c_2: [|========] 0.000       |
| (click to select as initial state)    | [Apply Superposition]         |
|                                       | |psi> = 0.707|0> + 0.707|1> |
|                                                                       |
+-----------------------------------------------------------------------+
| OBSERVABLES (bottom bar)                                              |
| t = 3.14  |  <x> = 0.000  |  <p> = 1.414  |  norm = 1.000000       |
+-----------------------------------------------------------------------+
```

**Main Plot (Canvas 2D):**
- The plot is rendered on a `<canvas>` element for performance.
- The potential V(x) is drawn as a filled region (light grey with a darker outline) scaled to fit the plot area. A separate y-axis or scaled overlay is used.
- |psi|^2 is drawn as a filled area plot (blue, 40% opacity fill, solid outline).
- Re(psi) and Im(psi) are drawn as line plots (red and green respectively).
- The x-axis shows position values with grid lines.
- On each animation frame, the canvas is cleared and re-drawn. At 60fps with N=512, this means drawing ~512 line segments per visible curve, which is trivially fast.
- If `editablePotential` is true, the user can click and drag on the plot area to draw the potential. A "drawing mode" toggle switches between viewing and editing. While drawing, the cursor becomes a pen icon, and the drawn potential appears in real-time.

**Eigenstate Panel:**
- Lists the first K eigenstates with their energy values.
- Each eigenstate has a small inline plot (sparkline, ~200x40px) of the wavefunction.
- Clicking on an eigenstate sets it as the initial state and resets the simulation.

**Superposition Builder:**
- For each eigenstate (up to K), shows two sliders:
  - Amplitude slider: 0.0 to 1.0 (the coefficient magnitude).
  - Phase slider: 0 to 2*pi.
- The coefficients are automatically normalised so that sum |c_n|^2 = 1.
- A "Apply Superposition" button sets the initial state to the specified superposition.
- The resulting ket notation is displayed below: e.g., "|psi> = 0.707|0> + 0.707i|1>".

**Animation Loop:**

```typescript
class SchrodingerAnimator {
  private solver: CrankNicolsonSolver;
  private wavefunction: Wavefunction;
  private playing: boolean;
  private speed: number; // steps per frame
  private animationFrameId: number | null;

  play(): void {
    this.playing = true;
    this.tick();
  }

  pause(): void {
    this.playing = false;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  private tick(): void {
    if (!this.playing) return;

    // Evolve by `speed` time steps
    for (let i = 0; i < this.speed; i++) {
      this.solver.step(this.wavefunction.psiRe, this.wavefunction.psiIm);
    }

    // Periodically renormalise (every 100 steps)
    if (this.stepCount % 100 === 0) {
      this.renormalise();
    }

    // Compute observables
    const obs = this.computeObservables();

    // Render
    this.render(this.wavefunction, obs);

    // Next frame
    this.animationFrameId = requestAnimationFrame(() => this.tick());
  }

  private renormalise(): void {
    // norm = sum_j (psiRe[j]^2 + psiIm[j]^2) * dx
    // scale = 1 / sqrt(norm)
    // psiRe[j] *= scale, psiIm[j] *= scale
  }

  private computeObservables(): Observables {
    // <x> = sum_j x[j] * (psiRe[j]^2 + psiIm[j]^2) * dx
    // <p> = -i * sum_j conj(psi_j) * (psi_{j+1} - psi_{j-1}) / (2*dx) * dx
    //      computed as:
    //      Im( sum_j (psiRe[j] - i*psiIm[j]) * (psi_{j+1} - psi_{j-1}) / (2*dx) ) * dx
    //      ... but more carefully to get the sign right.
    // Actually: <p> = sum_j (psiRe[j] * dpsiIm[j] - psiIm[j] * dpsiRe[j]) * dx
    //   where dpsi = (psi_{j+1} - psi_{j-1}) / (2*dx)
  }
}
```

### 5.7 Expectation Value Computation

```typescript
function expectationX(wf: Wavefunction): number {
  let sum = 0;
  for (let j = 0; j < wf.N; j++) {
    const prob = wf.psiRe[j] * wf.psiRe[j] + wf.psiIm[j] * wf.psiIm[j];
    sum += wf.x[j] * prob;
  }
  return sum * wf.dx;
}

function expectationP(wf: Wavefunction): number {
  // <p> = -i hbar integral psi* dpsi/dx dx
  // In our units hbar = 1.
  // Using central differences for dpsi/dx:
  let sum = 0;
  for (let j = 1; j < wf.N - 1; j++) {
    const dPsiRe = (wf.psiRe[j + 1] - wf.psiRe[j - 1]) / (2 * wf.dx);
    const dPsiIm = (wf.psiIm[j + 1] - wf.psiIm[j - 1]) / (2 * wf.dx);
    // psi* = (psiRe - i*psiIm), dpsi/dx = (dPsiRe + i*dPsiIm)
    // psi* * dpsi/dx = (psiRe*dPsiRe + psiIm*dPsiIm) + i*(psiRe*dPsiIm - psiIm*dPsiRe)
    // <p> = -i * integral of this, so take: real(-i * (A + iB)) = real(-iA + B) = B
    // where B = psiRe*dPsiIm - psiIm*dPsiRe
    sum += wf.psiRe[j] * dPsiIm - wf.psiIm[j] * dPsiRe;
  }
  return sum * wf.dx;
}

function computeNorm(wf: Wavefunction): number {
  let sum = 0;
  for (let j = 0; j < wf.N; j++) {
    sum += wf.psiRe[j] * wf.psiRe[j] + wf.psiIm[j] * wf.psiIm[j];
  }
  return sum * wf.dx;
}
```

### 5.8 Initial State Construction

```typescript
function createGaussianPacket(
  x: Float64Array,
  center: number,
  width: number,
  momentum: number
): { psiRe: Float64Array; psiIm: Float64Array } {
  // psi(x) = (2*pi*sigma^2)^{-1/4} * exp(-(x-x0)^2 / (4*sigma^2)) * exp(i*k0*x)
  // where sigma = width, x0 = center, k0 = momentum
  const norm = Math.pow(2 * Math.PI * width * width, -0.25);
  const psiRe = new Float64Array(x.length);
  const psiIm = new Float64Array(x.length);
  for (let j = 0; j < x.length; j++) {
    const dx = x[j] - center;
    const envelope = norm * Math.exp(-dx * dx / (4 * width * width));
    psiRe[j] = envelope * Math.cos(momentum * x[j]);
    psiIm[j] = envelope * Math.sin(momentum * x[j]);
  }
  return { psiRe, psiIm };
}
```

---

## 6. Performance Budgets

### 6.1 Qubit Circuit Simulator

| Metric | Budget | Notes |
|--------|--------|-------|
| Single gate application (1-4 qubits) | < 0.5ms | Direct state vector update, no full matrix construction |
| Single gate application (5-6 qubits) | < 2ms | Still direct update, but 32-64 dimensional state |
| Full circuit simulation (20 steps, 4 qubits) | < 10ms | Sequential gate applications |
| Batch run (1000 iterations, 4 qubits, 10 steps) | < 500ms | Run in Web Worker if > 100ms expected |
| Bloch sphere render (1 sphere) | < 2ms | Canvas 2D, ~200 line segments |
| State vector table render | < 5ms | React virtual list for > 16 rows |
| KaTeX algebra render (1 step) | < 10ms | KaTeX rendering is the bottleneck; cache rendered output |
| Memory (6 qubits) | < 2 MB | State vector: 1KB, gate cache: ~100KB, snapshots for 20 steps: ~20KB |
| Frame rate (animation) | 60 fps | Bloch sphere rotation animation |
| Frame rate (stepping through circuit) | 30 fps minimum | Includes state vector table update |

**Likely bottlenecks:**
- KaTeX rendering for algebra steps. Mitigation: render lazily (only visible steps), cache rendered HTML.
- Batch simulation for large N. Mitigation: Web Worker with progress callback.
- Bloch sphere rendering with many qubits. Mitigation: limit to 4 spheres visible at once; use `OffscreenCanvas` if available.

**Optimisations:**
- Pre-allocate output `StateVector` and reuse across gate applications in a single simulation run.
- Cache parameterised gate matrices in an LRU cache (key: gate type + params hash, capacity: 32).
- Use `Float64Array` throughout; never convert to `Complex[]` in hot paths.
- For batch runs: create a single `StateVector` and reset it for each iteration rather than allocating new ones.
- Avoid closures and object spreads in inner loops.

### 6.2 Stern-Gerlach Simulator

| Metric | Budget | Notes |
|--------|--------|-------|
| Single particle simulation (4 apparatuses) | < 0.1ms | 4 inner-product computations on 2D vectors |
| Batch run (10000 particles) | < 100ms | Trivial computation, main cost is RNG |
| Particle animation (single-shot) | 60 fps | SVG/Canvas path animation |
| Histogram update | < 5ms | Re-render bar chart |
| Memory | < 1 MB | Negligible |

**Likely bottlenecks:**
- Animation of 10000 particles in rapid succession. Mitigation: batch mode does not animate each particle; only the final histogram is shown.
- SVG re-rendering of the schematic. Mitigation: only re-render the particle position and detector counts; keep the static schematic in a cached layer.

### 6.3 CHSH Inequality Simulator

| Metric | Budget | Notes |
|--------|--------|-------|
| Single trial | < 0.1ms | Two 2D inner products + RNG |
| Batch of 1000 trials | < 10ms | |
| Statistics update (S, E values) | < 1ms | Running sums, division |
| Convergence plot update | < 5ms | Canvas line chart, ~1000 points max |
| Correlation curve render | < 5ms | ~100 point curve |
| Memory | < 5 MB | 10000 trial records at ~40 bytes each = 400KB |

**Likely bottlenecks:**
- Auto-run mode at high speed with real-time plot updates. Mitigation: decouple simulation from rendering. Run trials in batches of 10-50 per animation frame, update plots at 30fps.
- Plotting 10000+ data points on the convergence plot. Mitigation: downsample for display (every Nth point), always show latest 1000.

### 6.4 1D Schrodinger Simulator

| Metric | Budget | Notes |
|--------|--------|-------|
| One Crank-Nicolson step (N=512) | < 0.2ms | Tridiagonal solve is O(N) |
| One split-operator step (N=512) | < 0.5ms | Two FFTs + three pointwise multiplications |
| Steps per frame (target: 10-50) | 2-10ms total | Adjustable via speed slider |
| Canvas render (3 curves, N=512) | < 3ms | ~1500 line segments total |
| Eigenstate computation (10 states, N=512) | < 200ms | Done once per potential change |
| Expectation value computation | < 0.1ms | Two O(N) sums |
| Memory (N=512) | < 1 MB | Wavefunction: 8KB, work arrays: 50KB, eigenstates: 80KB |

**Likely bottlenecks:**
- Eigenstate computation when the potential changes. Mitigation: run in a Web Worker; show a loading indicator. Cache results for preset potentials.
- Canvas rendering at 60fps with all three curves visible. Mitigation: use `Path2D` objects and only reconstruct them when data changes. Consider reducing to 30fps if needed.
- Custom potential drawing with real-time eigenstate recomputation. Mitigation: debounce eigenstate recomputation (wait 500ms after the user stops drawing).

**Specific optimisations:**
- Pre-allocate all work arrays for the tridiagonal solver at construction time. Zero allocation in the hot `step()` method.
- Use `Float64Array` throughout. The tridiagonal solver should operate directly on pairs of Float64Arrays (real, imag) rather than Complex objects.
- For the split-operator method, implement a radix-2 FFT in TypeScript using pre-computed twiddle factors. Store twiddle factors as Float64Arrays.
- Render the canvas using a double-buffering technique: compute the next frame's data while the current frame is being displayed.

### 6.5 Profiling Strategy

For all simulators:

1. **Development profiling:** Use `performance.now()` markers around key operations. Wrap in a `PROFILE` flag that is stripped in production builds.

```typescript
const PROFILE = process.env.NODE_ENV === 'development';

function profileWrap<T>(label: string, fn: () => T): T {
  if (!PROFILE) return fn();
  const t0 = performance.now();
  const result = fn();
  const t1 = performance.now();
  if (t1 - t0 > 5) { // Only log if > 5ms
    console.warn(`[PERF] ${label}: ${(t1 - t0).toFixed(2)}ms`);
  }
  return result;
}
```

2. **Chrome DevTools Performance tab:** Record a session of typical usage. Look for:
   - Long tasks (> 50ms) on the main thread.
   - Excessive GC pauses (indicates too much allocation).
   - Layout thrashing from DOM updates during animation.

3. **Memory profiling:** Take heap snapshots before and after running 10000 batch iterations. Check for retained objects (leaked closures, un-disposed Web Workers).

4. **Automated benchmarks:** Use `vitest` bench mode to run micro-benchmarks for core operations. Run as part of CI to catch performance regressions.

---

## 7. Test Plan

All tests use `vitest` with a tolerance of `1e-10` for floating-point comparisons unless otherwise specified. The helper `expectComplex(actual, expected, eps)` compares real and imaginary parts separately.

### 7.1 Core Linear Algebra

#### 7.1.1 Complex Arithmetic

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| add | (1+2i) + (3+4i) | 4+6i |
| subtract | (5+3i) - (2+i) | 3+2i |
| multiply | (1+i)(1-i) | 2+0i |
| multiply | (0+i)(0+i) | -1+0i |
| divide | (1+i)/(1-i) | 0+1i |
| divide by zero | (1+0i)/(0+0i) | throws DivisionByZeroError |
| conjugate | conj(3+4i) | 3-4i |
| modulus | \|3+4i\| | 5 |
| modulus | \|0+0i\| | 0 |
| phase | phase(1+i) | pi/4 |
| phase | phase(-1+0i) | pi |
| phase | phase(0+0i) | 0 |
| fromPolar | fromPolar(2, pi/3) | 1 + sqrt(3)*i |
| exp | cexp(0+i*pi) | -1+0i (Euler's identity) |
| exp | cexp(1+0i) | e+0i |
| multiply by zero | (3+4i) * (0+0i) | 0+0i |
| sqrt | csqrt(-1+0i) | 0+1i |

#### 7.1.2 Vector Operations

| Test Case | Expected |
|-----------|----------|
| innerProduct(\|0>, \|0>) | 1+0i |
| innerProduct(\|0>, \|1>) | 0+0i |
| innerProduct(\|+>, \|+>) | 1+0i |
| innerProduct(\|+>, \|->) | 0+0i |
| norm(\|0>) | 1 |
| norm(2\|0>) | 2 |
| norm(zero vector) | 0 |
| normalize(\|0> + \|1>) | (1/sqrt(2))\|0> + (1/sqrt(2))\|1> = \|+> |
| normalize(zero vector) | throws ZeroVectorError |
| tensorProduct(\|0>, \|0>) | \|00> = [1,0,0,0] |
| tensorProduct(\|+>, \|0>) | (1/sqrt(2))[1,0,1,0] |
| tensorProduct(\|0>, \|1>) | \|01> = [0,1,0,0] |
| Cauchy-Schwarz | \|<u\|v>\|^2 <= <u\|u><v\|v> for random u, v (100 random trials) |

#### 7.1.3 Matrix Operations

| Test Case | Expected |
|-----------|----------|
| matMul(I, X) | X |
| matMul(X, X) | I |
| matMul(H, H) | I |
| adjoint(Y) | Y (Y is Hermitian) |
| adjoint(S) | S_DAG |
| trace(I_2x2) | 2 |
| trace(PAULI_X) | 0 |
| det2x2(I) | 1 |
| det2x2(PAULI_X) | -1 |
| kronecker(I, X) | 4x4 matrix: [[0,1,0,0],[1,0,0,0],[0,0,0,1],[0,0,1,0]] |
| kronecker(X, I) | 4x4 matrix: [[0,0,1,0],[0,0,0,1],[1,0,0,0],[0,1,0,0]] |

#### 7.1.4 Matrix Exponential

| Test Case | Expected |
|-----------|----------|
| matExp(0 matrix) | I |
| matExp(i*pi*X) | -I (since e^{i*pi*sigma_x} = -I) |
| matExp(-i*pi/2 * Z) | diag(e^{-i*pi/2}, e^{i*pi/2}) = diag(-i, i) |
| matExp(-i*theta/2 * X) | Rx(theta) for theta=pi/2 |
| matExp(-i*theta/2 * Y) | Ry(theta) for theta=pi/3 |
| matExp(A) * matExp(-A) | I (for random Hermitian A, 3x3) |

#### 7.1.5 Tensor Product Dimensions

| Test Case | Expected Dimensions |
|-----------|-------------------|
| kronecker(2x2, 2x2) | 4x4 |
| kronecker(2x2, 4x4) | 8x8 |
| kronecker(4x4, 2x2) | 8x8 |
| tensorProduct(dim 2, dim 2) | dim 4 |
| tensorProduct(dim 2, dim 4) | dim 8 |
| tensorProduct(dim 4, dim 2) | dim 8 |

### 7.2 Qubit Circuit Simulator

#### 7.2.1 Single Gate on Standard States

All tests apply the gate to the given input state and verify the output state vector matches the expected result.

| Gate | Input | Expected Output |
|------|-------|-----------------|
| X | \|0> | \|1> = [0, 1] |
| X | \|1> | \|0> = [1, 0] |
| Y | \|0> | i\|1> = [0, i] |
| Y | \|1> | -i\|0> = [-i, 0] |
| Z | \|0> | \|0> = [1, 0] |
| Z | \|1> | -\|1> = [0, -1] |
| H | \|0> | \|+> = [1/sqrt(2), 1/sqrt(2)] |
| H | \|1> | \|-> = [1/sqrt(2), -1/sqrt(2)] |
| H | \|+> | \|0> |
| S | \|0> | \|0> |
| S | \|1> | i\|1> = [0, i] |
| T | \|0> | \|0> |
| T | \|1> | e^{i*pi/4}\|1> = [0, (1+i)/sqrt(2)] |
| Rx(pi) | \|0> | -i\|1> = [0, -i] |
| Ry(pi) | \|0> | \|1> = [0, 1] |
| Rz(pi) | \|0> | e^{-i*pi/2}\|0> = [-i, 0] ... actually Rz(pi)\|0> = e^{-ipi/2}\|0> = -i\|0>. Global phase. Verify: [-i, 0]. |
| Rx(pi/2) | \|0> | [cos(pi/4), -i*sin(pi/4)] = [1/sqrt(2), -i/sqrt(2)] |

#### 7.2.2 Multi-Gate Circuits

**Bell Pair Preparation:**
- Circuit: H on qubit 0, then CNOT(0,1).
- Initial state: \|00>.
- Expected final state: (1/sqrt(2))(\|00> + \|11>) = [1/sqrt(2), 0, 0, 1/sqrt(2)].
- Verify: amplitudes at indices 0 and 3 are 1/sqrt(2), indices 1 and 2 are 0.

**GHZ State (3 qubits):**
- Circuit: H on qubit 0, CNOT(0,1), CNOT(0,2).
- Initial state: \|000>.
- Expected: (1/sqrt(2))(\|000> + \|111>) = state vector with amplitudes 1/sqrt(2) at indices 0 and 7, all others 0.

**Teleportation Circuit (3 qubits):**
- Qubit 0: arbitrary state \|psi> = alpha\|0> + beta\|1>.
- Qubits 1,2: Bell pair via H(1), CNOT(1,2).
- CNOT(0,1), H(0).
- Measure qubits 0 and 1.
- Apply corrections on qubit 2 based on measurement outcomes.
- Verify: qubit 2 ends up in state \|psi> regardless of measurement outcomes.
- Test with \|psi> = \|0>, \|1>, \|+>, (1/sqrt(2))(\|0> + i\|1>).
- Since measurement is probabilistic, verify by running all 4 branches: for each measurement outcome (00, 01, 10, 11), apply the appropriate correction and check qubit 2's state.

**Deutsch-Jozsa (n=1):**
- Oracle for constant f(x)=0: no gate on ancilla.
- Oracle for constant f(x)=1: X on ancilla.
- Oracle for balanced f(x)=x: CNOT(0,1).
- Oracle for balanced f(x)=NOT(x): X(0), CNOT(0,1), X(0).
- Circuit: X(1), H(0), H(1), Oracle, H(0), Measure(0).
- Expected: constant oracles -> measure 0 on qubit 0. Balanced oracles -> measure 1 on qubit 0.
- Verify the state before measurement: for constant, qubit 0 amplitude is 1 for \|0>. For balanced, qubit 0 amplitude is 1 for \|1>.

**Deutsch-Jozsa (n=2):**
- 3 qubits (2 input + 1 ancilla).
- Constant oracle (f=0): identity.
- Balanced oracle (e.g., f(x) = x_0 XOR x_1): CNOT(0,2), CNOT(1,2).
- Circuit: X(2), H(0), H(1), H(2), Oracle, H(0), H(1), Measure(0), Measure(1).
- Expected: constant -> both input qubits measure 0. Balanced -> at least one measures 1.
- Verify amplitudes of \|00> component (ancilla traced out): 1.0 for constant, 0.0 for balanced.

**Deutsch-Jozsa (n=3):**
- 4 qubits (3 input + 1 ancilla).
- Constant oracle (f=0): identity.
- Balanced oracle (e.g., f(x) = x_0): CNOT(0,3).
- Same structure. Verify \|000> amplitude of input register is 1 for constant, 0 for balanced.

**3-Qubit Grover (1 iteration):**
- 3 qubits, search for target state \|101> (index 5).
- Oracle: flip phase of \|101>. Implementation: X(1), CCZ(0,1,2), X(1). (Or equivalently Toffoli with phase.)
- Diffusion operator: H^{tensor 3}, X^{tensor 3}, CCZ, X^{tensor 3}, H^{tensor 3}.
- Initial state: H^{tensor 3}\|000> = uniform superposition.
- After 1 Grover iteration:
  - Amplitude of target \|101>: expected approximately 5*sqrt(2)/8 ~ 0.8839.
  - Probability of measuring \|101>: approximately (5/sqrt(8))^2 / 8 ... 
  - More precisely: after 1 iteration, amplitude of target = sin(3*theta) where sin(theta) = 1/sqrt(8).
    theta = arcsin(1/sqrt(8)) ~ 0.3614 rad.
    3*theta ~ 1.0842 rad.
    sin(3*theta) ~ 0.8839.
    Probability ~ 0.7813 (78.13%).
  - Amplitudes of non-target states: cos(3*theta)/sqrt(7) each.
    cos(3*theta) ~ 0.4677.
    Each non-target amplitude ~ 0.4677/sqrt(7) ~ 0.1768.
  - Verify: amplitude of index 5 is approximately 0.8839. Probability is approximately 0.7813.

### 7.3 Stern-Gerlach Simulator

All probabilities verified to tolerance 1e-10 for analytical tests, and statistical tests use a tolerance proportional to 1/sqrt(N) for batch tests.

| Test Case | Setup | Expected |
|-----------|-------|----------|
| Z-measure \|+z> | State: \|0>, axis: Z | P(up) = 1.0, P(down) = 0.0 |
| Z-measure \|-z> | State: \|1>, axis: Z | P(up) = 0.0, P(down) = 1.0 |
| X-measure \|+z> | State: \|0>, axis: X (theta=pi/2, phi=0) | P(up) = 0.5, P(down) = 0.5 |
| X-measure \|+x> | State: \|+>, axis: X | P(up) = 1.0, P(down) = 0.0 |
| Y-measure \|+z> | State: \|0>, axis: Y (theta=pi/2, phi=pi/2) | P(up) = 0.5, P(down) = 0.5 |
| Arbitrary angle | State: \|0>, axis: theta from z | P(up) = cos^2(theta/2), P(down) = sin^2(theta/2) |
| theta=pi/3 | State: \|0>, axis: theta=pi/3 | P(up) = cos^2(pi/6) = 3/4, P(down) = 1/4 |
| theta=pi/2 | State: \|0>, axis: theta=pi/2 | P(up) = 1/2, P(down) = 1/2 |
| theta=pi | State: \|0>, axis: theta=pi (= -z) | P(up) = 0, P(down) = 1 |

**Sequential Apparatus Tests:**

| Test Case | Setup | Expected |
|-----------|-------|----------|
| Z then Z | \|+z> -> Z (get up) -> Z | P(up) = 1.0 at second apparatus |
| Z then X then Z | \|+z> -> Z (get up, state=\|+z>) -> X (get up, state=\|+x>) -> Z | P(up at Z) = 0.5 |
| Z then X then Z | \|+z> -> Z (get up) -> X (get down, state=\|-x>) -> Z | P(up at Z) = 0.5 |
| Blocked beam | \|+z> -> X (block down) -> Z | Only particles that went up at X reach Z. P(up at Z) = 0.5, P(down at Z) = 0.5. Overall: 50% of particles blocked, 25% at Z-up, 25% at Z-down. |

**Batch Statistical Tests:**

| Test Case | N | Expected | Tolerance |
|-----------|---|----------|-----------|
| 10000 particles, \|+z> through X | 10000 | ~5000 up, ~5000 down | chi-squared test, p > 0.01 |
| 10000 particles, \|+z> through axis at pi/3 | 10000 | ~7500 up, ~2500 down | chi-squared test, p > 0.01 |

### 7.4 CHSH Inequality Simulator

#### 7.4.1 Analytical Correlation Values

| Entangled State | Alice Angle | Bob Angle | E(a,b) |
|----------------|-------------|-----------|---------|
| \|Phi+> | 0 | 0 | -cos(0) = -1 |
| \|Phi+> | 0 | pi/2 | -cos(-pi/2) = 0 |
| \|Phi+> | 0 | pi | -cos(-pi) = 1 |
| \|Phi+> | pi/4 | pi/8 | -cos(pi/8) ~ -0.9239 |
| \|Phi+> | 0 | pi/8 | -cos(-pi/8) ~ -0.9239 |
| \|Phi+> | 0 | 3*pi/8 | -cos(-3*pi/8) ~ -0.3827 |
| \|Phi+> | pi/4 | 3*pi/8 | -cos(-pi/8) ~ -0.9239 ... wait. a=pi/4, b=3pi/8, a-b = -pi/8, -cos(-pi/8) = -cos(pi/8) ~ -0.9239 |

Correction: E(a,b) = -cos(a - b) for \|Phi+> measured in x-z plane.

#### 7.4.2 CHSH S Values

| Angles (a1, a2, b1, b2) | Theoretical S | Violates classical bound? |
|--------------------------|---------------|--------------------------|
| (0, pi/4, pi/8, 3*pi/8) | -cos(-pi/8) + -cos(-3*pi/8) + -cos(pi/8) - (-cos(-pi/8)) = ... |  |

Let me compute explicitly:
- E(a1,b1) = E(0, pi/8) = -cos(-pi/8) = -cos(pi/8)
- E(a1,b2) = E(0, 3pi/8) = -cos(-3pi/8) = -cos(3pi/8)
- E(a2,b1) = E(pi/4, pi/8) = -cos(pi/8)
- E(a2,b2) = E(pi/4, 3pi/8) = -cos(-pi/8) = -cos(pi/8)

S = E(a1,b1) + E(a1,b2) + E(a2,b1) - E(a2,b2)
  = -cos(pi/8) - cos(3pi/8) - cos(pi/8) - (-cos(pi/8))
  = -cos(pi/8) - cos(3pi/8) - cos(pi/8) + cos(pi/8)
  = -cos(pi/8) - cos(3pi/8)

cos(pi/8) = cos(22.5 deg) ~ 0.9239
cos(3pi/8) = cos(67.5 deg) ~ 0.3827

S = -0.9239 - 0.3827 = -1.3066? That does not equal -2*sqrt(2).

The issue is the sign convention. The correct CHSH combination is:

S = E(a1,b1) - E(a1,b2) + E(a2,b1) + E(a2,b2)

There are multiple equivalent forms. The standard form that gives 2*sqrt(2) is:

S = E(a1,b1) + E(a1,b2) + E(a2,b1) - E(a2,b2)

With the standard CHSH angles: a1=0, a2=pi/2, b1=pi/4, b2=-pi/4.

Actually, let me reconsider. The standard textbook CHSH angles for maximal violation with \|Phi+> depend on the correlation function. If the correlation is E(a,b) = -cos(a-b), then we need:

S = E(a1,b1) + E(a1,b2) + E(a2,b1) - E(a2,b2)

Setting a1=0, a2=pi/4, b1=pi/8, b2=3pi/8:
- E(0, pi/8) = -cos(-pi/8) = -cos(pi/8) ~ -0.9239
- E(0, 3pi/8) = -cos(-3pi/8) = -cos(3pi/8) ~ -0.3827
- E(pi/4, pi/8) = -cos(pi/8) ~ -0.9239
- E(pi/4, 3pi/8) = -cos(-pi/8) = -cos(pi/8) ~ -0.9239

Wait, E(pi/4, 3pi/8) = -cos(pi/4 - 3pi/8) = -cos(-pi/8) = -cos(pi/8) ~ -0.9239

S = (-0.9239) + (-0.3827) + (-0.9239) - (-0.9239) 
  = -0.9239 - 0.3827 - 0.9239 + 0.9239
  = -1.3066

That is wrong. The correct standard angles for maximal violation with this sign convention are different. The issue is in the sign convention for E and the definition of S. Let me use the unambiguous version:

For \|Phi+> = (|00>+|11>)/sqrt(2), measuring both particles along direction a (Alice) and b (Bob) in the x-z plane, the correlation is:

E(a,b) = -cos(a - b)

The CHSH operator is S = A1*B1 + A1*B2 + A2*B1 - A2*B2 where A_i, B_j are the measurement operators (eigenvalues +/-1).

Maximal violation: |S| = 2*sqrt(2) ~ 2.828.

This is achieved when the four angles are equally spaced, separated by pi/4:
- b1 = 0, a1 = pi/4, b2 = pi/2, a2 = 3*pi/4

Then:
- E(a1,b1) = -cos(pi/4) = -1/sqrt(2) ~ -0.7071
- E(a1,b2) = -cos(pi/4 - pi/2) = -cos(-pi/4) = -1/sqrt(2) ~ -0.7071
- E(a2,b1) = -cos(3pi/4) = -(-1/sqrt(2)) = 1/sqrt(2) ~ 0.7071

Wait, -cos(3pi/4) = -(-sqrt(2)/2) = sqrt(2)/2 ~ 0.7071. Hmm, but that gives a positive correlation which seems wrong for \|Phi+>.

Let me reconsider. For \|Phi+>, measuring both along the same axis gives perfect correlation (both get same outcome), so E(a,a) = +1, not -1. The formula should be E(a,b) = cos(a-b) for \|Phi+> (not negative).

Actually, the correlation depends on the Bell state:
- \|Phi+> = (|00>+|11>)/sqrt(2): E(a,b) = -cos(2(a-b)) if we parameterise by the angle of the measurement axis from z in the x-z plane... 

Let me be very precise. The measurement operator for Alice along angle a in the x-z plane is: A(a) = cos(2a)*Z + sin(2a)*X. No, that is also a common source of confusion.

The correct convention: if Alice measures spin along the unit vector n_a = (sin(a), 0, cos(a)) (angle a from the z-axis in the x-z plane), the operator is n_a . sigma = sin(a)*X + cos(a)*Z. For \|Phi+>:

E(a,b) = <Phi+| (n_a.sigma) tensor (n_b.sigma) |Phi+>
       = -cos(a-b)

This is correct. Now for maximal CHSH violation:

S = E(a1,b1) + E(a1,b2) + E(a2,b1) - E(a2,b2)

We want to maximise |S|. With E(a,b) = -cos(a-b):

S = -cos(a1-b1) - cos(a1-b2) - cos(a2-b1) + cos(a2-b2)

Setting a1=0, a2=pi/2, b1=pi/4, b2=-pi/4:
- -cos(0 - pi/4) = -cos(-pi/4) = -cos(pi/4) = -1/sqrt(2)
- -cos(0 - (-pi/4)) = -cos(pi/4) = -1/sqrt(2)
- -cos(pi/2 - pi/4) = -cos(pi/4) = -1/sqrt(2)
- +cos(pi/2 - (-pi/4)) = cos(3pi/4) = -1/sqrt(2)

S = -1/sqrt(2) - 1/sqrt(2) - 1/sqrt(2) - 1/sqrt(2) = -4/sqrt(2) = -2*sqrt(2)

|S| = 2*sqrt(2). Correct.

So the standard angles are: **a1=0, a2=pi/2, b1=pi/4, b2=-pi/4**.

Equivalently: a1=0, a2=pi/2, b1=pi/4, b2=3pi/4 (since -pi/4 and 3pi/4 are equivalent up to the sign of the resulting operator, but the actual numerical value of -pi/4 vs 3pi/4 matters. Let me check: -cos(pi/2 - 3pi/4) = -cos(-pi/4) = -1/sqrt(2), and +cos(pi/2 - 3pi/4) = cos(-pi/4) = 1/sqrt(2). Then S would be -1/sqrt(2) + ... different.)

Using a2=pi/2, b2=3pi/4:
- +cos(pi/2 - 3pi/4) = cos(-pi/4) = 1/sqrt(2)

S = -1/sqrt(2) - cos(0 - 3pi/4) - 1/sqrt(2) + 1/sqrt(2)
  = -1/sqrt(2) - cos(-3pi/4) - 1/sqrt(2) + 1/sqrt(2)
  = -1/sqrt(2) - (-1/sqrt(2)) - 1/sqrt(2) + 1/sqrt(2)
  = -1/sqrt(2) + 1/sqrt(2) - 1/sqrt(2) + 1/sqrt(2)
  = 0

That is wrong. So b2 = -pi/4 (i.e., 7pi/4 or equivalently -pi/4) is the correct choice, not 3pi/4.

Let me use a more standard set: **a1=0, a2=pi/4, b1=pi/8, b2=-pi/8**.

- E(0, pi/8) = -cos(-pi/8) = -cos(pi/8)
- E(0, -pi/8) = -cos(pi/8)
- E(pi/4, pi/8) = -cos(pi/8)
- E(pi/4, -pi/8) = -cos(3pi/8)

S = -cos(pi/8) - cos(pi/8) - cos(pi/8) + cos(3pi/8)
  = -3*cos(pi/8) + cos(3pi/8)
  = -3*0.9239 + 0.3827 = -2.390. Not 2*sqrt(2).

The correct optimal angles for S = E(a1,b1) + E(a1,b2) + E(a2,b1) - E(a2,b2) with E(a,b) = -cos(a-b) are:

Define theta_k = a_i - b_j for the four pairs. We need theta_{11}, theta_{12}, theta_{21} to all be the same angle, and theta_{22} to be different, such that:

-cos(theta11) - cos(theta12) - cos(theta21) + cos(theta22) is maximised in absolute value.

With a1=0, a2=pi/2, b1=pi/4, b2=-pi/4:
- theta11 = 0 - pi/4 = -pi/4
- theta12 = 0 - (-pi/4) = pi/4
- theta21 = pi/2 - pi/4 = pi/4
- theta22 = pi/2 - (-pi/4) = 3pi/4

S = -cos(-pi/4) - cos(pi/4) - cos(pi/4) + cos(3pi/4)
  = -1/sqrt(2) - 1/sqrt(2) - 1/sqrt(2) + (-1/sqrt(2))
  = -4/sqrt(2) = -2*sqrt(2). Correct.

**CHSH Test Cases (final, corrected):**

| Angles (a1, a2, b1, b2) | E(a1,b1) | E(a1,b2) | E(a2,b1) | E(a2,b2) | S | |S| vs bounds |
|--------------------------|----------|----------|----------|----------|---|-------------|
| (0, pi/2, pi/4, -pi/4) | -1/sqrt(2) | -1/sqrt(2) | -1/sqrt(2) | -1/sqrt(2) | -2*sqrt(2) ~ -2.828 | Violates classical bound of 2 |
| (0, 0, 0, 0) | -1 | -1 | -1 | +1 | -1-1-1-(-1) = -2 | Exactly at classical bound |
| (0, pi/2, 0, pi/2) | -1 | 0 | 0 | +1 | -1+0+0-1 = -2 | At classical bound |

#### 7.4.3 Product State Tests

For a product state \|00>, the correlations factorise: E(a,b) = <0|A(a)|0> * <0|B(b)|0> = cos(a)*cos(b).

| Angles | S for \|00> | Satisfies \|S\| <= 2? |
|--------|------------|----------------------|
| (0, pi/2, pi/4, -pi/4) | cos(0)*cos(pi/4) + cos(0)*cos(-pi/4) + cos(pi/2)*cos(pi/4) - cos(pi/2)*cos(-pi/4) = 1/sqrt(2) + 1/sqrt(2) + 0 - 0 = sqrt(2) ~ 1.414 | Yes |
| (0, pi/4, pi/8, 3pi/8) | compute numerically and verify <= 2 | Yes |

**Statistical convergence test:**
- Run 10000 trials with \|Phi+> and optimal CHSH angles.
- Verify \|empirical S - theoretical S\| < 0.1 (this is a 3-sigma bound approximately).

### 7.5 1D Schrodinger Simulator

#### 7.5.1 Energy Eigenvalues

**Infinite Square Well (V=0, Dirichlet BCs, L=pi so E_n = n^2):**

In our units (hbar=1, m=1/2), the kinetic operator is -d^2/dx^2. For a box of length L with Dirichlet BCs:

E_n = n^2 * pi^2 / L^2  (n = 1, 2, 3, ...)

For L = pi: E_n = n^2.

| n | Expected E_n | Tolerance |
|---|-------------|-----------|
| 1 | 1.0 | < 0.01 |
| 2 | 4.0 | < 0.01 |
| 3 | 9.0 | < 0.01 |
| 4 | 16.0 | < 0.02 |
| 5 | 25.0 | < 0.05 |

The tolerance increases with n because the finite-difference approximation to d^2/dx^2 becomes less accurate for higher-frequency eigenmodes. With N=512 points over a domain of length pi, dx = pi/512 ~ 0.006, and the discretisation error for E_n is O(n^2 * dx^2).

**Harmonic Oscillator (V = x^2/2, omega=1):**

In our units: H = -d^2/dx^2 + x^2/2. Eigenvalues: E_n = (2n+1)/2 (since with m=1/2, hbar=1, omega=1: E_n = hbar*omega*(n+1/2) but the Hamiltonian is -hbar^2/(2m) d^2/dx^2 + V = -(1)d^2/dx^2 + x^2/2... Actually with m=1/2, hbar=1:

H = -hbar^2/(2m) d^2/dx^2 + (1/2)(m)(omega^2)(x^2)
  = -1/(2*(1/2)) d^2/dx^2 + (1/2)(1/2)(1)(x^2)
  = -d^2/dx^2 + x^2/4

Hmm, this gets confusing. Let me define the convention cleanly:

In the simulator, we use dimensionless units where the Hamiltonian is:

H = -d^2/dx^2 + V(x)

For the harmonic oscillator, V(x) = (omega^2/4)*x^2 gives E_n = omega*(n + 1/2).

Or more simply, define V(x) = (1/2)*omega^2*x^2 and the kinetic energy as -(1/2)*d^2/dx^2, so H = -(1/2)d^2/dx^2 + (1/2)*omega^2*x^2, with E_n = omega*(n+1/2). This corresponds to hbar=1, m=1.

I recommend the second convention as it matches standard quantum mechanics textbooks. The Crank-Nicolson discretisation then uses:

kinetic term: -(psi_{j+1} - 2*psi_j + psi_{j-1}) / (2*dx^2)

| n | Expected E_n (omega=1) | Tolerance |
|---|----------------------|-----------|
| 0 | 0.5 | < 0.01 |
| 1 | 1.5 | < 0.01 |
| 2 | 2.5 | < 0.01 |
| 3 | 3.5 | < 0.02 |
| 4 | 4.5 | < 0.02 |

#### 7.5.2 Eigenstate Shape Verification

**Harmonic oscillator ground state:**
- psi_0(x) = (omega/(pi))^{1/4} * exp(-omega*x^2/2) for m=1, hbar=1.
- With omega=1: psi_0(x) = pi^{-1/4} * exp(-x^2/2).
- Verify: computed eigenstate matches this profile. Compute the L2 error: integral |psi_computed - psi_exact|^2 dx < 1e-4.

**Infinite well eigenstates:**
- psi_n(x) = sqrt(2/L) * sin(n*pi*x/L) for x in [0, L].
- Verify first 3 eigenstates match to L2 error < 1e-4.

#### 7.5.3 Norm Conservation

| Scenario | Steps | Expected norm after evolution | Tolerance |
|----------|-------|-------------------------------|-----------|
| Gaussian packet in infinite well, CN method, N=512 | 1000 | 1.0 | < 1e-6 |
| Gaussian packet in infinite well, CN method, N=512 | 10000 | 1.0 | < 1e-5 |
| Ground state eigenstate of harmonic oscillator | 1000 | 1.0 | < 1e-8 (should be exactly stationary up to global phase) |

The Crank-Nicolson method is unitary to machine precision, so norm should be preserved to ~1e-14 per step, accumulating to ~1e-10 after 10000 steps. The 1e-5 tolerance accounts for boundary effects and numerical drift.

#### 7.5.4 Tunnelling

- Set up: Gaussian wave packet incident on a rectangular barrier.
  - Packet: centre x=-5, width sigma=1, momentum k0=3.
  - Barrier: V0=5, width=1, centred at x=0.
  - Since kinetic energy ~ k0^2/2 = 4.5 < V0 = 5 (with m=1, hbar=1 convention), this is a tunnelling scenario.
- Expected: after the packet reaches the barrier, part transmits and part reflects.
- Verify: transmission coefficient T > 0 (specifically, the integrated probability on the far side of the barrier is non-zero after sufficient evolution time).
- Quantitative check: for a monochromatic plane wave with E = k^2/(2m) = 4.5 and a rectangular barrier of height 5 and width 1:
  T = 1 / (1 + V0^2 * sinh^2(kappa*d) / (4*E*(V0-E)))
  where kappa = sqrt(2m(V0-E))/hbar = sqrt(2*0.5) = 1
  and d = 1.
  T = 1 / (1 + 25 * sinh^2(1) / (4*4.5*0.5))
  sinh(1) ~ 1.1752, sinh^2(1) ~ 1.3811
  T = 1 / (1 + 25*1.3811 / 9) = 1 / (1 + 3.836) = 1/4.836 ~ 0.207

  Since the wave packet is not monochromatic, the actual transmission will differ but should be in the ballpark of 0.15-0.25. Verify it is in range [0.05, 0.50].

#### 7.5.5 Stationary State Time Evolution

- Initialise with an energy eigenstate psi_n.
- Evolve for time T.
- The state should be psi_n * e^{-iE_n*T} (global phase only).
- Verify: |psi(x,T)|^2 = |psi_n(x)|^2 at every grid point to tolerance 1e-8.
- Test with n=0 (ground state) and n=2 (second excited state) of the harmonic oscillator.

#### 7.5.6 Harmonic Oscillator Expectation Values

- Initialise a coherent state (displaced ground state) centred at x=x0 with zero initial momentum.
- <x>(t) should oscillate as x0*cos(omega*t).
- <p>(t) should oscillate as -m*omega*x0*sin(omega*t) = -x0*sin(t) for m=1, omega=1.
- Verify: compute <x> at several time points and check against the analytical oscillation to 1% relative error.

---

## Appendix A: File Structure

```
src/
  core/
    linalg/
      complex.ts          # Complex number type and arithmetic
      vector.ts           # StateVector operations
      matrix.ts           # DenseMatrix operations
      sparse.ts           # SparseMatrix operations
      measurement.ts      # Measurement, partial trace
      gates.ts            # Predefined gates and gate factories
      states.ts           # Predefined states (|0>, Bell states, etc.)
      bloch.ts            # Bloch sphere conversions
      utils.ts            # Formatting, RNG
      index.ts            # Public API re-exports
      __tests__/
        complex.test.ts
        vector.test.ts
        matrix.test.ts
        measurement.test.ts
        gates.test.ts
    types.ts              # Shared TypeScript interfaces
  simulators/
    qubit-circuit/
      CircuitSimulator.ts     # Simulation engine
      QubitSimulator.tsx       # Main React component
      GatePalette.tsx          # Draggable gate tiles
      CircuitCanvas.tsx        # Wire diagram and gate placement
      StateVectorTable.tsx     # State display table
      BlochSphere.tsx          # Canvas-rendered Bloch sphere
      MatrixPopup.tsx          # Gate matrix display
      AlgebraPanel.tsx         # KaTeX step-by-step view
      MeasurementStats.tsx     # Batch run histogram
      Toolbar.tsx              # Controls bar
      types.ts                 # Component-specific types
      __tests__/
        circuit-simulator.test.ts
        bell-state.test.ts
        grover.test.ts
        deutsch-jozsa.test.ts
        teleportation.test.ts
    stern-gerlach/
      SGSimulator.ts           # Simulation engine
      SternGerlach.tsx         # Main React component
      Schematic.tsx            # SVG apparatus diagram
      AxisPicker.tsx           # Interactive angle selector
      ParticleAnimation.tsx    # Animated particle path
      Histogram.tsx            # Detector count display
      MathPanel.tsx            # KaTeX measurement math
      types.ts
      __tests__/
        sg-simulator.test.ts
    chsh/
      CHSHSimulator.ts        # Simulation engine
      CHSHExperiment.tsx       # Main React component
      AngleDial.tsx            # SVG angle picker
      CorrelationTable.tsx     # E(a,b) grid
      ConvergencePlot.tsx      # S vs N chart
      CorrelationPlot.tsx      # E vs angle-difference chart
      TrialTable.tsx           # Individual results
      types.ts
      __tests__/
        chsh-simulator.test.ts
    schrodinger/
      CrankNicolsonSolver.ts   # CN time evolution
      SplitOperatorSolver.ts   # FFT-based alternative
      Eigensolver.ts           # Energy eigenstate computation
      SchrodingerSimulator.tsx  # Main React component
      WavefunctionPlot.tsx     # Canvas-rendered plots
      EigenstatePanel.tsx      # Eigenstate list
      SuperpositionBuilder.tsx # Coefficient sliders
      PotentialEditor.tsx      # Custom potential drawing
      ObservablesBar.tsx       # <x>, <p>, norm readout
      AnimationControls.tsx    # Play/pause/speed
      types.ts
      __tests__/
        crank-nicolson.test.ts
        eigensolver.test.ts
        observables.test.ts
        tunnelling.test.ts
  workers/
    batch-simulation.worker.ts   # Web Worker for batch circuit runs
    eigensolve.worker.ts         # Web Worker for eigenstate computation
```

## Appendix B: Third-Party Dependencies

| Package | Purpose | Bundle size impact |
|---------|---------|-------------------|
| react, react-dom | UI framework | already in host app |
| katex | LaTeX rendering for algebra panels | ~300KB (load async) |
| @dnd-kit/core, @dnd-kit/sortable | Drag-and-drop for gate palette | ~30KB |
| No charting library | Canvas 2D plots are hand-rolled for minimum bundle and maximum control | 0 |
| No 3D library | Bloch spheres use Canvas 2D (wireframe projection) | 0 |

**Total additional JS bundle (gzipped):** target < 100KB for core linalg + simulator code, + ~80KB for KaTeX (loaded on demand when algebra panel is opened).

## Appendix C: Unit Conventions

To avoid confusion between different physics conventions, the simulators use the following fixed conventions:

| Quantity | Convention | Notes |
|----------|-----------|-------|
| hbar | 1 | Natural units |
| Qubit ordering | q0 is most significant bit (MSB) | \|q0 q1 q2> maps to index q0*4 + q1*2 + q2 |
| CNOT convention | CNOT(control, target) | targets[0] = control, targets[1] = target |
| Bloch sphere | \|0> = north pole (z=+1), \|1> = south pole (z=-1) | Standard convention |
| Phase convention | Global phase removed by making first nonzero amplitude real and positive | For display only; the engine tracks global phase |
| Measurement outcomes | 0 or 1 for computational basis; +1 or -1 for spin/CHSH | Context-dependent |
| Schrodinger mass | m = 1 | H = -(1/2)d^2/dx^2 + V(x) |
| Stern-Gerlach angles | theta from z-axis (polar), phi in x-y plane (azimuthal) | Standard spherical coordinates |
| CHSH angles | Angle from z-axis in the x-z plane | Measurement operator: cos(a)*Z + sin(a)*X |

## Appendix D: Accessibility

All simulator components must meet WCAG 2.1 AA:

- **Keyboard navigation:** All controls (buttons, sliders, toggles, drag-and-drop) must be operable via keyboard. Gate placement uses arrow keys to navigate the circuit grid, Enter to place, Delete to remove.
- **Screen reader:** ARIA labels on all interactive elements. State vector changes announced via `aria-live="polite"` region. Bloch sphere described textually ("Bloch vector: x=0.71, y=0.00, z=0.71, pointing towards +X+Z").
- **Colour:** No information conveyed by colour alone. Probability bars have text labels. Phase discs have numeric readout alongside. Plot lines are distinguished by both colour and dash pattern.
- **Motion:** Respect `prefers-reduced-motion`. When enabled, disable Bloch sphere animation (instant transitions), particle animations (instant placement), and wavefunction animation (show static frames with step button).
- **Focus management:** When a gate is added or removed, focus moves to the new/previous gate. When a panel opens, focus moves to the panel.

## Appendix E: Error Handling

All simulators must handle the following error conditions gracefully (with user-visible error messages, not console errors or blank screens):

| Error | Handling |
|-------|----------|
| Invalid initial state string (e.g. "\|abc>") | Show error message below the state input, revert to \|0...0> |
| Gate placed on invalid qubit (out of range) | Reject the placement, snap back to palette |
| Circuit too large (> maxSteps columns) | Disable adding new columns, show tooltip explaining the limit |
| Numerical overflow in Schrodinger solver | Pause animation, show "Numerical instability detected. Try reducing speed or changing parameters." |
| Eigensolver fails to converge | Show partial results with warning "Could not compute all requested eigenstates." |
| Web Worker crashes | Fall back to main-thread computation with a warning about potential UI lag |
| Browser does not support Web Workers | Silently fall back to main-thread computation |
| Division by zero in complex arithmetic | Throw `DivisionByZeroError` with descriptive message |
| Normalisation of zero vector | Throw `ZeroVectorError` with descriptive message |
| Dimension mismatch in matrix/vector operations | Throw `DimensionMismatchError` with the mismatched dimensions |
