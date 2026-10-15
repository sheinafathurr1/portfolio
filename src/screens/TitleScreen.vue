<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from 'vue'
import P5Background from '../components/P5Background.vue'
import RansomText from '../components/RansomText.vue'
import MaskEmblem from '../components/MaskEmblem.vue'
import { BOND_MAX, bondRank } from '../composables/bond'
import { NAV, inputBlocked } from '../composables/nav'
import { REQUESTS, clearedCount } from '../composables/requests'
import { sfx, sfxEnabled, toggleSfx } from '../composables/sfx'
import { profile } from '../data/portfolio'

const nav = inject(NAV)
const isTouch = window.matchMedia('(pointer: coarse)').matches
const year = new Date().getFullYear()

// Ignore input while the card is still slamming in
const ready = ref(false)
let readyTimer: ReturnType<typeof setTimeout>

const start = () => {
  if (!ready.value) return
  sfx.confirm()
  nav?.goTo('menu')
}

const onKey = (e: KeyboardEvent) => {
  if (['Tab', 'Escape', 'Shift', 'Control', 'Alt', 'Meta'].includes(e.key) || inputBlocked(e)) return
  start()
}

onMounted(() => {
  readyTimer = setTimeout(() => { ready.value = true }, 650)
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  clearTimeout(readyTimer)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <section class="screen title" tabindex="-1" aria-label="Title screen" @click="start">
    <P5Background variant="red" />
    <div class="title__burst" aria-hidden="true"></div>
    <span class="title__star title__star--a" aria-hidden="true"></span>
    <span class="title__star title__star--b" aria-hidden="true"></span>
    <span class="title__star title__star--c" aria-hidden="true"></span>

    <p class="title__tag">Phantom Portfolio · {{ year }}</p>

    <div class="title__card">
      <p class="title__kicker">— Calling Card —</p>
      <h1 class="title__name">
        <RansomText text="SWITCH" :seed="11" size="clamp(2.6rem, 10.5vw, 6.2rem)" nowrap />
      </h1>
      <p class="title__who">{{ profile.name }} <span>·</span> Technical Lead &amp; AI Researcher</p>
      <p class="title__line">Brace yourself. This portfolio is about to steal your heart.</p>
      <MaskEmblem class="title__mask" />
    </div>

    <button class="title__press" @click.stop="start">
      <span>{{ isTouch ? 'Tap to start' : 'Press any key' }}</span>
    </button>

    <p v-if="bondRank > 0 || clearedCount > 0" class="title__back">
      Welcome back, Phantom Thief
      <span>Bond {{ bondRank >= BOND_MAX ? 'MAX' : `${bondRank}/${BOND_MAX}` }}</span>
      <span>Requests {{ clearedCount }}/{{ REQUESTS.length }}</span>
    </p>

    <button class="title__sfx" :aria-pressed="sfxEnabled" @click.stop="toggleSfx">
      SFX <strong>{{ sfxEnabled ? 'ON' : 'OFF' }}</strong>
    </button>
  </section>
</template>

<style scoped>
.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.4rem;
  padding: 2rem 1rem 4rem;
  cursor: pointer;
}
.title > *:not(:first-child) {
  position: relative;
  z-index: 1;
}

.title__burst {
  position: absolute !important;
  top: 50%;
  left: 50%;
  width: 120vmin;
  height: 120vmin;
  margin: -60vmin 0 0 -60vmin;
  background: var(--ink);
  clip-path: polygon(50% 0, 57% 30%, 85% 12%, 70% 40%, 100% 45%, 72% 58%, 92% 88%, 60% 72%, 50% 100%, 42% 70%, 10% 90%, 28% 58%, 0 48%, 30% 40%, 14% 10%, 44% 28%);
  opacity: 0.88;
  animation: p5Spin 60s linear infinite;
}

.title__star {
  position: absolute !important;
  width: 4rem;
  height: 4rem;
  background: var(--paper);
  clip-path: polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  animation: p5Float 4s ease-in-out infinite;
}
.title__star--a { top: 12%; left: 12%; }
.title__star--b { top: 70%; right: 10%; width: 2.6rem; height: 2.6rem; background: var(--ink); animation-delay: -1.2s; }
.title__star--c { top: 18%; right: 18%; width: 1.8rem; height: 1.8rem; animation-delay: -2.4s; }

.title__tag {
  margin: 0;
  padding: 0.3rem 1rem;
  font-family: var(--font-display);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  background: var(--ink);
  transform: rotate(-4deg);
}

.title__card {
  width: min(92vw, 720px);
  padding: 2rem 2.2rem 2.4rem;
  color: var(--ink);
  background: var(--paper);
  clip-path: polygon(2% 4%, 98% 0, 100% 92%, 4% 100%, 0 40%);
  transform: rotate(-4deg);
  box-shadow: 14px 14px 0 var(--ink);
  animation: p5Pop 0.6s var(--snap) both, p5Shake 0.35s linear 0.55s;
  text-align: center;
}
.title__kicker {
  margin: 0 0 0.6rem;
  font-family: var(--font-type);
  font-size: 1rem;
  letter-spacing: 0.3em;
  color: var(--red);
  text-transform: uppercase;
}
.title__name {
  margin: 0 0 1rem;
  font-weight: 400;
}
.title__who {
  margin: 0 0 0.6rem;
  font-weight: 600;
  font-size: clamp(0.95rem, 2.4vw, 1.2rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.title__who span {
  color: var(--red);
}
.title__line {
  margin: 0;
  font-family: var(--font-marker);
  font-size: clamp(1rem, 2.6vw, 1.3rem);
  color: var(--red);
}
.title__mask {
  width: 4.5rem;
  margin: 1.2rem auto 0;
  color: var(--ink);
}

.title__press {
  border: 0;
  padding: 0.6rem 2.4rem;
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 3.5vw, 1.8rem);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--paper);
  background: var(--ink);
  clip-path: polygon(4% 0, 100% 0, 96% 100%, 0 100%);
  transform: rotate(-3deg);
}
.title__press span {
  display: inline-block;
  animation: p5Blink 1.2s steps(2) infinite;
}
.title__press::before {
  content: '▶ ';
  color: var(--red);
}

.title__back {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.3rem 0.9rem;
  margin: -1.2rem 0 0;
  padding: 0.3rem 1rem;
  font-family: var(--font-type);
  font-size: 0.9rem;
  color: var(--paper);
  background: var(--ink);
  transform: rotate(-2deg);
}
.title__back span {
  color: var(--red);
  font-weight: 700;
}

.title__sfx {
  position: fixed !important;
  right: 1rem;
  bottom: 1rem;
  border: 0;
  padding: 0.35rem 0.9rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--paper);
  background: var(--ink);
}
.title__sfx strong {
  color: var(--red);
}
</style>
