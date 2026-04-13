# Track C (Computing) -- Lesson Specifications C6-C10: Quantum Algorithms

**Version:** 1.0
**Date:** 2026-04-13
**Status:** Draft
**Covers:** Lessons C6 (Deutsch-Jozsa), C7 (Teleportation & Superdense Coding), C8 (Grover's Algorithm), C9 (QFT & Phase Estimation), C10 (Shor's Algorithm)
**Canonical positions:** 18, 19, 21, 22, 23

---

## Notation Conventions (all lessons)

- |0>, |1> denote computational basis states. Multi-qubit states use binary labelling: |00>, |01>, |10>, |11>.
- Tensor product: the symbol x-in-circle is used in running text; in equations we write |a>|b> or |ab> for brevity.
- H = Hadamard gate, X = Pauli-X (NOT), Z = Pauli-Z, CNOT = controlled-NOT with control dot and target cross.
- f: {0,1}^n -> {0,1}^m denotes a Boolean function; U_f denotes its reversible oracle implementation acting as U_f|x>|y> = |x>|y XOR f(x)>.
- Phase oracle: O_f|x> = (-1)^{f(x)}|x> (derived from U_f with ancilla in |-> state).
- State vectors are written as column vectors with complex amplitudes. We use 1/sqrt(2) rather than decimal approximations wherever possible.

---

## C6 -- Deutsch-Jozsa Algorithm

**Canonical position:** 18
**Slug:** `c6-deutsch-jozsa`
**Prerequisites:** C5 (Universal gates), A5 (Tensor products), A6 (Probability/Born rule)
**Page structure:** Single page
**Target length:** 10,000-12,000 words

---

### C6.1 Learning Objectives

By the end of this lesson, the student will be able to:

1. **State** the Deutsch problem (n=1) and the Deutsch-Jozsa problem (general n) precisely, distinguishing constant functions from balanced functions.
2. **Construct** the standard oracle U_f for a given Boolean function f and explain why reversibility demands an ancilla qubit.
3. **Derive** the phase kickback mechanism: show algebraically that applying U_f to |x>|-> produces (-1)^{f(x)}|x>|->, converting bit information into phase information.
4. **Trace** the full state vector through every step of Deutsch's algorithm (n=1), producing the correct intermediate states after each gate.
5. **Generalise** Deutsch's algorithm to n qubits, writing the state at each stage using summation notation and verifying that measurement of the query register yields |0...0> if and only if f is constant.
6. **Explain** why the Deutsch-Jozsa algorithm provides an exponential speedup over deterministic classical algorithms and a superpolynomial speedup over randomised classical algorithms.
7. **Distinguish** between the promise problem framework (function is guaranteed constant or balanced) and general function classification, explaining why the promise is essential.
8. **Connect** the Deutsch-Jozsa algorithm to the Bernstein-Vazirani algorithm as a closely related oracle problem, identifying the structural similarities.
9. **Implement** the Deutsch-Jozsa circuit in the qubit simulator for n=1,2,3 with user-chosen oracles and predict the measurement outcomes before running the simulation.
10. **Articulate** the historical significance of the Deutsch-Jozsa algorithm as the first demonstration of a provable quantum advantage, while acknowledging its limitations for practical computation.

---

### C6.2 Intuition Arc

The lesson follows a carefully staged progression designed to make the "magic" of quantum parallelism feel inevitable rather than mysterious.

**Stage 1 -- The classical frustration (10 min).** We begin with a concrete scenario: you are given a black-box function f:{0,1}->{0,1} and told it is either constant (f(0)=f(1)) or balanced (f(0) != f(1)). Classically, you MUST evaluate f twice to be certain. We make this visceral: imagine a locked vault that dispenses one bit per query, and queries cost one million dollars each. Classically, you need two million dollars. The question: can quantum mechanics do it for one million?

**Stage 2 -- Building the oracle (10 min).** Before we can even think about quantum speedup, we need to formalise how a classical function enters the quantum world. We show that a direct implementation f(|x>) is problematic (non-unitary for non-injective f), motivating the XOR-oracle construction U_f|x>|y> = |x>|y XOR f(x)>. We verify unitarity (U_f is its own inverse). We build the 4x4 matrices for all four single-bit Boolean functions explicitly.

**Stage 3 -- Phase kickback: the key insight (15 min).** This is the conceptual heart of the lesson and arguably the single most important idea in quantum algorithms. We show what happens when the ancilla is prepared in |-> = (|0>-|1>)/sqrt(2): the XOR flips |-> to -|-> when f(x)=1, effectively multiplying |x> by (-1)^{f(x)} while leaving the ancilla unchanged. The bit-to-phase conversion is derived step by step. We emphasise: the ancilla acts as a "phase catalyst" -- it enables the transformation but is not itself changed.

**Stage 4 -- Deutsch's algorithm, n=1 (15 min).** With phase kickback in hand, the algorithm assembles itself. Prepare |0>|1>. Apply H to both qubits. Apply U_f. Apply H to the first qubit. Measure. We trace the full state vector for all four possible oracles, showing that measurement of the first qubit yields 0 for constant functions and 1 for balanced functions with certainty. One query suffices.

**Stage 5 -- Generalisation to n qubits (20 min).** We extend to f:{0,1}^n -> {0,1} with the promise that f is either constant or balanced. The algorithm is structurally identical: H^{tensor n}|0...0> creates a uniform superposition, phase kickback encodes f into phases, and a final H^{tensor n} causes constructive interference at |0...0> for constant f and destructive interference for balanced f. We derive this using the identity H^{tensor n}|x> = (1/sqrt(2^n)) sum_z (-1)^{x.z} |z> and compute the amplitude of |0...0> in the final state.

**Stage 6 -- Significance and limitations (10 min).** We place the result in context. The speedup is real but the problem is artificial (promise problems rarely arise in practice). We preview how the same structural ideas (superposition -> oracle -> interference -> measurement) will reappear in Grover (C8) and Shor (C10). We briefly introduce Bernstein-Vazirani as a "cousin" algorithm.

---

### C6.3 Theorems and Proof Sketches

**Theorem C6.1 (Oracle unitarity).** For any function f:{0,1}^n -> {0,1}^m, the operator U_f defined by U_f|x>|y> = |x>|y XOR f(x)> is unitary.

*Proof sketch.* Show U_f is a permutation matrix (it maps each computational basis state to a unique computational basis state). Permutation matrices are unitary since their columns form an orthonormal set. Alternatively, verify U_f * U_f = I directly: U_f(U_f|x>|y>) = U_f|x>|y XOR f(x)> = |x>|(y XOR f(x)) XOR f(x)> = |x>|y> since a XOR a = 0 for any a.

**Theorem C6.2 (Phase kickback).** If |-> = (|0> - |1>)/sqrt(2) and U_f|x>|y> = |x>|y XOR f(x)> for f:{0,1}^n -> {0,1}, then U_f|x>|-> = (-1)^{f(x)} |x>|->.

*Proof.* Expand U_f|x>|-> = U_f|x>(|0> - |1>)/sqrt(2) = (|x>|0 XOR f(x)> - |x>|1 XOR f(x)>)/sqrt(2). Case f(x)=0: this equals (|x>|0> - |x>|1>)/sqrt(2) = |x>|->. Case f(x)=1: this equals (|x>|1> - |x>|0>)/sqrt(2) = -|x>|->. Combining: U_f|x>|-> = (-1)^{f(x)} |x>|->.

**Theorem C6.3 (Deutsch-Jozsa correctness).** Given f:{0,1}^n -> {0,1} promised to be either constant or balanced, the Deutsch-Jozsa algorithm determines which case holds with certainty using a single query to U_f.

*Proof sketch.* The state after H^{tensor n}, oracle query with phase kickback, and final H^{tensor n} on the query register is:

|psi_final> = sum_z [ (1/2^n) sum_x (-1)^{f(x) + x.z} ] |z> tensor |->

The amplitude of |0^n> is (1/2^n) sum_x (-1)^{f(x)}, since x.(0^n)=0 for all x.

If f is constant: this amplitude is (1/2^n)(2^n)(-1)^{f(0)} = +/- 1. Measurement yields |0^n> with probability 1.

If f is balanced: exactly half the terms are +1 and half are -1, so the sum is 0. Measurement yields |0^n> with probability 0.

Therefore measuring the query register and checking whether the result is |0^n> or not perfectly distinguishes the two cases.

**Theorem C6.4 (Classical lower bound).** Any deterministic classical algorithm for the Deutsch-Jozsa promise problem requires 2^{n-1}+1 queries in the worst case.

*Proof sketch.* An adversary argument: after k <= 2^{n-1} queries, all returning the same value b, the adversary can still consistently declare f to be either constant (f(x)=b for all x) or balanced (f returns b on the queried inputs and 1-b on the remaining 2^n - k >= 2^{n-1} inputs, which is enough to make it balanced). So k queries cannot suffice when k <= 2^{n-1}.

---

### C6.4 Visual Assets

**Visual C6-V1: Oracle black box diagram.** A circuit-style diagram showing the oracle U_f as a black box with n input wires (query register) and 1 output wire (answer register). Inputs labelled |x_1>...|x_n> and |y>; outputs labelled |x_1>...|x_n> and |y XOR f(x)>. The box is shaded to indicate "classical function embedded in quantum circuit."

**Visual C6-V2: Phase kickback mechanism.** A two-panel diagram. Left panel: standard oracle action U_f|x>|y> = |x>|y XOR f(x)>. Right panel: phase kickback action when ancilla is |->. Arrows show the information flow: the bit flip of |-> is "kicked back" as a phase on |x>. Colour-coding: green for f(x)=0 (no phase), red for f(x)=1 (phase flip). This is the most important visual in the lesson.

**Visual C6-V3: Deutsch's algorithm circuit (n=1).** Standard circuit diagram: two qubits, initial state |0>|1>, H on both, U_f box, H on first qubit, measurement on first qubit. State labels at each wire position showing the intermediate states.

**Visual C6-V4: Deutsch-Jozsa circuit (general n).** Extension of V3 to n+1 qubits. The query register of n qubits starts in |0>^{tensor n}, ancilla in |1>. H^{tensor n} on query register, H on ancilla, U_f, H^{tensor n} on query register, measurement of all n query qubits.

**Visual C6-V5: Interference pattern comparison.** Two side-by-side bar charts showing the amplitude of each computational basis state after the final Hadamard. Left: constant function -- all amplitude concentrated at |0...0>. Right: balanced function -- zero amplitude at |0...0>, amplitude spread across other states. This makes the interference pattern visually dramatic.

**Visual C6-V6: State evolution timeline.** A horizontal timeline showing the state of the system at each step of the algorithm for the n=2 worked example (f(x) = x_1 XOR x_2). Each step shows the full state vector with amplitudes, annotated with the gate being applied. This serves as a "frame strip" visual.

**Visual C6-V7: Classical vs quantum query complexity.** A simple table/infographic comparing: Deterministic classical (2^{n-1}+1 queries), Randomised classical (O(1) queries but with error), Quantum (1 query, exact). Emphasises that the quantum advantage is against deterministic algorithms.

---

### C6.5 Worked Examples

**Worked Example C6-E1: Deutsch's algorithm with f(x) = x (balanced).**

Oracle: f(0)=0, f(1)=1. The oracle U_f acts as CNOT (control = first qubit, target = second qubit).

Step 0 -- Initial state:
|psi_0> = |0>|1>

Step 1 -- Apply H to both qubits:
H|0> = (|0>+|1>)/sqrt(2), H|1> = (|0>-|1>)/sqrt(2)
|psi_1> = [(|0>+|1>)/sqrt(2)] tensor [(|0>-|1>)/sqrt(2)]
= (1/2)(|00> - |01> + |10> - |11>)

Step 2 -- Apply U_f (CNOT):
U_f|00> = |00>, U_f|01> = |01>, U_f|10> = |11>, U_f|11> = |10>
|psi_2> = (1/2)(|00> - |01> + |11> - |10>)
= (1/2)(|0>(|0>-|1>) + |1>(|1>-|0>))
= (1/2)(|0>(|0>-|1>) - |1>(|0>-|1>))
= [(|0>-|1>)/sqrt(2)] tensor [(|0>-|1>)/sqrt(2)]

Step 3 -- Apply H to first qubit:
H[(|0>-|1>)/sqrt(2)] = |1>
|psi_3> = |1> tensor [(|0>-|1>)/sqrt(2)]

Step 4 -- Measure first qubit: result is 1 with probability 1. Since result != 0, f is balanced. Correct!

**Worked Example C6-E2: Deutsch's algorithm with f(x) = 1 (constant).**

Oracle: f(0)=1, f(1)=1. The oracle U_f acts as I tensor X (always flips the ancilla).

Step 0: |psi_0> = |0>|1>

Step 1: |psi_1> = [(|0>+|1>)/sqrt(2)] tensor [(|0>-|1>)/sqrt(2)]

Step 2 -- Apply U_f (I tensor X):
Flips second qubit: |0> <-> |1>
|psi_2> = [(|0>+|1>)/sqrt(2)] tensor [(|1>-|0>)/sqrt(2)]
= -[(|0>+|1>)/sqrt(2)] tensor [(|0>-|1>)/sqrt(2)]

The global phase of -1 does not affect measurement outcomes.

Step 3 -- Apply H to first qubit:
H[(|0>+|1>)/sqrt(2)] = |0>
|psi_3> = -|0> tensor [(|0>-|1>)/sqrt(2)]

Step 4 -- Measure first qubit: result is 0 with probability 1. Since result = 0, f is constant. Correct!

**Worked Example C6-E3: Deutsch-Jozsa with n=2, f(x) = x_1 XOR x_2 (balanced).**

The function f:{0,1}^2 -> {0,1} is defined by f(00)=0, f(01)=1, f(10)=1, f(11)=0. This is balanced (two 0s, two 1s).

Step 0 -- Initial state:
|psi_0> = |00>|1> (query register: 2 qubits in |0>, ancilla: |1>)

Step 1 -- Apply H^{tensor 2} to query register, H to ancilla:
H^{tensor 2}|00> = (1/2)(|00>+|01>+|10>+|11>)
H|1> = (|0>-|1>)/sqrt(2)
|psi_1> = (1/2)(|00>+|01>+|10>+|11>) tensor (|0>-|1>)/sqrt(2)

Step 2 -- Apply phase oracle (via U_f with ancilla in |->):
Each |x> picks up phase (-1)^{f(x)}:
(-1)^{f(00)} = (-1)^0 = +1
(-1)^{f(01)} = (-1)^1 = -1
(-1)^{f(10)} = (-1)^1 = -1
(-1)^{f(11)} = (-1)^0 = +1

|psi_2> = (1/2)(|00> - |01> - |10> + |11>) tensor (|0>-|1>)/sqrt(2)

Step 3 -- Apply H^{tensor 2} to query register:
We need H tensor H applied to (1/2)(|00> - |01> - |10> + |11>).

Using H|0> = (|0>+|1>)/sqrt(2), H|1> = (|0>-|1>)/sqrt(2):

H tensor H |00> = (1/2)(|00>+|01>+|10>+|11>)
H tensor H |01> = (1/2)(|00>-|01>+|10>-|11>)
H tensor H |10> = (1/2)(|00>+|01>-|10>-|11>)
H tensor H |11> = (1/2)(|00>-|01>-|10>+|11>)

(1/2)[HH|00> - HH|01> - HH|10> + HH|11>]
= (1/4)[(|00>+|01>+|10>+|11>) - (|00>-|01>+|10>-|11>) - (|00>+|01>-|10>-|11>) + (|00>-|01>-|10>+|11>)]

Collecting coefficients:
|00>: (1/4)(1-1-1+1) = 0
|01>: (1/4)(1+1-1-1) = 0
|10>: (1/4)(1-1+1-1) = 0
|11>: (1/4)(1+1+1+1) = 1

|psi_3> = |11> tensor (|0>-|1>)/sqrt(2)

Step 4 -- Measure query register: result is |11> with probability 1. Since result != |00>, f is balanced. Correct!

Note: the measurement result |11> is the bitwise dot-product "dual" of the function in a specific sense related to the Bernstein-Vazirani perspective -- for f(x) = x_1 XOR x_2 = s.x where s=11, the algorithm recovers s.

**Worked Example C6-E4: Deutsch-Jozsa with n=2, f(x) = 0 (constant).**

f(00)=f(01)=f(10)=f(11)=0. The oracle is the identity (does nothing).

Step 0: |psi_0> = |00>|1>

Step 1: |psi_1> = (1/2)(|00>+|01>+|10>+|11>) tensor (|0>-|1>)/sqrt(2)

Step 2 -- Oracle is identity, all phases are +1:
|psi_2> = |psi_1>

Step 3 -- Apply H^{tensor 2} to query register:
H^{tensor 2} [(1/2)(|00>+|01>+|10>+|11>)] = H^{tensor 2} [H^{tensor 2}|00>] = |00>

(Since H^2 = I, so (H tensor H)^2 = I tensor I.)

|psi_3> = |00> tensor (|0>-|1>)/sqrt(2)

Step 4 -- Measure query register: result is |00> with probability 1. Constant function confirmed!

---

### C6.6 Common Confusions

**Confusion 1: "The quantum computer evaluates f on all inputs simultaneously."**
This is the "quantum parallelism" misconception. While the superposition does encode all inputs, the useful work is done by INTERFERENCE, not parallel evaluation. If we measured immediately after the oracle, we would get a single random f(x) value -- no better than classical. The Hadamard gates AFTER the oracle are what create the interference pattern that reveals global properties of f.

**Confusion 2: "Phase kickback means the ancilla changes."**
The opposite: the ancilla is UNCHANGED (it stays in |->). The phase is "kicked back" onto the query register. This is counterintuitive because classically, the output register is where the answer appears. In phase kickback, the answer appears as a phase on the INPUT register.

**Confusion 3: "Deutsch-Jozsa gives exponential speedup over ALL classical algorithms."**
It gives exponential speedup over DETERMINISTIC classical algorithms. A randomised classical algorithm can solve the problem with O(1) queries and high probability (evaluate f on a few random inputs; if all return the same value, guess constant). The quantum advantage is in achieving CERTAINTY with one query, not in the number of queries needed for high-confidence answers.

**Confusion 4: "The algorithm works for any function, not just constant/balanced."**
The algorithm relies critically on the PROMISE that f is one of two types. If f is neither constant nor balanced, the algorithm's output is meaningless -- it may return |0...0> or not, but neither answer corresponds to a well-defined property of f. Promise problems are a specific computational model.

**Confusion 5: "The ancilla qubit is wasted -- why not just use n qubits?"**
Without the ancilla in |-> state, there is no phase kickback, and the oracle merely entangles the query register with the answer register. The ancilla is not "wasted" -- it is the catalyst that converts the function's output values into phase information accessible via interference.

**Confusion 6: "The measurement always gives exactly |0...0> or exactly not-|0...0>."**
This is actually TRUE for the Deutsch-Jozsa problem, but students sometimes doubt it. The proof shows the amplitude of |0...0> is exactly +/-1 or exactly 0, with no intermediate values. This perfect certainty is special to this algorithm; Grover's algorithm (C8), by contrast, gives probabilistic results.

---

### C6.7 Cross-References

| Reference | Direction | Nature |
|-----------|-----------|--------|
| C5 (Universal gates) | Prerequisite | H, CNOT, and controlled gates used to build oracles |
| A5 (Tensor products) | Prerequisite | Tensor product notation for multi-qubit states |
| A6 (Probability/Born rule) | Prerequisite | Measurement probabilities from amplitudes |
| C3 (Gates/Bloch sphere) | Background | Single-qubit gate operations, H gate |
| C4 (Multi-qubit systems) | Background | Multi-qubit state spaces, entanglement |
| C7 (Teleportation) | Forward | Uses similar circuit structures (Bell basis measurements) |
| C8 (Grover) | Forward | Phase oracle concept reused; same superposition-oracle-interference pattern |
| C9 (QFT) | Forward | Hadamard as 2-point QFT; generalisation of interference |
| C10 (Shor) | Forward | Oracle-based algorithm structure; phase estimation generalises DJ's interference |
| P6 (Bell/CHSH) | Parallel | Both demonstrate quantum advantage; both use entanglement and interference |

---

### C6.8 Historical Notes

**David Deutsch (1985).** Deutsch posed the question: can a quantum computer solve any problem faster than a classical one? His 1985 paper "Quantum theory, the Church-Turing principle and the universal quantum computer" introduced the concept of a quantum Turing machine and presented the first quantum algorithm -- the Deutsch algorithm for n=1. The original algorithm actually had a success probability of only 1/2; the deterministic version presented in modern textbooks was refined later. Deutsch's motivation was foundational: he wanted to show that quantum mechanics has computational consequences beyond classical physics.

**Deutsch and Jozsa (1992).** Richard Jozsa and David Deutsch generalised the algorithm to n qubits, creating the first problem with a proven exponential quantum speedup (albeit in the deterministic query complexity model). Their paper "Rapid solution of problems by quantum computation" appeared in the Proceedings of the Royal Society. The algorithm was later simplified by Richard Cleve, Artur Ekert, Chiara Macchiavello, and Michele Mosca (1998), who introduced the clean "phase kickback" presentation used in most modern textbooks.

**Bernstein-Vazirani (1993).** Ethan Bernstein and Umesh Vazirani extended the DJ framework to the "hidden linear function" problem: given f(x) = s.x (mod 2) for a secret string s, find s. Their algorithm uses the same circuit as DJ but the measurement outcome directly reveals s. This showed that the DJ speedup was not an isolated curiosity but part of a broader pattern. The Bernstein-Vazirani problem is sometimes called "Deutsch-Jozsa on steroids" because it extracts more information from a single query.

**Simon's algorithm (1994).** Daniel Simon took the oracle problem idea further, finding a problem (hidden subgroup in Z_2^n) with an exponential quantum speedup even over randomised classical algorithms. Simon's algorithm directly inspired Peter Shor's factoring algorithm. The progression Deutsch -> DJ -> Bernstein-Vazirani -> Simon -> Shor represents one of the great intellectual arcs in quantum computing.

---

### C6.9 Problem Set

**Problem C6-P1 (Warm-up).** List all four Boolean functions f:{0,1}->{0,1}. For each, classify it as constant or balanced. Write out the 4x4 unitary matrix for U_f|x>|y> = |x>|y XOR f(x)> in each case. [Hint: two are constant, two are balanced.]

**Problem C6-P2 (Trace the circuit).** Run Deutsch's algorithm (n=1) for f(x) = NOT(x), i.e., f(0)=1, f(1)=0. Write the state vector after every gate. What is the measurement outcome? Is f constant or balanced?

**Problem C6-P3 (Phase kickback derivation).** Prove phase kickback in full generality: if U|x>|y> = |x>|y XOR g(x)> where g:{0,1}^n -> {0,1}^m, and the ancilla register is in the state |-> = (|0>-|1>)/sqrt(2) on EACH of its m qubits, show that the action reduces to a phase kickback only when m=1. What happens when m>1? [This shows why DJ uses f with single-bit output.]

**Problem C6-P4 (n=3 worked trace).** Apply the Deutsch-Jozsa algorithm to f:{0,1}^3 -> {0,1} defined by f(x) = x_1 XOR x_2 XOR x_3 (balanced). Write the state after each major step. What is the measurement outcome?

**Problem C6-P5 (Building an oracle circuit).** Design an explicit quantum circuit (using only H, CNOT, Toffoli, and X gates) that implements U_f for the balanced function f:{0,1}^2 -> {0,1} defined by f(x_1, x_2) = x_1 AND x_2. Verify your circuit by computing U_f|x>|y> for all 8 basis states.

**Problem C6-P6 (Classical query complexity).** Prove rigorously that any deterministic classical algorithm requires at least 2^{n-1}+1 queries to solve the Deutsch-Jozsa promise problem. [Use an adversary argument: after k <= 2^{n-1} queries all returning the same value, exhibit two consistent functions, one constant and one balanced.]

**Problem C6-P7 (Randomised classical).** Show that a classical randomised algorithm can solve the DJ problem with error probability at most delta using only k = ceil(log_2(1/delta)) + 1 queries. [Hint: if the first k queries all return the same value, what is the probability that f is balanced?]

**Problem C6-P8 (Bernstein-Vazirani connection).** Consider f(x) = s.x (mod 2) for a secret string s in {0,1}^n. Run the DJ circuit on this function. Show that the measurement outcome on the query register is exactly s. Why does this work?

**Problem C6-P9 (Simulator exercise).** Use the qubit circuit simulator to implement the Deutsch-Jozsa algorithm for n=2 with f(x_1, x_2) = x_1. Predict the measurement outcome before running. Then run the simulation and verify. Screenshot the state vector at each step.

