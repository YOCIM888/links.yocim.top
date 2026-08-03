<template>
  <CyberBackground />
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
      <CategorySection
        v-for="cat in categories"
        :key="cat.id"
        :cat="cat"
      />
    </template>

    <footer class="foot">
      <p>YOCIM轻导航 · CYBER NAVIGATION SYSTEM</p>
      <p class="dim">// 赛博朋克二次元导航站 · 数据源 links.csv //</p>
    </footer>
  </main>

  <BackToTop />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import CyberBackground from './components/CyberBackground.vue'
import HeroSection from './components/HeroSection.vue'
import SearchBar from './components/SearchBar.vue'
import CategoryTabs from './components/CategoryTabs.vue'
import CategorySection from './components/CategorySection.vue'
import BackToTop from './components/BackToTop.vue'
import { useLinks } from './composables/useLinks.js'

const { categories, allLinks, loading, error } = useLinks()
const activeCat = ref('')

function jumpTo(id) {
  const el = document.getElementById('cat-' + id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeCat.value = id
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

function onKeydown(e) {
  const tag = (document.activeElement && document.activeElement.tagName) || ''
  if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
    e.preventDefault()
    const input = document.querySelector('.search-wrap input')
    if (input) {
      input.focus()
      input.closest('.search-wrap') &&
        input
          .closest('.search-wrap')
          .scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
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
