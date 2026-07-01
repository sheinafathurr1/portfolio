<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const testimonials = [
  {
    role: 'Dosen Pembimbing',
    org: 'Program Studi S2 Informatika',
    quote: 'Pendekatan risetnya terhadap Dynamic API sangat sistematis. Kemampuannya menerjemahkan teori Design Science Research ke dalam implementasi SQL-Driven yang nyata jarang ditemui pada mahasiswa magister.',
    initials: 'DP',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    role: 'Rekan Tim',
    org: 'HEI APP Development — Telkom University',
    quote: 'Sebagai lead developer, dia mampu menjaga arsitektur sistem tetap rapi sambil terus mengakomodasi kebutuhan yang berubah. Komunikasinya jelas dan selalu tepat waktu.',
    initials: 'RT',
    color: 'from-violet-500 to-purple-500',
  },
  {
    role: 'Koordinator Teknis',
    org: 'Center of Excellence — CAATIS',
    quote: 'Penanganan infrastruktur server sehari-hari sangat stabil di bawah tanggung jawabnya. Automasi yang dibangun benar-benar mengurangi beban operasional tim.',
    initials: 'KT',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    role: 'Anggota Tim Riset',
    org: 'S2IF — Keamanan Siber & AI',
    quote: 'Pipeline automasi berbasis n8n dan Gemini API yang dia bangun mempercepat proses ekstraksi jurnal kami secara drastis. Selalu terbuka untuk berdiskusi dan berbagi ilmu.',
    initials: 'AR',
    color: 'from-amber-500 to-orange-500',
  },
]

const current = ref(0)
const activeTestimonial = computed(() => testimonials[current.value] as (typeof testimonials)[number])
let timer: ReturnType<typeof setInterval> | null = null

const next = () => { current.value = (current.value + 1) % testimonials.length }
const prev = () => { current.value = (current.value - 1 + testimonials.length) % testimonials.length }
const goTo = (i: number) => { current.value = i }

const startAutoplay = () => {
  stopAutoplay()
  timer = setInterval(next, 6000)
}
const stopAutoplay = () => { if (timer) clearInterval(timer) }

onMounted(startAutoplay)
onUnmounted(stopAutoplay)
</script>

<template>
  <section id="testimonials" class="py-24 px-4 relative z-10 transition-colors duration-300">
    <div class="max-w-3xl mx-auto">

      <!-- Header -->
      <div data-aos="fade-up" class="text-center mb-14">
        <span class="inline-block text-xs font-bold font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 bg-blue-50 dark:bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/20">
          Testimoni
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Kata Mereka
        </h2>
        <div class="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
      </div>

      <!-- Carousel -->
      <div
        data-aos="zoom-in"
        class="relative"
        @mouseenter="stopAutoplay"
        @mouseleave="startAutoplay"
      >
        <div class="bg-white/80 dark:bg-gray-900/60 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-black/5 dark:shadow-black/20 relative overflow-hidden min-h-[260px] flex flex-col justify-center">

          <!-- Big quote mark -->
          <svg class="absolute top-6 left-6 h-10 w-10 text-blue-500/10 dark:text-blue-400/10" fill="currentColor" viewBox="0 0 32 32">
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
          </svg>

          <Transition name="testi" mode="out-in">
            <div :key="current" class="relative z-10">
              <p class="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-6 text-center">
                “{{ activeTestimonial.quote }}”
              </p>
              <div class="flex items-center justify-center gap-3">
                <div :class="['w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 bg-gradient-to-br', activeTestimonial.color]">
                  {{ activeTestimonial.initials }}
                </div>
                <div class="text-left">
                  <p class="text-sm font-bold text-gray-900 dark:text-white">{{ activeTestimonial.role }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-500">{{ activeTestimonial.org }}</p>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Prev / Next arrows -->
        <button
          @click="prev"
          aria-label="Testimoni sebelumnya"
          class="absolute top-1/2 -left-3 md:-left-5 -translate-y-1/2 w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:-translate-x-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button
          @click="next"
          aria-label="Testimoni berikutnya"
          class="absolute top-1/2 -right-3 md:-right-5 -translate-y-1/2 w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:translate-x-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <!-- Dots -->
      <div class="flex justify-center gap-2 mt-6">
        <button
          v-for="(t, i) in testimonials"
          :key="i"
          @click="goTo(i)"
          :aria-label="`Testimoni ${i + 1}`"
          :class="[
            'h-2 rounded-full transition-all duration-300',
            current === i ? 'w-6 bg-blue-500' : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-blue-300 dark:hover:bg-blue-700',
          ]"
        ></button>
      </div>
    </div>
  </section>
</template>
