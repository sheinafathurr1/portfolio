<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import Experience from './components/Experience.vue'
import Skills from './components/Skills.vue'
import Projects from './components/Projects.vue'
import Contact from './components/Contact.vue'
import Stats from './components/Stats.vue'

// --- Logika Pelacakan Kursor untuk Efek Spotlight ---
const mouseX = ref(0)
const mouseY = ref(0)

const updateMousePosition = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

onMounted(() => {
  window.addEventListener('mousemove', updateMousePosition)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMousePosition)
})
</script>

<template>
  <div
    class="bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100 selection:bg-blue-500/30 overflow-x-hidden transition-colors duration-300 relative"
  >
    <div
      class="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300 hidden lg:block"
      :style="{
        background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.25), transparent 80%)`,
      }"
    ></div>

    <div
      class="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20 transition-opacity duration-300"
      style="
        background-image: radial-gradient(#3b82f6 1px, transparent 1px);
        background-size: 32px 32px;
      "
    ></div>

    <div class="relative z-10">
      <Navbar />
      <main>
        <HeroSection />
        <Stats /> <Experience />
        <Skills />
        <Projects />
      </main>
      <Contact />
    </div>
  </div>
</template>
