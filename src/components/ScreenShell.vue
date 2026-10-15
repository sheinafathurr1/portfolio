<script setup lang="ts">
import { inject } from 'vue'
import P5Background from './P5Background.vue'
import HintBar from './HintBar.vue'
import { NAV } from '../composables/nav'
import { sfx } from '../composables/sfx'

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
</script>

<template>
  <section class="screen shell" :class="`shell--${props.variant}`" tabindex="-1" :aria-label="`${title} — ${subtitle}`">
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
    </div>

    <HintBar :hints="[...hints, ['Esc', 'Kembali']]" />
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
</style>
