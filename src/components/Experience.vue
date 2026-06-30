<script setup lang="ts">
import { ref, onMounted } from 'vue'

// State untuk menyimpan data dari API
const experiences = ref<any>([])
const isLoading = ref(true)

// Fungsi untuk menjemput data API Laravel
const fetchExperiences = async () => {
  try {
    // Pastikan server Laravel sedang berjalan (php artisan serve)
    const response = await fetch('http://localhost:8000/api/experiences')
    const result = await response.json()
    // Masukkan array data ke dalam state reaktif
    experiences.value = result.data
  } catch (error) {
    console.error('Gagal mengambil data pengalaman:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchExperiences()
})
</script>

<template>
  <section id="experience" class="py-24 px-4 transition-colors duration-300 relative">
    <div class="max-w-4xl mx-auto">
      <div data-aos="fade-up" class="text-center mb-16">
        <h2
          class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors"
        >
          Rekam Jejak & Pengalaman
        </h2>
        <div class="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
      </div>

      <div v-if="isLoading" class="text-center text-blue-500 font-mono animate-pulse relative z-10">
        Memuat data pengalaman...
      </div>

      <div v-else class="space-y-6 md:space-y-8 relative z-10">
        <div
          v-for="(exp, index) in experiences"
          :key="exp.id"
          class="flex gap-4 md:gap-6"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <div class="flex flex-col items-center">
            <div
              :class="
                index === 0 ? 'bg-blue-500 shadow-blue-500/50' : 'bg-gray-400 dark:bg-gray-600'
              "
              class="w-4 h-4 rounded-full ring-4 ring-gray-100 dark:ring-gray-900 mt-1.5 shrink-0 z-10 transition-colors shadow-lg"
            ></div>
            <div
              v-if="index !== experiences.length - 1"
              class="w-0.5 h-full bg-gray-300 dark:bg-gray-800 mt-2 rounded-full transition-colors"
            ></div>
          </div>
          <div
            class="bg-white/80 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 transition-all hover:-translate-y-1 shadow-lg shadow-black/5 dark:shadow-black/20 flex-1 mb-2 p-6 md:p-8 rounded-2xl"
          >
            <span
              class="text-blue-600 dark:text-blue-400 text-sm font-bold tracking-wider uppercase mb-2 block font-mono"
              >{{ exp.period }}</span
            >
            <h3
              class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 transition-colors"
            >
              {{ exp.title }}
            </h3>
            <h4 class="text-gray-600 dark:text-gray-400 font-medium mb-4 transition-colors">
              {{ exp.company }}
            </h4>
            <p
              class="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed transition-colors"
            >
              {{ exp.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
