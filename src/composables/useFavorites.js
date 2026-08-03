import { ref, watch } from 'vue'

const STORAGE_KEY = 'yocim-favs'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const favs = ref(load())
let persistInited = false

function initPersist() {
  if (persistInited) return
  persistInited = true
  watch(
    favs,
    (v) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
      } catch {
        /* 忽略写入失败（隐私模式等） */
      }
    },
    { deep: true }
  )
}

export function useFavorites() {
  initPersist()

  function isFav(url) {
    return favs.value.includes(url)
  }

  function toggleFav(url) {
    if (isFav(url)) {
      favs.value = favs.value.filter((u) => u !== url)
    } else {
      favs.value = [url, ...favs.value]
    }
  }

  function clearFavs() {
    favs.value = []
  }

  return { favs, isFav, toggleFav, clearFavs }
}
