<template>
  <button
    v-show="visible"
    class="back-top"
    :class="{ show: visible }"
    aria-label="返回顶部"
    title="返回顶部"
    @click="toTop"
  >
    <i class="fas fa-chevron-up"></i>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > window.innerHeight * 0.8
}

function toTop() {
  const start = window.scrollY
  if (start <= 0) return
  const duration = 600
  const startTime = performance.now()
  function step(now) {
    const t = Math.min((now - startTime) / duration, 1)
    const ease = 1 - Math.pow(1 - t, 3)
    window.scrollTo(0, Math.round(start * (1 - ease)))
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.back-top {
  position: fixed;
  right: 28px;
  bottom: 28px;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid var(--border-neon);
  background: rgba(13, 18, 38, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--neon-cyan);
  font-size: 18px;
  cursor: pointer;
  z-index: 40;
  opacity: 0;
  transform: translateY(12px) scale(0.9);
  transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease,
    border-color 0.3s ease;
  box-shadow: 0 0 12px rgba(5, 217, 232, 0.25);
}
.back-top.show {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.back-top:hover {
  border-color: var(--neon-pink);
  color: var(--neon-pink);
  box-shadow: 0 0 22px rgba(255, 42, 109, 0.5);
  transform: translateY(-3px) scale(1.05);
}
.back-top:active {
  transform: translateY(0) scale(0.96);
}
@media (max-width: 600px) {
  .back-top {
    right: 16px;
    bottom: 16px;
    width: 42px;
    height: 42px;
  }
}
</style>
