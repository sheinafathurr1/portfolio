// Satu sumber konten portofolio, diselaraskan dengan CV.
// Dipakai oleh layout klasik dan dunia 3D (src/world).

export const profile = {
  name: 'Sheina Fathur Rahman',
  alias: 'Switch',
  headline: 'Full-Stack Developer · Laravel & Flutter · AI & IoT',
  roles: ['Full-Stack Developer', 'Laravel & Flutter Developer', 'AI & IoT Engineer', 'Asisten Riset'],
  /** Kalimat pendek untuk hero */
  tagline:
    'Full-stack developer dengan tiga tahun pengalaman membangun aplikasi web dan mobile produksi. Stack utama Laravel dan Flutter, diperluas dengan integrasi AI dan IoT.',
  summary:
    'Full-stack developer dengan tiga tahun pengalaman menghadirkan aplikasi web dan mobile produksi untuk instansi pemerintah, startup, dan klien swasta, mulai dari penggalian kebutuhan hingga deployment dan operasional server. Stack utama Laravel dan Flutter, diperluas dengan integrasi AI dan IoT (agentic AI, deep learning, pipeline sensor) serta pengalaman langsung mengelola server, backup, dan otomasi workflow.',
  stack: ['Laravel', 'Flutter', 'PHP', 'Python', 'ESP32', 'n8n'],
  email: 'sheinafathur@gmail.com',
  location: 'Bandung, Jawa Barat',
  /** Opsional: taruh PDF CV di /public lalu isi path-nya (mis. '/cv-switch.pdf') agar tombol Download CV muncul. */
  cvUrl: '',
}

export type Accent = 'blue' | 'violet' | 'emerald' | 'amber'

export const experiences: {
  id: number
  title: string
  /** Judul singkat untuk pilar di dunia 3D */
  short: string
  company: string
  /** Nama organisasi singkat untuk pilar di dunia 3D */
  org: string
  period: string
  current: boolean
  points: string[]
  tags: string[]
  accent: Accent
}[] = [
  {
    id: 1,
    title: 'Freelance Full-Stack Web & Mobile Developer',
    short: 'Freelance Developer',
    company: 'Wiraswasta · Bandung',
    org: 'Wiraswasta',
    period: '2023 – Sekarang',
    current: true,
    points: [
      'Dikontrak langsung oleh tujuh klien, termasuk dua unit pemerintah kota dan dua perusahaan teknologi, untuk membangun aplikasi Laravel dan Flutter dari awal hingga akhir.',
      'Memegang siklus penuh: penggalian kebutuhan bersama pemangku kepentingan non-teknis, desain database dan API, implementasi, pengujian, rilis, hingga dukungan produksi.',
      'Menangani deployment dan konfigurasi server di VPS, CyberPanel, dan Hostinger, termasuk domain, SSL, dan penjadwalan tugas.',
    ],
    tags: ['Laravel', 'Flutter', 'VPS & CyberPanel'],
    accent: 'blue',
  },
  {
    id: 2,
    title: 'Technical Lead Helper (TLH) / Asisten Riset',
    short: 'TLH / Asisten Riset',
    company: 'CoE CAATIS, Telkom University',
    org: 'CoE CAATIS',
    period: 'Jan 2026 – Sekarang',
    current: true,
    points: [
      'Menjalankan operasional teknis pusat riset: pemantauan server, uptime, dan skema backup data yang melindungi aset proyek laboratorium.',
      'Membangun otomasi n8n yang menghubungkan database internal ke Telegram untuk notifikasi KPI real-time dan laporan berkala, menggantikan pengumpulan status manual.',
      'Merancang dan memelihara arsip digital dokumentasi teknis dan proyek yang dipakai di seluruh pusat riset.',
    ],
    tags: ['Server Monitoring', 'n8n Automation', 'Backup Design'],
    accent: 'violet',
  },
  {
    id: 3,
    title: 'Asisten Dosen & Praktikum · Mobile and Web Programming',
    short: 'Asisten Dosen & Praktikum',
    company: 'School of Computing, Telkom University',
    org: 'Telkom University',
    period: '2024 – 2025',
    current: false,
    points: [
      'Asisten dosen Mobile Programming: membimbing tugas dan proyek pengembangan aplikasi, mereview kode, dan membuka sesi konsultasi.',
      'Asisten praktikum Pemrograman Web: memimpin sesi mingguan dari markup dan styling hingga logika sisi server, menyiapkan materi, dan menilai laporan praktikum.',
    ],
    tags: ['Flutter', 'PHP', 'Code Review'],
    accent: 'emerald',
  },
  {
    id: 4,
    title: 'Software Engineer Intern · SSO Finance, Unit FSS',
    short: 'Software Engineer Intern',
    company: 'PT Telkom Indonesia (Persero) Tbk',
    org: 'Telkom Indonesia',
    period: 'Agu 2023',
    current: false,
    points: [
      'Membangun “MySwifty”, aplikasi web internal (CodeIgniter, JavaScript, Oracle) yang menyederhanakan operasional rutin unit keuangan.',
      'Merancang UI/UX di Figma dan mengerjakannya dalam sprint Agile bersama pengguna bisnis unit tersebut.',
    ],
    tags: ['CodeIgniter', 'Oracle', 'Figma'],
    accent: 'amber',
  },
]

