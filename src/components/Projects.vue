<script setup lang="ts">
import { ref, computed } from 'vue'

const projects = ref<any>([])
const isLoading = ref(true)

const activeCategory = ref('semua')
const isModalOpen = ref(false)
const selectedProject = ref<any>(null)

const fetchProjects = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/projects')
    const result = await response.json()
    projects.value = result.data
  } catch (error) {
    console.error('Gagal mengambil data proyek:', error)
  } finally {
    isLoading.value = false
  }
}

fetchProjects()

const filteredProjects = computed(() => {
  if (activeCategory.value === 'semua') return projects.value
  return projects.value.filter((p: any) => p.category === activeCategory.value)
})

const openModal = (project: any) => {
  selectedProject.value = project
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isModalOpen.value = false
  document.body.style.overflow = 'auto'
  setTimeout(() => {
    selectedProject.value = null
  }, 300)
}

const categories = [
  { id: 'semua', label: 'Semua' },
  { id: 'riset', label: 'Riset Akademik' },
  { id: 'development', label: 'Sistem Aplikasi' },
]
</script>

<template>
  <section id="projects" class="py-24 px-4 relative transition-colors duration-300 z-10">
    <div class="max-w-6xl mx-auto">
      <div data-aos="fade-up" class="text-center mb-12">
        <span class="inline-block text-xs font-bold font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 bg-blue-50 dark:bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/20">
          Portfolio
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors">
          Proyek & Riset
        </h2>
        <div class="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
      </div>

      <!-- Filter tabs -->
      <div data-aos="fade-up" class="flex justify-center gap-2 mb-12">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          :class="[
            'px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300',
            activeCategory === cat.id
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white/60 dark:bg-gray-900/40 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400'
          ]"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-flex items-center gap-3 text-blue-500 font-mono">
          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Memuat data proyek...
        </div>
      </div>

      <!-- Project grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(project, index) in filteredProjects"
          :key="project.id"
          @click="openModal(project)"
          :data-aos-delay="index * 80"
          data-aos="fade-up"
          :class="[
            'group relative bg-white/80 dark:bg-gray-900/60 backdrop-blur-md p-7 rounded-2xl border transition-all duration-300 hover:-translate-y-2 shadow-md hover:shadow-xl shadow-black/5 dark:shadow-black/20 cursor-pointer flex flex-col h-full overflow-hidden',
            project.category === 'riset'
              ? 'border-gray-200/50 dark:border-gray-700/50 hover:border-violet-500/50 hover:shadow-violet-500/10'
              : 'border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 hover:shadow-blue-500/10'
          ]"
        >
          <!-- Top accent bar -->
          <div
            :class="[
              'absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
              project.category === 'riset'
                ? 'bg-gradient-to-r from-violet-500 to-purple-500'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            ]"
          ></div>

          <!-- Project number -->
          <div class="absolute top-5 right-5 text-xs font-mono font-bold text-gray-300 dark:text-gray-700 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors">
            #{{ String(index + 1).padStart(2, '0') }}
          </div>

          <!-- Category badge -->
          <div
            :class="[
              'inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase px-2.5 py-1 rounded-md mb-4 w-fit',
              project.category === 'riset'
                ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20'
                : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20'
            ]"
          >
            <span>{{ project.category === 'riset' ? '💡' : '💻' }}</span>
            {{ project.category === 'riset' ? 'Academic Research' : 'System Dev' }}
          </div>

          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors pr-6">
            {{ project.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow mb-6">
            {{ project.shortDesc }}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1.5 mt-auto">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md text-xs font-mono border border-gray-200/50 dark:border-gray-700/50"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Hover click indicator -->
          <div class="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div @click="closeModal" class="absolute inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-md"></div>
        <div
          class="bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border border-gray-200 dark:border-gray-700/80 p-8 rounded-2xl max-w-2xl w-full relative z-10 shadow-2xl"
        >
          <!-- Close button -->
          <button
            @click="closeModal"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl w-9 h-9 flex items-center justify-center transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Category -->
          <div
            :class="[
              'inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase px-2.5 py-1 rounded-md mb-4',
              selectedProject?.category === 'riset'
                ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20'
                : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20'
            ]"
          >
            {{ selectedProject?.category === 'riset' ? '💡 Academic Research' : '💻 System Development' }}
          </div>

          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3 pr-8">
            {{ selectedProject?.title }}
          </h3>
          <div
            :class="[
              'w-12 h-0.5 rounded-full mb-6',
              selectedProject?.category === 'riset' ? 'bg-violet-500' : 'bg-blue-500'
            ]"
          ></div>

          <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-sm md:text-base">
            {{ selectedProject?.fullDesc }}
          </p>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in selectedProject?.tags"
              :key="tag"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-semibold font-mono border',
                selectedProject?.category === 'riset'
                  ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20'
                  : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
              ]"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>
