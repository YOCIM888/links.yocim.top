<template>
  <aside v-if="categories.length" class="rail" aria-label="分类导航">
    <button
      v-for="c in categories"
      :key="c.id"
      type="button"
      class="dot"
      :class="{ active: active === c.id }"
      :style="{ '--cc': c.color }"
      :title="c.title"
      :aria-label="c.title"
      :aria-current="active === c.id"
      @click="$emit('jump', c.id)"
    >
      <i :class="c.icon"></i>
      <span class="tip">{{ c.title }}</span>
    </button>
  </aside>
</template>

<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
  active: { type: String, default: '' },
})
defineEmits(['jump'])
</script>

<style scoped>
.rail {
  position: fixed;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 40;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 6px;
  background: var(--panel);
  border: 1px solid var(--border-neon);
  border-radius: 14px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
  max-height: 80vh;
  overflow-y: auto;
  scrollbar-width: thin;
}
.rail::-webkit-scrollbar {
  width: 4px;
}
.dot {
  position: relative;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
  color: var(--text-dim);
  cursor: pointer;
  transition: all 0.22s ease;
  flex: 0 0 auto;
}
.dot i {
  font-size: 15px;
  transition: color 0.22s ease, text-shadow 0.22s ease;
}
.dot:hover {
  color: var(--cc, var(--neon-cyan));
  border-color: color-mix(in srgb, var(--cc, #05d9e8) 45%, transparent);
  background: color-mix(in srgb, var(--cc, #05d9e8) 10%, transparent);
  transform: translateX(3px);
}
.dot:hover i {
  color: var(--cc, var(--neon-cyan));
  text-shadow: 0 0 10px color-mix(in srgb, var(--cc, #05d9e8) 70%, transparent);
}
.dot.active {
  color: var(--cc, var(--neon-cyan));
  border-color: var(--cc, var(--neon-cyan));
  background: color-mix(in srgb, var(--cc, #05d9e8) 16%, transparent);
  box-shadow: 0 0 14px color-mix(in srgb, var(--cc, #05d9e8) 45%, transparent);
}
.dot.active i {
  color: var(--cc, var(--neon-cyan));
  text-shadow: 0 0 10px color-mix(in srgb, var(--cc, #05d9e8) 80%, transparent);
}
.dot.active::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 18px;
  background: var(--cc, var(--neon-cyan));
  border-radius: 2px;
  box-shadow: 0 0 8px var(--cc, var(--neon-cyan));
}
.tip {
  position: absolute;
  left: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%) translateX(-6px);
  white-space: nowrap;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--text-main);
  background: var(--panel-solid);
  border: 1px solid var(--border-neon);
  padding: 4px 10px;
  border-radius: 6px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.dot:hover .tip {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

/* 移动端：隐藏竖向 rail，由顶部 CategoryTabs 接管 */
@media (max-width: 860px) {
  .rail {
    display: none;
  }
}
</style>
