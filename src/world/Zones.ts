import * as THREE from 'three'
import type * as CANNON from 'cannon-es'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { experiences, projects } from '../data/portfolio'
import { CONTACT_TOWER, MAILBOX, SKILL_PYRAMID, TROPHY, ZONES, type ZoneId, type ZoneLayout } from './layout'
import { addStaticBox, addStaticCylinder } from './bodies'
import { EMOJI, FONT, MONO, damp, makeCanvasTexture, roundRect, wrapText } from './utils'

const hdr = (hex: string, k: number) => new THREE.Color(hex).multiplyScalar(k)
const ACCENT_HEX = { blue: '#3b82f6', violet: '#8b5cf6', emerald: '#10b981' } as const

interface ZoneVisual {
  layout: ZoneLayout
  ringMat: THREE.MeshBasicMaterial
  discMat: THREE.MeshBasicMaterial
  label: HTMLDivElement
  wrapper: HTMLDivElement
  active: number
  opacity: number
}

interface Spinner {
  obj: THREE.Object3D
  speed: number
  baseY?: number
  bob?: number
}

/** Landmarks for each portfolio section, plus the glowing rings/labels that detect when the bot is inside. */
export class Zones {
  private visuals: ZoneVisual[] = []
  private spinners: Spinner[] = []
  private signals: THREE.Mesh[] = []
  private beacon!: THREE.MeshStandardMaterial
  private dark = new THREE.MeshStandardMaterial({ color: '#0d1328', metalness: 0.5, roughness: 0.45 })

  constructor(scene: THREE.Scene, physics: CANNON.World, private anisotropy: number) {
    for (const zone of ZONES) this.addZone(scene, zone)
    this.addExperiencePillars(scene, physics)
    this.addBillboards(scene, physics)
    this.addSkillsPad(scene)
    this.addTrophy(scene, physics)
    this.addContactTower(scene, physics)
  }

