// Single source of truth for portfolio content, kept in line with the CV. Edit here; every screen reads from this file.

export const profile = {
  name: 'Sheina Fathur Rahman',
  alias: 'Switch',
  headline: 'Full-Stack Developer · AI & IoT Integration',
  roles: ['Full-Stack Developer', 'AI & IoT Engineer', 'Researcher', 'Server & Automation'],
  summary:
    'Full-stack developer with three years of delivering production web and mobile applications for government agencies, startups, and private clients, from requirements gathering through deployment and server operations. Core stack is Laravel and Flutter, extended by AI and IoT integration work (agentic AI, deep learning, sensor pipelines) and hands-on infrastructure experience running servers, backups, and workflow automation.',
  stack: ['Laravel', 'Flutter', 'PHP', 'Python', 'ESP32', 'n8n'],
  email: 'sheinafathur@gmail.com',
  location: 'Bandung, West Java',
  /** Optional PDF CV: put the file in /public and set its path (e.g. '/cv-switch.pdf') to show a Download PDF button. */
  cvUrl: '',
}

/** Headline numbers. `short` is the compact form used in the menu HUD. */
export const highlights = [
  { value: '3+', label: 'Years Freelancing', short: 'yrs shipping', desc: 'Production web and mobile apps since 2023' },
  { value: '7', label: 'Freelance Clients', short: 'clients', desc: 'Including two municipal government units and two tech companies' },
  { value: '8', label: 'Peer-Reviewed Papers', short: 'papers', desc: 'IEEE conferences and national journals, 2025–2026' },
  { value: '3.49', label: 'Master’s GPA', short: 'GPA', desc: 'Master of Informatics, Telkom University (Direct Track)' },
]

export const experiences: {
  id: number
  title: string
  company: string
  period: string
  /** Start month (YYYY-MM); drives the Confidant rank. */
  start: string
  /** End month (YYYY-MM) for roles that have finished. */
  end?: string
  points: string[]
  tags: string[]
}[] = [
  {
    id: 1,
    title: 'Freelance Full-Stack Web & Mobile Developer',
    company: 'Self-employed · Bandung',
    period: '2023 – Present',
    start: '2023-01', // the CV lists the year only
    points: [
      'Contracted directly by seven clients, including two municipal government units and two technology companies, to deliver Laravel and Flutter applications end to end.',
      'Own the full cycle: requirements gathering with non-technical stakeholders, database and API design, implementation, testing, release, and production support.',
      'Handle deployment and server configuration on VPS, CyberPanel, and Hostinger environments, including domain, SSL, and scheduled task setup.',
    ],
    tags: ['Laravel', 'Flutter', 'VPS & CyberPanel'],
  },
  {
    id: 2,
    title: 'Technical Lead Helper (TLH) / Research Assistant',
    company: 'CoE CAATIS, Telkom University',
    period: 'Jan 2026 – Present',
    start: '2026-01',
    points: [
      'Run technical operations for the research centre: server monitoring, uptime, and a data backup scheme protecting the lab’s project assets.',
      'Built n8n automations connecting internal databases to Telegram for real-time KPI alerts and periodic reporting, removing manual status collection.',
      'Designed and maintain the digital archive of technical and project documentation used across the centre.',
    ],
    tags: ['Server Monitoring', 'n8n Automation', 'Backup Design'],
  },
  {
    id: 3,
    title: 'Teaching & Laboratory Assistant · Mobile and Web Programming',
    company: 'School of Computing, Telkom University',
    period: '2024 – 2025',
    start: '2024-08', // the CV lists years only (one academic year)
    end: '2025-07',
    points: [
      'Lecture assistant for Mobile Programming: guided students through app development assignments, reviewed code, and ran consultation sessions.',
      'Laboratory assistant for the Web Programming practicum: led weekly sessions from markup and styling to server-side logic, prepared materials, and graded lab reports.',
    ],
    tags: ['Flutter', 'PHP', 'Code Review'],
  },
  {
    id: 4,
    title: 'Software Engineer Intern · SSO Finance, Unit FSS',
    company: 'PT Telkom Indonesia (Persero) Tbk',
    period: 'Aug 2023',
    start: '2023-08',
    end: '2023-08',
    points: [
      'Built “MySwifty”, an internal web application (CodeIgniter, JavaScript, Oracle) that streamlined recurring finance-unit operations.',
      'Designed the UI/UX in Figma and delivered in Agile sprints alongside the unit’s business users.',
    ],
    tags: ['CodeIgniter', 'Oracle', 'Figma'],
  },
]

