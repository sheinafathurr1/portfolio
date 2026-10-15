<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { skillCategories } from '../data/portfolio'

type ViewMode = 'bars' | 'grid'
const viewMode = ref<ViewMode>('bars')

const categories = skillCategories

const levelLabel = (level: number) =>
  level >= 85 ? 'Expert' : level >= 70 ? 'Advanced' : 'Intermediate'

const levelDot = (level: number) =>
  level >= 85 ? 'bg-green-500' : level >= 70 ? 'bg-blue-500' : 'bg-amber-500'

const animated = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  const section = document.getElementById('skills')
  if (!section) return
  observer = new IntersectionObserver(
    ([entry]) => { if (entry?.isIntersecting && !animated.value) animated.value = true },
    { threshold: 0.2 }
  )
  observer.observe(section)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <section id="skills" class="py-24 px-4 transition-colors duration-300 relative">
    <div class="max-w-6xl mx-auto relative z-10">

      <!-- Header -->
      <div data-aos="fade-up" class="text-center mb-12">
        <span class="section-badge mb-3">
          Tech Stack
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors">
          Keahlian & Teknologi
        </h2>
        <div class="section-divider mb-6"></div>

        <!-- View toggle -->
        <div class="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <button
            v-for="mode in (['bars', 'grid'] as ViewMode[])"
            :key="mode"
            @click="viewMode = mode"
            :class="[
              'flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200',
              viewMode === mode
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            ]"
          >
            <svg v-if="mode === 'bars'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            {{ mode === 'bars' ? 'Progress' : 'Grid' }}
          </button>
        </div>
      </div>

      <!-- Progress bars view -->
      <Transition name="skill-view" mode="out-in">
        <div v-if="viewMode === 'bars'" key="bars" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(cat, ci) in categories"
            :key="cat.key"
            :data-aos-delay="ci * 150"
            data-aos="fade-up"
            :class="[
              'group glass-card p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/5 dark:shadow-black/20',
              cat.accentBorder,
            ]"
          >
            <div class="flex items-center gap-3 mb-6">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform', cat.accentIcon]">
                <span v-html="cat.icon"></span>
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ cat.label }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-500">{{ cat.skills.length }} skills</p>
              </div>
            </div>

            <div class="space-y-4">
              <div v-for="(skill, si) in cat.skills" :key="skill.name">
                <div class="flex justify-between items-center mb-1.5">
                  <span class="text-xs font-semibold font-mono text-gray-700 dark:text-gray-300">{{ skill.name }}</span>
                  <span class="text-xs font-bold font-mono text-gray-500 dark:text-gray-400">{{ skill.level }}%</span>
                </div>
                <div class="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    :class="['h-full rounded-full bg-gradient-to-r transition-[width] duration-[1200ms] ease-out', cat.barFrom, cat.barTo]"
                    :style="{ width: animated ? `${skill.level}%` : '0%', transitionDelay: `${si * 80}ms` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid / badge view -->
        <div v-else key="grid" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(cat, ci) in categories"
            :key="cat.key"
            :data-aos-delay="ci * 100"
            data-aos="fade-up"
            :class="[
              'group glass-card p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/5 dark:shadow-black/20',
              cat.accentBorder,
            ]"
          >
            <div class="flex items-center gap-3 mb-5">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform', cat.accentIcon]">
                <span v-html="cat.icon"></span>
              </div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ cat.label }}</h3>
            </div>

            <!-- Legend -->
            <div class="flex gap-3 mb-4 text-[10px] text-gray-500 dark:text-gray-500 font-mono">
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500 inline-block"></span>Expert ≥85%</span>
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>Advanced</span>
              <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>Growing</span>
            </div>

            <div class="flex flex-wrap gap-2">
              <div
                v-for="skill in cat.skills"
                :key="skill.name"
                :class="['flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono border transition-all hover:scale-105 cursor-default', cat.badgeBg]"
                :title="`${skill.level}% — ${levelLabel(skill.level)}`"
              >
                <span :class="['w-1.5 h-1.5 rounded-full flex-shrink-0', levelDot(skill.level)]"></span>
                {{ skill.name }}
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>
