<script setup lang="ts">
import { inject, onMounted } from 'vue'
import { NAV } from '../composables/nav'
import { clearRequest } from '../composables/requests'
import { sfx } from '../composables/sfx'
import {
  currentFocus,
  experiences,
  highlights,
  milestones,
  profile,
  projects,
  skillCategories,
  socialLinks,
} from '../data/portfolio'

// Recruiter-friendly view: the same content as the game, on one plain page that prints cleanly.
const nav = inject(NAV)
const backToGame = () => {
  sfx.back()
  nav?.goTo('menu')
}
const print = () => {
  sfx.confirm()
  window.print()
}

const links = socialLinks.map((l) => ({
  ...l,
  text: l.href.replace(/^mailto:/, '').replace(/^https?:\/\/(www\.)?/, ''),
}))
const categoryLabel = (c: string) => (c === 'research' ? 'Research' : 'Development')
const siteUrl = window.location.origin + window.location.pathname

onMounted(() => clearRequest('paper'))
</script>

<template>
  <section class="screen resume" tabindex="-1" aria-label="Résumé">
    <div class="resume__bar">
      <button class="p5-btn p5-btn--light" @click="backToGame">◀ Back to the game</button>
      <div class="resume__bar-right">
        <a v-if="profile.cvUrl" :href="profile.cvUrl" target="_blank" class="p5-btn p5-btn--light">Download PDF</a>
        <button class="p5-btn p5-btn--red" @click="print">Print / Save as PDF</button>
      </div>
    </div>

    <article class="cv">
      <header class="cv__head">
        <div>
          <p class="cv__alias">“{{ profile.alias }}”</p>
          <h1 class="cv__name">{{ profile.name }}</h1>
          <p class="cv__roles">{{ profile.roles.join(' · ') }}</p>
        </div>
        <ul class="cv__contact">
          <li v-for="l in links" :key="l.label">
            <span class="cv__icon" aria-hidden="true" v-html="l.icon"></span>
            <a :href="l.href" target="_blank" rel="noopener noreferrer">{{ l.text }}</a>
          </li>
        </ul>
      </header>

      <section class="cv__section">
        <h2>Profile</h2>
        <p>{{ profile.summary }}</p>
        <ul class="cv__highlights">
          <li v-for="h in highlights" :key="h.label">
            <b>{{ h.value }}</b>
            <span>{{ h.label }}</span>
          </li>
        </ul>
      </section>

      <section class="cv__section">
        <h2>Experience</h2>
        <article v-for="e in experiences" :key="e.id" class="cv__item">
          <header class="cv__item-head">
            <h3>{{ e.title }} <span>· {{ e.company }}</span></h3>
            <p class="cv__when">{{ e.period }}</p>
          </header>
          <p>{{ e.description }}</p>
          <p class="cv__tags">{{ e.tags.join(' · ') }}</p>
        </article>
      </section>

      <section class="cv__section">
        <h2>Projects &amp; Research</h2>
        <article v-for="p in projects" :key="p.id" class="cv__item">
          <header class="cv__item-head">
            <h3>{{ p.title }}</h3>
            <p class="cv__when">{{ p.year }} · {{ categoryLabel(p.category) }}</p>
          </header>
          <p>{{ p.fullDesc }}</p>
          <p class="cv__tags">{{ p.tags.join(' · ') }}</p>
        </article>
      </section>

      <section class="cv__section">
        <h2>Skills</h2>
        <div class="cv__skills">
          <div v-for="cat in skillCategories" :key="cat.key">
            <h3>{{ cat.label }}</h3>
            <ul>
              <li v-for="s in cat.skills" :key="s.name">
                <span>{{ s.name }}</span>
                <span class="cv__meter" :aria-label="`${s.level}%`"><i :style="{ width: `${s.level}%` }"></i></span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div class="cv__cols">
        <section class="cv__section">
          <h2>Milestones</h2>
          <ul class="cv__list">
            <li v-for="m in milestones" :key="m.title">
              <b>{{ m.year }}</b> {{ m.title }}
              <small>{{ m.desc }}</small>
            </li>
          </ul>
        </section>
        <section class="cv__section">
          <h2>Currently working on</h2>
          <ul class="cv__list">
            <li v-for="f in currentFocus" :key="f.label">
              <b>{{ f.pct }}%</b> {{ f.label }}
            </li>
          </ul>
        </section>
      </div>

      <footer class="cv__foot">
        Interactive Persona 5 Royal–style version: <a :href="siteUrl">{{ siteUrl.replace(/^https?:\/\//, '') }}</a>
      </footer>
    </article>
  </section>
</template>

<style scoped>
.resume {
  padding: 0 1rem 4rem;
  background:
    radial-gradient(rgba(230, 0, 18, 0.25) 1px, transparent 1.5px) 0 0 / 14px 14px,
    #151515;
}

.resume__bar {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  max-width: 860px;
  margin: 0 auto;
  padding: 0.9rem 0;
  background: linear-gradient(#151515 70%, transparent);
}
.resume__bar-right {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

/* ── The sheet ── */
.cv {
  max-width: 860px;
  margin: 0 auto;
  padding: clamp(1.4rem, 4vw, 3rem);
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.98rem;
  line-height: 1.55;
  color: #1a1a1a;
  background: #fff;
  border-top: 10px solid var(--red);
  box-shadow: 12px 12px 0 var(--red);
}
.cv p {
  margin: 0;
}
.cv a {
  color: inherit;
}

.cv__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem 2rem;
  padding-bottom: 1.2rem;
  border-bottom: 3px solid var(--ink);
}
.cv__alias {
  font-family: var(--font-marker);
  font-size: 1.1rem;
  color: var(--red);
}
.cv__name {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.2rem, 6vw, 3.2rem);
  line-height: 1;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--ink);
}
.cv__roles {
  margin-top: 0.4rem !important;
  font-weight: 600;
  color: #444;
}
.cv__contact {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.3rem;
  align-content: start;
  font-size: 0.9rem;
}
.cv__contact li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.cv__icon {
  display: inline-flex;
  width: 1rem;
  height: 1rem;
  color: var(--red);
}
.cv__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.cv__section {
  margin-top: 1.6rem;
  break-inside: avoid-page;
}
.cv__section h2 {
  display: inline-block;
  margin: 0 0 0.7rem;
  padding: 0.05rem 0.8rem 0.05rem 0.5rem;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.3rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  background: var(--ink);
  border-left: 6px solid var(--red);
}
.cv__highlights {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.6rem;
}
.cv__highlights li {
  display: grid;
  padding: 0.5rem 0.8rem;
  border-left: 4px solid var(--red);
  background: #f5f5f5;
}
.cv__highlights b {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.5rem;
  line-height: 1.1;
  color: var(--red);
}
.cv__highlights span {
  font-size: 0.85rem;
  color: #444;
}

.cv__item {
  padding: 0.2rem 0 0.9rem;
  break-inside: avoid;
}
.cv__item + .cv__item {
  padding-top: 0.9rem;
  border-top: 1px dashed #ccc;
}
.cv__item-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0 1rem;
  margin-bottom: 0.3rem;
}
.cv__item h3 {
  margin: 0;
  font-size: 1.05rem;
}
.cv__item h3 span {
  font-weight: 500;
  color: var(--red);
}
.cv__when {
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
}
.cv__tags {
  margin-top: 0.35rem !important;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--red);
}

