import { ref, onMounted, onUnmounted } from 'vue'
import { isActivatable, isTypingTarget } from './nav'
import { sfx } from './sfx'

/** ↑/↓ (or W/S) moves a highlighted index through a list; Enter triggers `onEnter`. */
export function useListNav(count: () => number, options: { initial?: number; onEnter?: (index: number) => void } = {}) {
  const index = ref(options.initial ?? 0)

  const select = (i: number) => {
    if (i === index.value) return
    index.value = i
    sfx.move()
  }

  const onKey = (e: KeyboardEvent) => {
    if (isTypingTarget(e) || e.altKey || e.ctrlKey || e.metaKey) return
    const n = count()
    if (n === 0) return
    const key = e.key.toLowerCase()
    if (key === 'arrowdown' || key === 's') {
      e.preventDefault()
      select((index.value + 1) % n)
    } else if (key === 'arrowup' || key === 'w') {
      e.preventDefault()
      select((index.value - 1 + n) % n)
    } else if (key === 'enter' && options.onEnter && !isActivatable(e)) {
      e.preventDefault()
      sfx.confirm()
      options.onEnter(index.value)
    }
  }

  onMounted(() => window.addEventListener('keydown', onKey))
  onUnmounted(() => window.removeEventListener('keydown', onKey))

  return { index, select }
}
