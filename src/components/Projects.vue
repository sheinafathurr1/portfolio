<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const projects = [
  {
    id: 1,
    title: 'Arsitektur Dynamic API & TOPSIS',
    category: 'riset',
    gradient: 'from-violet-600 via-purple-500 to-indigo-600',
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
    glowColor: 'hover:shadow-emerald-500/20',
    borderHover: 'hover:border-emerald-500/60',
    icon: '📡',
    year: '2026',
    shortDesc: 'Pengembangan prototipe aplikasi mobile untuk streaming video latensi rendah berbasis WebRTC.',
    fullDesc: 'Membangun prototipe aplikasi mobile menggunakan Flutter yang diintegrasikan dengan perangkat keras IoT (drone). Sistem ini memanfaatkan WebRTC dan Firebase untuk menghasilkan streaming video real-time dengan latensi yang sangat rendah untuk kebutuhan pengawasan visual.',
    tags: ['Flutter', 'WebRTC', 'Firebase', 'IoT'],
  },
]

const activeCategory = ref('semua')
const isModalOpen = ref(false)
const selectedProject = ref<typeof projects[0] | null>(null)

const filteredProjects = computed(() => {
  if (activeCategory.value === 'semua') return projects
  return projects.filter((p) => p.category === activeCategory.value)
})

const openModal = (project: typeof projects[0]) => {
  selectedProject.value = project
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isModalOpen.value = false
  document.body.style.overflow = 'auto'
  setTimeout(() => { selectedProject.value = null }, 300)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isModalOpen.value) closeModal()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

const categories = [
  { id: 'semua', label: 'Semua', count: projects.length },
  { id: 'riset', label: 'Riset Akademik', count: projects.filter(p => p.category === 'riset').length },
  { id: 'development', label: 'Sistem Aplikasi', count: projects.filter(p => p.category === 'development').length },
]

// 3D tilt per card
const tilts = ref<Record<number, { x: number; y: number }>>(
  Object.fromEntries(projects.map(p => [p.id, { x: 0, y: 0 }]))
)

const handleCardMouseMove = (e: MouseEvent, id: number) => {
  const card = e.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
  const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
  tilts.value[id] = { x: -dy * 7, y: dx * 7 }
}

const handleCardMouseLeave = (id: number) => {
  tilts.value[id] = { x: 0, y: 0 }
}

const cardStyle = (id: number) => {
  const t = tilts.value[id] ?? { x: 0, y: 0 }
  const isResting = t.x === 0 && t.y === 0
  return {
    transform: `perspective(900px) rotateX(${t.x}deg) rotateY(${t.y}deg)`,
    transition: isResting ? 'transform 0.55s ease, box-shadow 0.3s ease' : 'transform 0.1s ease',
  }
}
</script>

