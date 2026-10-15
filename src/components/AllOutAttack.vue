<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import RansomText from './RansomText.vue'
import { closeOverlay } from '../composables/overlay'
import { clearRequest } from '../composables/requests'
import { sfx } from '../composables/sfx'
import { burstConfetti } from '../utils/confetti'

// Easter egg: an "All-Out Attack" splash followed by a "SHOWTIME!" finishing card.
const phase = ref<'attack' | 'finish'>('attack')
const isTouch = window.matchMedia('(pointer: coarse)').matches
const timers: ReturnType<typeof setTimeout>[] = []

onMounted(() => {
  sfx.slam()
  timers.push(
    setTimeout(() => {
      phase.value = 'finish'
      sfx.slam()
      const w = window.innerWidth
      const h = window.innerHeight
      ;[0.25, 0.5, 0.75].forEach((fx, i) =>
        timers.push(setTimeout(() => burstConfetti(w * fx, h * 0.4, 50, ['#e60012', '#0b0b0b', '#ffffff']), i * 130)),
      )
    }, 1700),
    setTimeout(closeOverlay, 5600),
  )
})
onUnmounted(() => {
  timers.forEach(clearTimeout)
  clearRequest('showtime')
})
</script>

<template>
  <div class="aoa" :class="`aoa--${phase}`" role="dialog" aria-label="All-Out Attack" @click="closeOverlay">
    <div class="aoa__lines" aria-hidden="true"></div>

    <template v-if="phase === 'attack'">
      <span class="aoa__slab aoa__slab--1" aria-hidden="true"></span>
      <span class="aoa__slab aoa__slab--2" aria-hidden="true"></span>
      <span class="aoa__slab aoa__slab--3" aria-hidden="true"></span>
      <span class="aoa__burst" aria-hidden="true"></span>
      <div class="aoa__title">
        <RansomText text="ALL-OUT ATTACK!" :seed="5" size="clamp(2.1rem, 8vw, 5.6rem)" />
      </div>
    </template>

    <div v-else class="aoa__finish">
      <RansomText text="SHOWTIME!" :seed="9" size="clamp(1.9rem, 9vw, 7.5rem)" nowrap />
      <p>The show’s over. Thanks for exploring. You’ve got style.</p>
      <small>{{ isTouch ? 'tap' : 'click' }} anywhere to continue</small>
    </div>
  </div>
</template>

<style scoped>
.aoa {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  place-items: center;
  overflow: hidden;
  cursor: pointer;
  background: var(--red);
  animation: flash 0.25s ease-out both;
}
.aoa--finish {
  background: var(--ink);
}

/* Speed lines racing across */
.aoa__lines {
  position: absolute;
  inset: -20%;
  background: repeating-linear-gradient(-28deg, transparent 0 22px, rgba(0, 0, 0, 0.18) 22px 26px, transparent 26px 60px);
  animation: speed 0.35s linear infinite;
}
.aoa--finish .aoa__lines {
  background: repeating-linear-gradient(-28deg, transparent 0 30px, rgba(230, 0, 18, 0.25) 30px 36px, transparent 36px 80px);
}

/* Black slabs streaking past like silhouettes */
.aoa__slab {
  position: absolute;
  height: 34vh;
  width: 140vw;
  background: var(--ink);
  transform: translateX(120vw) skewX(-24deg);
  animation: streak 0.55s cubic-bezier(0.6, 0, 0.3, 1) both;
}
.aoa__slab--1 { top: 4%; animation-delay: 0.05s; }
.aoa__slab--2 { top: 36%; height: 26vh; animation-delay: 0.22s; }
.aoa__slab--3 { top: 64%; animation-delay: 0.4s; }

.aoa__burst {
  position: absolute;
  width: 95vmin;
  height: 95vmin;
  background: var(--paper);
  clip-path: polygon(50% 0, 57% 30%, 85% 12%, 70% 40%, 100% 45%, 72% 58%, 92% 88%, 60% 72%, 50% 100%, 42% 70%, 10% 90%, 28% 58%, 0 48%, 30% 40%, 14% 10%, 44% 28%);
  animation: burst 0.6s var(--snap) 0.75s both, p5Spin 6s linear 1.3s infinite;
}
.aoa__title {
  position: relative;
  padding: 0 1rem;
  text-align: center;
  animation: p5Pop 0.45s var(--snap) 0.85s both, p5Shake 0.3s linear 1.25s;
}
.aoa__title :deep(.ransom) {
  justify-content: center;
}

.aoa__finish {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 1rem;
  max-width: calc(100vw - 2rem);
  padding: 2rem clamp(1.2rem, 4vw, 2.4rem);
  text-align: center;
  color: var(--ink);
  background: var(--paper);
  clip-path: polygon(2% 4%, 98% 0, 100% 94%, 3% 100%);
  box-shadow: 16px 16px 0 var(--red);
  transform: rotate(-4deg);
  animation: p5Pop 0.5s var(--snap) both;
}
.aoa__finish p {
  margin: 0;
  max-width: 28rem;
  font-family: var(--font-marker);
  font-size: clamp(1rem, 3vw, 1.35rem);
  color: var(--red);
}
.aoa__finish small {
  font-family: var(--font-type);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #666;
}

@keyframes flash { from { filter: brightness(2.2); } }
@keyframes speed { to { transform: translateX(-60px); } }
@keyframes streak {
  from { transform: translateX(120vw) skewX(-24deg); }
  to   { transform: translateX(-160vw) skewX(-24deg); }
}
@keyframes burst {
  from { transform: scale(0) rotate(-60deg); }
  to   { transform: scale(1) rotate(0deg); }
}
</style>
