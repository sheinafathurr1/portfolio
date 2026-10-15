// Single source of truth for portfolio content.
// Used by the classic layout components and by the 3D world (src/world).

export const profile = {
  name: 'Sheina Fathur',
  alias: 'Switch',
  roles: ['Technical Lead', 'AI Researcher', 'Full-Stack Developer', 'Server Engineer'],
  summary:
    'Berfokus pada full-stack development, manajemen infrastruktur server, dan riset AI automation. Aktif meneliti Dynamic API dan membangun workflow cerdas berbasis AI.',
  stack: ['Vue.js', 'Laravel', 'Python', 'n8n', 'AI/ML', 'Linux Server'],
  email: 'sheinafathur@gmail.com',
  cvUrl: '/cv-switch.pdf',
}

export type Accent = 'blue' | 'violet' | 'emerald'

export const experiences: {
  id: number
  title: string
  company: string
  period: string
  description: string
  tags: string[]
  accent: Accent
}[] = [
  {
    id: 1,
    title: 'Tenaga Lepas Harian (TLH)',
    company: 'CoE CAATIS',
    period: 'Jan 2026 – Sekarang',
    description: 'Mengelola infrastruktur operasional secara menyeluruh, termasuk pengawasan performa server dan manajemen backup data berkala. Bertanggung jawab dalam mengoordinasikan penugasan teknis harian untuk tim.',
    tags: ['Server Mgmt', 'Infrastructure', 'Linux'],
    accent: 'blue',
  },
  {
    id: 2,
    title: 'Peneliti AI & Mahasiswa S2IF',
    company: 'Telkom University',
    period: '2025 – Sekarang',
    description: 'Menjalankan riset akademik jenjang magister Informatika dengan fokus pada arsitektur Dynamic API, Machine Learning, dan keamanan siber. Aktif memetakan arsitektur sistem menggunakan metodologi Design Science Research (DSR).',
    tags: ['Machine Learning', 'Dynamic API', 'DSR'],
    accent: 'violet',
  },
  {
    id: 3,
    title: 'Lead Developer',
    company: 'HEI APP',
    period: 'Maret 2026 – Sekarang',
    description: 'Membangun dan mendokumentasikan sistem aplikasi HEI APP untuk mendigitalkan alur proses evaluasi karakter mahasiswa serta mengintegrasikan nilai-nilai universitas secara terpusat.',
    tags: ['Vue.js', 'Laravel', 'Team Lead'],
    accent: 'emerald',
  },
]

export const projects = [
  {
    id: 1,
    title: 'Arsitektur Dynamic API & TOPSIS',
    category: 'riset',
    gradient: 'from-violet-600 via-purple-500 to-indigo-600',
    colors: ['#7c3aed', '#a855f7', '#4f46e5'],
    glowColor: 'hover:shadow-violet-500/20',
    borderHover: 'hover:border-violet-500/60',
    icon: '🔬',
    year: '2025',
    shortDesc: 'Pengembangan Metode Pemeringkatan Publikasi Ilmiah Multi-Kriteria pada Arsitektur Dynamic API Menggunakan Pendekatan SQL-Driven Berbasis TOPSIS.',
    fullDesc: 'Penelitian metodologi Design Science Research (DSR) yang berfokus pada sintesis artefak dan riset terbaru. Mengembangkan pemeringkatan publikasi ilmiah multi-kriteria menggunakan pendekatan SQL-Driven berbasis TOPSIS. Pendekatan ini dirancang untuk memproses data evaluasi secara lebih dinamis dan terstruktur pada database.',
    tags: ['Design Science', 'SQL-Driven', 'TOPSIS'],
  },
  {
    id: 2,
    title: 'Automasi Ekstraksi Data Jurnal',
    category: 'development',
    gradient: 'from-blue-600 via-cyan-500 to-sky-500',
    colors: ['#2563eb', '#06b6d4', '#0ea5e9'],
    glowColor: 'hover:shadow-blue-500/20',
    borderHover: 'hover:border-blue-500/60',
    icon: '🤖',
    year: '2025',
    shortDesc: 'Membangun arsitektur workflow n8n yang diintegrasikan dengan Google Gemini API dan trigger Telegram.',
    fullDesc: 'Membangun arsitektur workflow n8n yang diintegrasikan dengan Google Gemini API dan trigger Telegram untuk mengekstrak, meringkas, dan memproses data jurnal secara otomatis. Pipeline ini secara signifikan mengurangi beban kerja manual dengan membiarkan AI menangani ekstraksi poin-poin krusial dari dokumen.',
    tags: ['n8n', 'Gemini API', 'Telegram Bot'],
  },
  {
    id: 3,
    title: 'Prototype Streaming & IoT',
    category: 'development',
    gradient: 'from-emerald-600 via-teal-500 to-cyan-600',
    colors: ['#059669', '#14b8a6', '#0891b2'],
    glowColor: 'hover:shadow-emerald-500/20',
    borderHover: 'hover:border-emerald-500/60',
    icon: '📡',
    year: '2026',
    shortDesc: 'Pengembangan prototipe aplikasi mobile untuk streaming video latensi rendah berbasis WebRTC.',
    fullDesc: 'Membangun prototipe aplikasi mobile menggunakan Flutter yang diintegrasikan dengan perangkat keras IoT (drone). Sistem ini memanfaatkan WebRTC dan Firebase untuk menghasilkan streaming video real-time dengan latensi yang sangat rendah untuk kebutuhan pengawasan visual.',
    tags: ['Flutter', 'WebRTC', 'Firebase', 'IoT'],
  },
]