<template>
  <section id="projects" class="py-24 px-4 relative transition-colors duration-300 z-10">
    <div class="max-w-6xl mx-auto">

      <!-- Header -->
      <div data-aos="fade-up" class="text-center mb-12">
        <span class="inline-block text-xs font-bold font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 bg-blue-50 dark:bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/20">
          Portfolio
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors">
          Proyek & Riset
        </h2>
        <div class="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full mb-4"></div>
        <p class="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto">
          Koleksi proyek riset akademik dan pengembangan sistem yang telah dikerjakan.
        </p>
      </div>

      <!-- Filter tabs -->
      <div data-aos="fade-up" class="flex justify-center gap-2 mb-12 flex-wrap">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          :class="[
            'px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2',
            activeCategory === cat.id
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25 scale-105'
              : 'bg-white/60 dark:bg-gray-900/40 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400'
          ]"
        >
          {{ cat.label }}
          <span
            :class="[
              'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
              activeCategory === cat.id
                ? 'bg-white/25 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            ]"
          >{{ cat.count }}</span>
        </button>
      </div>

      <!-- Project grid -->
      <TransitionGroup
        name="project-list"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="(project, index) in filteredProjects"
          :key="project.id"
          @click="openModal(project)"
          @mousemove="handleCardMouseMove($event, project.id)"
          @mouseleave="handleCardMouseLeave(project.id)"
          :data-aos-delay="index * 80"
          data-aos="fade-up"
          :style="cardStyle(project.id)"
          :class="[
            'group relative bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-xl shadow-black/5 dark:shadow-black/20 cursor-pointer flex flex-col overflow-hidden will-change-transform',
            project.borderHover,
            project.glowColor,
          ]"
        >
          <!-- Gradient header -->
          <div :class="['h-32 relative overflow-hidden flex-shrink-0 bg-gradient-to-br', project.gradient]">
            <div
              class="absolute inset-0 opacity-20"
              style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 18px 18px;"
            ></div>
            <div class="absolute -top-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
            <div class="absolute bottom-0 -left-4 w-20 h-20 bg-black/15 rounded-full blur-xl"></div>
            <div class="absolute inset-0 flex items-center justify-center text-6xl opacity-25 select-none group-hover:opacity-35 group-hover:scale-110 transition-all duration-500">
              {{ project.icon }}
            </div>
            <div class="absolute top-3 left-3 bg-black/25 backdrop-blur-sm text-white text-[10px] font-bold font-mono px-2 py-1 rounded-lg">
              {{ project.year }}
            </div>
            <div class="absolute top-3 right-3 text-white/40 text-xs font-mono font-bold group-hover:text-white/60 transition-colors">
              #{{ String(project.id).padStart(2, '0') }}
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 flex flex-col flex-grow">
            <div
              :class="[
                'inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase px-2.5 py-1 rounded-md mb-3 w-fit',
                project.category === 'riset'
                  ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20'
                  : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20'
              ]"
            >
              {{ project.category === 'riset' ? 'Academic Research' : 'System Dev' }}
            </div>

            <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors leading-snug">
              {{ project.title }}
            </h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-grow mb-4">
              {{ project.shortDesc }}
            </p>

            <div class="flex flex-wrap gap-1.5 mb-4">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md text-xs font-mono border border-gray-200/50 dark:border-gray-700/50"
              >
                {{ tag }}
              </span>
            </div>

            <div class="flex items-center gap-1.5 text-xs font-semibold text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors mt-auto">
              <span>Lihat Detail</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Modal -->
    <Transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div @click="closeModal" class="absolute inset-0 bg-gray-900/60 dark:bg-black/75 backdrop-blur-md"></div>

        <Transition name="modal">
          <div
            v-if="selectedProject"
            class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/80 rounded-t-2xl sm:rounded-2xl max-w-2xl w-full relative z-10 shadow-2xl overflow-hidden"
          >
            <div :class="['h-40 relative overflow-hidden bg-gradient-to-br', selectedProject.gradient]">
              <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 20px 20px;"></div>
              <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
              <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-black/20 rounded-full blur-2xl"></div>
              <div class="absolute inset-0 flex items-center justify-center text-8xl opacity-20 select-none">
                {{ selectedProject.icon }}
              </div>
              <button
                @click="closeModal"
                class="absolute top-4 right-4 text-white/70 hover:text-white bg-black/25 hover:bg-black/45 backdrop-blur-sm rounded-xl w-9 h-9 flex items-center justify-center transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
              <div class="absolute bottom-3 right-4 text-white/40 text-[10px] font-mono">ESC to close</div>
            </div>

            <div class="p-7 md:p-8">
              <div
                :class="[
                  'inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase px-2.5 py-1 rounded-md mb-4',
                  selectedProject.category === 'riset'
                    ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20'
                    : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20'
                ]"
              >
                {{ selectedProject.category === 'riset' ? '💡 Academic Research' : '💻 System Development' }}
              </div>

              <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {{ selectedProject.title }}
              </h3>
              <div
                :class="['w-12 h-0.5 rounded-full mb-5', selectedProject.category === 'riset' ? 'bg-violet-500' : 'bg-blue-500']"
              ></div>

              <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-7 text-sm md:text-base">
                {{ selectedProject.fullDesc }}
              </p>

              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in selectedProject.tags"
                  :key="tag"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-sm font-semibold font-mono border',
                    selectedProject.category === 'riset'
                      ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20'
                      : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                  ]"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </section>
</template>