export const education = [
  {
    degree: 'Magister Informatika',
    school: 'Telkom University, Bandung',
    period: 'Agu 2024 – Agu 2026',
    gpa: '3.49',
    note: 'Jalur Direct Track (akselerasi) · Arsitektur Sistem & Dynamic API',
    detail: 'Tesis: Development of a Multi-Criteria Scientific Publication Ranking Scheme on a Dynamic API Architecture Using a TOPSIS-Based SQL-Driven Approach.',
  },
  {
    degree: 'Sarjana Teknologi Informasi',
    school: 'Telkom University, Bandung',
    period: 'Lulus 2024',
    gpa: '3.31',
    note: 'Dikerjakan dengan Agile Scrum',
    detail: 'Tugas akhir: pengembangan dan implementasi frontend website dashboard riset Direktorat PPM.',
  },
]

// Warna kartu proyek (kelas Tailwind ditulis utuh agar terdeteksi saat build)
const PALETTES = {
  violet: { gradient: 'from-violet-600 via-purple-500 to-indigo-600', colors: ['#7c3aed', '#a855f7', '#4f46e5'], glowColor: 'hover:shadow-violet-500/20', borderHover: 'hover:border-violet-500/60' },
  blue: { gradient: 'from-blue-600 via-cyan-500 to-sky-500', colors: ['#2563eb', '#06b6d4', '#0ea5e9'], glowColor: 'hover:shadow-blue-500/20', borderHover: 'hover:border-blue-500/60' },
  emerald: { gradient: 'from-emerald-600 via-teal-500 to-cyan-600', colors: ['#059669', '#14b8a6', '#0891b2'], glowColor: 'hover:shadow-emerald-500/20', borderHover: 'hover:border-emerald-500/60' },
  amber: { gradient: 'from-amber-500 via-orange-500 to-rose-500', colors: ['#f59e0b', '#f97316', '#f43f5e'], glowColor: 'hover:shadow-amber-500/20', borderHover: 'hover:border-amber-500/60' },
  rose: { gradient: 'from-rose-600 via-pink-500 to-fuchsia-600', colors: ['#e11d48', '#ec4899', '#c026d3'], glowColor: 'hover:shadow-rose-500/20', borderHover: 'hover:border-rose-500/60' },
  cyan: { gradient: 'from-cyan-600 via-sky-500 to-blue-600', colors: ['#0891b2', '#0ea5e9', '#2563eb'], glowColor: 'hover:shadow-cyan-500/20', borderHover: 'hover:border-cyan-500/60' },
}

