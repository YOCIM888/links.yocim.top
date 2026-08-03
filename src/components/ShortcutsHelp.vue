<template>
  <transition name="fade">
    <div v-if="show" class="overlay" @click="$emit('close')">
      <div class="modal panel scanlines" @click.stop>
        <button class="close" aria-label="关闭" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
        <h2 class="title glitch" data-text="SHORTCUTS">SHORTCUTS</h2>
        <p class="sub">// 键盘快捷键 //</p>
        <ul class="list">
          <li v-for="k in keys" :key="k.desc">
            <span class="keys">
              <kbd v-for="(b, i) in k.kb" :key="i">{{ b }}</kbd>
            </span>
            <span class="desc">{{ k.desc }}</span>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({ show: { type: Boolean, default: false } })
defineEmits(['close'])

const keys = [
  { kb: ['/'], desc: '聚焦搜索框' },
  { kb: ['1', '–', '9'], desc: '跳转对应分类' },
  { kb: ['?'], desc: '显示/隐藏本面板' },
  { kb: ['Esc'], desc: '关闭面板 / 清空搜索' },
  { kb: ['↑', '↓'], desc: '搜索结果导航' },
  { kb: ['Enter'], desc: '打开选中链接' },
]
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(4, 4, 12, 0.72);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal {
  position: relative;
  width: min(440px, 92vw);
  padding: 32px 28px 28px;
  border-color: var(--border-neon);
  box-shadow: 0 0 40px rgba(5, 217, 232, 0.3);
}
.close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid rgba(5, 217, 232, 0.2);
  background: transparent;
  color: var(--text-dim);
  cursor: pointer;
  transition: all 0.2s ease;
}
.close:hover {
  color: var(--neon-pink);
  border-color: var(--neon-pink);
}
.title {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 30px;
  margin: 0 0 4px;
  color: #fff;
  letter-spacing: 2px;
  text-shadow:
    0 0 8px rgba(5, 217, 232, 0.7),
    0 0 20px rgba(255, 42, 109, 0.5);
}
.sub {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--neon-cyan);
  letter-spacing: 2px;
  margin: 0 0 22px;
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px dashed rgba(5, 217, 232, 0.12);
}
.list li:last-child {
  border-bottom: none;
}
.keys {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--neon-cyan);
  background: rgba(5, 217, 232, 0.08);
  border: 1px solid rgba(5, 217, 232, 0.35);
  border-bottom-width: 2px;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(5, 217, 232, 0.15);
}
.desc {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-main);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
