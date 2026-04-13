import { describe, it, expect } from 'vitest'
import { SGSimulator, parseSGInitialState } from '../sg-simulator'
import { STATE_ZERO, STATE_ONE, STATE_PLUS, STATE_MINUS } from '../../core/vector'
import type { SGApparatus } from '../types'

function makeApp(
  id: string,
  theta: number,
  phi: number,
  input: SGApparatus['input'] = 'source',
  blocked: SGApparatus['blocked'] = null,
): SGApparatus {
  return { id, axis: { theta, phi }, input, blocked }
}

describe('parseSGInitialState', () => {
  it('parses |0> and |+z>', () => {
    const s = parseSGInitialState('|0>')
    expect(s.real[0]).toBeCloseTo(1)
    expect(s.real[1]).toBeCloseTo(0)

    const sz = parseSGInitialState('|+z>')
    expect(sz.real[0]).toBeCloseTo(1)
  })

  it('parses |1> and |-z>', () => {
    const s = parseSGInitialState('|1>')
    expect(s.real[0]).toBeCloseTo(0)
    expect(s.real[1]).toBeCloseTo(1)
  })

  it('parses |+> and |+x>', () => {
    const s = parseSGInitialState('|+>')
    expect(s.real[0]).toBeCloseTo(Math.SQRT1_2)
    expect(s.real[1]).toBeCloseTo(Math.SQRT1_2)
  })

  it('parses |-> and |-x>', () => {
    const s = parseSGInitialState('|->')
    expect(s.real[0]).toBeCloseTo(Math.SQRT1_2)
    expect(s.real[1]).toBeCloseTo(-Math.SQRT1_2)
  })

  it('passes StateVector through', () => {
    const result = parseSGInitialState(STATE_ZERO)
    expect(result).toBe(STATE_ZERO)
  })

  it('throws on unknown string', () => {
    expect(() => parseSGInitialState('|foo>')).toThrow()
  })
})

describe('SGSimulator - single apparatus', () => {
  it('Z-measure |+z>: always up', () => {
    const sim = new SGSimulator(42)
    sim.setExperiment({
      initialState: STATE_ZERO,
      apparatuses: [makeApp('m1', 0, 0)],
    })

    for (let i = 0; i < 20; i++) {
      const result = sim.runSingle()
      expect(result.blocked).toBe(false)
      expect(result.outcomes).toHaveLength(1)
      expect(result.outcomes[0]!.output).toBe('up')
      expect(result.outcomes[0]!.probability).toBeCloseTo(1)
    }
  })

  it('Z-measure |-z>: always down', () => {
    const sim = new SGSimulator(42)
    sim.setExperiment({
      initialState: STATE_ONE,
      apparatuses: [makeApp('m1', 0, 0)],
    })

    for (let i = 0; i < 20; i++) {
      const result = sim.runSingle()
      expect(result.outcomes[0]!.output).toBe('down')
      expect(result.outcomes[0]!.probability).toBeCloseTo(1)
    }
  })

  it('X-measure |+x>: always up', () => {
    const sim = new SGSimulator(42)
    sim.setExperiment({
      initialState: STATE_PLUS,
      apparatuses: [makeApp('m1', Math.PI / 2, 0)],
    })

    for (let i = 0; i < 20; i++) {
      const result = sim.runSingle()
      expect(result.outcomes[0]!.output).toBe('up')
    }
  })

  it('X-measure |+z>: roughly 50/50', () => {
    const sim = new SGSimulator(123)
    sim.setExperiment({
      initialState: STATE_ZERO,
      apparatuses: [makeApp('m1', Math.PI / 2, 0)],
    })

    const result = sim.runBatch(1000)
    const upCount = result.detectorCounts.get('m1:up') ?? 0
    const downCount = result.detectorCounts.get('m1:down') ?? 0

    expect(upCount + downCount).toBe(1000)
    expect(upCount).toBeGreaterThan(400)
    expect(upCount).toBeLessThan(600)
  })
})

