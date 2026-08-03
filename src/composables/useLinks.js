import { ref, onMounted } from 'vue'
import Papa from 'papaparse'

const CAT_COLORS = {
  acgn: '#ff2a6d',
  tools: '#05d9e8',
  ai: '#d300c5',
  news: '#f9f002',
  shopping: '#39ff14',
  gallery: '#ff8c00',
  video: '#ff3030',
  forum: '#00ffd0',
  music: '#ff00aa',
  education: '#00aaff',
  software: '#ffaa00',
  programming: '#00ff88',
}

export function useLinks() {
  const categories = ref([])
  const allLinks = ref([])
  const loading = ref(true)
  const error = ref(null)

  onMounted(async () => {
    try {
      const res = await fetch('./links.csv')
      if (!res.ok) throw new Error('CSV 加载失败: HTTP ' + res.status)
      const text = await res.text()
      const { data } = Papa.parse(text, { header: true, skipEmptyLines: true })

      const map = new Map()
      const all = []
      for (const row of data) {
        const id = (row.category_id || '').trim()
        const url = (row.link_url || '').trim()
        const name = (row.link_name || '').trim()
        if (!id || !url || !name || id === 'category_id') continue

        const color = CAT_COLORS[id] || '#05d9e8'
        if (!map.has(id)) {
          map.set(id, {
            id,
            title: (row.category_title || id).trim(),
            subtitle: (row.category_subtitle || '').trim(),
            icon: (row.category_icon || 'fas fa-folder').trim(),
            color,
            links: [],
          })
        }
        const item = {
          name,
          url,
          icon: (row.link_icon || 'fas fa-link').trim(),
          desc: (row.link_desc || '').trim(),
          tag: (row.link_tag || '').trim(),
          categoryId: id,
          categoryTitle: map.get(id).title,
          color,
        }
        map.get(id).links.push(item)
        all.push(item)
      }
      categories.value = Array.from(map.values())
      allLinks.value = all
    } catch (e) {
      error.value = e.message || String(e)
    } finally {
      loading.value = false
    }
  })

  return { categories, allLinks, loading, error }
}

