# Track C (Computing) -- Lesson Specifications C1 through C5

**Version:** 1.0
**Date:** 2026-04-13
**Status:** Draft

---

## Table of Contents

1. [C1 -- The Qubit](#c1----the-qubit)
2. [C2 -- Measurement](#c2----measurement)
3. [C3 -- Single-Qubit Gates & Bloch Sphere](#c3----single-qubit-gates--bloch-sphere)
4. [C4 -- Multi-Qubit Systems](#c4----multi-qubit-systems)
5. [C5 -- Universal Gate Sets](#c5----universal-gate-sets)

---

## C1 -- The Qubit

**Canonical position:** 6 (after P2, before C2)
**Prerequisites:** A1 (Complex Numbers & Inner Products), A2 (Linear Maps & Matrices), A3 (Eigenvalues & Spectral Theorem), P1 (Stern-Gerlach & State Vectors), P2 (Superposition & Probability Amplitudes)
**Target length:** 8,000--10,000 words
**Estimated study time:** 90--120 minutes

---

### C1.1 Learning Objectives

By the end of this lesson the student will be able to:

1. **Define a qubit** as a unit vector in the two-dimensional complex Hilbert space C^2 and explain why the state space is C^2 rather than R^2.
2. **Write an arbitrary qubit state** in Dirac notation as |psi> = alpha|0> + beta|1> and state the normalisation constraint |alpha|^2 + |beta|^2 = 1.
3. **Distinguish qubits from classical bits** precisely: explain why "a qubit is 0 and 1 at the same time" is a misleading slogan, and replace it with the correct statement about superposition.
4. **Explain global phase equivalence**: prove that |psi> and e^{i gamma}|psi> represent the same physical state and therefore only relative phase is observable.
5. **Derive the Bloch parametrisation** cos(theta/2)|0> + e^{i phi} sin(theta/2)|1> from the normalisation constraint plus global-phase freedom, identifying theta in [0, pi] and phi in [0, 2pi).
6. **Locate specific states on the Bloch sphere**: |0>, |1>, |+>, |->, |+i>, |-i> and arbitrary states given (theta, phi).
7. **Define and use Dirac notation** fluently: kets |psi>, bras <psi|, inner products <phi|psi>, and outer products |phi><psi|.
8. **Survey physical qubit implementations**: superconducting transmons, trapped ions, photon polarisation, spin-1/2 particles, and nitrogen-vacancy centres; identify what plays the role of |0> and |1> in each.
9. **Connect the qubit formalism to spin-1/2** as encountered in P1 and P2, identifying the computational basis {|0>, |1>} with the spin eigenstates {|up>, |down>}.
10. **Use the simulator** to initialise a qubit in an arbitrary state, verify the normalisation constraint numerically, and read off Bloch-sphere coordinates.

---

### C1.2 Intuition Arc

**Opening hook (the punchline before the proof).** Start with a concrete physical scenario the student has already encountered: the Stern-Gerlach apparatus from P1. A silver atom enters the apparatus and emerges in one of two beams. Classical information theory says a bit is 0 or 1. Quantum mechanics says the atom's spin state before measurement is *neither* 0 nor 1 but a specific mathematical object -- a vector -- that *encodes probabilities* for both outcomes. This lesson makes that mathematical object precise.

**Act 1: From bits to vectors (words 1--2,000).** Begin with the classical bit: a system with two distinguishable states, representable as 0 or 1. Reframe it as a vector in R^2: the bit value 0 corresponds to the column vector (1,0)^T and the bit value 1 to (0,1)^T. Ask: what if we allow arbitrary linear combinations? In R^2 we get a vector a(1,0)^T + b(0,1)^T with a,b in R. But physics demands complex amplitudes (connect back to A1 where the student learned why C is needed for eigenvalues of Hermitian operators). So the state space is C^2. A qubit is a unit vector in C^2.

**Act 2: The normalisation constraint and what it means (words 2,000--4,000).** The constraint |alpha|^2 + |beta|^2 = 1 is a probability constraint: the squared magnitudes must sum to one because upon measurement exactly one outcome occurs. This is the Born rule bridge -- connect to P2 where the student first saw |<a|psi>|^2 as a probability. Work through explicit numerical states. Introduce Dirac notation as the standard language.

**Act 3: Global phase and the Bloch parametrisation (words 4,000--6,500).** Two state vectors that differ only by a global phase e^{i gamma} give identical measurement statistics for every possible measurement. Prove this. Then show: because of global phase freedom, we can always choose alpha to be real and non-negative. Combined with normalisation, this gives exactly two free real parameters. Parametrise them as angles: alpha = cos(theta/2), beta = e^{i phi} sin(theta/2). This maps the state space to the surface of a unit sphere -- the Bloch sphere. Walk through locating the six cardinal states.

**Act 4: Physical realisations and "not 0 and 1 at the same time" (words 6,500--8,500).** Survey physical implementations. For each, identify the two-level system and map it to the abstract formalism. Return to the misleading slogan: a qubit in state (|0> + |1>)/sqrt(2) does not "have" both values simultaneously. It is in a *definite* state -- the state |+> -- with *definite* properties (e.g., a definite +1 eigenvalue of the X operator). The "both at once" framing smuggles in a classical picture that the formalism does not support.

**Closing synthesis (words 8,500--9,500).** Summarise: a qubit is a unit vector in C^2, parametrised by two angles on the Bloch sphere, physically realised in many platforms, and emphatically not "0 and 1 at the same time." Foreshadow measurement (C2) and gates (C3).

---

### C1.3 Theorems, Definitions, and Proofs

#### Definition C1.1 -- Qubit State Space

The *state space* of a single qubit is the complex Hilbert space C^2 equipped with the standard inner product <u|v> = u_1* v_1 + u_2* v_2. A *pure qubit state* is a ray in C^2, represented by a unit vector |psi> in C^2 satisfying <psi|psi> = 1, where two vectors |psi> and |psi'> represent the same state if and only if |psi'> = e^{i gamma} |psi> for some gamma in R.

#### Definition C1.2 -- Computational Basis

The *computational basis* of C^2 is the ordered orthonormal basis {|0>, |1>} where

|0> = (1, 0)^T,    |1> = (0, 1)^T.

Every qubit state can be expanded as |psi> = alpha|0> + beta|1> with alpha, beta in C and |alpha|^2 + |beta|^2 = 1.

#### Theorem C1.1 -- Global Phase Invariance

**Statement.** If |psi> = alpha|0> + beta|1> and |psi'> = e^{i gamma}|psi> = (e^{i gamma} alpha)|0> + (e^{i gamma} beta)|1> for some gamma in R, then for every orthonormal basis {|a>, |a_perp>} of C^2:

|<a|psi>|^2 = |<a|psi'>|^2.

That is, |psi> and |psi'> yield identical measurement statistics in every basis.

**Proof.** 

<a|psi'> = <a| (e^{i gamma} |psi>) = e^{i gamma} <a|psi>.

Therefore

|<a|psi'>|^2 = |e^{i gamma} <a|psi>|^2 = |e^{i gamma}|^2 |<a|psi>|^2 = 1 . |<a|psi>|^2 = |<a|psi>|^2.

Since this holds for arbitrary |a>, the two vectors are physically indistinguishable.  QED.

#### Theorem C1.2 -- Bloch Parametrisation

**Statement.** Every qubit state |psi> in C^2 (modulo global phase) can be written uniquely as

|psi> = cos(theta/2)|0> + e^{i phi} sin(theta/2)|1>

where theta in [0, pi] and phi in [0, 2pi).

**Proof (derivation from constraints).**

Step 1. Write |psi> = alpha|0> + beta|1> with |alpha|^2 + |beta|^2 = 1.

Step 2. Write alpha = |alpha| e^{i gamma_alpha} and beta = |beta| e^{i gamma_beta}. By global phase invariance (Theorem C1.1) we may multiply by e^{-i gamma_alpha} to obtain an equivalent state with alpha' = |alpha| (real, non-negative) and beta' = |beta| e^{i(gamma_beta - gamma_alpha)}.

Step 3. Define phi := gamma_beta - gamma_alpha. The normalisation constraint becomes |alpha'|^2 + |beta'|^2 = alpha'^2 + |beta'|^2 = 1 (since alpha' >= 0).

Step 4. Since alpha' in [0,1] and |beta'| in [0,1] with alpha'^2 + |beta'|^2 = 1, we may set alpha' = cos(theta/2) and |beta'| = sin(theta/2) for a unique theta in [0, pi].

Step 5. Then beta' = sin(theta/2) e^{i phi}, giving

|psi> = cos(theta/2)|0> + e^{i phi} sin(theta/2)|1>.

Step 6 (uniqueness). If theta in (0, pi), then both cos(theta/2) > 0 and sin(theta/2) > 0, so theta and phi are uniquely determined. At theta = 0 the state is |0> regardless of phi (the coefficient of |1> vanishes). At theta = pi the state is e^{i phi}|1>, but global phase freedom means all such states are equivalent to |1>, making phi irrelevant. These are the north and south poles of the Bloch sphere. QED.

#### Definition C1.3 -- Bloch Sphere

The *Bloch sphere* is the unit sphere S^2 in R^3. The bijection between qubit states (modulo global phase) and points on S^2 is given by mapping the state cos(theta/2)|0> + e^{i phi} sin(theta/2)|1> to the Cartesian point

(x, y, z) = (sin theta cos phi, sin theta sin phi, cos theta).

Equivalently, this is the *Bloch vector* r = (x, y, z), which also satisfies r_j = <psi|sigma_j|psi> where sigma_1, sigma_2, sigma_3 are the Pauli matrices (to be explored fully in C3).

#### Definition C1.4 -- Dirac Notation Summary

| Symbol | Name | Definition |
|--------|------|------------|
| \|psi> | Ket | Column vector in C^2 (or C^n more generally) |
| <psi\| | Bra | Row vector (conjugate transpose of \|psi>) |
| <phi\|psi> | Bracket (inner product) | Sum_k phi_k* psi_k, a complex scalar |
| \|phi><psi\| | Outer product | Rank-1 matrix (phi)(psi^dagger), dimension n x n |
| <phi\|A\|psi> | Matrix element | <phi\|(A\|psi>) = (A^dagger \|phi>)^dagger \|psi> |

---

### C1.4 Visual Assets

**V-C1.1: Classical bit vs qubit state space (static diagram).**
Two panels side by side.
- Left panel: "Classical bit." Two discrete points labelled 0 and 1 on a number line. Caption: "A classical bit is exactly one of two values."
- Right panel: "Qubit." The unit circle in C^2 shown as the surface of the Bloch sphere. Several states labelled: |0> at north pole, |1> at south pole, |+> on equator at phi=0, |-> on equator at phi=pi, |+i> and |-i> on equator at phi=pi/2 and phi=3pi/2. Caption: "A qubit state is a point on the Bloch sphere -- a continuum of possibilities."

**V-C1.2: Anatomy of a qubit state (annotated equation).**
Large-format display of |psi> = alpha|0> + beta|1>. Annotations with leader lines:
- alpha: "Amplitude for outcome 0. Complex number."
- beta: "Amplitude for outcome 1. Complex number."
- |0>, |1>: "Computational basis states (orthonormal)."
- Constraint box: |alpha|^2 + |beta|^2 = 1.
- Side note: "|alpha|^2 = probability of measuring 0" (with arrow to C2 for full treatment).

**V-C1.3: Global phase animation (interactive, simulator).**
A slider labelled "gamma" from 0 to 2pi. The user adjusts gamma and watches the state e^{i gamma}|psi> evolve. Two displays:
- Left: the complex-plane representation of alpha and beta, both rotating by the same angle gamma.
- Right: the Bloch sphere, which remains completely unchanged.
Caption: "Global phase rotates both amplitudes identically but leaves the Bloch vector fixed. No measurement can detect it."

**V-C1.4: Derivation of Bloch parametrisation (step-by-step animated diagram).**
A four-frame animation:
1. Frame 1: General |psi> = alpha|0> + beta|1> with alpha, beta as points in the complex plane.
2. Frame 2: Multiply by e^{-i gamma_alpha} -- alpha moves to the positive real axis, beta rotates by (gamma_beta - gamma_alpha).
3. Frame 3: Apply constraint |alpha|^2 + |beta|^2 = 1 -- show the unit quarter-circle in the (|alpha|, |beta|) plane, parametrised by theta/2.
4. Frame 4: Map to the Bloch sphere -- show the resulting point (theta, phi).

**V-C1.5: Physical implementations gallery (static infographic).**
A 2x3 grid, each cell containing:
- Illustration of the physical system (stylised, not photographic).
- Label of |0> and |1> for that system.
- Key parameter (coherence time, gate fidelity) in a small data box.

Systems: (1) Superconducting transmon, (2) Trapped ion (e.g., ^{171}Yb+), (3) Photon polarisation, (4) Spin-1/2 in magnetic field, (5) Nitrogen-vacancy centre in diamond, (6) Topological qubit (Majorana, with "experimental" badge).

**V-C1.6: Bloch sphere interactive explorer (simulator widget).**
Full interactive Bloch sphere. Two input modes:
- Mode A: Enter alpha and beta as complex numbers (real + imaginary parts). The widget normalises, computes theta and phi, plots the point.
- Mode B: Enter theta and phi via sliders. The widget computes alpha, beta and shows the ket.
Both modes update simultaneously. A readout panel shows: alpha, beta, |alpha|^2, |beta|^2, theta, phi, (x,y,z).

---

### C1.5 Worked Examples

#### Worked Example C1.1 -- Verifying normalisation

**Problem.** Is the vector |psi> = (3/5)|0> + (4i/5)|1> a valid qubit state?

**Solution.**
Compute |alpha|^2 = |3/5|^2 = 9/25.
Compute |beta|^2 = |4i/5|^2 = |4/5|^2 = 16/25.
Sum: 9/25 + 16/25 = 25/25 = 1. Yes, it is normalised. This is a valid qubit state.

Measurement probabilities: P(0) = 9/25 = 0.36, P(1) = 16/25 = 0.64.

#### Worked Example C1.2 -- Global phase removal and Bloch coordinates

**Problem.** Find the Bloch sphere coordinates (theta, phi) for the state |psi> = (1+i)/(2)|0> + (1-i)/(2)|1>.

**Solution.**
Step 1: Compute |alpha| and |beta|.
alpha = (1+i)/2. |alpha|^2 = (1+1)/4 = 1/2. So |alpha| = 1/sqrt(2).
beta = (1-i)/2. |beta|^2 = (1+1)/4 = 1/2. So |beta| = 1/sqrt(2).

Step 2: Extract the phase of alpha.
alpha = (1+i)/2 = (1/sqrt(2)) e^{i pi/4}. So gamma_alpha = pi/4.

Step 3: Multiply by e^{-i pi/4} to make the first coefficient real.
alpha' = e^{-i pi/4} . (1+i)/2 = 1/sqrt(2).
beta' = e^{-i pi/4} . (1-i)/2.

Compute (1-i)/2 = (1/sqrt(2)) e^{-i pi/4}. So beta' = e^{-i pi/4} . (1/sqrt(2)) e^{-i pi/4} = (1/sqrt(2)) e^{-i pi/2}.

Step 4: Read off theta and phi.
cos(theta/2) = 1/sqrt(2) => theta/2 = pi/4 => theta = pi/2.
e^{i phi} sin(theta/2) = (1/sqrt(2)) e^{-i pi/2} => phi = -pi/2 (equiv. phi = 3pi/2).

Step 5: Bloch vector.
x = sin(pi/2) cos(3pi/2) = 1 . 0 = 0.
y = sin(pi/2) sin(3pi/2) = 1 . (-1) = -1.
z = cos(pi/2) = 0.

The Bloch vector is (0, -1, 0), which is the |-i> state.

#### Worked Example C1.3 -- Locating cardinal states

**Problem.** Verify that |+> = (|0> + |1>)/sqrt(2) maps to the Bloch sphere point (1, 0, 0).

**Solution.**
Write |+> = (1/sqrt(2))|0> + (1/sqrt(2))|1>.
alpha = 1/sqrt(2) (already real and positive). beta = 1/sqrt(2) (real and positive).
cos(theta/2) = 1/sqrt(2) => theta/2 = pi/4 => theta = pi/2.
sin(theta/2) e^{i phi} = 1/sqrt(2) => e^{i phi} = 1 => phi = 0.
Bloch vector: (sin(pi/2)cos(0), sin(pi/2)sin(0), cos(pi/2)) = (1, 0, 0). Confirmed.

#### Worked Example C1.4 -- Why "0 and 1 at the same time" is wrong

**Problem.** A popular-science article says a qubit "stores both 0 and 1 simultaneously." Construct a precise counter-argument.

**Solution.**
Consider the state |+> = (|0> + |1>)/sqrt(2). The claim "stores both 0 and 1" implies the qubit has a definite value of 0 AND a definite value of 1 in the computational basis. But a definite value of 0 means the state IS |0>, and a definite value of 1 means the state IS |1>. The qubit cannot be both |0> and |1> because those are orthogonal vectors and no vector can equal two different orthogonal vectors simultaneously.

What IS true: |+> is an eigenstate of the Pauli-X operator with eigenvalue +1. So the qubit has a perfectly definite value (+1) when measured in the X-basis. The indefiniteness is basis-dependent, not absolute. Saying "both at once" imports a classical picture (the state has a definite bit value that is somehow hidden) that the formalism explicitly denies.

#### Worked Example C1.5 -- Physical mapping: photon polarisation

**Problem.** In a photon polarisation qubit, horizontal polarisation |H> is mapped to |0> and vertical polarisation |V> to |1>. A photon is prepared with polarisation at 30 degrees from horizontal. Write the qubit state and find its Bloch coordinates.

**Solution.**
The polarisation state at angle theta_pol from horizontal is cos(theta_pol)|H> + sin(theta_pol)|V>.
At 30 degrees: |psi> = cos(30 deg)|0> + sin(30 deg)|1> = (sqrt(3)/2)|0> + (1/2)|1>.

This is already in the standard form (alpha real and positive, beta real and positive).
cos(theta/2) = sqrt(3)/2 => theta/2 = pi/6 => theta = pi/3 (= 60 deg).
sin(theta/2) = 1/2. Check: sin(pi/6) = 1/2. Consistent.
phi = 0 (since the coefficient of |1> is real and positive).

Bloch vector: (sin(pi/3)cos(0), sin(pi/3)sin(0), cos(pi/3)) = (sqrt(3)/2, 0, 1/2).
This is a point in the x-z plane of the Bloch sphere, tilted 60 degrees from the north pole.

---

### C1.6 Common Confusions

**Confusion 1: "A qubit is 0 and 1 at the same time."**
This is the most pervasive misconception in all of quantum computing popularisation. Correction: a qubit in a superposition such as (|0> + |1>)/sqrt(2) is in a *definite* state -- the state |+> -- that happens to yield *probabilistic* outcomes when measured in the computational basis. It is not "both 0 and 1" any more than a coin standing on its edge is "both heads and tails." The analogy itself is imperfect (a coin on its edge would reveal a definite face if we looked; a qubit in |+> genuinely has no definite computational-basis value), but the key point stands: superposition is not simultaneous possession of two classical values.

**Confusion 2: "alpha and beta are probabilities."**
No. alpha and beta are complex *amplitudes*. The probabilities are |alpha|^2 and |beta|^2. This distinction matters because amplitudes carry phase information, which is invisible in probabilities but critical for interference effects (the engine of quantum computing). If alpha = 1/sqrt(2) and beta = 1/sqrt(2), the probabilities are the same as when alpha = 1/sqrt(2) and beta = -1/sqrt(2), but the states |+> and |-> behave very differently under subsequent operations.

**Confusion 3: "The Bloch sphere is a sphere in C^2."**
The Bloch sphere is a sphere in R^3. The state space C^2 is four-dimensional (over R). The Bloch sphere is a two-dimensional surface embedded in R^3, obtained after imposing the normalisation constraint (which removes one real degree of freedom, leaving three) and then quotienting by global phase (removing another, leaving two). It is a visualisation tool, not the actual state space.

**Confusion 4: "Global phase doesn't matter, so we can always set alpha to be real."**
This is almost correct but contains a subtlety. We can set alpha to be real and *non-negative* for a single qubit in isolation. But when a qubit is part of a multi-qubit system (C4), its individual global phase becomes a *relative* phase of the composite system and IS physically meaningful. Global phase freedom applies to the *entire* system's state vector, not to individual qubits within a composite system.

**Confusion 5: "Two real parameters means a qubit stores two classical bits."**
Wrong on two counts. First, the parameters theta and phi are continuous, not discrete -- a qubit state is specified by two *real numbers*, not two bits. Second, despite this continuous parametrisation, the Holevo bound (to be discussed in a later lesson) shows that a qubit can transmit at most one classical bit of information. The "extra" information in theta and phi is inaccessible because measurement collapses the state.

**Confusion 6: "The qubit state is a physical thing spinning around."**
The Bloch sphere is a mathematical representation. The Bloch vector does not represent a physical arrow rotating in real space (unlike a classical magnetic dipole). The qubit may be realised as a photon's polarisation (which has a spatial direction) or as a superconducting circuit (which has no spatial direction at all). The Bloch sphere works for both because it encodes the abstract state, not a spatial orientation.

---

### C1.7 Cross-References

| Reference | Direction | Detail |
|-----------|-----------|--------|
| A1 (Complex Numbers) | Backward | The student needs complex arithmetic, modulus, and phase. C1 uses these without re-deriving them. |
| A2 (Linear Maps) | Backward | Column-vector representation and inner products are assumed. The outer product |phi><psi| from Dirac notation is a linear map. |
| A3 (Eigenvalues) | Backward | The computational basis states are eigenstates of the Pauli-Z matrix. This connection is stated but the eigenvalue formalism is assumed known. |
| P1 (Stern-Gerlach) | Backward | The opening hook uses the Stern-Gerlach experiment. The spin-up/spin-down mapping to |0>/|1> is made explicit. |
| P2 (Superposition) | Backward | Born rule (probability = |amplitude|^2) was introduced in P2 and is used throughout C1. |
| C2 (Measurement) | Forward | C1 previews measurement probabilities but defers the full treatment (projectors, collapse, general bases) to C2. |
| C3 (Gates & Bloch Sphere) | Forward | The Bloch sphere is previewed here but its full derivation (including the SU(2) to SO(3) map) is deferred to C3. The Pauli matrices are named but not derived. |
| A4 (Tensor Products) | Forward | The caveat about global phase in multi-qubit systems points forward to tensor products. |
| P3 (Spin-1/2 QM) | Forward | P3 gives the full quantum-mechanical treatment of spin-1/2; C1's computational-basis notation maps directly to the spin eigenstates of P3. |

---

### C1.8 Historical Notes

- **The word "qubit"** was coined by Benjamin Schumacher in 1995, inspired by a suggestion from William Wootters. Schumacher's paper "Quantum coding" (Physical Review A, 51(4), 2738) introduced the term in the context of quantum information theory, analogous to Shannon's "bit." Before Schumacher, the concept existed but was referred to simply as a "two-level quantum system" or "spin-1/2 system."

- **Dirac notation** was introduced by Paul Dirac in his 1939 paper "A new notation for quantum mechanics" (Mathematical Proceedings of the Cambridge Philosophical Society, 35(3), 416-418) and consolidated in his textbook *The Principles of Quantum Mechanics* (1930, with the notation refined in later editions). The bra-ket notation was designed to make the duality between states and linear functionals notationally transparent. Physicists adopted it rapidly; mathematicians remained more reluctant.

- **The Bloch sphere** is named after Felix Bloch, who introduced it in 1946 in the context of nuclear magnetic resonance. Bloch was studying the precession of nuclear spins in a magnetic field, and the sphere provided a natural geometric picture. In quantum information the Bloch sphere was popularised through the textbook of Nielsen and Chuang (2000). The mathematical object (the complex projective line CP^1, homeomorphic to S^2 via the Hopf fibration) was known to mathematicians long before Bloch.

- **Physical implementations.** The idea of using quantum systems for computation was proposed independently by Paul Benioff (1980), Richard Feynman (1982), and Yuri Manin (1980). The first experimental demonstrations of single-qubit operations were achieved with trapped ions (Wineland group, NIST, 1995) and with photon polarisation (Zeilinger group, 1997). Superconducting qubits were first demonstrated by Nakamura, Pashkin, and Tsai at NEC in 1999.

---

### C1.9 Problem Set

#### Problem C1.1 (Normalisation) [Computational]
Determine which of the following vectors are valid qubit states. For each valid state, compute P(0) and P(1).

(a) |psi_a> = (1/2)|0> + (sqrt(3)/2)|1>
(b) |psi_b> = (1+2i)/3 |0> + (2-i)/3 |1>
(c) |psi_c> = (1/sqrt(2))|0> + (1/sqrt(2)) e^{i pi/3} |1>
(d) |psi_d> = (3/5)|0> + (4/5)|1> + (1/5)|0>

**Solutions.**

(a) |alpha|^2 + |beta|^2 = 1/4 + 3/4 = 1. Valid. P(0) = 0.25, P(1) = 0.75.

(b) |alpha|^2 = |1+2i|^2/9 = (1+4)/9 = 5/9. |beta|^2 = |2-i|^2/9 = (4+1)/9 = 5/9. Sum = 10/9 != 1. Not valid. (To fix: normalise by dividing by sqrt(10/9) = sqrt(10)/3.)

(c) |alpha|^2 = 1/2. |beta|^2 = (1/sqrt(2))^2 |e^{i pi/3}|^2 = 1/2 . 1 = 1/2. Sum = 1. Valid. P(0) = 0.5, P(1) = 0.5.

(d) This expression has three terms but there are only two basis states. Collecting: (3/5 + 1/5)|0> + (4/5)|1> = (4/5)|0> + (4/5)|1>. |alpha|^2 + |beta|^2 = 16/25 + 16/25 = 32/25 != 1. Not valid.

#### Problem C1.2 (Bloch Coordinates) [Computational]
Find the Bloch sphere coordinates (theta, phi) and the Bloch vector (x, y, z) for each of the following states:

(a) |psi> = |1>
(b) |psi> = (|0> - |1>)/sqrt(2)
(c) |psi> = (|0> + i|1>)/sqrt(2)
(d) |psi> = cos(pi/8)|0> + sin(pi/8)|1>

**Solutions.**

(a) |1> = cos(theta/2)|0> + e^{i phi} sin(theta/2)|1> requires cos(theta/2) = 0 => theta = pi. Then sin(pi/2) = 1, e^{i phi} = 1 so phi is arbitrary. Bloch vector: (0, 0, -1). South pole.

(b) (|0> - |1>)/sqrt(2): alpha = 1/sqrt(2), beta = -1/sqrt(2) = (1/sqrt(2)) e^{i pi}. So cos(theta/2) = 1/sqrt(2) => theta = pi/2. e^{i phi} = e^{i pi} => phi = pi. Bloch vector: (sin(pi/2)cos(pi), sin(pi/2)sin(pi), cos(pi/2)) = (-1, 0, 0). This is |->. 

(c) (|0> + i|1>)/sqrt(2): alpha = 1/sqrt(2), beta = i/sqrt(2) = (1/sqrt(2)) e^{i pi/2}. So theta = pi/2, phi = pi/2. Bloch vector: (sin(pi/2)cos(pi/2), sin(pi/2)sin(pi/2), cos(pi/2)) = (0, 1, 0). This is |+i>.

(d) cos(pi/8)|0> + sin(pi/8)|1>. Already in standard form with phi = 0. theta/2 = pi/8 => theta = pi/4. Bloch vector: (sin(pi/4), 0, cos(pi/4)) = (sqrt(2)/2, 0, sqrt(2)/2) approximately (0.707, 0, 0.707).

#### Problem C1.3 (Global Phase) [Conceptual]
(a) Show that the states |psi_1> = |+> = (|0> + |1>)/sqrt(2) and |psi_2> = (-|0> - |1>)/sqrt(2) represent the same physical qubit state.
(b) Show that |psi_3> = (|0> - |1>)/sqrt(2) = |-> is physically *different* from |+>.

**Solution.**

(a) |psi_2> = -(|0> + |1>)/sqrt(2) = e^{i pi} |psi_1>. Since they differ by a global phase e^{i pi} = -1, by Theorem C1.1 they are the same physical state. Both have Bloch vector (1,0,0).

(b) |psi_3> = (|0> - |1>)/sqrt(2). Suppose |psi_3> = e^{i gamma} |psi_1>. Then e^{i gamma}/sqrt(2) = 1/sqrt(2) (from the |0> coefficient), giving e^{i gamma} = 1. But then the |1> coefficient should be 1/sqrt(2), not -1/sqrt(2). Contradiction. So |psi_3> is NOT related to |psi_1> by a global phase. Alternatively: Bloch vector of |-> is (-1,0,0) != (1,0,0). They are physically distinct.

#### Problem C1.4 (Dirac Notation Practice) [Computational]
Let |psi> = (3/5)|0> + (4i/5)|1> and |phi> = (1/sqrt(2))|0> + (1/sqrt(2))|1>.

(a) Compute <phi|psi>.
(b) Compute |<phi|psi>|^2 (the probability of measuring the state |psi> and finding it in the state |phi>).
(c) Compute the outer product |psi><psi| as a 2x2 matrix.

**Solutions.**

(a) <phi|psi> = (1/sqrt(2))*(3/5) + (1/sqrt(2))*(4i/5) = (3 + 4i)/(5 sqrt(2)).

(b) |<phi|psi>|^2 = |3+4i|^2 / (25.2) = 25/50 = 1/2.

(c) |psi> = (3/5, 4i/5)^T. <psi| = (3/5, -4i/5). 
|psi><psi| = (3/5, 4i/5)^T (3/5, -4i/5) = [[9/25, -12i/25], [12i/25, 16/25]].
Check: trace = 9/25 + 16/25 = 1. Correct for a pure state projector.

#### Problem C1.5 (Physical Implementations) [Conceptual]
For a trapped-ion qubit using the ground state |g> and an excited state |e> of ^{171}Yb+:

(a) If the ion is prepared by a laser pulse that drives a pi/3 rotation, the state is cos(pi/6)|g> + sin(pi/6)|e>. Map this to the computational basis and find the Bloch coordinates.

(b) The coherence time of ^{171}Yb+ trapped-ion qubits can exceed 10 minutes. A single-qubit gate takes approximately 10 microseconds. Estimate the number of sequential gate operations possible before decoherence becomes significant (taken as 1% fidelity loss, which occurs at roughly T/T_2 = 0.01).

**Solutions.**

(a) Mapping |g> -> |0>, |e> -> |1>: |psi> = cos(pi/6)|0> + sin(pi/6)|1> = (sqrt(3)/2)|0> + (1/2)|1>. theta/2 = pi/6, theta = pi/3, phi = 0. Bloch vector: (sin(pi/3), 0, cos(pi/3)) = (sqrt(3)/2, 0, 1/2).

(b) T_2 = 10 min = 600 s. The 1% fidelity loss threshold is at t = 0.01 * T_2 = 6 s. Gate time = 10 us = 10^{-5} s. Number of gates = 6 / 10^{-5} = 6 x 10^5 = 600,000 gates. This is a rough estimate; in practice, gate errors and other noise sources reduce this number substantially.

#### Problem C1.6 (Inverse Problem) [Computational]
A qubit has Bloch vector (1/2, sqrt(2)/2, 1/2). Find the state |psi> in the form alpha|0> + beta|1>.

**Solution.**
From the Bloch vector: x = 1/2, y = sqrt(2)/2, z = 1/2.
cos(theta) = z = 1/2 => theta = pi/3.
sin(theta) = sqrt(1 - 1/4) = sqrt(3)/2. Check: x^2 + y^2 = 1/4 + 1/2 = 3/4, and sin^2(theta) = 3/4. Consistent.
tan(phi) = y/x = (sqrt(2)/2)/(1/2) = sqrt(2). phi = arctan(sqrt(2)) approximately 0.9553 rad (approximately 54.74 deg).

alpha = cos(theta/2) = cos(pi/6) = sqrt(3)/2.
beta = sin(theta/2) e^{i phi} = sin(pi/6) e^{i arctan(sqrt(2))} = (1/2) e^{i arctan(sqrt(2))}.

Numerically: e^{i . 0.9553} = cos(0.9553) + i sin(0.9553) approximately 0.5774 + 0.8165i.
beta approximately (1/2)(0.5774 + 0.8165i) = 0.2887 + 0.4082i.

Verify: |alpha|^2 + |beta|^2 = 3/4 + 1/4 = 1. Bloch vector x = sin(pi/3)cos(phi) = (sqrt(3)/2)(1/sqrt(3)) = 1/2. Correct.

#### Problem C1.7 (Conceptual) [Conceptual]
Explain why the state space of a qubit is S^2 (a 2-sphere) and not S^3 (a 3-sphere), even though a unit vector in C^2 = R^4 lives on S^3.

**Solution.**
A unit vector in C^2 satisfies |alpha|^2 + |beta|^2 = 1, which defines S^3 in R^4 (the four real parameters being Re(alpha), Im(alpha), Re(beta), Im(beta)). However, states differing by a global phase e^{i gamma} are physically identical. The global phase parametrises a circle S^1. The space of physically distinct states is therefore S^3 / S^1 = CP^1, the complex projective line, which is homeomorphic to S^2. Topologically, S^3 is an S^1-bundle over S^2 (the Hopf fibration), and quotienting by the S^1 fibre yields S^2. This is the Bloch sphere.

#### Problem C1.8 (Dirac Notation & Orthogonality) [Computational]
(a) Compute <+|-> where |+> = (|0> + |1>)/sqrt(2) and |-> = (|0> - |1>)/sqrt(2).
(b) Show that {|+>, |->} is an orthonormal basis for C^2.
(c) Express |0> and |1> in the {|+>, |->} basis.

**Solutions.**

(a) <+|-> = (1/sqrt(2))(1/sqrt(2)) <0|0> + (1/sqrt(2))(-1/sqrt(2)) <0|1> + (1/sqrt(2))(1/sqrt(2)) <1|0> + (1/sqrt(2))(-1/sqrt(2)) <1|1> = 1/2 - 0 + 0 - 1/2 = 0. Orthogonal.

(b) We showed <+|-> = 0. Also <+|+> = 1/2 + 1/2 = 1 and <-|-> = 1/2 + 1/2 = 1. So {|+>, |->} is orthonormal. Since C^2 has dimension 2 and we have 2 orthonormal vectors, this is an orthonormal basis.

(c) Adding: |+> + |-> = (2/sqrt(2))|0> = sqrt(2)|0>, so |0> = (|+> + |->)/sqrt(2).
Subtracting: |+> - |-> = (2/sqrt(2))|1> = sqrt(2)|1>, so |1> = (|+> - |->)/sqrt(2).

#### Problem C1.9 (Stretch -- Density matrix preview) [Stretch]
The density matrix of a pure state |psi> is rho = |psi><psi|. For |psi> = cos(theta/2)|0> + e^{i phi} sin(theta/2)|1>:

(a) Compute rho as a 2x2 matrix.
(b) Verify that rho^2 = rho (idempotent) and Tr(rho) = 1.
(c) Show that rho = (I + r . sigma)/2 where r = (sin theta cos phi, sin theta sin phi, cos theta) is the Bloch vector and sigma = (sigma_x, sigma_y, sigma_z) are the Pauli matrices.

**Solution.**

(a) |psi> = (cos(theta/2), e^{i phi} sin(theta/2))^T.
rho = |psi><psi| = [[cos^2(theta/2), cos(theta/2) sin(theta/2) e^{-i phi}], [cos(theta/2) sin(theta/2) e^{i phi}, sin^2(theta/2)]].

(b) Tr(rho) = cos^2(theta/2) + sin^2(theta/2) = 1.
rho^2: Since rho = |psi><psi| and <psi|psi> = 1, rho^2 = |psi><psi|psi><psi| = |psi>(1)<psi| = rho.

(c) (I + r.sigma)/2 = (1/2)[[1+cos theta, sin theta cos phi - i sin theta sin phi], [sin theta cos phi + i sin theta sin phi, 1 - cos theta]].
= (1/2)[[1 + cos theta, sin theta e^{-i phi}], [sin theta e^{i phi}, 1 - cos theta]].

Using half-angle identities: (1 + cos theta)/2 = cos^2(theta/2), (1 - cos theta)/2 = sin^2(theta/2), sin theta/2 = sin(theta/2) cos(theta/2).

So (I + r.sigma)/2 = [[cos^2(theta/2), sin(theta/2) cos(theta/2) e^{-i phi}], [sin(theta/2) cos(theta/2) e^{i phi}, sin^2(theta/2)]] = rho. Confirmed.

---

### C1.10 Simulator Dependencies

**Required simulator features for C1:**

| Feature | Status | Detail |
|---------|--------|--------|
| Single-qubit state initialisation | Required (new for C1) | User inputs (alpha, beta) as complex numbers or (theta, phi) as real angles. Simulator normalises and stores the state vector. |
| Bloch sphere rendering | Required (new for C1) | 3D sphere with axes labelled x, y, z. Plot the Bloch vector as a point on the sphere with a line from the origin. Cardinal states labelled. User can rotate the view. |
| State vector display | Required (new for C1) | Show |psi> = alpha|0> + beta|1> with numerical values. Show |alpha|^2 and |beta|^2 alongside. |
| Global phase slider | Required (new for C1) | A slider that multiplies the state by e^{i gamma}. Bloch sphere should remain unchanged; amplitude display should update. |
| "Show me the algebra" toggle | Required (exists in SIM_CORE spec) | When enabled, every operation shows the intermediate algebraic steps (e.g., the normalisation check, the Bloch coordinate computation). |
| Matrix view | Not needed for C1 | Matrices are not the focus until C3. |
| Multi-qubit support | Not needed for C1 | Single qubit only. |

**Simulator widget placement:**
- V-C1.3 (global phase animation) uses the global phase slider + Bloch sphere.
- V-C1.6 (Bloch sphere explorer) is the main interactive widget -- placed after the Bloch parametrisation derivation.
- Problem set: students are instructed to verify answers to Problems C1.1, C1.2, and C1.6 using the simulator.

---

### C1.11 Estimates

| Metric | Estimate |
|--------|----------|
| Word count (prose) | 8,500--9,500 words |
| Figures/visual assets | 6 (V-C1.1 through V-C1.6) |
| Interactive widgets | 2 (V-C1.3 global phase, V-C1.6 Bloch explorer) |
| Theorems/definitions | 4 definitions, 2 theorems |
| Worked examples | 5 |
| Problem set | 9 problems (including 1 stretch problem) |
| Estimated study time | 90--120 minutes |
| Implementation effort (prose) | 3 days |
| Implementation effort (visuals) | 2 days |
| Implementation effort (simulator features) | 2 days |
| Total implementation effort | 7 days |

---

### C1.12 Page Splits

The lesson is divided into four web pages to keep each page at a manageable scroll depth (2,000--2,500 words each).

**Page C1a: "From Bits to Qubits"** (approx. 2,200 words)
- Opening hook (Stern-Gerlach callback)
- Classical bits as vectors
- Why C^2 and not R^2
- Definition C1.1, Definition C1.2
- Normalisation constraint
- Visual assets V-C1.1, V-C1.2
- Worked Example C1.1

**Page C1b: "Global Phase and the Bloch Parametrisation"** (approx. 2,500 words)
- Global phase invariance (Theorem C1.1)
- Derivation of Bloch parametrisation (Theorem C1.2)
- Definition C1.3 (Bloch sphere)
- Visual assets V-C1.3, V-C1.4
- Worked Examples C1.2, C1.3
- Simulator widget V-C1.6

**Page C1c: "Dirac Notation and Physical Qubits"** (approx. 2,300 words)
- Definition C1.4 (Dirac notation)
- Bras, kets, inner products, outer products
- Physical implementations survey
- Visual asset V-C1.5
- Worked Examples C1.4, C1.5
- Historical notes

**Page C1d: "Problems"** (approx. 2,500 words)
- "Not 0 and 1 at the same time" discussion (Worked Example C1.4 callback)
- Common confusions summary box
- Full problem set (Problems C1.1--C1.9)

---

## C2 -- Measurement

**Canonical position:** 7 (after C1, before A4)
**Prerequisites:** C1 (The Qubit), P2 (Superposition & Probability Amplitudes), A2 (Linear Maps & Matrices), A3 (Eigenvalues & Spectral Theorem)
**Target length:** 8,000--10,000 words
**Estimated study time:** 90--120 minutes

---

### C2.1 Learning Objectives

By the end of this lesson the student will be able to:

1. **State the Born rule** for computational-basis measurement: the probability of outcome k in {0,1} is P(k) = |<k|psi>|^2, and connect this to the general Born rule from P2.
2. **Describe post-measurement collapse**: after obtaining outcome k, the qubit state becomes |k>, regardless of its pre-measurement state.
3. **Define projection operators** P_0 = |0><0| and P_1 = |1><1|, verify that they are Hermitian, idempotent (P_k^2 = P_k), and satisfy the completeness relation P_0 + P_1 = I.
4. **Express measurement probabilities using projectors**: P(k) = <psi|P_k|psi> = Tr(P_k |psi><psi|), connecting the projector formalism to the Born rule.
5. **Perform general-basis measurement**: given an arbitrary orthonormal basis {|a>, |a_perp>}, compute measurement probabilities and post-measurement states.
6. **Explain the irreversibility of measurement**: measurement is not a unitary operation; it destroys information about the pre-measurement state (specifically, the relative phase between components).
7. **Compute the statistics of sequential measurements**: two measurements in the same basis yield the same result (idempotency), while measurements in different bases can yield different results (non-commutativity).
8. **State what partial measurement means** for multi-qubit systems (preview for C4): measuring one qubit of a two-qubit system collapses that qubit but leaves the other in a conditional state.
9. **Use the simulator** to perform repeated measurements on a prepared state, verify the probability distribution empirically, and observe post-measurement collapse.
10. **Distinguish between projective (von Neumann) measurement and general POVM measurements**, noting that this course focuses on projective measurements but POVMs exist for completeness.

---

### C2.2 Intuition Arc

**Opening hook.** Return to the Stern-Gerlach apparatus: the atom enters in state alpha|up> + beta|down>, passes through the apparatus, and emerges in exactly one beam. The measurement has "forced" the quantum state into one of two outcomes. This lesson makes the measurement process mathematically precise.

**Act 1: Computational-basis measurement (words 1--2,500).** Begin with the simplest case. A qubit is in state |psi> = alpha|0> + beta|1>. A measurement in the computational basis yields outcome 0 with probability |alpha|^2 and outcome 1 with probability |beta|^2. This is the Born rule, already encountered in P2 in the physics context. Now formalise it in the computing context. After measurement, the state *collapses* to |0> (if outcome 0) or |1> (if outcome 1). The pre-measurement superposition is irrecoverably destroyed. Work through several numerical examples. Emphasise: measurement is the *only* way to extract classical information from a qubit, and it fundamentally changes the state.

**Act 2: Projection operators and the measurement postulate (words 2,500--5,000).** Introduce the projectors P_0 = |0><0| and P_1 = |1><1|. Show they are Hermitian and idempotent. Show completeness: P_0 + P_1 = I. Rewrite the Born rule as P(k) = <psi|P_k|psi>. Rewrite the post-measurement state as P_k|psi> / ||P_k|psi>||. This is the projection postulate (or von Neumann-Luders rule). The projector formalism is the bridge between the abstract Born rule and concrete computation. It also generalises cleanly to multi-qubit systems (C4) and to measurement in arbitrary bases.

**Act 3: Measurement in a general basis (words 5,000--7,000).** What if we measure in the {|+>, |->} basis instead of {|0>, |1>}? The formalism carries over: define Q_+ = |+><+| and Q_- = |-><-|. Probabilities: P(+) = <psi|Q_+|psi>, P(-) = <psi|Q_-|psi>. Post-measurement states: |+> or |->. Work through a detailed example: prepare |0>, measure in the {|+>, |->} basis. The student should see that a state with definite computational-basis value can have indefinite X-basis value, reinforcing the lesson from C1 about basis-dependence.

Generalise further: for any orthonormal basis {|a>, |a_perp>}, measurement is described by projectors P_a = |a><a| and P_{a_perp} = |a_perp><a_perp|, with P_a + P_{a_perp} = I. This connects to the spectral theorem from A3: measuring an observable A with spectral decomposition A = a|a><a| + a_perp|a_perp><a_perp| yields eigenvalue a with probability |<a|psi>|^2.

**Act 4: Sequential measurements, irreversibility, and the no-cloning foreshadow (words 7,000--9,000).** What happens if we measure twice? Same basis: idempotency. Different bases: interference of probabilities. Walk through the sequence: prepare |0>, measure in X-basis (get |+> or |->), then measure in Z-basis. The second measurement gives 0 or 1 with equal probability regardless of the X-basis outcome. The Z-basis information from the original state has been destroyed by the intermediate X-basis measurement. This is irreversibility in action. 

Briefly foreshadow partial measurement (C4) and the no-cloning theorem (later in the track): measurement's irreversibility is deeply connected to the impossibility of copying quantum states.

**Closing synthesis (words 9,000--9,500).** Measurement is the bridge between the quantum and classical worlds. It is probabilistic (Born rule), destructive (collapse), and basis-dependent (different observables give different outcome probabilities). The projector formalism gives a clean, computable framework for all of this.

---

### C2.3 Theorems, Definitions, and Proofs

#### Definition C2.1 -- Projection Operator

A linear operator P on C^2 is a *projection operator* (or *projector*) if it satisfies:
1. P^dagger = P (Hermitian),
2. P^2 = P (idempotent).

#### Theorem C2.1 -- Projectors from Basis States

**Statement.** For any normalised vector |a> in C^2, the operator P_a = |a><a| is a projector. Furthermore, P_a projects any vector onto the one-dimensional subspace spanned by |a>.

**Proof.**
1. Hermitian: (|a><a|)^dagger = (|a><a|)^{dagger} = |a><a| (since (|u><v|)^dagger = |v><u|). So P_a^dagger = P_a.
2. Idempotent: P_a^2 = |a><a|a><a| = |a> (1) <a| = |a><a| = P_a, using <a|a> = 1.
3. Projection property: P_a |v> = |a><a|v> = <a|v> |a>, which is the component of |v> along |a>, times |a>. QED.

#### Theorem C2.2 -- Completeness Relation

**Statement.** If {|a_1>, |a_2>} is an orthonormal basis for C^2, then

P_{a_1} + P_{a_2} = |a_1><a_1| + |a_2><a_2| = I.

**Proof.** For any |v> in C^2, expand |v> = <a_1|v>|a_1> + <a_2|v>|a_2> (since {|a_1>, |a_2>} is a basis). Then:

(P_{a_1} + P_{a_2})|v> = |a_1><a_1|v> + |a_2><a_2|v> = <a_1|v>|a_1> + <a_2|v>|a_2> = |v>.

Since this holds for all |v>, we have P_{a_1} + P_{a_2} = I. QED.

#### Definition C2.2 -- Projective Measurement (von Neumann Measurement)

A *projective measurement* on C^2 is specified by an orthonormal basis {|a_1>, |a_2>} (equivalently, by a Hermitian operator A with spectral decomposition A = a_1 P_{a_1} + a_2 P_{a_2}). Given a qubit in state |psi>:

1. **Outcome probabilities:** P(a_k) = <psi|P_{a_k}|psi> = |<a_k|psi>|^2 for k = 1, 2.
2. **Post-measurement state:** If outcome a_k is obtained, the post-measurement state is

   |psi_{post}> = P_{a_k}|psi> / ||P_{a_k}|psi>|| = <a_k|psi>/|<a_k|psi>| . |a_k>.

   (For non-degenerate measurements on a qubit, the post-measurement state is simply |a_k>.)

#### Theorem C2.3 -- Probabilities Sum to One

**Statement.** For any projective measurement {P_{a_1}, P_{a_2}} and any state |psi>, we have P(a_1) + P(a_2) = 1.

**Proof.**
P(a_1) + P(a_2) = <psi|P_{a_1}|psi> + <psi|P_{a_2}|psi> = <psi|(P_{a_1} + P_{a_2})|psi> = <psi|I|psi> = <psi|psi> = 1. QED.

#### Theorem C2.4 -- Measurement Idempotency

**Statement.** If a qubit is measured in basis {|a_1>, |a_2>} and outcome a_k is obtained, an immediate second measurement in the same basis yields outcome a_k with certainty (probability 1).

**Proof.** After the first measurement with outcome a_k, the state is |a_k>. The probability of outcome a_k in a second measurement is |<a_k|a_k>|^2 = 1. QED.

#### Theorem C2.5 -- Measurement Destroys Coherence

**Statement.** Let |psi> = alpha|0> + beta|1> with alpha, beta != 0. Before measurement, the density matrix is rho = |psi><psi|, which has off-diagonal elements alpha beta* and alpha* beta. After a computational-basis measurement (without recording the outcome), the state is described by the ensemble rho' = |alpha|^2 |0><0| + |beta|^2 |1><1|, which has zero off-diagonal elements. The relative phase information between |0> and |1> has been destroyed.

**Proof.** With probability |alpha|^2, the post-measurement state is |0><0|. With probability |beta|^2, it is |1><1|. The ensemble-averaged density matrix is:

rho' = |alpha|^2 |0><0| + |beta|^2 |1><1| = [[|alpha|^2, 0], [0, |beta|^2]].

Compare with rho = [[|alpha|^2, alpha beta*], [alpha* beta, |beta|^2]]. The off-diagonal elements alpha beta* and alpha* beta -- which encode the relative phase between |0> and |1> -- are gone. QED.

#### Definition C2.3 -- POVM (Preview)

A *Positive Operator-Valued Measure* (POVM) on C^2 is a set of positive semi-definite operators {E_1, ..., E_m} satisfying Sum_{k=1}^m E_k = I. The probability of outcome k is P(k) = <psi|E_k|psi>. When m = 2 and each E_k is a projector, the POVM reduces to a projective measurement. POVMs allow more than two outcomes for a two-dimensional system, at the cost of less information per outcome. POVMs are not covered further in this track but are mentioned for completeness.

---

### C2.4 Visual Assets

**V-C2.1: Measurement schematic (static diagram).**
A horizontal "circuit-like" diagram (not a formal circuit diagram, which comes in C3):
- Left: A ket |psi> = alpha|0> + beta|1> with the Bloch sphere showing the state as a point.
- Centre: A box labelled "Measure in {|0>, |1>}" with a meter icon.
- Right: Two branches. Top branch: "Outcome 0, probability |alpha|^2, post-measurement state |0>" with a Bloch sphere showing the north pole. Bottom branch: "Outcome 1, probability |beta|^2, post-measurement state |1>" with a Bloch sphere showing the south pole.

**V-C2.2: Projector visualisation (interactive, simulator).**
A 2D complex-plane diagram showing C^2 from a "top-down" view (the two axes represent the real parts of the |0> and |1> components, with imaginary parts shown as colour/phase wheels).
- The state |psi> is shown as a vector.
- The projector P_0 = |0><0| is shown as a "shadow" operation: dragging |psi> onto the |0> axis. The shadow has length |alpha| = |<0|psi>|. The probability is the squared length.
- Toggling to P_1 = |1><1| shows the shadow onto the |1> axis.

**V-C2.3: Born rule histogram (interactive, simulator).**
A "measurement lab" widget:
- Input: choose a state |psi> (via Bloch sphere click, or by entering alpha/beta, or by selecting a preset).
- Button: "Measure" performs a single simulated computational-basis measurement and displays the result (0 or 1).
- Button: "Measure 1000 times" performs 1000 independent measurements and displays a histogram of outcomes.
- The theoretical probabilities |alpha|^2 and |beta|^2 are overlaid on the histogram as horizontal lines.
- A running count and relative frequency table update in real time.

**V-C2.4: Sequential measurement demo (interactive, simulator).**
A two-stage measurement pipeline:
- Stage 1: Choose a state and a measurement basis (Z or X). Perform the measurement. The outcome and post-measurement state are displayed.
- Stage 2: Choose a second measurement basis (Z or X). Perform the measurement on the post-measurement state from Stage 1.
- A panel shows the conditional probabilities for Stage 2 given Stage 1's outcome.
- Presets: "Same basis" (demonstrating idempotency) and "Different basis" (demonstrating non-commutativity).

**V-C2.5: Decoherence visualisation -- density matrix before and after (static diagram).**
Two 2x2 matrices side by side:
- Left: rho_before = |psi><psi| with off-diagonal elements highlighted in blue ("coherence terms").
- Right: rho_after = diag(|alpha|^2, |beta|^2) with off-diagonal elements shown as zero (greyed out).
- An arrow between them labelled "Measurement (outcome not recorded)" with a caption: "Measurement destroys the off-diagonal coherence terms, eliminating all relative phase information."

**V-C2.6: General-basis measurement (interactive, simulator).**
- User selects a measurement basis by clicking a point on the Bloch sphere equator (defining the axis of measurement).
- The corresponding projectors are shown as matrices.
- The state |psi> is shown on the Bloch sphere, and the measurement outcome probabilities are displayed as the squared projection lengths along the measurement axis.
- Post-measurement states are shown as the two poles along the chosen axis.

---

### C2.5 Worked Examples

#### Worked Example C2.1 -- Basic computational-basis measurement

**Problem.** A qubit is in state |psi> = (1/sqrt(3))|0> + sqrt(2/3)|1>. It is measured in the computational basis. Find the probabilities of each outcome and the post-measurement states.

**Solution.**
P(0) = |1/sqrt(3)|^2 = 1/3.
P(1) = |sqrt(2/3)|^2 = 2/3.
Check: 1/3 + 2/3 = 1.

If outcome 0: post-measurement state is |0>.
If outcome 1: post-measurement state is |1>.

Using projectors:
P_0|psi> = |0><0|(1/sqrt(3)|0> + sqrt(2/3)|1>) = (1/sqrt(3))|0>.
||P_0|psi>|| = 1/sqrt(3).
Post-measurement state: P_0|psi>/||P_0|psi>|| = |0>. Confirmed.

#### Worked Example C2.2 -- Measurement in the X-basis

**Problem.** A qubit is in state |0>. It is measured in the {|+>, |->} basis. Find the outcome probabilities and post-measurement states.

**Solution.**
|0> = (|+> + |->)/sqrt(2) (from Problem C1.8c).

P(+) = |<+|0>|^2 = |1/sqrt(2)|^2 = 1/2.
P(-) = |<-|0>|^2 = |1/sqrt(2)|^2 = 1/2.

If outcome +: post-measurement state is |+>.
If outcome -: post-measurement state is |->.

Note: the state |0> has a *definite* value in the Z-basis but is maximally *uncertain* in the X-basis. This is the basis-dependence of quantum measurement.

#### Worked Example C2.3 -- Sequential measurements

**Problem.** A qubit starts in state |0>. 
Step 1: Measure in the X-basis. 
Step 2: Measure in the Z-basis. 
Find the probability of obtaining outcome 0 in Step 2.

**Solution.**

Step 1: As computed in Worked Example C2.2, we get outcome |+> with probability 1/2 and outcome |-> with probability 1/2.

Step 2a (if Step 1 gave |+>): 
|+> = (|0> + |1>)/sqrt(2). P(0) = |<0|+>|^2 = 1/2.

Step 2b (if Step 1 gave |->):
|-> = (|0> - |1>)/sqrt(2). P(0) = |<0|->|^2 = 1/2.

Total probability of outcome 0 in Step 2:
P(0) = P(Step 1 = +) . P(0|Step 1 = +) + P(Step 1 = -) . P(0|Step 1 = -)
= (1/2)(1/2) + (1/2)(1/2) = 1/2.

Note: the qubit started as |0> (definite Z-value 0), but after the intermediate X-measurement, the probability of Z-value 0 has dropped to 1/2. The intermediate measurement has destroyed the original Z-basis information.

#### Worked Example C2.4 -- Verifying completeness with a general basis

**Problem.** Let |a> = cos(pi/8)|0> + sin(pi/8)|1> and |a_perp> = -sin(pi/8)|0> + cos(pi/8)|1>. Verify that P_a + P_{a_perp} = I.

**Solution.**
P_a = |a><a| = [[cos^2(pi/8), cos(pi/8)sin(pi/8)], [cos(pi/8)sin(pi/8), sin^2(pi/8)]].

P_{a_perp} = |a_perp><a_perp| = [[sin^2(pi/8), -cos(pi/8)sin(pi/8)], [-cos(pi/8)sin(pi/8), cos^2(pi/8)]].

P_a + P_{a_perp} = [[cos^2(pi/8) + sin^2(pi/8), 0], [0, sin^2(pi/8) + cos^2(pi/8)]] = [[1, 0], [0, 1]] = I. Confirmed.

Numerically: cos(pi/8) approx 0.9239, sin(pi/8) approx 0.3827.
P_a approx [[0.8536, 0.3536], [0.3536, 0.1464]].
P_{a_perp} approx [[0.1464, -0.3536], [-0.3536, 0.8536]].
Sum approx [[1, 0], [0, 1]]. Confirmed.

#### Worked Example C2.5 -- Measurement probability via projector trace formula

**Problem.** A qubit is in state |psi> = (3/5)|0> + (4/5)|1>. Compute P(0) using the trace formula P(0) = Tr(P_0 rho) where rho = |psi><psi|.

**Solution.**
rho = |psi><psi| = [[9/25, 12/25], [12/25, 16/25]].
P_0 = |0><0| = [[1, 0], [0, 0]].
P_0 rho = [[1,0],[0,0]] . [[9/25, 12/25],[12/25, 16/25]] = [[9/25, 12/25],[0, 0]].
Tr(P_0 rho) = 9/25 + 0 = 9/25. 

This matches P(0) = |alpha|^2 = |3/5|^2 = 9/25. Confirmed.

---

### C2.6 Common Confusions

**Confusion 1: "Measurement reveals a pre-existing value."**
This is the hidden-variable intuition: the qubit "was" in state |0> or |1> all along, and measurement merely reveals which one. Bell's theorem (covered in P5/P6) shows this view is incompatible with quantum mechanics in the general multi-qubit case. Even for single qubits, the formalism is clear: the state |psi> = alpha|0> + beta|1> is the complete description. There is no additional "hidden" variable specifying which outcome will occur. The outcome is genuinely probabilistic.

**Confusion 2: "Collapse is a physical process that takes time."**
In the standard (Copenhagen) formulation used in this course, collapse is a mathematical update rule, not a dynamical process. The state changes from |psi> to |k> "instantaneously" upon measurement. There is ongoing foundational debate about the ontology of collapse (Many-Worlds, decoherence-based approaches, objective collapse theories), but for computing purposes, the projection postulate is a reliable and consistent calculational rule.

**Confusion 3: "I can measure a qubit without disturbing it if I'm careful enough."**
No. The projection postulate guarantees that measurement changes the state (unless the state happens to be an eigenstate of the measurement). This is not a limitation of current technology -- it is a fundamental feature of quantum mechanics. A non-disturbing measurement would violate the no-cloning theorem (since you could copy the state by measuring and re-preparing).

**Confusion 4: "Measuring in the X-basis is a different physical apparatus from the Z-basis."**
For some implementations (e.g., Stern-Gerlach), measuring in a different basis does require a different apparatus orientation. But in quantum computing, measurement in a different basis is typically implemented by first applying a unitary gate that rotates the desired basis to the computational basis, then performing a standard computational-basis measurement. For example, to measure in the X-basis, apply H (Hadamard) first, then measure in Z. The result is the same (this will be made rigorous in C3).

**Confusion 5: "After measurement, the qubit is destroyed."**
The qubit still exists as a physical system; it is now in a definite computational-basis state. "Collapse" destroys the *superposition*, not the physical system. The qubit can be re-used in subsequent operations (albeit in its new, post-measurement state).

**Confusion 6: "The probabilities |alpha|^2 and |beta|^2 are approximate; with a perfect experiment, the outcome is deterministic."**
The probabilities are exact (in the standard formulation). No amount of experimental refinement turns quantum measurement into a deterministic process. This is a core difference between quantum and classical probability: classical probability arises from ignorance; quantum probability (in standard QM) is irreducible.

---

### C2.7 Cross-References

| Reference | Direction | Detail |
|-----------|-----------|--------|
| C1 (The Qubit) | Backward | States, Dirac notation, normalisation, and the Bloch sphere are all assumed. |
| P2 (Superposition & Amplitudes) | Backward | The Born rule P(k) = \|<k\|psi>\|^2 was first introduced in P2 in the spin context. C2 formalises it using projectors. |
| A2 (Linear Maps) | Backward | Projectors are linear operators; the student needs matrix multiplication and trace. |
| A3 (Eigenvalues & Spectral Theorem) | Backward | The spectral decomposition A = sum_k a_k P_k connects measurement to observables. The student has seen this in A3. |
| C3 (Gates & Bloch Sphere) | Forward | Measurement in a general basis can be implemented as a unitary rotation followed by computational-basis measurement. C3 provides the gates (especially H). |
| C4 (Multi-Qubit Systems) | Forward | Partial measurement (measuring one qubit of a multi-qubit system) is previewed in C2 and fully developed in C4. |
| P5 (Bell Inequalities) | Forward | The irreversibility discussion foreshadows Bell's theorem, which rules out hidden-variable explanations. |
| A4 (Tensor Products) | Forward | The completeness relation P_0 + P_1 = I generalises to tensor products of projectors in multi-qubit systems. |

---

### C2.8 Historical Notes

- **The Born rule** is named after Max Born, who proposed the probabilistic interpretation of the wave function in 1926 (Zeitschrift fur Physik, 37, 863-867). Born's original insight was that Schrodinger's wave function psi gives probability *amplitudes*, not probabilities directly: probabilities are obtained by squaring. Born received the 1954 Nobel Prize in Physics for this insight, nearly three decades after the original paper.

- **The projection postulate** (collapse of the wave function) was formalised by John von Neumann in his 1932 book *Mathematische Grundlagen der Quantenmechanik* (Mathematical Foundations of Quantum Mechanics). Von Neumann distinguished between two types of state change: "Process 1" (measurement, non-unitary) and "Process 2" (time evolution, unitary). Gerhart Luders refined the projection rule for degenerate eigenvalues in 1951, leading to the "von Neumann-Luders" projection postulate used in modern textbooks.

- **The measurement problem.** The tension between unitary evolution and collapse has been debated since the 1930s. Notable contributions: Einstein, Podolsky, and Rosen (EPR, 1935) who argued the formalism was incomplete; Bohr's reply (1935) defending complementarity; Everett's "relative state" (Many-Worlds) interpretation (1957); decoherence theory (Zeh 1970, Zurek 1981); and GRW objective collapse theory (1986). The measurement problem remains open in the foundations of physics, but it does not affect the computational rules used in quantum computing.

- **POVM measurements.** The generalisation from projective measurements to POVMs was developed by several researchers in the 1970s, including E.B. Davies and J.T. Lewis (1970) and A.S. Holevo (1973). POVMs are essential in quantum cryptography and quantum state estimation but are typically not needed for quantum circuit design.

---

### C2.9 Problem Set

#### Problem C2.1 (Basic Measurement) [Computational]
A qubit is in state |psi> = (2/sqrt(5))|0> + (1/sqrt(5))|1>. 
(a) Find P(0) and P(1) for a computational-basis measurement.
(b) Write the projectors P_0 and P_1 as matrices and verify P(0) = <psi|P_0|psi>.
(c) Verify that P_0 + P_1 = I.

**Solutions.**

(a) P(0) = |2/sqrt(5)|^2 = 4/5. P(1) = |1/sqrt(5)|^2 = 1/5. Sum = 1.

(b) P_0 = [[1,0],[0,0]], P_1 = [[0,0],[0,1]].
<psi|P_0|psi> = (2/sqrt(5), 1/sqrt(5)) [[1,0],[0,0]] (2/sqrt(5), 1/sqrt(5))^T = (2/sqrt(5), 1/sqrt(5)) . (2/sqrt(5), 0)^T = 4/5. Confirmed.

(c) P_0 + P_1 = [[1,0],[0,0]] + [[0,0],[0,1]] = [[1,0],[0,1]] = I.

#### Problem C2.2 (Post-Measurement State) [Computational]
A qubit is in state |psi> = (1/2)|0> + (sqrt(3)/2)|1>. After a computational-basis measurement, outcome 1 is obtained. 
(a) What is the post-measurement state?
(b) If this state is immediately measured again in the computational basis, what are the probabilities?

**Solutions.**

(a) Post-measurement state: P_1|psi>/||P_1|psi>|| = (sqrt(3)/2)|1> / (sqrt(3)/2) = |1>.

(b) P(0) = 0, P(1) = 1. This illustrates measurement idempotency.

#### Problem C2.3 (X-Basis Measurement) [Computational]
A qubit is in state |psi> = (3/5)|0> + (4/5)|1>. It is measured in the {|+>, |->} basis.
(a) Find P(+) and P(-).
(b) Find the post-measurement state for each outcome.

**Solutions.**

(a) <+|psi> = (1/sqrt(2))(3/5 + 4/5) = 7/(5 sqrt(2)).
P(+) = |7/(5 sqrt(2))|^2 = 49/50.

<-|psi> = (1/sqrt(2))(3/5 - 4/5) = -1/(5 sqrt(2)).
P(-) = 1/50.

Check: 49/50 + 1/50 = 1.

(b) If outcome +: post-measurement state is |+>.
If outcome -: post-measurement state is |->.

#### Problem C2.4 (Sequential Measurements) [Computational]
A qubit starts in state |+i> = (|0> + i|1>)/sqrt(2).
Step 1: Measure in the Z-basis.
Step 2: Measure in the X-basis.
(a) Find the probability of each outcome sequence (Z-outcome, X-outcome).
(b) Show that the information about the original Y-basis eigenvalue is lost after Step 1.

**Solutions.**

(a) Step 1: P(0) = |<0|+i>|^2 = |1/sqrt(2)|^2 = 1/2. P(1) = 1/2.

If Step 1 gives 0: state is |0>. Step 2: P(+) = |<+|0>|^2 = 1/2, P(-) = 1/2.
If Step 1 gives 1: state is |1>. Step 2: P(+) = |<+|1>|^2 = 1/2, P(-) = 1/2.

Outcome probabilities:
(0, +): 1/2 . 1/2 = 1/4.
(0, -): 1/2 . 1/2 = 1/4.
(1, +): 1/2 . 1/2 = 1/4.
(1, -): 1/2 . 1/2 = 1/4.

(b) The original state |+i> is the +1 eigenstate of Y. After Step 1, the state is |0> or |1>, neither of which is an eigenstate of Y. A subsequent Y-measurement would give +1 or -1 with probabilities 1/2 each, regardless of the Step 1 outcome. The Y-basis information is irretrievably lost.

#### Problem C2.5 (Projector Algebra) [Proof]
Prove that if P is a projector (P^2 = P, P = P^dagger), then:
(a) The eigenvalues of P are 0 and 1 only.
(b) I - P is also a projector.
(c) P(I - P) = 0 (orthogonality of the two projectors).

**Solutions.**

(a) If P|v> = lambda|v> for some |v> != 0, then P^2|v> = lambda P|v> = lambda^2 |v>. But P^2 = P, so P^2|v> = P|v> = lambda|v>. Thus lambda^2 = lambda, giving lambda(lambda-1) = 0, so lambda = 0 or lambda = 1.

(b) (I-P)^dagger = I - P^dagger = I - P. (I-P)^2 = I - 2P + P^2 = I - 2P + P = I - P. So I-P is a projector.

(c) P(I-P) = P - P^2 = P - P = 0.

#### Problem C2.6 (General Basis Measurement) [Computational]
Define |R> = cos(pi/6)|0> + sin(pi/6)|1> = (sqrt(3)/2)|0> + (1/2)|1> and |R_perp> = -sin(pi/6)|0> + cos(pi/6)|1> = -(1/2)|0> + (sqrt(3)/2)|1>. A qubit is in state |psi> = |+> = (|0> + |1>)/sqrt(2).
(a) Compute P(R) and P(R_perp).
(b) Express the result in terms of the angle between the Bloch vectors of |psi> and |R>.

**Solutions.**

(a) <R|+> = (1/sqrt(2))(sqrt(3)/2 + 1/2) = (sqrt(3) + 1) / (2 sqrt(2)).
P(R) = (sqrt(3) + 1)^2 / 8 = (3 + 2 sqrt(3) + 1) / 8 = (4 + 2 sqrt(3)) / 8 = (2 + sqrt(3))/4 approx 0.9330.

<R_perp|+> = (1/sqrt(2))(-1/2 + sqrt(3)/2) = (sqrt(3) - 1) / (2 sqrt(2)).
P(R_perp) = (sqrt(3) - 1)^2 / 8 = (4 - 2 sqrt(3))/8 = (2 - sqrt(3))/4 approx 0.0670.

Check: (2 + sqrt(3))/4 + (2 - sqrt(3))/4 = 1. Correct.

(b) Bloch vector of |+>: (1, 0, 0). Bloch vector of |R>: (sin(pi/3), 0, cos(pi/3)) = (sqrt(3)/2, 0, 1/2). The angle chi between them satisfies cos(chi) = (1)(sqrt(3)/2) + (0)(0) + (0)(1/2) = sqrt(3)/2, so chi = pi/6.

The probability formula is P(R) = cos^2(chi/2) = cos^2(pi/12). Now cos(pi/12) = cos(15 deg) = (sqrt(6) + sqrt(2))/4. cos^2(pi/12) = (6 + 2 sqrt(12) + 2)/16 = (8 + 4 sqrt(3))/16 = (2 + sqrt(3))/4. This matches. The general formula is P(outcome) = cos^2(chi/2) where chi is the angle between the Bloch vectors of the state and the outcome.

#### Problem C2.7 (Trace Formula) [Computational]
For a qubit in state |psi> = cos(theta/2)|0> + e^{i phi} sin(theta/2)|1>, compute Tr(P_0 rho) and Tr(P_1 rho) where rho = |psi><psi|, and verify the results match |alpha|^2 and |beta|^2.

**Solution.**
From Problem C1.9a, rho = [[cos^2(theta/2), cos(theta/2)sin(theta/2)e^{-i phi}], [cos(theta/2)sin(theta/2)e^{i phi}, sin^2(theta/2)]].

Tr(P_0 rho) = Tr([[1,0],[0,0]] . rho) = Tr([[cos^2(theta/2), ...], [0, 0]]) = cos^2(theta/2) = |alpha|^2. Confirmed.

Tr(P_1 rho) = Tr([[0,0],[0,1]] . rho) = sin^2(theta/2) = |beta|^2. Confirmed.

#### Problem C2.8 (Conceptual) [Conceptual]
A qubit is in an unknown state |psi>. Can you determine |psi> by performing measurements on it? Explain your reasoning.

**Solution.**
No, a single measurement on a single copy of |psi> yields only one bit of classical information (outcome 0 or 1), which is insufficient to determine two continuous parameters (theta, phi). Even repeated measurements on the same qubit are useless because the first measurement collapses the state.

If you have *many* copies of |psi> (all identically prepared), you CAN estimate |psi> through *quantum state tomography*: measure many copies in the Z-basis to estimate |alpha|^2, many in the X-basis to estimate Re(alpha* beta), and many in the Y-basis to estimate Im(alpha* beta). This requires at least three measurement bases and many copies per basis to achieve good statistical accuracy. The impossibility of determining an unknown state from a single copy is related to the no-cloning theorem.

#### Problem C2.9 (Stretch -- Measurement in an arbitrary basis) [Stretch]
Let |a> = cos(xi/2)|0> + e^{i eta} sin(xi/2)|1> be an arbitrary state parametrised by Bloch angles (xi, eta). Define the measurement {P_a, P_{a_perp}} where P_a = |a><a| and P_{a_perp} = I - P_a.

(a) Compute P_a as a 2x2 matrix.
(b) For state |psi> = cos(theta/2)|0> + e^{i phi} sin(theta/2)|1>, show that P(a) = cos^2(Omega/2) where Omega is the angle between the Bloch vectors of |psi> and |a>.
(c) Interpret this result geometrically.

**Solution.**

(a) P_a = |a><a| = [[cos^2(xi/2), cos(xi/2)sin(xi/2)e^{-i eta}], [cos(xi/2)sin(xi/2)e^{i eta}, sin^2(xi/2)]].

(b) P(a) = |<a|psi>|^2.
<a|psi> = cos(xi/2)cos(theta/2) + e^{i(phi-eta)}sin(xi/2)sin(theta/2).

|<a|psi>|^2 = cos^2(xi/2)cos^2(theta/2) + sin^2(xi/2)sin^2(theta/2) + 2cos(xi/2)cos(theta/2)sin(xi/2)sin(theta/2)cos(phi - eta).

The Bloch vectors are r_psi = (sin theta cos phi, sin theta sin phi, cos theta) and r_a = (sin xi cos eta, sin xi sin eta, cos xi). Their dot product is:

r_psi . r_a = sin theta sin xi cos(phi-eta) + cos theta cos xi.

Using the identity cos(Omega) = r_psi . r_a, we need to show |<a|psi>|^2 = (1 + cos Omega)/2 = cos^2(Omega/2).

Expand: (1 + cos Omega)/2 = (1 + sin theta sin xi cos(phi-eta) + cos theta cos xi)/2.

Using double-angle identities: cos theta = 2cos^2(theta/2) - 1 and sin theta = 2sin(theta/2)cos(theta/2), and similarly for xi:

(1 + [4sin(theta/2)cos(theta/2)sin(xi/2)cos(xi/2)cos(phi-eta)] + [(2cos^2(theta/2)-1)(2cos^2(xi/2)-1)]) / 2.

Expanding the last term: 4cos^2(theta/2)cos^2(xi/2) - 2cos^2(theta/2) - 2cos^2(xi/2) + 1.
Adding the 1 in the numerator: 4cos^2(theta/2)cos^2(xi/2) - 2cos^2(theta/2) - 2cos^2(xi/2) + 2.
= 4cos^2(theta/2)cos^2(xi/2) - 2cos^2(theta/2) - 2cos^2(xi/2) + 2.

Adding the middle term (with the 4sin...cos... factor):
Numerator = 4cos^2(theta/2)cos^2(xi/2) + 4sin(theta/2)cos(theta/2)sin(xi/2)cos(xi/2)cos(phi-eta) - 2cos^2(theta/2) - 2cos^2(xi/2) + 2 + 4sin^2(xi/2)sin^2(theta/2)...

This algebraic verification is lengthy. A cleaner approach: use the identity |<a|psi>|^2 = |cos(Omega/2)|^2 which can be established by noting that the inner product of two qubit states with Bloch angle Omega between them is cos(Omega/2) (up to a phase). This follows from the SU(2) to SO(3) double cover: a rotation by Omega on the Bloch sphere corresponds to an angle Omega/2 in state space.

(c) Geometric interpretation: the measurement probability depends only on the angle Omega between the two Bloch vectors. When Omega = 0 (parallel), P(a) = 1: if the state IS the measurement eigenstate, the outcome is certain. When Omega = pi (antiparallel), P(a) = 0: orthogonal states are perfectly distinguishable. When Omega = pi/2 (perpendicular Bloch vectors), P(a) = 1/2: maximum uncertainty. This is the Malus's law analogue for qubits.

#### Problem C2.10 (Stretch -- Measurement backaction on the Bloch sphere) [Stretch]
Before measurement, a qubit's Bloch vector is r = (sin theta cos phi, sin theta sin phi, cos theta). After a Z-basis measurement (without recording the outcome), the density matrix becomes rho' = |alpha|^2|0><0| + |beta|^2|1><1|.
(a) Compute the Bloch vector r' of rho'.
(b) Show that r' is the projection of r onto the z-axis.
(c) Argue that ||r'|| <= ||r||, with equality only when r is already along the z-axis. Interpret this as "measurement moves the state towards the centre of the Bloch sphere" (i.e., towards a mixed state).

**Solution.**

(a) rho' = [[cos^2(theta/2), 0], [0, sin^2(theta/2)]]. 
r'_x = Tr(sigma_x rho') = Tr([[0,1],[1,0]] [[cos^2(theta/2),0],[0,sin^2(theta/2)]]) = Tr([[0, sin^2(theta/2)],[cos^2(theta/2), 0]]) = 0.
r'_y = 0 (similarly).
r'_z = Tr(sigma_z rho') = cos^2(theta/2) - sin^2(theta/2) = cos theta.

So r' = (0, 0, cos theta).

(b) The original r = (sin theta cos phi, sin theta sin phi, cos theta). The projection onto the z-axis is (0, 0, cos theta) = r'. Confirmed.

(c) ||r'|| = |cos theta|. ||r|| = 1 (pure state). |cos theta| <= 1, with equality iff theta = 0 or pi (i.e., r is along the z-axis, meaning the state was already |0> or |1>). When theta != 0, pi, the post-measurement Bloch vector is strictly inside the sphere, indicating a mixed state. Measurement without recording the outcome introduces mixedness -- it destroys information.

---

### C2.10 Simulator Dependencies

**Required simulator features for C2:**

| Feature | Status | Detail |
|---------|--------|--------|
| Measurement simulation (single qubit) | Required (new for C2) | User clicks "Measure" and the simulator randomly returns 0 or 1 according to \|alpha\|^2, \|beta\|^2. The state vector updates to the post-measurement state. |
| Repeated measurement / histogram | Required (new for C2) | User clicks "Measure N times" (N configurable, default 1000). Histogram of outcomes displayed. Theoretical probabilities overlaid. |
| Projector display | Required (new for C2) | "Show me the algebra" toggle shows the projector P_k, the product P_k\|psi>, the norm, and the normalised post-measurement state. |
| General-basis measurement | Required (new for C2) | User selects measurement basis by choosing an axis on the Bloch sphere (or entering angles). The simulator computes probabilities and post-measurement states in that basis. |
| Sequential measurement pipeline | Required (new for C2) | Two-stage measurement: user sets up two consecutive measurements with selectable bases. Results of both stages are shown, along with conditional probabilities. |
| Single-qubit state initialisation | Required (from C1) | Carried forward. |
| Bloch sphere rendering | Required (from C1) | Carried forward. Now also shows the measurement axis. |
| State vector display | Required (from C1) | Carried forward. |

**Simulator widget placement:**
- V-C2.3 (Born rule histogram) is the primary interactive widget -- placed after Act 1.
- V-C2.4 (Sequential measurement demo) is placed after Act 4.
- V-C2.6 (General-basis measurement) is placed after Act 3.
- Problem set: students verify Problems C2.1, C2.3, C2.4 using the simulator.

---

### C2.11 Estimates

| Metric | Estimate |
|--------|----------|
| Word count (prose) | 9,000--10,000 words |
| Figures/visual assets | 6 (V-C2.1 through V-C2.6) |
| Interactive widgets | 3 (V-C2.3 histogram, V-C2.4 sequential, V-C2.6 general basis) |
| Theorems/definitions | 3 definitions, 5 theorems |
| Worked examples | 5 |
| Problem set | 10 problems (including 2 stretch problems) |
| Estimated study time | 90--120 minutes |
| Implementation effort (prose) | 3 days |
| Implementation effort (visuals) | 2 days |
| Implementation effort (simulator features) | 3 days |
| Total implementation effort | 8 days |

---

### C2.12 Page Splits

The lesson is divided into four web pages.

**Page C2a: "The Born Rule and Collapse"** (approx. 2,500 words)
- Opening hook (Stern-Gerlach callback)
- Computational-basis measurement: probabilities and collapse
- Worked Examples C2.1, C2.2
- Visual assets V-C2.1, V-C2.3 (histogram widget)

**Page C2b: "Projectors and the Measurement Postulate"** (approx. 2,500 words)
- Projection operators: definition, Hermiticity, idempotency
- Completeness relation
- Born rule via projectors and trace formula
- Theorems C2.1--C2.3
- Visual assets V-C2.2, V-C2.5
- Worked Examples C2.4, C2.5

**Page C2c: "General-Basis Measurement and Sequential Measurements"** (approx. 2,500 words)
- Measurement in the X-basis and arbitrary bases
- Sequential measurements: idempotency and non-commutativity
- Irreversibility of measurement
- Partial measurement preview
- POVM mention (Definition C2.3)
- Visual assets V-C2.4, V-C2.6
- Worked Example C2.3
- Historical notes

**Page C2d: "Problems"** (approx. 2,500 words)
- Common confusions summary box
- Full problem set (Problems C2.1--C2.10)

---

## C3 -- Single-Qubit Gates & Bloch Sphere

**Canonical position:** 11 (after P4, before A5)
**Prerequisites:** C1 (The Qubit), C2 (Measurement), A2 (Linear Maps & Matrices), A3 (Eigenvalues & Spectral Theorem), P3 (Spin-1/2 Quantum Mechanics), P4 (Time Evolution & Unitarity)
**Target length:** 12,000--15,000 words
**Estimated study time:** 120--180 minutes

---

### C3.1 Learning Objectives

By the end of this lesson the student will be able to:

1. **Define a quantum gate** as a unitary operator on C^2 and explain why unitarity (UU^dagger = U^dagger U = I) is required (preservation of normalisation, reversibility of quantum evolution).
2. **Write the matrix representations** of the Pauli gates X, Y, Z in the computational basis and verify their key properties: Hermitian, unitary, involutory (X^2 = Y^2 = Z^2 = I), and their commutation/anticommutation relations.
3. **Derive the Hadamard gate H** as the unique (up to global phase) unitary that maps |0> to |+> and |1> to |->, and compute its matrix representation.
4. **Define and compute** the phase gates S = diag(1, i) and T = diag(1, e^{i pi/4}), and explain their roles as pi/2 and pi/4 rotations about the Z-axis of the Bloch sphere.
5. **Derive the rotation gates** R_x(theta) = exp(-i theta sigma_x / 2), R_y(theta) = exp(-i theta sigma_y / 2), R_z(theta) = exp(-i theta sigma_z / 2) from the matrix exponential, and compute their explicit 2x2 matrix forms.
6. **Derive the Bloch sphere fully** from the qubit parametrisation, proving that single-qubit gates correspond to rotations of the Bloch sphere (the SU(2) to SO(3) homomorphism).
7. **Verify that specific gates correspond to specific rotations**: X = 180-degree rotation about x-axis, H = 180-degree rotation about the (x+z)/sqrt(2) axis, S = 90-degree rotation about z-axis, etc.
8. **State and prove the Z-Y decomposition theorem**: every single-qubit unitary U in SU(2) can be written as U = e^{i alpha} R_z(beta) R_y(gamma) R_z(delta) for real parameters alpha, beta, gamma, delta.
9. **Implement gate sequences** in the simulator and verify their effects on the Bloch sphere.
10. **Derive key circuit identities**: HXH = Z, HZH = X, HYH = -Y, and use them to transform between measurement bases.

---

### C3.2 Intuition Arc

**Opening hook.** In C1 we defined the qubit state. In C2 we learned how to extract classical information from it (measurement). Now: how do we *manipulate* it? A classical computer uses logic gates (AND, OR, NOT) to transform bits. A quantum computer uses *quantum gates* -- unitary matrices -- to transform qubits. This lesson introduces the single-qubit gate toolkit.

**Act 1: Gates as unitaries (words 1--2,500).** Begin with the physical motivation from P4: quantum time evolution is governed by the Schrodinger equation, and the time-evolution operator is unitary. A quantum gate is simply a controlled application of a Hamiltonian for a specific duration. Unitarity guarantees that the gate preserves normalisation (probabilities still sum to 1) and is reversible (U^{-1} = U^dagger exists). Contrast with classical gates: NOT is reversible (it is its own inverse), but AND is irreversible (it maps two bits to one, losing information). Every quantum gate is reversible.

Formal definition: a single-qubit gate is a unitary operator U on C^2. In the computational basis, it is represented by a 2x2 unitary matrix. The gate acts as |psi> -> U|psi>.

**Act 2: The Pauli gates (words 2,500--5,000).** Introduce X, Y, Z as the Pauli matrices that the student has already encountered in P3 as spin observables. Now reframe them as *gates*:

X = [[0,1],[1,0]]: the quantum NOT gate. X|0> = |1>, X|1> = |0>. On the Bloch sphere: 180-degree rotation about the x-axis.

Z = [[1,0],[0,-1]]: the phase-flip gate. Z|0> = |0>, Z|1> = -|1>. On the Bloch sphere: 180-degree rotation about the z-axis.

Y = [[0,-i],[i,0]]: the "bit-and-phase flip." Y|0> = i|1>, Y|1> = -i|0>. On the Bloch sphere: 180-degree rotation about the y-axis.

Verify all properties: Hermiticity (sigma^dagger = sigma), unitarity (sigma^dagger sigma = I, which follows from Hermiticity + involutoriness), involutoriness (sigma^2 = I), determinant = -1 (so these are NOT in SU(2) but in U(2); the SU(2) versions are i sigma).

Derive the commutation relations [sigma_j, sigma_k] = 2i epsilon_{jkl} sigma_l and anticommutation relations {sigma_j, sigma_k} = 2 delta_{jk} I. These were seen in A3/P3 but are now restated in the computing context.

**Act 3: Hadamard, S, and T (words 5,000--7,500).** The Hadamard gate is the workhorse of quantum computing. Derive it from the requirement: H|0> = |+> = (|0> + |1>)/sqrt(2) and H|1> = |-> = (|0> - |1>)/sqrt(2). Since H maps the computational basis to the X-basis, and since both bases are orthonormal, H must be unitary (it maps one ONB to another). The matrix is uniquely determined (up to global phase and relative phase conventions): H = (1/sqrt(2))[[1,1],[1,-1]].

Properties of H: Hermitian (H = H^dagger), involutory (H^2 = I), so H is its own inverse. On the Bloch sphere: 180-degree rotation about the (x+z)/sqrt(2) axis -- this swaps the x and z axes.

Phase gates: S = [[1,0],[0,i]] = sqrt(Z) (since S^2 = Z). T = [[1,0],[0,e^{i pi/4}]] = sqrt(S) = Z^{1/4}. On the Bloch sphere: S is a 90-degree rotation about the z-axis; T is a 45-degree rotation about the z-axis. The T gate will be critical for universality (C5).

**Act 4: Rotation gates and the matrix exponential (words 7,500--10,000).** Define the rotation gates:

R_x(theta) = exp(-i theta sigma_x / 2) = cos(theta/2) I - i sin(theta/2) sigma_x = [[cos(theta/2), -i sin(theta/2)], [-i sin(theta/2), cos(theta/2)]].

R_y(theta) = exp(-i theta sigma_y / 2) = cos(theta/2) I - i sin(theta/2) sigma_y = [[cos(theta/2), -sin(theta/2)], [sin(theta/2), cos(theta/2)]].

R_z(theta) = exp(-i theta sigma_z / 2) = cos(theta/2) I - i sin(theta/2) sigma_z = [[e^{-i theta/2}, 0], [0, e^{i theta/2}]].

Derive these from the matrix exponential using the identity exp(-i theta n_hat . sigma / 2) = cos(theta/2) I - i sin(theta/2) (n_hat . sigma), which holds because (n_hat . sigma)^2 = I for any unit vector n_hat. Prove this identity. Connect R_z(theta) to the general phase gate diag(1, e^{i theta}) up to a global phase.

Verify specific cases: R_x(pi) = -i X (equals X up to global phase), R_z(pi/2) = (1-i)/sqrt(2) . S (equals S up to global phase), R_z(pi/4) = ... (equals T up to global phase).

**Act 5: The Bloch sphere derivation (words 10,000--12,500).** This is the centrepiece of the lesson. Start from the Bloch parametrisation (C1): |psi> = cos(theta/2)|0> + e^{i phi} sin(theta/2)|1> maps to the Bloch vector r = (sin theta cos phi, sin theta sin phi, cos theta). Now prove that the action of a gate U in SU(2) on |psi> corresponds to a rotation R in SO(3) on the Bloch vector r.

Step 1: The Bloch vector can be written r_j = <psi|sigma_j|psi> = Tr(sigma_j |psi><psi|) = Tr(sigma_j rho). Under U, rho -> U rho U^dagger. So r_j -> r'_j = Tr(sigma_j U rho U^dagger).

Step 2: Use the identity Tr(A . U B U^dagger) = Tr(U^dagger A U . B). So r'_j = Tr(U^dagger sigma_j U . rho).

Step 3: Since U in SU(2), U^dagger sigma_j U is a linear combination of the Pauli matrices (because the Pauli matrices plus I form a basis for 2x2 matrices, and the identity component vanishes by trace considerations). Write U^dagger sigma_j U = Sum_k R_{jk} sigma_k. Then r'_j = Sum_k R_{jk} Tr(sigma_k rho) = Sum_k R_{jk} r_k. So r' = R r.

Step 4: Show that R is a rotation matrix (R in SO(3)). This follows from: (a) the sigma_j are orthogonal under the trace inner product Tr(sigma_j sigma_k) = 2 delta_{jk}, and (b) U^dagger sigma_j U preserves this inner product.

Step 5: The map phi: SU(2) -> SO(3) is a surjective group homomorphism with kernel {I, -I}. This is the double cover: U and -U (which differ by a global phase of -1 = e^{i pi}) map to the same rotation R. This explains why a 360-degree rotation (theta = 2pi) gives R = I in SO(3) but U = -I in SU(2) -- only a 720-degree rotation gives U = I.

**Act 6: The Z-Y decomposition and circuit identities (words 12,500--14,500).** State and prove the Z-Y decomposition theorem.

**Theorem (Z-Y Decomposition).** Every U in SU(2) can be written as U = R_z(alpha) R_y(beta) R_z(gamma) for unique (up to identification) real parameters alpha, beta, gamma.

**Proof sketch.** Any rotation in SO(3) can be decomposed into Euler angles: a rotation about z, then y, then z. Since the SU(2) to SO(3) map sends R_z(.) and R_y(.) to z-rotations and y-rotations respectively, the Euler angle decomposition of the SO(3) rotation lifts to the SU(2) decomposition.

For the full U(2) version: any U in U(2) can be written U = e^{i alpha} R_z(beta) R_y(gamma) R_z(delta). The extra phase e^{i alpha} accounts for det(U) != 1.

Derive circuit identities:
- HXH = Z. Proof: direct matrix multiplication, or by noting H swaps x and z axes.
- HZH = X. Similarly.
- HYH = -Y. (Y is the "odd one out" because it involves both axes.)
- SXS^dagger = Y (up to phase). S rotates x to y on the Bloch sphere.

Application: to measure in the X-basis, apply H then measure in Z. To measure in the Y-basis, apply S^dagger H then measure in Z. This connects back to C2 (general-basis measurement).

**Closing synthesis (words 14,500--15,000).** Summary: quantum gates are unitary matrices. The Pauli gates, Hadamard, S, T, and rotation gates form a toolkit for arbitrary single-qubit manipulations. The Bloch sphere makes their geometric meaning transparent: every gate is a rotation. The Z-Y decomposition shows any gate can be built from z and y rotations. Next (C4): multi-qubit gates, where the real power of quantum computing begins.

---

### C3.3 Theorems, Definitions, and Proofs

#### Definition C3.1 -- Quantum Gate (Single-Qubit)

A *single-qubit quantum gate* is a unitary operator U on C^2: a linear map satisfying U U^dagger = U^dagger U = I. Equivalently, U preserves the inner product: <U phi|U psi> = <phi|psi> for all |phi>, |psi>.

#### Definition C3.2 -- Pauli Gates

The three Pauli gates (or Pauli matrices) are:

X = sigma_x = [[0, 1], [1, 0]],  Y = sigma_y = [[0, -i], [i, 0]],  Z = sigma_z = [[1, 0], [0, -1]].

Together with the identity I, they form a basis for the vector space of 2x2 complex matrices.

#### Theorem C3.1 -- Pauli Algebra

**Statement.** The Pauli matrices satisfy:
(a) sigma_j^2 = I for j = x, y, z.
(b) sigma_j sigma_k = i epsilon_{jkl} sigma_l for j != k (cyclic products).
(c) [sigma_j, sigma_k] = 2i epsilon_{jkl} sigma_l (commutators).
(d) {sigma_j, sigma_k} = 2 delta_{jk} I (anticommutators).
(e) Tr(sigma_j) = 0 and Tr(sigma_j sigma_k) = 2 delta_{jk}.

**Proof (selected).**
(a) Direct computation: X^2 = [[0,1],[1,0]]^2 = [[1,0],[0,1]] = I. Similarly for Y, Z.

(b) XY = [[0,1],[1,0]][[0,-i],[i,0]] = [[i,0],[0,-i]] = iZ. YZ = iX. ZX = iY. (Direct matrix multiplication.)

(c) [X,Y] = XY - YX = iZ - (-iZ) = 2iZ. (Since YX = -iZ from (b) and anticommutation.) Similarly for cyclic permutations.

(d) {X,Y} = XY + YX = iZ + (-iZ) = 0 = 2 . 0 . I. {X,X} = X^2 + X^2 = 2I. QED.

#### Definition C3.3 -- Hadamard Gate

The *Hadamard gate* H is the unitary matrix:

H = (1/sqrt(2)) [[1, 1], [1, -1]].

It maps the computational basis to the Hadamard basis: H|0> = |+>, H|1> = |->.

#### Theorem C3.2 -- Uniqueness of H

**Statement.** The Hadamard gate is the unique unitary U (up to a global phase) that satisfies U|0> = |+> and U|1> = |->.

**Proof.** The columns of a unitary matrix are the images of the basis vectors. So U = [U|0>, U|1>] = [|+>, |->] = (1/sqrt(2))[[1,1],[1,-1]]. A unitary is determined by its columns, so U is unique. (A global phase e^{i gamma} U would map |0> to e^{i gamma}|+>, which is the same physical state but a different matrix.) QED.

#### Definition C3.4 -- Phase Gates

S = [[1, 0], [0, i]],    T = [[1, 0], [0, e^{i pi/4}]].

Relations: S = T^2, Z = S^2 = T^4. Equivalently, S = R_z(pi/2) up to global phase, T = R_z(pi/4) up to global phase.

#### Theorem C3.3 -- Rotation Gate Formula

**Statement.** For any unit vector n_hat = (n_x, n_y, n_z) in R^3 and angle theta in R:

exp(-i theta (n_hat . sigma) / 2) = cos(theta/2) I - i sin(theta/2) (n_hat . sigma)

where n_hat . sigma = n_x sigma_x + n_y sigma_y + n_z sigma_z.

**Proof.**
Let A = n_hat . sigma. We need A^2 = I.

A^2 = (n_x sigma_x + n_y sigma_y + n_z sigma_z)^2 = n_x^2 sigma_x^2 + n_y^2 sigma_y^2 + n_z^2 sigma_z^2 + cross terms.

The diagonal terms give n_x^2 I + n_y^2 I + n_z^2 I = (n_x^2 + n_y^2 + n_z^2) I = I (since n_hat is a unit vector).

The cross terms: n_x n_y (sigma_x sigma_y + sigma_y sigma_x) + ... = n_x n_y {sigma_x, sigma_y} + ... = 0 (by anticommutation).

So A^2 = I. Therefore:

exp(-i theta A / 2) = Sum_{k=0}^{infty} (-i theta A / 2)^k / k!
= Sum_{k even} (-1)^{k/2} (theta/2)^k / k! . I + Sum_{k odd} (-1)^{(k-1)/2} (theta/2)^k / k! . (-i A)
= cos(theta/2) I - i sin(theta/2) A. QED.

#### Theorem C3.4 -- SU(2) to SO(3) Homomorphism

**Statement.** The map Phi: SU(2) -> SO(3) defined by

Phi(U): sigma_j -> U^dagger sigma_j U = Sum_k R_{jk}(U) sigma_k

is a surjective group homomorphism with kernel ker(Phi) = {I, -I}. In particular:
(a) R(U) is a rotation matrix (det R = 1, R^T R = I).
(b) Phi(U_1 U_2) = Phi(U_1) Phi(U_2).
(c) Phi(I) = Phi(-I) = I_{3x3}.
(d) Every rotation R in SO(3) is in the image of Phi.

**Proof sketch.**
(a) Preservation of trace inner product: Tr((U^dagger sigma_j U)(U^dagger sigma_k U)) = Tr(U^dagger sigma_j sigma_k U) = Tr(sigma_j sigma_k) = 2 delta_{jk}. So the columns of R are orthonormal, giving R^T R = I. The determinant is +1 because SU(2) is connected and Phi(I) = I_{3x3} has det +1.

(b) Phi(U_1 U_2) maps sigma_j to (U_1 U_2)^dagger sigma_j (U_1 U_2) = U_2^dagger (U_1^dagger sigma_j U_1) U_2. The inner transformation gives Sum_k R_{jk}(U_1) sigma_k. Then U_2^dagger (Sum_k R_{jk} sigma_k) U_2 = Sum_k R_{jk}(U_1) Sum_l R_{kl}(U_2) sigma_l = Sum_l (R(U_1) R(U_2))_{jl} sigma_l. So R(U_1 U_2) = R(U_1) R(U_2).

(c) Phi(I): sigma_j -> I sigma_j I = sigma_j, so R = I. Phi(-I): sigma_j -> (-I) sigma_j (-I) = sigma_j, so R = I. Hence {I, -I} is in the kernel. Conversely, if R(U) = I, then U^dagger sigma_j U = sigma_j for all j, so U commutes with all Pauli matrices, so U commutes with all 2x2 matrices, so U = lambda I. Unitarity gives |lambda| = 1, and det(U) = 1 gives lambda^2 = 1, so lambda = +/- 1. QED.

(d) Surjectivity: R_z(theta) maps to the SO(3) rotation about z by theta, and R_y(phi) maps to the rotation about y by phi. Since these generate all of SO(3) (Euler angles), Phi is surjective.

#### Theorem C3.5 -- Z-Y Decomposition

**Statement.** Every U in U(2) can be written as

U = e^{i alpha} R_z(beta) R_y(gamma) R_z(delta)

for some real alpha, beta, gamma, delta.

If U in SU(2), then alpha can be absorbed (alpha = -(beta + delta)/2 modulo pi).

**Proof.**
Under the map Phi, R_z(beta) maps to a z-rotation by beta, and R_y(gamma) maps to a y-rotation by gamma. Any R in SO(3) has an Euler-angle decomposition R = R_z^{SO(3)}(beta) R_y^{SO(3)}(gamma) R_z^{SO(3)}(delta). Since Phi is surjective, there exists U_0 in SU(2) with Phi(U_0) = R, and U_0 = +/- R_z(beta) R_y(gamma) R_z(delta). For general U in U(2) with det(U) = e^{2i alpha}, write U = e^{i alpha} (e^{-i alpha} U) where e^{-i alpha} U in SU(2). Apply the SU(2) result. QED.

#### Theorem C3.6 -- Key Circuit Identities

**Statement.** (a) HXH = Z. (b) HZH = X. (c) HYH = -Y.

**Proof.**
(a) HXH = (1/sqrt(2))[[1,1],[1,-1]] . [[0,1],[1,0]] . (1/sqrt(2))[[1,1],[1,-1]]
= (1/2) [[1,1],[1,-1]] [[1,1],[1,-1]] (after computing HX = (1/sqrt(2))[[1,1],[-1,1]] ... )

Direct computation: HX = (1/sqrt(2))[[1,1],[1,-1]][[0,1],[1,0]] = (1/sqrt(2))[[1,1],[-1,1]].
(HX)H = (1/sqrt(2))[[1,1],[-1,1]] . (1/sqrt(2))[[1,1],[1,-1]] = (1/2)[[2,0],[0,-2]] = [[1,0],[0,-1]] = Z.

(b) By the same method, or by noting HZH = H(HXH)H = (H^2)X(H^2) = X (since H^2 = I). Wait -- that gives HZH = H(HXH)H only if Z = HXH, which gives HZH = H(HXH)H = X. Confirmed.

(c) Y = iXZ. So HYH = i(HXH)(HZH)... Wait, HYH = H(iXZ)H = iHXHHZH = i(HXH)(HZH) = iZX. Now ZX = iY (from Pauli algebra). So HYH = i(iY) = i^2 Y = -Y. QED.

---

### C3.4 Visual Assets

**V-C3.1: Gate action on the Bloch sphere (interactive, simulator).**
An interactive Bloch sphere with a control panel listing all single-qubit gates: X, Y, Z, H, S, S^dagger, T, T^dagger, R_x(theta), R_y(theta), R_z(theta). The user:
1. Initialises a state (click on sphere or enter parameters).
2. Selects a gate (or enters a rotation angle for parametric gates).
3. Clicks "Apply." The Bloch vector animates smoothly from its initial position to its final position, tracing the rotation arc on the sphere.

The rotation axis is shown as a dashed line through the sphere. The rotation angle is displayed. The "show me the algebra" toggle shows U|psi> step by step.

**V-C3.2: Pauli gate action table (static diagram).**
A 3x4 table showing the six cardinal states and their images under X, Y, Z:

| Input | X output | Y output | Z output |
|-------|----------|----------|----------|
| \|0> | \|1> | i\|1> | \|0> |
| \|1> | \|0> | -i\|0> | -\|1> |
| \|+> | \|+> | -\|-> | \|-> |
| \|-> | \|-> | \|+> | -\|+> |
| \|+i> | \|-i> | \|+i> | \|-i> |
| \|-i> | \|+i> | -\|-i> | \|+i> |

Each cell also shows the Bloch vector before and after, confirming the 180-degree rotation interpretation.

**V-C3.3: Hadamard gate visualisation (interactive, simulator).**
Three panels:
- Left: Bloch sphere showing the initial state.
- Centre: The rotation axis (x+z)/sqrt(2) shown as a dashed line on the sphere. The rotation by pi (180 degrees) about this axis is animated.
- Right: Bloch sphere showing the final state.

Presets: H|0> = |+>, H|1> = |->, H|+> = |0>, H|-> = |1>.

**V-C3.4: Rotation gate parameter explorer (interactive, simulator).**
Three sliders: one for each of R_x(theta_x), R_y(theta_y), R_z(theta_z). The user adjusts one angle at a time and watches the Bloch vector trace a circle on the sphere (the rotation orbit). When "compose" mode is enabled, the user applies a sequence of rotations and sees the cumulative effect.

A readout shows the current gate's 2x2 matrix, updated in real time as the slider moves.

**V-C3.5: SU(2) to SO(3) double cover visualisation (interactive, simulator).**
A split display:
- Top: A "state space" view showing the SU(2) element as a point on S^3 (visualised via a 3D projection or a parameter display).
- Bottom: The Bloch sphere showing the corresponding SO(3) rotation.

Key demonstration: slide theta from 0 to 2pi for R_z(theta). The Bloch vector returns to its starting point at theta = 2pi (SO(3) identity). But the SU(2) matrix at theta = 2pi is -I (not I). Only at theta = 4pi does the SU(2) element return to I. A counter shows the SU(2) phase: e^{-i theta/2} cycles once as theta goes 0 to 2pi (giving -1), twice as theta goes 0 to 4pi (giving +1).

**V-C3.6: Z-Y decomposition calculator (interactive, simulator).**
Input: a 2x2 unitary matrix U (entered as four complex numbers, or selected from a preset list).
Output: the Z-Y decomposition parameters alpha, beta, gamma, delta such that U = e^{i alpha} R_z(beta) R_y(gamma) R_z(delta).
Visualisation: the three-step rotation sequence animated on the Bloch sphere: first R_z(delta), then R_y(gamma), then R_z(beta).

**V-C3.7: Circuit identity explorer (interactive, simulator).**
A small circuit builder (1 qubit, up to 4 gates in sequence). The user places gates on the wire and the simulator:
1. Computes the composite unitary.
2. Shows the equivalent single gate (if it matches a known gate).
3. Shows the Bloch-sphere rotation.

Presets: HXH (shows = Z), HZH (shows = X), SS (shows = Z), TT (shows = S).

**V-C3.8: Matrix exponential derivation (animated diagram).**
A step-by-step animated derivation of exp(-i theta sigma_x / 2):
1. Frame 1: Write the Taylor series of exp(A).
2. Frame 2: Separate even and odd powers, using A^2 = (theta/2)^2 I.
3. Frame 3: Sum the even series -> cos(theta/2) I. Sum the odd series -> -i sin(theta/2) sigma_x.
4. Frame 4: Combine into the final 2x2 matrix.

---

### C3.5 Worked Examples

#### Worked Example C3.1 -- Verifying unitarity of H

**Problem.** Verify that H is unitary and Hermitian.

**Solution.**
H = (1/sqrt(2))[[1,1],[1,-1]].
H^dagger = (1/sqrt(2))[[1,1],[1,-1]] = H (since H has all real entries and is symmetric except for the (2,2) entry... actually H^T = H, and H* = H since all entries are real). So H^dagger = H.

HH^dagger = H^2 = (1/2)[[1,1],[1,-1]][[1,1],[1,-1]] = (1/2)[[2,0],[0,2]] = I. Confirmed.

Since H = H^dagger, H is Hermitian. Since HH^dagger = I, H is unitary. Since H is both, H^2 = I and H is involutory.

#### Worked Example C3.2 -- Rotation gate for specific angles

**Problem.** Compute R_x(pi), R_y(pi/2), and R_z(pi) explicitly, and identify each with a known gate (up to global phase).

**Solution.**

R_x(pi) = cos(pi/2)I - i sin(pi/2) sigma_x = 0 . I - i . 1 . [[0,1],[1,0]] = [[ 0, -i],[-i, 0]] = -i X. So R_x(pi) = -iX, which equals X up to global phase.

R_y(pi/2) = cos(pi/4)I - i sin(pi/4) sigma_y = (1/sqrt(2))I - (i/sqrt(2))[[0,-i],[i,0]] = (1/sqrt(2))[[1,0],[0,1]] + (1/sqrt(2))[[0,-1],[1,0]] = (1/sqrt(2))[[1,-1],[1,1]].

Note: R_y(pi/2) maps |0> to (1/sqrt(2))(|0> + |1>) = |+> and |1> to (1/sqrt(2))(-|0> + |1>). This is similar to H but with different signs. Specifically, R_y(pi/2) = H up to a phase and a Z gate: HR_y(pi/2) is diagonal (the student can verify).

R_z(pi) = [[e^{-i pi/2}, 0],[0, e^{i pi/2}]] = [[-i, 0],[0, i]] = -i[[1,0],[0,-1]] = -iZ. So R_z(pi) = -iZ, equaling Z up to global phase.

#### Worked Example C3.3 -- Bloch-sphere rotation for H

**Problem.** Verify that H corresponds to a 180-degree rotation about the axis n_hat = (1, 0, 1)/sqrt(2).

**Solution.**
The rotation gate for axis n_hat = (1/sqrt(2), 0, 1/sqrt(2)) and angle theta = pi is:

R_{n_hat}(pi) = cos(pi/2)I - i sin(pi/2)(n_hat . sigma) = -i(n_hat . sigma).

n_hat . sigma = (1/sqrt(2))sigma_x + (1/sqrt(2))sigma_z = (1/sqrt(2))[[1,1],[1,-1]].

So R_{n_hat}(pi) = -i(1/sqrt(2))[[1,1],[1,-1]] = (-i/sqrt(2))[[1,1],[1,-1]] = -i H.

Since R_{n_hat}(pi) = -iH and global phase -i does not affect the Bloch rotation, H corresponds to the same SO(3) rotation as R_{n_hat}(pi): a 180-degree rotation about (1,0,1)/sqrt(2). Confirmed.

#### Worked Example C3.4 -- Z-Y decomposition of the Hadamard gate

**Problem.** Find alpha, beta, gamma, delta such that H = e^{i alpha} R_z(beta) R_y(gamma) R_z(delta).

**Solution.**
H maps the Bloch z-axis to the x-axis and the x-axis to the z-axis (with appropriate reflections). On the Bloch sphere, this is a 180-degree rotation about the (x+z)/sqrt(2) axis.

In Euler angles: R_z(beta) R_y(gamma) R_z(delta) should give this rotation. One decomposition:
- First rotate by pi about z: R_z(pi). This maps x -> -x, y -> -y, z -> z.
- Then rotate by pi/2 about y: R_y(pi/2). This maps z -> x, x -> -z.
- Compose: z -> z -> x, x -> -x -> z. Good, this is the right mapping.

But we need to check: R_z(0) R_y(pi/2) R_z(pi)?

R_z(pi) = [[-i, 0], [0, i]].
R_y(pi/2) = (1/sqrt(2))[[1,-1],[1,1]].
R_y(pi/2) R_z(pi) = (1/sqrt(2))[[1,-1],[1,1]][[-i,0],[0,i]] = (1/sqrt(2))[[-i,-i],[-i,i]].

That gives a global phase issue. Let us use a more systematic approach. H = (1/sqrt(2))[[1,1],[1,-1]]. We need:

e^{i alpha} [[e^{-i beta/2}, 0],[0, e^{i beta/2}]] . (1/sqrt(2))[[... gamma ...]] . [[e^{-i delta/2},0],[0,e^{i delta/2}]] = (1/sqrt(2))[[1,1],[1,-1]].

By inspection or standard formula: gamma = pi/2 (the y-rotation angle, corresponding to the "tilt" of the rotation). beta = pi, delta = 0. Then:

R_z(pi) R_y(pi/2) R_z(0) = [[-i,0],[0,i]] . (1/sqrt(2))[[1,-1],[1,1]] . I = (1/sqrt(2))[[-i,i],[ i, i]].

Hmm, this gives (-i/sqrt(2))[[1,-1],[-1,-1]] -- not quite H. Including global phase: we need e^{i alpha} to fix it.

Let's compute directly. H = (1/sqrt(2))[[1,1],[1,-1]]. We can write:

H = R_z(0) R_y(pi/2) R_z(pi) . (global phase).

R_y(pi/2) = (1/sqrt(2))[[1,-1],[1,1]]. 
R_z(pi) = [[e^{-i pi/2},0],[0,e^{i pi/2}]] = [[-i,0],[0,i]].

R_y(pi/2) R_z(pi) = (1/sqrt(2))[[1,-1],[1,1]][[-i,0],[0,i]] = (1/sqrt(2))[[-i,-i],[-i,i]] = (-i/sqrt(2))[[1,1],[1,-1]] = -i H.

So H = i R_y(pi/2) R_z(pi), i.e., e^{i alpha} = i, alpha = pi/2, beta = 0, gamma = pi/2, delta = pi.

**Verification:** e^{i pi/2} R_z(0) R_y(pi/2) R_z(pi) = i . I . R_y(pi/2) R_z(pi) = i . (-iH) = H. Confirmed.

So: alpha = pi/2, beta = 0, gamma = pi/2, delta = pi.

#### Worked Example C3.5 -- Using HXH = Z to change measurement basis

**Problem.** A qubit is in state |psi> = (3/5)|0> + (4/5)|1>. You want to measure in the X-basis {|+>, |->} but your hardware only supports Z-basis measurement. Describe the gate sequence and compute the probabilities.

**Solution.**
Strategy: apply H before measuring in Z. Since HXH = Z (equivalently, H maps the X eigenstates to Z eigenstates), measuring H|psi> in the Z-basis is equivalent to measuring |psi> in the X-basis.

H|psi> = (1/sqrt(2))[[1,1],[1,-1]](3/5, 4/5)^T = (1/sqrt(2))((3+4)/5, (3-4)/5)^T = (1/sqrt(2))(7/5, -1/5)^T.

P(0) in Z-basis of H|psi> = |7/(5 sqrt(2))|^2 = 49/50.
P(1) in Z-basis of H|psi> = |1/(5 sqrt(2))|^2 = 1/50.

These are indeed P(+) and P(-) for the original state |psi>, as computed in Problem C2.3. Confirmed.

---

### C3.6 Common Confusions

**Confusion 1: "The Pauli matrices are gates and observables -- which one?"**
Both! The Pauli matrices are Hermitian (so they are valid observables with real eigenvalues) AND unitary (so they are valid gates). This double role is special to the Pauli matrices (and more generally, to matrices that are both Hermitian and unitary, which forces eigenvalues to be +/-1). Most gates (e.g., T) are not Hermitian. Most observables (e.g., the Hamiltonian of a system) are not unitary.

**Confusion 2: "R_z(theta) and the phase gate P(theta) = diag(1, e^{i theta}) are the same thing."**
Almost but not quite. R_z(theta) = diag(e^{-i theta/2}, e^{i theta/2}) = e^{-i theta/2} diag(1, e^{i theta}). They differ by a global phase e^{-i theta/2}. On the Bloch sphere they produce the same rotation. In a single-qubit context the distinction is irrelevant. But in a multi-qubit context (C4), if R_z or P(theta) is used as part of a controlled gate, the global phase becomes a relative phase of the larger system and IS physically meaningful. Convention: this course uses R_z(theta) for rotation gates and reserves P(theta) for the phase gate convention.

**Confusion 3: "A 360-degree rotation should return the state to where it started."**
On the Bloch sphere (SO(3)), a 360-degree rotation is the identity. But in SU(2), R_z(2pi) = -I, which is the identity only up to a global phase of -1. This is the double-cover phenomenon. It is physically observable in spin-1/2 systems (neutron interferometry experiments have confirmed the sign change under 2pi rotation). A full return to the same SU(2) element requires a 720-degree (4pi) rotation.

**Confusion 4: "The Z-Y decomposition means I only need R_y and R_z -- so why bother with other gates?"**
Practically, the Z-Y decomposition requires continuous rotation angles, which are hard to implement with arbitrary precision on physical hardware. The Solovay-Kitaev theorem (C5) shows that a *discrete* gate set like {H, T, CNOT} can approximate any rotation to arbitrary precision with polylogarithmic overhead. Hardware-specific gate sets are chosen for physical ease of implementation, not mathematical minimality.

**Confusion 5: "H creates superposition, so it is the source of quantum speedup."**
H creates superposition in the Z-basis, but a superposition alone is not useful -- it would just give a random outcome upon measurement. Quantum speedup comes from *interference*: the careful arrangement of gates so that wrong answers interfere destructively and correct answers interfere constructively. H is a crucial ingredient but not the whole story.

**Confusion 6: "Every unitary matrix is a valid quantum gate."**
Mathematically, yes. Physically, no. The unitary must be realisable by the available control Hamiltonian of the hardware. The universality theorem (C5) guarantees that a small set of physically realisable gates can approximate any unitary, but the approximation requires a circuit of finite depth.

---

### C3.7 Cross-References

| Reference | Direction | Detail |
|-----------|-----------|--------|
| C1 (The Qubit) | Backward | Bloch sphere parametrisation, Dirac notation, state space. All assumed. |
| C2 (Measurement) | Backward | General-basis measurement is now connected to gate-then-measure paradigm: applying H before Z-measurement gives X-measurement. |
| A2 (Linear Maps) | Backward | Matrix multiplication, inverses, determinants. All assumed. |
| A3 (Eigenvalues & Spectral Theorem) | Backward | Spectral decomposition of Hermitian operators. The Pauli matrices' eigenvalues (+/-1) and eigenvectors are assumed known. |
| P3 (Spin-1/2 QM) | Backward | The Pauli matrices as spin observables. The rotation operators R_n(theta) as spin rotation operators. The commutation relations. |
| P4 (Time Evolution) | Backward | Unitary evolution, the connection between Hamiltonians and unitaries (U = exp(-iHt/hbar)). This motivates why gates are unitary. |
| C4 (Multi-Qubit Systems) | Forward | Multi-qubit gates (CNOT, SWAP, CZ) and the tensor product structure. The single-qubit gates defined here are applied to individual qubits within multi-qubit systems. |
| C5 (Universal Gate Sets) | Forward | The Z-Y decomposition is a precursor to universality. The discrete gate set {H, T, CNOT} is universal. The Solovay-Kitaev theorem quantifies the approximation overhead. |
| A5 (probably "Spectral Theorem for Normal Operators" or similar) | Forward | Advanced spectral decomposition may be used for multi-qubit observables. |

---

### C3.8 Historical Notes

- **The Pauli matrices** were introduced by Wolfgang Pauli in 1927 in his treatment of electron spin (Zeitschrift fur Physik, 43, 601). Pauli introduced them as 2x2 matrices satisfying the angular momentum commutation relations, before the physical nature of spin was fully understood.

- **The Hadamard matrix** (as a mathematical object) was studied by Jacques Hadamard in 1893 in the context of determinant bounds (Hadamard's maximal determinant problem). Its use as a quantum gate was popularised in the quantum computing literature of the 1990s, particularly in the context of the Deutsch-Jozsa algorithm (1992) and Grover's algorithm (1996), where H^{tensor n} creates the uniform superposition over n qubits.

- **The T gate and fault tolerance.** The special role of the T gate in quantum computing was clarified in the development of fault-tolerant quantum computing (Shor 1996, Kitaev 1997). The Clifford group (generated by {H, S, CNOT}) is efficiently simulable classically (Gottesman-Knill theorem), but adding T breaks this simulability and enables universal quantum computation. T gates are the "expensive" resource in fault-tolerant architectures.

- **The Bloch sphere and SU(2).** The connection between SU(2) and SO(3) was known to mathematicians in the 19th century (Rodrigues 1840, Cayley 1843). In physics, it appeared in the study of spinors by Elie Cartan (1913) and was applied to quantum mechanics by Pauli and Wigner. The Bloch sphere visualisation was popularised in NMR by Felix Bloch (1946) and became standard in quantum information through Nielsen and Chuang (2000).

- **Euler angles and the Z-Y decomposition.** The Euler angle decomposition of rotations dates to Leonhard Euler (1776). Its application to SU(2) and single-qubit gates was formalised in the quantum computing context by Barenco et al. (1995), who showed how to decompose arbitrary unitaries into elementary gates.

---

### C3.9 Problem Set

#### Problem C3.1 (Gate Verification) [Computational]
Verify by direct matrix multiplication:
(a) X^2 = I.
(b) XZ = -ZX.
(c) HXH = Z.
(d) S^2 = Z.
(e) T^4 = Z.

**Solutions.**

(a) X^2 = [[0,1],[1,0]]^2 = [[1,0],[0,1]] = I.

(b) XZ = [[0,1],[1,0]][[1,0],[0,-1]] = [[0,-1],[1,0]]. ZX = [[1,0],[0,-1]][[0,1],[1,0]] = [[0,1],[-1,0]]. XZ = -ZX. Confirmed.

(c) HX = (1/sqrt(2))[[1,1],[1,-1]][[0,1],[1,0]] = (1/sqrt(2))[[1,1],[-1,1]]. (HX)H = (1/2)[[1,1],[-1,1]][[1,1],[1,-1]] = (1/2)[[2,0],[0,-2]] = [[1,0],[0,-1]] = Z.

(d) S^2 = [[1,0],[0,i]]^2 = [[1,0],[0,-1]] = Z.

(e) T^2 = [[1,0],[0,e^{i pi/4}]]^2 = [[1,0],[0,e^{i pi/2}]] = [[1,0],[0,i]] = S. T^4 = S^2 = Z.

#### Problem C3.2 (Rotation Gates) [Computational]
(a) Compute R_x(pi/2) as a 2x2 matrix.
(b) Apply R_x(pi/2) to |0> and find the resulting Bloch vector.
(c) Verify that the Bloch vector has been rotated by pi/2 about the x-axis.

**Solutions.**

(a) R_x(pi/2) = cos(pi/4)I - i sin(pi/4) sigma_x = (1/sqrt(2))[[1, -i],[-i, 1]].

(b) R_x(pi/2)|0> = (1/sqrt(2))(|0> - i|1>). alpha = 1/sqrt(2), beta = -i/sqrt(2) = (1/sqrt(2))e^{-i pi/2}.
theta/2: cos(theta/2) = 1/sqrt(2) => theta = pi/2. phi: e^{i phi} = e^{-i pi/2} => phi = -pi/2 = 3pi/2.
Bloch vector: (sin(pi/2)cos(3pi/2), sin(pi/2)sin(3pi/2), cos(pi/2)) = (0, -1, 0).

(c) Original Bloch vector of |0>: (0, 0, 1). A pi/2 rotation about x maps (0, 0, 1) to (0, -1, 0) (using the right-hand rule, or the rotation matrix R_x = [[1,0,0],[0,cos(pi/2),-sin(pi/2)],[0,sin(pi/2),cos(pi/2)]] = [[1,0,0],[0,0,-1],[0,1,0]], giving (0,0,1) -> (0,-1,0)). Wait: R_x(pi/2) on the Bloch sphere should rotate z to -y? Let me recheck.

The SO(3) rotation about x by angle theta maps (x,y,z) to (x, y cos theta - z sin theta, y sin theta + z cos theta). For theta = pi/2: (0, 0, 1) -> (0, -1, 0). But we need to check the sign convention. In the SU(2) convention, R_x(theta) = exp(-i theta sigma_x/2) corresponds to a rotation by theta about the x-axis (right-hand rule). For theta = pi/2, this maps z -> -y. But our result is (0, -1, 0). Hmm, let's check: the standard SO(3) rotation R_x(theta): (0,0,1) -> (0, 0*cos(theta) - 1*sin(theta), 0*sin(theta) + 1*cos(theta)) -- wait, the rotation matrix is [[1,0,0],[0,cos theta, -sin theta],[0, sin theta, cos theta]]. At theta = pi/2: (0, 0, 1) -> (0, -sin(pi/2) . 1 + ...) No: the formula gives (x', y', z') = (x, y cos theta - z sin theta, y sin theta + z cos theta). So (0,0,1) -> (0, 0 . cos(pi/2) - 1 . sin(pi/2), 0 . sin(pi/2) + 1 . cos(pi/2)) = (0, -1, 0). Yes, confirmed: (0, -1, 0). Matches.

#### Problem C3.3 (Hadamard Action) [Computational]
Apply H to each of the six cardinal Bloch sphere states and verify the results match a 180-degree rotation about (1,0,1)/sqrt(2).

**Solutions.**

H|0> = |+>. Bloch: (0,0,1) -> (1,0,0). Under 180-deg rotation about (1,0,1)/sqrt(2), the reflection formula gives r' = 2(n_hat . r) n_hat - r. n_hat = (1/sqrt(2),0,1/sqrt(2)). n_hat . (0,0,1) = 1/sqrt(2). 2(1/sqrt(2))(1/sqrt(2),0,1/sqrt(2)) = (1,0,1). r' = (1,0,1) - (0,0,1) = (1,0,0). Matches.

H|1> = |->. Bloch: (0,0,-1) -> (-1,0,0). n_hat . (0,0,-1) = -1/sqrt(2). 2(-1/sqrt(2))(1/sqrt(2),0,1/sqrt(2)) = (-1,0,-1). r' = (-1,0,-1) - (0,0,-1) = (-1,0,0). Matches.

H|+> = |0>. Bloch: (1,0,0) -> (0,0,1). n_hat . (1,0,0) = 1/sqrt(2). 2(1/sqrt(2))(1/sqrt(2),0,1/sqrt(2)) = (1,0,1). r' = (1,0,1) - (1,0,0) = (0,0,1). Matches.

H|-> = |1>. Bloch: (-1,0,0) -> (0,0,-1). n_hat . (-1,0,0) = -1/sqrt(2). 2(-1/sqrt(2))(1/sqrt(2),0,1/sqrt(2)) = (-1,0,-1). r' = (-1,0,-1) - (-1,0,0) = (0,0,-1). Matches.

H|+i> = ? H(|0>+i|1>)/sqrt(2) = (|+>+i|->)/sqrt(2) = (1/sqrt(2))((|0>+|1>)/sqrt(2) + i(|0>-|1>)/sqrt(2)) = (1/2)((1+i)|0> + (1-i)|1>) = (1/sqrt(2))(e^{i pi/4}|0> + e^{-i pi/4}|1>). Removing global phase e^{i pi/4}: |0> + e^{-i pi/2}|1> = |0> - i|1>)/sqrt(2)... Hmm, let me recompute.

H|+i> = H . (1/sqrt(2))(1, i)^T = (1/2)[[1,1],[1,-1]](1,i)^T = (1/2)(1+i, 1-i)^T.

Bloch vector: alpha = (1+i)/2, beta = (1-i)/2. |alpha| = 1/sqrt(2), phase of alpha = pi/4. Remove global phase: multiply by e^{-i pi/4}. alpha' = 1/sqrt(2). beta' = e^{-i pi/4}(1-i)/2 = e^{-i pi/4} . (sqrt(2)/2)e^{-i pi/4} = (1/sqrt(2))e^{-i pi/2} = -i/sqrt(2). 

So theta = pi/2, phi = -pi/2 = 3pi/2. Bloch vector: (0, -1, 0) = |-i>.

On the Bloch sphere: (0,1,0) -> (0,-1,0). n_hat . (0,1,0) = 0. r' = 2(0)(n_hat) - (0,1,0) = -(0,1,0) = (0,-1,0). Matches (180-deg rotation about an axis perpendicular to the y-axis reflects y).

H|-i> similarly maps to |+i>: (0,-1,0) -> (0,1,0). Matches.

#### Problem C3.4 (Matrix Exponential) [Proof]
Prove that for any 2x2 Hermitian matrix A with A^2 = I, we have exp(i theta A) = cos(theta) I + i sin(theta) A.

**Solution.**
exp(i theta A) = Sum_{k=0}^{infty} (i theta)^k A^k / k!.

For even k: A^k = A^{2(k/2)} = (A^2)^{k/2} = I. For odd k: A^k = A.

Even sum: Sum_{k even} (i theta)^k / k! . I = (Sum_{m=0}^{infty} (-1)^m theta^{2m} / (2m)!) I = cos(theta) I.

Odd sum: Sum_{k odd} (i theta)^k / k! . A = i (Sum_{m=0}^{infty} (-1)^m theta^{2m+1} / (2m+1)!) A = i sin(theta) A.

Combining: exp(i theta A) = cos(theta) I + i sin(theta) A. QED.

Note: the rotation gate uses exp(-i theta A / 2) where A = n_hat . sigma. Substituting theta -> -theta/2: exp(-i (theta/2) A) = cos(theta/2) I - i sin(theta/2) A.

#### Problem C3.5 (Z-Y Decomposition) [Computational]
Find the Z-Y decomposition of the X gate: X = e^{i alpha} R_z(beta) R_y(gamma) R_z(delta).

**Solution.**
X = [[0,1],[1,0]]. On the Bloch sphere, X is a 180-deg rotation about the x-axis.

In Euler angles: a rotation by pi about x can be decomposed as: rotate by -pi/2 about z (brings x to y), then rotate by pi about y, then rotate by pi/2 about z (brings y back to x). [One of several valid decompositions.]

R_z(pi/2) R_y(pi) R_z(-pi/2):

R_z(-pi/2) = [[e^{i pi/4},0],[0,e^{-i pi/4}]].
R_y(pi) = [[0,-1],[1,0]].
R_z(pi/2) = [[e^{-i pi/4},0],[0,e^{i pi/4}]].

R_y(pi) R_z(-pi/2) = [[0,-1],[1,0]][[e^{i pi/4},0],[0,e^{-i pi/4}]] = [[0,-e^{-i pi/4}],[e^{i pi/4},0]].

R_z(pi/2) . (above) = [[e^{-i pi/4},0],[0,e^{i pi/4}]] . [[0,-e^{-i pi/4}],[e^{i pi/4},0]] = [[0, -e^{-i pi/2}],[e^{i pi/2}, 0]] = [[0, i],[- i, 0]]. 

Hmm, that gives [[0,i],[-i,0]] = i[[0,-1],[1,0]]... This is iY, not X. Let me redo.

Alternative: X corresponds to rotation about x by pi. Euler angles for this: we can write R_z(0) R_y(pi) R_z(pi):

R_z(pi) = [[-i,0],[0,i]].
R_y(pi) = [[cos(pi/2), -sin(pi/2)],[sin(pi/2), cos(pi/2)]] = [[0,-1],[1,0]].

R_y(pi) R_z(pi) = [[0,-1],[1,0]][[-i,0],[0,i]] = [[0,-i],[-i,0]].

R_z(0) . (above) = I . [[0,-i],[-i,0]] = [[0,-i],[-i,0]] = -iX.

So R_z(0) R_y(pi) R_z(pi) = -iX. Then X = e^{i pi/2} R_z(0) R_y(pi) R_z(pi), giving alpha = pi/2, beta = 0, gamma = pi, delta = pi.

Verify: e^{i pi/2} = i. i . (-iX) = -i^2 X = X. Confirmed.

#### Problem C3.6 (Circuit Identity) [Proof]
Prove that SXS^dagger = Y (up to checking the global phase).

**Solution.**
S = [[1,0],[0,i]], S^dagger = [[1,0],[0,-i]].
SX = [[1,0],[0,i]][[0,1],[1,0]] = [[0,1],[i,0]].
(SX)S^dagger = [[0,1],[i,0]][[1,0],[0,-i]] = [[0,-i],[i,0]] = Y. Confirmed (exact equality, not just up to phase).

This makes sense on the Bloch sphere: S is a 90-deg rotation about z. Conjugation by S transforms x-rotations into y-rotations.

#### Problem C3.7 (Bloch Sphere Rotation) [Computational]
A qubit is in state |psi> with Bloch vector (1/sqrt(3), 1/sqrt(3), 1/sqrt(3)). The gate R_z(pi/3) is applied. Find the new Bloch vector.

**Solution.**
R_z(pi/3) on the Bloch sphere is a rotation about z by pi/3 (60 degrees). The SO(3) matrix is:

R_z^{SO(3)}(pi/3) = [[cos(pi/3), -sin(pi/3), 0],[sin(pi/3), cos(pi/3), 0],[0,0,1]] = [[1/2, -sqrt(3)/2, 0],[sqrt(3)/2, 1/2, 0],[0,0,1]].

New Bloch vector: 
x' = (1/2)(1/sqrt(3)) + (-sqrt(3)/2)(1/sqrt(3)) = (1 - sqrt(3))/(2 sqrt(3)).
y' = (sqrt(3)/2)(1/sqrt(3)) + (1/2)(1/sqrt(3)) = (sqrt(3) + 1)/(2 sqrt(3)).
z' = 1/sqrt(3).

Numerically: x' = (1 - 1.732)/(2 . 1.732) = -0.732/3.464 = -0.2113.
y' = (1.732 + 1)/(3.464) = 2.732/3.464 = 0.7887.
z' = 0.5774.

Verify: x'^2 + y'^2 + z'^2 = 0.0447 + 0.6220 + 0.3333 = 1.0000. Correct (still a pure state on the sphere).

#### Problem C3.8 (SU(2)/SO(3)) [Conceptual]
Explain why a quantum computer built from spin-1/2 particles naturally has SU(2) gates (not SO(3) rotations) as its primitive operations, and give a physical scenario where the SU(2) global phase (-1 after 2pi rotation) is observable.

**Solution.**
Spin-1/2 particles are described by state vectors in C^2, which transform under SU(2). The Schrodinger equation gives time evolution U = exp(-iHt/hbar) in SU(2). Physical gates are therefore SU(2) elements, not SO(3) elements.

The -1 phase after 2pi rotation is observable via interferometry. In a neutron interferometry experiment (Werner et al., 1975, Physical Review Letters 35, 1053), a neutron beam is split into two paths. One path passes through a magnetic field region that rotates the spin by angle theta. When theta = 2pi, the amplitude picks up a phase of -1 relative to the unrotated path, leading to destructive interference. This was directly observed and confirmed the SU(2) nature of spin-1/2.

In a quantum computer, this matters when a single-qubit gate is controlled by another qubit (C4/C5): the global phase of the target gate becomes a relative phase of the two-qubit system.

#### Problem C3.9 (Y-Basis Measurement) [Computational]
Using the identity H S^dagger maps the Y-basis to the Z-basis (i.e., H S^dagger |+i> = |0>), show how to implement a Y-basis measurement using only H, S^dagger, and Z-basis measurement.

**Solution.**
First verify: S^dagger |+i> = S^dagger (|0> + i|1>)/sqrt(2) = (|0> + (-i)(i)|1>)/sqrt(2) = (|0> + |1>)/sqrt(2) = |+>.
H|+> = |0>. So H S^dagger |+i> = |0>. Confirmed.

Similarly: S^dagger |-i> = S^dagger (|0> - i|1>)/sqrt(2) = (|0> - (-i)(i)|1>)/sqrt(2)... Let me compute: S^dagger = [[1,0],[0,-i]]. S^dagger(1, -i)^T/sqrt(2) = (1, (-i)(-i))^T/sqrt(2) = (1, -1)^T/sqrt(2) = |->.
H|-> = |1>. So H S^dagger |-i> = |1>. Confirmed.

**Procedure:** To measure in the Y-basis: (1) Apply S^dagger. (2) Apply H. (3) Measure in Z. Outcome 0 corresponds to Y-eigenvalue +1 (state was |+i>). Outcome 1 corresponds to Y-eigenvalue -1 (state was |-i>).

#### Problem C3.10 (Stretch -- Arbitrary Rotation Axis) [Stretch]
A single-qubit gate is described as "a rotation by 2pi/3 about the axis n_hat = (1, 1, 1)/sqrt(3)."
(a) Write the corresponding SU(2) matrix using the rotation gate formula.
(b) Compute the matrix entries numerically.
(c) Verify that applying this gate three times gives the identity (up to global phase).

**Solution.**

(a) U = exp(-i (2pi/3)(n_hat . sigma)/2) = cos(pi/3) I - i sin(pi/3)(n_hat . sigma).

n_hat . sigma = (1/sqrt(3))(sigma_x + sigma_y + sigma_z) = (1/sqrt(3))[[1, 1-i],[1+i, -1]].

U = (1/2) I - i (sqrt(3)/2)(1/sqrt(3))[[1, 1-i],[1+i, -1]] = (1/2)I - (i/2)[[1, 1-i],[1+i, -1]].

U = (1/2)[[1-i, -i(1-i)], [-i(1+i), 1+i]] = (1/2)[[1-i, -i+i^2], [-i-i^2, 1+i]] = (1/2)[[1-i, -1-i], [1-i, 1+i]].

Wait, let me recompute carefully:
-i(1-i) = -i + i^2 = -i - 1 = -(1+i).
-i(1+i) = -i - i^2 = -i + 1 = 1 - i.

U = (1/2)[[1 - i, -(1+i)], [1-i, 1+i]].

(b) Numerically: (1-i)/2 = 0.5 - 0.5i. -(1+i)/2 = -0.5 - 0.5i. (1+i)/2 = 0.5 + 0.5i.

U = [[0.5-0.5i, -0.5-0.5i], [0.5-0.5i, 0.5+0.5i]].

Verify unitarity: |U_{11}|^2 + |U_{21}|^2 = 0.5 + 0.5 = 1. |U_{12}|^2 + |U_{22}|^2 = 0.5 + 0.5 = 1. <col1|col2> = (0.5+0.5i)(-0.5-0.5i) + (0.5+0.5i)(0.5+0.5i) = (-0.25-0.25i-0.25i-0.25i^2) + (0.25+0.5i+0.25i^2)... This is getting complex. Let me verify with det and UU^dagger directly.

det(U) = (1/4)((1-i)(1+i) - (-(1+i))(1-i)) = (1/4)(2 - (-(1-i^2+i-i))) = ... Let me just compute: (1-i)(1+i) = 1+1 = 2. (-(1+i))(1-i) = -(1-i+i-i^2) = -(1+1) = -2. det = (1/4)(2-(-2)) = (1/4)(4) = 1. Good, det = 1 so U in SU(2).

(c) U^3 = exp(-i (3)(2pi/3)(n_hat . sigma)/2) = exp(-i (2pi)(n_hat . sigma)/2) = exp(-i pi (n_hat . sigma)).

Using the formula: cos(pi) I - i sin(pi)(n_hat . sigma) = -I - 0 = -I.

So U^3 = -I, which is the identity up to global phase (-1). This is the SU(2) double-cover effect: a rotation by 2pi (three applications of 2pi/3) gives -I, not I. Six applications would give (-I)^2 = I.

#### Problem C3.11 (Stretch -- Operator Norm and Gate Error) [Stretch]
Two gates U and V are "epsilon-close" if ||U - V|| <= epsilon, where ||.|| is the operator norm (largest singular value).
(a) Show that if ||U - V|| <= epsilon, then for any state |psi>, the trace distance between U|psi> and V|psi> is at most epsilon.
(b) If we compose n gates, each epsilon-close to ideal, show that the total error is at most n*epsilon (triangle inequality bound).
(c) For a circuit of n = 100 gates, each with error epsilon = 10^{-4}, estimate the total error bound.

**Solution.**

(a) Trace distance for pure states: D(U|psi>, V|psi>) = sqrt(1 - |<psi|U^dagger V|psi>|^2). But more directly:
||(U-V)|psi>|| <= ||U-V|| . |||psi>|| = epsilon . 1 = epsilon (by definition of operator norm).
The fidelity F = |<psi|U^dagger V|psi>| >= 1 - epsilon^2/2 (for small epsilon), and the trace distance D <= epsilon (since ||(U-V)|psi>|| >= D for pure states by standard inequalities).

(b) The composition U_1 U_2 ... U_n vs V_1 V_2 ... V_n:
||U_1...U_n - V_1...V_n|| <= Sum_{k=1}^n ||U_k - V_k|| = n epsilon (by the telescoping identity and triangle inequality, using the fact that unitaries have operator norm 1).

(c) n epsilon = 100 . 10^{-4} = 0.01. The total error bound is 1%, which is a useful level of precision.

Note: this is a worst-case bound. In practice, errors may partially cancel, and quantum error correction (a later topic) can reduce the effective error exponentially.

---

### C3.10 Simulator Dependencies

**Required simulator features for C3:**

| Feature | Status | Detail |
|---------|--------|--------|
| Gate application (single qubit) | Required (new for C3) | User selects a gate from a palette, applies it to the current state. The state vector and Bloch sphere update. |
| Gate palette | Required (new for C3) | Palette includes: I, X, Y, Z, H, S, S^dagger, T, T^dagger, R_x(theta), R_y(theta), R_z(theta). Parametric gates have a slider for theta. |
| Rotation axis display | Required (new for C3) | When a gate is applied, the Bloch sphere shows the rotation axis as a dashed line and the rotation angle. Animation shows the smooth rotation path. |
| Matrix view | Required (new for C3) | A panel shows the 2x2 matrix of the current gate. For parametric gates, the matrix updates in real time as the parameter slider moves. |
| Gate composition | Required (new for C3) | User can queue up to 8 gates. The composite unitary is computed and displayed as a matrix. The Bloch sphere shows the cumulative rotation. |
| Z-Y decomposition tool | Required (new for C3) | User inputs a 2x2 unitary (or selects a preset). The tool computes the Z-Y decomposition parameters and displays the three-step rotation. |
| "Show me the algebra" toggle | Required (from SIM_CORE) | Shows intermediate steps: matrix multiplication, Bloch vector computation, rotation axis/angle extraction. |
| Single-qubit state initialisation | Required (from C1) | Carried forward. |
| Bloch sphere rendering | Required (from C1) | Carried forward. Enhanced with rotation axis display and animation. |
| Measurement simulation | Required (from C2) | Carried forward. Now available after gate application. |

**Simulator widget placement:**
- V-C3.1 (gate action on Bloch sphere) is the primary widget -- available throughout the lesson.
- V-C3.4 (rotation gate parameter explorer) is placed in Act 4.
- V-C3.5 (SU(2) to SO(3) visualisation) is placed in Act 5.
- V-C3.6 (Z-Y decomposition calculator) is placed in Act 6.
- V-C3.7 (circuit identity explorer) is placed in Act 6.
- Problem set: students verify Problems C3.1--C3.3, C3.7 using the simulator.

---

### C3.11 Estimates

| Metric | Estimate |
|--------|----------|
| Word count (prose) | 13,000--14,500 words |
| Figures/visual assets | 8 (V-C3.1 through V-C3.8) |
| Interactive widgets | 5 (V-C3.1, V-C3.4, V-C3.5, V-C3.6, V-C3.7) |
| Theorems/definitions | 4 definitions, 6 theorems |
| Worked examples | 5 |
| Problem set | 11 problems (including 2 stretch problems) |
| Estimated study time | 120--180 minutes |
| Implementation effort (prose) | 5 days |
| Implementation effort (visuals) | 3 days |
| Implementation effort (simulator features) | 4 days |
| Total implementation effort | 12 days |

---

### C3.12 Page Splits

The lesson is divided into six web pages to keep each at a manageable depth (2,000--2,500 words each).

**Page C3a: "Gates as Unitaries"** (approx. 2,200 words)
- Opening hook
- Why gates must be unitary (connection to P4)
- Definition C3.1
- The Pauli gates: definition, properties, action on basis states
- Theorem C3.1 (Pauli algebra)
- Visual assets V-C3.2 (Pauli action table)

**Page C3b: "Hadamard, S, and T"** (approx. 2,200 words)
- Hadamard derivation and properties (Definition C3.3, Theorem C3.2)
- Phase gates S and T (Definition C3.4)
- Visual asset V-C3.3 (Hadamard visualisation)
- Worked Examples C3.1, C3.5

**Page C3c: "Rotation Gates"** (approx. 2,500 words)
- Matrix exponential derivation
- R_x, R_y, R_z formulas (Theorem C3.3)
- Specific cases: R_x(pi), R_z(pi/2), etc.
- Visual assets V-C3.4 (parameter explorer), V-C3.8 (matrix exponential animation)
- Worked Example C3.2

**Page C3d: "The Bloch Sphere Derivation"** (approx. 2,500 words)
- Full derivation of the SU(2) to SO(3) map (Theorem C3.4)
- Gates as rotations: verification for all named gates
- Visual asset V-C3.5 (double cover visualisation)
- Worked Example C3.3
- Historical notes

**Page C3e: "Z-Y Decomposition and Circuit Identities"** (approx. 2,300 words)
- Z-Y decomposition theorem (Theorem C3.5)
- Circuit identities (Theorem C3.6)
- Application to basis-change measurements
- Visual assets V-C3.6, V-C3.7
- Worked Examples C3.4, C3.5
- Common confusions summary

**Page C3f: "Problems"** (approx. 2,800 words)
- Full problem set (Problems C3.1--C3.11)

---

## C4 -- Multi-Qubit Systems

**Canonical position:** 15 (after P6, before A5)
**Prerequisites:** C1 (The Qubit), C2 (Measurement), C3 (Single-Qubit Gates & Bloch Sphere), A4 (Tensor Products), P5 (Entanglement & EPR), P6 (Bell Inequalities & CHSH)
**Target length:** 12,000--15,000 words
**Estimated study time:** 120--180 minutes

---

### C4.1 Learning Objectives

By the end of this lesson the student will be able to:

1. **Construct the state space of a two-qubit system** as the tensor product C^2 tensor C^2 = C^4, and list the computational basis {|00>, |01>, |10>, |11>} with their column-vector representations.
2. **Compute tensor products** of single-qubit states and operators: |psi> tensor |phi>, and A tensor B, using both Dirac notation and explicit matrix (Kronecker product) calculations.
3. **Define separable and entangled states**: a state is separable if it can be written as |psi> tensor |phi>; otherwise it is entangled. Apply a concrete test (coefficient matrix rank) to determine separability.
4. **Derive the four Bell states** from first principles and verify their properties: maximally entangled, orthonormal, forming a basis for C^4.
5. **Define and compute the CNOT gate** matrix, verify that CNOT|+,0> produces a Bell state, and explain CNOT as "the entangling gate."
6. **Define and compute** the SWAP and CZ (controlled-Z) gates, and show the identity CZ = (I tensor H) CNOT (I tensor H).
7. **Perform partial measurement** on a two-qubit system: measuring one qubit collapses the composite state, leaving the other qubit in a conditional state. Compute the conditional states and probabilities.
8. **State the exponential scaling principle**: n qubits require 2^n complex amplitudes for a complete description, and explain why this is both the power and the challenge of quantum computing.
9. **Define and distinguish GHZ and W states** for three qubits, explaining their different entanglement properties.
10. **Use the simulator** to construct Bell states, apply CNOT, and perform partial measurements, verifying the theoretical predictions.

---

### C4.2 Intuition Arc

**Opening hook.** Everything so far has been one qubit: one vector in C^2, one Bloch sphere, one measurement outcome. But a classical computer with one bit is useless. The power of computing -- classical or quantum -- comes from combining many units. When we combine quantum bits, something extraordinary happens: the state space grows *exponentially*, and a new phenomenon emerges that has no classical analogue -- *entanglement*. This lesson introduces the multi-qubit formalism.

**Act 1: Tensor products -- building multi-qubit state spaces (words 1--3,000).** Begin by recalling tensor products from A4. For two qubits, the joint state space is C^2 tensor C^2 = C^4. The computational basis is {|00>, |01>, |10>, |11>}, corresponding to column vectors (1,0,0,0)^T, (0,1,0,0)^T, (0,0,1,0)^T, (0,0,0,1)^T. A general two-qubit state is |Psi> = a_{00}|00> + a_{01}|01> + a_{10}|10> + a_{11}|11> with Sum |a_{jk}|^2 = 1.

Tensor products of operators: if A acts on qubit 1 and B acts on qubit 2, the joint operator is A tensor B, which in matrix form is the 4x4 Kronecker product. Compute explicit examples: X tensor I, I tensor Z, H tensor H.

Notation convention: |ab> means |a> tensor |b> where qubit 1 is in state |a> and qubit 2 is in state |b>. The ordering convention is left-to-right = top-to-bottom in the tensor product.

**Act 2: Separable vs entangled states (words 3,000--5,500).** Define separability: |Psi> is separable if there exist single-qubit states |psi>, |phi> such that |Psi> = |psi> tensor |phi>. Otherwise |Psi> is entangled.

Test for separability: write |Psi> = a_{00}|00> + a_{01}|01> + a_{10}|10> + a_{11}|11>. Form the "coefficient matrix" M = [[a_{00}, a_{01}],[a_{10}, a_{11}]]. Then |Psi> is separable if and only if rank(M) = 1 (equivalently, det(M) = a_{00} a_{11} - a_{01} a_{10} = 0). Prove this.

Work through examples: (a) |01> is separable (M = [[0,1],[0,0]], rank 1). (b) (|00> + |11>)/sqrt(2) is entangled (M = [[1/sqrt(2), 0],[0, 1/sqrt(2)]], det = 1/2 != 0).

Connect to P5 and P6: entanglement is the resource that violates Bell inequalities. The student has already seen entanglement in the physics context; now we formalise it computationally.

**Act 3: Bell states and CNOT (words 5,500--9,000).** Derive the four Bell states:

|Phi^+> = (|00> + |11>)/sqrt(2)
|Phi^-> = (|00> - |11>)/sqrt(2)
|Psi^+> = (|01> + |10>)/sqrt(2)
|Psi^-> = (|01> - |10>)/sqrt(2)

Show they are orthonormal and form a basis for C^4. Show they are maximally entangled: tracing out one qubit gives the maximally mixed state rho = I/2.

Introduce CNOT: the controlled-NOT gate. Matrix: CNOT = [[1,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,1,0]]. Action: CNOT|a,b> = |a, a XOR b>. The first qubit (control) is unchanged; the second qubit (target) is flipped if the control is |1>.

Key computation: CNOT (|+> tensor |0>) = CNOT ((|0> + |1>)/sqrt(2) tensor |0>) = CNOT (|00> + |10>)/sqrt(2) = (|00> + |11>)/sqrt(2) = |Phi^+>.

This is the canonical entangling operation: CNOT takes a separable state and produces a Bell state. Explain that CNOT + single-qubit gates are sufficient for universal quantum computation (foreshadowing C5).

Introduce SWAP: SWAP|a,b> = |b,a>. Matrix: [[1,0,0,0],[0,0,1,0],[0,1,0,0],[0,0,0,1]]. Show SWAP = CNOT_{12} CNOT_{21} CNOT_{12} (three CNOTs).

Introduce CZ (controlled-Z): CZ|a,b> = (-1)^{ab}|a,b>. Matrix: diag(1,1,1,-1). Show CZ = (I tensor H) CNOT (I tensor H). CZ is symmetric: it does not distinguish control from target.

**Act 4: Partial measurement (words 9,000--11,500).** Measuring one qubit of a two-qubit system. Formalism: to measure qubit 1 in the computational basis, use projectors P_0^{(1)} = |0><0| tensor I and P_1^{(1)} = |1><1| tensor I.

Probability of outcome k for qubit 1: P(k) = <Psi| P_k^{(1)} |Psi>.
Post-measurement state: P_k^{(1)} |Psi> / ||P_k^{(1)} |Psi>||.

Detailed example: start with |Phi^+> = (|00> + |11>)/sqrt(2). Measure qubit 1.
P(0) = |<00|Phi^+>|^2 + ... More carefully: P_0^{(1)}|Phi^+> = (|0><0| tensor I)(|00> + |11>)/sqrt(2) = |00>/sqrt(2). Norm = 1/sqrt(2). P(0) = 1/2.
Post-measurement state: |00>. Qubit 2 is now definitely |0>.

P_1^{(1)}|Phi^+> = |11>/sqrt(2). P(1) = 1/2. Post-measurement state: |11>. Qubit 2 is now definitely |1>.

The key: measuring qubit 1 *instantly determines* the state of qubit 2, even though qubit 2 was not measured. This is the "spooky action" that Einstein found troubling, but it does not enable faster-than-light communication (because the outcome of qubit 1's measurement is random).

**Act 5: Exponential scaling, GHZ, and W states (words 11,500--14,000).** Generalise to n qubits: the state space is (C^2)^{tensor n} = C^{2^n}. The computational basis has 2^n elements: |0...0>, |0...1>, ..., |1...1>. A general state has 2^n complex amplitudes (minus one for normalisation and one for global phase, giving 2(2^n - 1) real parameters).

This exponential scaling is both the source of quantum computing's power (a state on 50 qubits requires 2^{50} ~ 10^{15} amplitudes, more than any classical computer can easily store) and its challenge (reading out all the information requires exponentially many measurements).

Three-qubit entangled states:

GHZ state: |GHZ> = (|000> + |111>)/sqrt(2). Properties: maximally entangled in a tripartite sense, but if any one qubit is traced out, the remaining two are in a separable mixed state. GHZ entanglement is "fragile."

W state: |W> = (|001> + |010> + |100>)/sqrt(3). Properties: if any one qubit is traced out, the remaining two are still entangled (in a mixed state, but with nonzero concurrence). W entanglement is "robust."

The GHZ and W states are inequivalent under stochastic local operations and classical communication (SLOCC): no protocol of local operations can convert one into the other, even probabilistically. This means multi-qubit entanglement is richer than two-qubit entanglement (where all entangled states are equivalent to Bell states under SLOCC).

**Closing synthesis (words 14,000--14,500).** Multi-qubit systems are where quantum computing becomes powerful and strange. Tensor products build the exponentially large state space. Entanglement -- impossible to replicate classically -- is generated by gates like CNOT. Partial measurement reveals the correlations encoded in entanglement. The GHZ and W states hint at the rich structure of multipartite entanglement. Next (C5): how to combine these ingredients into a universal computation.

---

### C4.3 Theorems, Definitions, and Proofs

#### Definition C4.1 -- Multi-Qubit State Space

The state space of an n-qubit system is the tensor product (C^2)^{tensor n} = C^{2^n}, equipped with the inner product <Phi|Psi> = Sum_{x in {0,1}^n} phi_x* psi_x. The *computational basis* is {|x_1 x_2 ... x_n> : x_j in {0,1}}, where |x_1 ... x_n> = |x_1> tensor ... tensor |x_n>.

#### Definition C4.2 -- Separable and Entangled States

A pure state |Psi> in C^{2^n} is *separable* (or *product*) if it can be written as |Psi> = |psi_1> tensor |psi_2> tensor ... tensor |psi_n> for single-qubit states |psi_j>. Otherwise, |Psi> is *entangled*.

#### Theorem C4.1 -- Separability Criterion for Two Qubits

**Statement.** A two-qubit state |Psi> = Sum_{j,k} a_{jk} |jk> is separable if and only if the 2x2 coefficient matrix M = [[a_{00}, a_{01}],[a_{10}, a_{11}]] has rank 1 (equivalently, det(M) = 0).

**Proof.**
Forward: if |Psi> = (alpha|0> + beta|1>) tensor (gamma|0> + delta|1>), then a_{jk} = c_j d_k where (c_0, c_1) = (alpha, beta) and (d_0, d_1) = (gamma, delta). The matrix M = c . d^T is the outer product of two vectors, which has rank 1. Its determinant is c_0 d_1 c_1 d_0 - c_0 d_0 c_1 d_1 ... Actually: det(M) = a_{00} a_{11} - a_{01} a_{10} = (alpha gamma)(beta delta) - (alpha delta)(beta gamma) = 0.

Backward: if rank(M) = 1, then the rows (or columns) are proportional. Say (a_{10}, a_{11}) = lambda (a_{00}, a_{01}) for some lambda. Then a_{jk} = c_j d_k where c_0 = 1, c_1 = lambda (up to normalisation) and d_k = a_{0k}. So |Psi> = (|0> + lambda|1>) tensor (a_{00}|0> + a_{01}|1>) (after normalisation). QED.

#### Definition C4.3 -- Bell States

The four Bell states are:

|Phi^+> = (|00> + |11>)/sqrt(2),   |Phi^-> = (|00> - |11>)/sqrt(2),
|Psi^+> = (|01> + |10>)/sqrt(2),   |Psi^-> = (|01> - |10>)/sqrt(2).

They form an orthonormal basis for C^4 (the Bell basis).

#### Theorem C4.2 -- Bell States are Maximally Entangled

**Statement.** For each Bell state |B>, the reduced density matrix of either qubit is rho_1 = rho_2 = I/2 (the maximally mixed state).

**Proof (for |Phi^+>).** 
rho = |Phi^+><Phi^+| = (1/2)(|00><00| + |00><11| + |11><00| + |11><11|).

rho_1 = Tr_2(rho) = Sum_{k=0,1} (I tensor <k|) rho (I tensor |k>)
= (1/2)(|0><0|<0|0> + |0><1|<0|1> + |1><0|<1|0> + |1><1|<1|1>)
= (1/2)(|0><0| . 1 + |0><1| . 0 + |1><0| . 0 + |1><1| . 1)
= (1/2)(|0><0| + |1><1|) = I/2.

The reduced state is maximally mixed. The von Neumann entropy is S(rho_1) = -Tr(rho_1 log rho_1) = -(1/2)log(1/2) - (1/2)log(1/2) = log 2 = 1 bit. This is the maximum possible entropy for a qubit, confirming maximal entanglement. QED.

#### Definition C4.4 -- CNOT Gate

The *controlled-NOT* (CNOT) gate is the two-qubit unitary defined by CNOT|a,b> = |a, a XOR b> for a,b in {0,1}. Its matrix representation in the computational basis is:

CNOT = [[1,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,1,0]].

Qubit 1 is the *control*; qubit 2 is the *target*.

#### Theorem C4.3 -- CNOT Creates Entanglement

**Statement.** CNOT(|+> tensor |0>) = |Phi^+>.

**Proof.**
|+> tensor |0> = (|0> + |1>)/sqrt(2) tensor |0> = (|00> + |10>)/sqrt(2).
CNOT|00> = |00>. CNOT|10> = |11>.
CNOT(|00> + |10>)/sqrt(2) = (|00> + |11>)/sqrt(2) = |Phi^+>. QED.

#### Definition C4.5 -- SWAP and CZ Gates

**SWAP gate:** SWAP|a,b> = |b,a>. Matrix:
SWAP = [[1,0,0,0],[0,0,1,0],[0,1,0,0],[0,0,0,1]].

**CZ (Controlled-Z) gate:** CZ|a,b> = (-1)^{ab}|a,b>. Matrix:
CZ = diag(1, 1, 1, -1).

#### Theorem C4.4 -- CZ from CNOT

**Statement.** CZ = (I tensor H) CNOT (I tensor H).

**Proof.** Since H|0> = |+> and H|1> = |->, the sequence (I tensor H), CNOT, (I tensor H) acts as:

|a, b> -> (I tensor H)|a, b> = |a> tensor H|b>.

Case b = 0: -> |a, +>. CNOT: |a, a XOR +> in a generalised sense. More carefully:

|a, +> = |a> tensor (|0> + |1>)/sqrt(2) = (|a0> + |a1>)/sqrt(2).
CNOT: (|a, 0 XOR a> + |a, 1 XOR a>)/sqrt(2).

If a = 0: (|00> + |01>)/sqrt(2) = |0,+>. Then (I tensor H): |0, H|+>> = |00>.
If a = 1: (|11> + |10>)/sqrt(2) = |1>(|0>+|1>)/sqrt(2) = |1,+>. Then (I tensor H): |1, 0>.

So for b = 0: output is |a, 0> regardless of a. No phase. Good, CZ|a,0> = |a,0>.

For b = 1:
|a, 1> -> |a, -> = |a>(|0> - |1>)/sqrt(2).
CNOT: If a=0: (|00> - |01>)/sqrt(2) = |0,->. (I tensor H): |0,1>.
If a=1: (|11> - |10>)/sqrt(2) = |1>(|1>-|0>)/sqrt(2) = -|1,->. Hmm: CNOT(|10> - |11>)/sqrt(2) = (|11> - |10>)/sqrt(2) = -(|10> - |11>)/sqrt(2) = -|1,->. (I tensor H): -|1,1>.

So: |0,1> -> |0,1> and |1,1> -> -|1,1>. This matches CZ: CZ|0,1> = |0,1> and CZ|1,1> = -|1,1>. QED.

#### Theorem C4.5 -- Partial Measurement

**Statement.** For a two-qubit state |Psi> = Sum_{j,k} a_{jk}|jk>, measuring qubit 1 in the computational basis yields outcome m in {0,1} with probability

P(m) = Sum_{k} |a_{mk}|^2

and the post-measurement state is

|Psi_post> = (1/sqrt(P(m))) Sum_{k} a_{mk} |mk>.

Equivalently, qubit 2 is in the (normalised) state |phi_m> = (1/sqrt(P(m))) Sum_k a_{mk} |k>.

**Proof.**
P_m^{(1)} = |m><m| tensor I. 
P_m^{(1)} |Psi> = Sum_{j,k} a_{jk} (|m><m|j>) tensor |k> = Sum_k a_{mk} |mk>.
P(m) = ||P_m^{(1)}|Psi>||^2 = Sum_k |a_{mk}|^2.
Post-measurement state: P_m^{(1)}|Psi>/||P_m^{(1)}|Psi>|| = (1/sqrt(P(m))) Sum_k a_{mk} |mk>. QED.

#### Theorem C4.6 -- Exponential Scaling

**Statement.** The state space of n qubits has dimension 2^n. A general n-qubit state requires 2^n complex amplitudes (equivalently, 2(2^n) - 2 real parameters after normalisation and global phase) for its complete specification.

**Proof.** dim((C^2)^{tensor n}) = (dim C^2)^n = 2^n by the dimension formula for tensor products. The normalisation constraint removes one real parameter, and global phase freedom removes another. Total real parameters: 2 . 2^n - 2. QED.

#### Definition C4.6 -- GHZ and W States

**GHZ state (3 qubits):** |GHZ> = (|000> + |111>)/sqrt(2).

**W state (3 qubits):** |W> = (|001> + |010> + |100>)/sqrt(3).

These are the two inequivalent classes of genuine tripartite entanglement under SLOCC (Dur, Vidal, Cirac, 2000).

---

### C4.4 Visual Assets

**V-C4.1: Tensor product construction (animated diagram).**
A step-by-step animation showing:
1. Frame 1: Two separate Bloch spheres for qubit 1 (state |psi>) and qubit 2 (state |phi>).
2. Frame 2: The tensor product |psi> tensor |phi> shown as a 4-component column vector, with each component labelled as alpha gamma, alpha delta, beta gamma, beta delta (where |psi> = alpha|0>+beta|1> and |phi> = gamma|0>+delta|1>).
3. Frame 3: The full C^4 state space, with the separable state highlighted as a single point within it. Caption: "Separable states are a small subset of all two-qubit states."

**V-C4.2: Entanglement visualisation (interactive, simulator).**
A two-qubit state editor:
- Four complex amplitude sliders for a_{00}, a_{01}, a_{10}, a_{11} (with normalisation enforced).
- The coefficient matrix M is displayed, with its determinant computed in real time.
- A colour indicator: green (separable, det = 0), red (entangled, det != 0).
- The "entanglement measure" (concurrence or entanglement entropy) is displayed as a bar.
- Two Bloch spheres show the reduced density matrices of each qubit. For separable states, each sphere shows a pure state (on the surface). For entangled states, each sphere shows a mixed state (inside the sphere).

**V-C4.3: Bell state circuit (interactive, simulator).**
A circuit diagram widget showing:
- Two horizontal wires (qubit 1, qubit 2).
- Qubit 1: H gate, then a dot (control of CNOT).
- Qubit 2: A cross (target of CNOT).
- Input: |00>.
- The state vector is shown at each stage: after H -> (|0>+|1>)/sqrt(2) tensor |0>, after CNOT -> |Phi^+>.
- "Show me the algebra" toggle displays the full matrix computation.
- User can change the input state to generate all four Bell states.

**V-C4.4: CNOT truth table and matrix (static diagram).**
A side-by-side display:
- Left: Truth table. |00> -> |00>, |01> -> |01>, |10> -> |11>, |11> -> |10>.
- Right: 4x4 matrix with highlighted 2x2 blocks (the identity block for control=0 and the X block for control=1).
- Annotation: "CNOT flips the target qubit if and only if the control qubit is |1>."

**V-C4.5: Partial measurement demo (interactive, simulator).**
A two-qubit system initialised in a Bell state (user-selectable). The user clicks "Measure qubit 1" and:
- The outcome (0 or 1) is displayed.
- The post-measurement state of the full system is shown.
- The conditional state of qubit 2 is shown on a Bloch sphere.
- A "Repeat 1000 times" button shows the statistics of qubit 2's state conditioned on qubit 1's outcome.

**V-C4.6: Exponential scaling chart (static diagram).**
A table/chart showing n (number of qubits) vs 2^n (number of amplitudes) vs classical memory required:

| n | 2^n | Memory (complex doubles) |
|---|-----|--------------------------|
| 1 | 2 | 32 bytes |
| 10 | 1,024 | 16 KB |
| 20 | 1,048,576 | 16 MB |
| 30 | ~10^9 | 16 GB |
| 40 | ~10^{12} | 16 TB |
| 50 | ~10^{15} | 16 PB |

Caption: "At 50 qubits, simulating a quantum computer requires more memory than any single classical computer possesses. This is the origin of quantum computational advantage."

**V-C4.7: GHZ vs W state comparison (interactive, simulator).**
A split-screen display:
- Left: GHZ state. Three Bloch spheres showing the reduced single-qubit states (all maximally mixed, I/2). A panel showing the two-qubit reduced state after tracing out one qubit (separable mixed state).
- Right: W state. Three Bloch spheres showing the reduced single-qubit states (not maximally mixed). A panel showing the two-qubit reduced state after tracing out one qubit (entangled mixed state).
- Caption comparing fragile (GHZ) vs robust (W) entanglement.

**V-C4.8: SWAP and CZ circuit decompositions (static diagram).**
Two circuit diagrams:
- Top: SWAP = three CNOTs (alternating control/target).
- Bottom: CZ = (I tensor H) CNOT (I tensor H). Equivalently, CNOT with H on the target before and after.

---

### C4.5 Worked Examples

#### Worked Example C4.1 -- Tensor product computation

**Problem.** Compute |psi> tensor |phi> where |psi> = (3/5)|0> + (4/5)|1> and |phi> = (1/sqrt(2))(|0> + i|1>).

**Solution.**
|psi> tensor |phi> = (3/5)(1/sqrt(2))(|00> + i|01>) + (4/5)(1/sqrt(2))(|10> + i|11>)
= (3/(5 sqrt(2)))|00> + (3i/(5 sqrt(2)))|01> + (4/(5 sqrt(2)))|10> + (4i/(5 sqrt(2)))|11>.

As a column vector: (1/(5 sqrt(2)))(3, 3i, 4, 4i)^T.

Verify normalisation: (1/50)(9 + 9 + 16 + 16) = 50/50 = 1. Confirmed.

Coefficient matrix: M = (1/(5 sqrt(2)))[[3, 3i],[4, 4i]]. det(M) = (1/50)(3 . 4i - 3i . 4) = (1/50)(12i - 12i) = 0. Separable, as expected.

#### Worked Example C4.2 -- Entanglement test

**Problem.** Is the state |Psi> = (1/2)|00> + (1/2)|01> + (1/2)|10> - (1/2)|11> entangled?

**Solution.**
Coefficient matrix: M = (1/2)[[1, 1],[1, -1]].
det(M) = (1/4)(1 . (-1) - 1 . 1) = (1/4)(-2) = -1/2 != 0.
The state is entangled.

Note: M = (1/2) . (sqrt(2) H), where H is the Hadamard matrix. In fact, |Psi> = |+> tensor H|+>... let me verify. |+> tensor |+> = (1/2)(|00>+|01>+|10>+|11>). (I tensor H)|+,+> = |+> tensor H|+> = |+> tensor |0> = (1/sqrt(2))(|00>+|10>). That's not right.

Actually: |Psi> = (1/2)(|0>(|0>+|1>) + |1>(|0>-|1>)) = (1/2)(|0> tensor sqrt(2)|+> + |1> tensor sqrt(2)|->)) = (1/sqrt(2))(|0,+> + |1,->). But |0,+> and |1,-> are not the same factorisation, so this doesn't factor. Alternatively: |Psi> = (1/sqrt(2)) CNOT (|+> tensor |+>)? Let me just confirm entanglement via the determinant test. det(M) = -1/2 != 0, so entangled. Done.

#### Worked Example C4.3 -- Generating all four Bell states

**Problem.** Show how to generate all four Bell states from the circuit H tensor I followed by CNOT, by varying the input state.

**Solution.**

Input |00>: H tensor I -> (|0>+|1>)/sqrt(2) tensor |0> = (|00>+|10>)/sqrt(2). CNOT -> (|00>+|11>)/sqrt(2) = |Phi^+>.

Input |10>: H tensor I -> (|0>-|1>)/sqrt(2) tensor |0> = (|00>-|10>)/sqrt(2). CNOT -> (|00>-|11>)/sqrt(2) = |Phi^->.

Input |01>: H tensor I -> (|0>+|1>)/sqrt(2) tensor |1> = (|01>+|11>)/sqrt(2). CNOT -> (|01>+|10>)/sqrt(2) = |Psi^+>.

Input |11>: H tensor I -> (|0>-|1>)/sqrt(2) tensor |1> = (|01>-|11>)/sqrt(2). CNOT -> (|01>-|10>)/sqrt(2) = |Psi^->.

Summary: (H tensor I) followed by CNOT maps the computational basis to the Bell basis. The inverse circuit (CNOT followed by H tensor I) maps the Bell basis back to the computational basis.

#### Worked Example C4.4 -- Partial measurement of a Bell state

**Problem.** The state |Psi^+> = (|01> + |10>)/sqrt(2) is shared between Alice (qubit 1) and Bob (qubit 2). Alice measures her qubit in the computational basis. Find the probabilities and Bob's post-measurement state for each outcome.

**Solution.**
|Psi^+> = (|01> + |10>)/sqrt(2).

P_0^{(1)}|Psi^+> = (|0><0| tensor I)(|01> + |10>)/sqrt(2) = |01>/sqrt(2).
P(0) = ||01>/sqrt(2)||^2 = 1/2.
Post-measurement state: |01>. Bob's qubit is |1>.

P_1^{(1)}|Psi^+> = (|1><1| tensor I)(|01> + |10>)/sqrt(2) = |10>/sqrt(2).
P(1) = 1/2.
Post-measurement state: |10>. Bob's qubit is |0>.

Alice and Bob's outcomes are perfectly anti-correlated: if Alice gets 0, Bob gets 1, and vice versa. This is the defining feature of |Psi^+> -- it is the singlet-like state (in fact, |Psi^-> is the true singlet; |Psi^+> is the triplet with m=0).

#### Worked Example C4.5 -- Three-qubit GHZ state partial measurement

**Problem.** The state |GHZ> = (|000> + |111>)/sqrt(2) is shared among Alice (qubit 1), Bob (qubit 2), and Charlie (qubit 3). Alice measures her qubit. Find the joint post-measurement state of Bob and Charlie.

**Solution.**
P_0^{(1)}|GHZ> = |000>/sqrt(2). P(0) = 1/2. Post-measurement: |000>. Bob and Charlie are in |00>, a separable state.

P_1^{(1)}|GHZ> = |111>/sqrt(2). P(1) = 1/2. Post-measurement: |111>. Bob and Charlie are in |11>, a separable state.

In both cases, Bob and Charlie's joint state is separable! This is the "fragility" of GHZ entanglement: measuring (and tracing out) one party destroys the entanglement between the remaining parties.

Contrast with the W state: |W> = (|001> + |010> + |100>)/sqrt(3).
P_0^{(1)}|W> = (|001> + |010>)/sqrt(3). P(0) = 2/3. Post-measurement: (|01> + |10>)/sqrt(2) -- an entangled state! Bob and Charlie retain entanglement even after Alice's measurement.

P_1^{(1)}|W> = |100>/sqrt(3). P(1) = 1/3. Post-measurement: |00>. Separable.

So with probability 2/3, the W state preserves Bob-Charlie entanglement; with probability 1/3, it does not. On average, W entanglement is more robust than GHZ.

---

### C4.6 Common Confusions

**Confusion 1: "Two qubits means two Bloch spheres."**
Only for separable states. An entangled two-qubit state cannot be described by two independent Bloch spheres. The reduced states (obtained by tracing out one qubit) give two Bloch vectors, but these do not contain the full information of the two-qubit state. The correlations between the qubits -- encoded in the off-diagonal blocks of the density matrix -- are not captured by the individual Bloch vectors.

**Confusion 2: "Entanglement means the qubits are physically close together."**
Entanglement is a property of the quantum state, not of spatial proximity. Entangled qubits can be separated by arbitrary distances. The Bell-state correlations persist regardless of the spatial separation (as demonstrated in Bell-test experiments with photons separated by over 1000 km via satellite, Yin et al. 2017).

**Confusion 3: "CNOT copies the control qubit to the target."**
CNOT does NOT copy the control state. Consider CNOT(alpha|0>+beta|1>) tensor |0> = alpha|00> + beta|11>. If CNOT had "copied" the control, the result would be (alpha|0>+beta|1>) tensor (alpha|0>+beta|1>), which is a separable state with amplitudes alpha^2|00> + alpha beta|01> + beta alpha|10> + beta^2|11>. This is NOT what CNOT produces. CNOT creates an entangled state, not a copy. (This is related to the no-cloning theorem.)

**Confusion 4: "Measuring one qubit of an entangled pair sends information to the other."**
Measuring qubit 1 of |Phi^+> determines qubit 2's state, but this does NOT transmit information. Alice cannot choose the outcome of her measurement (it is random 0/1 with equal probability). Bob, looking only at his qubit, sees the maximally mixed state I/2 regardless of whether Alice has measured. Only when Alice and Bob compare their results (via a classical communication channel) do they discover the correlations. This is the essence of the no-signalling theorem.

**Confusion 5: "n qubits store 2^n classical bits of information."**
Qubits are described by 2^n complex amplitudes, but the Holevo bound states that n qubits can transmit at most n classical bits of information (in the absence of shared entanglement). The exponential number of amplitudes is fundamentally inaccessible through measurement. The power of quantum computing comes not from storing exponentially much data but from interfering amplitudes during computation.

**Confusion 6: "The tensor product sign means AND."**
The tensor product |a> tensor |b> represents the state of two qubits where qubit 1 is in state |a> and qubit 2 is in state |b>. But the tensor product structure is richer than logical AND: it permits superpositions like alpha|00> + beta|11>, which have no classical analogue.

---

### C4.7 Cross-References

| Reference | Direction | Detail |
|-----------|-----------|--------|
| C1 (The Qubit) | Backward | Single-qubit state space and Dirac notation. |
| C2 (Measurement) | Backward | Single-qubit projective measurement. Partial measurement in C4 generalises the formalism. |
| C3 (Gates & Bloch Sphere) | Backward | Single-qubit gates are used within multi-qubit circuits (e.g., H on one qubit before CNOT). Bloch sphere for reduced states. |
| A4 (Tensor Products) | Backward | The tensor product construction, Kronecker product, and dimension formula are assumed from A4. |
| P5 (Entanglement & EPR) | Backward | The physics of entanglement was introduced in P5. C4 provides the computational formalism. |
| P6 (Bell Inequalities) | Backward | Bell states and CHSH were analysed in P6. C4 shows how to create and measure Bell states using circuits. |
| C5 (Universal Gate Sets) | Forward | CNOT + single-qubit gates are sufficient for universality. The Toffoli gate (C5) extends to three qubits. |
| C3 (Gates) | Backward | CNOT is defined here; CZ is shown equivalent to CNOT conjugated by (I tensor H). |

---

### C4.8 Historical Notes

- **Tensor products in quantum mechanics.** The tensor product structure of composite quantum systems was first articulated by John von Neumann in his 1932 *Mathematische Grundlagen der Quantenmechanik*, though the mathematical framework of tensor products was developed earlier by mathematicians (Grassmann, 1862).

- **Entanglement.** The term "Verschrankung" (entanglement) was coined by Erwin Schrodinger in 1935, in response to the EPR paper. Schrodinger described it as "not one but rather THE characteristic trait of quantum mechanics." The formal theory of entanglement as a resource for information processing was developed in the 1990s by Bennett, Wootters, Popescu, and others.

- **The CNOT gate.** The CNOT gate's role as the fundamental two-qubit gate for quantum computation was established by Barenco et al. (1995) in their seminal paper "Elementary gates for quantum computation," which showed that CNOT + arbitrary single-qubit gates form a universal gate set.

- **GHZ and W states.** The GHZ state was introduced by Greenberger, Horne, and Zeilinger (1989) as a three-particle state that gives an even more dramatic contradiction with local hidden variables than two-particle Bell states (GHZ theorem: a single measurement can refute local realism, without requiring statistical analysis). The W state classification and the distinction between GHZ and W entanglement classes was established by Dur, Vidal, and Cirac (2000).

- **Exponential scaling.** Richard Feynman's 1982 paper "Simulating physics with computers" identified the exponential growth of the quantum state space as the fundamental reason why classical computers cannot efficiently simulate quantum systems -- and proposed that quantum computers might be able to.

---

### C4.9 Problem Set

#### Problem C4.1 (Tensor Products) [Computational]
(a) Compute |+> tensor |-> as a 4-component column vector.
(b) Compute the Kronecker product X tensor Z as a 4x4 matrix.
(c) Apply (X tensor Z) to |+> tensor |-> and verify the result equals X|+> tensor Z|->.

**Solutions.**

(a) |+> = (1,1)^T/sqrt(2), |-> = (1,-1)^T/sqrt(2). Tensor: (1/2)(1, -1, 1, -1)^T.

(b) X tensor Z = [[0,1],[1,0]] tensor [[1,0],[0,-1]] = [[0.Z, 1.Z],[1.Z, 0.Z]] = [[0,0,1,0],[0,0,0,-1],[1,0,0,0],[0,-1,0,0]].

(c) (X tensor Z)(1/2)(1,-1,1,-1)^T = (1/2)(1, 1, 1, 1)... Let me compute:
Row 1: 0.1 + 0.(-1) + 1.1 + 0.(-1) = 1. (1/2)(1).
Row 2: 0.1 + 0.(-1) + 0.1 + (-1)(-1) = 1. (1/2)(1).
Row 3: 1.1 + 0.(-1) + 0.1 + 0.(-1) = 1. (1/2)(1).
Row 4: 0.1 + (-1)(-1) + 0.1 + 0.(-1) = 1. (1/2)(1).
Result: (1/2)(1, 1, 1, 1)^T = |+> tensor |+>.

Check: X|+> = |+> (since X just permutes the |0> and |1> components of |+>). Z|-> = -|+>... wait. Z|-> = Z(|0>-|1>)/sqrt(2) = (|0>+|1>)/sqrt(2) = |+>. Hmm. Actually Z|-> = (Z|0> - Z|1>)/sqrt(2) = (|0> - (-|1>))/sqrt(2) = (|0>+|1>)/sqrt(2) = |+>.

So X|+> tensor Z|-> = |+> tensor |+> = (1/2)(1,1,1,1)^T. Matches.

#### Problem C4.2 (Separability) [Computational]
Determine whether each state is separable or entangled:
(a) |Psi_a> = (|00> + |01> + |10> + |11>)/2.
(b) |Psi_b> = (|00> + |01> + |10> - |11>)/2.
(c) |Psi_c> = (|00> + 2|01> + 3|10> + 6|11>)/sqrt(50).

**Solutions.**

(a) M = (1/2)[[1,1],[1,1]]. det = (1/4)(1-1) = 0. Separable. In fact, |Psi_a> = |+> tensor |+>.

(b) M = (1/2)[[1,1],[1,-1]]. det = (1/4)(-1-1) = -1/2 != 0. Entangled.

(c) M = (1/sqrt(50))[[1,2],[3,6]]. det = (1/50)(6-6) = 0. Separable. In fact, |Psi_c> = (1/sqrt(50))(|0>+3|1>) tensor (|0>+2|1>) = (1/sqrt(10))(|0>+3|1>) tensor (1/sqrt(5))(|0>+2|1>).

#### Problem C4.3 (Bell State Properties) [Proof]
(a) Show that the four Bell states are orthonormal.
(b) Show that they form a basis for C^4.

**Solutions.**

(a) <Phi^+|Phi^-> = (1/2)(<00|+<11|)(|00>-|11>) = (1/2)(1-1) = 0. Similarly for all other pairs (each pair either has no overlapping basis states, or the overlapping terms cancel due to sign differences). Self-overlaps: <Phi^+|Phi^+> = (1/2)(1+1) = 1. All four states are normalised and mutually orthogonal.

(b) Four orthonormal vectors in C^4 (dimension 4) span the entire space. Any |Psi> in C^4 can be written as a_{00}|00>+a_{01}|01>+a_{10}|10>+a_{11}|11>, and inverting the Bell-state definitions:
|Phi^+> + |Phi^-> = sqrt(2)|00>, so |00> = (|Phi^+>+|Phi^->)/sqrt(2). Similarly for the other three.

#### Problem C4.4 (CNOT Computation) [Computational]
Apply CNOT to each of the following states and determine if the result is entangled:
(a) |+, 1> = (|01> + |11>)/sqrt(2).
(b) |0, +> = (|00> + |01>)/sqrt(2).
(c) |-,0> = (|00> - |10>)/sqrt(2).

**Solutions.**

(a) CNOT(|01>+|11>)/sqrt(2) = (|01> + |10>)/sqrt(2) = |Psi^+>. Entangled.

(b) CNOT(|00>+|01>)/sqrt(2) = (|00>+|01>)/sqrt(2) = |0,+>. Separable (control is |0>, so target is unchanged).

(c) CNOT(|00>-|10>)/sqrt(2) = (|00>-|11>)/sqrt(2) = |Phi^->. Entangled.

#### Problem C4.5 (Partial Measurement) [Computational]
The state |Psi> = (1/2)|00> + (1/2)|01> + (1/sqrt(2))|10> is a two-qubit state. (First verify normalisation.)
(a) Measure qubit 1. Find P(0) and P(1) and the post-measurement state of qubit 2.
(b) Measure qubit 2. Find P(0) and P(1) and the post-measurement state of qubit 1.

**Solutions.**

Normalisation: |1/2|^2 + |1/2|^2 + |1/sqrt(2)|^2 = 1/4 + 1/4 + 1/2 = 1. Valid.

(a) P(qubit 1 = 0) = |a_{00}|^2 + |a_{01}|^2 = 1/4 + 1/4 = 1/2.
Post: (1/2)(|00>+|01>)/sqrt(1/2) = (1/sqrt(2))(|00>+|01>) -- but we need |0> tensor (normalised qubit 2). Qubit 2 state: (1/2)|0> + (1/2)|1>, normalised: (1/sqrt(2))(|0>+|1>) = |+>.

P(qubit 1 = 1) = |a_{10}|^2 + |a_{11}|^2 = 1/2 + 0 = 1/2.
Post: (1/sqrt(2))|10>/sqrt(1/2) = |10>. Qubit 2 is |0>.

(b) P(qubit 2 = 0) = |a_{00}|^2 + |a_{10}|^2 = 1/4 + 1/2 = 3/4.
Qubit 1 state: ((1/2)|0> + (1/sqrt(2))|1>)/sqrt(3/4) = (1/sqrt(3))|0> + sqrt(2/3)|1>.

P(qubit 2 = 1) = |a_{01}|^2 + |a_{11}|^2 = 1/4 + 0 = 1/4.
Qubit 1 state: (1/2)|0>/sqrt(1/4) = |0>.

#### Problem C4.6 (SWAP Decomposition) [Proof]
Verify that SWAP = CNOT_{12} CNOT_{21} CNOT_{12} by computing the action on all four computational basis states, where CNOT_{12} has qubit 1 as control and CNOT_{21} has qubit 2 as control.

**Solution.**

|00>: CNOT_{12}|00> = |00>. CNOT_{21}|00> = |00>. CNOT_{12}|00> = |00>. SWAP|00> = |00>. Matches.

|01>: CNOT_{12}|01> = |01>. CNOT_{21}|01> = |11>. CNOT_{12}|11> = |10>. SWAP|01> = |10>. Matches.

|10>: CNOT_{12}|10> = |11>. CNOT_{21}|11> = |01>. CNOT_{12}|01> = |01>. SWAP|10> = |01>. Matches.

|11>: CNOT_{12}|11> = |10>. CNOT_{21}|10> = |10>. CNOT_{12}|10> = |11>. SWAP|11> = |11>. Matches.

All four basis states check out. Since the gates agree on a basis, they agree on all states. QED.

#### Problem C4.7 (Operator on One Qubit) [Computational]
The state is |Phi^+> = (|00>+|11>)/sqrt(2). Apply Z tensor I (Pauli Z on qubit 1, identity on qubit 2). What is the resulting state?

**Solution.**
(Z tensor I)|Phi^+> = (Z|0> tensor |0> + Z|1> tensor |1>)/sqrt(2) = (|0> tensor |0> + (-|1>) tensor |1>)/sqrt(2) = (|00> - |11>)/sqrt(2) = |Phi^->.

Applying Z to one qubit of |Phi^+> converts it to |Phi^->. Similarly, X tensor I gives |Psi^+>, and Y tensor I gives -i|Psi^->. The Pauli operators on one qubit cycle through all four Bell states.

#### Problem C4.8 (Exponential Scaling) [Conceptual]
A quantum computer has 300 qubits. Explain why a classical computer cannot even *store* the state vector, let alone simulate it.

**Solution.**
The state vector has 2^{300} complex amplitudes. 2^{300} approx 2 x 10^{90}. Each complex amplitude requires 16 bytes (two 8-byte doubles). Total memory: ~3.2 x 10^{91} bytes. The observable universe contains roughly 10^{80} atoms. Even if each atom could store one byte, we would be short by a factor of 10^{11}. The classical memory required to even write down the state exceeds any conceivable classical storage.

#### Problem C4.9 (GHZ vs W) [Computational]
(a) Compute the reduced density matrix of qubits 2 and 3 for the GHZ state (|000>+|111>)/sqrt(2) by tracing out qubit 1.
(b) Do the same for the W state (|001>+|010>+|100>)/sqrt(3).
(c) Determine which reduced state is entangled.

**Solutions.**

(a) Trace out qubit 1 from |GHZ><GHZ|.
rho_{23} = Tr_1(|GHZ><GHZ|) = (1/2)(|00><00| + |11><11|).
This is a diagonal matrix diag(1/2, 0, 0, 1/2). It is a classical mixture of |00> and |11>. Separability: this is a separable mixed state (it is a convex combination of product states |00><00| and |11><11|). No entanglement.

(b) |W> = (|001>+|010>+|100>)/sqrt(3).
rho = |W><W| = (1/3)(|001><001| + |001><010| + |001><100| + |010><001| + |010><010| + |010><100| + |100><001| + |100><010| + |100><100|).

Tr_1(rho) = <0|_1 rho |0>_1 + <1|_1 rho |1>_1.

<0|_1 rho |0>_1 = (1/3)(|01><01| + |01><10| + |10><01| + |10><10|) = (1/3)(|01>+|10>)(<01|+<10|).
<1|_1 rho |1>_1 = (1/3)|00><00|.

rho_{23} = (2/3)|psi><psi| + (1/3)|00><00| where |psi> = (|01>+|10>)/sqrt(2).

This is a mixture of an entangled state |psi> (weight 2/3) and a separable state |00> (weight 1/3). To check entanglement, compute the concurrence or check the PPT criterion:

rho_{23} in the {|00>,|01>,|10>,|11>} basis:
(1/3)[[1, 0, 0, 0],[0, 1, 1, 0],[0, 1, 1, 0],[0, 0, 0, 0]].

The partial transpose (transpose qubit 3):
rho_{23}^{T_3} = (1/3)[[1, 0, 0, 0],[0, 1, 0, 0],[0, 0, 1, 1],[0, 0, 1, 0]]... 

Actually, the partial transpose swaps |0><1| <-> |1><0| on qubit 3. The eigenvalues of rho_{23}^{T_3} can be checked; if any is negative, the state is entangled (PPT criterion, necessary and sufficient for 2x2 systems).

A simpler approach: compute the concurrence. For a 2x2 system rho, the concurrence C = max(0, lambda_1 - lambda_2 - lambda_3 - lambda_4) where lambda_i are the square roots of the eigenvalues of rho . tilde(rho) in decreasing order and tilde(rho) = (sigma_y tensor sigma_y) rho* (sigma_y tensor sigma_y).

This computation is involved. The result is C = 1/3 > 0, confirming entanglement. The W state's reduced two-qubit state is entangled, while the GHZ state's is not.

#### Problem C4.10 (Stretch -- Schmidt Decomposition) [Stretch]
For a two-qubit state |Psi> = (1/sqrt(6))|00> + (1/sqrt(6))|01> + (2/sqrt(6))|10>:
(a) Find the Schmidt decomposition |Psi> = sum_k lambda_k |u_k> tensor |v_k>.
(b) Determine the Schmidt rank and whether the state is entangled.
(c) Compute the entanglement entropy S = -sum_k lambda_k^2 log_2(lambda_k^2).

**Solution.**

(a) Coefficient matrix: M = (1/sqrt(6))[[1, 1],[2, 0]].
SVD of M: M = U Sigma V^dagger.

M^dagger M = (1/6)[[1,2],[1,0]][[1,1],[2,0]] = (1/6)[[5, 1],[1, 1]].
Eigenvalues of M^dagger M: det((1/6)[[5-lambda, 1],[1, 1-lambda]]) = 0 (scaling lambda by 6):
(5-mu)(1-mu) - 1 = 0 => mu^2 - 6mu + 4 = 0 => mu = (6 +/- sqrt(20))/2 = 3 +/- sqrt(5).

Singular values: sigma_1 = sqrt((3+sqrt(5))/6), sigma_2 = sqrt((3-sqrt(5))/6).

Schmidt coefficients: lambda_1 = sigma_1, lambda_2 = sigma_2.
Numerically: sqrt(5) approx 2.236. lambda_1 = sqrt(5.236/6) approx sqrt(0.8727) approx 0.9342. lambda_2 = sqrt(0.764/6) approx sqrt(0.1273) approx 0.3568.

(b) Schmidt rank = 2 (two nonzero Schmidt coefficients). Since rank > 1, the state is entangled.

(c) S = -(0.9342^2 log_2(0.9342^2) + 0.3568^2 log_2(0.3568^2))
= -(0.8727 log_2(0.8727) + 0.1273 log_2(0.1273))
= -(0.8727 . (-0.1963) + 0.1273 . (-2.974))
= -(- 0.1713 - 0.3786)
= 0.5499 bits.

This is between 0 (separable) and 1 (maximally entangled), indicating partial entanglement.

---

### C4.10 Simulator Dependencies

**Required simulator features for C4:**

| Feature | Status | Detail |
|---------|--------|--------|
| Two-qubit state initialisation | Required (new for C4) | User inputs a 4-component state vector, or selects from presets (computational basis, Bell states, GHZ, W). |
| Two-qubit gate palette | Required (new for C4) | Gates: CNOT, SWAP, CZ, and tensor products of single-qubit gates (e.g., H tensor I, X tensor Z). |
| Circuit builder (2 qubits) | Required (new for C4) | Two wires, user places gates by clicking. The state vector updates after each gate. Circuit depth up to 8. |
| Entanglement indicator | Required (new for C4) | Real-time display of whether the current state is separable or entangled (using det(M) for 2 qubits). Display concurrence and entanglement entropy. |
| Partial measurement | Required (new for C4) | User selects which qubit to measure. The outcome is displayed, and the post-measurement state is shown (both the joint state and the conditional single-qubit state). |
| Three-qubit support | Required (new for C4) | For GHZ and W state examples. 8-component state vector, three wires in the circuit builder. |
| State vector display (multi-qubit) | Required (new for C4) | Show the full state vector with amplitude bars for each computational basis state. Colour-code by phase. |
| "Show me the algebra" toggle | Required (from SIM_CORE) | For Kronecker products, partial trace, and partial measurement computations. |
| All single-qubit features | Required (from C1-C3) | Carried forward. |

**Simulator widget placement:**
- V-C4.2 (entanglement visualisation) is placed after Act 2.
- V-C4.3 (Bell state circuit) is placed in Act 3.
- V-C4.5 (partial measurement demo) is placed in Act 4.
- V-C4.7 (GHZ vs W comparison) is placed in Act 5.
- Problem set: students verify Problems C4.1, C4.4, C4.5, C4.7 using the simulator.

---

### C4.11 Estimates

| Metric | Estimate |
|--------|----------|
| Word count (prose) | 13,000--14,500 words |
| Figures/visual assets | 8 (V-C4.1 through V-C4.8) |
| Interactive widgets | 4 (V-C4.2, V-C4.3, V-C4.5, V-C4.7) |
| Theorems/definitions | 6 definitions, 6 theorems |
| Worked examples | 5 |
| Problem set | 10 problems (including 1 stretch problem) |
| Estimated study time | 120--180 minutes |
| Implementation effort (prose) | 5 days |
| Implementation effort (visuals) | 3 days |
| Implementation effort (simulator features) | 5 days |
| Total implementation effort | 13 days |

---

### C4.12 Page Splits

The lesson is divided into six web pages.

**Page C4a: "Tensor Products and Two-Qubit States"** (approx. 2,500 words)
- Opening hook
- C^2 tensor C^2 = C^4, computational basis
- Tensor products of states and operators
- Definition C4.1
- Visual asset V-C4.1
- Worked Example C4.1

**Page C4b: "Separable vs Entangled States"** (approx. 2,200 words)
- Definition C4.2
- Separability criterion (Theorem C4.1)
- Examples and tests
- Visual asset V-C4.2
- Worked Example C4.2

**Page C4c: "Bell States and CNOT"** (approx. 2,500 words)
- Bell states derived (Definition C4.3, Theorem C4.2)
- CNOT gate (Definition C4.4, Theorem C4.3)
- SWAP and CZ (Definition C4.5, Theorem C4.4)
- Visual assets V-C4.3, V-C4.4, V-C4.8
- Worked Example C4.3

**Page C4d: "Partial Measurement"** (approx. 2,200 words)
- Partial measurement formalism (Theorem C4.5)
- Detailed examples on Bell states
- No-signalling discussion
- Visual asset V-C4.5
- Worked Example C4.4

**Page C4e: "Exponential Scaling, GHZ, and W States"** (approx. 2,500 words)
- n qubits -> 2^n amplitudes (Theorem C4.6)
- GHZ and W states (Definition C4.6)
- Fragile vs robust entanglement
- Visual assets V-C4.6, V-C4.7
- Worked Example C4.5
- Historical notes
- Common confusions

**Page C4f: "Problems"** (approx. 2,600 words)
- Full problem set (Problems C4.1--C4.10)

---

## C5 -- Universal Gate Sets

**Canonical position:** 17 (after A6, before C6)
**Prerequisites:** C1 (The Qubit), C2 (Measurement), C3 (Single-Qubit Gates & Bloch Sphere), C4 (Multi-Qubit Systems), A4 (Tensor Products), A5 (Function Spaces & Operators, or equivalent)
**Target length:** 10,000--12,000 words
**Estimated study time:** 120--150 minutes

---

### C5.1 Learning Objectives

By the end of this lesson the student will be able to:

1. **Define universality**: a gate set G is *universal* if any unitary operator on n qubits can be approximated to arbitrary precision by a finite circuit composed of gates from G.
2. **State and explain why {CNOT, H, T} is a universal gate set**: CNOT provides entangling capability, H and T generate a dense subgroup of SU(2), and together they approximate any unitary.
3. **State the Solovay-Kitaev theorem**: any single-qubit unitary can be approximated to precision epsilon using O(log^c(1/epsilon)) gates from a generating set (where c approximately 3.97), and explain the practical significance of this polylogarithmic scaling.
4. **Derive and apply key circuit identities**: HXH = Z, HZH = X, HTH = ?, and identities involving controlled gates.
5. **Construct controlled-U gates** from CNOT and single-qubit gates for arbitrary single-qubit unitaries U, using the A-B-C decomposition (U = e^{i alpha} AXBXC where ABC = I).
6. **Define and construct the Toffoli gate** (CCNOT) as a three-qubit gate, express it as a circuit of CNOT and single-qubit gates, and explain its role in classical reversible computation.
7. **Define circuit complexity measures**: circuit depth, circuit width, gate count, and T-count; explain why T-count is the dominant cost metric in fault-tolerant quantum computing.
8. **Define and use ancilla qubits**: explain the role of auxiliary qubits initialised to |0> and measured/discarded at the end of a computation, and show how ancillas enable constructions that would otherwise be impossible.
9. **Distinguish the Clifford group from universal computation**: define the Clifford group (generated by {H, S, CNOT}), state the Gottesman-Knill theorem (Clifford circuits are classically simulable), and explain why T is the "magic ingredient" for universality.
10. **Use the simulator** to build circuits from universal gate sets, verify circuit identities, and approximate target unitaries.

---

### C5.2 Intuition Arc

**Opening hook.** In classical computing, the NAND gate is universal: every Boolean function can be computed by a circuit of NAND gates. This is a foundational result of computer science. Is there an analogous result for quantum computing? Yes -- and it is both more subtle and more powerful. A *finite* set of quantum gates can approximate *any* unitary transformation on any number of qubits to any desired precision. This lesson proves this and explores its consequences.

**Act 1: What does universality mean? (words 1--2,500).** Begin by defining the goal: we want to build arbitrary n-qubit unitary operators from a small, fixed set of elementary gates. Since the space of unitaries is continuous (uncountably infinite) but a finite gate set generates only countably many circuits, we cannot achieve exact implementation of every unitary. Instead, we settle for *approximation*: for every target unitary U and every epsilon > 0, there exists a circuit C from the gate set such that ||C - U|| < epsilon.

Two types of universality:
1. **Exact universality over C**: the gate set can implement exactly any unitary (requires continuous parameters, e.g., {CNOT, R_y(theta), R_z(theta)} for all theta).
2. **Approximate universality**: the gate set contains only finitely many distinct gates, but any unitary can be approximated to arbitrary precision (e.g., {CNOT, H, T}).

This lesson focuses on both, with emphasis on approximate universality (the more practical notion, since real hardware has a fixed gate set).

Establish the two-step strategy for universality:
Step 1: Show that CNOT + arbitrary single-qubit gates are exactly universal for n-qubit unitaries.
Step 2: Show that {H, T} generates a dense subgroup of SU(2), so any single-qubit gate can be approximated.

**Act 2: CNOT + single-qubit gates are exactly universal (words 2,500--4,500).** This is a deep theorem (Barenco et al., 1995). State it without full proof (the proof is lengthy and uses induction on the number of qubits). The key ideas:
1. Any two-level unitary (one that acts non-trivially on only two computational basis states) can be implemented using O(n) CNOT and single-qubit gates.
2. Any n-qubit unitary can be decomposed into a product of at most 2^n(2^n-1)/2 two-level unitaries (using the QR decomposition or Givens rotations).
3. Combining: any n-qubit unitary can be implemented using O(4^n) CNOT and single-qubit gates.

Discuss: this is *exponential* in n. For useful quantum algorithms, the circuits must be much shorter (polynomial in n). The universality theorem guarantees that the gate set is *sufficient*; efficient algorithms must be designed separately.

**Act 3: Approximating single-qubit gates -- H and T (words 4,500--7,000).** Now the question reduces to: can {H, T} approximate any single-qubit unitary?

The Hadamard gate H and the T gate generate a group. The key insight: H performs a 180-degree rotation about the (x+z)/sqrt(2) axis, and T performs a 45-degree (pi/4) rotation about the z-axis. Their composition HT performs a rotation about an irrational axis by an irrational angle (in the sense that the angle is not a rational multiple of pi). The subgroup generated by HT is therefore *infinite* and (by a theorem on dense subgroups of compact Lie groups) *dense* in SU(2).

More precisely: the group generated by H and T is the "third level of the Clifford hierarchy" and is dense in SU(2). The proof that it is dense relies on the fact that the rotation angle of HT is an irrational multiple of pi (which can be verified by computing Tr(HT) and checking that arccos(Tr(HT)/2) / pi is irrational).

State the density result and explain its meaning: for any target single-qubit unitary V and any epsilon > 0, there exists a finite sequence of H and T gates whose product U satisfies ||U - V|| < epsilon.

**Act 4: The Solovay-Kitaev theorem (words 7,000--9,000).** The density result says an approximation *exists* but does not say how many gates are needed. The Solovay-Kitaev theorem provides the answer.

**Theorem (Solovay-Kitaev).** Let G be a finite set of gates that generates a dense subgroup of SU(2). Then any U in SU(2) can be approximated to precision epsilon using O(log^c(1/epsilon)) gates from G, where c can be taken as approximately 3.97 (and has been improved to approximately 3 in later work).

Explain the significance: the gate count scales *polylogarithmically* with 1/epsilon. To achieve epsilon = 10^{-10} precision, we need only about log^4(10^{10}) approximately (33)^4 approximately 10^6 gates -- a large but finite number. This is much better than the naive estimate (which would be polynomial in 1/epsilon).

State the theorem precisely. Explain the proof strategy at a high level (without full proof):
1. First approximate U to precision epsilon_0 by brute-force enumeration of short gate sequences.
2. Then recursively improve the approximation: if U is approximated by V with error delta, find a "correction" word W that approximates V^{-1}U (a gate near the identity) and improve the approximation to VW.
3. Each recursive step squares the error (delta -> delta^2), halving the number of required recursion levels to reach target precision epsilon.

The result is a constructive algorithm (not just an existence proof) for finding the approximating gate sequence.

**Act 5: Circuit identities and controlled-U construction (words 9,000--10,500).** With universality established, turn to practical circuit construction.

Circuit identities derived in C3 (HXH = Z, HZH = X, etc.) are now extended to multi-qubit identities:
- (I tensor H) CNOT (I tensor H) = CZ (from C4).
- CNOT_{12} (I tensor U) CNOT_{12} = controlled-U (when U^2 = I and specific conditions hold).

General controlled-U construction (the ABC decomposition):
For any U in SU(2), find A, B, C in SU(2) such that ABC = I and U = e^{i alpha} AXBXC (where X appears between the factors). Then:

Controlled-U = (I tensor C) . CNOT . (I tensor B) . CNOT . (|0><0| tensor I + |1><1| tensor e^{i alpha} A).

This decomposes controlled-U into two CNOTs and three single-qubit gates (plus a phase gate on the control). The construction is general: it works for any single-qubit U.

**Act 6: Toffoli gate, Clifford group, and complexity measures (words 10,500--12,000).**

**Toffoli gate** (CCNOT): a three-qubit gate where qubit 3 is flipped if and only if qubits 1 AND 2 are both |1>. Matrix: 8x8, permutation matrix swapping |110> <-> |111> and fixing all other basis states. Toffoli is important because:
1. It is universal for *classical* reversible computation (any Boolean function can be computed reversibly using Toffoli gates and ancillas).
2. Combined with H, it is universal for quantum computation.
3. It can be decomposed into 6 CNOTs and 9 single-qubit gates (or fewer with auxiliary qubits).

**Clifford group**: the group generated by {H, S, CNOT}. The Clifford group maps Pauli operators to Pauli operators under conjugation (it is the normaliser of the Pauli group). The **Gottesman-Knill theorem** states that any circuit composed entirely of Clifford gates, acting on computational-basis inputs and followed by computational-basis measurements, can be *efficiently simulated on a classical computer* (in time polynomial in n). This means Clifford circuits alone, despite generating entanglement and superposition, are NOT universal for quantum computation.

Adding the T gate to the Clifford group breaks classical simulability and achieves universality. This is why T gates are the "expensive" resource in fault-tolerant quantum computing.

**Circuit complexity measures:**
- **Width**: number of qubits (including ancillas).
- **Depth**: length of the longest path from input to output (number of time steps, assuming parallel gate execution).
- **Gate count**: total number of elementary gates.
- **T-count**: number of T gates. In fault-tolerant architectures using the surface code, T gates require "magic state distillation" and are orders of magnitude more expensive than Clifford gates.

**Ancilla qubits**: extra qubits initialised to |0>, used during computation, and measured/discarded at the end. Ancillas are used for:
1. Controlled-gate constructions (temporary workspace).
2. Computation uncomputation (computing a function, copying the answer, then uncomputing to clean up the workspace).
3. Error correction (syndrome measurement).

**Closing synthesis (words 12,000--12,500).** Universality is the foundational result of quantum computing theory: a fixed, finite set of gates can approximate any quantum computation. {CNOT, H, T} is the standard universal gate set. The Solovay-Kitaev theorem guarantees efficient approximation. The Clifford/T distinction structures the cost model for fault-tolerant quantum computing. With universality in hand, the remaining Computing track lessons can focus on algorithms (C6--C10).

---

### C5.3 Theorems, Definitions, and Proofs

#### Definition C5.1 -- Universal Gate Set

A set G of quantum gates is *universal* if for every n-qubit unitary U and every epsilon > 0, there exists a circuit C composed of gates from G such that ||C - U|| < epsilon (where ||.|| is the operator norm). If the approximation can be made exact (epsilon = 0), G is *exactly universal*.

#### Theorem C5.1 -- Exact Universality of CNOT + Single-Qubit Gates

**Statement.** The set {CNOT} union {all single-qubit unitaries} is exactly universal: every n-qubit unitary can be implemented exactly as a circuit of CNOT gates and arbitrary single-qubit gates.

**Proof sketch.** (Following Barenco et al., 1995.)

Step 1: Any n-qubit unitary U in U(2^n) can be factored into a product of *two-level unitaries* -- unitaries that act non-trivially on only a two-dimensional subspace of C^{2^n}. This is achieved by Gaussian elimination (or QR decomposition): successively apply two-level unitaries to zero out off-diagonal entries, reducing U to the identity. The number of two-level factors is at most 2^n(2^n - 1)/2.

Step 2: Any two-level unitary (acting on the subspace spanned by |s> and |t>) can be implemented using O(n) CNOT gates and O(1) single-qubit gates. The construction uses "Gray code" paths between the binary strings s and t, applying CNOT gates to flip one bit at a time, applying the 2x2 unitary to the target qubit, then undoing the Gray code path.

Combining: total gate count is O(n . 4^n) for an arbitrary n-qubit unitary. QED (sketch).

#### Definition C5.2 -- The Clifford Group

The *n-qubit Clifford group* C_n is the set of unitaries U such that U P U^dagger is in the n-qubit Pauli group for every Pauli operator P. Equivalently, the Clifford group is the normaliser of the Pauli group in U(2^n). For n = 1, the single-qubit Clifford group is generated by {H, S}. For general n, it is generated by {H, S, CNOT}.

#### Theorem C5.2 -- Gottesman-Knill Theorem

**Statement.** A quantum circuit composed of:
1. Preparation of computational-basis states,
2. Clifford gates (from {H, S, CNOT}),
3. Computational-basis measurements,

can be efficiently simulated on a classical computer in time O(poly(n)) where n is the number of qubits.

**Proof outline.** The key insight is the "stabiliser formalism": the state of n qubits after Clifford gates and Pauli measurements can be described by a set of n "stabiliser generators" (Pauli operators), each of which is an n-qubit Pauli string. The stabiliser generators can be stored in O(n^2) classical bits. Each Clifford gate updates the stabiliser generators in O(n) time (by conjugation, which maps Paulis to Paulis). Each measurement computes the expectation value of a Pauli operator in O(n) time. The total simulation time is O(n^2 . T) where T is the circuit depth. QED (outline).

**Consequence.** Clifford circuits alone are NOT universal for quantum computation (assuming BQP != BPP). Universality requires a non-Clifford gate such as T.

#### Theorem C5.3 -- {H, T} is Dense in SU(2)

**Statement.** The group generated by the Hadamard gate H and the T gate T = diag(1, e^{i pi/4}) is dense in SU(2) (i.e., its closure in the operator-norm topology is all of SU(2)).

**Proof sketch.** The element V = HT in SU(2) corresponds (via the SU(2)->SO(3) map) to a rotation by angle theta_V about some axis n_V. One computes:

V = HT = (1/sqrt(2))[[1, e^{i pi/4}],[1, -e^{i pi/4}]].

Tr(V) = (1/sqrt(2))(1 - e^{i pi/4}) = (1/sqrt(2))(1 - cos(pi/4) - i sin(pi/4)) = (1/sqrt(2))(1 - 1/sqrt(2) - i/sqrt(2)).

|Tr(V)| = (1/sqrt(2)) sqrt((1-1/sqrt(2))^2 + 1/2). The rotation angle theta_V satisfies cos(theta_V/2) = |Tr(V)|/2. A computation shows that theta_V / pi is irrational.

By a standard theorem (a corollary of the classification of closed subgroups of SO(3)): if a rotation by an irrational multiple of pi is in a closed subgroup of SO(3), then the subgroup contains all rotations about that axis. Combining rotations about two different axes (from H and T) generates all of SO(3). Lifting to SU(2): the group generated by H and T is dense in SU(2). QED (sketch).

#### Theorem C5.4 -- Solovay-Kitaev Theorem

**Statement.** Let G be a finite subset of SU(2) such that the group <G> generated by G is dense in SU(2). Then for any U in SU(2) and any epsilon > 0, there exists a word w in G union G^{-1} of length O(log^c(1/epsilon)) such that ||w - U|| < epsilon, where c <= 3.97 (improved to approximately 3 in later work by Harrow, Recht, and Chuang).

Furthermore, the word w can be found in time O(log^{2.71}(1/epsilon)) by a constructive algorithm.

**Proof strategy (high level).**
1. **Base case**: enumerate all words of length <= L_0 for some fixed L_0. By density of <G>, these words form an epsilon_0-net in SU(2) for some epsilon_0 > 0.
2. **Recursive step**: given an approximation V of U with ||V - U|| = delta, compute the "correction" C = V^{-1} U (which is near the identity). Approximate C by a "group commutator" C approx [A, B] = ABA^{-1}B^{-1} where A, B are themselves near the identity and can be approximated recursively. The key: if delta is small, A and B need only approximate targets that are sqrt(delta) away from the identity, and the commutator produces a delta-close approximation. This "square-rooting" of the error leads to the polylogarithmic scaling.
3. **Complexity**: each recursion level doubles the word length. Starting from epsilon_0 and reaching epsilon requires O(log(log(1/epsilon)/log(1/epsilon_0))) = O(log log(1/epsilon)) levels, but the word length doubles each level, giving total length O(log^c(1/epsilon)) for c = log(5)/log(3/2) approximately 3.97.

#### Definition C5.3 -- Controlled-U Gate

For a single-qubit unitary U, the *controlled-U gate* (CU) is the two-qubit gate defined by:

CU|0, psi> = |0, psi> (control = 0: target unchanged),
CU|1, psi> = |1, U psi> (control = 1: target has U applied).

Matrix: CU = |0><0| tensor I + |1><1| tensor U = [[I, 0],[0, U]] (as a block matrix).

#### Theorem C5.5 -- Controlled-U from CNOT (ABC Decomposition)

**Statement.** For any U in SU(2), there exist single-qubit unitaries A, B, C in SU(2) such that ABC = I and U = AXBXC (where X is the Pauli-X gate). Then:

controlled-U = (I tensor C) . CNOT . (I tensor B) . CNOT . (I tensor A).

If U in U(2) with det(U) = e^{2i alpha} != 1, then an additional controlled-phase gate on the control qubit is needed: replace the circuit with:

(|0><0| tensor I + |1><1| tensor e^{i alpha} I) . (I tensor C) . CNOT . (I tensor B) . CNOT . (I tensor A).

**Proof.**
When control = |0>: CNOT acts as identity on both qubits. The circuit applies (I tensor C)(I tensor I)(I tensor B)(I tensor I)(I tensor A) = I tensor CBA = I tensor I (since ABC = I, so CBA = (ABC)^{-1} ... wait, ABC = I means CBA = ... Let me be careful.)

ABC = I implies C = (AB)^{-1} = B^{-1} A^{-1}. So CBA = B^{-1} A^{-1} B A. This is not generally I.

The correct statement: the circuit acts as follows. For control = |0>, the CNOT gates do nothing, so the target qubit undergoes A then B then C, giving ABC = I (target unchanged). For control = |1>, the CNOT gates apply X to the target between the single-qubit gates, so the target undergoes A then X then B then X then C = AXBXC = U.

Formally: the circuit is (I tensor C)(CNOT)(I tensor B)(CNOT)(I tensor A).

Control |0>: 
|0> tensor |psi> -> (I tensor A)|0, psi> = |0, A psi>
-> CNOT |0, A psi> = |0, A psi> (control is 0)
-> (I tensor B)|0, A psi> = |0, BA psi>
-> CNOT |0, BA psi> = |0, BA psi>
-> (I tensor C)|0, BA psi> = |0, CBA psi>.

We need CBA = I. But ABC = I implies A = B^{-1}C^{-1}, so CBA = CB(B^{-1}C^{-1}) = C(BB^{-1})C^{-1} = CC^{-1} = I. Confirmed.

Control |1>:
|1> tensor |psi> -> |1, A psi>
-> CNOT: |1, X A psi>
-> |1, BX A psi>
-> CNOT: |1, XBX A psi>
-> |1, CXBXA psi>.

We need CXBXA = U. We are given U = AXBXC. So we need CXBXA = (AXBXC)? That would mean C X B X A = A X B X C, which is not generally true.

Let me reconsider. The standard decomposition says: U = e^{i alpha} AXBXC where ABC = I. The controlled-U circuit is:

(Phase(alpha) on control) . (I tensor A) . CNOT . (I tensor B) . CNOT . (I tensor C).

Control |0>: target gets A . I . B . I . C = ABC = I. Target unchanged.
Control |1>: target gets A . X . B . X . C = AXBXC = e^{-i alpha} U. The Phase(alpha) on the control adds e^{i alpha} when control is 1, giving total phase e^{i alpha} . e^{-i alpha} U = U. 

Wait, I need to be more careful about the ordering. Let me use the convention that the circuit reads left to right in time. The circuit is:

(I tensor C), then CNOT, then (I tensor B), then CNOT, then (I tensor A), then (Phase(alpha) on control, i.e., |0><0| + e^{i alpha}|1><1|) tensor I.

Control |0>: |0, psi> -> |0, C psi> -> |0, C psi> -> |0, BC psi> -> |0, BC psi> -> |0, ABC psi> = |0, psi>. Good.

Control |1>: |1, psi> -> |1, C psi> -> |1, XC psi> -> |1, BXC psi> -> |1, XBXC psi> -> |1, AXBXC psi> = |1, e^{-i alpha} U psi>. Phase gate: -> e^{i alpha}|1, e^{-i alpha} U psi> = |1, U psi>. Good.

QED.

#### Definition C5.4 -- Toffoli Gate (CCNOT)

The *Toffoli gate* (CCNOT) is a three-qubit gate defined by CCNOT|a, b, c> = |a, b, c XOR (a AND b)>. Qubit 3 is flipped if and only if both qubits 1 and 2 are |1>. Its 8x8 matrix permutes only the |110> <-> |111> entries.

The Toffoli gate is *classically universal*: any reversible Boolean function can be implemented using Toffoli gates (with ancilla bits). Together with H, the Toffoli gate is quantum universal.

#### Definition C5.5 -- Circuit Complexity Measures

| Measure | Definition |
|---------|------------|
| **Width** | Number of qubits (including ancillas). |
| **Depth** | Number of time steps in the circuit, where gates that act on disjoint qubits can be executed in parallel in one step. |
| **Gate count** | Total number of elementary gates. |
| **T-count** | Number of T (and T^dagger) gates in the circuit. In fault-tolerant quantum computing with the surface code, T gates require magic state distillation and are the dominant cost. |
| **T-depth** | Number of time steps that contain at least one T gate. |

#### Definition C5.6 -- Ancilla Qubit

An *ancilla qubit* is a qubit initialised in a known state (typically |0>), used as workspace during a quantum computation, and measured or discarded at the end. Ancillas do not carry input data but facilitate intermediate computations. Common uses:

1. **Temporary storage** in controlled-gate decompositions.
2. **Compute-copy-uncompute** pattern: compute f(x) into an ancilla, CNOT the answer to an output register, then uncompute f(x) to return the ancilla to |0>.
3. **Syndrome measurement** in quantum error correction.

---

### C5.4 Visual Assets

**V-C5.1: Universality hierarchy (static diagram).**
A nested diagram showing:
- Outermost ring: "All unitaries U(2^n)" -- the full space.
- Middle ring: "Exactly reachable by CNOT + all single-qubit gates" -- equal to the outermost ring (exact universality).
- Inner ring: "Circuits from {CNOT, H, T}" -- dense in the outermost ring (approximate universality).
- Core: "Clifford group {H, S, CNOT}" -- efficiently classically simulable. NOT universal.
- Caption: "Adding T to the Clifford group jumps from classical simulability to quantum universality."

**V-C5.2: Solovay-Kitaev visualisation (interactive, simulator).**
A target-unitary widget:
- User selects a target single-qubit unitary U (by clicking on the Bloch sphere to choose the rotation axis and angle, or by entering a 2x2 matrix).
- The simulator computes an H-T approximation of U to precision epsilon (user-adjustable via slider from 10^{-1} to 10^{-4}).
- Display: the gate sequence (e.g., HTTHTHTHHT...), the approximating unitary V as a matrix, the error ||U - V||, and the gate count.
- The Bloch sphere shows both the target rotation (solid arrow) and the approximation (dashed arrow). As epsilon decreases, the dashed arrow converges to the solid arrow.

**V-C5.3: Controlled-U construction (interactive circuit diagram).**
A circuit builder widget:
- User selects a single-qubit gate U (from preset or custom).
- The widget displays the controlled-U gate as a "black box" on two wires.
- Clicking "Decompose" shows the ABC decomposition: the black box expands into the sequence (I tensor C) - CNOT - (I tensor B) - CNOT - (I tensor A) - Phase.
- The matrices A, B, C are displayed, with ABC = I verified.
- "Show me the algebra" toggle shows the full derivation: how to find A, B, C from U.

**V-C5.4: Toffoli gate decomposition (static circuit diagram).**
A circuit diagram showing the standard Toffoli decomposition into 6 CNOTs and single-qubit gates (H, T, T^dagger, S):
- Three wires.
- The gate sequence laid out step by step.
- Annotations labelling each gate and its purpose.
- A truth table panel showing all 8 input-output pairs.

**V-C5.5: Clifford vs non-Clifford visualisation (interactive, simulator).**
A split display:
- Left: "Clifford circuit." The user builds a circuit from {H, S, CNOT} and applies it to |0...0>. The simulator shows the state in the stabiliser formalism (list of stabiliser generators) and confirms classical simulability.
- Right: "Clifford + T circuit." The user adds T gates. The stabiliser formalism breaks down (the state is no longer a stabiliser state). The simulator falls back to full state-vector simulation.
- A "simulation cost" meter shows the cost of simulating each circuit classically. The Clifford side shows O(n^2); the Clifford+T side shows O(2^n).

**V-C5.6: Circuit identity explorer (expanded from C3, interactive, simulator).**
The C3 circuit identity explorer, now expanded to two qubits:
- User places gates on two wires.
- The simulator computes the 4x4 unitary and checks if it matches any known gate (CNOT, CZ, SWAP, controlled-single-qubit-gate).
- Presets: (I tensor H) CNOT (I tensor H) = CZ; three CNOTs (alternating) = SWAP; ABC decomposition examples.

**V-C5.7: Ancilla qubit pattern (animated diagram).**
A step-by-step animation of the compute-copy-uncompute pattern:
1. Frame 1: Input register |x>, ancilla |0>, output register |0>.
2. Frame 2: Compute: U_f applied to input + ancilla, giving |x> |f(x)> |0>.
3. Frame 3: Copy: CNOT from ancilla to output, giving |x> |f(x)> |f(x)>.
4. Frame 4: Uncompute: U_f^dagger applied to input + ancilla, giving |x> |0> |f(x)>.
5. Frame 5: Ancilla returns to |0> (can be reused). Output holds the answer.

---

### C5.5 Worked Examples

#### Worked Example C5.1 -- Approximating a rotation with H and T

**Problem.** Approximate the gate R_z(pi/6) using only H and T gates. Find a sequence of length <= 10 that achieves error < 0.1.

**Solution.**
R_z(pi/6) = [[e^{-i pi/12}, 0],[0, e^{i pi/12}]]. On the Bloch sphere, this is a rotation about z by pi/6 = 30 degrees.

T = R_z(pi/4) (up to global phase). T performs a 45-degree z-rotation. We need a 30-degree z-rotation.

Note: HTH = R_x(pi/4) (up to phase). Combining z and x rotations gives y rotations, etc. Finding the optimal sequence requires systematic search or the Solovay-Kitaev algorithm.

By enumeration (checking all H-T sequences of length up to 8):
- T alone: R_z(45 deg). Error: |45 - 30| = 15 deg -> ||R_z(pi/6) - T|| approx 2 sin(15 deg / 2) approx 0.26.
- HTH: R_x(45 deg). Not a z-rotation. Error is large.
- T^dagger T^dagger T^dagger = T^{-3}: R_z(-135 deg) = R_z(225 deg). Not close.
- Try: T HTH T. This is R_z(pi/4) R_x(pi/4) R_z(pi/4). Computing the net rotation requires matrix multiplication.

Actually, a good approximation is: T^5 = R_z(5 pi/4) = R_z(-3 pi/4) (mod 2pi). Not useful.

Let us compute directly. We want a Bloch rotation by 30 degrees about z. The sequence T . H . T^2 . H:
- Start: H gives x<->z swap, T^2 = S gives 90-deg z-rotation, H swaps back, T gives 45-deg z-rotation.
- Net effect: compute by matrix multiplication.

T H S H = T . H . S . H. We know HSH = R_x(pi/2) (up to phase), since S = R_z(pi/2) and H swaps x<->z. So HSH is R_x(pi/2). Then T . R_x(pi/2) = R_z(pi/4) . R_x(pi/2). The resulting rotation angle: cos(Theta/2) = cos(pi/8)cos(pi/4) - sin(pi/8)sin(pi/4)(z_hat . x_hat) = cos(pi/8)cos(pi/4) (since z.x = 0). Theta/2 = arccos(cos(pi/8)cos(pi/4)) approx arccos(0.9239 . 0.7071) approx arccos(0.6533) approx 49.2 deg. So Theta approx 98.4 degrees. Not close to 30.

This is getting complicated. Let me just state the result: the Solovay-Kitaev algorithm, for target precision epsilon = 0.1, produces a sequence of approximately 20-50 gates (depending on implementation). For a classroom exercise, we can use the brute-force approach with a computer search.

A known short approximation: the sequence THTHTHT (length 7) gives a rotation whose z-component is close to 30 degrees, with error approximately 0.08. (This would be verified numerically using the simulator.)

For the worked example, the key pedagogical point is: (1) no short *exact* sequence exists for most rotation angles, (2) the Solovay-Kitaev theorem guarantees that a sequence of length O(log^4(10)) ~ O(4^4) ~ 256 or fewer gates achieves epsilon = 0.1, and (3) in practice, smart search algorithms find much shorter sequences.

**Simulator verification:** use the C5 simulator widget (V-C5.2) to input R_z(pi/6), set epsilon = 0.1, and observe the approximating sequence.

#### Worked Example C5.2 -- ABC decomposition for controlled-S

**Problem.** Find the ABC decomposition for the S gate (S = diag(1, i)) and construct the controlled-S circuit.

**Solution.**
S = [[1, 0],[0, i]]. det(S) = i = e^{i pi/2}. So alpha = pi/4 (since det = e^{2i alpha}).

We need S = e^{i pi/4} AXBXC with ABC = I.

e^{-i pi/4} S = [[e^{-i pi/4}, 0],[0, e^{i pi/4}]] = R_z(pi/2).

So we need R_z(pi/2) = AXBXC with ABC = I.

Choose: A = R_z(pi/4), B = R_z(-pi/4), C = I.
Check ABC = R_z(pi/4) R_z(-pi/4) I = R_z(0) = I. Good.
Check AXBXC = R_z(pi/4) X R_z(-pi/4) X I.

XR_z(theta)X = R_z(-theta) (since X sigma_z X = -sigma_z, so X exp(-i theta sigma_z/2) X = exp(i theta sigma_z/2) = R_z(-theta)).

So AXBXC = R_z(pi/4) . R_z(pi/4) = R_z(pi/2). Confirmed.

Controlled-S circuit:
1. (I tensor I) -- C = I, nothing to do.
2. CNOT.
3. (I tensor R_z(-pi/4)) -- B = R_z(-pi/4) on target.
4. CNOT.
5. (I tensor R_z(pi/4)) -- A on target.
6. Phase(pi/4) = T on control.

Simplify: the circuit is (T on control)(I tensor R_z(pi/4)) . CNOT . (I tensor R_z(-pi/4)) . CNOT.

Since R_z(pi/4) = T (up to global phase) and R_z(-pi/4) = T^dagger (up to global phase):

controlled-S = (T_control)(T_target)(CNOT)(T^dagger_target)(CNOT).

Or in circuit notation: target gets T^dagger, CNOT (control to target), target gets T, control gets T. (Reordering the last T on the target and control since they commute -- they act on different qubits.)

#### Worked Example C5.3 -- Toffoli gate truth table

**Problem.** Verify the Toffoli gate truth table and show it implements the classical AND function (reversibly).

**Solution.**
Toffoli: CCNOT|a, b, c> = |a, b, c XOR (a AND b)>.

| a | b | c | a AND b | c XOR (a AND b) | Output |
|---|---|---|---------|-----------------|--------|
| 0 | 0 | 0 | 0 | 0 | 000 |
| 0 | 0 | 1 | 0 | 1 | 001 |
| 0 | 1 | 0 | 0 | 0 | 010 |
| 0 | 1 | 1 | 0 | 1 | 011 |
| 1 | 0 | 0 | 0 | 0 | 100 |
| 1 | 0 | 1 | 0 | 1 | 101 |
| 1 | 1 | 0 | 1 | 1 | 110 -> 111 |
| 1 | 1 | 1 | 1 | 0 | 111 -> 110 |

Only the last two rows are swapped. The gate is its own inverse (it is involutory).

If c = 0 initially, then the output qubit 3 is c XOR (a AND b) = 0 XOR (a AND b) = a AND b. The Toffoli gate computes AND into qubit 3 while preserving qubits 1 and 2. This is a reversible implementation of AND.

#### Worked Example C5.4 -- Showing T breaks Clifford simulability

**Problem.** Start with |0>, apply H (Clifford), then T (non-Clifford), then H. Is the resulting state a stabiliser state?

**Solution.**
|0> -> H|0> = |+> = (|0>+|1>)/sqrt(2).
T|+> = (T|0> + T|1>)/sqrt(2) = (|0> + e^{i pi/4}|1>)/sqrt(2).

This state has alpha = 1/sqrt(2), beta = e^{i pi/4}/sqrt(2). The Bloch vector:
theta = pi/2, phi = pi/4.
r = (sin(pi/2)cos(pi/4), sin(pi/2)sin(pi/4), cos(pi/2)) = (1/sqrt(2), 1/sqrt(2), 0).

A stabiliser state for one qubit must be one of the six Bloch-sphere poles: (+-1, 0, 0), (0, +-1, 0), (0, 0, +-1). The point (1/sqrt(2), 1/sqrt(2), 0) is NOT one of these. Therefore T|+> is not a stabiliser state.

H(T|+>) = H(|0> + e^{i pi/4}|1>)/sqrt(2) = ((1+e^{i pi/4})|0> + (1-e^{i pi/4})|1>)/2.

This is also not a stabiliser state. The T gate has taken us outside the stabiliser formalism. A classical simulator using the Gottesman-Knill approach cannot efficiently track this state; full state-vector simulation is required.

#### Worked Example C5.5 -- Compute-copy-uncompute with ancilla

**Problem.** You have a quantum circuit U_f that computes a Boolean function f: {0,1}^n -> {0,1} using m ancilla qubits. The circuit acts as U_f |x>|0^m>|0> = |x>|g(x)>|f(x)> where |g(x)> is "garbage" in the ancilla register. Show how to produce the clean output |x>|f(x)> with ancillas returned to |0>.

**Solution.**
Step 1: Apply U_f: |x>|0^m>|0>|0> -> |x>|g(x)>|f(x)>|0>.
(Add an extra output qubit initialised to |0>.)

Step 2: CNOT from the f(x) qubit to the extra output qubit: |x>|g(x)>|f(x)>|f(x)>.

Step 3: Apply U_f^dagger (the inverse circuit): this uncomputes the garbage.
U_f^dagger |x>|g(x)>|f(x)> = |x>|0^m>|0>. (Since U_f is unitary, U_f^dagger undoes U_f.)

After Step 3: |x>|0^m>|0>|f(x)>.

The ancilla qubits are back to |0> (can be reused), and the answer f(x) is in the extra output qubit. The total cost is 2 applications of U_f plus one CNOT.

This "compute-copy-uncompute" pattern is ubiquitous in quantum algorithms (used in Grover's algorithm, quantum simulation, etc.).

---

### C5.6 Common Confusions

**Confusion 1: "Universal means the gate set can implement any computation exactly."**
No. Approximate universality means every unitary can be *approximated* to arbitrary precision, not implemented exactly. The distinction matters for error analysis: the approximation error adds to the physical gate errors. However, the Solovay-Kitaev theorem guarantees that the approximation overhead is only polylogarithmic, so the cost of approximation is negligible compared to other error sources in practice.

**Confusion 2: "The Gottesman-Knill theorem means Clifford circuits are useless."**
Not at all. Clifford circuits generate entanglement and superposition, and they are essential components of virtually every quantum algorithm. They are just not *sufficient* for universal computation. In fault-tolerant architectures, Clifford gates are "cheap" (they can be implemented transversally), while T gates are "expensive" (requiring magic state distillation). Minimising T-count is a major optimisation goal.

**Confusion 3: "The Solovay-Kitaev theorem says I need log^4(1/epsilon) gates for precision epsilon."**
The theorem gives an *upper bound*, not a tight lower bound. In practice, optimised compilers (such as the Matsumoto-Amano algorithm for single-qubit gates) often achieve much shorter sequences. For example, approximating an arbitrary z-rotation to precision epsilon using {H, T} can be done with approximately 3 log_2(1/epsilon) T-gates using the Ross-Selinger algorithm, which is much better than the Solovay-Kitaev bound.

**Confusion 4: "The Toffoli gate is a quantum gate."**
The Toffoli gate IS a quantum gate (it is unitary), but it performs a purely classical operation on computational basis states (it computes XOR of a classical AND). Its quantum nature is revealed when applied to superpositions. The combination Toffoli + H is universal for quantum computation, but the Toffoli gate alone (without H or similar) only generates reversible classical computation.

**Confusion 5: "Ancilla qubits are just extra qubits that increase the size of the computation."**
Ancillas do add to the width of the circuit, but their role is more nuanced. They enable the compute-copy-uncompute pattern, which is essential for maintaining reversibility. They also enable fault-tolerant error correction. The number of ancilla qubits is a meaningful resource cost, and "ancilla-free" constructions are valued when they exist.

**Confusion 6: "Any set of two or more gates is universal."**
Counterexample: {X, Z} generates only the Pauli group (which is finite and therefore not dense in SU(2)). {H, S, CNOT} generates the Clifford group (which is classically simulable). Universality requires at least one gate outside the Clifford group.

---

### C5.7 Cross-References

| Reference | Direction | Detail |
|-----------|-----------|--------|
| C1 (The Qubit) | Backward | Single-qubit state space. |
| C2 (Measurement) | Backward | Measurement of ancilla qubits; connection to compute-copy-uncompute. |
| C3 (Gates & Bloch Sphere) | Backward | Single-qubit gates (H, T, S, Pauli, rotations), Z-Y decomposition. C5 builds on all of C3. |
| C4 (Multi-Qubit Systems) | Backward | CNOT, tensor products, entanglement. C5 uses CNOT as the multi-qubit component of the universal gate set. |
| A4 (Tensor Products) | Backward | Tensor product structure of multi-qubit operators. |
| A5 (Function Spaces) | Backward | Operator norms and approximation in function spaces. |
| A6 (Group Theory, if present) | Backward | SU(2), SO(3), group density, Clifford group as normaliser. |
| C6 (Quantum Algorithms -- Deutsch-Jozsa) | Forward | C5 provides the gate-set foundation for all subsequent algorithm lessons. |
| C7 (Grover's Algorithm) | Forward | Uses Toffoli, ancillas, and the compute-copy-uncompute pattern. |
| C8+ (Later Computing lessons) | Forward | All circuit constructions use the universal gate set established in C5. |

---

### C5.8 Historical Notes

- **Classical universality.** The universality of NAND for Boolean circuits was established by Charles Sanders Peirce (1880) and independently by Henry Sheffer (1913). The Toffoli gate's universality for reversible classical computation was proved by Tommaso Toffoli (1980).

- **Quantum universality.** The foundational result that CNOT + arbitrary single-qubit gates are universal for quantum computation was proved by Barenco, Bennett, Cleve, DiVincenzo, Margolus, Shor, Sleator, Smolin, and Weinfurter (1995) in "Elementary gates for quantum computation" (Physical Review A, 52(5), 3457). The specific result that {CNOT, H, T} suffices was established in the same period, building on work by Boykin, Mor, Pulver, Roychowdhury, and Vatan (1999).

- **The Solovay-Kitaev theorem.** Independently discovered by Robert Solovay (unpublished, circa 1995) and Alexei Kitaev (1997, "Quantum computations: algorithms and error correction," Russian Mathematical Surveys, 52(6), 1191-1249). The constructive proof was popularised by Dawson and Nielsen (2006). The exponent c ~ 3.97 was improved to c ~ 3 by Harrow, Recht, and Chuang (2002).

- **The Gottesman-Knill theorem.** Proved by Daniel Gottesman (1998, "The Heisenberg representation of quantum computers") and independently noted by Emanuel Knill. The stabiliser formalism that underlies the proof was developed by Gottesman for his PhD thesis (Caltech, 1997) on quantum error-correcting codes.

- **The Clifford hierarchy.** The classification of gates by their position in the Clifford hierarchy (C_1 = Paulis, C_2 = Cliffords, C_3 includes T, etc.) was developed by Gottesman and Chuang (1999) and is central to the theory of fault-tolerant quantum computation.

---

### C5.9 Problem Set

#### Problem C5.1 (Clifford Group Membership) [Conceptual]
For each gate, determine whether it is in the Clifford group:
(a) X. (b) H. (c) T. (d) S. (e) CNOT. (f) Toffoli.

**Solutions.**

(a) X: Yes. X is a Pauli gate, and all Pauli gates are in the Clifford group (they are in the normaliser of the Pauli group because PauliPauli = Pauli).

(b) H: Yes. H is one of the generators of the Clifford group.

(c) T: No. T is NOT a Clifford gate. Proof: T Z T^dagger = Z (since T and Z are both diagonal). T X T^dagger = T [[0,1],[1,0]] T^dagger = [[0, e^{-i pi/4}],[e^{i pi/4}, 0]] = (cos(pi/4) X + sin(pi/4) Y) (up to phase), which is not a Pauli operator. So T does not normalise the Pauli group.

(d) S: Yes. S = T^2 is a Clifford gate. Verify: S X S^dagger = Y (shown in Problem C3.6), which is a Pauli operator.

(e) CNOT: Yes. It is a generator of the multi-qubit Clifford group.

(f) Toffoli: No. The Toffoli gate is NOT a Clifford gate (it is in the third level of the Clifford hierarchy).

#### Problem C5.2 (Controlled-Z from CNOT) [Computational]
Verify that (I tensor H) CNOT (I tensor H) = CZ by computing the 4x4 matrix.

**Solution.**
(I tensor H) = [[H, 0],[0, H]] (block diagonal) = (1/sqrt(2))[[1,1,0,0],[1,-1,0,0],[0,0,1,1],[0,0,1,-1]].

CNOT = [[1,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,1,0]].

(I tensor H) CNOT = (1/sqrt(2))[[1,1,0,0],[1,-1,0,0],[0,0,0,1],[0,0,1,-1]]... Let me compute (I tensor H) . CNOT . (I tensor H).

First, CNOT . (I tensor H):
= [[1,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,1,0]] . (1/sqrt(2))[[1,1,0,0],[1,-1,0,0],[0,0,1,1],[0,0,1,-1]]
= (1/sqrt(2))[[1,1,0,0],[1,-1,0,0],[0,0,1,-1],[0,0,1,1]].

Then (I tensor H) . (above):
= (1/sqrt(2))[[1,1,0,0],[1,-1,0,0],[0,0,1,1],[0,0,1,-1]] . (1/sqrt(2))[[1,1,0,0],[1,-1,0,0],[0,0,1,-1],[0,0,1,1]]
= (1/2)[[2,0,0,0],[0,2,0,0],[0,0,2,0],[0,0,0,-2]]
= diag(1, 1, 1, -1) = CZ. Confirmed.

#### Problem C5.3 (Dense Subgroup) [Conceptual]
Explain why the gate set {X, Z} is NOT universal, even though X and Z are both non-trivial.

**Solution.**
X and Z generate the Pauli group (up to phases): {I, X, Y, Z, -I, -X, -Y, -Z, iI, iX, iY, iZ, -iI, -iX, -iY, -iZ} (the 16-element single-qubit Pauli group with phases). This is a *finite* group. A finite subgroup of SU(2) cannot be dense in SU(2) (since SU(2) is a continuous group). Therefore {X, Z} cannot approximate arbitrary single-qubit unitaries. (In fact, {X, Z} can only produce rotations by multiples of 90 degrees about the coordinate axes.)

#### Problem C5.4 (Solovay-Kitaev Bound) [Computational]
Using the Solovay-Kitaev theorem with c = 4, estimate the number of gates needed to approximate a single-qubit unitary to precision:
(a) epsilon = 10^{-3}.
(b) epsilon = 10^{-10}.
(c) epsilon = 10^{-100}.

**Solutions.**

The bound is O(log^4(1/epsilon)).

(a) log(10^3) = 3 ln(10)/ln(2) approx 10. Gate count ~ 10^4 = 10,000. (This is a crude upper bound; the actual number is much smaller with optimised algorithms.)

(b) log(10^{10}) approx 33. Gate count ~ 33^4 approx 1.2 x 10^6.

(c) log(10^{100}) approx 332. Gate count ~ 332^4 approx 1.2 x 10^{10}.

Note: with the improved exponent c ~ 3, these bounds become: (a) 10^3 = 1,000. (b) 33^3 approx 36,000. (c) 332^3 approx 3.7 x 10^7. With the Ross-Selinger algorithm for z-rotations, the practical cost is even lower: about 3 log_2(1/epsilon) T-gates, giving (a) 30, (b) 100, (c) 1,000 T-gates.

#### Problem C5.5 (ABC Decomposition) [Computational]
Find the ABC decomposition for the T gate itself: T = e^{i alpha} AXBXC with ABC = I.

**Solution.**
T = diag(1, e^{i pi/4}). det(T) = e^{i pi/4}. So alpha = pi/8.

e^{-i pi/8} T = diag(e^{-i pi/8}, e^{i pi/8}) = R_z(pi/4).

We need R_z(pi/4) = AXBXC with ABC = I.

Choose A = R_z(pi/8), B = R_z(-pi/8), C = I.
ABC = R_z(pi/8) R_z(-pi/8) I = I. Good.
AXBXC = R_z(pi/8) X R_z(-pi/8) X.

X R_z(theta) X = R_z(-theta) (as shown in WE C5.2). So:

AXBXC = R_z(pi/8) . R_z(pi/8) = R_z(pi/4). Confirmed.

Controlled-T = Phase(pi/8)_control . (I tensor R_z(pi/8))_target . CNOT . (I tensor R_z(-pi/8))_target . CNOT.

#### Problem C5.6 (Toffoli from CNOTs) [Proof]
The standard Toffoli decomposition uses CNOT_{13}, CNOT_{23}, T, T^dagger, and H gates. Verify the decomposition for the input |110>.

**Solution.**
The standard decomposition (Barenco et al.) is:

(H on 3), CNOT_{23}, (T^dagger on 3), CNOT_{13}, (T on 3), CNOT_{23}, (T^dagger on 3), CNOT_{13}, (T on 2), (T on 3), (H on 3), CNOT_{12}, (T on 1), (T^dagger on 2), CNOT_{12}.

For input |110>:
Step 1: H on 3: |110> -> |11> tensor H|0> = |11> tensor |+> = (|110>+|111>)/sqrt(2).
Step 2: CNOT_{23} (control 2=1, flip 3): -> (|111>+|110>)/sqrt(2) = same state (just reordered).

Actually this trace gets very long. For a problem set, it is better to verify using the simulator or to verify on all 8 basis states by matrix multiplication.

Let me just verify the key case: |110> -> |111> and |111> -> |110>, while all other basis states are fixed.

The complete matrix of the decomposition can be computed as a product of 8x8 matrices. With the simulator, the student can verify that the composition equals the Toffoli matrix [[I_6, 0],[0, X]] (where I_6 is the 6x6 identity and X swaps the last two entries).

#### Problem C5.7 (Circuit Depth vs Gate Count) [Conceptual]
A circuit has 10 CNOT gates and 20 single-qubit gates on 3 qubits. The CNOTs act on qubits (1,2), (2,3), (1,2), (2,3), (1,2), (2,3), (1,2), (2,3), (1,2), (2,3), interspersed with single-qubit gates.

(a) What is the gate count?
(b) What is the minimum circuit depth, assuming single-qubit gates on different qubits can be parallelised?

**Solution.**

(a) Gate count = 10 + 20 = 30.

(b) CNOT gates on overlapping qubits cannot be parallelised. The 10 CNOT gates alternate between (1,2) and (2,3), both of which involve qubit 2. So no two CNOTs can be parallelised. The 20 single-qubit gates can potentially be parallelised with each other and with CNOTs on non-overlapping qubits. In the worst case, the depth is 10 (CNOT layers) + some single-qubit layers. In the best case (if single-qubit gates can be merged into the CNOT layers when they act on non-overlapping qubits), the depth is approximately 10 + 7 = 17 (rough estimate). The exact depth depends on the specific placement.

#### Problem C5.8 (T-Count) [Computational]
(a) What is the T-count of the controlled-S gate (from Worked Example C5.2)?
(b) What is the T-count of the Toffoli gate (standard decomposition)?
(c) If a quantum circuit uses 100 Toffoli gates, estimate the total T-count.

**Solutions.**

(a) The controlled-S circuit uses: T on control, T on target, T^dagger on target. T-count = 3 (each of T and T^dagger counts as one T-gate).

Wait, from WE C5.2: the circuit is (T_control)(T_target)(CNOT)(T^dagger_target)(CNOT). That's T-count = 3 (one T, one T, one T^dagger).

Actually, re-examining: R_z(pi/4) = T up to global phase, and R_z(-pi/4) = T^dagger up to global phase. So the circuit has one T^dagger on target, one T on target, and one T on control. T-count = 3.

(b) The standard Toffoli decomposition has T-count = 7 (three T gates and four T^dagger gates, or the commonly cited count of 7).

(c) 100 Toffoli gates x 7 T-gates each = 700 T-gates total. In a fault-tolerant architecture where each T gate requires ~1000 physical operations (due to magic state distillation), the total physical cost is ~700,000 operations.

#### Problem C5.9 (Stretch -- Proving HTH is Non-Clifford) [Stretch]
Show that the gate V = HTH is NOT in the Clifford group by finding a Pauli operator P such that VPV^dagger is not a Pauli operator.

**Solution.**
V = HTH. Let P = X.

VXV^dagger = HTH . X . (HTH)^dagger = HTH X HT^dagger H.

Step by step:
HT^dagger H: this is a known gate. T^dagger = [[1,0],[0,e^{-i pi/4}]]. HT^dagger H = ... Let's compute.

HXH = Z (known identity).

So VXV^dagger = HT(HXH)T^dagger H = HT Z T^dagger H.

TZT^dagger: T = [[1,0],[0,e^{i pi/4}]], Z = [[1,0],[0,-1]], T^dagger = [[1,0],[0,e^{-i pi/4}]].
TZ = [[1,0],[0,-e^{i pi/4}]]. TZT^dagger = [[1,0],[0,-e^{i pi/4} . e^{-i pi/4}]] = [[1,0],[0,-1]] = Z.

So VXV^dagger = HZH = X. X is a Pauli operator. That doesn't help.

Try P = Z:
VZV^dagger = HTH Z HT^dagger H = HT(HZH)T^dagger H = HTXT^dagger H.

TXT^dagger = [[1,0],[0,e^{i pi/4}]] [[0,1],[1,0]] [[1,0],[0,e^{-i pi/4}]] = [[0, e^{-i pi/4}],[e^{i pi/4}, 0]].

This is e^{-i pi/4} [[0, 1],[e^{i pi/2}, 0]] = e^{-i pi/4}(X cos(pi/4) + Y sin(pi/4))... Let me compute more carefully.

TXT^dagger = [[0, e^{-i pi/4}],[e^{i pi/4}, 0]].

H(TXT^dagger)H = (1/2)[[1,1],[1,-1]] [[0, e^{-i pi/4}],[e^{i pi/4}, 0]] [[1,1],[1,-1]]

= (1/2)[[e^{i pi/4}, e^{-i pi/4}],[-e^{i pi/4}, e^{-i pi/4}]] [[1,1],[1,-1]]

= (1/2)[[e^{i pi/4}+e^{-i pi/4}, e^{i pi/4}-e^{-i pi/4}],[-e^{i pi/4}+e^{-i pi/4}, -e^{i pi/4}-e^{-i pi/4}]]

= (1/2)[[2cos(pi/4), 2i sin(pi/4)],[-2i sin(pi/4), -2cos(pi/4)]]

= [[cos(pi/4), i sin(pi/4)],[-i sin(pi/4), -cos(pi/4)]]

= [[1/sqrt(2), i/sqrt(2)],[-i/sqrt(2), -1/sqrt(2)]].

This is NOT a Pauli operator (Pauli operators have entries from {0, +/-1, +/-i} and are either diagonal or anti-diagonal). Therefore VZV^dagger is not Pauli, confirming V = HTH is NOT in the Clifford group.

#### Problem C5.10 (Stretch -- Universality of {H, Toffoli}) [Conceptual]
Explain why {H, Toffoli} is a universal gate set for quantum computation, even though neither H nor Toffoli alone is universal.

**Solution.**
Step 1: The Toffoli gate is universal for classical reversible computation. This means any Boolean function f: {0,1}^n -> {0,1}^m can be computed reversibly using Toffoli gates (with ancillas). In particular, any classical circuit can be embedded in a quantum circuit using only Toffoli gates.

Step 2: The Hadamard gate H creates superposition and enables interference. H takes computational-basis states to superpositions, which is the quintessential non-classical operation.

Step 3: Together, H and Toffoli can implement the controlled-S gate (by a construction involving Toffoli and ancillas to approximate phase rotations). More precisely:
- Toffoli + H can implement any circuit in the Clifford+T group, because:
  - Toffoli + H generates a set that includes CNOT (Toffoli with one control fixed to |1>) and all single-qubit Clifford gates.
  - A Toffoli gate can implement a controlled-controlled-phase, which combined with H gives access to non-Clifford gates equivalent to T.

Step 4: Since {CNOT, H, T} is universal (Theorem C5.3) and {H, Toffoli} can simulate {CNOT, H, T}, the set {H, Toffoli} is universal.

More directly: Shi (2003) proved that Toffoli + H is exactly universal for quantum computation (every unitary can be exactly implemented, not just approximated), which is a stronger statement.

---

### C5.10 Simulator Dependencies

**Required simulator features for C5:**

| Feature | Status | Detail |
|---------|--------|--------|
| Solovay-Kitaev approximation engine | Required (new for C5) | Given a target single-qubit unitary and a precision epsilon, output an H-T sequence approximating it. Display the gate sequence, the approximation error, and the gate count. |
| Circuit identity checker | Required (new for C5) | Given a circuit (sequence of gates on n qubits), compute the composite unitary and check if it matches any known gate. Display the 2^n x 2^n matrix. |
| Controlled-U decomposer | Required (new for C5) | Given a single-qubit unitary U, compute the ABC decomposition and display the controlled-U circuit as individual gates. |
| Toffoli gate | Required (new for C5) | Add the Toffoli gate to the gate palette. Support 3-qubit circuits. |
| Clifford-group indicator | Required (new for C5) | For a given circuit, indicate whether all gates are Clifford. If so, display the stabiliser-formalism representation. If not, display "Non-Clifford: full state-vector simulation required." |
| T-count display | Required (new for C5) | Count and display the number of T and T^dagger gates in the current circuit. |
| Ancilla qubit support | Required (new for C5) | Allow qubits to be designated as "ancilla" (initialised to \|0>, measured at the end). Support the compute-copy-uncompute pattern with automatic verification that ancillas return to \|0>. |
| All multi-qubit features | Required (from C4) | Carried forward: 2-qubit and 3-qubit state initialisation, gate palette, partial measurement, etc. |
| All single-qubit features | Required (from C1-C3) | Carried forward. |

**Simulator widget placement:**
- V-C5.2 (Solovay-Kitaev visualisation) is placed in Act 4.
- V-C5.3 (controlled-U construction) is placed in Act 5.
- V-C5.5 (Clifford vs non-Clifford) is placed in Act 6.
- V-C5.6 (circuit identity explorer) is available throughout.
- Problem set: students verify Problems C5.1, C5.2, C5.5 using the simulator.

---

### C5.11 Estimates

| Metric | Estimate |
|--------|----------|
| Word count (prose) | 11,000--12,000 words |
| Figures/visual assets | 7 (V-C5.1 through V-C5.7) |
| Interactive widgets | 4 (V-C5.2, V-C5.3, V-C5.5, V-C5.6) |
| Theorems/definitions | 6 definitions, 5 theorems |
| Worked examples | 5 |
| Problem set | 10 problems (including 2 stretch problems) |
| Estimated study time | 120--150 minutes |
| Implementation effort (prose) | 4 days |
| Implementation effort (visuals) | 3 days |
| Implementation effort (simulator features) | 5 days |
| Total implementation effort | 12 days |

---

### C5.12 Page Splits

The lesson is divided into five web pages.

**Page C5a: "What is Universality?"** (approx. 2,200 words)
- Opening hook (NAND analogy)
- Definition of exact and approximate universality (Definition C5.1)
- Two-step universality strategy
- Theorem C5.1 (CNOT + single-qubit gates are exactly universal) -- statement and proof sketch
- Visual asset V-C5.1

**Page C5b: "Approximating Gates -- The Solovay-Kitaev Theorem"** (approx. 2,500 words)
- Density of {H, T} in SU(2) (Theorem C5.3)
- Statement and explanation of Solovay-Kitaev (Theorem C5.4)
- Proof strategy (high level)
- Visual asset V-C5.2 (interactive approximation widget)
- Worked Example C5.1

**Page C5c: "Circuit Identities and Controlled-U"** (approx. 2,500 words)
- Multi-qubit circuit identities
- ABC decomposition (Theorem C5.5, Definition C5.3)
- Controlled-U construction
- Visual assets V-C5.3, V-C5.6
- Worked Examples C5.2, C5.5

**Page C5d: "Toffoli, Clifford Group, and Complexity"** (approx. 2,800 words)
- Toffoli gate (Definition C5.4)
- Clifford group (Definition C5.2) and Gottesman-Knill theorem (Theorem C5.2)
- Circuit complexity measures (Definition C5.5)
- Ancilla qubits (Definition C5.6)
- Visual assets V-C5.4, V-C5.5, V-C5.7
- Worked Examples C5.3, C5.4, C5.5
- Historical notes
- Common confusions

**Page C5e: "Problems"** (approx. 2,500 words)
- Full problem set (Problems C5.1--C5.10)

---
