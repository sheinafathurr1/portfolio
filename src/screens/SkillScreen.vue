<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import ScreenShell from '../components/ScreenShell.vue'
import { useFocus } from '../composables/focus'
import { inputBlocked } from '../composables/nav'
import { sfx } from '../composables/sfx'
import { useListNav } from '../composables/useListNav'
import { elementOf, rankLabel } from '../data/phantom'
import { experiences, projects, skillCategories } from '../data/portfolio'

const tab = ref(0)
const category = computed(() => skillCategories[tab.value] ?? skillCategories[0]!)
// Each category is presented like a P5 skill element
const element = computed(() => elementOf(category.value.key))

const { index, select } = useListNav(() => category.value.skills.length)
watch(tab, () => { index.value = 0 })

// Search results land on a specific skill: switch to its tab, then select it
useFocus('skill', (key) => {
  const t = skillCategories.findIndex((c) => c.skills.some((s) => s.name === key))
  if (t < 0) return
  tab.value = t
  nextTick(() => {
    index.value = Math.max(0, skillCategories[t]!.skills.findIndex((s) => s.name === key))
  })
})
const active = computed(() => category.value.skills[index.value] ?? category.value.skills[0]!)

const setTab = (i: number) => {
  if (i === tab.value) return
  tab.value = i
  sfx.move()
}

const onKey = (e: KeyboardEvent) => {
  if (inputBlocked(e)) return
  const n = skillCategories.length
  const key = e.key.toLowerCase()
  if (key === 'arrowright' || key === 'd') setTab((tab.value + 1) % n)
  if (key === 'arrowleft' || key === 'a') setTab((tab.value - 1 + n) % n)
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

// Where is this skill actually used? (matches experience/project tags)
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const matches = (skill: string, tag: string) => {
  const a = norm(skill)
  const b = norm(tag)
  return a === b || a.startsWith(`${b} `) || b.startsWith(`${a} `)
}
const usedIn = computed(() => [
  ...experiences
    .filter((e) => e.tags.some((t) => matches(active.value.name, t)))
    .map((e) => ({ kind: 'Confidant', label: `${e.company} · ${e.title}` })),
  ...projects
    .filter((p) => p.tags.some((t) => matches(active.value.name, t)))
    .map((p) => ({ kind: 'Mission', label: p.title })),
])
</script>

<template>
  <ScreenShell title="SKILL" subtitle="Skills & Tech" number="03" :hints="[['←→', 'Category'], ['↑↓', 'Select Skill']]">
    <div class="tabs p5-enter" role="tablist" aria-label="Skill categories">
      <button
        v-for="(cat, i) in skillCategories"
        :key="cat.key"
        role="tab"
        class="tab"
        :class="{ 'is-active': i === tab }"
        :aria-selected="i === tab"
        @click="setTab(i)"
      >
        <span class="tab__el" :style="{ background: elementOf(cat.key).color }">{{ elementOf(cat.key).tag }}</span>
        {{ cat.short }}
      </button>
    </div>

    <div class="split">
      <Transition name="swap" mode="out-in">
        <ul :key="category.key" class="slist" role="listbox" :aria-label="category.label">
          <li v-for="(s, i) in category.skills" :key="s.name">
            <button
              class="srow p5-enter"
              :class="{ 'is-active': i === index }"
              :style="{ '--i': i }"
              role="option"
              :aria-selected="i === index"
              @click="select(i)"
              @mouseenter="select(i)"
            >
              <span class="srow__el" :style="{ background: element.color }" aria-hidden="true"></span>
              <span class="srow__name">{{ s.name }}</span>
              <span class="srow__lv">LV {{ s.level }}</span>
            </button>
          </li>
        </ul>
      </Transition>

      <Transition name="swap" mode="out-in">
        <article :key="`${category.key}-${active.name}`" class="sdetail">
          <p class="sdetail__el"><span :style="{ background: element.color }">{{ element.tag }}</span> {{ category.label }}</p>
          <h2 class="sdetail__name">{{ active.name }}</h2>
          <p class="sdetail__rank">{{ rankLabel(active.level) }}</p>
          <div class="sdetail__meter">
            <div class="p5-bar"><span :style="{ width: `${active.level}%` }"></span></div>
            <b>{{ active.level }}%</b>
          </div>
          <h3 class="p5-label sdetail__h">Used in</h3>
          <ul v-if="usedIn.length" class="sdetail__used">
            <li v-for="u in usedIn" :key="u.label">
              <span class="p5-chip p5-chip--red">{{ u.kind }}</span> {{ u.label }}
            </li>
          </ul>
          <p v-else class="sdetail__none">Not tied to a specific confidant or mission yet.</p>
        </article>
      </Transition>
    </div>
  </ScreenShell>
</template>

<style scoped>
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.4rem;
}
.tab {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 0;
  padding: 0.45rem 1.4rem 0.45rem 0.8rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--paper);
  background: rgba(255, 255, 255, 0.08);
  clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%);
  transition: background-color 0.12s ease, color 0.12s ease;
}
.tab.is-active {
  color: var(--paper);
  background: var(--red);
}
.tab__el {
  padding: 0.05rem 0.4rem;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.65rem;
  color: var(--ink);
}

