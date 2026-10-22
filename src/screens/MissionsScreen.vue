<script setup lang="ts">
import { computed } from 'vue'
import ScreenShell from '../components/ScreenShell.vue'
import RansomText from '../components/RansomText.vue'
import { useListNav } from '../composables/useListNav'
import { projects } from '../data/portfolio'

const { index, select } = useListNav(() => projects.length)
const active = computed(() => projects[index.value] ?? projects[0]!)
const place = (category: string) => (category === 'research' ? 'Palace · Research' : 'Mementos · Client')
const code = (id: number) => `#${String(id).padStart(2, '0')}`
</script>

<template>
  <ScreenShell title="MISSIONS" subtitle="Projects & Research" number="05" :hints="[['↑↓', 'Select Mission']]">
    <div class="split">
      <ul class="mlist" role="listbox" aria-label="Mission list">
        <li v-for="(p, i) in projects" :key="p.id">
          <button
            class="mrow p5-enter"
            :class="{ 'is-active': i === index }"
            :style="{ '--i': i }"
            role="option"
            :aria-selected="i === index"
            @click="select(i)"
            @mouseenter="select(i)"
          >
            <span class="mrow__no">{{ code(p.id) }}</span>
            <span class="mrow__body">
              <span class="mrow__place">{{ place(p.category) }}</span>
              <span class="mrow__title">{{ p.title }}</span>
            </span>
            <span class="mrow__stamp" :class="{ 'is-ongoing': p.ongoing }">{{ p.ongoing ? 'Active' : 'Cleared' }}</span>
          </button>
        </li>
      </ul>

      <Transition name="swap" mode="out-in">
        <article :key="active.id" class="mdetail">
          <div class="mdetail__banner">
            <span class="mdetail__icon" aria-hidden="true">{{ active.icon }}</span>
            <span class="mdetail__place">{{ place(active.category) }}</span>
            <span class="mdetail__org">{{ active.org }}</span>
            <span class="mdetail__stamp p5-stamp">{{ active.ongoing ? 'In Progress' : 'Mission Complete' }}</span>
          </div>

          <h2 class="mdetail__title"><RansomText :text="`Mission ${code(active.id)}`" :seed="active.id * 5" size="1.6rem" /></h2>
          <p class="mdetail__name">{{ active.title }}</p>

          <dl class="mdetail__brief">
            <dt>Target</dt>
            <dd>{{ active.shortDesc }}</dd>
            <dt>Report</dt>
            <dd>{{ active.fullDesc }}</dd>
          </dl>

          <h3 class="p5-label mdetail__h">Treasure</h3>
          <div class="mdetail__loot">
            <span v-for="t in active.tags" :key="t" class="p5-chip p5-chip--red">{{ t }}</span>
          </div>
        </article>
      </Transition>
    </div>
  </ScreenShell>
</template>

<style scoped>
.split {
  display: grid;
  gap: 1.6rem;
}
@media (min-width: 900px) {
  .split { grid-template-columns: minmax(300px, 440px) 1fr; align-items: start; }
}

.mlist {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.8rem;
}
.mrow {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  width: 100%;
  border: 0;
  padding: 0.9rem 1.2rem 0.9rem 1rem;
  text-align: left;
  color: var(--paper);
  background:
    repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.03) 0 10px, transparent 10px 20px),
    rgba(255, 255, 255, 0.06);
  border-left: 6px solid var(--red);
  transition: background-color 0.12s ease, transform 0.18s var(--snap);
}
.mrow.is-active {
  color: var(--ink);
  background: var(--paper);
  transform: translateX(10px) rotate(-1deg);
}
.mrow__no {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--red);
}
.mrow__body {
  display: grid;
  gap: 0.15rem;
}
.mrow__place {
  font-family: var(--font-type);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red);
}
.mrow__title {
  font-weight: 700;
  font-size: 1.05rem;
  line-height: 1.25;
  text-transform: uppercase;
}
.mrow__stamp {
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  padding: 0.05rem 0.4rem;
  color: var(--red);
  border: 2px solid var(--red);
  transform: rotate(-12deg);
}
.mrow__stamp.is-ongoing {
  color: #4ade80;
  border-color: #4ade80;
}

.mdetail {
  padding: 0 0 2rem;
  background: var(--ink);
  border: 2px solid rgba(255, 255, 255, 0.12);
  clip-path: polygon(0 0, 100% 1.5%, 98.5% 100%, 1% 98.5%);
}
.mdetail__banner {
  position: relative;
  height: 9rem;
  margin-bottom: 1.2rem;
  background:
    radial-gradient(rgba(0, 0, 0, 0.35) 1.3px, transparent 1.7px) 0 0 / 9px 9px,
    linear-gradient(115deg, var(--red) 0 62%, var(--ink) 62% 64%, var(--red-deep) 64%);
  overflow: hidden;
}
.mdetail__icon {
  position: absolute;
  right: 1.4rem;
  top: 50%;
  font-size: 5.5rem;
  transform: translateY(-50%) rotate(-10deg);
  filter: drop-shadow(6px 6px 0 var(--ink));
}
.mdetail__place {
  position: absolute;
  left: 1.6rem;
  top: 1.2rem;
  padding: 0.15rem 0.8rem;
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: var(--ink);
  transform: skewX(-12deg);
}
/* Client / grant behind the mission */
.mdetail__org {
  position: absolute;
  left: 1.6rem;
  bottom: 0.9rem;
  max-width: calc(100% - 9rem);
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2.6vw, 1.6rem);
  line-height: 1.1;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--paper);
  text-shadow: 3px 3px 0 var(--ink);
}
.mdetail__stamp {
  position: absolute;
  left: 42%;
  top: 2.6rem;
  font-size: 1.1rem;
  color: var(--paper);
  border-color: var(--paper);
  animation: p5Pop 0.5s var(--snap) 0.15s both;
}
.mdetail > :not(.mdetail__banner) {
  margin-left: 1.8rem;
  margin-right: 1.8rem;
}
.mdetail__title {
  margin-top: 0;
  margin-bottom: 0.4rem;
  font-weight: 400;
}
.mdetail__name {
  margin-top: 0;
  margin-bottom: 1.2rem;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 4vw, 2.3rem);
  line-height: 1.1;
  text-transform: uppercase;
}
.mdetail__brief {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.6rem 1rem;
  margin-top: 0;
  margin-bottom: 1.4rem;
}
.mdetail__brief dt {
  font-family: var(--font-display);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--red);
}
.mdetail__brief dd {
  margin: 0;
  line-height: 1.6;
  color: #e5e5e5;
}
@media (max-width: 560px) {
  .mdetail__brief { grid-template-columns: 1fr; gap: 0.2rem; }
  .mdetail__brief dd { margin-bottom: 0.6rem; }
}
.mdetail__h {
  margin-top: 0;
  margin-bottom: 0.6rem;
  color: var(--red);
}
.mdetail__loot {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.swap-enter-active, .swap-leave-active { transition: opacity 0.14s ease, transform 0.2s var(--snap); }
.swap-enter-from { opacity: 0; transform: translateX(30px) skewX(-6deg); }
.swap-leave-to { opacity: 0; transform: translateX(-20px); }
</style>
