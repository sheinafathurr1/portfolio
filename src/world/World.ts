import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { Environment } from './Environment'
import { Input } from './Input'
import { Player } from './Player'
import { Props } from './Props'
import { Zones } from './Zones'
import { CORE_POSITIONS, GROUP, type ZoneId } from './layout'
import { FONT, MONO, damp } from './utils'

export interface WorldCallbacks {
  onZoneChange?: (id: ZoneId | null) => void
  onCollect?: (count: number, total: number) => void
  onFall?: () => void
}

export interface WorldOptions {
  canvas: HTMLCanvasElement
  labelRoot: HTMLElement
  highQuality: boolean
  callbacks: WorldCallbacks
}

export interface MapState {
  player: { x: number; z: number; yaw: number }
  cores: { x: number; z: number; collected: boolean }[]
}

export const TOTAL_CORES = CORE_POSITIONS.length

/** The interactive 3D island: renderer, physics, camera and game loop. */
export class World {
  /** Waits briefly for web fonts (used on canvas textures) before building the scene. */
  static async create(options: WorldOptions): Promise<World> {
    try {
      await Promise.race([
        Promise.all([document.fonts.load(`800 64px ${FONT}`), document.fonts.load(`600 24px ${MONO}`)]),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ])
    } catch {
      // Fonts are a nicety; fall back to system fonts.
    }
    return new World(options)
  }

  private renderer: THREE.WebGLRenderer
  private composer: EffectComposer | null = null
  private labelRenderer: CSS2DRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(42, 1, 0.1, 500)
  private physics: CANNON.World
  private input = new Input()
  private env: Environment
  private zones: Zones
  private props: Props
  private player: Player

  private raf = 0
  private last = performance.now()
  private elapsed = 0
  // Adaptive quality: sample frame times and shed bloom / resolution on slow GPUs
  private perfFrames = 0
  private perfTime = 0
  private perfLevel = 0
  private started = false
  private transition = 0
  private zoom = 1
  private activeZone: ZoneId | null = null
  private camGoal = new THREE.Vector3()
  private lookGoal = new THREE.Vector3()
  private look = new THREE.Vector3()

