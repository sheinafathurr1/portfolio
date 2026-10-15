<script setup lang="ts">
import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import ScreenShell from '../components/ScreenShell.vue'
import RansomText from '../components/RansomText.vue'
import { NAV, inputBlocked, isActivatable } from '../composables/nav'
import { openOverlay, overlay } from '../composables/overlay'
import { clearRequest } from '../composables/requests'
import { sfx } from '../composables/sfx'
import { useListNav } from '../composables/useListNav'
import { ELEMENTS, ELEMENT_ORDER, battleSkills, shadows, type BattleSkill, type ElementKey, type ShadowType } from '../data/phantom'

// P5-style battle: hitting a Shadow's weakness knocks it DOWN and earns 1 MORE action.
// Miss and the Shadows get back up and strike. Down them all in a row → HOLD UP → All-Out Attack.
type Phase = 'intro' | 'player' | 'busy' | 'holdup' | 'allout' | 'victory' | 'defeat'
type PopKind = 'ambush' | 'weak' | 'more' | 'miss' | 'hit' | 'holdup'
interface Foe extends ShadowType {
  down: boolean
  hit: boolean
  known: Partial<Record<ElementKey, 'weak' | 'normal'>>
}

const MAX_HP = 100
const BEST_KEY = 'p5-battle-best'

const nav = inject(NAV)
const phase = ref<Phase>('intro')
const foes = ref<Foe[]>([])
const target = ref(0)
const hp = ref(MAX_HP)
const turn = ref(1)
const weakHits = ref(0)
const damageTaken = ref(0)
const used = ref<string[]>([])
const log = ref('')
const popup = ref<{ id: number; text: string; kind: PopKind } | null>(null)
const shaking = ref(false)
const newBest = ref(false)
const primaryBtn = ref<HTMLButtonElement | null>(null)

const loadBest = (): number | null => {
  try {
    const n = Number(localStorage.getItem(BEST_KEY))
    return Number.isInteger(n) && n > 0 ? n : null
  } catch {
    return null
  }
}
const best = ref(loadBest())

// Every pending step lives in `timers`, so restarting or leaving the screen cancels the sequence
const timers: ReturnType<typeof setTimeout>[] = []
const later = (ms: number) => new Promise<void>((resolve) => timers.push(setTimeout(resolve, ms)))
const cancelAll = () => {
  timers.forEach(clearTimeout)
  timers.length = 0
}

let popSeq = 0
const flash = (text: string, kind: PopKind, ms = 750) => {
  const id = ++popSeq
  popup.value = { id, text, kind }
  timers.push(setTimeout(() => { if (popup.value?.id === id) popup.value = null }, ms))
}

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)]!
}

// One Shadow per element, in random order
const newFoes = (): Foe[] =>
  ELEMENT_ORDER.map((el) => pick(shadows.filter((s) => s.weak === el)))
    .sort(() => Math.random() - 0.5)
    .map((s) => ({ ...s, down: false, hit: false, known: {} }))

const { index: skillIndex, select: selectSkill } = useListNav(() => battleSkills.length, { onEnter: () => act() })
const skill = computed(() => battleSkills[skillIndex.value] ?? battleSkills[0]!)

/** Move the cursor to the next Shadow that is still standing. */
const retarget = (dir: 1 | -1) => {
  const n = foes.value.length
  for (let k = 1; k <= n; k++) {
    const i = (((target.value + dir * k) % n) + n) % n
    if (!foes.value[i]?.down) {
      target.value = i
      return
    }
  }
}

const moveTarget = (dir: 1 | -1) => {
  if (phase.value !== 'player') return
  retarget(dir)
  sfx.move()
}

const aim = (i: number) => {
  if (phase.value !== 'player' || foes.value[i]?.down || i === target.value) return
  target.value = i
  sfx.move()
}

async function start() {
  cancelAll()
  foes.value = newFoes()
  target.value = 0
  hp.value = MAX_HP
  turn.value = 1
  weakHits.value = 0
  damageTaken.value = 0
  used.value = []
  newBest.value = false
  phase.value = 'intro'
  log.value = 'Shadows have ambushed the codebase!'
  flash('AMBUSH!', 'ambush', 950)
  await later(1000)
  phase.value = 'player'
  log.value = 'Pick a skill and hit each Shadow’s weakness. Every weakness you hit earns 1 MORE action.'
}

