<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import Experience from './components/Experience.vue'
import Skills from './components/Skills.vue'
import Projects from './components/Projects.vue'
import Contact from './components/Contact.vue'
import Stats from './components/Stats.vue'

const mouseX = ref(0)
const mouseY = ref(0)
const scrollProgress = ref(0)
const showBackToTop = ref(false)

const updateMousePosition = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

const handleScroll = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0
  showBackToTop.value = window.scrollY > 500
}

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

onMounted(() => {
  window.addEventListener('mousemove', updateMousePosition)
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMousePosition)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div
    class="bg-gray-50 dark:bg-[#050813] min-h-screen text-gray-900 dark:text-gray-100 selection:bg-blue-500/30 overflow-x-hidden transition-colors duration-300 relative"
  >
    <!-- Scroll progress bar -->
    <div
      class="fixed top-0 left-0 z-[100] h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 transition-[width] duration-150 ease-out"
      :style="{ width: `${scrollProgress}%` }"
    ></div>

    <!-- Mouse spotlight -->
    <div
      class="pointer-events-none fixed inset-0 z-30 hidden lg:block"
      :style="{
        background: `radial-gradient(700px circle at ${mouseX}px ${mouseY}px, rgba(59,130,246,0.07), transparent 70%)`,
      }"
    ></div>

    <!-- Dot grid light -->
    <div
      class="fixed inset-0 z-0 pointer-events-none dark:hidden"
      style="
        background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
        background-size: 30px 30px;
        opacity: 0.35;
      "
    ></div>
    <!-- Dot grid dark -->
    <div
      class="fixed inset-0 z-0 pointer-events-none hidden dark:block"
      style="
        background-image: radial-gradient(circle, #1e3a5f 1px, transparent 1px);
        background-size: 30px 30px;
        opacity: 0.35;
      "
    ></div>

    <!-- Corner glows -->
    <div class="fixed top-0 right-0 w-[700px] h-[700px] pointer-events-none z-0 opacity-40 dark:opacity-25">
      <div class="absolute inset-0 bg-gradient-to-bl from-blue-500/30 to-transparent rounded-full blur-[140px]"></div>
    </div>
    <div class="fixed bottom-0 left-0 w-[600px] h-[600px] pointer-events-none z-0 opacity-30 dark:opacity-20">
      <div class="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-transparent rounded-full blur-[130px]"></div>
    </div>
    <div class="fixed top-1/2 right-0 w-[400px] h-[400px] pointer-events-none z-0 opacity-20 dark:opacity-10">
      <div class="absolute inset-0 bg-gradient-to-l from-cyan-500/20 to-transparent rounded-full blur-[100px]"></div>
    </div>

    <div class="relative z-10">
      <Navbar />
      <main>
        <HeroSection />
        <Stats />
        <Experience />
        <Skills />
        <Projects />
      </main>
      <Contact />
    </div>

    <!-- Back to top button -->
    <Transition name="back-top">
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        aria-label="Kembali ke atas"
        class="fixed bottom-8 right-8 z-50 w-11 h-11 bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 group-hover:-translate-y-0.5 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </Transition>
  </div>
</template>
