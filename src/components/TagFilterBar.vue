<template>
  <div v-if="tag" class="filter-bar">
    <span class="label">FILTER //</span>
    <span class="chip">
      # {{ tag }}
      <button
        type="button"
        class="x"
        aria-label="清除筛选"
        @click="$emit('clear')"
      >
        <i class="fas fa-times"></i>
      </button>
    </span>
    <span class="count">{{ count }} 个结果</span>
  </div>
</template>

<script setup>
defineProps({
  tag: { type: String, default: '' },
  count: { type: Number, default: 0 },
})
defineEmits(['clear'])
</script>

<style scoped>
.filter-bar {
  max-width: 1280px;
  margin: 0 auto;
  padding: 14px 6vw;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 13px;
}
.label {
  color: var(--text-dim);
  letter-spacing: 2px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--neon-yellow);
  color: #000;
  padding: 4px 8px 4px 12px;
  border-radius: 6px;
  font-weight: 700;
  box-shadow: 0 0 12px rgba(249, 240, 2, 0.4);
}
.x {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.25);
  color: #000;
  cursor: pointer;
  font-size: 10px;
  transition: background 0.2s ease;
}
.x:hover {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
}
.count {
  color: var(--text-dim);
}
</style>
