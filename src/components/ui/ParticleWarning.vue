<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{ assembled: [] }>()
const canvasRef = ref<HTMLCanvasElement | null>(null)

const COLORS = ['#8052ff', '#8052ff', '#8052ff', '#ffb829', '#15846e', '#ffffff', '#ffffff']
const SHAPES = ['triangle', 'circle', 'square'] as const
type Shape = typeof SHAPES[number]

interface Particle {
  tx: number
  ty: number
  tz: number
  ox: number
  oy: number
  oz: number
  shape: Shape
  color: string
  size: number
  drift: number
  driftPhase: number
}

let rafId = 0
let effectProgress = 0
let targetProgress = 0
let assembledEmitted = false
const PARTICLE_COUNT = 1800
const TRI_R = 0.78
const FOV = 900
const particles: Particle[] = []

const Ax = 0
const Ay = -1
const Bx = -Math.sqrt(3) / 2
const By = 0.5
const Cx = Math.sqrt(3) / 2
const Cy = 0.5

function onEdge(x0: number, y0: number, x1: number, y1: number, spread: number): [number, number] {
  const t = Math.random()
  const ex = x0 + (x1 - x0) * t
  const ey = y0 + (y1 - y0) * t
  const len = Math.hypot(x1 - x0, y1 - y0)
  const nx = -(y1 - y0) / len
  const ny = (x1 - x0) / len
  return [ex + nx * (Math.random() - 0.5) * spread, ey + ny * (Math.random() - 0.5) * spread]
}

function randomInTriangle(): [number, number] {
  const r1 = Math.sqrt(Math.random())
  const r2 = Math.random()
  return [
    (1 - r1) * Ax + r1 * (1 - r2) * Bx + r1 * r2 * Cx,
    (1 - r1) * Ay + r1 * (1 - r2) * By + r1 * r2 * Cy,
  ]
}

function createParticles() {
  particles.length = 0
  const edgeCount = Math.floor(PARTICLE_COUNT * 0.62)
  const interiorCount = PARTICLE_COUNT - edgeCount
  const perEdge = Math.floor(edgeCount / 3)
  const spread = 0.055

  const positions: Array<[number, number]> = []
  for (let i = 0; i < perEdge; i++) positions.push(onEdge(Ax, Ay, Bx, By, spread))
  for (let i = 0; i < perEdge; i++) positions.push(onEdge(Ax, Ay, Cx, Cy, spread))
  for (let i = 0; i < edgeCount - perEdge * 2; i++) positions.push(onEdge(Bx, By, Cx, Cy, spread))

  let added = 0
  while (added < interiorCount) {
    const [x, y] = randomInTriangle()
    const dc = Math.hypot(x - (Ax + Bx + Cx) / 3, y - (Ay + By + Cy) / 3)
    if (Math.random() < dc * 1.4) { positions.push([x, y]); added++ }
  }

  for (const [tx, ty] of positions) {
    const angle = Math.random() * Math.PI * 2
    const dist = 0.6 + Math.random() * 1.2
    particles.push({
      tx, ty, tz: (Math.random() - 0.5) * 0.06,
      ox: Math.cos(angle) * dist,
      oy: Math.sin(angle) * dist,
      oz: (Math.random() - 0.5) * dist,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 1.5 + Math.random() * 2.8,
      drift: Math.random() * 0.015,
      driftPhase: Math.random() * Math.PI * 2,
    })
  }
}

function drawTriangle(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath()
  ctx.moveTo(x, y - s)
  ctx.lineTo(x + s * 0.87, y + s * 0.5)
  ctx.lineTo(x - s * 0.87, y + s * 0.5)
  ctx.closePath()
  ctx.stroke()
}

function drawSquare(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.strokeRect(x - s * 0.8, y - s * 0.8, s * 1.6, s * 1.6)
}

function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath()
  ctx.arc(x, y, s * 0.7, 0, Math.PI * 2)
  ctx.stroke()
}

function render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, time: number) {
  const w = canvas.width / devicePixelRatio
  const h = canvas.height / devicePixelRatio
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const cx = w * 0.25
  const cy = h * 0.5
  const R = Math.min(w / 2, h / 2) * TRI_R

  effectProgress += (targetProgress - effectProgress) * 0.06

  if (!assembledEmitted && effectProgress > 0.85) {
    assembledEmitted = true
    emit('assembled')
  }

  const ep = effectProgress
  const smooth = ep * ep * (3 - 2 * ep)

  const projected = particles.map(p => {
    const orbitAngle = time * (0.0008 + p.drift * 0.04) + p.driftPhase
    const orb = 0.028 * smooth
    const r = 1 + Math.sin(time * 0.001 * p.drift + p.driftPhase) * 0.03 * smooth
    const lx = (p.ox + (p.tx + Math.cos(orbitAngle) * orb - p.ox) * smooth) * R * r
    const ly = (p.oy + (p.ty + Math.sin(orbitAngle) * orb - p.oy) * smooth) * R * r
    const lz = (p.oz + (p.tz - p.oz) * smooth) * R
    const sc = FOV / (FOV + lz + R)
    return { sx: cx + lx * sc, sy: cy + ly * sc, z3: lz, scale: sc, p }
  })

  projected.sort((a, b) => a.z3 - b.z3)

  for (const { sx, sy, z3, scale, p } of projected) {
    const depth = (z3 + R) / (2 * R)
    const opacity = (0.28 + depth * 0.68) * Math.sqrt(ep)
    if (opacity < 0.005) continue

    ctx.globalAlpha = opacity
    ctx.strokeStyle = p.color
    ctx.lineWidth = 1.0 * scale * devicePixelRatio

    const px = sx * devicePixelRatio
    const py = sy * devicePixelRatio
    const sz = p.size * scale * devicePixelRatio

    if (p.shape === 'triangle') {
      drawTriangle(ctx, px, py, sz)
    } else if (p.shape === 'square') {
      drawSquare(ctx, px, py, sz)
    } else {
      drawCircle(ctx, px, py, sz)
    }
  }

  ctx.globalAlpha = 1
}

function loop(time: number) {
  const canvas = canvasRef.value
  if (!canvas) { return }
  const ctx = canvas.getContext('2d')
  if (!ctx) { return }
  render(canvas, ctx, time)
  rafId = requestAnimationFrame(loop)
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) { return }
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * devicePixelRatio
  canvas.height = rect.height * devicePixelRatio
}

function onScroll() {
  const canvas = canvasRef.value
  if (!canvas) { return }
  const section = canvas.closest('section')
  if (!section) { return }
  const rect = section.getBoundingClientRect()
  const winH = window.innerHeight
  const sH = section.offsetHeight
  const visible = Math.max(0, winH - rect.top) / sH
  const past = -rect.top / sH

  if (past < 0) {
    targetProgress = Math.min(1, Math.max(0, (visible - 0.08) / 0.72))
  } else {
    targetProgress = Math.max(0, 1 - Math.max(0, past) / 0.55)
  }
}

onMounted(() => {
  createParticles()
  resize()
  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    effectProgress = 1
    targetProgress = 1
    assembledEmitted = true
    emit('assembled')
    const canvas = canvasRef.value
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      render(canvas, ctx, 0)
    }
    return
  }

  rafId = requestAnimationFrame(loop)
  onScroll()
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <canvas ref="canvasRef" class="particle-warning" aria-hidden="true" />
</template>

<style scoped>
.particle-warning {
  position: absolute;
  top: -50%;
  left: 0;
  width: 200%;
  height: 200%;
  display: block;
  pointer-events: none;
}
</style>