const rawProjects: {
  id: number
  title: string
  category: 'klien' | 'riset'
  /** Klien, hibah, atau program di balik proyek */
  org: string
  /** Label pendek untuk lencana kartu */
  badge: string
  ongoing?: boolean
  /** Ditampilkan sebagai papan reklame di dunia 3D (maksimal 3) */
  featured?: boolean
  icon: string
  palette: keyof typeof PALETTES
  shortDesc: string
  fullDesc: string
  tags: string[]
}[] = [
  {
    id: 1,
    title: 'Corrosion Detection Application',
    category: 'klien',
    org: 'Terra Drone',
    badge: 'Terra Drone · Berjalan',
    ongoing: true,
    featured: true,
    icon: '🛰️',
    palette: 'cyan',
    shortDesc: 'Deteksi dan pelaporan korosi struktur dari citra inspeksi drone.',
    fullDesc: 'Aplikasi untuk mendeteksi dan melaporkan korosi struktural dari citra inspeksi drone, menggantikan penilaian visual manual atas rekaman inspeksi.',
    tags: ['Citra Drone', 'Deteksi', 'Pelaporan'],
  },
  {
    id: 2,
    title: 'Accessible Web Platform',
    category: 'klien',
    org: 'IdeaHub',
    badge: 'IdeaHub',
    icon: '♿',
    palette: 'violet',
    shortDesc: 'Aplikasi web inklusif yang mengikuti pedoman WCAG.',
    fullDesc: 'Aplikasi web inklusif yang dibangun mengikuti pedoman WCAG: struktur semantik, navigasi keyboard, kontras, dan dukungan screen reader bagi pengguna disabilitas.',
    tags: ['WCAG Accessibility', 'Semantic HTML', 'Navigasi Keyboard'],
  },
  {
    id: 3,
    title: 'Digital Signage Platform',
    category: 'klien',
    org: 'RW 08 Kujangsari, Bandung',
    badge: 'RW 08 Kujangsari',
    icon: '📺',
    palette: 'blue',
    shortDesc: 'Pengumuman dan iklan digital di monitor ruang publik.',
    fullDesc: 'Platform Laravel (Blade, PHP) untuk menayangkan pengumuman dan iklan digital di monitor ruang publik, dengan pengelola konten/playlist untuk admin dan tampilan layar penuh yang menjalankan rotasi konten terjadwal.',
    tags: ['Laravel', 'Blade Templating', 'PHP'],
  },
  {
    id: 4,
    title: 'E-Selamat: Sistem Pencatatan Hewan Kurban',
    category: 'klien',
    org: 'DKPP Kota Bandung',
    badge: 'DKPP Kota Bandung',
    featured: true,
    icon: '🐄',
    palette: 'emerald',
    shortDesc: 'Pencatatan dan verifikasi hewan kurban se-Kota Bandung saat Iduladha.',
    fullDesc: 'Pencatatan dan verifikasi hewan kurban se-Kota Bandung, digunakan dinas ketahanan pangan dan pertanian Kota Bandung pada siklus Iduladha tahunan.',
    tags: ['Pemerintahan', 'Pencatatan Data', 'Verifikasi'],
  },
  {
    id: 5,
    title: 'E-Laman Hati: Registri Hewan',
    category: 'klien',
    org: 'DKPP Kota Bandung',
    badge: 'DKPP Kota Bandung',
    icon: '🐾',
    palette: 'amber',
    shortDesc: 'Registri hewan peliharaan dan hewan liar di Kota Bandung.',
    fullDesc: 'Registri hewan peliharaan dan hewan liar di Kota Bandung, mendukung pengumpulan data lapangan dan pelaporan tingkat dinas.',
    tags: ['Pemerintahan', 'Data Lapangan', 'Pelaporan'],
  },
  {
    id: 6,
    title: 'PrProposal: Pengajuan Topik Tugas Akhir',
    category: 'klien',
    org: 'Telkom University',
    badge: 'Telkom University',
    icon: '📝',
    palette: 'rose',
    shortDesc: 'Mahasiswa mengajukan topik tugas akhir, dosen mereview dan menyetujui.',
    fullDesc: 'Aplikasi workflow full-stack bagi mahasiswa untuk mengajukan topik tugas akhir dan bagi dosen untuk mereview serta menyetujuinya.',
    tags: ['Full-Stack', 'Workflow', 'Persetujuan'],
  },
  {
    id: 7,
    title: 'Drone Video-Streaming App',
    category: 'klien',
    org: 'Klien privat',
    badge: 'Klien privat',
    icon: '🚁',
    palette: 'cyan',
    shortDesc: 'Video udara langsung dari perangkat drone ke operator lapangan.',
    fullDesc: 'Aplikasi mobile Flutter dan Firebase yang menghadirkan video udara langsung dari perangkat drone ke operator lapangan.',
    tags: ['Flutter', 'Firebase', 'Live Video'],
  },
  {
    id: 8,
    title: 'Peringkat Publikasi dengan Dynamic API & TOPSIS',
    category: 'riset',
    org: 'Tesis Magister · Telkom University',
    badge: 'Tesis S2',
    icon: '🔬',
    palette: 'violet',
    shortDesc: 'Pemeringkatan publikasi multi-kriteria pada arsitektur dynamic API.',
    fullDesc: 'Tesis magister: skema pemeringkatan publikasi ilmiah multi-kriteria pada arsitektur dynamic API, menggunakan pendekatan SQL-driven berbasis TOPSIS.',
    tags: ['TOPSIS / MCDM', 'Dynamic API', 'SQL (MySQL · Oracle)'],
  },
  {
    id: 9,
    title: 'Aplikasi Pra-Skrining Psikologis Berbasis AI',
    category: 'riset',
    org: 'Hibah Riset DPPM',
    badge: 'Hibah DPPM',
    icon: '🧠',
    palette: 'rose',
    shortDesc: 'Agentic AI yang mengarahkan dan menafsirkan alur skrining.',
    fullDesc: 'Aplikasi asesmen yang memakai agentic AI untuk mengarahkan, menyesuaikan, dan menafsirkan alur pra-skrining psikologis. Dikerjakan sebagai asisten riset pada hibah riset DPPM.',
    tags: ['Agentic AI', 'Asesmen'],
  },
  {
    id: 10,
    title: 'IoT Lingkungan & Aplikasi Edukasi Gamifikasi',
    category: 'riset',
    org: 'Hibah Komunitas “Ayo Beraksi”',
    badge: 'Hibah Ayo Beraksi',
    featured: true,
    icon: '🌱',
    palette: 'emerald',
    shortDesc: 'Kendali iklim ruangan 40ft ditambah aplikasi edukasi bergamifikasi.',
    fullDesc: 'Sistem pemantauan dan kendali iklim untuk ruangan 40ft (akuisisi sensor ESP32, kendali, pelaporan) ditambah aplikasi mobile bergamifikasi untuk mendorong perilaku ramah lingkungan masyarakat. Diterapkan di Kabupaten Tulang Bawang, Lampung.',
    tags: ['ESP32 & Arduino', 'Real-Time Monitoring', 'Gamifikasi'],
  },
  {
    id: 11,
    title: 'Prediksi Produksi Biogas dengan IoT & Deep Learning',
    category: 'riset',
    org: 'Riset mandiri',
    badge: 'Riset mandiri',
    icon: '⚗️',
    palette: 'amber',
    shortDesc: 'Pipeline sensor yang memasok model prediksi CNN dan LSTM.',
    fullDesc: 'Pipeline sensor ESP32 dan Arduino yang memasok model CNN dan LSTM untuk memprediksi produksi biogas.',
    tags: ['ESP32 & Arduino', 'CNN', 'LSTM'],
  },
  {
    id: 12,
    title: 'HEI Character Assessment',
    category: 'riset',
    org: 'Telkom University',
    badge: 'Telkom University',
    icon: '🎓',
    palette: 'blue',
    shortDesc: 'Aplikasi asesmen karakter beserta naskah akademik dan artikel jurnal.',
    fullDesc: 'Pengembangan aplikasi asesmen karakter HEI untuk Telkom University, disertai naskah akademik dan artikel jurnal pendampingnya.',
    tags: ['Asesmen', 'Artikel Jurnal'],
  },
]

