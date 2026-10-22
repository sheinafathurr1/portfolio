// Persona 5 Royal flavour layered on top of src/data/portfolio.ts.
// Ranks/titles here are playful self-descriptions: tweak them freely.
import type { ScreenId, SectionId } from '../composables/nav'
import { allSkills, experiences, profile, projects, publications, skillCategories } from './portfolio'

export const menuItems: { id: SectionId; label: string; sub: string; desc: string; bond: string }[] = [
  { id: 'status',    label: 'STATUS',       sub: 'About Me',     desc: 'Profile, social stats, education, and field notes on the Phantom Developer.', bond: 'You learned who Switch really is.' },
  { id: 'persona',   label: 'PERSONA',      sub: 'Roles',        desc: 'The four masks I wear: roles and specialties.',                     bond: 'You’ve seen the masks Switch wears.' },
  { id: 'skill',     label: 'SKILL',        sub: 'Skills',       desc: 'My technical arsenal, with mastery levels.',                        bond: 'You studied Switch’s arsenal.' },
  { id: 'confidant', label: 'CONFIDANT',    sub: 'Experience',   desc: 'Bonds forged at work: freelance clients, a research centre, teaching, and an internship.', bond: 'You heard the stories of Switch’s allies.' },
  { id: 'missions',  label: 'MISSIONS',     sub: 'Projects',     desc: 'Client projects and research missions, from city agencies to IoT grants.', bond: 'You reviewed Switch’s past missions.' },
  { id: 'den',       label: 'THIEVES DEN',  sub: 'Achievements', desc: 'Milestones, published papers, plans in motion, and requests for you.', bond: 'You toured the hideout.' },
  { id: 'battle',    label: 'BATTLE',       sub: 'Mini-Game',    desc: 'Shadows are loose in the codebase. Hit their weaknesses with Switch’s real skills.', bond: 'You fought side by side with Switch.' },
  { id: 'card',      label: 'CALLING CARD', sub: 'Contact',      desc: 'Send a calling card. Let’s collaborate!',                          bond: 'You found where to send a calling card.' },
]

const RANK_TITLES: Record<string, string[]> = {
  Knowledge:   ['Oblivious', 'Learned', 'Scholarly', 'Encyclopedic', 'Erudite'],
  Guts:        ['Milquetoast', 'Bold', 'Staunch', 'Dauntless', 'Lionhearted'],
  Proficiency: ['Bumbling', 'Decent', 'Skilled', 'Masterful', 'Transcendent'],
  Kindness:    ['Inoffensive', 'Considerate', 'Empathetic', 'Selfless', 'Angelic'],
  Charm:       ['Existent', 'Head-Turning', 'Suave', 'Charismatic', 'Debonair'],
}

const averageSkill = Math.round(allSkills.reduce((sum, s) => sum + s.level, 0) / allSkills.length)

export const socialStats = [
  { stat: 'Knowledge',   rank: 5, note: `Master of Informatics (GPA 3.49) and ${publications.length} peer-reviewed papers` },
  { stat: 'Proficiency', rank: 5, note: `${allSkills.length} technical skills, averaging ${averageSkill}%` },
  { stat: 'Guts',        rank: 4, note: 'Ships production apps for government agencies and private clients' },
  { stat: 'Kindness',    rank: 4, note: 'Teaching and lab assistant who mentors student projects' },
  { stat: 'Charm',       rank: 4, note: 'Gathers requirements directly with non-technical stakeholders' },
].map((s) => ({ ...s, title: RANK_TITLES[s.stat]?.[s.rank - 1] ?? '' }))

/** Roles presented as Personas; their "stats" are real skill levels looked up by name. */
export const personas = [
  {
    name: 'Full-Stack Developer',
    arcana: 'I',
    arcanaName: 'The Magician',
    icon: '🪄',
    desc: 'Delivers Laravel and Flutter apps end to end for government agencies, startups, and private clients, from requirements gathering to production support.',
    statSkills: ['Laravel', 'Flutter', 'PHP', 'Blade Templating', 'REST API'],
    traits: ['Laravel', 'Flutter', 'End-to-end delivery'],
  },
  {
    name: 'AI & IoT Engineer',
    arcana: 'XVII',
    arcanaName: 'The Star',
    icon: '🛰️',
    desc: 'Wires agentic AI, deep learning, and ESP32 sensor pipelines into working systems, from biogas yield forecasting to climate control for a 40ft room.',
    statSkills: ['Agentic AI', 'ESP32 & Arduino', 'Sensor Pipelines', 'Deep Learning', 'LSTM'],
    traits: ['Agentic AI', 'CNN · LSTM', 'ESP32'],
  },
  {
    name: 'Researcher',
    arcana: 'IX',
    arcanaName: 'The Hermit',
    icon: '🔮',
    desc: `Master’s research on dynamic API architecture with a TOPSIS-based ranking scheme, research-grant projects, and ${publications.length} peer-reviewed papers since 2025.`,
    statSkills: ['TOPSIS / MCDM', 'Python', 'SQL (MySQL · Oracle)', 'Deep Learning', 'REST API'],
    traits: ['IEEE papers', 'Research grants', 'Dynamic API'],
  },
  {
    name: 'Server & Automation',
    arcana: 'VII',
    arcanaName: 'The Chariot',
    icon: '⚙️',
    desc: 'Keeps servers monitored and backed up, deploys to VPS, CyberPanel, and Hostinger, and automates KPI reporting with n8n and Telegram.',
    statSkills: ['VPS & CyberPanel', 'Server Monitoring', 'n8n Automation', 'Git', 'SQL (MySQL · Oracle)'],
    traits: ['Monitoring', 'Backups', 'n8n'],
  },
].map((p) => {
  const stats = p.statSkills.map((name) => ({ name, level: allSkills.find((s) => s.name === name)?.level ?? 0 }))
  return { ...p, stats, level: Math.round(stats.reduce((sum, s) => sum + s.level, 0) / stats.length) }
})

