<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const projects = ref<any>([])
const isLoading = ref(true)

const activeCategory = ref('semua')
const isModalOpen = ref(false)
const selectedProject = ref<any>(null)

// Menjemput data dari API Laravel
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

onMounted(() => {
  fetchProjects()
})

// Logika filter mengikuti data API yang sudah tersimpan di state
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
</script>

<template>
  <section id="projects" class="py-24 px-4 relative transition-colors duration-300 z-10">
    <div class="max-w-6xl mx-auto">
      <div data-aos="fade-up" class="text-center mb-10">
        <h2
          class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors"
        >
          Proyek & Riset
        </h2>
        <div class="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
      </div>

      <div data-aos="fade-up" class="flex justify-center gap-2 mb-12">
        <button
          @click="activeCategory = 'semua'"
          :class="
            activeCategory === 'semua'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white/60 dark:bg-gray-900/40 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
          "
          class="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
        >
          Semua
        </button>
        <button
          @click="activeCategory = 'riset'"
          :class="
            activeCategory === 'riset'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white/60 dark:bg-gray-900/40 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
          "
          class="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
        >
          Riset Akademik
        </button>
        <button
          @click="activeCategory = 'development'"
          :class="
            activeCategory === 'development'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white/60 dark:bg-gray-900/40 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
          "
          class="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
        >
          Sistem Aplikasi
        </button>
      </div>

      <div v-if="isLoading" class="text-center text-blue-500 font-mono animate-pulse">
        Memuat data riset dan proyek...
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(project, index) in filteredProjects"
          :key="project.id"
          @click="openModal(project)"
          class="bg-white/80 dark:bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 transition-all hover:-translate-y-1 shadow-lg shadow-black/5 dark:shadow-black/20 group cursor-pointer flex flex-col h-full"
        >
          <div
            class="text-xs font-bold font-mono uppercase text-blue-600 dark:text-blue-400 mb-3 tracking-wider"
          >
            {{ project.category === 'riset' ? '💡 Academic Research' : '💻 System Development' }}
          </div>
          <h3
            class="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors"
          >
            {{ project.title }}
          </h3>
          <p
            class="text-gray-700 dark:text-gray-400 text-sm leading-relaxed flex-grow transition-colors mb-6"
          >
            {{ project.shortDesc }}
          </p>
          <div class="flex flex-wrap gap-2 text-xs font-semibold mt-auto font-mono">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 px-2.5 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 transition-colors"
              >{{ tag }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          @click="closeModal"
          class="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-md"
        ></div>
        <div
          class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 p-8 rounded-2xl max-w-2xl w-full relative z-10 shadow-2xl transform transition-all"
        >
          <button
            @click="closeModal"
            class="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
          <div
            class="text-xs font-bold font-mono uppercase text-blue-600 dark:text-blue-400 mb-2 tracking-wider"
          >
            {{
              selectedProject?.category === 'riset'
                ? '💡 Academic Research'
                : '💻 System Development'
            }}
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 pr-6">
            {{ selectedProject?.title }}
          </h3>
          <div class="w-16 h-1 bg-blue-500 rounded-full mb-6"></div>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-sm md:text-base">
            {{ selectedProject?.fullDesc }}
          </p>
          <div class="flex flex-wrap gap-2 text-sm font-semibold font-mono">
            <span
              v-for="tag in selectedProject?.tags"
              :key="tag"
              class="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-md border border-blue-200 dark:border-blue-500/20"
              >{{ tag }}</span
            >
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>
