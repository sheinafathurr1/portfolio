<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// ── Typing animation ──
const roles = ['Technical Lead', 'AI Researcher', 'Full-Stack Developer', 'Server Engineer']
const currentRole = ref(0)
const displayedRole = ref('')
const isDeleting = ref(false)
let typingTimer: ReturnType<typeof setTimeout>

const typeRole = () => {
  const target = roles[currentRole.value]
  if (!isDeleting.value) {
    displayedRole.value = target.substring(0, displayedRole.value.length + 1)
    if (displayedRole.value === target) {
      typingTimer = setTimeout(() => { isDeleting.value = true; typeRole() }, 2200)
      return
    }
  } else {
    displayedRole.value = target.substring(0, displayedRole.value.length - 1)
    if (displayedRole.value === '') {
      isDeleting.value = false
      currentRole.value = (currentRole.value + 1) % roles.length
    }
  }
  typingTimer = setTimeout(typeRole, isDeleting.value ? 50 : 100)
}

// ── Terminal animation ──
type TermLine =
  | { kind: 'prompt'; cmd: string }
  | { kind: 'output'; text: string; cls?: string }
  | { kind: 'gap' }
  | { kind: 'cursor' }

const termLines: TermLine[] = [
  { kind: 'prompt', cmd: 'whoami' },
  { kind: 'output', text: '  Sheina Fathur  ·  Switch', cls: 'text-white font-semibold' },
  { kind: 'output', text: '  AI Researcher & Full-Stack Engineer', cls: 'text-gray-400' },
  { kind: 'gap' },
  { kind: 'prompt', cmd: 'cat .position' },
  { kind: 'output', text: '  {', cls: 'text-gray-500' },
  { kind: 'output', text: '    "role"  : "TLH @ CoE CAATIS"', cls: 'text-yellow-400/90' },
  { kind: 'output', text: '    "study" : "S2IF · Telkom University"', cls: 'text-yellow-400/90' },
  { kind: 'output', text: '  }', cls: 'text-gray-500' },
  { kind: 'gap' },
  { kind: 'prompt', cmd: 'ls stack/' },
  { kind: 'output', text: '  Vue.js   Laravel   Python   n8n   Linux', cls: 'text-cyan-400' },
  { kind: 'gap' },
  { kind: 'cursor' },
]

const lineDelays = termLines.map((l) =>
  l.kind === 'prompt' ? 480 : l.kind === 'gap' ? 130 : l.kind === 'cursor' ? 400 : 130,
)

const termVisible = ref(0)
let termTimer: ReturnType<typeof setTimeout>

const revealNext = (index: number) => {
  if (index >= termLines.length) return
  termVisible.value = index + 1
  termTimer = setTimeout(() => revealNext(index + 1), lineDelays[index])
}

// ── 3D tilt effect on terminal ──
const termRef = ref<HTMLElement>()
const tiltX = ref(0)
const tiltY = ref(0)
const isHovering = ref(false)

const handleTermMouseMove = (e: MouseEvent) => {
  if (!termRef.value) return
  const rect = termRef.value.getBoundingClientRect()
  tiltX.value = ((e.clientY - rect.top) / rect.height - 0.5) * -10
  tiltY.value = ((e.clientX - rect.left) / rect.width - 0.5) * 10
}

const resetTilt = () => {
  isHovering.value = false
  tiltX.value = 0
  tiltY.value = 0
}

onMounted(() => {
  typingTimer = setTimeout(typeRole, 600)
  setTimeout(() => revealNext(0), 1000)
})
onUnmounted(() => {
  clearTimeout(typingTimer)
  clearTimeout(termTimer)
})
</script>

