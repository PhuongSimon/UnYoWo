// Draws the two 3x3 sprite sheets for the UnYoWo mascot (a shy bunny hiding in a box).
// The box is a real 3D box projected orthographically, so head turns show the side,
// top and bottom faces. The feet never move: they are the anchor page-mascot pins on.
import { mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'

const require = createRequire(import.meta.url)
const { Resvg } = require('@resvg/resvg-js')

const OUT = process.argv[2] ?? 'out'
const CELL = 400
const SCALE = 1.08
const GROUND_Y = 318

const C = {
  outline: '#3a2618',
  front: '#e3b079',
  top: '#efc893',
  side: '#c99055',
  bottom: '#b07a43',
  hole: '#2a1b12',
  tape: '#fc6c26',
  tapeHi: '#fe9164',
  fur: '#ffffff',
  furShade: '#eee4dc',
  ear: '#f9b3c2',
  blush: '#ff8fa8',
  doodle: '#a8682f',
  iris: '#6b3f22',
  pupil: '#1d140e',
  heart: '#ff5577',
  star: '#ffc93c',
  zzz: '#5b8def',
}

const W = 184
const H = 150
const D = 112
const ELEV = (16 * Math.PI) / 180
const LINE = 5
const BOX_SEAT = 14

const deg = (d) => (d * Math.PI) / 180

const pitchX = ([x, y, z], a) => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)]
const yawY = ([x, y, z], b) => [x * Math.cos(b) + z * Math.sin(b), y, -x * Math.sin(b) + z * Math.cos(b)]

function rotateVector(v, yaw, pitch) {
  return pitchX(yawY(pitchX(v, -pitch), yaw), ELEV)
}

// Tipping a real box: looking down rocks it over its front bottom edge, looking up over
// its back bottom edge, so the bottom never sinks into the feet.
function rotatePoint([x, y, z], yaw, pitch) {
  const pz = pitch < 0 ? D / 2 : pitch > 0 ? -D / 2 : 0
  let p = pitchX([x, y, z - pz], -pitch)
  p = [p[0], p[1], p[2] + pz]
  return pitchX(yawY(p, yaw), ELEV)
}

const toScreen = ([x, y]) => [x, -y]

const FACES = {
  front: { c: [0, H / 2, D / 2], u: [1, 0, 0], v: [0, -1, 0], hu: W / 2, hv: H / 2, n: [0, 0, 1], fill: C.front },
  top: { c: [0, H, 0], u: [1, 0, 0], v: [0, 0, 1], hu: W / 2, hv: D / 2, n: [0, 1, 0], fill: C.top },
  bottom: { c: [0, 0, 0], u: [1, 0, 0], v: [0, 0, -1], hu: W / 2, hv: D / 2, n: [0, -1, 0], fill: C.bottom },
  right: { c: [W / 2, H / 2, 0], u: [0, 0, -1], v: [0, -1, 0], hu: D / 2, hv: H / 2, n: [1, 0, 0], fill: C.side },
  left: { c: [-W / 2, H / 2, 0], u: [0, 0, 1], v: [0, -1, 0], hu: D / 2, hv: H / 2, n: [-1, 0, 0], fill: C.side },
}

function faceMatrix(face, yaw, pitch) {
  const [a, b] = toScreen(rotateVector(face.u, yaw, pitch))
  const [c, d] = toScreen(rotateVector(face.v, yaw, pitch))
  const [e, f] = toScreen(rotatePoint(face.c, yaw, pitch))
  return { a, b, c, d, e, f }
}

const apply = (m, u, v) => [m.a * u + m.c * v + m.e, m.b * u + m.d * v + m.f]
const fmt = (n) => Number(n.toFixed(2))
const matrixAttr = (m) => `matrix(${[m.a, m.b, m.c, m.d, m.e, m.f].map(fmt).join(' ')})`

function polyline(m, points, { stroke, width, close = false, fill = 'none' }) {
  const d = points.map(([u, v], i) => {
    const [x, y] = apply(m, u, v)
    return `${i ? 'L' : 'M'}${fmt(x)} ${fmt(y)}`
  })
  return `<path d="${d.join(' ')}${close ? ' Z' : ''}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`
}

function arcPoints(cu, cv, rx, ry, from, to, steps = 18) {
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const t = deg(from + ((to - from) * i) / steps)
    pts.push([cu + rx * Math.cos(t), cv + ry * Math.sin(t)])
  }
  return pts
}

// ---- eyes (all in front-face coordinates; v grows downward) ----
const EYE_V = -14
const EYE_U = 23

