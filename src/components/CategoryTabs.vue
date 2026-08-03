<template>
  <nav v-if="categories.length" class="tabs">
    <button
      v-for="c in categories"
      :key="c.id"
      class="tab"
      :class="{ active: active === c.id }"
      @click="$emit('jump', c.id)"
    >
      <i :class="c.icon"></i>
      <span>{{ c.title }}</span>
    </button>
  </nav>
</template>

<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
  active: { type: String, default: '' },
})
defineEmits(['jump'])
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 10px 4vw;
  scrollbar-width: thin;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
}
.tab {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(13, 18, 38, 0.6);
  border: 1px solid rgba(5, 217, 232, 0.2);
  border-radius: 10px;
  color: var(--text-dim);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  scroll-snap-align: start;
  min-height: 40px;
}
.tab i {
  color: var(--neon-cyan);
  font-size: 14px;
}
.tab:hover {
  color: var(--text-main);
  border-color: var(--border-neon);
  box-shadow: 0 0 12px rgba(5, 217, 232, 0.3);
  transform: translateY(-2px);
}
.tab.active {
  color: #fff;
  border-color: var(--neon-pink);
  background: rgba(255, 42, 109, 0.12);
  box-shadow: 0 0 16px rgba(255, 42, 109, 0.4);
}
.tab.active i {
  color: var(--neon-pink);
}
/* 桌面端：隐藏顶部 tabs，由左侧 CategoryRail 接管 */
@media (min-width: 861px) {
  .tabs {
    display: none;
  }
}
</style>
