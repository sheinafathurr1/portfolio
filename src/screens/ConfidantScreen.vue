<script setup lang="ts">
import { computed } from 'vue'
import ScreenShell from '../components/ScreenShell.vue'
import { useFocus } from '../composables/focus'
import { useListNav } from '../composables/useListNav'
import { confidants } from '../data/phantom'

const { index, select } = useListNav(() => confidants.length)
useFocus('confidant', (key) => {
  const i = confidants.findIndex((c) => c.id === key)
  if (i >= 0) index.value = i
})
const active = computed(() => confidants[index.value] ?? confidants[0]!)
</script>

<template>
  <ScreenShell title="CONFIDANT" subtitle="Experience & Organizations" number="04" :hints="[['↑↓', 'Select Confidant']]">
    <div class="split">
      <ul class="clist" role="listbox" aria-label="Confidant list">
        <li v-for="(c, i) in confidants" :key="c.id">
          <button
            class="crow p5-enter"
            :class="{ 'is-active': i === index }"
            :style="{ '--i': i }"
            role="option"
            :aria-selected="i === index"
            @click="select(i)"
            @mouseenter="select(i)"
          >
            <span class="crow__card" aria-hidden="true">
              <b>{{ c.arcana.numeral }}</b>
              <span>{{ c.arcana.icon }}</span>
            </span>
            <span class="crow__info">
              <span class="crow__arcana">{{ c.arcana.name }}</span>
              <span class="crow__name">{{ c.company }}</span>
              <span class="crow__stars" :aria-label="`Rank ${c.rank} of 10`">
                <i v-for="n in 10" :key="n" :class="{ on: n <= c.rank }"></i>
              </span>
            </span>
            <span class="crow__rank">{{ c.rank === 10 ? 'MAX' : c.rank }}</span>
          </button>
        </li>
      </ul>

      <Transition name="swap" mode="out-in">
        <article :key="active.id" class="cdetail">
          <div class="cdetail__top">
            <div class="tarot" aria-hidden="true">
              <span class="tarot__num">{{ active.arcana.numeral }}</span>
              <span class="tarot__icon">{{ active.arcana.icon }}</span>
              <span class="tarot__name">{{ active.arcana.name }}</span>
            </div>
            <div>
              <p class="cdetail__arcana">{{ active.arcana.name }} Arcana</p>
              <h2 class="cdetail__company">{{ active.company }}</h2>
              <p class="cdetail__role">{{ active.title }}</p>
              <p class="cdetail__period">{{ active.period }} · {{ active.months }} {{ active.months === 1 ? 'month' : 'months' }}</p>
            </div>
          </div>

          <div class="cdetail__rank">
            <span class="cdetail__rank-label">Rank</span>
            <span class="cdetail__rank-num">{{ active.rank === 10 ? 'MAX' : active.rank }}</span>
            <div class="cdetail__rank-bar">
              <div class="p5-bar"><span :style="{ width: `${active.progress * 100}%` }"></span></div>
              <small>{{ active.rank === 10 ? 'Max bond reached' : active.ended ? 'Bond sealed: this chapter has ended' : 'Progress to next rank' }}</small>
            </div>
          </div>

          <ul class="cdetail__points">
            <li v-for="point in active.points" :key="point">{{ point }}</li>
          </ul>

          <h3 class="p5-label cdetail__h">Abilities Unlocked</h3>
          <ul class="abilities">
            <li v-for="tag in active.tags" :key="tag">
              <span class="abilities__rank" aria-hidden="true">★</span>
              {{ tag }}
            </li>
          </ul>
          <p class="cdetail__note">Rank goes up by one for every two months of working together.</p>
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
  .split { grid-template-columns: minmax(300px, 420px) 1fr; align-items: start; }
}

