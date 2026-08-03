import { ref, watch } from 'vue'

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeReg(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const HISTORY_KEY = 'yocim-search-history'

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []
  } catch {
    return []
  }
}

const history = ref(loadHistory())
let histInited = false
function initHistPersist() {
  if (histInited) return
  histInited = true
  watch(
    history,
    (v) => {
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(v))
      } catch {
        /* 忽略写入失败 */
      }
    },
    { deep: true }
  )
}

function recordHistory(q) {
  const kw = (q || '').trim()
  if (!kw) return
  history.value = [kw, ...history.value.filter((h) => h !== kw)].slice(0, 8)
}

function removeHistory(q) {
  history.value = history.value.filter((h) => h !== q)
}

function clearHistory() {
  history.value = []
}

export function useSearch(allLinksRef) {
  const query = ref('')
  const results = ref([])
  const activeIndex = ref(-1)

  function highlight(text, q) {
    const str = text == null ? '' : String(text)
    const kw = (q || '').trim()
    const esc = escapeHtml(str)
    if (!kw) return esc
    const re = new RegExp('(' + escapeReg(kw) + ')', 'gi')
    return esc.replace(re, '<mark class="hl">$1</mark>')
  }

  function open(item) {
    if (!item) return
    if (query.value) recordHistory(query.value)
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }

  function clear() {
    query.value = ''
    results.value = []
    activeIndex.value = -1
  }

  watch(query, (q) => {
    const kw = (q || '').trim().toLowerCase()
    if (!kw) {
      results.value = []
      activeIndex.value = -1
      return
    }
    const scored = []
    for (const link of allLinksRef.value) {
      const name = (link.name || '').toLowerCase()
      const desc = (link.desc || '').toLowerCase()
      const tag = (link.tag || '').toLowerCase()
      const cat = (link.categoryTitle || '').toLowerCase()
      const url = (link.url || '').toLowerCase()
      let score = 0
      if (name.includes(kw)) score += 10
      if (tag.includes(kw)) score += 6
      if (desc.includes(kw)) score += 4
      if (url.includes(kw)) score += 3
      if (cat.includes(kw)) score += 2
      if (score > 0) scored.push({ link, score })
    }
    scored.sort((a, b) => b.score - a.score)
    results.value = scored.slice(0, 10).map((x) => x.link)
    activeIndex.value = results.value.length ? 0 : -1
  })

  function onKeydown(e) {
    if (e.key === 'Escape') {
      clear()
      return
    }
    if (!results.value.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      activeIndex.value = (activeIndex.value + 1) % results.value.length
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      activeIndex.value =
        (activeIndex.value - 1 + results.value.length) % results.value.length
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = results.value[activeIndex.value]
      if (item) open(item)
    }
  }

  function select(i) {
    open(results.value[i])
  }

  initHistPersist()

  return {
    query,
    results,
    activeIndex,
    history,
    highlight,
    open,
    clear,
    onKeydown,
    select,
    recordHistory,
    removeHistory,
    clearHistory,
  }
}
