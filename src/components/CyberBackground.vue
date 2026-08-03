<template>
  <div class="cyber-bg" aria-hidden="true">
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
let raf = null

function onMove(e) {
  if (raf) cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    if (cursorGlow.value) {
      cursorGlow.value.style.transform =
        'translate(' + e.clientX + 'px, ' + e.clientY + 'px)'
    }
  })
}

onMounted(() =>
  window.addEventListener('mousemove', onMove, { passive: true })
)
onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  if (raf) cancelAnimationFrame(raf)
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
    #1a0b2e 0%,
    var(--bg-deep) 55%,
    #04040c 100%
  );
  pointer-events: none;
}
.bg-grid {
  position: absolute;
  inset: -2px;
  background-image:
    linear-gradient(rgba(5, 217, 232, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(5, 217, 232, 0.07) 1px, transparent 1px);
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
    rgba(0, 0, 0, 0.18) 3px,
    rgba(0, 0, 0, 0) 4px
  );
  mix-blend-mode: multiply;
  pointer-events: none;
}
</style>