export const education = [
  {
    degree: 'Master of Informatics',
    school: 'Telkom University, Bandung',
    period: 'Aug 2024 – Aug 2026',
    gpa: '3.49',
    note: 'Direct Track (accelerated) · System Architecture & Dynamic API',
    detail: 'Thesis: Development of a Multi-Criteria Scientific Publication Ranking Scheme on a Dynamic API Architecture Using a TOPSIS-Based SQL-Driven Approach.',
  },
  {
    degree: 'Bachelor of Information Technology',
    school: 'Telkom University, Bandung',
    period: 'Graduated 2024',
    gpa: '3.31',
    note: 'Delivered with Agile Scrum',
    detail: 'Final project: frontend design and implementation of the PPM Directorate research dashboard.',
  },
]

export const projects: {
  id: number
  title: string
  category: 'client' | 'research'
  /** Client, grant, or programme behind the project */
  org: string
  ongoing?: boolean
  icon: string
  shortDesc: string
  fullDesc: string
  tags: string[]
}[] = [
  {
    id: 1,
    title: 'Corrosion Detection Application',
    category: 'client',
    org: 'Terra Drone',
    ongoing: true,
    icon: '🛰️',
    shortDesc: 'Detects and reports structural corrosion from drone inspection imagery.',
    fullDesc: 'Detection and reporting of structural corrosion from drone inspection imagery, replacing manual visual assessment of inspection footage.',
    tags: ['Drone Imagery', 'Detection', 'Reporting'],
  },
  {
    id: 2,
    title: 'Accessible Web Platform',
    category: 'client',
    org: 'IdeaHub',
    icon: '♿',
    shortDesc: 'An inclusive web application built to WCAG guidelines.',
    fullDesc: 'Inclusive web application built to WCAG guidelines: semantic structure, keyboard navigation, contrast, and screen-reader support for users with disabilities.',
    tags: ['WCAG Accessibility', 'Semantic HTML', 'Keyboard Navigation'],
  },
  {
    id: 3,
    title: 'Digital Signage Platform',
    category: 'client',
    org: 'RW 08 Kujangsari, Bandung',
    icon: '📺',
    shortDesc: 'Announcements and digital ads on public-space monitors.',
    fullDesc: 'Laravel (Blade, PHP) platform broadcasting announcements and digital ads to public-space monitors, with an admin content/playlist manager and a full-screen display client running scheduled rotation.',
    tags: ['Laravel', 'Blade Templating', 'PHP'],
  },
  {
    id: 4,
    title: 'E-Selamat: Livestock Recording System',
    category: 'client',
    org: 'DKPP Kota Bandung',
    icon: '🐄',
    shortDesc: 'City-wide recording of sacrificial animals during Idul Adha.',
    fullDesc: 'City-wide recording and verification of sacrificial animals (hewan kurban), used by the Bandung agriculture and food security agency during the annual Idul Adha cycle.',
    tags: ['Government', 'Data Recording', 'Verification'],
  },
  {
    id: 5,
    title: 'E-Laman Hati: Animal Registry',
    category: 'client',
    org: 'DKPP Kota Bandung',
    icon: '🐾',
    shortDesc: 'Registry for pets and stray animals across Bandung.',
    fullDesc: 'Registry for pets and stray animals across the City of Bandung, supporting field data collection and agency-level reporting.',
    tags: ['Government', 'Field Data', 'Reporting'],
  },
  {
    id: 6,
    title: 'PrProposal: Final-Project Topic Submission',
    category: 'client',
    org: 'Telkom University',
    icon: '📝',
    shortDesc: 'Students submit final-project topics; lecturers review and approve.',
    fullDesc: 'Full-stack workflow application for students to submit final-project topics and for lecturers to review and approve them.',
    tags: ['Full-Stack', 'Workflow', 'Approvals'],
  },
  {
    id: 7,
    title: 'Drone Video-Streaming App',
    category: 'client',
    org: 'Private client',
    icon: '🚁',
    shortDesc: 'Live aerial video from drone hardware to field operators.',
    fullDesc: 'Flutter and Firebase mobile application delivering live aerial video from drone hardware to field operators.',
    tags: ['Flutter', 'Firebase', 'Live Video'],
  },
  {
    id: 8,
    title: 'Dynamic API & TOPSIS Publication Ranking',
    category: 'research',
    org: 'Master’s thesis · Telkom University',
    icon: '🔬',
    shortDesc: 'Multi-criteria publication ranking on a dynamic API architecture.',
    fullDesc: 'Master’s thesis: a multi-criteria scientific publication ranking scheme on a dynamic API architecture, using a TOPSIS-based SQL-driven approach.',
    tags: ['TOPSIS / MCDM', 'Dynamic API', 'SQL (MySQL · Oracle)'],
  },
  {
    id: 9,
    title: 'AI Psychological Pre-Screening Application',
    category: 'research',
    org: 'DPPM Research Grant',
    icon: '🧠',
    shortDesc: 'Agentic AI that drives, adapts, and interprets a screening flow.',
    fullDesc: 'Assessment application using agentic AI to drive, adapt, and interpret the psychological pre-screening flow, built as a research assistant on a DPPM research grant.',
    tags: ['Agentic AI', 'Assessment'],
  },
  {
    id: 10,
    title: 'Environmental IoT & Gamified Awareness App',
    category: 'research',
    org: '“Ayo Beraksi” Community Grant',
    icon: '🌱',
    shortDesc: 'Climate control for a 40ft room plus a gamified awareness app.',
    fullDesc: 'Climate monitoring and control system for a 40ft room (ESP32 sensor acquisition, control, reporting) plus a gamified mobile app driving community environmental behaviour. Deployed in Tulang Bawang Regency, Lampung.',
    tags: ['ESP32 & Arduino', 'Real-Time Monitoring', 'Gamification'],
  },
  {
    id: 11,
    title: 'Biogas Yield Prediction with IoT & Deep Learning',
    category: 'research',
    org: 'Independent research',
    icon: '⚗️',
    shortDesc: 'A sensor pipeline feeding CNN and LSTM forecasting models.',
    fullDesc: 'ESP32 and Arduino sensor pipeline feeding CNN and LSTM models for biogas production forecasting.',
    tags: ['ESP32 & Arduino', 'CNN', 'LSTM'],
  },
  {
    id: 12,
    title: 'HEI Character Assessment',
    category: 'research',
    org: 'Telkom University',
    icon: '🎓',
    shortDesc: 'An assessment app plus its academic manuscript and journal article.',
    fullDesc: 'Development of the HEI character assessment application for Telkom University, together with the accompanying academic manuscript and journal article.',
    tags: ['Assessment', 'Journal Article'],
  },
]