export const projects = rawProjects.map((p) => ({ ...p, ...PALETTES[p.palette] }))

export type Project = (typeof projects)[number]

/** Proyek yang tampil sebagai papan reklame di pulau 3D */
export const featuredProjects = projects.filter((p) => p.featured).slice(0, 3)

export const categoryLabel = (category: Project['category']) => (category === 'riset' ? 'Riset & Hibah' : 'Proyek Klien')

export const publications = [
  { title: 'Performance Evaluation of API Gateways in Microservices System: No Gateway, Kong, and Native', venue: 'International Seminar on Intelligent Technology and Its Applications (ISITIA), IEEE, pp. 322–327', year: '2026', role: 'Penulis 3 dari 3', lead: false },
  { title: 'Pose-Based Action Recognition in Tennis using MediaPipe and LSTM', venue: 'Indonesian Journal on Computing (IJoICT)', year: '2025', role: 'Penulis 3 dari 3', lead: false },
  { title: 'A Design Thinking Approach to the Development of Digitalized Hotel Valet Services', venue: 'International Conference on Advancement in Data Science', year: '2025', role: 'Penulis 3 dari 4', lead: false },
  { title: 'Design and Implementation of a Real-Time Monitoring System for Bird Tracking Applications', venue: 'IEEE 9th International Conference on Software Engineering', year: '2025', role: 'Penulis 5 dari 6', lead: false },
  { title: 'Optimized Semantic Segmentation for Fish Detection Using DeepLabv3 and MobileNetV3 on Resource-Constrained Systems', venue: 'IEEE 9th International Conference on Software Engineering', year: '2025', role: 'Penulis 4 dari 6', lead: false },
  { title: 'Frontend Design and Implementation of a Research Dashboard for the PPM Directorate Using the Agile Scrum Methodology', venue: '3rd International Conference on Software Engineering and Information', year: '2025', role: 'Penulis pertama & korespondensi', lead: true },
  { title: 'A Digital Solution for Zoo Health Management: Ensuring Continuity of Care Without In-House Veterinarians', venue: '3rd International Conference on Software Engineering and Information', year: '2025', role: 'Penulis pertama & korespondensi', lead: true },
  { title: 'Implementasi Microchip pada Hewan untuk Monitoring Rabies', venue: 'JAPATUM: Jurnal Pemanfaatan Teknologi untuk Masyarakat', year: '2025', role: 'Penulis pertama & korespondensi', lead: true },
]