const ARCANA_BY_EXPERIENCE: Record<number, { numeral: string; name: string; icon: string }> = {
  1: { numeral: 'X', name: 'Fortune', icon: '🎡' },
  2: { numeral: 'II', name: 'Priestess', icon: '📚' },
  3: { numeral: 'V', name: 'Hierophant', icon: '🏛️' },
  4: { numeral: 'IV', name: 'Emperor', icon: '🏢' },
}

const monthIndex = (ym: string) => {
  const [y = 0, m = 1] = ym.split('-').map(Number)
  return y * 12 + (m - 1)
}

/**
 * Confidant rank grows by one every two months of working together, capped at 10 (MAX).
 * Finished roles count their full span (start and end months included) and stay sealed at that rank.
 */
export function confidantRank(start: string, end?: string, now = new Date()) {
  const last = end ? monthIndex(end) + 1 : now.getFullYear() * 12 + now.getMonth()
  const months = Math.max(1, last - monthIndex(start))
  const rank = Math.min(10, 1 + Math.floor(months / 2))
  return { months, rank, ended: !!end, progress: rank === 10 || end ? 1 : (months % 2) / 2 }
}

export const confidants = experiences.map((exp) => ({
  ...exp,
  arcana: ARCANA_BY_EXPERIENCE[exp.id] ?? { numeral: '0', name: 'Fool', icon: '🃏' },
  ...confidantRank(exp.start, exp.end),
}))

export const rankLabel = (level: number) => (level >= 85 ? 'Expert' : level >= 70 ? 'Advanced' : 'Intermediate')

// ── Skill elements: each skill category behaves like a P5 attack element ──
export type ElementKey = 'backend' | 'ai' | 'frontend'
export interface Element {
  tag: string
  color: string
}
export const ELEMENTS: Record<ElementKey, Element> = {
  backend: { tag: 'PHYS', color: '#f97316' },
  ai: { tag: 'PSY', color: '#e879f9' },
  frontend: { tag: 'ELEC', color: '#facc15' },
}
export const ELEMENT_ORDER: ElementKey[] = ['backend', 'ai', 'frontend']
export const elementOf = (key: string): Element => ELEMENTS[key as ElementKey] ?? { tag: 'ALM', color: '#ffffff' }

// ── Shadow Battle: Shadows are everyday dev problems; each one is weak to the kind of skill that fixes it ──
export interface ShadowType {
  id: string
  name: string
  icon: string
  weak: ElementKey
  lore: string
  attack: string
}

export const shadows: ShadowType[] = [
  { id: 'spaghetti', name: 'Spaghetti Code',    icon: '🍝', weak: 'backend',  lore: 'A 3,000-line controller nobody dares to touch.', attack: 'hurls a 3,000-line controller' },
  { id: 'downtime',  name: 'Midnight Downtime', icon: '🌑', weak: 'backend',  lore: 'Takes the server down at 3 AM. Every time.',     attack: 'pulls the plug on the server' },
  { id: 'busywork',  name: 'Manual Busywork',   icon: '📋', weak: 'ai',       lore: 'Copy, paste, repeat. Forever.',                  attack: 'buries Switch in spreadsheets' },
  { id: 'blackout',  name: 'Sensor Blackout',   icon: '📡', weak: 'ai',       lore: 'A 40ft room overheating while nobody watches.',  attack: 'cuts the sensor feed' },
  { id: 'clunky',    name: 'Clunky Interface',  icon: '🧱', weak: 'frontend', lore: 'Seventeen clicks to submit one form.',           attack: 'adds a seventeenth confirmation dialog' },
  { id: 'shift',     name: 'Layout Shift',      icon: '📐', weak: 'frontend', lore: 'Moves the button right before you click it.',    attack: 'moves the button again' },
]

/** Switch's three strongest skills per element, used as battle commands. */
export const battleSkills = skillCategories.flatMap((cat) =>
  [...cat.skills]
    .sort((a, b) => b.level - a.level)
    .slice(0, 3)
    .map((s) => ({ ...s, element: cat.key as ElementKey })),
)
export type BattleSkill = (typeof battleSkills)[number]

