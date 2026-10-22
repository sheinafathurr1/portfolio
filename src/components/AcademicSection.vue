<script setup lang="ts">
import { education, publications, socialLinks } from '../data/portfolio'

const scholarUrl = socialLinks.find((l) => l.label === 'Google Scholar')?.href
const leadCount = publications.filter((p) => p.lead).length
</script>

<template>
  <section id="academic" class="py-24 px-4 relative z-10 transition-colors duration-300">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div data-aos="fade-up" class="text-center mb-14">
        <span class="section-badge mb-3">Akademik</span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Pendidikan & Publikasi
        </h2>
        <div class="section-divider mb-4"></div>
        <p class="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto">
          {{ publications.length }} publikasi ilmiah di konferensi IEEE dan jurnal nasional (2025–2026),
          {{ leadCount }} di antaranya sebagai penulis pertama dan korespondensi.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Education (left) -->
        <div class="lg:col-span-2 space-y-4">
          <article
            v-for="(e, i) in education"
            :key="e.degree"
            data-aos="fade-right"
            :data-aos-delay="i * 100"
            class="glass-card p-6 rounded-2xl shadow-sm hover:shadow-md shadow-black/5 dark:shadow-black/20 relative overflow-hidden"
          >
            <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500"></div>
            <div class="flex items-start justify-between gap-4 mb-2">
              <div>
                <p class="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">{{ e.period }}</p>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-snug">{{ e.degree }}</h3>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ e.school }}</p>
              </div>
              <div class="shrink-0 text-center rounded-xl px-3 py-2 bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-md shadow-blue-500/20">
                <p class="text-[9px] font-mono font-bold uppercase tracking-widest opacity-80">IPK</p>
                <p class="text-xl font-black leading-none">{{ e.gpa }}</p>
              </div>
            </div>
            <p class="text-xs font-mono text-gray-500 dark:text-gray-500 mb-3">{{ e.note }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{{ e.detail }}</p>
          </article>
        </div>

        <!-- Publications (right) -->
        <div class="lg:col-span-3" data-aos="fade-left" data-aos-delay="150">
          <div class="glass-card p-6 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20">
            <div class="flex items-center justify-between gap-3 mb-5">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono">Publikasi Terpilih</h3>
              <a
                v-if="scholarUrl"
                :href="scholarUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >Google Scholar →</a>
            </div>
            <ol class="space-y-3">
              <li
                v-for="(paper, i) in publications"
                :key="paper.title"
                class="flex gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <span class="text-xs font-mono font-bold text-gray-400 dark:text-gray-600 pt-0.5 w-5 shrink-0">{{ String(i + 1).padStart(2, '0') }}</span>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white leading-snug">{{ paper.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ paper.venue }}, {{ paper.year }}</p>
                  <span
                    :class="[
                      'inline-block mt-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border',
                      paper.lead
                        ? 'text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20'
                        : 'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700',
                    ]"
                  >{{ paper.role }}</span>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
