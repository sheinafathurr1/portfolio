<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import P5Background from '../components/P5Background.vue'
import MaskEmblem from '../components/MaskEmblem.vue'
import HintBar from '../components/HintBar.vue'
import { NAV } from '../composables/nav'
import { sfx } from '../composables/sfx'
import { useListNav } from '../composables/useListNav'
import { menuItems } from '../data/phantom'
import { allSkills, highlights, profile } from '../data/portfolio'

const nav = inject(NAV)
const open = (i: number) => {
  const item = menuItems[i]
  if (!item) return
  if (nav) nav.menuIndex.value = i
  nav?.goTo(item.id)
}

const { index, select } = useListNav(() => menuItems.length, {
  initial: nav?.menuIndex.value ?? 0,
  onEnter: open,
})
watch(index, (i) => { if (nav) nav.menuIndex.value = i })
const active = computed(() => menuItems[index.value] ?? menuItems[0]!)

const click = (i: number) => {
  sfx.confirm()
  open(i)
}

// Zig-zag offsets like the game's pause menu
const offsets = ['0rem', '3.2rem', '1rem', '4.2rem', '1.6rem', '3.6rem', '0.4rem']

// Date widget (WIB) with time-of-day phase, P5-calendar style
const now = ref(new Date())
let clock: ReturnType<typeof setInterval>
onMounted(() => { clock = setInterval(() => { now.value = new Date() }, 30_000) })
onUnmounted(() => clearInterval(clock))

const wib = computed(() => new Date(now.value.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })))
const dateLabel = computed(() => `${wib.value.getMonth() + 1}/${wib.value.getDate()}`)
const dayLabel = computed(() => ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][wib.value.getDay()])
const phase = computed(() => {
  const h = wib.value.getHours()
  if (h >= 5 && h < 11) return { label: 'Morning', icon: '☀' }
  if (h >= 11 && h < 15) return { label: 'Daytime', icon: '☀' }
  if (h >= 15 && h < 18) return { label: 'After School', icon: '⛅' }
  if (h >= 18 && h < 22) return { label: 'Evening', icon: '☾' }
  return { label: 'Late Night', icon: '☾' }
})

const uptime = highlights[0]
const automations = highlights[1]
</script>

<template>
  <section class="screen menu" tabindex="-1" aria-label="Menu utama">
    <P5Background variant="red" />

    <!-- Calendar widget -->
    <div class="date" aria-label="Tanggal hari ini">
      <div class="date__day">
        <span class="date__md">{{ dateLabel }}</span>
        <span class="date__dow">{{ dayLabel }}</span>
      </div>
      <div class="date__phase">{{ phase.label }} <span>{{ phase.icon }}</span></div>
    </div>

    <div class="menu__layout">
      <!-- Left: "character" emblem + description of the highlighted entry -->
      <div class="menu__left">
        <div class="portrait" aria-hidden="true">
          <div class="portrait__shape"></div>
          <span class="portrait__letter">S</span>
          <MaskEmblem class="portrait__mask" />
          <span class="portrait__star"></span>
        </div>
        <Transition name="desc" mode="out-in">
          <div :key="active.id" class="menu__desc">
            <p class="menu__desc-kicker">{{ active.sub }}</p>
            <p class="menu__desc-text">{{ active.desc }}</p>
          </div>
        </Transition>
      </div>

      <!-- Right: the menu -->
      <nav class="menu__list" aria-label="Menu utama">
        <button
          v-for="(item, i) in menuItems"
          :key="item.id"
          class="menu__item"
          :class="{ 'is-active': i === index }"
          :style="{ '--i': i, '--offset': offsets[i] ?? '0rem' }"
          :aria-current="i === index ? 'true' : undefined"
          @mouseenter="select(i)"
          @focus="select(i)"
          @click="click(i)"
        >
          <span class="menu__label">{{ item.label }}</span>
          <span class="menu__sub">{{ item.sub }}</span>
        </button>
      </nav>
    </div>

    <!-- Party HUD -->
    <div class="hud">
      <p class="hud__name">{{ profile.alias.toUpperCase() }} <span>LV {{ allSkills.length }}</span></p>
      <div class="hud__row"><b>HP</b><div class="p5-bar"><span style="width: 99.9%"></span></div><small>{{ uptime?.value }} uptime</small></div>
      <div class="hud__row"><b>SP</b><div class="p5-bar hud__sp"><span style="width: 78%"></span></div><small>{{ automations?.value }} automations</small></div>
    </div>

    <HintBar :hints="[['↑↓', 'Pilih'], ['Enter', 'Buka'], ['Esc', 'Judul']]" />
  </section>
