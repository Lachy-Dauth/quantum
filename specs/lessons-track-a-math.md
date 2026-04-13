# Track A: Math for Quantum -- Lesson Specifications

**Version:** 1.0
**Date:** 2026-04-13
**Status:** Draft

This document contains exhaustive specifications for lessons A1 through A6 of Track A (Math for Quantum). Each lesson spec is a blueprint for the content author: it prescribes learning objectives, the pedagogical arc, every theorem and proof strategy, every visual asset, worked examples with actual numbers, common confusions, cross-references, history, problem sets, and production estimates. The content author should be able to write the full lesson from this spec alone, with no ambiguity about scope or depth.

**Canonical order context:** A1 -> A2 -> A3 -> P1 -> P2 -> C1 -> C2 -> A4 -> P3 -> P4 -> C3 -> A5 -> P5 -> P6 -> C4 -> A6 -> C5 -> C6 -> C7 -> P7 -> C8 -> C9 -> C10

---

## A1 -- Complex Numbers and Euler's Formula

**Position in canonical order:** 1 of 23 (first lesson overall)
**Prerequisites:** High-school algebra, basic trigonometry, familiarity with Cartesian coordinates
**Unlocks:** A2 (Vectors in C^n), and transitively everything else

---

### 1. Learning Objectives

By the end of this lesson the student will be able to:

1. Represent any complex number in both rectangular (a + bi) and polar (r e^{i theta}) form, and convert fluently between them.
2. Perform addition, subtraction, multiplication, and division of complex numbers in whichever form is most efficient, and explain geometrically why multiplication "rotates and scales."
3. Compute the complex conjugate z* and the modulus |z| of any complex number, and prove that z z* = |z|^2.
4. State and apply the triangle inequality |z + w| <= |z| + |w|, including identifying when equality holds.
5. Find all n-th roots of unity, plot them on the Argand plane, and verify they sum to zero.
6. Derive Euler's formula e^{i theta} = cos theta + i sin theta via both Taylor series and the geometric/ODE argument, and state its domain of validity.
7. Distinguish between global phase (e^{i phi} |psi>) and relative phase (superposition coefficients with different phases), and explain why global phase is physically unobservable in quantum mechanics.
8. Evaluate expressions like e^{i pi/4}, e^{-i pi/2}, and (1+i)^8 using polar form.
9. Sketch sets in the complex plane defined by equations or inequalities (e.g., |z - z_0| = r, Re(z) > 0, |z| <= 1).

---

### 2. Intuition-Building Arc

The lesson follows a geometric-first, then algebraic, then analytic arc:

**Stage 1 -- The Argand Plane as a Map (geometric).** Open with the question: "What number, multiplied by itself, gives -1?" Introduce i not as an abstraction but as a 90-degree rotation of the real line. The Argand plane is introduced immediately, with the real axis horizontal and the imaginary axis vertical. Every algebraic operation is given a geometric interpretation before any formula is written. Rationale: students who have "seen complex numbers once" usually learned them algebraically and never internalised the geometry. Starting geometric builds the spatial intuition they will need for Bloch-sphere visualisation later.

**Stage 2 -- Arithmetic as Geometry (algebraic + geometric).** Addition is vector addition (parallelogram rule). Multiplication is "multiply moduli, add arguments" -- derived algebraically from (r_1 e^{i theta_1})(r_2 e^{i theta_2}) and confirmed with explicit rectangular multiplication. Division is the inverse. Conjugation is reflection across the real axis. This stage interleaves algebra and geometry so neither becomes disconnected from the other.

**Stage 3 -- Roots of Unity (algebraic + geometric).** The n-th roots of unity are derived from z^n = 1 in polar form, yielding omega_k = e^{2 pi i k/n}. They are plotted as regular polygons on the unit circle. The sum-to-zero property is proved both algebraically (geometric series formula) and geometrically (symmetry argument). This section previews the discrete Fourier transform connection (forward-ref to C9).

**Stage 4 -- Euler's Formula: Two Derivations (analytic + geometric).** First derivation: Taylor series for e^x, sin x, cos x; substitute x = i theta; group real and imaginary parts. Second derivation: consider f(theta) = e^{i theta}; note f(0)=1, f'(theta) = i f(theta), so the point traces the unit circle at unit speed with velocity perpendicular to position. Both derivations are given in full because they exercise different skills (series manipulation vs. ODE reasoning) and because the ODE argument is the one that generalises to matrix exponentials in A3.

**Stage 5 -- Phase in Quantum Mechanics (physical preview).** Briefly introduce the idea that quantum states are represented by complex vectors, and that multiplying the entire vector by e^{i phi} does not change any physical prediction (global phase). But if a state is alpha|0> + beta|1>, the relative phase between alpha and beta does matter. This is a forward-looking motivational section -- no quantum formalism is assumed, just the idea that "direction matters, overall sign doesn't." Rationale: gives the student a reason to care about phases before they encounter the physics.

---

### 3. Theorems, Definitions & Lemmas

**Definition 3.1 (Complex Number).** A complex number is an ordered pair (a, b) in R^2 equipped with addition (a,b) + (c,d) = (a+c, b+d) and multiplication (a,b)(c,d) = (ac - bd, ad + bc). We write a + bi where i = (0,1). State that C forms a field.

**Definition 3.2 (Conjugate, Modulus, Argument).** For z = a + bi: conjugate z* = a - bi; modulus |z| = sqrt(a^2 + b^2); argument arg(z) = atan2(b, a), defined modulo 2 pi.

**Lemma 3.3 (Conjugate Identities).** (i) (z + w)* = z* + w*; (ii) (zw)* = z* w*; (iii) z z* = |z|^2; (iv) z** = z. Proof strategy: direct computation from rectangular form for each.

**Proposition 3.4 (Modulus is Multiplicative).** |zw| = |z||w|. Proof strategy: compute |zw|^2 = (zw)(zw)* = zw z* w* = |z|^2 |w|^2 using Lemma 3.3, then take square roots (both sides non-negative).

**Theorem 3.5 (Triangle Inequality).** |z + w| <= |z| + |w|, with equality iff one is a non-negative real multiple of the other. Proof strategy: square both sides, expand |z+w|^2 = (z+w)(z+w)* = |z|^2 + |w|^2 + 2 Re(z w*), then use Re(z w*) <= |z w*| = |z||w|.

