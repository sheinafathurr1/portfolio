<script setup lang="ts">
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import RansomText from './RansomText.vue'
import { requestFocus } from '../composables/focus'
import { NAV } from '../composables/nav'
import { closeOverlay } from '../composables/overlay'
import { clearRequest } from '../composables/requests'
import { sfx } from '../composables/sfx'
import { highlight, search, type SearchEntry, type SearchKind } from '../data/search'

// "Third Eye": search everything (missions, jobs, skills, papers…) and jump straight to it.
const nav = inject(NAV)
const query = ref('')
const cursor = ref(0)
const input = ref<HTMLInputElement | null>(null)
const list = ref<HTMLElement | null>(null)

const results = computed(() => search(query.value))
watch(results, () => { cursor.value = 0 })

const SUGGESTIONS = ['Laravel', 'IoT', 'DKPP', 'IEEE', 'Flutter', 'Telkom', 'TOPSIS', 'Agentic AI']

const KIND_COLOR: Record<SearchKind, string> = {
  Section: '#ffffff',
  Mission: '#e60012',
  Confidant: '#facc15',
  Skill: '#e879f9',
  Persona: '#38bdf8',
  Paper: '#4ade80',
  Education: '#fb923c',
}

const open = (entry: SearchEntry | undefined) => {
  if (!entry) return
  sfx.confirm()
  clearRequest('search')
  closeOverlay()
  if (entry.kind !== 'Section') requestFocus(entry.target)
  nav?.goTo(entry.target.screen)
}

const move = (dir: 1 | -1) => {
  const n = results.value.length
  if (!n) return
  cursor.value = (cursor.value + dir + n) % n
  sfx.move()
  nextTick(() => list.value?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' }))
}

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    move(1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    move(-1)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    open(results.value[cursor.value])
  }
}

const suggest = (word: string) => {
  query.value = word
  sfx.move()
  input.value?.focus()
}

onMounted(() => nextTick(() => input.value?.focus()))
</script>

<template>
  <div class="eye" role="dialog" aria-modal="true" aria-label="Third Eye search" @click.self="closeOverlay">
    <div class="eye__panel">
      <header class="eye__head">
        <RansomText text="THIRD EYE" :seed="17" size="clamp(1.6rem, 5vw, 2.4rem)" nowrap />
        <p>Search missions, confidants, skills, papers, and more.</p>
      </header>

      <label class="eye__field">
        <span class="sr-only">Search</span>
        <span class="eye__glyph" aria-hidden="true">◉</span>
        <input
          ref="input"
          v-model="query"
          type="search"
          placeholder="Try “Laravel”, “IoT”, “IEEE”…"
          autocomplete="off"
          spellcheck="false"
          role="combobox"
          aria-controls="eye-results"
          :aria-expanded="results.length > 0"
          :aria-activedescendant="results.length ? `eye-${cursor}` : undefined"
          @keydown="onKey"
        />
        <kbd class="p5-kbd">Esc</kbd>
      </label>

      <ul v-if="results.length" id="eye-results" ref="list" class="eye__results" role="listbox">
        <li
          v-for="(r, i) in results"
          :id="`eye-${i}`"
          :key="`${r.kind}-${r.title}`"
          role="option"
          :aria-selected="i === cursor"
          class="hit"
          :class="{ 'is-active': i === cursor }"
          :style="{ '--kind': KIND_COLOR[r.kind] }"
          @mouseenter="cursor = i"
          @click="open(r)"
        >
          <span class="hit__kind">{{ r.kind }}</span>
          <span class="hit__body">
            <span class="hit__title">
              <template v-for="(part, k) in highlight(r.title, query)" :key="k"><mark v-if="part.hit">{{ part.text }}</mark><template v-else>{{ part.text }}</template></template>
            </span>
            <span class="hit__sub">{{ r.sub }}</span>
          </span>
          <span class="hit__go" aria-hidden="true">▶</span>
        </li>
      </ul>

      <p v-else-if="query.trim()" class="eye__empty">Nothing glows for “{{ query }}”. Try another word.</p>

      <div v-else class="eye__suggest">
        <span>Try</span>
        <button v-for="word in SUGGESTIONS" :key="word" class="p5-chip p5-chip--dark eye__chip" @click="suggest(word)">{{ word }}</button>
      </div>

      <p class="eye__foot"><kbd class="p5-kbd">↑↓</kbd> choose <kbd class="p5-kbd">Enter</kbd> open <kbd class="p5-kbd">/</kbd> anywhere to search</p>
    </div>
  </div>