async function act(chosen: BattleSkill = skill.value) {
  if (phase.value !== 'player') return
  const foe = foes.value[target.value]
  if (!foe || foe.down) return
  phase.value = 'busy'
  if (!used.value.includes(chosen.name)) used.value = [...used.value, chosen.name]
  log.value = `Switch used ${chosen.name}!`
  sfx.confirm()
  await later(380)

  foe.hit = true
  timers.push(setTimeout(() => { foe.hit = false }, 420))

  if (chosen.element === foe.weak) {
    foe.known[chosen.element] = 'weak'
    foe.down = true
    weakHits.value++
    sfx.slam()
    flash('WEAK!', 'weak')
    log.value = `${chosen.name} hit ${foe.name}’s weakness. It’s down!`
    await later(800)
    if (foes.value.every((f) => f.down)) {
      flash('HOLD UP!', 'holdup', 900)
      log.value = 'Every Shadow is down and surrounded!'
      await later(900)
      popup.value = null
      phase.value = 'holdup'
      return
    }
    flash('1 MORE!', 'more', 650)
    log.value = '1 MORE! Strike the next Shadow before it gets up.'
    retarget(1)
    await later(550)
    phase.value = 'player'
  } else {
    foe.known[chosen.element] = 'normal'
    flash('NOT WEAK', 'miss', 800)
    log.value = `${foe.name} shrugged off ${chosen.name}. That’s not its weakness…`
    await later(1000)
    await enemyTurn()
  }
}

async function enemyTurn() {
  if (foes.value.some((f) => f.down)) {
    foes.value.forEach((f) => { f.down = false })
    log.value = 'The Shadows got back up!'
    await later(750)
  }
  const attacker = pick(foes.value)
  const dmg = 8 + Math.floor(Math.random() * 8)
  hp.value = Math.max(0, hp.value - dmg)
  damageTaken.value += dmg
  shaking.value = true
  timers.push(setTimeout(() => { shaking.value = false }, 450))
  sfx.hit()
  flash(`-${dmg} HP`, 'hit', 900)
  log.value = `${attacker.name} ${attacker.attack}! Switch takes ${dmg} damage.`
  await later(1300)
  if (hp.value <= 0) {
    phase.value = 'defeat'
    log.value = 'Switch is down…'
    return
  }
  turn.value++
  log.value = `Turn ${turn.value}. Your move. Which kind of skill would actually fix these problems?`
  phase.value = 'player'
}

function allOut() {
  if (phase.value !== 'holdup') return
  phase.value = 'allout'
  sfx.confirm()
  openOverlay('attack')
}

function win() {
  phase.value = 'victory'
  sfx.rankUp()
  newBest.value = best.value === null || turn.value < best.value
  if (newBest.value) {
    best.value = turn.value
    try {
      localStorage.setItem(BEST_KEY, String(turn.value))
    } catch {
      // storage blocked: the record just won't persist
    }
  }
  log.value = `Victory in ${turn.value} turn${turn.value === 1 ? '' : 's'}!`
  clearRequest('hunter')
  if (turn.value === 1) clearRequest('technical')
}

// The All-Out Attack plays as a global overlay; the results show once it closes
watch(overlay, (now) => {
  if (now === 'none' && phase.value === 'allout') win()
})

// Put keyboard focus on the main button of each result panel
watch(phase, (p) => {
  if (p === 'holdup' || p === 'victory' || p === 'defeat') nextTick(() => primaryBtn.value?.focus({ preventScroll: true }))
})

const useSkill = (i: number) => {
  selectSkill(i)
  act(battleSkills[i])
}

const goSkills = () => {
  sfx.confirm()
  nav?.goTo('skill')
}

const onKey = (e: KeyboardEvent) => {
  if (inputBlocked(e)) return
  const key = e.key.toLowerCase()
  if (key === 'arrowleft' || key === 'a') {
    e.preventDefault()
    moveTarget(-1)
  } else if (key === 'arrowright' || key === 'd') {
    e.preventDefault()
    moveTarget(1)
  } else if (key === 'enter' && !isActivatable(e)) {
    if (phase.value === 'holdup') allOut()
    else if (phase.value === 'victory' || phase.value === 'defeat') start()
  } else if (key === 'r' && (phase.value === 'victory' || phase.value === 'defeat')) {
    start()
  }
}