// ── Phan-Chat: dialogue choices on the in-game phone; answers are built from the portfolio data ──
export interface ChatTopic {
  id: string
  question: string
  answer: string[]
  action?: { label: string; to: ScreenId }
  effect?: 'attack'
}

// Today's tarot card (same card all day, Jakarta time), for the fortune-telling chat option
const FORTUNES = [
  { card: '0 · The Fool', message: 'Start that side project. A fresh repo is a fresh adventure.' },
  { card: 'I · The Magician', message: 'You already have every tool you need. Combine them.' },
  { card: 'II · The Priestess', message: 'Read the docs before the Stack Overflow answers. Trust me.' },
  { card: 'IV · The Emperor', message: 'Structure wins today. Write the plan before the code.' },
  { card: 'VII · The Chariot', message: 'Ship it. Momentum beats perfection.' },
  { card: 'IX · The Hermit', message: 'Deep work ahead. Silence the notifications for an hour.' },
  { card: 'X · Fortune', message: 'A lucky bug fix is coming your way. Commit often.' },
  { card: 'XI · Strength', message: 'The hard refactor is worth it. You can carry it.' },
  { card: 'XVII · The Star', message: 'Hope is high. A good day to open-source something.' },
  { card: 'XIX · The Sun', message: 'Everything compiles on the first try. Enjoy it while it lasts.' },
]
const jakartaDay = Math.floor((Date.now() + 7 * 3600 * 1000) / 86_400_000)
const fortune = FORTUNES[jakartaDay % FORTUNES.length] ?? FORTUNES[0]!

const sharpest = [...allSkills].sort((a, b) => b.level - a.level).slice(0, 3).map((s) => s.name)

export const chatIntro = [
  'Yo! You actually made it into my portfolio. 😎',
  'Ask me anything. Pick one of the options below.',
]

export const chatTopics: ChatTopic[] = [
  {
    id: 'who',
    question: 'Who are you, exactly?',
    answer: [
      `I’m ${profile.name}, but around here they call me “${profile.alias}”.`,
      'Full-stack developer (Laravel & Flutter) who also wires up AI and IoT, and keeps the servers running.',
    ],
    action: { label: 'Open STATUS', to: 'status' },
  },
  {
    id: 'now',
    question: 'What are you up to these days?',
    answer: ['Juggling a few bonds at the moment:', experiences.filter((e) => !e.end).map((e) => `▸ ${e.title} @ ${e.company}`).join('\n')],
    action: { label: 'Open CONFIDANT', to: 'confidant' },
  },
  {
    id: 'stack',
    question: 'What’s in your arsenal?',
    answer: [`Daily drivers: ${profile.stack.join(', ')}.`, `Sharpest blades right now: ${sharpest.join(', ')}.`],
    action: { label: 'Open SKILL', to: 'skill' },
  },
  {
    id: 'recruiter',
    question: 'I’m a recruiter. Is there a quick version?',
    answer: [
      'Of course. No Shadows, no slashes: a clean one-page résumé.',
      'You can print it or save it as a PDF straight from the page.',
    ],
    action: { label: 'Open RÉSUMÉ', to: 'resume' },
  },
  {
    id: 'missions',
    question: 'Show me your best work.',
    answer: [
      `${projects.length} missions so far, for city agencies, companies, and research grants. A few favourites:`,
      projects.filter((p) => [1, 3, 4, 10].includes(p.id)).map((p) => `▸ ${p.title} (${p.org})`).join('\n'),
    ],
    action: { label: 'Open MISSIONS', to: 'missions' },
  },
  {
    id: 'papers',
    question: 'Do you publish research?',
    answer: [
      `${publications.length} peer-reviewed papers since 2025, across IEEE conferences and national journals.`,
      `Three as first and corresponding author, like “${publications.find((p) => p.lead)?.title ?? ''}”.`,
    ],
    action: { label: 'Open THIEVES DEN', to: 'den' },
  },
  {
    id: 'battle',
    question: 'Anything fun to do around here?',
    answer: [
      'Shadows keep sneaking into my codebase: spaghetti code, endless busywork, clunky UIs…',
      'Help me take them down. Hit each one’s weakness with the right skill and you get 1 MORE turn.',
    ],
    action: { label: 'Open BATTLE', to: 'battle' },
  },
  {
    id: 'fortune',
    question: 'Can you read my fortune?',
    answer: ['Shuffling the deck… 🔮', `Today’s card: ${fortune.card}.`, `“${fortune.message}”`],
  },
  {
    id: 'collab',
    question: 'Are you open to collaboration?',
    answer: ['Always. Web and mobile apps, AI and IoT systems, research: count me in.', 'Send me a calling card and tell me what you have in mind.'],
    action: { label: 'Write a calling card', to: 'card' },
  },
  {
    id: 'contact',
    question: 'How can I reach you?',
    answer: [`Email: ${profile.email}`, 'GitHub, LinkedIn, and Google Scholar are on the Calling Card screen too.'],
    action: { label: 'Open CALLING CARD', to: 'card' },
  },
  {
    id: 'cool',
    question: 'Show me something cool.',
    answer: ['Heh. You asked for it…'],
    effect: 'attack',
  },
]