**Problem C6-P10 (Reflection).** The Deutsch-Jozsa algorithm uses 1 query but requires O(n) gates (the Hadamard layers). A classical algorithm uses O(2^n) queries but each query is O(1) work. In terms of TOTAL computational work (gates or operations), is the quantum algorithm still exponentially faster? Discuss.

---

### C6.10 Simulator Dependencies

**Required simulator:** Qubit circuit simulator (from simulator-spec.md, Section 2)

**Specific features used:**
- Circuit construction with H, X, CNOT gates (minimum)
- Oracle insertion: ability to insert a "black box" U_f gate defined by a truth table
- State vector display at each step ("show me the algebra" mode)
- Up to 4 qubits (n=3 query register + 1 ancilla) for the largest in-lesson examples
- Measurement simulation with outcome display
- Phase display: amplitudes should show complex phases, especially distinguishing +1 and -1

**Simulator exercises in this lesson:**
1. Deutsch's algorithm (2 qubits): trace state through all four oracle choices
2. Deutsch-Jozsa n=2 (3 qubits): balanced and constant function examples
3. Deutsch-Jozsa n=3 (4 qubits): verify the n=3 problem set exercise

**Pre-built circuit templates:** The lesson should link to pre-loaded simulator circuits for:
- Template DJ-1: Deutsch's algorithm with selectable oracle (dropdown: identity, NOT, constant-0, constant-1)
- Template DJ-2: DJ n=2 with selectable balanced/constant functions
- Template DJ-3: DJ n=3 with XOR-all function pre-loaded

---

### C6.11 Estimates

| Item | Estimate |
|------|----------|
| Prose (sections 1-6 of intuition arc) | 6,000-7,000 words |
| Theorems and proofs | 1,500-2,000 words |
| Worked examples (4 examples with full state traces) | 2,000-2,500 words |
| Problem set (10 problems with setup text) | 1,000-1,500 words |
| Historical notes | 500-700 words |
| Total | 11,000-13,700 words |
| Figures/diagrams | 7 visual assets |
| Simulator templates | 3 pre-built circuits |
| Estimated reading time | 45-55 minutes |
| Estimated completion time (with problems) | 2.5-3.5 hours |

---

### C6.12 Page Splits

**Single page.** The Deutsch-Jozsa lesson is contained in a single page at `/lessons/c6-deutsch-jozsa`. The content flows naturally from motivation through the n=1 case to the general n case without a natural break point that would warrant splitting. The 10,000-12,000 word target is within the single-page comfort zone established in the site architecture.

Internal anchor sections for navigation:
- `#motivation` -- Classical frustration and problem statement
- `#oracle-construction` -- Building U_f
- `#phase-kickback` -- The key insight
- `#deutsch-n1` -- Deutsch's algorithm (n=1)
- `#generalisation` -- Deutsch-Jozsa (general n)
- `#significance` -- Historical context and limitations
- `#worked-examples` -- Full worked examples
- `#problems` -- Problem set

---

---

## C7 -- Quantum Teleportation & Superdense Coding

**Canonical position:** 19
**Slug:** `c7-teleportation`
**Prerequisites:** C6 (Deutsch-Jozsa), C4 (Multi-qubit systems), A5 (Tensor products)
**Page structure:** Single page
**Target length:** 10,000-12,000 words

---

### C7.1 Learning Objectives

By the end of this lesson, the student will be able to:

1. **Describe** the quantum teleportation protocol in precise operational terms: shared Bell pair, Alice's CNOT and H gates, Alice's measurement, classical communication of 2 bits, Bob's conditional corrections.
2. **Derive** the full 3-qubit state evolution at every step of the teleportation protocol, expressing the state in the Bell basis on Alice's two qubits and the computational basis on Bob's qubit.
3. **Prove** the no-cloning theorem: there is no unitary operator U such that U|psi>|0> = |psi>|psi> for all |psi>.
4. **Explain** why teleportation does not violate no-cloning (the original state is destroyed by measurement) or faster-than-light communication (classical bits must be sent).
5. **Describe** the superdense coding protocol: Alice encodes 2 classical bits by applying one of {I, X, Z, ZX} to her half of a Bell pair, then sends her qubit to Bob, who performs a Bell measurement to decode.
6. **Derive** the full state evolution for superdense coding, showing that Bob's Bell measurement deterministically recovers Alice's 2-bit message.
7. **Articulate** the resource duality between teleportation and superdense coding: teleportation uses 1 ebit + 2 cbits to send 1 qubit; superdense coding uses 1 ebit + 1 qubit to send 2 cbits.
8. **Explain** entanglement as a fungible resource, introducing the concept of an "ebit" (entangled bit) and how it is consumed by both protocols.
9. **Implement** both protocols in the qubit simulator (3 qubits for teleportation, 2 qubits for superdense coding) and verify the state at each step.
10. **Connect** teleportation to quantum error correction and quantum networks, explaining why teleportation is a primitive operation in quantum communication.

---

### C7.2 Intuition Arc

**Stage 1 -- The no-cloning barrier (10 min).** We open with an apparent impossibility: "Can you copy an unknown quantum state?" We let the student attempt to design a cloning machine U|psi>|0> = |psi>|psi> and discover the contradiction via linearity. The proof is short and devastating: if U|0>|0> = |0>|0> and U|1>|0> = |1>|1>, then by linearity U(a|0>+b|1>)|0> = a|0>|0>+b|1>|1>, which is NOT (a|0>+b|1>)(a|0>+b|1>) = a^2|00>+ab|01>+ab|10>+b^2|11>. We note this is an entangled state, not a product state -- quantum mechanics generates entanglement when we try to copy. This result (Wootters-Zurek 1982, Dieks 1982) is one of the most profound consequences of linearity.

**Stage 2 -- The teleportation puzzle (5 min).** Given no-cloning, it seems impossible to transmit an unknown quantum state. But what if we are willing to DESTROY the original? And what if Alice and Bob share a pre-existing entangled pair? We set up the scenario: Alice has an unknown qubit |psi> = a|0>+b|1>. Alice and Bob each hold one qubit of a Bell pair |Phi+> = (|00>+|11>)/sqrt(2). Alice wants Bob to end up with |psi> without ever knowing a and b.

