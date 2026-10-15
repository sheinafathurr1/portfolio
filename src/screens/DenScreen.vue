<script setup lang="ts">
import ScreenShell from '../components/ScreenShell.vue'
import { currentFocus, milestones } from '../data/portfolio'

const tilts = [-3, 2, -1.5, 3]
</script>

<template>
  <ScreenShell title="THIEVES DEN" subtitle="Achievements & Focus" number="06">
    <p class="den__intro p5-enter">Welcome to the hideout. Every plaque on this wall marks a mission accomplished.</p>

    <section class="wall" aria-label="Achievement gallery">
      <article
        v-for="(m, i) in milestones"
        :key="m.title"
        class="plaque p5-enter"
        :style="{ '--i': i + 1, '--tilt': `${tilts[i % tilts.length]}deg` }"
      >
        <span class="plaque__pin" aria-hidden="true"></span>
        <span class="plaque__icon" aria-hidden="true">{{ m.icon }}</span>
        <p class="plaque__year">{{ m.year }}</p>
        <h2 class="plaque__title">{{ m.title }}</h2>
        <p class="plaque__desc">{{ m.desc }}</p>
      </article>
    </section>

    <section class="todo p5-enter" style="--i: 6">
      <header class="todo__head">
        <h2 class="p5-label">Today’s Plans</h2>
        <span class="todo__live">● In progress</span>
      </header>
      <ul class="todo__list">
        <li v-for="f in currentFocus" :key="f.label">
          <span class="todo__check" aria-hidden="true">▶</span>
          <span class="todo__label">{{ f.icon }} {{ f.label }}</span>
          <div class="p5-bar"><span :style="{ width: `${f.pct}%` }"></span></div>
          <span class="todo__pct">{{ f.pct }}%</span>
        </li>
      </ul>
    </section>
  </ScreenShell>
</template>

<style scoped>
.den__intro {
  max-width: 640px;
  margin: 0 0 1.6rem;
  font-family: var(--font-type);
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--muted);
}

.wall {
  display: grid;
  gap: 1.8rem 1.4rem;
  margin-bottom: 2.4rem;
}
@media (min-width: 700px) {
  .wall { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1100px) {
  .wall { grid-template-columns: repeat(4, 1fr); }
}
.plaque {
  position: relative;
  padding: 2rem 1.3rem 1.4rem;
  text-align: center;
  color: var(--ink);
  background:
    linear-gradient(var(--paper), var(--paper)) padding-box,
    linear-gradient(135deg, var(--red), var(--ink)) border-box;
  border: 6px solid transparent;
  box-shadow: 8px 8px 0 var(--ink), 8px 8px 0 2px var(--red);
  transform: rotate(var(--tilt));
  transition: transform 0.2s var(--snap);
}
.plaque:hover {
  transform: rotate(0deg) scale(1.03);
}
.plaque__pin {
  position: absolute;
  top: -0.7rem;
  left: 50%;
  width: 1.3rem;
  height: 1.3rem;
  margin-left: -0.65rem;
  border-radius: 50%;
  background: var(--red);
  border: 3px solid var(--ink);
}
.plaque__icon {
  display: block;
  font-size: 2.8rem;
  line-height: 1;
}
.plaque__year {
  display: inline-block;
  margin: 0.7rem 0 0.4rem;
  padding: 0 0.6rem;
  font-family: var(--font-display);
  letter-spacing: 0.1em;
  color: var(--paper);
  background: var(--red);
  transform: skewX(-12deg);
}
.plaque__title {
  margin: 0 0 0.5rem;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.25rem;
  line-height: 1.15;
  text-transform: uppercase;
}
.plaque__desc {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
  color: #333;
}

.todo {
  max-width: 760px;
  padding: 1.4rem 1.6rem 1.6rem;
  background: var(--ink);
  border: 2px solid rgba(255, 255, 255, 0.12);
  clip-path: polygon(0 3%, 100% 0, 98.5% 100%, 1% 96%);
}
.todo__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.6rem;
  margin-bottom: 1rem;
}
.todo__head h2 {
  margin: 0;
  font-size: 1.6rem;
  color: var(--red);
}
.todo__live {
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4ade80;
}
.todo__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}
.todo__list li {
  display: grid;
  grid-template-columns: 1.4rem minmax(9rem, 13rem) 1fr 2.8rem;
  align-items: center;
  gap: 0.8rem;
}
@media (max-width: 560px) {
  .todo__list li { grid-template-columns: 1.4rem 1fr 2.8rem; }
  .todo__list li .p5-bar { grid-column: 2 / -1; grid-row: 2; }
}
.todo__check {
  display: grid;
  place-items: center;
  width: 1.3rem;
  height: 1.3rem;
  font-size: 0.85rem;
  color: var(--red);
  background: var(--paper);
  transform: rotate(-6deg);
}
.todo__label {
  font-weight: 600;
  letter-spacing: 0.03em;
}
.todo__pct {
  font-family: var(--font-display);
  text-align: right;
  color: var(--red);
}
</style>
