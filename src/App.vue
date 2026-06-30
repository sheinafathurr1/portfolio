<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import Experience from './components/Experience.vue'
import Skills from './components/Skills.vue'
import Projects from './components/Projects.vue'
import Contact from './components/Contact.vue'
import Stats from './components/Stats.vue'
import Achievements from './components/Achievements.vue'

// Scroll & spotlight
const mouseX = ref(0)
const mouseY = ref(0)
const scrollProgress = ref(0)
const showBackToTop = ref(false)

// Custom cursor
const dotX = ref(0)
const dotY = ref(0)
const ringX = ref(0)
const ringY = ref(0)
const cursorVisible = ref(false)
const cursorExpanded = ref(false)
let rafId = 0

const updateMousePosition = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  dotX.value = e.clientX
  dotY.value = e.clientY
  if (!cursorVisible.value) {
    ringX.value = e.clientX
    ringY.value = e.clientY
    cursorVisible.value = true
  }
  const t = e.target as HTMLElement
  cursorExpanded.value = !!(t.closest('a, button, [role="button"], [tabindex]'))
}

const animateRing = () => {
  ringX.value += (dotX.value - ringX.value) * 0.14
  ringY.value += (dotY.value - ringY.value) * 0.14
  rafId = requestAnimationFrame(animateRing)
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
  if (window.innerWidth >= 1024) {
    document.documentElement.classList.add('custom-cursor')
    rafId = requestAnimationFrame(animateRing)
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMousePosition)
  window.removeEventListener('scroll', handleScroll)
  document.documentElement.classList.remove('custom-cursor')
  cancelAnimationFrame(rafId)
})

const particles = [
  { w: 'w-1 h-1',     color: 'bg-blue-400/30',   left: '7%',  top: '12%', dur: 4.2, delay: 0 },
  { w: 'w-1.5 h-1.5', color: 'bg-violet-400/25',  left: '18%', top: '58%', dur: 6.1, delay: 1.3 },
  { w: 'w-1 h-1',     color: 'bg-cyan-400/30',    left: '33%', top: '22%', dur: 5.0, delay: 0.7 },
  { w: 'w-2 h-2',     color: 'bg-blue-300/20',    left: '48%', top: '72%', dur: 7.2, delay: 2.1 },
  { w: 'w-1 h-1',     color: 'bg-violet-300/25',  left: '62%', top: '38%', dur: 4.7, delay: 1.6 },
  { w: 'w-1.5 h-1.5', color: 'bg-cyan-300/25',    left: '76%', top: '18%', dur: 5.6, delay: 0.4 },
  { w: 'w-1 h-1',     color: 'bg-blue-400/25',    left: '87%', top: '62%', dur: 6.3, delay: 2.6 },
  { w: 'w-2 h-2',     color: 'bg-violet-400/20',  left: '41%', top: '86%', dur: 4.1, delay: 1.0 },
  { w: 'w-1 h-1',     color: 'bg-cyan-400/25',    left: '13%', top: '78%', dur: 5.3, delay: 3.1 },
  { w: 'w-1.5 h-1.5', color: 'bg-blue-300/25',    left: '91%', top: '33%', dur: 6.8, delay: 1.9 },
  { w: 'w-1 h-1',     color: 'bg-violet-400/20',  left: '55%', top: '10%', dur: 5.8, delay: 0.9 },
  { w: 'w-1.5 h-1.5', color: 'bg-cyan-300/20',    left: '25%', top: '44%', dur: 4.9, delay: 2.4 },
]
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
      style="background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px); background-size: 30px 30px; opacity: 0.35;"
    ></div>
    <!-- Dot grid dark -->
    <div
      class="fixed inset-0 z-0 pointer-events-none hidden dark:block"
      style="background-image: radial-gradient(circle, #1e3a5f 1px, transparent 1px); background-size: 30px 30px; opacity: 0.35;"
    ></div>

    <!-- Floating particles -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        v-for="(p, i) in particles"
        :key="i"
        :class="['absolute rounded-full', p.w, p.color]"
        :style="{ left: p.left, top: p.top, animation: `float ${p.dur}s ease-in-out infinite`, animationDelay: `${p.delay}s` }"
      ></div>
    </div>

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
        <Achievements />
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
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:-translate-y-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </Transition>

    <!-- Custom cursor (desktop only) -->
    <div class="pointer-events-none fixed inset-0 z-[9999] hidden lg:block" aria-hidden="true">
      <!-- Lagging ring -->
      <div
        class="absolute rounded-full border-2 border-blue-500/50 transition-[width,height,border-color,background-color] duration-200"
        :class="cursorExpanded ? 'w-12 h-12 border-blue-400 bg-blue-500/8' : 'w-7 h-7'"
        :style="{
          left: `${ringX}px`,
          top: `${ringY}px`,
          transform: 'translate(-50%, -50%)',
          opacity: cursorVisible ? 1 : 0,
          transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, opacity 0.4s ease',
        }"
      ></div>
      <!-- Center dot -->
      <div
        class="absolute rounded-full bg-blue-500 transition-[width,height] duration-150"
        :class="cursorExpanded ? 'w-1.5 h-1.5 bg-blue-400' : 'w-1.5 h-1.5'"
        :style="{
          left: `${dotX}px`,
          top: `${dotY}px`,
          transform: 'translate(-50%, -50%)',
          opacity: cursorVisible ? 1 : 0,
          transition: 'width 0.15s ease, height 0.15s ease, opacity 0.3s ease',
        }"
      ></div>
    </div>
  </div>
</template>
