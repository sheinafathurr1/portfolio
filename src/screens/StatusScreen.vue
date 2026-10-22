<script setup lang="ts">
import { inject, nextTick, onUnmounted, ref } from 'vue'
import ScreenShell from '../components/ScreenShell.vue'
import RansomText from '../components/RansomText.vue'
import MaskEmblem from '../components/MaskEmblem.vue'
import { useFocus } from '../composables/focus'
import { NAV } from '../composables/nav'
import { sfx } from '../composables/sfx'
import { socialStats } from '../data/phantom'
import { education, highlights, profile } from '../data/portfolio'

const nav = inject(NAV)

// Search results for a degree scroll to the academic record and make the diploma pop
const spot = ref<string | null>(null)
let spotTimer: ReturnType<typeof setTimeout>
useFocus('status', (key) => {
  spot.value = String(key)
  nextTick(() => document.querySelector('.edu')?.scrollIntoView({ block: 'center', behavior: 'smooth' }))
  clearTimeout(spotTimer)
  spotTimer = setTimeout(() => { spot.value = null }, 2600)
})
onUnmounted(() => clearTimeout(spotTimer))
const toResume = () => {
  sfx.confirm()
  nav?.goTo('resume')
}
const toCard = () => {
  sfx.confirm()
  nav?.goTo('card')
}

// Social-stat radar (pentagon)
const R = 92
const CX = 130
const CY = 122
const point = (i: number, r: number) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / socialStats.length
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r] as const
}
const ring = (k: number) => socialStats.map((_, i) => point(i, (R * k) / 5).join(',')).join(' ')
const valueShape = socialStats.map((s, i) => point(i, (R * s.rank) / 5).join(',')).join(' ')
const labels = socialStats.map((s, i) => {
  const [x, y] = point(i, R + 22)
  return { x, y, text: s.stat, anchor: Math.abs(x - CX) < 8 ? 'middle' : x < CX ? 'end' : 'start' }
})
</script>

<template>
  <ScreenShell title="STATUS" subtitle="About Me" number="01">
    <div class="status">
      <!-- ID card -->
      <article class="idcard p5-enter" style="--i: 0">
        <div class="idcard__photo" aria-hidden="true">
          <span>S</span>
          <MaskEmblem class="idcard__mask" />
        </div>
        <div class="idcard__info">
          <p class="idcard__code">Codename</p>
          <h2 class="idcard__name"><RansomText :text="profile.alias" :seed="21" size="clamp(2.4rem, 7vw, 3.6rem)" /></h2>
          <p class="idcard__real">{{ profile.name }}</p>
          <p class="idcard__arcana">Arcana <b>0 · The Fool</b></p>
          <div class="idcard__roles">
            <span v-for="role in profile.roles" :key="role" class="p5-chip p5-chip--dark">{{ role }}</span>
          </div>
        </div>
        <span class="idcard__stamp p5-stamp">Available</span>
      </article>

      <div class="status__grid">
        <!-- Bio -->
        <section class="p5-panel status__bio p5-enter" style="--i: 1">
          <h3 class="p5-label status__h">Field Notes</h3>
          <p class="status__summary">{{ profile.summary }}</p>
          <h3 class="p5-label status__h">Loadout</h3>
          <div class="status__stack">
            <span v-for="tech in profile.stack" :key="tech" class="p5-chip">{{ tech }}</span>
          </div>
          <div class="status__actions">
            <button class="p5-btn p5-btn--red" @click="toResume">Résumé / CV</button>
            <button class="p5-btn p5-btn--light" @click="toCard">Send a Calling Card</button>
          </div>
        </section>

        <!-- Social stats -->
        <section class="p5-panel p5-panel--paper status__social p5-enter" style="--i: 2">
          <h3 class="p5-label status__h status__h--dark">Social Stats</h3>
          <svg viewBox="0 0 260 250" class="radar" role="img" aria-label="Social stats chart">
            <polygon v-for="k in 5" :key="k" :points="ring(k)" class="radar__ring" />
            <polygon :points="valueShape" class="radar__value" />
            <text
              v-for="l in labels"
              :key="l.text"
              :x="l.x"
              :y="l.y"
              :text-anchor="l.anchor"
              dominant-baseline="middle"
              class="radar__label"
            >{{ l.text }}</text>
          </svg>
          <ul class="stats">
            <li v-for="s in socialStats" :key="s.stat">
              <span class="stats__name">{{ s.stat }}</span>
              <span class="stats__title">{{ s.title }}</span>
              <span class="stats__pips" :aria-label="`Rank ${s.rank} of 5`">
                <i v-for="n in 5" :key="n" :class="{ on: n <= s.rank }"></i>
              </span>
              <small>{{ s.note }}</small>
            </li>
          </ul>
        </section>
      </div>

      <!-- Education -->
      <section class="edu p5-enter" style="--i: 3" aria-labelledby="edu-title">
        <h3 id="edu-title" class="p5-label edu__h">Academic Record</h3>
        <div class="edu__grid">
          <article v-for="e in education" :key="e.degree" class="diploma" :class="{ 'is-spotlit': spot === e.degree }">
            <p class="diploma__period">{{ e.period }}</p>
            <h4 class="diploma__degree">{{ e.degree }}</h4>
            <p class="diploma__school">{{ e.school }}</p>
            <p class="diploma__note">{{ e.note }}</p>
            <p class="diploma__detail">{{ e.detail }}</p>
            <span class="diploma__gpa"><small>GPA</small>{{ e.gpa }}</span>
          </article>
        </div>
      </section>

      <!-- Records -->
      <section class="records">
        <article v-for="(h, i) in highlights" :key="h.label" class="record p5-enter" :style="{ '--i': i + 4 }">
          <p class="record__value">{{ h.value }}</p>
          <p class="record__label">{{ h.label }}</p>
          <p class="record__desc">{{ h.desc }}</p>
        </article>
      </section>
    </div>
  </ScreenShell>
