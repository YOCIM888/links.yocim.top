<template>
  <section
    :id="'cat-' + cat.id"
    ref="el"
    class="section"
    :class="{ 'in-view': visible }"
  >
    <div class="head">
      <div class="head-left">
        <i :class="cat.icon" class="cat-icon"></i>
        <div>
          <h2 class="cat-title">{{ cat.title }}</h2>
          <p class="cat-sub">{{ cat.subtitle }}</p>
        </div>
      </div>
      <span class="count">{{ cat.links.length }} NODES</span>
    </div>
    <div class="grid">
      <LinkCard
        v-for="(link, i) in cat.links"
        :key="link.url + i"
        :link="link"
        :style="{ '--i': i }"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import LinkCard from './LinkCard.vue'

defineProps({ cat: { type: Object, required: true } })

const el = ref(null)
const visible = ref(false)
let io = null

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    visible.value = true
    return
  }
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          visible.value = true
          io.disconnect()
          io = null
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  )
  if (el.value) io.observe(el.value)
})

onUnmounted(() => {
  if (io) io.disconnect()
})
</script>

<style scoped>
.section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 6vw 24px;
  scroll-margin-top: 120px;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(5, 217, 232, 0.15);
}
.head-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.cat-icon {
  font-size: 28px;
  color: var(--neon-cyan);
  text-shadow: 0 0 12px rgba(5, 217, 232, 0.6);
}
.cat-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 26px;
  margin: 0;
  color: #fff;
  letter-spacing: 1px;
}
.cat-sub {
  margin: 2px 0 0;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--neon-pink);
  letter-spacing: 2px;
}
.count {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-dim);
  border: 1px solid rgba(5, 217, 232, 0.25);
  padding: 4px 12px;
  border-radius: 20px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

/* 卡片入场动画：opacity 用 forwards 保持终态，transform 用 backwards 不保持，
   避免 animation 覆盖 LinkCard 自身的 hover transform。 */
.grid :deep(.card) {
  opacity: 0;
}
.section.in-view .grid :deep(.card) {
  animation:
    card-fade 0.5s ease calc(min(var(--i, 0), 12) * 30ms) forwards,
    card-rise 0.5s ease calc(min(var(--i, 0), 12) * 30ms) backwards;
}
@keyframes card-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes card-rise {
  from { transform: translateY(22px); }
  to   { transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .grid :deep(.card) {
    opacity: 1;
  }
  .section.in-view .grid :deep(.card) {
    animation: none;
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
