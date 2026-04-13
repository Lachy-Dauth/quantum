/**
 * @core/linalg — Shared Complex Linear Algebra Engine
 *
 * Pure TypeScript module providing complex number arithmetic, vector and matrix
 * types, standard quantum gates, and measurement primitives. No native or WASM
 * dependencies. This is a dependency of every simulator component.
 */

export * from './types'
export * from './complex'
export * from './vector'
export * from './matrix'
export * from './sparse'
export * from './gates'
export * from './gate-apply'
export * from './measurement'
export * from './partial-trace'
export * from './utils'