</template>

<style scoped>
.status {
  display: grid;
  gap: 1.6rem;
}

/* ── ID card ── */
.idcard {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.4rem;
  align-items: center;
  padding: 1.4rem 1.6rem;
  color: var(--ink);
  background: var(--paper);
  clip-path: polygon(0 4%, 100% 0, 99% 96%, 1% 100%);
  box-shadow: 10px 10px 0 var(--red);
}
.idcard__photo {
  position: relative;
  display: grid;
  place-items: center;
  width: clamp(6.5rem, 18vw, 9.5rem);
  aspect-ratio: 3 / 4;
  background: var(--red);
  clip-path: polygon(8% 0, 100% 4%, 92% 100%, 0 94%);
  overflow: hidden;
}
.idcard__photo span {
  font-family: var(--font-display);
  font-size: clamp(5rem, 14vw, 7.5rem);
  line-height: 1;
  color: var(--paper);
  text-shadow: 5px 5px 0 var(--ink);
}
.idcard__mask {
  position: absolute;
  left: 12%;
  top: 34%;
  width: 76%;
  color: var(--ink);
  transform: rotate(-10deg);
}
.idcard__code {
  margin: 0;
  font-family: var(--font-type);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--red);
}
.idcard__name {
  margin: 0.2rem 0 0.4rem;
  font-weight: 400;
}
.idcard__real {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.idcard__arcana {
  margin: 0.2rem 0 0.8rem;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #555;
}
.idcard__arcana b {
  color: var(--red);
}
.idcard__roles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.idcard__stamp {
  position: absolute;
  top: 1rem;
  right: 1.4rem;
  font-size: 1.1rem;
}
@media (max-width: 560px) {
  .idcard { grid-template-columns: 5.2rem 1fr; gap: 1rem; padding: 1.2rem 1.1rem; }
  .idcard__photo { width: 5.2rem; }
  .idcard__photo span { font-size: 4.2rem; }
  .idcard__roles { grid-column: 1 / -1; }
  .idcard__stamp { position: static; justify-self: start; grid-column: 1 / -1; font-size: 0.95rem; }
}

/* ── Panels ── */
.status__grid {
  display: grid;
  gap: 1.6rem;
}
@media (min-width: 900px) {
  .status__grid { grid-template-columns: 1fr 1fr; }
}
.status__h {
  margin: 0 0 0.6rem;
  font-size: 1.3rem;
  color: var(--red);
}
.status__h--dark {
  color: var(--ink);
}
.status__summary {
  margin: 0 0 1.4rem;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #e5e5e5;
}
.status__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 1.6rem;
}
.status__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

