// World layout: everything that needs to agree on where things are on the island.

export const ISLAND_RADIUS = 36
export const SPAWN = { x: 0, y: 1.5, z: 6 } as const

// cannon-es collision filter groups
export const GROUP = {
  GROUND: 1,
  STATIC: 2,
  PLAYER: 4,
  DYNAMIC: 8,
} as const

export type ZoneId =
  | 'about'
  | 'exp-1'
  | 'exp-2'
  | 'exp-3'
  | 'exp-4'
  | 'skills'
  | 'project-1'
  | 'project-2'
  | 'project-3'
  | 'achievements'
  | 'contact'

export interface ZoneLayout {
  id: ZoneId
  x: number
  z: number
  radius: number
  label: string
  icon: string
  color: string
  labelPos: [number, number, number]
}

export const ZONES: ZoneLayout[] = [
  { id: 'about',        x: 0,   z: 3,   radius: 5,   label: 'Tentang Saya',      icon: '👋', color: '#38bdf8', labelPos: [0, 4.4, -6] },
  // Experience pillars in a west-side arc, in the same order as `experiences`
  { id: 'exp-1',        x: -13, z: -9,  radius: 3.2, label: 'Freelance',         icon: '💼', color: '#3b82f6', labelPos: [-13, 4.6, -10.2] },
  { id: 'exp-2',        x: -19.5, z: -3.5, radius: 3.2, label: 'CoE CAATIS',     icon: '🧪', color: '#8b5cf6', labelPos: [-19.5, 4.6, -4.7] },
  { id: 'exp-3',        x: -19.5, z: 3.5, radius: 3.2, label: 'Asisten Dosen',   icon: '🎓', color: '#10b981', labelPos: [-19.5, 4.6, 2.3] },
  { id: 'exp-4',        x: -13, z: 9,   radius: 3.2, label: 'Telkom Indonesia',  icon: '🏢', color: '#f59e0b', labelPos: [-13, 4.6, 7.8] },
  { id: 'skills',       x: 17,  z: -3,  radius: 6,   label: 'Keahlian',          icon: '⚡', color: '#a855f7', labelPos: [17, 5.6, -6] },
  // Billboards for the three featured projects (see `featuredProjects`)
  { id: 'project-1',    x: -9,  z: -18, radius: 3.6, label: 'Deteksi Korosi',    icon: '🛰️', color: '#06b6d4', labelPos: [-9, 6.2, -21] },
  { id: 'project-2',    x: 0,   z: -21, radius: 3.6, label: 'E-Selamat',         icon: '🐄', color: '#10b981', labelPos: [0, 6.2, -24] },
  { id: 'project-3',    x: 9,   z: -18, radius: 3.6, label: 'IoT Lingkungan',    icon: '🌱', color: '#14b8a6', labelPos: [9, 6.2, -21] },
  { id: 'achievements', x: 15,  z: 15,  radius: 4.5, label: 'Pencapaian',        icon: '🏆', color: '#f59e0b', labelPos: [15, 4.9, 13] },
  { id: 'contact',      x: -15, z: 18,  radius: 4.5, label: 'Kontak',            icon: '📨', color: '#10b981', labelPos: [-19, 9.2, 14.5] },
]

// Jump ramp: rises toward -z (north), so you approach it from the south and launch toward spawn.
export const RAMP = { x: 0, z: 17, halfWidth: 2.2, halfLength: 3.2, thickness: 0.15, angle: 0.28 }

// Raised block next to the trophy; its data core is only reachable by jumping.
export const PLATFORM = { x: 22, z: 22, half: 1.8, height: 1.2 }

export const LETTERS_Z = -6
export const SKILL_PYRAMID = { x: 17, z: -6 }
// Landmarks sit north of their zone centre so they stay behind the bot from the camera's point of view
export const CONTACT_TOWER = { x: -19, z: 14.5 }
export const MAILBOX = { x: -11.8, z: 15.6 }
export const TROPHY = { x: 15, z: 13 }

export const CORE_PICKUP_RADIUS = 1.3
export const CORE_POSITIONS: [number, number, number][] = [
  [0, 4.0, 11.5],   // above the ramp's landing arc: jump at the ramp's lip
  [22, 2.1, 22],    // on the raised platform
  [-25, 1, -15],
  [26, 1, -14],
  [0, 1, -30],      // behind the project billboards
  [-29, 1, 4],
  [20, 1, -9.5],    // hidden behind the skill crates
  [-6, 1, 27],
]

/** True when a decoration (crystal, rock) at (x, z) would block a landmark, path or pickup. */
export function isReserved(x: number, z: number, margin: number): boolean {
  if (Math.hypot(x, z) < 10) return true
  for (const zone of ZONES) {
    if (Math.hypot(x - zone.x, z - zone.z) < zone.radius + margin) return true
  }
  if (Math.abs(x - RAMP.x) < 4.5 && z > 8 && z < 25) return true
  if (Math.abs(x) < 9.5 && z > -9 && z < -3) return true
  if (Math.abs(x) < 13 && z > -27 && z < -15) return true
  if (Math.hypot(x - PLATFORM.x, z - PLATFORM.z) < 4) return true
  for (const [cx, , cz] of CORE_POSITIONS) {
    if (Math.hypot(x - cx, z - cz) < 2.5) return true
  }
  return false
}