.clist {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.8rem;
}
.crow {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  width: 100%;
  border: 0;
  padding: 0.7rem 1.2rem 0.7rem 0.8rem;
  text-align: left;
  color: var(--paper);
  background: rgba(255, 255, 255, 0.06);
  clip-path: polygon(0 0, 100% 5%, 97% 100%, 1% 95%);
  transition: background-color 0.12s ease, transform 0.18s var(--snap);
}
.crow.is-active {
  color: var(--ink);
  background: var(--paper);
  transform: translateX(10px) rotate(-1.5deg);
}
.crow__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 2.8rem;
  height: 4rem;
  color: var(--ink);
  background: var(--paper);
  border: 2px solid var(--ink);
  outline: 2px solid var(--red);
  transform: rotate(-6deg);
}
.crow__card b {
  font-family: 'Abril Fatface', serif;
  font-weight: 400;
  font-size: 0.85rem;
}
.crow__info {
  display: grid;
  gap: 0.1rem;
}
.crow__arcana {
  font-family: var(--font-type);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--red);
}
.crow__name {
  font-family: var(--font-display);
  font-size: 1.3rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.crow__stars {
  display: flex;
  gap: 2px;
}
.crow__stars i {
  width: 0.65rem;
  height: 0.65rem;
  background: currentColor;
  opacity: 0.2;
  clip-path: polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}
.crow__stars i.on {
  opacity: 1;
  background: var(--red);
}
.crow__rank {
  font-family: var(--font-display);
  font-size: 1.8rem;
  color: var(--red);
}

.cdetail {
  padding: 1.6rem 1.8rem 2rem;
  background: var(--ink);
  border: 2px solid rgba(255, 255, 255, 0.12);
  clip-path: polygon(0 0, 100% 2%, 98% 100%, 2% 98%);
}
.cdetail__top {
  display: flex;
  gap: 1.4rem;
  align-items: center;
  margin-bottom: 1.3rem;
}
.tarot {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 6.2rem;
  height: 9.6rem;
  padding: 0.5rem 0.3rem;
  color: var(--ink);
  background:
    radial-gradient(rgba(230, 0, 18, 0.25) 1px, transparent 1.4px) 0 0 / 7px 7px,
    var(--paper);
  border: 3px solid var(--ink);
  outline: 3px solid var(--paper);
  transform: rotate(-6deg);
  box-shadow: 8px 8px 0 var(--red);
  animation: p5Pop 0.5s var(--snap) both;
}
.tarot__num {
  font-family: 'Abril Fatface', serif;
  font-size: 1.4rem;
}
.tarot__icon {
  font-size: 2.4rem;
}
.tarot__name {
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.cdetail__arcana {
  margin: 0;
  font-family: var(--font-type);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--red);
}
.cdetail__company {
  margin: 0.2rem 0 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1;
  text-transform: uppercase;
}
.cdetail__role {
  margin: 0.3rem 0 0;
  font-size: 1.1rem;
  font-weight: 600;
}
.cdetail__period {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.cdetail__rank {
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
  padding: 0.6rem 1rem;
  background: var(--red);
  transform: skewX(-8deg);
}
.cdetail__rank > * {
  transform: skewX(8deg);
}
.cdetail__rank-label {
  font-family: var(--font-display);
  letter-spacing: 0.12em;
}
.cdetail__rank-num {
  font-family: var(--font-display);
  font-size: 2.4rem;
  line-height: 1;
  -webkit-text-stroke: 1px var(--ink);
}
.cdetail__rank-bar .p5-bar {
  background: rgba(0, 0, 0, 0.3);
}
.cdetail__rank-bar .p5-bar > span {
  background: var(--paper);
}
.cdetail__rank-bar small {
  display: block;
  margin-top: 0.2rem;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.cdetail__points {
  display: grid;
  gap: 0.55rem;
  margin: 0 0 1.4rem;
  padding: 0;
  list-style: none;
  font-size: 1.02rem;
  line-height: 1.55;
  color: #e5e5e5;
}
.cdetail__points li {
  position: relative;
  padding-left: 1.3rem;
}
.cdetail__points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 0.6rem;
  height: 0.6rem;
  background: var(--red);
  clip-path: polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}
.cdetail__h {
  margin: 0 0 0.6rem;
  color: var(--red);
}
.abilities {
  list-style: none;
  margin: 0 0 1rem;
  padding: 0;
  display: grid;
  gap: 0.45rem;
}
.abilities li {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.abilities__rank {
  font-family: var(--font-display);
  font-weight: 400;
  padding: 0 0.45rem;
  color: var(--ink);
  background: var(--paper);
  transform: skewX(-12deg);
}
.cdetail__note {
  margin: 0;
  font-family: var(--font-type);
  font-size: 0.8rem;
  color: var(--muted);
}

.swap-enter-active, .swap-leave-active { transition: opacity 0.14s ease, transform 0.2s var(--snap); }
.swap-enter-from { opacity: 0; transform: translateX(30px) skewX(-6deg); }
.swap-leave-to { opacity: 0; transform: translateX(-20px); }
</style>
