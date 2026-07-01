<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const isOpen = ref(false)
const query = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

interface Command {
  id: string
  group: string
  label: string
  icon: string
  action: () => void
}

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const allCommands: Command[] = [
  { id: 'nav-about',    group: 'Navigasi', icon: '👤', label: 'Tentang Saya',   action: () => { scrollToSection('about'); close() } },
  { id: 'nav-exp',      group: 'Navigasi', icon: '💼', label: 'Pengalaman',     action: () => { scrollToSection('experience'); close() } },
  { id: 'nav-skills',   group: 'Navigasi', icon: '⚡', label: 'Keahlian',      action: () => { scrollToSection('skills'); close() } },
  { id: 'nav-projects', group: 'Navigasi', icon: '🚀', label: 'Proyek & Riset', action: () => { scrollToSection('projects'); close() } },
  { id: 'nav-testi',    group: 'Navigasi', icon: '💬', label: 'Testimoni',      action: () => { scrollToSection('testimonials'); close() } },
  { id: 'nav-contact',  group: 'Navigasi', icon: '✉️', label: 'Kontak',         action: () => { scrollToSection('contact'); close() } },
  { id: 'act-cv',       group: 'Aksi',    icon: '📄', label: 'Download CV',    action: () => { window.open('/cv-switch.pdf', '_blank'); close() } },
  { id: 'act-email',    group: 'Aksi',    icon: '📋', label: 'Salin Email',    action: () => { navigator.clipboard.writeText('sheinafathur@gmail.com').catch(() => {}); close() } },
  { id: 'act-top',      group: 'Aksi',    icon: '⬆️', label: 'Ke Atas',        action: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); close() } },
  { id: 'link-github',  group: 'Link',    icon: '🐙', label: 'GitHub',         action: () => { window.open('https://github.com/sheinafathurr1', '_blank'); close() } },
  { id: 'link-linkedin',group: 'Link',    icon: '💼', label: 'LinkedIn',       action: () => { window.open('https://linkedin.com/in/sheinafathur', '_blank'); close() } },
]

const filteredCommands = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q
    ? allCommands.filter(c => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q))
    : allCommands
})

const filteredGroups = computed(() => {
  const groups: { label: string; cmds: (Command & { globalIndex: number })[] }[] = []
  const map = new Map<string, (Command & { globalIndex: number })[]>()
  filteredCommands.value.forEach((cmd, i) => {
    if (!map.has(cmd.group)) {
      map.set(cmd.group, [])
      groups.push({ label: cmd.group, cmds: map.get(cmd.group)! })
    }
    map.get(cmd.group)!.push({ ...cmd, globalIndex: i })
  })
  return groups
})

const open = () => {
  isOpen.value = true
  query.value = ''
  selectedIndex.value = 0
  nextTick(() => inputRef.value?.focus())
}

const close = () => { isOpen.value = false }

watch(query, () => { selectedIndex.value = 0 })

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    isOpen.value ? close() : open()
    return
  }
  if (!isOpen.value) return
  const total = filteredCommands.value.length
  if (e.key === 'Escape') { close(); return }
  if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex.value = (selectedIndex.value + 1) % total }
  if (e.key === 'ArrowUp')   { e.preventDefault(); selectedIndex.value = (selectedIndex.value - 1 + total) % total }
  if (e.key === 'Enter') {
    const cmd = filteredCommands.value[selectedIndex.value]
    if (cmd) cmd.action()
  }
}

const handleOpenEvent = () => open()

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('open-command-palette', handleOpenEvent)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('open-command-palette', handleOpenEvent)
})

defineExpose({ open, close })
</script>

<template>
  <Teleport to="body">
    <Transition name="cmd-backdrop">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[800] flex items-start justify-center pt-[12vh] px-4"
      >
        <!-- Backdrop -->
        <div @click="close" class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>

        <!-- Panel -->
        <Transition name="cmd-panel">
          <div
            v-if="isOpen"
            class="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-2xl shadow-black/30 overflow-hidden"
          >
            <!-- Search input -->
            <div class="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                ref="inputRef"
                v-model="query"
                type="text"
                placeholder="Cari perintah atau navigasi..."
                class="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
              />
              <kbd class="hidden sm:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700">ESC</kbd>
            </div>

            <!-- Results -->
            <div class="max-h-72 overflow-y-auto py-2">
              <template v-if="filteredCommands.length > 0">
                <template v-for="group in filteredGroups" :key="group.label">
                  <div class="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 font-mono">
                    {{ group.label }}
                  </div>
                  <button
                    v-for="cmd in group.cmds"
                    :key="cmd.id"
                    @click="cmd.action()"
                    @mouseenter="selectedIndex = cmd.globalIndex"
                    :class="[
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors duration-100 mx-1',
                      selectedIndex === cmd.globalIndex
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60',
                    ]"
                    style="width: calc(100% - 8px)"
                  >
                    <span class="text-base leading-none flex-shrink-0 w-5 text-center">{{ cmd.icon }}</span>
                    <span class="font-medium">{{ cmd.label }}</span>
                    <svg
                      v-if="selectedIndex === cmd.globalIndex"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3.5 w-3.5 ml-auto text-blue-400 flex-shrink-0"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </template>
              </template>
              <div v-else class="py-10 text-center text-sm text-gray-400 dark:text-gray-600 font-mono">
                Tidak ada hasil untuk "<span class="text-gray-600 dark:text-gray-400">{{ query }}</span>"
              </div>
            </div>

            <!-- Footer hints -->
            <div class="border-t border-gray-100 dark:border-gray-800 px-4 py-2 flex items-center gap-3 text-[10px] font-mono text-gray-400 dark:text-gray-600">
              <span class="flex items-center gap-1">
                <kbd class="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500">↑↓</kbd>
                navigasi
              </span>
              <span class="flex items-center gap-1">
                <kbd class="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500">↵</kbd>
                pilih
              </span>
              <span class="ml-auto">⌘K untuk toggle</span>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
