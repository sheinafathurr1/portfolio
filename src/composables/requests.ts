import { computed, ref } from 'vue'
import { pushToast } from './toasts'

// "Mementos Requests": small goals for visitors, like the side quests in the game. Saved per browser.
export const REQUESTS = [
  { id: 'explorer', title: 'Phantom Tour', desc: 'Visit every section of the portfolio.' },
  { id: 'talk', title: 'Small Talk', desc: 'Ask Switch three questions on Phan-Chat.' },
  { id: 'hunter', title: 'Shadow Hunter', desc: 'Win a Shadow battle.' },
  { id: 'technical', title: 'One More!', desc: 'Win a Shadow battle in a single turn.' },
  { id: 'showtime', title: 'Showtime', desc: 'Witness an All-Out Attack.' },
  { id: 'cheat', title: 'Old School', desc: 'Enter a secret code.' },
  { id: 'card', title: 'Calling Card', desc: 'Send Switch a calling card.' },
  { id: 'forger', title: 'Card Forger', desc: 'Download your own calling card as an image.' },
  { id: 'fortune', title: 'Fortune Seeker', desc: 'Have Switch read your fortune on Phan-Chat.' },
  { id: 'paper', title: 'Paper Trail', desc: 'Open the printable résumé.' },
] as const

export type RequestId = (typeof REQUESTS)[number]['id']

const STORAGE_KEY = 'p5-requests'
const VALID = new Set<string>(REQUESTS.map((r) => r.id))

const load = (): RequestId[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? (parsed.filter((id) => VALID.has(id)) as RequestId[]) : []
  } catch {
    return []
  }
}

const save = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleared.value))
  } catch {
    // storage blocked: progress just won't persist
  }
}

export const cleared = ref<RequestId[]>(load())
export const clearedCount = computed(() => cleared.value.length)

/** Marks a request as cleared and announces it the first time. */
export function clearRequest(id: RequestId) {
  if (cleared.value.includes(id)) return
  cleared.value = [...cleared.value, id]
  save()
  const request = REQUESTS.find((r) => r.id === id)
  if (request) {
    pushToast({ kind: 'request', title: request.title, desc: request.desc, done: cleared.value.length, total: REQUESTS.length })
  }
}

export function resetRequests() {
  cleared.value = []
  save()
}