const usedLabel = computed(() => used.value.join(', '))

onMounted(() => {
  start()
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  cancelAll()
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <ScreenShell
    title="BATTLE"
    subtitle="Shadow Mini-Game"
    number="07"
    :hints="[['←→', 'Target'], ['↑↓', 'Skill'], ['Enter', 'Attack']]"
  >
    <div class="battle" :class="{ 'is-shaking': shaking }">
      <!-- Arena -->
      <section class="arena p5-enter" aria-label="Shadows">
        <button
          v-for="(f, i) in foes"
          :key="f.id"
          class="foe"
          :class="{ 'is-target': i === target && phase === 'player', 'is-down': f.down, 'is-hit': f.hit }"
          :style="{ '--i': i }"
          :aria-disabled="f.down || phase !== 'player'"
          :aria-label="`${f.name}${f.down ? ', down' : ''}${i === target ? ', targeted' : ''}`"
          @click="aim(i)"
        >
          <span class="foe__cursor" aria-hidden="true">▼</span>
          <span class="foe__body" aria-hidden="true">
            <span class="foe__fig">
              <span class="foe__blob"></span>
              <span class="foe__eyes"><i></i><i></i></span>
              <span class="foe__icon">{{ f.icon }}</span>
            </span>
          </span>
          <span class="foe__name">{{ f.name }}</span>
          <span class="foe__lore">{{ f.lore }}</span>
          <span class="foe__aff">
            <span v-for="el in ELEMENT_ORDER" :key="el" class="aff" :class="f.known[el] && `aff--${f.known[el]}`">
              <b :style="{ background: ELEMENTS[el].color }">{{ ELEMENTS[el].tag }}</b>
              {{ f.known[el] === 'weak' ? 'WK' : f.known[el] === 'normal' ? '—' : '?' }}
            </span>
          </span>
          <span v-if="f.down" class="foe__down">DOWN</span>
        </button>

        <Transition name="bpop">
          <p v-if="popup" :key="popup.id" class="bpop" :class="`bpop--${popup.kind}`" aria-hidden="true">{{ popup.text }}</p>
        </Transition>
      </section>

      <!-- Battle log -->
      <p class="blog" aria-live="polite"><span aria-hidden="true">▶</span>{{ log }}</p>

      <!-- Commands -->
      <section class="command">
        <div class="party p5-enter" :class="{ 'party--danger': hp <= 30 }" style="--i: 1">
          <p class="party__name">SWITCH <span>Turn {{ turn }}</span></p>
          <div class="party__hp">
            <b>HP</b>
            <div class="p5-bar"><span :style="{ width: `${hp}%` }"></span></div>
            <small>{{ hp }}/{{ MAX_HP }}</small>
          </div>
          <p class="party__best">Best record: <b>{{ best ? `${best} turn${best === 1 ? '' : 's'}` : '—' }}</b></p>
          <p class="party__tip">Each Shadow is a real dev problem. Which kind of skill would fix it?</p>
        </div>

        <ul class="skills p5-enter" style="--i: 2" role="listbox" aria-label="Skills">
          <li v-for="(s, i) in battleSkills" :key="s.name">
            <button
              class="skillbtn"
              :class="{ 'is-active': i === skillIndex }"
              role="option"
              :aria-selected="i === skillIndex"
              :aria-disabled="phase !== 'player'"
              @mouseenter="selectSkill(i)"
              @focus="selectSkill(i)"
              @click="useSkill(i)"
            >
              <b class="skillbtn__el" :style="{ background: ELEMENTS[s.element].color }">{{ ELEMENTS[s.element].tag }}</b>
              <span class="skillbtn__name">{{ s.name }}</span>
              <span class="skillbtn__lv">LV {{ s.level }}</span>
            </button>
          </li>
        </ul>
      </section>
    </div>

    <!-- Hold up / results -->
    <Teleport to="body">
      <div v-if="phase === 'holdup' || phase === 'victory' || phase === 'defeat'" class="bpanel-layer">
        <div class="bpanel-wrap" :class="`bpanel-wrap--${phase}`">
          <div v-if="phase === 'holdup'" class="bpanel bpanel--holdup" role="dialog" aria-label="Hold up">
            <RansomText text="HOLD UP!" :seed="13" size="clamp(2.2rem, 8vw, 4rem)" nowrap />
            <p class="bpanel__lead">Every Shadow is down and surrounded. Finish them in style?</p>
            <button ref="primaryBtn" class="p5-btn" @click="allOut">All-Out Attack ▶</button>
          </div>

          <div v-else-if="phase === 'victory'" class="bpanel" role="dialog" aria-label="Victory">
            <RansomText text="VICTORY!" :seed="31" size="clamp(2.2rem, 8vw, 4rem)" nowrap />
            <span v-if="newBest" class="bpanel__record p5-stamp">New record</span>
            <dl class="results">
              <dt>Turns</dt><dd>{{ turn }}</dd>
              <dt>Weakness hits</dt><dd>{{ weakHits }}</dd>
              <dt>Damage taken</dt><dd>{{ damageTaken }}</dd>
              <dt>Best record</dt><dd>{{ best }} turn{{ best === 1 ? '' : 's' }}</dd>
            </dl>
            <p class="bpanel__used">Skills used: {{ usedLabel }}</p>
            <div class="bpanel__actions">
              <button ref="primaryBtn" class="p5-btn" @click="start">Fight again ↺</button>
              <button class="p5-btn p5-btn--red" @click="goSkills">See all skills ▶</button>
            </div>
          </div>

          <div v-else class="bpanel" role="dialog" aria-label="Defeat">
            <RansomText text="KNOCKED OUT" :seed="4" size="clamp(1.9rem, 7vw, 3.4rem)" />
            <p class="bpanel__lead">Don’t worry. Shadows can’t delete commits.</p>
            <p class="bpanel__used">Hint: Spaghetti Code fears clean backend work, busywork fears automation, clunky UIs fear good frontend.</p>
            <button ref="primaryBtn" class="p5-btn" @click="start">Retry ↺</button>
          </div>
        </div>
      </div>
    </Teleport>
  </ScreenShell>
</template>

<style scoped>
.battle {
  display: grid;
  gap: 1rem;
}
.battle.is-shaking {
  animation: p5Shake 0.4s linear;
}

/* ── Arena ── */
.arena {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.4rem, 2vw, 1.6rem);
  padding: 2.6rem clamp(0.4rem, 2.5vw, 2rem) 1.4rem;
  background:
    radial-gradient(ellipse 70% 55% at 50% 100%, rgba(230, 0, 18, 0.5), transparent 70%),
    repeating-linear-gradient(-28deg, transparent 0 26px, rgba(255, 255, 255, 0.03) 26px 30px),
    #121212;
  clip-path: polygon(0 2%, 100% 0, 99% 100%, 1% 97%);
}

.foe {
  position: relative;
  display: grid;
  justify-items: center;
  align-content: start;
  gap: 0.4rem;
  min-width: 0;
  border: 0;
  padding: 0.3rem 0.1rem 0.6rem;
  text-align: center;
  color: var(--paper);
  background: none;
}
.foe[aria-disabled='true'] {
  cursor: default;
}
.foe__cursor {
  position: absolute;
  top: -1.9rem;
  left: 50%;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--red);
  text-shadow: 2px 2px 0 var(--ink);
  opacity: 0;
  transform: translateX(-50%);
}
.foe.is-target .foe__cursor {
  opacity: 1;
  animation: cursorBob 0.55s ease-in-out infinite alternate;
}