describe('SGSimulator - sequential apparatuses', () => {
  it('Z then Z: always up at second', () => {
    const sim = new SGSimulator(42)
    sim.setExperiment({
      initialState: STATE_ZERO,
      apparatuses: [
        makeApp('m1', 0, 0, 'source'),
        makeApp('m2', 0, 0, { apparatusId: 'm1', output: 'up' }),
      ],
    })

    for (let i = 0; i < 20; i++) {
      const result = sim.runSingle()
      expect(result.outcomes).toHaveLength(2)
      expect(result.outcomes[0]!.output).toBe('up')
      expect(result.outcomes[1]!.output).toBe('up')
      expect(result.outcomes[1]!.probability).toBeCloseTo(1)
    }
  })

  it('Z then X then Z: 50% at final Z (after X-up)', () => {
    const sim = new SGSimulator(42)
    sim.setExperiment({
      initialState: STATE_ZERO,
      apparatuses: [
        makeApp('m1', 0, 0, 'source'),
        makeApp('m2', Math.PI / 2, 0, { apparatusId: 'm1', output: 'up' }),
        makeApp('m3', 0, 0, { apparatusId: 'm2', output: 'up' }),
      ],
    })

    const batch = sim.runBatch(2000)
    // Particles that reach m3 come from m2:up.
    // m1: all go up (state=|+z>). m2: 50% up (state=|+x>). m3: 50% of those up.
    // So ~1000 reach m2:up, ~500 go m3:up, ~500 go m3:down.
    const m3Up = batch.detectorCounts.get('m3:up') ?? 0
    const m3Down = batch.detectorCounts.get('m3:down') ?? 0
    const total = m3Up + m3Down
    expect(total).toBeGreaterThan(800)
    expect(total).toBeLessThan(1200)

    // Ratio should be ~50/50
    const ratio = m3Up / total
    expect(ratio).toBeGreaterThan(0.35)
    expect(ratio).toBeLessThan(0.65)
  })

  it('blocked beam test', () => {
    const sim = new SGSimulator(42)
    sim.setExperiment({
      initialState: STATE_ZERO,
      apparatuses: [
        makeApp('m1', Math.PI / 2, 0, 'source', 'down'), // block down
        makeApp('m2', 0, 0, { apparatusId: 'm1', output: 'up' }),
      ],
    })

    const batch = sim.runBatch(2000)
    // ~1000 particles go through m1:up, rest blocked
    // m2 measures |+x> along Z: 50/50
    expect(batch.totalBlocked).toBeGreaterThan(800)
    expect(batch.totalBlocked).toBeLessThan(1200)

    const m2Up = batch.detectorCounts.get('m2:up') ?? 0
    const m2Down = batch.detectorCounts.get('m2:down') ?? 0
    const detected = m2Up + m2Down
    expect(detected).toBe(batch.totalDetected)

    // Among detected, roughly 50/50
    if (detected > 100) {
      const ratio = m2Up / detected
      expect(ratio).toBeGreaterThan(0.35)
      expect(ratio).toBeLessThan(0.65)
    }
  })
})

describe('SGSimulator - theoretical probabilities', () => {
  it('single Z on |+z>: 100% up', () => {
    const sim = new SGSimulator()
    sim.setExperiment({
      initialState: STATE_ZERO,
      apparatuses: [makeApp('m1', 0, 0)],
    })

    const probs = sim.computeTheoreticalProbabilities()
    expect(probs.get('m1:up')).toBeCloseTo(1)
    expect(probs.get('m1:down') ?? 0).toBeCloseTo(0)
  })

  it('single X on |+z>: 50% each', () => {
    const sim = new SGSimulator()
    sim.setExperiment({
      initialState: STATE_ZERO,
      apparatuses: [makeApp('m1', Math.PI / 2, 0)],
    })

    const probs = sim.computeTheoreticalProbabilities()
    expect(probs.get('m1:up')).toBeCloseTo(0.5)
    expect(probs.get('m1:down')).toBeCloseTo(0.5)
  })

  it('theta=pi/3 on |+z>: 75% up, 25% down', () => {
    const sim = new SGSimulator()
    sim.setExperiment({
      initialState: STATE_ZERO,
      apparatuses: [makeApp('m1', Math.PI / 3, 0)],
    })

    const probs = sim.computeTheoreticalProbabilities()
    expect(probs.get('m1:up')).toBeCloseTo(0.75)
    expect(probs.get('m1:down')).toBeCloseTo(0.25)
  })

  it('Z then X then Z with blocking', () => {
    const sim = new SGSimulator()
    sim.setExperiment({
      initialState: STATE_ZERO,
      apparatuses: [
        makeApp('m1', Math.PI / 2, 0, 'source', 'down'),
        makeApp('m2', 0, 0, { apparatusId: 'm1', output: 'up' }),
      ],
    })

    const probs = sim.computeTheoreticalProbabilities()
    // Only m1:up branch survives (P=0.5), then m2 measures |+x> along Z: 50/50
    // So P(m2:up) = 0.25, P(m2:down) = 0.25
    expect(probs.get('m2:up')).toBeCloseTo(0.25)
    expect(probs.get('m2:down')).toBeCloseTo(0.25)
  })
})

describe('SGSimulator - batch', () => {
  it('10000 particles through X: ~50/50', () => {
    const sim = new SGSimulator(99)
    sim.setExperiment({
      initialState: STATE_ZERO,
      apparatuses: [makeApp('m1', Math.PI / 2, 0)],
    })

    const batch = sim.runBatch(10000)
    expect(batch.totalEmitted).toBe(10000)
    expect(batch.totalBlocked).toBe(0)
    expect(batch.totalDetected).toBe(10000)

    const up = batch.detectorCounts.get('m1:up')!
    const down = batch.detectorCounts.get('m1:down')!
    expect(up + down).toBe(10000)

    // Chi-squared test: expected 5000 each
    const chi2 = Math.pow(up - 5000, 2) / 5000 + Math.pow(down - 5000, 2) / 5000
    expect(chi2).toBeLessThan(10.83) // p > 0.001 with 1 df
  })

  it('10000 particles through pi/3: ~75/25', () => {
    const sim = new SGSimulator(77)
    sim.setExperiment({
      initialState: STATE_ZERO,
      apparatuses: [makeApp('m1', Math.PI / 3, 0)],
    })

    const batch = sim.runBatch(10000)
    const up = batch.detectorCounts.get('m1:up')!
    const down = batch.detectorCounts.get('m1:down')!

    // Chi-squared against 7500/2500
    const chi2 = Math.pow(up - 7500, 2) / 7500 + Math.pow(down - 2500, 2) / 2500
    expect(chi2).toBeLessThan(10.83)
  })
})