</template>

<style scoped>
.menu > :not(:first-child) {
  position: relative;
  z-index: 1;
}

/* ── Date widget ── */
.date {
  position: absolute !important;
  top: 1.4rem;
  left: 1.6rem;
  z-index: 2 !important;
  animation: p5Pop 0.5s var(--snap) both;
}
.date__day {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transform: rotate(-8deg);
  transform-origin: left bottom;
}
.date__md {
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 6vw, 3.8rem);
  line-height: 1;
  color: var(--paper);
  -webkit-text-stroke: 2px var(--ink);
  text-shadow: 4px 4px 0 var(--ink);
}
.date__dow {
  display: grid;
  place-items: center;
  width: 3.1rem;
  height: 3.1rem;
  border-radius: 50%;
  font-family: var(--font-display);
  color: var(--paper);
  background: var(--ink);
  border: 3px solid var(--paper);
}
.date__phase {
  display: inline-block;
  margin: 0.2rem 0 0 1.2rem;
  padding: 0.15rem 0.9rem;
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--paper);
  background: var(--ink);
  transform: rotate(-8deg) skewX(-14deg);
}
.date__phase span {
  color: var(--red);
}

/* ── Layout ── */
.menu__layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  min-height: 100%;
  padding: 8.5rem 1.2rem 9rem;
  max-width: 1280px;
  margin: 0 auto;
}
@media (min-width: 900px) {
  .menu__layout {
    grid-template-columns: 1fr 1.15fr;
    align-items: center;
    padding: 2rem 2rem 6rem;
  }
}

/* ── Portrait emblem + description (description sits under the menu on phones) ── */
.menu__left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  order: 2;
  margin-top: 1.5rem;
}
@media (min-width: 900px) {
  .menu__left {
    order: 0;
    margin-top: 0;
    padding-top: 4rem;
  }
}
.portrait {
  display: none;
}
@media (min-width: 900px) {
  .portrait { display: block; }
}
.portrait {
  position: relative;
  width: min(32vw, 360px);
  aspect-ratio: 1;
  animation: p5Pop 0.6s var(--snap) both;
}
.portrait__shape {
  position: absolute;
  inset: 0;
  background: var(--paper);
  clip-path: polygon(50% 0, 62% 22%, 92% 10%, 82% 40%, 100% 55%, 78% 66%, 86% 96%, 56% 82%, 40% 100%, 34% 76%, 4% 84%, 18% 58%, 0 36%, 26% 30%, 18% 4%, 42% 20%);
  box-shadow: 10px 10px 0 var(--ink);
}
.portrait__letter {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: min(22vw, 250px);
  line-height: 1;
  color: var(--red);
  text-shadow: 8px 8px 0 var(--ink);
  transform: rotate(-8deg);
}
.portrait__mask {
  position: absolute;
  left: 18%;
  top: 34%;
  width: 64%;
  color: var(--ink);
  transform: rotate(-10deg);
}
.portrait__star {
  position: absolute;
  right: 4%;
  top: 6%;
  width: 18%;
  height: 18%;
  background: var(--ink);
  clip-path: polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  animation: p5Float 3s ease-in-out infinite;
}

