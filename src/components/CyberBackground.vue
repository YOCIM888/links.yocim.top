<template>
  <div class="cyber-bg" aria-hidden="true">
    <canvas ref="canvas" class="bg-particles"></canvas>
    <div class="bg-grid"></div>
    <div class="bg-glow glow-1"></div>
    <div class="bg-glow glow-2"></div>
    <div ref="cursorGlow" class="cursor-glow"></div>
    <div class="bg-noise"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const cursorGlow = ref(null)
const canvas = ref(null)
let raf = null
let pRaf = null
let particles = []
let ctx = null
let running = true

function onMove(e) {
  if (raf) cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    if (cursorGlow.value) {
      cursorGlow.value.style.transform =
        'translate(' + e.clientX + 'px, ' + e.clientY + 'px)'
    }
  })
}

function getThemeColors() {
  const cs = getComputedStyle(document.documentElement)
  const pick = (n) => cs.getPropertyValue(n).trim()
  return [
    pick('--neon-cyan') || '#05d9e8',
    pick('--neon-pink') || '#ff2a6d',
    pick('--neon-purple') || '#d300c5',
  ]
}

function resize() {
  if (!canvas.value) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.value.width = window.innerWidth * dpr
  canvas.value.height = window.innerHeight * dpr
  canvas.value.style.width = window.innerWidth + 'px'
  canvas.value.style.height = window.innerHeight + 'px'
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  spawn()
}

function spawn() {
  if (!canvas.value) return
  const w = window.innerWidth
  const h = window.innerHeight
  const count = Math.min(90, Math.floor((w * h) / 16000))
  const colors = getThemeColors()
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    r: Math.random() * 1.8 + 0.4,
    a: Math.random() * 0.5 + 0.15,
    c: colors[Math.floor(Math.random() * colors.length)],
    tw: Math.random() * Math.PI * 2,
  }))
}

function tick() {
  if (!running || !ctx) return
  const w = window.innerWidth
  const h = window.innerHeight
  ctx.clearRect(0, 0, w, h)
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    p.tw += 0.02
    if (p.x < -10) p.x = w + 10
    else if (p.x > w + 10) p.x = -10
    if (p.y < -10) p.y = h + 10
    else if (p.y > h + 10) p.y = -10
    const flick = 0.6 + Math.sin(p.tw) * 0.4
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = p.c
    ctx.globalAlpha = p.a * flick
    ctx.shadowBlur = 8
    ctx.shadowColor = p.c
    ctx.fill()
  }
  ctx.globalAlpha = 1
  ctx.shadowBlur = 0
  pRaf = requestAnimationFrame(tick)
}

onMounted(() => {
  window.addEventListener('mousemove', onMove, { passive: true })
  if (canvas.value) {
    ctx = canvas.value.getContext('2d')
    resize()
    window.addEventListener('resize', resize, { passive: true })
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (!reduce) {
      pRaf = requestAnimationFrame(tick)
    } else {
      running = false
    }
  }
})
onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('resize', resize)
  if (raf) cancelAnimationFrame(raf)
  if (pRaf) cancelAnimationFrame(pRaf)
  running = false
})
</script>

<style scoped>
.cyber-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background: radial-gradient(
    ellipse at 50% 0%,
    var(--bg-radial-top, #1a0b2e) 0%,
    var(--bg-deep) 55%,
    var(--bg-radial-end, #04040c) 100%
  );
  pointer-events: none;
}
.bg-particles {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.9;
}
.bg-grid {
  position: absolute;
  inset: -2px;
  background-image:
    linear-gradient(var(--grid-line, rgba(5, 217, 232, 0.07)) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line, rgba(5, 217, 232, 0.07)) 1px, transparent 1px);
  background-size: 44px 44px;
  animation: bg-drift 30s linear infinite;
}
@keyframes bg-drift {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(44px, 44px); }
}
.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
}
.glow-1 {
  width: 480px;
  height: 480px;
  background: var(--neon-purple);
  top: -120px;
  left: -120px;
  animation: float 14s ease-in-out infinite;
}
.glow-2 {
  width: 520px;
  height: 520px;
  background: var(--neon-cyan);
  bottom: -160px;
  right: -140px;
  animation: float 18s ease-in-out infinite reverse;
}
.cursor-glow {
  position: absolute;
  top: -180px;
  left: -180px;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(5, 217, 232, 0.14),
    rgba(255, 42, 109, 0.06) 40%,
    transparent 70%
  );
  pointer-events: none;
  transition: transform 0.18s ease-out;
  will-change: transform;
}
.bg-noise {
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.cyber-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0px,
    rgba(0, 0, 0, 0) 2px,
    rgba(0, 0, 0, var(--scanline-strength, 0.18)) 3px,
    rgba(0, 0, 0, 0) 4px
  );
  mix-blend-mode: multiply;
  pointer-events: none;
}
</style>
