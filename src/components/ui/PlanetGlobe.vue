<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{ hovering?: boolean }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const FOV = 1400
let rotY = 0
let rafId = 0
let extraVelocity = 0
let isDragging = false
let lastDragX = 0

const LAT_LINES = [-60, -30, 0, 30, 60]
const LON_STEP = 24

function render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, time: number) {
  const dpr = devicePixelRatio
  const w = canvas.width / dpr
  const h = canvas.height / dpr
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const R = Math.min(w, h) * 0.44
  const cx = w * 0.5
  const cy = h * 0.5

  const baseSpeed = props.hovering ? 0.0018 : 0.00025
  rotY += baseSpeed + extraVelocity
  extraVelocity *= 0.95

  const glow = ctx.createRadialGradient(cx * dpr, cy * dpr, 0, cx * dpr, cy * dpr, R * 1.1 * dpr)
  glow.addColorStop(0, 'rgba(128, 82, 255, 0.14)')
  glow.addColorStop(0.5, 'rgba(128, 82, 255, 0.04)')
  glow.addColorStop(1, 'rgba(128, 82, 255, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const SEG_LAT = 80
  for (const latDeg of LAT_LINES) {
    const lat = latDeg * Math.PI / 180
    const cirR = R * Math.cos(lat)
    const cirY = R * Math.sin(lat)
    const isEquator = latDeg === 0

    for (let i = 0; i < SEG_LAT; i++) {
      const a1 = (i / SEG_LAT) * Math.PI * 2 + rotY
      const a2 = ((i + 1) / SEG_LAT) * Math.PI * 2 + rotY

      const x1 = cirR * Math.cos(a1); const z1 = cirR * Math.sin(a1)
      const x2 = cirR * Math.cos(a2); const z2 = cirR * Math.sin(a2)

      const avgZ = (z1 + z2) * 0.5
      const depth = (avgZ + cirR) / (2 * cirR)
      const alpha = isEquator
        ? Math.max(0.06, 0.75 - depth * 0.65)
        : Math.max(0.04, 0.45 - depth * 0.40)

      const sc1 = FOV / (FOV + z1 + R)
      const sc2 = FOV / (FOV + z2 + R)

      ctx.beginPath()
      ctx.moveTo((cx + x1 * sc1) * dpr, (cy - cirY * sc1) * dpr)
      ctx.lineTo((cx + x2 * sc2) * dpr, (cy - cirY * sc2) * dpr)
      ctx.strokeStyle = `rgba(128, 82, 255, ${alpha})`
      ctx.lineWidth = (isEquator ? 1.1 : 0.7) * dpr
      ctx.stroke()
    }
  }

  const SEG_LON = 60
  for (let lonDeg = 0; lonDeg < 360; lonDeg += LON_STEP) {
    const lon = lonDeg * Math.PI / 180 + rotY

    for (let i = 0; i < SEG_LON; i++) {
      const lat1 = (-90 + i * 180 / SEG_LON) * Math.PI / 180
      const lat2 = (-90 + (i + 1) * 180 / SEG_LON) * Math.PI / 180

      const x1 = R * Math.cos(lat1) * Math.cos(lon)
      const y1 = R * Math.sin(lat1)
      const z1 = R * Math.cos(lat1) * Math.sin(lon)

      const x2 = R * Math.cos(lat2) * Math.cos(lon)
      const y2 = R * Math.sin(lat2)
      const z2 = R * Math.cos(lat2) * Math.sin(lon)

      const avgZ = (z1 + z2) * 0.5
      const depth = (avgZ + R) / (2 * R)
      const alpha = Math.max(0.03, 0.38 - depth * 0.34)

      const sc1 = FOV / (FOV + z1 + R)
      const sc2 = FOV / (FOV + z2 + R)

      ctx.beginPath()
      ctx.moveTo((cx + x1 * sc1) * dpr, (cy - y1 * sc1) * dpr)
      ctx.lineTo((cx + x2 * sc2) * dpr, (cy - y2 * sc2) * dpr)
      ctx.strokeStyle = `rgba(128, 82, 255, ${alpha})`
      ctx.lineWidth = 0.6 * dpr
      ctx.stroke()
    }
  }

  const pulse = 0.88 + Math.sin(time * 0.0012) * 0.12
  const ringR = R * (1.04 + Math.sin(time * 0.0008) * 0.012)
  const RING_SEGS = 100

  for (let i = 0; i < RING_SEGS; i++) {
    const a1 = (i / RING_SEGS) * Math.PI * 2 + rotY * 0.3
    const a2 = ((i + 1) / RING_SEGS) * Math.PI * 2 + rotY * 0.3
    const z1 = ringR * Math.sin(a1)
    const z2 = ringR * Math.sin(a2)
    const avgZ = (z1 + z2) * 0.5
    const depth = (avgZ + ringR) / (2 * ringR)
    const alpha = Math.max(0, (0.30 - depth * 0.28)) * pulse

    const sc1 = FOV / (FOV + z1 + R)
    const sc2 = FOV / (FOV + z2 + R)

    ctx.beginPath()
    ctx.moveTo((cx + ringR * Math.cos(a1) * sc1) * dpr, cy * dpr)
    ctx.lineTo((cx + ringR * Math.cos(a2) * sc2) * dpr, cy * dpr)
    ctx.strokeStyle = `rgba(196, 172, 255, ${alpha})`
    ctx.lineWidth = 1.2 * dpr
    ctx.stroke()
  }
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

function onPointerDown(e: PointerEvent) {
  isDragging = true
  lastDragX = e.clientX
  canvasRef.value?.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging) {
    return
  }

  const dx = e.clientX - lastDragX
  lastDragX = e.clientX
  extraVelocity += dx * 0.0009
}

function onPointerUp() {
  isDragging = false
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize, { passive: true })

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    rafId = requestAnimationFrame(loop)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="planet-globe"
    aria-hidden="true"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  />
</template>

<style scoped>
.planet-globe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}
</style>
