import { ref } from 'vue'

// Notifications (bond rank ups, cleared requests) queue up and show one at a time, top-right.
export type ToastData =
  | { kind: 'rank'; rank: number; line: string }
  | { kind: 'request'; title: string; desc: string; done: number; total: number }

export type Toast = ToastData & { id: number }

let seq = 0
export const toasts = ref<Toast[]>([])

export const pushToast = (toast: ToastData) => {
  // A newer rank up replaces any older one still waiting (or showing), so fast travel doesn't build a backlog
  const rest = toast.kind === 'rank' ? toasts.value.filter((t) => t.kind !== 'rank') : toasts.value
  toasts.value = [...rest, { ...toast, id: ++seq }]
}

/** Remove the toast currently on screen; the next one (if any) takes its place. */
export const dropToast = () => {
  toasts.value = toasts.value.slice(1)
}