  private constructor(private options: WorldOptions) {
    const { canvas, labelRoot, highQuality } = options

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !highQuality, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, highQuality ? 2 : 1.5))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.1
    const anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy())

    this.physics = new CANNON.World({ gravity: new CANNON.Vec3(0, -22, 0), allowSleep: true })
    this.physics.broadphase = new CANNON.SAPBroadphase(this.physics)
    ;(this.physics.solver as CANNON.GSSolver).iterations = 14 // keeps the crate pyramid steady while awake
    this.physics.defaultContactMaterial.friction = 0.4
    this.physics.defaultContactMaterial.restitution = 0.15
    const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), collisionFilterGroup: GROUP.GROUND })
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    this.physics.addBody(ground)

    this.env = new Environment(this.scene, this.physics, anisotropy, highQuality)
    this.zones = new Zones(this.scene, this.physics, anisotropy)
    this.props = new Props(this.scene, this.physics, anisotropy)
    this.player = new Player(this.scene, this.physics, anisotropy)
    this.input.onRespawn = () => this.respawnPlayer()

    this.labelRenderer = new CSS2DRenderer()
    this.labelRenderer.domElement.className = 'world-labels'
    labelRoot.appendChild(this.labelRenderer.domElement)

    if (highQuality) {
      const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 })
      this.composer = new EffectComposer(this.renderer, target)
      this.composer.addPass(new RenderPass(this.scene, this.camera))
      this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.7, 0.5, 0.78))
      this.composer.addPass(new OutputPass())
    }

    this.camera.position.set(0, 18, 34)
    this.resize()
    window.addEventListener('resize', this.resize)
    canvas.addEventListener('wheel', this.handleWheel, { passive: true })
    this.raf = requestAnimationFrame(this.tick)
  }

  private resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    this.camera.aspect = w / h
    this.camera.fov = w / h < 0.8 ? 58 : 42
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h, false)
    if (this.composer) {
      this.composer.setPixelRatio(this.renderer.getPixelRatio())
      this.composer.setSize(w, h)
    }
    this.labelRenderer.setSize(w, h)
  }

  private handleWheel = (e: WheelEvent) => {
    this.zoom = THREE.MathUtils.clamp(this.zoom + e.deltaY * 0.0012, 0.65, 1.6)
  }

  private tick = (now: number) => {
    this.raf = requestAnimationFrame(this.tick)
    const rawDt = Math.max((now - this.last) / 1000, 0)
    const dt = Math.min(rawDt, 1 / 20)
    this.last = now
    this.elapsed += dt
    this.adaptQuality(rawDt)
    const { callbacks } = this.options

    if (this.started) this.player.control(this.input, dt)
    this.physics.step(1 / 60, dt, 4)
    this.player.sync(dt)

    if (this.player.fellOff) {
      this.respawnPlayer()
      callbacks.onFall?.()
    }

    if (this.props.update(dt, this.elapsed, this.player.position)) {
      callbacks.onCollect?.(this.props.collectedCount, TOTAL_CORES)
    }

    const zone = this.zones.update(dt, this.elapsed, this.player.position)
    if (zone !== this.activeZone) {
      this.activeZone = zone
      callbacks.onZoneChange?.(zone)
    }

    this.env.update(this.elapsed)
    this.updateCamera(dt)

    if (this.composer) this.composer.render()
    else this.renderer.render(this.scene, this.camera)
    this.labelRenderer.render(this.scene, this.camera)
  }

  private adaptQuality(rawDt: number) {
    if (this.perfLevel >= 2 || rawDt > 0.5) return // ignore tab switches / long stalls
    this.perfFrames++
    this.perfTime += rawDt
    if (this.perfFrames < 90) return
    const fps = this.perfFrames / this.perfTime
    this.perfFrames = 0
    this.perfTime = 0
    if (fps >= 40) return
    if (this.perfLevel === 0 && this.composer) {
      this.composer.dispose()
      this.composer = null
      this.perfLevel = 1
    } else {
      this.renderer.setPixelRatio(1)
      this.perfLevel = 2
    }
    this.resize()
  }

  private updateCamera(dt: number) {
    if (!this.started) {
      // Slow orbit around the island while the intro screen is up
      const a = this.elapsed * 0.07
      this.camGoal.set(Math.sin(a) * 34, 17 + Math.sin(this.elapsed * 0.3) * 1.5, Math.cos(a) * 34)
      this.lookGoal.set(0, 0, 0)
      this.camera.position.lerp(this.camGoal, damp(2, dt))
    } else {
      this.transition = Math.min(1, this.transition + dt / 1.6)
      const p = this.player.position
      const k = this.zoom * (this.camera.aspect < 0.8 ? 1.35 : 1)
      const y = Math.max(p.y, -3)
      this.camGoal.set(p.x, y + 10.5 * k, p.z + 13 * k)
      this.lookGoal.set(p.x, y + 0.6, p.z - 1.2)
      this.camera.position.lerp(this.camGoal, damp(this.transition < 1 ? 1.6 : 4.5, dt))
    }
    this.look.lerp(this.lookGoal, damp(6, dt))
    this.camera.lookAt(this.look)
  }

  start() {
    this.started = true
    this.transition = 0
    this.input.enabled = true
  }

  respawnPlayer() {
    this.player.respawn()
  }

  resetWorld() {
    this.props.resetAll()
    this.player.respawn()
  }

  setJoystick(x: number, y: number) {
    this.input.setJoystick(x, y)
  }

  setBoost(active: boolean) {
    this.input.setBoost(active)
  }

  jump() {
    this.input.queueJump()
  }

  getMapState(): MapState {
    const p = this.player.position
    return { player: { x: p.x, z: p.z, yaw: this.player.yaw }, cores: this.props.coreStates() }
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.resize)
    this.options.canvas.removeEventListener('wheel', this.handleWheel)
    this.input.dispose()

    const textures = new Set<THREE.Texture>()
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      mesh.geometry?.dispose()
      const materials = mesh.material ? (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) : []
      for (const m of materials) {
        for (const value of Object.values(m)) if (value instanceof THREE.Texture) textures.add(value)
        m.dispose()
      }
    })
    textures.forEach((t) => t.dispose())
    this.composer?.dispose()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
    this.labelRenderer.domElement.remove()
  }
}