**Stage 3 -- The teleportation protocol step by step (25 min).** This is the core derivation. We label the three qubits: qubit 1 (Alice's unknown state), qubit 2 (Alice's half of Bell pair), qubit 3 (Bob's half of Bell pair). The initial 3-qubit state is |psi>_1 tensor |Phi+>_{23}. We expand everything in the computational basis and walk through:
- Alice applies CNOT (control=qubit 1, target=qubit 2)
- Alice applies H to qubit 1
- Alice measures both her qubits, obtaining one of four outcomes (00, 01, 10, 11)
- For each outcome, we show Bob's qubit collapses to a specific state related to |psi> by a known Pauli correction
- Bob applies the appropriate correction: I (for 00), X (for 01), Z (for 10), ZX (for 11)
- Bob now has |psi>

The derivation is performed in full, showing every intermediate state. We emphasise: at no point did a and b travel through any channel. The classical bits (2 bits) carry only Alice's measurement outcome, which is random and reveals nothing about |psi>.

**Stage 4 -- Why it works: the Bell basis viewpoint (10 min).** We re-derive the protocol using the Bell basis decomposition. Any 2-qubit state can be written in the Bell basis. Alice's CNOT+H effectively performs a Bell measurement on her two qubits. Writing the initial state in terms of Bell states on qubits 1,2 and the resulting state on qubit 3 makes the protocol transparent: the four Bell measurement outcomes correspond to four "rotated" versions of |psi> on Bob's qubit.

**Stage 5 -- No-cloning check and no-FTL check (5 min).** We verify two crucial consistency checks. (1) No-cloning: Alice's state is destroyed by measurement, so no copy exists. (2) No faster-than-light communication: before receiving Alice's classical bits, Bob's qubit is in a maximally mixed state (probability 1/2 for |0> or |1> regardless of |psi>). The classical communication is essential and travels at most at light speed.

**Stage 6 -- Superdense coding: the dual protocol (15 min).** We invert the resource trade. Alice and Bob share a Bell pair. Alice wants to send 2 classical bits using only 1 qubit of communication. She applies one of four operations to her half of the Bell pair (I, X, Z, XZ), transforming the shared state into one of the four Bell states. She sends her qubit to Bob. Bob performs a Bell measurement (CNOT + H + measure both) and obtains the 2-bit message. Full state derivation for all four messages.

**Stage 7 -- Entanglement as a resource (10 min).** We compare the two protocols side by side, introducing the "resource accounting" framework. Teleportation: consumes 1 ebit + 2 cbits, transmits 1 qubit. Superdense coding: consumes 1 ebit + 1 qubit, transmits 2 cbits. The ebit acts as a catalyst that amplifies the capacity of a quantum or classical channel. This resource perspective is fundamental to quantum information theory.

---

### C7.3 Theorems and Proof Sketches

**Theorem C7.1 (No-cloning theorem).** There is no unitary operator U acting on two qubits such that U|psi>|0> = |psi>|psi> for all single-qubit states |psi>.

*Proof.* Suppose such a U exists. Then:
- U|0>|0> = |0>|0> (clones |0>)
- U|1>|0> = |1>|1> (clones |1>)

By linearity of U:
U(a|0>+b|1>)|0> = aU|0>|0> + bU|1>|0> = a|0>|0> + b|1>|1>

But cloning requires:
U(a|0>+b|1>)|0> = (a|0>+b|1>)(a|0>+b|1>) = a^2|00> + ab|01> + ab|10> + b^2|11>

For these to be equal for all a,b with |a|^2+|b|^2=1, we need a|00>+b|11> = a^2|00>+ab|01>+ab|10>+b^2|11>. This requires ab=0 for the |01> and |10> coefficients, meaning a=0 or b=0. Contradiction (must hold for ALL a,b). Therefore no such U exists. QED.

**Theorem C7.2 (Teleportation correctness).** The quantum teleportation protocol transmits an arbitrary single-qubit state |psi> from Alice to Bob using one shared Bell pair and 2 bits of classical communication, with certainty.

*Proof sketch.* Write the initial state as:
|psi>_1 |Phi+>_{23} = (a|0>+b|1>)_1 (|00>+|11>)_{23} / sqrt(2)

Expand, apply CNOT_{12}, apply H_1, then regroup into Bell basis on qubits 1,2:
= (1/2)[ |Phi+>_{12}(a|0>+b|1>)_3 + |Phi->_{12}(a|0>-b|1>)_3 + |Psi+>_{12}(a|1>+b|0>)_3 + |Psi->_{12}(a|1>-b|0>)_3 ]

In the computational basis measurement, |Phi+> -> |00>, |Phi-> -> |10>, |Psi+> -> |01>, |Psi-> -> |11>.

Bob's corrections: outcome 00 -> I (already |psi>), outcome 01 -> X, outcome 10 -> Z, outcome 11 -> ZX. Each correction maps the conditional state to a|0>+b|1> = |psi>. QED.

**Theorem C7.3 (No-signalling).** Before receiving Alice's classical bits, Bob's reduced density matrix is I/2 regardless of |psi>.

*Proof sketch.* Bob's reduced state is obtained by tracing over Alice's qubits. Before Alice's measurement, the joint state gives Bob's reduced state as rho_3 = Tr_{12}(|Psi><Psi|) where |Psi> is the state after Alice's gates. Computing: rho_3 = (1/4)(|psi><psi| + X|psi><psi|X + Z|psi><psi|Z + ZX|psi><psi|XZ) = I/2 (using the fact that {I,X,Z,ZX} forms a complete set of Pauli corrections that depolarise any state). This equals I/2 for any |psi>, so Bob has no information about |psi> before receiving classical bits.

**Theorem C7.4 (Superdense coding correctness).** By applying one of {I, X, Z, XZ} to her half of a shared Bell pair and sending it to Bob, Alice can transmit 2 classical bits with certainty.

*Proof sketch.* The four Bell states are:
|Phi+> = (|00>+|11>)/sqrt(2), |Psi+> = (|01>+|10>)/sqrt(2),
|Phi-> = (|00>-|11>)/sqrt(2), |Psi-> = (|01>-|10>)/sqrt(2)

Starting from |Phi+>:
- I tensor I |Phi+> = |Phi+> (encodes 00)
- X tensor I |Phi+> = |Psi+> (encodes 01)
- Z tensor I |Phi+> = |Phi-> (encodes 10)
- XZ tensor I |Phi+> = -|Psi-> (encodes 11, global phase irrelevant)

These four Bell states are orthogonal and hence perfectly distinguishable by Bell measurement (CNOT + H + measure). QED.

---

### C7.4 Visual Assets

**Visual C7-V1: Teleportation circuit diagram.** Three-wire circuit: qubit 1 (|psi>), qubit 2 (|0>), qubit 3 (|0>). Bell pair preparation: H on qubit 2, CNOT(2->3). Then Alice's operations: CNOT(1->2), H on qubit 1. Measurements on qubits 1 and 2 with classical wires going to conditional X and Z gates on qubit 3. Classical wires drawn as double lines. State labels at each stage.

**Visual C7-V2: State decomposition diagram.** A visual showing the 3-qubit state expanded as a sum of four terms, each consisting of a Bell state on Alice's side tensor a "rotated |psi>" on Bob's side. The four terms are colour-coded to match the four measurement outcomes and the four correction operations.

**Visual C7-V3: No-cloning impossibility.** A simple diagram showing the attempted cloning operation and the linearity contradiction. Two paths: (1) "clone then superpose" gives a product state; (2) "superpose then clone" gives an entangled state. The mismatch is highlighted.

**Visual C7-V4: Superdense coding circuit.** Two-wire circuit: qubit 1 (Alice), qubit 2 (Bob). Bell pair preparation: H on qubit 1, CNOT(1->2). Alice's encoding: one of {I, X, Z, XZ} on qubit 1 (shown as a switchable gate). Alice sends qubit 1 to Bob. Bob's decoding: CNOT(1->2), H on qubit 1, measure both. Classical output of 2 bits.

**Visual C7-V5: Resource comparison table.** Side-by-side visual comparing teleportation and superdense coding. Left column: teleportation (1 ebit + 2 cbits -> 1 qubit). Right column: superdense coding (1 ebit + 1 qubit -> 2 cbits). Arrows show the resource flow. The ebit is drawn as a wavy line connecting Alice and Bob.

**Visual C7-V6: Bell basis "decoder ring."** A 2x2 grid showing the four Bell states with their labels (Phi+, Phi-, Psi+, Psi-), the corresponding measurement outcomes in the computational basis (after CNOT+H), and the Pauli correction needed for teleportation. This serves as a quick reference card.

**Visual C7-V7: Timeline of teleportation.** A spacetime diagram (Alice's worldline on the left, Bob's on the right) showing: (1) Bell pair distribution (pre-protocol), (2) Alice's operations and measurement (local), (3) classical communication (diagonal line, at or below speed of light), (4) Bob's correction (local, after receiving classical bits). This makes the no-FTL constraint visually obvious.

---

### C7.5 Worked Examples

**Worked Example C7-E1: Teleport |psi> = |0>.**

A simple warm-up where a = 1, b = 0.

Step 0 -- Initial state:
|Psi_0> = |0>_1 tensor (|00>+|11>)_{23}/sqrt(2) = (|000>+|011>)/sqrt(2)

Step 1 -- CNOT(1->2):
Control is qubit 1 (in |0>), so qubit 2 is unchanged.
|Psi_1> = (|000>+|011>)/sqrt(2)

Step 2 -- H on qubit 1:
H|0> = (|0>+|1>)/sqrt(2)
|Psi_2> = (1/2)(|000>+|011>+|100>+|111>)

Step 3 -- Rewrite grouping by Alice's qubits (qubits 1,2):
= (1/2)(|00>(|0>) + |01>(|1>) + |10>(|0>) + |11>(|1>))
= (1/2)|00>|0> + (1/2)|01>|1> + (1/2)|10>|0> + (1/2)|11>|1>

Step 4 -- Alice measures. Four equiprobable outcomes:
- Outcome 00 (prob 1/4): Bob has |0>. Correction: I. Final: |0>. Correct!
- Outcome 01 (prob 1/4): Bob has |1>. Correction: X. Final: X|1>=|0>. Correct!
- Outcome 10 (prob 1/4): Bob has |0>. Correction: Z. Final: Z|0>=|0>. Correct!
- Outcome 11 (prob 1/4): Bob has |1>. Correction: ZX. Final: ZX|1>=Z|0>=|0>. Correct!

All outcomes yield |0> after correction. Teleportation succeeds.

**Worked Example C7-E2: Teleport |psi> = |+> = (|0>+|1>)/sqrt(2).**

This is the critical test: teleporting a superposition state.

Step 0 -- Initial state:
|Psi_0> = [(|0>+|1>)/sqrt(2)]_1 tensor [(|00>+|11>)/sqrt(2)]_{23}
= (1/2)(|000>+|011>+|100>+|111>)

Step 1 -- CNOT(1->2):
|000> -> |000>, |011> -> |011>, |100> -> |110>, |111> -> |101>
|Psi_1> = (1/2)(|000>+|011>+|110>+|101>)

Step 2 -- H on qubit 1:
|0> -> (|0>+|1>)/sqrt(2), |1> -> (|0>-|1>)/sqrt(2)
|Psi_2> = (1/(2sqrt(2)))(
  (|0>+|1>)|00> + (|0>+|1>)|11> + (|0>-|1>)|10> + (|0>-|1>)|01>
)

Expand and group by Alice's measurement outcome (qubits 1,2):
|00> component: (1/(2sqrt(2)))(|0> + |1>)_3 = (1/(2sqrt(2)))|+>_3... 

Let us be more careful. Expanding fully:
|Psi_2> = (1/(2sqrt(2)))[
  |0>|00> + |1>|00> + |0>|11> + |1>|11> + |0>|10> - |1>|10> + |0>|01> - |1>|01>
]

Group by qubits 1,2:
- |00>: coefficient on qubit 3 is (1/(2sqrt(2)))(|0> + |1>) = (1/(2sqrt(2)))(|0>+|1>)
- |01>: coefficient on qubit 3 is (1/(2sqrt(2)))(|0> - |1>) = (1/(2sqrt(2)))(|0>-|1>)
- |10>: coefficient on qubit 3 is (1/(2sqrt(2)))(|0> + |1>) ... wait, let me regroup.

|Psi_2> = (1/(2sqrt(2)))[
  |00>(|0>+|1>)_3 + |01>(|0>-|1>)_3 + |10>(|0>+|1>)_3 + |11>(-|0>+|1>)_3
]

Hmm, let me redo this carefully from the expansion.

Before H on qubit 1, we had:
|Psi_1> = (1/2)(|000>+|011>+|110>+|101>)

Write qubit 1 separately:
= (1/2)(|0>|00> + |0>|11> + |1>|10> + |1>|01>)
= (1/2)|0>(|00>+|11>) + (1/2)|1>(|10>+|01>)

Apply H to qubit 1:
= (1/2)[(|0>+|1>)/sqrt(2)](|00>+|11>) + (1/2)[(|0>-|1>)/sqrt(2)](|10>+|01>)

= (1/(2sqrt(2)))|0>(|00>+|11>) + (1/(2sqrt(2)))|1>(|00>+|11>)
+ (1/(2sqrt(2)))|0>(|10>+|01>) - (1/(2sqrt(2)))|1>(|10>+|01>)

Group by qubits 1,2:
- |00>_12: Bob gets (1/(2sqrt(2)))(|0>_3 from first term... 

Actually, let me just group directly:
|00>: qubit 3 amplitude from |0>(|00>+|11>): gives |0>_3 from |00> term, and from |0>(|10>+|01>): gives |0>_3 from |01>... 

This is getting tangled in notation. Let me use the clean Bell basis approach instead.

Rewriting |Psi_1> in the Bell basis on qubits 1,2:
|Psi_1> = (1/2)(|000>+|011>+|110>+|101>)
= (1/2)|0>(|00>+|11>) + (1/2)|1>(|01>+|10>)

The Bell basis states (after CNOT+H, which is the inverse Bell transformation) are:
|Phi+> = CNOT, H: maps to |00>
|Phi-> = maps to |10>
|Psi+> = maps to |01>
|Psi-> = maps to |11>

Using the Bell decomposition identity:
|psi>|Phi+> = (1/2)[|Phi+>(a|0>+b|1>) + |Phi->(a|0>-b|1>) + |Psi+>(b|0>+a|1>) + |Psi->(b|0>-a|1>)]... 

For |+> = (|0>+|1>)/sqrt(2), so a=b=1/sqrt(2):
= (1/2)[|Phi+>(|0>+|1>)/sqrt(2) + |Phi->(|0>-|1>)/sqrt(2) + |Psi+>(|0>+|1>)/sqrt(2) + |Psi->(-|0>+|1>)/sqrt(2)]

Wait, let me use the standard result. For |psi> = a|0>+b|1>:

|psi>_1 |Phi+>_{23} = (1/2)[|Phi+>_{12}(a|0>+b|1>)_3 + |Phi->_{12}(a|0>-b|1>)_3 + |Psi+>_{12}(a|1>+b|0>)_3 + |Psi->_{12}(a|1>-b|0>)_3]

After CNOT+H on qubits 1,2 (Bell measurement), the outcomes in computational basis are:

- 00 (was |Phi+>): Bob has a|0>+b|1> = |+>. Apply I. Done.
- 10 (was |Phi->): Bob has a|0>-b|1> = |->. Apply Z: Z|-> = |+>. Done.
- 01 (was |Psi+>): Bob has a|1>+b|0> = (|0>+|1>)/sqrt(2) = |+>. Apply X: X|+> = |+>. Done.
- 11 (was |Psi->): Bob has a|1>-b|0> = (|1>-|0>)/sqrt(2) = -|->. Apply ZX: ZX(-|->) = -Z|+> = -|+>... 

Let me recalculate. For a=b=1/sqrt(2):
- 11 (was |Psi->): Bob has (1/sqrt(2))(|1>-|0>) = -(1/sqrt(2))(|0>-|1>) = -|->. 
  Apply ZX: ZX|-> = Z|+> ... Hmm, ZX|-> = Z(X|->). X|-> = -|->. Z(-|->) = -Z|-> = -(|0>+|1>)/sqrt(2)... 

No. Let me be very precise. X|0>=|1>, X|1>=|0>. Z|0>=|0>, Z|1>=-|1>.
|-> = (|0>-|1>)/sqrt(2).
X|-> = (X|0>-X|1>)/sqrt(2) = (|1>-|0>)/sqrt(2) = -|->. 
So ZX|-> = Z(-|->) = -(Z|0>-Z|1>)/sqrt(2) = -(|0>+|1>)/sqrt(2) = -|+>.

Bob has -|->. Apply ZX: ZX(-|->) = -ZX|-> = -(-|+>) = |+>. Correct!

Each outcome gives |+> (up to global phase) after correction. Teleportation of |+> succeeds.

Summary for this worked example:
All four measurement outcomes are equally likely (probability 1/4 each). After Bob's correction, he always obtains |+> = (|0>+|1>)/sqrt(2). The superposition has been faithfully teleported.

**Worked Example C7-E3: Teleport |psi> = cos(pi/8)|0> + sin(pi/8)|1>.**

Here a = cos(pi/8) = cos(22.5 degrees) approx 0.924, b = sin(pi/8) approx 0.383.

Using the Bell decomposition result directly:

After Alice's Bell measurement (CNOT+H+measure):
- Outcome 00: Bob has cos(pi/8)|0>+sin(pi/8)|1>. Correction I. Done.
- Outcome 01: Bob has sin(pi/8)|0>+cos(pi/8)|1>. Correction X: X(sin(pi/8)|0>+cos(pi/8)|1>) = sin(pi/8)|1>+cos(pi/8)|0> = cos(pi/8)|0>+sin(pi/8)|1>. Done.
- Outcome 10: Bob has cos(pi/8)|0>-sin(pi/8)|1>. Correction Z: Z(cos(pi/8)|0>-sin(pi/8)|1>) = cos(pi/8)|0>+sin(pi/8)|1>. Done.
- Outcome 11: Bob has sin(pi/8)|0>-cos(pi/8)|1>. Correction ZX: 
  X(sin(pi/8)|0>-cos(pi/8)|1>) = sin(pi/8)|1>-cos(pi/8)|0> = -(cos(pi/8)|0>-sin(pi/8)|1>)
  Z(-(cos(pi/8)|0>-sin(pi/8)|1>)) = -(cos(pi/8)|0>+sin(pi/8)|1>) = -|psi>.
  Global phase of -1 is irrelevant. Done.

This demonstrates teleportation works for a generic state with irrational amplitudes.

**Worked Example C7-E4: Superdense coding -- send message "10".**

Alice wants to send the classical bits 10 to Bob.

Step 0 -- Shared Bell pair:
|Phi+> = (|00>+|11>)/sqrt(2)

Step 1 -- Alice encodes "10" by applying Z to her qubit (qubit 1):
Z tensor I |Phi+> = (Z|0>|0> + Z|1>|1>)/sqrt(2) = (|0>|0> - |1>|1>)/sqrt(2) = |Phi->

Step 2 -- Alice sends her qubit to Bob. Bob now has both qubits in state |Phi->.

Step 3 -- Bob applies CNOT(1->2):
CNOT|00> = |00>, CNOT|11> = |10>
CNOT|Phi-> = (|00>-|10>)/sqrt(2) = (|0>-|1>)/sqrt(2) tensor |0> = |->|0>

Step 4 -- Bob applies H to qubit 1:
H|-> = |1>
Result: |1>|0> = |10>

Step 5 -- Bob measures both qubits: outcome is 10. Message decoded correctly!

**Worked Example C7-E5: Superdense coding -- send all four messages.**

Starting from |Phi+> = (|00>+|11>)/sqrt(2):

Message 00: Alice applies I. State: |Phi+>. Bob: CNOT -> (|00>+|10>)/sqrt(2) = |+>|0>. H -> |0>|0> = |00>. Correct.

Message 01: Alice applies X. State: X_1|Phi+> = (|10>+|01>)/sqrt(2) = |Psi+>. Bob: CNOT(|10>+|01>)/sqrt(2) = (|11>+|01>)/sqrt(2) = (|1>+|0>)/sqrt(2) tensor |1> = |+>|1>. H -> |0>|1> = |01>. Correct.

Message 10: Alice applies Z. State: |Phi->. Bob: CNOT -> (|00>-|10>)/sqrt(2) = |->|0>. H -> |1>|0> = |10>. Correct.

Message 11: Alice applies XZ (= iY up to global phase). State: XZ_1|Phi+> = X(|00>-|11>)/sqrt(2) = (|10>-|01>)/sqrt(2) = -|Psi->. Bob: CNOT(-|Psi->) = -(|11>-|01>)/sqrt(2) = -(|1>-|0>)/sqrt(2) tensor |1> = -|->|1>. H on qubit 1: -|1>|1> = -|11>. Measure: |11>. Correct (global phase irrelevant).

---

### C7.6 Common Confusions

**Confusion 1: "Teleportation sends the qubit faster than light."**
This is the single most common misconception. Teleportation REQUIRES classical communication (2 bits from Alice to Bob), which is limited by the speed of light. Before receiving these bits, Bob's qubit is in a maximally mixed state and carries no information about |psi>. The "instant collapse" upon Alice's measurement does not transmit any usable information. This is guaranteed by the no-signalling theorem (Theorem C7.3).

**Confusion 2: "Teleportation violates no-cloning because Bob ends up with a copy of |psi>."**
Teleportation does NOT create a copy. Alice's measurement destroys the original state -- after measurement, Alice's qubits are in a definite computational basis state (one of |00>, |01>, |10>, |11>), not in |psi>. The state has been MOVED, not copied. This is why it is called "teleportation" rather than "cloning."

**Confusion 3: "The Bell pair carries the quantum information."**
The Bell pair is a PRE-SHARED resource. It carries no information about |psi> (which may not even exist when the Bell pair is created). The Bell pair provides a "quantum channel" -- it is the entanglement that enables the protocol, not any pre-encoded message. Think of it as a blank check: valuable but content-free until used.

**Confusion 4: "Superdense coding violates Holevo's bound."**
Holevo's bound says that n qubits can carry at most n classical bits of accessible information. Superdense coding sends 2 bits using 1 qubit, which seems to violate this. The resolution: the protocol also consumes 1 ebit of shared entanglement. The TOTAL quantum resource used is 1 qubit (transmitted) + 1 ebit (consumed). Holevo's bound applies to the transmitted qubits, and the ebit is an additional resource not counted in the qubit transmission.

**Confusion 5: "Alice needs to know |psi> to teleport it."**
This is precisely the point: Alice does NOT need to know |psi>. She never learns a or b. Her measurement outcomes are uniformly random and reveal nothing about |psi>. The protocol works for an UNKNOWN state, which is what makes it useful for quantum communication and computation.

**Confusion 6: "Teleportation and superdense coding are the same protocol."**
They are DUALS, not identical. Teleportation sends a qubit using 2 classical bits; superdense coding sends 2 classical bits using 1 qubit. Both consume 1 ebit. The circuit structures are related (superdense coding uses the "inverse" of the teleportation circuit) but the physical resources and information flows are different.

---

### C7.7 Cross-References

| Reference | Direction | Nature |
|-----------|-----------|--------|
| C4 (Multi-qubit systems) | Prerequisite | Bell states, entanglement, tensor product structure |
| C6 (Deutsch-Jozsa) | Prerequisite | Circuit tracing skills, Hadamard and CNOT usage |
| A5 (Tensor products) | Prerequisite | Tensor product algebra for 3-qubit states |
| C3 (Gates/Bloch sphere) | Background | Pauli gates X, Z used for Bob's corrections |
| P6 (Bell/CHSH) | Parallel | Bell states, entanglement as a physical resource |
| C5 (Universal gates) | Background | Gate decomposition skills |
| C8 (Grover) | Forward | Measurement-based state transformation |
| C10 (Shor) | Forward | Phase estimation uses similar multi-register structure |
| P7 (Decoherence) | Forward (next lesson) | Real-world teleportation limited by decoherence |

---

### C7.8 Historical Notes

**Bennett, Brassard, Crepeau, Jozsa, Peres, and Wootters (1993).** The quantum teleportation protocol was proposed in their seminal paper "Teleporting an unknown quantum state via dual classical and Einstein-Podolsky-Rosen channels." This paper is remarkable for its economy: the protocol is simple, the proof is short, and the implications are profound. The authors included several pioneers of quantum information: Charles Bennett (IBM), who also co-invented BB84 quantum key distribution; Gilles Brassard (Montreal); and William Wootters, who had co-discovered the no-cloning theorem a decade earlier. The paper was published in Physical Review Letters and has been cited over 20,000 times.

**Bouwmeester, Pan, Mattle, Eibl, Weinfurter, and Zeilinger (1997).** The first experimental demonstration of quantum teleportation, performed at the University of Innsbruck using entangled photon pairs produced by parametric down-conversion. The experiment teleported the polarisation state of a photon over a distance of about 1 metre. The fidelity was well above the classical limit. This experiment, published in Nature, was a landmark in experimental quantum information. Anton Zeilinger later received the Nobel Prize in Physics (2022) in part for this work.

**Bennett and Wiesner (1992).** Superdense coding was proposed even before teleportation, in "Communication via one- and two-particle operators on Einstein-Podolsky-Rosen states." The name "superdense coding" was coined later. Experimental demonstration came in 1996 by Mattle, Weinfurter, Kwiat, and Zeilinger, also using entangled photons.

**Wootters and Zurek (1982); Dieks (1982).** The no-cloning theorem was independently discovered by William Wootters and Wojciech Zurek (published in Nature) and by Dennis Dieks (published in Physics Letters A). The theorem is short but its implications are vast: it underlies the security of quantum key distribution, motivates quantum error correction (you cannot simply copy a qubit as a backup), and is a key distinction between classical and quantum information.

**Modern teleportation records.** Quantum teleportation has been demonstrated over 143 km between the Canary Islands (2012, Zeilinger group), over 1,200 km using the Micius satellite (2017, Pan Jianwei group), and in various solid-state and trapped-ion systems. Teleportation is now considered a standard building block for quantum networks and distributed quantum computing.

---

### C7.9 Problem Set

**Problem C7-P1 (No-cloning proof).** Prove the no-cloning theorem using the inner product argument: if U|psi>|0> = |psi>|psi> and U|phi>|0> = |phi>|phi>, take the inner product of both sides to show <psi|phi> = <psi|phi>^2, which implies <psi|phi> is 0 or 1 -- i.e., only orthogonal or identical states can be cloned.

**Problem C7-P2 (Teleportation with |->).** Work through the full teleportation protocol for |psi> = |-> = (|0>-|1>)/sqrt(2). Write the 3-qubit state after each step. Verify that all four measurement outcomes lead to Bob obtaining |-> after correction.

**Problem C7-P3 (Teleportation with different Bell pair).** Suppose Alice and Bob share |Psi+> = (|01>+|10>)/sqrt(2) instead of |Phi+>. Rederive the teleportation protocol. What changes in Bob's correction operations?

**Problem C7-P4 (Bell measurement circuit).** Show that the circuit consisting of CNOT(1->2) followed by H on qubit 1 transforms the Bell basis {|Phi+>, |Phi->, |Psi+>, |Psi->} to the computational basis {|00>, |10>, |01>, |11>}. Compute the 4x4 matrix of this circuit.

**Problem C7-P5 (Superdense coding with |Psi->).** Suppose the shared Bell pair is |Psi-> = (|01>-|10>)/sqrt(2) instead of |Phi+>. What operations should Alice apply to encode each of the four 2-bit messages? Verify by computing the full state evolution for message "11."

**Problem C7-P6 (No-signalling verification).** Compute Bob's reduced density matrix before receiving Alice's classical bits in the teleportation protocol. Show explicitly that tracing over Alice's qubits gives rho_Bob = I/2 regardless of the input state |psi> = a|0>+b|1>.

**Problem C7-P7 (Resource counting).** In a quantum network, ebits cost $100 each, qubits cost $50 to transmit, and classical bits cost $1 to transmit. Compare the cost of: (a) teleporting one qubit, (b) superdense-coding 2 classical bits, (c) directly transmitting 1 qubit (no entanglement), (d) directly transmitting 2 classical bits. When is teleportation economically justified?

**Problem C7-P8 (Entanglement swapping).** Alice and Bob share a Bell pair (qubits A1, B1). Bob and Charlie share another Bell pair (qubits B2, C1). Bob performs a Bell measurement on his two qubits (B1, B2). Show that after Bob's measurement and classical communication, Alice and Charlie share a Bell pair -- even though they never interacted. This is called "entanglement swapping." Derive the final state.

**Problem C7-P9 (Simulator exercise -- teleportation).** Use the qubit circuit simulator to implement teleportation of |+> = (|0>+|1>)/sqrt(2). Set up the 3-qubit circuit, run it, and verify the state at each step. What measurement outcomes do you observe? Does Bob's qubit end up in |+> after correction?

**Problem C7-P10 (Simulator exercise -- superdense coding).** Implement superdense coding in the simulator. Encode each of the four messages (00, 01, 10, 11) and verify Bob's measurement outcome in each case.

**Problem C7-P11 (Thought experiment).** Suppose you could clone quantum states. Show that you could then use entanglement to send information faster than light. [Hint: Alice and Bob share a Bell pair. Alice measures in either the Z or X basis. If Bob could clone his qubit many times, he could determine Alice's choice of basis by statistical analysis, without any classical communication.]

---

### C7.10 Simulator Dependencies

**Required simulator:** Qubit circuit simulator (from simulator-spec.md, Section 2)

**Specific features used:**
- 3-qubit circuits (teleportation), 2-qubit circuits (superdense coding)
- Gates: H, X, Z, CNOT, controlled-Z
- Measurement with classical output display
- Conditional gates (Bob's corrections conditioned on Alice's measurement outcomes)
- State vector display at each step ("show me the algebra" mode)
- Bell state preparation sub-circuit (H + CNOT)
- Density matrix display (for no-signalling verification -- show Bob's reduced density matrix)

**Simulator exercises in this lesson:**
1. Teleportation of |0>, |1>, |+>, |->, and a general state
2. Superdense coding: all four messages
3. Verification of no-signalling by inspecting Bob's reduced state

**Pre-built circuit templates:**
- Template TEL-1: Teleportation circuit with selectable input state (dropdown: |0>, |1>, |+>, |->, custom)
- Template TEL-2: Teleportation with different shared Bell pairs (dropdown: Phi+, Phi-, Psi+, Psi-)
- Template SDC-1: Superdense coding with selectable 2-bit message

---

### C7.11 Estimates

| Item | Estimate |
|------|----------|
| Prose (stages 1-7 of intuition arc) | 5,500-6,500 words |
| Theorems and proofs | 1,500-2,000 words |
| Worked examples (5 examples with full state traces) | 2,500-3,000 words |
| Problem set (11 problems with setup text) | 1,200-1,500 words |
| Historical notes | 600-800 words |
| Total | 11,300-13,800 words |
| Figures/diagrams | 7 visual assets |
| Simulator templates | 3 pre-built circuits |
| Estimated reading time | 45-55 minutes |
| Estimated completion time (with problems) | 2.5-3.5 hours |

---

### C7.12 Page Splits

**Single page.** The lesson is served at `/lessons/c7-teleportation`. Teleportation and superdense coding are conceptually tightly coupled (dual protocols sharing the same Bell-state machinery), so splitting them across pages would break the narrative flow. The target length of 10,000-12,000 words fits within the single-page format.

Internal anchor sections:
- `#no-cloning` -- No-cloning theorem
- `#teleportation-setup` -- The teleportation puzzle
- `#teleportation-protocol` -- Step-by-step protocol
- `#bell-basis-viewpoint` -- Bell basis interpretation
- `#no-signalling` -- No-FTL check
- `#superdense-coding` -- Superdense coding protocol
- `#entanglement-resource` -- Entanglement as a resource
- `#worked-examples` -- Full worked examples
- `#problems` -- Problem set

---

---

## C8 -- Grover's Algorithm

**Canonical position:** 21
**Slug:** `c8-grover`
**Prerequisites:** C6 (Deutsch-Jozsa), C7 (Teleportation), A5 (Tensor products), A6 (Probability/Born rule)
**Page structure:** 2 parts (`part-1`: oracle construction and algorithm; `part-2`: geometric interpretation, optimality, and extensions)
**Target length:** 15,000-18,000 words

---

### C8.1 Learning Objectives

By the end of this lesson, the student will be able to:

1. **State** the unstructured search problem precisely: given a black-box function f:{0,1}^n -> {0,1} with exactly M marked items (f(x)=1 for M values of x), find a marked item.
2. **Construct** the phase oracle O_f that acts as O_f|x> = (-1)^{f(x)}|x>, explaining its relationship to the standard oracle U_f via phase kickback (connecting to C6).
3. **Derive** the diffusion operator D = 2|s><s| - I where |s> = H^{tensor n}|0^n> = (1/sqrt(N)) sum_x |x>, and show it can be implemented as H^{tensor n}(2|0><0|-I)H^{tensor n}.
4. **Describe** Grover's algorithm as an iteration: start with |s>, repeatedly apply G = D . O_f, then measure.
5. **Derive** the geometric interpretation: the state always lies in the 2D subspace spanned by |w> (uniform superposition over marked items) and |w_perp> (uniform superposition over unmarked items), and each Grover iteration rotates the state by angle 2*theta where sin(theta) = sqrt(M/N).
6. **Compute** the optimal number of iterations k_opt = floor(pi/(4*theta)) and show this gives O(sqrt(N/M)) queries, proving the quadratic speedup.
7. **Explain** overshooting: applying too many iterations rotates the state past the target, decreasing the success probability.
8. **Extend** the analysis to M > 1 marked items and explain the failure mode when M is unknown (quantum counting as a remedy, briefly mentioned).
9. **State** the BBBV lower bound: any quantum algorithm for unstructured search requires Omega(sqrt(N)) queries, showing Grover is optimal.
10. **Implement** Grover's algorithm in the qubit simulator for N=4 and N=8, observing the amplitude amplification at each iteration.

---

### C8.2 Intuition Arc

**Part 1: Oracle Construction and the Algorithm**

**Stage 1 -- The needle in the haystack (10 min).** We open with the search problem in its most elemental form: you have a database of N items, exactly one is "marked," and your only tool is a black-box function that tells you whether a given item is marked. Classically, you need to check items one by one. On average, you check N/2 items; in the worst case, N-1 items before finding the marked one (or N items to confirm none exists). We make this concrete: N = 1,000,000 items, each query takes 1 microsecond. Classical: 0.5 seconds average. Quantum (previewing the result): about 1,000 queries = 1 millisecond. A 500x speedup. For N = 10^12, the speedup is 10^6 times.

**Stage 2 -- Phase oracles revisited (10 min).** We recall from C6 the phase kickback mechanism: by preparing an ancilla in |-> and applying U_f, we convert f(x) into a phase: |x> -> (-1)^{f(x)}|x>. For search, f(x) = 1 if x is the marked item, 0 otherwise. The phase oracle "tags" the marked item with a -1 phase, leaving all other items untouched. We note that this oracle does NOT reveal which item is marked -- it merely flips a phase that is invisible to measurement in the computational basis. The challenge: how to convert this invisible phase difference into a measurable amplitude difference.

**Stage 3 -- The uniform superposition as starting point (5 min).** Apply H^{tensor n} to |0^n> to create |s> = (1/sqrt(N)) sum_{x=0}^{N-1} |x>. Every item has equal amplitude 1/sqrt(N). If we measure now, we get each item with probability 1/N -- uniform random guess, no better than classical. We need to AMPLIFY the amplitude of the marked item.

**Stage 4 -- The oracle step (10 min).** Apply O_f to |s>. The marked item's amplitude flips from +1/sqrt(N) to -1/sqrt(N). All other amplitudes remain +1/sqrt(N). The state is ALMOST unchanged -- one amplitude out of N has flipped sign. Measuring now still gives the marked item with probability 1/N. But the phase information is there, waiting to be amplified.

**Stage 5 -- The diffusion operator (20 min).** This is the core innovation. We derive the operator D = 2|s><s| - I, which reflects every amplitude about the mean. Step by step: (1) compute the mean amplitude, (2) reflect each amplitude about the mean (new amplitude = 2*mean - old amplitude). We show this algebraically: D|psi> has amplitude 2<s|psi>/sqrt(N) - a_x for each basis state |x>, which is exactly reflection about the mean. We then derive the circuit implementation: D = H^{tensor n} (2|0><0|-I) H^{tensor n}. The operator 2|0><0|-I flips the phase of every state EXCEPT |0^n>; sandwiched between Hadamards, this becomes "flip the phase of every state except |s>," which is the reflection about |s>.

**Stage 6 -- Putting it together: one iteration (10 min).** One Grover iteration G = D . O_f consists of: (1) oracle flips the marked item's phase, (2) diffusion reflects about the mean. After one iteration, the marked item's amplitude increases from 1/sqrt(N) to approximately 3/sqrt(N) (for large N). We compute this explicitly for N=4 and N=8.

**Stage 7 -- Multiple iterations and success probability (10 min, concluding Part 1).** We show the amplitude of the marked item after k iterations and observe it growing. We plot the success probability as a function of k, revealing a sinusoidal pattern. The first maximum occurs near k = pi*sqrt(N)/4 iterations, at which point the success probability is close to 1. We foreshadow the geometric interpretation (Part 2) and note the overshooting phenomenon.

**Part 2: Geometric Interpretation, Optimality, and Extensions**

**Stage 8 -- The 2D subspace (15 min).** This is the most elegant insight in the analysis of Grover's algorithm. Define |w> = (1/sqrt(M)) sum_{x: f(x)=1} |x> (uniform superposition over marked items) and |w_perp> = (1/sqrt(N-M)) sum_{x: f(x)=0} |x> (uniform superposition over unmarked items). These are orthonormal. The initial state |s> lies in span{|w>, |w_perp>}: |s> = sin(theta)|w> + cos(theta)|w_perp> where sin(theta) = sqrt(M/N). We prove that both the oracle O_f and the diffusion D map this 2D subspace to itself. Therefore the entire algorithm operates within this 2D plane.

**Stage 9 -- Grover iteration as rotation (15 min).** In the 2D subspace, the oracle O_f is a reflection about |w_perp> (it flips the |w> component). The diffusion D is a reflection about |s>. The composition of two reflections is a rotation. We derive that G = D . O_f rotates by angle 2*theta. After k iterations, the state is sin((2k+1)*theta)|w> + cos((2k+1)*theta)|w_perp>. The success probability is sin^2((2k+1)*theta).

**Stage 10 -- Optimal iteration count (10 min).** We want sin^2((2k+1)*theta) to be as close to 1 as possible. This requires (2k+1)*theta approx pi/2, giving k_opt = floor((pi/(4*theta) - 1)/2) approx pi/(4*theta) - 1/2. For M=1, theta approx 1/sqrt(N) (small angle), so k_opt approx (pi/4)*sqrt(N). The success probability at k_opt is at least 1 - M/N, which is close to 1 when M << N.

**Stage 11 -- Overshooting and the sinusoidal pattern (10 min).** If we apply more than k_opt iterations, the state rotates PAST |w> and the success probability decreases. After about 2*k_opt iterations, the amplitude of |w> returns to its initial value. After 3*k_opt, it peaks again. We plot this sinusoidal pattern and emphasise: unlike classical search, where more work always helps, Grover's algorithm requires knowing when to stop.

**Stage 12 -- Multiple solutions (10 min).** When M > 1 marked items exist, the analysis is identical but theta = arcsin(sqrt(M/N)) is larger. The optimal iteration count is k_opt approx (pi/4)*sqrt(N/M), and the algorithm is FASTER (fewer iterations needed). But if M is unknown, we might overshoot or undershoot. Brief mention of quantum counting (using QPE from C9 to estimate M) as the solution.

**Stage 13 -- The BBBV lower bound (15 min).** We sketch the Bennett-Bernstein-Brassard-Vazirani (1997) proof that Omega(sqrt(N)) queries are necessary for any quantum algorithm. The argument uses the "hybrid method": define a sequence of oracles O_0, O_1, ..., O_N where O_i marks item i (and O_0 marks nothing). After k queries, the state produced by the algorithm with O_0 versus O_i can differ by at most O(k/sqrt(N)) in L2 norm (each query contributes at most 1/sqrt(N) to the distinguishability). To distinguish O_0 from a random O_i with constant probability, we need k = Omega(sqrt(N)). This shows Grover's algorithm is OPTIMAL.

**Stage 14 -- Amplitude amplification framework (10 min, conclusion).** We generalise: Grover's algorithm is a special case of amplitude amplification (Brassard, Hoyer, Mosca, Tapp 2000). Given any quantum algorithm A that produces the correct answer with probability p, amplitude amplification boosts this to near-certainty using O(1/sqrt(p)) repetitions. This is the quantum analogue of classical probability amplification by repetition (which uses O(1/p) repetitions). This framework connects Grover to the broader toolkit of quantum algorithm design.

---

### C8.3 Theorems and Proof Sketches

**Theorem C8.1 (Diffusion operator structure).** The diffusion operator D = 2|s><s| - I, where |s> = (1/sqrt(N)) sum_x |x>, reflects any state about the uniform superposition |s>. Its circuit implementation is D = H^{tensor n}(2|0^n><0^n| - I)H^{tensor n}.

*Proof.* First, D is a reflection: D^2 = (2|s><s|-I)^2 = 4|s><s|s><s| - 4|s><s| + I = 4|s><s| - 4|s><s| + I = I (using <s|s>=1). So D is an involution. For the circuit implementation: H^{tensor n}|0^n> = |s>, so H^{tensor n}|s> = |0^n>. Then H^{tensor n}(2|0^n><0^n|-I)H^{tensor n} = 2(H^{tensor n}|0^n>)(<0^n|H^{tensor n}) - I = 2|s><s|-I = D.

For the gate-level implementation: 2|0^n><0^n|-I negates the phase of every basis state except |0^n>. This can be implemented as: apply X to all qubits (mapping |0^n> to |1^n>), apply a multi-controlled Z gate (phase flip when all qubits are |1>), apply X to all qubits again. The multi-controlled Z decomposes into O(n) elementary gates using ancillas or O(n^2) gates without ancillas.

**Theorem C8.2 (2D subspace invariance).** Define |w> = (1/sqrt(M)) sum_{f(x)=1} |x> and |w_perp> = (1/sqrt(N-M)) sum_{f(x)=0} |x>. The subspace V = span{|w>, |w_perp>} is invariant under both O_f and D.

*Proof.* O_f acts as: O_f|w> = -|w> (all marked states get phase flip), O_f|w_perp> = |w_perp> (unmarked states untouched). So O_f maps V to V. For D: D = 2|s><s|-I. Since |s> = sin(theta)|w>+cos(theta)|w_perp> is in V, and for any |v> in V, <s|v> is a scalar, so D|v> = 2<s|v>|s> - |v> is a linear combination of |s> and |v>, both in V. So D maps V to V.

**Theorem C8.3 (Grover rotation angle).** The Grover operator G = D . O_f, restricted to the subspace V, is a rotation by angle 2*theta where sin(theta) = sqrt(M/N).

*Proof sketch.* In the {|w_perp>, |w>} basis (ordered so theta is the angle from |w_perp> to |s>):

O_f is reflection about |w_perp>: matrix [[1, 0], [0, -1]].

D is reflection about |s>: writing |s> = cos(theta)|w_perp> + sin(theta)|w>, the reflection matrix about |s> is:
D_V = 2|s><s|-I = [[2cos^2(theta)-1, 2cos(theta)sin(theta)],[2cos(theta)sin(theta), 2sin^2(theta)-1]] = [[cos(2theta), sin(2theta)],[sin(2theta), -cos(2theta)]]

G_V = D_V . O_f = [[cos(2theta), sin(2theta)],[sin(2theta), -cos(2theta)]] . [[1,0],[0,-1]] = [[cos(2theta), -sin(2theta)],[sin(2theta), cos(2theta)]]

This is a rotation matrix by angle 2*theta (counterclockwise). QED.

**Theorem C8.4 (Optimal iteration count).** The success probability after k iterations is P(k) = sin^2((2k+1)*theta). The optimal number of iterations is k_opt = round((pi/(4theta) - 1)/2), giving P(k_opt) >= 1 - M/N.

*Proof sketch.* After k iterations, the state is G^k|s> = sin((2k+1)theta)|w> + cos((2k+1)theta)|w_perp>. Measuring gives a marked item with probability sin^2((2k+1)theta). This is maximised when (2k+1)theta is closest to pi/2, i.e., k = round((pi/(4theta)-1)/2). For M << N, theta approx sqrt(M/N), so k_opt approx (pi/4)sqrt(N/M). The success probability at the optimal point is at least cos^2(theta) >= 1-sin^2(theta) = 1-M/N.

**Theorem C8.5 (BBBV lower bound, sketch).** Any quantum algorithm that solves the unstructured search problem (with M=1 marked item among N) with probability at least 2/3 must make Omega(sqrt(N)) queries to the oracle.

*Proof sketch (hybrid argument).* Let O_0 be the "null oracle" (no marked item, f=0 everywhere) and O_i be the oracle marking only item i. Let |psi_k^{(i)}> be the state of the algorithm after k queries to O_i. By the "unitary perturbation" lemma, ||psi_k^{(0)}> - |psi_k^{(i)}>|| <= 2k * (contribution of item i per query). Since the query operator O_i differs from O_0 only on the |i> component (a rank-1 perturbation), each query changes the state by at most O(amplitude of |i>). Summing over items: sum_i |||psi_k^{(0)}> - |psi_k^{(i)}>||^2 <= O(k^2). For the algorithm to succeed on at least 2/3 of the oracles O_i, we need most of these distances to be Omega(1), giving N * Omega(1) <= O(k^2), hence k = Omega(sqrt(N)).

---

### C8.4 Visual Assets

**Visual C8-V1: Search problem setup.** An array of N=8 boxes, 7 white (unmarked) and 1 red (marked). A "query" operation illuminates one box. Classical: must open boxes one by one. The visual shows the worst-case classical scenario: opening 7 boxes before finding the red one.

**Visual C8-V2: Phase oracle action.** A bar chart showing N=8 amplitudes, all equal to 1/sqrt(8). After the oracle, the marked item's bar flips below the axis (negative amplitude) while all others remain positive. The mean amplitude line is shown.

**Visual C8-V3: Diffusion as reflection about the mean.** A bar chart showing the amplitudes after the oracle (one negative, rest positive). An animated/two-frame visual showing each amplitude being "reflected" about the mean: the marked item's amplitude (which was below the mean) bounces to above the mean, and all other amplitudes (which were above the mean) decrease slightly. After the reflection, the marked item has the largest amplitude.

**Visual C8-V4: Amplitude amplification frame strip.** A horizontal sequence of bar charts, one for each iteration of Grover's algorithm (iterations 0 through k_opt). Each chart shows all N=8 amplitudes. The marked item's amplitude grows visibly with each iteration while the unmarked items' amplitudes shrink. For N=8 with M=1, k_opt = 2, so we show 3 frames (after 0, 1, 2 iterations).

**Visual C8-V5: 2D geometric interpretation.** A unit circle in the |w_perp>-|w> plane. The initial state |s> is shown at angle theta from |w_perp>. Each Grover iteration rotates by 2*theta. Successive states after 0, 1, 2, ..., k iterations are shown as points on the circle, approaching |w> (the vertical axis). The overshooting phenomenon is visible: after k_opt+1 iterations, the state passes |w> and the projection onto |w> decreases.

**Visual C8-V6: Success probability vs iterations.** A plot of P(k) = sin^2((2k+1)theta) for N=8 (M=1). The curve shows the sinusoidal oscillation with the first peak near k=2. The plot extends to k=6 or so, showing the overshooting and the periodic recurrence.

**Visual C8-V7: Overshooting illustration.** The 2D geometric view with the state rotating past |w> (the target). The angle overshoot is highlighted. A comparison: "Classical search never overshoots -- more work always helps. Quantum search can overshoot -- you must stop at the right time."

**Visual C8-V8: BBBV lower bound intuition.** A visual showing N boxes, with the quantum state having small amplitude on each. Each query "learns" O(1/sqrt(N)) about each box. After k queries, the total "information" accumulated is O(k/sqrt(N)). To accumulate enough information to find the marked item (needs O(1) total), we need k = O(sqrt(N)).

**Visual C8-V9: Diffusion operator circuit.** The circuit for D: H^{tensor n}, then X on all qubits, then multi-controlled Z, then X on all qubits, then H^{tensor n}. For n=3, showing the explicit gate decomposition.

---

### C8.5 Worked Examples

**Worked Example C8-E1: Grover's algorithm for N=4, marked item |11>.**

n = 2 qubits, N = 4, M = 1, theta = arcsin(1/sqrt(4)) = arcsin(1/2) = pi/6.
k_opt: we want (2k+1)*theta = pi/2, so (2k+1)*pi/6 = pi/2, giving 2k+1 = 3, k = 1.

Step 0 -- Initial state |s>:
|s> = H^{tensor 2}|00> = (1/2)(|00> + |01> + |10> + |11>)
Amplitudes: [1/2, 1/2, 1/2, 1/2]

Step 1 -- Apply oracle O_f (phase flip on |11>):
|psi_1> = (1/2)(|00> + |01> + |10> - |11>)
Amplitudes: [1/2, 1/2, 1/2, -1/2]

Step 2 -- Apply diffusion D = 2|s><s| - I:
<s|psi_1> = (1/2)(1/2) + (1/2)(1/2) + (1/2)(1/2) + (1/2)(-1/2) = 1/4 + 1/4 + 1/4 - 1/4 = 1/2.

D|psi_1> = 2|s><s|psi_1> - |psi_1> = 2*(1/2)*|s> - |psi_1> = |s> - |psi_1>
= (1/2)(|00>+|01>+|10>+|11>) - (1/2)(|00>+|01>+|10>-|11>)
= (1/2)(0*|00> + 0*|01> + 0*|10> + 2*|11>)
= |11>

After 1 Grover iteration: |psi_final> = |11>

Measurement: result is |11> with probability 1. The marked item is found with certainty!

This is a special case: for N=4 with M=1, one iteration gives perfect success probability. The geometric angle is theta = pi/6, and after 1 iteration the angle is (2*1+1)*pi/6 = 3*pi/6 = pi/2, corresponding to the state exactly aligned with |w>.

**Worked Example C8-E2: Grover's algorithm for N=8, marked item |101>.**

n = 3 qubits, N = 8, M = 1, theta = arcsin(1/sqrt(8)) = arcsin(1/(2sqrt(2))) approx 0.3614 rad.
k_opt: we want (2k+1)*theta approx pi/2. (2k+1) approx pi/(2*0.3614) approx 4.34. So 2k+1 approx 4.34, k approx 1.67. k_opt = 2 (rounding to nearest integer).

Step 0 -- Initial state:
|s> = (1/sqrt(8))(|000>+|001>+|010>+|011>+|100>+|101>+|110>+|111>)
All amplitudes: 1/(2sqrt(2)) approx 0.3536

**Iteration 1:**

Oracle: flip amplitude of |101>.
Amplitudes after oracle: all 1/(2sqrt(2)) except |101> which is -1/(2sqrt(2)).

Diffusion:
<s|psi> = (1/sqrt(8))[7*(1/(2sqrt(2))) + 1*(-1/(2sqrt(2)))] = (1/sqrt(8)) * (6/(2sqrt(2))) = (1/sqrt(8)) * (3/sqrt(2)) = 3/(sqrt(16)) = 3/4

New amplitudes using D|psi> component = 2*(1/sqrt(N))*<s|psi> - a_x:

For unmarked states (x != 101):
2*(1/sqrt(8))*(3/4) - 1/(2sqrt(2)) = 3/(2sqrt(8)) - 1/(2sqrt(2))
= 3/(4sqrt(2)) - 2/(4sqrt(2)) = 1/(4sqrt(2)) approx 0.1768

For marked state |101>:
2*(1/sqrt(8))*(3/4) - (-1/(2sqrt(2))) = 3/(4sqrt(2)) + 2/(4sqrt(2)) = 5/(4sqrt(2)) approx 0.8839

After iteration 1:
- Unmarked amplitudes: 1/(4sqrt(2)) approx 0.1768
- Marked amplitude: 5/(4sqrt(2)) approx 0.8839
- Success probability: (5/(4sqrt(2)))^2 = 25/32 approx 0.7813

**Iteration 2:**

Oracle: flip amplitude of |101>.
- Unmarked: 1/(4sqrt(2))
- Marked: -5/(4sqrt(2))

<s|psi> = (1/sqrt(8))[7*(1/(4sqrt(2))) + (-5/(4sqrt(2)))] = (1/sqrt(8)) * (2/(4sqrt(2))) = (1/sqrt(8))*(1/(2sqrt(2))) = 1/(2*4) = 1/8

Diffusion:
Unmarked: 2*(1/sqrt(8))*(1/8) - 1/(4sqrt(2)) = 1/(4sqrt(8)) - 1/(4sqrt(2))
= 1/(8sqrt(2)) - 2/(8sqrt(2)) = -1/(8sqrt(2)) approx -0.0884

Marked: 2*(1/sqrt(8))*(1/8) - (-5/(4sqrt(2))) = 1/(8sqrt(2)) + 5/(4sqrt(2))
= 1/(8sqrt(2)) + 10/(8sqrt(2)) = 11/(8sqrt(2)) approx 0.9723

After iteration 2:
- Unmarked amplitudes: -1/(8sqrt(2)) approx -0.0884
- Marked amplitude: 11/(8sqrt(2)) approx 0.9723
- Success probability: (11/(8sqrt(2)))^2 = 121/128 approx 0.9453
- Verification: 7*(1/128) + 121/128 = 128/128 = 1. Consistent.

**Iteration 3 (overshooting):**

Oracle: flip marked amplitude.
- Unmarked: -1/(8sqrt(2))
- Marked: -11/(8sqrt(2))

<s|psi> = (1/sqrt(8))[7*(-1/(8sqrt(2))) + (-11/(8sqrt(2)))] = (1/sqrt(8))*(-18/(8sqrt(2))) = -18/(8*4) = -18/32 = -9/16

Unmarked: 2*(1/sqrt(8))*(-9/16) - (-1/(8sqrt(2))) = -9/(8sqrt(8)) + 1/(8sqrt(2))
= -9/(16sqrt(2)) + 2/(16sqrt(2)) = -7/(16sqrt(2)) approx -0.3094

Marked: 2*(1/sqrt(8))*(-9/16) - (-11/(8sqrt(2))) = -9/(16sqrt(2)) + 11/(8sqrt(2))
= -9/(16sqrt(2)) + 22/(16sqrt(2)) = 13/(16sqrt(2)) approx 0.5747

Success probability: (13/(16sqrt(2)))^2 = 169/512 approx 0.3301

**Summary table:**

| Iteration k | Marked amplitude | Success P(k) |
|-------------|-----------------|--------------|
| 0 | 1/(2sqrt(2)) = 0.3536 | 1/8 = 0.1250 |
| 1 | 5/(4sqrt(2)) = 0.8839 | 25/32 = 0.7813 |
| 2 | 11/(8sqrt(2)) = 0.9723 | 121/128 = 0.9453 |
| 3 | 13/(16sqrt(2)) = 0.5747 | 169/512 = 0.3301 |

Optimal: k=2 iterations, success probability 94.5%.

**Worked Example C8-E3: Grover with N=8 and M=2 marked items (|010> and |101>).**

M = 2, theta = arcsin(sqrt(2/8)) = arcsin(1/2) = pi/6.
k_opt: (2k+1)*pi/6 = pi/2, so k = 1.

Step 0: All amplitudes 1/(2sqrt(2)) approx 0.3536.

Iteration 1:
Oracle flips |010> and |101>: both get amplitude -1/(2sqrt(2)).

<s|psi> = (1/sqrt(8))[6*(1/(2sqrt(2))) + 2*(-1/(2sqrt(2)))] = (1/sqrt(8))*(4/(2sqrt(2))) = (1/sqrt(8))*(sqrt(2)) = 1/2

Diffusion:
Unmarked: 2*(1/sqrt(8))*(1/2) - 1/(2sqrt(2)) = 1/sqrt(8) - 1/(2sqrt(2))
= 1/(2sqrt(2)) - 1/(2sqrt(2)) = 0

Marked: 2*(1/sqrt(8))*(1/2) - (-1/(2sqrt(2))) = 1/(2sqrt(2)) + 1/(2sqrt(2)) = 1/sqrt(2) approx 0.7071

After 1 iteration:
- Unmarked amplitudes: 0
- Marked amplitudes: 1/sqrt(2) each
- Success probability: 2*(1/sqrt(2))^2 = 1.0 (certainty)

With M=2 and N=8, one iteration gives perfect success. The geometric angle is pi/6, and (2*1+1)*pi/6 = pi/2 exactly.

**Worked Example C8-E4: Diffusion operator matrix for n=2.**

N = 4 (2 qubits). D = 2|s><s| - I where |s> = (1/2)(|00>+|01>+|10>+|11>).

|s><s| = (1/4) * [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]]

2|s><s| = (1/2) * [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]]

D = 2|s><s| - I =
[[-1/2, 1/2, 1/2, 1/2],
 [1/2, -1/2, 1/2, 1/2],
 [1/2, 1/2, -1/2, 1/2],
 [1/2, 1/2, 1/2, -1/2]]

Verification: D is symmetric. D^2 = I (diagonal elements of D^2: (-1/2)^2 + 3*(1/2)^2 = 1/4 + 3/4 = 1; off-diagonal: 2*(-1/2)*(1/2) + 2*(1/2)*(1/2) = -1/2 + 1/2 = 0). Confirmed.

Circuit implementation: D = (H tensor H)(2|00><00|-I)(H tensor H), where 2|00><00|-I = diag(1,-1,-1,-1) is implemented as X on both qubits, then CZ (controlled-Z), then X on both qubits.

---

### C8.6 Common Confusions

**Confusion 1: "Grover's algorithm searches a physical database."**
The algorithm does NOT search a database stored in memory. It searches through the outputs of a BLACK-BOX function. The "database" framing is a pedagogical metaphor. In practice, the oracle must be implemented as a quantum circuit, and the cost of building the oracle (which encodes the problem structure) can dominate the total runtime. Grover gives a quadratic speedup in the number of ORACLE CALLS, not necessarily in total runtime.

**Confusion 2: "Grover gives exponential speedup."**
The speedup is QUADRATIC: O(sqrt(N)) vs O(N). This is significant but not exponential. For N = 10^6, classical needs ~10^6 queries, quantum needs ~10^3. Exponential speedup would mean O(log N) queries, which is NOT what Grover achieves. Shor's algorithm (C10) provides an (effectively) exponential speedup for factoring; Grover does not.

**Confusion 3: "More Grover iterations always help."**
This is perhaps the most dangerous misconception. Grover iterations follow a SINUSOIDAL pattern: the success probability oscillates. Applying too many iterations (overshooting) can reduce the success probability to nearly zero. You must stop at (approximately) the right iteration count. This is fundamentally different from classical search, where more work monotonically improves the result.

**Confusion 4: "The diffusion operator `looks at` all the data."**
The diffusion operator D = 2|s><s|-I does NOT query the oracle. It is a fixed unitary that depends only on N (the size of the search space), not on which items are marked. The oracle O_f is the ONLY component that "knows" the answer. Grover's algorithm alternates between the oracle (which provides problem-specific information) and the diffusion (which amplifies amplitude toward marked items).

**Confusion 5: "Grover's algorithm works for structured search problems too."**
For structured problems (where the items have known relationships), there may be better algorithms than Grover. For example, searching a sorted list classically takes O(log N) via binary search, and no quantum algorithm can do better than O(log N) for sorted search. Grover's O(sqrt(N)) is optimal only for UNSTRUCTURED search where the oracle is the sole source of information.

**Confusion 6: "With M unknown, we cannot use Grover."**
If M is unknown, we can use exponential search: run Grover with k=1, then k=2, then k=4, etc., doubling the iteration count each time. The total number of oracle queries is still O(sqrt(N/M)). Alternatively, quantum counting (C9 prerequisite: phase estimation applied to the Grover operator) can estimate M before running the search.

**Confusion 7: "The BBBV bound means no quantum speedup beyond quadratic is possible for ANY problem."**
The BBBV bound applies only to UNSTRUCTURED search (black-box model). For structured problems, exponential quantum speedups are possible (e.g., Shor's algorithm for factoring). The black-box model is a specific and deliberately limited computational model.

---

### C8.7 Cross-References

| Reference | Direction | Nature |
|-----------|-----------|--------|
| C6 (Deutsch-Jozsa) | Prerequisite | Phase oracle and phase kickback mechanism |
| C7 (Teleportation) | Prerequisite | Bell basis measurement technique, circuit tracing skills |
| A5 (Tensor products) | Prerequisite | Multi-qubit state space structure |
| A6 (Probability/Born rule) | Prerequisite | Measurement probabilities, amplitude interpretation |
| C5 (Universal gates) | Background | Oracle circuit decomposition |
| C4 (Multi-qubit systems) | Background | Multi-qubit gates, entanglement concepts |
| C9 (QFT & Phase Estimation) | Forward | Quantum counting uses QPE on Grover operator; QPE uses amplitude amplification |
| C10 (Shor) | Forward | Shor uses QPE which can be boosted by amplitude amplification |
| P6 (Bell/CHSH) | Parallel | Both demonstrate quantum advantage over classical |

---

### C8.8 Historical Notes

**Lov Grover (1996).** Grover, a researcher at Bell Labs, published "A fast quantum mechanical algorithm for database search" in the Proceedings of the 28th Annual ACM Symposium on Theory of Computing. The paper introduced the amplitude amplification idea and showed that an unstructured search of N items could be performed in O(sqrt(N)) quantum queries. Grover's original presentation was somewhat different from the modern geometric interpretation -- he described the algorithm in terms of "selective inversions" and showed the quadratic speedup by direct calculation of amplitudes.

**Bennett, Bernstein, Brassard, and Vazirani (1997).** The optimality of Grover's algorithm was proved in "Strengths and Weaknesses of Quantum Computing." The BBBV lower bound shows that any quantum algorithm for unstructured search requires Omega(sqrt(N)) queries. This was one of the first quantum lower bounds and established that the quadratic speedup is the best possible for black-box search. The paper also showed that relative to a random oracle, BQP does not contain NP, suggesting that quantum computers cannot solve NP-complete problems efficiently in general.

**Boyer, Brassard, Hoyer, and Tapp (1998).** "Tight bounds on quantum searching" refined Grover's analysis, showing the exact optimal iteration count and analyzing the case of multiple solutions. They also introduced the exponential search strategy for unknown M.

**Brassard, Hoyer, Mosca, and Tapp (2000).** Generalised Grover's algorithm to the "amplitude amplification" framework: given any quantum subroutine that produces the correct answer with probability p, amplitude amplification can boost the success probability to near-certainty using O(1/sqrt(p)) repetitions. This abstraction is widely used in quantum algorithm design.

**Practical considerations.** As of 2025, Grover's algorithm has been demonstrated on small-scale quantum computers (3-4 qubits) but is not yet practical for large-scale search due to limited qubit counts and decoherence. The quadratic speedup, while valuable, requires fault-tolerant quantum computers with thousands of logical qubits. For cryptographic applications, Grover's algorithm implies that symmetric key lengths should be doubled (e.g., AES-128 to AES-256) to maintain the same security level against quantum adversaries.

---

### C8.9 Problem Set

**Problem C8-P1 (Oracle construction).** Write the 8x8 matrix for the phase oracle O_f that marks |101> among 3-qubit states. Verify that O_f is diagonal with entries +/-1 and that O_f^2 = I.

**Problem C8-P2 (Diffusion matrix).** Compute the 8x8 diffusion matrix D = 2|s><s|-I for n=3 qubits. Verify that D is symmetric, D^2=I, and D|s> = |s>.

**Problem C8-P3 (N=4, different marked item).** Run Grover's algorithm for N=4 with marked item |01> (instead of |11>). Trace the full state vector. Verify that 1 iteration gives success probability 1.

**Problem C8-P4 (Geometric verification).** For N=8 and M=1, compute theta = arcsin(1/sqrt(8)). Verify that (2*2+1)*theta is close to pi/2. Calculate sin^2((2*2+1)*theta) and compare to the success probability 121/128 from Worked Example C8-E2. [They should match.]

**Problem C8-P5 (Overshooting analysis).** For N=16 and M=1, compute the optimal number of iterations k_opt. Calculate the success probability after k_opt, k_opt+1, and k_opt-1 iterations. By how much does overshooting by 1 iteration reduce the success probability?

**Problem C8-P6 (Multiple solutions).** For N=8 and M=3 (marked items |001>, |011>, |101>), compute theta, determine k_opt, and trace one iteration of Grover's algorithm. What is the success probability after k_opt iterations?

**Problem C8-P7 (Diffusion circuit).** Draw the circuit for the diffusion operator D when n=3. Your circuit should use only H, X, and a 3-qubit controlled-Z gate (or Toffoli + phase). How many elementary gates are needed?

**Problem C8-P8 (BBBV bound application).** A quantum computer runs Grover's algorithm on a search space of size N = 2^50. (a) How many oracle queries are needed? (b) If each query takes 1 microsecond, how long does the search take? (c) Compare to a classical computer performing 10^9 queries per second.

**Problem C8-P9 (Amplitude amplification).** A quantum algorithm A produces the correct answer with probability p = 1/100. How many calls to A (and A^{-1}) are needed to boost the success probability to at least 99% using amplitude amplification? Compare to classical repetition.

**Problem C8-P10 (Simulator exercise -- N=4).** Implement Grover's algorithm in the qubit simulator for N=4 with marked item |10>. Run 1 iteration and verify the success probability is 1. Display the state vector before and after the iteration.

**Problem C8-P11 (Simulator exercise -- N=8).** Implement Grover's algorithm for N=8 with marked item |110>. Run 0, 1, 2, and 3 iterations. Record the success probability at each step. Verify the overshooting phenomenon.

**Problem C8-P12 (Cryptographic implication).** AES-128 uses a 128-bit key. A brute-force classical search requires 2^128 operations in the worst case. With Grover, how many quantum queries are needed? If each quantum query takes 10 nanoseconds, how long would the quantum attack take? Is this practical? What key length would provide "128-bit quantum security"?

---

### C8.10 Simulator Dependencies

**Required simulator:** Qubit circuit simulator (from simulator-spec.md, Section 2)

**Specific features used:**
- Circuit construction: H, X, Z, CNOT, Toffoli, multi-controlled Z
- Phase oracle as a configurable gate (user selects which items to mark)
- Diffusion operator as a composite gate (ideally a single "Grover diffusion" block that expands to show sub-gates)
- State vector display at each step, with amplitudes shown as bar charts
- Up to 4 qubits (3 query + oracle embedded) for N=8 examples; ideally 5-6 qubits for richer exploration
- Iteration counter: ability to step through Grover iterations one at a time
- Success probability display: a running counter showing P(marked) = sum of squared amplitudes of marked items
- "Show me the algebra" mode: display the matrix multiplication at each step

**Simulator exercises in this lesson:**
1. N=4 Grover search (2 qubits): single iteration, perfect success
2. N=8 Grover search (3 qubits): multiple iterations, observe amplitude growth and overshooting
3. N=8 with M=2: single iteration, perfect success

**Pre-built circuit templates:**
- Template GRV-1: Grover for N=4, selectable marked item
- Template GRV-2: Grover for N=8, selectable marked item, iteration stepper
- Template GRV-3: Grover for N=8 with 2 marked items
- Template GRV-4: Overshooting demonstration (N=8, auto-runs 0-5 iterations with probability display)

---

### C8.11 Estimates

| Item | Estimate |
|------|----------|
| Prose -- Part 1 (stages 1-7) | 5,000-6,000 words |
| Prose -- Part 2 (stages 8-14) | 5,000-6,000 words |
| Theorems and proofs | 2,000-2,500 words |
| Worked examples (4 examples with full state traces) | 3,000-3,500 words |
| Problem set (12 problems with setup text) | 1,500-2,000 words |
| Historical notes | 600-800 words |
| Total | 17,100-20,800 words |
| Figures/diagrams | 9 visual assets |
| Simulator templates | 4 pre-built circuits |
| Estimated reading time | 60-75 minutes |
| Estimated completion time (with problems) | 4-5 hours |

---

### C8.12 Page Splits

**Two pages** as specified in the site architecture.

**Part 1** (`/lessons/c8-grover/part-1`): "Oracle Construction and the Algorithm"
- Sections: motivation, phase oracle, uniform superposition, oracle step, diffusion operator derivation, single iteration, multiple iterations
- Worked Examples: C8-E1 (N=4), C8-E4 (diffusion matrix)
- Target: 8,000-10,000 words
- Internal anchors: `#search-problem`, `#phase-oracle`, `#superposition`, `#diffusion`, `#algorithm`, `#iterations`

**Part 2** (`/lessons/c8-grover/part-2`): "Geometric Interpretation, Optimality, and Extensions"
- Sections: 2D subspace, rotation interpretation, optimal count, overshooting, multiple solutions, BBBV lower bound, amplitude amplification
- Worked Examples: C8-E2 (N=8 full trace), C8-E3 (M=2)
- Target: 7,000-8,000 words
- Internal anchors: `#2d-subspace`, `#rotation`, `#optimal-count`, `#overshooting`, `#multiple-solutions`, `#bbbv`, `#amplitude-amplification`

The split is natural: Part 1 teaches you HOW to run the algorithm; Part 2 teaches you WHY it works and how well. A student can complete Part 1 and use Grover's algorithm competently; Part 2 provides deeper understanding.

---

---

## C9 -- Quantum Fourier Transform & Phase Estimation

**Canonical position:** 22
**Slug:** `c9-qft`
**Prerequisites:** C8 (Grover's Algorithm), A4 (Eigenvalues/spectral theorem), A5 (Tensor products)
**Page structure:** 2 parts (`part-1`: Classical DFT review and QFT derivation; `part-2`: Phase estimation algorithm and error analysis)
**Target length:** 15,000-18,000 words

---

### C9.1 Learning Objectives

By the end of this lesson, the student will be able to:

1. **Define** the discrete Fourier transform (DFT) on N points and write the DFT matrix, identifying the primitive Nth root of unity omega = e^{2*pi*i/N}.
2. **Write** the quantum Fourier transform (QFT) as the map |j> -> (1/sqrt(N)) sum_{k=0}^{N-1} e^{2*pi*i*j*k/N} |k> and compute QFT matrices explicitly for N=2, N=4, and N=8.
3. **Recognise** that the QFT for N=2 is the Hadamard gate, connecting new material to familiar territory.
4. **Derive** the product representation of the QFT output: the state (1/sqrt(N)) sum_k e^{2*pi*i*j*k/N} |k> can be written as a tensor product of single-qubit states, one for each qubit of the output register.
5. **Construct** the QFT circuit from the product representation: a sequence of Hadamard gates and controlled-R_k rotation gates, requiring O(n^2) gates for n qubits.
6. **Define** the phase estimation problem: given a unitary U with eigenstate |u> satisfying U|u> = e^{2*pi*i*phi}|u>, estimate the phase phi using t ancilla qubits.
7. **Derive** the phase estimation circuit: prepare a control register in |0>^t, apply controlled-U^{2^k} for each control qubit k, apply the inverse QFT to the control register, and measure.
8. **Prove** that when phi = m/2^t (exact t-bit representation), the measurement yields m with certainty.
9. **Analyse** the error when phi does not have an exact t-bit representation, showing the measurement yields the closest t-bit approximation with high probability, and bounding the error probability.
10. **Connect** phase estimation to Shor's algorithm (C10) as the key subroutine, and to quantum counting as an application to Grover (C8).

---

### C9.2 Intuition Arc

**Part 1: Classical DFT Review and QFT Derivation**

**Stage 1 -- Why Fourier transforms matter (10 min).** We open with the big picture: Fourier transforms convert between "time domain" and "frequency domain" representations. In classical computing, the Fast Fourier Transform (FFT) is one of the most important algorithms -- it underlies signal processing, image compression, polynomial multiplication, and much more. In quantum computing, the QFT plays an analogous role: it is the engine that powers Shor's algorithm, quantum counting, and the hidden subgroup framework. The QFT is not just a quantum analogue of the FFT -- it is EXPONENTIALLY faster (O(n^2) gates vs O(N*log(N)) = O(n*2^n) operations classically, where N = 2^n).

**Stage 2 -- Classical DFT review (15 min).** We define the DFT rigorously. Given a vector (x_0, x_1, ..., x_{N-1}) in C^N, the DFT produces (y_0, y_1, ..., y_{N-1}) where y_k = sum_{j=0}^{N-1} x_j * omega^{jk} and omega = e^{2*pi*i/N} is the primitive Nth root of unity. We write the DFT matrix F_N with entries F_{kj} = omega^{jk}. Key properties: F_N is symmetric, F_N * F_N^dagger = N * I (so (1/sqrt(N))*F_N is unitary), and omega^N = 1. We compute F_2, F_4 explicitly with actual numbers.

**F_2 (N=2, omega = e^{i*pi} = -1):**
F_2 = [[1, 1],[1, -1]]
Note: (1/sqrt(2)) F_2 is exactly the Hadamard matrix H! The QFT on 1 qubit IS the Hadamard gate.

**F_4 (N=4, omega = e^{i*pi/2} = i):**
F_4 = [[1, 1, 1, 1],[1, i, -1, -i],[1, -1, 1, -1],[1, -i, -1, i]]
We verify: F_4 * F_4^dagger = 4*I.

**Stage 3 -- From classical DFT to quantum QFT (15 min).** The quantum Fourier transform is defined as the unitary operator that maps computational basis states as:

QFT|j> = (1/sqrt(N)) sum_{k=0}^{N-1} e^{2*pi*i*j*k/N} |k>

This is the DFT matrix (normalised) acting on the computational basis. For N = 2^n, we work with n qubits. The matrix of the QFT in the computational basis is (1/sqrt(N)) * F_N. We write this out for N=2 (Hadamard), N=4, and N=8.

Key insight: the QFT does NOT compute the DFT of a classically stored vector. It transforms the AMPLITUDES of a quantum state. You cannot directly read out the Fourier-transformed amplitudes (that would require measurement, which collapses the state). The power of the QFT comes from using it as a SUBROUTINE within a larger algorithm (like phase estimation).

**Stage 4 -- The product representation (25 min).** This is the most important derivation in Part 1 and the key to the efficient circuit. We write j in binary: j = j_1 j_2 ... j_n (where j_1 is the most significant bit). Then:

QFT|j_1 j_2 ... j_n> = (1/sqrt(2^n)) tensor_{l=1}^{n} (|0> + e^{2*pi*i*j/2^l} |1>)

But e^{2*pi*i*j/2^l} depends only on the last l bits of j (since the higher bits contribute integer multiples of 2*pi). Specifically:

e^{2*pi*i*j/2^l} = e^{2*pi*i * 0.j_{n-l+1} j_{n-l+2} ... j_n}

where 0.j_{n-l+1}...j_n is the binary fraction.

So:
QFT|j_1...j_n> = (1/sqrt(2^n)) (|0>+e^{2*pi*i*0.j_n}|1>) tensor (|0>+e^{2*pi*i*0.j_{n-1}j_n}|1>) tensor ... tensor (|0>+e^{2*pi*i*0.j_1j_2...j_n}|1>)

We derive this step by step from the definition, using the binary expansion of j and k.

The product form reveals that the QFT output is a TENSOR PRODUCT of single-qubit states -- no entanglement! Each output qubit depends on a different subset of input bits. This factorisation is what makes the QFT efficiently implementable.

**Stage 5 -- The QFT circuit (20 min).** From the product representation, we read off the circuit. The first output qubit (rightmost in the product) depends on all input bits j_1, ..., j_n. It is created by: H on qubit 1 (giving |0>+(-1)^{j_1}|1> = |0>+e^{2*pi*i*0.j_1}|1>), then controlled-R_2 with qubit 2 as control (adding phase e^{2*pi*i*j_2/4} when qubit 2 is |1>), then controlled-R_3 with qubit 3 as control, etc. Here R_k = diag(1, e^{2*pi*i/2^k}) is a phase rotation gate.

The full circuit pattern:
1. Apply H to qubit 1. Apply controlled-R_2 (control=qubit 2), controlled-R_3 (control=qubit 3), ..., controlled-R_n (control=qubit n).
2. Apply H to qubit 2. Apply controlled-R_2 (control=qubit 3), ..., controlled-R_{n-1} (control=qubit n).
3. Continue until qubit n, which just gets H.
4. Apply SWAP gates to reverse the qubit order (since the product representation has reversed bit order).

Gate count: n Hadamards + n(n-1)/2 controlled rotations + O(n) SWAPs = O(n^2) gates total. For N = 2^n items, this is O(log^2(N)) gates -- exponentially better than the classical FFT's O(N log N).

**Stage 6 -- QFT circuit examples (10 min).** We draw the circuit for n=2 and n=3, labelling every gate and showing the state at each step for a specific input.

**Part 2: Phase Estimation Algorithm and Error Analysis**

**Stage 7 -- The phase estimation problem (10 min).** We set up the problem: given a unitary U and one of its eigenstates |u> with U|u> = e^{2*pi*i*phi}|u>, estimate the phase phi in [0,1). This seems circular (you need the eigenstate to estimate the eigenvalue), but we will see in C10 that for Shor's algorithm, you do NOT need to explicitly prepare |u> -- a clever trick using superposition of eigenstates suffices.

**Stage 8 -- The phase estimation circuit (20 min).** The circuit uses two registers: a t-qubit control register (initialised to |0>^t) and a register holding the eigenstate |u>. The steps are:
1. Apply H^{tensor t} to the control register, creating (1/sqrt(2^t)) sum_{k=0}^{2^t-1} |k>.
2. Apply controlled-U^{2^j} for each control qubit j (j=0,1,...,t-1), with the jth control qubit controlling U^{2^j} on the |u> register.
3. Since U|u> = e^{2*pi*i*phi}|u>, the controlled-U^{2^j} adds a phase e^{2*pi*i*phi*2^j} to the jth control qubit when it is |1>.
4. After all controlled operations, the control register is in the state (1/sqrt(2^t)) sum_{k=0}^{2^t-1} e^{2*pi*i*phi*k} |k>.
5. This is EXACTLY the QFT of the state |round(2^t * phi)>! (When phi has an exact t-bit representation.)
6. Apply the INVERSE QFT to the control register.
7. Measure the control register. The outcome is the best t-bit approximation to 2^t * phi.

We derive each step in full detail, paying close attention to the phase accumulation.

**Stage 9 -- Exact case: phi = m/2^t (15 min).** When phi has an exact t-bit binary representation, phi = m/2^t for integer m. Then the control register after the controlled operations is in state (1/sqrt(2^t)) sum_{k=0}^{2^t-1} e^{2*pi*i*m*k/2^t} |k> = QFT|m>. Applying the inverse QFT gives |m> exactly. Measurement yields m with certainty, and phi = m/2^t is recovered exactly.

We verify this for a specific example: t=3, phi = 3/8 (so m=3). The control register state before inverse QFT is (1/sqrt(8)) sum_{k=0}^{7} e^{2*pi*i*3k/8} |k>. We compute all 8 amplitudes, apply QFT^{-1}, and verify we get |011> = |3>.

**Stage 10 -- Inexact case: error analysis (20 min).** When phi does NOT have an exact t-bit representation, the measurement outcome is a random variable. We show that the probability of measuring the closest t-bit approximation m_0 = round(2^t * phi) is:

P(m_0) >= 4/pi^2 approx 0.405

This is already a constant probability, but we can boost it. Using t + ceil(log(1/epsilon)) + ceil(log(2)) extra qubits, we can make the error probability at most epsilon.

The derivation uses the geometric series formula: the probability of measuring m is |(1/2^t) sum_{k=0}^{2^t-1} e^{2*pi*i*(phi - m/2^t)*k}|^2 = (1/2^{2t}) |sin(pi*(2^t*phi - m))/sin(pi*(phi - m/2^t))|^2 (using the geometric sum formula for |sum e^{i*alpha*k}|^2). When m = m_0 (the closest integer), 2^t*phi - m_0 is at most 1/2, and the probability is bounded below.

**Stage 11 -- Inverse QFT circuit (10 min).** The inverse QFT is the conjugate transpose of the QFT circuit: reverse the order of gates and replace each R_k with R_k^dagger (negating the rotation angle). We show the circuit for n=3.

**Stage 12 -- Connection to Shor's algorithm (10 min, conclusion).** We preview how phase estimation is used in Shor's algorithm (C10). The unitary U_a is "multiply by a mod N," its eigenstates are Fourier-related to the period r of the function a^x mod N, and the phase estimation extracts s/r. We also briefly describe quantum counting: applying phase estimation to the Grover operator G to estimate the angle theta, which reveals M (the number of marked items) without knowing it in advance.

---

### C9.3 Theorems and Proof Sketches

**Theorem C9.1 (QFT is unitary).** The operator QFT_N with matrix elements (1/sqrt(N)) * omega^{jk} where omega = e^{2*pi*i/N} is unitary.

*Proof.* We need to show QFT^dagger * QFT = I. The (j,j')-entry of QFT^dagger * QFT is:
(1/N) sum_{k=0}^{N-1} omega^{-kj} * omega^{kj'} = (1/N) sum_k omega^{k(j'-j)}

For j' = j: this is (1/N)*N = 1. For j' != j: this is (1/N) * (omega^{N(j'-j)} - 1)/(omega^{j'-j} - 1) = (1/N)*(1-1)/(omega^{j'-j}-1) = 0 (since omega^{N(j'-j)} = (e^{2*pi*i/N})^{N(j'-j)} = e^{2*pi*i*(j'-j)} = 1). QED.

**Theorem C9.2 (Product representation of QFT).** For N = 2^n and j = j_1*2^{n-1} + j_2*2^{n-2} + ... + j_n (binary expansion), the QFT output can be written as:

QFT|j_1 j_2 ... j_n> = (1/sqrt(2^n)) product_{l=1}^{n} (|0> + e^{2*pi*i*j*2^{-l}} |1>)

with the tensor product order giving qubit l the phase that depends on j_{n-l+1}, ..., j_n.

*Proof sketch.* Start from the definition: QFT|j> = (1/sqrt(N)) sum_{k=0}^{N-1} e^{2*pi*i*j*k/N} |k>. Write k in binary: k = k_1*2^{n-1} + ... + k_n. Then:

e^{2*pi*i*j*k/2^n} = product_{l=1}^{n} e^{2*pi*i*j*k_l*2^{l-1}/2^n} = product_{l=1}^{n} e^{2*pi*i*j*k_l/2^{n-l+1}}

And the sum over k factors into a product of independent sums over each k_l in {0,1}:

sum_{k=0}^{N-1} e^{2*pi*i*j*k/N} |k_1...k_n> = product_{l=1}^{n} sum_{k_l=0}^{1} e^{2*pi*i*j*k_l/2^{n-l+1}} |k_l>
= product_{l=1}^{n} (|0> + e^{2*pi*i*j/2^{n-l+1}} |1>)

Substituting back with the normalisation factor gives the result. The key step is that e^{2*pi*i*j/2^{n-l+1}} depends only on the last n-l+1 bits of j (the higher bits contribute integer multiples of 2*pi and hence phases of 1). QED.

**Theorem C9.3 (QFT circuit complexity).** The QFT on n qubits can be implemented with n Hadamard gates, n(n-1)/2 controlled phase rotation gates, and at most n/2 SWAP gates, for a total of O(n^2) gates.

*Proof.* Follows directly from the product representation. Each output qubit l requires: 1 Hadamard and (l-1) controlled rotation gates. Summing: n + sum_{l=1}^{n}(l-1) = n + n(n-1)/2 = O(n^2). The SWAPs reverse the qubit order at the end, requiring at most floor(n/2) SWAP gates. QED.

**Theorem C9.4 (Phase estimation, exact case).** If U|u> = e^{2*pi*i*phi}|u> and phi = m/2^t for some integer m, then the phase estimation algorithm with t control qubits outputs m with certainty.

*Proof.* After the controlled-U operations, the control register is in state:
|psi> = (1/sqrt(2^t)) sum_{k=0}^{2^t-1} e^{2*pi*i*phi*k} |k> = (1/sqrt(2^t)) sum_k e^{2*pi*i*mk/2^t} |k> = QFT|m>

Applying QFT^{-1} gives QFT^{-1}(QFT|m>) = |m>. Measurement yields m with certainty. QED.

**Theorem C9.5 (Phase estimation, error bound).** If phi does not have an exact t-bit representation, the probability of measuring the integer m closest to 2^t*phi satisfies P(m) >= 4/pi^2 approx 0.405. More generally, the probability of measuring any integer m such that |m - 2^t*phi| > e (for integer e >= 1) is at most 1/(2(2^e - 2)).

*Proof sketch.* The probability of measuring m is:
P(m) = |(1/2^t) sum_{k=0}^{2^t-1} e^{2*pi*i*(phi-m/2^t)*k}|^2

Using the geometric series sum: sum_{k=0}^{M-1} r^k = (r^M - 1)/(r-1), with r = e^{2*pi*i*delta} where delta = phi - m/2^t:

P(m) = (1/2^{2t}) |sin(pi*2^t*delta)/sin(pi*delta)|^2

When m is the closest integer to 2^t*phi, |delta| <= 1/2^{t+1}, and the lower bound 4/pi^2 follows from |sin(pi*x)/sin(pi*x/2^t)| >= 2^t * 2/pi for |x| <= 1/2. For the tail bound, when |m - 2^t*phi| > e, |delta| > e/2^t, and the sum is bounded by 1/(2*sin(pi*e/2^t)) <= 2^t/(2*pi*e), giving P(m) <= 1/(2^t * 2 * e) after squaring and summing. QED (sketch; full proof involves careful bounding of the sinc-like function).

---

### C9.4 Visual Assets

**Visual C9-V1: DFT as a matrix operation.** A visual showing the input vector x, the DFT matrix F_N (colour-coded by phase of each entry), and the output vector y = F_N * x. For N=4, showing the 4x4 matrix with entries 1, i, -1, -i colour-coded on the complex plane.

**Visual C9-V2: Roots of unity.** The Nth roots of unity plotted on the unit circle in the complex plane, for N=2, 4, 8. The angle between consecutive roots is 2*pi/N. Each root is labelled omega^k. This visual is referenced throughout the lesson.

**Visual C9-V3: QFT circuit for n=2.** A 2-qubit circuit: H on qubit 1, controlled-R_2 (control=qubit 2, target=qubit 1), H on qubit 2, SWAP qubits 1 and 2. State labels at each step. The R_2 gate is explicitly identified as the S gate (pi/2 phase shift).

**Visual C9-V4: QFT circuit for n=3.** A 3-qubit circuit: H on qubit 1, CR_2(2->1), CR_3(3->1), H on qubit 2, CR_2(3->2), H on qubit 3, SWAPs. More complex but follows the same pattern. This is the circuit students will implement in the simulator.

**Visual C9-V5: Product representation visualisation.** For a specific input (e.g., |j> = |101> = |5>), showing the output as a tensor product of three single-qubit states, each depicted on the Bloch sphere. The phase of each qubit's |1> component is shown as an angle on the equator of the Bloch sphere.

**Visual C9-V6: Phase estimation circuit.** The full QPE circuit: t control qubits on top (initialised to |0>), eigenstate register on the bottom (initialised to |u>). H^{tensor t} on control register, controlled-U^{2^0}, controlled-U^{2^1}, ..., controlled-U^{2^{t-1}}, inverse QFT on control register, measurement on control register. Classical output labelled "estimate of 2^t * phi."

**Visual C9-V7: Phase estimation -- exact case.** A bar chart showing the probability distribution over measurement outcomes for the exact case (phi = 3/8, t=3). All probability concentrated at outcome m=3. Clean, unambiguous.

**Visual C9-V8: Phase estimation -- inexact case.** A bar chart showing the probability distribution when phi is NOT an exact fraction of 2^t. Probability is concentrated near the closest integer approximation, with small tails on neighbouring outcomes. The peak probability is labelled ">=4/pi^2."

**Visual C9-V9: QFT vs FFT comparison.** A side-by-side comparison: Classical FFT on N numbers uses O(N log N) operations. QFT on n = log N qubits uses O(n^2) = O(log^2 N) gates. A dramatic bar chart showing the exponential gap for N = 2^10, 2^20, 2^30.

---

### C9.5 Worked Examples

**Worked Example C9-E1: QFT on |10> (N=4).**

Input: |10> = |2> (j=2 in decimal).
N = 4, n = 2, omega = e^{2*pi*i/4} = i.

QFT|2> = (1/2) sum_{k=0}^{3} e^{2*pi*i*2*k/4} |k> = (1/2) sum_k e^{i*pi*k} |k> = (1/2) sum_k (-1)^k |k>
= (1/2)(|00> - |01> + |10> - |11>)

Verification using the product representation:
j = 10 in binary, so j_1 = 1, j_2 = 0.
QFT|10> = (1/2)(|0> + e^{2*pi*i*2/2^1}|1>) tensor (|0> + e^{2*pi*i*2/2^2}|1>)
= (1/2)(|0> + e^{2*pi*i}|1>) tensor (|0> + e^{i*pi}|1>)
= (1/2)(|0> + |1>) tensor (|0> - |1>)
= (1/2)(|00> - |01> + |10> - |11>)

Both methods agree. Note the qubit ordering: the product representation naturally produces the output in reversed bit order, hence the need for SWAP at the end of the QFT circuit.

**Circuit trace for QFT|10>:**
Step 0: |10> (qubit 1 = |1>, qubit 2 = |0>)
Step 1 -- H on qubit 1: (|0>-|1>)/sqrt(2) tensor |0> = (|00>-|10>)/sqrt(2)
Step 2 -- Controlled-R_2 (control=qubit 2, target=qubit 1). Since qubit 2 = |0>, the gate does nothing.
State: (|00>-|10>)/sqrt(2)
Step 3 -- H on qubit 2: (1/2)(|0>-|1>)(|0>+|1>) = (1/2)(|00>+|01>-|10>-|11>)
Step 4 -- SWAP qubits: (1/2)(|00>+|10>-|01>-|11>) = (1/2)(|00>-|01>+|10>-|11>)

Final state: (1/2)(|00>-|01>+|10>-|11>). Matches the direct calculation!

**Worked Example C9-E2: QFT on |101> (N=8).**

Input: |101> = |5> (j=5 in decimal).
N = 8, n = 3, omega = e^{2*pi*i/8} = e^{i*pi/4}.

Direct computation:
QFT|5> = (1/sqrt(8)) sum_{k=0}^{7} e^{2*pi*i*5k/8} |k>
= (1/sqrt(8)) sum_k e^{i*5*pi*k/4} |k>

Computing each amplitude:
k=0: e^0 = 1
k=1: e^{i*5*pi/4} = cos(225 deg) + i*sin(225 deg) = -sqrt(2)/2 - i*sqrt(2)/2
k=2: e^{i*10*pi/4} = e^{i*5*pi/2} = e^{i*pi/2} = i
k=3: e^{i*15*pi/4} = e^{i*(-pi/4)} = cos(-45 deg) + i*sin(-45 deg) = sqrt(2)/2 - i*sqrt(2)/2
k=4: e^{i*20*pi/4} = e^{i*5*pi} = e^{i*pi} = -1
k=5: e^{i*25*pi/4} = e^{i*pi/4} = sqrt(2)/2 + i*sqrt(2)/2
k=6: e^{i*30*pi/4} = e^{i*15*pi/2} = e^{i*(-pi/2)} = -i
k=7: e^{i*35*pi/4} = e^{i*(-5*pi/4)} = e^{i*3*pi/4} = -sqrt(2)/2 + i*sqrt(2)/2

QFT|5> = (1/(2sqrt(2))) [|0> + (-sqrt(2)/2 - i*sqrt(2)/2)|1> + i|2> + (sqrt(2)/2 - i*sqrt(2)/2)|3> + (-1)|4> + (sqrt(2)/2 + i*sqrt(2)/2)|5> + (-i)|6> + (-sqrt(2)/2 + i*sqrt(2)/2)|7>]

Product representation verification:
j=101, j_1=1, j_2=0, j_3=1.

Qubit 1 (rightmost in product): |0> + e^{2*pi*i*0.j_1 j_2 j_3}|1> = |0> + e^{2*pi*i*0.101}|1>
0.101 in binary = 1/2 + 0/4 + 1/8 = 5/8.
So: |0> + e^{2*pi*i*5/8}|1> = |0> + e^{i*5*pi/4}|1>

Qubit 2: |0> + e^{2*pi*i*0.j_2 j_3}|1> = |0> + e^{2*pi*i*0.01}|1>
0.01 = 1/4. So: |0> + e^{i*pi/2}|1> = |0> + i|1>

Qubit 3 (leftmost in product): |0> + e^{2*pi*i*0.j_3}|1> = |0> + e^{2*pi*i*0.1}|1>
0.1 = 1/2. So: |0> + e^{i*pi}|1> = |0> - |1>

QFT|5> = (1/(2sqrt(2)))(|0>-|1>) tensor (|0>+i|1>) tensor (|0>+e^{i*5*pi/4}|1>)

(After reversing qubit order for the circuit output.) One can verify this tensor product equals the direct computation above.

**Worked Example C9-E3: Phase estimation with t=3, phi=3/8.**

Given: U|u> = e^{2*pi*i*(3/8)}|u>. We want to estimate phi = 3/8 using t=3 control qubits.
phi = 3/8 = 3/2^3, so m=3 and this is an exact case.

Step 0: Control register |000>, eigenstate |u>.

Step 1 -- H^{tensor 3} on control register:
(1/sqrt(8))(|000>+|001>+|010>+|011>+|100>+|101>+|110>+|111>) tensor |u>

Step 2 -- Controlled-U operations:
- Qubit 0 (least significant) controls U^{2^0} = U^1. Phase: e^{2*pi*i*3/8} = e^{i*3*pi/4}.
- Qubit 1 controls U^{2^1} = U^2. Phase: e^{2*pi*i*3*2/8} = e^{i*3*pi/2}.
- Qubit 2 (most significant) controls U^{2^2} = U^4. Phase: e^{2*pi*i*3*4/8} = e^{i*3*pi} = e^{i*pi} (mod 2*pi: 3*pi = pi + 2*pi, so this is -1... wait, e^{i*3*pi} = cos(3*pi)+i*sin(3*pi) = -1).

After controlled operations, each control qubit k in state |1> picks up phase e^{2*pi*i*phi*2^k}:

Control register state = (1/sqrt(8)) sum_{k=0}^{7} e^{2*pi*i*(3/8)*k} |k>

This is exactly QFT|3> (since phi = 3/8 = 3/2^3).

Step 3 -- Apply QFT^{-1} to control register:
QFT^{-1}(QFT|3>) = |3> = |011>

Step 4 -- Measure control register: outcome is 011 = 3 with certainty.
phi = 3/2^3 = 3/8. Recovered exactly!

**Worked Example C9-E4: Phase estimation with t=3, phi=1/3 (inexact).**

phi = 1/3 does not have an exact 3-bit binary representation. 2^3 * phi = 8/3 approx 2.667. The closest integers are m=3 (above) and m=2 (below). The closest is m=3 (distance 1/3) -- wait, |3 - 8/3| = 1/3 and |2 - 8/3| = 2/3. So m_0 = 3 is closest.

The control register after controlled-U operations is:
|psi> = (1/sqrt(8)) sum_{k=0}^{7} e^{2*pi*i*k/3} |k>

Probability of measuring m:
P(m) = (1/64)|sum_{k=0}^{7} e^{2*pi*i*k*(1/3 - m/8)}|^2

For m=3: delta = 1/3 - 3/8 = -1/24. 
P(3) = (1/64)|sum_{k=0}^{7} e^{-2*pi*i*k/24}|^2 = (1/64)|sum_{k=0}^{7} e^{-i*pi*k/12}|^2

Using geometric sum: sum = (1 - e^{-i*8*pi/12})/(1 - e^{-i*pi/12}) = (1 - e^{-i*2*pi/3})/(1 - e^{-i*pi/12})

|1 - e^{-i*2*pi/3}| = |1 - (-1/2 + i*sqrt(3)/2)| = |3/2 - i*sqrt(3)/2| = sqrt(9/4 + 3/4) = sqrt(3)
|1 - e^{-i*pi/12}| = 2*sin(pi/24) approx 2*0.1305 = 0.2610

P(3) = (1/64) * (sqrt(3)/0.2610)^2 = (1/64)*(3/0.0681) = (1/64)*44.07 = 0.689

So the probability of the best answer (m=3) is about 69%, which is above the guaranteed minimum of 4/pi^2 = 40.5%.

Similarly, P(2) is the next largest probability. For m=2: delta = 1/3 - 2/8 = 1/3 - 1/4 = 1/12.
P(2) = (1/64)|sum_{k=0}^{7} e^{2*pi*i*k/12}|^2

|sum| = |1 - e^{i*16*pi/12}| / |1 - e^{i*2*pi/12}| = |1 - e^{i*4*pi/3}| / |1 - e^{i*pi/6}|
= sqrt(3) / (2*sin(pi/12)) = sqrt(3)/(2*0.2588) = sqrt(3)/0.5176 = 3.346

P(2) = (1/64)*3.346^2 = 11.20/64 = 0.175

So P(3) + P(2) = 0.689 + 0.175 = 0.864. About 86.4% of the probability is on the two closest integers. The remaining ~13.6% is spread across the other 6 outcomes.

**Worked Example C9-E5: QFT^{-1} circuit for n=3.**

The inverse QFT reverses the QFT circuit: run the gates in reverse order, replacing each R_k with R_k^{dagger} (negating the rotation angle).

QFT^{-1} for n=3:
1. SWAP qubits 1 and 3 (undo the final SWAP of QFT)
2. H on qubit 3
3. Controlled-R_2^{dagger} (control=qubit 3, target=qubit 2)
4. H on qubit 2
5. Controlled-R_3^{dagger} (control=qubit 3, target=qubit 1)
6. Controlled-R_2^{dagger} (control=qubit 2, target=qubit 1)
7. H on qubit 1

Where R_k^{dagger} = diag(1, e^{-2*pi*i/2^k}).

---

### C9.6 Common Confusions

**Confusion 1: "The QFT computes the Fourier transform of classical data."**
The QFT transforms the AMPLITUDES of a quantum state. You cannot load a classical vector (x_0, ..., x_{N-1}) into a quantum computer and read out the Fourier transform directly (that would require O(N) steps just to read the output, negating any speedup). The QFT is powerful as a SUBROUTINE within algorithms that produce and consume quantum states.

**Confusion 2: "The QFT gives exponential speedup for computing Fourier transforms."**
The QFT uses O(n^2) gates vs O(N*n) = O(N*log(N)) for the FFT, where N=2^n. This looks like an exponential speedup, but the QFT and FFT solve DIFFERENT problems. The FFT takes a classical vector and outputs a classical vector. The QFT takes a quantum state and outputs a quantum state. The inputs and outputs are fundamentally different. The QFT is useful because it appears inside algorithms (like Shor's) that have efficient quantum input preparation and efficient classical output interpretation.

**Confusion 3: "Phase estimation requires preparing the eigenstate |u>."**
This seems like a chicken-and-egg problem, but in practice, phase estimation often works without explicitly preparing |u>. In Shor's algorithm, the input state |1> is a SUPERPOSITION of eigenstates, and the algorithm naturally extracts phase information from the mixture. The linearity of quantum mechanics ensures that phase estimation "works on each eigenstate independently."

**Confusion 4: "The controlled-U^{2^k} gates are expensive to implement."**
This depends on the specific unitary U. For some unitaries (like modular exponentiation in Shor's), U^{2^k} can be implemented efficiently by repeated squaring. For arbitrary U, U^{2^k} might require 2^k applications of U, which would be exponentially expensive. The efficiency of phase estimation depends critically on the structure of U.

**Confusion 5: "More control qubits always give better precision."**
True in principle (t control qubits give precision 2^{-t}), but each additional qubit doubles the size of the control register and requires one more controlled-U^{2^k} operation. The cost scales as O(t) controlled operations, each potentially expensive. There is a precision-cost trade-off.

**Confusion 6: "The QFT circuit requires the qubits to be in a specific order at the end."**
The QFT circuit naturally produces the output in REVERSED bit order compared to the standard computational basis labelling. The SWAP operations at the end correct this reversal. Some implementations omit the SWAPs (performing a "QFT without bit reversal") and account for the reversed order in the classical post-processing. This is particularly common in Shor's algorithm where the output is fed to a continued fractions algorithm anyway.

---

### C9.7 Cross-References

| Reference | Direction | Nature |
|-----------|-----------|--------|
| A4 (Eigenvalues/spectral theorem) | Prerequisite | Eigenstates and eigenvalues of unitary operators |
| A5 (Tensor products) | Prerequisite | Product representation of QFT |
| C8 (Grover's Algorithm) | Prerequisite | Quantum counting application |
| C6 (Deutsch-Jozsa) | Background | Hadamard as 2-point QFT; interference patterns |
| C5 (Universal gates) | Background | Controlled rotation gates, circuit decomposition |
| C3 (Gates/Bloch sphere) | Background | Phase gates, Bloch sphere for single-qubit QFT outputs |
| C10 (Shor's Algorithm) | Forward | Phase estimation as the key subroutine |
| A6 (Probability/Born rule) | Background | Measurement probability from amplitudes |

---

### C9.8 Historical Notes

**Cooley and Tukey (1965).** The classical FFT algorithm, published as "An Algorithm for the Machine Calculation of Complex Fourier Series," enabled efficient Fourier analysis and revolutionised signal processing. The algorithm reduces the DFT from O(N^2) to O(N log N) operations. The FFT is often cited as one of the most important algorithms of the 20th century. (The basic idea was actually known to Gauss in 1805, but was not widely used until the Cooley-Tukey paper.)

**Don Coppersmith (1994).** Coppersmith wrote an internal IBM Research Report "An approximate Fourier transform useful in quantum computing" that described the quantum Fourier transform circuit. The product representation and the O(n^2) circuit were articulated here. This paper circulated widely in the quantum computing community and was a key ingredient in Shor's algorithm.

**Alexei Kitaev (1995).** Kitaev independently developed the phase estimation algorithm (which he called "eigenvalue estimation") in a different framework, using a single control qubit with adaptive measurements instead of multiple control qubits with a single measurement. Kitaev's approach is equivalent but uses fewer qubits at the cost of more measurements and classical processing. The two approaches (Kitaev's iterative method and the standard multi-qubit QPE) represent different points in a space-time trade-off. Kitaev's 1995 paper also introduced the concept of a "quantum circuit" in a more rigorous complexity-theoretic framework.

**Richard Cleve, Artur Ekert, Chiara Macchiavello, Michele Mosca (1998).** Their paper "Quantum algorithms revisited" provided a clean, unified presentation of the QFT, phase estimation, and their applications to order-finding and factoring. This paper is the standard reference for the QPE algorithm as presented in most textbooks (including Nielsen and Chuang).

**Approximate QFT.** For practical applications, the QFT circuit can be simplified by dropping small-angle rotation gates (R_k with k > O(log n)), reducing the gate count from O(n^2) to O(n log n) with negligible error. This was shown by Barenco, Ekert, et al. (1996) and is important for fault-tolerant implementations where each gate has a non-zero error probability.

---

### C9.9 Problem Set

**Problem C9-P1 (DFT matrix computation).** Compute the 8x8 DFT matrix F_8 (with omega = e^{2*pi*i/8} = e^{i*pi/4}). Express each entry in the form a+bi where a,b are in {0, +/-1, +/-1/sqrt(2)}. Verify that the columns are orthogonal.

**Problem C9-P2 (QFT of |000>).** Compute QFT|000> for 3 qubits (N=8). Show that QFT|0> = H^{tensor n}|0> = |s> (the uniform superposition). Explain why this is always the case.

**Problem C9-P3 (QFT of |111>).** Compute QFT|111> = QFT|7> for 3 qubits. Write the result as a sum of computational basis states with explicit complex amplitudes. Verify using the product representation.

**Problem C9-P4 (Circuit trace for n=2).** Trace the QFT circuit for n=2 on input |11>. Show the state after each gate (H, CR_2, H, SWAP). Verify the final state matches QFT|11>.

**Problem C9-P5 (Product representation derivation).** Starting from the definition QFT|j> = (1/sqrt(N)) sum_k e^{2*pi*i*jk/N}|k>, derive the product representation for n=2 by writing j=j_1*2+j_2 and k=k_1*2+k_2, expanding the exponent, and factoring the sum. Show every algebraic step.

**Problem C9-P6 (Phase estimation -- exact).** A unitary U has eigenvalue e^{2*pi*i*(5/16)} with eigenstate |u>. Run the phase estimation algorithm with t=4 control qubits. What is the control register state before the inverse QFT? What does the measurement yield?

**Problem C9-P7 (Phase estimation -- inexact).** Repeat Problem C9-P6 but with eigenvalue e^{2*pi*i*(1/5)} and t=3 control qubits. Compute the probability of each measurement outcome. Which outcome is most likely? What is the corresponding phase estimate, and what is the error?

**Problem C9-P8 (Inverse QFT circuit).** Draw the inverse QFT circuit for n=3 and verify it by showing that QFT^{-1}(QFT|101>) = |101>. Trace the state through every gate.

**Problem C9-P9 (Gate count comparison).** For n=10 qubits (N=1024), calculate the exact number of gates in the QFT circuit (Hadamards, controlled rotations, and SWAPs). Compare to the number of arithmetic operations in the classical FFT on 1024 complex numbers.

**Problem C9-P10 (Approximate QFT).** The approximate QFT drops all controlled-R_k gates with k > m for some cutoff m. For n=10 and m=4, how many controlled rotation gates are used? What is the maximum phase error per qubit? Argue that the total fidelity loss is small.

**Problem C9-P11 (Simulator exercise -- QFT).** Implement the QFT circuit for n=3 in the qubit simulator. Run it on inputs |000>, |001>, |100>, |101>. For each, compare the simulator output to the analytical QFT. Verify the state vector display matches the computed amplitudes.

**Problem C9-P12 (Simulator exercise -- phase estimation).** Implement the phase estimation circuit with t=3 control qubits and U = R_z(3*pi/4) (a Z-rotation by 3*pi/4). The eigenstate |1> has eigenvalue e^{-i*3*pi/4} = e^{2*pi*i*(5/8)} (since -3*pi/4 = 2*pi*5/8 - 2*pi). Run the circuit and verify the measurement outcome is 5 = |101>.

---

### C9.10 Simulator Dependencies

**Required simulator:** Qubit circuit simulator (from simulator-spec.md, Section 2)

**Specific features used:**
- Gates: H, controlled-R_k (phase rotation), SWAP, CNOT
- Custom unitary gate insertion (for phase estimation with user-defined U)
- Controlled-U^{2^k} gate (for phase estimation)
- State vector display with complex amplitude phases (essential for verifying QFT outputs)
- Up to 6 qubits (3 control + 3 target for phase estimation examples)
- "Show me the algebra" mode: matrix display for QFT and individual gates
- Phase visualisation: display amplitudes on the complex plane (Argand diagram), not just real/imaginary bars

**Simulator exercises in this lesson:**
1. QFT circuit for n=3: run on various inputs, verify amplitudes
2. Phase estimation with t=3: exact and inexact eigenvalues
3. Inverse QFT verification

**Pre-built circuit templates:**
- Template QFT-1: QFT for n=2 with selectable input state
- Template QFT-2: QFT for n=3 with selectable input state
- Template QPE-1: Phase estimation with t=3 control qubits, selectable U (from a library of simple unitaries)
- Template QPE-2: Phase estimation demonstrating exact vs inexact case (side by side)

---

### C9.11 Estimates

| Item | Estimate |
|------|----------|
| Prose -- Part 1 (stages 1-6, DFT review + QFT) | 6,000-7,000 words |
| Prose -- Part 2 (stages 7-12, phase estimation) | 5,500-6,500 words |
| Theorems and proofs | 2,500-3,000 words |
| Worked examples (5 examples with full computations) | 3,000-3,500 words |
| Problem set (12 problems with setup text) | 1,500-2,000 words |
| Historical notes | 600-800 words |
| Total | 19,100-22,800 words |
| Figures/diagrams | 9 visual assets |
| Simulator templates | 4 pre-built circuits |
| Estimated reading time | 70-90 minutes |
| Estimated completion time (with problems) | 4.5-6 hours |

---

### C9.12 Page Splits

**Two pages** as specified in the site architecture.

**Part 1** (`/lessons/c9-qft/part-1`): "The Quantum Fourier Transform"
- Sections: classical DFT review, QFT definition, QFT matrices for N=2,4,8, product representation derivation, QFT circuit, circuit examples
- Worked Examples: C9-E1 (QFT|10>), C9-E2 (QFT|101>)
- Target: 8,000-10,000 words
- Internal anchors: `#dft-review`, `#qft-definition`, `#qft-matrices`, `#product-representation`, `#qft-circuit`, `#circuit-examples`

**Part 2** (`/lessons/c9-qft/part-2`): "Quantum Phase Estimation"
- Sections: QPE problem statement, QPE circuit, exact case, error analysis, inverse QFT, connection to Shor
- Worked Examples: C9-E3 (exact QPE), C9-E4 (inexact QPE), C9-E5 (inverse QFT)
- Target: 7,000-8,000 words
- Internal anchors: `#qpe-problem`, `#qpe-circuit`, `#exact-case`, `#error-analysis`, `#inverse-qft`, `#connection-shor`

The split is natural: Part 1 is the QFT as a standalone construct; Part 2 uses the QFT as a tool within the phase estimation framework. Part 1 is prerequisite for Part 2.

---

---

## C10 -- Shor's Algorithm

**Canonical position:** 23 (CAPSTONE)
**Slug:** `c10-shor`
**Prerequisites:** C9 (QFT & Phase Estimation), A4 (Eigenvalues/spectral theorem), A6 (Probability/Born rule)
**Page structure:** 4 parts (as specified in site architecture: 3 parts per the architecture doc, expanded to 4 given the 20,000-25,000 word target and the natural four-fold decomposition of the content)

Note: The site architecture specifies 3 parts. Given the target of 20,000-25,000 words and the four distinct conceptual phases (number theory, quantum order-finding, the full algorithm, and implications), we recommend 4 parts. If 3 parts are mandated, Parts 3 and 4 below should be merged.

**Target length:** 20,000-25,000 words

---

### C10.1 Learning Objectives

By the end of this lesson, the student will be able to:

1. **State** the integer factoring problem and explain its importance for cryptography (RSA), including why classical algorithms are believed to be inefficient.
2. **Prove** the reduction from factoring to order-finding: given the ability to find the order r of a random element a modulo N, one can factor N with probability at least 1/2 per attempt.
3. **Define** the modular exponentiation unitary U_a|x> = |ax mod N> and verify it is unitary when gcd(a,N) = 1.
4. **Derive** the eigenstates of U_a: |u_s> = (1/sqrt(r)) sum_{k=0}^{r-1} e^{-2*pi*i*s*k/r} |a^k mod N> for s = 0, 1, ..., r-1, with eigenvalues e^{2*pi*i*s/r}.
5. **Show** that the uniform superposition of eigenstates gives a computationally accessible initial state: (1/r) sum_{s=0}^{r-1} |u_s> = |1>.
6. **Describe** the quantum order-finding circuit: prepare control register in uniform superposition, apply controlled-U_a^{2^k}, apply inverse QFT to control register, measure.
7. **Explain** how phase estimation on the eigenstates |u_s> yields s/r, and how the continued fractions algorithm extracts r from the measurement outcome.
8. **Walk through** the complete end-to-end factoring of N=15 with a=7, showing r=4 and recovering factors 3 and 5.
9. **Analyse** the complexity: O(n^3) quantum gates and O(n) classical post-processing, where n = ceil(log_2(N)), making Shor's algorithm exponentially faster than the best known classical factoring algorithms.
10. **Discuss** the cryptographic implications: RSA and other number-theoretic cryptosystems are vulnerable to a sufficiently large quantum computer, motivating post-quantum cryptography.

---

### C10.2 Intuition Arc

**Part 1: Number Theory Foundation**

**Stage 1 -- The factoring problem and RSA (15 min).** We open with the stakes: virtually all internet security (HTTPS, banking, email) relies on the difficulty of factoring large numbers. RSA encryption: choose two large primes p, q. Publish N = p*q. The encryption relies on the assumption that given N, no one can find p and q efficiently. The best known classical algorithm (General Number Field Sieve) runs in time exp(O(n^{1/3} (log n)^{2/3})) where n = log_2(N) -- sub-exponential but super-polynomial. For a 2048-bit number, this requires more computation than the age of the universe with current technology. Shor's algorithm factors in polynomial time: O(n^3). This is the algorithm that put quantum computing on the map.

**Stage 2 -- Modular arithmetic review (10 min).** We review the essential number theory: modular arithmetic, greatest common divisor (gcd), Euler's totient function phi(N), and the fundamental theorem: a^{phi(N)} = 1 (mod N) when gcd(a,N) = 1 (Euler's theorem). We define the ORDER of a modulo N as the smallest positive integer r such that a^r = 1 (mod N). The order r divides phi(N). We compute several examples: order of 7 mod 15, order of 2 mod 15, order of 4 mod 15.

Example: a = 7, N = 15.
7^1 mod 15 = 7
7^2 mod 15 = 49 mod 15 = 4
7^3 mod 15 = 28 mod 15 = 13
7^4 mod 15 = 91 mod 15 = 1
So r = 4.

**Stage 3 -- Factoring from order-finding (20 min).** This is the key classical reduction. We prove: if r is even and a^{r/2} != -1 (mod N), then gcd(a^{r/2}-1, N) and gcd(a^{r/2}+1, N) are non-trivial factors of N.

*Proof:* a^r = 1 (mod N) means N | (a^r - 1) = (a^{r/2} - 1)(a^{r/2} + 1). So N divides the product. If a^{r/2} != +/-1 (mod N), then N does not divide either factor individually, so gcd(a^{r/2} +/- 1, N) are non-trivial factors.

For the algorithm to work, we need r to be even and a^{r/2} != -1 (mod N). We state (and sketch proof of) the probability theorem: for a randomly chosen a with gcd(a,N)=1, the probability that r is even and a^{r/2} != -1 (mod N) is at least 1/2 when N has two or more distinct odd prime factors. The proof uses the Chinese Remainder Theorem.

Full example: N = 15, a = 7, r = 4 (even). a^{r/2} = 7^2 = 49 = 4 (mod 15). 4 != -1 (mod 15). gcd(4-1, 15) = gcd(3, 15) = 3. gcd(4+1, 15) = gcd(5, 15) = 5. Factors: 3 and 5. Success!

**Stage 4 -- The algorithm outline (10 min, concluding Part 1).** We present the full Shor's algorithm as a flowchart:
1. Choose random a with 1 < a < N.
2. Compute gcd(a, N). If gcd > 1, we found a factor (lucky!). Otherwise continue.
3. Find the order r of a modulo N (this is the QUANTUM step).
4. If r is odd, go to step 1.
5. If a^{r/2} = -1 (mod N), go to step 1.
6. Compute gcd(a^{r/2} +/- 1, N). These are factors of N.

Steps 1-2 and 4-6 are classical. Step 3 is the quantum subroutine. We have already proved (Stage 3) that steps 4-5 fail with probability at most 1/2 per trial, so O(1) repetitions suffice on average.

**Part 2: Quantum Order-Finding**

**Stage 5 -- The modular exponentiation unitary (15 min).** We define U_a|x> = |ax mod N> for x in {0, 1, ..., N-1}. When gcd(a,N) = 1, multiplication by a is a permutation of Z_N, so U_a is a permutation matrix and hence unitary. We note that U_a is defined on a register of n = ceil(log_2(N)) qubits, but the states |x> with x >= N are "junk" -- we must ensure the algorithm never creates superpositions involving them.

We also explain controlled-U_a^{2^k}: this maps |x> to |a^{2^k} x mod N>. By repeated squaring, a^{2^k} mod N can be computed classically in O(k) multiplications. The controlled version is implemented as a sequence of controlled modular multiplications.

**Stage 6 -- Eigenstates of U_a (20 min).** This is the deepest insight in the quantum part of Shor's algorithm. We define:

|u_s> = (1/sqrt(r)) sum_{k=0}^{r-1} e^{-2*pi*i*s*k/r} |a^k mod N>

for s = 0, 1, ..., r-1.

We verify these are eigenstates:
U_a|u_s> = (1/sqrt(r)) sum_{k=0}^{r-1} e^{-2*pi*i*s*k/r} |a^{k+1} mod N>
= (1/sqrt(r)) sum_{k'=1}^{r} e^{-2*pi*i*s*(k'-1)/r} |a^{k'} mod N>    (setting k'=k+1)
= e^{2*pi*i*s/r} * (1/sqrt(r)) sum_{k'=0}^{r-1} e^{-2*pi*i*s*k'/r} |a^{k'} mod N>
= e^{2*pi*i*s/r} |u_s>

(using a^r mod N = 1, so the sum wraps around cyclically).

The eigenvalue is e^{2*pi*i*s/r}. The phase is s/r. If we could apply phase estimation to U_a with eigenstate |u_s>, we would measure s/r with high precision, and from s/r we could extract r.

**Stage 7 -- The superposition trick: sum of eigenstates = |1> (10 min).** The key computational insight: we do NOT need to prepare |u_s> (which would require knowing r, a circular dependency). Instead:

(1/r) sum_{s=0}^{r-1} |u_s> = (1/r) sum_{s=0}^{r-1} (1/sqrt(r)) sum_{k=0}^{r-1} e^{-2*pi*i*s*k/r} |a^k mod N>
= (1/r^{3/2}) sum_k |a^k mod N> sum_s e^{-2*pi*i*s*k/r}

The inner sum sum_s e^{-2*pi*i*s*k/r} equals r if k=0 and 0 otherwise (orthogonality of roots of unity).

So: (1/r) sum_s |u_s> = (1/sqrt(r)) * (r/r^{3/2}) ... 

Wait, let me redo this properly.
(1/sqrt(r)) sum_{s=0}^{r-1} |u_s> = (1/sqrt(r)) sum_s (1/sqrt(r)) sum_k e^{-2*pi*i*sk/r}|a^k mod N>
= (1/r) sum_k [sum_s e^{-2*pi*i*sk/r}] |a^k mod N>
= (1/r) * r * |a^0 mod N>    (since sum_s = r for k=0, 0 otherwise)
= |1>

So the state |1> (the computational basis state corresponding to 1 in the work register) is a uniform superposition of ALL eigenstates |u_s>. This is remarkable: by simply initialising the work register to |1>, we automatically input all eigenstates simultaneously. Phase estimation will then produce a random s (uniformly over 0, ..., r-1) and the corresponding phase s/r.

**Stage 8 -- The quantum order-finding circuit (15 min, concluding Part 2).** We assemble the pieces:

1. Prepare two registers: control register |0>^t (t = 2n+1 qubits for n-bit N), work register |1>.
2. Apply H^{tensor t} to control register.
3. Apply controlled-U_a^{2^k} for each control qubit k = 0, 1, ..., t-1.
4. Apply inverse QFT to control register.
5. Measure control register. Outcome is approximately 2^t * s/r for a random s.

Since the input |1> = (1/sqrt(r)) sum_s |u_s>, by linearity of quantum mechanics, the phase estimation "runs on each eigenstate independently." For each s, the measurement would give (approximately) 2^t * s/r. The overall measurement samples a random s and returns the corresponding approximation.

**Part 3: Continued Fractions and the Full Example**

**Stage 9 -- Continued fractions for extracting r (15 min).** The measurement gives an integer m approximately equal to 2^t * s/r. So m/2^t is approximately s/r. We need to find s and r given m and 2^t. The continued fractions algorithm finds the best rational approximation p/q to a given real number with q <= Q. We explain the algorithm briefly and show that if |m/2^t - s/r| < 1/(2*2^t), then the continued fraction expansion of m/2^t will have s/r as one of its convergents (with r <= N). Since t = 2n+1, the precision 1/2^t < 1/(2*N^2), which suffices.

We work through the continued fractions algorithm for a specific example.

**Stage 10 -- End-to-end example: factor N=15 with a=7 (30 min).** This is the crown jewel of the lesson: a complete, fully worked trace of Shor's algorithm.

Step 1: N = 15, choose a = 7. gcd(7, 15) = 1, so proceed.

Step 2: Set up the quantum circuit. n = ceil(log_2(15)) = 4. t = 2*4+1 = 9 control qubits. But for clarity, we will use t = 4 control qubits (which gives precision 1/16, sufficient for r <= 15).

Actually, for the pedagogical example, we know r = 4, so we need t >= 2*ceil(log_2(4)) = 4 to get exact results with high probability. We use t = 4.

Work register: 4 qubits (to hold numbers mod 15). Initialised to |0001> = |1>.

Step 3: Control register after H^{tensor 4}: (1/4) sum_{k=0}^{15} |k>.

Step 4: Controlled-U_7 operations. U_7|x> = |7x mod 15>. 

For each control qubit k, we apply U_7^{2^k}:
- U_7^1: |x> -> |7x mod 15>
- U_7^2: |x> -> |49x mod 15> = |4x mod 15>
- U_7^4: |x> -> |7^4 x mod 15> = |1*x mod 15> = |x> (identity, since 7^4 = 1 mod 15!)
- U_7^8: |x> -> |x> (also identity)

The state after controlled operations:
sum_{k=0}^{15} |k> tensor |7^k mod 15>

But |7^k mod 15> cycles with period 4: 7^0=1, 7^1=7, 7^2=4, 7^3=13, 7^4=1, ...

So: sum_{k=0}^{15} |k>|7^k mod 15>
= (|0>+|4>+|8>+|12>)|1> + (|1>+|5>+|9>+|13>)|7> + (|2>+|6>+|10>+|14>)|4> + (|3>+|7>+|11>+|15>)|13>

(Each group of 4 consecutive k values maps to the same work register value, offset by the period r=4.)

Step 5: Apply inverse QFT to control register. The control register is in a state that is periodic with period 4 in a 16-dimensional space. The QFT^{-1} converts this periodicity into peaks at multiples of 16/4 = 4.

The control register state for the |1> work register branch is:
(1/4)(|0> + |4> + |8> + |12>) 

QFT^{-1} of this: this is a periodic state with period 4 in a 16-point space. Its QFT^{-1} concentrates on {0, 4, 8, 12} (multiples of N/r = 16/4 = 4).

Actually, the inverse QFT of (1/4)(|0>+|4>+|8>+|12>) is:

QFT^{-1}[(1/4) sum_{j=0}^{3} |4j>]

Each |4j> has QFT^{-1}|4j> = (1/4) sum_m e^{-2*pi*i*4j*m/16} |m> = (1/4) sum_m e^{-2*pi*i*jm/4} |m>.

So: QFT^{-1}[(1/4) sum_j |4j>] = (1/4) sum_j (1/4) sum_m e^{-2*pi*i*jm/4} |m>
= (1/16) sum_m [sum_j e^{-2*pi*i*jm/4}] |m>

The inner sum sum_{j=0}^{3} e^{-2*pi*i*jm/4} = 4 if m is a multiple of 4, and 0 otherwise.

So: QFT^{-1} = (1/16)*4*(|0>+|4>+|8>+|12>) = (1/4)(|0>+|4>+|8>+|12>)

Hmm, this gives us back the same state. That is because the periodic state is an eigenstate of the QFT with period-4 periodicity in a 16-point space... 

Actually, let me reconsider. The QFT maps periodic states to periodic states, and the QFT^{-1} is the inverse. The state (1/4)(|0>+|4>+|8>+|12>) is already "Fourier-like." The full phase estimation analysis should account for the phases.

Let me redo this more carefully using the eigenstate decomposition.

The state |1> in the work register can be written as:
|1> = (1/sqrt(4)) sum_{s=0}^{3} |u_s>

where |u_s> = (1/2)(|1> + e^{-2*pi*is/4}|7> + e^{-2*pi*i*2s/4}|4> + e^{-2*pi*i*3s/4}|13>).

After the controlled-U operations, the joint state is:
(1/sqrt(4)) sum_s |psi_s>_control tensor |u_s>_work

where |psi_s> = (1/4) sum_{k=0}^{15} e^{2*pi*i*s*k/4} |k> = QFT^{-1}|4s> ... no, |psi_s> = QFT|round(2^t * s/r)> in the exact case.

Since phi_s = s/r = s/4, and t=4, we have 2^t * phi_s = 16*(s/4) = 4s. So:
|psi_s> = (1/4) sum_{k=0}^{15} e^{2*pi*i*(s/4)*k} |k> = QFT|4s>

Applying QFT^{-1} gives |4s>.

After QFT^{-1} on the control register:
(1/sqrt(4)) sum_{s=0}^{3} |4s>_control |u_s>_work
= (1/2)(|0>|u_0> + |4>|u_1> + |8>|u_2> + |12>|u_3>)

Measuring the control register:
- Outcome 0 (= 4*0): phase estimate = 0/16 = 0. s/r = 0/4 = 0. Tells us nothing about r.
- Outcome 4 (= 4*1): phase estimate = 4/16 = 1/4. s/r = 1/4. Continued fractions: 1/4 -> r = 4. Success!
- Outcome 8 (= 4*2): phase estimate = 8/16 = 1/2. s/r = 2/4 = 1/2. Continued fractions: 1/2 -> r could be 2 (reduced fraction). We get r = 2, which divides the true r = 4. Partial success -- 7^{2/2} = 7 != -1 mod 15, but 7^1 = 7, and gcd(7-1,15)=gcd(6,15)=3, gcd(7+1,15)=gcd(8,15)=1. So we get factor 3 from r=2 too!
- Outcome 12 (= 4*3): phase estimate = 12/16 = 3/4. s/r = 3/4. Continued fractions: 3/4 -> r = 4. Success!

Each outcome has probability 1/4. Three out of four outcomes (4, 8, 12) give useful information. Outcome 0 is uninformative but occurs with probability only 1/4.

Step 6: Classical post-processing.
Suppose we measured 4. Phase = 4/16 = 1/4. Continued fraction of 1/4: trivially 1/4, giving r = 4.

Check: r = 4 is even. a^{r/2} = 7^2 = 49 = 4 (mod 15). 4 != -1 (mod 15). Good.
gcd(a^{r/2} - 1, N) = gcd(3, 15) = 3.
gcd(a^{r/2} + 1, N) = gcd(5, 15) = 5.
Factors of 15: 3 and 5. Verified: 3 * 5 = 15. SUCCESS!

**Stage 11 -- Complexity analysis (15 min, Part 3 or beginning of Part 4).** We analyse the gate complexity of each component:
- Hadamard layer: O(t) = O(n) gates.
- Controlled modular exponentiation: each controlled-U_a^{2^k} requires O(n^2) gates for modular multiplication (using schoolbook multiplication), and there are t = O(n) such operations. Total: O(n^3) gates.
- Inverse QFT: O(t^2) = O(n^2) gates.
- Classical continued fractions: O(n) arithmetic operations.
- Overall: O(n^3) quantum gates, where n = ceil(log_2(N)).

This is POLYNOMIAL in n, hence exponentially faster than the best known classical algorithms (which are sub-exponential but super-polynomial).

**Part 4: Implications and Practical Considerations**

**Stage 12 -- Cryptographic implications (15 min).** RSA with an n-bit modulus is broken by Shor's algorithm using O(n^3) quantum gates. Current RSA key sizes (2048-4096 bits) would require quantum computers with thousands of logical qubits and millions of physical qubits (due to error correction overhead). As of 2026, the largest number factored by a quantum computer is still small (the record for Shor's is 21, with 15 being the most famous demonstration). But the THREAT is existential: "harvest now, decrypt later" attacks mean adversaries can store encrypted data today and decrypt it when quantum computers become available. This motivates the transition to post-quantum cryptography (lattice-based, code-based, hash-based, multivariate schemes) standardised by NIST in 2024.

**Stage 13 -- Practical requirements and current state (10 min).** To factor a 2048-bit RSA key:
- Logical qubits needed: approximately 4000 (for the registers and workspace)
- Physical qubits needed (with surface code error correction): approximately 4-20 million
- Number of gates: approximately 10^12
- Time estimate: hours to days depending on gate speed

Current quantum computers (as of 2026) have at most a few thousand physical qubits with error rates too high for Shor-scale computations. But progress is rapid. The question is not IF but WHEN.

**Stage 14 -- The bigger picture (10 min, conclusion).** Shor's algorithm is not just about factoring. The quantum order-finding subroutine is an instance of the HIDDEN SUBGROUP PROBLEM (HSP) for abelian groups. The same framework (QFT over a group) solves the discrete logarithm problem (breaking Diffie-Hellman and elliptic curve cryptography) and other algebraic problems. The non-abelian HSP (which would yield efficient algorithms for graph isomorphism and lattice problems) remains open and is one of the great challenges in quantum algorithm design.

We also look back at the entire Track C arc: from single qubits (C1) to measurement (C2) to gates (C3) to multi-qubit systems (C4) to universal computation (C5) to the first quantum speedup (C6) to quantum communication (C7) to search (C8) to the Fourier transform (C9) and finally to the algorithm that changed the world (C10). The journey is complete.

---

### C10.3 Theorems and Proof Sketches

**Theorem C10.1 (Factoring reduces to order-finding).** Let N be an odd composite number with at least two distinct prime factors. If a is chosen uniformly at random from {2, ..., N-1} with gcd(a,N)=1, and r is the order of a modulo N, then with probability at least 1/2: r is even and a^{r/2} != -1 (mod N).

*Proof sketch.* Write N = p_1^{e_1} * ... * p_k^{e_k} with k >= 2 (at least two distinct prime factors). By CRT, Z_N^* is isomorphic to Z_{p_1^{e_1}}^* x ... x Z_{p_k^{e_k}}^*. The order r of a modulo N is the lcm of the orders r_i of a modulo p_i^{e_i}. Write r_i = 2^{d_i} * q_i with q_i odd. The condition "r is even and a^{r/2} != -1 (mod N)" fails only if all d_i are equal (i.e., the highest power of 2 dividing each r_i is the same). Since a is random and the d_i are independent (by CRT), the probability that all d_i are equal is at most 1/2 (with equality when k=2 and both d_i are 0 or both are 1, etc.). Detailed accounting shows the probability of failure is at most 1/2^{k-1} <= 1/2. QED (sketch).

**Theorem C10.2 (Unitarity of modular exponentiation).** If gcd(a,N) = 1, then U_a: |x> -> |ax mod N> for x in {0,...,N-1} is a unitary operator on the subspace spanned by {|0>, ..., |N-1>}.

*Proof.* Since gcd(a,N)=1, multiplication by a modulo N is a bijection on Z_N = {0, 1, ..., N-1}. (The inverse map is multiplication by a^{-1} mod N.) Therefore U_a is a permutation matrix on the computational basis states {|0>, ..., |N-1>}, and permutation matrices are unitary. QED.

**Theorem C10.3 (Eigenstates of U_a).** Define |u_s> = (1/sqrt(r)) sum_{k=0}^{r-1} e^{-2*pi*i*s*k/r} |a^k mod N> for s = 0, ..., r-1. Then U_a|u_s> = e^{2*pi*i*s/r}|u_s>.

*Proof.* U_a|u_s> = (1/sqrt(r)) sum_{k=0}^{r-1} e^{-2*pi*i*s*k/r} U_a|a^k mod N>
= (1/sqrt(r)) sum_{k=0}^{r-1} e^{-2*pi*i*s*k/r} |a^{k+1} mod N>

Substituting k' = k+1 (and using |a^r mod N> = |a^0 mod N> = |1>):
= (1/sqrt(r)) sum_{k'=1}^{r} e^{-2*pi*i*s*(k'-1)/r} |a^{k'} mod N>
= e^{2*pi*i*s/r} (1/sqrt(r)) sum_{k'=0}^{r-1} e^{-2*pi*i*s*k'/r} |a^{k'} mod N>
= e^{2*pi*i*s/r} |u_s>. QED.

**Theorem C10.4 (Superposition of eigenstates).** (1/sqrt(r)) sum_{s=0}^{r-1} |u_s> = |1>.

*Proof.* (1/sqrt(r)) sum_s |u_s> = (1/sqrt(r)) sum_s (1/sqrt(r)) sum_k e^{-2*pi*i*sk/r} |a^k mod N>
= (1/r) sum_k [sum_s e^{-2*pi*i*sk/r}] |a^k mod N>

By orthogonality of roots of unity: sum_{s=0}^{r-1} e^{-2*pi*i*sk/r} = r if r|k, and 0 otherwise.
Since 0 <= k <= r-1, the only value with r|k is k=0.
= (1/r) * r * |a^0 mod N> = |1>. QED.

**Theorem C10.5 (Continued fractions guarantee).** If |s/r - m/2^t| < 1/(2*2^t) and r < 2^t, then s/r is a convergent of the continued fraction expansion of m/2^t.

*Proof sketch.* This is a standard result in number theory. The convergents p_i/q_i of the continued fraction expansion of a real number alpha satisfy |alpha - p_i/q_i| < 1/(q_i * q_{i+1}). Conversely, if |alpha - p/q| < 1/(2*q^2), then p/q is a convergent of alpha. Since |m/2^t - s/r| < 1/(2*2^t) and r < 2^t, we have |m/2^t - s/r| < 1/(2*r*2^t) (since r < 2^t implies 1/(2*2^t) < 1/(2*r) and hence < 1/(2*r^2)... 

Actually, the standard statement requires |alpha - p/q| < 1/(2q^2). We have |m/2^t - s/r| < 1/(2*2^t). We need 1/(2*2^t) < 1/(2*r^2), i.e., r^2 < 2^t. Since t >= 2n and r < N < 2^n, we have r^2 < 2^{2n} <= 2^t. So the condition is satisfied, and s/r (in lowest terms) is a convergent of m/2^t. QED (sketch).

**Theorem C10.6 (Shor's algorithm complexity).** Shor's algorithm factors an n-bit integer N in O(n^3) quantum gate operations and O(n) rounds of classical post-processing, succeeding with probability at least 1 - 2^{-c} for any constant c using O(c) repetitions.

*Proof sketch.* The quantum circuit uses: O(n) Hadamards, O(n) controlled-modular-exponentiation operations each requiring O(n^2) gates (using schoolbook modular multiplication), and O(n^2) gates for the inverse QFT. Total quantum gates: O(n^3). The classical post-processing (continued fractions, gcd computation) requires O(n) arithmetic operations on n-bit numbers. Each run succeeds with probability Omega(1) (at least 1/4: probability 3/4 of getting a useful measurement outcome times probability at least 1/2 of the order leading to factors). So O(c) independent runs give failure probability 2^{-Omega(c)}. QED.

---

### C10.4 Visual Assets

**Visual C10-V1: RSA diagram.** A schematic showing RSA encryption: Alice publishes N = p*q, Bob encrypts with the public key, only Alice (who knows p and q) can decrypt. A quantum computer "breaks the lock" by factoring N. Simple, high-impact visual for motivation.

**Visual C10-V2: Modular exponentiation cycle.** For N=15, a=7: a circle showing the cycle 1 -> 7 -> 4 -> 13 -> 1 (mod 15). The period r=4 is the length of the cycle. This visual recurs throughout the lesson.

**Visual C10-V3: Factoring-to-order reduction flowchart.** A flowchart of the complete Shor's algorithm: choose a, check gcd, quantum order-finding, check r even, check a^{r/2} != -1, compute gcd. Decision points with "yes/no" branches. Probability annotations on each branch.

**Visual C10-V4: Eigenstate visualisation.** For N=15, a=7, r=4: the four eigenstates |u_0>, |u_1>, |u_2>, |u_3> shown as superpositions of |1>, |7>, |4>, |13> with complex phase arrows. The eigenvalues e^{2*pi*i*s/4} for s=0,1,2,3 are shown on the unit circle.

**Visual C10-V5: Shor's circuit diagram.** The complete quantum circuit: t control qubits (top), n work qubits (bottom). H^{tensor t} on control, controlled-U_a^{2^k} boxes between control and work registers, inverse QFT on control, measurement on control. For the N=15 example with t=4.

**Visual C10-V6: Phase estimation measurement outcomes.** A bar chart showing the four possible measurement outcomes (0, 4, 8, 12) for the N=15, a=7 example, each with probability 1/4. The corresponding phase estimates (0, 1/4, 1/2, 3/4) and the continued fraction results are annotated.

**Visual C10-V7: Continued fractions walkthrough.** A step-by-step visual of the continued fractions algorithm applied to 4/16 = 1/4 and 12/16 = 3/4, showing the sequence of quotients and convergents. Simple arithmetic laid out in a tree structure.

**Visual C10-V8: Complexity comparison chart.** A logarithmic-scale chart comparing the running times of: trial division O(sqrt(N)), quadratic sieve exp(O(sqrt(n*log(n)))), general number field sieve exp(O(n^{1/3})), and Shor's algorithm O(n^3). For n=100, 1000, 2048, 4096 bits. The exponential vs polynomial gap is dramatic.

**Visual C10-V9: Timeline to quantum threat.** An infographic showing current quantum computer capabilities (qubits, error rates), estimated requirements for breaking RSA-2048, and projected timelines. Emphasises uncertainty but conveys the seriousness of the threat.

**Visual C10-V10: Track C journey map.** A visual summary of the entire Track C arc from C1 to C10, showing how each lesson built on the previous ones. This serves as a capstone visual for the entire computing track.

---

### C10.5 Worked Examples

**Worked Example C10-E1: Order computation for a=7, N=15.**

We compute the sequence a^k mod N:
7^0 mod 15 = 1
7^1 mod 15 = 7
7^2 mod 15 = 49 mod 15 = 4
7^3 mod 15 = 7*4 mod 15 = 28 mod 15 = 13
7^4 mod 15 = 7*13 mod 15 = 91 mod 15 = 1

The sequence is (1, 7, 4, 13, 1, 7, 4, 13, ...) with period r = 4.

Check: r = 4 is even. a^{r/2} = 7^2 = 49 mod 15 = 4. Is 4 = -1 mod 15? No (since -1 mod 15 = 14). So the factoring reduction works.

gcd(4 - 1, 15) = gcd(3, 15) = 3
gcd(4 + 1, 15) = gcd(5, 15) = 5

Verification: 3 * 5 = 15. Correct!

**Worked Example C10-E2: Eigenstates of U_7 for N=15.**

r = 4. The four eigenstates are:

|u_0> = (1/2)(|1> + |7> + |4> + |13>)
Eigenvalue: e^{2*pi*i*0/4} = 1.

|u_1> = (1/2)(|1> + e^{-i*pi/2}|7> + e^{-i*pi}|4> + e^{-i*3*pi/2}|13>)
= (1/2)(|1> - i|7> - |4> + i|13>)
Eigenvalue: e^{2*pi*i*1/4} = e^{i*pi/2} = i.

|u_2> = (1/2)(|1> + e^{-i*pi}|7> + e^{-i*2*pi}|4> + e^{-i*3*pi}|13>)
= (1/2)(|1> - |7> + |4> - |13>)
Eigenvalue: e^{2*pi*i*2/4} = e^{i*pi} = -1.

|u_3> = (1/2)(|1> + e^{-i*3*pi/2}|7> + e^{-i*3*pi}|4> + e^{-i*9*pi/2}|13>)
= (1/2)(|1> + i|7> - |4> - i|13>)
Eigenvalue: e^{2*pi*i*3/4} = e^{i*3*pi/2} = -i.

Verification of superposition:
(1/2)(|u_0>+|u_1>+|u_2>+|u_3>)
= (1/4)[(1+1+1+1)|1> + (1-i-1+i)|7> + (1-1+1-1)|4> + (1+i-1-i)|13>]
= (1/4)[4|1> + 0|7> + 0|4> + 0|13>]
= |1>

Confirmed: (1/sqrt(r)) sum_s |u_s> = (1/2) sum_s |u_s> = |1>.

Verification of eigenstate property for |u_1>:
U_7|u_1> = (1/2)(U_7|1> - i*U_7|7> - U_7|4> + i*U_7|13>)
= (1/2)(|7> - i|4> - |13> + i|1>)
= i * (1/2)(|1> - i|7> - |4> + i|13>)
= i * |u_1>. Correct!

**Worked Example C10-E3: Full Shor circuit trace for N=15, a=7, with t=4 control qubits.**

Step 0 -- Registers: control |0000>, work |0001> (representing |1> mod 15).

Step 1 -- H^{tensor 4} on control:
(1/4) sum_{j=0}^{15} |j> tensor |1>

Step 2 -- Controlled modular exponentiation:
For each control value j, the work register maps to |7^j mod 15>:

j=0: |0000>|1>, j=1: |0001>|7>, j=2: |0010>|4>, j=3: |0011>|13>,
j=4: |0100>|1>, j=5: |0101>|7>, j=6: |0110>|4>, j=7: |0111>|13>,
j=8: |1000>|1>, j=9: |1001>|7>, j=10: |1010>|4>, j=11: |1011>|13>,
j=12: |1100>|1>, j=13: |1101>|7>, j=14: |1110>|4>, j=15: |1111>|13>

State: (1/4) sum_{j=0}^{15} |j>|7^j mod 15>

Grouping by work register value:
= (1/4)[(|0>+|4>+|8>+|12>)|1> + (|1>+|5>+|9>+|13>)|7> + (|2>+|6>+|10>+|14>)|4> + (|3>+|7>+|11>+|15>)|13>]

Step 3 -- Inverse QFT on control register. We apply QFT^{-1} to each control register branch independently.

For the |1> branch, control state = (1/4)(|0>+|4>+|8>+|12>) = (1/4) sum_{m=0}^{3} |4m>.

This is a periodic state. Applying QFT^{-1}:
QFT^{-1}[(1/4) sum_{m=0}^{3} |4m>] = (1/4) sum_m (1/4) sum_k e^{-2*pi*i*4mk/16}|k>
= (1/16) sum_k [sum_{m=0}^{3} e^{-2*pi*imk/4}] |k>

The inner sum is 4 when k = 0 (mod 4) and 0 otherwise.
= (1/4)(|0> + |4> + |8> + |12>)

For the |7> branch, control = (1/4)(|1>+|5>+|9>+|13>) = (1/4) sum_{m=0}^{3} |4m+1>.

QFT^{-1}[(1/4) sum_m |4m+1>] = (1/16) sum_k [sum_m e^{-2*pi*i(4m+1)k/16}] |k>
= (1/16) sum_k e^{-2*pi*ik/16} [sum_m e^{-2*pi*imk/4}] |k>

Again inner sum is 4 when 4|k, i.e., k in {0,4,8,12}:
= (1/4) sum_{k in {0,4,8,12}} e^{-2*pi*ik/16} |k>
= (1/4)(e^0|0> + e^{-i*pi/2}|4> + e^{-i*pi}|8> + e^{-i*3*pi/2}|12>)
= (1/4)(|0> - i|4> - |8> + i|12>)

Similarly for |4> and |13> branches (with phases e^{-2*pi*i*2k/16} and e^{-2*pi*i*3k/16} respectively).

Full state after QFT^{-1}:
= (1/4){
  (1/4)(|0>+|4>+|8>+|12>)|1> 
  + (1/4)(|0>-i|4>-|8>+i|12>)|7>
  + (1/4)(|0>-|4>+|8>-|12>)|4>
  + (1/4)(|0>+i|4>-|8>-i|12>)|13>
}

Regroup by control measurement outcome:
|0>: (1/16)(|1>+|7>+|4>+|13>) = (1/16) * 2 * (1/2)(|1>+|7>+|4>+|13>) = (1/8)|u_0>*sqrt(4)... 

Let me just compute the probabilities of each control outcome. The coefficient of each |k> in the control register (summed over all work register branches) is:

For |0>: (1/16)(|1> + |7> + |4> + |13>) -- norm squared = 4*(1/16)^2 = 4/256 = 1/64 per work state, total = 4/64 = 1/16. 

Actually, let me compute the overall amplitude for the control being |0>:
= (1/4)*(1/4)*|1> + (1/4)*(1/4)*|7> + (1/4)*(1/4)*|4> + (1/4)*(1/4)*|13>
= (1/16)(|1>+|7>+|4>+|13>)

P(control=0) = (1/16)^2 * 4 = 4/256 = 1/64? That cannot be right since there are only 4 possible outcomes and they should sum to 1.

I think I have a normalisation error. Let me redo from the state just before QFT^{-1}.

The state just before QFT^{-1} (after controlled-U):
|Psi> = (1/4) sum_{j=0}^{15} |j>|7^j mod 15>

This is normalised: (1/4)^2 * 16 = 1. Good.

Using the eigenstate decomposition: |1> = (1/2) sum_{s=0}^{3} |u_s>

|Psi> = (1/4) sum_j |j> U_7^j |1> = (1/4) sum_j |j> U_7^j [(1/2) sum_s |u_s>]
= (1/8) sum_s sum_j e^{2*pi*i*sj/4} |j> |u_s>
= (1/8) sum_s [sum_j e^{2*pi*i*sj/4} |j>] |u_s>

The term in brackets is (up to normalisation) QFT|s*4>... Actually:
sum_{j=0}^{15} e^{2*pi*i*sj/4} |j> = sum_j e^{2*pi*i*s*j/4} |j>

This is 4 * QFT_16|4s> (using QFT_16|m> = (1/4) sum_j e^{2*pi*i*mj/16}|j> and noting e^{2*pi*i*sj/4} = e^{2*pi*i*4s*j/16}).

So: sum_j e^{2*pi*i*sj/4}|j> = 4 * QFT|4s> (where QFT is on 4 qubits with dimension 16).

|Psi> = (1/8) sum_s 4*QFT|4s> |u_s> = (1/2) sum_s QFT|4s> |u_s>

Applying QFT^{-1} to the control register:
|Psi'> = (1/2) sum_s |4s> |u_s>
= (1/2)(|0>|u_0> + |4>|u_1> + |8>|u_2> + |12>|u_3>)

This is properly normalised: (1/2)^2 * 4 = 1.

Measurement of control register:
- P(0) = 1/4, work register collapses to |u_0>. Phase = 0/16 = 0.
- P(4) = 1/4, work register collapses to |u_1>. Phase = 4/16 = 1/4. So s/r = 1/4, giving r=4.
- P(8) = 1/4, work register collapses to |u_2>. Phase = 8/16 = 1/2. So s/r = 2/4 = 1/2. Reduced: r=2 (but true r=4).
- P(12) = 1/4, work register collapses to |u_3>. Phase = 12/16 = 3/4. So s/r = 3/4, giving r=4.

**Continued fractions post-processing:**

Outcome m=4: m/2^t = 4/16 = 1/4. Continued fraction: 1/4. Convergents: 0/1, 1/4. Take the convergent with largest denominator <= 15: 1/4. So s=1, r=4.

Outcome m=8: m/2^t = 8/16 = 1/2. Continued fraction: 1/2. Convergents: 0/1, 1/2. So s=1, r=2 (in lowest terms). Since r=2 might not be the full order (it could be a divisor), we check: 7^2 = 4 != 1 mod 15. So r != 2. We try multiples: r could be 2*k for small k. 7^4 = 1 mod 15, so r=4. In practice, if the continued fraction gives a candidate r' that does not satisfy a^{r'} = 1 mod N, we try small multiples 2r', 3r', etc.

Outcome m=12: m/2^t = 12/16 = 3/4. Continued fraction: [0; 1, 3]. Convergents: 0/1, 1/1, 3/4. Take 3/4 (denominator 4 <= 15). So s=3, r=4.

In three out of four cases, we directly or indirectly obtain r=4. The algorithm succeeds with high probability.

**Worked Example C10-E4: What happens with a=11, N=15?**

Compute: 11^1 mod 15 = 11, 11^2 mod 15 = 121 mod 15 = 1. So r = 2.
Check: r = 2 is even. a^{r/2} = 11^1 = 11 mod 15. Is 11 = -1 mod 15? Yes! (since -1 mod 15 = 14... wait, 11 != 14). Actually, -1 mod 15 = 14, and 11 != 14. So 11 != -1 mod 15.

gcd(11-1, 15) = gcd(10, 15) = 5. gcd(11+1, 15) = gcd(12, 15) = 3.
Factors: 5 and 3. Success!

Now what about a=4, N=15?
4^1 mod 15 = 4, 4^2 mod 15 = 16 mod 15 = 1. So r = 2.
a^{r/2} = 4^1 = 4 mod 15. 4 != -1 mod 15. gcd(3, 15) = 3, gcd(5, 15) = 5. Success again.

And a=14, N=15?
14^1 mod 15 = 14 = -1 mod 15. 14^2 mod 15 = 196 mod 15 = 1. So r = 2.
a^{r/2} = 14^1 = 14 = -1 mod 15. FAILURE! The condition a^{r/2} != -1 is violated. We must choose a different a.

This illustrates why the algorithm sometimes requires retrying with a new random a.

**Worked Example C10-E5: Continued fractions for m=11, 2^t=16.**

Suppose the measurement yields m=11. We compute the continued fraction expansion of 11/16.

11/16 = 0 + 1/(16/11) = 0 + 1/(1 + 5/11) = 0 + 1/(1 + 1/(11/5)) = 0 + 1/(1 + 1/(2 + 1/5))

So 11/16 = [0; 1, 2, 5]. Convergents:
- h_0/k_0 = 0/1
- h_1/k_1 = 1/1
- h_2/k_2 = 2/3
- h_3/k_3 = 11/16

For order-finding with N=15, we look for convergents with denominators <= 15:
- 0/1: r = 1, useless
- 1/1: r = 1, useless
- 2/3: r = 3. Check: is this a valid order? Would need a^3 = 1 mod 15 for our chosen a.
- 11/16: r = 16 > 15, reject.

If we were using a=2 (which has order 4 mod 15), then m=11 would not correspond to any s/4. This outcome would occur with very low probability in an exact case, but could occur in an inexact case. The student should understand that not every measurement outcome leads to a successful factoring -- the algorithm is probabilistic.

---

### C10.6 Common Confusions

**Confusion 1: "Shor's algorithm factors any number instantly."**
Shor's algorithm is POLYNOMIAL time, not instant. For an n-bit number, it requires O(n^3) quantum gates. This is fast compared to classical algorithms (sub-exponential), but for large numbers (thousands of bits), it still requires millions of quantum gates and substantial time. Moreover, the algorithm requires a fault-tolerant quantum computer, which does not yet exist at the required scale.

**Confusion 2: "Shor's algorithm has already broken RSA."**
As of 2026, the largest number factored using Shor's algorithm on a quantum computer is very small (15, 21, and a few other small numbers using various optimization tricks). Breaking RSA-2048 requires quantum computers with millions of physical qubits and very low error rates, which is far beyond current capabilities. The threat is FUTURE, not present, but "harvest now, decrypt later" makes it urgent.

**Confusion 3: "Shor's algorithm is just fast trial division."**
The algorithm has nothing to do with trial division. It uses the STRUCTURE of modular arithmetic (specifically, the periodicity of modular exponentiation) to convert factoring into a period-finding problem, which the QFT solves efficiently. The quantum speedup comes from the QFT's ability to extract periodicity from superpositions, not from parallel trial division.

**Confusion 4: "You need to prepare the eigenstate |u_s> to use phase estimation."**
This is the most subtle point of the algorithm. You do NOT prepare |u_s>. Instead, you prepare |1>, which is automatically a uniform superposition of ALL eigenstates. Phase estimation "works on each eigenstate independently" (by linearity), and the measurement collapses onto a random eigenstate, yielding a random s. This removes the circular dependency.

**Confusion 5: "If the measurement gives s=0, the algorithm fails completely."**
When s=0, the phase estimate is 0, which gives no information about r. This is indeed an uninformative outcome. But it occurs with probability only 1/r, and for r >= 2, this is at most 1/2. All other outcomes give useful information. The algorithm succeeds with high probability over random s and random a.

**Confusion 6: "Continued fractions always give the exact value of r."**
Continued fractions give a candidate for r (the denominator of a convergent close to s/r). If gcd(s,r) > 1, the continued fraction may give r/gcd(s,r) instead of r. This is a smaller divisor of r. The fix: try small multiples of the candidate, or repeat the algorithm to get another s and combine the results. With O(1) repetitions, the true r is found with high probability.

**Confusion 7: "Post-quantum cryptography is unnecessary because quantum computers are far away."**
The "harvest now, decrypt later" attack model means that encrypted communications intercepted TODAY can be stored and decrypted when a sufficiently powerful quantum computer is built. For data that must remain secret for decades (government, medical, financial), the transition to post-quantum cryptography is urgent even if large-scale quantum computers are 10-20 years away. NIST standardised several post-quantum algorithms in 2024.

---

### C10.7 Cross-References

| Reference | Direction | Nature |
|-----------|-----------|--------|
| C9 (QFT & Phase Estimation) | Prerequisite | QFT circuit, phase estimation algorithm, inverse QFT |
| A4 (Eigenvalues/spectral theorem) | Prerequisite | Eigenstates and eigenvalues of unitary operators |
| A6 (Probability/Born rule) | Prerequisite | Measurement probabilities, success probability analysis |
| C8 (Grover) | Background | Quadratic speedup vs Shor's exponential speedup; amplitude amplification |
| C6 (Deutsch-Jozsa) | Background | First quantum speedup; oracle-based algorithm framework |
| C7 (Teleportation) | Background | Quantum communication; no-cloning as foundational concept |
| C5 (Universal gates) | Background | Gate decomposition for modular exponentiation circuit |
| A5 (Tensor products) | Background | Multi-register state spaces |
| P6 (Bell/CHSH) | Parallel | Both highlight non-classical phenomena with practical implications |
| P7 (Decoherence) | Parallel | Error correction requirements for practical Shor implementation |

---

### C10.8 Historical Notes

**Peter Shor (1994).** Shor, then at AT&T Bell Labs, presented his algorithm at the 35th Annual Symposium on Foundations of Computer Science (FOCS 1994). The paper "Algorithms for Quantum Computation: Discrete Logarithms and Factoring" showed that both integer factoring and discrete logarithms could be solved in polynomial time on a quantum computer. The impact was seismic: overnight, quantum computing went from a theoretical curiosity to a potential existential threat to modern cryptography. The paper is among the most cited in computer science, and Shor received numerous awards including the Nevanlinna Prize (1998), the Godel Prize (1999), and the MacArthur Fellowship.

Shor's original algorithm was somewhat different from the modern presentation (he used a different approach to the QFT and period-finding). The clean formulation using phase estimation was developed by several groups, notably Kitaev (1995) and Cleve, Ekert, Macchiavello, and Mosca (1998).

**Lieven Vandersypen et al. (2001).** The first experimental implementation of Shor's algorithm: factoring 15 into 3 x 5 using a 7-qubit nuclear magnetic resonance (NMR) quantum computer. Published in Nature, this was a landmark experiment despite the small problem size. The NMR approach used molecules in solution, with each molecule acting as a quantum processor. While NMR quantum computing has since been largely superseded by other platforms (superconducting circuits, trapped ions, photonics), the Vandersypen experiment demonstrated that Shor's algorithm is physically realisable.

**RSA and public-key cryptography.** RSA was published in 1977 by Rivest, Shamir, and Adleman. Its security relies on the computational difficulty of factoring the product of two large primes. Before Shor's algorithm, the best known classical factoring algorithms were sub-exponential (e.g., the General Number Field Sieve with runtime exp(O(n^{1/3}(log n)^{2/3}))). For RSA-2048 (2048-bit modulus), this requires approximately 10^{30} operations -- far beyond current classical computing power. Shor's polynomial-time algorithm renders RSA insecure against quantum computers.

**Post-quantum cryptography.** In response to the quantum threat, NIST initiated a standardisation process for post-quantum cryptographic algorithms in 2016. In 2024, NIST published the first standards: CRYSTALS-Kyber (key encapsulation, based on lattice problems), CRYSTALS-Dilithium (digital signatures, lattice-based), FALCON (signatures, lattice-based), and SPHINCS+ (signatures, hash-based). The migration from RSA and elliptic curve cryptography to these new standards is ongoing and represents one of the largest cryptographic transitions in history.

**Recent experimental progress.** Since Vandersypen's 2001 experiment, various groups have factored small numbers using quantum hardware: 21 (using a photonic system, 2012), and various small numbers using superconducting qubits and trapped ions. In 2023, a controversial paper claimed to factor a 48-bit number using a hybrid quantum-classical approach on a 10-qubit machine, but this used classical lattice-reduction techniques to reduce the quantum requirements and does not represent a genuine quantum speedup. The first "useful" application of Shor's algorithm -- factoring a number beyond the reach of all classical computers -- likely requires quantum hardware several generations beyond what is available in 2026.

---

### C10.9 Problem Set

**Problem C10-P1 (Order computation).** Compute the order of a=2 modulo N=15. List the sequence 2^k mod 15 for k=0,1,2,...,r. Then compute gcd(2^{r/2}-1, 15) and gcd(2^{r/2}+1, 15). Do you obtain the factors of 15?

**Problem C10-P2 (Failure case).** Compute the order of a=14 modulo N=15. Show that a^{r/2} = -1 (mod 15). Explain why the factoring reduction fails in this case.

**Problem C10-P3 (CRT and probability).** Using the Chinese Remainder Theorem, write Z_{15}^* as a product of cyclic groups. For each a in Z_{15}^*, compute the order r and check whether r is even and a^{r/2} != -1 (mod 15). What fraction of elements a lead to successful factoring?

**Problem C10-P4 (Eigenstate verification).** For N=15 and a=2 (which has order 4 mod 15), compute all four eigenstates |u_s> of U_2. Verify that U_2|u_1> = e^{2*pi*i/4}|u_1> by direct computation.

**Problem C10-P5 (Phase estimation trace).** Suppose N=15, a=2, and the phase estimation uses t=4 control qubits. The eigenvalue corresponding to s=1 is e^{2*pi*i/4}. What is the control register state after the controlled-U operations (for this eigenstate)? What does the inverse QFT produce? What does measurement yield?

**Problem C10-P6 (Continued fractions).** Compute the continued fraction expansion of 7/16. List all convergents. Which convergent would be used if the true fraction is s/r with r <= 15? What values of s and r does this suggest?

**Problem C10-P7 (Modular exponentiation circuit).** For N=15 and a=7, describe how to implement the controlled-U_7 gate as a quantum circuit. What are the classical values 7^1 mod 15, 7^2 mod 15, 7^4 mod 15, 7^8 mod 15? Which controlled operations reduce to the identity?

**Problem C10-P8 (Complexity calculation).** For N = 2^{1024} (a 1024-bit number), estimate the number of quantum gates needed for Shor's algorithm. If each gate takes 1 microsecond, how long would the computation take? Compare to the estimated classical factoring time using the GNFS.

**Problem C10-P9 (Factoring N=21).** Factor N=21 using Shor's approach. Choose a=2 and compute the order. Apply the reduction to obtain factors. Verify.

**Problem C10-P10 (Simulator exercise -- modular exponentiation).** In the qubit simulator, implement U_7 for N=15 (a permutation on 4 qubits). Apply it to |1>, |7>, |4>, |13> and verify the cyclic structure. Then implement controlled-U_7 and verify it acts correctly.

**Problem C10-P11 (Simulator exercise -- full Shor circuit for N=15).** Implement the complete Shor circuit for N=15, a=7, with t=4 control qubits and 4 work qubits. This is an 8-qubit circuit (at the limit of the simulator). Run it and record the measurement outcomes over multiple trials. Verify that the outcomes cluster at {0, 4, 8, 12} as predicted.

Note: this exercise pushes the 6-qubit simulator limit. If the simulator only supports 6 qubits, use a simplified version with t=2 control qubits and N=3 (factoring 3 is trivial but demonstrates the circuit structure).

**Problem C10-P12 (Cryptographic implications).** RSA-2048 uses a 2048-bit modulus. (a) How many logical qubits does Shor's algorithm need? (b) Assuming a surface code with physical-to-logical qubit ratio of 1000:1, how many physical qubits are needed? (c) If the world's largest quantum computer has 1000 physical qubits, how many orders of magnitude away are we from breaking RSA-2048? (d) If qubit counts double every 2 years, when might RSA-2048 be at risk?

---

### C10.10 Simulator Dependencies

**Required simulator:** Qubit circuit simulator (from simulator-spec.md, Section 2)

**Specific features used:**
- Gates: H, controlled-R_k (for QFT), SWAP, CNOT, Toffoli
- Custom unitary: modular multiplication gate U_a|x> = |ax mod N>. For N=15, this is a permutation on 4 qubits. Must be definable by truth table or permutation.
- Controlled-U^{2^k}: controlled version of the modular multiplication gate
- Inverse QFT as a composite gate
- State vector display at each step
- Up to 6 qubits (practical limit for full state vector display). For the full N=15 example with t=4+4=8 qubits, the simulator would need to operate at 8 qubits (256-dimensional state vector). If limited to 6, a reduced example is needed.
- Measurement outcome histogram (run many trials and plot frequency of each outcome)

**Simulator exercises in this lesson:**
1. Modular exponentiation circuit for N=15, a=7 (4 qubits)
2. Eigenstate preparation and verification (4 qubits)
3. Full Shor circuit (8 qubits if possible, 6-qubit reduced version otherwise)
4. Measurement histogram over multiple trials

**Pre-built circuit templates:**
- Template SHOR-1: Modular exponentiation U_7 for N=15 (4-qubit permutation)
- Template SHOR-2: Eigenstate verification circuit
- Template SHOR-3: Full Shor's algorithm for N=15, a=7, t=4 (8 qubits)
- Template SHOR-4: Simplified Shor's for 6-qubit simulator (t=2, N=15 with reduced precision)

**Important note on simulator limitations:** The full Shor circuit for N=15 requires 8 qubits (4 control + 4 work). The simulator spec caps at 6 qubits for full state vector display. Options: (1) extend the simulator to support 8 qubits for this specific lesson (the 256-dimensional state vector is still tractable), (2) use a 6-qubit version with t=2 control qubits (reduced precision but demonstrating the concept), or (3) provide a "Shor mode" that uses a specialised backend optimised for the Shor circuit structure. Recommendation: option (1) or (2) depending on performance testing.

---

### C10.11 Estimates

| Item | Estimate |
|------|----------|
| Prose -- Part 1 (number theory, stages 1-4) | 4,500-5,500 words |
| Prose -- Part 2 (quantum order-finding, stages 5-8) | 5,000-6,000 words |
| Prose -- Part 3 (continued fractions + full example, stages 9-10) | 4,500-5,500 words |
| Prose -- Part 4 (complexity + implications, stages 11-14) | 3,500-4,500 words |
| Theorems and proofs | 2,500-3,000 words |
| Worked examples (5 examples with full derivations) | 4,000-5,000 words |
| Problem set (12 problems with setup text) | 1,500-2,000 words |
| Historical notes | 800-1,000 words |
| Total | 26,300-32,500 words |
| Figures/diagrams | 10 visual assets |
| Simulator templates | 4 pre-built circuits |
| Estimated reading time | 90-120 minutes |
| Estimated completion time (with problems) | 6-8 hours |

---

### C10.12 Page Splits

**Four pages** (expanded from the 3 specified in the site architecture to accommodate the 20,000-25,000 word target; if 3 parts are mandated, merge Parts 3 and 4).

**Part 1** (`/lessons/c10-shor/part-1`): "Number Theory: From Factoring to Order-Finding"
- Sections: RSA and the factoring problem, modular arithmetic review, factoring-to-order reduction (with proof), algorithm outline
- Worked Example: C10-E1 (order computation for a=7, N=15)
- Target: 5,000-6,000 words
- Internal anchors: `#factoring-problem`, `#modular-arithmetic`, `#order-finding-reduction`, `#algorithm-outline`

**Part 2** (`/lessons/c10-shor/part-2`): "Quantum Order-Finding"
- Sections: modular exponentiation unitary, eigenstates of U_a, superposition trick, quantum order-finding circuit
- Worked Example: C10-E2 (eigenstates of U_7)
- Target: 5,000-6,000 words
- Internal anchors: `#modular-exponentiation`, `#eigenstates`, `#superposition-trick`, `#order-finding-circuit`

**Part 3** (`/lessons/c10-shor/part-3`): "The Complete Algorithm: Factoring 15"
- Sections: continued fractions, end-to-end example (N=15, a=7), additional examples, complexity analysis
- Worked Examples: C10-E3 (full circuit trace), C10-E4 (a=11), C10-E5 (continued fractions)
- Target: 6,000-7,000 words
- Internal anchors: `#continued-fractions`, `#factor-15`, `#complexity`

**Part 4** (`/lessons/c10-shor/part-4`): "Implications and the Road Ahead"
- Sections: cryptographic implications, practical requirements, post-quantum cryptography, the bigger picture (hidden subgroup problem), Track C retrospective
- Target: 4,000-5,000 words
- Internal anchors: `#cryptographic-implications`, `#practical-requirements`, `#post-quantum`, `#bigger-picture`, `#track-c-retrospective`

The four-part split maps to the four natural phases of understanding Shor's algorithm: (1) the classical reduction, (2) the quantum machinery, (3) putting it all together, (4) what it means. Each part is self-contained enough that a student can pause between parts.

---

