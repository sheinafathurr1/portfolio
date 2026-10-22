<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import ScreenShell from '../components/ScreenShell.vue'
import RansomText from '../components/RansomText.vue'
import { useFocus } from '../composables/focus'
import { inputBlocked } from '../composables/nav'
import { clearRequest } from '../composables/requests'
import { sfx } from '../composables/sfx'
import { useListNav } from '../composables/useListNav'
import { projects, type Project } from '../data/portfolio'

// ── Filter tabs (← → / A D) ──
const FILTERS: { id: 'all' | Project['category']; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'client', label: 'Client' },
  { id: 'research', label: 'Research' },
]
const filter = ref<(typeof FILTERS)[number]['id']>('all')
const visible = computed(() => (filter.value === 'all' ? projects : projects.filter((p) => p.category === filter.value)))
const countFor = (id: (typeof FILTERS)[number]['id']) => (id === 'all' ? projects.length : projects.filter((p) => p.category === id).length)

const { index, select } = useListNav(() => visible.value.length)
const active = computed(() => visible.value[index.value] ?? visible.value[0] ?? projects[0]!)

let keepSelection = false
watch(filter, () => {
  if (keepSelection) keepSelection = false
  else index.value = 0
})
const setFilter = (id: (typeof FILTERS)[number]['id']) => {
  if (id === filter.value) return
  filter.value = id
  sfx.move()
}

const onKey = (e: KeyboardEvent) => {
  if (inputBlocked(e)) return
  const n = FILTERS.length
  const at = FILTERS.findIndex((f) => f.id === filter.value)
  const key = e.key.toLowerCase()
  if (key === 'arrowright' || key === 'd') setFilter(FILTERS[(at + 1) % n]!.id)
  if (key === 'arrowleft' || key === 'a') setFilter(FILTERS[(at - 1 + n) % n]!.id)
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

// ── Search results and #/missions/10 links land on a specific mission ──
const list = ref<HTMLElement | null>(null)
useFocus('missions', (key) => {
  const id = Number(key)
  if (!visible.value.some((p) => p.id === id) && filter.value !== 'all') {
    keepSelection = true
    filter.value = 'all'
  }
  const i = projects.filter((p) => filter.value === 'all' || p.category === filter.value).findIndex((p) => p.id === id)
  if (i < 0) return
  index.value = i
  nextTick(() => list.value?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' }))
})

// Keep the address bar pointing at the selected mission, so it can be shared as-is
watch(
  active,
  (p) => {
    if (window.location.hash.startsWith('#/missions')) history.replaceState(history.state, '', `#/missions/${p.id}`)
  },
  { immediate: true },
)

const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout>
const shareLink = () => {
  const url = `${window.location.origin}${window.location.pathname}#/missions/${active.value.id}`
  navigator.clipboard
    .writeText(url)
    .then(() => {
      copied.value = true
      sfx.confirm()
      clearRequest('share')
      clearTimeout(copiedTimer)
      copiedTimer = setTimeout(() => { copied.value = false }, 2200)
    })
    .catch(() => {})
}
watch(active, () => { copied.value = false })
onUnmounted(() => clearTimeout(copiedTimer))

const place = (category: string) => (category === 'research' ? 'Palace · Research' : 'Mementos · Client')
const code = (id: number) => `#${String(id).padStart(2, '0')}`
</script>

<template>
  <ScreenShell title="MISSIONS" subtitle="Projects & Research" number="05" :hints="[['←→', 'Filter'], ['↑↓', 'Select Mission']]">
    <div class="filters p5-enter" role="tablist" aria-label="Mission filter">
      <button
        v-for="f in FILTERS"
        :key="f.id"
        role="tab"
        class="filter"
        :class="{ 'is-active': f.id === filter }"
        :aria-selected="f.id === filter"
        @click="setFilter(f.id)"
      >
        {{ f.label }} <span>{{ countFor(f.id) }}</span>
      </button>
    </div>

    <div class="split">
      <ul ref="list" :key="filter" class="mlist" role="listbox" aria-label="Mission list">
        <li v-for="(p, i) in visible" :key="p.id">
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

          <button class="p5-btn p5-btn--light mdetail__share" @click="shareLink">
            {{ copied ? '✔ Link copied' : 'Copy mission link ⧉' }}
          </button>
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
/* The list is long: keep the briefing in view while scrolling it */
@media (min-width: 900px) {
  .mdetail { position: sticky; top: 1rem; }
}
.mdetail__share {
  margin-top: 1.4rem;
  font-size: 0.95rem;
}

/* ── Filter tabs ── */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.4rem;
}
.filter {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  border: 0;
  padding: 0.45rem 1.4rem 0.45rem 0.9rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--paper);
  background: rgba(255, 255, 255, 0.08);
  clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%);
  transition: background-color 0.12s ease;
}
.filter span {
  padding: 0 0.4rem;
  font-size: 0.85rem;
  color: var(--ink);
  background: var(--paper);
}
.filter.is-active {
  background: var(--red);
}
@media (max-width: 560px) {
  .filter { gap: 0.4rem; padding: 0.35rem 1rem 0.35rem 0.7rem; font-size: 1rem; }
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
