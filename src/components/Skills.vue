<template>
  <section id="skills" class="py-24 px-4 transition-colors duration-300 relative">
    <div class="max-w-6xl mx-auto relative z-10">
      <div data-aos="fade-up" class="text-center mb-16">
        <span class="inline-block text-xs font-bold font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 bg-blue-50 dark:bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/20">
          Tech Stack
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors">
          Keahlian & Teknologi
        </h2>
        <div class="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Backend & Infrastructure -->
        <div
          data-aos="fade-right"
          class="group bg-white/80 dark:bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/5 dark:shadow-black/20"
        >
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/>
              </svg>
            </div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">Backend & Infrastruktur</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in ['Laravel', 'PHP', 'CyberPanel', 'Server Mgmt', 'GitHub', 'MySQL', 'REST API']"
              :key="skill"
              class="font-mono bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-100 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors cursor-default"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- AI & Automation -->
        <div
          data-aos="fade-up"
          data-aos-delay="150"
          class="group bg-white/80 dark:bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/5 dark:shadow-black/20"
        >
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">AI & Automasi</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in ['Google Gemini API', 'n8n Workflows', 'Machine Learning', 'Python', 'Telegram Triggers', 'Dynamic API']"
              :key="skill"
              class="font-mono bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-violet-100 dark:border-violet-500/20 hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-colors cursor-default"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Frontend & Mobile -->
        <div
          data-aos="fade-left"
          data-aos-delay="300"
          class="group bg-white/80 dark:bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/5 dark:shadow-black/20"
        >
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">Frontend & Mobile</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in ['Vue.js', 'Tailwind CSS', 'TypeScript', 'Flutter', 'WebRTC', 'Firebase']"
              :key="skill"
              class="font-mono bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors cursor-default"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