.foe__body {
  position: relative;
  width: clamp(4.4rem, 15vw, 8.5rem);
  aspect-ratio: 1;
  filter: drop-shadow(0 0 10px rgba(230, 0, 18, 0.6));
  animation: p5Float 3s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.9s);
}
.foe.is-target .foe__body {
  filter: drop-shadow(0 0 14px rgba(255, 255, 255, 0.55));
}
.foe__fig {
  position: absolute;
  inset: 0;
  transition: transform 0.35s var(--snap), opacity 0.2s ease;
}
.foe.is-down .foe__fig {
  opacity: 0.7;
  transform: rotate(-78deg) translate(-16%, 24%) scale(0.86);
}
.foe.is-hit .foe__fig {
  animation: foeHit 0.4s linear;
}
.foe__blob {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 35%, #3a3a3a, #000 68%);
  clip-path: polygon(50% 0, 64% 12%, 84% 6%, 86% 28%, 100% 42%, 90% 60%, 96% 84%, 74% 86%, 60% 100%, 42% 90%, 22% 98%, 16% 78%, 0 66%, 10% 46%, 2% 24%, 24% 18%);
}
.foe__eyes {
  position: absolute;
  top: 28%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 16%;
}
.foe__eyes i {
  width: 17%;
  aspect-ratio: 2 / 1;
  border-radius: 50%;
  background: #ffe14d;
  box-shadow: 0 0 8px #ffe14d;
  transform: rotate(14deg);
}
.foe__eyes i + i {
  transform: rotate(-14deg);
}
.foe.is-down .foe__eyes i {
  background: #777;
  box-shadow: none;
}
.foe__icon {
  position: absolute;
  left: 50%;
  bottom: 14%;
  font-size: clamp(1.5rem, 5vw, 2.8rem);
  line-height: 1;
  transform: translateX(-50%);
}
.foe__name {
  padding: 0.05em 0.45em;
  font-family: var(--font-display);
  font-size: clamp(0.8rem, 2.2vw, 1.25rem);
  line-height: 1.15;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: background-color 0.12s ease, color 0.12s ease;
}
.foe.is-target .foe__name {
  color: var(--ink);
  background: var(--paper);
}
.foe__lore {
  max-width: 15rem;
  font-family: var(--font-type);
  font-size: 0.78rem;
  line-height: 1.35;
  color: var(--muted);
}
@media (max-width: 700px) {
  .foe__lore { display: none; }
}
.foe__aff {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3px;
}
.aff {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1px 5px 1px 1px;
  font-family: var(--font-display);
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  color: var(--muted);
  background: #262626;
}
.aff b {
  padding: 0 3px;
  font-weight: 400;
  color: var(--ink);
}
.aff--weak {
  color: var(--paper);
  background: var(--red);
}
.aff--normal {
  opacity: 0.55;
}
.foe__down {
  position: absolute;
  top: 30%;
  left: 50%;
  padding: 0.05em 0.5em;
  font-family: var(--font-display);
  font-size: clamp(0.9rem, 2.4vw, 1.3rem);
  letter-spacing: 0.1em;
  color: var(--paper);
  background: var(--red);
  box-shadow: 3px 3px 0 var(--ink);
  transform: translateX(-50%) rotate(-12deg);
  animation: downIn 0.3s var(--snap) both;
}