.cv__skills {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem 1.6rem;
}
.cv__skills h3 {
  margin: 0 0 0.4rem;
  font-size: 0.95rem;
}
.cv__skills ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.25rem;
}
.cv__skills li {
  display: grid;
  grid-template-columns: 1fr 70px;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
}
.cv__meter {
  height: 6px;
  background: #e5e5e5;
}
.cv__meter i {
  display: block;
  height: 100%;
  background: var(--red);
}

.cv__cols {
  display: grid;
  gap: 0 2rem;
}
@media (min-width: 720px) {
  .cv__cols { grid-template-columns: 1.4fr 1fr; }
}
.cv__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}
.cv__list b {
  display: inline-block;
  min-width: 2.8rem;
  color: var(--red);
}
.cv__list small {
  display: block;
  padding-left: 2.8rem;
  font-size: 0.85rem;
  color: #555;
}

.cv__foot {
  margin-top: 2rem;
  padding-top: 0.8rem;
  border-top: 1px solid #ddd;
  font-size: 0.8rem;
  color: #666;
}

/* ── Print: just the sheet, black on white ── */
@media print {
  .resume {
    padding: 0;
    background: none;
  }
  .resume__bar {
    display: none;
  }
  .cv {
    max-width: none;
    padding: 0;
    border-top: 0;
    box-shadow: none;
    font-size: 10pt;
    line-height: 1.45;
  }
  /* Let sections flow across pages; only keep each entry (and each heading with its content) together */
  .cv__section {
    margin-top: 1.1rem;
    break-inside: auto;
  }
  .cv__section h2 {
    break-after: avoid;
  }
  .cv__skills {
    grid-template-columns: repeat(3, 1fr);
  }
  .cv__skills li {
    grid-template-columns: 1fr 48px;
  }
  .cv__section h2 {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .cv__meter,
  .cv__meter i,
  .cv__highlights li {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
