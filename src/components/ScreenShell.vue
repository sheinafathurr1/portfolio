<script setup lang="ts">
import { computed, inject } from 'vue'
import P5Background from './P5Background.vue'
import HintBar from './HintBar.vue'
import { NAV, isTypingTarget } from '../composables/nav'
import { overlay } from '../composables/overlay'
import { sfx } from '../composables/sfx'
import { menuItems } from '../data/phantom'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle: string
    number: string
    hints?: [string, string][]
    variant?: 'red' | 'black'
  }>(),
  { hints: () => [], variant: 'black' },
)

const nav = inject(NAV)
const back = () => {
  sfx.back()
  nav?.back()
}

// Previous / next section, wrapping around the menu order
const position = computed(() => menuItems.findIndex((m) => m.id === nav?.current.value))
const neighbour = (dir: number) => {
  const n = menuItems.length
  return menuItems[(position.value + dir + n) % n] ?? menuItems[0]!
}
const prev = computed(() => neighbour(-1))
const next = computed(() => neighbour(1))

const travel = (dir: 1 | -1) => {
  sfx.move()
  nav?.step(dir)
}

// Swipe left/right on touch screens to change section
let start: { x: number; y: number } | null = null
const onTouchStart = (e: TouchEvent) => {
  const t = e.touches[0]
  start = t && e.touches.length === 1 && !isTypingTarget(e) ? { x: t.clientX, y: t.clientY } : null
}
const onTouchEnd = (e: TouchEvent) => {
  const t = e.changedTouches[0]
  if (!start || !t || overlay.value !== 'none') return
  const dx = t.clientX - start.x
  const dy = t.clientY - start.y
  start = null
  // Only clearly horizontal swipes count
  if (Math.abs(dx) < 70 || Math.abs(dy) > 45) return
  travel(dx < 0 ? 1 : -1)
}
</script>

<template>
  <section
    class="screen shell"
    :class="`shell--${props.variant}`"
    tabindex="-1"
    :aria-label="`${title} — ${subtitle}`"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <P5Background :variant="props.variant" />

    <header class="shell__head">
      <div class="shell__title">
        <span class="shell__num">{{ number }}</span>
        <h1>{{ title }}</h1>
      </div>
      <p class="shell__sub">{{ subtitle }}</p>
      <button class="shell__back p5-btn p5-btn--light" @click="back">◀ Menu</button>
    </header>

    <div class="shell__body">
      <slot />

      <nav class="pager" aria-label="Section navigation">
        <button class="pager__btn pager__btn--prev" @click="travel(-1)">
          <kbd class="p5-kbd">Q</kbd>
          <span class="pager__dir">◀ Prev</span>
          <span class="pager__label">{{ prev.label }}</span>
        </button>
        <button class="pager__btn pager__btn--next" @click="travel(1)">
          <kbd class="p5-kbd">E</kbd>
          <span class="pager__dir">Next ▶</span>
          <span class="pager__label">{{ next.label }}</span>
        </button>
      </nav>
    </div>

    <HintBar :hints="[...hints, ['Q/E', 'Section'], ['Esc', 'Back']]" />
  </section>
</template>

<style scoped>
.shell__head {
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.4rem 1.2rem;
  padding: 1.4rem 1.25rem 0;
  max-width: 1240px;
  margin: 0 auto;
}
.shell__title {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.35rem 1.6rem 0.35rem 0.9rem;
  background: var(--ink);
  clip-path: polygon(0 0, 100% 6%, 96% 100%, 2% 92%);
  transform: rotate(-3deg);
  animation: p5Pop 0.45s var(--snap) both;
}
.shell__num {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--ink);
  background: var(--red);
  padding: 0.1rem 0.5rem;
  transform: rotate(-8deg);
}
.shell__title h1 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.4rem, 7vw, 4.6rem);
  line-height: 1;
  letter-spacing: 0.02em;
  color: var(--paper);
  text-shadow: 3px 3px 0 var(--red);
}
.shell__sub {
  margin: 0 0 0.5rem;
  font-family: var(--font-marker);
  font-size: 1.15rem;
  color: var(--red);
  transform: rotate(-3deg);
}
.shell--red .shell__sub {
  color: var(--paper);
  text-shadow: 2px 2px 0 var(--ink);
}
.shell__back {
  margin-left: auto;
  margin-bottom: 0.5rem;
}
.shell__body {
  position: relative;
  z-index: 1;
  max-width: 1240px;
  margin: 0 auto;
  padding: 1.6rem 1.25rem 6rem;
}

/* ── Prev / next section ── */
.pager {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3rem;
}
.pager__btn {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: 'key dir' 'key label';
  align-items: center;
  column-gap: 0.7rem;
  min-width: 0;
  max-width: 48%;
  border: 0;
  padding: 0.55rem 1.3rem 0.65rem;
  text-align: left;
  color: var(--paper);
  background: var(--ink);
  clip-path: polygon(0 8%, 100% 0, 96% 100%, 3% 92%);
  transform: rotate(-2deg);
  transition: transform 0.18s var(--snap), background-color 0.12s ease, color 0.12s ease;
}
.pager__btn--next {
  grid-template-columns: 1fr auto;
  grid-template-areas: 'dir key' 'label key';
  text-align: right;
  clip-path: polygon(4% 0, 100% 8%, 97% 92%, 0 100%);
  transform: rotate(2deg);
}
.pager__btn kbd {
  grid-area: key;
}
.pager__dir {
  grid-area: dir;
  font-family: var(--font-marker);
  font-size: 0.9rem;
  color: var(--red);
}
.pager__label {
  grid-area: label;
  overflow: hidden;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  line-height: 1.1;
  letter-spacing: 0.03em;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pager__btn:hover,
.pager__btn:focus-visible {
  color: var(--ink);
  background: var(--paper);
}
.pager__btn--prev:hover { transform: rotate(-2deg) translateX(-6px); }
.pager__btn--next:hover { transform: rotate(2deg) translateX(6px); }
.shell--red .pager__dir {
  color: var(--red);
}
@media (pointer: coarse) {
  .pager__btn kbd { display: none; }
  .pager__btn,
  .pager__btn--next { grid-template-columns: 1fr; }
  .pager__btn { grid-template-areas: 'dir' 'label'; }
}
</style>
