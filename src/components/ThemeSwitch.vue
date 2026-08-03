<template>
  <div class="theme-switch">
    <button
      v-for="t in themes"
      :key="t"
      type="button"
      class="ts-btn"
      :class="{ on: theme === t }"
      :title="themeMeta[t].label + ' 主题'"
      :aria-label="themeMeta[t].label + ' 主题'"
      :aria-pressed="theme === t"
      @click="setTheme(t)"
    >
      <i :class="themeMeta[t].icon"></i>
      <span class="ts-label">{{ themeMeta[t].label }}</span>
    </button>
  </div>
</template>

<script setup>
import { useTheme } from '../composables/useTheme.js'

const { theme, themes, themeMeta, setTheme } = useTheme()
</script>

<style scoped>
.theme-switch {
  position: fixed;
  right: 20px;
  bottom: 84px;
  z-index: 45;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background: var(--panel);
  border: 1px solid var(--border-neon);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}
.ts-btn {
  width: 44px;
  height: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--text-dim);
  cursor: pointer;
  transition: all 0.2s ease;
}
.ts-btn i {
  font-size: 15px;
}
.ts-label {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.5px;
}
.ts-btn:hover {
  color: var(--text-main);
  border-color: var(--border-neon);
  background: rgba(5, 217, 232, 0.06);
}
.ts-btn.on {
  color: var(--neon-cyan);
  border-color: var(--neon-cyan);
  background: rgba(5, 217, 232, 0.12);
  box-shadow: 0 0 12px rgba(5, 217, 232, 0.4);
}
.ts-btn.on i {
  text-shadow: 0 0 8px rgba(5, 217, 232, 0.7);
}
@media (max-width: 600px) {
  .theme-switch {
    right: 12px;
    bottom: 76px;
    padding: 6px;
    gap: 6px;
  }
  .ts-btn {
    width: 38px;
    height: 38px;
  }
  .ts-label {
    display: none;
  }
}
</style>
