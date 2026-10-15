import { computed, ref } from 'vue'
import { chatIntro, chatTopics, type ChatTopic } from '../data/phantom'
import { clearRequest } from './requests'

// Phan-Chat conversation state. Module-level so the thread survives closing and reopening the phone.
export interface ChatMessage {
  id: number
  from: 'switch' | 'you'
  text: string
  action?: ChatTopic['action']
}

export const messages = ref<ChatMessage[]>([])
export const typing = ref(false)
const asked = ref<string[]>([])
let seq = 0

const push = (m: Omit<ChatMessage, 'id'>) => {
  messages.value.push({ id: ++seq, ...m })
}
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Up to four topics not asked yet, like the game's dialogue choices. */
export const choices = computed(() => chatTopics.filter((t) => !asked.value.includes(t.id)).slice(0, 4))

export function startChat() {
  if (messages.value.length) return
  chatIntro.forEach((text) => push({ from: 'switch', text }))
}

export async function ask(topic: ChatTopic): Promise<ChatTopic['effect']> {
  if (typing.value) return undefined
  asked.value.push(topic.id)
  push({ from: 'you', text: topic.question })
  typing.value = true
  for (const [i, text] of topic.answer.entries()) {
    await wait(Math.min(1300, 450 + text.length * 9))
    push({ from: 'switch', text, action: i === topic.answer.length - 1 ? topic.action : undefined })
  }
  typing.value = false
  if (asked.value.length >= 3) clearRequest('talk')
  if (topic.id === 'fortune') clearRequest('fortune')
  return topic.effect
}

export function resetChat() {
  messages.value = []
  asked.value = []
  typing.value = false
  startChat()
}