export type Project = (typeof projects)[number]

export const publications = [
  { title: 'Performance Evaluation of API Gateways in Microservices System: No Gateway, Kong, and Native', venue: 'International Seminar on Intelligent Technology and Its Applications (ISITIA), IEEE, pp. 322–327', year: '2026', role: 'Author 3 of 3', lead: false },
  { title: 'Pose-Based Action Recognition in Tennis using MediaPipe and LSTM', venue: 'Indonesian Journal on Computing (IJoICT)', year: '2025', role: 'Author 3 of 3', lead: false },
  { title: 'A Design Thinking Approach to the Development of Digitalized Hotel Valet Services', venue: 'International Conference on Advancement in Data Science', year: '2025', role: 'Author 3 of 4', lead: false },
  { title: 'Design and Implementation of a Real-Time Monitoring System for Bird Tracking Applications', venue: 'IEEE 9th International Conference on Software Engineering', year: '2025', role: 'Author 5 of 6', lead: false },
  { title: 'Optimized Semantic Segmentation for Fish Detection Using DeepLabv3 and MobileNetV3 on Resource-Constrained Systems', venue: 'IEEE 9th International Conference on Software Engineering', year: '2025', role: 'Author 4 of 6', lead: false },
  { title: 'Frontend Design and Implementation of a Research Dashboard for the PPM Directorate Using the Agile Scrum Methodology', venue: '3rd International Conference on Software Engineering and Information', year: '2025', role: 'First & corresponding author', lead: true },
  { title: 'A Digital Solution for Zoo Health Management: Ensuring Continuity of Care Without In-House Veterinarians', venue: '3rd International Conference on Software Engineering and Information', year: '2025', role: 'First & corresponding author', lead: true },
  { title: 'Implementasi Microchip pada Hewan untuk Monitoring Rabies', venue: 'JAPATUM: Jurnal Pemanfaatan Teknologi untuk Masyarakat', year: '2025', role: 'First & corresponding author', lead: true },
]

