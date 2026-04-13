// Shared utilities for complex number visualizations
// All simulators use SVG with a consistent coordinate system

// ── Complex arithmetic (as [re, im] tuples) ──────────────────────────

export type Complex = [number, number]

export function cAdd(a: Complex, b: Complex): Complex {
  return [a[0] + b[0], a[1] + b[1]]
}

export function cSub(a: Complex, b: Complex): Complex {
  return [a[0] - b[0], a[1] - b[1]]
}

export function cMul(a: Complex, b: Complex): Complex {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]
}

export function cConj(z: Complex): Complex {
  return [z[0], -z[1]]
}

export function cAbs(z: Complex): number {
  return Math.sqrt(z[0] * z[0] + z[1] * z[1])
}

export function cArg(z: Complex): number {
  return Math.atan2(z[1], z[0])
}

export function cFromPolar(r: number, theta: number): Complex {
  return [r * Math.cos(theta), r * Math.sin(theta)]
}

// ── Coordinate transforms ─────────────────────────────────────────────
// Math space: origin at center, y-axis up, range [-range, range]
// SVG space:  origin at top-left, y-axis down, pixel units

export interface CoordSystem {
  width: number
  height: number
  range: number // half-extent of the visible math space
}

export function mathToSvg(
  x: number,
  y: number,
  cs: CoordSystem,
): [number, number] {
  const sx = (x / cs.range) * (cs.width / 2) + cs.width / 2
  const sy = -(y / cs.range) * (cs.height / 2) + cs.height / 2
  return [sx, sy]
}

export function svgToMath(
  sx: number,
  sy: number,
  cs: CoordSystem,
): [number, number] {
  const x = ((sx - cs.width / 2) / (cs.width / 2)) * cs.range
  const y = -((sy - cs.height / 2) / (cs.height / 2)) * cs.range
  return [x, y]
}

// ── Formatting helpers ────────────────────────────────────────────────

export function fmtNum(n: number, decimals = 2): string {
  if (Math.abs(n) < 1e-10) return '0'
  return n.toFixed(decimals).replace(/\.?0+$/, '')
}

export function fmtComplex(z: Complex): string {
  const [a, b] = z
  const ra = fmtNum(a)
  const rb = fmtNum(Math.abs(b))
  if (Math.abs(b) < 1e-10) return ra
  if (Math.abs(a) < 1e-10) {
    if (Math.abs(b - 1) < 1e-10) return 'i'
    if (Math.abs(b + 1) < 1e-10) return '-i'
    return `${fmtNum(b)}i`
  }
  const sign = b >= 0 ? '+' : '-'
  const bStr = Math.abs(Math.abs(b) - 1) < 1e-10 ? '' : rb
  return `${ra} ${sign} ${bStr}i`
}

export function fmtAngle(theta: number): string {
  // Try to express as a nice fraction of π
  const piRatio = theta / Math.PI
  const niceAngles: [number, string][] = [
    [0, '0'],
    [1 / 6, 'π/6'],
    [1 / 4, 'π/4'],
    [1 / 3, 'π/3'],
    [1 / 2, 'π/2'],
    [2 / 3, '2π/3'],
    [3 / 4, '3π/4'],
    [5 / 6, '5π/6'],
    [1, 'π'],
    [7 / 6, '7π/6'],
    [5 / 4, '5π/4'],
    [4 / 3, '4π/3'],
    [3 / 2, '3π/2'],
    [5 / 3, '5π/3'],
    [7 / 4, '7π/4'],
    [11 / 6, '11π/6'],
    [2, '2π'],
    [-1 / 6, '-π/6'],
    [-1 / 4, '-π/4'],
    [-1 / 3, '-π/3'],
    [-1 / 2, '-π/2'],
    [-2 / 3, '-2π/3'],
    [-3 / 4, '-3π/4'],
    [-5 / 6, '-5π/6'],
    [-1, '-π'],
  ]
  for (const [ratio, label] of niceAngles) {
    if (Math.abs(piRatio - ratio) < 0.01) return label
  }
  return `${fmtNum(theta)} rad`
}

// ── SVG drawing helpers ───────────────────────────────────────────────

export function gridLines(cs: CoordSystem): { x: number[]; y: number[] } {
  const step = cs.range <= 2 ? 0.5 : 1
  const xs: number[] = []
  const ys: number[] = []
  for (let v = -cs.range; v <= cs.range; v += step) {
    if (Math.abs(v) > 1e-10) {
      xs.push(v)
      ys.push(v)
    }
  }
  return { x: xs, y: ys }
}

export function tickLabels(
  cs: CoordSystem,
): { value: number; label: string }[] {
  const step = cs.range <= 2 ? 0.5 : 1
  const labels: { value: number; label: string }[] = []
  for (let v = -cs.range; v <= cs.range; v += step) {
    if (Math.abs(v) > 1e-10) {
      labels.push({ value: v, label: fmtNum(v, 1) })
    }
  }
  return labels
}

// Arc path for drawing angle arcs
export function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  // Normalize so arc goes counterclockwise from startAngle to endAngle
  let sweep = endAngle - startAngle
  while (sweep < 0) sweep += 2 * Math.PI
  while (sweep > 2 * Math.PI) sweep -= 2 * Math.PI

  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy - r * Math.sin(startAngle) // SVG y is flipped
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy - r * Math.sin(endAngle)

  const largeArc = sweep > Math.PI ? 1 : 0
  // SVG sweep: 0 = counterclockwise in SVG coords = clockwise in math coords
  // Since SVG y is flipped, sweep=0 gives counterclockwise in math
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2}`
}