// Level skill adalah estimasi pribadi (CV tidak mencantumkan level): silakan sesuaikan.
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
      { name: 'Laravel', level: 92 },
      { name: 'Git', level: 90 },
      { name: 'PHP', level: 88 },
      { name: 'REST API', level: 88 },
      { name: 'SQL (MySQL · Oracle)', level: 85 },
      { name: 'VPS & CyberPanel', level: 85 },
      { name: 'n8n Automation', level: 85 },
      { name: 'Server Monitoring', level: 82 },
      { name: 'CodeIgniter', level: 80 },
      { name: 'Python', level: 78 },
    ],
  },
  {
    label: 'AI & IoT',
    key: 'ai',
    hex: '#a855f7',
    accentBorder: 'hover:border-violet-500/50',
    accentIcon: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    barFrom: 'from-violet-500',
    barTo: 'to-purple-500',
    badgeBg: 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-500/20',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
    skills: [
      { name: 'TOPSIS / MCDM', level: 86 },
      { name: 'Agentic AI', level: 82 },
      { name: 'ESP32 & Arduino', level: 82 },
      { name: 'Sensor Pipelines', level: 80 },
      { name: 'Real-Time Monitoring', level: 80 },
      { name: 'Deep Learning', level: 76 },
      { name: 'CNN', level: 74 },
      { name: 'LSTM', level: 74 },
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
      { name: 'Flutter', level: 90 },
      { name: 'Blade Templating', level: 88 },
      { name: 'Dart', level: 86 },
      { name: 'Responsive UI', level: 85 },
      { name: 'JavaScript', level: 82 },
      { name: 'Firebase', level: 80 },
      { name: 'WCAG Accessibility', level: 78 },
      { name: 'Figma', level: 76 },
    ],
  },
]

export const milestones = [
  {
    year: '2026',
    title: 'Technical Lead Helper · CoE CAATIS',
    desc: 'Menjalankan operasional teknis, backup data, dan otomasi KPI berbasis n8n untuk pusat riset Telkom University.',
    icon: '⚙️',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
  },
  {
    year: '2025–26',
    title: '8 Publikasi Ilmiah',
    desc: 'Terbit di konferensi IEEE dan jurnal nasional, tiga di antaranya sebagai penulis pertama dan korespondensi.',
    icon: '📚',
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-500/10',
    border: 'border-violet-200 dark:border-violet-500/20',
    text: 'text-violet-600 dark:text-violet-400',
  },
  {
    year: '2024',
    title: 'Lulus S1 → Magister Direct Track',
    desc: 'Lulus dari Telkom University (IPK 3.31) dan langsung melanjutkan ke Magister Informatika jalur akselerasi.',
    icon: '🎓',
    color: 'from-cyan-500 to-teal-500',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-200 dark:border-cyan-500/20',
    text: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    year: '2023',
    title: 'Mulai Freelance & Magang Telkom Indonesia',
    desc: 'Mulai membangun aplikasi untuk klien nyata dan mengembangkan “MySwifty” untuk unit keuangan PT Telkom Indonesia.',
    icon: '🚀',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
]

export const currentFocus = [
  { label: 'Aplikasi Deteksi Korosi', icon: '🛰️', note: 'Klien: Terra Drone' },
  { label: 'Operasional CoE CAATIS', icon: '⚙️', note: 'Server, backup, otomasi KPI' },
  { label: 'Proyek Klien Freelance', icon: '💼', note: 'Laravel & Flutter' },
  { label: 'Riset & Publikasi', icon: '📚', note: 'Arsitektur API, AI & IoT' },
]

export const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/sheinafathurr1',
    icon: `<svg fill="currentColor" viewBox="0 0 24 24" class="h-5 w-5"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sheinafathurr1/',
    icon: `<svg fill="currentColor" viewBox="0 0 24 24" class="h-5 w-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  },
  {
    label: 'Google Scholar',
    href: 'https://scholar.google.com/citations?user=xrlNfIQAAAAJ',
    icon: `<svg fill="currentColor" viewBox="0 0 24 24" class="h-5 w-5"><path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3Zm-7 10.2v4L12 21l7-3.8v-4L12 17l-7-3.8Z"/></svg>`,
  },
  {
    label: 'Email',
    href: 'mailto:sheinafathur@gmail.com',
    icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
  },
]
