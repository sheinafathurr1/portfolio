import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { skillCategories } from '../data/portfolio'
import {
  CORE_PICKUP_RADIUS, CORE_POSITIONS, GROUP, ISLAND_RADIUS, LETTERS_Z, PLATFORM, RAMP, SKILL_PYRAMID,
} from './layout'
import { addStaticBox } from './bodies'
import { FONT, MONO, makeCanvasTexture } from './utils'

const hdr = (hex: string, k: number) => new THREE.Color(hex).multiplyScalar(k)
const MASK_ALL = GROUP.GROUND | GROUP.STATIC | GROUP.PLAYER | GROUP.DYNAMIC

// 5×7 pixel glyphs for the voxel title
const GLYPHS: Record<string, string[]> = {
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  C: ['.####', '#....', '#....', '#....', '#....', '#....', '.####'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
}
const VOXEL = 0.42
const LETTER_DEPTH = 0.62

interface DynamicProp {
  body: CANNON.Body
  mesh: THREE.Object3D
  home: CANNON.Vec3
  homeQuat: CANNON.Quaternion
  offIsland: boolean
}

interface Core {
  group: THREE.Group
  base: THREE.Vector3
  collected: boolean
  anim: number
}

/** Things you can bump into or pick up: voxel letters, skill crates, ramp, platform and data cores. */
export class Props {
  collectedCount = 0
  private dynamics: DynamicProp[] = []
  private cores: Core[] = []

  constructor(scene: THREE.Scene, private physics: CANNON.World, private anisotropy: number) {
    this.addLetters(scene)
    this.addCrates(scene)
    this.addRamp(scene)
    this.addPlatform(scene)
    this.addCores(scene)
  }

  private addDynamic(mesh: THREE.Object3D, shape: CANNON.Shape, mass: number, position: CANNON.Vec3) {
    const body = new CANNON.Body({
      mass,
      shape,
      position: position.clone(),
      collisionFilterGroup: GROUP.DYNAMIC,
      collisionFilterMask: MASK_ALL,
      linearDamping: 0.05,
      angularDamping: 0.1,
    })
    body.sleepSpeedLimit = 0.25
    body.sleepTimeLimit = 0.6
    this.physics.addBody(body)
    body.sleep()
    this.dynamics.push({ body, mesh, home: position.clone(), homeQuat: body.quaternion.clone(), offIsland: false })
  }

  private addLetters(scene: THREE.Scene) {
    const word = 'SWITCH'
    const palette = [new THREE.Color('#3b82f6'), new THREE.Color('#06b6d4'), new THREE.Color('#8b5cf6')]
    const pitch = 2.75
    const width = 5 * VOXEL
    const height = 7 * VOXEL
    const cube = new THREE.BoxGeometry(VOXEL * 0.92, VOXEL * 0.92, LETTER_DEPTH)

    word.split('').forEach((ch, li) => {
      const rows = GLYPHS[ch]
      if (!rows) return
      const parts: THREE.BufferGeometry[] = []
      rows.forEach((row, r) => {
        row.split('').forEach((cell, c) => {
          if (cell !== '#') return
          const g = cube.clone()
          g.translate(-width / 2 + VOXEL * (c + 0.5), height / 2 - VOXEL * (r + 0.5), 0)
          parts.push(g)
        })
      })
      const geo = mergeGeometries(parts)
      parts.forEach((p) => p.dispose())
      if (!geo) return

      const t = li / (word.length - 1)
      const from = t < 0.5 ? palette[0]! : palette[1]!
      const to = t < 0.5 ? palette[1]! : palette[2]!
      const color = from.clone().lerp(to, t < 0.5 ? t * 2 : (t - 0.5) * 2)
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.45, roughness: 0.35, metalness: 0.25 }),
      )
      mesh.castShadow = true
      mesh.receiveShadow = true
      scene.add(mesh)

      const x = -((word.length - 1) * pitch) / 2 + li * pitch
      this.addDynamic(
        mesh,
        new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, LETTER_DEPTH / 2)),
        1.2,
        new CANNON.Vec3(x, height / 2 + 0.01, LETTERS_Z),
      )
    })
    cube.dispose()
  }

  private addCrates(scene: THREE.Scene) {
    const crates = skillCategories
      .flatMap((cat) => cat.skills.map((s) => ({ ...s, color: cat.hex })))
      .sort((a, b) => b.level - a.level)
      .slice(0, 10)
    const geo = new THREE.BoxGeometry(1, 1, 1)
    const rows = [4, 3, 2, 1]
    let index = 0
    rows.forEach((count, r) => {
      for (let i = 0; i < count; i++) {
        const spec = crates[index++]
        if (!spec) return
        const tex = makeCanvasTexture(256, 256, (ctx) => {
          ctx.fillStyle = '#0b1226'
          ctx.fillRect(0, 0, 256, 256)
          ctx.strokeStyle = spec.color
          ctx.lineWidth = 14
          ctx.strokeRect(7, 7, 242, 242)
          ctx.lineWidth = 3
          ctx.globalAlpha = 0.5
          ctx.strokeRect(28, 28, 200, 200)
          ctx.globalAlpha = 1
          ctx.fillStyle = spec.color
          for (const [cx, cy] of [[30, 30], [226, 30], [30, 226], [226, 226]] as const) {
            ctx.beginPath()
            ctx.arc(cx, cy, 6, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.textAlign = 'center'
          ctx.fillStyle = '#f8fafc'
          let size = 46
          do {
            ctx.font = `800 ${size}px ${FONT}`
            size -= 2
          } while (ctx.measureText(spec.name).width > 186 && size > 18)
          ctx.fillText(spec.name, 128, 134)
          ctx.font = `600 26px ${MONO}`
          ctx.fillStyle = spec.color
          ctx.fillText(`${spec.level}%`, 128, 184)
        }, this.anisotropy)
        const mesh = new THREE.Mesh(
          geo,
          new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: '#ffffff', emissiveIntensity: 0.28, roughness: 0.6 }),
        )
        mesh.castShadow = true
        mesh.receiveShadow = true
        scene.add(mesh)
        const x = SKILL_PYRAMID.x + (i - (count - 1) / 2) * 1.03
        const y = 0.5 + r * 1.0 + 0.005
        this.addDynamic(mesh, new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)), 0.3, new CANNON.Vec3(x, y, SKILL_PYRAMID.z))
      }
    })
  }

  private addRamp(scene: THREE.Scene) {
    const { x, z, halfWidth, halfLength, thickness, angle } = RAMP
    const draw = (glow: boolean) => (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = glow ? '#000000' : '#0f172a'
      ctx.fillRect(0, 0, 256, 512)
      ctx.strokeStyle = glow ? '#ffffff' : '#22d3ee'
      ctx.lineWidth = 18
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (let i = 0; i < 5; i++) {
        const y = 60 + i * 92
        ctx.beginPath()
        ctx.moveTo(70, y + 40)
        ctx.lineTo(128, y)
        ctx.lineTo(186, y + 40)
        ctx.stroke()
      }
    }
    const map = makeCanvasTexture(256, 512, draw(false), this.anisotropy)
    const glow = makeCanvasTexture(256, 512, draw(true), this.anisotropy)
    const dark = new THREE.MeshStandardMaterial({ color: '#111a33', roughness: 0.7 })
    const top = new THREE.MeshStandardMaterial({ map, emissiveMap: glow, emissive: '#22d3ee', emissiveIntensity: 1.4, roughness: 0.6 })
    const ramp = new THREE.Mesh(
      new THREE.BoxGeometry(halfWidth * 2, thickness * 2, halfLength * 2),
      [dark, dark, top, dark, dark, dark],
    )
    const y = halfLength * Math.sin(angle) - thickness * Math.cos(angle)
    ramp.position.set(x, y, z)
    ramp.rotation.x = angle
    ramp.castShadow = true
    ramp.receiveShadow = true
    const railMat = new THREE.MeshBasicMaterial({ color: hdr('#22d3ee', 2.4) })
    for (const side of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, halfLength * 2), railMat)
      rail.position.set(side * halfWidth, thickness + 0.02, 0)
      ramp.add(rail)
    }
    scene.add(ramp)
    addStaticBox(this.physics, x, y, z, halfWidth, thickness, halfLength, [angle, 0, 0])
  }

  private addPlatform(scene: THREE.Scene) {
    const { x, z, half, height } = PLATFORM
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(half * 2, height, half * 2),
      new THREE.MeshStandardMaterial({ color: '#111a33', roughness: 0.6, metalness: 0.3 }),
    )
    block.position.set(x, height / 2, z)
    block.castShadow = true
    block.receiveShadow = true
    scene.add(block)
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(block.geometry),
      new THREE.LineBasicMaterial({ color: hdr('#f59e0b', 2.2) }),
    )
    edges.position.copy(block.position)
    scene.add(edges)
    addStaticBox(this.physics, x, height / 2, z, half, height / 2, half)
  }

  private addCores(scene: THREE.Scene) {
    const gem = new THREE.OctahedronGeometry(0.3, 0)
    const gemMat = new THREE.MeshStandardMaterial({
      color: '#67e8f9',
      emissive: '#22d3ee',
      emissiveIntensity: 3,
      roughness: 0.2,
      metalness: 0.2,
      flatShading: true,
    })
    const ringGeo = new THREE.TorusGeometry(0.5, 0.025, 6, 40)
    const ringMat = new THREE.MeshBasicMaterial({ color: hdr('#22d3ee', 2), transparent: true, opacity: 0.8 })
    for (const [x, y, z] of CORE_POSITIONS) {
      const group = new THREE.Group()
      const core = new THREE.Mesh(gem, gemMat)
      core.scale.set(1, 1.4, 1)
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = Math.PI / 2
      group.add(core, ring)
      group.position.set(x, y, z)
      scene.add(group)
      this.cores.push({ group, base: new THREE.Vector3(x, y, z), collected: false, anim: 0 })
    }
  }

  /** Returns true when a data core was collected this frame. */
  update(dt: number, t: number, player: THREE.Vector3): boolean {
    for (const d of this.dynamics) {
      const p = d.body.position
      // cannon-es treats sleeping bodies as immovable on first contact, so a stack hit by the bot would act
      // like a wall. Wake everything near the bot ahead of time; things fall back asleep once it leaves.
      if (d.body.sleepState === CANNON.Body.SLEEPING && Math.hypot(p.x - player.x, p.z - player.z) < 5) {
        d.body.wakeUp()
      }
      if (!d.offIsland && Math.hypot(p.x, p.z) > ISLAND_RADIUS) {
        d.offIsland = true
        d.body.collisionFilterMask = MASK_ALL & ~GROUP.GROUND
      }
      if (p.y < -25) this.resetProp(d)
      const q = d.body.quaternion
      d.mesh.position.set(p.x, p.y, p.z)
      d.mesh.quaternion.set(q.x, q.y, q.z, q.w)
    }

    let collectedNow = false
    this.cores.forEach((core, i) => {
      if (!core.collected) {
        core.group.rotation.y += dt * 1.6
        core.group.position.y = core.base.y + Math.sin(t * 2 + i) * 0.18
        const ring = core.group.children[1]
        if (ring) ring.rotation.y = Math.sin(t * 1.3 + i) * 0.6
        if (core.group.position.distanceTo(player) < CORE_PICKUP_RADIUS) {
          core.collected = true
          core.anim = 1
          this.collectedCount++
          collectedNow = true
        }
      } else if (core.anim > 0) {
        core.anim = Math.max(0, core.anim - dt * 2.5)
        core.group.scale.setScalar(core.anim)
        core.group.position.y += dt * 3
        core.group.rotation.y += dt * 12
        if (core.anim === 0) core.group.visible = false
      }
    })
    return collectedNow
  }

  private resetProp(d: DynamicProp) {
    d.body.position.copy(d.home)
    d.body.quaternion.copy(d.homeQuat)
    d.body.velocity.setZero()
    d.body.angularVelocity.setZero()
    d.body.collisionFilterMask = MASK_ALL
    d.offIsland = false
    d.body.sleep()
  }

  /** Calls `fn` for every letter/crate within `radius` of (x, z), with a 1→0 distance falloff. */
  forEachBodyNear(x: number, z: number, radius: number, fn: (body: CANNON.Body, falloff: number) => void) {
    for (const d of this.dynamics) {
      const dist = Math.hypot(d.body.position.x - x, d.body.position.z - z)
      if (dist < radius) fn(d.body, 1 - dist / radius)
    }
  }

  /** Put the letters and crates back where they started. */
  resetAll() {
    for (const d of this.dynamics) this.resetProp(d)
  }

  coreStates() {
    return this.cores.map((c) => ({ x: c.base.x, z: c.base.z, collected: c.collected }))
  }
}