/* Big battle callouts (WEAK!, 1 MORE!, …) */
.bpop {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: grid;
  place-items: center;
  margin: 0;
  pointer-events: none;
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 10vw, 6rem);
  letter-spacing: 0.04em;
  color: var(--paper);
  -webkit-text-stroke: 2px var(--ink);
  text-shadow: 6px 6px 0 var(--ink);
  rotate: -8deg;
}
.bpop--weak { color: #ffe14d; text-shadow: 6px 6px 0 var(--red); }
.bpop--more,
.bpop--holdup { text-shadow: 6px 6px 0 var(--red); }
.bpop--miss { font-size: clamp(1.8rem, 6vw, 3.4rem); color: #c8c8c8; }
.bpop--hit { color: var(--red); }
.bpop--ambush { color: var(--red); text-shadow: 6px 6px 0 var(--paper); }
.bpop-enter-active { transition: transform 0.25s var(--snap), opacity 0.15s ease; }
.bpop-leave-active { transition: opacity 0.2s ease; }
.bpop-enter-from { opacity: 0; transform: scale(2.4); }
.bpop-leave-to { opacity: 0; }

/* ── Log ── */
.blog {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  min-height: 3.4rem;
  margin: 0;
  padding: 0.75rem 1.2rem;
  font-weight: 600;
  font-size: 1.05rem;
  line-height: 1.4;
  color: var(--ink);
  background: var(--paper);
  clip-path: polygon(0 0, 100% 6%, 99% 100%, 1% 94%);
}
.blog span {
  color: var(--red);
}

/* ── Commands ── */
.command {
  display: grid;
  gap: 1rem;
}
@media (min-width: 900px) {
  .command {
    grid-template-columns: 300px 1fr;
    align-items: start;
  }
}
.party {
  padding: 1rem 1.2rem 1.1rem;
  background: var(--ink);
  border-left: 6px solid var(--red);
}
.party__name {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 0 0 0.5rem;
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: 0.08em;
}
.party__name span {
  font-size: 0.95rem;
  color: var(--red);
}
.party__hp {
  display: grid;
  grid-template-columns: 1.8rem 1fr auto;
  align-items: center;
  gap: 0.5rem;
}
.party__hp b {
  font-family: var(--font-display);
  font-weight: 400;
  color: var(--red);
}
.party__hp small {
  font-family: var(--font-display);
  font-size: 0.95rem;
}
.party__hp .p5-bar > span {
  background: #4ade80;
  transition: width 0.4s var(--snap);
}
.party--danger .party__hp .p5-bar > span {
  background: #ff4d4d;
  animation: p5Blink 0.6s steps(2) infinite;
}
.party__best,
.party__tip {
  margin: 0.6rem 0 0;
  font-size: 0.85rem;
  color: var(--muted);
}
.party__best b {
  color: var(--paper);
}
.party__tip {
  font-family: var(--font-type);
}

.skills {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem 0.6rem;
}
@media (min-width: 700px) {
  .skills {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(3, auto);
    grid-auto-flow: column;
  }
}
.skillbtn {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  border: 0;
  padding: 0.55rem 0.75rem;
  text-align: left;
  color: var(--paper);
  background: #1d1d1d;
  transform: skewX(-8deg);
  transition: background-color 0.12s ease, color 0.12s ease, transform 0.15s var(--snap);
}
.skillbtn > * {
  transform: skewX(8deg);
}
.skillbtn.is-active {
  color: var(--ink);
  background: var(--paper);
  transform: skewX(-8deg) translateX(4px);
}
.skillbtn[aria-disabled='true'] {
  opacity: 0.5;
  cursor: wait;
}
.skillbtn__el {
  padding: 0 0.35rem;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.72rem;
  letter-spacing: 0.05em;
  color: var(--ink);
}
.skillbtn__name {
  overflow: hidden;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}
.skillbtn__lv {
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: var(--red);
}
/* Phones: skills sit right under the log (closer to the action) and drop the level to fit full names */
@media (max-width: 699px) {
  .skills { order: -1; }
  .skillbtn { gap: 0.4rem; padding: 0.55rem 0.6rem; }
  .skillbtn__el { font-size: 0.62rem; padding: 0 0.25rem; }
  .skillbtn__name { font-size: 0.88rem; }
  .skillbtn__lv { display: none; }
  .party__tip { display: none; }
}

/* ── Hold up / result panels ── */
.bpanel-layer {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.45);
  animation: fadeIn 0.2s ease both;
}
/* drop-shadow on the wrapper, since clip-path on the panel would cut a box-shadow off */
.bpanel-wrap {
  filter: drop-shadow(12px 12px 0 var(--red));
  rotate: -2deg;
}
.bpanel-wrap--holdup {
  filter: drop-shadow(12px 12px 0 var(--ink));
}
.bpanel {
  display: grid;
  justify-items: center;
  gap: 0.9rem;
  width: min(92vw, 460px);
  padding: 1.6rem 1.6rem 1.8rem;
  text-align: center;
  color: var(--ink);
  background: var(--paper);
  clip-path: polygon(0 3%, 100% 0, 98% 100%, 2% 97%);
  animation: p5Pop 0.45s var(--snap) both;
}
.bpanel--holdup {
  color: var(--paper);
  background: var(--red);
}
.bpanel p {
  margin: 0;
}
.bpanel__lead {
  font-family: var(--font-marker);
  font-size: 1.15rem;
}
.bpanel__record {
  font-size: 1rem;
}
.results {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.3rem 1.4rem;
  width: 100%;
  margin: 0;
  text-align: left;
}
.results dt {
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.results dd {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.15rem;
  text-align: right;
  color: var(--red);
}
.bpanel__used {
  font-family: var(--font-type);
  font-size: 0.85rem;
  color: #555;
}
.bpanel__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
}

@keyframes cursorBob { to { transform: translate(-50%, 6px); } }
@keyframes foeHit {
  0%, 100% { filter: none; translate: 0 0; }
  20% { filter: brightness(4); translate: 6px 0; }
  45% { translate: -6px 0; }
  70% { translate: 4px 0; }
}
@keyframes downIn { from { opacity: 0; scale: 2; } }
@keyframes fadeIn { from { opacity: 0; } }
</style>