.split {
  display: grid;
  gap: 1.6rem;
}
@media (min-width: 900px) {
  .split { grid-template-columns: minmax(300px, 440px) 1fr; align-items: start; }
}

.slist {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.35rem;
}
.srow {
  display: grid;
  grid-template-columns: 1rem 1fr auto;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  border: 0;
  padding: 0.55rem 1.1rem;
  text-align: left;
  color: var(--paper);
  background: rgba(255, 255, 255, 0.05);
  transform: skewX(-10deg);
  transition: background-color 0.1s ease, transform 0.18s var(--snap);
}
.srow.is-active {
  color: var(--ink);
  background: var(--paper);
  transform: skewX(-10deg) translateX(10px);
}
.srow__el {
  width: 0.9rem;
  height: 0.9rem;
  transform: rotate(45deg);
}
.srow__name {
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.srow__lv {
  font-family: var(--font-display);
  color: var(--red);
}

.sdetail {
  padding: 1.6rem 1.8rem 2rem;
  color: var(--ink);
  background: var(--paper);
  clip-path: polygon(0 2%, 100% 0, 98% 100%, 1% 97%);
  box-shadow: 10px 10px 0 var(--red);
}
.sdetail__el {
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #555;
}
.sdetail__el span {
  margin-right: 0.4rem;
  padding: 0.05rem 0.45rem;
  font-size: 0.75rem;
  color: var(--ink);
}
.sdetail__name {
  margin: 0.3rem 0 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.4rem, 6vw, 3.6rem);
  line-height: 1;
  text-transform: uppercase;
}
.sdetail__rank {
  margin: 0.2rem 0 1rem;
  font-family: var(--font-marker);
  font-size: 1.3rem;
  color: var(--red);
}
.sdetail__meter {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.4rem;
}
.sdetail__meter .p5-bar {
  height: 1rem;
  background: rgba(0, 0, 0, 0.12);
}
.sdetail__meter b {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.6rem;
}
.sdetail__h {
  margin: 0 0 0.6rem;
  color: var(--red);
}
.sdetail__used {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
  font-weight: 500;
}
.sdetail__used .p5-chip {
  margin-right: 0.4rem;
  font-size: 0.7rem;
}
.sdetail__none {
  margin: 0;
  color: #666;
  font-family: var(--font-type);
}

.swap-enter-active, .swap-leave-active { transition: opacity 0.14s ease, transform 0.2s var(--snap); }
.swap-enter-from { opacity: 0; transform: translateX(30px) skewX(-6deg); }
.swap-leave-to { opacity: 0; transform: translateX(-20px); }
</style>