function openEye(u, v, look = [0, 0], big = false) {
  const [lu, lv] = look
  if (big) {
    return `<ellipse cx="${u}" cy="${v}" rx="16" ry="18" fill="#fff"/>
      <circle cx="${u}" cy="${v + 1}" r="6.5" fill="${C.pupil}"/>
      <circle cx="${u - 3}" cy="${v - 3}" r="2.6" fill="#fff"/>`
  }
  return `<ellipse cx="${u}" cy="${v}" rx="14" ry="16" fill="#fff"/>
    <ellipse cx="${u + 1 + lu * 3}" cy="${v + 2 + lv * 3}" rx="10.5" ry="12.5" fill="${C.iris}"/>
    <ellipse cx="${u + 1.5 + lu * 3.5}" cy="${v + 3 + lv * 3.5}" rx="7" ry="8.5" fill="${C.pupil}"/>
    <circle cx="${u - 3.5 + lu * 2}" cy="${v - 4 + lv * 2}" r="4.2" fill="#fff"/>
    <circle cx="${u + 4.5 + lu * 2}" cy="${v + 7 + lv * 2}" r="1.9" fill="#fff"/>`
}

function heartPath(cx, cy, s) {
  return `M${cx} ${cy + 9 * s} l${-11 * s} ${-11 * s} a${6.4 * s} ${6.4 * s} 0 0 1 ${11 * s} ${-8.5 * s} a${6.4 * s} ${6.4 * s} 0 0 1 ${11 * s} ${8.5 * s} z`
}

function starPath(cx, cy, r) {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.45 : r
    const t = deg(-90 + i * 36)
    pts.push(`${fmt(cx + rr * Math.cos(t))} ${fmt(cy + rr * Math.sin(t))}`)
  }
  return `M${pts.join(' L')} Z`
}

// Each eye style returns { fills: string drawn inside the face matrix, lines: [polyline specs] }
const EYES = {
  open: (look) => ({ fills: openEye(-EYE_U + look[0] * 9, EYE_V + look[1] * 5, look) + openEye(EYE_U + look[0] * 9, EYE_V + look[1] * 5, look), lines: [] }),
  closed: () => ({
    fills: '',
    lines: [-EYE_U, EYE_U].map((u) => ({ points: arcPoints(u, EYE_V + 6, 12, 11, 200, 340), stroke: '#fff', width: 5.5 })),
  }),
  surprised: () => ({ fills: openEye(-EYE_U - 1, EYE_V, [0, 0], true) + openEye(EYE_U + 1, EYE_V, [0, 0], true), lines: [] }),
  wink: () => ({
    fills: openEye(-EYE_U, EYE_V),
    lines: [{ points: arcPoints(EYE_U, EYE_V + 6, 12, 11, 200, 340), stroke: '#fff', width: 5.5 }],
  }),
  sleepy: () => ({
    fills: '',
    lines: [-EYE_U, EYE_U].map((u) => ({ points: arcPoints(u, EYE_V - 4, 12, 9, 20, 160), stroke: '#fff', width: 5.5 })),
  }),
  dizzy: () => {
    const spiral = (cu) => {
      const pts = []
      for (let i = 0; i <= 60; i++) {
        const t = (i / 60) * Math.PI * 4.2
        const r = 1.5 + (i / 60) * 12
        pts.push([cu + r * Math.cos(t), EYE_V + r * Math.sin(t)])
      }
      return { points: pts, stroke: '#fff', width: 3.6 }
    }
    return { fills: '', lines: [spiral(-EYE_U), spiral(EYE_U)] }
  },
  delighted: () => ({
    fills: `<ellipse cx="0" cy="${EYE_V + 12}" rx="7" ry="6" fill="#ff7a93"/>`,
    lines: [-EYE_U - 2, EYE_U + 2].map((u) => ({ points: arcPoints(u, EYE_V + 4, 12, 11, 200, 340), stroke: '#fff', width: 5.5 })),
  }),
}