.menu__desc {
  max-width: 380px;
  padding: 0.9rem 1.4rem 1rem;
  background: var(--ink);
  clip-path: polygon(0 6%, 100% 0, 97% 100%, 2% 94%);
  transform: rotate(-3deg);
}
.menu__desc-kicker {
  margin: 0 0 0.2rem;
  font-family: var(--font-marker);
  color: var(--red);
  font-size: 1.1rem;
}
.menu__desc-text {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.45;
}
.desc-enter-active, .desc-leave-active { transition: opacity 0.14s ease, transform 0.18s var(--snap); }
.desc-enter-from { opacity: 0; transform: translateX(-16px) rotate(-3deg); }
.desc-leave-to { opacity: 0; transform: translateX(16px) rotate(-3deg); }

/* ── Menu items ── */
.menu__list {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.6rem;
}
@media (max-width: 899px) {
  .menu__list { align-items: center; }
}
.menu__item {
  position: relative;
  isolation: isolate;
  border: 0;
  padding: 0.1em 0.5em 0.05em;
  background: none;
  text-align: right;
  transform: translateX(calc(var(--offset) * -1)) rotate(-7deg);
  animation: p5SlideIn 0.45s var(--snap) both;
  animation-delay: calc(var(--i) * 45ms + 80ms);
}
@media (max-width: 899px) {
  .menu__item {
    text-align: center;
    transform: translateX(calc(var(--offset) * 0.25 - 0.5rem)) rotate(-5deg);
  }
}
.menu__label {
  position: relative;
  z-index: 1;
  display: block;
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 4.6vw, 3.7rem);
  line-height: 1.05;
  letter-spacing: 0.02em;
  color: var(--paper);
  text-shadow: 4px 4px 0 var(--ink);
  transition: color 0.1s ease;
}
/* Small handwritten caption tucked under the active entry (absolutely positioned: no layout shift) */
.menu__sub {
  position: absolute;
  z-index: 2;
  right: calc(100% + 0.6rem);
  top: 50%;
  padding: 0.05em 0.5em;
  font-family: var(--font-marker);
  font-size: 0.95rem;
  white-space: nowrap;
  color: var(--paper);
  background: var(--ink);
  opacity: 0;
  transform: translateY(-50%) rotate(-4deg);
  transition: opacity 0.12s ease;
}
/* White highlight + black offset slab that snap in behind the active entry */
.menu__item::before,
.menu__item::after {
  content: '';
  position: absolute;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.18s var(--snap);
}
.menu__item::before {
  inset: -6% -4% -6% -6%;
  z-index: 0;
  background: var(--paper);
  clip-path: polygon(3% 6%, 100% 0, 97% 94%, 0 100%);
}
.menu__item::after {
  inset: 10% -9% -16% -2%;
  z-index: -1;
  background: var(--ink);
  clip-path: polygon(0 16%, 100% 0, 96% 100%, 4% 86%);
  transition-delay: 0.03s;
}
.menu__item.is-active::before,
.menu__item.is-active::after {
  transform: scaleX(1);
}
.menu__item.is-active .menu__label {
  color: var(--red);
  text-shadow: none;
}
.menu__item.is-active .menu__sub {
  opacity: 1;
}

/* ── Party HUD ── */
.hud {
  position: fixed !important;
  left: 1rem;
  bottom: 3.2rem;
  width: 260px;
  padding: 0.7rem 1.1rem 0.8rem;
  background: var(--ink);
  clip-path: polygon(0 8%, 100% 0, 96% 100%, 3% 94%);
  transform: rotate(-2deg);
  animation: p5SlideIn 0.5s var(--snap) 0.3s both;
}
@media (max-width: 899px) {
  .hud { display: none; }
}
.hud__name {
  margin: 0 0 0.35rem;
  font-family: var(--font-display);
  font-size: 1.3rem;
  letter-spacing: 0.08em;
}
.hud__name span {
  margin-left: 0.4rem;
  font-size: 0.9rem;
  color: var(--red);
}
.hud__row {
  display: grid;
  grid-template-columns: 1.6rem 1fr auto;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.75rem;
}
.hud__row b {
  font-family: var(--font-display);
  font-weight: 400;
  color: var(--red);
}
.hud__row small {
  color: var(--muted);
  font-size: 0.7rem;
  white-space: nowrap;
}
.hud__sp > span {
  background: #7dd3fc;
}
</style>
