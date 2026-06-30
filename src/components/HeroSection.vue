<template>
  <section
    id="about"
    class="relative min-h-screen flex flex-col justify-center items-center px-4 pt-20 overflow-hidden transition-colors duration-300"
  >
    <div
      class="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"
    ></div>
    <div
      class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/30 dark:bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"
      style="animation-delay: 2s"
    ></div>

    <div class="relative z-10 text-center max-w-3xl">
      <h1
        data-aos="fade-up"
        class="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 dark:text-white tracking-tight transition-colors"
      >
        Halo, Saya
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500"
          >Switch</span
        >
      </h1>
      <h2
        data-aos="fade-up"
        data-aos-delay="100"
        class="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 mb-8 font-medium transition-colors"
      >
        Technical Lead & AI Researcher
      </h2>
      <p
        data-aos="fade-up"
        data-aos-delay="200"
        class="text-gray-600 dark:text-gray-300 text-lg md:text-xl mb-10 leading-relaxed transition-colors"
      >
        Berfokus pada pengembangan full-stack, manajemen infrastruktur server, serta riset automasi
        AI. Saat ini aktif meneliti implementasi Dynamic API dan membangun integrasi workflow
        cerdas.
      </p>

      <div
        data-aos="zoom-in"
        data-aos-delay="400"
        class="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <a
          href="#projects"
          class="relative group bg-blue-600 px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:bg-blue-500 hover:-translate-y-1"
        >
          <div
            class="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg blur opacity-0 group-hover:opacity-40 transition duration-300"
          ></div>
          <span class="relative">Lihat Proyek</span>
        </a>
        <a
          href="https://github.com"
          target="_blank"
          class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:border-cyan-500 hover:bg-white dark:hover:bg-gray-700/50 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1"
        >
          Kunjungi GitHub
        </a>
      </div>
    </div>
  </section>
</template>
