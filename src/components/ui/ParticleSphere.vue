<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

const COLORS = ['#8052ff', '#8052ff', '#8052ff', '#ffb829', '#15846e', '#ffffff', '#ffffff']
const SHAPES = ['triangle', 'circle', 'square'] as const
type Shape = typeof SHAPES[number]

interface Particle {
  theta: number
  phi: number
  r: number
  shape: Shape
  color: string
  size: number
  drift: number
  driftPhase: number
  svx: number
  svy: number
  svz: number
}

let rafId = 0
let rotY = 0
let scatterProgress = 0
const PARTICLE_COUNT = 2200
const SPHERE_R = 0.42
const FOV = 900
const particles: Particle[] = []

function createParticles() {
  particles.length = 0
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    const nx = Math.sin(phi) * Math.cos(theta)
    const ny = Math.cos(phi)
    const nz = Math.sin(phi) * Math.sin(theta)
    const speed = 0.8 + Math.random() * 1.8
    particles.push({
      theta,
      phi,
      r: 1 + (Math.random() - 0.5) * 0.1,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 1.5 + Math.random() * 2.5,
      drift: Math.random() * 0.015,
      driftPhase: Math.random() * Math.PI * 2,
      svx: nx * speed + (Math.random() - 0.5) * 0.4,
      svy: ny * speed + (Math.random() - 0.5) * 0.4,
      svz: nz * speed + (Math.random() - 0.5) * 0.4,
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

  const cx = w * 0.5
  const cy = h * 0.5
  const R = Math.min(w, h) * SPHERE_R / 1.5

  rotY += 0.0008

  const ease = scatterProgress * scatterProgress
  const scatter = ease * R * 5

  const projected = particles.map((p, i) => {
    const r = R * p.r + Math.sin(time * 0.001 * p.drift + p.driftPhase) * R * 0.03
    const x3 = r * Math.sin(p.phi) * Math.cos(p.theta + rotY) + p.svx * scatter
    const y3 = r * Math.cos(p.phi) + p.svy * scatter
    const z3 = r * Math.sin(p.phi) * Math.sin(p.theta + rotY) + p.svz * scatter
    const scale = FOV / (FOV + z3 + R)
    return { sx: cx + x3 * scale, sy: cy + y3 * scale, z3, scale, p, i }
  })

  projected.sort((a, b) => a.z3 - b.z3)

  for (const { sx, sy, z3, scale, p } of projected) {
    const depth = (z3 + R) / (2 * R)
    const baseOpacity = 0.28 + depth * 0.68
    const opacity = baseOpacity * (1 - ease * 0.95)

    if (opacity < 0.005) {
      continue
    }

    const size = p.size * scale * devicePixelRatio

    ctx.globalAlpha = opacity
    ctx.strokeStyle = p.color
    ctx.lineWidth = 1.0 * scale * devicePixelRatio

    const px = sx * devicePixelRatio
    const py = sy * devicePixelRatio

    if (p.shape === 'triangle') {
      drawTriangle(ctx, px, py, size)
    } else if (p.shape === 'square') {
      drawSquare(ctx, px, py, size)
    } else {
      drawCircle(ctx, px, py, size)
    }
  }

  ctx.globalAlpha = 1
}

function loop(time: number) {
  const canvas = canvasRef.value

  if (!canvas) {
    return
  }

  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return
  }

  render(canvas, ctx, time)
  rafId = requestAnimationFrame(loop)
}

function resize() {
  const canvas = canvasRef.value

  if (!canvas) {
    return
  }

  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * devicePixelRatio
  canvas.height = rect.height * devicePixelRatio
}

function onScroll() {
  const canvas = canvasRef.value

  if (!canvas) {
    return
  }

  const hero = canvas.closest('section')

  if (!hero) {
    return
  }

  const rect = hero.getBoundingClientRect()
  const winH = window.innerHeight
  scatterProgress = Math.max(0, Math.min(1, (-rect.top / winH) * 1.3))
}

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  createParticles()
  resize()
  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })

  if (reduced) {
    const canvas = canvasRef.value
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      render(canvas, ctx, 0)
    }
  } else {
    rafId = requestAnimationFrame(loop)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <canvas ref="canvasRef" class="particle-sphere" aria-hidden="true" />
</template>

<style scoped>
.particle-sphere {
  position: absolute;
  top: -25%;
  left: -25%;
  width: 150%;
  height: 150%;
  display: block;
  pointer-events: none;
}
</style>
