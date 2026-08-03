<template>
  <article
    ref="cardEl"
    class="card"
    tabindex="0"
    role="link"
    :aria-label="link.name + '（新标签页打开）'"
    :style="{ '--cc': link.color, '--rx': rx, '--ry': ry }"
    @click="openLink"
    @keydown.enter="openLink"
    @mousemove="onTilt"
    @mouseleave="resetTilt"
  >
    <span class="sweep"></span>
    <div class="top-row">
      <div class="icon-wrap">
        <i :class="link.icon"></i>
      </div>
      <button
        type="button"
        class="fav"
        :class="{ on: fav }"
        :aria-label="fav ? '取消收藏' : '收藏'"
        :title="fav ? '取消收藏' : '收藏'"
        @click.stop="toggleFav(link.url)"
      >
        <i :class="fav ? 'fas fa-star' : 'far fa-star'"></i>
      </button>
    </div>
    <div class="name">{{ link.name }}</div>
    <div class="desc">{{ link.desc }}</div>
    <button
      v-if="link.tag"
      type="button"
      class="tag"
      @click.stop="$emit('tag', link.tag)"
    >
      # {{ link.tag }}
    </button>
  </article>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useFavorites } from '../composables/useFavorites.js'

const props = defineProps({ link: { type: Object, required: true } })
defineEmits(['tag'])

const { isFav, toggleFav } = useFavorites()
const fav = computed(() => isFav(props.link.url))

function openLink() {
  window.open(props.link.url, '_blank', 'noopener,noreferrer')
}

const cardEl = ref(null)
const rx = ref('0deg')
const ry = ref('0deg')
let tiltRaf = null
let tiltEnabled = true

function onTilt(e) {
  if (!tiltEnabled) return
  if (tiltRaf) cancelAnimationFrame(tiltRaf)
  tiltRaf = requestAnimationFrame(() => {
    const el = cardEl.value
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.value = (px * 12).toFixed(2) + 'deg'
    rx.value = (-py * 12).toFixed(2) + 'deg'
  })
}

function resetTilt() {
  if (tiltRaf) cancelAnimationFrame(tiltRaf)
  rx.value = '0deg'
  ry.value = '0deg'
}

onMounted(() => {
  tiltEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
onUnmounted(() => {
  if (tiltRaf) cancelAnimationFrame(tiltRaf)
})
</script>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 16px 14px;
  background: linear-gradient(160deg, rgba(13, 18, 38, 0.85), rgba(7, 7, 19, 0.9));
  border: 1px solid color-mix(in srgb, var(--cc, #05d9e8) 25%, transparent);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transform: translateY(var(--ty, 0)) perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transform-style: preserve-3d;
  transition: transform 0.18s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  will-change: transform;
}
.card:hover {
  --ty: -6px;
  border-color: var(--cc, var(--neon-cyan));
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.55),
    0 0 22px color-mix(in srgb, var(--cc, #05d9e8) 50%, transparent);
}
.card:focus-visible {
  outline: none;
  border-color: var(--cc, var(--neon-cyan));
  box-shadow:
    0 0 0 2px color-mix(in srgb, var(--cc, #05d9e8) 60%, transparent),
    0 12px 30px rgba(0, 0, 0, 0.55),
    0 0 22px color-mix(in srgb, var(--cc, #05d9e8) 50%, transparent);
}
.sweep {
  position: absolute;
  top: 0;
  left: -120%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    100deg,
    transparent,
    color-mix(in srgb, var(--cc, #05d9e8) 22%, transparent),
    transparent
  );
  transform: skewX(-20deg);
  transition: left 0.6s ease;
  pointer-events: none;
}
.card:hover .sweep {
  left: 130%;
}
.top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.icon-wrap {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: color-mix(in srgb, var(--cc, #05d9e8) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--cc, #05d9e8) 32%, transparent);
  color: var(--cc, var(--neon-cyan));
  font-size: 18px;
  transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
}
.card:hover .icon-wrap {
  transform: scale(1.08);
  background: color-mix(in srgb, var(--cc, #05d9e8) 22%, transparent);
  border-color: var(--cc, var(--neon-cyan));
}
.fav {
  flex: 0 0 auto;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-dim);
  font-size: 14px;
  cursor: pointer;
  opacity: 0.55;
  transition: all 0.2s ease;
}
.card:hover .fav {
  opacity: 1;
}
.fav:hover {
  color: var(--neon-yellow);
  border-color: rgba(249, 240, 2, 0.4);
  background: rgba(249, 240, 2, 0.08);
}
.fav.on {
  opacity: 1;
  color: var(--neon-yellow);
  text-shadow: 0 0 8px rgba(249, 240, 2, 0.7);
}
.name {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 15px;
  color: var(--text-main);
  letter-spacing: 0.5px;
}
.desc {
  font-size: 12px;
  color: var(--text-dim);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.tag {
  margin-top: auto;
  align-self: flex-start;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--neon-yellow);
  opacity: 0.85;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 2px 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.tag:hover {
  opacity: 1;
  color: #000;
  background: var(--neon-yellow);
  box-shadow: 0 0 8px rgba(249, 240, 2, 0.5);
}
</style>
