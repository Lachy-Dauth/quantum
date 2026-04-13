/**
 * Shared test helpers for comparing complex numbers, state vectors, and matrices.
 */

import { expect } from 'vitest'
import type { Complex, StateVector, DenseMatrix } from '../types'

export function expectComplex(actual: Complex, expected: Complex, eps = 1e-10): void {
  expect(Math.abs(actual.re - expected.re)).toBeLessThan(eps)
  expect(Math.abs(actual.im - expected.im)).toBeLessThan(eps)
}

export function expectStateVec(actual: StateVector, expected: StateVector, eps = 1e-10): void {
  expect(actual.dim).toBe(expected.dim)
  for (let i = 0; i < actual.dim; i++) {
    expect(Math.abs(actual.real[i]! - expected.real[i]!)).toBeLessThan(eps)
    expect(Math.abs(actual.imag[i]! - expected.imag[i]!)).toBeLessThan(eps)
  }
}

export function expectMatrix(actual: DenseMatrix, expected: DenseMatrix, eps = 1e-10): void {
  expect(actual.rows).toBe(expected.rows)
  expect(actual.cols).toBe(expected.cols)
  const len = actual.rows * actual.cols
  for (let i = 0; i < len; i++) {
    expect(Math.abs(actual.real[i]! - expected.real[i]!)).toBeLessThan(eps)
    expect(Math.abs(actual.imag[i]! - expected.imag[i]!)).toBeLessThan(eps)
  }
}
