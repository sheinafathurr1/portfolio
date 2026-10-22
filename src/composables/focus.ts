import { onMounted, ref, watch } from 'vue'
import type { SectionId } from './nav'

// "Show me this item": set by search results and deep links (#/missions/10), consumed by the screen that owns it.
export interface FocusTarget {
  screen: SectionId
  key: string | number
}

export const focusTarget = ref<FocusTarget | null>(null)

export const requestFocus = (target: FocusTarget) => {
  focusTarget.value = { ...target }
}

/** Calls `apply` with the item key whenever something asks this screen to highlight an item. */
export function useFocus(screen: SectionId, apply: (key: string | number) => void) {
  const consume = () => {
    const target = focusTarget.value
    if (!target || target.screen !== screen) return
    focusTarget.value = null
    apply(target.key)
  }
  onMounted(consume)
  watch(focusTarget, consume)
}
