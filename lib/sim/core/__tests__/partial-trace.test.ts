import { describe, it, expect } from 'vitest'
import { partialTrace, partialTraceDensity } from '../partial-trace'
import { BELL_PHI_PLUS, STATE_ZERO, STATE_ONE, STATE_PLUS, tensorProduct, basisState } from '../vector'
import { matIdentity, mget, matScale, trace } from '../matrix'
import { complex } from '../complex'
import { expectComplex, expectMatrix } from './helpers'

describe('partialTrace (pure state)', () => {
  it('tracing out one qubit of Bell Phi+ gives maximally mixed state (I/2)', () => {
    const rho = partialTrace(BELL_PHI_PLUS, [2, 2], [1])
    const halfI = matScale(matIdentity(2), complex(0.5))
    expectMatrix(rho, halfI)
  })

  it('tracing out the other qubit of Bell Phi+ also gives I/2', () => {
    const rho = partialTrace(BELL_PHI_PLUS, [2, 2], [0])
    const halfI = matScale(matIdentity(2), complex(0.5))
    expectMatrix(rho, halfI)
  })

  it('tracing out nothing gives full density matrix |psi><psi|', () => {
    const state = STATE_ZERO
    const rho = partialTrace(state, [2], [])
    // |0><0| = [[1,0],[0,0]]
    expectComplex(mget(rho, 0, 0), complex(1))
    expectComplex(mget(rho, 0, 1), complex(0))
    expectComplex(mget(rho, 1, 0), complex(0))
    expectComplex(mget(rho, 1, 1), complex(0))
  })

  it('product state partial trace = individual state density matrix', () => {
    // |+> x |0> : trace out second qubit should give |+><+|
    const state = tensorProduct(STATE_PLUS, STATE_ZERO)
    const rho = partialTrace(state, [2, 2], [1])
    // |+><+| = [[0.5, 0.5], [0.5, 0.5]]
    expectComplex(mget(rho, 0, 0), complex(0.5))
    expectComplex(mget(rho, 0, 1), complex(0.5))
    expectComplex(mget(rho, 1, 0), complex(0.5))
    expectComplex(mget(rho, 1, 1), complex(0.5))
  })

  it('product state: trace out first qubit gives second qubit density matrix', () => {
    const state = tensorProduct(STATE_PLUS, STATE_ONE)
    const rho = partialTrace(state, [2, 2], [0])
    // |1><1| = [[0, 0], [0, 1]]
    expectComplex(mget(rho, 0, 0), complex(0))
    expectComplex(mget(rho, 0, 1), complex(0))
    expectComplex(mget(rho, 1, 0), complex(0))
    expectComplex(mget(rho, 1, 1), complex(1))
  })

  it('reduced density matrix has trace 1', () => {
    const rho = partialTrace(BELL_PHI_PLUS, [2, 2], [0])
    const tr = trace(rho)
    expectComplex(tr, complex(1))
  })

  it('3-qubit system: trace out middle qubit', () => {
    // |000> : tracing out qubit 1 should give |0><0| x |0><0| = 4x4 with (0,0) = 1
    const state = basisState(8, 0) // |000>
    const rho = partialTrace(state, [2, 2, 2], [1])
    expect(rho.rows).toBe(4)
    expect(rho.cols).toBe(4)
    expectComplex(mget(rho, 0, 0), complex(1))
    const tr = trace(rho)
    expectComplex(tr, complex(1))
  })
})

describe('partialTraceDensity', () => {
  it('from pure state density matrix matches partialTrace from state vector', () => {
    // Build density matrix for Bell Phi+
    const state = BELL_PHI_PLUS
    const dim = state.dim
    const rhoReal = new Float64Array(dim * dim)
    const rhoImag = new Float64Array(dim * dim)
    for (let i = 0; i < dim; i++) {
      for (let j = 0; j < dim; j++) {
        // |psi><psi|[i][j] = psi[i] * conj(psi[j])
        rhoReal[i * dim + j] = state.real[i]! * state.real[j]! + state.imag[i]! * state.imag[j]!
        rhoImag[i * dim + j] = state.imag[i]! * state.real[j]! - state.real[i]! * state.imag[j]!
      }
    }
    const rho = { rows: dim, cols: dim, real: rhoReal, imag: rhoImag }

    const fromState = partialTrace(state, [2, 2], [1])
    const fromDensity = partialTraceDensity(rho, [2, 2], [1])
    expectMatrix(fromState, fromDensity)
  })
})
