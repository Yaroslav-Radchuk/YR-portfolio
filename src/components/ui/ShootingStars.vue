<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

interface Star {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  tailLen: number
  speed: number
}

const stars: Star[] = []
let rafId = 0
let initialized = false
let nextSpawnAt = 0

function spawn(w: number, h: number) {
  const angle = (22 + Math.random() * 28) * Math.PI / 180
  const speed = (w / 1920) * (7 + Math.random() * 11)
  const edge = Math.random()
  let x: number
  let y: number

  if (edge < 0.55) {
    x = Math.random() * w * 0.75
    y = -40
  } else {
    x = -40
    y = Math.random() * h * 0.55
  }

  stars.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 0,
    maxLife: 50 + Math.random() * 45,
    tailLen: 80 + Math.random() * 100,
    speed,
  })
}

function loop(time: number) {
  const canvas = canvasRef.value

  if (!canvas) {
    return
  }

  const dpr = devicePixelRatio
  const w = canvas.width / dpr
  const h = canvas.height / dpr
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (!initialized) {
    initialized = true
    nextSpawnAt = time + 400 + Math.random() * 600
  }

  if (time >= nextSpawnAt && stars.length < 5) {
    spawn(w, h)
    nextSpawnAt = time + 2000 + Math.random() * 3000
  }

  for (let i = stars.length - 1; i >= 0; i--) {
    const s = stars[i]
    s.x += s.vx
    s.y += s.vy
    s.life++

    if (s.life > s.maxLife || s.x > w + 60 || s.y > h + 60) {
      stars.splice(i, 1)
      continue
    }

    const t = s.life / s.maxLife
    const opacity = Math.sin(t * Math.PI) * 0.85

    const tx = s.x - (s.vx / s.speed) * s.tailLen
    const ty = s.y - (s.vy / s.speed) * s.tailLen

    const grad = ctx.createLinearGradient(tx * dpr, ty * dpr, s.x * dpr, s.y * dpr)
    grad.addColorStop(0, 'rgba(255,255,255,0)')
    grad.addColorStop(0.55, `rgba(210,190,255,${opacity * 0.35})`)
    grad.addColorStop(1, `rgba(255,255,255,${opacity})`)

    ctx.beginPath()
    ctx.moveTo(tx * dpr, ty * dpr)
    ctx.lineTo(s.x * dpr, s.y * dpr)
    ctx.strokeStyle = grad
    ctx.lineWidth = 1.4 * dpr
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(s.x * dpr, s.y * dpr, 1.8 * dpr, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${opacity})`
    ctx.fill()
  }

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

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduced) {
    return
  }

  resize()
  window.addEventListener('resize', resize, { passive: true })
  rafId = requestAnimationFrame(loop)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas ref="canvasRef" class="shooting-stars" aria-hidden="true" />
</template>

<style scoped>
.shooting-stars {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style>
