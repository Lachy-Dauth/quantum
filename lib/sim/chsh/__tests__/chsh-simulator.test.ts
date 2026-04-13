import { describe, it, expect } from 'vitest'
import { CHSHSimulator } from '../chsh-simulator'

function expectClose(actual: number, expected: number, eps = 1e-4) {
  expect(Math.abs(actual - expected)).toBeLessThan(eps)
}

describe('CHSHSimulator - theoretical correlations for |Phi+>', () => {
  // For |Phi+> with A(a)=cos(a)Z+sin(a)X: E(a,b) = cos(a-b)

  it('E(0, 0) = 1', () => {
    const sim = new CHSHSimulator()
    expectClose(sim.computeCorrelation(0, 0), 1)
  })

  it('E(0, pi/2) = 0', () => {
    const sim = new CHSHSimulator()
    expectClose(sim.computeCorrelation(0, Math.PI / 2), 0, 1e-10)
  })

  it('E(0, pi) = -1', () => {
    const sim = new CHSHSimulator()
    expectClose(sim.computeCorrelation(0, Math.PI), -1)
  })

  it('E(0, pi/4) ~ cos(pi/4) ~ 0.7071', () => {
    const sim = new CHSHSimulator()
    expectClose(sim.computeCorrelation(0, Math.PI / 4), Math.cos(Math.PI / 4))
  })

  it('correlation follows cos(a-b) for |Phi+>', () => {
    const sim = new CHSHSimulator()
    for (let i = 0; i < 10; i++) {
      const a = Math.random() * Math.PI
      const b = Math.random() * Math.PI
      const expected = Math.cos(a - b)
      expectClose(sim.computeCorrelation(a, b), expected, 1e-8)
    }
  })
})

describe('CHSHSimulator - theoretical S values', () => {
  it('default angles (a1=0, a2=pi/2, b1=pi/4, b2=-pi/4) give S = 2*sqrt(2)', () => {
    const sim = new CHSHSimulator()
    // E(0, pi/4) = cos(-pi/4) = 1/sqrt(2)
    // E(0, -pi/4) = cos(pi/4) = 1/sqrt(2)
    // E(pi/2, pi/4) = cos(pi/4) = 1/sqrt(2)
    // E(pi/2, -pi/4) = cos(3pi/4) = -1/sqrt(2)
    // S = 1/sqrt(2) + 1/sqrt(2) + 1/sqrt(2) - (-1/sqrt(2)) = 4/sqrt(2) = 2*sqrt(2)
    const S = sim.computeTheoreticalS()
    expectClose(S, 2 * Math.SQRT2, 1e-8)
  })

  it('product state gives |S| <= 2', () => {
    const sim = new CHSHSimulator()
    sim.setEntangledState('product')
    const S = sim.computeTheoreticalS()
    expect(Math.abs(S)).toBeLessThanOrEqual(2 + 1e-10)
  })

  it('all-same-axis gives S = 2', () => {
    const sim = new CHSHSimulator()
    sim.setAngles([0, 0], [0, 0])
    // E(0,0)=1 for all 4 pairs. S = 1 + 1 + 1 - 1 = 2
    const S = sim.computeTheoreticalS()
    expectClose(S, 2)
  })
})

describe('CHSHSimulator - empirical convergence', () => {
  it('empirical S converges to theoretical for maximal violation (10000 trials)', () => {
    const sim = new CHSHSimulator(42)
    sim.runBatch(10000)
    const state = sim.getState()

    expect(state.empiricalS).toBeGreaterThan(2.5)
    expect(state.empiricalS).toBeLessThan(3.1)
    expect(state.totalTrials).toBe(10000)
  })

  it('individual correlations converge', () => {
    const sim = new CHSHSimulator(123)
    sim.runBatch(4000)
    const state = sim.getState()

    for (const pair of state.pairStats) {
      expect(pair.trials).toBeGreaterThan(700)
      expect(pair.trials).toBeLessThan(1300)
      expect(Math.abs(pair.correlation - pair.theoreticalCorrelation)).toBeLessThan(0.15)
    }
  })

  it('product state: |S| stays near or below 2', () => {
    const sim = new CHSHSimulator(42)
    sim.setEntangledState('product')
    sim.runBatch(4000)
    const state = sim.getState()
    expect(Math.abs(state.empiricalS)).toBeLessThan(2.3)
  })
})

describe('CHSHSimulator - trial recording', () => {
  it('records trials correctly', () => {
    const sim = new CHSHSimulator(42)
    const trial = sim.runTrialWithSettings(0, 1)

    expect(trial.aliceSetting).toBe(0)
    expect(trial.bobSetting).toBe(1)
    expect([1, -1]).toContain(trial.aliceOutcome)
    expect([1, -1]).toContain(trial.bobOutcome)
    expect(trial.product).toBe(trial.aliceOutcome * trial.bobOutcome)
  })

  it('caps stored trials at maxTrials', () => {
    const sim = new CHSHSimulator(42, 100)
    sim.runBatch(200)
    const state = sim.getState()
    expect(state.trials.length).toBeLessThanOrEqual(100)
    expect(state.totalTrials).toBe(200)
  })

  it('reset clears all state', () => {
    const sim = new CHSHSimulator(42)
    sim.runBatch(100)
    sim.reset()
    const state = sim.getState()
    expect(state.totalTrials).toBe(0)
    expect(state.trials).toHaveLength(0)
    for (const pair of state.pairStats) {
      expect(pair.trials).toBe(0)
    }
  })
})

describe('CHSHSimulator - correlation curve', () => {
  it('generates correct number of points', () => {
    const sim = new CHSHSimulator()
    const curve = sim.correlationCurve(50)
    expect(curve).toHaveLength(51)
    expectClose(curve[0]!.angleDiff, 0)
    expectClose(curve[50]!.angleDiff, Math.PI)
  })

  it('E follows cos(a-b) for |Phi+> (a=0 fixed)', () => {
    const sim = new CHSHSimulator()
    const curve = sim.correlationCurve(20)
    for (const pt of curve) {
      expectClose(pt.E, Math.cos(-pt.angleDiff), 1e-8)
    }
  })
})

describe('CHSHSimulator - different Bell states', () => {
  // For Z⊗Z (a=b=0):
  // |Phi+> = (|00>+|11>)/√2 → E = 1 (both same → +1*+1 and -1*-1)
  // |Phi-> = (|00>-|11>)/√2 → E = 1 (same eigenvalue sectors)
  // |Psi+> = (|01>+|10>)/√2 → E = -1 (opposite eigenvalue sectors)
  // |Psi-> = (|01>-|10>)/√2 → E = -1

  it('phi_minus: E(0,0) = 1', () => {
    const sim = new CHSHSimulator()
    sim.setEntangledState('phi_minus')
    expectClose(sim.computeCorrelation(0, 0), 1, 1e-8)
  })

  it('psi_plus: E(0,0) = -1', () => {
    const sim = new CHSHSimulator()
    sim.setEntangledState('psi_plus')
    expectClose(sim.computeCorrelation(0, 0), -1, 1e-8)
  })

  it('psi_minus: E(0,0) = -1', () => {
    const sim = new CHSHSimulator()
    sim.setEntangledState('psi_minus')
    expectClose(sim.computeCorrelation(0, 0), -1, 1e-8)
  })
})