// ---- one character drawing ----
function drawCharacter({ yaw = 0, pitch = 0, eyes = 'open', look = [0, 0], blush = 0.6, symbol = null }) {
  const out = []

  // Feet: identical in every cell -- the anchor.
  const feet = [-40, 40].map(
    (x) => `<ellipse cx="${x}" cy="20" rx="31" ry="15" fill="${C.fur}" stroke="${C.outline}" stroke-width="${LINE}"/>
      <ellipse cx="${x}" cy="25" rx="20" ry="6" fill="${C.furShade}"/>
      <circle cx="${x - 11}" cy="24" r="3.6" fill="${C.ear}"/><circle cx="${x}" cy="27" r="3.6" fill="${C.ear}"/><circle cx="${x + 11}" cy="24" r="3.6" fill="${C.ear}"/>`,
  )
  out.push(feet.join(''))

  const visible = Object.entries(FACES).filter(([, f]) => rotateVector(f.n, yaw, pitch)[2] > 0.03)
  const topVisible = visible.some(([k]) => k === 'top')

  // Seat the box on the feet: its lowest point lands on the same line in every cell.
  let lowest = -Infinity
  for (const [, face] of visible) {
    const m = faceMatrix(face, yaw, pitch)
    for (const [u, v] of [[-face.hu, -face.hv], [face.hu, -face.hv], [face.hu, face.hv], [-face.hu, face.hv]]) {
      lowest = Math.max(lowest, apply(m, u, v)[1])
    }
  }
  const seat = []
  seat.push(`<g transform="translate(0 ${fmt(BOX_SEAT - lowest)})">`)

  const ears = drawEars(yaw, pitch, topVisible)
  if (!topVisible) seat.push(ears)

  for (const [name, face] of visible) {
    const m = faceMatrix(face, yaw, pitch)
    const corners = [[-face.hu, -face.hv], [face.hu, -face.hv], [face.hu, face.hv], [-face.hu, face.hv]]
    const pts = corners.map(([u, v]) => apply(m, u, v).map(fmt).join(' '))
    seat.push(`<path d="M${pts.join(' L')} Z" fill="${face.fill}" stroke="${C.outline}" stroke-width="${LINE}" stroke-linejoin="round"/>`)
    if (name === 'top') seat.push(topDetails(m))
    if (name === 'front') seat.push(frontDetails(m, eyes, look, blush))
  }

  if (topVisible) seat.push(ears)
  seat.push('</g>')
  out.push(seat.join('\n'))
  if (symbol) out.push(drawSymbol(symbol))

  return `<g transform="scale(${SCALE})">${out.join('\n')}</g>`
}

function topDetails(m) {
  const holes = [-46, 46].map((u) => `<ellipse cx="${u}" cy="-6" rx="25" ry="15" fill="${C.hole}"/>`).join('')
  const tape = `<rect x="-13" y="-58" width="26" height="116" fill="${C.tape}"/><rect x="-8" y="-58" width="4" height="116" fill="${C.tapeHi}"/>`
  return `<g transform="${matrixAttr(m)}">${tape}${holes}</g>`
}

function frontDetails(m, eyes, look, blush) {
  const style = EYES[eyes](look)
  const g = []
  g.push(`<rect x="-13" y="-80" width="26" height="40" fill="${C.tape}"/><rect x="-8" y="-80" width="4" height="40" fill="${C.tapeHi}"/>`)
  // slot = outline ring + dark inside
  g.push(`<rect x="-66" y="${EYE_V - 27}" width="132" height="54" rx="27" fill="${C.outline}"/>`)
  g.push(`<rect x="-62" y="${EYE_V - 23}" width="124" height="46" rx="23" fill="${C.hole}"/>`)
  g.push(`<clipPath id="slotclip"><rect x="-62" y="${EYE_V - 23}" width="124" height="46" rx="23"/></clipPath>`)
  g.push(`<g clip-path="url(#slotclip)">${style.fills}</g>`)
  // blush on the cardboard
  g.push(`<ellipse cx="-72" cy="${EYE_V + 40}" rx="12" ry="6.5" fill="${C.blush}" opacity="${blush}"/>`)
  g.push(`<ellipse cx="72" cy="${EYE_V + 40}" rx="12" ry="6.5" fill="${C.blush}" opacity="${blush}"/>`)
  // paws gripping the bottom edge of the slot
  for (const u of [-36, 36]) {
    g.push(`<ellipse cx="${u}" cy="${EYE_V + 24}" rx="21.5" ry="13.5" fill="${C.outline}"/>`)
    g.push(`<ellipse cx="${u}" cy="${EYE_V + 24}" rx="18" ry="10.5" fill="${C.fur}"/>`)
    g.push(`<ellipse cx="${u}" cy="${EYE_V + 29}" rx="12" ry="4" fill="${C.furShade}"/>`)
  }
  // little heart doodle and "this side up" arrows
  g.push(`<path d="${heartPath(-58, 46, 0.75)}" fill="${C.doodle}" opacity="0.75"/>`)
  const lines = [...style.lines]
  for (const u of [-43, -36, -29, 29, 36, 43]) {
    const base = EYE_V + 18
    lines.push({ points: [[u, base], [u, base + 6]], stroke: C.outline, width: 2.4 })
  }
  for (const u of [50, 64]) {
    lines.push({ points: [[u, 58], [u, 40]], stroke: C.doodle, width: 2.6 })
    lines.push({ points: [[u - 5, 46], [u, 40], [u + 5, 46]], stroke: C.doodle, width: 2.6 })
  }
  const linesSvg = lines.map((l) => polyline(m, l.points, l)).join('')
  return `<g transform="${matrixAttr(m)}">${g.join('')}</g>${linesSvg}`
}