</template>

<style scoped>
/* Third Eye vision: the world drains to blue-grey and only what matters glows */
.eye {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: clamp(1rem, 8vh, 5rem) 1rem 1rem;
  overflow-y: auto;
  background:
    radial-gradient(ellipse at 50% 30%, rgba(230, 0, 18, 0.18), transparent 60%),
    rgba(10, 14, 32, 0.82);
  backdrop-filter: grayscale(1) brightness(0.6);
  -webkit-backdrop-filter: grayscale(1) brightness(0.6);
  animation: eyeIn 0.25s ease-out both;
}
.eye__panel {
  width: min(100%, 680px);
  animation: p5Pop 0.35s var(--snap) both;
}
.eye__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 1rem;
  margin-bottom: 1rem;
}
.eye__head p {
  margin: 0;
  font-family: var(--font-type);
  font-size: 0.9rem;
  color: #cbd5e1;
}

.eye__field {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 1rem;
  background: var(--paper);
  clip-path: polygon(1% 0, 100% 6%, 99% 100%, 0 92%);
  box-shadow: 8px 8px 0 var(--red);
}
.eye__glyph {
  font-size: 1.5rem;
  color: var(--red);
  animation: p5Blink 1.4s steps(2) infinite;
}
.eye__field input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: none;
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 4vw, 1.8rem);
  letter-spacing: 0.03em;
  color: var(--ink);
}
.eye__field input::placeholder {
  font-family: var(--font-body);
  font-size: 1.1rem;
  color: #888;
}
.eye__field input::-webkit-search-cancel-button {
  display: none;
}

.eye__results {
  list-style: none;
  margin: 1.2rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.4rem;
  max-height: min(55vh, 520px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--red) transparent;
}
.hit {
  display: grid;
  grid-template-columns: 6.2rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.8rem;
  padding: 0.55rem 0.9rem;
  cursor: pointer;
  background: rgba(11, 11, 11, 0.9);
  border-left: 4px solid var(--kind);
  transform: skewX(-6deg);
  transition: background-color 0.12s ease, transform 0.15s var(--snap);
}
.hit > * {
  transform: skewX(6deg);
}
.hit.is-active {
  background: var(--paper);
  transform: skewX(-6deg) translateX(6px);
}
.hit__kind {
  justify-self: start;
  padding: 0 0.4rem;
  font-family: var(--font-display);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink);
  background: var(--kind);
}
.hit__body {
  display: grid;
  min-width: 0;
}
.hit__title {
  overflow: hidden;
  font-weight: 700;
  font-size: 1.02rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--paper);
}
.hit__sub {
  overflow: hidden;
  font-size: 0.8rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--muted);
}
.hit.is-active .hit__title {
  color: var(--ink);
}
.hit.is-active .hit__sub {
  color: #555;
}
.hit mark {
  padding: 0 0.1em;
  color: var(--paper);
  background: var(--red);
}
.hit__go {
  color: var(--red);
  opacity: 0;
}
.hit.is-active .hit__go {
  opacity: 1;
}

.eye__empty {
  margin: 1.4rem 0 0;
  font-family: var(--font-marker);
  font-size: 1.1rem;
  color: var(--paper);
}
.eye__suggest {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  margin-top: 1.2rem;
}
.eye__suggest > span {
  font-family: var(--font-marker);
  color: var(--paper);
}
.eye__chip {
  border: 0;
  cursor: pointer;
}
.eye__chip:hover {
  color: var(--paper);
  background: var(--red);
}
.eye__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin: 1.2rem 0 0;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
}
@media (pointer: coarse) {
  .eye__foot,
  .eye__field kbd {
    display: none;
  }
}
@media (max-width: 520px) {
  .hit { grid-template-columns: minmax(0, 1fr) auto; }
  .hit__kind { grid-column: 1 / -1; }
}

@keyframes eyeIn {
  from { opacity: 0; }
}
</style>
