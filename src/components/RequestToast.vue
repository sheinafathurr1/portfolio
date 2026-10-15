<script setup lang="ts">
import RansomText from './RansomText.vue'

defineProps<{ title: string; desc: string; done: number; total: number }>()
const emit = defineEmits<{ dismiss: [] }>()
</script>

<template>
  <div class="req-toast" role="status" aria-live="polite" @click="emit('dismiss')">
    <div class="req-toast__head">
      <RansomText text="REQUEST CLEARED!" :seed="done * 7 + 2" size="clamp(1rem, 2.6vw, 1.2rem)" />
    </div>
    <div class="req-toast__row">
      <p class="req-toast__title">{{ title }}</p>
      <span class="req-toast__stamp p5-stamp">Cleared</span>
    </div>
    <p class="req-toast__desc">{{ desc }}</p>
    <div class="req-toast__progress">
      <div class="p5-bar p5-bar--paper"><span :style="{ width: `${(done / total) * 100}%` }"></span></div>
      <small>{{ done }}/{{ total }} requests</small>
    </div>
  </div>
</template>

<style scoped>
.req-toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 70;
  width: min(92vw, 340px);
  padding: 1rem 1.3rem 1.1rem;
  cursor: pointer;
  color: var(--ink);
  background: var(--paper);
  border: 3px solid var(--ink);
  clip-path: polygon(0 0, 100% 4%, 98% 100%, 2% 96%);
  box-shadow: 10px 10px 0 var(--red);
}
.req-toast__head {
  margin-bottom: 0.55rem;
}
.req-toast__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
}
.req-toast__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--red);
}
.req-toast__desc {
  margin: 0.1rem 0 0.7rem;
  font-family: var(--font-type);
  font-size: 0.9rem;
}
.req-toast__progress {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 0.6rem;
}
.req-toast__progress small {
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.req-toast__stamp {
  flex-shrink: 0;
  font-size: 0.95rem;
  animation: stampIn 0.4s var(--snap) 0.35s both;
}
@keyframes stampIn {
  from { opacity: 0; transform: scale(2.4) rotate(-30deg); }
}
</style>
