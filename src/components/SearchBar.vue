<template>
  <div class="search-wrap">
    <div class="search-box panel scanlines">
      <i class="fas fa-search s-ico"></i>
      <input
        ref="inputEl"
        v-model="query"
        type="text"
        class="input"
        placeholder="搜索站点资源…  (按 / 快速聚焦)"
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

    <!-- 结果下拉 -->
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
        <i :class="item.icon" class="i-ico" :style="{ color: item.color }"></i>
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

    <!-- 空状态 -->
    <div
      v-else-if="focused && query.trim()"
      class="dropdown empty panel"
    >
      <i class="fas fa-ghost"></i>
      <div>
        <div class="empty-main">NO MATCH FOUND</div>
        <div class="empty-sub">试试热门标签，或按 Esc 清除</div>
      </div>
    </div>

    <!-- 历史 / 热门（聚焦且空查询） -->
    <div
      v-else-if="focused && !query.trim() && (history.length || hotTags.length)"
      class="dropdown panel suggest"
    >
      <div v-if="history.length" class="sec">
        <div class="sec-head">
          <span class="sec-title"><i class="fas fa-clock-rotate-left"></i> 历史</span>
          <button class="sec-clear" @mousedown.prevent="clearHistory">清空</button>
        </div>
        <div class="chips">
          <button
            v-for="h in history"
            :key="h"
            class="chip hist"
            @mousedown.prevent="fillQuery(h)"
          >
            <span>{{ h }}</span>
            <i
              class="fas fa-times x"
              @mousedown.prevent.stop="removeHistory(h)"
            ></i>
          </button>
        </div>
      </div>
      <div v-if="hotTags.length" class="sec">
        <div class="sec-head">
          <span class="sec-title"><i class="fas fa-fire"></i> 热门标签</span>
        </div>
        <div class="chips">
          <button
            v-for="t in hotTags"
            :key="t"
            class="chip hot"
            @mousedown.prevent="fillQuery(t)"
          >
            # {{ t }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, toRef } from 'vue'
import { useSearch } from '../composables/useSearch.js'

const props = defineProps({
  allLinks: { type: Array, default: () => [] },
})

const inputEl = ref(null)
const focused = ref(false)
const allLinksRef = toRef(props, 'allLinks')

const {
  query,
  results,
  activeIndex,
  history,
  highlight,
  clear,
  onKeydown,
  select,
  removeHistory,
  clearHistory,
} = useSearch(allLinksRef)

const hotTags = computed(() => {
  const counts = {}
  for (const l of allLinksRef.value) {
    const t = (l.tag || '').trim()
    if (t) counts[t] = (counts[t] || 0) + 1
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([t]) => t)
})

function fillQuery(q) {
  query.value = q
  if (inputEl.value) inputEl.value.focus()
}

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
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px;
  color: var(--text-dim);
  font-family: var(--font-mono);
  letter-spacing: 1px;
}
.empty > i {
  color: var(--neon-purple);
  font-size: 22px;
  text-shadow: 0 0 10px rgba(211, 0, 197, 0.6);
}
.empty-main {
  font-size: 14px;
  letter-spacing: 2px;
  color: var(--text-main);
}
.empty-sub {
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 4px;
  letter-spacing: 0;
}

/* 历史 / 热门 */
.suggest {
  padding: 12px;
}
.sec {
  padding: 6px 4px;
}
.sec + .sec {
  border-top: 1px solid rgba(5, 217, 232, 0.1);
  margin-top: 8px;
  padding-top: 12px;
}
.sec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.sec-title {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--neon-cyan);
  letter-spacing: 2px;
}
.sec-title i {
  margin-right: 5px;
}
.sec-clear {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-dim);
  background: transparent;
  border: none;
  cursor: pointer;
}
.sec-clear:hover {
  color: var(--neon-pink);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-body);
  font-size: 13px;
  padding: 5px 12px;
  border-radius: 16px;
  cursor: pointer;
  border: 1px solid rgba(5, 217, 232, 0.25);
  background: rgba(5, 217, 232, 0.06);
  color: var(--text-main);
  transition: all 0.2s ease;
}
.chip:hover {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 10px rgba(5, 217, 232, 0.3);
  transform: translateY(-1px);
}
.chip.hot {
  border-color: rgba(255, 42, 109, 0.3);
  background: rgba(255, 42, 109, 0.08);
  color: var(--neon-pink);
}
.chip.hot:hover {
  border-color: var(--neon-pink);
  box-shadow: 0 0 10px rgba(255, 42, 109, 0.4);
}
.chip .x {
  font-size: 9px;
  opacity: 0.5;
  padding: 2px;
}
.chip .x:hover {
  opacity: 1;
  color: var(--neon-pink);
}
</style>
