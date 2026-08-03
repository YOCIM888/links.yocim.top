<template>
  <a
    :href="link.url"
    target="_blank"
    rel="noopener noreferrer"
    class="card"
  >
    <span class="sweep"></span>
    <div class="icon-wrap">
      <i :class="link.icon"></i>
    </div>
    <div class="name">{{ link.name }}</div>
    <div class="desc">{{ link.desc }}</div>
    <div v-if="link.tag" class="tag"># {{ link.tag }}</div>
  </a>
</template>

<script setup>
defineProps({ link: { type: Object, required: true } })
</script>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 16px 14px;
  background: linear-gradient(160deg, rgba(13, 18, 38, 0.85), rgba(7, 7, 19, 0.9));
  border: 1px solid rgba(5, 217, 232, 0.18);
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}
.card:hover {
  transform: translateY(-6px);
  border-color: var(--neon-cyan);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.5),
    0 0 18px rgba(5, 217, 232, 0.35);
}
.sweep {
  position: absolute;
  top: 0;
  left: -120%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    100deg,
    transparent,
    rgba(5, 217, 232, 0.18),
    transparent
  );
  transform: skewX(-20deg);
  transition: left 0.6s ease;
  pointer-events: none;
}
.card:hover .sweep {
  left: 130%;
}
.icon-wrap {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(5, 217, 232, 0.08);
  border: 1px solid rgba(5, 217, 232, 0.25);
  color: var(--neon-cyan);
  font-size: 18px;
  transition: all 0.25s ease;
}
.card:hover .icon-wrap {
  background: rgba(255, 42, 109, 0.12);
  border-color: var(--neon-pink);
  color: var(--neon-pink);
  transform: scale(1.08);
}
.name {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 15px;
  color: var(--text-main);
  letter-spacing: 0.5px;
}
.desc {
  font-size: 12px;
  color: var(--text-dim);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.tag {
  margin-top: auto;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--neon-yellow);
  opacity: 0.85;
}
</style>