/* ── Radar ── */
.radar {
  display: block;
  width: min(100%, 320px);
  margin: 0 auto 0.6rem;
  overflow: visible;
}
.radar__ring {
  fill: none;
  stroke: rgba(0, 0, 0, 0.18);
  stroke-width: 1;
}
.radar__value {
  fill: rgba(230, 0, 18, 0.75);
  stroke: var(--ink);
  stroke-width: 3;
  stroke-linejoin: round;
  transform-origin: 130px 122px;
  animation: radarIn 0.8s var(--snap) 0.3s both;
}
.radar__label {
  font-family: var(--font-display);
  font-size: 13px;
  letter-spacing: 0.06em;
  fill: var(--ink);
}
@keyframes radarIn {
  from { transform: scale(0) rotate(-40deg); }
}

.stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}
.stats li {
  display: grid;
  grid-template-columns: 6.5rem 1fr auto;
  align-items: center;
  gap: 0 0.6rem;
}
.stats__name {
  font-family: var(--font-display);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.stats__title {
  font-family: var(--font-marker);
  color: var(--red);
}
.stats__pips {
  display: flex;
  gap: 3px;
}
.stats__pips i {
  width: 0.7rem;
  height: 0.7rem;
  background: rgba(0, 0, 0, 0.15);
  clip-path: polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}
.stats__pips i.on {
  background: var(--red);
}
.stats small {
  grid-column: 1 / -1;
  font-size: 0.82rem;
  color: #555;
}

/* ── Education ── */
.edu__h {
  margin: 0 0 0.8rem;
  font-size: 1.3rem;
  color: var(--red);
}
.edu__grid {
  display: grid;
  gap: 1.2rem;
}
@media (min-width: 900px) {
  .edu__grid { grid-template-columns: 1fr 1fr; }
}
.diploma {
  position: relative;
  padding: 1.1rem 6.8rem 1.2rem 1.3rem;
  color: var(--ink);
  background: var(--paper);
  border-left: 8px solid var(--red);
  clip-path: polygon(0 0, 100% 3%, 99% 100%, 1% 97%);
}
.diploma.is-spotlit {
  animation: diplomaPop 0.5s var(--snap) 0.35s 3;
}
@keyframes diplomaPop {
  50% { transform: scale(1.03) rotate(-1deg); background: #ffe4e6; }
}
.diploma p,
.diploma h4 {
  margin: 0;
}
.diploma__period {
  font-family: var(--font-type);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--red);
}
.diploma__degree {
  margin-top: 0.2rem !important;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.45rem;
  line-height: 1.1;
  text-transform: uppercase;
}
.diploma__school {
  font-weight: 700;
  letter-spacing: 0.04em;
}
.diploma__note {
  margin-top: 0.3rem !important;
  font-size: 0.88rem;
  color: #555;
}
.diploma__detail {
  margin-top: 0.5rem !important;
  font-size: 0.92rem;
  line-height: 1.5;
}
.diploma__gpa {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 5.2rem;
  height: 5.2rem;
  font-family: var(--font-display);
  font-size: 1.5rem;
  line-height: 1;
  color: var(--paper);
  background: var(--ink);
  clip-path: polygon(50% 0, 61% 18%, 82% 10%, 82% 32%, 100% 40%, 88% 58%, 96% 80%, 74% 82%, 62% 100%, 46% 88%, 26% 96%, 22% 76%, 2% 68%, 12% 48%, 4% 26%, 26% 22%);
}
.diploma__gpa small {
  margin-bottom: 0.1rem;
  font-size: 0.62rem;
  letter-spacing: 0.15em;
  color: var(--red);
}
@media (max-width: 560px) {
  .diploma { padding-right: 1.3rem; padding-top: 5.4rem; }
}

/* ── Records ── */
.records {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
@media (min-width: 900px) {
  .records { grid-template-columns: repeat(4, 1fr); }
}
.record {
  padding: 1rem 1.2rem;
  background: var(--ink);
  border-left: 6px solid var(--red);
  transform: skewX(-6deg);
}
.record > * {
  transform: skewX(6deg);
}
.record__value {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 2.8rem);
  line-height: 1;
  color: var(--red);
}
.record__label {
  margin: 0.3rem 0 0.1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.record__desc {
  margin: 0;
  font-size: 0.82rem;
  color: var(--muted);
}
</style>