export type Project = (typeof projects)[number]

export const skillCategories = [
  {
    label: 'Backend & Infrastruktur',
    key: 'backend',
    hex: '#3b82f6',
    accentBorder: 'hover:border-blue-500/50',
    accentIcon: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    barFrom: 'from-blue-500',
    barTo: 'to-cyan-500',
    badgeBg: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-500/20',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>`,
    skills: [
      { name: 'GitHub',      level: 95 },
      { name: 'Laravel',     level: 90 },
      { name: 'REST API',    level: 90 },
      { name: 'PHP',         level: 85 },
      { name: 'MySQL',       level: 85 },
      { name: 'Server Mgmt', level: 80 },
      { name: 'CyberPanel',  level: 75 },
    ],
  },
  {
    label: 'AI & Automasi',
    key: 'ai',
    hex: '#a855f7',
    accentBorder: 'hover:border-violet-500/50',
    accentIcon: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    barFrom: 'from-violet-500',
    barTo: 'to-purple-500',
    badgeBg: 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-500/20',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
    skills: [
      { name: 'Dynamic API',     level: 92 },
      { name: 'n8n Workflows',   level: 88 },
      { name: 'Gemini API',      level: 85 },
      { name: 'Telegram Bot',    level: 85 },
      { name: 'Python',          level: 80 },
      { name: 'Machine Learning',level: 72 },
    ],
  },
  {
    label: 'Frontend & Mobile',
    key: 'frontend',
    hex: '#10b981',
    accentBorder: 'hover:border-emerald-500/50',
    accentIcon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    barFrom: 'from-emerald-500',
    barTo: 'to-teal-500',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-500/20',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
    skills: [
      { name: 'Tailwind CSS', level: 92 },
      { name: 'Vue.js',       level: 88 },
      { name: 'TypeScript',   level: 82 },
      { name: 'Flutter',      level: 72 },
      { name: 'Firebase',     level: 70 },
      { name: 'WebRTC',       level: 68 },
    ],
  },
]

export const milestones = [
  {
    year: '2026',
    title: 'Lead Developer — HEI APP',
    desc: 'Memimpin pengembangan sistem digital evaluasi karakter mahasiswa untuk Telkom University.',
    icon: '🏆',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
  },
  {
    year: '2026',
    title: 'Tenaga Lepas Harian — CoE CAATIS',
    desc: 'Mengelola infrastruktur server dan koordinasi teknis harian untuk pusat keunggulan AI.',
    icon: '⚙️',
    color: 'from-cyan-500 to-teal-500',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-200 dark:border-cyan-500/20',
    text: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    year: '2025',
    title: 'Peneliti AI — Telkom University',
    desc: 'Memulai riset S2IF dengan fokus Dynamic API, Machine Learning, dan keamanan siber berbasis DSR.',
    icon: '🔬',
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-500/10',
    border: 'border-violet-200 dark:border-violet-500/20',
    text: 'text-violet-600 dark:text-violet-400',
  },
  {
    year: '2025',
    title: 'Automasi AI Pipeline',
    desc: 'Membangun 10+ workflow n8n terintegrasi Google Gemini API untuk otomatisasi ekstraksi jurnal.',
    icon: '🤖',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
]

export const currentFocus = [
  { label: 'Riset Dynamic API',  icon: '🔬', pct: 90 },
  { label: 'ML Model Training',  icon: '🧠', pct: 70 },
  { label: 'HEI APP v2',         icon: '💻', pct: 55 },
  { label: 'Server Hardening',   icon: '🛡️', pct: 80 },
]

export const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/sheinafathurr1',
    icon: `<svg fill="currentColor" viewBox="0 0 24 24" class="h-5 w-5"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/sheinafathur',
    icon: `<svg fill="currentColor" viewBox="0 0 24 24" class="h-5 w-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  },
  {
    label: 'Email',
    href: 'mailto:sheinafathur@gmail.com',
    icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
  },
]