  private addZone(scene: THREE.Scene, zone: ZoneLayout) {
    const ringMat = new THREE.MeshBasicMaterial({
      color: hdr(zone.color, 1.6),
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const ring = new THREE.Mesh(new THREE.RingGeometry(zone.radius - 0.16, zone.radius, 96), ringMat)
    ring.rotation.x = -Math.PI / 2
    ring.position.set(zone.x, 0.03, zone.z)
    scene.add(ring)

    const discMat = new THREE.MeshBasicMaterial({
      color: zone.color,
      transparent: true,
      opacity: 0.04,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const disc = new THREE.Mesh(new THREE.CircleGeometry(zone.radius, 64), discMat)
    disc.rotation.x = -Math.PI / 2
    disc.position.set(zone.x, 0.025, zone.z)
    scene.add(disc)

    const wrapper = document.createElement('div')
    const label = document.createElement('div')
    label.className = 'world-label'
    label.style.setProperty('--zone-color', zone.color)
    const icon = document.createElement('span')
    icon.className = 'world-label__icon'
    icon.textContent = zone.icon
    const text = document.createElement('span')
    text.textContent = zone.label
    label.append(icon, text)
    wrapper.appendChild(label)
    const obj = new CSS2DObject(wrapper)
    obj.position.set(...zone.labelPos)
    scene.add(obj)

    this.visuals.push({ layout: zone, ringMat, discMat, label, wrapper, active: 0, opacity: 1 })
  }

  private addExperiencePillars(scene: THREE.Scene, physics: CANNON.World) {
    const gem = new THREE.OctahedronGeometry(0.3, 0)
    experiences.forEach((exp, i) => {
      const zone = ZONES.find((z) => z.id === `exp-${i + 1}`)
      if (!zone) return
      const color = ACCENT_HEX[exp.accent]
      const tex = makeCanvasTexture(320, 780, (ctx) => {
        const g = ctx.createLinearGradient(0, 0, 0, 780)
        g.addColorStop(0, '#111a36')
        g.addColorStop(1, '#050816')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, 320, 780)
        ctx.fillStyle = color
        ctx.fillRect(0, 0, 320, 12)
        ctx.font = `800 128px ${FONT}`
        ctx.fillText(`0${exp.id}`, 26, 170)
        ctx.font = `600 21px ${MONO}`
        ctx.fillStyle = '#94a3b8'
        ctx.fillText(exp.period.toUpperCase(), 28, 220)
        ctx.font = `800 40px ${FONT}`
        ctx.fillStyle = '#f8fafc'
        const lines = wrapText(ctx, exp.title, 266)
        lines.forEach((line, li) => ctx.fillText(line, 28, 300 + li * 48))
        let y = 300 + lines.length * 48 + 18
        ctx.font = `700 28px ${FONT}`
        ctx.fillStyle = color
        ctx.fillText(exp.company, 28, y)
        y += 70
        ctx.font = `500 20px ${MONO}`
        for (const tag of exp.tags) {
          const w = ctx.measureText(tag).width + 28
          roundRect(ctx, 28, y - 26, w, 38, 10)
          ctx.fillStyle = 'rgba(148,163,184,0.12)'
          ctx.fill()
          ctx.fillStyle = '#cbd5e1'
          ctx.fillText(tag, 42, y)
          y += 52
        }
        ctx.fillStyle = color
        ctx.fillRect(28, 740, 120, 6)
      }, this.anisotropy)
      const front = new THREE.MeshStandardMaterial({
        map: tex,
        emissiveMap: tex,
        emissive: '#ffffff',
        emissiveIntensity: 0.4,
        roughness: 0.6,
      })
      const px = zone.x
      const pz = zone.z - 1.2
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.4, 0.6), [
        this.dark, this.dark, this.dark, this.dark, front, this.dark,
      ])
      pillar.position.set(px, 1.9, pz)
      pillar.castShadow = true
      pillar.receiveShadow = true
      scene.add(pillar)

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(pillar.geometry),
        new THREE.LineBasicMaterial({ color: hdr(color, 2.2) }),
      )
      edges.position.copy(pillar.position)
      scene.add(edges)

      const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.2, 1.1), this.dark)
      plinth.position.set(px, 0.1, pz)
      plinth.receiveShadow = true
      scene.add(plinth)

      const crystal = new THREE.Mesh(
        gem,
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2.4, flatShading: true }),
      )
      crystal.scale.set(1, 1.5, 1)
      crystal.position.set(px, 4.2, pz)
      scene.add(crystal)
      this.spinners.push({ obj: crystal, speed: 1.2, baseY: 4.2, bob: 0.15 })

      addStaticBox(physics, px, 1.9, pz, 0.7, 1.9, 0.3)
    })
  }

  private addBillboards(scene: THREE.Scene, physics: CANNON.World) {
    const postGeo = new THREE.CylinderGeometry(0.09, 0.11, 2.2, 10)
    projects.forEach((project, i) => {
      const zone = ZONES.find((z) => z.id === `project-${i + 1}`)
      if (!zone) return
      const [c1 = '#2563eb', c2 = '#06b6d4', c3 = '#0ea5e9'] = project.colors
      const tex = makeCanvasTexture(1024, 640, (ctx) => {
        const g = ctx.createLinearGradient(0, 0, 1024, 640)
        g.addColorStop(0, c1)
        g.addColorStop(0.55, c2)
        g.addColorStop(1, c3)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, 1024, 640)
        ctx.fillStyle = 'rgba(255,255,255,0.12)'
        for (let x = 14; x < 1024; x += 28) {
          for (let y = 14; y < 640; y += 28) {
            ctx.beginPath()
            ctx.arc(x, y, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        const shade = ctx.createLinearGradient(0, 640, 0, 200)
        shade.addColorStop(0, 'rgba(2,6,23,0.55)')
        shade.addColorStop(1, 'rgba(2,6,23,0)')
        ctx.fillStyle = shade
        ctx.fillRect(0, 0, 1024, 640)

        ctx.globalAlpha = 0.3
        ctx.font = `300px ${EMOJI}`
        ctx.textAlign = 'right'
        ctx.fillText(project.icon, 1000, 430)
        ctx.globalAlpha = 1
        ctx.textAlign = 'left'

        roundRect(ctx, 48, 44, 116, 50, 14)
        ctx.fillStyle = 'rgba(2,6,23,0.35)'
        ctx.fill()
        ctx.font = `700 26px ${MONO}`
        ctx.fillStyle = '#ffffff'
        ctx.fillText(project.year, 72, 79)
        ctx.fillStyle = 'rgba(255,255,255,0.65)'
        ctx.textAlign = 'right'
        ctx.fillText(`#0${project.id}`, 976, 79)
        ctx.textAlign = 'left'

        ctx.font = `700 24px ${MONO}`
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.fillText(project.category === 'riset' ? 'ACADEMIC RESEARCH' : 'SYSTEM DEVELOPMENT', 50, 180)
        ctx.font = `800 64px ${FONT}`
        ctx.fillStyle = '#ffffff'
        wrapText(ctx, project.title, 760).forEach((line, li) => ctx.fillText(line, 48, 262 + li * 74))

        ctx.font = `600 24px ${MONO}`
        let x = 48
        for (const tag of project.tags) {
          const w = ctx.measureText(tag).width + 32
          roundRect(ctx, x, 548, w, 48, 12)
          ctx.fillStyle = 'rgba(255,255,255,0.18)'
          ctx.fill()
          ctx.fillStyle = '#ffffff'
          ctx.fillText(tag, x + 16, 580)
          x += w + 12
        }
      }, this.anisotropy)

      const bx = zone.x
      const bz = zone.z - 3
      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(4.4, 2.75),
        new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: '#ffffff', emissiveIntensity: 0.6, roughness: 0.4 }),
      )
      screen.position.set(bx, 3.45, bz + 0.07)
      scene.add(screen)

      const frame = new THREE.Mesh(new THREE.BoxGeometry(4.65, 3.0, 0.12), this.dark)
      frame.position.set(bx, 3.45, bz)
      frame.castShadow = true
      scene.add(frame)

      const glow = new THREE.LineSegments(
        new THREE.EdgesGeometry(frame.geometry),
        new THREE.LineBasicMaterial({ color: hdr(c2, 2) }),
      )
      glow.position.copy(frame.position)
      scene.add(glow)

      for (const side of [-1.7, 1.7]) {
        const post = new THREE.Mesh(postGeo, this.dark)
        post.position.set(bx + side, 1.1, bz - 0.05)
        post.castShadow = true
        scene.add(post)
        addStaticBox(physics, bx + side, 1.1, bz - 0.05, 0.14, 1.1, 0.14)
      }
      addStaticBox(physics, bx, 3.45, bz, 2.33, 1.5, 0.1)
    })
  }

  private addSkillsPad(scene: THREE.Scene) {
    const pad = new THREE.Mesh(
      new THREE.CylinderGeometry(3.4, 3.4, 0.04, 56),
      new THREE.MeshStandardMaterial({ color: '#150f30', roughness: 0.6 }),
    )
    pad.position.set(SKILL_PYRAMID.x, 0.02, SKILL_PYRAMID.z)
    pad.receiveShadow = true
    scene.add(pad)

    const neon = new THREE.MeshBasicMaterial({ color: hdr('#a855f7', 2.2) })
    const edge = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.045, 6, 96), neon)
    edge.rotation.x = Math.PI / 2
    edge.position.set(SKILL_PYRAMID.x, 0.05, SKILL_PYRAMID.z)
    scene.add(edge)

    const halo = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.03, 6, 80), neon)
    halo.rotation.x = Math.PI / 2
    halo.position.set(SKILL_PYRAMID.x, 4.9, SKILL_PYRAMID.z)
    scene.add(halo)
    this.spinners.push({ obj: halo, speed: 0, baseY: 4.9, bob: 0.25 })
  }

  private addTrophy(scene: THREE.Scene, physics: CANNON.World) {
    const { x, z } = TROPHY
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.05, 1.6, 28), this.dark)
    pedestal.position.set(x, 0.8, z)
    pedestal.castShadow = true
    pedestal.receiveShadow = true
    scene.add(pedestal)
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.92, 0.04, 8, 48),
      new THREE.MeshBasicMaterial({ color: hdr('#f59e0b', 2.4) }),
    )
    ring.rotation.x = Math.PI / 2
    ring.position.set(x, 1.6, z)
    scene.add(ring)

    const gold = new THREE.MeshStandardMaterial({
      color: '#fbbf24',
      metalness: 1,
      roughness: 0.25,
      emissive: '#b45309',
      emissiveIntensity: 0.5,
      side: THREE.DoubleSide,
    })
    const trophy = new THREE.Group()
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.4, 0.18, 24), gold)
    base.position.y = 0.09
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, 0.45, 12), gold)
    stem.position.y = 0.4
    const cup = new THREE.Mesh(
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0.12, 0),
          new THREE.Vector2(0.2, 0.08),
          new THREE.Vector2(0.38, 0.3),
          new THREE.Vector2(0.46, 0.62),
          new THREE.Vector2(0.48, 0.72),
          new THREE.Vector2(0.43, 0.72),
          new THREE.Vector2(0.36, 0.38),
          new THREE.Vector2(0, 0.22),
        ],
        36,
      ),
      gold,
    )
    cup.position.y = 0.6
    trophy.add(base, stem, cup)
    for (const side of [-1, 1]) {
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.035, 8, 20, Math.PI), gold)
      handle.position.set(side * 0.45, 1.0, 0)
      handle.rotation.z = side > 0 ? -Math.PI / 2 : Math.PI / 2
      trophy.add(handle)
    }
    trophy.position.set(x, 1.62, z)
    trophy.scale.setScalar(1.3)
    trophy.traverse((o) => { o.castShadow = true })
    scene.add(trophy)
    this.spinners.push({ obj: trophy, speed: 0.6 })

    const orbit = new THREE.Group()
    const star = new THREE.OctahedronGeometry(0.12, 0)
    const starMat = new THREE.MeshBasicMaterial({ color: hdr('#fde68a', 3) })
    for (let i = 0; i < 3; i++) {
      const s = new THREE.Mesh(star, starMat)
      const a = (i / 3) * Math.PI * 2
      s.position.set(Math.cos(a) * 1.25, 0.4 + i * 0.35, Math.sin(a) * 1.25)
      orbit.add(s)
    }
    orbit.position.set(x, 1.8, z)
    scene.add(orbit)
    this.spinners.push({ obj: orbit, speed: -1.1 })

    addStaticCylinder(physics, x, 0.8, z, 1.0, 1.6, 12)
  }

  private beam(a: THREE.Vector3, b: THREE.Vector3, radius: number, material: THREE.Material) {
    const dir = new THREE.Vector3().subVectors(b, a)
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, dir.length(), 6), material)
    mesh.position.copy(a).addScaledVector(dir, 0.5)
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
    mesh.castShadow = true
    return mesh
  }

  private addContactTower(scene: THREE.Scene, physics: CANNON.World) {
    const { x, z } = CONTACT_TOWER
    const H = 7
    const tower = new THREE.Group()
    tower.position.set(x, 0, z)
    const steel = new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.8, roughness: 0.35 })
    for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]] as const) {
      tower.add(this.beam(new THREE.Vector3(sx * 1.05, 0, sz * 1.05), new THREE.Vector3(sx * 0.22, H, sz * 0.22), 0.07, steel))
    }
    const neon = new THREE.MeshBasicMaterial({ color: hdr('#10b981', 2.4) })
    for (const y of [1.8, 3.6, 5.4]) {
      const half = 1.05 - (0.83 * y) / H
      const frame = new THREE.Mesh(new THREE.TorusGeometry(half * Math.SQRT2, 0.035, 4, 4), neon)
      frame.rotation.set(Math.PI / 2, 0, Math.PI / 4)
      frame.position.y = y
      tower.add(frame)
    }
    const mast = this.beam(new THREE.Vector3(0, H - 0.2, 0), new THREE.Vector3(0, H + 1.1, 0), 0.04, steel)
    tower.add(mast)
    this.beacon = new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 3 })
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), this.beacon)
    beacon.position.y = H + 1.2
    tower.add(beacon)
    scene.add(tower)

    const signalMat = new THREE.MeshBasicMaterial({
      color: hdr('#34d399', 2),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.03, 6, 64), signalMat.clone())
      ring.rotation.x = Math.PI / 2
      ring.position.set(x, H + 1.2, z)
      scene.add(ring)
      this.signals.push(ring)
    }
    addStaticBox(physics, x, H / 2, z, 1.05, H / 2, 1.05)

    // Mailbox
    const mail = new THREE.Group()
    mail.position.set(MAILBOX.x, 0, MAILBOX.z)
    mail.rotation.y = 0.5
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.0, 0.14), this.dark)
    post.position.y = 0.5
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.48, 0.85),
      new THREE.MeshStandardMaterial({ color: '#10b981', metalness: 0.4, roughness: 0.4, emissive: '#065f46', emissiveIntensity: 0.6 }),
    )
    box.position.y = 1.22
    const lid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.85, 16, 1, false, 0, Math.PI),
      box.material,
    )
    // Axis Y → Z (along the box), then the open half from +X → +Y so the curve sits on top
    lid.rotation.set(Math.PI / 2, 0, Math.PI / 2, 'ZYX')
    lid.position.y = 1.46
    const flagPole = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.04), this.dark)
    flagPole.position.set(0.34, 1.45, 0.15)
    const flag = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.18, 0.26),
      new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 1.2 }),
    )
    flag.position.set(0.34, 1.62, 0.27)
    mail.add(post, box, lid, flagPole, flag)
    mail.traverse((o) => { o.castShadow = true })
    scene.add(mail)
    addStaticBox(physics, MAILBOX.x, 0.75, MAILBOX.z, 0.35, 0.75, 0.45, [0, 0.5, 0])
  }

  /** Returns the zone the bot is currently in, if any. */
  update(dt: number, t: number, player: THREE.Vector3): ZoneId | null {
    let best: ZoneVisual | null = null
    let bestDist = Infinity
    for (const v of this.visuals) {
      const d = Math.hypot(player.x - v.layout.x, player.z - v.layout.z)
      if (d < v.layout.radius && d < bestDist && player.y > -2) {
        best = v
        bestDist = d
      }
    }

    for (const v of this.visuals) {
      const isActive = v === best
      v.active += ((isActive ? 1 : 0) - v.active) * damp(6, dt)
      v.ringMat.opacity = 0.3 + v.active * 0.6 + Math.sin(t * 2.2 + v.layout.x) * 0.05
      v.discMat.opacity = 0.03 + v.active * 0.1
      v.label.classList.toggle('is-active', isActive)
      const [lx, , lz] = v.layout.labelPos
      const fade = Math.round(Math.min(1, Math.max(0.3, 1.3 - Math.hypot(player.x - lx, player.z - lz) / 34)) * 20) / 20
      if (fade !== v.opacity) {
        v.opacity = fade
        v.wrapper.style.opacity = String(fade)
      }
    }

    for (const s of this.spinners) {
      s.obj.rotation.y += s.speed * dt
      if (s.baseY !== undefined && s.bob) s.obj.position.y = s.baseY + Math.sin(t * 1.6 + s.obj.position.x) * s.bob
    }

    this.signals.forEach((ring, i) => {
      const phase = (t * 0.45 + i / 3) % 1
      ring.scale.setScalar(0.3 + phase * 3.6)
      ;(ring.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * 0.9
    })
    this.beacon.emissiveIntensity = Math.sin(t * 4) > 0.2 ? 4 : 0.4

    return best?.layout.id ?? null
  }
}
