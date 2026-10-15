<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { BOND_MAX, bondRank, resetBond } from '../composables/bond'
import { closeOverlay } from '../composables/overlay'
import { REQUESTS, clearedCount, resetRequests } from '../composables/requests'
import { sfx, sfxEnabled, toggleSfx } from '../composables/sfx'
import { menuItems } from '../data/phantom'

const controls: [string, string][] = [
  ['↑ ↓  /  W S', 'Move the cursor'],
  ['Enter', 'Open / confirm / attack'],
  ['Esc', 'Back / close'],
  ['Q  /  E', 'Previous / next section'],
  [`1 – ${menuItems.length}`, 'Jump straight to a section'],
  ['← →  /  A D', 'Skill tabs · Battle target'],
  ['R', 'Fight again (Battle)'],
  ['C', 'Open Phan-Chat'],
  ['?', 'This screen'],
]

const closeBtn = ref<HTMLButtonElement | null>(null)
const resetDone = ref(false)
const reset = () => {
  resetBond()
  resetRequests()
  resetDone.value = true
  sfx.back()
}

onMounted(() => closeBtn.value?.focus())
</script>

<template>
  <div class="layer" role="dialog" aria-modal="true" aria-label="Controls and settings" @click.self="closeOverlay">
    <div class="help">
      <header class="help__head">
        <h2>Controls</h2>
        <button ref="closeBtn" class="help__close" aria-label="Close" @click="closeOverlay">✕</button>
      </header>

      <ul class="help__list">
        <li v-for="[keys, label] in controls" :key="keys">
          <kbd>{{ keys }}</kbd>
          <span>{{ label }}</span>
        </li>
      </ul>
      <p class="help__touch">On a phone: tap to choose, swipe left or right to change section.</p>

      <h3>Your progress</h3>
      <dl class="help__progress">
        <dt>Bond with Switch</dt>
        <dd>{{ bondRank >= BOND_MAX ? 'MAX' : `Rank ${bondRank}` }} <small>/ {{ BOND_MAX }}</small></dd>
        <dt>Mementos Requests</dt>
        <dd>{{ clearedCount }} <small>/ {{ REQUESTS.length }} cleared · list in the Thieves Den</small></dd>
      </dl>

      <h3>Settings</h3>
      <div class="help__settings">
        <button class="p5-btn p5-btn--red" :aria-pressed="sfxEnabled" @click="toggleSfx">SFX &amp; haptics: {{ sfxEnabled ? 'ON' : 'OFF' }}</button>
        <button class="p5-btn p5-btn--light" @click="reset">{{ resetDone ? 'Progress reset ✔' : 'Reset progress' }}</button>
      </div>

      <p class="help__secret">★ Rumor has it a certain old-school cheat code unleashes an <b>All-Out Attack</b>…</p>
    </div>
  </div>
</template>

<style scoped>
.layer {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 1rem;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.7);
}
.help {
  width: min(94vw, 560px);
  padding: 1.6rem 1.8rem 1.8rem;
  color: var(--ink);
  background: var(--paper);
  clip-path: polygon(0 2%, 100% 0, 98.5% 100%, 1% 98%);
  box-shadow: 14px 14px 0 var(--red);
  transform: rotate(-1.5deg);
  animation: p5Pop 0.4s var(--snap) both;
}
.help__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.help h2,
.help h3 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.help h2 {
  font-size: 2.4rem;
  color: var(--red);
  text-shadow: 3px 3px 0 var(--ink);
}
.help h3 {
  margin: 1.4rem 0 0.7rem;
  font-size: 1.3rem;
}
.help__close {
  border: 0;
  width: 2.4rem;
  height: 2.4rem;
  color: var(--paper);
  background: var(--ink);
  clip-path: polygon(10% 0, 100% 8%, 90% 100%, 0 92%);
}
.help__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.45rem;
}
.help__list li {
  display: grid;
  grid-template-columns: 9.5rem 1fr;
  align-items: center;
  gap: 0.8rem;
  font-weight: 500;
}
.help__list kbd {
  justify-self: start;
  padding: 0.1rem 0.6rem;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--paper);
  background: var(--ink);
  transform: skewX(-10deg);
}
.help__touch {
  margin: 0.9rem 0 0;
  font-family: var(--font-type);
  font-size: 0.85rem;
  color: #555;
}
.help__progress {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.35rem 1rem;
  margin: 0;
}
.help__progress dt {
  font-weight: 600;
}
.help__progress dd {
  margin: 0;
  font-family: var(--font-display);
  color: var(--red);
}
.help__progress small {
  font-family: var(--font-body);
  color: #555;
}
.help__settings {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.help__settings .p5-btn--light {
  background: var(--ink);
  color: var(--paper);
}
.help__secret {
  margin: 1.4rem 0 0;
  font-family: var(--font-marker);
  color: var(--red);
}
</style>