**Theorem 3.6 (Euler's Formula).** For all theta in R, e^{i theta} = cos theta + i sin theta. Proof strategy 1 (Taylor): write e^{i theta} = sum_{n>=0} (i theta)^n / n!, separate even/odd terms, identify cos and sin series. Proof strategy 2 (ODE): let f(theta) = cos theta + i sin theta; verify f(0) = 1 and f'(theta) = i f(theta); since g(theta) = e^{i theta} satisfies the same IVP and the IVP has a unique solution (Picard-Lindelof), f = g.

**Corollary 3.7 (Euler's Identity).** e^{i pi} + 1 = 0. Immediate from Theorem 3.6 with theta = pi.

**Proposition 3.8 (Roots of Unity).** The solutions of z^n = 1 are omega_k = e^{2 pi i k / n} for k = 0, 1, ..., n-1. Proof strategy: write z = r e^{i theta}, then z^n = r^n e^{i n theta} = 1 requires r = 1 and n theta = 2 pi k.

**Lemma 3.9 (Roots of Unity Sum to Zero).** sum_{k=0}^{n-1} omega_k = 0 for n >= 2. Proof strategy: geometric series formula: sum = (1 - omega^n)/(1 - omega) where omega = e^{2 pi i/n}; numerator is 1 - 1 = 0; denominator is nonzero since omega != 1.

**Definition 3.10 (Global vs Relative Phase).** Given a nonzero vector v in C^n, the global phase is any scalar e^{i phi} such that v and e^{i phi} v are considered equivalent. The relative phase between components v_j and v_k is arg(v_j) - arg(v_k). (Informal definition here; formal treatment in P2/C1.)

---

### 4. Visual Assets

**VA-1: Interactive Argand Plane**
- Type: Interactive widget (Canvas/SVG)
- Description: A coordinate plane with real (horizontal) and imaginary (vertical) axes. The student can click to place a complex number z; its rectangular coordinates (a, b), polar coordinates (r, theta), and exponential form r e^{i theta} are displayed in a side panel. Dragging z updates all representations in real time.
- Axes: Real axis labeled "Re", imaginary axis labeled "Im", unit circle shown as a dashed grey circle.
- What to notice: The modulus is the distance from the origin; the argument is the angle from the positive real axis measured counterclockwise.
- Interactive controls: Click-to-place, drag-to-move, toggle for showing/hiding the unit circle, toggle for degree/radian angle display.

**VA-2: Multiplication Visualiser**
- Type: Interactive widget
- Description: Two complex numbers z and w are shown on the Argand plane (in different colours). Their product zw is shown in a third colour. The student can drag z or w and see zw update. Arcs showing arg(z), arg(w), and arg(zw) = arg(z) + arg(w) are drawn. Lengths |z|, |w|, |zw| are annotated.
- What to notice: Multiplication rotates by the argument and scales by the modulus. When |z| = 1, multiplication by z is a pure rotation.
- Interactive controls: Drag z, drag w. Toggle "constrain to unit circle" for z to isolate rotation.

**VA-3: Roots of Unity Diagram**
- Type: Static diagram with interactive n-slider
- Description: The n-th roots of unity plotted on the unit circle, forming a regular n-gon inscribed in the circle. Lines from the origin to each root are drawn. A slider controls n from 2 to 12.
- Axes: Unit circle, Re/Im axes.
- What to notice: Roots are equally spaced; as n increases the polygon approximates a circle; the centroid (= average = sum/n) is always at the origin.
- Interactive controls: Slider for n; hover on a root to see its exact value.

**VA-4: Euler's Formula Circle Animation**
- Type: Animated diagram
- Description: A point traces the unit circle as theta increases from 0 to 2 pi. At each frame, the cos theta and sin theta projections are drawn as dashed lines to the axes. The position vector from origin to the point is drawn solid. A velocity arrow (tangent to the circle, equal to i e^{i theta}) is shown, perpendicular to the position vector.
- What to notice: The velocity is always perpendicular to the position (i.e., i times the position vector), confirming f'(theta) = i f(theta). This is the geometric content of Euler's formula.
- Interactive controls: Play/pause, speed control, manual theta slider.

**VA-5: Global vs Relative Phase Visualiser**
- Type: Interactive widget
- Description: Two complex amplitudes alpha and beta are shown as vectors in separate small Argand planes (labeled "|0> amplitude" and "|1> amplitude"). A global-phase dial rotates both simultaneously by e^{i phi}. A relative-phase dial rotates only beta. A bar chart shows |alpha|^2 and |beta|^2 (measurement probabilities).
- What to notice: Global phase changes the arrows but not the bar chart. Relative phase changes the arrows AND will matter once we introduce interference (forward-ref to C3), but still does not change the bar chart in the computational basis.
- Interactive controls: Global-phase dial, relative-phase dial, preset buttons for common states (|0>, |+>, |i>).

**VA-6: Triangle Inequality Diagram**
- Type: Interactive diagram
- Description: Three vectors drawn from the origin: z (blue), w (green, tail at tip of z), and z+w (red, from origin to tip of w). The inequality |z+w| <= |z| + |w| is visualised: the direct path (red) is never longer than the two-segment path (blue then green).
- What to notice: Equality holds when z and w point in the same direction.
- Interactive controls: Drag endpoints of z and w.

---

### 5. Worked Examples

**Example 5.1: Geometric Multiplication**
Compute (1 + i)(sqrt(3) + i) and interpret geometrically.

Step 1: Convert to polar. 1 + i has modulus sqrt(2), argument pi/4. sqrt(3) + i has modulus sqrt(3 + 1) = 2, argument pi/6 (since tan(theta) = 1/sqrt(3)).
Step 2: Multiply in polar. Product has modulus sqrt(2) * 2 = 2 sqrt(2), argument pi/4 + pi/6 = 5 pi/12.
Step 3: Verify in rectangular. (1+i)(sqrt(3)+i) = sqrt(3) + i + i sqrt(3) + i^2 = (sqrt(3)-1) + (1+sqrt(3))i. Check modulus: (sqrt(3)-1)^2 + (1+sqrt(3))^2 = (3 - 2 sqrt(3) + 1) + (1 + 2 sqrt(3) + 3) = 8. So modulus = sqrt(8) = 2 sqrt(2). Confirmed.
Narration: This example demonstrates that polar form makes multiplication conceptually transparent (rotate and scale) while rectangular form is mechanical but less insightful. In quantum computing, gate operations are often multiplications by unit-modulus complex numbers, so the rotation interpretation is the one students will use daily.

**Example 5.2: Finding the 4th Roots of Unity**
Find all z such that z^4 = 1.

Step 1: Write z = e^{i theta}. Then z^4 = e^{4 i theta} = 1 = e^{i * 0}, so 4 theta = 2 pi k for integer k.
Step 2: theta = pi k / 2. For k = 0, 1, 2, 3 we get theta = 0, pi/2, pi, 3 pi/2.
Step 3: The four roots are 1, i, -1, -i. Plot them: they sit at the four cardinal points of the unit circle, forming a square.
Step 4: Verify sum = 1 + i + (-1) + (-i) = 0.
Narration: The 4th roots of unity will reappear as eigenvalues of the Pauli-Z gate squared (the S gate, in C3), and the structure of roots of unity is central to the Quantum Fourier Transform (C9). Establishing the pattern now pays off later.

**Example 5.3: Euler's Formula at Key Angles**
Evaluate e^{i pi/4} and express in rectangular form.

Step 1: e^{i pi/4} = cos(pi/4) + i sin(pi/4) = 1/sqrt(2) + i/sqrt(2).
Step 2: Verify modulus: |e^{i pi/4}|^2 = 1/2 + 1/2 = 1. (Euler's formula always lives on the unit circle.)
Step 3: This number appears constantly in quantum computing: the T gate applies a phase of e^{i pi/4}, and the Hadamard gate's entries involve 1/sqrt(2). (Forward-ref C3, C5.)
Narration: We compute this to build fluency with the "Euler's formula lookup table" that students should internalise: the values at multiples of pi/6, pi/4, pi/3, pi/2, and pi.

**Example 5.4: Conjugate Simplification**
Simplify (3 + 4i) / (1 - 2i) and find its modulus.

Step 1: Multiply numerator and denominator by conjugate of denominator: (3+4i)(1+2i) / (1-2i)(1+2i).
Step 2: Denominator: (1)^2 + (2)^2 = 5 (using z z* = |z|^2). Numerator: 3 + 6i + 4i + 8i^2 = 3 + 10i - 8 = -5 + 10i.
Step 3: Result: (-5 + 10i)/5 = -1 + 2i.
Step 4: Modulus: |-1 + 2i| = sqrt(1 + 4) = sqrt(5). Cross-check via modulus quotient rule: |3+4i|/|1-2i| = 5/sqrt(5) = sqrt(5). Confirmed.
Narration: The "multiply by the conjugate" trick for division is the prototype of a technique that recurs in inner-product calculations (A2) and in simplifying quantum amplitudes. The modulus cross-check teaches students to use |zw| = |z||w| as a sanity check.

**Example 5.5: Computing (1+i)^8**
Step 1: Convert 1+i to polar: modulus sqrt(2), argument pi/4.
Step 2: (1+i)^8 = (sqrt(2))^8 * e^{i * 8 * pi/4} = 16 * e^{i * 2 pi} = 16 * 1 = 16.
Step 3: The answer is a positive real number. This is surprising from rectangular form but obvious in polar.
Narration: This example is chosen to make the case for polar form as the natural representation for powers. The analogue in quantum computing: repeated application of a gate R_z(theta) gives R_z(n theta), which is trivial in the eigenvalue picture but painful in matrix form.

---

### 6. Common Confusions

**CC-1: "i is imaginary, so it isn't a real thing."**
Wrong model: Students treat complex numbers as a useful fiction with no concrete meaning. This leads to discomfort when told that physical amplitudes are complex.
Why tempting: The word "imaginary" invites this reading, and most physics courses frame complex numbers as "mathematical convenience."
Corrective argument: i has a concrete geometric meaning: it is a 90-degree rotation. Complex multiplication is rotation + scaling. Quantum mechanics does not use complex numbers as a convenience -- they are the natural language for describing interference. (The recent Renou et al. 2021 result shows that real quantum mechanics is strictly weaker than complex quantum mechanics.)

**CC-2: Confusing argument addition with modulus addition.**
Wrong model: |z||w| e^{i(arg(z) + arg(w))} gets misremembered as (|z| + |w|) e^{i(arg(z) * arg(w))} or similar garbling.
Why tempting: Multiplication "combines" things, and students conflate the two combining operations.
Corrective argument: Drill the rule: "multiply moduli, add arguments." Provide the mnemonic: multiplication is "scale then rotate" -- scaling (modulus) is multiplicative, rotation (argument) is additive. Draw the analogy to logarithms: log(ab) = log a + log b.

**CC-3: arg(z) is uniquely defined.**
Wrong model: Students write arg(1+i) = pi/4 and treat it as the only answer.
Why tempting: In real analysis, functions are single-valued.
Corrective argument: arg is multi-valued: arg(1+i) = pi/4 + 2 pi k for any integer k. The principal argument Arg(z) in (-pi, pi] is single-valued but has a branch cut. This matters when taking complex logarithms and will matter for the branch structure of the complex exponential. For this course, emphasise that angles are "modulo 2 pi" and be consistent about the principal-value convention.

**CC-4: Global phase vs relative phase.**
Wrong model: "If phase doesn't matter, why do we keep track of it?"
Why tempting: Students hear "global phase is unobservable" and generalise to "all phase is unobservable."
Corrective argument: Global phase (multiplying the entire state by e^{i phi}) is unobservable. Relative phase (different components having different phases) is observable through interference. The Hadamard gate (C3) converts relative phase into measurement probability differences. The entire power of quantum computing depends on manipulating relative phases. This distinction is one of the most important ideas in the course.

**CC-5: Confusing z* with -z.**
Wrong model: Students negate both components instead of negating only the imaginary part.
Why tempting: Both operations "flip" something, and the notation can look similar in some sources.
Corrective argument: Geometrically, z* reflects across the real axis (flip vertically); -z reflects through the origin (flip both). They are different operations. Verify: (3+4i)* = 3-4i but -(3+4i) = -3-4i. The conjugate preserves the real part; negation negates both parts.

---

### 7. Cross-References

**Backward references:** None (A1 is the first lesson in the entire curriculum).

**Forward references within Track A:**
- A2: Inner product ⟨u|v⟩ requires conjugation (one of the key uses of the conjugate introduced here).
- A3: Matrix exponential e^{iHt} generalises Euler's formula from scalars to matrices; the ODE derivation of Euler's formula is the template.
- A4: Eigenvalues of Hermitian matrices are real; eigenvalues of unitary matrices are complex numbers of modulus 1 (points on the unit circle from this lesson).
- A6: Born rule probabilities involve |amplitude|^2, relying on modulus.

**Forward references to Track P:**
- P1: Interference phenomena require complex amplitudes; the double-slit is the first physical example.
- P2: Postulate 1 uses complex Hilbert spaces; global-phase equivalence introduced here becomes formal.

**Forward references to Track C:**
- C1: Qubit amplitudes are complex numbers; relative phase determines the azimuthal angle on the Bloch sphere.
- C3: Phase gates (S, T, R_z) multiply amplitudes by e^{i theta}.
- C9: QFT uses n-th roots of unity (omega = e^{2 pi i / N}).

---

### 8. Historical Notes

- Complex numbers were first used by **Gerolamo Cardano** (1545, Ars Magna) in the context of solving cubic equations, though he called them "sophistic" and considered them useless.
- The geometric interpretation as points in the plane was developed independently by **Caspar Wessel** (1799), **Jean-Robert Argand** (1806), and **Carl Friedrich Gauss** (1831). The "Argand plane" is named for Argand despite Wessel's priority.
- **Leonhard Euler** (1748, Introductio in Analysin Infinitorum) first wrote e^{i theta} = cos theta + i sin theta, though the formula is implicit in earlier work of **Roger Cotes** (1714).
- The special case e^{i pi} + 1 = 0, often called "the most beautiful equation in mathematics," connects five fundamental constants. Euler did not single it out; its fame is largely 20th-century.
- The essential role of complex numbers in quantum mechanics became clear with **Schrodinger** (1926) and **Born** (1926). Whether complex numbers are merely convenient or physically necessary was an open question until **Renou, Trout, Gisin et al.** (2021, Nature) proved that real quantum mechanics cannot reproduce all quantum predictions.

---

### 9. Problem Set

**Problem A1.1 [Easy]**
Convert z = -1 + i sqrt(3) to polar form. Give the modulus and principal argument.
Solution sketch: |z| = sqrt(1+3) = 2. arg(z) = atan2(sqrt(3), -1) = pi - pi/3 = 2 pi/3. So z = 2 e^{i 2 pi/3}.

**Problem A1.2 [Easy]**
Compute (2 e^{i pi/3})(3 e^{i pi/6}) in both polar and rectangular form.
Solution sketch: Polar: 6 e^{i pi/2} = 6i. Rectangular: verify by expanding (2 cos(pi/3) + 2i sin(pi/3))(3 cos(pi/6) + 3i sin(pi/6)) = (1 + i sqrt(3))(3 sqrt(3)/2 + 3i/2); multiply out to get 6i.

**Problem A1.3 [Easy]**
Prove that |z*| = |z| for all z in C.
Solution sketch: Let z = a + bi. Then z* = a - bi, |z*| = sqrt(a^2 + (-b)^2) = sqrt(a^2 + b^2) = |z|.

**Problem A1.4 [Medium]**
Find all z such that z^6 = -1. Express answers in exponential form and plot them.
Solution sketch: z^6 = e^{i pi}, so z = e^{i(pi + 2 pi k)/6} for k = 0,...,5. These are e^{i pi/6}, e^{i pi/2}, e^{i 5 pi/6}, e^{i 7 pi/6}, e^{i 3 pi/2}, e^{i 11 pi/6}. Six points forming a regular hexagon rotated by pi/6 from the standard position.

**Problem A1.5 [Medium]**
Prove the parallelogram law: |z + w|^2 + |z - w|^2 = 2(|z|^2 + |w|^2).
Solution sketch: Expand each term using |v|^2 = v v*: |z+w|^2 = |z|^2 + z w* + w z* + |w|^2, |z-w|^2 = |z|^2 - z w* - w z* + |w|^2. Sum: 2|z|^2 + 2|w|^2. (Cross terms cancel.)

**Problem A1.6 [Medium]**
Show that for any z on the unit circle (|z|=1), Re(z) = (z + z*)/2 and Im(z) = (z - z*)/(2i). Then show these identities hold for all z in C, not just |z|=1.
Solution sketch: Write z = a + bi. Then z + z* = 2a, so Re(z) = (z + z*)/2. And z - z* = 2bi, so Im(z) = (z - z*)/(2i). No assumption on |z| is used, so the identities hold for all z.

**Problem A1.7 [Medium]**
The T gate in quantum computing multiplies a qubit amplitude by e^{i pi/4}. If the initial amplitude is alpha = (1+i)/2, find the new amplitude T alpha and verify that |T alpha|^2 = |alpha|^2.
Solution sketch: e^{i pi/4} = (1+i)/sqrt(2). So T alpha = (1+i)/sqrt(2) * (1+i)/2 = (1+i)^2 / (2 sqrt(2)) = 2i / (2 sqrt(2)) = i/sqrt(2). Check: |T alpha|^2 = 1/2. And |alpha|^2 = |(1+i)/2|^2 = 2/4 = 1/2. Confirmed: modulus-1 multiplication preserves probabilities.

**Problem A1.8 [Hard]**
Prove that if |z| = 1 and z != 1, then sum_{k=0}^{n-1} z^k = (1 - z^n)/(1 - z). Use this to show that the n-th roots of unity (other than 1) are roots of 1 + z + z^2 + ... + z^{n-1} = 0.
Solution sketch: Geometric series: let S = sum z^k. Then zS = sum_{k=1}^{n} z^k = S - 1 + z^n, so S(1-z) = 1 - z^n. For omega_j = e^{2 pi i j/n} with j != 0: omega_j^n = 1, so numerator is 0, denominator is nonzero (omega_j != 1). Hence S = 0. This means 1 + omega_j + ... + omega_j^{n-1} = 0, so omega_j is a root of the polynomial z^{n-1} + ... + z + 1 = (z^n - 1)/(z - 1).

**Problem A1.9 [Hard]**
Let z = e^{i theta}. Express cos(theta) and sin(theta) in terms of z. Use this to prove that cos^2(theta) + sin^2(theta) = 1 purely algebraically (without invoking the Pythagorean theorem or the unit circle).
Solution sketch: cos(theta) = (z + z^{-1})/2, sin(theta) = (z - z^{-1})/(2i). Then cos^2 + sin^2 = (z + z^{-1})^2/4 + (z - z^{-1})^2/(4 * (-1)) = (z^2 + 2 + z^{-2})/4 - (z^2 - 2 + z^{-2})/4 = 4/4 = 1.

**Problem A1.10 [Hard]**
(Preview) In quantum mechanics, two states |psi> and e^{i phi}|psi> are physically indistinguishable. Consider the state |psi> = (1/sqrt(2))(|0> + e^{i theta}|1>). For what values of theta are the measurement probabilities in the {|0>, |1>} basis identical? For what values are they distinguishable by some other measurement? (You may assume that the Hadamard basis {|+>, |->} with |+-> = (|0> +- |1>)/sqrt(2) is also available.)
Solution sketch: In computational basis: P(0) = 1/2, P(1) = 1/2 for all theta -- so computational-basis measurements cannot distinguish different theta. In Hadamard basis: P(+) = |<+|psi>|^2 = |(1 + e^{i theta})/2|^2 = cos^2(theta/2). This depends on theta, so Hadamard-basis measurements distinguish different relative phases. This is the essence of why relative phase matters.

---

### 10. Simulator Dependencies

No custom simulator is required for A1. The interactive widgets (VA-1 through VA-6) are standalone visualisations that do not depend on the quantum circuit simulator specified in `simulator-spec.md`. They require only a 2D canvas/SVG rendering library.

---

### 11. Estimates

- **Word count target:** 4,000 -- 5,000 words (lesson body, excluding problem solutions)
- **Student time:** 90 -- 120 minutes (reading + working through examples + problem set)
- **Development time:** 12 -- 16 hours (writing + widget development + review)

---

### 12. Page Splits

Recommended split into two pages:

- **Page A1a: Complex Arithmetic and the Argand Plane** (Sections covering Stages 1-2 of the arc, Definitions 3.1-3.2, Lemma 3.3, Proposition 3.4, Theorem 3.5, visual assets VA-1, VA-2, VA-6, Worked Examples 5.1, 5.4, Problems A1.1-A1.5)
- **Page A1b: Euler's Formula, Roots of Unity, and Phase** (Sections covering Stages 3-5 of the arc, Theorem 3.6, Corollary 3.7, Proposition 3.8, Lemma 3.9, Definition 3.10, visual assets VA-3, VA-4, VA-5, Worked Examples 5.2, 5.3, 5.5, Problems A1.6-A1.10)

Rationale: The lesson is long enough that a single page would feel overwhelming. The split is at a natural conceptual boundary: basic arithmetic vs. deeper structural results.

---

## A2 -- Vectors in C^n and Inner Products

**Position in canonical order:** 2 of 23
**Prerequisites:** A1 (complex numbers, conjugate, modulus)
**Unlocks:** A3 (matrices over C), and transitively P1, P2, C1, C2

---

### 1. Learning Objectives

By the end of this lesson the student will be able to:

1. Write vectors in C^n in column notation and Dirac ket notation |v>, and translate between the two.
2. Compute the inner product <u|v> = u^dagger v using the physics convention (conjugate-linear in the first argument), and explain why conjugation is necessary for the inner product to induce a positive-definite norm.
3. Compute the norm ||v|| = sqrt(<v|v>) and normalise any nonzero vector.
4. Determine whether two vectors are orthogonal using the inner product.
5. State and prove the Cauchy-Schwarz inequality |<u|v>| <= ||u|| ||v||, and identify the equality condition.
6. Apply the Gram-Schmidt procedure to produce an orthonormal basis from a linearly independent set in C^n.
7. Express any vector as a linear combination of an orthonormal basis using the formula v = sum_i <e_i|v> |e_i>, and explain why the coefficients are inner products.
8. Interpret |<e_i|v>|^2 as the "probability of finding v in direction e_i" (forward-ref to Born rule, A6/P2), and verify that these probabilities sum to 1 for a normalised v.
9. Distinguish between a vector space over R and a vector space over C, identifying which properties change (e.g., the inner product must be sesquilinear, not bilinear).

---

### 2. Intuition-Building Arc

**Stage 1 -- Familiar Ground: Vectors in R^2 (geometric).** Begin with real 2D vectors. Recall dot product u . v = |u||v| cos theta, orthogonality, projection. Draw pictures. The goal is to activate existing geometric intuition before anything complex appears. Rationale: most students have a solid (if rusty) mental model of real vectors, and anchoring the complex case to this model prevents the abstraction from feeling unmotivated.

**Stage 2 -- Why R^n is Not Enough (motivational).** Pose the question: "What if we allow the entries of our vectors to be complex numbers?" Motivate this by noting (informally) that quantum states have complex amplitudes (forward-ref P2, C1). The key observation: the naive dot product u^T v does not give a real non-negative "length squared" when entries are complex. Example: u = (1, i)^T, then u^T u = 1 + i^2 = 0, but u is not the zero vector. This "failure of the dot product" motivates the conjugate.

**Stage 3 -- The Inner Product on C^n (algebraic).** Define <u|v> = sum_j u_j* v_j = u^dagger v. Verify that <v|v> >= 0 with equality iff v = 0. Show that <u|v> = <v|u>* (conjugate symmetry). Demonstrate on the failing example: <u|u> = 1*1 + (-i)(i) = 1 + 1 = 2 > 0. Introduce the physics convention explicitly and contrast with the mathematics convention (conjugate-linear in the second argument). We use physics convention throughout.

**Stage 4 -- Dirac Notation (notational + conceptual).** Introduce |v> (ket), <v| (bra), and <u|v> (bracket). Explain that <v| is the conjugate transpose of |v>, so <u|v> is a 1x1 matrix, i.e., a scalar. This notation will be used for the rest of the course. Emphasise: |v><w| is an outer product (a matrix), while <v|w> is an inner product (a scalar). The juxtaposition notation is Dirac's great notational invention.

**Stage 5 -- Cauchy-Schwarz and its Consequences (algebraic + geometric).** State and prove Cauchy-Schwarz. The proof strategy is the standard "consider ||u - t v||^2 >= 0, optimise over t" approach, adapted for C^n (the optimal t is <v|u>/<v|v>, not <u|v>/<v|v>, because of the conjugate-linearity convention). Draw the geometric interpretation: the inner product measures "overlap" or "projection." The triangle inequality for norms follows as a corollary.

**Stage 6 -- Orthonormal Bases and Gram-Schmidt (algebraic + procedural).** Define orthonormal basis. State the expansion theorem: v = sum <e_i|v> |e_i>. Prove it by taking <e_j| of both sides and using orthonormality. Walk through Gram-Schmidt on C^2 and C^3 examples. Emphasise that the procedure works identically to the real case except that inner products involve conjugates.

**Stage 7 -- Components as Overlaps: The Measurement Preview (physical preview).** Reinterpret the expansion v = sum c_i |e_i> where c_i = <e_i|v>. For a normalised |v>, sum |c_i|^2 = 1 (proved from <v|v> = 1 and expanding in the basis). Observe that |c_i|^2 looks like a probability distribution. This is exactly the Born rule (forward-ref A6, P2). Measuring a quantum state |psi> in the basis {|e_i>} gives outcome i with probability |<e_i|psi>|^2. This is the deepest idea in quantum mechanics, and it rests entirely on the inner product.

---

### 3. Theorems, Definitions & Lemmas

**Definition 3.1 (C^n as a Vector Space).** C^n is the set of n-tuples of complex numbers with componentwise addition and scalar multiplication by elements of C. It is a vector space over C of dimension n.

**Definition 3.2 (Inner Product on C^n -- Physics Convention).** For u, v in C^n, the inner product is <u|v> = sum_{j=1}^n u_j* v_j = u^dagger v. Properties: (i) <u|v> = <v|u>*; (ii) <u| alpha v + beta w> = alpha <u|v> + beta <u|w> (linear in the second argument); (iii) <alpha u + beta w | v> = alpha* <u|v> + beta* <w|v> (conjugate-linear in the first); (iv) <v|v> >= 0 with equality iff v = 0.

**Definition 3.3 (Norm).** ||v|| = sqrt(<v|v>). A vector is normalised (or a unit vector) if ||v|| = 1.

**Definition 3.4 (Orthogonality, Orthonormality).** Vectors u, v are orthogonal if <u|v> = 0. A set {|e_1>, ..., |e_n>} is orthonormal if <e_i|e_j> = delta_{ij} (Kronecker delta).

**Definition 3.5 (Dirac Notation).** |v> denotes a column vector in C^n (a "ket"). <v| = (|v>)^dagger denotes the corresponding row vector with conjugated entries (a "bra"). <u|v> is the inner product (a "bracket"). |u><v| is the outer product, an n x n matrix with entries (|u><v|)_{jk} = u_j v_k*.

**Theorem 3.6 (Cauchy-Schwarz Inequality).** For all u, v in C^n: |<u|v>| <= ||u|| ||v||, with equality iff u and v are linearly dependent (one is a scalar multiple of the other).
Proof strategy: If v = 0, both sides are 0. Otherwise, for any t in C, consider 0 <= ||u - tv||^2 = <u - tv | u - tv> = ||u||^2 - t*<v|u> - t<u|v> + |t|^2 ||v||^2. Choose t = <v|u>/||v||^2 (the value that minimises the quadratic). Substituting: 0 <= ||u||^2 - |<u|v>|^2/||v||^2. Rearranging gives |<u|v>|^2 <= ||u||^2 ||v||^2. Equality holds iff ||u - tv|| = 0, i.e., u = tv.

**Corollary 3.7 (Triangle Inequality for Norms).** ||u + v|| <= ||u|| + ||v||.
Proof strategy: ||u+v||^2 = ||u||^2 + 2 Re(<u|v>) + ||v||^2 <= ||u||^2 + 2|<u|v>| + ||v||^2 <= ||u||^2 + 2||u||||v|| + ||v||^2 = (||u||+||v||)^2. Take square roots.

**Theorem 3.8 (Orthonormal Expansion / Resolution of the Identity).** If {|e_1>, ..., |e_n>} is an orthonormal basis for C^n and |v> is any vector, then |v> = sum_{i=1}^n <e_i|v> |e_i>. Equivalently, sum_{i=1}^n |e_i><e_i| = I (the identity matrix). This is called the completeness relation.
Proof strategy: Write |v> = sum_i c_i |e_i> (any vector can be written in terms of a basis). Take <e_j| of both sides: <e_j|v> = sum_i c_i <e_j|e_i> = sum_i c_i delta_{ji} = c_j. So c_j = <e_j|v>. For the operator form: consider the action of (sum_i |e_i><e_i|) on an arbitrary |v>. It gives sum_i <e_i|v> |e_i> = |v>. Since this holds for all |v>, the operator equals I.

**Theorem 3.9 (Parseval's Identity / Norm Preservation).** If {|e_i>} is an orthonormal basis and |v> = sum_i c_i |e_i>, then ||v||^2 = sum_i |c_i|^2.
Proof strategy: <v|v> = (sum_i c_i* <e_i|)(sum_j c_j |e_j>) = sum_{i,j} c_i* c_j <e_i|e_j> = sum_i |c_i|^2.

**Procedure 3.10 (Gram-Schmidt Orthonormalisation).** Input: linearly independent set {|v_1>, ..., |v_k>} in C^n. Output: orthonormal set {|e_1>, ..., |e_k>} spanning the same subspace. Step 1: |f_1> = |v_1>, |e_1> = |f_1>/||f_1||. Step j (for j >= 2): |f_j> = |v_j> - sum_{i=1}^{j-1} <e_i|v_j> |e_i>; |e_j> = |f_j>/||f_j||. The subtraction removes the projection onto the already-constructed orthonormal vectors. The procedure is well-defined because linear independence ensures ||f_j|| > 0 at each step.

---

### 4. Visual Assets

**VA-1: Real 2D Dot Product Review**
- Type: Interactive diagram
- Description: Two vectors u, v in R^2 drawn from the origin. The angle theta between them is labelled. The projection of u onto v is shown as a dashed segment. The dot product u . v = |u||v| cos theta is computed and displayed.
- Axes: Standard Cartesian (x, y).
- What to notice: The dot product is positive when vectors point in similar directions, zero when perpendicular, negative when they point in opposite directions.
- Interactive controls: Drag endpoints of u and v.

**VA-2: Why the Naive Dot Product Fails**
- Type: Static diagram with callout
- Description: Show u = (1, i)^T plotted conceptually (perhaps with real and imaginary parts of each component shown). Compute u^T u = 1 + i^2 = 0 with a big red "X" and the note "Not a valid norm! This vector is nonzero but its 'length squared' is zero." Then compute <u|u> = 1 + 1 = 2 with a green checkmark.
- What to notice: The conjugation in the inner product is not a convention -- it is forced on us by the requirement that length be positive.

**VA-3: Inner Product in C^2 Visualiser**
- Type: Interactive widget
- Description: Two vectors |u> and |v> in C^2 are specified by the student via four complex-number inputs (two components each), or via sliders for the real and imaginary parts. The widget displays: <u|v> as a complex number (with Argand-plane dot), |<u|v>|, ||u||, ||v||, and the "angle" arccos(|<u|v>|/(||u||||v||)). A Cauchy-Schwarz bar shows |<u|v>| relative to the upper bound ||u||||v||.
- Interactive controls: Sliders or text inputs for components of u and v. Normalisation button.
- What to notice: When u and v are orthogonal, <u|v> = 0. When one is a scalar multiple of the other, Cauchy-Schwarz is tight.

**VA-4: Gram-Schmidt Step-by-Step Animation**
- Type: Animated sequence (step-through)
- Description: Starting with two or three linearly independent vectors in C^2 or C^3 (visualised as arrows in a stylised coordinate system with real/imaginary parts indicated by colour), the animation proceeds through each Gram-Schmidt step: (1) normalise the first vector; (2) subtract the projection of the second vector onto the first, show the projection as a dashed arrow; (3) normalise the result; (4) repeat for the third vector if applicable. Each step is a discrete frame the student clicks through.
- What to notice: After each step, the new vector is perpendicular to all previous ones. The subtraction of the projection is the key geometric operation.
- Interactive controls: Step forward/back buttons. Option to input custom starting vectors.

**VA-5: Completeness Relation Visualiser**
- Type: Interactive widget
- Description: A vector |v> in C^2 is shown along with an orthonormal basis {|e_1>, |e_2>}. The projections <e_1|v>|e_1> and <e_2|v>|e_2> are drawn as component vectors. The student can see that the sum of these projections reconstructs |v>. A bar chart shows |<e_1|v>|^2 and |<e_2|v>|^2, which sum to ||v||^2. If |v> is normalised, the bars sum to 1.
- What to notice: The coefficients |<e_i|v>|^2 form a probability distribution when |v> is normalised. Rotating the basis changes the probabilities but they always sum to 1.
- Interactive controls: Drag |v>. Rotate the orthonormal basis via an angle slider.

**VA-6: Bra-Ket Notation Cheat Sheet**
- Type: Static reference diagram
- Description: A visual "Rosetta stone" showing: column vector <-> |v>; row vector (conjugate transposed) <-> <v|; inner product (scalar) <-> <u|v>; outer product (matrix) <-> |u><v|. Each is shown side-by-side with a concrete 2-component example.
- What to notice: The "bracket" splits into "bra" and "ket." The outer product |u><v| acts on a ket |w> by first computing the scalar <v|w>, then scaling |u>.

---

### 5. Worked Examples

**Example 5.1: Inner Product Computation in C^2**
Let |u> = (1, 2i)^T and |v> = (3, -i)^T. Compute <u|v>.

Step 1: <u| = (u_1*, u_2*) = (1, -2i) (conjugate the entries of |u>).
Step 2: <u|v> = 1 * 3 + (-2i)(-i) = 3 + 2i^2 = 3 - 2 = 1.
Narration: Note that <u|v> came out real in this case, but that is a coincidence. In general <u|v> is complex. Also note: <v|u> = <u|v>* = 1* = 1 (also real here, consistent with <u|v> being real). If we change |v> to (3, i)^T, then <u|v> = 1 * 3 + (-2i)(i) = 3 - 2i^2 = 3 + 2 = 5, which is again real. The pattern -- <u|v> is real when it happens to be -- has no deep significance in general, but when u = v it is always real and non-negative by definition.

**Example 5.2: Verifying Cauchy-Schwarz**
Using |u> = (1, i)^T and |v> = (1, 1)^T, verify that |<u|v>| <= ||u|| ||v||.

Step 1: <u|v> = 1*1 + (-i)*1 = 1 - i. So |<u|v>| = sqrt(1+1) = sqrt(2).
Step 2: ||u|| = sqrt(|1|^2 + |i|^2) = sqrt(1+1) = sqrt(2).
Step 3: ||v|| = sqrt(|1|^2 + |1|^2) = sqrt(2).
Step 4: ||u|| ||v|| = sqrt(2) * sqrt(2) = 2.
Step 5: sqrt(2) <= 2? Yes. Cauchy-Schwarz holds, and it is not tight (because u and v are not proportional: there is no scalar c with (1, i) = c(1, 1), since that would require c = 1 and c = i simultaneously).
Narration: The Cauchy-Schwarz inequality is the single most important inequality in quantum mechanics. The quantity |<u|v>|^2 / (||u||^2 ||v||^2) is called the "fidelity" between two states (when they are normalised) and measures how distinguishable they are. Here the fidelity is 2/4 = 1/2, meaning |u> and |v> are "50% overlapping."

**Example 5.3: Gram-Schmidt in C^2**
Orthonormalise the set {|v_1> = (1, i)^T, |v_2> = (1, 0)^T}.

Step 1: |e_1> = |v_1> / ||v_1|| = (1, i)^T / sqrt(2) = (1/sqrt(2), i/sqrt(2))^T.
Step 2: Compute projection: <e_1|v_2> = (1/sqrt(2))* * 1 + (i/sqrt(2))* * 0 = 1/sqrt(2) + 0 = 1/sqrt(2).
Step 3: |f_2> = |v_2> - <e_1|v_2> |e_1> = (1, 0)^T - (1/sqrt(2))(1/sqrt(2), i/sqrt(2))^T = (1, 0)^T - (1/2, i/2)^T = (1/2, -i/2)^T.
Step 4: ||f_2|| = sqrt(1/4 + 1/4) = sqrt(1/2) = 1/sqrt(2).
Step 5: |e_2> = |f_2>/||f_2|| = (1/2, -i/2)^T * sqrt(2) = (1/sqrt(2), -i/sqrt(2))^T.
Step 6: Verify orthonormality: <e_1|e_2> = (1/sqrt(2))(1/sqrt(2)) + (-i/sqrt(2))(-i/sqrt(2)) = 1/2 + (-i)(-i)/2 = 1/2 + i^2/2 = 1/2 - 1/2 = 0. Confirmed orthogonal. Both have norm 1 by construction.
Narration: Gram-Schmidt in C^n is procedurally identical to the real case but every inner product involves conjugation. This is the only difference. Students who can do Gram-Schmidt in R^n can do it in C^n immediately.

**Example 5.4: Expansion in an Orthonormal Basis (Measurement Preview)**
Let |psi> = (1/sqrt(3), sqrt(2/3) e^{i pi/4})^T (a normalised state in C^2). Expand in the standard basis {|0> = (1,0)^T, |1> = (0,1)^T} and compute the "measurement probabilities."

Step 1: c_0 = <0|psi> = 1/sqrt(3). c_1 = <1|psi> = sqrt(2/3) e^{i pi/4}.
Step 2: |c_0|^2 = 1/3. |c_1|^2 = 2/3.
Step 3: Sum: 1/3 + 2/3 = 1. This is Parseval's identity for a normalised vector: the squared magnitudes of the expansion coefficients sum to 1.
Step 4: Interpretation (preview of A6/P2): if we measure the quantum state |psi> in the {|0>, |1>} basis, we get outcome 0 with probability 1/3 and outcome 1 with probability 2/3. The phase e^{i pi/4} of the second coefficient does not affect these probabilities (it is a relative phase, but it only shows up in other measurement bases).
Narration: This example is the conceptual bridge from linear algebra to quantum mechanics. The inner product is not just a mathematical operation -- it computes the probability of a measurement outcome. This is the Born rule in embryonic form.

**Example 5.5: Outer Product and Projection Operators**
Compute |e_1><e_1| for |e_1> = (1/sqrt(2), i/sqrt(2))^T and verify that it is a projection operator.

Step 1: <e_1| = (1/sqrt(2), -i/sqrt(2)). The outer product |e_1><e_1| is a 2x2 matrix:
|e_1><e_1| = (1/sqrt(2), i/sqrt(2))^T (1/sqrt(2), -i/sqrt(2)) = [[1/2, -i/2], [i/2, 1/2]].
Step 2: Verify idempotence (P^2 = P): [[1/2, -i/2], [i/2, 1/2]]^2 = [[1/2, -i/2], [i/2, 1/2]]. (Multiply out: top-left entry = 1/4 + (-i/2)(i/2) = 1/4 + 1/4 = 1/2. Etc.) Confirmed.
Step 3: Verify Hermiticity (P^dagger = P): transpose and conjugate: [[1/2, -i/2], [i/2, 1/2]]^dagger = [[1/2, -i/2], [i/2, 1/2]] = P. Confirmed.
Step 4: The trace is tr(P) = 1/2 + 1/2 = 1, which equals the rank of the projection.
Narration: Projection operators |e><e| will appear everywhere: in the spectral decomposition (A4), in the measurement postulate (P2), and in the description of quantum gates. Understanding that an outer product of a unit vector with itself is a rank-1 projector is essential.

---

### 6. Common Confusions

**CC-1: Using the dot product instead of the inner product.**
Wrong model: Students compute u^T v (no conjugation) instead of u^dagger v, especially when entries happen to be real.
Why tempting: In R^n the two are identical, and students' muscle memory is real-valued.
Corrective argument: Show the failure case: u = (1, i), u^T u = 1 + i^2 = 0 (not a valid norm). Then <u|u> = 1 + 1 = 2 (correct). The conjugation is not a convention; it is forced by the requirement that norms be positive.

**CC-2: Conjugate-linearity in the wrong argument.**
Wrong model: Students compute <alpha u | v> = alpha <u|v> instead of alpha* <u|v>.
Why tempting: In the mathematics convention, the inner product IS linear in the first argument. Many textbooks (especially pure math) use the opposite convention. Students encounter conflicting sources.
Corrective argument: In this course (and in all of quantum mechanics / physics), the inner product is conjugate-linear in the first argument and linear in the second. This ensures <v|alpha w> = alpha <v|w>, which is needed for the Born rule to work out: if we scale a measurement basis vector, the probabilities should not change in a way that depends on the phase of the basis.

**CC-3: Confusing inner products (scalars) with outer products (matrices).**
Wrong model: Students see <u|v> and |u><v| as "the same thing with brackets shuffled."
Why tempting: The notation is compact and the brackets are suggestive.
Corrective argument: <u|v> is a scalar (a 1x1 matrix if you like: row times column). |u><v| is an n x n matrix (column times row). They have completely different types. The mnemonic: "bracket = number, ket-bra = operator."

**CC-4: Thinking orthogonality means "perpendicular at 90 degrees" only makes sense in 2D or 3D.**
Wrong model: Students accept geometric orthogonality in R^2 and R^3 but cannot extend the concept to C^n or higher dimensions.
Why tempting: The geometric picture of perpendicular arrows breaks down in higher dimensions and especially in complex spaces.
Corrective argument: Orthogonality is defined algebraically: <u|v> = 0. The geometric picture is a useful analogy in low dimensions but the algebraic definition is the real one. In quantum mechanics, orthogonal states are perfectly distinguishable by measurement; this is the physical content of orthogonality, and it works in any dimension.

**CC-5: Gram-Schmidt produces THE orthonormal basis, not just one of many.**
Wrong model: Students think the output of Gram-Schmidt is unique.
Why tempting: The procedure is deterministic given an input, so the output feels canonical.
Corrective argument: Gram-Schmidt depends on the ordering of the input vectors and on the choice of input vectors. A different ordering or different starting set gives a different orthonormal basis. In C^2 there are uncountably many orthonormal bases (parameterised by a unitary matrix). Gram-Schmidt is a procedure, not a canonical choice.

---

### 7. Cross-References

**Backward references:**
- A1: Conjugation (Definition 3.2 in A1) is used pervasively in the inner product. Modulus from A1 appears in the norm.

**Forward references within Track A:**
- A3: Hermitian and unitary matrices are defined using the adjoint (dagger), which is the matrix analogue of the bra. Inner-product preservation is the defining property of unitary matrices.
- A4: The spectral theorem says Hermitian matrices have orthonormal eigenvectors -- orthonormality defined here. The completeness relation (Theorem 3.8) is a special case of the spectral decomposition.
- A5: The inner product on tensor product spaces is built from the inner products on the factor spaces.
- A6: The Born rule P(a_i) = |<e_i|psi>|^2 is a direct application of the expansion theorem (Theorem 3.8).

**Forward references to Track P:**
- P2: Postulate 1 (states are unit vectors in a Hilbert space) uses normalisation; Postulate 3 (measurement) uses orthonormal bases and the Born rule.

**Forward references to Track C:**
- C1: A qubit is a unit vector in C^2; the standard basis {|0>, |1>} is the computational basis.
- C2: Measurement in the computational basis is an application of the expansion theorem.

---

### 8. Historical Notes

- The inner product for complex vector spaces was formalised by **John von Neumann** in his 1932 treatise *Mathematische Grundlagen der Quantenmechanik*, where he laid the rigorous mathematical foundations for quantum mechanics using Hilbert spaces.
- The Cauchy-Schwarz inequality has a layered history: **Augustin-Louis Cauchy** proved the discrete real case in 1821; **Viktor Bunyakovsky** generalised to integrals in 1859; **Hermann Amandus Schwarz** independently proved the integral case in 1885. The complex case follows the same proof structure.
- **Dirac notation** (bra-ket) was introduced by **Paul Dirac** in his 1939 paper "A New Notation for Quantum Mechanics" (Mathematical Proceedings of the Cambridge Philosophical Society), and elaborated in his textbook *The Principles of Quantum Mechanics* (editions from 1930 onward, with the notation solidifying in the 3rd edition, 1947). The notation is almost universally used in physics but rarely in pure mathematics.
- **Gram-Schmidt orthogonalisation** is named for **Jorgen Pedersen Gram** (1883) and **Erhard Schmidt** (1907), though the method was known to **Laplace** in the early 19th century.

---

### 9. Problem Set

**Problem A2.1 [Easy]**
Compute <u|v> where |u> = (2, 1-i)^T and |v> = (i, 3)^T.
Solution sketch: <u| = (2, 1+i). <u|v> = 2(i) + (1+i)(3) = 2i + 3 + 3i = 3 + 5i.

**Problem A2.2 [Easy]**
Normalise the vector |v> = (3, 4i)^T.
Solution sketch: ||v|| = sqrt(9 + 16) = 5. Normalised: (3/5, 4i/5)^T.

**Problem A2.3 [Easy]**
Show that |u> = (1, 1)^T and |v> = (1, -1)^T are orthogonal. Normalise them to get an orthonormal basis for C^2.
Solution sketch: <u|v> = 1 - 1 = 0. ||u|| = ||v|| = sqrt(2). ONB: {(1,1)^T/sqrt(2), (1,-1)^T/sqrt(2)} = {|+>, |->}.

**Problem A2.4 [Medium]**
Prove that if <u|v> = 0, then ||u + v||^2 = ||u||^2 + ||v||^2 (the complex Pythagorean theorem).
Solution sketch: ||u+v||^2 = <u+v|u+v> = ||u||^2 + <u|v> + <v|u> + ||v||^2. If <u|v> = 0 then <v|u> = <u|v>* = 0. So ||u+v||^2 = ||u||^2 + ||v||^2.

**Problem A2.5 [Medium]**
Let |psi> = (1/2, sqrt(3)/2)^T. (a) Verify it is normalised. (b) Find the probabilities of measuring |0> and |1>. (c) Find the probabilities of measuring |+> = (1,1)^T/sqrt(2) and |-> = (1,-1)^T/sqrt(2). (d) Verify both probability sets sum to 1.
Solution sketch: (a) 1/4 + 3/4 = 1. (b) P(0) = 1/4, P(1) = 3/4. (c) <+|psi> = (1/2 + sqrt(3)/2)/sqrt(2) = (1+sqrt(3))/(2sqrt(2)), so P(+) = (1+sqrt(3))^2/8 = (4+2sqrt(3))/8. <-|psi> = (1/2 - sqrt(3)/2)/sqrt(2), so P(-) = (1-sqrt(3))^2/8 = (4-2sqrt(3))/8. Sum: 8/8 = 1.

**Problem A2.6 [Medium]**
Apply Gram-Schmidt to {|v_1> = (1, 1, 0)^T, |v_2> = (1, 0, 1)^T, |v_3> = (0, 1, 1)^T} in C^3.
Solution sketch: |e_1> = (1,1,0)^T/sqrt(2). <e_1|v_2> = 1/sqrt(2). |f_2> = (1,0,1)^T - (1/sqrt(2))(1,1,0)^T/sqrt(2) = (1,0,1) - (1/2,1/2,0) = (1/2,-1/2,1)^T. ||f_2|| = sqrt(1/4+1/4+1) = sqrt(3/2). |e_2> = (1/2,-1/2,1)^T / sqrt(3/2) = (1, -1, 2)^T/sqrt(6). Continue for |v_3>: compute <e_1|v_3> = 1/sqrt(2), <e_2|v_3> = (-1+2)/sqrt(6) = 1/sqrt(6). Subtract projections to get |f_3>, normalise.

**Problem A2.7 [Medium]**
Prove that the outer product P = |e><e| satisfies P^2 = P (idempotence) and P^dagger = P (Hermiticity) when |e> is normalised.
Solution sketch: P^2 = |e><e|e><e| = |e> (since <e|e>=1) <e| = P. P^dagger = (|e><e|)^dagger = |e><e| = P (since (|u><v|)^dagger = |v><u|, and here u = v = e).

**Problem A2.8 [Hard]**
Prove that any two orthonormal bases for C^n are related by a unitary matrix: if {|e_i>} and {|f_i>} are both orthonormal bases, then U = sum_i |f_i><e_i| is unitary.
Solution sketch: U^dagger U = sum_{i,j} |e_i><f_i|f_j><e_j| = sum_{i,j} delta_{ij} |e_i><e_j| = sum_i |e_i><e_i| = I (completeness relation for {|e_i>}). Similarly U U^dagger = I.

**Problem A2.9 [Hard]**
Let V be a subspace of C^n with orthonormal basis {|e_1>, ..., |e_k>}. Define P_V = sum_{i=1}^k |e_i><e_i|. Prove that for any |v> in C^n, P_V |v> is the closest point in V to |v> (i.e., it minimises ||v - w|| over w in V).
Solution sketch: Write |v> = P_V|v> + (I - P_V)|v>. The first term is in V, the second is orthogonal to V (check: <e_j|(I-P_V)|v> = <e_j|v> - <e_j|v> = 0). For any |w> in V, ||v - w||^2 = ||P_V v - w||^2 + ||(I-P_V)v||^2 (Pythagorean theorem, since P_V v - w is in V and (I-P_V)v is perpendicular to V). This is minimised when P_V v = w.

**Problem A2.10 [Hard]**
(Preview) Consider the two states |psi> = (1, 0)^T and |phi> = (cos(theta), sin(theta))^T for theta in [0, pi/2]. Compute |<psi|phi>|^2 as a function of theta. At what angle are the states optimally distinguishable? What does "optimally distinguishable" mean in terms of measurement?
Solution sketch: <psi|phi> = cos(theta). |<psi|phi>|^2 = cos^2(theta). This equals 0 when theta = pi/2, meaning the states are orthogonal. Orthogonal states are perfectly distinguishable: there exists a measurement that tells them apart with certainty (namely, measurement in the {|psi>, |psi_perp>} basis). For 0 < theta < pi/2, the states are non-orthogonal and no measurement can distinguish them with certainty -- a fundamental feature of quantum mechanics (forward-ref P2, C2).

---

### 10. Simulator Dependencies

No custom simulator is required for A2. The interactive widgets (VA-1 through VA-6) are standalone linear-algebra visualisations. The inner product and Gram-Schmidt widgets require basic matrix arithmetic but not the quantum circuit simulator.

---

### 11. Estimates

- **Word count target:** 4,500 -- 5,500 words
- **Student time:** 100 -- 130 minutes
- **Development time:** 14 -- 18 hours (writing + widget development + review)

---

### 12. Page Splits

Recommended split into two pages:

- **Page A2a: Vectors, Inner Products, and Dirac Notation** (Stages 1-4 of the arc, Definitions 3.1-3.5, visual assets VA-1, VA-2, VA-3, VA-6, Worked Examples 5.1, 5.2, Problems A2.1-A2.4)
- **Page A2b: Cauchy-Schwarz, Gram-Schmidt, and the Measurement Preview** (Stages 5-7, Theorems 3.6-3.9, Procedure 3.10, visual assets VA-4, VA-5, Worked Examples 5.3, 5.4, 5.5, Problems A2.5-A2.10)

Rationale: The first half introduces notation and basic operations; the second half develops deeper structural results (Cauchy-Schwarz, completeness) and connects to physics. Students benefit from absorbing the notation before encountering the heavier theorems.

---

## A3 -- Matrices over C: Hermitian, Unitary, and Normal Matrices

**Position in canonical order:** 3 of 23
**Prerequisites:** A1 (complex arithmetic, Euler's formula), A2 (vectors in C^n, inner product, Dirac notation)
**Unlocks:** P1 (classical physics fails), and transitively P2, C1, C2, A4

---

### 1. Learning Objectives

By the end of this lesson the student will be able to:

1. Multiply matrices over C, compute the adjoint (conjugate transpose) A^dagger of any matrix, and verify the identity (AB)^dagger = B^dagger A^dagger.
2. Define Hermitian matrices (A = A^dagger), prove that all eigenvalues of a Hermitian matrix are real, and prove that eigenvectors for distinct eigenvalues are orthogonal.
3. Define unitary matrices (U^dagger U = UU^dagger = I), prove that unitary matrices preserve inner products (<Uv|Uw> = <v|w>), and prove that eigenvalues of unitary matrices have modulus 1.
4. Define normal matrices (A A^dagger = A^dagger A) and state that Hermitian and unitary matrices are both special cases of normal matrices.
5. Compute the determinant and trace of 2x2 and 3x3 complex matrices, and state the relations tr(AB) = tr(BA), det(AB) = det(A)det(B), and det(U) has modulus 1 for unitary U.
6. Write down and verify the four Pauli matrices (I, sigma_x, sigma_y, sigma_z), confirm they are Hermitian and unitary (for the non-identity ones), trace-free, and satisfy sigma_j^2 = I.
7. Compute the matrix exponential e^{iA} for a 2x2 matrix A using the Taylor series definition, and verify that e^{iH} is unitary when H is Hermitian.
8. State the connection between the matrix exponential and the ODE derivation of Euler's formula from A1, recognising e^{iHt} as the generalisation from scalars to matrices.
9. Describe the physical significance of Hermitian matrices (observables) and unitary matrices (time evolution / quantum gates) in the context of quantum mechanics (forward-ref P2, C3).
10. Compute the commutator [A, B] = AB - BA of two matrices and verify the canonical commutation relations for Pauli matrices.

---

### 2. Intuition-Building Arc

**Stage 1 -- Matrices as Transformations (geometric + algebraic).** Begin with 2x2 real matrices as transformations of R^2: rotations, reflections, scalings. Recall that matrix multiplication corresponds to composing transformations. Extend to complex matrices acting on C^2. The key new feature: the "transpose" generalises to the "adjoint" (conjugate transpose), and the "orthogonal" group generalises to the "unitary" group. Rationale: anchoring matrices to transformations prevents them from being perceived as mere arrays of numbers.

**Stage 2 -- The Adjoint: Transpose + Conjugate (algebraic).** Define A^dagger = (A^T)* (transpose then conjugate, or equivalently conjugate then transpose). Show that <Au|v> = <u|A^dagger v>: the adjoint "moves" a matrix from one side of the inner product to the other. This is the defining property. Prove (AB)^dagger = B^dagger A^dagger (the "reverse order" law). Rationale: the adjoint is the central operation from which Hermitian and unitary matrices are defined.

**Stage 3 -- Hermitian Matrices: The Observables (algebraic + physical).** Define Hermitian: A = A^dagger. Prove eigenvalues are real by considering A|v> = lambda|v>, taking the inner product with <v|, and using Hermiticity. Prove eigenvectors for distinct eigenvalues are orthogonal: consider <w|A|v> computed two ways. Introduce the Pauli matrices as the premier examples. Note that the diagonal entries of a Hermitian matrix are real (since a_{jj} = a_{jj}*). Give the physical motivation: in quantum mechanics, measurable quantities (position, energy, spin) are represented by Hermitian operators. Their real eigenvalues are the possible measurement outcomes. (Forward-ref P2, A4.)

**Stage 4 -- Unitary Matrices: The Symmetries (algebraic + geometric).** Define unitary: U^dagger U = I (equivalently, U^{-1} = U^dagger). Prove inner-product preservation: <Uu|Uv> = <u|U^dagger U|v> = <u|v>. Prove eigenvalues have modulus 1: if U|v> = lambda|v>, then ||v||^2 = <v|v> = <Uv|Uv> = |lambda|^2 <v|v>, so |lambda| = 1. Interpret geometrically: unitary transformations are the "rigid motions" of C^n (they preserve lengths and angles). Give the physical motivation: time evolution in quantum mechanics is unitary (preserves probabilities), and quantum gates are unitary. (Forward-ref P2, P3, C3.)

**Stage 5 -- Normal Matrices: The Unifying Concept (algebraic).** Define normal: A A^dagger = A^dagger A. Note that both Hermitian and unitary matrices are normal. State (without full proof -- that comes in A4) that normal matrices are exactly those that can be diagonalised by a unitary transformation. This is the spectral theorem preview.

**Stage 6 -- Pauli Matrices: The Workhorse Examples (algebraic + physical).** Define sigma_x = [[0,1],[1,0]], sigma_y = [[0,-i],[i,0]], sigma_z = [[1,0],[0,-1]], and I = [[1,0],[0,1]]. Verify: (i) all are Hermitian; (ii) sigma_x, sigma_y, sigma_z are unitary; (iii) all non-identity Paulis are trace-free; (iv) sigma_j^2 = I; (v) {sigma_x, sigma_y, sigma_z} together with I form a basis for all 2x2 Hermitian matrices. Compute commutators: [sigma_x, sigma_y] = 2i sigma_z and cyclic permutations. The Pauli matrices will appear in nearly every subsequent lesson.

**Stage 7 -- The Matrix Exponential: Bridge to Dynamics (analytic).** Define e^A = sum_{n=0}^{infty} A^n / n! for square matrices A. Show that when A = i theta (scalar times identity), this recovers Euler's formula. Prove that e^{iH} is unitary when H is Hermitian: (e^{iH})^dagger = e^{-iH^dagger} = e^{-iH}, and e^{iH} e^{-iH} = e^0 = I (using the fact that iH and -iH commute). Caveat: e^{A+B} = e^A e^B is true only when [A,B] = 0; emphasise this. The matrix exponential is the solution to the ODE dU/dt = iH U, U(0) = I, generalising the scalar ODE from the Euler's formula derivation in A1. This connects directly to Schrodinger's equation (forward-ref P3).

**Stage 8 -- Determinant, Trace, and Global Properties (algebraic).** Review determinant and trace for complex matrices. Key facts: tr(AB) = tr(BA), det(AB) = det(A)det(B), det(e^A) = e^{tr(A)}, det(U) has modulus 1 for unitary U. Special unitary group SU(n) = {U unitary : det(U) = 1}. The trace and determinant will be used in eigenvalue calculations (A4) and in the characterisation of quantum gates (C3, C5).

---

### 3. Theorems, Definitions & Lemmas

**Definition 3.1 (Adjoint / Conjugate Transpose).** For an m x n matrix A with complex entries, the adjoint A^dagger is the n x m matrix with (A^dagger)_{jk} = (A_{kj})*. Equivalently, A^dagger = (A^T)* = (A*)^T.

**Lemma 3.2 (Adjoint Properties).** (i) (A^dagger)^dagger = A; (ii) (A + B)^dagger = A^dagger + B^dagger; (iii) (alpha A)^dagger = alpha* A^dagger; (iv) (AB)^dagger = B^dagger A^dagger.
Proof strategy: (i)-(iii) are direct from the definition. (iv): ((AB)^dagger)_{jk} = (AB)_{kj}* = (sum_l A_{kl} B_{lj})* = sum_l A_{kl}* B_{lj}* = sum_l (B^dagger)_{jl} (A^dagger)_{lk} = (B^dagger A^dagger)_{jk}.

**Proposition 3.3 (Adjoint and Inner Product).** <Au|v> = <u|A^dagger v> for all u, v.
Proof strategy: <Au|v> = (Au)^dagger v = u^dagger A^dagger v = <u|A^dagger v>.

**Definition 3.4 (Hermitian Matrix).** A square matrix A is Hermitian (or self-adjoint) if A = A^dagger.

**Theorem 3.5 (Eigenvalues of Hermitian Matrices are Real).** If A is Hermitian and A|v> = lambda|v> with |v> != 0, then lambda in R.
Proof strategy: lambda <v|v> = <v|A|v> = <A^dagger v|v> = <Av|v> = lambda* <v|v>. Since <v|v> > 0, lambda = lambda*, so lambda is real.

**Theorem 3.6 (Eigenvectors of Hermitian Matrices for Distinct Eigenvalues are Orthogonal).** If A is Hermitian, A|v> = lambda|v>, A|w> = mu|w>, and lambda != mu, then <v|w> = 0.
Proof strategy: lambda <v|w> = <Av|w> = <v|Aw> = mu <v|w> (using Hermiticity to move A across the inner product, and the fact that lambda is real so lambda* = lambda). Therefore (lambda - mu)<v|w> = 0. Since lambda != mu, we get <v|w> = 0.

**Definition 3.7 (Unitary Matrix).** A square matrix U is unitary if U^dagger U = I (equivalently, UU^dagger = I, or U^{-1} = U^dagger).

**Theorem 3.8 (Unitary Matrices Preserve Inner Products).** If U is unitary, then <Uu|Uv> = <u|v> for all u, v.
Proof strategy: <Uu|Uv> = <u|U^dagger U|v> = <u|I|v> = <u|v>.

**Corollary 3.9 (Unitary Matrices Preserve Norms).** ||U|v>|| = ||v|| for all |v>.

**Theorem 3.10 (Eigenvalues of Unitary Matrices Have Modulus 1).** If U is unitary and U|v> = lambda|v> with |v> != 0, then |lambda| = 1.
Proof strategy: ||v||^2 = ||Uv||^2 = ||lambda v||^2 = |lambda|^2 ||v||^2. Since ||v||^2 > 0, |lambda|^2 = 1, so |lambda| = 1. Thus lambda = e^{i phi} for some real phi.

**Definition 3.11 (Normal Matrix).** A square matrix A is normal if AA^dagger = A^dagger A.

**Fact 3.12.** Every Hermitian matrix is normal (since A = A^dagger implies AA^dagger = A^2 = A^dagger A). Every unitary matrix is normal (since U^dagger U = UU^dagger = I).

**Definition 3.13 (Pauli Matrices).** sigma_x = [[0,1],[1,0]], sigma_y = [[0,-i],[i,0]], sigma_z = [[1,0],[0,-1]], sigma_0 = I = [[1,0],[0,1]].

**Lemma 3.14 (Pauli Algebra).** (i) sigma_j^2 = I for j in {x,y,z}; (ii) sigma_j are Hermitian and unitary; (iii) tr(sigma_j) = 0 for j in {x,y,z}; (iv) [sigma_x, sigma_y] = 2i sigma_z, and cyclically; (v) {sigma_x, sigma_y} = sigma_x sigma_y + sigma_y sigma_x = 0, and cyclically (anticommutation); (vi) {I, sigma_x, sigma_y, sigma_z} is a basis for the real vector space of 2x2 Hermitian matrices: any 2x2 Hermitian matrix H can be written as H = a_0 I + a_1 sigma_x + a_2 sigma_y + a_3 sigma_z with a_j in R.
Proof strategy: All are verified by direct 2x2 matrix computation. For (vi), write a general 2x2 Hermitian matrix as [[a, b+ci], [b-ci, d]] and match coefficients: a_0 = (a+d)/2, a_3 = (a-d)/2, a_1 = b, a_2 = -c. This gives 4 real parameters, matching the 4-dimensional real vector space.

**Definition 3.15 (Matrix Exponential).** For a square matrix A, e^A = sum_{n=0}^{infty} A^n / n!. The series converges absolutely for all A (with respect to any matrix norm).

**Proposition 3.16 (e^{iH} is Unitary When H is Hermitian).** If H = H^dagger, then (e^{iH})^dagger e^{iH} = I.
Proof strategy: (e^{iH})^dagger = sum_n ((iH)^n)^dagger / n! = sum_n ((-i)^n (H^dagger)^n) / n! = sum_n (-iH)^n / n! = e^{-iH}. Then e^{-iH} e^{iH} = e^{-iH + iH} = e^0 = I. The step e^{-iH} e^{iH} = e^0 uses the fact that -iH and iH commute (any matrix commutes with itself and its scalar multiples). Emphasise that e^{A+B} = e^A e^B requires [A,B] = 0 in general.

**Lemma 3.17 (Trace and Determinant Properties).** (i) tr(AB) = tr(BA); (ii) det(AB) = det(A)det(B); (iii) det(e^A) = e^{tr(A)}; (iv) if U is unitary, |det(U)| = 1.
Proof strategy: (i) tr(AB) = sum_i (AB)_{ii} = sum_{i,j} A_{ij} B_{ji} = sum_j (BA)_{jj} = tr(BA). (ii) Standard Leibniz-formula argument or appeal to multiplicativity of the determinant. (iii) If A is diagonalisable, A = PDP^{-1}, then e^A = P e^D P^{-1}, det(e^A) = det(e^D) = product of e^{d_i} = e^{sum d_i} = e^{tr(D)} = e^{tr(A)}. (iv) |det(U)|^2 = det(U) det(U)* = det(U) det(U^dagger) = det(UU^dagger) = det(I) = 1.

**Definition 3.18 (Commutator and Anticommutator).** [A, B] = AB - BA. {A, B} = AB + BA.

---

### 4. Visual Assets

**VA-1: Matrix Multiplication Visualiser (2x2)**
- Type: Interactive widget
- Description: Two 2x2 complex matrices A, B are entered by the student (8 complex number inputs). The product AB is computed and displayed, with each entry shown as a dot product of a row of A with a column of B (highlighted on hover). The adjoint A^dagger is also displayed alongside A.
- What to notice: (AB)^dagger shows B^dagger A^dagger (reverse order). Matrix multiplication is not commutative: AB != BA in general (the widget shows both products and highlights when they differ).
- Interactive controls: Edit entries of A and B. Toggle between AB and BA. Show A^dagger.

**VA-2: Hermitian Matrix Eigenvalue Visualiser**
- Type: Interactive widget
- Description: A 2x2 Hermitian matrix H is parameterised by 3 real sliders (a_1, a_2, a_3 for H = a_1 sigma_x + a_2 sigma_y + a_3 sigma_z, with a_0 = 0 for simplicity). The eigenvalues (real numbers) and eigenvectors are computed and displayed. The eigenvectors are shown on a stylised C^2 diagram (e.g., as points on the Bloch sphere -- forward-ref C3). A number line shows the eigenvalues.
- What to notice: Eigenvalues are always real. As the sliders change, the eigenvalues move along the real line and the eigenvectors rotate on the Bloch sphere. The eigenvalues are +/- sqrt(a_1^2 + a_2^2 + a_3^2).
- Interactive controls: Three real sliders for (a_1, a_2, a_3). Display of the matrix, eigenvalues, and eigenvectors.

**VA-3: Unitary Transformation Visualiser**
- Type: Interactive widget
- Description: A unit vector |v> in C^2 is shown on the Bloch sphere. A unitary matrix U (parameterised by e.g., rotation angle and axis, or entered directly) is applied to produce U|v>. Both |v> and U|v> are shown on the sphere. The inner product <v|Uv> is displayed.
- What to notice: The vector stays on the unit sphere (norm is preserved). The unitary acts as a rotation of the Bloch sphere. Different unitaries correspond to different rotations.
- Interactive controls: Choose U from preset gates (Pauli X, Y, Z, Hadamard) or enter a custom 2x2 unitary. Drag |v> on the Bloch sphere.

**VA-4: Pauli Matrix Reference Card**
- Type: Static diagram
- Description: All four Pauli matrices displayed in a 2x2 grid, each showing: the matrix, its eigenvalues, its eigenvectors (in ket notation), the geometric interpretation (sigma_x = bit flip, sigma_z = phase flip, sigma_y = both), and the axis of rotation on the Bloch sphere.
- What to notice: The Pauli matrices are simultaneously Hermitian (real eigenvalues +/- 1) and unitary (sigma^2 = I). Each one corresponds to a 180-degree rotation about a different axis of the Bloch sphere.

**VA-5: Matrix Exponential Step-by-Step**
- Type: Interactive computation display
- Description: The student enters a 2x2 matrix A. The widget computes and displays the first N terms of the Taylor series sum_{k=0}^N A^k/k!, showing each matrix power A^k and the running partial sum. For special cases (e.g., A = i theta sigma_z), the series is evaluated in closed form.
- What to notice: The series converges rapidly. For A = i theta sigma_z, the result is [[e^{i theta}, 0],[0, e^{-i theta}]], which is the R_z(2 theta) gate (forward-ref C3).
- Interactive controls: Matrix input, slider for number of terms N (1 to 20), button for exact evaluation when available.

**VA-6: Commutator Visualiser**
- Type: Interactive widget
- Description: Two 2x2 matrices A and B are entered. The widget computes and displays AB, BA, and [A,B] = AB - BA. The nonzero entries of the commutator are highlighted.
- What to notice: Commuting matrices have [A,B] = 0 (the zero matrix). The Pauli matrices have maximally non-trivial commutators: [sigma_x, sigma_y] = 2i sigma_z.
- Interactive controls: Matrix inputs for A and B. Preset buttons for Pauli pairs.

---

### 5. Worked Examples

**Example 5.1: Computing the Adjoint**
Find A^dagger for A = [[1+i, 2], [3i, 4-i]].

Step 1: Transpose: A^T = [[1+i, 3i], [2, 4-i]].
Step 2: Conjugate every entry: A^dagger = [[1-i, -3i], [2, 4+i]].
Step 3: Verify: (A^dagger)^dagger should return A. Transpose of A^dagger: [[1-i, 2], [-3i, 4+i]]. Conjugate: [[1+i, 2], [3i, 4-i]] = A. Confirmed.
Narration: The adjoint combines transposition with entry-wise conjugation. The physical significance: <Au|v> = <u|A^dagger v>, so the adjoint is the "mirror" of an operator with respect to the inner product. This is why A = A^dagger (Hermitian) means the operator is the same as its mirror, and U^dagger = U^{-1} (unitary) means the mirror undoes the operator.

**Example 5.2: Verifying Pauli Matrices are Hermitian and Unitary**
Verify that sigma_y = [[0, -i], [i, 0]] is Hermitian and unitary.

Step 1: Hermitian check: sigma_y^dagger = (sigma_y^T)* = [[0, i], [-i, 0]]* = [[0, -i], [i, 0]] = sigma_y. So sigma_y = sigma_y^dagger. Confirmed Hermitian.
Step 2: Unitary check: sigma_y^dagger sigma_y = sigma_y sigma_y = [[0,-i],[i,0]][[0,-i],[i,0]]. Top-left: 0*0 + (-i)(i) = 0 + 1 = 1. Top-right: 0*(-i) + (-i)(0) = 0. Bottom-left: i*0 + 0*i = 0. Bottom-right: i*(-i) + 0*0 = 1. So sigma_y^2 = I. Confirmed unitary.
Step 3: Eigenvalues: det(sigma_y - lambda I) = det([[- lambda, -i],[i, -lambda]]) = lambda^2 - (-i)(i) = lambda^2 - 1 = 0. So lambda = +/- 1. Both real (consistent with Hermitian) and both of modulus 1 (consistent with unitary).
Narration: sigma_y being simultaneously Hermitian and unitary is special to matrices that square to the identity: H = H^dagger and H^2 = I together imply H^{-1} = H = H^dagger. This means sigma_y is both an observable (measurable quantity) and a gate (reversible transformation). In quantum computing, the Pauli gates play both roles.

**Example 5.3: Proving Eigenvalues are Real for a Specific Hermitian Matrix**
Let H = [[2, 1-i],[1+i, 3]]. Verify H is Hermitian and find its eigenvalues.

Step 1: H^dagger: transpose gives [[2, 1+i],[1-i, 3]], conjugate gives [[2, 1-i],[1+i, 3]] = H. Confirmed Hermitian.
Step 2: Characteristic polynomial: det(H - lambda I) = (2 - lambda)(3 - lambda) - (1-i)(1+i) = lambda^2 - 5 lambda + 6 - 2 = lambda^2 - 5 lambda + 4 = (lambda - 1)(lambda - 4). Eigenvalues: lambda = 1 and lambda = 4. Both real, as guaranteed by Theorem 3.5.
Step 3: Find eigenvectors. For lambda = 1: (H - I)|v> = 0 gives [[1, 1-i],[1+i, 2]]|v> = 0. First row: v_1 + (1-i) v_2 = 0, so v_1 = -(1-i) v_2. Eigenvector: (-(1-i), 1)^T, normalised to (-(1-i), 1)^T / sqrt(3). For lambda = 4: (H - 4I)|v> = 0 gives [[-2, 1-i],[1+i, -1]]|v> = 0. First row: -2 v_1 + (1-i) v_2 = 0, so v_1 = (1-i)/2 v_2. Eigenvector: ((1-i), 2)^T, normalised to ((1-i), 2)^T / sqrt(6).
Step 4: Verify orthogonality: <v_1|v_2> (unnormalised) = (-(1-i))* ((1-i)/2) + 1 * 2 = (-(1+i))((1-i)/2) + 2 = -(1+i)(1-i)/2 + 2 = -2/2 + 2 = 0. Orthogonal, as guaranteed by Theorem 3.6.
Narration: This example walks through the full pipeline: verify Hermiticity, find eigenvalues, find eigenvectors, verify orthogonality. This pipeline will be used every time we encounter a new observable in quantum mechanics.

**Example 5.4: Unitary Matrix Preserves Inner Product**
Let U = (1/sqrt(2))[[1, 1],[1, -1]] (the Hadamard matrix). Let |u> = (1, 0)^T and |v> = (0, 1)^T. Verify that <Uu|Uv> = <u|v>.

Step 1: <u|v> = 0 (they are orthogonal).
Step 2: U|u> = (1/sqrt(2))(1, 1)^T. U|v> = (1/sqrt(2))(1, -1)^T.
Step 3: <Uu|Uv> = (1/sqrt(2))(1, 1) * (1/sqrt(2))(1, -1)^T = (1/2)(1 * 1 + 1 * (-1)) = (1/2)(0) = 0 = <u|v>. Confirmed.
Step 4: Also verify norms: ||U|u>|| = sqrt(1/2 + 1/2) = 1 = ||u||.
Narration: The Hadamard gate is arguably the most important single-qubit gate. It maps the computational basis to the Hadamard basis. This example previews C3 by showing that the Hadamard is unitary (preserves inner products) and therefore a valid quantum gate.

**Example 5.5: Matrix Exponential of i theta sigma_z**
Compute e^{i theta sigma_z}.

Step 1: sigma_z = [[1,0],[0,-1]], so i theta sigma_z = [[i theta, 0],[0, -i theta]].
Step 2: Since this is diagonal, the matrix exponential is diagonal: e^{i theta sigma_z} = [[e^{i theta}, 0],[0, e^{-i theta}]].
Step 3: Verify unitarity: the adjoint is [[e^{-i theta}, 0],[0, e^{i theta}]], and the product with the original is I. Confirmed.
Step 4: At theta = pi/2: e^{i pi/2 sigma_z} = [[i, 0],[0, -i]] = i sigma_z. At theta = pi/4: e^{i pi/4 sigma_z} = [[e^{i pi/4}, 0],[0, e^{-i pi/4}]]. This is (up to global phase) the S gate when theta = pi/4 or the T gate when theta = pi/8. (Forward-ref C3.)
Narration: The matrix exponential of a diagonal matrix is easy because the exponential acts entry-by-entry. This is why diagonalisation (A4) is so useful: once we diagonalise a Hermitian matrix, computing e^{iHt} reduces to exponentiating scalars. The Schrodinger equation (P3) says that time evolution is U(t) = e^{-iHt/hbar}, so diagonalising H solves the dynamics completely.

---

### 6. Common Confusions

**CC-1: Confusing transpose with adjoint.**
Wrong model: Students compute A^T instead of A^dagger, omitting the conjugation.
Why tempting: In real linear algebra, transpose and adjoint are the same.
Corrective argument: Over C, the adjoint includes conjugation: A^dagger = (A^T)*. Without conjugation, the property <Au|v> = <u|A^T v> fails (check with a concrete example using complex entries). The conjugation is forced by the same reason the inner product uses conjugation (A2): positivity of the norm.

**CC-2: Thinking unitary means "the matrix has entries of modulus 1."**
Wrong model: Students see e^{i theta} entries and assume any matrix with unit-modulus entries is unitary.
Why tempting: The eigenvalues of a unitary matrix do have modulus 1, and many familiar unitaries (like diagonal phase gates) do have unit-modulus entries.
Corrective argument: The Hadamard matrix H = [[1,1],[1,-1]]/sqrt(2) is unitary but has entries of modulus 1/sqrt(2), not 1. Conversely, the matrix [[1,1],[1,1]]/sqrt(2) has the same entry modulus but is NOT unitary (its columns are not orthogonal). The correct test is U^dagger U = I, which requires the columns of U to form an orthonormal basis.

**CC-3: Assuming e^{A+B} = e^A e^B always.**
Wrong model: Students carry over the scalar exponential rule to matrices.
Why tempting: It works for scalar arguments and feels like a natural extension.
Corrective argument: The Baker-Campbell-Hausdorff formula shows that e^{A+B} = e^A e^B only when [A,B] = 0. Counterexample: let A = sigma_x, B = sigma_y. Then [A,B] = 2i sigma_z != 0. Compute e^{A+B} numerically and compare with e^A e^B; they differ. This non-commutativity of the matrix exponential is the mathematical root of the uncertainty principle (forward-ref P5).

**CC-4: "Hermitian" means "symmetric."**
Wrong model: Students remember from real linear algebra that symmetric matrices have real eigenvalues, and equate Hermitian with symmetric.
Why tempting: A real symmetric matrix IS Hermitian (since conjugation does nothing to real entries).
Corrective argument: A complex symmetric matrix (A = A^T but A != A^dagger) need NOT have real eigenvalues. Example: A = [[0, i],[i, 0]]. This is symmetric (A^T = A) but NOT Hermitian (A^dagger = [[0, -i],[-i, 0]] != A). Its eigenvalues are +/- i, which are not real. Hermitian requires A = A^dagger, which means "symmetric AND conjugated."

**CC-5: The commutator [A,B] measures "how different" A and B are.**
Wrong model: Students think [A,B] = 0 means A and B are "similar" and [A,B] != 0 means they are "different."
Why tempting: The commutator is zero when operations can be done in either order, which feels like a similarity condition.
Corrective argument: [A,B] = 0 means A and B can be simultaneously diagonalised (they share an eigenbasis, as proved in A4). Physically, this means the corresponding observables can be measured simultaneously with arbitrary precision. Non-commuting observables (like position and momentum, or sigma_x and sigma_z) cannot be simultaneously measured -- this is the uncertainty principle (P5). The commutator measures incompatibility, not dissimilarity.

---

### 7. Cross-References

**Backward references:**
- A1: Euler's formula (scalar case) is the template for the matrix exponential. Complex conjugation is used in the adjoint.
- A2: Inner product and Dirac notation are used throughout. Proposition 3.3 (adjoint moves across the inner product) is the bridge between A2 and A3.

**Forward references within Track A:**
- A4: The spectral theorem (A4) proves that normal matrices can be diagonalised by unitary transformations. A3 sets up the definitions; A4 delivers the punchline.
- A5: Tensor products of unitary matrices are unitary; tensor products of Hermitian matrices arise in multi-qubit observables.
- A6: The Born rule uses Hermitian operators (observables) and their spectral decompositions.

**Forward references to Track P:**
- P1: Classical physics fails to explain phenomena that quantum mechanics handles via complex amplitudes and unitary evolution.
- P2: Postulate 2 (observables are Hermitian) and Postulate 4 (evolution is unitary) directly use the definitions from this lesson.
- P3: The Schrodinger equation dU/dt = -iH U involves the matrix exponential from this lesson.
- P4: Spin-1/2 particles are described by the Pauli matrices introduced here.
- P5: The uncertainty principle involves the commutator defined here.

**Forward references to Track C:**
- C3: Quantum gates are unitary matrices. The Pauli gates, Hadamard, and phase gates are all introduced in A3 and used extensively in C3.
- C5: Universal gate sets require the ability to approximate any unitary matrix -- the structure of U(n) developed here is the foundation.

---

### 8. Historical Notes

- The concept of a **Hermitian matrix** is named for **Charles Hermite** (1855), who studied quadratic forms with complex coefficients and proved that matrices equal to their conjugate transpose have real eigenvalues.
- **Unitary matrices** were studied systematically by **Emile Picard** and others in the late 19th century, but their centrality in physics became clear with quantum mechanics in the 1920s.
- The **Pauli matrices** were introduced by **Wolfgang Pauli** in 1927 to describe the spin of the electron. Pauli's exclusion principle (1925) had already earned him fame; the spin matrices were part of his non-relativistic treatment of spin, which preceded Dirac's relativistic equation (1928).
- The **matrix exponential** was known in pure mathematics since at least **Cayley** (1858) and **Sylvester** (1883), but its physical significance emerged with quantum mechanics: **Schrodinger** (1926) used it implicitly, and **Dirac** (1925-1930) made it central to the time-evolution operator.
- The non-commutativity of matrix multiplication, and its connection to the uncertainty principle, was first recognised by **Werner Heisenberg** (1925) in his matrix mechanics paper, one of the founding documents of quantum mechanics. **Max Born** and **Pascual Jordan** (1925) formalised the matrix structure.

---

### 9. Problem Set

**Problem A3.1 [Easy]**
Compute A^dagger for A = [[2i, 1+i, 0],[3, -i, 2-i]].
Solution sketch: Transpose to get 3x2, then conjugate: [[-2i, 3],[1-i, i],[0, 2+i]].

**Problem A3.2 [Easy]**
Verify that the Hadamard matrix H = (1/sqrt(2))[[1,1],[1,-1]] is unitary by computing H^dagger H.
Solution sketch: H is real and symmetric, so H^dagger = H. H^2 = (1/2)[[1+1, 1-1],[1-1, 1+1]] = [[1,0],[0,1]] = I. Confirmed.

**Problem A3.3 [Easy]**
Show that sigma_x sigma_z = -sigma_z sigma_x (anticommutation) by direct computation.
Solution sketch: sigma_x sigma_z = [[0,1],[1,0]][[1,0],[0,-1]] = [[0,-1],[1,0]]. sigma_z sigma_x = [[1,0],[0,-1]][[0,1],[1,0]] = [[0,1],[-1,0]]. Sum: [[0,0],[0,0]] = 0. Confirmed: {sigma_x, sigma_z} = 0, so they anticommute.

**Problem A3.4 [Medium]**
A matrix A satisfies A^2 = I. Prove that A is both Hermitian and unitary if and only if A = A^dagger.
Solution sketch: If A^2 = I and A = A^dagger, then A^{-1} = A = A^dagger, so A is unitary. And A = A^dagger means A is Hermitian. Conversely, if A is Hermitian and unitary, then A^{-1} = A^dagger = A, so A^2 = I.

**Problem A3.5 [Medium]**
Prove that the eigenvalues of a unitary matrix have modulus 1. Then find the eigenvalues and eigenvectors of U = [[0, 1],[1, 0]] (= sigma_x) and verify.
Solution sketch: General proof: in Theorem 3.10. For sigma_x: det(sigma_x - lambda I) = lambda^2 - 1, so lambda = +/- 1. Both have modulus 1. Eigenvectors: for lambda = 1: (1,1)^T/sqrt(2); for lambda = -1: (1,-1)^T/sqrt(2).

**Problem A3.6 [Medium]**
Let H = [[0, 1-i],[1+i, 0]]. (a) Verify H is Hermitian. (b) Find eigenvalues. (c) Express H as a linear combination of Pauli matrices.
Solution sketch: (a) H^dagger = [[0, (1+i)*],[(1-i)*, 0]] = [[0, 1-i],[1+i, 0]] = H. (b) det(H - lambda I) = lambda^2 - (1-i)(1+i) = lambda^2 - 2. lambda = +/- sqrt(2). (c) H = a_1 sigma_x + a_2 sigma_y with a_1 - i a_2 = 1 - i, giving a_1 = 1, a_2 = 1. So H = sigma_x + sigma_y.

**Problem A3.7 [Medium]**
Compute [sigma_x, sigma_y] and verify it equals 2i sigma_z.
Solution sketch: sigma_x sigma_y = [[0,1],[1,0]][[0,-i],[i,0]] = [[i,0],[0,-i]] = i sigma_z. sigma_y sigma_x = [[0,-i],[i,0]][[0,1],[1,0]] = [[-i,0],[0,i]] = -i sigma_z. Commutator: i sigma_z - (-i sigma_z) = 2i sigma_z.

**Problem A3.8 [Hard]**
Prove that if U is unitary and H is Hermitian, then UHU^dagger is Hermitian with the same eigenvalues as H.
Solution sketch: (UHU^dagger)^dagger = (U^dagger)^dagger H^dagger U^dagger = UHU^dagger. So it is Hermitian. If H|v> = lambda|v>, then UHU^dagger (U|v>) = UH|v> = lambda U|v>. So U|v> is an eigenvector of UHU^dagger with the same eigenvalue lambda.

**Problem A3.9 [Hard]**
Compute e^{i theta sigma_x} for arbitrary theta, using the fact that sigma_x^2 = I to simplify the Taylor series.
Solution sketch: e^{i theta sigma_x} = sum_{n even} (i theta)^n I / n! + sum_{n odd} (i theta)^n sigma_x / n! = cos(theta) I + i sin(theta) sigma_x = [[cos theta, i sin theta],[i sin theta, cos theta]]. Verify unitarity: adjoint is [[cos theta, -i sin theta],[-i sin theta, cos theta]]; product with original gives I (using cos^2 + sin^2 = 1).

**Problem A3.10 [Hard]**
Prove that the set of n x n unitary matrices forms a group under multiplication. (Verify closure, associativity, identity, and inverses.)
Solution sketch: Closure: if U, V are unitary, then (UV)^dagger(UV) = V^dagger U^dagger UV = V^dagger V = I. Associativity: inherited from matrix multiplication. Identity: I is unitary. Inverses: U^{-1} = U^dagger, and (U^dagger)^dagger U^dagger = UU^dagger = I, so U^dagger is unitary. This group is called U(n).

**Problem A3.11 [Hard]**
(Preview) The time-evolution operator in quantum mechanics is U(t) = e^{-iHt} where H is Hermitian (the Hamiltonian). If H = omega sigma_z / 2 (a spin in a magnetic field), compute U(t) and describe the motion of a state |psi(0)> = (1, 0)^T under this evolution.
Solution sketch: U(t) = e^{-i omega t sigma_z / 2} = [[e^{-i omega t/2}, 0],[0, e^{i omega t/2}]]. Then |psi(t)> = (e^{-i omega t/2}, 0)^T = e^{-i omega t/2} |0>. The state acquires a global phase and remains |0> for all time. But if |psi(0)> = (1,1)^T/sqrt(2), then |psi(t)> = (e^{-i omega t/2}, e^{i omega t/2})^T/sqrt(2), which has a time-dependent relative phase omega t. This is Larmor precession (forward-ref P4).

---

### 10. Simulator Dependencies

No custom quantum simulator is required for A3. However, the Bloch sphere widget (VA-3) should interface with the Bloch sphere component that will be fully developed in C3. If the C3 component is not yet built, a simplified version (static 3D rendering with preset rotations) suffices. The matrix exponential widget (VA-5) requires a numerical linear algebra library for matrix powers and summation (e.g., math.js or a custom implementation).

---

### 11. Estimates

- **Word count target:** 5,000 -- 6,000 words
- **Student time:** 120 -- 150 minutes
- **Development time:** 18 -- 22 hours (writing + widget development + review)

---

### 12. Page Splits

Recommended split into three pages:

- **Page A3a: Matrix Operations and the Adjoint** (Stages 1-2, Definitions 3.1, Lemma 3.2, Proposition 3.3, VA-1, Example 5.1, Problems A3.1-A3.2)
- **Page A3b: Hermitian and Unitary Matrices** (Stages 3-5, Definitions 3.4, 3.7, 3.11, Theorems 3.5, 3.6, 3.8, 3.10, VA-2, VA-3, Examples 5.2, 5.3, 5.4, Problems A3.3-A3.8)
- **Page A3c: Pauli Matrices, Matrix Exponential, and Trace/Determinant** (Stages 6-8, Definition 3.13, Lemma 3.14, Definition 3.15, Proposition 3.16, Lemma 3.17, Definition 3.18, VA-4, VA-5, VA-6, Examples 5.5, Problems A3.9-A3.11)

Rationale: A3 is the longest and most technically dense lesson in Track A. Three pages prevent overload and create natural stopping points. The third page (Pauli matrices and matrix exponential) can be treated as "enrichment" for students who want to move faster through the physics track.

---

## A4 -- Eigenvalues, Diagonalisation, and the Spectral Theorem

**Position in canonical order:** 8 of 23
**Prerequisites:** A1 (complex numbers), A2 (inner products, orthonormality, completeness), A3 (Hermitian, unitary, normal matrices, Pauli matrices)
**Unlocks:** P3 (Schrodinger equation), P4 (spin and Pauli), C3 (gates and Bloch sphere)
**Note on timing:** By the time students reach A4, they have completed P1 (classical failures) and P2 (postulates) and have had first exposure to qubits (C1) and measurement (C2). This means we can draw on physical motivation from those lessons.

---

### 1. Learning Objectives

By the end of this lesson the student will be able to:

1. Compute the characteristic polynomial of a matrix A, find its eigenvalues, and determine the algebraic and geometric multiplicities of each.
2. Find eigenvectors for each eigenvalue and construct the eigenspace.
3. Determine whether a matrix is diagonalisable, and if so, construct the diagonalisation A = PDP^{-1} (or A = UDU^dagger for normal matrices).
4. State the spectral theorem for normal matrices (in particular, for Hermitian and unitary matrices) and understand its proof.
5. Write the spectral decomposition A = sum_i lambda_i |e_i><e_i| for a Hermitian matrix, and use it for computation.
6. Verify and apply the completeness relation sum_i |e_i><e_i| = I derived from the spectral decomposition.
7. Define and compute functions of matrices via the spectral decomposition: f(A) = sum_i f(lambda_i) |e_i><e_i|, including e^{iA}, sqrt(A), and A^{-1} (when invertible).
8. Connect the spectral decomposition to quantum measurement: measuring an observable A on a state |psi> yields outcome lambda_i with probability |<e_i|psi>|^2 (forward-ref to A6, P2).
9. Determine whether two Hermitian matrices can be simultaneously diagonalised, and relate this to commutativity.

---

### 2. Intuition-Building Arc

**Stage 1 -- Eigenvalues as Fixed Directions (geometric + algebraic).** Begin with the geometric picture: an eigenvector of a matrix A is a direction that A stretches (or compresses or rotates) without changing the direction (or only flipping it). In the real 2D case, this is visually clear: a rotation by 90 degrees has no real eigenvectors (no direction is preserved), but a shear does. Extend to complex matrices: every n x n complex matrix has n eigenvalues (counted with multiplicity) by the fundamental theorem of algebra. The characteristic polynomial det(A - lambda I) = 0 is the tool. Rationale: the geometric picture motivates the algebra. Students who have seen eigenvalues before benefit from the geometric refresh; students who are shakier benefit from the concrete visualisation.

**Stage 2 -- Diagonalisation: When and Why (algebraic).** A matrix A is diagonalisable if it has n linearly independent eigenvectors. In that case A = PDP^{-1} where P has eigenvectors as columns and D is diagonal with eigenvalues. The diagonal form makes matrix powers trivial: A^k = PD^kP^{-1}. Not all matrices are diagonalisable (give a Jordan block counterexample). The question is: when can we guarantee diagonalisability? Answer: when the matrix is normal. This is the spectral theorem.

**Stage 3 -- The Spectral Theorem: Statement and Proof (algebraic + logical).** State: a normal matrix A (satisfying AA^dagger = A^dagger A) can be diagonalised by a unitary matrix: A = UDU^dagger, where U is unitary and D is diagonal. Equivalently, there exists an orthonormal basis of eigenvectors. For the Hermitian special case (A = A^dagger), the eigenvalues are real; for the unitary special case (U^dagger U = I), the eigenvalues have modulus 1.

Proof sketch (for the Hermitian case -- the normal case is analogous but technically heavier):
(a) We already proved (A3, Theorem 3.5) that eigenvalues of Hermitian matrices are real.
(b) We already proved (A3, Theorem 3.6) that eigenvectors for distinct eigenvalues are orthogonal.
(c) What remains: show that a Hermitian matrix on C^n has n eigenvectors (counting multiplicity) that span C^n, even when eigenvalues are repeated. Strategy: induction on n. Base case n=1 is trivial. For n > 1: A has at least one eigenvector |e_1> (since the characteristic polynomial has a root in C). Let W = {|e_1>}^perp (the orthogonal complement). Show that A maps W to itself: if <e_1|w> = 0, then <e_1|Aw> = <A^dagger e_1|w> = <Ae_1|w> = lambda_1 <e_1|w> = 0, so Aw is in W. Restrict A to W (an (n-1)-dimensional space); by the induction hypothesis, A|_W has an orthonormal eigenbasis for W. Combining with |e_1> gives an orthonormal eigenbasis for C^n.

Rationale: the inductive proof is elegant and short. The key insight is that Hermiticity guarantees eigenspaces are "compatible" (invariant subspaces have invariant complements). Students should understand this proof, not just the statement.

**Stage 4 -- Spectral Decomposition as Outer Products (algebraic + notational).** Rewrite A = UDU^dagger as A = sum_i lambda_i |e_i><e_i|. This is the spectral decomposition. Each |e_i><e_i| is a rank-1 projection onto the i-th eigenvector. The completeness relation sum_i |e_i><e_i| = I is the special case where all lambda_i = 1 (i.e., the spectral decomposition of the identity). The spectral decomposition is the single most useful representation of an operator in quantum mechanics.

**Stage 5 -- Functional Calculus: Functions of Matrices (algebraic + physical).** Define f(A) = sum_i f(lambda_i) |e_i><e_i| for any function f defined on the eigenvalues of A. Examples: e^{iA} = sum_i e^{i lambda_i} |e_i><e_i| (this must agree with the Taylor series definition from A3 -- verify). sqrt(A) for a positive semidefinite A. A^{-1} = sum_i lambda_i^{-1} |e_i><e_i| when all lambda_i != 0. Physical significance: time evolution e^{-iHt} is computed via the spectral decomposition of H; the probability of measuring lambda_i is computed via the projection |e_i><e_i|.

**Stage 6 -- Simultaneous Diagonalisation (algebraic + physical).** State and prove: two Hermitian matrices A, B can be simultaneously diagonalised (there exists a single orthonormal basis that diagonalises both) if and only if [A, B] = 0. Proof sketch of the "if" direction: if [A,B]=0 and A|e_i> = lambda_i |e_i>, then BA|e_i> = AB|e_i> = lambda_i B|e_i>, so B|e_i> is also an eigenvector of A with eigenvalue lambda_i. If lambda_i is non-degenerate, B|e_i> must be proportional to |e_i>, so |e_i> is also an eigenvector of B. If lambda_i is degenerate, B maps the eigenspace to itself, and we can diagonalise B within that eigenspace. Physical significance: commuting observables can be measured simultaneously without disturbance (forward-ref P5).

**Stage 7 -- Connection to Quantum Measurement (physical preview).** Revisit the measurement postulate (introduced informally in C2, formally in P2): measuring observable A on state |psi> gives outcome lambda_i with probability P(lambda_i) = |<e_i|psi>|^2, and the post-measurement state is |e_i>. The spectral decomposition A = sum lambda_i |e_i><e_i| makes this precise: the projectors P_i = |e_i><e_i| are the measurement operators, the eigenvalues are the outcomes, and the Born rule gives the probabilities. This is the payoff of the entire math track so far.

---

### 3. Theorems, Definitions & Lemmas

**Definition 3.1 (Characteristic Polynomial).** For an n x n matrix A, the characteristic polynomial is p(lambda) = det(A - lambda I). It is a degree-n polynomial in lambda with leading coefficient (-1)^n.

**Theorem 3.2 (Fundamental Theorem of Algebra Consequence).** Every n x n complex matrix has exactly n eigenvalues (counted with algebraic multiplicity), which are the roots of the characteristic polynomial.

**Definition 3.3 (Algebraic and Geometric Multiplicity).** The algebraic multiplicity of eigenvalue lambda is its multiplicity as a root of the characteristic polynomial. The geometric multiplicity is dim(ker(A - lambda I)), i.e., the dimension of the eigenspace. Always: 1 <= geometric multiplicity <= algebraic multiplicity.

**Definition 3.4 (Diagonalisable Matrix).** A matrix A is diagonalisable if there exists an invertible matrix P and a diagonal matrix D such that A = PDP^{-1}. Equivalently, A has n linearly independent eigenvectors.

**Theorem 3.5 (Spectral Theorem for Hermitian Matrices).** If A is an n x n Hermitian matrix, then there exists a unitary matrix U and a real diagonal matrix D such that A = UDU^dagger. Equivalently, there exists an orthonormal basis {|e_1>, ..., |e_n>} of eigenvectors of A with real eigenvalues lambda_1, ..., lambda_n.
Proof strategy: Induction on n. Base case: n = 1 is trivial (1x1 Hermitian matrix is a real number). Inductive step: A has at least one eigenvalue lambda_1 in C (fundamental theorem of algebra); lambda_1 is real (Theorem A3.3.5). Let |e_1> be a normalised eigenvector. Let W = span(|e_1>)^perp. Show A maps W to itself: for |w> in W, <e_1|Aw> = <A e_1|w> = lambda_1 <e_1|w> = 0, so Aw in W. The restriction A|_W is Hermitian on the (n-1)-dimensional space W. By induction, A|_W has an orthonormal eigenbasis {|e_2>, ..., |e_n>} for W. Then {|e_1>, ..., |e_n>} is an orthonormal eigenbasis for C^n.

**Corollary 3.6 (Spectral Theorem for Unitary Matrices).** If U is unitary, then U = sum_i e^{i phi_i} |e_i><e_i| for some orthonormal basis {|e_i>} and real phases phi_i.

**Theorem 3.7 (Spectral Theorem for Normal Matrices).** If A is normal (AA^dagger = A^dagger A), then A is unitarily diagonalisable: A = UDU^dagger with U unitary and D diagonal (with possibly complex diagonal entries).
Proof strategy: This is the full spectral theorem. The proof is more involved than the Hermitian case. One approach: use Schur's theorem (every matrix is unitarily triangularisable), then show that normality forces the triangular matrix to be diagonal. Schur's theorem is proved by induction: find one eigenvector, project onto its orthogonal complement, and triangularise the restriction. For a normal matrix, the triangular Schur form T satisfies TT^dagger = T^dagger T; direct computation shows that a triangular normal matrix must be diagonal (the off-diagonal entries are forced to be zero by comparing diagonal entries of TT^dagger and T^dagger T).

**Definition 3.8 (Spectral Decomposition).** For a normal matrix A with eigenvalues lambda_i and orthonormal eigenvectors |e_i>, the spectral decomposition is A = sum_{i=1}^n lambda_i |e_i><e_i|. For degenerate eigenvalues (lambda_i = lambda_j for i != j), we can group terms: A = sum_{distinct lambda} lambda P_lambda, where P_lambda = sum_{i: lambda_i = lambda} |e_i><e_i| is the projector onto the eigenspace for lambda.

**Proposition 3.9 (Completeness from Spectral Decomposition).** sum_{i=1}^n |e_i><e_i| = I. This is the spectral decomposition of the identity matrix (all eigenvalues equal to 1).

**Definition 3.10 (Functional Calculus).** For a normal matrix A with spectral decomposition A = sum_i lambda_i |e_i><e_i| and a function f: C -> C, define f(A) = sum_i f(lambda_i) |e_i><e_i|.

**Proposition 3.11 (Consistency of Functional Calculus with Matrix Exponential).** For a Hermitian matrix H with spectral decomposition H = sum_i lambda_i |e_i><e_i|, the functional calculus gives e^{iH} = sum_i e^{i lambda_i} |e_i><e_i|. This agrees with the Taylor series definition from A3.
Proof strategy: Expand e^{iH} = sum_{k=0}^infty (iH)^k / k! = sum_k (i sum_j lambda_j |e_j><e_j|)^k / k! = sum_k sum_j (i lambda_j)^k |e_j><e_j| / k! (using |e_j><e_j| |e_l><e_l| = delta_{jl} |e_j><e_j|) = sum_j (sum_k (i lambda_j)^k / k!) |e_j><e_j| = sum_j e^{i lambda_j} |e_j><e_j|.

**Theorem 3.12 (Simultaneous Diagonalisation).** Two Hermitian matrices A and B can be simultaneously diagonalised by a unitary transformation if and only if [A, B] = 0.
Proof strategy: (=>) If A = U D_A U^dagger and B = U D_B U^dagger with the same U, then AB = U D_A D_B U^dagger = U D_B D_A U^dagger = BA (diagonal matrices commute). (<=) Assume [A,B] = 0. Let lambda be an eigenvalue of A and V_lambda the corresponding eigenspace (possibly multi-dimensional). For any |v> in V_lambda: A(B|v>) = BA|v> = lambda B|v>, so B maps V_lambda to itself. Restrict B to V_lambda; since B is Hermitian, it can be diagonalised within V_lambda (by the spectral theorem applied to V_lambda). The eigenvectors of B within V_lambda are also eigenvectors of A (with eigenvalue lambda). Repeating for each eigenspace of A gives a common orthonormal eigenbasis.

---

### 4. Visual Assets

**VA-1: Eigenvalue/Eigenvector Visualiser (2x2 Real)**
- Type: Interactive widget
- Description: A 2x2 real matrix A is entered (4 real numbers). The widget plots unit vectors on the plane and shows how A transforms each one. Eigenvectors (where the output is parallel to the input) are highlighted with arrows showing the eigenvalue as a scaling factor. If eigenvalues are complex (rotation with no real fixed direction), an animated spiral illustrates this.
- Axes: Standard R^2 plane.
- What to notice: Eigenvectors are "special directions" preserved by the matrix. Hermitian matrices (= symmetric for real) always have real eigenvalues and perpendicular eigenvectors.
- Interactive controls: Edit matrix entries. Toggle "show all unit vectors transformed" vs. "show only eigenvectors."

**VA-2: Spectral Decomposition Visualiser**
- Type: Interactive widget
- Description: A 2x2 Hermitian matrix H is entered (or selected from presets: sigma_x, sigma_y, sigma_z, custom). The widget displays: the eigenvalues lambda_1, lambda_2; the eigenvectors |e_1>, |e_2>; the projectors P_1 = |e_1><e_1|, P_2 = |e_2><e_2| as matrices; and the reconstruction H = lambda_1 P_1 + lambda_2 P_2 verified numerically. A state |psi> can be entered and decomposed: the coefficients <e_i|psi>, the probabilities |<e_i|psi>|^2, and the bar chart of probabilities.
- What to notice: The spectral decomposition separates the matrix into "eigenvalue-labelled projection operators." The probabilities sum to 1 for normalised states.
- Interactive controls: Matrix input or preset buttons. State |psi> input. Toggle between showing projectors as matrices and as outer products.

**VA-3: Diagonalisation Step-by-Step**
- Type: Animated step-through
- Description: Given a matrix A, the animation walks through: (1) compute characteristic polynomial; (2) find roots (eigenvalues); (3) find eigenvectors for each eigenvalue; (4) form P (columns = eigenvectors) and D (diagonal = eigenvalues); (5) verify A = PDP^{-1} (or UDU^dagger if orthonormal). Each step is a clickable frame.
- What to notice: The matrix P (or U) contains the eigenvectors as columns; D contains the eigenvalues on the diagonal. The order of eigenvalues in D matches the order of eigenvectors in P.
- Interactive controls: Step forward/back. Input custom matrix.

**VA-4: Functional Calculus Visualiser**
- Type: Interactive widget
- Description: A Hermitian matrix H is given (2x2, from presets or custom). The student selects a function f from a dropdown (e^{ix}, sqrt(x), x^2, 1/x, cos(x), etc.) or types a custom expression. The widget computes f(H) = sum_i f(lambda_i) |e_i><e_i| and displays the result as a matrix, along with intermediate steps: eigenvalues lambda_i, f(lambda_i), eigenvectors, and the final sum.
- What to notice: f(H) has the same eigenvectors as H but with eigenvalues f(lambda_i). For f(x) = e^{ix}, the result is a unitary matrix. For f(x) = x^2, the result is H^2.
- Interactive controls: Matrix input, function selector, "compute" button.

**VA-5: Simultaneous Diagonalisation Demo**
- Type: Interactive widget
- Description: Two 2x2 Hermitian matrices A, B are entered. The widget computes [A,B], displays it, and indicates whether it is zero (commuting) or nonzero (non-commuting). If commuting, the common eigenbasis is computed and displayed. If non-commuting, the separate eigenbases are shown, and the widget highlights that they differ.
- What to notice: Commuting Hermitian matrices share an eigenbasis; non-commuting ones do not. This is the mathematical foundation of the uncertainty principle.
- Interactive controls: Matrix entries for A and B. Preset pairs: (sigma_z, sigma_z) for commuting, (sigma_x, sigma_z) for non-commuting.

---

### 5. Worked Examples

**Example 5.1: Full Diagonalisation of sigma_x**
Diagonalise sigma_x = [[0,1],[1,0]].

Step 1: Characteristic polynomial: det(sigma_x - lambda I) = det([[-lambda, 1],[1, -lambda]]) = lambda^2 - 1 = (lambda - 1)(lambda + 1). Eigenvalues: lambda_1 = 1, lambda_2 = -1.
Step 2: Eigenvectors. For lambda = 1: (sigma_x - I)|v> = [[-1,1],[1,-1]]|v> = 0. Solution: v_1 = v_2. Normalised: |+> = (1,1)^T / sqrt(2). For lambda = -1: (sigma_x + I)|v> = [[1,1],[1,1]]|v> = 0. Solution: v_1 = -v_2. Normalised: |-> = (1,-1)^T / sqrt(2).
Step 3: Spectral decomposition: sigma_x = 1 * |+><+| + (-1) * |-><-| = |+><+| - |-><-|.
Step 4: Verify: |+><+| = (1/2)[[1,1],[1,1]], |-><-| = (1/2)[[1,-1],[-1,1]]. Difference: (1/2)[[0,2],[2,0]] = [[0,1],[1,0]] = sigma_x. Confirmed.
Narration: This is the simplest non-trivial spectral decomposition. The eigenbasis {|+>, |->} is the "X-basis" or "Hadamard basis," and measuring in this basis is equivalent to applying a Hadamard gate before measuring in the computational basis. This connection (forward-ref C2, C3) is the practical payoff of spectral decomposition.

**Example 5.2: Spectral Decomposition and Measurement Probabilities**
The observable sigma_z has spectral decomposition sigma_z = |0><0| - |1><1|. A qubit is in state |psi> = cos(pi/8)|0> + sin(pi/8)|1>. Compute the probabilities and expected value of a sigma_z measurement.

Step 1: P(+1) = |<0|psi>|^2 = cos^2(pi/8) approximately 0.854. P(-1) = |<1|psi>|^2 = sin^2(pi/8) approximately 0.146.
Step 2: Expected value: <psi|sigma_z|psi> = (+1)(cos^2(pi/8)) + (-1)(sin^2(pi/8)) = cos^2(pi/8) - sin^2(pi/8) = cos(pi/4) = 1/sqrt(2) approximately 0.707.
Step 3: Verify using matrix multiplication: <psi|sigma_z|psi> = (cos(pi/8), sin(pi/8)) [[1,0],[0,-1]] (cos(pi/8), sin(pi/8))^T = cos^2(pi/8) - sin^2(pi/8) = cos(pi/4). Confirmed.
Narration: This is the Born rule in action (A6). The spectral decomposition tells us the possible outcomes (+1, -1) and the projection operators (|0><0|, |1><1|) that compute the probabilities. The expected value <A> = <psi|A|psi> is a weighted average of eigenvalues.

**Example 5.3: Functional Calculus -- Matrix Square Root**
Find sqrt(M) where M = [[5, -1],[-1, 5]] (a 2x2 real symmetric matrix).

Step 1: Eigenvalues: det(M - lambda I) = (5-lambda)^2 - 1 = lambda^2 - 10 lambda + 24 = (lambda - 4)(lambda - 6). lambda_1 = 4, lambda_2 = 6.
Step 2: Eigenvectors: For lambda = 4: [[1,-1],[-1,1]]|v> = 0, so |e_1> = (1,1)^T/sqrt(2). For lambda = 6: [[-1,-1],[-1,-1]]|v> = 0, so |e_2> = (1,-1)^T/sqrt(2).
Step 3: sqrt(M) = sqrt(4) |e_1><e_1| + sqrt(6) |e_2><e_2| = 2 * (1/2)[[1,1],[1,1]] + sqrt(6) * (1/2)[[1,-1],[-1,1]] = [[(2+sqrt(6))/2, (2-sqrt(6))/2],[(2-sqrt(6))/2, (2+sqrt(6))/2]].
Step 4: Verify: (sqrt(M))^2 should equal M. Compute and confirm (numerically: (2+sqrt(6))/2 approx 2.225; entry computation yields 5 and -1 as expected).
Narration: The matrix square root is impossible to compute by "entry-wise square root" -- the spectral decomposition is the only sensible route. This technique generalises: any function can be applied to a matrix by applying it to the eigenvalues. In quantum mechanics, density matrices rho satisfy 0 <= rho <= I, and quantities like the von Neumann entropy S = -tr(rho log rho) require the functional calculus.

**Example 5.4: Simultaneous Diagonalisation**
Show that sigma_z = [[1,0],[0,-1]] and H_diag = [[3,0],[0,7]] commute, and find their common eigenbasis.

Step 1: [sigma_z, H_diag] = sigma_z H_diag - H_diag sigma_z = [[3,0],[0,-7]] - [[3,0],[0,-7]] = 0. They commute.
Step 2: Eigenvectors of sigma_z: |0> = (1,0)^T (eigenvalue +1), |1> = (0,1)^T (eigenvalue -1). Eigenvectors of H_diag: |0> (eigenvalue 3), |1> (eigenvalue 7). Common eigenbasis: {|0>, |1>}.
Step 3: Physical interpretation: sigma_z and H_diag represent compatible observables. Measuring sigma_z (e.g., spin up/down) does not disturb H_diag (e.g., energy), because they share eigenstates.
Narration: This example is deliberately simple to illustrate the concept. The interesting case is when eigenvectors are NOT aligned (non-commuting observables), which leads to the uncertainty principle (P5). The contrast between this example and the sigma_x, sigma_z pair (which do not commute) is instructive.

**Example 5.5: Computing e^{-iHt} via Spectral Decomposition**
Let H = [[1, 0],[0, -1]] = sigma_z. Compute U(t) = e^{-iHt}.

Step 1: Spectral decomposition: H = (+1)|0><0| + (-1)|1><1|.
Step 2: Functional calculus: e^{-iHt} = e^{-i(+1)t} |0><0| + e^{-i(-1)t} |1><1| = e^{-it} |0><0| + e^{it} |1><1|.
Step 3: As a matrix: [[e^{-it}, 0],[0, e^{it}]].
Step 4: Action on a superposition: U(t)(alpha|0> + beta|1>) = alpha e^{-it} |0> + beta e^{it} |1>. The relative phase between the |0> and |1> components rotates at rate 2t. This is Larmor precession on the Bloch sphere (forward-ref P4, C3).
Narration: This is the canonical use of the spectral decomposition in quantum mechanics: solving the Schrodinger equation by exponentiating the Hamiltonian. The spectral decomposition reduces the matrix exponential to scalar exponentials. Without the spectral theorem, we would need to sum an infinite series of matrix powers.

---

### 6. Common Confusions

**CC-1: Confusing algebraic and geometric multiplicity.**
Wrong model: Students assume that a root of multiplicity k in the characteristic polynomial always gives a k-dimensional eigenspace.
Why tempting: For normal matrices (including all Hermitian and unitary), this IS true -- the spectral theorem guarantees it.
Corrective argument: For non-normal matrices, geometric multiplicity can be strictly less than algebraic multiplicity. The Jordan block [[0,1],[0,0]] has algebraic multiplicity 2 for lambda = 0 but geometric multiplicity 1 (only one independent eigenvector). Non-normal matrices are not diagonalisable. This is precisely why the spectral theorem requires normality.

**CC-2: Thinking every matrix is diagonalisable.**
Wrong model: Students apply the diagonalisation procedure to any matrix without checking the hypothesis.
Why tempting: In an introductory linear algebra course, most examples are diagonalisable (especially symmetric/Hermitian ones).
Corrective argument: The matrix [[1,1],[0,1]] has eigenvalue 1 with algebraic multiplicity 2 but only one independent eigenvector; it is NOT diagonalisable. However, every matrix IS unitarily triangularisable (Schur's theorem), and every NORMAL matrix is unitarily diagonalisable. In quantum mechanics, all observables are Hermitian and all time evolutions are unitary -- both are normal. So the spectral theorem always applies in quantum mechanics. This is not a coincidence; it is baked into the postulates.

**CC-3: Confusing the spectral decomposition with any eigenvalue decomposition.**
Wrong model: Students write A = PDP^{-1} and call it "the spectral decomposition" even when P is not unitary.
Why tempting: Both express A in terms of eigenvalues and eigenvectors.
Corrective argument: The spectral decomposition A = sum lambda_i |e_i><e_i| uses ORTHONORMAL eigenvectors. This is stronger than a general diagonalisation: it gives the projection operators P_i = |e_i><e_i| that are Hermitian and idempotent, which are needed for the Born rule. A non-orthogonal eigenbasis (possible for non-normal diagonalisable matrices) does not give projectors with these properties.

**CC-4: Thinking f(A) can be computed by applying f to each entry of A.**
Wrong model: Students compute sqrt(A) by taking the square root of each matrix entry.
Why tempting: It is the most natural guess, and it works for diagonal matrices.
Corrective argument: sqrt([[4, 0],[0, 9]]) = [[2, 0],[0, 3]] (entry-wise works here because the matrix is diagonal, hence already in spectral form). But sqrt([[5, -1],[-1, 5]]) is NOT [[sqrt(5), -1],[-1, sqrt(5)]]. The correct procedure is to diagonalise, apply f to eigenvalues, and reconstruct. This is the functional calculus.

**CC-5: "The eigenvectors of a matrix are unique."**
Wrong model: Students think there is one special eigenvector per eigenvalue.
Why tempting: In non-degenerate cases, the eigenvector is unique up to a scalar multiple.
Corrective argument: For degenerate eigenvalues (multiplicity > 1), the eigenSPACE is multi-dimensional, and any orthonormal basis for the eigenspace works. The spectral decomposition A = sum lambda P_lambda is unique (the projectors P_lambda are determined by A), but the individual eigenvectors within a degenerate eigenspace are not. In quantum mechanics, this means that degenerate energy levels have multiple valid eigenstates, and any orthonormal basis for the degenerate subspace is acceptable.

---

### 7. Cross-References

**Backward references:**
- A1: Eigenvalues of unitary matrices are unit complex numbers e^{i phi} (points on the unit circle from A1).
- A2: Orthonormality, inner product, completeness relation (the completeness relation is a special case of the spectral decomposition with all eigenvalues = 1).
- A3: Hermitian matrices have real eigenvalues, unitary matrices have unit-modulus eigenvalues (proved in A3, used here). Pauli matrices are the primary examples.
- P2: Students have already seen the measurement postulate informally; A4 provides the rigorous mathematical framework.
- C1, C2: Students have already seen qubits and measurement; A4 explains why measurement outcomes are eigenvalues and probabilities are squared amplitudes.

**Forward references within Track A:**
- A5: Tensor products of operators have eigenvalues that are products of the individual eigenvalues. Spectral decompositions of tensor products.
- A6: The Born rule P(lambda_i) = |<e_i|psi>|^2 relies directly on the spectral decomposition.

**Forward references to Track P:**
- P3: Solving the Schrodinger equation via e^{-iHt} uses the spectral decomposition (Example 5.5).
- P4: The spin Hamiltonian H = (omega/2) n . sigma has eigenvalues +/- omega/2, found via spectral decomposition.
- P5: The uncertainty principle involves the variances of observables, computed from the spectral decomposition: Var(A) = <A^2> - <A>^2.

**Forward references to Track C:**
- C3: Gate action on the Bloch sphere is understood via the spectral decomposition of the gate (as a unitary).
- C5: Universal gates can approximate any unitary, which means approximating any spectral decomposition.
- C9: The QFT diagonalises the shift operator; understanding this requires the spectral theorem.

---

### 8. Historical Notes

- The **characteristic equation** was introduced by **Augustin-Louis Cauchy** (1829) in his work on quadratic forms. The term "eigenvalue" (Eigenwert) was coined by **David Hilbert** (1904).
- The **spectral theorem** for finite-dimensional Hermitian matrices was proved by **Cauchy** (1829) for the real symmetric case. The extension to complex Hermitian matrices is attributed to **Hermite** (1855) and was placed in its modern form by **von Neumann** (1932) as part of his axiomatisation of quantum mechanics.
- The name "spectral" comes from Hilbert's work on integral equations, where the eigenvalues were called the "spectrum" of the operator. When quantum mechanics identified observable eigenvalues with spectral lines of atoms (Bohr, 1913; Heisenberg, 1925), the mathematical and physical meanings of "spectrum" merged -- a beautiful coincidence of terminology.
- **Schur's theorem** (every matrix is unitarily triangularisable) was proved by **Issai Schur** in 1909.
- The **functional calculus** for matrices was developed by **Cayley** (1858) and **Sylvester** (1882) for polynomials, and extended to general functions by **Riesz** (1913) and **Dunford** (1938) in the infinite-dimensional setting.

---

### 9. Problem Set

**Problem A4.1 [Easy]**
Find the eigenvalues and eigenvectors of sigma_z = [[1,0],[0,-1]]. Write the spectral decomposition.
Solution sketch: lambda = 1 -> |0>; lambda = -1 -> |1>. sigma_z = |0><0| - |1><1|.

**Problem A4.2 [Easy]**
Verify the completeness relation |0><0| + |1><1| = I by computing the matrix sum.
Solution sketch: [[1,0],[0,0]] + [[0,0],[0,1]] = [[1,0],[0,1]] = I.

**Problem A4.3 [Easy]**
A Hermitian matrix H has eigenvalues 2 and 5 with eigenvectors |e_1> and |e_2>. Write down H^3 using the functional calculus.
Solution sketch: H^3 = 2^3 |e_1><e_1| + 5^3 |e_2><e_2| = 8 |e_1><e_1| + 125 |e_2><e_2|.

**Problem A4.4 [Medium]**
Diagonalise the Hadamard matrix H = (1/sqrt(2))[[1,1],[1,-1]]. Find its eigenvalues and eigenvectors.
Solution sketch: Characteristic polynomial: det(H - lambda I) = lambda^2 - 1/2 - 1/2 = lambda^2 - 1 = 0. Wait -- let us compute carefully. det((1/sqrt(2))[[1,1],[1,-1]] - lambda I) = (1/sqrt(2) - lambda)(-1/sqrt(2) - lambda) - 1/2 = lambda^2 - 1/2 - 1/2 = lambda^2 - 1. So lambda = +/- 1. Eigenvectors: for lambda = 1, (H - I)|v> = 0. H|v> = |v>. (1/sqrt(2))[[1,1],[1,-1]]|v> = |v>. First row: (v_1 + v_2)/sqrt(2) = v_1, so v_2 = (sqrt(2)-1) v_1. Normalise. Similarly for lambda = -1. Note: H is Hermitian (since it is real and symmetric), so eigenvectors are orthogonal.

**Problem A4.5 [Medium]**
Let A = [[0, 1-i],[1+i, 3]]. Find the spectral decomposition A = lambda_1 |e_1><e_1| + lambda_2 |e_2><e_2|. Then compute e^{iA} using the functional calculus.
Solution sketch: First verify A is Hermitian. Characteristic polynomial: -lambda(3-lambda) - |1-i|^2 = lambda^2 - 3 lambda - 2. lambda = (3 +/- sqrt(9+8))/2 = (3 +/- sqrt(17))/2. Find eigenvectors, form spectral decomposition. e^{iA} = e^{i lambda_1} |e_1><e_1| + e^{i lambda_2} |e_2><e_2|.

**Problem A4.6 [Medium]**
Prove that the trace of a matrix equals the sum of its eigenvalues and the determinant equals the product of its eigenvalues.
Solution sketch: The characteristic polynomial p(lambda) = det(A - lambda I) = (-lambda)^n + tr(A)(-lambda)^{n-1} + ... + det(A). By Vieta's formulas applied to the roots lambda_1, ..., lambda_n: sum of roots = tr(A), product of roots = det(A) (with appropriate sign convention).

**Problem A4.7 [Medium]**
A qubit is in state |psi> = (3/5)|0> + (4/5)|1>. Compute the expected value and variance of sigma_x.
Solution sketch: <sigma_x> = <psi|sigma_x|psi> = (3/5)(4/5) + (4/5)(3/5) = 24/25. <sigma_x^2> = <psi|I|psi> = 1 (since sigma_x^2 = I). Var = <sigma_x^2> - <sigma_x>^2 = 1 - 576/625 = 49/625.

**Problem A4.8 [Hard]**
Prove the spectral theorem for 2x2 Hermitian matrices directly (without induction), by explicitly constructing the eigenvectors.
Solution sketch: Write H = [[a, b],[b*, d]] with a, d real. Characteristic polynomial: lambda^2 - (a+d) lambda + (ad - |b|^2). Eigenvalues: lambda_+/- = ((a+d) +/- sqrt((a-d)^2 + 4|b|^2))/2. Both real (discriminant is non-negative). Eigenvectors: for each lambda, solve (H - lambda I)|v> = 0. Show they are orthogonal by direct computation: <v_+|v_-> = 0. Normalise.

**Problem A4.9 [Hard]**
Prove that if A is Hermitian and all its eigenvalues are non-negative, then there exists a unique positive semidefinite Hermitian matrix B such that B^2 = A. (This B is sqrt(A).)
Solution sketch: Let A = sum_i lambda_i |e_i><e_i| with lambda_i >= 0. Define B = sum_i sqrt(lambda_i) |e_i><e_i|. Then B^2 = sum_i lambda_i |e_i><e_i| = A. B is Hermitian (eigenvalues sqrt(lambda_i) are real) and positive semidefinite (eigenvalues are non-negative). Uniqueness: if C is also positive semidefinite with C^2 = A, then C commutes with A (since C^2 = A implies CA = C^3 = AC). By simultaneous diagonalisation, C and A share an eigenbasis. On each eigenvector, C's eigenvalue satisfies c_i^2 = lambda_i and c_i >= 0, so c_i = sqrt(lambda_i). Thus C = B.

**Problem A4.10 [Hard]**
(Preview) The Hamiltonian of a two-level quantum system interacting with a classical field is H = (Delta/2) sigma_z + (Omega/2) sigma_x, where Delta is the detuning and Omega is the Rabi frequency. Find the eigenvalues and eigenvectors of H. What is the energy splitting? Compute the time-evolution operator U(t) = e^{-iHt}.
Solution sketch: H = (1/2)[[Delta, Omega],[Omega, -Delta]]. Eigenvalues: lambda_+/- = +/- (1/2)sqrt(Delta^2 + Omega^2). Let Omega_R = sqrt(Delta^2 + Omega^2) (the generalised Rabi frequency). Energy splitting = Omega_R. Eigenvectors: determined by the mixing angle theta where tan(theta) = Omega/Delta. |+> = cos(theta/2)|0> + sin(theta/2)|1>, |-> = -sin(theta/2)|0> + cos(theta/2)|1>. Time evolution: U(t) = e^{-i Omega_R t/2} |+><+| + e^{+i Omega_R t/2} |-><-|. This gives Rabi oscillations between |0> and |1> at frequency Omega_R (forward-ref P3, P4).

---

### 10. Simulator Dependencies

No quantum circuit simulator is needed for A4. The spectral decomposition visualiser (VA-2) and functional calculus visualiser (VA-4) require a numerical eigenvalue solver for 2x2 complex matrices. This can be implemented analytically (the quadratic formula for 2x2) rather than relying on a general-purpose library, keeping the widget lightweight.

---

### 11. Estimates

- **Word count target:** 5,000 -- 6,500 words
- **Student time:** 120 -- 160 minutes
- **Development time:** 16 -- 20 hours (writing + widget development + review)

---

### 12. Page Splits

Recommended split into two pages:

- **Page A4a: Eigenvalues, Eigenvectors, and the Spectral Theorem** (Stages 1-3, Definitions 3.1-3.4, Theorems 3.2, 3.5, 3.7, VA-1, VA-3, Examples 5.1, Problems A4.1-A4.4, A4.8)
- **Page A4b: Spectral Decomposition, Functional Calculus, and Applications** (Stages 4-7, Definitions 3.8, 3.10, Propositions 3.9, 3.11, Theorem 3.12, VA-2, VA-4, VA-5, Examples 5.2-5.5, Problems A4.5-A4.7, A4.9-A4.10)

Rationale: Page A4a covers the abstract theory (existence of eigenvalues, the spectral theorem statement and proof). Page A4b covers the applications (spectral decomposition in outer-product form, functional calculus, quantum measurement). Students who are comfortable with eigenvalues from prior courses can skim A4a and focus on A4b.

---

## A5 -- Tensor Products

**Position in canonical order:** 12 of 23
**Prerequisites:** A1-A4 (complete math track so far), and from physics/computing: P1, P2, C1, C2, P3, P4, C3
**Unlocks:** P5 (uncertainty), P6 (Bell/CHSH), C4 (multi-qubit gates)
**Note on timing:** By the time students reach A5, they have already worked with single qubits (C1-C3), measurement (C2), the Bloch sphere (C3), and spin systems (P4). They have a physical need for the tensor product: "How do we describe TWO qubits?" A5 answers this question rigorously.

---

### 1. Learning Objectives

By the end of this lesson the student will be able to:

1. Explain why the tensor product (not the direct sum or Cartesian product) is the correct mathematical structure for combining quantum systems, and state the dimension-counting rule: dim(H_A tensor H_B) = dim(H_A) * dim(H_B).
2. Compute the tensor (Kronecker) product of two concrete vectors and two concrete matrices using the block-matrix definition.
3. Write the computational basis for a multi-qubit system (e.g., {|00>, |01>, |10>, |11>} for 2 qubits) as tensor products of single-qubit basis vectors.
4. Define separable (product) states and entangled states. Give examples of each.
5. Prove that specific states are entangled by showing they cannot be written as a tensor product of single-system states. In particular, prove that the four Bell states are entangled.
6. Compute the tensor product of two operators (Kronecker product) and apply it to a composite-system state.
7. Compute the partial trace of a 2-qubit density operator over one subsystem, and interpret the result as the reduced state of the other subsystem.
8. Recognise and construct the computational basis ordering convention used in quantum computing (big-endian vs. little-endian), and consistently apply it.

---

### 2. Intuition-Building Arc

**Stage 1 -- Two Coins vs. Two Qubits: Why We Need a New Structure (physical + motivational).** Begin with the classical analogy: two coins have 4 possible states (HH, HT, TH, TT). A probability distribution over them is a vector in R^4 (or rather, the probability simplex). Now consider two qubits: the first can be in any state alpha|0> + beta|1>, the second in any state gamma|0> + delta|1>. Naively, the "joint state" might be described by the pair (alpha, beta, gamma, delta) -- 4 complex numbers. But 4 complex numbers parameterise a 4-dimensional space, while the joint state of two qubits turns out to live in a 4-dimensional complex vector space C^4. The Cartesian product C^2 x C^2 is also 4-dimensional (as a complex space), but it does NOT have the right structure: it cannot represent entangled states. The tensor product C^2 tensor C^2 = C^4 is the correct construction.

Rationale: this opening directly addresses the question students have been silently carrying since C1: "If one qubit is a vector in C^2, what is two qubits?" The answer is not C^2 x C^2 (too small -- only product states) and not C^2 + C^2 (wrong dimension -- direct sum gives C^4 but with the wrong interpretation). The tensor product is the unique construction that gives both the right dimension AND the right physics.

**Stage 2 -- The Tensor Product: Definition and Computation (algebraic).** Define the tensor product of two vectors: |u> tensor |v> (also written |u>|v> or |uv>) is the "formal product" that is bilinear (distributes over addition in each factor separately, and scalars pull out from either factor). For C^m and C^n, the tensor product space C^m tensor C^n is isomorphic to C^{mn}. Concretely: if |u> = (u_1, ..., u_m)^T and |v> = (v_1, ..., v_n)^T, then |u> tensor |v> is the mn-dimensional vector (u_1 v_1, u_1 v_2, ..., u_1 v_n, u_2 v_1, ..., u_m v_n)^T. This is the Kronecker product.

Rationale: provide both the abstract (bilinearity) and the concrete (Kronecker product as block vectors/matrices) perspectives. Students will use the concrete version for computation but need the abstract version to understand entanglement.

**Stage 3 -- The Computational Basis (algebraic + notational).** For two qubits: |00> = |0> tensor |0> = (1,0,0,0)^T, |01> = |0> tensor |1> = (0,1,0,0)^T, |10> = |1> tensor |0> = (0,0,1,0)^T, |11> = |1> tensor |1> = (0,0,0,1)^T. These are the computational basis for C^4. A general 2-qubit state is |psi> = a|00> + b|01> + c|10> + d|11> with |a|^2 + |b|^2 + |c|^2 + |d|^2 = 1. Extend to n qubits: the computational basis for n qubits is {|x_1 x_2 ... x_n> : x_i in {0,1}}, which has 2^n elements. The state space is C^{2^n}.

Rationale: explicit construction removes abstraction. The exponential growth (2^n) is the source of quantum computing's potential power -- mention this.

**Stage 4 -- Tensor Products of Operators (algebraic).** For operators A on H_A and B on H_B, the tensor product A tensor B acts on H_A tensor H_B by (A tensor B)(|u> tensor |v>) = (A|u>) tensor (B|v>). As a matrix, A tensor B is the Kronecker product: the block matrix obtained by replacing each entry a_{ij} of A with the block a_{ij} B. Dimension: if A is m x m and B is n x n, then A tensor B is mn x mn. Key fact: (A tensor B)(C tensor D) = (AC) tensor (BD). This means applying a gate to qubit 1 and a different gate to qubit 2 can be expressed as a single tensor product operator.

**Stage 5 -- Separable vs. Entangled States: The Critical Distinction (algebraic + physical).** A state |psi> in H_A tensor H_B is separable (or a product state) if it can be written as |psi> = |a> tensor |b> for some |a> in H_A and |b> in H_B. Otherwise it is entangled. Entangled states are the ones that have no classical analogue and are responsible for quantum computing's power, quantum teleportation, and Bell inequality violations.

How to test: for a 2-qubit state a|00> + b|01> + c|10> + d|11>, the state is separable iff the 2x2 matrix [[a, b],[c, d]] has rank 1, equivalently iff ad - bc = 0 (the "determinant test").

Rationale: this is the most important conceptual content of the lesson. Students must understand that most states in the tensor product space are NOT product states -- the set of separable states is a measure-zero subset of the full state space. Entanglement is the generic case, not the exception.

**Stage 6 -- Bell States: Constructing and Proving Entanglement (algebraic).** Define the four Bell states:
|Phi+> = (|00> + |11>)/sqrt(2),  |Phi-> = (|00> - |11>)/sqrt(2),
|Psi+> = (|01> + |10>)/sqrt(2),  |Psi-> = (|01> - |10>)/sqrt(2).
Prove |Phi+> is entangled: suppose |Phi+> = (alpha|0> + beta|1>) tensor (gamma|0> + delta|1>) = alpha gamma |00> + alpha delta |01> + beta gamma |10> + beta delta |11>. Matching coefficients: alpha gamma = 1/sqrt(2), alpha delta = 0, beta gamma = 0, beta delta = 1/sqrt(2). From alpha delta = 0: either alpha = 0 or delta = 0. If alpha = 0, then alpha gamma = 0, contradicting alpha gamma = 1/sqrt(2). If delta = 0, then beta delta = 0, contradicting beta delta = 1/sqrt(2). Contradiction. Therefore |Phi+> is not separable. Alternatively, use the determinant test: ad - bc = (1/sqrt(2))(0) - (0)(1/sqrt(2))... wait, the matrix is [[1/sqrt(2), 0],[0, 1/sqrt(2)]]; its determinant is 1/2 != 0, confirming entanglement.

**Stage 7 -- Partial Trace (algebraic + physical).** For a composite system AB in a pure state |psi>, the state of subsystem A alone is described by the reduced density matrix rho_A = tr_B(|psi><psi|). The partial trace is defined operationally: for a basis {|b_j>} of H_B, tr_B(rho) = sum_j <b_j| rho |b_j> (where the bra-ket acts only on the B subsystem). For a product state |a>|b>, the partial trace gives rho_A = |a><a| (a pure state). For an entangled state like |Phi+>, the partial trace gives rho_A = (1/2) I (the maximally mixed state -- as mixed as possible). This is the mathematical expression of the fact that entanglement creates correlations between subsystems while making each subsystem individually look random.

Rationale: the partial trace is conceptually subtle but essential for understanding decoherence (P7), the no-cloning theorem, and why quantum computing is hard. Introducing it here, with concrete 2-qubit examples, builds familiarity before the physics demands it.

---

### 3. Theorems, Definitions & Lemmas

**Definition 3.1 (Tensor Product of Vector Spaces).** For finite-dimensional complex vector spaces V (dim m) and W (dim n), the tensor product V tensor W is a complex vector space of dimension mn. If {|v_i>}_{i=1}^m is a basis for V and {|w_j>}_{j=1}^n is a basis for W, then {|v_i> tensor |w_j>}_{i,j} is a basis for V tensor W. The tensor product is bilinear: (alpha|v_1> + beta|v_2>) tensor |w> = alpha |v_1> tensor |w> + beta |v_2> tensor |w>, and similarly in the second argument.

**Definition 3.2 (Kronecker Product -- Vectors).** For |u> = (u_1, ..., u_m)^T in C^m and |v> = (v_1, ..., v_n)^T in C^n, the Kronecker product is |u> tensor |v> = (u_1 v_1, u_1 v_2, ..., u_1 v_n, u_2 v_1, ..., u_m v_n)^T in C^{mn}.

**Definition 3.3 (Kronecker Product -- Matrices).** For an m x m matrix A and an n x n matrix B, the Kronecker product A tensor B is the mn x mn block matrix with (i,j)-block a_{ij} B.

**Proposition 3.4 (Kronecker Product Properties).** (i) (A tensor B)(C tensor D) = (AC) tensor (BD); (ii) (A tensor B)^dagger = A^dagger tensor B^dagger; (iii) tr(A tensor B) = tr(A) tr(B); (iv) det(A tensor B) = (det A)^n (det B)^m (for m x m A and n x n B).
Proof strategy: (i) Compute (A tensor B)(|u> tensor |v>) = (A|u>) tensor (B|v>) by the definition of tensor-product operators; extend to (C tensor D)(|u> tensor |v>) = (C|u>) tensor (D|v>), then compose. (ii) Apply the definition of Kronecker product and conjugate-transpose block-by-block. (iii) tr(A tensor B) = sum_{i,j} (A tensor B)_{(i,j),(i,j)} = sum_i sum_j a_{ii} b_{jj} = tr(A) tr(B). (iv) Requires a permutation argument; omit proof, state as fact.

**Definition 3.5 (Computational Basis for n Qubits).** For n qubits, the computational basis is {|x_1 x_2 ... x_n> : x_i in {0,1}} = {|x> : x in {0, ..., 2^n - 1}}, where |x> = |x_1> tensor |x_2> tensor ... tensor |x_n> and x = sum_{i=1}^n x_i 2^{n-i} (big-endian binary representation). This is an orthonormal basis for (C^2)^{tensor n} = C^{2^n}.

**Definition 3.6 (Separable and Entangled States).** A state |psi> in H_A tensor H_B is separable (product) if there exist |a> in H_A and |b> in H_B such that |psi> = |a> tensor |b>. Otherwise |psi> is entangled.

**Proposition 3.7 (Determinant Test for 2-Qubit Separability).** A 2-qubit state |psi> = a|00> + b|01> + c|10> + d|11> is separable iff the matrix M = [[a, b],[c, d]] has rank 1, equivalently iff ad - bc = 0.
Proof strategy: If |psi> = (alpha|0> + beta|1>)(gamma|0> + delta|1>), then a = alpha gamma, b = alpha delta, c = beta gamma, d = beta delta. So ad - bc = alpha gamma beta delta - alpha delta beta gamma = 0. Conversely, if ad = bc and the state is nonzero, factor M as a rank-1 matrix: M = |phi><chi|^T for some vectors |phi>, |chi>, giving the product form.

**Definition 3.8 (Bell States).** The four Bell states are:
|Phi+> = (|00> + |11>)/sqrt(2), |Phi-> = (|00> - |11>)/sqrt(2),
|Psi+> = (|01> + |10>)/sqrt(2), |Psi-> = (|01> - |10>)/sqrt(2).
They form an orthonormal basis for C^2 tensor C^2 = C^4.

**Theorem 3.9 (Bell States are Entangled).** None of the four Bell states is separable.
Proof strategy: For |Phi+>: the coefficient matrix [[1/sqrt(2), 0],[0, 1/sqrt(2)]] has determinant 1/2 != 0, so rank > 1, so the state is not separable. Similarly for the other three: |Phi->: [[1/sqrt(2), 0],[0, -1/sqrt(2)]], determinant = -1/2 != 0. |Psi+>: [[0, 1/sqrt(2)],[1/sqrt(2), 0]], determinant = -1/2 != 0. |Psi->: [[0, 1/sqrt(2)],[-1/sqrt(2), 0]], determinant = 1/2 != 0.

**Definition 3.10 (Partial Trace).** For an operator rho on H_A tensor H_B, the partial trace over B is the operator on H_A defined by: tr_B(rho) = sum_{j=1}^{dim H_B} (I_A tensor <b_j|) rho (I_A tensor |b_j>), where {|b_j>} is any orthonormal basis for H_B. The result is independent of the choice of basis.

**Proposition 3.11 (Partial Trace of Product State).** If rho = rho_A tensor rho_B, then tr_B(rho) = rho_A tr(rho_B) = rho_A (assuming rho_B has trace 1).

**Proposition 3.12 (Partial Trace of Bell State).** For |Phi+> = (|00> + |11>)/sqrt(2), the reduced density matrix on qubit A is rho_A = tr_B(|Phi+><Phi+|) = (1/2) I.
Proof strategy: |Phi+><Phi+| = (1/2)(|00><00| + |00><11| + |11><00| + |11><11|). Take tr_B: sum over <0|_B and <1|_B. <0|_B on each term: (1/2)(|0><0| + 0 + 0 + 0) from the first and fourth terms. Wait -- let us be more careful. <0|_B (|00><00|) |0>_B = |0><0|. <0|_B (|00><11|) |0>_B = |0><1| * <0|1> = 0. <0|_B (|11><00|) |0>_B = |1><0| * <1|0> = 0... this notation is getting tangled. More carefully: tr_B(|Phi+><Phi+|) = <0_B|Phi+><Phi+|0_B> + <1_B|Phi+><Phi+|1_B>. <0_B|Phi+> = (1/sqrt(2))|0_A>. <1_B|Phi+> = (1/sqrt(2))|1_A>. So tr_B = (1/2)|0><0| + (1/2)|1><1| = (1/2)I.

**Lemma 3.13 (Inner Product on Tensor Product Space).** <u_1 tensor v_1 | u_2 tensor v_2> = <u_1|u_2> <v_1|v_2>. The inner product on the tensor product space is the product of the inner products on the factor spaces.

---

### 4. Visual Assets

**VA-1: Kronecker Product Calculator**
- Type: Interactive widget
- Description: The student enters two vectors (or two matrices) and the widget computes and displays the Kronecker product. For vectors, the result is shown as a column vector with each entry labelled (e.g., u_1 * v_1, u_1 * v_2, ...). For matrices, the result is shown as a block matrix with the blocks highlighted.
- What to notice: The Kronecker product of two 2-vectors is a 4-vector. The Kronecker product of two 2x2 matrices is a 4x4 matrix. Dimension multiplies.
- Interactive controls: Inputs for two vectors (or toggle to matrices). Compute button.

**VA-2: Two-Qubit State Space Map**
- Type: Static reference diagram
- Description: A diagram showing the 2-qubit state space C^4 with the computational basis {|00>, |01>, |10>, |11>} labelled. Product states are shown as a thin "manifold" within the space (the set of rank-1 coefficient matrices). Entangled states (the rest of the space) are shaded differently. The four Bell states are marked as specific points in the entangled region.
- What to notice: Product states are a small subset. "Most" states are entangled. The Bell states are maximally entangled (as far from product states as possible).

**VA-3: Separability Tester**
- Type: Interactive widget
- Description: The student enters a 2-qubit state (4 complex amplitudes). The widget computes the coefficient matrix M = [[a,b],[c,d]], its determinant ad - bc, and reports whether the state is separable (det = 0) or entangled (det != 0). If separable, it displays the factorisation |psi> = |phi> tensor |chi>.
- What to notice: Small perturbations of a product state make it entangled (generically). The set of product states has measure zero.
- Interactive controls: Four complex amplitude inputs (with normalisation enforced). Preset buttons for |00>, |+0>, |Phi+>, etc.

**VA-4: Bell State Visualiser**
- Type: Interactive widget
- Description: The four Bell states are shown in a panel. For each, the widget displays: the state vector, the coefficient matrix (with determinant highlighted), and the reduced density matrices for qubits A and B (both equal to I/2). A bar chart shows the joint measurement probabilities in the computational basis (for |Phi+>: 50% |00>, 50% |11>, 0% |01>, 0% |10>).
- What to notice: The individual qubit states are maximally mixed (I/2), but the joint state is pure. This is the hallmark of entanglement: the whole is more determined than its parts.
- Interactive controls: Select which Bell state to examine. Toggle measurement basis (computational, Hadamard, etc.).

**VA-5: Partial Trace Step-by-Step**
- Type: Animated step-through
- Description: A 2-qubit state |psi> is entered. The widget computes |psi><psi| (a 4x4 matrix), then walks through the partial trace computation step by step: group into 2x2 blocks (corresponding to the traced-out subsystem), sum the diagonal blocks. The result rho_A is displayed as a 2x2 matrix. Its eigenvalues are shown (indicating purity: both 1/2 means maximally mixed, one eigenvalue = 1 means pure).
- What to notice: For product states, the reduced state is pure (one eigenvalue is 1). For entangled states, the reduced state is mixed (eigenvalues are between 0 and 1). The more entangled the state, the more mixed the reduced state.
- Interactive controls: State input. Toggle trace over A vs. trace over B.

**VA-6: Dimension Growth Chart**
- Type: Static diagram
- Description: A table/chart showing the state-space dimension 2^n as a function of the number of qubits n, for n = 1 to 20. Annotate: n=1 -> 2, n=2 -> 4, n=10 -> 1024, n=20 -> 1,048,576, n=50 -> ~10^{15}, n=300 -> exceeds the number of atoms in the observable universe.
- What to notice: The exponential growth of the state space is the fundamental resource of quantum computing. Classical simulation requires tracking 2^n amplitudes; this becomes impossible around n=50.

---

### 5. Worked Examples

**Example 5.1: Computing a Tensor Product of Vectors**
Compute |+> tensor |1> where |+> = (1, 1)^T / sqrt(2) and |1> = (0, 1)^T.

Step 1: |+> tensor |1> = (1/sqrt(2)) (1, 1)^T tensor (0, 1)^T.
Step 2: Kronecker product: (1*0, 1*1, 1*0, 1*1)^T / sqrt(2) = (0, 1, 0, 1)^T / sqrt(2).
Step 3: In ket notation: (0|00> + 1|01> + 0|10> + 1|11>)/sqrt(2) = (|01> + |11>)/sqrt(2).
Step 4: Verify: this is the state "qubit A is in |+>, qubit B is in |1>." Measuring qubit B always gives 1 (probability 1). Measuring qubit A gives 0 or 1 with probability 1/2 each. These are independent (product state), consistent with the separability.
Narration: This is the simplest tensor product computation. The Kronecker product is a systematic "multiply each entry of the first vector by the entire second vector" rule.

**Example 5.2: Kronecker Product of Matrices**
Compute sigma_x tensor I (applying the X gate to qubit 1 and identity to qubit 2).

Step 1: sigma_x = [[0,1],[1,0]], I = [[1,0],[0,1]].
Step 2: Kronecker product: replace each entry of sigma_x with that entry times I.
sigma_x tensor I = [[0*I, 1*I],[1*I, 0*I]] = [[0,0,1,0],[0,0,0,1],[1,0,0,0],[0,1,0,0]].
Step 3: Verify action on |01>: (sigma_x tensor I)|01> = (sigma_x|0>) tensor (I|1>) = |1> tensor |1> = |11>. Check against the matrix: column 2 (corresponding to |01>) of the result is (0,0,0,1)^T = |11>. Confirmed.
Narration: The Kronecker product of operators is how we express "apply gate A to qubit 1 and gate B to qubit 2." The CNOT gate, which will be introduced in C4, is NOT a tensor product of single-qubit gates -- that is precisely what makes it interesting (it creates entanglement).

**Example 5.3: Proving |Phi+> is Entangled**
Prove that |Phi+> = (|00> + |11>)/sqrt(2) is not a product state.

Step 1: Suppose for contradiction that |Phi+> = (alpha|0> + beta|1>) tensor (gamma|0> + delta|1>).
Step 2: Expanding: alpha gamma |00> + alpha delta |01> + beta gamma |10> + beta delta |11>.
Step 3: Match with |Phi+> = (1/sqrt(2))|00> + 0|01> + 0|10> + (1/sqrt(2))|11>: alpha gamma = 1/sqrt(2), alpha delta = 0, beta gamma = 0, beta delta = 1/sqrt(2).
Step 4: From alpha delta = 0: alpha = 0 or delta = 0. Case 1: alpha = 0. Then alpha gamma = 0, contradicting alpha gamma = 1/sqrt(2). Case 2: delta = 0. Then beta delta = 0, contradicting beta delta = 1/sqrt(2). Both cases give contradictions.
Step 5: Therefore |Phi+> is entangled.
Step 6: Alternative quick test: coefficient matrix = [[1/sqrt(2), 0],[0, 1/sqrt(2)]]. det = 1/2 != 0, confirming entanglement.
Narration: This proof by contradiction is the standard technique. The quick determinant test is equivalent but more efficient. Students should be able to do both. The physical significance: measuring qubit A of |Phi+> gives 0 or 1 with equal probability, but the outcome of qubit B is then perfectly correlated -- if A gives 0, B gives 0, and vice versa. This perfect correlation without a definite individual state is the essence of entanglement.

**Example 5.4: Partial Trace Computation**
Compute the reduced density matrix rho_A = tr_B(|Psi-><Psi-|) for |Psi-> = (|01> - |10>)/sqrt(2).

Step 1: |Psi-><Psi-| = (1/2)(|01><01| - |01><10| - |10><01| + |10><10|).
Step 2: As a 4x4 matrix with rows/columns ordered |00>, |01>, |10>, |11>: (1/2) [[0,0,0,0],[0,1,-1,0],[0,-1,1,0],[0,0,0,0]].
Step 3: Partial trace over B: divide the 4x4 matrix into 2x2 blocks (rows/columns grouped as {|00>,|01>} and {|10>,|11>}, i.e., the A-index is the block index and B-index is within-block). Top-left 2x2: [[0, 0],[0, 1]]/2. Top-right: [[0, 0],[-1, 0]]/2. Bottom-left: [[0, -1],[0, 0]]/2. Bottom-right: [[1, 0],[0, 0]]/2. Partial trace sums diagonal blocks: rho_A = [[0, 0],[0, 1]]/2 + [[1, 0],[0, 0]]/2 = [[1/2, 0],[0, 1/2]] = I/2.
Step 4: Interpretation: qubit A is maximally mixed. It has no definite state on its own. This is the signature of maximal entanglement.
Narration: The partial trace is the mathematical tool for "ignoring one subsystem." When we trace out qubit B, we get the state of qubit A. For maximally entangled states, this is always I/2 (the maximally mixed state). The purity tr(rho_A^2) = tr((I/2)^2) = 1/2, which is minimal for a qubit (purity 1 means pure, purity 1/2 means maximally mixed). This connects to the von Neumann entropy S = -tr(rho log rho) = log 2, the maximum for a qubit.

**Example 5.5: Tensor Product of Pauli Operators**
Compute sigma_z tensor sigma_z and find its eigenvalues and eigenvectors.

Step 1: sigma_z tensor sigma_z = [[1,0],[0,-1]] tensor [[1,0],[0,-1]] = [[1*sigma_z, 0],[0, -1*sigma_z]] = [[1,0,0,0],[0,-1,0,0],[0,0,-1,0],[0,0,0,1]].
Step 2: This is diagonal, so eigenvalues are the diagonal entries: +1, -1, -1, +1. Eigenvectors: |00> (eigenvalue +1), |01> (eigenvalue -1), |10> (eigenvalue -1), |11> (eigenvalue +1).
Step 3: Interpretation: sigma_z tensor sigma_z measures the parity of two qubits. Eigenvalue +1 means both qubits are the same (|00> or |11>); eigenvalue -1 means they are different (|01> or |10>). The Bell states |Phi+/-> are eigenstates of sigma_z tensor sigma_z with eigenvalue +1; |Psi+/-> have eigenvalue -1.
Narration: Two-qubit operators that are tensor products of single-qubit operators have eigenvalues that are products of the individual eigenvalues. The eigenvectors are tensor products of the individual eigenvectors. This is a consequence of Proposition 3.4(i). However, multi-qubit observables like the CNOT Hamiltonian are NOT tensor products -- that is what makes multi-qubit physics richer than single-qubit physics.

---

### 6. Common Confusions

**CC-1: Tensor product vs. Cartesian product vs. direct sum.**
Wrong model: Students confuse |u> tensor |v> (a single vector in a higher-dimensional space) with (|u>, |v>) (a pair of vectors) or |u> + |v> (direct sum, not a product at all).
Why tempting: All three are ways of "combining" two objects. In ordinary (non-quantum) probability, the joint distribution of independent variables is the product of marginals, which resembles both the tensor product and the Cartesian product.
Corrective argument: The Cartesian product C^2 x C^2 has dimension 2+2=4 as a real space but describes only product states. The tensor product C^2 tensor C^2 has dimension 2*2=4 as a complex space and can describe entangled states. The direct sum C^2 + C^2 has dimension 4 but represents "qubit A OR qubit B" (a particle that is either in system A or system B), not "qubit A AND qubit B." The tensor product is the correct construction for composite systems.

**CC-2: Thinking most states are separable.**
Wrong model: Students assume entanglement is rare or special.
Why tempting: Product states are easy to write down and construct, so they feel like the default.
Corrective argument: The set of product states in C^2 tensor C^2 = C^4 is a 4-real-dimensional manifold inside a 6-real-dimensional space (after normalisation and removing global phase). Almost every state is entangled. Entanglement is the rule; separability is the exception.

**CC-3: Confusing the tensor product with entry-wise multiplication.**
Wrong model: Students compute (a, b)^T tensor (c, d)^T as (ac, bd)^T (the Hadamard/entry-wise product).
Why tempting: "Multiply things together" is ambiguous, and entry-wise is the simplest interpretation.
Corrective argument: The tensor product of two 2-vectors is a 4-vector, not a 2-vector. The Kronecker product systematically pairs every entry of the first vector with every entry of the second. Entry-wise multiplication keeps the same dimension; the tensor product multiplies dimensions.

**CC-4: Ordering ambiguity in the computational basis.**
Wrong model: Students are confused about whether |01> means "qubit 1 is 0, qubit 2 is 1" or vice versa, and whether it corresponds to column index 1 or 2 of the Kronecker product.
Why tempting: Different textbooks use different conventions (big-endian vs. little-endian). Qiskit (IBM) uses little-endian; most textbooks use big-endian.
Corrective argument: This course uses the big-endian convention: |x_1 x_2 ... x_n> means qubit 1 is x_1, qubit 2 is x_2, etc. The corresponding column index in the matrix representation is x = sum x_i 2^{n-i}. So |01> is column 1 (0-indexed), |10> is column 2. Be consistent and explicit. When using software (Qiskit, Cirq), check their convention.

**CC-5: "The partial trace loses information."**
Wrong model: Students think the partial trace is a lossy operation that makes everything mixed, and are confused when a product state remains pure after partial trace.
Why tempting: The partial trace "throws away" a subsystem, which sounds destructive.
Corrective argument: The partial trace discards information about the traced-out subsystem AND about correlations between the two subsystems. For product states, there are no correlations, so tracing out one subsystem leaves the other in a pure state. For entangled states, the correlations are what make the individual subsystems mixed. The amount of entanglement is quantified by how mixed the reduced state is (von Neumann entropy of the reduced density matrix).

---

### 7. Cross-References

**Backward references:**
- A1-A4: All previous math (complex numbers, inner products, matrices, spectral decomposition) is used.
- C1: Qubits are vectors in C^2; the tensor product gives multi-qubit state spaces.
- C2: Measurement of a single qubit in a multi-qubit system is measurement with respect to a tensor-product observable.
- C3: Single-qubit gates (Pauli, Hadamard, phase) are applied to multi-qubit systems via tensor products.
- P4: Spin-1/2 systems (described by Pauli operators) are the physical instantiation of qubits; two spins -> tensor product.

**Forward references within Track A:**
- A6: The Born rule for composite systems requires tensor-product observables and the spectral decomposition on the tensor-product space.

**Forward references to Track P:**
- P5: The uncertainty principle for observables on composite systems.
- P6: Bell's theorem and the CHSH inequality directly use the Bell states and entanglement from this lesson. The CHSH observable is a sum of tensor-product operators.

**Forward references to Track C:**
- C4: Multi-qubit gates (CNOT, Toffoli) act on the tensor-product space. The CNOT creates entanglement from product states.
- C5: Universal gate sets must be able to approximate any unitary on the tensor-product space.
- C6: Deutsch-Jozsa uses multi-qubit entanglement.
- C7: Teleportation uses Bell states (defined here) as a resource.
- C8: Grover's algorithm operates on n-qubit tensor product states.
- C9, C10: QFT and Shor's algorithm operate on multi-qubit registers.

---

### 8. Historical Notes

- The **tensor product** as a mathematical construction was developed by **Hassler Whitney** (1938) and **Bourbaki** in the algebraic context, but its use in physics predates the formal definition. **Dirac** (1930) and **von Neumann** (1932) used it to describe composite quantum systems without naming it as such.
- **Entanglement** (Verschrankung) was named and analysed by **Erwin Schrodinger** in 1935, in response to the **Einstein-Podolsky-Rosen (EPR)** paper (1935), which argued that quantum mechanics was incomplete because of the "spooky action at a distance" implied by entangled states. Schrodinger called entanglement "the characteristic trait of quantum mechanics, the one that enforces its entire departure from classical lines of thought."
- The **Bell states** are named for **John Stewart Bell** (1964), who showed that no local hidden variable theory can reproduce quantum mechanical predictions for entangled states. The specific states |Phi+/-> and |Psi+/-> were already known; Bell's contribution was showing their profound physical significance.
- The **partial trace** was formalised in the density-matrix framework by **von Neumann** (1932) and further developed by **Landau** and **Lifshitz** in the context of statistical mechanics.
- The exponential growth of the tensor product space (2^n for n qubits) was first highlighted as a computational resource by **Richard Feynman** (1982), who argued that simulating quantum physics requires a quantum computer precisely because classical computers cannot efficiently represent states in exponentially large spaces.

---

### 9. Problem Set

**Problem A5.1 [Easy]**
Compute |0> tensor |+> where |+> = (|0> + |1>)/sqrt(2). Express the result in the computational basis.
Solution sketch: |0> tensor |+> = |0> tensor (|0>+|1>)/sqrt(2) = (|00>+|01>)/sqrt(2). As a vector: (1,1,0,0)^T/sqrt(2).

**Problem A5.2 [Easy]**
Compute the Kronecker product H tensor I where H = (1/sqrt(2))[[1,1],[1,-1]] is the Hadamard gate.
Solution sketch: 4x4 matrix: (1/sqrt(2))[[1,0,1,0],[0,1,0,1],[1,0,-1,0],[0,1,0,-1]].

**Problem A5.3 [Easy]**
Verify that the four Bell states are orthonormal (compute all 6 inner products between distinct pairs and verify they are 0, and verify each has norm 1).
Solution sketch: <Phi+|Phi-> = (1/2)(<00|+<11|)(|00>-|11>) = (1/2)(1-1) = 0. Similarly for other pairs. Each has norm 1 by construction.

**Problem A5.4 [Medium]**
Determine whether the state |psi> = (1/2)(|00> + |01> + |10> + |11>) is separable or entangled. If separable, find the factorisation.
Solution sketch: Coefficient matrix M = (1/2)[[1,1],[1,1]]. det(M) = (1/4)(1-1) = 0. Rank 1, so separable. M = (1/2)(1,1)^T(1,1) = |+>|+> (unnormalised: each factor has norm sqrt(2)/2... actually |psi> = (1/2)(|0>+|1>)(|0>+|1>) = |+>|+>). Verified: |+> = (1/sqrt(2))(1,1)^T, so |+>|+> has each amplitude 1/2. Confirmed.

**Problem A5.5 [Medium]**
Prove that |Psi-> = (|01> - |10>)/sqrt(2) is entangled using the determinant test.
Solution sketch: Coefficient matrix = [[0, 1/sqrt(2)],[-1/sqrt(2), 0]]. det = 0 - (-1/2) = 1/2 != 0. Entangled.

**Problem A5.6 [Medium]**
Show that (A tensor I)|phi+> = (I tensor A^T)|Phi+> for any 2x2 matrix A, where |Phi+> = (|00>+|11>)/sqrt(2). (This is the "transpose trick," or "ricochet" property of maximally entangled states.)
Solution sketch: (A tensor I)|Phi+> = (1/sqrt(2))(A|0> tensor |0> + A|1> tensor |1>) = (1/sqrt(2)) sum_j (A|j> tensor |j>). On the other hand, (I tensor A^T)|Phi+> = (1/sqrt(2)) sum_j (|j> tensor A^T|j>). Write A|j> = sum_k A_{kj}|k> and A^T|j> = sum_k A_{jk}|k> = sum_k A_{kj}^T... need care with indices. The identity follows from sum_j A_{kj} |k>|j> = sum_j |j> sum_k A^T_{jk}|k> after relabelling.

**Problem A5.7 [Medium]**
Compute the partial trace tr_B(|01><10|). (This is an off-diagonal term, not a density matrix by itself.)
Solution sketch: tr_B(|01><10|) = <0_B|01><10|0_B> + <1_B|01><10|1_B>. First term: <0|(|1>) * (<0|) (<1|0>) = 0 (since <1|0> = 0). Second term: <1|(|1>) * (<0|) (<1|1>)... more carefully: |01> = |0>_A|1>_B, so <j_B|01> = |0>_A <j|1>_B. For j=0: 0. For j=1: |0>_A. Similarly, <10|j_B> = <1|_A <0|j>_B. For j=0: <1|_A. For j=1: 0. So tr_B(|01><10|) = |0><1| * <1|1><0|0> = |0><1| (from j=1 and j=0... let me redo). tr_B(|01><10|) = sum_j (<j|_B) (|0>_A|1>_B)(<1|_A<0|_B) (|j>_B) = sum_j |0><1| <j|1><0|j>. For j=0: <0|1><0|0> = 0*1 = 0. For j=1: <1|1><0|1> = 1*0 = 0. So tr_B(|01><10|) = 0.

**Problem A5.8 [Hard]**
For a general 2-qubit pure state |psi> = a|00> + b|01> + c|10> + d|11>, compute the reduced density matrix rho_A = tr_B(|psi><psi|) in terms of a, b, c, d. Show that rho_A is pure if and only if |psi> is separable.
Solution sketch: rho_A = [[ |a|^2+|b|^2, ac*+bd* ],[ a*c+b*d, |c|^2+|d|^2 ]]. rho_A is pure iff rho_A^2 = rho_A, iff det(rho_A) = 0. det(rho_A) = (|a|^2+|b|^2)(|c|^2+|d|^2) - |ac*+bd*|^2. By Cauchy-Schwarz on C^2 vectors (a,b) and (c,d): this is >= 0 with equality iff (a,b) and (c,d) are proportional, i.e., the coefficient matrix [[a,b],[c,d]] has rank <= 1, i.e., the state is separable.

**Problem A5.9 [Hard]**
Show that the CNOT gate, defined by CNOT|00> = |00>, CNOT|01> = |01>, CNOT|10> = |11>, CNOT|11> = |10>, cannot be written as a tensor product of two single-qubit gates.
Solution sketch: If CNOT = A tensor B, then CNOT(|0> tensor |0>) = (A|0>) tensor (B|0>) and CNOT(|1> tensor |0>) = (A|1>) tensor (B|0>). From the CNOT truth table: CNOT|00> = |00> and CNOT|10> = |11>. So (A|0>) tensor (B|0>) = |00> and (A|1>) tensor (B|0>) = |11>. From the first: A|0> = alpha|0>, B|0> = (1/alpha)|0> for some alpha. From the second: A|1> = beta|1>, B|0> = (1/beta)|1>. But B|0> cannot be both proportional to |0> and proportional to |1> (unless |0> = |1>, which is false). Contradiction. CNOT is not a tensor product.

**Problem A5.10 [Hard]**
(Preview) The state |GHZ> = (|000> + |111>)/sqrt(2) is a 3-qubit state. Show it is not separable across any bipartition (i.e., it cannot be written as |a>_A tensor |bc>_{BC} for any single-qubit |a> and 2-qubit |bc>, and similarly for other bipartitions). Compute the reduced density matrix on qubit A.
Solution sketch: Bipartition A|BC: coefficient matrix (rows indexed by A, columns by BC) is (1/sqrt(2))[[1,0,0,0],[0,0,0,1]]. This is a 2x4 matrix; it has rank 2 (the two rows are linearly independent), so the state is not a product across A|BC. Similarly for other bipartitions. rho_A = tr_{BC}(|GHZ><GHZ|) = (1/2)(|0><0| + |1><1|) = I/2. Maximally mixed.

---

### 10. Simulator Dependencies

The separability tester (VA-3) and partial trace widget (VA-5) require numerical linear algebra for density matrices. The Bell state visualiser (VA-4) can optionally interface with the quantum circuit simulator to show how Bell states are prepared (a Hadamard followed by CNOT -- forward-ref C4). If the circuit simulator from `simulator-spec.md` is available, VA-4 should include a "prepare this state" button that opens the circuit simulator with the appropriate circuit.

---

### 11. Estimates

- **Word count target:** 5,000 -- 6,000 words
- **Student time:** 120 -- 150 minutes
- **Development time:** 18 -- 22 hours (writing + widget development + review)

---

### 12. Page Splits

Recommended split into two pages:

- **Page A5a: Tensor Products, Kronecker Products, and the Computational Basis** (Stages 1-4, Definitions 3.1-3.5, Proposition 3.4, Lemma 3.13, VA-1, VA-6, Examples 5.1, 5.2, Problems A5.1-A5.3)
- **Page A5b: Entanglement, Bell States, and the Partial Trace** (Stages 5-7, Definitions 3.6-3.8, Proposition 3.7, Theorems 3.9, Definitions 3.10-3.12, VA-2, VA-3, VA-4, VA-5, Examples 5.3-5.5, Problems A5.4-A5.10)

Rationale: The first page covers the algebraic mechanics (how to compute tensor products). The second page covers the conceptual core (entanglement and its consequences). Students need fluency with the mechanics before they can appreciate the concept.

---

## A6 -- Probability and the Born Rule

**Position in canonical order:** 16 of 23
**Prerequisites:** A1-A5 (complete math track), P1-P6, C1-C4 (students have seen measurement informally, Bell inequalities, and multi-qubit systems)
**Unlocks:** C5 (universal gates), C6 (Deutsch-Jozsa), C7 (teleportation)
**Note on timing:** A6 is the capstone of the math track. By this point students have used the Born rule informally many times (in C2, P2, P4, P6). This lesson provides the rigorous mathematical treatment, ties it to the spectral theorem, and introduces Gleason's theorem as a deep justification for why the Born rule has the form it does.

---

### 1. Learning Objectives

By the end of this lesson the student will be able to:

1. State the axioms of probability theory (Kolmogorov axioms) and verify that the Born rule satisfies them.
2. State the Born rule in both its forms: (a) P(a_i) = |<e_i|psi>|^2 for measuring observable A = sum lambda_i |e_i><e_i| in state |psi>; (b) <A> = <psi|A|psi> for the expectation value.
3. Derive the expectation-value form <A> = <psi|A|psi> from the probability form P(a_i) = |<e_i|psi>|^2, and vice versa.
4. Compute measurement probabilities, expectation values, and variances for observables on single-qubit and multi-qubit systems.
5. State the generalised Born rule for degenerate eigenvalues: P(lambda) = <psi|P_lambda|psi> = tr(P_lambda |psi><psi|) where P_lambda is the projector onto the eigenspace.
6. Explain the post-measurement state (state collapse / projection postulate): after obtaining outcome lambda_i, the state becomes P_i|psi>/||P_i|psi>||.
7. State the key idea of Gleason's theorem: any probability measure on the closed subspaces of a Hilbert space of dimension >= 3 must have the form P(P) = tr(rho P) for some density operator rho. Explain why this forces the Born rule.
8. Define POVMs (positive operator-valued measures) as a generalisation of projective measurements, and give an example.
9. Compute probabilities for measurements on composite systems, including the probability of a measurement on one subsystem only (using the partial trace / reduced density matrix from A5).
10. Verify the no-signalling property: local measurements on one part of an entangled system cannot change the probability distribution seen by the other part.

---

### 2. Intuition-Building Arc

**Stage 1 -- Classical Probability Review (algebraic + conceptual).** Briefly review: sample space, events, probability measure, random variables, expectation, variance. A probability distribution on {1, ..., n} is a vector p = (p_1, ..., p_n) with p_i >= 0 and sum p_i = 1. The expectation of a random variable X with values x_i is E[X] = sum p_i x_i. The variance is Var(X) = E[X^2] - (E[X])^2. This review is fast but ensures all students have the same foundation.

Rationale: some students may have strong probability backgrounds; others may be rusty. A quick review levels the playing field and establishes notation.

**Stage 2 -- From Inner Products to Probabilities: The Born Rule (algebraic + physical).** Recall the measurement postulate (introduced in P2, used in C2): measuring observable A on state |psi> yields outcome a_i with probability P(a_i) = |<e_i|psi>|^2, where A = sum a_i |e_i><e_i| is the spectral decomposition. Verify that this is a valid probability distribution: (a) |<e_i|psi>|^2 >= 0 (trivially); (b) sum_i |<e_i|psi>|^2 = sum_i <psi|e_i><e_i|psi> = <psi| (sum_i |e_i><e_i|) |psi> = <psi|I|psi> = <psi|psi> = 1 (using completeness and normalisation). The Born rule is not derived from more fundamental axioms in standard quantum mechanics -- it is a postulate. But Gleason's theorem (Stage 6) shows it is essentially the unique rule consistent with the Hilbert-space structure.

**Stage 3 -- Expectation Values and the Trace Formula (algebraic).** Derive the expectation value: <A> = sum_i a_i P(a_i) = sum_i a_i |<e_i|psi>|^2 = sum_i a_i <psi|e_i><e_i|psi> = <psi| (sum_i a_i |e_i><e_i|) |psi> = <psi|A|psi>. This is the "sandwich" formula. For density matrices (mixed states): <A> = tr(rho A), where rho = |psi><psi| for a pure state. Verify: tr(|psi><psi| A) = <psi|A|psi> (using the cyclic property of the trace). The trace formula generalises naturally to mixed states and is the standard form used in quantum information theory.

**Stage 4 -- Variance and the Uncertainty Connection (algebraic + physical).** Define the variance: Var(A) = <A^2> - <A>^2 = <psi|A^2|psi> - (<psi|A|psi>)^2. Equivalently, Var(A) = <psi|(A - <A>I)^2|psi> = ||(A - <A>I)|psi>||^2. The variance is zero iff |psi> is an eigenvector of A (measurement outcome is certain). Connect to the uncertainty principle (P5): for two non-commuting observables A and B, Var(A)Var(B) >= |<[A,B]>|^2 / 4. The Born rule provides the probabilities; the commutator structure provides the trade-off.

**Stage 5 -- Degenerate Eigenvalues and Projectors (algebraic + physical).** When eigenvalue lambda is degenerate (eigenspace dimension > 1), the probability is P(lambda) = sum_{i: a_i = lambda} |<e_i|psi>|^2 = <psi|P_lambda|psi> = tr(P_lambda |psi><psi|), where P_lambda = sum_{i: a_i = lambda} |e_i><e_i| is the projector onto the eigenspace. The post-measurement state is P_lambda|psi> / ||P_lambda|psi>||, which is in the eigenspace but otherwise undetermined (Luders' rule). This is important for multi-qubit systems where observables acting on one qubit are highly degenerate when viewed as operators on the full system.

**Stage 6 -- Gleason's Theorem: Why the Born Rule? (logical + conceptual).** State Gleason's theorem (1957): Let H be a Hilbert space of dimension d >= 3. If mu is a function from the set of 1-dimensional projectors on H to [0, 1] such that (a) mu(P) >= 0 for all projectors P, and (b) sum mu(P_i) = 1 whenever {P_i} is a complete set of orthogonal rank-1 projectors, then there exists a density operator rho such that mu(P) = tr(rho P) for all P.

Key idea of the proof: the constraint that probabilities must be "additive over orthogonal decompositions" is extremely restrictive. In dimension 1 or 2, there are non-Born-rule probability assignments (in dimension 1 trivially so; in dimension 2, any function on the unit circle satisfying the constraint on antipodal points would work). In dimension >= 3, the unit sphere is "connected enough" that the constraint forces mu to be quadratic in the state vector, which is the Born rule. The proof uses the fact that in R^3 (or C^d for d >= 3), every rotation can be written as a product of rotations that fix a given axis -- this "rigidity" of the rotation group forces the probability measure to be determined by a density matrix.

Why it matters: Gleason's theorem tells us that the Born rule is not an arbitrary choice. If we accept that quantum states live in a Hilbert space and that measurement outcomes correspond to orthogonal subspaces, then the Born rule is the ONLY consistent way to assign probabilities. This is a deep structural result that grounds quantum mechanics in the geometry of Hilbert space.

Rationale: Gleason's theorem is too advanced to prove fully in this course, but its statement and key idea are accessible and profoundly important. It provides the conceptual closure for the math track: the Born rule is forced by the inner-product structure of Hilbert space.

**Stage 7 -- POVMs: Beyond Projective Measurement (algebraic + physical).** Briefly introduce POVMs (positive operator-valued measures). A POVM is a set of positive semidefinite operators {E_i} such that sum E_i = I. The probability of outcome i is P(i) = tr(rho E_i). Projective measurements are the special case where E_i = P_i (projectors). POVMs arise when performing indirect measurements, measurements on subsystems, or when the measurement apparatus has noise. Example: the "trine POVM" on a qubit, with three operators E_k = (2/3)|phi_k><phi_k| where |phi_k> are three equally-spaced states on the equator of the Bloch sphere. This POVM can distinguish three non-orthogonal states better than any projective measurement.

**Stage 8 -- Measurements on Composite Systems and No-Signalling (physical + algebraic).** When measuring observable A_A tensor I_B on a bipartite state |psi>_{AB}, the measurement acts only on system A. The probabilities are P(a_i) = tr(P_i^A tensor I_B |psi><psi|) = tr_A(P_i^A rho_A), where rho_A = tr_B(|psi><psi|) is the reduced density matrix from A5. Key consequence: the outcome probabilities for measurements on A depend only on rho_A, which is determined by the state of A alone (after tracing out B). This means that nothing done to system B (including measurement) can change the statistics of measurements on A. This is the no-signalling theorem, and it is essential for the consistency of quantum mechanics with special relativity.

---

### 3. Theorems, Definitions & Lemmas

**Definition 3.1 (Probability Measure -- Kolmogorov).** A probability measure on a finite set Omega = {1, ..., n} is a function P: 2^Omega -> [0, 1] such that (i) P(Omega) = 1; (ii) P(A union B) = P(A) + P(B) for disjoint A, B.

**Definition 3.2 (Expectation and Variance).** For a random variable X on Omega with probability measure P: E[X] = sum_i X(i) P(i). Var(X) = E[X^2] - (E[X])^2 = E[(X - E[X])^2].

**Theorem 3.3 (Born Rule -- Projective Measurement).** Let A = sum_{i=1}^n a_i |e_i><e_i| be a Hermitian operator (observable) with spectral decomposition, and let |psi> be a normalised state. Then:
(a) The probability of obtaining outcome a_i is P(a_i) = |<e_i|psi>|^2 = <psi|P_i|psi>, where P_i = |e_i><e_i|.
(b) The post-measurement state (given outcome a_i) is |e_i>.
(c) The expectation value is <A>_psi = <psi|A|psi>.

**Proposition 3.4 (Born Rule is a Valid Probability Distribution).** The probabilities {P(a_i)} satisfy P(a_i) >= 0 and sum_i P(a_i) = 1.
Proof strategy: P(a_i) = |<e_i|psi>|^2 >= 0 (squared modulus). sum_i P(a_i) = sum_i <psi|e_i><e_i|psi> = <psi|(sum_i |e_i><e_i|)|psi> = <psi|I|psi> = 1 (using completeness relation and normalisation).

**Theorem 3.5 (Expectation Value Formula).** <A>_psi = <psi|A|psi> = sum_i a_i |<e_i|psi>|^2.
Proof strategy: <psi|A|psi> = <psi|(sum_i a_i |e_i><e_i|)|psi> = sum_i a_i <psi|e_i><e_i|psi> = sum_i a_i |<e_i|psi>|^2.

**Theorem 3.6 (Variance Formula).** Var_psi(A) = <psi|A^2|psi> - (<psi|A|psi>)^2 = <psi|(A - <A>I)^2|psi>.
Proof strategy: Define Delta_A = A - <A>I. Then <(Delta_A)^2> = <A^2 - 2<A>A + <A>^2 I> = <A^2> - 2<A><A> + <A>^2 = <A^2> - <A>^2.

**Theorem 3.7 (Born Rule for Degenerate Eigenvalues / Luders' Rule).** If eigenvalue lambda has eigenspace V_lambda with projector P_lambda = sum_{i: a_i = lambda} |e_i><e_i|, then:
(a) P(lambda) = <psi|P_lambda|psi> = ||P_lambda|psi>||^2.
(b) Post-measurement state: |psi'> = P_lambda|psi> / ||P_lambda|psi>||.

**Theorem 3.8 (Trace Form of Born Rule).** For a density operator rho (rho >= 0, tr(rho) = 1), the probability of outcome a_i is P(a_i) = tr(P_i rho) and the expectation value is <A> = tr(rho A).
Proof strategy: For a pure state rho = |psi><psi|: tr(P_i |psi><psi|) = <psi|P_i|psi> = |<e_i|psi>|^2 (using tr(|u><v|) = <v|u>). And tr(|psi><psi| A) = <psi|A|psi>. For mixed states rho = sum_k p_k |psi_k><psi_k|, linearity of the trace gives the weighted average, which is the correct classical mixture of quantum probabilities.

**Theorem 3.9 (Gleason's Theorem -- Statement).** Let H be a complex Hilbert space with dim(H) >= 3. Let mu: {rank-1 projectors on H} -> [0, 1] satisfy: for every orthonormal basis {|e_i>} of H, sum_i mu(|e_i><e_i|) = 1. Then there exists a unique density operator rho (positive semidefinite, trace 1) such that mu(|e><e|) = <e|rho|e> = tr(rho |e><e|) for all unit vectors |e>.
Proof strategy (sketch of key idea only): (a) mu defines a function f on the unit sphere S in H: f(|v>) = mu(|v><v|). (b) The constraint sum mu(P_i) = 1 for orthogonal decompositions means f is "frame-additive." (c) In dimension >= 3, the unit sphere is sufficiently connected that frame-additivity forces f to be a quadratic form: f(|v>) = <v|rho|v> for some Hermitian rho. (d) The non-negativity mu >= 0 forces rho >= 0, and the normalisation forces tr(rho) = 1. The critical step (c) is where dimension >= 3 is needed. In dimension 2, the unit sphere S^3 has orthogonal pairs but not enough "interlocking" constraints; there are non-quadratic frame-additive functions. In dimension >= 3, any two orthogonal decompositions are connected by a chain of decompositions sharing elements, which forces linearity and hence quadraticity.

**Definition 3.10 (POVM -- Positive Operator-Valued Measure).** A POVM on a Hilbert space H is a set of positive semidefinite operators {E_1, ..., E_m} (called effects or POVM elements) satisfying sum_{i=1}^m E_i = I. The probability of outcome i when the state is rho is P(i) = tr(rho E_i). A projective measurement is the special case where each E_i is a projector (E_i^2 = E_i).

**Theorem 3.11 (No-Signalling).** For a bipartite state rho_{AB}, the probability distribution of measurements on A is determined solely by the reduced state rho_A = tr_B(rho_{AB}), regardless of what measurement (if any) is performed on B.
Proof strategy: Let {E_i^A} be a POVM on A. The probability of outcome i on A is P(i) = tr_{AB}((E_i^A tensor I_B) rho_{AB}) = tr_A(E_i^A tr_B(rho_{AB})) = tr_A(E_i^A rho_A). This depends only on rho_A. Now suppose Bob performs a measurement on B with outcomes j, obtaining post-measurement states. Alice's marginal distribution is sum_j P(i, j) = P(i) regardless of Bob's choice of measurement. This is because tr_B does not depend on Bob's measurement basis.

---

### 4. Visual Assets

**VA-1: Born Rule Probability Calculator**
- Type: Interactive widget
- Description: The student enters a normalised state |psi> (2 or 3 complex amplitudes for a qubit or qutrit) and selects an observable from a menu (sigma_x, sigma_y, sigma_z, custom Hermitian). The widget computes the spectral decomposition of the observable, the measurement probabilities |<e_i|psi>|^2, the expectation value <A>, and the variance. Results are displayed as a bar chart (probabilities), a number line (expectation value marked among eigenvalues), and numerical values.
- What to notice: The probabilities always sum to 1. The expectation value always lies between the smallest and largest eigenvalue. The variance is zero when the state is an eigenstate.
- Interactive controls: State input, observable selector, "compute" button.

**VA-2: Expectation Value on the Bloch Sphere**
- Type: Interactive 3D widget
- Description: A qubit state |psi> is shown as a point on the Bloch sphere. An observable A = n . sigma (parameterised by a unit vector n = (n_x, n_y, n_z)) is shown as an axis through the sphere. The expectation value <A> = n . r (where r is the Bloch vector of |psi>) is displayed. The eigenvalues (+1, -1) are marked at the poles of the axis, and the probabilities P(+1), P(-1) are visualised as the "fraction of the way" the Bloch vector projects onto the axis.
- What to notice: <A> = cos(theta) where theta is the angle between the Bloch vector and the measurement axis. This is the geometric content of the Born rule for qubits. P(+1) = cos^2(theta/2), P(-1) = sin^2(theta/2).
- Interactive controls: Drag |psi> on the Bloch sphere. Drag the measurement axis (or select from presets: X, Y, Z).

**VA-3: Measurement Simulation**
- Type: Interactive simulator
- Description: A quantum state |psi> and an observable A are specified. The widget "performs" the measurement N times (using random sampling according to the Born rule probabilities). A histogram of outcomes is built up in real time. As N increases, the histogram converges to the theoretical probabilities. The running average converges to <A>.
- What to notice: Individual measurement outcomes are random and unpredictable. The statistical pattern emerges only after many trials. The convergence illustrates the law of large numbers applied to quantum measurements.
- Interactive controls: State and observable inputs. "Measure once" button, "measure N times" button (with N slider from 1 to 10000), "reset" button.

**VA-4: Gleason's Theorem Visualiser (Conceptual)**
- Type: Static/animated diagram
- Description: In R^3 (representing a real 3-dimensional Hilbert space for visualisation), show the unit sphere. Pick a point on the sphere (representing a rank-1 projector). Show several orthogonal triads (sets of 3 mutually perpendicular axes) that include this point. The constraint is that the "probability values" at the three axes of each triad must sum to 1. Animate moving through different triads to show how the constraints "propagate" across the sphere, forcing the function to be quadratic. Contrast with the 2D case (a circle), where orthogonal pairs leave more freedom.
- What to notice: In 3D, the interlocking constraints from different orthogonal triads force the probability function to be smooth and quadratic. This is Gleason's theorem in a nutshell. In 2D, there is not enough interlocking.
- Interactive controls: Click a point on the sphere to see all triads through that point. Toggle between 2D (circle) and 3D (sphere) to see the difference in constraint strength.

**VA-5: POVM Example: The Trine Measurement**
- Type: Interactive widget
- Description: Three POVM elements E_k = (2/3)|phi_k><phi_k| are shown, where |phi_k> are three states separated by 120 degrees on the equator of the Bloch sphere. The student enters a qubit state |psi>. The widget computes P(k) = tr(E_k |psi><psi|) = (2/3)|<phi_k|psi>|^2 for each k, and displays the three probabilities. Verify sum P(k) = 1.
- What to notice: The three outcomes do not correspond to orthogonal projections. This is a fundamentally non-projective measurement. It is useful for distinguishing three non-orthogonal states (which is impossible with a 2-outcome projective measurement).
- Interactive controls: State |psi> input (drag on Bloch sphere). Display of the three POVM axes and probabilities.

**VA-6: No-Signalling Demonstration**
- Type: Interactive widget
- Description: A two-qubit entangled state (e.g., |Phi+>) is prepared. The widget allows Alice (qubit A) and Bob (qubit B) to independently choose measurement bases. Alice's measurement outcome probabilities are displayed before and after Bob's measurement. They are identical, demonstrating no-signalling.
- What to notice: Bob's choice of measurement basis does not affect Alice's outcome probabilities. This is true even for maximally entangled states. Quantum entanglement cannot be used for faster-than-light communication.
- Interactive controls: State input (preset entangled states). Alice's measurement basis selector. Bob's measurement basis selector. Display of Alice's probabilities, Bob's probabilities, and joint probabilities.

---

### 5. Worked Examples

**Example 5.1: Born Rule for sigma_x Measurement**
A qubit is in state |psi> = |0>. Compute the probabilities and expectation value for a measurement of sigma_x.

Step 1: Spectral decomposition of sigma_x: sigma_x = (+1)|+><+| + (-1)|-><-|, where |+> = (|0>+|1>)/sqrt(2), |-> = (|0>-|1>)/sqrt(2).
Step 2: Probabilities: P(+1) = |<+|0>|^2 = |1/sqrt(2)|^2 = 1/2. P(-1) = |<-|0>|^2 = |1/sqrt(2)|^2 = 1/2.
Step 3: Expectation: <sigma_x> = (+1)(1/2) + (-1)(1/2) = 0.
Step 4: Verify via sandwich formula: <0|sigma_x|0> = <0|[[0,1],[1,0]]|0> = <0|(0,1)^T> = 0. Confirmed.
Step 5: Variance: <sigma_x^2> = <0|I|0> = 1 (since sigma_x^2 = I). Var = 1 - 0^2 = 1. Maximum variance: the outcome is completely uncertain.
Narration: Measuring sigma_x on |0> gives a 50-50 outcome because |0> is an equal superposition of the sigma_x eigenstates. This is the quantum analogue of a fair coin flip. The zero expectation and maximum variance reflect complete uncertainty about the sigma_x measurement outcome.

**Example 5.2: Variance Computation and the Uncertainty Relation**
A qubit is in state |psi> = cos(theta/2)|0> + sin(theta/2)|1>. Compute Var(sigma_z) and Var(sigma_x) and verify the uncertainty relation Var(sigma_z) Var(sigma_x) >= |<[sigma_z, sigma_x]>|^2 / 4.

Step 1: <sigma_z> = cos^2(theta/2) - sin^2(theta/2) = cos(theta). <sigma_z^2> = 1. Var(sigma_z) = 1 - cos^2(theta) = sin^2(theta).
Step 2: <sigma_x> = <psi|sigma_x|psi>. sigma_x|psi> = cos(theta/2)|1> + sin(theta/2)|0> = sin(theta/2)|0> + cos(theta/2)|1>. <psi|sigma_x|psi> = cos(theta/2)sin(theta/2) + sin(theta/2)cos(theta/2) = 2 sin(theta/2)cos(theta/2) = sin(theta). <sigma_x^2> = 1. Var(sigma_x) = 1 - sin^2(theta) = cos^2(theta).
Step 3: Product: Var(sigma_z) Var(sigma_x) = sin^2(theta) cos^2(theta).
Step 4: [sigma_z, sigma_x] = -2i sigma_y. <sigma_y> = <psi|sigma_y|psi>. For this real-amplitude state, <sigma_y> = 0 (since sigma_y introduces imaginary components that cancel with the real bra). So |<[sigma_z, sigma_x]>|^2 / 4 = |(-2i)(0)|^2 / 4 = 0.
Step 5: The uncertainty relation gives Var(sigma_z) Var(sigma_x) >= 0, which is trivially satisfied. This is a weakness of the Robertson uncertainty relation for particular states -- the bound can be trivial. The more general Schrodinger uncertainty relation gives a tighter bound involving the anticommutator.
Narration: This example shows that the uncertainty relation is a consequence of the Born rule and the commutator structure, not a separate postulate. It also shows that the Robertson bound can be trivial for specific states; the Schrodinger bound (involving both commutator and anticommutator) is generically tighter.

**Example 5.3: Degenerate Measurement on Two Qubits**
The operator sigma_z tensor I (measuring the Z-component of qubit A only) acts on the 2-qubit state |Phi+> = (|00> + |11>)/sqrt(2). Compute the measurement probabilities and post-measurement states.

Step 1: sigma_z tensor I = [[1,0,0,0],[0,1,0,0],[0,0,-1,0],[0,0,0,-1]]. Eigenvalue +1 has eigenspace span{|00>, |01>} with projector P_+ = |00><00| + |01><01|. Eigenvalue -1 has eigenspace span{|10>, |11>} with projector P_- = |10><10| + |11><11|.
Step 2: P(+1) = ||P_+|Phi+>||^2. P_+|Phi+> = (1/sqrt(2))|00> (since P_+ kills the |11> component). ||P_+|Phi+>||^2 = 1/2. P(-1) = ||P_-|Phi+>||^2 = 1/2 similarly.
Step 3: Post-measurement states. For outcome +1: P_+|Phi+>/||P_+|Phi+>|| = (1/sqrt(2))|00> / (1/sqrt(2)) = |00>. For outcome -1: |11>. After measuring qubit A of |Phi+>, the system collapses to either |00> or |11>, each with probability 1/2. Qubit B's state is now determined (0 or 1, correlated with A's outcome).
Narration: This example illustrates how measurement of one qubit of an entangled pair "collapses" both qubits. Before measurement, neither qubit has a definite value. After measurement, both have definite values that are perfectly correlated. This is the mechanism behind quantum teleportation (C7) and the source of the "spookiness" in the EPR argument (P6).

**Example 5.4: Trace Formula for Mixed States**
A quantum system is in the mixed state rho = (3/4)|0><0| + (1/4)|1><1|. Compute the probability of measuring sigma_x = +1.

Step 1: P_+ = |+><+| = (1/2)[[1,1],[1,1]]. P(+1) = tr(rho P_+) = tr(([[3/4, 0],[0, 1/4]]) (1/2)[[1,1],[1,1]]).
Step 2: rho P_+ = (1/2)[[3/4, 3/4],[1/4, 1/4]]. tr = (1/2)(3/4 + 1/4) = 1/2.
Step 3: Interpretation: even in a mixed state (a classical mixture of |0> and |1>), the Born rule (in its trace form) gives well-defined probabilities. The probability is 1/2 regardless of the mixing ratio (3/4 vs. 1/4) because sigma_x measurement cannot distinguish |0> from |1> classically weighted.

Wait -- let us recompute. P(+1) = tr(P_+ rho) = tr((1/2)[[1,1],[1,1]] [[3/4,0],[0,1/4]]) = tr((1/2)[[3/4, 1/4],[3/4, 1/4]]) = (1/2)(3/4 + 1/4) = 1/2. Yes, P(+1) = 1/2. And P(-1) = 1/2. This is because rho has Bloch vector r = (0, 0, 1/2) (pointing along z), and the sigma_x measurement axis is perpendicular to r, giving <sigma_x> = 0 and hence P(+/-1) = 1/2 each.
Narration: The trace formula tr(rho E) unifies pure and mixed state measurements. For computational purposes, it is often easier to use the trace formula than to decompose rho into pure states and average. The Bloch sphere picture makes the result geometrically obvious: the projection of the Bloch vector onto the measurement axis determines the expectation value.

**Example 5.5: The Trine POVM**
Define the trine POVM with elements E_k = (2/3)|phi_k><phi_k| where |phi_0> = |0>, |phi_1> = (-1/2)|0> + (sqrt(3)/2)|1>, |phi_2> = (-1/2)|0> - (sqrt(3)/2)|1>. Verify that sum E_k = I. Compute the outcome probabilities when the input state is |0>.

Step 1: Verify sum E_k = I. E_0 = (2/3)|0><0| = (2/3)[[1,0],[0,0]]. E_1 = (2/3)|phi_1><phi_1| = (2/3)[[1/4, -sqrt(3)/4],[-sqrt(3)/4, 3/4]]. E_2 = (2/3)|phi_2><phi_2| = (2/3)[[1/4, sqrt(3)/4],[sqrt(3)/4, 3/4]]. Sum: (2/3)[[1 + 1/4 + 1/4, 0 - sqrt(3)/4 + sqrt(3)/4],[0 - sqrt(3)/4 + sqrt(3)/4, 0 + 3/4 + 3/4]] = (2/3)[[3/2, 0],[0, 3/2]] = [[1, 0],[0, 1]] = I. Confirmed.
Step 2: P(0) = tr(E_0 |0><0|) = (2/3)|<phi_0|0>|^2 = (2/3)(1) = 2/3. P(1) = (2/3)|<phi_1|0>|^2 = (2/3)(1/4) = 1/6. P(2) = (2/3)|<phi_2|0>|^2 = (2/3)(1/4) = 1/6. Sum: 2/3 + 1/6 + 1/6 = 1. Confirmed.
Step 3: Interpretation: the trine POVM gives outcome 0 with the highest probability (2/3) when the input is |0>, which makes sense since E_0 is aligned with |0>. But there is a 1/3 chance of getting outcomes 1 or 2. No projective measurement on a qubit can have 3 outcomes, so this is fundamentally non-projective.
Narration: POVMs generalise the Born rule to measurements with more outcomes than the Hilbert space dimension allows for projective measurements. They are essential in quantum state tomography, quantum key distribution, and optimal state discrimination. The trine POVM is the unique "symmetric informationally complete" (SIC) POVM for a qubit.

---

### 6. Common Confusions

**CC-1: Confusing the Born rule with classical probability.**
Wrong model: Students apply classical intuition -- "the qubit IS in state |0> or |1>, we just don't know which" -- instead of understanding that the qubit is genuinely in a superposition.
Why tempting: The Born rule outputs probabilities, which look like classical ignorance probabilities.
Corrective argument: Classical probability (epistemic uncertainty) cannot produce interference. Quantum probability (Born rule) can, because it involves complex amplitudes that add before squaring. The double-slit experiment (P1) is the canonical example: classical probabilities would give P(x) = P_1(x) + P_2(x), but quantum amplitudes give P(x) = |A_1(x) + A_2(x)|^2, which includes an interference term 2 Re(A_1* A_2). The Born rule is fundamentally different from classical probability, even though it produces a valid probability distribution.

**CC-2: Thinking measurement probability depends on the eigenvalue, not just the eigenvector.**
Wrong model: Students think that larger eigenvalues are more likely to be measured.
Why tempting: In some classical settings, larger values are more probable (e.g., biased dice).
Corrective argument: The probability P(a_i) = |<e_i|psi>|^2 depends on the overlap between |psi> and the eigenvector |e_i>, not on the eigenvalue a_i. A system in state |e_1> will always yield eigenvalue a_1 regardless of whether a_1 is the largest or smallest eigenvalue. The eigenvalues determine the possible outcomes; the eigenvectors (and the state) determine the probabilities.

**CC-3: Confusing the trace formula tr(rho A) with tr(A).**
Wrong model: Students compute tr(A) and call it the expectation value.
Why tempting: tr(A) is a scalar associated with A, and computing it is easier than tr(rho A).
Corrective argument: tr(A) = sum of eigenvalues, which is a property of the observable, not the state. The expectation value tr(rho A) = sum a_i P(a_i) depends on both the observable AND the state. For the maximally mixed state rho = I/d, tr(rho A) = tr(A)/d, which is the average of all eigenvalues. For other states, the expectation value can be any value between the smallest and largest eigenvalue.

**CC-4: Thinking Gleason's theorem means the Born rule is "proved" from nothing.**
Wrong model: Students think Gleason's theorem derives quantum mechanics from pure logic.
Why tempting: Gleason's theorem is described as "forcing" the Born rule.
Corrective argument: Gleason's theorem assumes the Hilbert space framework (states are vectors, observables correspond to subspaces) and the additivity constraint (probabilities for orthogonal decompositions sum to 1). These are non-trivial assumptions. What Gleason's theorem shows is that GIVEN these assumptions, the Born rule is the only possibility. It does not explain why the Hilbert space framework is correct in the first place. The Hilbert space structure itself is motivated by experiment (P1, P2).

**CC-5: Confusing POVMs with projective measurements that have been "made noisy."**
Wrong model: Students think POVMs are just imperfect projective measurements.
Why tempting: POVMs can model noisy measurements, and the formalism looks similar.
Corrective argument: While noisy measurements can be modelled as POVMs, POVMs are a more general concept. The trine POVM (3 outcomes for a qubit) cannot be decomposed as a noisy version of any 2-outcome projective measurement. It is a fundamentally different kind of measurement. Naimark's theorem shows that every POVM can be realised as a projective measurement on a larger Hilbert space (system + ancilla), so POVMs are physically realisable, not just mathematical abstractions.

**CC-6: Believing entanglement allows faster-than-light signalling.**
Wrong model: Students think that because measuring one qubit of an entangled pair affects the other, information can be transmitted instantaneously.
Why tempting: Measuring qubit A of |Phi+> "collapses" qubit B. If B's state changes, shouldn't that be detectable?
Corrective argument: The no-signalling theorem (Theorem 3.11) shows that the marginal probability distribution for measurements on B is independent of what measurement (if any) is performed on A. Bob cannot tell whether Alice has measured her qubit, or what basis she chose, by looking at his measurement outcomes alone. The correlations only become apparent when Alice and Bob compare their results (classical communication required). Quantum entanglement is a resource for correlations, not for communication.

---

### 7. Cross-References

**Backward references:**
- A2: Inner product and norm (|<e|psi>|^2 = squared overlap = probability).
- A4: Spectral decomposition (the Born rule uses the eigenvectors and eigenvalues from the spectral decomposition of the observable).
- A5: Tensor products, entanglement, and partial trace (measurements on composite systems, reduced density matrices).
- P2: The measurement postulate (stated informally in P2, formalised here).
- P5: The uncertainty principle (which depends on the variance formula derived here).
- P6: Bell's theorem and CHSH (which use the Born rule for entangled states to compute correlation functions).
- C2: Measurement (students have been using the Born rule since C2; this lesson provides the rigorous foundation).

**Forward references within Track A:**
- None (A6 is the final lesson of the math track).

**Forward references to Track P:**
- P7: Decoherence involves the transition from pure to mixed states, and the trace formula for mixed-state probabilities is essential.

**Forward references to Track C:**
- C5: Universal gate sets -- understanding which unitaries are achievable requires understanding how they affect measurement statistics.
- C6: Deutsch-Jozsa algorithm -- the Born rule determines what is measured at the end of the circuit.
- C7: Teleportation -- Bell-state measurements and the Born rule for joint measurements on composite systems.
- C8: Grover's algorithm -- the amplification of probability amplitudes is quantified via the Born rule.
- C9: QFT -- measurement in the Fourier basis, with probabilities given by the Born rule.
- C10: Shor's algorithm -- the probability of measuring a useful period is computed from the Born rule.

---

### 8. Historical Notes

- The **Born rule** was proposed by **Max Born** in a brief footnote to his 1926 paper on scattering theory. Born suggested that the square of the wave-function amplitude gives the probability of finding a particle at a given position. This was one of the most consequential footnotes in the history of science; it earned Born the Nobel Prize in Physics (1954), nearly 30 years later.
- Born's original formulation was for continuous wave functions (|psi(x)|^2 dx = probability of finding the particle in [x, x+dx]). The discrete version (|<e_i|psi>|^2 for measurement outcomes) was developed by **Dirac** (1930) and **von Neumann** (1932) as part of the axiomatic formulation of quantum mechanics.
- **Gleason's theorem** was proved by **Andrew Gleason** in 1957. The proof is notoriously difficult (the original paper is 10 pages of dense analysis). Simpler proofs have been given by **Cooke, Keane, and Moran** (1985) and **Pitowsky** (1998). The theorem is often cited as the deepest mathematical result about the foundations of quantum mechanics.
- **POVMs** were introduced by **Davies and Lewis** (1970) in the context of quantum decision theory. They were further developed by **Holevo** (1973, 1982) and **Kraus** (1983). The Naimark dilation theorem (1940, generalised by Stinespring, 1955) shows that every POVM can be realised as a projective measurement on an extended system.
- The **no-signalling theorem** was first explicitly stated and proved in the context of quantum mechanics by **Ghirardi, Rimini, and Weber** (1980), though the result was implicit in earlier work. It is a consequence of the linearity of quantum mechanics and the tensor-product structure of composite systems.
- The use of the Born rule as a fundamental axiom (rather than a derived result) remains philosophically controversial. **Everettian** (many-worlds) interpretations attempt to derive Born-rule probabilities from decision theory (**Deutsch**, 1999; **Wallace**, 2007). **QBist** interpretations (**Fuchs**, 2002) treat probabilities as subjective degrees of belief. These foundational questions remain active areas of research.

---

### 9. Problem Set

**Problem A6.1 [Easy]**
A qubit is in state |+> = (|0> + |1>)/sqrt(2). Compute P(0) and P(1) for a sigma_z measurement.
Solution sketch: P(0) = |<0|+>|^2 = 1/2. P(1) = |<1|+>|^2 = 1/2.

**Problem A6.2 [Easy]**
Compute <sigma_z> for the state |psi> = cos(pi/6)|0> + sin(pi/6)|1>.
Solution sketch: <sigma_z> = cos^2(pi/6) - sin^2(pi/6) = 3/4 - 1/4 = 1/2.

**Problem A6.3 [Easy]**
Verify that the Born rule gives a valid probability distribution for measuring sigma_y on the state |0>. (Compute both probabilities and check they sum to 1.)
Solution sketch: sigma_y eigenstates: |y+> = (|0> + i|1>)/sqrt(2), |y-> = (|0> - i|1>)/sqrt(2). P(+1) = |<y+|0>|^2 = 1/2. P(-1) = |<y-|0>|^2 = 1/2. Sum = 1.

**Problem A6.4 [Medium]**
A qubit is in state |psi> = (1/sqrt(3))|0> + sqrt(2/3) e^{i pi/3} |1>. Compute the expectation value and variance of sigma_z.
Solution sketch: <sigma_z> = 1/3 - 2/3 = -1/3. Var = <sigma_z^2> - <sigma_z>^2 = 1 - 1/9 = 8/9.

**Problem A6.5 [Medium]**
For the state |psi> = (1/sqrt(3))|0> + sqrt(2/3)|1>, compute the probabilities for a sigma_x measurement. Use the result to verify that <sigma_x> = <psi|sigma_x|psi>.
Solution sketch: <+|psi> = (1/sqrt(3) + sqrt(2/3))/sqrt(2) = (1 + sqrt(2))/(sqrt(6)). P(+1) = (1+sqrt(2))^2/6 = (3+2sqrt(2))/6. <-|psi> = (1/sqrt(3) - sqrt(2/3))/sqrt(2) = (1-sqrt(2))/sqrt(6). P(-1) = (1-sqrt(2))^2/6 = (3-2sqrt(2))/6. <sigma_x> = P(+1) - P(-1) = 4sqrt(2)/6 = 2sqrt(2)/3. Verify: <psi|sigma_x|psi> = (1/sqrt(3))(sqrt(2/3)) + (sqrt(2/3))(1/sqrt(3)) = 2sqrt(2)/3. Confirmed.

**Problem A6.6 [Medium]**
The mixed state rho = (1/2)|0><0| + (1/2)|+><+| (an equal mixture of |0> and |+>). Compute rho as a matrix, verify tr(rho) = 1, and find the probabilities for a sigma_z measurement.
Solution sketch: rho = (1/2)[[1,0],[0,0]] + (1/2)(1/2)[[1,1],[1,1]] = [[1/2 + 1/4, 1/4],[1/4, 1/4]] = [[3/4, 1/4],[1/4, 1/4]]. tr = 3/4 + 1/4 = 1. P(0) = tr(|0><0| rho) = rho_{00} = 3/4. P(1) = rho_{11} = 1/4.

**Problem A6.7 [Medium]**
Prove that for any observable A and any state |psi>, the variance satisfies Var(A) >= 0, with equality iff |psi> is an eigenvector of A.
Solution sketch: Var(A) = ||(A - <A>I)|psi>||^2 >= 0, since the norm squared is non-negative. Equality holds iff (A - <A>I)|psi> = 0, i.e., A|psi> = <A> |psi>, meaning |psi> is an eigenvector with eigenvalue <A>.

**Problem A6.8 [Hard]**
Derive the Robertson uncertainty relation: for any state |psi> and observables A, B: Var(A) Var(B) >= |<[A,B]>|^2 / 4.
Solution sketch: Let |f> = (A - <A>)|psi>, |g> = (B - <B>)|psi>. Then Var(A) = <f|f>, Var(B) = <g|g>. By Cauchy-Schwarz: <f|f><g|g> >= |<f|g>|^2. Now <f|g> = <psi|(A-<A>)(B-<B>)|psi> = <psi|AB|psi> - <A><B>. Write <f|g> = (1/2)<[A-<A>,B-<B>]> + (1/2)<{A-<A>,B-<B>}>. The first term is (1/2)<[A,B]> (imaginary), the second is real. So |<f|g>|^2 >= |Im(<f|g>)|^2 = |<[A,B]>/2|^2. Combining: Var(A) Var(B) >= |<[A,B]>|^2/4.

**Problem A6.9 [Hard]**
For the 2-qubit state |Phi+> = (|00> + |11>)/sqrt(2), compute the expectation value <sigma_x tensor sigma_x> and <sigma_z tensor sigma_z>. These are correlation functions used in the CHSH inequality.
Solution sketch: <sigma_x tensor sigma_x> = <Phi+| (sigma_x tensor sigma_x) |Phi+>. sigma_x tensor sigma_x swaps the computational basis: |00> -> |11>, |11> -> |00>, |01> -> |10>, |10> -> |01>. So (sigma_x tensor sigma_x)|Phi+> = (|11> + |00>)/sqrt(2) = |Phi+>. Hence <sigma_x tensor sigma_x> = <Phi+|Phi+> = 1. Similarly, (sigma_z tensor sigma_z)|Phi+> = (|00> + (-1)(-1)|11>)/sqrt(2) = |Phi+>. So <sigma_z tensor sigma_z> = 1.

**Problem A6.10 [Hard]**
Prove the no-signalling theorem for the case of 2-qubit pure states: if |psi> is any state in C^2 tensor C^2 and Bob measures sigma_z on qubit B, show that the marginal probability distribution for Alice's sigma_z measurement is the same as if Bob had not measured at all.
Solution sketch: Without Bob measuring: P_A(0) = |<00|psi>|^2 + |<01|psi>|^2. With Bob measuring sigma_z first and getting outcome b: P(A=0, B=b) = |<0b|psi>|^2, P(A=0 | B=b) = |<0b|psi>|^2 / P(B=b). But Alice's marginal: P_A(0) = sum_b P(A=0, B=b) = |<00|psi>|^2 + |<01|psi>|^2. This is the same as without Bob's measurement. The argument works for any Bob measurement basis: replacing {|0>, |1>} with any orthonormal {|b_0>, |b_1>}, P_A(0) = sum_j |(<0| tensor <b_j|)|psi>|^2 = <0|_A (sum_j |<b_j|_B |psi>|^2)... more carefully: P_A(0) = tr_B(|<0|_A|psi>|^2) = <0|_A rho_A |0>_A, which depends only on rho_A and is independent of Bob's choice.

**Problem A6.11 [Hard]**
(Preview) In Grover's algorithm, the state after k iterations is |psi_k> = sin((2k+1)theta)|w> + cos((2k+1)theta)|w_perp>, where |w> is the target state and sin^2(theta) = 1/N. Use the Born rule to compute the probability of measuring |w> after k iterations, and find the optimal k (the one that maximises this probability).
Solution sketch: P(w) = sin^2((2k+1)theta). Maximised when (2k+1)theta = pi/2, i.e., k = (pi/(4 theta) - 1)/2 approximately pi sqrt(N)/4 for large N (since theta approximately 1/sqrt(N)). This gives P(w) approximately 1 - O(1/N). Forward-ref C8.

---

### 10. Simulator Dependencies

The measurement simulation widget (VA-3) requires a random number generator seeded by the Born rule probabilities. This should be implemented in the browser (JavaScript Math.random() or similar). The no-signalling demonstration (VA-6) is a more complex widget that requires simulating joint measurements on 2-qubit states; this can interface with the quantum circuit simulator from `simulator-spec.md` if available, or use a standalone 4x4 density matrix engine.

---

### 11. Estimates

- **Word count target:** 5,500 -- 7,000 words
- **Student time:** 130 -- 170 minutes
- **Development time:** 18 -- 24 hours (writing + widget development + review)

---

### 12. Page Splits

Recommended split into three pages:

- **Page A6a: Probability Review and the Born Rule** (Stages 1-3, Definitions 3.1-3.2, Theorems 3.3-3.5, VA-1, VA-2, Examples 5.1, 5.4, Problems A6.1-A6.3)
- **Page A6b: Variance, Degenerate Eigenvalues, and Gleason's Theorem** (Stages 4-6, Theorems 3.6-3.9, VA-3, VA-4, Examples 5.2, 5.3, Problems A6.4-A6.8)
- **Page A6c: POVMs, Composite Systems, and No-Signalling** (Stages 7-8, Definition 3.10, Theorem 3.11, VA-5, VA-6, Examples 5.5, Problems A6.9-A6.11)

Rationale: Page A6a covers the core material that most students need immediately (the Born rule in its basic form). Page A6b covers the deeper structural results (Gleason's theorem) and the connection to the uncertainty principle. Page A6c covers advanced topics (POVMs, composite-system measurements) that are important for quantum information but could be deferred for students who want to move to the computing track quickly. The three-page split reflects the fact that A6 is the capstone of the math track and ties together all preceding material.

---