function drawEars(yaw, pitch, topVisible) {
  const up = toScreen(rotateVector([0, 1, 0], yaw, pitch))
  const across = toScreen(rotateVector([1, 0, 0], yaw, pitch))
  const len = Math.hypot(up[0], up[1])
  const width = Math.max(0.55, Math.hypot(across[0], across[1]))
  const tilt = (Math.atan2(up[0], -up[1]) * 180) / Math.PI
  return [-46, 46]
    .map((u) => {
      const [x, y] = toScreen(rotatePoint([u, H - (topVisible ? 2 : 6), -6], yaw, pitch))
      const splay = u < 0 ? -14 : 14
      return `<g transform="translate(${fmt(x)} ${fmt(y)}) rotate(${fmt(tilt + splay)}) scale(${fmt(width)} ${fmt(len)})">
        <path d="M-25 6 Q-24 -38 -5 -64 Q0 -70 5 -64 Q24 -38 25 6 Z" fill="${C.fur}" stroke="${C.outline}" stroke-width="${LINE}" stroke-linejoin="round"/>
        <path d="M-13 0 Q-12 -28 0 -48 Q12 -28 13 0 Z" fill="${C.ear}"/>
      </g>`
    })
    .join('')
}

function drawSymbol(kind) {
  if (kind === 'heart') {
    return `<path d="${heartPath(106, -214, 1.2)}" fill="${C.heart}" stroke="${C.outline}" stroke-width="3.5" stroke-linejoin="round"/>`
  }
  if (kind === 'sparkle') {
    return [[-104, -196, 12], [0, -244, 14], [104, -206, 12]]
      .map(([x, y, r]) => `<path d="${starPath(x, y, r)}" fill="${C.star}" stroke="${C.outline}" stroke-width="3" stroke-linejoin="round"/>`)
      .join('')
  }
  if (kind === 'zzz') {
    const z = (x, y, s) => `<path d="M${x} ${y} h${12 * s} l${-12 * s} ${12 * s} h${12 * s}" fill="none" stroke="${C.zzz}" stroke-width="${4 * s}" stroke-linecap="round" stroke-linejoin="round"/>`
    return z(92, -206, 1.1) + z(114, -232, 0.85)
  }
  return ''
}

// ---- sheets ----
const P = 15
const Y = 26
const DIRECTIONS = [
  { yaw: deg(-Y), pitch: deg(P), look: [-1, -1] },
  { yaw: 0, pitch: deg(P), look: [0, -1] },
  { yaw: deg(Y), pitch: deg(P), look: [1, -1] },
  { yaw: deg(-Y), pitch: 0, look: [-1, 0] },
  { yaw: 0, pitch: 0, look: [0, 0] },
  { yaw: deg(Y), pitch: 0, look: [1, 0] },
  { yaw: deg(-Y), pitch: deg(-P), look: [-1, 1] },
  { yaw: 0, pitch: deg(-P), look: [0, 1] },
  { yaw: deg(Y), pitch: deg(-P), look: [1, 1] },
]

const REACTIONS = [
  { eyes: 'closed' },
  { eyes: 'closed', symbol: 'heart' },
  { eyes: 'closed', symbol: 'sparkle' },
  { eyes: 'surprised' },
  { eyes: 'wink' },
  { eyes: 'closed', blush: 1 },
  { eyes: 'sleepy', symbol: 'zzz' },
  { eyes: 'dizzy' },
  { eyes: 'delighted', blush: 0.85 },
]

function sheet(cells) {
  const body = cells
    .map((cell, i) => {
      const x = (i % 3) * CELL + CELL / 2
      const y = Math.floor(i / 3) * CELL + GROUND_Y
      return `<g transform="translate(${x} ${y})">${drawCharacter(cell)}</g>`
    })
    .join('\n')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CELL * 3}" height="${CELL * 3}" viewBox="0 0 ${CELL * 3} ${CELL * 3}">${body}</svg>`
}

mkdirSync(OUT, { recursive: true })
for (const [name, cells] of [['directions', DIRECTIONS], ['reactions', REACTIONS]]) {
  const svg = sheet(cells)
  writeFileSync(join(OUT, `${name}.svg`), svg)
  const png = new Resvg(svg, { background: 'rgba(0,0,0,0)', fitTo: { mode: 'width', value: 1200 } }).render().asPng()
  writeFileSync(join(OUT, `${name}.png`), png)
  console.log(`${name}: ${join(OUT, name)}.svg / .png`)
}
