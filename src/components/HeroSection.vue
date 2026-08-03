<template>
  <header class="hero">
    <div class="hero-inner">
      <div class="hero-text">
        <div class="badge">// SYSTEM ONLINE //</div>
        <h1 class="title glitch" data-text="YOCIM轻导航">YOCIM轻导航</h1>
        <p class="subtitle">{{ typed }}</p>
        <div class="stats">
          <span><b>{{ sectorCount }}</b> SECTORS</span>
          <span class="dot">·</span>
          <span><b>{{ nodeCount }}</b> NODES</span>
          <span class="dot">·</span>
          <span class="online">● ONLINE</span>
        </div>
      </div>
      <div class="hero-art">
        <img :src="heroImg" alt="cyberpunk anime" class="hero-img float" loading="eager" />
      </div>
    </div>
    <div class="grid-floor"></div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  sectorCount: { type: Number, default: 0 },
  nodeCount: { type: Number, default: 0 },
})

const heroImg =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent(
    'cyberpunk anime girl portrait, neon pink and cyan hair, futuristic techwear jacket, glowing holographic city background, rain, bokeh lights, digital painting, highly detailed, sci-fi'
  ) +
  '&image_size=portrait_4_3'

const fullText = '// CYBER NAVIGATION SYSTEM //'
const typed = ref('')
let timer = null
onMounted(() => {
  let i = 0
  timer = setInterval(() => {
    if (i <= fullText.length) {
      typed.value = fullText.slice(0, i) + (i < fullText.length ? '_' : '')
      i++
    } else {
      clearInterval(timer)
      timer = null
    }
  }, 70)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 78vh;
  display: flex;
  align-items: center;
  padding: 80px 6vw 120px;
  overflow: hidden;
}
.hero-inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  align-items: center;
}
.badge {
  display: inline-block;
  font-family: var(--font-mono);
  color: var(--neon-cyan);
  border: 1px solid var(--border-neon);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  letter-spacing: 2px;
  margin-bottom: 24px;
  background: rgba(5, 217, 232, 0.06);
}
.title {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(48px, 8vw, 104px);
  line-height: 1;
  margin: 0 0 18px;
  color: #fff;
  letter-spacing: 2px;
  text-shadow:
    0 0 8px rgba(5, 217, 232, 0.7),
    0 0 20px rgba(255, 42, 109, 0.5),
    0 0 40px rgba(211, 0, 197, 0.4);
}
.subtitle {
  font-family: var(--font-mono);
  color: var(--neon-cyan);
  font-size: clamp(14px, 1.6vw, 20px);
  letter-spacing: 3px;
  margin: 0 0 28px;
  min-height: 1.4em;
  text-shadow: 0 0 10px rgba(5, 217, 232, 0.6);
}
.stats {
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--text-dim);
  letter-spacing: 1px;
}
.stats b {
  color: var(--neon-yellow);
  font-size: 18px;
  text-shadow: 0 0 10px rgba(249, 240, 2, 0.5);
}
.stats .online {
  color: var(--neon-green);
  text-shadow: 0 0 8px rgba(57, 255, 20, 0.6);
}
.hero-art {
  display: flex;
  justify-content: center;
}
.hero-img {
  max-width: 100%;
  width: 460px;
  border-radius: 16px;
  border: 1px solid var(--border-pink);
  box-shadow:
    0 0 30px rgba(255, 42, 109, 0.35),
    0 0 80px rgba(211, 0, 197, 0.25);
  filter: saturate(1.15) contrast(1.05);
}
@media (max-width: 880px) {
  .hero-inner {
    grid-template-columns: 1fr;
  }
  .hero-art {
    display: none;
  }
  .hero {
    min-height: 60vh;
    padding-top: 100px;
  }
}
</style>
