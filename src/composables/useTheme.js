import { ref, watch } from 'vue'

const THEME_KEY = 'yocim-theme'
const THEMES = ['neon', 'midnight', 'minimal']

const THEME_META = {
  neon: { label: '霓虹', icon: 'fas fa-bolt' },
  midnight: { label: '暗夜', icon: 'fas fa-moon' },
  minimal: { label: '极简', icon: 'fas fa-circle-half-stroke' },
}

function loadTheme() {
  const t = localStorage.getItem(THEME_KEY)
  return THEMES.includes(t) ? t : 'neon'
}

const theme = ref(loadTheme())
let inited = false

function applyTheme(v) {
  document.documentElement.setAttribute('data-theme', v)
}

function initThemePersist() {
  if (inited) return
  inited = true
  applyTheme(theme.value)
  watch(theme, (v) => {
    try {
      localStorage.setItem(THEME_KEY, v)
    } catch {
      /* 忽略写入失败 */
    }
    applyTheme(v)
  })
}

function setTheme(t) {
  if (THEMES.includes(t)) theme.value = t
}

function cycleTheme() {
  const i = THEMES.indexOf(theme.value)
  theme.value = THEMES[(i + 1) % THEMES.length]
}

export function useTheme() {
  initThemePersist()
  return { theme, themes: THEMES, themeMeta: THEME_META, setTheme, cycleTheme }
}
