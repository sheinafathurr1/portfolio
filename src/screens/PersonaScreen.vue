<script setup lang="ts">
import { computed } from 'vue'
import ScreenShell from '../components/ScreenShell.vue'
import RansomText from '../components/RansomText.vue'
import { useListNav } from '../composables/useListNav'
import { personas } from '../data/phantom'

const { index, select } = useListNav(() => personas.length)
const active = computed(() => personas[index.value] ?? personas[0]!)
</script>

<template>
  <ScreenShell title="PERSONA" subtitle="Roles & Specialties" number="02" :hints="[['↑↓', 'Select Persona']]">
    <div class="split">
      <!-- Compendium list -->
      <ul class="plist" role="listbox" aria-label="Persona list">
        <li v-for="(p, i) in personas" :key="p.name">
          <button
            class="pcard p5-enter"
            :class="{ 'is-active': i === index }"
            :style="{ '--i': i }"
            role="option"
            :aria-selected="i === index"
            @click="select(i)"
            @mouseenter="select(i)"
          >
            <span class="pcard__arcana">{{ p.arcana }}</span>
            <span class="pcard__icon" aria-hidden="true">{{ p.icon }}</span>
            <span class="pcard__name">{{ p.name }}</span>
            <span class="pcard__lv">LV {{ p.level }}</span>
          </button>
        </li>
      </ul>

      <!-- Detail -->
      <Transition name="swap" mode="out-in">
        <article :key="active.name" class="pdetail">
          <div class="pdetail__head">
            <div class="tarot" aria-hidden="true">
              <span class="tarot__num">{{ active.arcana }}</span>
              <span class="tarot__icon">{{ active.icon }}</span>
              <span class="tarot__name">{{ active.arcanaName }}</span>
            </div>
            <div>
              <p class="pdetail__arcana">Arcana · {{ active.arcanaName }}</p>
              <h2 class="pdetail__name"><RansomText :text="active.name" :seed="active.level" size="clamp(1.3rem, 4.6vw, 2.8rem)" /></h2>
              <p class="pdetail__lv">LV <b>{{ active.level }}</b> <small>avg. of core skills</small></p>
            </div>
          </div>

          <p class="pdetail__desc">{{ active.desc }}</p>

          <h3 class="p5-label pdetail__h">Stats</h3>
          <ul class="pstats">
            <li v-for="s in active.stats" :key="s.name">
              <span class="pstats__name">{{ s.name }}</span>
              <div class="p5-bar"><span :style="{ width: `${s.level}%` }"></span></div>
              <span class="pstats__val">{{ s.level }}</span>
            </li>
          </ul>

          <h3 class="p5-label pdetail__h">Traits</h3>
          <div class="ptraits">
            <span v-for="t in active.traits" :key="t" class="p5-chip">{{ t }}</span>
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
  .split { grid-template-columns: minmax(280px, 380px) 1fr; align-items: start; }
}

.plist {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.6rem;
}
.pcard {
  position: relative;
  display: grid;
  grid-template-columns: 2.8rem 2rem 1fr auto;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  border: 0;
  padding: 0.75rem 1.2rem 0.75rem 0.9rem;
  text-align: left;
  color: var(--paper);
  background: rgba(255, 255, 255, 0.06);
  clip-path: polygon(0 0, 100% 6%, 97% 100%, 1% 94%);
  transition: background-color 0.12s ease, transform 0.18s var(--snap);
}
.pcard.is-active {
  color: var(--ink);
  background: var(--paper);
  transform: translateX(10px) rotate(-1.5deg);
}
.pcard__arcana {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--red);
}
.pcard__icon {
  font-size: 1.4rem;
}
.pcard__name {
  font-family: var(--font-display);
  font-size: 1.25rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.pcard__lv {
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.05rem 0.5rem;
  color: var(--paper);
  background: var(--red);
}

.pdetail {
  padding: 1.6rem 1.8rem 2rem;
  background: var(--ink);
  border: 2px solid rgba(255, 255, 255, 0.12);
  clip-path: polygon(0 0, 100% 2%, 98% 100%, 2% 98%);
}
.pdetail__head {
  display: flex;
  gap: 1.4rem;
  align-items: center;
  margin-bottom: 1.2rem;
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
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.pdetail__arcana {
  margin: 0;
  font-family: var(--font-type);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--red);
}
.pdetail__name {
  margin: 0.3rem 0;
  font-weight: 400;
}
.pdetail__lv {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: 0.08em;
}
.pdetail__lv b {
  font-weight: 400;
  font-size: 1.6rem;
  color: var(--red);
}
.pdetail__lv small {
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: var(--muted);
}
.pdetail__desc {
  margin: 0 0 1.4rem;
  font-size: 1.08rem;
  line-height: 1.6;
  color: #e5e5e5;
}
.pdetail__h {
  margin: 0 0 0.6rem;
  color: var(--red);
  font-size: 1.15rem;
}
.pstats {
  list-style: none;
  margin: 0 0 1.4rem;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}
.pstats li {
  display: grid;
  grid-template-columns: 9.5rem 1fr 2.2rem;
  align-items: center;
  gap: 0.8rem;
}
.pstats__name {
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 0.9rem;
}
.pstats__val {
  font-family: var(--font-display);
  text-align: right;
  color: var(--red);
}
.ptraits {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.swap-enter-active, .swap-leave-active { transition: opacity 0.14s ease, transform 0.2s var(--snap); }
.swap-enter-from { opacity: 0; transform: translateX(30px) skewX(-6deg); }
.swap-leave-to { opacity: 0; transform: translateX(-20px); }
</style>
