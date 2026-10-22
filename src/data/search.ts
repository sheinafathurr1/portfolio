// Search index for the Third Eye: every item that has a home on one of the screens.
import type { FocusTarget } from '../composables/focus'
import { menuItems, personas } from './phantom'
import { education, experiences, projects, publications, skillCategories } from './portfolio'

export type SearchKind = 'Section' | 'Mission' | 'Confidant' | 'Skill' | 'Persona' | 'Paper' | 'Education'

export interface SearchEntry {
  kind: SearchKind
  title: string
  sub: string
  /** Extra text that matches but isn't shown */
  text: string
  target: FocusTarget
}

export const searchIndex: SearchEntry[] = [
  ...menuItems.map((m) => ({ kind: 'Section' as const, title: m.label, sub: m.sub, text: m.desc, target: { screen: m.id, key: '' } })),
  ...projects.map((p) => ({
    kind: 'Mission' as const,
    title: p.title,
    sub: p.org,
    text: `${p.fullDesc} ${p.tags.join(' ')} ${p.category}`,
    target: { screen: 'missions' as const, key: p.id },
  })),
  ...experiences.map((e) => ({
    kind: 'Confidant' as const,
    title: e.title,
    sub: `${e.company} · ${e.period}`,
    text: `${e.points.join(' ')} ${e.tags.join(' ')}`,
    target: { screen: 'confidant' as const, key: e.id },
  })),
  ...skillCategories.flatMap((c) =>
    c.skills.map((s) => ({ kind: 'Skill' as const, title: s.name, sub: c.label, text: '', target: { screen: 'skill' as const, key: s.name } })),
  ),
  ...personas.map((p) => ({
    kind: 'Persona' as const,
    title: p.name,
    sub: `Arcana ${p.arcana} · ${p.arcanaName}`,
    text: `${p.desc} ${p.traits.join(' ')}`,
    target: { screen: 'persona' as const, key: p.name },
  })),
  ...publications.map((p, i) => ({
    kind: 'Paper' as const,
    title: p.title,
    sub: `${p.venue}, ${p.year}`,
    text: p.role,
    target: { screen: 'den' as const, key: i },
  })),
  ...education.map((e) => ({
    kind: 'Education' as const,
    title: e.degree,
    sub: `${e.school} · GPA ${e.gpa}`,
    text: `${e.note} ${e.detail}`,
    target: { screen: 'status' as const, key: e.degree },
  })),
]

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')

/** Every query word must appear somewhere; title hits rank above description hits. */
export function search(query: string, limit = 12): SearchEntry[] {
  const words = norm(query).split(/\s+/).filter(Boolean)
  if (!words.length) return []
  return searchIndex
    .map((entry) => {
      const title = norm(entry.title)
      const all = `${title} ${norm(entry.sub)} ${norm(entry.text)}`
      if (!words.every((w) => all.includes(w))) return null
      let score = 0
      for (const w of words) {
        if (title.startsWith(w)) score += 6
        else if (title.split(/[^a-z0-9]+/).some((part) => part.startsWith(w))) score += 4
        else if (title.includes(w)) score += 3
        else if (norm(entry.sub).includes(w)) score += 2
        else score += 1
      }
      if (entry.kind === 'Section') score += 0.5
      return { entry, score }
    })
    .filter((r): r is { entry: SearchEntry; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.entry)
}

/** Splits text into plain and matched parts for highlighting. */
export function highlight(text: string, query: string): { text: string; hit: boolean }[] {
  const words = query.trim().split(/\s+/).filter(Boolean).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!words.length) return [{ text, hit: false }]
  const split = new RegExp(`(${words.join('|')})`, 'gi')
  const whole = new RegExp(`^(?:${words.join('|')})$`, 'i')
  return text.split(split).filter(Boolean).map((part) => ({ text: part, hit: whole.test(part) }))
}
