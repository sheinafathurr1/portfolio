import { computed, ref } from 'vue'
import type { SectionId } from './nav'
import { menuItems } from '../data/phantom'

// "Bond with Switch": each section visited for the first time ranks the bond up. Saved per browser.
const STORAGE_KEY = 'p5-bond'
const VALID = new Set<string>(menuItems.map((m) => m.id))

const load = (): SectionId[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? (parsed.filter((id) => VALID.has(id)) as SectionId[]) : []
  } catch {
    return []
  }
}

const save = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visited.value))
  } catch {
    // storage blocked: progress just won't persist
  }
}

export const BOND_MAX = menuItems.length
export const visited = ref<SectionId[]>(load())
export const bondRank = computed(() => visited.value.length)

/** Returns true when this is the first visit (i.e. the bond ranked up). */
export function markVisited(id: SectionId): boolean {
  if (visited.value.includes(id)) return false
  visited.value = [...visited.value, id]
  save()
  return true
}

export function resetBond() {
  visited.value = []
  save()
}
