// Persona 5 Royal flavour layered on top of src/data/portfolio.ts.
// Ranks/titles here are playful self-descriptions: tweak them freely.
import type { SectionId } from '../composables/nav'
import { allSkills, experiences, profile, projects, skillCategories } from './portfolio'

export const menuItems: { id: SectionId; label: string; sub: string; desc: string; bond: string }[] = [
  { id: 'status',    label: 'STATUS',       sub: 'About Me',     desc: 'Profile, social stats, and field notes on the Phantom Developer.',  bond: 'You learned who Switch really is.' },
  { id: 'persona',   label: 'PERSONA',      sub: 'Roles',        desc: 'The four masks I wear: roles and specialties.',                     bond: 'You’ve seen the masks Switch wears.' },
  { id: 'skill',     label: 'SKILL',        sub: 'Skills',       desc: 'My technical arsenal, with mastery levels.',                        bond: 'You studied Switch’s arsenal.' },
  { id: 'confidant', label: 'CONFIDANT',    sub: 'Experience',   desc: 'Bonds forged at work: the teams and organizations I grow with.',   bond: 'You heard the stories of Switch’s allies.' },
  { id: 'missions',  label: 'MISSIONS',     sub: 'Projects',     desc: 'Cleared missions: research and system development projects.',      bond: 'You reviewed Switch’s past missions.' },
  { id: 'den',       label: 'THIEVES DEN',  sub: 'Achievements', desc: 'A gallery of achievements, plans in motion, and requests for you.',  bond: 'You toured the hideout.' },
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
  { stat: 'Knowledge',   rank: 5, note: 'Master’s research in Informatics: Dynamic API, ML, cybersecurity' },
  { stat: 'Proficiency', rank: 5, note: `${allSkills.length} technical skills, averaging ${averageSkill}%` },
  { stat: 'Guts',        rank: 4, note: 'Leads teams and keeps the servers alive' },
  { stat: 'Kindness',    rank: 4, note: 'Open to collaboration and sharing knowledge' },
  { stat: 'Charm',       rank: 4, note: 'Bridges user needs and the technical team' },
].map((s) => ({ ...s, title: RANK_TITLES[s.stat]?.[s.rank - 1] ?? '' }))

/** Roles presented as Personas; their "stats" are real skill levels looked up by name. */
export const personas = [
  {
    name: 'Technical Lead',
    arcana: 'IV',
    arcanaName: 'The Emperor',
    icon: '👑',
    desc: 'Leads HEI APP development and coordinates daily technical assignments, keeping the architecture clean while requirements keep shifting.',
    statSkills: ['GitHub', 'Laravel', 'Vue.js', 'REST API', 'TypeScript'],
    traits: ['Team Lead', 'Code Review', 'Documentation'],
  },
  {
    name: 'AI Researcher',
    arcana: 'IX',
    arcanaName: 'The Hermit',
    icon: '🔮',
    desc: 'Researches Dynamic API architectures, Machine Learning, and cybersecurity using the Design Science Research methodology.',
    statSkills: ['Dynamic API', 'Machine Learning', 'Python', 'Gemini API', 'n8n Workflows'],
    traits: ['Design Science', 'TOPSIS', 'Publications'],
  },
  {
    name: 'Full-Stack Developer',
    arcana: 'I',
    arcanaName: 'The Magician',
    icon: '🪄',
    desc: 'Weaves Laravel and REST API backends together with Vue.js and Tailwind frontends into complete applications.',
    statSkills: ['Laravel', 'Vue.js', 'Tailwind CSS', 'MySQL', 'REST API'],
    traits: ['Laravel', 'Vue.js', 'Flutter'],
  },
  {
    name: 'Server Engineer',
    arcana: 'VII',
    arcanaName: 'The Chariot',
    icon: '⚙️',
    desc: 'Runs servers, scheduled backups, and infrastructure performance so services stay up.',
    statSkills: ['Server Mgmt', 'CyberPanel', 'MySQL', 'GitHub', 'PHP'],
    traits: ['Linux', 'Backups', 'Monitoring'],
  },
].map((p) => {
  const stats = p.statSkills.map((name) => ({ name, level: allSkills.find((s) => s.name === name)?.level ?? 0 }))
  return { ...p, stats, level: Math.round(stats.reduce((sum, s) => sum + s.level, 0) / stats.length) }
})

const ARCANA_BY_EXPERIENCE: Record<number, { numeral: string; name: string; icon: string }> = {
  1: { numeral: 'V', name: 'Hierophant', icon: '🏛️' },
  2: { numeral: 'II', name: 'Priestess', icon: '📚' },
  3: { numeral: 'XI', name: 'Strength', icon: '🚀' },
}

/** Confidant rank grows by one every two months of working together, capped at 10 (MAX). */
export function confidantRank(start: string, now = new Date()) {
  const [y = now.getFullYear(), m = 1] = start.split('-').map(Number)
  const months = Math.max(0, (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m))
  const rank = Math.min(10, 1 + Math.floor(months / 2))
  return { months, rank, progress: rank === 10 ? 1 : (months % 2) / 2 }
}

export const confidants = experiences.map((exp) => ({
  ...exp,
  arcana: ARCANA_BY_EXPERIENCE[exp.id] ?? { numeral: '0', name: 'Fool', icon: '🃏' },
  ...confidantRank(exp.start),
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
  { id: 'pdfpile',   name: 'PDF Avalanche',     icon: '📚', weak: 'ai',       lore: 'Five hundred journals, zero structured data.',   attack: 'drops 500 unread journal PDFs' },
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
  action?: { label: string; to: SectionId }
  effect?: 'attack'
}

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
      'Technical lead, AI researcher and full-stack developer. I keep servers alive and teach workflows to think.',
    ],
    action: { label: 'Open STATUS', to: 'status' },
  },
  {
    id: 'now',
    question: 'What are you up to these days?',
    answer: ['Juggling a few bonds at the moment:', experiences.map((e) => `▸ ${e.title} @ ${e.company}`).join('\n')],
    action: { label: 'Open CONFIDANT', to: 'confidant' },
  },
  {
    id: 'stack',
    question: 'What’s in your arsenal?',
    answer: [`Daily drivers: ${profile.stack.join(', ')}.`, `Sharpest blades right now: ${sharpest.join(', ')}.`],
    action: { label: 'Open SKILL', to: 'skill' },
  },
  {
    id: 'missions',
    question: 'Show me your best work.',
    answer: [`${projects.length} missions cleared so far:`, projects.map((p) => `▸ ${p.title} (${p.year})`).join('\n')],
    action: { label: 'Open MISSIONS', to: 'missions' },
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
    id: 'collab',
    question: 'Are you open to collaboration?',
    answer: ['Always. Research, server infrastructure, AI automation: count me in.', 'Send me a calling card and tell me what you have in mind.'],
    action: { label: 'Write a calling card', to: 'card' },
  },
  {
    id: 'contact',
    question: 'How can I reach you?',
    answer: [`Email: ${profile.email}`, 'GitHub and LinkedIn are on the Calling Card screen too.'],
    action: { label: 'Open CALLING CARD', to: 'card' },
  },
  {
    id: 'cool',
    question: 'Show me something cool.',
    answer: ['Heh. You asked for it…'],
    effect: 'attack',
  },
]
