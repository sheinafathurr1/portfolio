// Persona 5 Royal flavour layered on top of src/data/portfolio.ts.
// Ranks/titles here are playful self-descriptions: tweak them freely.
import type { SectionId } from '../composables/nav'
import { allSkills, experiences } from './portfolio'

export const menuItems: { id: SectionId; label: string; sub: string; desc: string }[] = [
  { id: 'status',    label: 'STATUS',       sub: 'Tentang Saya', desc: 'Profil, statistik sosial, dan catatan lapangan sang Phantom Developer.' },
  { id: 'persona',   label: 'PERSONA',      sub: 'Peran',        desc: 'Empat topeng yang saya kenakan: peran & spesialisasi.' },
  { id: 'skill',     label: 'SKILL',        sub: 'Keahlian',     desc: 'Daftar skill teknis lengkap dengan level penguasaan.' },
  { id: 'confidant', label: 'CONFIDANT',    sub: 'Pengalaman',   desc: 'Ikatan kerja sama: pengalaman & organisasi tempat saya berkembang.' },
  { id: 'missions',  label: 'MISSIONS',     sub: 'Proyek',       desc: 'Misi yang telah diselesaikan: proyek riset & pengembangan sistem.' },
  { id: 'den',       label: 'THIEVES DEN',  sub: 'Pencapaian',   desc: 'Galeri pencapaian dan rencana yang sedang dijalankan.' },
  { id: 'card',      label: 'CALLING CARD', sub: 'Kontak',       desc: 'Kirim kartu panggilan: mari berkolaborasi!' },
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
  { stat: 'Knowledge',   rank: 5, note: 'Riset magister Informatika: Dynamic API, ML, keamanan siber' },
  { stat: 'Proficiency', rank: 5, note: `${allSkills.length} skill teknis, rata-rata level ${averageSkill}%` },
  { stat: 'Guts',        rank: 4, note: 'Memimpin tim & menjaga server tetap hidup' },
  { stat: 'Kindness',    rank: 4, note: 'Terbuka untuk kolaborasi dan berbagi ilmu' },
  { stat: 'Charm',       rank: 4, note: 'Menjembatani kebutuhan pengguna & tim teknis' },
].map((s) => ({ ...s, title: RANK_TITLES[s.stat]?.[s.rank - 1] ?? '' }))

/** Roles presented as Personas; their "stats" are real skill levels looked up by name. */
export const personas = [
  {
    name: 'Technical Lead',
    arcana: 'IV',
    arcanaName: 'The Emperor',
    icon: '👑',
    desc: 'Memimpin pengembangan HEI APP dan mengoordinasikan penugasan teknis harian, menjaga arsitektur tetap rapi saat kebutuhan terus berubah.',
    statSkills: ['GitHub', 'Laravel', 'Vue.js', 'REST API', 'TypeScript'],
    traits: ['Team Lead', 'Code Review', 'Dokumentasi'],
  },
  {
    name: 'AI Researcher',
    arcana: 'IX',
    arcanaName: 'The Hermit',
    icon: '🔮',
    desc: 'Meneliti arsitektur Dynamic API, Machine Learning, dan keamanan siber dengan metodologi Design Science Research.',
    statSkills: ['Dynamic API', 'Machine Learning', 'Python', 'Gemini API', 'n8n Workflows'],
    traits: ['Design Science', 'TOPSIS', 'Publikasi'],
  },
  {
    name: 'Full-Stack Developer',
    arcana: 'I',
    arcanaName: 'The Magician',
    icon: '🪄',
    desc: 'Merangkai backend Laravel & REST API dengan frontend Vue.js dan Tailwind menjadi aplikasi yang utuh.',
    statSkills: ['Laravel', 'Vue.js', 'Tailwind CSS', 'MySQL', 'REST API'],
    traits: ['Laravel', 'Vue.js', 'Flutter'],
  },
  {
    name: 'Server Engineer',
    arcana: 'VII',
    arcanaName: 'The Chariot',
    icon: '⚙️',
    desc: 'Mengelola server, backup berkala, dan performa infrastruktur supaya layanan tetap hidup.',
    statSkills: ['Server Mgmt', 'CyberPanel', 'MySQL', 'GitHub', 'PHP'],
    traits: ['Linux', 'Backup', 'Monitoring'],
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
