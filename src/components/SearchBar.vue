<template>
  <div class="search-wrap">
    <div class="search-box panel scanlines">
      <i class="fas fa-search s-ico"></i>
      <input
        ref="inputEl"
        v-model="query"
        type="text"
        class="input"
        placeholder="搜索站点资源…"
        role="combobox"
        :aria-expanded="results.length > 0"
        aria-controls="search-list"
        autocomplete="off"
        spellcheck="false"
        @keydown="onKeydown"
        @focus="focused = true"
        @blur="onBlur"
      />
      <button v-if="query" class="clear" aria-label="清除" @click="clear">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <ul
      v-if="focused && results.length"
      id="search-list"
      class="dropdown panel"
      role="listbox"
    >
      <li
        v-for="(item, i) in results"
        :key="item.url + i"
        class="item"
        :class="{ active: i === activeIndex }"
        role="option"
        :aria-selected="i === activeIndex"
        @mousedown.prevent="select(i)"
        @mouseenter="activeIndex = i"
      >
        <i :class="item.icon" class="i-ico"></i>
        <div class="info">
          <div class="i-name" v-html="highlight(item.name, query)"></div>
          <div class="i-desc" v-html="highlight(item.desc, query)"></div>
        </div>
        <div class="meta">
          <span class="cat-badge">{{ item.categoryTitle }}</span>
          <span v-if="item.tag" class="i-tag">#{{ item.tag }}</span>
        </div>
      </li>
      <li class="hint">
        <span>↑↓ 导航</span><span>Enter 打开</span><span>Esc 清除</span>
      </li>
    </ul>
    <div
      v-else-if="focused && query.trim()"
      class="dropdown empty panel"
    >
      <i class="fas fa-ghost"></i> NO MATCH FOUND
    </div>
  </div>
</template>

<script setup>
import { ref, toRef } from 'vue'
import { useSearch } from '../composables/useSearch.js'

const props = defineProps({
  allLinks: { type: Array, default: () => [] },
})

const inputEl = ref(null)
const focused = ref(false)
const allLinksRef = toRef(props, 'allLinks')

const { query, results, activeIndex, highlight, clear, onKeydown, select } =
  useSearch(allLinksRef)

function onBlur() {
  setTimeout(() => {
    focused.value = false
  }, 160)
}
</script>

<style scoped>
.search-wrap {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 12px 6vw;
  background: linear-gradient(
    to bottom,
    rgba(7, 7, 19, 0.95),
    rgba(7, 7, 19, 0.7)
  );
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  max-width: 720px;
  margin: 0 auto;
  height: 52px;
  border-radius: 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.search-box:focus-within {
  border-color: var(--neon-cyan);
  box-shadow:
    0 0 0 1px var(--neon-cyan),
    0 0 20px rgba(5, 217, 232, 0.4);
}
.s-ico {
  color: var(--neon-cyan);
  font-size: 16px;
  text-shadow: 0 0 8px rgba(5, 217, 232, 0.6);
}
.input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-main);
  font-family: var(--font-body);
  font-size: 16px;
  letter-spacing: 0.5px;
  height: 100%;
}
.input::placeholder {
  color: var(--text-dim);
}
.clear {
  background: transparent;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  font-size: 14px;
  padding: 4px 6px;
  border-radius: 6px;
  transition: color 0.2s ease;
}
.clear:hover {
  color: var(--neon-pink);
}
.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: min(720px, 92vw);
  list-style: none;
  margin: 0;
  padding: 6px;
  max-height: 60vh;
  overflow-y: auto;
  z-index: 60;
}
.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: background 0.15s ease;
}
.item.active {
  background: linear-gradient(
    90deg,
    rgba(255, 42, 109, 0.18),
    rgba(5, 217, 232, 0.12)
  );
}
.item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: var(--neon-pink);
  box-shadow: 0 0 10px var(--neon-pink);
  border-radius: 2px;
}
.i-ico {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(5, 217, 232, 0.1);
  color: var(--neon-cyan);
  font-size: 15px;
}
.info {
  flex: 1;
  min-width: 0;
}
.i-name {
  font-weight: 700;
  font-size: 14px;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.i-desc {
  font-size: 12px;
  color: var(--text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}
.cat-badge {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--neon-cyan);
  border: 1px solid rgba(5, 217, 232, 0.3);
  padding: 2px 8px;
  border-radius: 10px;
  white-space: nowrap;
}
.i-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--neon-yellow);
}
.hint {
  display: flex;
  justify-content: space-around;
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-dim);
  border-top: 1px solid rgba(5, 217, 232, 0.12);
  margin-top: 4px;
}
.empty {
  text-align: center;
  padding: 22px;
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 14px;
  letter-spacing: 2px;
}
.empty i {
  color: var(--neon-purple);
  margin-right: 8px;
}
</style>
