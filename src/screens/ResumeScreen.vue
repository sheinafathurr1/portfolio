<script setup lang="ts">
import { inject, onMounted } from 'vue'
import { NAV } from '../composables/nav'
import { clearRequest } from '../composables/requests'
import { sfx } from '../composables/sfx'
import { education, experiences, highlights, profile, projects, publications, skillGroups, socialLinks } from '../data/portfolio'

// Recruiter-friendly view: the CV's content and order, on one plain page that prints cleanly.
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
  text:
    l.label === 'Google Scholar'
      ? 'Google Scholar'
      : l.href.replace(/^mailto:/, '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
}))
const clientProjects = projects.filter((p) => p.category === 'client')
const researchProjects = projects.filter((p) => p.category === 'research')
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
          <p class="cv__roles">{{ profile.headline }}</p>
        </div>
        <ul class="cv__contact">
          <li class="cv__place">{{ profile.location }}</li>
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
        <h2>Technical Skills</h2>
        <dl class="cv__groups">
          <template v-for="g in skillGroups" :key="g.label">
            <dt>{{ g.label }}</dt>
            <dd>{{ g.items }}</dd>
          </template>
        </dl>
      </section>

      <section class="cv__section">
        <h2>Experience</h2>
        <article v-for="e in experiences" :key="e.id" class="cv__item">
          <header class="cv__item-head">
            <h3>{{ e.title }}</h3>
            <p class="cv__when">{{ e.period }}</p>
          </header>
          <p class="cv__org">{{ e.company }}</p>
          <ul class="cv__points">
            <li v-for="point in e.points" :key="point">{{ point }}</li>
          </ul>
        </article>
      </section>

      <section class="cv__section">
        <h2>Selected Client Projects</h2>
        <article v-for="p in clientProjects" :key="p.id" class="cv__item cv__item--compact">
          <header class="cv__item-head">
            <h3>{{ p.title }}</h3>
            <p class="cv__when">{{ p.org }}{{ p.ongoing ? ' · Ongoing' : '' }}</p>
          </header>
          <p>{{ p.fullDesc }}</p>
        </article>
      </section>

      <section class="cv__section">
        <h2>Education</h2>
        <article v-for="e in education" :key="e.degree" class="cv__item">
          <header class="cv__item-head">
            <h3>{{ e.degree }} <span>· GPA {{ e.gpa }}</span></h3>
            <p class="cv__when">{{ e.period }}</p>
          </header>
          <p class="cv__org">{{ e.school }} · {{ e.note }}</p>
          <p>{{ e.detail }}</p>
        </article>
      </section>

      <section class="cv__section">
        <h2>R&amp;D Projects</h2>
        <article v-for="p in researchProjects" :key="p.id" class="cv__item cv__item--compact">
          <header class="cv__item-head">
            <h3>{{ p.title }}</h3>
            <p class="cv__when">{{ p.org }}</p>
          </header>
          <p>{{ p.fullDesc }}</p>
        </article>
      </section>

      <section class="cv__section">
        <h2>Publications</h2>
        <p>
          {{ publications.length }} peer-reviewed papers published in 2025–2026 across IEEE conferences and national journals,
          {{ publications.filter((p) => p.lead).length }} of them as first and corresponding author.
        </p>
        <ol class="cv__pubs">
          <li v-for="paper in publications" :key="paper.title">
            <b>{{ paper.title }}</b>
            <span>{{ paper.venue }}, {{ paper.year }} · {{ paper.role }}</span>
          </li>
        </ol>
      </section>

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

.cv__org {
  margin-bottom: 0.3rem !important;
  font-style: italic;
  color: #555;
}
.cv__place {
  font-weight: 600;
  color: #444;
}
.cv__points {
  margin: 0;
  padding-left: 1.2rem;
  list-style: disc;
}
.cv__points li + li {
  margin-top: 0.2rem;
}
.cv__item--compact {
  padding-bottom: 0.6rem;
}
.cv__item--compact + .cv__item--compact {
  padding-top: 0.6rem;
}

.cv__groups {
  display: grid;
  grid-template-columns: 10rem 1fr;
  gap: 0.45rem 1.2rem;
  margin: 0;
}
.cv__groups dt {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--red);
}
.cv__groups dd {
  margin: 0;
}
@media (max-width: 560px) {
  .cv__groups { grid-template-columns: 1fr; gap: 0.1rem; }
  .cv__groups dd { margin-bottom: 0.5rem; }
}

.cv__pubs {
  display: grid;
  gap: 0.55rem;
  margin: 0.8rem 0 0;
  padding-left: 1.6rem;
  list-style: decimal;
}
.cv__pubs li::marker {
  font-weight: 700;
  color: var(--red);
}
.cv__pubs b {
  display: block;
  font-weight: 600;
}
.cv__pubs span {
  font-size: 0.86rem;
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
  .cv__item,
  .cv__pubs li {
    break-inside: avoid;
  }
  .cv__section h2 {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .cv__highlights li {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
