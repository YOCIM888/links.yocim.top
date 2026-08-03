<template>
  <section v-if="favLinks.length" id="cat-favorites" class="section fav-section">
    <div class="head">
      <div class="head-left">
        <i class="fas fa-star cat-icon"></i>
        <div>
          <h2 class="cat-title">我的收藏</h2>
          <p class="cat-sub">YOUR FAVORITES · 本地保存</p>
        </div>
      </div>
      <button class="clear-btn" @click="clearFavs">
        <i class="fas fa-trash-alt"></i> 清空
      </button>
    </div>
    <div class="grid">
      <LinkCard
        v-for="(link, i) in favLinks"
        :key="link.url + i"
        :link="link"
        :style="{ '--i': i, animationDelay: i * 40 + 'ms' }"
        class="fade-up"
        @tag="$emit('tag', $event)"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import LinkCard from './LinkCard.vue'
import { useFavorites } from '../composables/useFavorites.js'

const props = defineProps({
  allLinks: { type: Array, default: () => [] },
})
defineEmits(['tag'])

const { favs, clearFavs } = useFavorites()

const favLinks = computed(() => {
  return favs.value
    .map((url) => props.allLinks.find((l) => l.url === url))
    .filter(Boolean)
})
</script>

<style scoped>
.section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 6vw 12px;
  scroll-margin-top: 120px;
  --cc: var(--neon-yellow);
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(249, 240, 2, 0.25);
}
.head-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.cat-icon {
  font-size: 26px;
  color: var(--neon-yellow);
  text-shadow: 0 0 12px rgba(249, 240, 2, 0.6);
}
.cat-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 24px;
  margin: 0;
  color: #fff;
  letter-spacing: 1px;
}
.cat-sub {
  margin: 2px 0 0;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--neon-yellow);
  letter-spacing: 2px;
  opacity: 0.8;
}
.clear-btn {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-dim);
  background: transparent;
  border: 1px solid rgba(122, 138, 154, 0.3);
  border-radius: 20px;
  padding: 5px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.clear-btn:hover {
  color: var(--neon-pink);
  border-color: var(--neon-pink);
  box-shadow: 0 0 10px rgba(255, 42, 109, 0.3);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}
.fade-up {
  animation: fav-fade 0.5s ease backwards;
}
@keyframes fav-fade {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .fade-up {
    animation: none;
  }
}
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