<template>
  <section
    id="about"
    class="relative min-h-screen flex flex-col justify-center px-4 pt-24 pb-16 overflow-hidden transition-colors duration-300"
  >
    <!-- Ambient blobs -->
    <div class="absolute top-1/3 left-[8%] w-72 h-72 bg-blue-400/15 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
    <div class="absolute bottom-1/4 right-[8%] w-80 h-80 bg-violet-400/15 dark:bg-violet-600/8 rounded-full blur-[130px] pointer-events-none animate-pulse" style="animation-delay:2.5s"></div>

    <div class="relative z-10 max-w-6xl mx-auto w-full">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center">

        <!-- ── Left: Main content ── -->
        <div class="text-center lg:text-left">

          <!-- Avatar -->
          <div data-aos="zoom-in" class="flex justify-center lg:justify-start mb-8">
            <div class="relative inline-block">
              <!-- Spinning gradient ring -->
              <div
                class="absolute -inset-1.5 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 opacity-80 blur-sm animate-orbit"
              ></div>
              <!-- Second slower ring -->
              <div
                class="absolute -inset-3 rounded-full border border-blue-500/20 dark:border-blue-400/15"
                style="animation: orbit 12s linear infinite reverse"
              ></div>
              <div
                class="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-violet-500 flex items-center justify-center text-3xl md:text-4xl font-black text-white shadow-2xl border-4 border-white dark:border-gray-900"
              >
                S
              </div>
              <!-- Status badge -->
              <div
                class="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full px-2 py-0.5 flex items-center gap-1 text-white text-[10px] font-bold shadow-lg"
              >
                <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                Available
              </div>
            </div>
          </div>

          <!-- Label + Name -->
          <div data-aos="fade-up" data-aos-delay="100">
            <p class="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mb-2 tracking-[0.2em] uppercase">
              Halo, Saya
            </p>
            <h1 class="text-5xl md:text-6xl xl:text-7xl font-extrabold mb-4 tracking-tight leading-none">
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 animate-shimmer-text"
              >Switch</span>
            </h1>
          </div>

          <!-- Typing role -->
          <h2
            data-aos="fade-up"
            data-aos-delay="160"
            class="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 font-medium h-7 flex items-center justify-center lg:justify-start gap-1"
          >
            <span>{{ displayedRole }}</span>
            <span class="inline-block w-0.5 h-5 bg-blue-500 cursor-blink"></span>
          </h2>

          <!-- Description -->
          <p
            data-aos="fade-up"
            data-aos-delay="210"
            class="text-gray-600 dark:text-gray-300 text-base md:text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0"
          >
            Berfokus pada full-stack development, manajemen infrastruktur server, dan riset AI
            automation. Aktif meneliti Dynamic API dan membangun workflow cerdas berbasis AI.
          </p>

          <!-- Tech chips -->
          <div
            data-aos="fade-up"
            data-aos-delay="260"
            class="flex flex-wrap gap-2 justify-center lg:justify-start mb-9"
          >
            <span
              v-for="(tech, i) in ['Vue.js', 'Laravel', 'Python', 'n8n', 'AI/ML', 'Linux Server']"
              :key="tech"
              :style="{ animationDelay: `${i * 80}ms` }"
              class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-mono font-semibold hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-200 cursor-default hover:scale-105 hover:-translate-y-0.5"
            >
              {{ tech }}
            </span>
          </div>

          <!-- CTA Buttons -->
          <div
            data-aos="zoom-in"
            data-aos-delay="310"
            class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-9"
          >
            <a
              href="#projects"
              class="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-7 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-2 text-sm"
            >
              <span class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
              Lihat Proyek
            </a>
            <a
              href="/cv-switch.pdf"
              target="_blank"
              class="group relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 px-7 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 flex items-center justify-center gap-2 text-sm"
            >
              <span class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Download CV
            </a>
            <a
              href="#contact"
              class="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-gray-700/70 px-7 py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Hubungi
            </a>
          </div>

          <!-- Social links -->
          <div data-aos="fade-up" data-aos-delay="360" class="flex justify-center lg:justify-start gap-3">
            <a
              href="https://github.com/sheinafathurr1"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-gray-800 dark:hover:border-gray-300 hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 text-gray-600 dark:text-gray-400 group"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/sheinafathur"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1 text-gray-600 dark:text-gray-400"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="mailto:sheinafathur@gmail.com"
              class="w-10 h-10 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 text-gray-600 dark:text-gray-400"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- ── Right: Terminal card (desktop only) ── -->
        <div data-aos="fade-left" data-aos-delay="200" class="hidden lg:flex justify-center">
          <div class="animate-float w-full max-w-[460px]">
            <div
              ref="termRef"
              @mousemove="handleTermMouseMove"
              @mouseleave="resetTilt"
              @mouseenter="isHovering = true"
              :style="{
                transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                transition: isHovering ? 'transform 0.1s ease' : 'transform 0.6s ease',
                willChange: 'transform',
              }"
              class="relative"
            >
              <!-- Glow -->
              <div class="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-violet-600/20 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity"></div>

              <!-- Window -->
              <div class="relative bg-[#0d1117] rounded-2xl border border-gray-800/80 shadow-2xl shadow-black/60 overflow-hidden font-mono text-sm">

                <!-- Title bar -->
                <div class="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-gray-800/80">
                  <div class="flex gap-1.5">
                    <span class="w-3 h-3 rounded-full bg-red-500/90 hover:bg-red-400 transition-colors cursor-pointer"></span>
                    <span class="w-3 h-3 rounded-full bg-yellow-500/90 hover:bg-yellow-400 transition-colors cursor-pointer"></span>
                    <span class="w-3 h-3 rounded-full bg-green-500/90 hover:bg-green-400 transition-colors cursor-pointer"></span>
                  </div>
                  <span class="ml-2 text-[11px] text-gray-500 font-sans tracking-wide">portfolio.sh — zsh</span>
                  <div class="ml-auto flex items-center gap-1.5">
                    <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span class="text-[10px] text-green-500 font-sans font-medium">LIVE</span>
                  </div>
                </div>

                <!-- Body -->
                <div class="p-5 space-y-1 min-h-[310px]">
                  <template v-for="(line, i) in termLines" :key="i">
                    <div v-if="i < termVisible" class="term-line-in">

                      <template v-if="line.kind === 'gap'">
                        <div class="h-1.5"></div>
                      </template>

                      <template v-else-if="line.kind === 'prompt'">
                        <div class="flex items-center flex-wrap gap-x-0.5 leading-relaxed">
                          <span class="text-green-400 font-semibold">switch</span>
                          <span class="text-gray-600">@</span>
                          <span class="text-blue-400 font-semibold">dev</span>
                          <span class="text-gray-600">:~$</span>
                          <span class="text-white ml-1.5">{{ line.cmd }}</span>
                        </div>
                      </template>

                      <template v-else-if="line.kind === 'cursor'">
                        <div class="flex items-center flex-wrap gap-x-0.5 leading-relaxed">
                          <span class="text-green-400 font-semibold">switch</span>
                          <span class="text-gray-600">@</span>
                          <span class="text-blue-400 font-semibold">dev</span>
                          <span class="text-gray-600">:~$</span>
                          <span class="inline-block w-2 h-[1.1em] bg-blue-400 ml-2 cursor-blink align-middle"></span>
                        </div>
                      </template>

                      <template v-else>
                        <div :class="['pl-1 leading-relaxed', line.cls ?? 'text-gray-300']">{{ line.text }}</div>
                      </template>

                    </div>
                  </template>
                </div>

                <!-- Status bar -->
                <div class="px-4 py-2 bg-[#161b22] border-t border-gray-800/80 flex items-center gap-3 text-[10px] text-gray-600 font-sans">
                  <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>main</span>
                  <span>UTF-8</span>
                  <span class="ml-auto text-gray-500">Vue 3 + TypeScript</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-600">
      <span class="text-[10px] font-mono font-medium tracking-[0.22em] uppercase">Scroll</span>
      <div class="w-5 h-8 border border-gray-300 dark:border-gray-700 rounded-full flex items-start justify-center pt-1.5">
        <div class="w-1 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce"></div>
      </div>
    </div>
  </section>
</template>