/** Technical skills exactly as grouped on the CV (used by the résumé). */
export const skillGroups = [
  { label: 'Backend', items: 'Laravel (Blade, Eloquent, REST API), CodeIgniter, PHP, Python, SQL (MySQL, Oracle)' },
  { label: 'Frontend & Mobile', items: 'JavaScript, Blade templating, responsive UI, WCAG accessibility, Flutter, Dart, Firebase' },
  { label: 'AI & Data', items: 'Agentic AI workflows, Deep Learning, CNN, LSTM, multi-criteria decision methods (TOPSIS)' },
  { label: 'IoT', items: 'ESP32, Arduino (C++), sensor acquisition, real-time monitoring and control systems' },
  { label: 'Infrastructure', items: 'VPS, CyberPanel, Hostinger, deployment, server monitoring, backup design, n8n automation' },
  { label: 'Ways of Working', items: 'Agile / Scrum, Git, Figma, client-facing requirements gathering, technical documentation' },
]

// Skills with levels for the game screens. Levels are self-assessed estimates (the CV has none): adjust freely.
export const skillCategories = [
  {
    label: 'Backend & Infrastructure',
    short: 'Backend',
    key: 'backend',
    skills: [
      { name: 'Laravel',              level: 92 },
      { name: 'Git',                  level: 90 },
      { name: 'PHP',                  level: 88 },
      { name: 'REST API',             level: 88 },
      { name: 'SQL (MySQL · Oracle)', level: 85 },
      { name: 'VPS & CyberPanel',     level: 85 },
      { name: 'n8n Automation',       level: 85 },
      { name: 'Server Monitoring',    level: 82 },
      { name: 'CodeIgniter',          level: 80 },
      { name: 'Python',               level: 78 },
    ],
  },
  {
    label: 'AI & IoT',
    short: 'AI & IoT',
    key: 'ai',
    skills: [
      { name: 'TOPSIS / MCDM',        level: 86 },
      { name: 'Agentic AI',           level: 82 },
      { name: 'ESP32 & Arduino',      level: 82 },
      { name: 'Sensor Pipelines',     level: 80 },
      { name: 'Real-Time Monitoring', level: 80 },
      { name: 'Deep Learning',        level: 76 },
      { name: 'CNN',                  level: 74 },
      { name: 'LSTM',                 level: 74 },
    ],
  },
  {
    label: 'Frontend & Mobile',
    short: 'Frontend',
    key: 'frontend',
    skills: [
      { name: 'Flutter',            level: 90 },
      { name: 'Blade Templating',   level: 88 },
      { name: 'Dart',               level: 86 },
      { name: 'Responsive UI',      level: 85 },
      { name: 'JavaScript',         level: 82 },
      { name: 'Firebase',           level: 80 },
      { name: 'WCAG Accessibility', level: 78 },
      { name: 'Figma',              level: 76 },
    ],
  },
]

export const allSkills = skillCategories.flatMap((c) => c.skills)

export const milestones = [
  { year: '2026', title: 'Technical Lead Helper · CoE CAATIS', icon: '⚙️', desc: 'Running technical operations, data backups, and n8n KPI automation for a Telkom University research centre.' },
  { year: '2025–26', title: 'Eight Peer-Reviewed Papers', icon: '📚', desc: 'Published across IEEE conferences and national journals, three of them as first and corresponding author.' },
  { year: '2024', title: 'B.IT Graduate → Master’s Direct Track', icon: '🎓', desc: 'Graduated from Telkom University (GPA 3.31) and went straight into the accelerated Master of Informatics.' },
  { year: '2023', title: 'Freelancing & Telkom Indonesia Internship', icon: '🚀', desc: 'Started delivering apps for real clients and built “MySwifty” for PT Telkom Indonesia’s finance unit.' },
]

export const currentFocus = [
  { label: 'Corrosion Detection App', icon: '🛰️', note: 'Client: Terra Drone' },
  { label: 'CoE CAATIS Operations', icon: '⚙️', note: 'Servers, backups, KPI automation' },
  { label: 'Freelance Client Work', icon: '💼', note: 'Laravel & Flutter' },
  { label: 'Research & Publications', icon: '📚', note: 'API architecture, AI & IoT' },
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
