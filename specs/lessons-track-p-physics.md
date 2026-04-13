# Track P -- Quantum Physics: Lesson Specifications

**Version:** 1.0
**Date:** 2026-04-13
**Status:** Draft
**Track:** P (Physics), Lessons P1--P7
**Canonical positions:** P1 = 4/23, P2 = 5/23, P3 = 9/23, P4 = 10/23, P5 = 13/23, P6 = 14/23, P7 = 20/23

---

## Table of Contents

1. [P1 -- Why Classical Physics Fails](#p1--why-classical-physics-fails)
2. [P2 -- States, Observables, Measurement](#p2--states-observables-measurement)
3. [P3 -- The Schrodinger Equation](#p3--the-schrodinger-equation)
4. [P4 -- Spin-1/2 and Pauli Matrices](#p4--spin-12-and-pauli-matrices)
5. [P5 -- The Uncertainty Principle](#p5--the-uncertainty-principle)
6. [P6 -- Entanglement, EPR, Bell, and CHSH](#p6--entanglement-epr-bell-and-chsh)
7. [P7 -- Decoherence and the Measurement Problem](#p7--decoherence-and-the-measurement-problem)

---

## P1 -- Why Classical Physics Fails

**Canonical position:** 4 of 23
**Prerequisites:** A1 (complex numbers), A2 (vectors), A3 (matrices)
**Slug:** `p1-classical-physics-fails`
**Target length:** 10,000--12,000 words
**Page splits:** Single page (no split)
**Paid:** Yes

### 1. Learning Objectives

By the end of this lesson the student will be able to:

1. **LO-P1.1:** Explain the ultraviolet catastrophe and why the Rayleigh-Jeans law diverges at high frequencies, identifying the specific classical assumption (equipartition of energy) that fails.
2. **LO-P1.2:** State Planck's quantisation hypothesis E = nhv, write the Planck spectral radiance formula, and show that it reduces to the Rayleigh-Jeans law in the low-frequency limit and to the Wien law in the high-frequency limit.
3. **LO-P1.3:** Describe the photoelectric effect apparatus, state the three key experimental observations (frequency threshold, instantaneous emission, intensity-independent kinetic energy), and derive Einstein's photoelectric equation KEmax = hv - phi.
4. **LO-P1.4:** Describe the double-slit experiment for single particles, explain how an interference pattern builds up one detection at a time, and explain why introducing a which-path detector destroys the interference pattern.
5. **LO-P1.5:** Describe the Stern-Gerlach apparatus (collimated beam, inhomogeneous magnetic field, detector screen), state the classical prediction (continuous smear) and the actual result (discrete spots), and explain why this implies quantised angular momentum.
6. **LO-P1.6:** For each of the four experiments, articulate precisely which classical assumption is violated and what new quantum concept is demanded.
7. **LO-P1.7:** Use the Stern-Gerlach simulator to set beam parameters and magnetic field orientation, predict the number and location of output spots for spin-1/2 and spin-1 particles, and verify predictions against the simulation.
8. **LO-P1.8:** Compute the Planck spectral radiance at given temperature and frequency values using the full formula, and compare with the Rayleigh-Jeans prediction to quantify the UV catastrophe.
9. **LO-P1.9:** Calculate the maximum kinetic energy and stopping voltage for photoelectrons given the photon frequency and work function of a metal.

### 2. Intuition Arc

The lesson follows a dramatic arc designed to progressively demolish the student's classical intuitions:

**Opening hook (500 words):** Begin with Lord Kelvin's famous 1900 remark about "two small clouds" on the horizon of classical physics. The student is told: classical mechanics, electrodynamics, and thermodynamics were spectacularly successful -- and yet four seemingly modest experiments brought the entire edifice to its knees. Each experiment is a puzzle whose solution demands a radical departure from classical thinking.

**Act I -- The UV catastrophe (2,000 words):** Start with the humble question "what colour is a hot object?" Motivate the blackbody problem via steelworkers, pottery kilns, and stellar spectra. Build the Rayleigh-Jeans law from classical EM + equipartition. Show the formula diverges: infinite energy at high frequencies. The classical universe would glow with lethal radiation at every temperature. Planck's fix: energy comes in packets E = nhv. The Planck distribution tames the divergence because high-frequency modes are "frozen out" -- not enough thermal energy to excite even one quantum. Key emotional beat: the first hint that nature is granular, not continuous.

**Act II -- The photoelectric effect (2,000 words):** Shift to light itself. Hertz's accidental discovery (1887). Lenard's careful measurements. Three puzzles the wave theory cannot explain. Einstein's radical proposal: light itself comes in quanta (photons). Each photon carries E = hv. Energy conservation gives the photoelectric equation. Key emotional beat: not only is energy quantised in matter (Planck), but light itself is quantised. Wave theory is incomplete.

**Act III -- The double-slit experiment (2,500 words):** The "heart of quantum mechanics" (Feynman). Start with Young's classical double-slit for water waves and light. Then the twist: turn the source intensity way down until particles arrive one at a time. Each particle lands at a definite spot (particle-like), but after thousands of particles, the pattern is an interference pattern (wave-like). "Each particle interferes with itself." Now add a which-path detector at one slit -- the pattern vanishes, replaced by two single-slit envelopes. Key emotional beat: the very act of acquiring information changes the physical outcome. Nature refuses to be both wave and particle at the same time.

**Act IV -- Stern-Gerlach (2,000 words):** Angular momentum should be a continuous vector. Send silver atoms through an inhomogeneous magnetic field. Classically: a continuous smear on the screen. Experimentally: exactly two spots. Angular momentum is quantised, and quantised into only two values for the outermost electron. Key emotional beat: not only is energy quantised -- so is the angular momentum that underlies all internal structure. The classical phase space is replaced by a discrete state space.

**Synthesis (1,000 words):** Summarise what each experiment demands: quantised energy, quantised light, superposition/interference, quantised angular momentum. These are not separate fixes but symptoms of a single coherent theory: quantum mechanics. Tease the postulates of P2.

### 3. Theorems and Proofs (Sketched)

**Theorem P1-T1: Derivation of the Rayleigh-Jeans law.**
- Count the number of electromagnetic modes in a cubic cavity of side L with frequency between v and v + dv: g(v) dv = 8pi v^2 / c^3 dv.
- Apply classical equipartition: each mode carries average energy kT.
- Spectral radiance: u(v, T) = (8pi v^2 / c^3) kT.
- Show that integral over all frequencies diverges: total energy = integral_0^infinity u(v,T) dv = infinity. This is the UV catastrophe.

**Theorem P1-T2: Derivation of the Planck distribution.**
- Planck's hypothesis: energy of each mode is quantised, E_n = nhv, n = 0, 1, 2, ...
- Average energy of a mode at temperature T using the Boltzmann distribution: <E> = hv / (exp(hv/kT) - 1).
- Proof sketch: <E> = sum_{n=0}^{inf} nhv exp(-nhv/kT) / sum_{n=0}^{inf} exp(-nhv/kT). Let x = hv/kT. Numerator = hv * x * d/dx [1/(1-e^{-x})], denominator = 1/(1-e^{-x}). Result: <E> = hv/(e^x - 1).
- Planck spectral radiance: u(v, T) = (8pi v^2 / c^3) * hv / (exp(hv/kT) - 1).
- Verify: for hv << kT, exp(hv/kT) approx 1 + hv/kT, so <E> approx kT, recovering Rayleigh-Jeans. For hv >> kT, <E> approx hv exp(-hv/kT), recovering Wien's law.

**Theorem P1-T3: Einstein's photoelectric equation.**
- Photon energy: E_photon = hv.
- Energy conservation at the surface: hv = phi + KE_max, where phi is the work function (minimum energy to liberate an electron).
- Threshold frequency: v_0 = phi / h. Below this frequency, no electrons are emitted regardless of intensity.
- Stopping voltage: eV_s = KE_max = hv - phi.
- Intensity affects the number of photoelectrons (one photon liberates at most one electron), not their energy.

**Theorem P1-T4: Classical prediction for Stern-Gerlach (continuous distribution).**
- Magnetic moment mu = -g_J * mu_B * J / hbar for angular momentum quantum number J.
- Force on a magnetic dipole in an inhomogeneous field: F_z = mu_z * dB/dz.
- Classically, J_z can take any value from -|J| to +|J|. The beam deflection is proportional to J_z, so the classical prediction is a continuous vertical smear on the detector screen.
- Quantum result: J_z takes only the values m_J * hbar where m_J in {-J, -J+1, ..., J}. For the silver atom's outer electron (l=0, s=1/2), m_s = +/- 1/2, giving exactly two spots.

### 4. Historical Experiments with Apparatus Descriptions

**Experiment 1: Blackbody Radiation (Lummer & Pringsheim, 1899; Rubens & Kurlbaum, 1900)**

*Apparatus:* A hollow metal cavity (typically platinum or porcelain) with a small aperture. The cavity is heated in an electric furnace to a precisely controlled temperature (measured by a thermocouple). Radiation escaping through the aperture is collimated by a slit system, dispersed by a prism (rock salt for infrared) or diffraction grating, and the spectral intensity at each wavelength is measured by a bolometer (a thin platinum strip whose resistance changes with temperature). The small aperture ensures the radiation inside the cavity has reached thermal equilibrium and is independent of the wall material -- it is "blackbody" radiation.

*Classical prediction:* The Rayleigh-Jeans formula u(v,T) = 8pi v^2 kT / c^3 predicts spectral radiance that increases without bound as frequency increases. At T = 5000 K, this predicts infinite total radiated power.

*Actual result:* The spectral radiance rises with frequency, reaches a peak (whose position shifts to higher frequency with higher temperature, per Wien's displacement law lambda_max * T = 2.898 x 10^{-3} m K), then falls exponentially. Planck's formula fits the data exactly across all frequencies and temperatures.

*Implications:* Energy exchange between matter and radiation occurs in discrete quanta of size hv. The constant h = 6.626 x 10^{-34} J s is a new fundamental constant of nature.

**Experiment 2: Photoelectric Effect (Hertz, 1887; Lenard, 1902; Millikan, 1916)**

*Apparatus:* A vacuum tube containing two electrodes. The cathode is a clean metal plate (e.g., sodium, zinc, or cesium) illuminated by monochromatic light from a mercury arc lamp filtered through a monochromator. The anode is a collector plate. A variable voltage source is connected between cathode and anode, and a sensitive galvanometer (or electrometer) measures the photocurrent. When the voltage is reversed (retarding potential), it opposes the emitted electrons. The stopping voltage V_s at which the current drops to zero gives the maximum kinetic energy: KE_max = eV_s.

*Classical prediction (wave theory of light):* (a) Electrons should be emitted at any frequency if the intensity is high enough, since energy accumulates on the electron surface over time. (b) There should be a measurable time delay between turning on the light and the emission of the first electrons (estimated at seconds to minutes for dim light). (c) Increasing intensity should increase the kinetic energy of emitted electrons.

*Actual result:* (a) Below a threshold frequency v_0 (which depends on the metal), no electrons are emitted regardless of intensity. (b) Emission is instantaneous (< 10^{-9} s delay) even at the lowest measurable intensities. (c) Increasing intensity increases the photocurrent (number of electrons per second) but does not change the maximum kinetic energy. The maximum kinetic energy increases linearly with frequency: KE_max = hv - phi.

*Implications:* Light consists of particle-like quanta (photons), each carrying energy E = hv. The interaction is one photon per electron. This is incompatible with a purely wave description of light.

**Experiment 3: Double-Slit Experiment (Young, 1801; Taylor, 1909; Jonsson, 1961; Tonomura, 1989)**

*Apparatus (modern electron version, Tonomura 1989):* An electron gun (thermionic or field-emission source) produces a beam of electrons accelerated through a potential difference V (typically 50 kV, giving de Broglie wavelength lambda = h/p approx 5 pm). The beam passes through an electron biprism (a fine charged wire between two grounded plates) that acts as the equivalent of two slits. Electrons are detected on a position-sensitive detector (a micro-channel plate backed by a fluorescent screen and CCD camera). The apparatus is in ultra-high vacuum (< 10^{-7} Pa). The source intensity is turned down so low that at most one electron is in flight at any time (average interval between detections: several seconds).

*Classical prediction (particles):* Two bright bands directly behind the slits, with no interference. *(Waves):* A smooth interference pattern from the start.

*Actual result:* Each individual electron lands at a single, apparently random point on the screen (particle-like). After accumulating hundreds of electrons, no pattern is visible -- just random dots. After thousands of electrons, fringes begin to emerge. After tens of thousands, a clear double-slit interference pattern is visible, with fringe spacing matching the de Broglie wavelength prediction: Delta y = lambda L / d, where L is the distance to the screen and d is the slit separation. When a which-path detector is placed at one slit (e.g., a resonant cavity that detects the electron's passage without absorbing it), the interference pattern is destroyed and replaced by two single-slit diffraction envelopes.

*Implications:* Individual particles exhibit wave-like interference with themselves. The "wave" is not a physical oscillation in space but a probability amplitude. Acquiring which-path information collapses the superposition. This experiment alone demands a radical revision of classical ontology.

**Experiment 4: Stern-Gerlach Experiment (Stern & Gerlach, 1922)**

*Apparatus:* A small oven heats metallic silver (melting point 961 C) to produce a vapor of silver atoms. The atoms escape through a narrow slit to form a collimated beam in a high-vacuum chamber. The beam passes between the poles of a specially shaped electromagnet: one pole is flat and the other has a sharp wedge shape, producing a strong magnetic field gradient dB/dz (on the order of 10--100 T/m) in the vertical (z) direction. The field is approximately B_z(z) = B_0 + z * dB/dz. After traversing the magnet (length L approx 10 cm), the atoms travel an additional distance D to a glass detector plate, where they deposit a thin film. The spatial distribution of the deposit reveals the deflection pattern.

*Why silver:* Silver has the electron configuration [Kr] 4d^{10} 5s^1. The 4d subshell is full (L=0, S=0), so the total angular momentum comes entirely from the lone 5s electron, which has l=0 and s=1/2. Thus J = 1/2 and m_J = +/- 1/2.

*Classical prediction:* The magnetic moment mu can have any orientation relative to the z-axis. The force F_z = mu_z (dB/dz) therefore takes a continuous range of values, and the beam should produce a continuous vertical smear on the detector plate (elongated image of the original slit).

*Actual result:* The beam splits into exactly two discrete spots, symmetrically displaced from the undeflected position. The separation is consistent with m_J = +1/2 and m_J = -1/2 and no intermediate values.

*Implications:* Angular momentum is quantised. The component of angular momentum along any measurement axis takes only discrete values. For spin-1/2 particles, there are exactly two possible outcomes. This is the prototype of a quantum measurement with a discrete spectrum and will be formalised in P2.

### 5. Visual Assets

**VA-P1.1: Blackbody spectrum comparison plot.**
- Type: Interactive chart (Recharts or D3).
- Description: A plot with frequency (or wavelength) on the x-axis and spectral radiance on the y-axis. Three curves: (1) Rayleigh-Jeans (dashed red, diverging), (2) Wien approximation (dotted blue, falling too fast at low frequencies), (3) Planck distribution (solid gold, exact). A temperature slider allows the student to adjust T from 1000 K to 10,000 K and watch all three curves update in real time. Experimental data points from Lummer & Pringsheim overlaid as discrete markers at T = 1646 K.
- File: `blackbody-spectrum-chart.tsx`
- Dependencies: None (pure React + math).

**VA-P1.2: Blackbody cavity diagram.**
- Type: Static SVG/illustration.
- Description: Cross-section of a heated cavity with a small aperture. Labeled components: cavity walls, furnace, aperture, collimating slits, prism, bolometer. Arrows show radiation escaping through the aperture.
- File: `blackbody-cavity-diagram.svg`

**VA-P1.3: Photoelectric effect apparatus diagram.**
- Type: Static SVG/illustration.
- Description: Schematic of the vacuum tube. Labeled: cathode (metal plate), anode (collector), monochromatic light source with adjustable frequency, variable voltage source, ammeter. Arrows show photons hitting cathode and electrons traveling to anode.
- File: `photoelectric-apparatus.svg`

**VA-P1.4: Photoelectric data plots.**
- Type: Interactive chart.
- Description: Two plots side by side. (Left) Photocurrent vs. retarding voltage for three different light intensities at a fixed frequency: curves have the same stopping voltage but different saturation currents. (Right) Stopping voltage vs. frequency for a given metal: a straight line with slope h/e and x-intercept at v_0 = phi/h. The student can select from three metals (sodium phi = 2.28 eV, zinc phi = 4.33 eV, cesium phi = 2.1 eV) and see the line shift.
- File: `photoelectric-plots.tsx`

**VA-P1.5: Double-slit buildup animation.**
- Type: Canvas animation.
- Description: Animated simulation showing individual particles (dots) arriving at random positions on a detector screen. The student sees dots accumulate one at a time (rate adjustable from 1/sec to 100/sec). After many particles, an interference pattern emerges. A "which-path detector" toggle can be switched on, causing the pattern to change to two single-slit envelopes. A histogram panel to the right shows the real-time probability distribution.
- File: `double-slit-animation.tsx`
- Dependencies: None (pure Canvas API).

**VA-P1.6: Double-slit schematic.**
- Type: Static SVG.
- Description: Top-down view of the double-slit setup: source, barrier with two slits labeled slit A and slit B, detector screen. Wavefronts shown emanating from each slit and interfering. Classical particle trajectories shown as dashed straight lines for comparison.
- File: `double-slit-schematic.svg`

**VA-P1.7: Stern-Gerlach apparatus diagram.**
- Type: Static SVG/illustration.
- Description: Side view showing: oven, collimating slit, magnet poles (N flat, S wedge-shaped) with field lines, beam path splitting into two, detector screen with two spots. Inset showing the magnetic field profile B_z vs z. Classical prediction (smear) shown as a faded overlay.
- File: `stern-gerlach-apparatus.svg`

**VA-P1.8: Stern-Gerlach simulator embed.**
- Type: Interactive simulator (SIM_SG_UI component).
- Description: Full Stern-Gerlach simulator as specified in simulator-spec.md. In this lesson, the preset loads a single SG device aligned along z. The student can: (a) choose particle type (spin-1/2 or spin-1), (b) choose initial spin state, (c) adjust field gradient, (d) observe the output distribution on the detector screen. Running many trials builds a histogram showing exactly 2 (or 3) spots.
- File: Embedded `<SternGerlachSim />` component with lesson-specific presets.
- Dependencies: SIM_CORE, SIM_SG_UI.

**VA-P1.9: Timeline infographic.**
- Type: Static SVG or styled HTML.
- Description: Horizontal timeline from 1860 to 1930 showing: Kirchhoff (1860, blackbody concept), Stefan (1879, T^4 law), Wien (1893, displacement law), Rayleigh (1900, UV catastrophe), Planck (1900, quantum hypothesis), Einstein (1905, photoelectric), Millikan (1916, experimental confirmation), Stern-Gerlach (1922), de Broglie (1924), Davisson-Germer (1927). Each event is a clickable node that expands a 2-3 sentence summary.
- File: `quantum-timeline.tsx`

### 6. Worked Examples

**WE-P1.1: Quantifying the UV catastrophe.**

*Problem:* At T = 5000 K, compute the spectral energy density u(v, T) predicted by the Rayleigh-Jeans law and by the Planck distribution at v = 10^{13} Hz (infrared), v = 10^{15} Hz (visible/UV), and v = 10^{17} Hz (X-ray). Compare.

*Solution:*
Constants: k = 1.381 x 10^{-23} J/K, h = 6.626 x 10^{-34} J s, c = 3 x 10^8 m/s.

At v = 10^{13} Hz:
- Rayleigh-Jeans: u_RJ = 8pi v^2 kT / c^3 = 8pi (10^{13})^2 (1.381 x 10^{-23})(5000) / (3 x 10^8)^3 = 8pi x 10^{26} x 6.905 x 10^{-20} / 2.7 x 10^{25} = 8pi x 2.557 x 10^{-19} = 6.43 x 10^{-18} J/(m^3 Hz).
- Planck: x = hv/kT = (6.626 x 10^{-34})(10^{13}) / (1.381 x 10^{-23})(5000) = 6.626 x 10^{-21} / 6.905 x 10^{-20} = 0.0960. Since x << 1, the Planck formula nearly equals the Rayleigh-Jeans value: u_P approx 6.43 x 10^{-18} x [x/(e^x - 1)] approx 6.43 x 10^{-18} x [0.096/0.1007] approx 6.13 x 10^{-18} J/(m^3 Hz). Good agreement.

At v = 10^{15} Hz:
- Rayleigh-Jeans: u_RJ = 8pi (10^{15})^2 kT / c^3 = 6.43 x 10^{-14} J/(m^3 Hz). (Scales as v^2.)
- Planck: x = hv/kT = 9.60. u_P = (8pi v^2 / c^3) * hv / (e^x - 1) = 6.43 x 10^{-14} x [9.60/(e^{9.60} - 1)] = 6.43 x 10^{-14} x [9.60/14763] = 6.43 x 10^{-14} x 6.50 x 10^{-4} = 4.18 x 10^{-17} J/(m^3 Hz). The Planck value is almost 1000x smaller than Rayleigh-Jeans.

At v = 10^{17} Hz:
- Rayleigh-Jeans: u_RJ = 6.43 x 10^{-10} J/(m^3 Hz). Still growing!
- Planck: x = 960. e^{960} is astronomically large. u_P is essentially 0. The ratio u_RJ/u_P is beyond any representable number. This is the UV catastrophe in action.

*Takeaway:* At low frequencies, the two formulas agree. At high frequencies, the classical prediction is absurdly wrong. Planck's formula tames the divergence.

**WE-P1.2: Photoelectric stopping voltage.**

*Problem:* Ultraviolet light of wavelength lambda = 250 nm strikes a sodium surface (work function phi = 2.28 eV). (a) Will photoelectrons be emitted? (b) If so, what is the maximum kinetic energy of the emitted electrons? (c) What is the stopping voltage?

*Solution:*
(a) Photon energy: E = hc/lambda = (6.626 x 10^{-34})(3 x 10^8) / (250 x 10^{-9}) = 7.95 x 10^{-19} J = 4.97 eV. Since 4.97 eV > 2.28 eV = phi, yes, photoelectrons are emitted.

(b) KE_max = E - phi = 4.97 - 2.28 = 2.69 eV = 4.31 x 10^{-19} J.

(c) eV_s = KE_max, so V_s = KE_max / e = 2.69 V.

*Follow-up:* If the wavelength is increased to 600 nm, E = 2.07 eV < 2.28 eV. No electrons are emitted, regardless of how intense the light is. This is the frequency threshold.

**WE-P1.3: de Broglie wavelength and double-slit fringe spacing.**

*Problem:* Electrons are accelerated through a potential difference V = 50 kV and directed at a double slit with slit separation d = 2.0 micrometres. The detector screen is L = 1.0 m away. (a) What is the de Broglie wavelength? (b) What is the fringe spacing on the screen? (c) How does this compare with visible light fringes?

*Solution:*
(a) KE = eV = (1.602 x 10^{-19})(50,000) = 8.01 x 10^{-15} J. For non-relativistic electrons (check: KE/m_e c^2 = 8.01 x 10^{-15} / 8.19 x 10^{-14} = 0.098, so just barely non-relativistic):
p = sqrt(2 m_e KE) = sqrt(2 x 9.109 x 10^{-31} x 8.01 x 10^{-15}) = sqrt(1.460 x 10^{-44}) = 1.209 x 10^{-22} kg m/s.
lambda = h/p = 6.626 x 10^{-34} / 1.209 x 10^{-22} = 5.48 x 10^{-12} m = 5.48 pm.

(b) Fringe spacing: Delta y = lambda L / d = (5.48 x 10^{-12})(1.0) / (2.0 x 10^{-6}) = 2.74 x 10^{-6} m = 2.74 micrometres. This is tiny but measurable with modern detectors.

(c) For green light (lambda = 550 nm) with the same geometry: Delta y = (550 x 10^{-9})(1.0) / (2.0 x 10^{-6}) = 0.275 m = 27.5 cm. The electron fringes are about 100,000 times closer together, reflecting the much shorter de Broglie wavelength.

**WE-P1.4: Stern-Gerlach deflection.**

*Problem:* Silver atoms (mass m = 1.79 x 10^{-25} kg) leave an oven at T = 1200 K. The Stern-Gerlach magnet has length L = 10 cm and field gradient dB/dz = 100 T/m. The distance from the end of the magnet to the detector screen is D = 50 cm. For a spin-1/2 particle with magnetic moment mu_z = +/- mu_B (Bohr magneton), calculate the separation between the two spots on the screen.

*Solution:*
Average speed of atoms: v_avg = sqrt(3kT/m) = sqrt(3 x 1.381 x 10^{-23} x 1200 / 1.79 x 10^{-25}) = sqrt(2.77 x 10^5) = 526 m/s.

Time in the magnet: t_1 = L/v = 0.10/526 = 1.90 x 10^{-4} s.

Force on the atom: F_z = mu_z (dB/dz) = (+/- 9.274 x 10^{-24}) x 100 = +/- 9.274 x 10^{-22} N.

Acceleration: a_z = F_z/m = 9.274 x 10^{-22} / 1.79 x 10^{-25} = 5180 m/s^2.

Vertical displacement in the magnet: delta_1 = (1/2) a_z t_1^2 = 0.5 x 5180 x (1.90 x 10^{-4})^2 = 0.5 x 5180 x 3.61 x 10^{-8} = 9.35 x 10^{-5} m.

Vertical velocity acquired: v_z = a_z t_1 = 5180 x 1.90 x 10^{-4} = 0.984 m/s.

Time from magnet to screen: t_2 = D/v = 0.50/526 = 9.51 x 10^{-4} s.

Additional displacement in free flight: delta_2 = v_z t_2 = 0.984 x 9.51 x 10^{-4} = 9.36 x 10^{-4} m.

Total deflection per beam: delta = delta_1 + delta_2 = 9.35 x 10^{-5} + 9.36 x 10^{-4} = 1.03 x 10^{-3} m = 1.03 mm.

Separation between the two spots: 2 delta = 2.06 mm. This matches the order of magnitude observed by Stern and Gerlach (they measured approximately 0.2 mm separation with a weaker gradient and shorter magnet).

**WE-P1.5: Planck peak wavelength.**

*Problem:* Use Wien's displacement law (lambda_max T = b, where b = 2.898 x 10^{-3} m K) to find the peak wavelength of (a) the Sun (T = 5778 K), (b) a human body (T = 310 K), (c) the cosmic microwave background (T = 2.725 K).

*Solution:*
(a) lambda_max = 2.898 x 10^{-3} / 5778 = 5.01 x 10^{-7} m = 501 nm (green light -- the Sun peaks in the visible, as expected from evolution).

(b) lambda_max = 2.898 x 10^{-3} / 310 = 9.35 x 10^{-6} m = 9.35 micrometres (mid-infrared -- this is why thermal imaging cameras operate in the 8-14 micrometre band).

(c) lambda_max = 2.898 x 10^{-3} / 2.725 = 1.063 x 10^{-3} m = 1.063 mm (microwave -- this is why it is called the "cosmic microwave background").

### 7. Common Confusions

**CC-P1.1: "Planck believed in real quanta."**
Planck himself viewed quantisation as a mathematical trick, not a statement about the physical nature of radiation. It was Einstein (1905) who took the radical step of proposing that light itself consists of discrete quanta (photons). Students often conflate the two contributions. Planck quantised the energy of the oscillators in the cavity walls; Einstein quantised the electromagnetic field itself.

**CC-P1.2: "The double-slit experiment proves that particles are waves."**
This is a misleading oversimplification. The experiment shows that quantum objects are neither classical particles nor classical waves. They are quantum objects described by probability amplitudes that obey superposition. The interference pattern arises from the superposition of amplitudes, not from a physical wave undulating through space. When we detect the particle, we always find it at a single point (particle-like). The "wave" is in the probability amplitude, not in physical space (at least not in the same way as a water wave).

**CC-P1.3: "The which-path detector disturbs the particle mechanically."**
Students often think that the which-path detector destroys interference by physically kicking the particle (the "measurement disturbance" picture). While Heisenberg's original gamma-ray microscope argument did invoke such a disturbance, modern understanding (formalised in P5 and P6) shows that interference is destroyed by the entanglement between the particle's path degree of freedom and the detector's internal state, regardless of any mechanical disturbance. Gedanken experiments using interaction-free measurement confirm this.

**CC-P1.4: "The UV catastrophe means classical physics predicts infinite temperature."**
The UV catastrophe is about infinite spectral energy density at high frequencies, not infinite temperature. At any finite temperature T, the Rayleigh-Jeans formula predicts a finite spectral energy density at each frequency, but the integral over all frequencies diverges. The temperature is well-defined (it is a parameter of the equilibrium distribution); what diverges is the total energy in the radiation field.

**CC-P1.5: "The photoelectric effect proves that light is made of particles."**
The photoelectric effect can be explained by a semiclassical model where the electromagnetic field is treated classically (as a wave) but the matter (electrons) is treated quantum mechanically. What the photoelectric effect truly demonstrates is the quantisation of energy exchange between light and matter. The truly definitive evidence for photons (quantised electromagnetic field) comes from photon antibunching experiments (Kimble, Dagenais & Mandel, 1977) and other quantum-optics experiments. Einstein's explanation was correct, but the logical implication is subtler than textbooks suggest.

**CC-P1.6: "The Stern-Gerlach experiment measures spin."**
More precisely, it measures the component of the total magnetic moment (and hence angular momentum) along the field axis. For the silver atom, this happens to be the spin of the outer electron because the orbital angular momentum is zero (l = 0). For atoms with nonzero orbital angular momentum, the SG experiment measures J_z, the total angular momentum component. The distinction between spin, orbital, and total angular momentum matters and will be important in P4.

### 8. Cross-References

| Reference | Direction | Description |
|-----------|-----------|-------------|
| A1 (Complex Numbers) | backward | Complex exponentials used in Planck's derivation (geometric series). |
| A2 (Vectors) | backward | State-as-vector concept foreshadowed by discrete SG outcomes; 2D vector space for spin-1/2. |
| A3 (Matrices) | backward | Matrix representation of observables foreshadowed; "measurement = eigenvalue" language set up. |
| P2 (Postulates) | forward | All four experiments are the empirical motivation for the five QM postulates. |
| P4 (Spin-1/2 and Pauli Matrices) | forward | Stern-Gerlach experiment revisited with full mathematical formalism. |
| P5 (Uncertainty Principle) | forward | Which-path detector discussion revisited rigorously; position-momentum uncertainty from double-slit. |
| C1 (The Qubit) | forward | Spin-1/2 as the physical realisation of a qubit. |
| P3 (Schrodinger Equation) | forward | Time evolution of quantum states motivated here by the double-slit thought experiment. |

### 9. Historical Notes

**HN-P1.1: Planck's "act of desperation" (1900).** Max Planck presented his radiation formula to the German Physical Society on 14 December 1900, a date now regarded as the birth of quantum theory. He later called his introduction of energy quanta "an act of desperation" -- he had tried every other approach to fit the data and failed. Planck was a reluctant revolutionary; he spent years trying to reconcile quanta with classical thermodynamics.

**HN-P1.2: Einstein's "heuristic viewpoint" (1905).** Einstein's photoelectric paper was titled "On a Heuristic Viewpoint Concerning the Production and Transformation of Light." The word "heuristic" was deliberate: Einstein was cautious about claiming that light was literally made of particles. He received the Nobel Prize in 1921 (awarded 1922) specifically for this work, not for relativity.

**HN-P1.3: Millikan's reluctant confirmation (1916).** Robert Millikan spent a decade trying to disprove Einstein's photoelectric equation, finding it "radical" and "reckless." His precision measurements of stopping voltage vs. frequency confirmed Einstein's prediction to high accuracy and gave the most precise value of h at the time. Millikan received the Nobel Prize in 1923 partly for this work.

**HN-P1.4: Stern and Gerlach's fortuitous choice (1922).** Stern and Gerlach initially did not understand their result as demonstrating electron spin (the concept of spin was not proposed until Goudsmit and Uhlenbeck in 1925). They interpreted the two spots as evidence for "space quantisation" of the orbital angular momentum. The fact that silver has l = 0 for its outer electron, making the result a pure spin effect, was only understood later. Gerlach reportedly noticed the two spots only because his cheap cigars contained sulfur, which reacted with the silver deposit to make it visible.

**HN-P1.5: Tonomura's single-electron buildup (1989).** Akira Tonomura and colleagues at Hitachi performed the definitive version of the electron double-slit experiment using an electron biprism and a position-sensitive electron counter. Their beautiful images showing the interference pattern building up one electron at a time were voted "the most beautiful experiment in physics" in a 2002 Physics World poll.

### 10. Problem Set

**PS-P1.01 (Conceptual, Easy):** List the four experiments discussed in this lesson. For each, state: (a) the specific classical prediction that fails, (b) the new quantum concept that the experiment demands.

**PS-P1.02 (Computational, Medium):** The spectral radiance of a blackbody at temperature T is given by the Planck formula u(v,T) = (8pi h v^3 / c^3) / (exp(hv/kT) - 1). (a) Show that in the limit hv << kT, this reduces to the Rayleigh-Jeans formula u(v,T) = 8pi v^2 kT / c^3. (b) Show that in the limit hv >> kT, this reduces to the Wien approximation u(v,T) = (8pi h v^3 / c^3) exp(-hv/kT).

**PS-P1.03 (Computational, Medium):** Derive Wien's displacement law from the Planck distribution. That is, find the frequency v_max at which u(v,T) is maximised and show that v_max is proportional to T. [Hint: differentiate with respect to v, set to zero, and obtain a transcendental equation. The solution is x = hv/kT = 2.821.]

**PS-P1.04 (Computational, Easy):** Light of wavelength 400 nm strikes a cesium surface (phi = 2.1 eV). (a) What is the photon energy in eV? (b) What is the maximum kinetic energy of the emitted photoelectrons? (c) What is the stopping voltage? (d) What is the threshold wavelength for cesium?

**PS-P1.05 (Computational, Medium):** In Millikan's experiment, the stopping voltage V_s is measured as a function of frequency v for a sodium cathode. The data are: v = 6.0 x 10^{14} Hz, V_s = 0.21 V; v = 8.0 x 10^{14} Hz, V_s = 1.04 V; v = 10.0 x 10^{14} Hz, V_s = 1.87 V. (a) Plot V_s vs. v. (b) Determine h/e from the slope. (c) Determine the work function phi. (d) Compare your value of h with the accepted value.

**PS-P1.06 (Computational, Medium):** Neutrons with kinetic energy 0.025 eV (thermal neutrons) are directed at a double slit with slit separation d = 100 micrometres. The detector screen is 5 m away. (a) What is the de Broglie wavelength of the neutrons? (b) What is the fringe spacing? (c) Is this experimentally feasible?

**PS-P1.07 (Computational, Hard):** In a Stern-Gerlach experiment, a beam of hydrogen atoms (ground state, m = 1.67 x 10^{-27} kg) at T = 600 K passes through a magnet with field gradient dB/dz = 50 T/m, length L = 20 cm, followed by a free-flight distance D = 1 m. (a) Calculate the average speed. (b) Calculate the separation between the two spots. (c) By what factor does the separation change if the temperature is doubled?

**PS-P1.08 (Conceptual, Medium):** Explain why increasing the intensity of light below the threshold frequency can never produce photoelectrons, no matter how intense the light is. Your explanation should use the photon model explicitly.

**PS-P1.09 (Conceptual, Hard):** A student claims: "In the double-slit experiment, each electron goes through one slit or the other; we just don't know which one." Critique this claim. What experimental evidence contradicts it? What does the correct quantum description say?

**PS-P1.10 (Conceptual + Simulator, Medium):** Using the Stern-Gerlach simulator, set up a spin-1 particle beam. (a) How many spots appear on the screen? (b) Are they equally spaced? (c) What are the m_J values? (d) If you change to spin-3/2, how many spots do you predict? Verify with the simulator.

**PS-P1.11 (Synthesis, Hard):** Explain why all four experiments in this lesson can be seen as manifestations of a single underlying principle: the discreteness of quantum states. For each experiment, identify what is being discretised (energy levels, photon energy, probability amplitudes, angular momentum component).

**PS-P1.12 (Historical, Easy):** Why was Planck's introduction of energy quanta considered "an act of desperation"? What had he tried before? Why was the physics community initially sceptical?

### 11. Simulator Dependencies

| Simulator | Usage in P1 | Presets |
|-----------|------------|---------|
| Stern-Gerlach (SIM_SG_UI) | Primary. Students explore single SG device with spin-1/2 and spin-1 particles. | Preset P1-SG-1: Single z-axis SG, spin-1/2 beam, N=1000 trials. Preset P1-SG-2: Single z-axis SG, spin-1 beam, N=1000 trials. |
| Double-slit animation (VA-P1.5) | Lesson-specific animation, not a shared simulator. | Built-in. |

The qubit circuit simulator and CHSH simulator are NOT used in P1. The 1D Schrodinger simulator is NOT used in P1.

### 12. Estimates

| Item | Estimate |
|------|----------|
| Prose word count | 10,000--12,000 words |
| Number of equations (display math) | 25--30 |
| Number of inline math expressions | 80--100 |
| Figures and visual assets | 9 (see VA list) |
| Interactive components | 3 (blackbody chart, photoelectric plots, SG simulator) |
| Worked examples | 5 |
| Problem set questions | 12 |
| Estimated development time (prose + equations) | 4 days |
| Estimated development time (visual assets) | 3 days |
| Estimated development time (interactive components) | 2 days |
| Total estimated development time | 9 days |

### 13. Page Splits

P1 is a single-page lesson. No page split is needed. The estimated length (10,000--12,000 words) is within the recommended maximum for a single scrollable lesson page (approximately 15,000 words). The four experiments provide natural section breaks for in-page navigation via a sticky table of contents sidebar.

---

## P2 -- States, Observables, Measurement

**Canonical position:** 5 of 23
**Prerequisites:** A1 (complex numbers), A2 (vectors), A3 (matrices), P1 (why classical physics fails)
**Slug:** `p2-postulates`
**Target length:** 10,000--12,000 words
**Page splits:** Single page (no split)
**Paid:** Yes

### 1. Learning Objectives

By the end of this lesson the student will be able to:

1. **LO-P2.1:** State the five postulates of quantum mechanics precisely (states as vectors in Hilbert space, observables as Hermitian operators, measurement yields eigenvalues, Born rule for probabilities, Schrodinger equation for time evolution) and explain the physical motivation for each.
2. **LO-P2.2:** Represent a quantum state as a normalised vector in a complex Hilbert space, write it in Dirac notation |psi>, compute inner products <phi|psi>, and verify normalisation <psi|psi> = 1.
3. **LO-P2.3:** Given a Hermitian operator A with eigenvalues {a_i} and eigenvectors {|a_i>}, compute the probability of obtaining outcome a_i when measuring observable A on state |psi> using the Born rule: Prob(a_i) = |<a_i|psi>|^2.
4. **LO-P2.4:** Apply the projection postulate: after measuring outcome a_i, the state collapses to the normalised projection P_i |psi> / ||P_i |psi>||, where P_i = |a_i><a_i| (non-degenerate case).
5. **LO-P2.5:** Compute the expectation value of an observable: <A> = <psi|A|psi>, and the variance: (Delta A)^2 = <A^2> - <A>^2.
6. **LO-P2.6:** Determine whether two observables are compatible (commuting) or incompatible (non-commuting), and explain the physical significance: compatible observables can be simultaneously measured with definite values; incompatible observables cannot.
7. **LO-P2.7:** Write the time-evolution postulate i*hbar d|psi>/dt = H|psi> and explain the role of the Hamiltonian as the generator of time evolution.
8. **LO-P2.8:** Use the qubit simulator to prepare specific superposition states, measure in different bases, and verify Born rule probabilities empirically over many trials.
9. **LO-P2.9:** Distinguish between a "pure state" (a single ket |psi>) and a "statistical mixture" (to be formalised later with density matrices), and explain why quantum superposition is fundamentally different from classical ignorance.

### 2. Intuition Arc

**Opening hook (500 words):** Recall the four experiments from P1. Each broke a classical rule. Now we ask: what new rules replace them? Quantum mechanics does not merely patch classical physics -- it replaces the entire framework for describing physical reality. The five postulates are the axioms of this new framework. They are simple, mathematically precise, and (to date) not contradicted by any experiment ever performed.

**Act I -- States as vectors (2,000 words):** Begin with the Stern-Gerlach outcome from P1. A spin-1/2 particle has exactly two possible outcomes for any measurement of spin along an axis. This is naturally modelled by a 2D complex vector space (the student has already met C^2 in A2). A state |psi> = alpha|up> + beta|down> is a superposition. The coefficients alpha and beta are complex probability amplitudes. The state must be normalised: |alpha|^2 + |beta|^2 = 1. Physical states correspond to rays (|psi> and e^{i*theta}|psi> are the same state). Introduce Dirac ket notation. The inner product <phi|psi> is the one from A2. The Hilbert space axiom: the state space of a quantum system is a complex Hilbert space H. For finite-dimensional systems (our focus), H = C^n. Motivate via the Stern-Gerlach result: we need exactly two basis states, so H = C^2.

**Act II -- Observables as Hermitian operators (2,000 words):** What mathematical object represents a physical observable (energy, spin, position)? Requirement 1: measurement outcomes must be real numbers (eigenvalues are real iff the operator is Hermitian -- proved in A3). Requirement 2: measurement outcomes for spin-1/2 along z are +hbar/2 and -hbar/2, so we need an operator with these eigenvalues. The Hermitian matrix S_z = (hbar/2) sigma_z has eigenvalues +/- hbar/2 and eigenvectors |up>, |down>. The spectral theorem (A3/A4) guarantees that any Hermitian operator has a complete orthonormal eigenbasis. Observables = Hermitian operators.

**Act III -- Measurement and the Born rule (2,500 words):** The most revolutionary postulate. When we measure observable A on state |psi>, we do not deterministically get <psi|A|psi>. Instead, we randomly get one of the eigenvalues a_i, with probability Prob(a_i) = |<a_i|psi>|^2. This is the Born rule. After the measurement, the state "collapses" to |a_i> (projection postulate). Work through the SG example: prepare state |+x> = (|up> + |down>)/sqrt(2), measure S_z, get +hbar/2 with probability 1/2 and -hbar/2 with probability 1/2. After getting +hbar/2, the state is now |up>. A second measurement of S_z will give +hbar/2 with certainty. This is experimentally verified. Discuss the irreversibility of measurement and its distinction from unitary evolution. The Born rule is the bridge between the mathematical formalism and experimental outcomes.

**Act IV -- Superposition and incompatible observables (2,000 words):** A state can be a superposition in one basis but a definite state in another basis. |+x> is a superposition of S_z eigenstates but is itself an eigenstate of S_x. Measuring S_z on |+x> gives a random outcome. Measuring S_x on |+x> gives a definite outcome. Two observables are compatible iff they commute: [A, B] = AB - BA = 0. S_x and S_z do not commute: [S_x, S_z] = -i*hbar S_y (not zero). Therefore, you cannot simultaneously know S_x and S_z with certainty. This is the precursor to the uncertainty principle (P5). Compatible observables share a common eigenbasis and can be simultaneously measured.

**Act V -- Time evolution (1,500 words):** Between measurements, the state evolves according to a deterministic, linear equation: i*hbar d|psi>/dt = H|psi>. The Hamiltonian H is a Hermitian operator representing the total energy. The evolution is unitary: U(t) = exp(-iHt/hbar). Unitarity preserves the norm (probabilities sum to 1 at all times) and inner products (distinguishable states remain distinguishable). This is the "quiet, deterministic" part of quantum mechanics. The drama enters only upon measurement. Tease P3: we will derive this equation from first principles.

**Synthesis (500 words):** Summarise the five postulates in a clean numbered list. Emphasise the dual nature of quantum dynamics: smooth, deterministic unitary evolution punctuated by discontinuous, probabilistic measurement. This tension is the measurement problem (addressed in P7).

### 3. Theorems and Proofs (Sketched)

**Theorem P2-T1: Measurement probabilities sum to 1.**
- Let |psi> = sum_i c_i |a_i> where {|a_i>} is an orthonormal eigenbasis of A.
- Prob(a_i) = |c_i|^2. Sum_i |c_i|^2 = <psi|psi> = 1 (since |psi> is normalised).
- Therefore probabilities are well-defined (non-negative and sum to 1).

**Theorem P2-T2: Expectation value formula.**
- <A> = sum_i a_i Prob(a_i) = sum_i a_i |c_i|^2.
- Direct computation: <psi|A|psi> = sum_{i,j} c_j* c_i <a_j|A|a_i> = sum_{i,j} c_j* c_i a_i delta_{ij} = sum_i |c_i|^2 a_i.
- Therefore <A> = <psi|A|psi>.

**Theorem P2-T3: Projection postulate preserves normalisation.**
- After outcome a_i, the unnormalised state is P_i |psi> = c_i |a_i>.
- Norm: ||P_i |psi>||^2 = |c_i|^2 = Prob(a_i).
- Normalised post-measurement state: P_i |psi> / sqrt(Prob(a_i)) = (c_i / |c_i|) |a_i> = e^{i*arg(c_i)} |a_i>, which is physically equivalent to |a_i>.

**Theorem P2-T4: Compatible observables share a common eigenbasis (finite-dimensional case).**
- If [A, B] = 0, then A and B can be simultaneously diagonalised (proved in A4 spectral theorem material).
- Conversely, if A and B share a common eigenbasis, then [A, B] = 0.
- Physical consequence: if [A, B] = 0, measuring A does not disturb the value of B. Both can have definite values simultaneously.

**Theorem P2-T5: Unitary evolution preserves inner products.**
- Let U = exp(-iHt/hbar). Then U^dagger U = I (unitarity).
- <phi(t)|psi(t)> = <phi(0)|U^dagger U|psi(0)> = <phi(0)|psi(0)>.
- In particular, ||psi(t)||^2 = ||psi(0)||^2 = 1. Probabilities are conserved.

### 4. Historical Experiments with Apparatus Descriptions

**Experiment 1: Sequential Stern-Gerlach measurements (1920s conceptual, modern realisations)**

*Apparatus:* Three Stern-Gerlach devices in series. SG-1 is oriented along z (selects spin-up in z). The spin-up beam from SG-1 enters SG-2, oriented along x. SG-2 splits this beam into spin-up-x and spin-down-x. One of these beams (say spin-up-x) enters SG-3, oriented along z again.

*Classical prediction:* If the particle "had" a definite z-spin after SG-1, it should retain that value. SG-3 should give spin-up-z with certainty.

*Actual result (quantum prediction):* SG-3 gives spin-up-z with probability 1/2 and spin-down-z with probability 1/2. The intervening x-measurement "reset" the z-spin information. This is because |+x> = (|up> + |down>)/sqrt(2), so measuring z on |+x> gives either outcome with equal probability.

*Implications:* Measurement of an incompatible observable (S_x) destroys information about a previously known observable (S_z). This is not a limitation of the apparatus -- it is a fundamental feature of quantum mechanics.

**Experiment 2: Photon polarisation (Malus's law, quantum version)**

*Apparatus:* A single-photon source (e.g., spontaneous parametric down-conversion crystal producing heralded single photons). The photon passes through a polarising beam splitter (PBS) oriented at angle theta to the vertical. Two single-photon detectors (avalanche photodiodes, APDs) are placed at the two output ports of the PBS.

*Setup:* Prepare a photon polarised vertically (|V>). Send it through a PBS at angle theta to vertical.

*Classical prediction (wave):* The transmitted intensity is I cos^2(theta) (Malus's law). But this describes many photons (average). For a single photon, classical physics has nothing to say.

*Quantum prediction and result:* The photon is detected in one port or the other -- never split. Probability of transmission = cos^2(theta). Probability of reflection = sin^2(theta). Over many trials, the statistics reproduce Malus's law. This is the Born rule in action for a two-state system (photon polarisation is isomorphic to spin-1/2).

*Implications:* Polarisation is a quantum observable. A single photon does not have "partial" polarisation -- it is transmitted or reflected, with probabilities given by the Born rule. This is the optical realisation of the qubit (cross-reference C1).

### 5. Visual Assets

**VA-P2.1: Postulates summary card.**
- Type: Styled HTML/CSS card with KaTeX.
- Description: A visually prominent card listing all five postulates in concise mathematical form. Each postulate is numbered and colour-coded. This card should be "pinnable" (sticky scroll or modal) so students can reference it while reading the rest of the lesson.
- File: `postulates-card.tsx`

**VA-P2.2: Bloch sphere visualisation.**
- Type: Interactive 3D (Three.js or similar).
- Description: A unit sphere where the north pole is |0> (spin-up) and the south pole is |1> (spin-down). An arrow (state vector) can be dragged to any point on the sphere. Below the sphere, the corresponding state |psi> = cos(theta/2)|0> + e^{i*phi} sin(theta/2)|1> is displayed in real time. When the student clicks "Measure Z," the arrow snaps to the north or south pole with the correct probability. When the student clicks "Measure X," the arrow snaps to +x or -x on the equator.
- File: `bloch-sphere-interactive.tsx`
- Dependencies: Three.js (or React Three Fiber).

**VA-P2.3: Sequential SG diagram.**
- Type: Static SVG or animated diagram.
- Description: Three SG devices in series (z, x, z). The beam path is shown splitting at each device. Probability labels (1/2, 1/2) are shown at each split. A "blocked beam" indicator shows which outputs are selected/discarded. An animation mode replays the experiment with 100 simulated particles, showing the statistical distribution building up at the final screen.
- File: `sequential-sg-diagram.tsx`

**VA-P2.4: Born rule histogram.**
- Type: Interactive chart.
- Description: The student selects a state |psi> (via the Bloch sphere or a dropdown of preset states) and a measurement basis (Z, X, Y, or custom angle). The chart shows the theoretical probabilities as bars alongside an empirically accumulated histogram from repeated simulated measurements. A "Run N trials" button adds N measurements to the histogram. Students can verify that the histogram converges to the Born rule predictions.
- File: `born-rule-histogram.tsx`

**VA-P2.5: Compatible vs incompatible observables diagram.**
- Type: Static SVG with annotations.
- Description: Two side-by-side panels. (Left) Compatible observables: two commuting matrices shown with shared eigenvectors; a Venn diagram showing simultaneous eigenspaces. (Right) Incompatible observables: two non-commuting matrices shown with different eigenvectors rotated with respect to each other; an illustration showing that measuring one "rotates" the state out of the other's eigenspace.
- File: `compatible-incompatible-observables.svg`

**VA-P2.6: Qubit simulator embed.**
- Type: Interactive simulator (SIM_QUBIT_UI component).
- Description: The qubit circuit simulator from simulator-spec.md. In this lesson, the presets allow: (a) prepare a qubit in |0> or |+> or any Bloch sphere state, (b) apply a measurement gate (Z-basis or X-basis), (c) read the outcome, (d) repeat many times to build statistics. Advanced preset: apply a gate (e.g., Hadamard) then measure, verifying the Born rule.
- File: Embedded `<QubitCircuitSim />` component with lesson-specific presets.
- Dependencies: SIM_CORE, SIM_QUBIT_UI.

**VA-P2.7: Measurement collapse animation.**
- Type: Canvas animation.
- Description: A state vector (arrow) in a 2D complex plane (projected to real components for visualisation) is shown as a superposition. Upon "measurement," the arrow dramatically collapses (animated over 0.5 s) to one of the eigenvectors, with the probability proportional to the squared projection. The discarded component fades out. Can be replayed.
- File: `measurement-collapse-animation.tsx`

### 6. Worked Examples

**WE-P2.1: Spin measurement probabilities.**

*Problem:* A spin-1/2 particle is prepared in the state |psi> = (1/sqrt(3))|up> + (sqrt(2)/sqrt(3)) e^{i*pi/4}|down>. (a) Verify that |psi> is normalised. (b) What is the probability of measuring S_z = +hbar/2? (c) What is the probability of measuring S_z = -hbar/2? (d) What is the expectation value <S_z>?

*Solution:*
(a) <psi|psi> = |1/sqrt(3)|^2 + |sqrt(2)/sqrt(3)|^2 = 1/3 + 2/3 = 1. Normalised.

(b) Prob(+hbar/2) = |<up|psi>|^2 = |1/sqrt(3)|^2 = 1/3.

(c) Prob(-hbar/2) = |<down|psi>|^2 = |sqrt(2)/sqrt(3) e^{i*pi/4}|^2 = 2/3. (The complex phase drops out.)

(d) <S_z> = (+hbar/2)(1/3) + (-hbar/2)(2/3) = hbar/2 (1/3 - 2/3) = -hbar/6.

*Key insight:* The global phase of each component does not affect probabilities. Only relative phases matter (and they matter for measurements in other bases).

**WE-P2.2: Measurement in a rotated basis.**

*Problem:* A qubit is prepared in state |0> (spin-up in z). It is measured in the x-basis, i.e., the eigenstates of S_x are |+x> = (|0> + |1>)/sqrt(2) and |-x> = (|0> - |1>)/sqrt(2). (a) What is the probability of outcome +hbar/2 (i.e., |+x>)? (b) After obtaining +hbar/2 in the x-measurement, what is the state? (c) If we now measure S_z, what are the probabilities?

*Solution:*
(a) Express |0> in the x-basis: |0> = (|+x> + |-x>)/sqrt(2) (verify by substitution). Prob(+x) = |<+x|0>|^2 = |1/sqrt(2)|^2 = 1/2.

(b) After outcome +x, the state collapses to |+x> = (|0> + |1>)/sqrt(2).

(c) Prob(S_z = +hbar/2) = |<0|+x>|^2 = |1/sqrt(2)|^2 = 1/2. Prob(S_z = -hbar/2) = |<1|+x>|^2 = 1/2. The x-measurement has completely randomised the z-component. This is the sequential SG phenomenon.

**WE-P2.3: Expectation value and variance.**

*Problem:* A qubit is in state |psi> = cos(pi/8)|0> + sin(pi/8)|1>. Compute (a) <S_z>, (b) <S_z^2>, (c) the variance (Delta S_z)^2, (d) the standard deviation Delta S_z.

*Solution:*
(a) <S_z> = (hbar/2)[cos^2(pi/8) - sin^2(pi/8)] = (hbar/2) cos(pi/4) = (hbar/2)(sqrt(2)/2) = hbar*sqrt(2)/4.

Numerically: hbar = 1.055 x 10^{-34} J s, so <S_z> = 1.055 x 10^{-34} x 0.3536 = 3.73 x 10^{-35} J s.

(b) S_z^2 = (hbar/2)^2 I (since (hbar/2 sigma_z)^2 = (hbar/2)^2 I). Therefore <S_z^2> = (hbar/2)^2 = hbar^2/4.

(c) (Delta S_z)^2 = <S_z^2> - <S_z>^2 = hbar^2/4 - hbar^2 * 2/16 = hbar^2/4 - hbar^2/8 = hbar^2/8.

(d) Delta S_z = hbar / (2 sqrt(2)).

*Key insight:* S_z^2 = (hbar/2)^2 I for any spin-1/2 system, so <S_z^2> is always hbar^2/4 regardless of the state. The variance depends only on how "tilted" the state is away from the z-axis.

**WE-P2.4: Verifying the Born rule with the simulator.**

*Problem (Simulator-based):* Use the qubit simulator to prepare the state |psi> = cos(pi/6)|0> + sin(pi/6)|1> = (sqrt(3)/2)|0> + (1/2)|1>. (a) Predict the probabilities for a Z-measurement. (b) Run 100 measurements and record the fraction of |0> outcomes. (c) Run 1000 measurements and compare. (d) How close are the empirical frequencies to the Born rule prediction?

*Solution:*
(a) Prob(|0>) = cos^2(pi/6) = 3/4 = 0.75. Prob(|1>) = sin^2(pi/6) = 1/4 = 0.25.

(b) [Students perform in simulator.] Typical result: 72-78 out of 100 are |0>.

(c) Typical result: 740-760 out of 1000 are |0>. The empirical frequency converges to 0.75.

(d) Expected standard deviation for N = 1000: sqrt(p(1-p)/N) = sqrt(0.75 x 0.25 / 1000) = sqrt(1.875 x 10^{-4}) = 0.0137. So we expect the empirical frequency to be within about 0.014 of 0.75 (95% of the time within 0.027). The Born rule is confirmed.

### 7. Common Confusions

**CC-P2.1: "Superposition means the particle is in both states at once."**
This popular-science phrasing is misleading. A superposition |psi> = alpha|0> + beta|1> is a single, definite quantum state -- it is not "both |0> and |1> at the same time" in any classical sense. The superposition is the state. It only becomes one or the other upon measurement, with the probabilities given by the Born rule. The phrase "both at once" smuggles in a classical picture where the particle must be in one definite state. Quantum mechanics replaces that classical picture entirely.

**CC-P2.2: "Measurement reveals a pre-existing value."**
This is the "hidden variables" assumption. The Bell theorem (P6) will show that, under very general assumptions, measurement outcomes in quantum mechanics are not revealing pre-existing definite values. Before measurement, the observable simply does not have a definite value (in the standard interpretation). This is not a limitation of our knowledge -- it is a feature of quantum ontology.

**CC-P2.3: "The wave function 'collapses' instantaneously everywhere."**
The projection postulate is indeed mathematically discontinuous and non-local (the entire state vector is updated). This has troubled physicists since the 1920s and is the core of the measurement problem (P7). The key point for now: the collapse postulate is a rule for updating our description of the system after measurement, not a physical process propagating through space. No information or energy is transmitted by collapse (no-signalling theorem, P6).

**CC-P2.4: "Complex phases don't matter."**
Global phases (multiplying the entire state by e^{i*theta}) are indeed unobservable. But relative phases between components of a superposition are physically meaningful. The states |0> + |1> and |0> - |1> have different relative phases and give different measurement statistics in the x-basis (one is |+x>, the other is |-x>). Students frequently ignore phases when computing probabilities in the z-basis (where they drop out) and then incorrectly assume they never matter.

**CC-P2.5: "Hermitian operators are just a mathematical convenience."**
Students sometimes view the Hermitian requirement as an arbitrary mathematical choice. It is physically motivated: measurement outcomes must be real numbers (you can't measure an imaginary energy), and the spectral theorem guarantees that Hermitian operators have (a) real eigenvalues and (b) a complete orthonormal eigenbasis. Both are essential for the probability interpretation to work. The Hermiticity requirement is a physical constraint, not a convention.

**CC-P2.6: "After measurement, the state is always an eigenstate."**
This is true for non-degenerate eigenvalues but needs qualification for degenerate eigenvalues. If eigenvalue a has a degenerate eigenspace of dimension > 1, the state is projected onto that eigenspace, not onto a specific eigenvector within it. The post-measurement state is the normalised projection of |psi> onto the eigenspace. This distinction matters for continuous-spectrum observables (position, momentum) and for composite systems.

### 8. Cross-References

| Reference | Direction | Description |
|-----------|-----------|-------------|
| A2 (Vectors) | backward | Hilbert space = complex vector space with inner product. Dirac notation built on A2's bra-ket introduction. |
| A3 (Matrices) | backward | Hermitian operators, eigenvalues, spectral theorem. All linear-algebra machinery used here. |
| P1 (Classical Failures) | backward | All four experiments motivate the postulates. SG motivates discrete states and Born rule. |
| C1 (The Qubit) | forward | The qubit is the simplest quantum system; the postulates applied to C^2 give the qubit formalism. |
| C2 (Measurement in Computing) | forward | Measurement postulate applied to multi-qubit systems; computational basis measurement. |
| P3 (Schrodinger Equation) | forward | The time-evolution postulate (Postulate 5) is derived from first principles. |
| P4 (Spin-1/2 and Pauli Matrices) | forward | Spin observables (Pauli matrices) provide the concrete realisation of the abstract postulates. |
| P5 (Uncertainty Principle) | forward | Incompatible observables ([A,B] != 0) lead to the uncertainty relation. |
| P6 (Bell/CHSH) | forward | The Born rule and projection postulate lead to Bell inequality violations. |
| P7 (Decoherence) | forward | The measurement problem (tension between Postulates 4 and 5) is the central topic. |
| A4 (Eigenvalues/Spectral Theorem) | forward | The spectral theorem is used implicitly here; its full proof is in A4. Students needing rigour should consult A4. |

### 9. Historical Notes

**HN-P2.1: Dirac's "The Principles of Quantum Mechanics" (1930).** Paul Dirac's textbook was the first to present quantum mechanics axiomatically, using the bra-ket notation he invented. The notation <phi|psi> was designed to visually split the inner product into a "bra" <phi| and a "ket" |psi>. Dirac was 28 years old when the first edition appeared.

**HN-P2.2: Von Neumann's axiomatisation (1932).** John von Neumann's "Mathematical Foundations of Quantum Mechanics" placed the postulates on rigorous mathematical footing using Hilbert space theory. Von Neumann introduced the projection postulate (often called the "von Neumann projection" or "collapse postulate") and proved the first no-hidden-variables theorem (later refined by Bell and Kochen-Specker).

**HN-P2.3: Born's probabilistic interpretation (1926).** Max Born proposed that the wave function psi gives probability amplitudes, not probabilities directly: Prob = |psi|^2. This was initially controversial -- Einstein famously objected, "God does not play dice." Born received the Nobel Prize in 1954 for this interpretation, 28 years after proposing it.

**HN-P2.4: The Bohr-Einstein debates (1927-1935).** At the 1927 Solvay Conference, Einstein challenged Bohr with increasingly ingenious thought experiments designed to show that quantum mechanics was incomplete. Bohr refuted each one. The debate culminated in the 1935 EPR paper (P6). These debates shaped the conceptual foundations of quantum mechanics more than any other intellectual exchange in 20th-century physics.

**HN-P2.5: The "measurement problem" (ongoing).** The tension between unitary evolution (Postulate 5) and the projection postulate (Postulate 4) was noted from the beginning. Schrodinger's cat (1935) dramatised it. The measurement problem remains unresolved to this day and is the subject of P7. As John Bell put it: "The word 'measurement' should be banned from quantum mechanics."

### 10. Problem Set

**PS-P2.01 (Computational, Easy):** A qubit is in state |psi> = (3/5)|0> + (4/5)|1>. (a) Is this state normalised? (b) What are the probabilities of measuring |0> and |1> in the Z-basis? (c) What is the expectation value <sigma_z>?

**PS-P2.02 (Computational, Medium):** A qubit is in state |psi> = (1/sqrt(2))|0> + (i/sqrt(2))|1>. (a) Compute the probabilities for Z-measurement. (b) Express |psi> in the X-basis {|+x>, |-x>} and compute the probabilities for X-measurement. (c) Express |psi> in the Y-basis {|+y>, |-y>} where |+y> = (|0> + i|1>)/sqrt(2) and |-y> = (|0> - i|1>)/sqrt(2), and compute the probabilities for Y-measurement.

**PS-P2.03 (Computational, Medium):** Verify that [sigma_x, sigma_z] != 0 by explicit matrix multiplication. Compute the commutator [sigma_x, sigma_z] and express the result in terms of Pauli matrices. What does this imply about simultaneous measurement of S_x and S_z?

**PS-P2.04 (Conceptual, Medium):** A student claims: "If I prepare many copies of |psi> = |+x> and measure S_z on each, I get +hbar/2 half the time and -hbar/2 half the time. This is the same as flipping a fair coin. Therefore |+x> is the same as a classical 50-50 mixture of |up> and |down>." Explain precisely why this reasoning is wrong. [Hint: consider what happens when you measure S_x instead of S_z.]

**PS-P2.05 (Computational, Hard):** A spin-1/2 particle is prepared in state |psi> = cos(theta/2)|0> + e^{i*phi} sin(theta/2)|1>. (a) Compute <sigma_x>, <sigma_y>, <sigma_z> as functions of theta and phi. (b) Show that <sigma_x>^2 + <sigma_y>^2 + <sigma_z>^2 = 1. (c) Interpret geometrically using the Bloch sphere.

**PS-P2.06 (Computational, Medium):** An observable A has eigenvalues a_1 = +1, a_2 = -1 with eigenvectors |a_1> = (cos alpha, sin alpha)^T, |a_2> = (-sin alpha, cos alpha)^T. A qubit is prepared in state |0>. (a) Compute Prob(a_1) and Prob(a_2) as functions of alpha. (b) For what value of alpha are the probabilities equal? (c) Compute the expectation value <A>.

**PS-P2.07 (Conceptual, Hard):** Explain the difference between the following three scenarios: (1) A qubit is in state |+x> = (|0> + |1>)/sqrt(2). (2) A qubit is in state |0> with probability 1/2 or state |1> with probability 1/2 (classical mixture). (3) A qubit is in state |+y> = (|0> + i|1>)/sqrt(2). For each scenario, compute the probabilities for measurements in the Z, X, and Y bases. Which scenarios are experimentally distinguishable?

**PS-P2.08 (Simulator, Easy):** Using the qubit simulator, prepare the state |+x>. Run 500 Z-measurements. Record the number of |0> and |1> outcomes. Compute the empirical frequency of |0>. Is it consistent with the Born rule prediction?

**PS-P2.09 (Computational, Medium):** Show that the time-evolution operator U(t) = exp(-i*H*t/hbar) is unitary when H is Hermitian. [Hint: compute U^dagger U using the fact that (e^A)^dagger = e^{A^dagger}.]

**PS-P2.10 (Conceptual, Medium):** List the five postulates of quantum mechanics. For each postulate, name one experiment from P1 that motivates or illustrates it.

**PS-P2.11 (Computational, Hard):** A qubit is prepared in state |psi> = (1/sqrt(3))|0> + sqrt(2/3) |1>. (a) It is measured in the Z-basis and outcome |0> is obtained. What is the post-measurement state? (b) Starting again from |psi>, it is measured in the X-basis and outcome |+x> is obtained. What is the post-measurement state? (c) Starting from the post-measurement state in (b), it is now measured in the Z-basis. What are the probabilities of |0> and |1>?

**PS-P2.12 (Synthesis, Hard):** Explain why quantum mechanics requires complex numbers, not just real numbers. [Hint: consider a spin-1/2 particle and rotations about different axes. Or consider the commutation relations of the Pauli matrices.] Cross-reference A1 for the mathematical properties of C.

### 11. Simulator Dependencies

| Simulator | Usage in P2 | Presets |
|-----------|------------|---------|
| Qubit Circuit Simulator (SIM_QUBIT_UI) | Primary. Students prepare states, apply gates, and measure to verify the Born rule and projection postulate. | Preset P2-Q-1: Prepare |0>, measure Z. Preset P2-Q-2: Prepare |0>, apply H gate, measure Z. Preset P2-Q-3: Prepare |0>, apply H gate, measure X. Preset P2-Q-4: Custom state preparation via Bloch sphere angles. |
| Stern-Gerlach (SIM_SG_UI) | Supporting. Used to illustrate sequential measurements (z-x-z configuration). | Preset P2-SG-1: Three sequential SG devices (z, x, z). |

The CHSH simulator and 1D Schrodinger simulator are NOT used in P2.

### 12. Estimates

| Item | Estimate |
|------|----------|
| Prose word count | 10,000--12,000 words |
| Number of equations (display math) | 30--40 |
| Number of inline math expressions | 120--150 |
| Figures and visual assets | 7 (see VA list) |
| Interactive components | 4 (Bloch sphere, Born rule histogram, qubit simulator, measurement collapse animation) |
| Worked examples | 4 |
| Problem set questions | 12 |
| Estimated development time (prose + equations) | 4 days |
| Estimated development time (visual assets) | 3 days |
| Estimated development time (interactive components) | 3 days |
| Total estimated development time | 10 days |

### 13. Page Splits

P2 is a single-page lesson. The estimated length (10,000--12,000 words) is within the single-page limit. The five postulates provide natural section breaks for the sticky sidebar navigation. The postulates summary card (VA-P2.1) acts as a persistent reference panel.

---

## P3 -- The Schrodinger Equation

**Canonical position:** 9 of 23
**Prerequisites:** A1 (complex numbers), A2 (vectors), A3 (matrices), A4 (eigenvalues and spectral theorem), P1 (classical failures), P2 (postulates)
**Slug:** `p3-schrodinger-equation`
**Target length:** 20,000--25,000 words
**Page splits:** 3 pages (see Section 13)
**Paid:** Yes

### 1. Learning Objectives

By the end of this lesson the student will be able to:

1. **LO-P3.1:** Derive the time-dependent Schrodinger equation (TDSE) from the requirements that time evolution be (a) linear, (b) deterministic, (c) norm-preserving, showing that these conditions force the evolution operator to be unitary and its infinitesimal generator to be Hermitian, yielding i*hbar d|psi>/dt = H|psi>.
2. **LO-P3.2:** Solve the TDSE for time-independent Hamiltonians by writing U(t) = exp(-iHt/hbar), and explain why energy eigenstates are "stationary states" whose probability distributions do not change in time.
3. **LO-P3.3:** Separate the TDSE into the time-independent Schrodinger equation (TISE) H|psi> = E|psi> and explain that finding energy eigenstates reduces quantum dynamics to a linear algebra (or differential equation) eigenvalue problem.
4. **LO-P3.4:** Solve the infinite square well (particle in a box) from scratch: impose boundary conditions, derive the quantised energy levels E_n = n^2 pi^2 hbar^2 / (2mL^2), write the normalised wave functions, and sketch the first several eigenstates.
5. **LO-P3.5:** Describe the quantum harmonic oscillator, state its energy levels E_n = hbar*omega*(n + 1/2), sketch the wave functions, and explain the physical significance of the zero-point energy.
6. **LO-P3.6:** Analyse scattering from a step potential: set up the piecewise TISE, apply boundary conditions (continuity of psi and dpsi/dx), derive transmission and reflection coefficients, and explain quantum tunnelling for E < V_0.
7. **LO-P3.7:** Use the 1D Schrodinger simulator to visualise time evolution of wave packets, observe stationary states, study tunnelling through barriers, and explore the relationship between energy eigenstates and time-dependent behaviour.
8. **LO-P3.8:** Explain the physical interpretation of the Hamiltonian as the total energy operator (kinetic + potential) and write H = p^2/(2m) + V(x) in the position representation as -hbar^2/(2m) d^2/dx^2 + V(x).
9. **LO-P3.9:** Compute the time evolution of a general state by expanding in energy eigenstates: |psi(t)> = sum_n c_n e^{-iE_n t/hbar} |n>, and explain how interference between different energy components produces wave packet dynamics (spreading, oscillation, revival).
10. **LO-P3.10:** State the continuity equation for probability: d(rho)/dt + d(j)/dx = 0, identify the probability density rho = |psi|^2 and the probability current j = (hbar/2mi)(psi* dpsi/dx - psi dpsi*/dx), and explain their physical meaning.

### 2. Intuition Arc

This is a major lesson spanning three pages. The arc is divided accordingly.

**PAGE 1: Derivation of the Schrodinger equation and the time-independent form.**

**Opening hook (500 words):** In P2 we stated the time-evolution postulate as an axiom. Now we derive it from first principles. The question: what is the most general law of time evolution consistent with the structure of quantum mechanics? The answer turns out to be unique (up to the choice of Hamiltonian). This is remarkable -- the equation is not guessed or postulated; it is the only possibility.

**Act I -- What must time evolution look like? (2,500 words):** Start from the postulates of P2. The state is a vector |psi(t)> in Hilbert space. Time evolution must be: (a) Linear -- if |psi> evolves to |psi'> and |phi> evolves to |phi'>, then alpha|psi> + beta|phi> must evolve to alpha|psi'> + beta|phi'>. This is because superposition is a fundamental feature: a sum of solutions must be a solution. (b) Deterministic between measurements -- given |psi(0)>, the state |psi(t)> is uniquely determined. (c) Norm-preserving -- <psi(t)|psi(t)> = 1 for all t, since total probability must be conserved. Together, (a) and (b) mean there exists a linear operator U(t) such that |psi(t)> = U(t)|psi(0)>. Condition (c) means U(t)^dagger U(t) = I, i.e., U(t) is unitary. The group property U(t1+t2) = U(t1)U(t2) (time-translation invariance) plus continuity forces U(t) = exp(-iKt) for some Hermitian K (Stone's theorem). Write K = H/hbar and we get U(t) = exp(-iHt/hbar). Differentiating: i*hbar d|psi>/dt = H|psi>. This is the Schrodinger equation. The derivation emphasises that the equation is not a guess but a mathematical consequence of linearity, unitarity, and time-translation invariance. H is identified with the energy operator by correspondence with classical mechanics.

**Act II -- Stationary states and the TISE (2,500 words):** If H is time-independent, seek solutions of the form |psi(t)> = e^{-iEt/hbar} |E> where H|E> = E|E>. These are stationary states: the probability distribution |<x|psi(t)>|^2 = |<x|E>|^2 is time-independent (the complex phase cancels). The TISE H|E> = E|E> is an eigenvalue problem. In the position representation for a particle in one dimension: [-hbar^2/(2m) d^2/dx^2 + V(x)] psi(x) = E psi(x). General solutions are superpositions: |psi(t)> = sum_n c_n e^{-iE_n t/hbar} |E_n>. Time-dependent behaviour arises from interference between different energy components -- the relative phases e^{-i(E_n - E_m)t/hbar} oscillate at frequencies (E_n - E_m)/hbar. The Hamiltonian in position representation: H = T + V = p^2/(2m) + V(x), where p = -i*hbar d/dx (momentum operator in position space).

**Act III -- Probability current (1,500 words):** Derive the continuity equation. Start from |psi(x,t)|^2, differentiate with respect to time, use the TDSE and its conjugate, and obtain d(rho)/dt + d(j)/dx = 0 where rho = |psi|^2 and j = (hbar/2mi)(psi* dpsi/dx - psi dpsi*/dx). Interpret: probability is locally conserved -- it flows like a fluid. This is the quantum analogue of charge conservation in electrodynamics. The probability current will be essential for scattering problems.

**PAGE 2: The infinite square well and the harmonic oscillator.**

**Act IV -- Particle in a box (3,500 words):** The simplest non-trivial TISE. V(x) = 0 for 0 < x < L, V(x) = infinity outside. Inside: -hbar^2/(2m) psi'' = E psi, giving psi(x) = A sin(kx) + B cos(kx) with k = sqrt(2mE)/hbar. Boundary conditions psi(0) = 0 forces B = 0. Boundary condition psi(L) = 0 forces sin(kL) = 0, so kL = n*pi, n = 1, 2, 3, ... Therefore E_n = n^2 pi^2 hbar^2 / (2mL^2). Normalisation: integral_0^L |A|^2 sin^2(n*pi*x/L) dx = 1 gives A = sqrt(2/L). Plot the first five wave functions. Discuss: (a) energy is quantised (only discrete values allowed), (b) zero-point energy E_1 > 0 (the particle can never be at rest -- uncertainty principle connection), (c) the number of nodes increases with n, (d) the probability distribution approaches the classical uniform distribution for large n (correspondence principle). Use the 1D Schrodinger simulator to visualise eigenstates and time evolution of wave packets inside the box.

**Act V -- Quantum harmonic oscillator (3,500 words):** V(x) = (1/2) m omega^2 x^2. The TISE becomes -hbar^2/(2m) psi'' + (1/2) m omega^2 x^2 psi = E psi. State (without full derivation, which uses Hermite polynomials) that the energy levels are E_n = hbar*omega*(n + 1/2), n = 0, 1, 2, ... Key features: (a) equally spaced levels (unlike the box), (b) zero-point energy E_0 = hbar*omega/2, (c) wave functions are Gaussians multiplied by Hermite polynomials: psi_n(x) = (m*omega/(pi*hbar))^{1/4} (1/sqrt(2^n n!)) H_n(xi) exp(-xi^2/2) where xi = sqrt(m*omega/hbar) x. Plot the first five. The harmonic oscillator is fundamental because any smooth potential near a minimum looks quadratic (Taylor expansion). It appears everywhere: molecular vibrations, phonons, electromagnetic field modes, quantum field theory. The equally spaced energy levels explain Planck's quantisation hypothesis from P1 -- each mode of the electromagnetic field is a harmonic oscillator, and its energy is quantised in units of hbar*omega. This closes the circle: the very first quantum hypothesis is now derived from the Schrodinger equation.

**PAGE 3: Step potential, tunnelling, and wave packet dynamics.**

**Act VI -- Step potential and scattering (3,500 words):** V(x) = 0 for x < 0, V(x) = V_0 for x > 0. Case 1: E > V_0. The TISE has solutions psi(x) = A e^{ik_1 x} + B e^{-ik_1 x} for x < 0 (incident + reflected) and psi(x) = C e^{ik_2 x} for x > 0 (transmitted), where k_1 = sqrt(2mE)/hbar, k_2 = sqrt(2m(E-V_0))/hbar. Boundary conditions at x = 0: psi continuous (A + B = C) and psi' continuous (ik_1(A - B) = ik_2 C). Solve: B/A = (k_1 - k_2)/(k_1 + k_2), C/A = 2k_1/(k_1 + k_2). Reflection coefficient R = |B/A|^2, transmission coefficient T = (k_2/k_1)|C/A|^2. Verify R + T = 1. Key point: even for E > V_0, there is partial reflection -- a purely quantum effect with no classical analogue (classically, a particle with E > V_0 always passes over the step). Case 2: E < V_0. k_2 becomes imaginary: k_2 = i*kappa where kappa = sqrt(2m(V_0 - E))/hbar. The wave function for x > 0 is psi(x) = C e^{-kappa x}, an exponentially decaying evanescent wave. Classically, the particle cannot be in the region x > 0 (it does not have enough energy). Quantum mechanically, there is a nonzero probability of finding it there, decaying exponentially with penetration depth 1/kappa. This is the precursor to tunnelling.

**Act VII -- Tunnelling through a barrier (2,500 words):** Extend to a rectangular barrier: V(x) = V_0 for 0 < x < a, V(x) = 0 elsewhere. For E < V_0, the transmission coefficient is T approx (16 E(V_0 - E)/V_0^2) exp(-2*kappa*a) for kappa*a >> 1. The exponential suppression exp(-2*kappa*a) means tunnelling is significant only when the barrier is thin or the particle is light. Applications: alpha decay (Gamow, 1928), scanning tunnelling microscope (Binnig & Rohrer, 1981), quantum computing (Josephson junctions). Use the 1D Schrodinger simulator to send a wave packet at a barrier and watch part of it tunnel through while part reflects.

**Act VIII -- Wave packet dynamics (2,500 words):** A general state is a superposition of energy eigenstates. A Gaussian wave packet psi(x,0) = (2*pi*sigma^2)^{-1/4} exp(ik_0 x) exp(-x^2/(4 sigma^2)) represents a particle localised near x = 0 with average momentum hbar*k_0 and position uncertainty sigma. Time evolution: each Fourier component acquires a phase factor exp(-iE(k)t/hbar). For a free particle E(k) = hbar^2 k^2 / (2m) (quadratic dispersion), the wave packet spreads: sigma(t) = sigma sqrt(1 + (hbar t / (2m sigma^2))^2). The spreading timescale is t_spread = 2m sigma^2 / hbar. For an electron with sigma = 1 nm: t_spread approx 10^{-16} s (extremely fast). For a baseball with sigma = 1 mm: t_spread approx 10^{28} s (effectively infinite -- classical behaviour). The correspondence principle: macroscopic objects have negligible quantum spreading. Use the simulator to watch wave packet spreading in real time, and compare free evolution with evolution in a harmonic potential (where the wave packet oscillates without spreading).

**Synthesis (1,000 words):** The Schrodinger equation is the dynamical law of quantum mechanics. From three simple requirements (linearity, determinism, norm preservation) we derived a unique equation. Its solutions -- energy eigenstates -- are found by solving an eigenvalue problem. The particle-in-a-box and harmonic oscillator are the paradigmatic examples. Scattering problems reveal quantum tunnelling. Wave packet dynamics connect the quantum formalism to the classical world via the correspondence principle. The Schrodinger equation is the foundation for everything that follows: spin dynamics (P4), uncertainty relations (P5), entanglement (P6), and all of quantum computing.

### 3. Theorems and Proofs (Sketched)

**Theorem P3-T1: Derivation of the Schrodinger equation from linearity, determinism, and norm preservation.**
- Time evolution is a linear map: |psi(t)> = U(t)|psi(0)>.
- Norm preservation: <psi(t)|psi(t)> = <psi(0)|U(t)^dagger U(t)|psi(0)> = <psi(0)|psi(0)> for all |psi(0)>. This forces U(t)^dagger U(t) = I, i.e., U is unitary.
- Group property: U(t_1 + t_2) = U(t_1) U(t_2) and U(0) = I.
- Continuity: U(t) is continuous in t.
- By Stone's theorem (for finite dimension: differentiate U(t+epsilon) = U(epsilon) U(t) at epsilon = 0): U(epsilon) = I - i*epsilon*K + O(epsilon^2) for some operator K. Unitarity of U(epsilon) forces K to be Hermitian: (I + i*epsilon*K^dagger)(I - i*epsilon*K) = I implies K^dagger = K.
- Therefore d|psi>/dt = -iK|psi>. Define H = hbar K, giving i*hbar d|psi>/dt = H|psi>.
- H is Hermitian, so its eigenvalues (energies) are real.

**Theorem P3-T2: Stationary states have time-independent probability distributions.**
- Let |psi(t)> = e^{-iEt/hbar} |E> where H|E> = E|E>.
- Probability of finding the particle in a region: integral_R |<x|psi(t)>|^2 dx = integral_R |e^{-iEt/hbar} <x|E>|^2 dx = integral_R |<x|E>|^2 dx.
- The phase factor e^{-iEt/hbar} has modulus 1, so it drops out.
- All expectation values are time-independent: <psi(t)|A|psi(t)> = <E|e^{iEt/hbar} A e^{-iEt/hbar}|E> = <E|A|E> (for time-independent A).

**Theorem P3-T3: Energy eigenvalues of the infinite square well.**
- TISE inside the box: -hbar^2/(2m) psi''(x) = E psi(x), with psi(0) = psi(L) = 0.
- General solution: psi(x) = A sin(kx) + B cos(kx), k = sqrt(2mE)/hbar.
- psi(0) = 0 implies B = 0.
- psi(L) = 0 implies A sin(kL) = 0. Since A != 0 (non-trivial solution), sin(kL) = 0, so kL = n*pi.
- k_n = n*pi/L, E_n = hbar^2 k_n^2 / (2m) = n^2 pi^2 hbar^2 / (2mL^2), n = 1, 2, 3, ...
- Normalisation: integral_0^L (2/L) sin^2(n*pi*x/L) dx = 1, giving psi_n(x) = sqrt(2/L) sin(n*pi*x/L).

**Theorem P3-T4: Reflection and transmission at a step potential (E > V_0).**
- TISE: for x < 0, psi'' + k_1^2 psi = 0 with k_1 = sqrt(2mE)/hbar.
- For x > 0, psi'' + k_2^2 psi = 0 with k_2 = sqrt(2m(E-V_0))/hbar.
- Solutions: psi_L = A e^{ik_1 x} + B e^{-ik_1 x}, psi_R = C e^{ik_2 x} (no leftward wave on the right).
- Boundary conditions at x = 0: A + B = C, ik_1(A - B) = ik_2 C.
- Solve: r = B/A = (k_1 - k_2)/(k_1 + k_2), t = C/A = 2k_1/(k_1 + k_2).
- R = |r|^2 = (k_1 - k_2)^2 / (k_1 + k_2)^2. T = (k_2/k_1)|t|^2 = 4k_1 k_2 / (k_1 + k_2)^2.
- Verify: R + T = [(k_1-k_2)^2 + 4k_1 k_2] / (k_1+k_2)^2 = (k_1+k_2)^2 / (k_1+k_2)^2 = 1.

**Theorem P3-T5: Continuity equation for probability.**
- rho(x,t) = |psi(x,t)|^2 = psi* psi.
- d(rho)/dt = psi* (dpsi/dt) + (dpsi*/dt) psi.
- From TDSE: dpsi/dt = (1/(i*hbar)) H psi = (i*hbar/(2m)) psi'' - (i/hbar) V psi.
- Complex conjugate: dpsi*/dt = -(i*hbar/(2m)) psi*'' + (i/hbar) V psi*.
- Substitute: d(rho)/dt = psi* (i*hbar/(2m)) psi'' - psi (i*hbar/(2m)) psi*'' = (i*hbar/(2m)) (psi* psi'' - psi psi*'') = (i*hbar/(2m)) d/dx(psi* psi' - psi psi*').
- Define j = (hbar/(2mi)) (psi* psi' - psi psi*'). Then d(rho)/dt + dj/dx = 0.

**Theorem P3-T6: Tunnelling transmission coefficient for a rectangular barrier.**
- V(x) = V_0 for 0 < x < a, 0 elsewhere. E < V_0.
- Inside the barrier: psi(x) = F e^{kappa x} + G e^{-kappa x}, kappa = sqrt(2m(V_0-E))/hbar.
- Match at x=0 and x=a (four equations, four unknowns after eliminating normalization).
- Result: T = [1 + (V_0^2 sinh^2(kappa a)) / (4E(V_0-E))]^{-1}.
- For kappa*a >> 1: sinh(kappa a) approx e^{kappa a}/2, so T approx (16E(V_0-E)/V_0^2) e^{-2 kappa a}.

### 4. Historical Experiments with Apparatus Descriptions

**Experiment 1: Davisson-Germer experiment (1927) -- Electron diffraction confirming de Broglie.**

*Apparatus:* An electron gun accelerates electrons through a potential difference V (typically 30-600 V). The electron beam strikes a single crystal of nickel at normal incidence. The nickel crystal acts as a diffraction grating (lattice spacing d = 0.215 nm for the (111) planes). A movable Faraday cup detector measures the current of scattered electrons as a function of angle theta. The apparatus is enclosed in a vacuum chamber to prevent scattering by air.

*Classical prediction:* Electrons should scatter diffusely from the nickel surface, with no angular structure related to the crystal lattice.

*Actual result:* A strong peak in scattered intensity appears at theta = 50 degrees for V = 54 V. The electron's de Broglie wavelength at this energy is lambda = h/p = h/sqrt(2meV) = 0.167 nm. The Bragg condition d sin(theta) = n lambda gives d sin(50) = 0.215 x 0.766 = 0.165 nm, in excellent agreement. Electrons diffract like waves.

*Implications:* Particles have wave properties, confirming de Broglie's hypothesis and motivating the wave-function description. The Schrodinger equation provides the dynamical law for these matter waves.

**Experiment 2: Quantum tunnelling -- Alpha decay (Gamow, 1928; Geiger & Nuttall, 1911)**

*Apparatus (natural):* An alpha-radioactive nucleus (e.g., uranium-238, radium-226, polonium-210). The alpha particle (He-4 nucleus) is confined inside the nucleus by the strong nuclear force, which creates an attractive potential well of depth approximately 40 MeV and radius approximately 7 fm. Outside the nucleus, the Coulomb barrier rises to approximately 30 MeV at the nuclear surface and falls off as 1/r. The alpha particle has kinetic energy E approximately 4-9 MeV, well below the barrier height.

*Classical prediction:* The alpha particle can never escape. It does not have enough energy to surmount the Coulomb barrier. All radioactive nuclei should be completely stable.

*Actual result:* Alpha particles tunnel through the Coulomb barrier with a characteristic half-life. The Gamow model: the transmission probability through the barrier is T approx exp(-2 integral_R^{r_c} kappa(r) dr) where kappa(r) = sqrt(2m(V(r)-E))/hbar and the integral is over the classically forbidden region from the nuclear radius R to the classical turning point r_c = 2Ze^2/(4pi epsilon_0 E). This explains the Geiger-Nuttall law: log(half-life) is approximately linear in 1/sqrt(E). The enormous range of alpha-decay half-lives (microseconds to billions of years) is explained by the exponential sensitivity of the tunnelling probability to the barrier width.

*Implications:* Quantum tunnelling is a real physical phenomenon with macroscopic consequences. It is a direct prediction of the Schrodinger equation.

**Experiment 3: Scanning Tunnelling Microscope (Binnig & Rohrer, 1981)**

*Apparatus:* A sharp metallic tip (typically tungsten or platinum-iridium, atomically sharp -- ideally terminating in a single atom) is brought within approximately 1 nm of a conducting surface. A bias voltage V_bias (typically 0.01-10 V) is applied between the tip and the surface. A piezoelectric actuator controls the tip position with sub-angstrom precision in three dimensions. A sensitive current amplifier measures the tunnelling current I.

*Physics:* The vacuum gap between tip and surface acts as a potential barrier of height approximately equal to the work function phi (typically 4-5 eV). The tunnelling current is I proportional to exp(-2 kappa d) where d is the tip-surface distance and kappa = sqrt(2m phi)/hbar. For phi = 4 eV: kappa approx 10 nm^{-1}, so the current changes by a factor of e^2 approx 7.4 for each 0.1 nm change in d. This extraordinary sensitivity allows the tip to "feel" individual atoms on the surface.

*Result:* By scanning the tip across the surface and adjusting d to maintain constant current (constant-current mode), a topographic map of the surface is generated with atomic resolution. The STM was the first instrument to image individual atoms, earning Binnig and Rohrer the 1986 Nobel Prize.

*Implications:* Tunnelling is not merely a theoretical curiosity -- it is a practical tool for nanotechnology, and it directly confirms the Schrodinger equation's predictions.

### 5. Visual Assets

**VA-P3.1: Schrodinger equation derivation flow chart.**
- Type: Styled HTML/SVG diagram.
- Description: A top-down flow chart showing: "Linearity" + "Determinism" --> "Evolution operator U(t)" --> "Norm preservation" --> "U is unitary" --> "Stone's theorem" --> "U = exp(-iHt/hbar), H Hermitian" --> "Differentiate" --> "i*hbar d|psi>/dt = H|psi>". Each box is clickable, expanding a 2-3 sentence explanation. The flow chart makes the logical inevitability of the Schrodinger equation visually clear.
- File: `schrodinger-derivation-flowchart.tsx`

**VA-P3.2: Infinite square well eigenstates.**
- Type: Interactive chart.
- Description: Plot of the first N eigenstates psi_n(x) (selectable N from 1 to 10) inside the box 0 < x < L. Side panel shows the corresponding energy levels E_n on a vertical energy axis. Clicking on an energy level highlights the corresponding wave function. A superposition mode allows the student to select coefficients c_1, ..., c_5 and watch the time evolution of |psi(x,t)|^2 animated in real time.
- File: `infinite-well-eigenstates.tsx`
- Dependencies: 1D Schrodinger simulator core for time evolution.

**VA-P3.3: Harmonic oscillator eigenstates.**
- Type: Interactive chart.
- Description: Same layout as VA-P3.2 but for the harmonic oscillator. The parabolic potential is plotted as a background curve. Eigenstates are shown with their Hermite polynomial structure. Equally spaced energy levels are emphasised. The ground state Gaussian is highlighted with a comparison to the classical turning points. A "coherent state" mode shows a Gaussian wave packet oscillating back and forth without spreading (the quantum analogue of a classical oscillator).
- File: `harmonic-oscillator-eigenstates.tsx`

**VA-P3.4: Step potential scattering diagram.**
- Type: Interactive chart.
- Description: A plot showing the step potential V(x) and the wave function psi(x) in real and imaginary parts (or modulus and phase). The student can adjust E/V_0 with a slider from 0.1 to 5.0. For E > V_0: incident, reflected, and transmitted plane waves are shown with amplitude ratios r and t displayed numerically. For E < V_0: the evanescent decay in the classically forbidden region is shown. A bar chart shows R and T updating in real time as E/V_0 changes.
- File: `step-potential-scattering.tsx`

**VA-P3.5: Tunnelling through a barrier animation.**
- Type: Canvas/WebGL animation.
- Description: A Gaussian wave packet approaches a rectangular barrier from the left. The barrier height V_0 and width a are adjustable. As the wave packet hits the barrier, it splits: a transmitted portion tunnels through and a reflected portion bounces back. The probability of transmission is displayed numerically and compared with the analytic formula. The student can see that: (a) wider barriers give exponentially less transmission, (b) lighter particles tunnel more easily, (c) lower barriers give more transmission.
- File: `tunnelling-animation.tsx`
- Dependencies: SIM_SCHRODINGER_UI.

**VA-P3.6: Wave packet spreading animation.**
- Type: Canvas animation.
- Description: A Gaussian wave packet evolving in free space. The initial width sigma, momentum k_0, and particle mass are adjustable. The animation shows |psi(x,t)|^2 spreading over time. A side panel displays sigma(t) numerically and compares with the analytic formula. A second panel shows the same evolution in momentum space (where the distribution does NOT spread -- it is the position uncertainty that increases, not the momentum uncertainty). Options: (a) free particle, (b) harmonic potential (no spreading -- coherent state), (c) infinite well (quantum revival after the revival time T_rev = 4mL^2/(pi hbar)).
- File: `wave-packet-spreading.tsx`
- Dependencies: SIM_SCHRODINGER_UI.

**VA-P3.7: Probability current visualisation.**
- Type: Interactive chart.
- Description: For a plane wave psi = A e^{ikx} and for a standing wave psi = A sin(kx), show the probability current j(x) alongside rho(x). For the plane wave, j is constant (uniform flow). For the standing wave, j = 0 (no net flow). For a wave packet, j varies in space, showing probability flowing with the packet. Animated arrows indicate current direction and magnitude.
- File: `probability-current-vis.tsx`

**VA-P3.8: 1D Schrodinger simulator embed.**
- Type: Interactive simulator (SIM_SCHRODINGER_UI component).
- Description: The full 1D Schrodinger simulator from simulator-spec.md. In this lesson, presets include: (a) particle in a box eigenstates, (b) harmonic oscillator eigenstates, (c) free wave packet spreading, (d) step potential scattering, (e) barrier tunnelling, (f) double well (bonus). The student can draw custom potentials and observe the resulting dynamics.
- File: Embedded `<SchrodingerSim1D />` component with lesson-specific presets.
- Dependencies: SIM_CORE, SIM_SCHRODINGER_UI.

**VA-P3.9: Energy level comparison diagram.**
- Type: Static SVG.
- Description: Side-by-side energy level diagrams for three systems: (a) infinite square well (E_n proportional to n^2, quadratically increasing spacing), (b) harmonic oscillator (E_n proportional to n + 1/2, equal spacing), (c) hydrogen atom (E_n proportional to -1/n^2, bunching at the top). This comparative diagram helps students see how the potential shape determines the energy level structure.
- File: `energy-level-comparison.svg`

**VA-P3.10: STM image gallery.**
- Type: Static image gallery with captions.
- Description: Three famous STM images: (a) the IBM logo written with individual xenon atoms on nickel (1989), (b) a quantum corral (iron atoms on copper, showing standing electron waves), (c) a silicon surface showing individual atomic rows. Each image has a caption explaining the tunnelling physics.
- File: `stm-gallery.tsx` (image loader + captions)

### 6. Worked Examples

**WE-P3.1: Particle in a box -- energy levels and transitions.**

*Problem:* An electron is confined to a 1D box of length L = 1.0 nm (approximately the size of a small molecule). (a) Calculate the first three energy levels E_1, E_2, E_3 in eV. (b) What is the wavelength of the photon emitted in the transition from n=3 to n=2? (c) What is the wavelength for n=2 to n=1? (d) In what region of the electromagnetic spectrum do these transitions lie?

*Solution:*
(a) E_n = n^2 pi^2 hbar^2 / (2 m_e L^2).
E_1 = pi^2 (1.055 x 10^{-34})^2 / (2 x 9.109 x 10^{-31} x (10^{-9})^2) = pi^2 x 1.113 x 10^{-68} / (1.822 x 10^{-48}) = pi^2 x 6.11 x 10^{-21} J = 6.03 x 10^{-20} J = 0.376 eV.
E_2 = 4 x 0.376 = 1.504 eV.
E_3 = 9 x 0.376 = 3.386 eV.

(b) Delta E_{3->2} = E_3 - E_2 = 3.386 - 1.504 = 1.882 eV. lambda = hc / Delta E = (4.136 x 10^{-15} eV s)(3 x 10^8 m/s) / 1.882 eV = 659 nm (red light).

(c) Delta E_{2->1} = 1.504 - 0.376 = 1.128 eV. lambda = 1240 eV nm / 1.128 eV = 1099 nm (near infrared).

(d) These transitions lie in the visible and near-infrared. This is why quantum dots (semiconductor nanoparticles that approximate particles in a box) have size-dependent colours -- smaller boxes have larger energy gaps and bluer emission.

**WE-P3.2: Tunnelling probability through a barrier.**

*Problem:* An electron (m = 9.109 x 10^{-31} kg) with kinetic energy E = 3 eV encounters a rectangular barrier of height V_0 = 5 eV and width a = 0.5 nm. (a) Calculate the decay constant kappa. (b) Calculate the tunnelling probability T. (c) How does T change if the barrier width is doubled to 1.0 nm? (d) How does T change if the particle is a proton instead of an electron?

*Solution:*
(a) kappa = sqrt(2m(V_0 - E)) / hbar = sqrt(2 x 9.109 x 10^{-31} x 2 x 1.602 x 10^{-19}) / 1.055 x 10^{-34} = sqrt(5.83 x 10^{-49}) / 1.055 x 10^{-34} = 7.63 x 10^{-25} / 1.055 x 10^{-34} = 7.23 x 10^9 m^{-1} = 7.23 nm^{-1}.

(b) kappa a = 7.23 x 0.5 = 3.615. Using the approximate formula: T approx (16 E (V_0-E) / V_0^2) exp(-2 kappa a) = (16 x 3 x 2 / 25) exp(-7.23) = 3.84 x exp(-7.23) = 3.84 x 7.24 x 10^{-4} = 2.78 x 10^{-3}. About 0.3% of electrons tunnel through.

(c) kappa a = 7.23 x 1.0 = 7.23. T approx 3.84 x exp(-14.46) = 3.84 x 5.27 x 10^{-7} = 2.02 x 10^{-6}. Doubling the barrier width reduces the tunnelling probability by a factor of about 1400. The exponential sensitivity is dramatic.

(d) For a proton, m = 1.673 x 10^{-27} kg (1836 times heavier). kappa_proton = sqrt(1836) x kappa_electron = 42.8 x 7.23 = 310 nm^{-1}. kappa a = 155. T approx 3.84 x exp(-310) which is essentially zero. Heavy particles do not tunnel through barriers of this size. This is why tunnelling is primarily a quantum effect for light particles (electrons, protons in some cases).

**WE-P3.3: Wave packet spreading.**

*Problem:* A free electron is prepared as a Gaussian wave packet with initial width sigma_0 = 10 nm. (a) Calculate the spreading timescale t_spread = 2m sigma_0^2 / hbar. (b) What is the width of the wave packet after 1 femtosecond (10^{-15} s)? (c) After 1 nanosecond? (d) Repeat for a C60 buckyball molecule (m = 1.2 x 10^{-24} kg) with sigma_0 = 1 micrometre.

*Solution:*
(a) t_spread = 2 x 9.109 x 10^{-31} x (10 x 10^{-9})^2 / (1.055 x 10^{-34}) = 2 x 9.109 x 10^{-31} x 10^{-16} / 1.055 x 10^{-34} = 1.727 x 10^{-46} / 1.055 x 10^{-34} = 1.64 x 10^{-12} s = 1.64 ps.

(b) After t = 1 fs = 10^{-15} s: t/t_spread = 10^{-15} / 1.64 x 10^{-12} = 6.10 x 10^{-4}. sigma(t) = sigma_0 sqrt(1 + (t/t_spread)^2) approx sigma_0 (1 + 1.86 x 10^{-7}) approx 10.000 nm. Negligible spreading.

(c) After t = 1 ns = 10^{-9} s: t/t_spread = 10^{-9} / 1.64 x 10^{-12} = 610. sigma(t) approx sigma_0 x 610 = 6100 nm = 6.1 micrometres. Enormous spreading.

(d) For C60: t_spread = 2 x 1.2 x 10^{-24} x (10^{-6})^2 / 1.055 x 10^{-34} = 2.4 x 10^{-36} / 1.055 x 10^{-34} = 22.7 s. A macroscopic spreading timescale! After 1 second, the wave packet has barely spread. This illustrates why large molecules can show interference patterns (Arndt et al., 1999) and why macroscopic objects never exhibit quantum spreading.

**WE-P3.4: Harmonic oscillator zero-point energy.**

*Problem:* A diatomic molecule (e.g., HCl) has a vibrational frequency v = 8.66 x 10^{13} Hz. (a) What is the zero-point energy in eV? (b) What is the spacing between adjacent vibrational energy levels? (c) At room temperature (T = 300 K), what is the ratio of the energy level spacing to the thermal energy kT? Is the molecule in its ground state?

*Solution:*
(a) E_0 = (1/2) hbar omega = (1/2) h v = (1/2)(6.626 x 10^{-34})(8.66 x 10^{13}) = 2.87 x 10^{-20} J = 0.179 eV.

(b) Spacing: Delta E = hbar omega = h v = 0.358 eV.

(c) kT = (1.381 x 10^{-23})(300) = 4.14 x 10^{-21} J = 0.0259 eV. Ratio = Delta E / kT = 0.358 / 0.0259 = 13.8. Since this is much greater than 1, the thermal energy is far too small to excite the molecule out of its ground state. At room temperature, essentially all HCl molecules are in the vibrational ground state n=0. This is why molecular vibrations are "frozen out" at room temperature (the same physics as Planck's resolution of the UV catastrophe!).

**WE-P3.5: Step potential -- partial reflection above the step.**

*Problem:* An electron with kinetic energy E = 10 eV encounters a step potential V_0 = 4 eV. (a) Calculate k_1 and k_2. (b) Calculate the reflection coefficient R. (c) Is there any classical analogue to this partial reflection?

*Solution:*
(a) k_1 = sqrt(2mE)/hbar = sqrt(2 x 9.109 x 10^{-31} x 10 x 1.602 x 10^{-19}) / 1.055 x 10^{-34} = sqrt(2.919 x 10^{-48}) / 1.055 x 10^{-34} = 1.709 x 10^{-24} / 1.055 x 10^{-34} = 1.62 x 10^{10} m^{-1}.

k_2 = sqrt(2m(E-V_0))/hbar = sqrt(2 x 9.109 x 10^{-31} x 6 x 1.602 x 10^{-19}) / 1.055 x 10^{-34} = 1.253 x 10^{10} m^{-1}.

(b) R = (k_1 - k_2)^2 / (k_1 + k_2)^2 = (1.62 - 1.253)^2 / (1.62 + 1.253)^2 x 10^{20} / 10^{20} = (0.367)^2 / (2.873)^2 = 0.1347 / 8.254 = 0.0163 = 1.63%.

(c) Classically, a particle with E > V_0 always passes over the step with 100% probability. There is no classical analogue to partial reflection above a potential step. However, there is a wave analogue: partial reflection of light at a glass-air interface, which is described by the same mathematics (Fresnel equations). This connects the wave-like nature of quantum particles to optical phenomena.

### 7. Common Confusions

**CC-P3.1: "The Schrodinger equation was a lucky guess."**
Schrodinger was indeed inspired by de Broglie's wave-particle duality and by analogy with the Hamilton-Jacobi equation of classical mechanics. But the equation can be derived (as we do in this lesson) from first principles: linearity, determinism, and norm preservation force the equation to have exactly the form it does. The only freedom is the choice of Hamiltonian (which encodes the physics of the specific system). The equation itself is unique.

**CC-P3.2: "The wave function is a physical wave oscillating in 3D space."**
For a single particle in 3D, psi(x,y,z,t) does live in 3D space. But for N particles, psi is a function of 3N coordinates -- it lives in configuration space, not physical space. A system of two particles has a wave function psi(x_1, y_1, z_1, x_2, y_2, z_2, t) in 6D. This is not a wave in physical space. The wave function is a mathematical object encoding probability amplitudes, not a physical oscillation.

**CC-P3.3: "Stationary states don't change in time."**
The state vector |psi(t)> = e^{-iEt/hbar}|E> does change in time -- it acquires a time-dependent phase. What doesn't change is the probability distribution |<x|psi(t)>|^2, the expectation value of any time-independent observable, and any measurement probability. The phase change is physically real (it shows up in interference with other states) but invisible to measurements performed solely on this state.

**CC-P3.4: "Tunnelling violates energy conservation."**
Tunnelling does NOT violate energy conservation. At no point does the particle have negative kinetic energy. The correct statement is: the particle is found in a classically forbidden region where a classical particle could not be, but its total energy E is perfectly well-defined and conserved throughout. The kinetic energy operator has a negative expectation value in the classically forbidden region, but this does not mean the particle has "negative kinetic energy" in any measurement -- the energy measured is always E. Alternatively, the particle does not "borrow energy" to get over the barrier; it passes through the barrier at its original energy.

**CC-P3.5: "The particle-in-a-box energy levels are due to the uncertainty principle."**
While there is a connection (confining a particle to a region of width L forces Delta x <= L, which implies Delta p >= hbar/(2L), giving a minimum kinetic energy), this argument gives only an order-of-magnitude estimate. The actual quantised energy levels E_n = n^2 pi^2 hbar^2/(2mL^2) arise from solving the TISE with boundary conditions. The uncertainty principle provides a lower bound on the ground state energy, but the full spectrum requires the Schrodinger equation.

**CC-P3.6: "Wave packet spreading means the particle is getting larger."**
The particle is a point object. The wave function psi(x,t) represents the probability amplitude for finding the particle at position x. When the wave packet spreads, the uncertainty in the particle's position increases, but the particle itself is not "smearing out" -- it remains a point. If you measure the position, you always find the particle at a single definite location. The spreading is in our knowledge of where the particle is, not in the particle's size.

### 8. Cross-References

| Reference | Direction | Description |
|-----------|-----------|-------------|
| A1 (Complex Numbers) | backward | Complex exponentials in plane waves and time-evolution phases. |
| A2 (Vectors) | backward | State vectors, superposition, inner products. |
| A3 (Matrices) | backward | Hermitian operators, eigenvalue problems. |
| A4 (Eigenvalues/Spectral Theorem) | backward | The TISE is an eigenvalue problem; spectral decomposition of the Hamiltonian. |
| P1 (Classical Failures) | backward | Blackbody radiation motivated quantised oscillators; Planck's formula is now derived from the QHO. |
| P2 (Postulates) | backward | Time-evolution postulate is now derived; the TISE is the energy eigenvalue equation from Postulate 3. |
| P4 (Spin-1/2) | forward | Spin precession is governed by the Schrodinger equation with a spin Hamiltonian. |
| P5 (Uncertainty) | forward | Zero-point energy and wave packet spreading are manifestations of the uncertainty principle. |
| C1 (Qubit) | forward | Qubit time evolution under a Hamiltonian (Rabi oscillations). |
| C3 (Gates) | forward | Quantum gates are time-evolution operators U = exp(-iHt/hbar) for specific Hamiltonians. |
| P6 (Bell/CHSH) | forward | Time evolution of entangled states. |

### 9. Historical Notes

**HN-P3.1: Schrodinger's derivation (1926).** Erwin Schrodinger published four landmark papers in the first half of 1926, collectively titled "Quantisation as an Eigenvalue Problem" (Quantisierung als Eigenwertproblem). He was inspired by de Broglie's thesis on matter waves and by a remark from Debye that "waves need a wave equation." Schrodinger initially sought a relativistic equation (which would later be found by Klein and Gordon, and correctly by Dirac), but settled for the non-relativistic version when the relativistic one gave wrong predictions for hydrogen (because it didn't account for spin).

**HN-P3.2: Schrodinger vs Heisenberg (1925-26).** Werner Heisenberg had already formulated matrix mechanics in 1925 (using arrays of numbers that turned out to be matrices -- he had independently reinvented matrix algebra). Schrodinger's wave mechanics appeared to be a completely different theory. Schrodinger proved in 1926 that the two formulations are mathematically equivalent, a result made rigorous by von Neumann (1932). The equivalence is the statement that both are representations of the same abstract Hilbert space structure.

**HN-P3.3: Gamow's tunnelling theory of alpha decay (1928).** George Gamow (age 24) showed that alpha decay could be explained by quantum tunnelling through the Coulomb barrier. The same explanation was independently found by Gurney and Condon. This was the first application of quantum mechanics to nuclear physics and the first quantitative use of tunnelling. Gamow's model explained the Geiger-Nuttall law (the empirical relationship between half-life and alpha particle energy) that had been a mystery for 17 years.

**HN-P3.4: The scanning tunnelling microscope (1981).** Gerd Binnig and Heinrich Rohrer at IBM Zurich built the first STM, imaging individual atoms on a silicon surface. They received the 1986 Nobel Prize. The STM's resolution depends on the exponential sensitivity of the tunnelling current to distance -- a prediction of the Schrodinger equation. The STM initiated the field of nanotechnology and made "seeing" atoms routine.

**HN-P3.5: Matter wave interference (Arndt et al., 1999).** Anton Zeilinger's group demonstrated double-slit interference with C60 fullerene molecules (720 atomic mass units), the largest objects at the time to show quantum interference. This pushed the quantum-classical boundary to an unprecedented scale. Subsequent experiments have shown interference with molecules exceeding 25,000 atomic mass units.

### 10. Problem Set

**PS-P3.01 (Derivation, Medium):** Starting from the requirement that U(t) is unitary and satisfies U(t_1 + t_2) = U(t_1) U(t_2), show that U(epsilon) = I - i epsilon K + O(epsilon^2) for some Hermitian operator K. Define H = hbar K and derive the Schrodinger equation.

**PS-P3.02 (Computational, Easy):** An electron is in the ground state (n=1) of an infinite square well of width L = 0.5 nm. (a) What is the ground state energy in eV? (b) What is the energy of the first excited state (n=2)? (c) What photon wavelength corresponds to the transition from n=2 to n=1?

**PS-P3.03 (Computational, Medium):** Show that the wave functions psi_n(x) = sqrt(2/L) sin(n pi x / L) are orthonormal: integral_0^L psi_m(x) psi_n(x) dx = delta_{mn}. [Hint: use the product-to-sum identity for sines.]

**PS-P3.04 (Computational, Medium):** A particle is in a superposition state psi(x, 0) = (1/sqrt(2)) psi_1(x) + (1/sqrt(2)) psi_2(x) in an infinite square well. (a) Write psi(x, t). (b) Compute |psi(x,t)|^2. (c) Show that the probability distribution oscillates with frequency omega_{21} = (E_2 - E_1)/hbar. (d) What is this frequency for an electron in a 1.0 nm box?

**PS-P3.05 (Computational, Hard):** Derive the reflection and transmission coefficients for a step potential V_0 with E > V_0. Verify that R + T = 1. Show that in the limit V_0 -> 0, R -> 0 and T -> 1 (no barrier, no reflection). Show that in the limit E -> V_0^+, R -> 1 and T -> 0 (threshold behaviour).

**PS-P3.06 (Computational, Hard):** For a rectangular barrier of height V_0 = 5 eV and width a, plot the tunnelling probability T(a) for an electron with energy E = 3 eV, for a ranging from 0.1 nm to 2.0 nm. Verify the exponential decay T approx exp(-2 kappa a). At what barrier width is T = 0.01?

**PS-P3.07 (Conceptual, Medium):** Explain why the ground state of the infinite square well has n=1, not n=0. What would psi_0(x) = sqrt(2/L) sin(0) look like? What does this mean physically?

**PS-P3.08 (Computational, Medium):** For the quantum harmonic oscillator with frequency omega = 2 pi x 10^{14} rad/s and particle mass m = 1.67 x 10^{-27} kg (proton): (a) What is the zero-point energy in eV? (b) What is the separation between adjacent energy levels? (c) At what temperature T does kT equal the level spacing?

**PS-P3.09 (Simulator, Medium):** Use the 1D Schrodinger simulator to set up an infinite square well. (a) Prepare the ground state and verify it does not change shape over time. (b) Prepare the state (psi_1 + psi_2)/sqrt(2) and observe the oscillation. Measure the oscillation period and compare with the theoretical prediction T = 2 pi hbar / (E_2 - E_1). (c) Prepare a narrow Gaussian wave packet inside the well and observe the dynamics. Does it ever return to its initial shape? (This is quantum revival.)

**PS-P3.10 (Simulator, Hard):** Use the 1D Schrodinger simulator to set up a rectangular barrier. Send a Gaussian wave packet at the barrier with E < V_0. (a) Observe the splitting into reflected and transmitted portions. (b) Vary the barrier width and record the fraction of probability that tunnels through. (c) Plot your measured transmission vs. barrier width and compare with the analytic formula T approx exp(-2 kappa a).

**PS-P3.11 (Derivation, Hard):** Derive the continuity equation d rho / dt + dj/dx = 0 starting from the TDSE and its complex conjugate. Identify the probability current j. Explain why j = 0 for a real wave function.

**PS-P3.12 (Synthesis, Hard):** The harmonic oscillator has equally spaced energy levels E_n = hbar omega (n + 1/2). (a) Show that the average energy of a quantum harmonic oscillator at temperature T is <E> = hbar omega / 2 + hbar omega / (exp(hbar omega / kT) - 1). [Hint: this is the Planck distribution plus zero-point energy.] (b) Show that in the limit kT >> hbar omega, <E> -> kT (classical equipartition). (c) Show that in the limit kT << hbar omega, <E> -> hbar omega / 2 (frozen out). (d) Explain how this resolves the UV catastrophe from P1.

### 11. Simulator Dependencies

| Simulator | Usage in P3 | Presets |
|-----------|------------|---------|
| 1D Schrodinger (SIM_SCHRODINGER_UI) | Primary. Used extensively across all three pages for eigenstates, scattering, tunnelling, wave packet dynamics. | Preset P3-S-1: Infinite square well, ground state. Preset P3-S-2: Infinite well, superposition psi_1 + psi_2. Preset P3-S-3: Harmonic oscillator, ground state. Preset P3-S-4: Harmonic oscillator, coherent state. Preset P3-S-5: Step potential, E > V_0. Preset P3-S-6: Step potential, E < V_0 (evanescent). Preset P3-S-7: Rectangular barrier, tunnelling. Preset P3-S-8: Free Gaussian wave packet spreading. Preset P3-S-9: Custom potential (draw-your-own). |

The qubit circuit simulator, Stern-Gerlach simulator, and CHSH simulator are NOT used in P3.

### 12. Estimates

| Item | Estimate |
|------|----------|
| Prose word count | 20,000--25,000 words |
| Number of equations (display math) | 80--100 |
| Number of inline math expressions | 250--300 |
| Figures and visual assets | 10 (see VA list) |
| Interactive components | 7 (eigenstates x2, step potential, tunnelling, wave packet, probability current, Schrodinger simulator) |
| Worked examples | 5 |
| Problem set questions | 12 |
| Estimated development time (prose + equations) | 8 days |
| Estimated development time (visual assets) | 5 days |
| Estimated development time (interactive components) | 5 days |
| Total estimated development time | 18 days |

### 13. Page Splits

P3 is split into **3 pages** as follows:

| Page | Route | Title | Content | Est. Words |
|------|-------|-------|---------|-----------|
| Part 1 | `/lessons/p3-schrodinger-equation/part-1` | Deriving the Equation | Acts I-III: derivation from first principles, TDSE, stationary states, TISE, probability current. | 6,500--8,000 |
| Part 2 | `/lessons/p3-schrodinger-equation/part-2` | Bound States | Acts IV-V: infinite square well (full derivation), quantum harmonic oscillator. | 7,000--8,500 |
| Part 3 | `/lessons/p3-schrodinger-equation/part-3` | Scattering and Dynamics | Acts VI-VIII: step potential, tunnelling, wave packet dynamics, synthesis. | 6,500--8,500 |

Each page is self-contained with its own introduction and summary, but includes a "Previously" recap at the top of Parts 2 and 3 referencing the key results from prior parts. Navigation arrows connect the three parts. The problem set and worked examples are distributed across all three pages, with problems PS-P3.01--P3.04 on Part 1, PS-P3.07--P3.08 on Part 2, and PS-P3.05--P3.06, P3.09--P3.12 on Part 3.

---

## P4 -- Spin-1/2 and Pauli Matrices

**Canonical position:** 10 of 23
**Prerequisites:** A1 (complex numbers), A2 (vectors), A3 (matrices), A4 (eigenvalues), P1 (Stern-Gerlach), P2 (postulates), P3 (Schrodinger equation)
**Slug:** `p4-spin-pauli`
**Target length:** 12,000--15,000 words
**Page splits:** Single page (no split)
**Paid:** Yes

### 1. Learning Objectives

By the end of this lesson the student will be able to:

1. **LO-P4.1:** Describe the spin-1/2 degree of freedom as a two-dimensional Hilbert space C^2, write general spin states as spinors |psi> = alpha|up> + beta|down>, and identify the spin-up and spin-down basis as the eigenstates of S_z.
2. **LO-P4.2:** Derive the three Pauli matrices sigma_x, sigma_y, sigma_z from the angular momentum commutation relations [S_i, S_j] = i hbar epsilon_{ijk} S_k and the anticommutation relations {sigma_i, sigma_j} = 2 delta_{ij} I, starting from the requirement that S^2 = s(s+1) hbar^2 I with s = 1/2.
3. **LO-P4.3:** Compute the eigenvalues and eigenvectors of each Pauli matrix and of S_n = n_hat . S for an arbitrary unit vector n_hat = (sin theta cos phi, sin theta sin phi, cos theta), and express the eigenvectors in terms of the Bloch sphere angles theta and phi.
4. **LO-P4.4:** Analyse sequential Stern-Gerlach experiments mathematically: given a sequence of SG devices along specified axes, compute the probability of each outcome at each stage using the Born rule and projection postulate.
5. **LO-P4.5:** Explain spinor geometry: under a rotation by angle theta about axis n_hat, a spinor transforms as |psi> -> exp(-i theta n_hat . sigma / 2)|psi>, and a rotation by 2pi gives a sign change (|psi> -> -|psi>), so spinors require a 4pi rotation to return to their original state.
6. **LO-P4.6:** Write the spin precession Hamiltonian H = -gamma B . S for a spin-1/2 particle in a magnetic field B, solve the Schrodinger equation to find the Larmor precession frequency omega_L = gamma |B|, and describe the precession of the spin vector on the Bloch sphere.
7. **LO-P4.7:** Explain the relationship between SU(2) (the group of 2x2 unitary matrices with determinant 1) and SO(3) (the group of 3D rotations), and why spin-1/2 particles are described by SU(2) rather than SO(3).
8. **LO-P4.8:** Use the Stern-Gerlach simulator and qubit simulator to verify sequential measurement predictions and observe spin precession dynamics.

### 2. Intuition Arc

**Opening hook (500 words):** Return to the Stern-Gerlach experiment from P1. We observed two spots but lacked the mathematical language to describe what was happening. Now, armed with the postulates (P2), eigenvalues (A4), and the Schrodinger equation (P3), we can give a complete mathematical account. This lesson is where the abstract formalism meets the concrete experiment.

**Act I -- The spin-1/2 Hilbert space (2,000 words):** The silver atom's outer electron has l = 0, so its angular momentum is purely intrinsic -- "spin." The Stern-Gerlach experiment shows exactly two outcomes for any axis, so the state space is C^2. Define the computational basis |up> = |+z> = (1, 0)^T and |down> = |-z> = (0, 1)^T as eigenstates of S_z with eigenvalues +/- hbar/2. A general spin state is a spinor: |psi> = alpha |up> + beta |down> with |alpha|^2 + |beta|^2 = 1. Connect to the Bloch sphere from P2.

**Act II -- Deriving the Pauli matrices (3,000 words):** The angular momentum algebra requires [S_x, S_y] = i hbar S_z (and cyclic permutations). Write S_i = (hbar/2) sigma_i. The commutation relations become [sigma_i, sigma_j] = 2i epsilon_{ijk} sigma_k. Additionally, the total spin squared must be S^2 = s(s+1) hbar^2 I = (3/4) hbar^2 I, which gives sigma_x^2 = sigma_y^2 = sigma_z^2 = I and the anticommutation relations {sigma_i, sigma_j} = 2 delta_{ij} I. These algebraic relations, combined with the choice sigma_z = diag(1, -1) (conventional), uniquely determine sigma_x = [[0,1],[1,0]] and sigma_y = [[0,-i],[i,0]]. Walk through the derivation step by step: (1) sigma_z is diagonal by convention with eigenvalues +/-1. (2) S_+ = S_x + iS_y is the raising operator; its matrix form is determined by [S_z, S_+] = hbar S_+ and the norm constraint. (3) S_- = S_+ dagger. (4) Extract sigma_x = (S_+ + S_-)/hbar and sigma_y = (S_+ - S_-)/(i hbar). Verify all commutation and anticommutation relations.

**Act III -- Eigenstates along arbitrary axes (2,000 words):** For a Stern-Gerlach device oriented along n_hat = (sin theta cos phi, sin theta sin phi, cos theta), the spin operator is S_n = (hbar/2)(sigma_x sin theta cos phi + sigma_y sin theta sin phi + sigma_z cos theta). Write the 2x2 matrix explicitly. Find its eigenvalues (+/- hbar/2, as expected) and eigenvectors: |+n> = cos(theta/2)|up> + e^{i phi} sin(theta/2)|down> and |-n> = -e^{-i phi} sin(theta/2)|up> + cos(theta/2)|down>. These are the Bloch sphere state parametrisation. The half-angles theta/2 (not theta) are the signature of spin-1/2.

**Act IV -- Sequential Stern-Gerlach experiments computed (2,500 words):** Revisit the sequential SG experiments from P2 with full mathematical detail. Example 1: SG(z) -> select +z -> SG(x) -> select +x -> SG(z). Compute all probabilities. Example 2: SG(z) -> select +z -> SG(n_hat) at angle theta to z -> probabilities are cos^2(theta/2) and sin^2(theta/2). Example 3: SG(z) -> SG(z) (no intervening measurement) -> all probability in +z (repeated measurement gives the same outcome). These computations are the concrete payoff of the postulates. Use the SG simulator to verify each prediction.

**Act V -- Spinor rotations and SU(2) (2,000 words):** A rotation by angle theta about axis n_hat acts on a spinor as R(n_hat, theta) = exp(-i theta n_hat . sigma / 2) = cos(theta/2) I - i sin(theta/2) n_hat . sigma. Key result: a rotation by 2pi gives R = -I, not +I. The spinor picks up a minus sign. This means spinors are not vectors in the usual sense -- they live in the double cover of SO(3), which is SU(2). Physical observables (expectation values) are quadratic in |psi>, so the sign cancels, and all measurable quantities have the expected 2pi periodicity. But the 4pi periodicity of spinors is experimentally observable via neutron interferometry (Rauch et al., 1975; Werner et al., 1975).

**Act VI -- Spin precession (2,000 words):** Place a spin-1/2 particle in a uniform magnetic field B = B_0 z_hat. The Hamiltonian is H = -gamma B . S = -(gamma B_0 hbar / 2) sigma_z, where gamma is the gyromagnetic ratio. The energy eigenstates are |up> (E = -gamma hbar B_0 / 2) and |down> (E = +gamma hbar B_0 / 2). A general state precesses: |psi(t)> = e^{-iHt/hbar} |psi(0)>. If |psi(0)> = cos(theta/2)|up> + e^{i phi} sin(theta/2)|down>, then the Bloch vector rotates about z at the Larmor frequency omega_L = gamma B_0. The expectation values <S_x(t)> and <S_y(t)> oscillate sinusoidally while <S_z(t)> remains constant. This is the quantum version of classical gyroscopic precession. Connection to NMR and MRI: the Larmor precession of nuclear spins in a magnetic field is the basis of magnetic resonance imaging.

**Synthesis (500 words):** Spin-1/2 is the simplest non-trivial quantum system and the physical basis of the qubit. The Pauli matrices encode its algebra completely. Sequential SG experiments demonstrate the non-commutativity of quantum observables in the most concrete possible way. The SU(2) structure and 4pi periodicity of spinors are genuinely new physics with no classical analogue.

### 3. Theorems and Proofs (Sketched)

**Theorem P4-T1: Derivation of the Pauli matrices from commutation relations.**
- Given: [S_i, S_j] = i hbar epsilon_{ijk} S_k and S^2 = (3/4) hbar^2 I.
- Write S_i = (hbar/2) sigma_i. Then [sigma_i, sigma_j] = 2i epsilon_{ijk} sigma_k.
- Choose sigma_z = [[1,0],[0,-1]] (diagonal with eigenvalues +/-1).
- Define S_+ = hbar sigma_+, where sigma_+ |down> = |up> and sigma_+ |up> = 0. In matrix form: sigma_+ = [[0,1],[0,0]].
- Similarly sigma_- = [[0,0],[1,0]].
- sigma_x = sigma_+ + sigma_- = [[0,1],[1,0]].
- sigma_y = -i(sigma_+ - sigma_-) = [[0,-i],[i,0]].
- Verification: sigma_x sigma_y = [[0,1],[1,0]][[0,-i],[i,0]] = [[i,0],[0,-i]] = i sigma_z. So [sigma_x, sigma_y] = sigma_x sigma_y - sigma_y sigma_x = i sigma_z - (-i sigma_z) = 2i sigma_z. Correct.
- Anticommutation: sigma_x sigma_y + sigma_y sigma_x = i sigma_z + (-i sigma_z) = 0. So {sigma_x, sigma_y} = 0 for i != j. And sigma_i^2 = I for each i. So {sigma_i, sigma_j} = 2 delta_{ij} I. Correct.

**Theorem P4-T2: Eigenstates of S_n for arbitrary n_hat.**
- S_n = (hbar/2) n_hat . sigma = (hbar/2) [[cos theta, sin theta e^{-i phi}],[sin theta e^{i phi}, -cos theta]].
- Eigenvalue equation: det(S_n - lambda I) = 0 gives lambda^2 = (hbar/2)^2, so lambda = +/- hbar/2.
- For lambda = +hbar/2: [[cos theta - 1, sin theta e^{-i phi}],[sin theta e^{i phi}, -cos theta - 1]] (alpha, beta)^T = 0.
- First equation: (cos theta - 1) alpha + sin theta e^{-i phi} beta = 0.
- Using cos theta - 1 = -2 sin^2(theta/2) and sin theta = 2 sin(theta/2) cos(theta/2): alpha/beta = sin theta e^{-i phi} / (1 - cos theta) = e^{-i phi} cos(theta/2) / sin(theta/2).
- Normalised: |+n> = cos(theta/2) |up> + e^{i phi} sin(theta/2) |down>.
- Similarly: |-n> = sin(theta/2) |up> - e^{i phi} cos(theta/2) |down> (with a conventional phase choice).

**Theorem P4-T3: Rotation operator for spin-1/2.**
- R(n_hat, theta) = exp(-i theta S . n_hat / hbar) = exp(-i theta sigma . n_hat / 2).
- Using the identity exp(-i alpha n_hat . sigma / 2) = cos(alpha/2) I - i sin(alpha/2) n_hat . sigma (provable from sigma_i sigma_j = delta_{ij} I + i epsilon_{ijk} sigma_k and Taylor expansion).
- For alpha = 2pi: R = cos(pi) I - i sin(pi) n_hat . sigma = -I. The spinor picks up a factor of -1.
- For alpha = 4pi: R = cos(2pi) I - i sin(2pi) n_hat . sigma = +I. The spinor returns to itself.

**Theorem P4-T4: Larmor precession.**
- H = -(gamma hbar B_0 / 2) sigma_z. Energy eigenstates: |up> with E_up = -gamma hbar B_0 / 2, |down> with E_down = +gamma hbar B_0 / 2.
- Time evolution: |psi(t)> = e^{i gamma B_0 t / 2} alpha |up> + e^{-i gamma B_0 t / 2} beta |down> (absorbing the global phase).
- Bloch sphere coordinates: the azimuthal angle phi(t) = phi_0 + gamma B_0 t = phi_0 + omega_L t. The polar angle theta is constant.
- The spin vector precesses about B at the Larmor frequency omega_L = gamma B_0 = |gamma| B_0.
- For an electron: gamma_e = -g_e e / (2 m_e) = -1.761 x 10^{11} rad/(s T). In a field B = 1 T: omega_L = 1.761 x 10^{11} rad/s, f_L = 28.0 GHz.

### 4. Historical Experiments with Apparatus Descriptions

**Experiment 1: Original Stern-Gerlach experiment revisited (1922) -- now with full quantum analysis.**

*Apparatus:* (Same as P1, Section 4, Experiment 4 -- cross-reference.)

*Quantum analysis:* The silver atom's outer electron has s = 1/2. The initial state (atoms from the oven) is an incoherent mixture of |up> and |down> (equal populations, no coherence -- this is a thermal state). The inhomogeneous magnetic field along z applies a spin-dependent force: F_z = +/- mu_B (dB/dz). The beam splits into two. Each spot corresponds to a definite eigenvalue of S_z. This is a quantum measurement of S_z in action: the SG apparatus is a measuring device, the position of the atom on the screen is the pointer variable, and the correlation between spin state and position is the measurement interaction.

**Experiment 2: Sequential SG with orthogonal axes (conceptual, realised in modern atomic physics labs)**

*Apparatus:* Three SG devices in series. SG-1: z-axis, selects |+z>. SG-2: x-axis. SG-3: z-axis. A beam block after SG-1 discards the |-z> beam. A beam block after SG-2 selects only one output (say |+x>).

*Prediction:* After SG-1: state is |+z>. Express in x-basis: |+z> = (|+x> + |-x>)/sqrt(2). After SG-2 selecting |+x>: state is |+x> = (|+z> + |-z>)/sqrt(2). After SG-3: probability of |+z> is 1/2, probability of |-z> is 1/2. The z-measurement was completely reset by the intervening x-measurement.

*Actual result:* Confirmed experimentally. This is the canonical demonstration that incompatible measurements disturb each other.

**Experiment 3: Neutron interferometry and 4pi spinor symmetry (Rauch et al., 1975; Werner et al., 1975)**

*Apparatus:* A perfect silicon crystal neutron interferometer. A beam of thermal neutrons (wavelength approximately 0.1 nm) is split by Bragg diffraction at the first crystal slab. The two beams travel different paths through the interferometer. A magnetic field is applied to one arm, causing the neutron spin to precess by a controllable angle. The beams recombine at the third crystal slab and interfere. The neutron count rate at the detector oscillates as a function of the magnetic field strength (which controls the precession angle).

*Key result:* The interference pattern has periodicity corresponding to 4pi, not 2pi. When the magnetic field is adjusted so that the spin in one arm precesses by exactly 2pi (a "full rotation"), the interference pattern shows a phase shift of pi (destructive interference where there was constructive). A 4pi precession is needed to restore the original pattern. This directly demonstrates the -1 sign acquired by a spinor under 2pi rotation.

*Implications:* Spinors are not ordinary vectors. The SU(2) double cover of SO(3) is physically real and experimentally observable.

### 5. Visual Assets

**VA-P4.1: Pauli matrix cards.**
- Type: Styled HTML/CSS cards with KaTeX.
- Description: Three side-by-side cards displaying sigma_x, sigma_y, sigma_z. Each card shows: the matrix, its eigenvalues, its eigenvectors (written as kets and as column vectors), and a small Bloch sphere icon highlighting the relevant axis. The cards are "pinnable" for reference.
- File: `pauli-matrix-cards.tsx`

**VA-P4.2: Arbitrary-axis eigenstates on the Bloch sphere.**
- Type: Interactive 3D (Three.js / React Three Fiber).
- Description: A Bloch sphere with a draggable axis vector n_hat. As the student drags n_hat, the eigenstates |+n> and |-n> are shown as points on the sphere (antipodal), and their ket representations are updated in real time. The half-angle relationship between the Bloch sphere angles (theta, phi) and the eigenvector coefficients is visually emphasised.
- File: `arbitrary-axis-bloch.tsx`

**VA-P4.3: Sequential SG experiment interactive.**
- Type: Interactive diagram + simulator.
- Description: A configurable sequence of 1--4 SG devices. For each device, the student selects the axis orientation (x, y, z, or custom angle). The diagram shows the beam path splitting at each device, with probability labels updated in real time. A beam block toggle at each device allows the student to select which output beam proceeds. The final detector shows the probability distribution. An "N trials" mode runs many simulated particles and builds a histogram.
- File: `sequential-sg-interactive.tsx`
- Dependencies: SIM_SG_UI.

**VA-P4.4: Spin precession animation.**
- Type: Interactive 3D animation.
- Description: A Bloch sphere with a spin vector precessing about a magnetic field axis. The student can set: (a) the magnetic field direction (default: z), (b) the field strength B_0 (slider), (c) the initial spin state (via Bloch sphere angles). The spin vector traces a cone on the Bloch sphere at the Larmor frequency. Below the sphere, plots of <S_x(t)>, <S_y(t)>, <S_z(t)> are shown in real time. The Larmor frequency is displayed numerically and updates with B_0.
- File: `spin-precession-animation.tsx`

**VA-P4.5: SU(2) vs SO(3) visualisation -- the belt trick.**
- Type: Canvas animation.
- Description: An animation demonstrating the "belt trick" (also known as Dirac's string trick). A cube connected to a frame by a ribbon (belt) is rotated by 2pi -- the ribbon acquires a twist. Rotating by 4pi, the twist can be removed by looping the ribbon over the cube. This is a physical demonstration that SU(2) is the double cover of SO(3). A parallel animation shows a spinor acquiring a -1 phase under 2pi rotation and returning to +1 under 4pi.
- File: `belt-trick-animation.tsx`

**VA-P4.6: Stern-Gerlach simulator embed.**
- Type: Interactive simulator (SIM_SG_UI component).
- Description: Used with sequential device presets for P4. Presets include two and three sequential devices at various angles.
- File: Embedded `<SternGerlachSim />` component with lesson-specific presets.
- Dependencies: SIM_CORE, SIM_SG_UI.

**VA-P4.7: Qubit simulator embed.**
- Type: Interactive simulator (SIM_QUBIT_UI component).
- Description: Qubit circuit simulator configured for spin-1/2 experiments. Presets map Pauli gates to physical spin rotations, allowing students to verify that X gate = pi rotation about x, etc.
- File: Embedded `<QubitCircuitSim />` component with lesson-specific presets.
- Dependencies: SIM_CORE, SIM_QUBIT_UI.

### 6. Worked Examples

**WE-P4.1: Measurement along a tilted axis.**

*Problem:* A spin-1/2 particle is prepared in state |+z> = |up>. A Stern-Gerlach device is oriented at angle theta = 60 degrees from the z-axis in the xz-plane (phi = 0). (a) What are the eigenstates of S_n for this axis? (b) What is the probability of measuring +hbar/2? (c) What is the probability of measuring -hbar/2?

*Solution:*
(a) n_hat = (sin 60, 0, cos 60) = (sqrt(3)/2, 0, 1/2). The eigenstates are:
|+n> = cos(30)|up> + sin(30)|down> = (sqrt(3)/2)|up> + (1/2)|down>.
|-n> = -sin(30)|up> + cos(30)|down> = -(1/2)|up> + (sqrt(3)/2)|down>.

(b) Prob(+hbar/2) = |<+n|+z>|^2 = |sqrt(3)/2|^2 = 3/4.

(c) Prob(-hbar/2) = |<-n|+z>|^2 = |-1/2|^2 = 1/4.

Check: 3/4 + 1/4 = 1. Consistent with the general formula cos^2(theta/2) + sin^2(theta/2) = 1.

**WE-P4.2: Three sequential SG devices.**

*Problem:* A beam of spin-1/2 particles passes through three sequential SG devices: SG-1 along z (select +z), SG-2 along an axis at angle theta = 45 degrees to z in the xz-plane (select the + output), SG-3 along z. What fraction of the original +z beam emerges from SG-3 in the +z state?

*Solution:*
After SG-1: state is |+z>.

Probability of passing SG-2 (+n at theta = 45): cos^2(22.5) = cos^2(pi/8) = (1 + cos(pi/4))/2 = (1 + sqrt(2)/2)/2 = (2 + sqrt(2))/4 = 0.8536.

After SG-2: state is |+n> where theta = 45, which is cos(22.5)|up> + sin(22.5)|down>.

Probability of +z at SG-3: |<+z|+n>|^2 = cos^2(22.5) = 0.8536.

Total fraction emerging +z: 0.8536 x 0.8536 = 0.729 = 72.9%.

Compare with the case theta = 90 (x-axis): probability is (1/2)(1/2) = 1/4 = 25%. The 45-degree case transmits much more because each individual rotation is smaller.

**WE-P4.3: Spin precession in a magnetic field.**

*Problem:* An electron spin is initially in state |+x> = (|up> + |down>)/sqrt(2). A uniform magnetic field B = 0.5 T is applied along the z-axis. The electron gyromagnetic ratio is gamma_e = 1.761 x 10^{11} rad/(s T). (a) What is the Larmor frequency? (b) Write the state |psi(t)>. (c) At what time does the spin point along -x for the first time? (d) Compute <S_x(t)>.

*Solution:*
(a) omega_L = |gamma_e| B = 1.761 x 10^{11} x 0.5 = 8.805 x 10^{10} rad/s. Frequency: f_L = omega_L / (2pi) = 14.0 GHz.

(b) H = -(gamma_e hbar B / 2) sigma_z. The eigenstate energies are E_up = -(gamma_e hbar B/2) and E_down = +(gamma_e hbar B/2). (Note: gamma_e is negative for electrons, so E_up is actually the higher energy state.)

|psi(t)> = (1/sqrt(2))[e^{-iE_up t/hbar}|up> + e^{-iE_down t/hbar}|down>] = (1/sqrt(2))[e^{i omega_L t/2}|up> + e^{-i omega_L t/2}|down>].

(c) |-x> = (|up> - |down>)/sqrt(2). We need e^{i omega_L t/2} / e^{-i omega_L t/2} = e^{i omega_L t} = -1, so omega_L t = pi. t = pi / omega_L = pi / (8.805 x 10^{10}) = 3.57 x 10^{-11} s = 35.7 ps.

(d) <S_x(t)> = (hbar/2) cos(omega_L t). At t = 0, <S_x> = hbar/2 (pointing along +x). At t = pi/omega_L, <S_x> = -hbar/2 (pointing along -x). The spin precesses in the xy-plane at the Larmor frequency.

**WE-P4.4: Verifying the Pauli algebra.**

*Problem:* Verify the following Pauli matrix identities by explicit matrix multiplication: (a) sigma_x sigma_y = i sigma_z. (b) sigma_x^2 = I. (c) {sigma_x, sigma_z} = 0. (d) sigma_x sigma_y sigma_z = iI.

*Solution:*
(a) sigma_x sigma_y = [[0,1],[1,0]] [[0,-i],[i,0]] = [[i,0],[0,-i]] = i [[1,0],[0,-1]] = i sigma_z. Verified.

(b) sigma_x^2 = [[0,1],[1,0]] [[0,1],[1,0]] = [[1,0],[0,1]] = I. Verified.

(c) sigma_x sigma_z = [[0,1],[1,0]] [[1,0],[0,-1]] = [[0,-1],[1,0]]. sigma_z sigma_x = [[1,0],[0,-1]] [[0,1],[1,0]] = [[0,1],[-1,0]]. Sum: [[0,-1],[1,0]] + [[0,1],[-1,0]] = [[0,0],[0,0]] = 0. Verified.

(d) sigma_x sigma_y sigma_z = (i sigma_z)(sigma_z) = i sigma_z^2 = i I. Verified.

**WE-P4.5: The spin-1/2 rotation matrix.**

*Problem:* Compute the rotation matrix R(z_hat, pi/2) = exp(-i (pi/4) sigma_z) for a spin-1/2 particle. Apply it to the state |+x>. What state results, and where does it point on the Bloch sphere?

*Solution:*
R(z_hat, pi/2) = cos(pi/4) I - i sin(pi/4) sigma_z = (1/sqrt(2)) [[1,0],[0,1]] - (i/sqrt(2)) [[1,0],[0,-1]] = (1/sqrt(2)) [[1-i, 0],[0, 1+i]].

Alternatively: R = [[e^{-i pi/4}, 0],[0, e^{i pi/4}]].

Apply to |+x> = (1/sqrt(2))(1, 1)^T:
R |+x> = (1/sqrt(2))(e^{-i pi/4}, e^{i pi/4})^T = (1/sqrt(2))(cos(pi/4) - i sin(pi/4), cos(pi/4) + i sin(pi/4))^T = (1/sqrt(2))((1-i)/sqrt(2), (1+i)/sqrt(2))^T.

This is (1/2)((1-i)|up> + (1+i)|down>) = (1/2)(|up> + e^{i pi/2}|down>) x (1-i)/... Let me simplify: the relative phase between |up> and |down> is e^{i pi/4} / e^{-i pi/4} = e^{i pi/2} = i. So the state is proportional to |up> + i|down> = sqrt(2) |+y>.

Result: R(z_hat, pi/2)|+x> = e^{-i pi/4} |+y> (up to global phase, this is |+y>). On the Bloch sphere, a pi/2 rotation about z takes the +x state to the +y state. This is exactly what we expect from the classical picture of rotation, confirming the correspondence between SU(2) rotations of spinors and SO(3) rotations of the Bloch vector.

### 7. Common Confusions

**CC-P4.1: "Spin is the particle spinning on its axis."**
Spin angular momentum has no classical analogue. A point particle (like an electron) has no spatial extent, so it cannot "spin" in any literal sense. Calculations show that if the electron were a spinning sphere of radius equal to the classical electron radius, its surface would need to move faster than light to account for the observed angular momentum. Spin is a purely quantum property that happens to obey the same algebra as orbital angular momentum.

**CC-P4.2: "The spin can point in any direction, so there are infinitely many states."**
The Bloch sphere does have a continuum of points, so there are indeed infinitely many pure states. But any measurement of spin along an axis yields only two outcomes: +hbar/2 or -hbar/2. The infinity of states is in the Hilbert space; the discreteness of outcomes is in the measurement (eigenvalue spectrum). Students often confuse "number of states" with "number of measurement outcomes."

**CC-P4.3: "The state |+x> is halfway between |+z> and |-z>."**
The Bloch sphere makes this look true geometrically (the +x point is equidistant from the poles), but "halfway between" is misleading. |+x> is a definite state with zero uncertainty in S_x. It is a superposition of |+z> and |-z> with equal amplitudes. The word "between" suggests some kind of mixture or intermediate value, but |+x> is a fully determined quantum state, not a fuzzy or indeterminate one.

**CC-P4.4: "A 360-degree rotation should return the state to itself."**
For ordinary vectors in 3D (tensors of integer rank), a 2pi rotation IS the identity. But spinors are not ordinary vectors. The rotation operator for spin-1/2 gives R(2pi) = -I, so the state picks up a minus sign. This sign is physically measurable in interference experiments (neutron interferometry). The 4pi periodicity is the signature of half-integer spin and the SU(2) double cover of SO(3).

**CC-P4.5: "The magnetic moment is always parallel to the spin."**
For the electron, mu = -g_e (e/2m_e) S, where g_e approximately 2.002 (the electron g-factor). The minus sign means the magnetic moment is antiparallel to the spin. For the proton, the g-factor is positive (g_p approximately 5.586), so the magnetic moment is parallel to the spin. The relationship between mu and S depends on the particle; the sign and magnitude of the g-factor are not universal.

### 8. Cross-References

| Reference | Direction | Description |
|-----------|-----------|-------------|
| A3 (Matrices) | backward | Matrix algebra: eigenvalues, eigenvectors, matrix exponentials used throughout. |
| A4 (Eigenvalues) | backward | Spectral theorem applied to 2x2 Hermitian matrices. |
| P1 (Classical Failures) | backward | Stern-Gerlach experiment: now analysed with full formalism. |
| P2 (Postulates) | backward | Postulates applied concretely: Born rule, projection, incompatible observables. |
| P3 (Schrodinger Equation) | backward | Time evolution of spin states (precession) via the Schrodinger equation. |
| C1 (Qubit) | forward | Spin-1/2 as the physical realisation of a qubit; Pauli matrices as quantum gates. |
| C3 (Gates/Bloch Sphere) | forward | Pauli gates X, Y, Z; rotation gates R_x, R_y, R_z are directly spin rotations. |
| P5 (Uncertainty) | forward | [S_x, S_y] = i hbar S_z leads to the spin uncertainty relation Delta S_x Delta S_y >= (hbar/2)|<S_z>|. |
| P6 (Bell/CHSH) | forward | Spin-1/2 measurements along different axes are the ingredients of the Bell/CHSH inequality. |

### 9. Historical Notes

**HN-P4.1: Goudsmit and Uhlenbeck propose electron spin (1925).** Two graduate students at Leiden, Samuel Goudsmit and George Uhlenbeck, proposed that the electron has an intrinsic angular momentum of hbar/2. Their advisor Ehrenfest encouraged them to publish despite their doubts. Pauli initially opposed the idea, pointing out that a spinning electron would need superluminal surface velocities. The concept survived because it explained the anomalous Zeeman effect and fine structure of spectral lines.

**HN-P4.2: Pauli's exclusion principle and spin matrices (1924-1927).** Wolfgang Pauli introduced the exclusion principle (no two electrons in the same quantum state) in 1925, before spin was understood. In 1927, he introduced the Pauli matrices and the non-relativistic spin formalism. Pauli was notoriously critical and intimidating; Ehrenfest once said of a Pauli lecture, "I understood everything, which shows it must be wrong."

**HN-P4.3: Dirac's relativistic electron equation (1928).** Paul Dirac derived his relativistic wave equation for the electron, which predicted spin-1/2 automatically -- it was not put in by hand but emerged from the requirement of Lorentz covariance plus linearity in time. Dirac's equation also predicted the positron (anti-electron), discovered by Anderson in 1932. The Dirac equation provides the deepest understanding of why spin exists.

**HN-P4.4: Neutron 4pi rotation experiment (1975).** Helmut Rauch (Vienna) and Samuel Werner (Missouri) independently demonstrated the 4pi symmetry of spinors using neutron interferometry. Neutrons traversing one arm of an interferometer in a magnetic field acquired a phase shift proportional to the precession angle. The interference pattern had period 4pi, not 2pi, directly confirming the SU(2) nature of spin-1/2.

**HN-P4.5: NMR and MRI (Bloch & Purcell, 1946; Lauterbur & Mansfield, 1973).** Felix Bloch and Edward Purcell independently discovered nuclear magnetic resonance (NMR) in 1946, based on the Larmor precession of nuclear spins. Paul Lauterbur and Peter Mansfield developed magnetic resonance imaging (MRI) in the 1970s by adding spatial gradients to encode position. Both discoveries earned Nobel Prizes (1952 and 2003 respectively). The physics is precisely the spin precession described in this lesson, applied to proton spins in water molecules.

### 10. Problem Set

**PS-P4.01 (Computational, Easy):** Verify by direct multiplication that sigma_x sigma_y = i sigma_z, sigma_y sigma_z = i sigma_x, and sigma_z sigma_x = i sigma_y.

**PS-P4.02 (Computational, Easy):** Find the eigenvalues and normalised eigenvectors of sigma_x. Express the eigenvectors in Dirac notation as superpositions of |up> and |down>.

**PS-P4.03 (Computational, Medium):** A spin-1/2 particle is in state |+z>. A measurement of S_n is performed, where n_hat makes angle theta with the z-axis in the xz-plane. (a) Write the eigenstates |+n> and |-n>. (b) Compute the probabilities of each outcome as a function of theta. (c) Evaluate for theta = 0, pi/4, pi/2, 3pi/4, pi and interpret each result physically.

**PS-P4.04 (Computational, Medium):** A spin-1/2 particle passes through SG(z), producing |+z>. It then passes through SG(n) at angle theta to z. The + output is selected, followed by SG(z). Compute the probability of +z as a function of theta. Plot it. For what theta is this probability maximised?

**PS-P4.05 (Derivation, Hard):** Derive the raising and lowering operators S_+ = S_x + iS_y and S_- = S_x - iS_y. Show that S_+ |down> = hbar |up>, S_+ |up> = 0, S_- |up> = hbar |down>, and S_- |down> = 0. Use these to construct sigma_x and sigma_y from sigma_z.

**PS-P4.06 (Computational, Medium):** An electron spin is initially in |+z>. A magnetic field B = 1.0 T is applied along the x-axis. (a) Write the Hamiltonian. (b) Find the time-evolution operator U(t). (c) Compute the probability of finding the spin in |+z> at time t. (d) At what time is the spin first in |-z> with certainty?

**PS-P4.07 (Computational, Hard):** Show that the rotation operator R(n_hat, theta) = exp(-i theta n_hat . sigma / 2) = cos(theta/2) I - i sin(theta/2) n_hat . sigma. [Hint: expand the exponential in a Taylor series and use (n_hat . sigma)^2 = I.]

**PS-P4.08 (Computational, Medium):** Compute R(z_hat, pi) and apply it to |+x>. What state results? Verify using the Bloch sphere.

**PS-P4.09 (Simulator, Easy):** Use the Stern-Gerlach simulator to set up: SG(z) -> select +z -> SG(theta). Vary theta from 0 to 180 degrees in steps of 15 degrees. For each, run 1000 trials and record the fraction that emerge +n. Plot your data and compare with cos^2(theta/2).

**PS-P4.10 (Conceptual, Medium):** Explain why a 2pi rotation of a spinor gives -1, not +1. Is this minus sign physically observable? Describe an experiment that detects it.

**PS-P4.11 (Computational, Hard):** The spin precession Hamiltonian in a magnetic field B = B_0(sin alpha x_hat + cos alpha z_hat) (field at angle alpha to z) is H = -(gamma hbar / 2)(sigma_z cos alpha + sigma_x sin alpha). Find the energy eigenvalues and eigenstates. Compute the time evolution of |+z> under this Hamiltonian.

**PS-P4.12 (Synthesis, Hard):** Explain why the Pauli matrices, together with the identity matrix I, form a basis for all 2x2 Hermitian matrices. That is, show that any 2x2 Hermitian matrix can be written as A = a_0 I + a_1 sigma_x + a_2 sigma_y + a_3 sigma_z with real coefficients a_0, a_1, a_2, a_3. Determine the coefficients in terms of the matrix elements of A.

### 11. Simulator Dependencies

| Simulator | Usage in P4 | Presets |
|-----------|------------|---------|
| Stern-Gerlach (SIM_SG_UI) | Primary. Sequential devices at various angles, verifying Born rule probabilities. | Preset P4-SG-1: Two devices, z then theta (adjustable). Preset P4-SG-2: Three devices, z-x-z. Preset P4-SG-3: Three devices, z-theta-z (adjustable theta). |
| Qubit Circuit (SIM_QUBIT_UI) | Supporting. Maps spin rotations to quantum gates. | Preset P4-Q-1: Pauli-X gate on |0>. Preset P4-Q-2: Rotation R_z(theta) on |+x>. Preset P4-Q-3: Arbitrary rotation sequence. |

The CHSH simulator and 1D Schrodinger simulator are NOT used in P4.

### 12. Estimates

| Item | Estimate |
|------|----------|
| Prose word count | 12,000--15,000 words |
| Number of equations (display math) | 50--60 |
| Number of inline math expressions | 150--180 |
| Figures and visual assets | 7 (see VA list) |
| Interactive components | 5 (Bloch sphere, sequential SG, spin precession, belt trick, simulators) |
| Worked examples | 5 |
| Problem set questions | 12 |
| Estimated development time (prose + equations) | 5 days |
| Estimated development time (visual assets) | 4 days |
| Estimated development time (interactive components) | 3 days |
| Total estimated development time | 12 days |

### 13. Page Splits

P4 is a single-page lesson. At 12,000--15,000 words it is on the long side for a single page but does not warrant a split. The six acts provide natural section breaks for the sticky sidebar navigation. If during prose writing the lesson exceeds 15,000 words, it may be split into two pages at the boundary between Act III (eigenstates) and Act IV (sequential SG), yielding a "Theory" page and an "Applications" page.

---

## P5 -- The Uncertainty Principle

**Canonical position:** 13 of 23
**Prerequisites:** A1 (complex numbers), A2 (vectors), A3 (matrices), A4 (eigenvalues), A5 (tensor products), P2 (postulates), P3 (Schrodinger equation), P4 (spin-1/2 and Pauli matrices)
**Slug:** `p5-uncertainty`
**Target length:** 10,000--12,000 words
**Page splits:** Single page (no split)
**Paid:** Yes

### 1. Learning Objectives

By the end of this lesson the student will be able to:

1. **LO-P5.1:** Define the uncertainty (standard deviation) of an observable A in state |psi> as Delta A = sqrt(<A^2> - <A>^2), and compute it for specific states and observables.
2. **LO-P5.2:** State and prove the Robertson uncertainty relation: Delta A * Delta B >= (1/2)|<[A, B]>| for any two Hermitian operators A, B and any state |psi>, deriving it from the Cauchy-Schwarz inequality.
3. **LO-P5.3:** Apply the Robertson relation to position and momentum operators: [x, p] = i*hbar, yielding Delta x * Delta p >= hbar/2, and explain why this is a statement about the properties of quantum states, not about measurement disturbance.
4. **LO-P5.4:** Apply the Robertson relation to spin-1/2 operators: [S_x, S_y] = i*hbar S_z, yielding Delta S_x * Delta S_y >= (hbar/2)|<S_z>|, and compute this for specific spin states.
5. **LO-P5.5:** Distinguish the Robertson uncertainty relation (a property of quantum states) from Heisenberg's original measurement-disturbance argument (the gamma-ray microscope) and explain why the Robertson version is more fundamental and more general.
6. **LO-P5.6:** Identify minimum-uncertainty states (states that saturate the inequality) for position-momentum (Gaussian wave packets) and for spin (eigenstates of S_n lying in the equatorial plane of the Bloch sphere).
7. **LO-P5.7:** Explain why the uncertainty principle does not forbid precise measurement of a single observable, but rather constrains the joint statistical spread of two incompatible observables over an ensemble of identically prepared systems.
8. **LO-P5.8:** Use the Stern-Gerlach simulator to prepare spin states and measure the uncertainties Delta S_x and Delta S_z, verifying the spin uncertainty relation empirically.
9. **LO-P5.9:** Use the 1D Schrodinger simulator to visualise the position-momentum uncertainty relation: narrower wave packets in position space correspond to broader distributions in momentum space, and vice versa.

### 2. Intuition Arc

**Opening hook (500 words):** The uncertainty principle is probably the most famous -- and most misunderstood -- result in all of physics. Popular culture renders it as "the act of measuring something changes it" or "you can't know both position and momentum." Both are misleading at best. The truth is more subtle, more precise, and more interesting: it is a mathematical theorem about the structure of quantum states, derivable from the postulates using only linear algebra.

**Act I -- What "uncertainty" means (1,500 words):** Define the uncertainty of an observable A in a state |psi> as the standard deviation Delta A = sqrt(<psi|A^2|psi> - <psi|A|psi>^2). This is a property of the state, not of any particular measurement. For a spin-1/2 particle in state |+z>: Delta S_z = 0 (the state is an eigenstate of S_z, so S_z is perfectly definite) but Delta S_x = hbar/2 (the state is maximally uncertain about S_x). For |+x>: Delta S_x = 0 but Delta S_z = hbar/2. The uncertainty is not about ignorance -- it is about the intrinsic statistical spread of outcomes for identically prepared systems.

**Act II -- The Robertson derivation from Cauchy-Schwarz (3,000 words):** This is the mathematical core of the lesson. The Cauchy-Schwarz inequality (proved in A2) states |<f|g>|^2 <= <f|f> <g|g> for any vectors |f>, |g>. Let |f> = (A - <A>)|psi> and |g> = (B - <B>)|psi>. Then <f|f> = (Delta A)^2, <g|g> = (Delta B)^2. The inner product <f|g> = <psi|(A-<A>)(B-<B>)|psi>. Split this into Hermitian and anti-Hermitian parts: (A-<A>)(B-<B>) = (1/2){A-<A>, B-<B>} + (1/2)[A-<A>, B-<B>]. The Hermitian part has a real expectation value; the anti-Hermitian part has a purely imaginary expectation value. The commutator [A-<A>, B-<B>] = [A, B] (the constants cancel). Therefore |<f|g>|^2 = (1/4)<{A-<A>, B-<B>}>^2 + (1/4)|<[A,B]>|^2. Since the first term is non-negative, |<f|g>|^2 >= (1/4)|<[A,B]>|^2. Combining with Cauchy-Schwarz: (Delta A)^2 (Delta B)^2 >= (1/4)|<[A,B]>|^2, giving the Robertson relation Delta A * Delta B >= (1/2)|<[A,B]>|. Emphasise: this is a rigorous mathematical theorem, not a heuristic argument.

**Act III -- Position-momentum uncertainty (2,000 words):** For position x and momentum p: [x, p] = i*hbar (this is a canonical commutation relation, proved in the position representation where x acts by multiplication and p = -i*hbar d/dx). Therefore Delta x * Delta p >= hbar/2. This is a statement about all quantum states: there is no state in which both position and momentum are simultaneously sharply defined. Minimum-uncertainty states: Gaussian wave packets psi(x) = (2 pi sigma^2)^{-1/4} exp(ik_0 x - x^2/(4 sigma^2)) have Delta x = sigma, Delta p = hbar/(2 sigma), and Delta x * Delta p = hbar/2 (equality). These are the "most classical" quantum states -- they minimise quantum fuzziness. The ground state of the harmonic oscillator is a Gaussian and thus a minimum-uncertainty state. Connect to P3: the zero-point energy of the harmonic oscillator (E_0 = hbar omega / 2) can be estimated from the uncertainty principle by minimising <H> = <p^2>/(2m) + (1/2) m omega^2 <x^2> subject to Delta x * Delta p = hbar/2.

**Act IV -- Spin uncertainty (2,000 words):** For spin: [S_x, S_y] = i hbar S_z, so Delta S_x * Delta S_y >= (hbar/2)|<S_z>|. This is state-dependent: the right-hand side depends on <S_z>. For |+z>: <S_z> = hbar/2, so Delta S_x * Delta S_y >= hbar^2/4. Compute directly: Delta S_x = Delta S_y = hbar/2, giving Delta S_x * Delta S_y = hbar^2/4 -- equality! The state |+z> is a minimum-uncertainty state for the S_x-S_y pair. For |+x>: <S_z> = 0, so the Robertson bound is trivial (>= 0). The actual uncertainties are Delta S_x = 0, Delta S_y = hbar/2, with product 0. The bound is tight (0 >= 0). This illustrates that the Robertson bound is not always tight and that the uncertainty relation is trivially satisfied when one observable has zero uncertainty (an eigenstate).

**Act V -- What the uncertainty principle is NOT (2,000 words):** Heisenberg's original 1927 argument used the gamma-ray microscope thought experiment: to measure the position of an electron precisely, use short-wavelength (high-energy) photons, which kick the electron and disturb its momentum. This suggests uncertainty is about measurement disturbance. But the Robertson relation is about the properties of quantum states before any measurement is performed. It says: for any state |psi>, the standard deviations of A and B (computed from the Born rule over an ensemble of identical preparations) satisfy the inequality. No measurement is performed in the derivation. The disturbance picture is sometimes qualitatively correct but is not the correct foundation of the uncertainty principle. The correct foundation is the non-commutativity of operators, which is a consequence of the structure of quantum mechanics itself. Ozawa (2003) and later experiments (Rozema et al., 2012) have shown that measurement disturbance and state-preparation uncertainty are distinct concepts, and that Heisenberg's original formulation of the measurement-disturbance relation is actually violated in some experiments (the Robertson relation, being about states, is never violated).

**Synthesis (500 words):** The uncertainty principle is a theorem, not a postulate. It follows from the Cauchy-Schwarz inequality and the structure of quantum mechanics. It constrains the simultaneous sharpness of incompatible observables in any quantum state. It is about states, not measurements. It is the mathematical expression of non-commutativity. And it has profound physical consequences: zero-point energy, quantum tunnelling limits, and the fundamental limits of quantum computing and quantum metrology.

### 3. Theorems and Proofs (Sketched)

**Theorem P5-T1: Robertson uncertainty relation (FULL PROOF).**
This is a complete proof, not just a sketch, as it is the centrepiece of the lesson.

- Let |f> = (A - <A>)|psi>, |g> = (B - <B>)|psi>.
- <f|f> = <psi|(A-<A>)^2|psi> = (Delta A)^2.
- <g|g> = (Delta B)^2.
- Cauchy-Schwarz: |<f|g>|^2 <= <f|f><g|g> = (Delta A)^2 (Delta B)^2.
- <f|g> = <psi|(A-<A>)(B-<B>)|psi>.
- Write (A-<A>)(B-<B>) = (1/2){A', B'} + (1/2)[A', B'] where A' = A - <A> and B' = B - <B>.
- {A', B'} is Hermitian, so its expectation value is real: <{A',B'}> in R.
- [A', B'] = [A, B] (constants commute with everything). [A, B] is anti-Hermitian (if A, B are Hermitian), so i[A,B] is Hermitian, and <[A,B]> is purely imaginary: <[A,B]> = i * (real number).
- |<f|g>|^2 = (1/4)|<{A',B'}> + <[A,B]>|^2 = (1/4)<{A',B'}>^2 + (1/4)|<[A,B]>|^2 (cross term vanishes since one is real and the other purely imaginary).
- Since <{A',B'}>^2 >= 0: |<f|g>|^2 >= (1/4)|<[A,B]>|^2.
- Combining: (Delta A)^2 (Delta B)^2 >= (1/4)|<[A,B]>|^2.
- Taking square roots: Delta A * Delta B >= (1/2)|<[A,B]>|. QED.

**Theorem P5-T2: [x, p] = i*hbar.**
- In the position representation: x psi(x) = x psi(x) and p psi(x) = -i hbar dpsi/dx.
- [x, p] psi(x) = x(-i hbar dpsi/dx) - (-i hbar d(x psi)/dx) = -i hbar x dpsi/dx + i hbar (psi + x dpsi/dx) = i hbar psi(x).
- Therefore [x, p] = i hbar I.

**Theorem P5-T3: Minimum-uncertainty states are Gaussian.**
- Equality in Cauchy-Schwarz iff |g> = c |f> for some scalar c.
- Equality in the Robertson relation also requires <{A',B'}> = 0.
- For x and p: (x - <x>)|psi> = c (p - <p>)|psi>.
- In position representation: (x - <x>) psi(x) = c (-i hbar d/dx - <p>) psi(x).
- This is a first-order ODE. Solution: psi(x) = N exp(i<p>x/hbar) exp(-(x-<x>)^2/(4 sigma^2)) where sigma^2 = i hbar c / 2 (choosing c to make sigma^2 real and positive gives a purely imaginary c = -2i sigma^2/hbar).
- This is a Gaussian wave packet. Delta x = sigma, Delta p = hbar/(2sigma), Delta x Delta p = hbar/2.

**Theorem P5-T4: Ground state energy estimate from uncertainty principle.**
- For a harmonic oscillator H = p^2/(2m) + (1/2) m omega^2 x^2.
- <H> = <p^2>/(2m) + (1/2) m omega^2 <x^2>.
- For a state centered at origin with zero mean momentum: <x> = <p> = 0, so <x^2> = (Delta x)^2 and <p^2> = (Delta p)^2.
- Using Delta x * Delta p = hbar/2 (minimum uncertainty): Delta p = hbar/(2 Delta x).
- <H> = hbar^2/(8m (Delta x)^2) + (1/2) m omega^2 (Delta x)^2.
- Minimise over Delta x: d<H>/d(Delta x) = -hbar^2/(4m (Delta x)^3) + m omega^2 (Delta x) = 0.
- (Delta x)^4 = hbar^2/(4m^2 omega^2), so Delta x = sqrt(hbar/(2m omega)).
- <H>_min = hbar^2/(8m) * 2m omega/hbar + (1/2) m omega^2 * hbar/(2m omega) = hbar omega/4 + hbar omega/4 = hbar omega/2.
- This matches the exact ground state energy E_0 = hbar omega/2, confirming the estimate.

### 4. Historical Experiments with Apparatus Descriptions

**Experiment 1: Heisenberg's gamma-ray microscope (1927, thought experiment)**

*Apparatus (gedanken):* A microscope attempts to determine the position of an electron by scattering a single photon off it. The microscope has aperture angle epsilon. The resolving power (Rayleigh criterion) gives Delta x ~ lambda / sin(epsilon), where lambda is the photon wavelength. To achieve high position resolution, use short wavelength (high frequency) photons.

*Disturbance argument:* The scattered photon kicks the electron. The photon can enter the microscope from any direction within the aperture cone, so the electron's recoil momentum is uncertain by Delta p ~ h sin(epsilon) / lambda. Therefore Delta x * Delta p ~ h.

*Analysis:* This argument gives the correct order of magnitude but is not a proof. It relies on specific assumptions about the measurement apparatus and can be criticised (e.g., what if we don't use a photon?). The Robertson derivation is superior because it depends only on the algebraic structure of quantum mechanics and applies to all states and all measurements, not just microscope-based position measurements.

*Implications:* Heisenberg's argument was historically influential but is often misinterpreted as the "reason" for the uncertainty principle. The modern view: the uncertainty principle is about states, not about measurement-induced disturbance.

**Experiment 2: Single-slit diffraction as position-momentum uncertainty**

*Apparatus:* A beam of particles (electrons or photons) passes through a single slit of width Delta x = a. After the slit, the particles hit a detector screen a distance L away. The diffraction pattern is recorded.

*Physics:* Passing through the slit constrains the transverse position to Delta x ~ a. By the uncertainty principle, the transverse momentum uncertainty must be at least Delta p_y ~ hbar / (2a). After traveling a distance L, this momentum spread produces a spatial spread on the screen of Delta y ~ L * Delta p_y / p_z ~ L hbar / (2a p_z) ~ L lambda / (2a) (using de Broglie relation p_z = h/lambda). This matches the first minimum of the single-slit diffraction pattern, Delta y = L lambda / a (within a factor of order 1).

*Result:* Narrowing the slit (reducing Delta x) broadens the diffraction pattern (increasing Delta p_y), exactly as the uncertainty principle predicts. This is experimentally verified.

**Experiment 3: Ozawa's experiment -- distinguishing state uncertainty from measurement disturbance (Rozema et al., 2012)**

*Apparatus:* A photon polarisation experiment at the University of Toronto. Single photons are prepared in known polarisation states. Weak measurements are used to estimate the initial value of one polarisation component, followed by a strong (projective) measurement of an incompatible component. By comparing the weak measurement results with the subsequent strong measurement, the experimenters could independently quantify: (a) the measurement disturbance (how much measuring one observable disturbs the other) and (b) the state preparation uncertainty (the Robertson relation).

*Result:* Ozawa's measurement-disturbance relation (a refinement of Heisenberg's original relation) was confirmed: the product of measurement error and disturbance satisfies a bound different from (and in some cases tighter than) the Robertson bound. Importantly, the experiment showed that Heisenberg's original measurement-disturbance inequality (naively, epsilon_A * eta_B >= hbar/2) can be violated -- one can sometimes measure with less disturbance than Heisenberg predicted. But the Robertson relation Delta A * Delta B >= (1/2)|<[A,B]>| (about states, not measurements) was never violated.

*Implications:* The modern distinction between preparation uncertainty (Robertson) and measurement-disturbance uncertainty (Ozawa) is experimentally established. The uncertainty principle is fundamentally about states, not about clumsy measurements.

### 5. Visual Assets

**VA-P5.1: Uncertainty principle derivation diagram.**
- Type: Styled SVG/HTML.
- Description: A visual proof flow: Cauchy-Schwarz inequality -> applied to (A-<A>)|psi> and (B-<B>)|psi> -> split into commutator and anticommutator -> drop the anticommutator term -> Robertson relation. Each step is a box with a clickable "expand" for the full algebra. Colour-coded to distinguish the Hermitian (real) and anti-Hermitian (imaginary) parts.
- File: `uncertainty-derivation-diagram.tsx`

**VA-P5.2: Position-momentum Fourier pair visualisation.**
- Type: Interactive chart.
- Description: Two vertically stacked plots. Top: |psi(x)|^2 (position probability density). Bottom: |phi(p)|^2 (momentum probability density, the Fourier transform). A slider adjusts the width sigma of a Gaussian wave packet. As sigma decreases (narrower in position), the momentum distribution broadens, and vice versa. The product Delta x * Delta p is displayed in real time, always >= hbar/2. For Gaussian states, it equals exactly hbar/2.
- File: `fourier-pair-visualisation.tsx`

**VA-P5.3: Spin uncertainty on the Bloch sphere.**
- Type: Interactive 3D.
- Description: A Bloch sphere with a state vector that the student can drag. For the selected state, three numerical readouts display: Delta S_x, Delta S_y, Delta S_z, and the products Delta S_x * Delta S_y, Delta S_x * Delta S_z, Delta S_y * Delta S_z. The Robertson bounds (1/2)|<S_z>|, (1/2)|<S_x>|, (1/2)|<S_y>| are shown as comparison bars. Students can verify that the uncertainty products always meet or exceed the bounds, and that eigenstates of an axis have zero uncertainty in that axis and maximal uncertainty in the perpendicular axes.
- File: `spin-uncertainty-bloch.tsx`

**VA-P5.4: Heisenberg microscope diagram.**
- Type: Static SVG.
- Description: The gamma-ray microscope thought experiment. A photon is shown scattering off an electron at the focus of a microscope. Labeled: photon wavelength lambda, aperture angle epsilon, scattered photon entering the microscope, electron recoil. Equations for Delta x and Delta p are displayed next to the relevant geometry. A prominent callout box states: "This is a heuristic argument, NOT a proof. See the Robertson derivation for the rigorous result."
- File: `heisenberg-microscope.svg`

**VA-P5.5: Single-slit diffraction uncertainty animation.**
- Type: Interactive chart/animation.
- Description: A beam of particles passes through a slit of adjustable width a. The diffraction pattern on the screen is shown in real time. As a decreases, the pattern broadens. Numerical readouts show Delta x (slit width) and Delta p_y (momentum spread, computed from the pattern width), with their product compared to hbar/2.
- File: `single-slit-uncertainty.tsx`

**VA-P5.6: Stern-Gerlach simulator embed.**
- Type: Interactive simulator (SIM_SG_UI component).
- Description: Used to prepare specific spin states and measure the spread of outcomes, computing empirical uncertainties. The student prepares |+z>, measures many times in the x-direction, and computes the standard deviation from the data. Compared with the theoretical Delta S_x = hbar/2.
- File: Embedded `<SternGerlachSim />` with lesson-specific presets.
- Dependencies: SIM_CORE, SIM_SG_UI.

**VA-P5.7: 1D Schrodinger simulator embed.**
- Type: Interactive simulator (SIM_SCHRODINGER_UI component).
- Description: Used to visualise Gaussian wave packets in position and momentum space simultaneously. The student can adjust the initial width and observe the Fourier conjugate relationship. Also used to visualise the ground state of the harmonic oscillator as a minimum-uncertainty state.
- File: Embedded `<SchrodingerSim1D />` with lesson-specific presets.
- Dependencies: SIM_CORE, SIM_SCHRODINGER_UI.

### 6. Worked Examples

**WE-P5.1: Spin uncertainty for |+z>.**

*Problem:* Compute Delta S_x, Delta S_y, and Delta S_z for the state |+z>. Verify the Robertson relation Delta S_x * Delta S_y >= (hbar/2)|<S_z>|.

*Solution:*
For |+z>:
- <S_z> = hbar/2. <S_z^2> = (hbar/2)^2. Delta S_z = 0.
- <S_x> = 0 (by symmetry or direct computation: <+z|sigma_x|+z> = <+z|[0,1;1,0]|+z> = (1,0)(0,1)^T = 0). <S_x^2> = (hbar/2)^2 (since sigma_x^2 = I). Delta S_x = sqrt((hbar/2)^2 - 0) = hbar/2.
- Similarly, Delta S_y = hbar/2.

Robertson bound: Delta S_x * Delta S_y >= (hbar/2)|<S_z>| = (hbar/2)(hbar/2) = hbar^2/4.
Actual product: (hbar/2)(hbar/2) = hbar^2/4.
Equality holds! |+z> is a minimum-uncertainty state for the S_x-S_y pair.

**WE-P5.2: Spin uncertainty for a tilted state.**

*Problem:* A spin-1/2 particle is in state |psi> = cos(pi/6)|+z> + sin(pi/6)|−z> (i.e., theta = pi/3 on the Bloch sphere, phi = 0, which is a state tilted 60 degrees from z toward x). Compute Delta S_x * Delta S_z and compare with the Robertson bound.

*Solution:*
theta = pi/3, phi = 0. Bloch vector: (sin(pi/3), 0, cos(pi/3)) = (sqrt(3)/2, 0, 1/2).

<S_x> = (hbar/2) sin(pi/3) = hbar sqrt(3)/4.
<S_y> = 0.
<S_z> = (hbar/2) cos(pi/3) = hbar/4.

<S_x^2> = (hbar/2)^2 = hbar^2/4 (always, for spin-1/2).
Delta S_x = sqrt(hbar^2/4 - 3hbar^2/16) = sqrt(hbar^2/16) = hbar/4.

<S_z^2> = hbar^2/4 (always).
Delta S_z = sqrt(hbar^2/4 - hbar^2/16) = sqrt(3hbar^2/16) = hbar sqrt(3)/4.

Product: Delta S_x * Delta S_z = (hbar/4)(hbar sqrt(3)/4) = hbar^2 sqrt(3)/16.

Robertson bound for [S_x, S_z] = -i hbar S_y: (1/2)|<-i hbar S_y>| = (hbar/2)|<S_y>| = 0 (since <S_y> = 0 for this state).

The bound is trivial (product >= 0), and it is satisfied (hbar^2 sqrt(3)/16 > 0). This illustrates that the Robertson bound is state-dependent and can be zero even when the actual uncertainties are nonzero.

**WE-P5.3: Ground state energy from the uncertainty principle.**

*Problem:* Use the uncertainty principle to estimate the ground state energy of a particle of mass m in a 1D box of width L. Compare with the exact result E_1 = pi^2 hbar^2 / (2mL^2).

*Solution:*
The particle is confined to 0 < x < L, so Delta x <= L/2 (approximately, taking Delta x as the half-width).
Uncertainty principle: Delta p >= hbar / (2 Delta x) >= hbar / L.
Minimum kinetic energy: <p^2>/(2m) >= (Delta p)^2/(2m) >= hbar^2/(2mL^2).
So E_min ~ hbar^2/(2mL^2).

The exact result is E_1 = pi^2 hbar^2/(2mL^2) = 9.87 hbar^2/(2mL^2). The uncertainty principle estimate is off by a factor of pi^2 ~ 10 because the estimate Delta x ~ L is crude. A better estimate using Delta x = L/(2sqrt(3)) (the standard deviation of a uniform distribution on [0, L]) gives a factor of 12, closer but still approximate.

The uncertainty principle gives the correct order of magnitude and the correct scaling with m and L, but not the precise numerical coefficient. The exact result requires solving the TISE (P3).

**WE-P5.4: Minimum uncertainty state for position-momentum.**

*Problem:* Show that the Gaussian wave packet psi(x) = (2 pi sigma^2)^{-1/4} exp(-x^2/(4 sigma^2)) is a minimum-uncertainty state. Compute Delta x, Delta p, and verify Delta x * Delta p = hbar/2.

*Solution:*
<x> = 0 (symmetric wave function). <x^2> = integral x^2 |psi|^2 dx = sigma^2 (standard result for Gaussian). Delta x = sigma.

Fourier transform: phi(p) = (2 pi (hbar/(2sigma))^2)^{-1/4} exp(-p^2 sigma^2 / hbar^2) (a Gaussian in momentum space with width hbar/(2sigma)).

<p> = 0. <p^2> = hbar^2/(4 sigma^2). Delta p = hbar/(2 sigma).

Product: Delta x * Delta p = sigma * hbar/(2 sigma) = hbar/2.

This is exactly the Robertson bound, confirming it is a minimum-uncertainty state.

### 7. Common Confusions

**CC-P5.1: "The uncertainty principle says you can't measure position and momentum at the same time."**
More precisely: there is no quantum state in which both position and momentum have zero standard deviation simultaneously. You can measure position precisely in a single shot (getting a definite value). You can measure momentum precisely in a single shot. But if you prepare many copies of the same state, measure position on half and momentum on the other half, the standard deviations of the two data sets will always satisfy Delta x * Delta p >= hbar/2. It is about the statistical spread across an ensemble of identically prepared systems, not about a single measurement event.

**CC-P5.2: "The uncertainty principle is caused by the measurement disturbing the system."**
Heisenberg's original gamma-ray microscope argument does invoke disturbance, and this picture has some validity. But the Robertson relation is derived without any reference to measurement -- it is a theorem about the algebraic properties of operators and states. The uncertainty exists even for states that have never been measured. Ozawa's work and the Rozema et al. (2012) experiment explicitly demonstrated that measurement disturbance and preparation uncertainty are different things.

**CC-P5.3: "The uncertainty principle only applies to position and momentum."**
The Robertson relation applies to ANY pair of observables. Position-momentum is the most famous case, but spin components (Delta S_x * Delta S_y >= (hbar/2)|<S_z>|), energy-time (with appropriate caveats since time is not an operator in non-relativistic QM), and any other pair of non-commuting observables all have uncertainty relations. The principle is a general consequence of non-commutativity.

**CC-P5.4: "Delta x * Delta p >= hbar/2 means both Delta x and Delta p must be large."**
No -- one can be arbitrarily small, as long as the other is correspondingly large. A position eigenstate (Delta x = 0) has Delta p = infinity. A momentum eigenstate (Delta p = 0) has Delta x = infinity. Both are valid (though non-normalisable) quantum states. The uncertainty principle constrains the product, not the individual uncertainties.

**CC-P5.5: "The uncertainty principle means nature is fundamentally fuzzy or imprecise."**
This is more a philosophical than a technical confusion. The uncertainty principle says that incompatible observables cannot simultaneously have sharp values. But a single observable CAN have a sharp value (when the state is an eigenstate). Quantum mechanics makes extremely precise predictions -- the g-factor of the electron is predicted to 12 significant figures. The "fuzziness" is about joint distributions of incompatible observables, not about the precision of physics itself.

### 8. Cross-References

| Reference | Direction | Description |
|-----------|-----------|-------------|
| A2 (Vectors) | backward | Cauchy-Schwarz inequality: the mathematical foundation of the proof. |
| A3 (Matrices) | backward | Commutators, Hermitian operators, spectral theorem. |
| A4 (Eigenvalues) | backward | Eigenvalue decomposition used to compute expectation values and variances. |
| P2 (Postulates) | backward | Born rule defines probabilities; expectation values and variances are built on it. |
| P3 (Schrodinger Equation) | backward | Zero-point energy, wave packet spreading, harmonic oscillator ground state. |
| P4 (Spin-1/2) | backward | Spin commutation relations [S_i, S_j] = i hbar epsilon_{ijk} S_k; specific spin uncertainty examples. |
| P6 (Bell/CHSH) | forward | Incompatible observables (measured along different axes) are central to the CHSH inequality. |
| C1 (Qubit) | forward | Uncertainty relations constrain the precision of qubit state tomography. |
| P7 (Decoherence) | forward | Decoherence increases uncertainty by entangling the system with the environment. |

### 9. Historical Notes

**HN-P5.1: Heisenberg's uncertainty paper (1927).** Werner Heisenberg published "On the Perceptual Content of Quantum Theoretical Kinematics and Mechanics" in March 1927. He used the gamma-ray microscope thought experiment to argue that Delta x * Delta p ~ h. His argument was physical and heuristic, not a mathematical proof. Bohr immediately pointed out errors in Heisenberg's analysis (Heisenberg confused the resolving power of the microscope with the Compton scattering formula), and the two had heated arguments. The paper was published with a note added in proof acknowledging Bohr's corrections.

**HN-P5.2: Kennard's rigorous proof (1927).** Earle Hesse Kennard provided the first rigorous proof of Delta x * Delta p >= hbar/2 (note: hbar/2, not h/(4pi) as sometimes quoted -- they are the same) just months after Heisenberg's paper, using the Fourier transform properties of wave functions. Kennard's result is essentially the position-momentum case of the Robertson relation.

**HN-P5.3: Robertson's generalisation (1929).** Howard Percy Robertson generalised the uncertainty relation to arbitrary pairs of observables: Delta A * Delta B >= (1/2)|<[A,B]>|. This is the form taught today. The proof uses the Cauchy-Schwarz inequality and applies to any Hilbert space and any pair of self-adjoint operators.

**HN-P5.4: Ozawa's measurement-disturbance relation (2003).** Masanao Ozawa proposed a more refined uncertainty relation that separately quantifies measurement error and measurement disturbance, showing that Heisenberg's original measurement-disturbance relation is not universally valid. This was experimentally confirmed by Rozema et al. (2012) using photon polarisation measurements.

**HN-P5.5: The energy-time uncertainty relation.** The relation Delta E * Delta t >= hbar/2 is often quoted but has a different status from Delta x * Delta p >= hbar/2 because time is not an observable (operator) in non-relativistic quantum mechanics -- it is a parameter. The rigorous statement involves the Mandelstam-Tamm relation (1945): Delta E * tau >= hbar/2, where tau = Delta A / |d<A>/dt| is the time for an observable A to change by one standard deviation. This is outside the scope of this lesson but is noted for completeness.

### 10. Problem Set

**PS-P5.01 (Computational, Easy):** Compute Delta S_x, Delta S_y, and Delta S_z for the state |+x>. Verify all three Robertson relations for the three pairs (S_x, S_y), (S_y, S_z), (S_z, S_x).

**PS-P5.02 (Derivation, Medium):** Prove the Robertson uncertainty relation Delta A * Delta B >= (1/2)|<[A,B]>| starting from the Cauchy-Schwarz inequality. State clearly what mathematical facts you use at each step.

**PS-P5.03 (Computational, Medium):** For the state |psi> = cos(theta/2)|+z> + sin(theta/2)|-z> (a state at polar angle theta on the Bloch sphere with phi = 0), compute Delta S_x * Delta S_z as a function of theta. For what value of theta is this product maximised?

**PS-P5.04 (Computational, Medium):** Show that [x, p] = i hbar by acting on a test function psi(x) in the position representation.

**PS-P5.05 (Computational, Hard):** A free particle has the Gaussian wave function psi(x) = (2pi sigma^2)^{-1/4} exp(-x^2/(4 sigma^2)). (a) Compute <x>, <x^2>, Delta x. (b) Compute the Fourier transform phi(p) and compute <p>, <p^2>, Delta p. (c) Verify Delta x * Delta p = hbar/2.

**PS-P5.06 (Computational, Medium):** Use the uncertainty principle to estimate the ground state energy of the hydrogen atom. Model the atom as an electron confined to a sphere of radius r, with potential energy V = -e^2/(4 pi epsilon_0 r). Minimise <H> = (Delta p)^2/(2m) - e^2/(4 pi epsilon_0 r) with respect to r, using Delta p ~ hbar/r. Compare with the exact result E_1 = -13.6 eV.

**PS-P5.07 (Conceptual, Medium):** A student says: "If I measure the position of an electron very precisely (small Delta x), the uncertainty principle says its momentum becomes very uncertain (large Delta p). So the electron starts flying away very fast." Critique this statement. What is correct and what is misleading?

**PS-P5.08 (Simulator, Easy):** Using the 1D Schrodinger simulator, set up a Gaussian wave packet with sigma = 5 nm and another with sigma = 0.5 nm. (a) Which has a broader momentum distribution? (b) Measure the widths in position and momentum space. (c) Compute Delta x * Delta p for each and compare with hbar/2.

**PS-P5.09 (Conceptual, Hard):** Explain the difference between the Robertson uncertainty relation and the Heisenberg measurement-disturbance relation. Which is a mathematical theorem? Which is a heuristic argument? Can either be violated? Cite experimental evidence.

**PS-P5.10 (Computational, Hard):** For the quantum harmonic oscillator ground state psi_0(x) = (m omega / (pi hbar))^{1/4} exp(-m omega x^2 / (2 hbar)), compute Delta x and Delta p directly and verify that Delta x * Delta p = hbar/2. This confirms that the ground state is a minimum-uncertainty state.

**PS-P5.11 (Simulator + Computational, Medium):** Use the Stern-Gerlach simulator to prepare |+z>. Run 1000 measurements of S_x. From the data, compute the empirical standard deviation of S_x. Compare with the theoretical Delta S_x = hbar/2.

**PS-P5.12 (Synthesis, Hard):** The energy-time uncertainty relation Delta E * Delta t >= hbar/2 is NOT a standard Robertson relation because time is not an operator. Explain why time is different from position in quantum mechanics. Describe the Mandelstam-Tamm interpretation of the energy-time relation. Give a physical example.

### 11. Simulator Dependencies

| Simulator | Usage in P5 | Presets |
|-----------|------------|---------|
| Stern-Gerlach (SIM_SG_UI) | Supporting. Prepare spin states, measure in various bases, compute empirical uncertainties. | Preset P5-SG-1: Prepare |+z>, measure S_x, 1000 trials. Preset P5-SG-2: Prepare tilted state (theta adjustable), measure S_z, 1000 trials. |
| 1D Schrodinger (SIM_SCHRODINGER_UI) | Supporting. Visualise Gaussian wave packets in position and momentum space, showing the Fourier conjugate relationship. | Preset P5-S-1: Gaussian wave packet, sigma adjustable, show position and momentum distributions simultaneously. Preset P5-S-2: Harmonic oscillator ground state (minimum uncertainty). |

The qubit circuit simulator and CHSH simulator are NOT used in P5.

### 12. Estimates

| Item | Estimate |
|------|----------|
| Prose word count | 10,000--12,000 words |
| Number of equations (display math) | 40--50 |
| Number of inline math expressions | 130--160 |
| Figures and visual assets | 7 (see VA list) |
| Interactive components | 5 (Fourier pair, spin uncertainty Bloch, single-slit, SG simulator, Schrodinger simulator) |
| Worked examples | 4 |
| Problem set questions | 12 |
| Estimated development time (prose + equations) | 4 days |
| Estimated development time (visual assets) | 3 days |
| Estimated development time (interactive components) | 3 days |
| Total estimated development time | 10 days |

### 13. Page Splits

P5 is a single-page lesson. At 10,000--12,000 words it fits comfortably in a single page. The five acts provide natural section breaks. The Robertson derivation (Act II) is the densest section and should have a "Derivation" callout block that can be expanded/collapsed for students who want to see the full proof vs. those who want to read the result and move on.

---

## P6 -- Entanglement, EPR, Bell, and CHSH

**Canonical position:** 14 of 23
**Prerequisites:** A1 (complex numbers), A2 (vectors), A3 (matrices), A4 (eigenvalues), A5 (tensor products), P2 (postulates), P4 (spin-1/2 and Pauli matrices), P5 (uncertainty principle)
**Slug:** `p6-bell-chsh`
**Target length:** 20,000--25,000 words
**Page splits:** 3 pages (see Section 13)
**Paid:** Yes

### 1. Learning Objectives

By the end of this lesson the student will be able to:

1. **LO-P6.1:** Describe composite quantum systems using the tensor product (A5) of individual Hilbert spaces, write states of two-qubit systems in the computational basis {|00>, |01>, |10>, |11>}, and distinguish product states from entangled states.
2. **LO-P6.2:** Write the singlet state |Psi^-> = (|01> - |10>)/sqrt(2) and the other three Bell states, verify that they form an orthonormal basis for C^2 tensor C^2, and prove that the singlet state is entangled (cannot be written as a product state).
3. **LO-P6.3:** Compute the correlations E(a, b) = <Psi^-| (a . sigma) tensor (b . sigma) |Psi^-> = -a . b for the singlet state, where a and b are unit vectors specifying measurement axes, and explain why the correlations are perfect when a = b.
4. **LO-P6.4:** State the EPR argument (1935): if quantum mechanics is complete, then either locality or realism must be abandoned, and explain the concepts of locality, realism, and completeness in this context.
5. **LO-P6.5:** Derive Bell's inequality for a local hidden variable (LHV) model: |E(a,b) - E(a,c)| <= 1 + E(b,c), and show that quantum mechanics violates it for specific choices of measurement axes.
6. **LO-P6.6:** Derive the CHSH inequality: S = |E(a,b) + E(a,b') + E(a',b) - E(a',b')| <= 2 for any LHV model, and show that quantum mechanics achieves S = 2*sqrt(2) (the Tsirelson bound) for the singlet state with optimal measurement settings.
7. **LO-P6.7:** Describe the Aspect experiment (1982) and the loophole-free Bell tests (2015) and explain the three major loopholes (locality, detection, freedom of choice) and how they were closed.
8. **LO-P6.8:** State and prove the no-signalling theorem: measurements on one half of an entangled pair cannot be used to transmit information to the other half, even though the correlations violate Bell's inequality.
9. **LO-P6.9:** Use the CHSH simulator to run virtual Bell experiments, vary measurement angles, and verify that the CHSH parameter S exceeds 2 for entangled states but not for classical (product) states.
10. **LO-P6.10:** Explain why entanglement is a resource for quantum information processing (dense coding, teleportation, quantum key distribution) and preview its role in quantum computing (C-track).

### 2. Intuition Arc

This is a major lesson spanning three pages.

**PAGE 1: Entanglement and EPR.**

**Opening hook (500 words):** Einstein called it "spooky action at a distance." Bell called it "the most profound discovery of science." Entanglement is the property that makes quantum mechanics fundamentally different from any classical theory. In this lesson we will prove -- not argue, prove -- that the correlations between entangled particles cannot be explained by any theory that is both local and realistic. This is not a matter of philosophical preference; it is a mathematical theorem with experimental confirmation.

**Act I -- Composite systems and entanglement (3,000 words):** Two spin-1/2 particles together live in C^2 tensor C^2 = C^4 (this tensor product was introduced in A5). The computational basis is {|00>, |01>, |10>, |11>}. A product state like |00> = |0> tensor |0> describes two independently prepared particles. A general state is |psi> = sum_{ij} c_{ij} |ij>. An entangled state is one that CANNOT be written as a product |psi_A> tensor |psi_B> for any single-particle states |psi_A>, |psi_B>. Example: the singlet state |Psi^-> = (|01> - |10>)/sqrt(2). Prove it is entangled: suppose |Psi^-> = (alpha|0> + beta|1>) tensor (gamma|0> + delta|1>) = alpha gamma|00> + alpha delta|01> + beta gamma|10> + beta delta|11>. Matching coefficients: alpha gamma = 0, alpha delta = 1/sqrt(2), beta gamma = -1/sqrt(2), beta delta = 0. From the first equation, alpha = 0 or gamma = 0. If alpha = 0, the second equation alpha delta = 1/sqrt(2) gives 0 = 1/sqrt(2), contradiction. If gamma = 0, the third equation gives 0 = -1/sqrt(2), contradiction. Therefore no product decomposition exists. QED.

Introduce all four Bell states: |Phi^+> = (|00> + |11>)/sqrt(2), |Phi^-> = (|00> - |11>)/sqrt(2), |Psi^+> = (|01> + |10>)/sqrt(2), |Psi^-> = (|01> - |10>)/sqrt(2). Show they form an ONB for C^4. Discuss the reduced density matrix (partial trace): tracing out one qubit from the singlet state gives the maximally mixed state rho = I/2 for the remaining qubit, meaning the individual particles have no definite state even though the pair is in a pure state. This is the hallmark of maximal entanglement.

**Act II -- EPR and the completeness question (2,500 words):** In 1935, Einstein, Podolsky, and Rosen published a paper arguing that quantum mechanics is incomplete. Their argument (simplified to the Bohm version using spin): Prepare the singlet state and separate the two particles (Alice and Bob). If Alice measures S_z and gets +hbar/2, she immediately knows Bob's particle is in state |-z> (by the perfect anticorrelation of the singlet). She did not disturb Bob's particle (they are far apart -- locality). So Bob's particle "had" the value -hbar/2 for S_z before anyone measured. But Alice could equally have measured S_x, determining Bob's S_x value. Since Alice's choice of measurement cannot affect Bob's particle (locality), Bob's particle must have had definite values for BOTH S_x and S_z simultaneously. But quantum mechanics says these cannot be simultaneously definite (uncertainty principle, P5). Therefore quantum mechanics is incomplete -- there must be "hidden variables" that determine the outcomes but are not part of the quantum description.

The EPR argument does not claim quantum mechanics is wrong -- it claims QM is incomplete. The argument relies on two assumptions: (1) Locality: Alice's measurement choice does not instantaneously affect Bob's particle. (2) Realism: if we can predict a quantity with certainty without disturbing the system, it has a definite value (an "element of physical reality"). The EPR conclusion: if QM is complete, either locality or realism (or both) must be abandoned.

For 29 years, this seemed like a philosophical question with no empirical content. Then Bell changed everything.

**PAGE 2: Bell's inequality and CHSH.**

**Act III -- Bell's theorem (3,500 words):** John Bell (1964) showed that any theory satisfying EPR's assumptions (local realism = local hidden variables, LHV) makes testable predictions that differ from quantum mechanics. The key: look at correlations for DIFFERENT measurement axes.

Model: each particle pair carries a hidden variable lambda (drawn from some probability distribution rho(lambda)). When Alice measures along axis a, her outcome is A(a, lambda) = +/-1. When Bob measures along b, his outcome is B(b, lambda) = +/-1. Locality: A depends only on a and lambda (not on b), and B depends only on b and lambda (not on a). The correlation function is E(a, b) = integral A(a, lambda) B(b, lambda) rho(lambda) d lambda.

Derive Bell's original inequality: E(a, b) - E(a, c) = integral A(a,lambda) B(b,lambda) [1 - A(b,lambda) B(c,lambda) (note: A(b,lambda)B(b,lambda) = +/-1, but for the singlet, perfect anticorrelation means B(b,lambda) = -A(b,lambda) when measured along the same axis, so we can replace B with -A)] ... Full derivation: |E(a,b) - E(a,c)| <= 1 + E(b,c).

Now compute the QM predictions for the singlet state: E(a,b) = -a . b = -cos(theta_{ab}).

Choose a, b, c coplanar with angles: theta_{ab} = pi/3, theta_{ac} = 2pi/3, theta_{bc} = pi/3.
LHV bound: |E(a,b) - E(a,c)| <= 1 + E(b,c), i.e., |(-cos 60) - (-cos 120)| <= 1 + (-cos 60), i.e., |(-1/2) - (1/2)| <= 1 + (-1/2), i.e., 1 <= 1/2. VIOLATION. The quantum prediction violates Bell's inequality.

**Act IV -- The CHSH inequality (3,500 words):** The CHSH inequality (Clauser, Horne, Shimony, Holt, 1969) is more experimentally practical because it does not require perfect correlations.

Define S = E(a,b) + E(a,b') + E(a',b) - E(a',b').

LHV derivation: S = integral [A(a,lambda)(B(b,lambda) + B(b',lambda)) + A(a',lambda)(B(b,lambda) - B(b',lambda))] rho(lambda) d lambda. Since B(b,lambda) = +/-1 and B(b',lambda) = +/-1, either B(b,lambda) + B(b',lambda) = 0 and B(b,lambda) - B(b',lambda) = +/-2, or B(b,lambda) + B(b',lambda) = +/-2 and B(b,lambda) - B(b',lambda) = 0. In either case, |A(a,lambda)(B(b,lambda) + B(b',lambda)) + A(a',lambda)(B(b,lambda) - B(b',lambda))| <= 2 (since one term is 0 and the other has |A| * 2 = 2). Integrating: |S| <= 2.

QM computation for the singlet state: E(a,b) = -a . b. Choose measurement settings in the xz-plane:
- Alice: a = z_hat, a' = x_hat.
- Bob: b = (z_hat + x_hat)/sqrt(2) (at 45 degrees), b' = (z_hat - x_hat)/sqrt(2) (at -45 degrees).

E(a,b) = -cos(pi/4) = -sqrt(2)/2.
E(a,b') = -cos(-pi/4) = -sqrt(2)/2.
E(a',b) = -cos(pi/4) = -sqrt(2)/2.
E(a',b') = -cos(3pi/4) = +sqrt(2)/2.

S = (-sqrt(2)/2) + (-sqrt(2)/2) + (-sqrt(2)/2) - (sqrt(2)/2) = -2*sqrt(2) = -2.828...

|S| = 2*sqrt(2) > 2. The CHSH inequality is violated. The quantum value 2*sqrt(2) is the Tsirelson bound -- the maximum achievable by any quantum state and measurement settings.

**Act V -- Proof that 2*sqrt(2) is optimal (Tsirelson bound) (1,500 words):** Define the CHSH operator C = a . sigma tensor (b + b') . sigma + a' . sigma tensor (b - b') . sigma. The maximum eigenvalue of C gives the maximum S. Compute C^2 = 4I tensor I + [a . sigma, a' . sigma] tensor [b . sigma, b' . sigma]. The maximum of S is 2 sqrt(1 + |a x a'|^2 |b x b'|^2)... (sketch). For orthogonal a, a' and optimally chosen b, b', this gives 2 sqrt(2). Full computation available in the expanded derivation block.

**PAGE 3: Experiments and no-signalling.**

**Act VI -- Experimental tests (3,000 words):** Freedman and Clauser (1972): first experimental test of Bell's inequality using polarisation-entangled photons from atomic cascade in calcium. Confirmed QM violation. But suffered from the detection loophole (low detector efficiency) and the locality loophole (measurement settings were fixed, not randomly chosen).

Aspect experiment (1982): Alain Aspect and colleagues at Orsay used fast-switching acousto-optic modulators to change the polarisation measurement settings AFTER the photons had left the source, closing the locality loophole. The photon pair was entangled via atomic cascade in calcium. The measurement settings were switched every 10 ns (much faster than the light travel time between the detectors, ~40 ns). Result: S = 2.697 +/- 0.015, violating the CHSH bound of 2 by 46 standard deviations.

Apparatus description (Aspect): A calcium source is excited by two lasers (406 nm and 581 nm), producing pairs of photons at 551.3 nm and 422.7 nm via an atomic cascade 4p^2 S_0 -> 4p4s P_1 -> 4s^2 S_0. The photons travel in opposite directions through 6 m of free space to two measurement stations. Each station contains: a fast acousto-optic switch (driven by independent random number generators at ~50 MHz), two polarising beam splitters at different angles, and four single-photon detectors (photomultiplier tubes). A time-tagging system with ~1 ns resolution records coincidences.

Loophole-free tests (2015): Three independent groups (Delft, NIST, Vienna) simultaneously closed all three major loopholes in a single experiment. Delft (Hensen et al.): used nitrogen-vacancy centres in diamond, 1.3 km separation between Alice and Bob, heralded entanglement via entanglement swapping, fast random number generators based on device-independent randomness. S = 2.42 +/- 0.20. NIST (Shalm et al.): photon pairs from spontaneous parametric down-conversion, superconducting nanowire single-photon detectors with >90% efficiency. Vienna (Giustina et al.): similar photonic setup. All three confirmed QM violation with the locality, detection, and freedom-of-choice loopholes simultaneously closed.

**Act VII -- The no-signalling theorem (2,000 words):** A common concern: if Alice's measurement instantaneously "collapses" Bob's state (at a distance), can't this be used for faster-than-light communication? No. Prove the no-signalling theorem.

Setup: Alice and Bob share the state |psi> in H_A tensor H_B. Alice performs measurement M_A (with outcomes {a_i} and projectors {P_i^A}). Bob performs measurement M_B (with outcomes {b_j} and projectors {P_j^B}).

Bob's marginal probability for outcome b_j: Prob(b_j) = sum_i Prob(a_i, b_j) = sum_i <psi| (P_i^A tensor P_j^B) |psi>.

Using completeness of Alice's measurement: sum_i P_i^A = I_A. Therefore Prob(b_j) = <psi| (I_A tensor P_j^B) |psi>. This is independent of which measurement Alice performs (her projectors P_i^A have been summed away). Bob's statistics are the same regardless of Alice's measurement choice.

Equivalently, using the reduced density matrix: rho_B = Tr_A(|psi><psi|). Bob's probabilities are Prob(b_j) = Tr(P_j^B rho_B). Alice's measurement does not change rho_B (this is a consequence of the partial trace and the completeness relation).

Therefore: Alice cannot signal to Bob. The correlations are real but can only be detected when Alice and Bob compare their results -- which requires classical communication. Entanglement does not enable faster-than-light communication.

**Act VIII -- Entanglement as a resource (1,500 words):** Preview the applications of entanglement: quantum teleportation (Bennett et al., 1993), superdense coding (Bennett & Wiesner, 1992), quantum key distribution (Ekert, 1991), entanglement-based quantum computing (cross-reference C-track). Entanglement is not just a curiosity -- it is a resource, like energy or information. Quantifying entanglement (entanglement entropy, concurrence) is an active area of research. The Bell states are maximally entangled two-qubit states and will be used extensively in the C-track.

**Synthesis (1,000 words):** Bell's theorem is one of the most important results in all of physics. It shows that the quantum world is genuinely non-classical: no theory that is simultaneously local and realistic can reproduce the predictions of quantum mechanics. The CHSH inequality provides a quantitative test, and experiments have confirmed the quantum prediction with overwhelming statistical significance. Entanglement is not "spooky" -- it is a well-understood, well-tested feature of quantum mechanics, and it is the engine of quantum information science.

### 3. Theorems and Proofs (Sketched)

**Theorem P6-T1: The singlet state is entangled (proof by contradiction, given in full in Act I).**
See Act I above for the complete proof.

**Theorem P6-T2: Singlet state correlations E(a, b) = -a . b.**
- |Psi^-> = (|01> - |10>)/sqrt(2).
- E(a, b) = <Psi^-| (a . sigma tensor b . sigma) |Psi^->.
- Expand a . sigma tensor b . sigma = sum_{ij} a_i b_j (sigma_i tensor sigma_j).
- Using the result <Psi^-| sigma_i tensor sigma_j |Psi^-> = -delta_{ij} (derived from the singlet's rotational invariance or by direct computation for each i,j):
- E(a, b) = -sum_i a_i b_i = -a . b.
- Full computation of <Psi^-|sigma_i tensor sigma_j|Psi^->: for i = j = z: <Psi^-| sigma_z tensor sigma_z |Psi^-> = <Psi^-| (|01> - |10>)/sqrt(2) * [sigma_z acts on each qubit] ... = <Psi^-| (-|01> + |10>)/sqrt(2) = <Psi^-|(-|Psi^->) = -1. Similarly for x and y.

**Theorem P6-T3: Bell's inequality |E(a,b) - E(a,c)| <= 1 + E(b,c).**
- In a LHV model: E(a,b) - E(a,c) = integral A(a,lambda)[B(b,lambda) - B(c,lambda)] rho(lambda) d lambda.
- Since the singlet gives perfect anticorrelation: B(a,lambda) = -A(a,lambda) for all a.
- Substitute: E(a,b) - E(a,c) = -integral A(a,lambda)A(b,lambda)[1 - A(b,lambda)A(c,lambda)] rho(lambda) d lambda.
- |E(a,b) - E(a,c)| <= integral |1 - A(b,lambda)A(c,lambda)| rho(lambda) d lambda (using |A| = 1).
- Since A(b,lambda)A(c,lambda) = +/-1: |1 - A(b,lambda)A(c,lambda)| = 1 - A(b,lambda)A(c,lambda) (when the product is +1, this is 0; when -1, this is 2; both are non-negative).
- integral [1 - A(b,lambda)A(c,lambda)] rho(lambda) d lambda = 1 - (-E(b,c)) = 1 + E(b,c).
- Therefore |E(a,b) - E(a,c)| <= 1 + E(b,c). QED.

**Theorem P6-T4: CHSH inequality |S| <= 2 for LHV (full derivation in Act IV).**
See Act IV above.

**Theorem P6-T5: Quantum value S = 2*sqrt(2) for optimal settings (full computation in Act IV).**
See Act IV above.

**Theorem P6-T6: No-signalling theorem (full proof).**
See Act VII above.

**Theorem P6-T7: Tsirelson bound S <= 2*sqrt(2).**
- Define the CHSH operator B = a . sigma tensor (b + b') . sigma / sqrt(2) + a' . sigma tensor (b - b') . sigma / sqrt(2) (rescaled).
- B^2 = 4I + [a . sigma, a' . sigma] tensor [b . sigma, b' . sigma] / 2.
- ||[a . sigma, a' . sigma]|| <= 2 |a x a'| <= 2. Similarly for b, b'.
- ||B^2|| <= 4 + 4 = 8, so ||B|| <= 2 sqrt(2).
- Therefore max |<psi|B|psi>| = 2 sqrt(2). This is the Tsirelson bound.

### 4. Historical Experiments with Apparatus Descriptions

**Experiment 1: EPR thought experiment / Bohm version (1935 / 1951)**

*Apparatus (gedanken):* A source at the origin emits pairs of spin-1/2 particles in the singlet state. The particles travel in opposite directions to two distant laboratories (Alice and Bob). Each laboratory contains a Stern-Gerlach apparatus that can be oriented along any axis. Alice and Bob each measure the spin of their particle along their chosen axis and record +1 or -1.

*EPR argument:* If Alice measures S_z and gets +1, she knows with certainty that Bob's particle has S_z = -1 (perfect anticorrelation). Since she didn't disturb Bob's particle (locality), Bob's S_z was already -1 before measurement (realism). But Alice could have measured S_x instead, similarly determining Bob's S_x. Since Alice's choice can't affect Bob's particle, both S_x and S_z must have had definite values simultaneously. But QM says they can't (uncertainty principle). Conclusion: QM is incomplete.

**Experiment 2: Aspect experiment (1982)**

*Apparatus:* (Detailed in Act VI above.)

*Result:* S = 2.697 +/- 0.015, violating CHSH bound of 2 by 46 standard deviations. Locality loophole closed by fast-switching measurement settings.

**Experiment 3: Loophole-free Bell test -- Delft experiment (Hensen et al., 2015)**

*Apparatus:* Two nitrogen-vacancy (NV) centres in diamond, separated by 1.3 km across the Delft University campus. Each NV centre is in a cryostat at ~4 K. Entanglement is generated by entanglement swapping: each NV centre emits a photon entangled with its electron spin. The photons travel through optical fibres to a central beam splitter station (midpoint). When both photons arrive simultaneously and produce a specific detection pattern (Hong-Ou-Mandel interference), the electron spins become entangled even though they never directly interacted. The entanglement heralding signal travels from the central station to Alice and Bob (by light), and upon receipt, fast random number generators (based on photon arrival times at separate sources) choose the measurement settings. The spin is read out in <6 microseconds using resonant excitation. The space-time diagram confirms that the measurement choice at Alice's side is space-like separated from the measurement event at Bob's side (and vice versa), closing the locality loophole. The detection efficiency of the NV spin readout is approximately 96%, closing the detection loophole.

*Result:* 245 trials over several hours, S = 2.42 +/- 0.20, p-value = 0.039. The violation is modest (due to the low event rate and imperfect entangled state fidelity) but statistically significant.

*Implications:* This was the first experiment to simultaneously close the locality, detection, and freedom-of-choice loopholes. Local realism is experimentally ruled out.

### 5. Visual Assets

**VA-P6.1: Bell state circuit diagrams.**
- Type: Static SVG.
- Description: Four quantum circuits, one for each Bell state, showing how to prepare them from |00> using Hadamard and CNOT gates. Each circuit has the output state written in Dirac notation and as a column vector.
- File: `bell-state-circuits.svg`

**VA-P6.2: EPR scenario diagram.**
- Type: Static SVG with annotations.
- Description: A source in the centre emitting two particles to Alice (left) and Bob (right). Alice and Bob each have a Stern-Gerlach device with an adjustable angle knob. Speech bubbles show their reasoning: Alice says "I measured +z, so Bob's must be -z." Einstein's ghost says "Both values were determined all along!" Bell's ghost says "Let me check that..."
- File: `epr-scenario.svg`

**VA-P6.3: Bell inequality violation plot.**
- Type: Interactive chart.
- Description: A plot of E(a,b) = -cos(theta) (QM prediction for the singlet) and the LHV prediction (a piecewise-linear zigzag function for a specific deterministic LHV model) as functions of the angle theta between measurement axes. The shaded region between the curves shows where QM and LHV differ. Students can overlay experimental data points from Aspect (1982) and from loophole-free tests (2015).
- File: `bell-inequality-plot.tsx`

**VA-P6.4: CHSH parameter S vs. measurement angle interactive.**
- Type: Interactive chart.
- Description: The student can adjust Alice's two measurement angles (a, a') and Bob's two measurement angles (b, b') using four sliders or a circular angle selector. The CHSH parameter S is computed in real time and displayed as a large number, with colour coding: green for |S| <= 2 (classically allowed) and red for |S| > 2 (quantum violation). The classical bound of 2 and the Tsirelson bound of 2*sqrt(2) are shown as horizontal dashed lines. Preset buttons load the optimal settings (a=0, a'=pi/2, b=pi/4, b'=-pi/4).
- File: `chsh-parameter-interactive.tsx`

**VA-P6.5: CHSH simulator embed.**
- Type: Interactive simulator (SIM_CHSH_UI component).
- Description: The CHSH simulator from simulator-spec.md. The student configures: (a) the entangled state (singlet, triplet, product), (b) Alice's measurement angles, (c) Bob's measurement angles, (d) number of trials N. The simulator runs N trials, recording outcomes for each measurement combination, computing the four correlators E(a,b), E(a,b'), E(a',b), E(a',b'), and the CHSH parameter S. A histogram panel shows the distribution of individual outcomes. A "Run experiment" button performs the trials with simulated random outcomes according to the Born rule.
- File: Embedded `<CHSHSim />` component with lesson-specific presets.
- Dependencies: SIM_CORE, SIM_CHSH_UI.

**VA-P6.6: No-signalling diagram.**
- Type: Static SVG with annotations.
- Description: Alice and Bob sharing an entangled pair. Alice performs measurement M_A. A table shows Bob's marginal probabilities for outcome b_j: Prob(b_j) = Tr(P_j^B rho_B), independent of Alice's choice. A red "X" over an arrow from Alice to Bob indicates "no signal can be sent." A green checkmark next to "classical communication channel" indicates that comparing results requires classical communication.
- File: `no-signalling-diagram.svg`

**VA-P6.7: Space-time diagram of Aspect experiment.**
- Type: Static SVG.
- Description: A space-time (Minkowski) diagram showing: the source event at the origin, Alice's light cone, Bob's light cone, the photon worldlines, the measurement events at Alice and Bob, and the setting-choice events. The diagram visually demonstrates that Alice's setting choice is space-like separated from Bob's measurement event, ensuring that no subluminal signal can carry Alice's choice to Bob's apparatus.
- File: `aspect-spacetime-diagram.svg`

**VA-P6.8: Qubit simulator embed (2-qubit).**
- Type: Interactive simulator (SIM_QUBIT_UI component, 2-qubit mode).
- Description: The qubit circuit simulator configured for 2-qubit operations. Presets include: (a) prepare singlet state using H + CNOT + X gates, (b) measure both qubits in Z-basis, (c) measure qubit A in Z-basis, qubit B in X-basis, (d) custom measurement angles.
- File: Embedded `<QubitCircuitSim />` with 2-qubit lesson-specific presets.
- Dependencies: SIM_CORE, SIM_QUBIT_UI.

**VA-P6.9: Entanglement applications preview cards.**
- Type: Styled HTML cards.
- Description: Four cards previewing: quantum teleportation, superdense coding, quantum key distribution (BB84/Ekert), entanglement-assisted computation. Each card has a 3-sentence description and a cross-reference to the C-track lesson where the topic is covered in detail.
- File: `entanglement-applications-cards.tsx`

### 6. Worked Examples

**WE-P6.1: Proving entanglement of the singlet state.**

*Problem:* Show that |Psi^-> = (|01> - |10>)/sqrt(2) is entangled (cannot be written as a product state).

*Solution:*
Suppose |Psi^-> = (alpha|0> + beta|1>) tensor (gamma|0> + delta|1>) = alpha gamma|00> + alpha delta|01> + beta gamma|10> + beta delta|11>.

Comparing with (|01> - |10>)/sqrt(2) = 0|00> + (1/sqrt(2))|01> + (-1/sqrt(2))|10> + 0|11>:

alpha gamma = 0 ... (i)
alpha delta = 1/sqrt(2) ... (ii)
beta gamma = -1/sqrt(2) ... (iii)
beta delta = 0 ... (iv)

From (i): alpha = 0 or gamma = 0.
If alpha = 0: equation (ii) gives 0 = 1/sqrt(2). Contradiction.
If gamma = 0: equation (iii) gives 0 = -1/sqrt(2). Contradiction.

No solution exists. Therefore |Psi^-> is not a product state, i.e., it is entangled. QED.

**WE-P6.2: Computing singlet correlations.**

*Problem:* For the singlet state |Psi^->, compute E(z, z), E(z, x), and E(z, n_hat) where n_hat = (sin theta, 0, cos theta).

*Solution:*
E(a, b) = -a . b for the singlet state.

E(z, z) = -z . z = -1. Perfect anticorrelation: if Alice measures +z, Bob always gets -z.

E(z, x) = -z . x = 0. No correlation: Alice's z-outcome tells nothing about Bob's x-outcome.

E(z, n_hat) = -z . n_hat = -cos theta. The correlation is -cos(theta), where theta is the angle between the measurement axes.

Verification for E(z,z): |Psi^-> = (|01> - |10>)/sqrt(2). If Alice measures S_z and gets +1 (state |0>), Bob's state is |-z> = |1>, so Bob gets -1. Product: (+1)(-1) = -1. If Alice gets -1, Bob gets +1. Product: (-1)(+1) = -1. Average: (-1)(1/2) + (-1)(1/2) = -1 = E(z,z). Correct.

**WE-P6.3: CHSH violation with optimal settings.**

*Problem:* For the singlet state, compute the CHSH parameter S with the settings: a = 0 (z-axis), a' = pi/2 (x-axis), b = pi/4 (45 degrees), b' = -pi/4 (-45 degrees), where angles are measured from the z-axis in the xz-plane.

*Solution:*
E(a, b) = -cos(pi/4 - 0) = -cos(pi/4) = -sqrt(2)/2 = -0.7071.
E(a, b') = -cos(-pi/4 - 0) = -cos(pi/4) = -0.7071.
E(a', b) = -cos(pi/4 - pi/2) = -cos(-pi/4) = -0.7071.
E(a', b') = -cos(-pi/4 - pi/2) = -cos(-3pi/4) = -cos(3pi/4) = +0.7071.

S = E(a,b) + E(a,b') + E(a',b) - E(a',b') = -0.7071 + (-0.7071) + (-0.7071) - 0.7071 = -2.8284 = -2*sqrt(2).

|S| = 2*sqrt(2) = 2.828... > 2. The CHSH inequality is violated.

The violation is maximal: |S| = 2*sqrt(2) is the Tsirelson bound. No quantum state or measurement can give a larger |S|.

**WE-P6.4: No-signalling verification.**

*Problem:* Alice and Bob share the singlet state |Psi^->. Alice measures S_z. What is Bob's reduced density matrix before and after Alice's measurement? Show they are identical.

*Solution:*
Before Alice's measurement:
rho_B = Tr_A(|Psi^-><Psi^-|). 

|Psi^-><Psi^-| = (1/2)(|01><01| - |01><10| - |10><01| + |10><10|).

Tr_A: trace over the first qubit.
Tr_A(|01><01|) = <0|0><1| |1> = |1><1|. Wait, let me be more careful.

|01> = |0>_A tensor |1>_B. So |01><01| = |0><0|_A tensor |1><1|_B.
Tr_A(|0><0|_A tensor |1><1|_B) = Tr(|0><0|) |1><1| = 1 * |1><1| = |1><1|.

Similarly:
Tr_A(|01><10|) = Tr_A(|0><1|_A tensor |1><0|_B) = Tr(|0><1|) |1><0| = 0.
Tr_A(|10><01|) = 0.
Tr_A(|10><10|) = |0><0|.

rho_B = (1/2)(|1><1| + |0><0|) = I/2.

After Alice measures S_z and gets +1 (probability 1/2): Bob's state is |1><1|.
After Alice measures S_z and gets -1 (probability 1/2): Bob's state is |0><0|.
Bob's effective state (marginalising over Alice's outcomes): (1/2)|1><1| + (1/2)|0><0| = I/2.

Same as before! Alice's measurement changes nothing about Bob's statistics.

If Alice measures S_x instead: similar calculation yields Bob's effective state is still I/2. No signalling.

**WE-P6.5: Classical (product state) CHSH parameter.**

*Problem:* Compute the CHSH parameter S for the product state |00> with the same optimal settings as WE-P6.3.

*Solution:*
For |00> = |0>_A tensor |0>_B:
E(a, b) = <00| (a . sigma tensor b . sigma) |00> = <0|a . sigma|0> * <0|b . sigma|0> = a_z * b_z = cos(0) * cos(pi/4) = 1 * sqrt(2)/2 = sqrt(2)/2.

E(a, b') = a_z * b'_z = cos(0) * cos(-pi/4) = sqrt(2)/2.
E(a', b) = a'_z * b_z = cos(pi/2) * cos(pi/4) = 0.
E(a', b') = a'_z * b'_z = 0.

S = sqrt(2)/2 + sqrt(2)/2 + 0 - 0 = sqrt(2) = 1.414... < 2.

The product state does NOT violate the CHSH inequality. Only entangled states can violate it.

### 7. Common Confusions

**CC-P6.1: "Entanglement allows faster-than-light communication."**
This is the most common and most important misconception. The no-signalling theorem (proved in this lesson) definitively refutes it. Alice's measurement instantaneously updates the quantum description of Bob's particle (in the Copenhagen picture), but Bob's local measurement statistics are completely unaffected. The nonlocal correlations can only be detected when Alice and Bob compare their results, which requires classical communication (limited to the speed of light). Entanglement creates correlations, not causation.

**CC-P6.2: "Bell's theorem proves that hidden variables are impossible."**
Bell's theorem proves that LOCAL hidden variable theories are incompatible with quantum mechanics. Non-local hidden variable theories (like Bohmian mechanics / de Broglie-Bohm pilot wave theory) are perfectly consistent with quantum mechanics and with Bell test results. What Bell rules out is the conjunction of locality AND realism (predetermined outcomes). You can keep realism if you give up locality, or keep locality if you give up realism (as in many-worlds or other interpretations). Bell's theorem constrains the space of possible theories; it does not uniquely select an interpretation.

**CC-P6.3: "The EPR paradox shows that quantum mechanics is wrong."**
EPR's argument was not that QM is wrong (its predictions are correct) but that it is incomplete (not all elements of reality are accounted for). Bell's theorem later showed that the "completion" EPR sought (local hidden variables) is impossible. So either QM is complete and non-local (in the correlation sense), or there are non-local hidden variables. Either way, the local realistic worldview of EPR is not tenable.

**CC-P6.4: "The CHSH inequality is just a statistical fluke."**
The statistical significance of CHSH violations is overwhelming. Aspect's 1982 experiment had 46 standard deviations. Modern loophole-free tests have even higher significance. The probability that the observed correlations arise from statistical fluctuations in a local realistic model is astronomically small (p-values on the order of 10^{-10} or less in photonic experiments).

**CC-P6.5: "Entanglement is just classical correlation."**
Classical correlations (e.g., putting one red and one blue ball in two boxes and separating them) can explain perfect correlations along a single axis but CANNOT reproduce the sinusoidal E(theta) = -cos(theta) dependence that quantum mechanics predicts for the singlet state. The CHSH inequality is precisely the mathematical expression of this distinction: classical correlations satisfy |S| <= 2, while entangled states achieve |S| up to 2*sqrt(2). The Bell/CHSH test is a quantitative litmus test that distinguishes quantum entanglement from any classical correlation.

**CC-P6.6: "Decoherence explains the measurement problem, so we don't need to worry about entanglement weirdness."**
Decoherence (P7) explains why we don't see superpositions of macroscopic objects in practice, but it does not resolve the foundational issues raised by entanglement. Entanglement is not a problem to be explained away -- it is a resource to be exploited. Decoherence is the enemy of entanglement (it destroys quantum correlations), and fighting decoherence is the central challenge of quantum computing.

### 8. Cross-References

| Reference | Direction | Description |
|-----------|-----------|-------------|
| A5 (Tensor Products) | backward | Composite system Hilbert space is the tensor product. Bell states live in C^2 tensor C^2. |
| A3 (Matrices) | backward | Pauli matrices, eigenvalue computations, tensor product of matrices. |
| P2 (Postulates) | backward | Born rule for composite systems; measurement postulate applied to entangled states. |
| P4 (Spin-1/2) | backward | Spin measurement operators; Pauli matrices for the singlet correlation computation. |
| P5 (Uncertainty) | backward | EPR argument invokes the uncertainty principle. Incompatible observables are central. |
| C1 (Qubit) | forward | Entangled qubit pairs as resources for quantum computing. |
| C2 (Measurement) | forward | Measurement of entangled multi-qubit states. |
| C4 (Entangling Gates) | forward | CNOT and other entangling gates create entanglement in circuits. |
| C5 (Teleportation) | forward | Quantum teleportation protocol uses a Bell state and classical communication. |
| P7 (Decoherence) | forward | Decoherence as the enemy of entanglement; environment entanglement destroys quantum coherence. |

### 9. Historical Notes

**HN-P6.1: The EPR paper (1935).** Einstein, Podolsky, and Rosen published "Can Quantum-Mechanical Description of Physical Reality Be Considered Complete?" in Physical Review. The paper was largely written by Podolsky (Einstein was reportedly unhappy with the presentation). The paper's criterion for "elements of physical reality" was: "If, without in any way disturbing a system, we can predict with certainty the value of a physical quantity, then there exists an element of physical reality corresponding to this physical quantity." Bohr responded almost immediately with a paper of the same title, arguing that EPR's notion of "without disturbing" was inapplicable to quantum systems.

**HN-P6.2: Bohm's reformulation (1951).** David Bohm simplified the EPR argument from continuous variables (position and momentum) to discrete variables (spin-1/2). This made the argument cleaner and more experimentally testable. It is the Bohm version that we use in this lesson.

**HN-P6.3: Bell's inequality (1964).** John Stewart Bell, working at CERN, published "On the Einstein Podolsky Rosen Paradox" in the short-lived journal Physics Physique Fizika. The paper was largely ignored for several years. Bell showed that the EPR argument, if taken seriously, leads to testable predictions that differ from quantum mechanics. He later called his result "the most profound discovery of science." Bell died in 1990, before the Nobel Prize was awarded for Bell-test experiments (awarded to Aspect, Clauser, and Zeilinger in 2022).

**HN-P6.4: CHSH (1969).** John Clauser, Michael Horne, Abner Shimony, and Richard Holt proposed a more experimentally practical version of Bell's inequality. The CHSH form does not require perfect correlations (which are experimentally impossible due to noise) and involves four measurement settings instead of three. Clauser and Freedman performed the first experimental test in 1972, finding a violation consistent with QM.

**HN-P6.5: Aspect's experiment (1982).** Alain Aspect's series of three experiments at the Institut d'Optique in Orsay, France, was the first to close the locality loophole using fast-switching measurement settings. The third experiment (1982) used acousto-optic switches that changed settings in ~10 ns, well within the ~40 ns light-travel time between detectors. This experiment convinced most physicists that local realism is untenable.

**HN-P6.6: The Nobel Prize (2022).** Alain Aspect, John Clauser, and Anton Zeilinger shared the 2022 Nobel Prize in Physics "for experiments with entangled photons, establishing the violation of Bell inequalities and pioneering quantum information science." The award came 58 years after Bell's original paper, reflecting both the difficulty of the experiments and the time needed for the community to appreciate their significance.

**HN-P6.7: Loophole-free tests (2015).** Three groups simultaneously closed all major loopholes: Hensen et al. (Delft, NV centres in diamond), Giustina et al. (Vienna, photons), and Shalm et al. (NIST, photons). These experiments were celebrated as the definitive closure of the local realism debate, though some philosophers note that the "freedom-of-choice" loophole (superdeterminism) can never be experimentally closed.

### 10. Problem Set

**PS-P6.01 (Computational, Easy):** Write all four Bell states |Phi^+>, |Phi^->, |Psi^+>, |Psi^-> as column vectors in C^4. Verify that they are orthonormal.

**PS-P6.02 (Computational, Medium):** Show that the Bell state |Phi^+> = (|00> + |11>)/sqrt(2) is entangled by the same proof-by-contradiction method used for |Psi^->.

**PS-P6.03 (Computational, Medium):** Compute the reduced density matrix rho_B = Tr_A(|Phi^+><Phi^+|). Show that rho_B = I/2 (maximally mixed). Compute the von Neumann entropy S(rho_B) = -Tr(rho_B log_2 rho_B) and verify it equals 1 bit (maximal entanglement).

**PS-P6.04 (Computational, Hard):** Derive E(a, b) = <Psi^-| (a . sigma) tensor (b . sigma) |Psi^-> = -a . b by explicit matrix computation. [Hint: write a . sigma and b . sigma as 2x2 matrices, compute the tensor product as a 4x4 matrix, and evaluate the expectation value in the singlet state.]

**PS-P6.05 (Derivation, Hard):** Derive the CHSH inequality |S| <= 2 for local hidden variable models. Clearly state the assumptions (locality, realism, free choice). Identify the step in the derivation that fails for quantum mechanics.

**PS-P6.06 (Computational, Hard):** Show that for the singlet state with the settings a = 0, a' = pi/2, b = pi/4, b' = -pi/4, the CHSH parameter S = -2*sqrt(2). Verify numerically. Then try different settings: a = 0, a' = pi/4, b = pi/8, b' = -pi/8. What is S? Is it still maximal?

**PS-P6.07 (Simulator, Medium):** Use the CHSH simulator. (a) Set up the singlet state with optimal CHSH settings. Run 1000 trials. Record the empirical S. Is |S| > 2? By how many standard deviations? (b) Change to a product state |00>. Run 1000 trials. Verify that |S| <= 2.

**PS-P6.08 (Derivation, Medium):** Prove the no-signalling theorem: show that Bob's marginal probabilities are independent of Alice's measurement choice for any entangled state |psi> in H_A tensor H_B.

**PS-P6.09 (Conceptual, Medium):** Explain in your own words the distinction between: (a) entanglement and classical correlation, (b) nonlocality and signalling, (c) the EPR argument and Bell's theorem.

**PS-P6.10 (Computational, Medium):** The state |psi> = cos(theta)|00> + sin(theta)|11> is entangled for 0 < theta < pi/2 (and not for theta = 0 or pi/2). Compute the CHSH parameter S for this state using the standard optimal settings. Show that S = 2*sqrt(2) sin(2*theta) and that the violation occurs iff sin(2*theta) > 1/sqrt(2), i.e., pi/8 < theta < 3pi/8.

**PS-P6.11 (Conceptual, Hard):** Describe the three major loopholes in Bell experiments: locality loophole, detection loophole, and freedom-of-choice loophole. For each, explain what it means physically and how it was closed experimentally.

**PS-P6.12 (Synthesis, Hard):** Bell's theorem is sometimes stated as: "No physical theory of local hidden variables can reproduce all of the predictions of quantum mechanics." Explain each word in this statement precisely. What does "local" mean? What does "hidden variable" mean? What does "reproduce all predictions" mean? Can you name a non-local hidden variable theory that does reproduce all QM predictions?

### 11. Simulator Dependencies

| Simulator | Usage in P6 | Presets |
|-----------|------------|---------|
| CHSH Simulator (SIM_CHSH_UI) | Primary. Students run virtual Bell experiments, vary angles, compute S. | Preset P6-CHSH-1: Singlet state, optimal CHSH settings, N=1000. Preset P6-CHSH-2: Singlet state, custom settings (adjustable). Preset P6-CHSH-3: Product state |00>, optimal CHSH settings, N=1000 (no violation). Preset P6-CHSH-4: Partially entangled state cos(theta)|00> + sin(theta)|11>, adjustable theta. |
| Qubit Circuit (SIM_QUBIT_UI) | Supporting. 2-qubit mode for preparing Bell states and measuring in various bases. | Preset P6-Q-1: Bell state preparation circuit (H + CNOT). Preset P6-Q-2: Singlet state preparation. Preset P6-Q-3: Measure both qubits in custom bases. |

The Stern-Gerlach simulator and 1D Schrodinger simulator are NOT used in P6.

### 12. Estimates

| Item | Estimate |
|------|----------|
| Prose word count | 20,000--25,000 words |
| Number of equations (display math) | 80--100 |
| Number of inline math expressions | 250--300 |
| Figures and visual assets | 9 (see VA list) |
| Interactive components | 5 (Bell inequality plot, CHSH parameter interactive, CHSH simulator, qubit simulator 2-qubit, entanglement applications cards) |
| Worked examples | 5 |
| Problem set questions | 12 |
| Estimated development time (prose + equations) | 8 days |
| Estimated development time (visual assets) | 5 days |
| Estimated development time (interactive components) | 5 days |
| Total estimated development time | 18 days |

### 13. Page Splits

P6 is split into **3 pages** as follows:

| Page | Route | Title | Content | Est. Words |
|------|-------|-------|---------|-----------|
| Part 1 | `/lessons/p6-bell-chsh/part-1` | Entanglement and EPR | Acts I-II: composite systems, tensor products, entangled states, singlet state, EPR argument. | 6,000--8,000 |
| Part 2 | `/lessons/p6-bell-chsh/part-2` | Bell's Theorem and CHSH | Acts III-V: Bell's inequality derivation, CHSH inequality derivation, quantum violation, Tsirelson bound. | 8,500--10,000 |
| Part 3 | `/lessons/p6-bell-chsh/part-3` | Experiments and Implications | Acts VI-VIII: Aspect experiment, loophole-free tests, no-signalling theorem, entanglement as a resource, synthesis. | 6,500--8,000 |

Each page is self-contained with its own introduction and summary. Parts 2 and 3 include a "Previously" recap. The CHSH simulator is primarily used on Part 2 (after the inequality is derived). The qubit simulator (2-qubit mode) is used on Part 1 for Bell state preparation. Problem set questions are distributed: PS-P6.01--P6.03 on Part 1, PS-P6.04--P6.07 on Part 2, PS-P6.08--P6.12 on Part 3.

---

## P7 -- Decoherence and the Measurement Problem

**Canonical position:** 20 of 23
**Prerequisites:** A1 (complex numbers), A2 (vectors), A3 (matrices), A4 (eigenvalues), A5 (tensor products), A6 (probability and Born rule), P2 (postulates), P3 (Schrodinger equation), P4 (spin-1/2), P5 (uncertainty), P6 (entanglement), C1-C4 (qubit, measurement, gates, entangling gates)
**Slug:** `p7-decoherence`
**Target length:** 10,000--15,000 words
**Page splits:** Single page (no split)
**Paid:** Yes

### 1. Learning Objectives

By the end of this lesson the student will be able to:

1. **LO-P7.1:** State the measurement problem precisely: unitary evolution (Postulate 5) is deterministic and never produces definite outcomes, yet measurement (Postulate 4) is probabilistic and produces definite outcomes. These two postulates appear to contradict each other.
2. **LO-P7.2:** Model the interaction between a quantum system and its environment as an entangling unitary operation on the composite Hilbert space H_system tensor H_environment, and show that the system's reduced density matrix (obtained by tracing out the environment) loses off-diagonal coherence terms.
3. **LO-P7.3:** Work through the concrete "qubit + environment qubit" model: start with system in superposition alpha|0> + beta|1> and environment in |E_0>, show that a CNOT-like interaction produces alpha|0>|E_0> + beta|1>|E_1>, and compute the reduced density matrix of the system, showing the off-diagonal terms suppressed when <E_0|E_1> -> 0.
4. **LO-P7.4:** Explain what decoherence does and does not solve: it explains why macroscopic superpositions are effectively unobservable (the pointer states are selected by the system-environment interaction), but it does NOT explain why a specific outcome occurs in a given measurement (the "and/or" problem).
5. **LO-P7.5:** Define and compute the decoherence time t_d for simple models (e.g., a superposition of two spatially separated wave packets interacting with a thermal photon bath), and explain why t_d is astronomically short for macroscopic objects.
6. **LO-P7.6:** Explain the concept of "pointer states" (einselection): the environment interaction selects a preferred basis (the pointer basis) in which the density matrix becomes diagonal. States in the pointer basis are robust against decoherence; superpositions of pointer states are fragile.
7. **LO-P7.7:** Distinguish between at least four interpretations of quantum mechanics (Copenhagen, many-worlds, de Broglie-Bohm, QBism) and explain how each addresses the measurement problem, maintaining a neutral (non-advocacy) stance.
8. **LO-P7.8:** Explain why decoherence is the central challenge for quantum computing: quantum algorithms require maintaining coherent superpositions for many gate operations, but the environment constantly entangles with the qubits, destroying coherence. Connect to quantum error correction (C-track preview).
9. **LO-P7.9:** Compute the effect of common single-qubit noise channels (bit flip, phase flip, depolarising channel) on a density matrix, and identify each as a specific decoherence mechanism.

### 2. Intuition Arc

**Opening hook (800 words):** Schrodinger's cat: a cat is in a sealed box with a radioactive atom, a Geiger counter, and a vial of poison. If the atom decays (50% chance in one hour), the Geiger counter triggers, the vial breaks, and the cat dies. After one hour, quantum mechanics says the atom is in a superposition of decayed and not-decayed. Since the cat's fate is entangled with the atom, the cat is in a superposition of alive and dead: |psi> = (1/sqrt(2))(|alive> tensor |not decayed> + |dead> tensor |decayed>). Yet when we open the box, we always find a definite cat -- alive or dead, never both. Where does the superposition go? This is the measurement problem: the most important unsolved problem in the foundations of physics.

**Act I -- The measurement problem stated precisely (2,000 words):** Reformulate the problem in rigorous terms. Postulate 5 (unitary evolution): the total state of system + apparatus evolves unitarily. If the system starts in alpha|0> + beta|1> and the apparatus starts in |ready>, then the interaction produces alpha|0>|pointer_0> + beta|1>|pointer_1> -- a superposition of apparatus states. But Postulate 4 (projection/Born rule) says we observe pointer_0 with probability |alpha|^2 and pointer_1 with probability |beta|^2 -- a definite outcome, not a superposition. Unitary evolution never produces collapse. Something is missing (or our description of measurement is approximate). Three logical options: (a) unitary evolution is not the whole story (collapse is a real physical process -- GRW, Penrose), (b) unitary evolution is the whole story and all branches exist (many-worlds), (c) the quantum state does not describe reality directly (epistemic interpretations, QBism).

**Act II -- Decoherence: system-environment entanglement (3,000 words):** The key insight of decoherence theory (Zeh, 1970; Zurek, 1981): in practice, the apparatus is not isolated from its environment (air molecules, photons, vibrations, etc.). The environment has enormously many degrees of freedom. The interaction between system+apparatus and environment rapidly entangles them: alpha|0>|pointer_0>|env_0> + beta|1>|pointer_1>|env_1>. If the environment states |env_0> and |env_1> are effectively orthogonal (<env_0|env_1> -> 0, which happens extremely fast for macroscopic environments), then the reduced density matrix of the system+apparatus (traced over the environment) becomes: rho_{SA} = |alpha|^2 |0><0| tensor |pointer_0><pointer_0| + |beta|^2 |1><1| tensor |pointer_1><pointer_1|. The off-diagonal interference terms are gone. The system+apparatus looks like a classical mixture: pointer_0 with probability |alpha|^2 OR pointer_1 with probability |beta|^2. The superposition has not disappeared -- it is hidden in the entanglement with the environment, which we cannot access.

**Act III -- The qubit + environment qubit model (2,500 words):** Make this concrete with the simplest possible model. System qubit: |psi_S> = alpha|0> + beta|1>. Environment qubit: |E_0>. Interaction Hamiltonian produces a CNOT-like operation: |0>|E_0> -> |0>|E_0>, |1>|E_0> -> |1>|E_1>. (This models an environment that "records" which state the system is in.) After interaction: |psi_total> = alpha|0>|E_0> + beta|1>|E_1>.

The total state is pure, but the reduced density matrix of the system is: rho_S = Tr_E(|psi_total><psi_total|) = |alpha|^2 |0><0| + alpha beta* <E_0|E_1> |0><1| + alpha* beta <E_1|E_0> |1><0| + |beta|^2 |1><1|.

If <E_0|E_1> = 1 (no decoherence): rho_S = |psi_S><psi_S| (pure state, full coherence).
If <E_0|E_1> = 0 (complete decoherence): rho_S = |alpha|^2 |0><0| + |beta|^2 |1><1| (diagonal, no coherence -- looks like a classical mixture).

The parameter <E_0|E_1> controls the degree of decoherence. For a single environment qubit, this can be any value from 0 to 1. For a macroscopic environment (N >> 1 environment particles), the overlap falls exponentially: <E_0|E_1> ~ epsilon^N for some 0 < epsilon < 1. For N ~ 10^23 (Avogadro scale), this is effectively zero within femtoseconds.

Compute the decoherence time: the off-diagonal elements decay as exp(-t/t_d). For a superposition of two positions separated by distance Delta x in a thermal photon bath at temperature T: t_d ~ (lambda_th / Delta x)^2 * (hbar / kT), where lambda_th = hbar / sqrt(2 m kT) is the thermal de Broglie wavelength. For a dust grain (m ~ 10^{-15} kg, Delta x ~ 10^{-6} m) at room temperature: t_d ~ 10^{-31} seconds. The superposition decoheres in less than a trillionth of a trillionth of a second. No experiment could detect such a superposition. For an electron (m ~ 10^{-30} kg, Delta x ~ 10^{-9} m) at 4 K: t_d ~ 10^{-3} seconds. Coherence can persist for milliseconds -- this is why quantum computers work at low temperatures.

**Act IV -- What decoherence does NOT solve (2,000 words):** Decoherence transforms a pure superposition into a diagonal density matrix (a classical-looking mixture). But a diagonal density matrix is still a quantum state -- it describes a system that is in state |0> with probability |alpha|^2 OR in state |1> with probability |beta|^2. The "or" (classical probability) was not derived from the formalism -- it was put in by the Born rule (Postulate 4). Unitary evolution plus tracing out the environment gives us a density matrix. But interpreting the density matrix as "the system is in one state or the other, we just don't know which" is an additional assumption. This is the "and/or" problem: the quantum formalism gives us "and" (superposition); decoherence converts it to something that looks like classical "or"; but the step from "and" to "or" is precisely what needs to be explained.

The pointer basis problem: which basis does the environment select? Zurek's "einselection" (environment-induced superselection) argues that the pointer basis is determined by the form of the system-environment interaction Hamiltonian. States that commute with the interaction Hamiltonian are stable (pointer states); superpositions of these states decohere. For position-dependent interactions (like air molecules scattering off an object), the pointer basis is the position basis -- which is why macroscopic objects have definite positions but not definite momenta. This explains our classical experience but still doesn't solve the measurement problem: it explains why we observe pointer states, not why we observe a particular pointer state.

**Act V -- Interpretations (neutral survey) (2,500 words):** Present four major interpretations, giving each a fair hearing:

(1) **Copenhagen interpretation (Bohr, Heisenberg, 1920s):** The wave function is a tool for computing probabilities, not a description of reality. Measurement is a primitive concept not reducible to unitary evolution. The cut between quantum (microscopic) and classical (macroscopic) is pragmatic, not fundamental. Criticism: the cut is arbitrary; "measurement" is undefined.

(2) **Many-worlds interpretation (Everett, 1957):** Unitary evolution is the complete dynamics. There is no collapse. When a measurement occurs, the universe "branches" into all possible outcomes. Each branch is equally real. The Born rule probabilities are derived from branch counting or decision-theoretic arguments (Deutsch-Wallace). Criticism: the preferred basis problem (which branches?), the probability problem (why the Born rule?), ontological extravagance (infinitely many unobservable branches).

(3) **De Broglie-Bohm pilot wave theory (de Broglie 1927, Bohm 1952):** Particles have definite positions at all times (hidden variables). The wave function guides the particles via a "pilot wave" equation: dx/dt = (hbar/m) Im(grad psi / psi). The theory is deterministic and reproduces all QM predictions. It is explicitly nonlocal (consistent with Bell's theorem because it is a non-local hidden variable theory). Criticism: nonlocality, the difficulty of extending to quantum field theory, and the "redundancy" of the wave function (which is a physically real field in configuration space).

(4) **QBism (Quantum Bayesianism, Fuchs, Caves, Schack, 2002+):** Quantum states are not descriptions of physical systems but of an agent's beliefs (degrees of belief = probabilities). The Born rule is a consistency condition on those beliefs. Measurement outcomes are personal experiences of the agent. There is no wave function collapse because there was no physical wave function to begin with. Criticism: solipsistic tendencies, doesn't explain the intersubjective agreement among observers, side-steps rather than solves the problem.

State clearly: the physics covered in this course does not depend on which interpretation you prefer. All interpretations make the same experimental predictions (by construction). The choice is philosophical, and the course maintains strict neutrality.

**Act VI -- Why quantum computing is hard (1,500 words):** Connect decoherence to the practical challenge of quantum computing. A quantum computer maintains a register of qubits in a coherent superposition. Each qubit interacts with its environment (thermal vibrations, electromagnetic noise, neighbouring qubits). Decoherence destroys the coherence needed for quantum speedup. The coherence time T_2 sets a budget: all gates must complete within T_2. If a gate takes time t_gate, the maximum circuit depth is approximately T_2 / t_gate. For superconducting qubits: T_2 ~ 100 microseconds, t_gate ~ 20 ns, giving depth ~ 5000. For trapped ions: T_2 ~ 1 second, t_gate ~ 10 microseconds, giving depth ~ 100,000. Quantum error correction (C-track) can extend the effective coherence, but at a cost of many physical qubits per logical qubit (the overhead is 1000-10,000x with current technology). Decoherence is the fundamental reason why building a useful quantum computer is so difficult.

**Synthesis (500 words):** Decoherence is the bridge between quantum mechanics and our classical experience. It explains why we don't see macroscopic superpositions, why the position basis is preferred for macroscopic objects, and why quantum computers are so hard to build. But it does not solve the measurement problem -- it reformulates it. The measurement problem remains the deepest open question in the foundations of physics, 100 years after the birth of quantum mechanics.

### 3. Theorems and Proofs (Sketched)

**Theorem P7-T1: Decoherence of a qubit interacting with an environment qubit.**
- Initial state: |psi> = (alpha|0> + beta|1>) tensor |E_0>.
- Interaction: U|0>|E_0> = |0>|E_0>, U|1>|E_0> = |1>|E_1>.
- After interaction: |psi'> = alpha|0>|E_0> + beta|1>|E_1>.
- Reduced density matrix: rho_S = Tr_E(|psi'><psi'|) = sum_k <E_k|psi'><psi'|E_k>.
- <E_0|psi'> = alpha|0>. <E_1|psi'> = beta|1> (assuming <E_0|E_1> = 0 for complete decoherence).
- rho_S = |alpha|^2 |0><0| + |beta|^2 |1><1|.
- Off-diagonal terms: if <E_0|E_1> = gamma (general case), then rho_S = |alpha|^2 |0><0| + alpha beta* gamma |0><1| + alpha* beta gamma* |1><0| + |beta|^2 |1><1|.
- Coherence suppressed by factor |gamma|. For |gamma| = 0, complete decoherence.

**Theorem P7-T2: Exponential decoherence for N environment particles.**
- N environment particles, each independently interacting with the system.
- Each produces an overlap factor gamma_k = <E_0^{(k)}|E_1^{(k)}>.
- Total overlap: Gamma = product_{k=1}^N gamma_k.
- If |gamma_k| = epsilon < 1 for each k: |Gamma| = epsilon^N.
- For N = 10^23 and epsilon = 0.999: |Gamma| = 0.999^{10^23} approx exp(-10^20) which is effectively zero.
- Decoherence is exponentially fast in the number of environment degrees of freedom.

**Theorem P7-T3: Decoherence time for spatial superposition in a thermal photon bath.**
- A particle of mass m in a superposition of positions separated by Delta x.
- The scattering of thermal photons (temperature T, photon wavelength lambda_th ~ hc/(kT)) off the particle records which-position information.
- The decoherence rate: Gamma_d ~ n_photon * sigma_scatter * c * (Delta x / lambda_th)^2, where n_photon is the photon number density and sigma_scatter is the scattering cross-section.
- For a macroscopic object (dust grain, m ~ 10^{-15} kg, Delta x ~ 10^{-6} m) at T = 300 K: t_d = 1/Gamma_d ~ 10^{-31} s.
- For a single electron (m ~ 10^{-30} kg, Delta x ~ 10^{-9} m) at T = 4 K: t_d ~ 10^{-3} s.

**Theorem P7-T4: Single-qubit noise channels as decoherence models.**
- Bit flip channel: rho -> (1-p) rho + p sigma_x rho sigma_x. Flips |0> and |1> with probability p. Models energy exchange with environment (T1 process).
- Phase flip (dephasing) channel: rho -> (1-p) rho + p sigma_z rho sigma_z. Destroys off-diagonal elements without changing populations. Models pure dephasing (T2 process).
- Depolarising channel: rho -> (1-p) rho + (p/3)(sigma_x rho sigma_x + sigma_y rho sigma_y + sigma_z rho sigma_z). Maps any state toward the maximally mixed state I/2. Models isotropic noise.
- For each: compute the output density matrix for input rho = |+><+| = (1/2)[[1,1],[1,1]] and verify the coherence suppression.

### 4. Historical Experiments with Apparatus Descriptions

**Experiment 1: Schrodinger's cat thought experiment (1935)**

*Apparatus (gedanken):* A sealed opaque box containing: (a) a radioactive atom (e.g., one atom of a substance with a half-life of one hour), (b) a Geiger counter connected to the atom, (c) a hammer mechanism triggered by the Geiger counter, (d) a sealed vial of hydrocyanic acid (poison gas), (e) a cat. If the atom decays within one hour, the Geiger counter triggers, the hammer breaks the vial, and the cat dies. If the atom does not decay, the cat lives.

*Quantum description:* After one hour, the atom is in state (|decayed> + |not decayed>)/sqrt(2). Since the cat's state is entangled with the atom, the total state is (|dead>|decayed> + |alive>|not decayed>)/sqrt(2). According to unitary quantum mechanics, the cat is in a superposition of alive and dead.

*Schrodinger's point:* This thought experiment was intended by Schrodinger to show the absurdity of applying quantum mechanics to macroscopic objects. He did not propose it as a real possibility but as a reductio ad absurdum. The resolution, per decoherence theory, is that the cat is rapidly entangled with its environment (air molecules, photons, etc.), destroying the coherence between the |alive> and |dead> branches on a timescale of ~10^{-30} s. The cat is never in an observable superposition.

**Experiment 2: Decoherence of superpositions in cavity QED (Brune et al., 1996)**

*Apparatus:* A microwave cavity with extremely high Q-factor (superconducting niobium mirrors, Q ~ 10^8, photon storage time ~1 ms). A Rydberg atom (rubidium, n ~ 50) serves as the "system." The atom passes through the cavity and interacts with a coherent microwave field (mesoscopic "Schrodinger cat" state of the cavity field). By using Ramsey interferometry (two microwave pulses separated by the cavity interaction), the experimenters create a superposition of two coherent states of the cavity field: |alpha> + |-alpha> (a "cat state" with the two coherent states playing the role of "alive" and "dead").

*Key measurement:* After creating the cat state, the experimenters wait a variable time delta t and then probe the cavity with a second atom. The interference between the two coherent states (the "cat" coherence) decays exponentially with a timescale t_d that scales as t_cavity / (2 |alpha|^2) -- decoherence is faster for larger "cats" (larger |alpha|). For |alpha|^2 = 3.3 (a few photons), t_d ~ 0.24 ms.

*Result:* The decoherence of the cat state was directly observed as a function of time, matching the theoretical prediction quantitatively. This was the first controlled observation of decoherence dynamics for a mesoscopic quantum state.

*Implications:* Decoherence is real, measurable, and quantitatively described by the theory. The larger the "cat," the faster it decoheres -- explaining why we never see Schrodinger's cat in a superposition.

**Experiment 3: Decoherence in superconducting qubits (Devoret & Schoelkopf, ongoing)**

*Apparatus:* A superconducting transmon qubit: a Josephson junction (two superconducting aluminium islands separated by a thin oxide barrier, ~1 nm) shunted by a capacitor. The qubit is mounted on a sapphire chip inside a copper cavity, cooled to ~15 mK in a dilution refrigerator. Control pulses are delivered via coaxial microwave lines. Readout is via a dispersive measurement: the qubit state shifts the resonant frequency of a coupled microwave resonator, which is measured by a nearly quantum-limited Josephson parametric amplifier.

*Decoherence mechanisms:* (a) Energy relaxation (T1): the qubit loses energy to its environment (microwave radiation, phonons, quasiparticles in the superconductor). Typical T1 ~ 50-200 microseconds. (b) Dephasing (T2): fluctuations in the qubit frequency (due to charge noise, flux noise, photon shot noise) randomise the phase between |0> and |1>. Typical T2 ~ 100-300 microseconds. (c) Measurement-induced dephasing: stray photons in the readout cavity carry away phase information.

*Result:* T1 and T2 times have improved by a factor of ~10^6 since the first superconducting qubits in 1999 (from nanoseconds to hundreds of microseconds). Each improvement required identifying and eliminating a specific decoherence source: better materials, better shielding, better thermalisation, better fabrication. The race against decoherence is the defining challenge of superconducting quantum computing.

*Implications:* Decoherence sets the fundamental limit on quantum computation. Every advance in qubit coherence time directly translates to longer, more complex quantum algorithms. This is the practical face of the measurement problem.

### 5. Visual Assets

**VA-P7.1: Schrodinger's cat diagram.**
- Type: Static SVG (humorous but accurate).
- Description: A sealed box with a cat, radioactive atom, Geiger counter, hammer, and poison vial. The quantum state is written below in Dirac notation. A "before opening" panel shows the superposition state; an "after opening" panel shows a definite outcome (alive cat or dead cat). A callout emphasises: "This is a thought experiment. No cats were harmed."
- File: `schrodinger-cat-diagram.svg`

**VA-P7.2: Decoherence of a qubit -- density matrix visualisation.**
- Type: Interactive chart.
- Description: A 2x2 density matrix displayed as four coloured squares (real and imaginary parts), with the off-diagonal elements fading as a "decoherence" slider moves from 0 (full coherence) to 1 (complete decoherence). Alongside, the corresponding Bloch sphere representation shows the Bloch vector shrinking from the surface (pure state) toward the centre (maximally mixed state). Below, a bar chart shows the eigenvalues of rho (purity = Tr(rho^2) is displayed).
- File: `decoherence-density-matrix.tsx`

**VA-P7.3: System-environment entanglement circuit diagram.**
- Type: Static SVG.
- Description: A circuit diagram showing: qubit wire (system) starting in alpha|0> + beta|1>, environment wire starting in |E_0>, a controlled-NOT gate (or generic entangling interaction), and the resulting entangled state. After the CNOT, a dashed box around the environment wire labeled "Tr_E" shows the partial trace operation, leading to the decohered density matrix.
- File: `system-environment-circuit.svg`

**VA-P7.4: Decoherence timescale comparison chart.**
- Type: Static chart (bar chart or log-scale scatter plot).
- Description: A logarithmic plot showing decoherence times for various systems: large dust grain (~10^{-31} s), small molecule (~10^{-17} s), large molecule (~10^{-12} s), superconducting qubit (~10^{-4} s), trapped ion (~10^0 s), single nuclear spin in silicon (~10^1 s). The y-axis is log(t_d), spanning from 10^{-31} to 10^1 seconds. A horizontal line at "human perception timescale (~0.1 s)" shows which systems can maintain coherence long enough for us to potentially observe quantum effects.
- File: `decoherence-timescales.tsx`

**VA-P7.5: Interpretations comparison table.**
- Type: Styled HTML table.
- Description: A table with rows for each interpretation (Copenhagen, Many-Worlds, de Broglie-Bohm, QBism) and columns for: wave function ontology (real/epistemic), collapse (yes/no), determinism (yes/no), nonlocality (yes/no), measurement problem resolution, key criticism. Colour-coded for easy comparison. A prominent disclaimer: "All interpretations make the same experimental predictions."
- File: `interpretations-table.tsx`

**VA-P7.6: Noise channel visualisation.**
- Type: Interactive chart.
- Description: The student selects a noise channel (bit flip, phase flip, depolarising) and sets the probability p with a slider. The input density matrix (initially |+><+|) is displayed on the left, and the output density matrix after the noise channel is displayed on the right. The Bloch sphere shows the state shrinking toward the z-axis (dephasing), flipping (bit flip), or shrinking toward the origin (depolarising) as p increases.
- File: `noise-channel-visualisation.tsx`

**VA-P7.7: Quantum computing coherence budget diagram.**
- Type: Static SVG.
- Description: A timeline showing the total coherence time T_2 as a bar. Within it, smaller blocks represent individual gate operations (each taking t_gate). The maximum circuit depth is T_2 / t_gate. Blocks are coloured: green for "successful gate" and red for "decoherence-induced error." A caption explains the error threshold theorem: if the error per gate is below a threshold (~10^{-4}), quantum error correction can extend the effective coherence indefinitely.
- File: `coherence-budget-diagram.svg`

### 6. Worked Examples

**WE-P7.1: Qubit + environment qubit decoherence.**

*Problem:* A qubit is prepared in state |psi> = (1/sqrt(2))|0> + (1/sqrt(2))|1>. An environment qubit is in state |E_0>. The interaction is: |0>|E_0> -> |0>|E_0>, |1>|E_0> -> |1>|E_1>, where <E_0|E_1> = gamma (a real parameter between 0 and 1). (a) Write the total state after the interaction. (b) Compute the reduced density matrix rho_S. (c) Evaluate for gamma = 1, 0.5, and 0. (d) Compute the purity Tr(rho_S^2) for each case.

*Solution:*
(a) |psi_total> = (1/sqrt(2))|0>|E_0> + (1/sqrt(2))|1>|E_1>.

(b) rho_S = Tr_E(|psi_total><psi_total|) = (1/2)|0><0| + (gamma/2)|0><1| + (gamma*/2)|1><0| + (1/2)|1><1|.

Since gamma is real: rho_S = [[1/2, gamma/2], [gamma/2, 1/2]].

(c) gamma = 1: rho_S = [[1/2, 1/2], [1/2, 1/2]] = |+><+|. Pure state. No decoherence (environment did not entangle).

gamma = 0.5: rho_S = [[1/2, 1/4], [1/4, 1/2]]. Partially decohered. Off-diagonal elements reduced by half.

gamma = 0: rho_S = [[1/2, 0], [0, 1/2]] = I/2. Maximally mixed. Complete decoherence.

(d) Purity = Tr(rho^2).
gamma = 1: Tr([[1/2,1/2],[1/2,1/2]]^2) = Tr([[1/2,1/2],[1/2,1/2]]) = 1. Pure state.
gamma = 0.5: Tr([[1/2,1/4],[1/4,1/2]]^2) = Tr([[5/16, 3/8], [3/8, 5/16]]) = 5/16 + 5/16 = 5/8 = 0.625. Mixed.
gamma = 0: Tr((I/2)^2) = Tr(I/4) = 1/2. Maximally mixed.

The purity decreases from 1 (pure) to 1/2 (maximally mixed) as decoherence increases.

**WE-P7.2: Decoherence time estimation.**

*Problem:* Estimate the decoherence time for a superposition of a dust grain (mass m = 10^{-15} kg) in two positions separated by Delta x = 10^{-6} m (1 micrometre) in a room-temperature (T = 300 K) thermal photon bath.

*Solution:*
The decoherence rate due to scattering of thermal photons is: Gamma_d approx (k^3 / (6 pi^2 hbar)) (Delta x)^2 (kT)^3 / (hbar^3 c^3) * sigma_eff, where the effective scattering cross-section depends on the object size. For a rough order-of-magnitude estimate using the standard formula from Joos & Zeh (1985):

Lambda_d approx (kT / hbar c)^3 * (Delta x)^2 * 10^{36} m^{-2} s^{-1} (for a macroscopic object in a thermal photon bath at 300 K).

More precisely: the decoherence rate due to thermal photon scattering is Gamma_d ~ (kT)^9 (Delta x)^2 / (hbar^10 c^9) x (geometry factor).

Using the standard result from Schlosshauer (2007, Table 3.1): for a dust grain at 300 K with Delta x = 10^{-6} m, t_d ~ 10^{-31} s.

This is 10^{-31} seconds -- about 10^{-18} times shorter than the Planck time (~10^{-43} s is actually longer, so let me correct: the Planck time is 5 x 10^{-44} s, so 10^{-31} s is about 10^{13} Planck times). This is incomprehensibly short. The dust grain's spatial superposition decoheres almost instantly.

For comparison: a trapped ion at T = 4 K with Delta x = 10^{-9} m: t_d ~ 10^{-3} s (milliseconds). This is why trapped ion experiments can maintain coherence.

**WE-P7.3: Phase flip channel on a qubit.**

*Problem:* A qubit is in state |+> = (|0> + |1>)/sqrt(2). It undergoes a phase flip channel with probability p = 0.1. (a) Write the density matrix before the channel. (b) Apply the channel: rho -> (1-p) rho + p sigma_z rho sigma_z. (c) Compute the off-diagonal elements. (d) What happens in the limit p -> 0.5?

*Solution:*
(a) rho = |+><+| = (1/2)[[1, 1], [1, 1]].

(b) sigma_z rho sigma_z = (1/2) sigma_z [[1,1],[1,1]] sigma_z = (1/2) [[1,0],[0,-1]][[1,1],[1,1]][[1,0],[0,-1]] = (1/2)[[1,-1],[-1,1]].

rho' = (1-p) rho + p sigma_z rho sigma_z = 0.9 (1/2)[[1,1],[1,1]] + 0.1 (1/2)[[1,-1],[-1,1]] = (1/2)[[1, 0.8],[0.8, 1]].

(c) Off-diagonal elements: 0.8/2 = 0.4 (reduced from 0.5). The coherence is reduced by a factor of 1 - 2p = 0.8.

(d) For p = 0.5: rho' = 0.5(1/2)[[1,1],[1,1]] + 0.5(1/2)[[1,-1],[-1,1]] = (1/2)[[1, 0],[0, 1]] = I/2. Complete dephasing. The qubit is maximally mixed.

The phase flip channel with p = 0.5 is equivalent to complete decoherence in the computational basis.

**WE-P7.4: Decoherence with N environment qubits.**

*Problem:* A qubit interacts sequentially with N = 10 independent environment qubits, each producing an overlap gamma = 0.9 (partial decoherence per interaction). (a) What is the total overlap after N interactions? (b) What is the off-diagonal element of rho_S after all interactions? (c) How many interactions are needed to reduce the off-diagonal element to 1% of its initial value?

*Solution:*
(a) Total overlap: Gamma = gamma^N = 0.9^{10} = 0.3487. The coherence is reduced to about 35% of its initial value.

(b) If the initial state is (|0> + |1>)/sqrt(2), the off-diagonal element is (1/2) Gamma = (1/2)(0.3487) = 0.1744.

(c) Need Gamma = gamma^N = 0.01. N = log(0.01) / log(0.9) = -4.605 / (-0.1054) = 43.7. So N = 44 interactions.

With gamma = 0.99 (weaker interaction): N = log(0.01) / log(0.99) = -4.605 / (-0.01005) = 458. Even weak interactions, repeated many times, produce decoherence. For macroscopic objects interacting with ~10^23 environmental particles per second, decoherence is overwhelmingly fast.

### 7. Common Confusions

**CC-P7.1: "Decoherence solves the measurement problem."**
This is the most important misconception about decoherence. Decoherence explains why off-diagonal elements of the density matrix vanish in the pointer basis, making the system appear to be in a classical mixture. But it does not explain why a specific outcome is observed. The density matrix (1/2)|0><0| + (1/2)|1><1| says the system is in |0> with probability 1/2 OR |1> with probability 1/2. But unitary evolution never produces "or" -- it produces "and" (superposition). The interpretation of the diagonal density matrix as classical probabilities is an additional assumption, not derived from the formalism. Decoherence is a necessary ingredient of any solution to the measurement problem, but it is not sufficient.

**CC-P7.2: "Decoherence is irreversible."**
In principle, decoherence is reversible -- it is simply entanglement with the environment, which is a unitary process. If we had complete knowledge of and control over all environment degrees of freedom, we could reverse the process (a "quantum eraser" for the environment). In practice, the environment has ~10^23 uncontrollable degrees of freedom, making reversal effectively impossible. Decoherence is effectively irreversible for the same reason that a broken egg doesn't reassemble: not because the laws of physics forbid it, but because the required control is impractical.

**CC-P7.3: "The Copenhagen interpretation says consciousness causes collapse."**
This is a common misattribution. The standard Copenhagen interpretation (Bohr's version) draws the quantum/classical cut at the measuring apparatus, not at the observer's consciousness. The "consciousness causes collapse" interpretation (von Neumann-Wigner) is a separate, minority interpretation. Most physicists who identify as "Copenhagen" do not invoke consciousness. The issue is where to draw the line between "quantum system" and "classical apparatus," not whether a mind is involved.

**CC-P7.4: "Many-worlds is unscientific because it's unfalsifiable."**
Many-worlds makes exactly the same experimental predictions as standard quantum mechanics (by construction). It is therefore as falsifiable as standard QM. The disagreement between interpretations is about ontology (what exists), not about empirical predictions (what we observe). Whether this makes many-worlds "unscientific" is a philosophical question about the demarcation criterion for science, not a physics question.

**CC-P7.5: "Decoherence means the quantum state becomes classical."**
A decohered density matrix is still a quantum state -- it is a mixed state in a Hilbert space, described by a density operator. It merely looks like a classical probability distribution when written in the pointer basis. But it can still exhibit quantum effects if coherence is recovered (e.g., echo techniques). Decoherence suppresses quantum interference for practical purposes but does not eliminate the quantum nature of the system.

**CC-P7.6: "Longer coherence times mean better qubits."**
Longer coherence times are necessary but not sufficient for good qubits. What matters is the ratio of coherence time to gate time (the number of operations you can perform before decoherence destroys the computation). A qubit with T2 = 1 ms and t_gate = 1 microsecond (ratio 1000) is equivalent in depth to a qubit with T2 = 100 ms and t_gate = 100 microseconds (also ratio 1000). Additionally, gate fidelity, connectivity, and error correlations all matter. The relevant figure of merit is the error per gate, not the coherence time alone.

### 8. Cross-References

| Reference | Direction | Description |
|-----------|-----------|-------------|
| A5 (Tensor Products) | backward | System-environment composite Hilbert space. Partial trace to get reduced density matrix. |
| A6 (Probability/Born Rule) | backward | Density matrices, mixed states, expectation values for mixed states. |
| P2 (Postulates) | backward | The tension between Postulates 4 and 5 is the measurement problem. |
| P3 (Schrodinger Equation) | backward | Unitary evolution generates system-environment entanglement. |
| P6 (Entanglement) | backward | Decoherence IS entanglement with the environment. The reduced density matrix formalism from P6. |
| C1 (Qubit) | backward | Qubit as the system. Density matrix representation of noisy qubits. |
| C3 (Gates) | backward | Noise channels as "faulty gates." |
| C4 (Entangling Gates) | backward | Entangling interactions between system and environment. |
| C5-C10 (Quantum Computing) | forward | Decoherence is the primary obstacle for all quantum algorithms. Quantum error correction (C-track) is the response. |

### 9. Historical Notes

**HN-P7.1: Schrodinger's cat (1935).** Erwin Schrodinger published the thought experiment in "Die gegenwartige Situation in der Quantenmechanik" (The Present Situation in Quantum Mechanics). His intent was to criticise the Copenhagen interpretation by showing that it leads to absurd conclusions for macroscopic objects. He wrote: "One can even set up quite ridiculous cases. A cat is penned up in a steel chamber..." The thought experiment became quantum mechanics' most famous icon, against Schrodinger's intentions.

**HN-P7.2: Zeh and the origins of decoherence (1970).** H. Dieter Zeh published "On the Interpretation of Measurement in Quantum Theory" in 1970, arguing that the interaction of quantum systems with their environments explains the apparent collapse of the wave function. His paper was initially rejected by several journals and ignored for a decade. Zeh's key insight: the environment acts as a "witness" that records which-state information, destroying interference.

**HN-P7.3: Zurek's einselection (1981-2003).** Wojciech Zurek developed the decoherence program systematically, introducing the concepts of "einselection" (environment-induced superselection) and "quantum Darwinism" (the idea that the environment records many redundant copies of the pointer-state information, explaining the objectivity of the classical world). Zurek's work made decoherence a standard tool in quantum foundations.

**HN-P7.4: Brune et al. cavity QED experiment (1996).** The first direct observation of decoherence dynamics, using Rydberg atoms and microwave cavities at the Ecole Normale Superieure in Paris (Haroche group). They created a "Schrodinger cat" state of a few photons in a cavity and watched its coherence decay. Serge Haroche received the 2012 Nobel Prize partly for this work.

**HN-P7.5: The decoherence program's limitations.** Despite its success, decoherence theory has been criticised for not resolving the measurement problem. Prominent critics include John Bell ("Against 'measurement'"), Tim Maudlin, and David Albert. The core objection: decoherence explains why interference terms vanish, but not why a specific outcome occurs. The "and/or" problem (superposition gives "and," but we observe "or") is not solved by making the "and" very hard to detect. This is why interpretations of quantum mechanics remain an active area of philosophical and foundational research.

### 10. Problem Set

**PS-P7.01 (Computational, Easy):** A qubit in state |+> = (|0>+|1>)/sqrt(2) interacts with an environment qubit via U|0>|E_0> = |0>|E_0>, U|1>|E_0> = |1>|E_1>, with <E_0|E_1> = 0. Compute the reduced density matrix rho_S. Is the system in a pure state or a mixed state? What is the purity?

**PS-P7.02 (Computational, Medium):** Repeat PS-P7.01 with <E_0|E_1> = 1/sqrt(2). Compute rho_S, the purity, and the von Neumann entropy S(rho_S) = -Tr(rho_S log_2 rho_S).

**PS-P7.03 (Computational, Medium):** A qubit interacts with N = 20 independent environment qubits, each producing an overlap gamma = 0.95. What is the total overlap? What fraction of the initial coherence remains?

**PS-P7.04 (Computational, Medium):** Apply the depolarising channel rho -> (1-p) rho + (p/3)(sigma_x rho sigma_x + sigma_y rho sigma_y + sigma_z rho sigma_z) to the state rho = |0><0| with p = 0.2. Compute the output density matrix and the purity.

**PS-P7.05 (Computational, Hard):** Show that the depolarising channel with p = 3/4 maps any input state to the maximally mixed state I/2. [Hint: use the identity (1/3)(sigma_x rho sigma_x + sigma_y rho sigma_y + sigma_z rho sigma_z) = (2/3)(I/2) - (1/3) rho for any rho.]

**PS-P7.06 (Conceptual, Medium):** Explain the difference between T1 (energy relaxation) and T2 (dephasing) for a qubit. Which noise channel corresponds to each? Can T2 be longer than 2T1? Explain.

**PS-P7.07 (Conceptual, Medium):** State the measurement problem in your own words. Explain why decoherence helps but does not fully resolve it.

**PS-P7.08 (Conceptual, Medium):** For each of the four interpretations discussed (Copenhagen, many-worlds, de Broglie-Bohm, QBism), state in one sentence how it addresses the measurement problem.

**PS-P7.09 (Computational, Hard):** A superconducting qubit has T2 = 100 microseconds and a single-qubit gate time t_gate = 20 ns. (a) What is the maximum circuit depth (number of sequential gates) before decoherence dominates? (b) If the error per gate is approximately t_gate / T2, what is the error per gate? (c) The threshold for quantum error correction is approximately 10^{-4}. Is this qubit above or below the threshold?

**PS-P7.10 (Conceptual, Hard):** Explain the concept of "pointer states" (einselection). Why does the environment select a particular basis? Give an example of a system where the pointer basis is the position basis and explain physically why.

**PS-P7.11 (Computational, Medium):** The Bloch vector of a qubit undergoing dephasing evolves as r_x(t) = r_x(0) e^{-t/T2}, r_y(t) = r_y(0) e^{-t/T2}, r_z(t) = r_z(0). Starting from the state |+> (Bloch vector (1, 0, 0)), plot the trajectory of the Bloch vector on the Bloch sphere as a function of time. Where does it end up as t -> infinity?

**PS-P7.12 (Synthesis, Hard):** "Decoherence is the enemy of quantum computing." Explain this statement quantitatively. For a quantum algorithm requiring circuit depth D = 10^6, what coherence time is needed if t_gate = 10 ns? Name a physical platform that might achieve this, and name one that currently cannot.

### 11. Simulator Dependencies

| Simulator | Usage in P7 | Presets |
|-----------|------------|---------|
| Qubit Circuit (SIM_QUBIT_UI) | Supporting. Used to demonstrate noise channels by applying "noisy" gates and observing the output density matrix. | Preset P7-Q-1: Single qubit, prepare |+>, apply phase flip channel with adjustable p. Preset P7-Q-2: Single qubit, prepare |0>, apply depolarising channel with adjustable p. Preset P7-Q-3: Two qubits (system + environment), CNOT interaction, trace out environment. |

The CHSH simulator, Stern-Gerlach simulator, and 1D Schrodinger simulator are NOT used in P7. (The qubit simulator's noise channel mode and 2-qubit mode are sufficient.)

Note: The qubit simulator must support density matrix display and noise channel application for the P7 presets. This capability is specified in the simulator-spec.md under the qubit circuit simulator's "advanced features" section.

### 12. Estimates

| Item | Estimate |
|------|----------|
| Prose word count | 10,000--15,000 words |
| Number of equations (display math) | 35--45 |
| Number of inline math expressions | 100--130 |
| Figures and visual assets | 7 (see VA list) |
| Interactive components | 3 (density matrix visualisation, noise channel visualisation, qubit simulator) |
| Worked examples | 4 |
| Problem set questions | 12 |
| Estimated development time (prose + equations) | 5 days |
| Estimated development time (visual assets) | 3 days |
| Estimated development time (interactive components) | 2 days |
| Total estimated development time | 10 days |

### 13. Page Splits

P7 is a single-page lesson. At 10,000--15,000 words, it is at the upper end of the single-page range. If the prose exceeds 15,000 words during writing, a split can be made at the boundary between Act IV (what decoherence does not solve) and Act V (interpretations), yielding:
- Part 1: "Decoherence" (Acts I-IV, ~8,000 words): the measurement problem, system-environment entanglement, the qubit model, what decoherence does and does not solve.
- Part 2: "Interpretations and Quantum Computing" (Acts V-VI, ~5,000 words): interpretations survey, why QC is hard.

For now, a single page is planned.

---

## Summary: Track P Development Estimates

| Lesson | Position | Target Words | Pages | Dev Days | Key Simulator |
|--------|----------|-------------|-------|----------|---------------|
| P1 | 4/23 | 10,000--12,000 | 1 | 9 | Stern-Gerlach |
| P2 | 5/23 | 10,000--12,000 | 1 | 10 | Qubit circuit |
| P3 | 9/23 | 20,000--25,000 | 3 | 18 | 1D Schrodinger |
| P4 | 10/23 | 12,000--15,000 | 1 | 12 | SG + Qubit |
| P5 | 13/23 | 10,000--12,000 | 1 | 10 | SG + Schrodinger |
| P6 | 14/23 | 20,000--25,000 | 3 | 18 | CHSH + Qubit |
| P7 | 20/23 | 10,000--15,000 | 1 | 10 | Qubit circuit |
| **Total** | | **92,000--116,000** | **11** | **87** | |

Total Track P: 7 lessons, 11 pages, approximately 92,000--116,000 words of prose, 87 development days estimated for a solo developer.

---

*End of Track P lesson specifications.*
