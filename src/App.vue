<template>
  <CyberBackground />
  <CategoryRail
    :categories="categories"
    :active="activeCat"
    @jump="jumpTo"
  />
  <main>
    <HeroSection
      :sector-count="categories.length"
      :node-count="allLinks.length"
    />
    <SearchBar :all-links="allLinks" />
    <CategoryTabs
      :categories="categories"
      :active="activeCat"
      @jump="jumpTo"
    />

    <div v-if="loading" class="skeleton-wrap">
      <div v-for="n in 3" :key="n" class="skel-section">
        <div class="skel-head">
          <div class="skel-icon"></div>
          <div class="skel-line w40"></div>
          <div class="skel-line w20 skel-ml"></div>
        </div>
        <div class="skel-grid">
          <div v-for="m in 8" :key="m" class="skel-card"></div>
        </div>
      </div>
    </div>
    <div v-else-if="error" class="error">ERROR: {{ error }}</div>
    <template v-else>
      <FavoritesSection :all-links="allLinks" @tag="onTag" />
      <TagFilterBar
        :tag="activeTag"
        :count="filteredCount"
        @clear="clearTag"
      />
      <CategorySection
        v-for="cat in categories"
        :key="cat.id"
        :cat="cat"
        :active-tag="activeTag"
        @tag="onTag"
      />
    </template>

    <footer class="foot">
      <p>YOCIM轻导航 · CYBER NAVIGATION SYSTEM</p>
      <p class="dim">// 赛博朋克二次元导航站 · 数据源 links.csv //</p>
    </footer>
  </main>

  <ShortcutsHelp :show="showHelp" @close="showHelp = false" />
  <button
    type="button"
    class="help-btn"
    aria-label="快捷键帮助"
    title="快捷键 (?)"
    @click="showHelp = !showHelp"
  >
    <i class="fas fa-keyboard"></i>
  </button>
  <ThemeSwitch />
  <BackToTop />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CyberBackground from './components/CyberBackground.vue'
import HeroSection from './components/HeroSection.vue'
import SearchBar from './components/SearchBar.vue'
import CategoryTabs from './components/CategoryTabs.vue'
import CategoryRail from './components/CategoryRail.vue'
import CategorySection from './components/CategorySection.vue'
import FavoritesSection from './components/FavoritesSection.vue'
import TagFilterBar from './components/TagFilterBar.vue'
import ShortcutsHelp from './components/ShortcutsHelp.vue'
import BackToTop from './components/BackToTop.vue'
import ThemeSwitch from './components/ThemeSwitch.vue'
import { useLinks } from './composables/useLinks.js'

const { categories, allLinks, loading, error } = useLinks()
const activeCat = ref('')
const activeTag = ref('')
const showHelp = ref(false)

const filteredCount = computed(() => {
  if (!activeTag.value) return 0
  return allLinks.value.filter((l) => l.tag === activeTag.value).length
})

function jumpTo(id) {
  const el = document.getElementById('cat-' + id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeCat.value = id
}

function onTag(t) {
  activeTag.value = activeTag.value === t ? '' : t
}

function clearTag() {
  activeTag.value = ''
}

function onScroll() {
  const sections = document.querySelectorAll('section[id^="cat-"]')
  if (!sections.length) return
  const y = window.scrollY + 160
  let cur = ''
  for (const s of sections) {
    if (s.offsetTop <= y) cur = s.id.replace('cat-', '')
  }
  if (cur) activeCat.value = cur
}

function focusSearch() {
  const input = document.querySelector('.search-wrap input')
  if (input) {
    input.focus()
    input.closest('.search-wrap') &&
      input
        .closest('.search-wrap')
        .scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function onKeydown(e) {
  const tag = (document.activeElement && document.activeElement.tagName) || ''
  const inField = tag === 'INPUT' || tag === 'TEXTAREA'

  if (e.key === 'Escape') {
    if (showHelp.value) {
      showHelp.value = false
    }
    return
  }

  if (e.code === 'Slash' && !inField) {
    e.preventDefault()
    if (e.shiftKey) {
      showHelp.value = !showHelp.value
    } else {
      focusSearch()
    }
    return
  }

  if (!inField && /^[1-9]$/.test(e.key)) {
    const idx = Number(e.key) - 1
    const cat = categories.value[idx]
    if (cat) jumpTo(cat.id)
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
main {
  padding-left: 0;
}
@media (min-width: 861px) {
  main {
    padding-left: 78px;
  }
}
.help-btn {
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 45;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid var(--border-neon);
  background: var(--panel);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--neon-cyan);
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(5, 217, 232, 0.25);
  transition: all 0.2s ease;
}
.help-btn:hover {
  border-color: var(--neon-pink);
  color: var(--neon-pink);
  box-shadow: 0 0 18px rgba(255, 42, 109, 0.4);
  transform: translateY(-2px);
}
@media (max-width: 860px) {
  .help-btn {
    left: 12px;
    bottom: 12px;
    width: 40px;
    height: 40px;
  }
}
.error {
  text-align: center;
  padding: 60px 20px;
  font-family: var(--font-mono);
  font-size: 16px;
  letter-spacing: 3px;
  color: var(--neon-pink);
}
.foot {
  text-align: center;
  padding: 60px 20px 40px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-dim);
  border-top: 1px solid rgba(5, 217, 232, 0.12);
  margin-top: 40px;
}
.foot .dim {
  color: rgba(122, 138, 154, 0.6);
  font-size: 11px;
  margin-top: 6px;
}

/* 骨架屏 */
.skeleton-wrap {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 6vw 24px;
}
.skel-section {
  margin-bottom: 48px;
}
.skel-head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(5, 217, 232, 0.12);
}
.skel-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    rgba(5, 217, 232, 0.08),
    rgba(5, 217, 232, 0.18),
    rgba(5, 217, 232, 0.08)
  );
  background-size: 200% 100%;
  animation: skel-shimmer 1.4s infinite;
}
.skel-line {
  height: 14px;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(5, 217, 232, 0.08),
    rgba(5, 217, 232, 0.2),
    rgba(5, 217, 232, 0.08)
  );
  background-size: 200% 100%;
  animation: skel-shimmer 1.4s infinite;
}
.skel-line.w40 {
  width: 180px;
}
.skel-line.w20 {
  width: 90px;
}
.skel-ml {
  margin-left: auto;
}
.skel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}
.skel-card {
  height: 130px;
  border-radius: 10px;
  border: 1px solid rgba(5, 217, 232, 0.12);
  background: linear-gradient(
    90deg,
    rgba(13, 18, 38, 0.6),
    rgba(5, 217, 232, 0.1),
    rgba(13, 18, 38, 0.6)
  );
  background-size: 200% 100%;
  animation: skel-shimmer 1.4s infinite;
}
@keyframes skel-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
@media (max-width: 600px) {
  .skel-grid {
    grid-template-columns: 1fr;
  }
}
</style>
