import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import type { Input } from './Input'
import { GROUP, ISLAND_RADIUS, SPAWN } from './layout'
import { damp, makeCanvasTexture } from './utils'

const RADIUS = 0.6
const MASK_ON_ISLAND = GROUP.GROUND | GROUP.STATIC | GROUP.DYNAMIC
const MASK_OFF_ISLAND = GROUP.STATIC | GROUP.DYNAMIC
const TRAIL_SIZE = 48

const lerpAngle = (a: number, b: number, t: number) => {
  const d = Math.atan2(Math.sin(b - a), Math.cos(b - a))
  return a + d * t
}

function drawBallSkin(ctx: CanvasRenderingContext2D, emissive: boolean) {
  ctx.fillStyle = emissive ? '#000000' : '#0f172a'
  ctx.fillRect(0, 0, 512, 256)
  if (!emissive) {
    ctx.strokeStyle = '#1e3a8a'
    ctx.lineWidth = 4
    for (let i = 0; i < 8; i++) {
      ctx.beginPath()
      ctx.moveTo(i * 64, 0)
      ctx.lineTo(i * 64, 256)
      ctx.stroke()
    }
  }
  ctx.fillStyle = emissive ? '#ffffff' : '#22d3ee'
  ctx.fillRect(0, 118, 512, 20)
  for (let i = 0; i < 8; i++) {
    for (const y of [64, 192]) {
      ctx.beginPath()
      ctx.arc(i * 64 + 32, y, 9, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

/** The rolling orb bot the visitor controls. */
export class Player {
  readonly body: CANNON.Body
  readonly position = new THREE.Vector3()
  yaw = 0
  grounded = false

  private ball: THREE.Mesh
  private head = new THREE.Group()
  private light: THREE.PointLight
  private offIsland = false
  private hop = 0
  private rayFrom = new CANNON.Vec3()
  private rayTo = new CANNON.Vec3()
  private rayResult = new CANNON.RaycastResult()

  private trail: THREE.Points
  private trailPositions = new Float32Array(TRAIL_SIZE * 3)
  private trailColors = new Float32Array(TRAIL_SIZE * 3)
  private trailLife = new Float32Array(TRAIL_SIZE)
  private trailCursor = 0
  private trailTimer = 0

  constructor(scene: THREE.Scene, private physics: CANNON.World, anisotropy: number) {
    this.body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(RADIUS),
      position: new CANNON.Vec3(SPAWN.x, SPAWN.y, SPAWN.z),
      linearDamping: 0.3,
      angularDamping: 0.4,
      collisionFilterGroup: GROUP.PLAYER,
      collisionFilterMask: MASK_ON_ISLAND,
      allowSleep: false,
    })
    physics.addBody(this.body)

    // Ball
    const skin = makeCanvasTexture(512, 256, (ctx) => drawBallSkin(ctx, false), anisotropy)
    const glow = makeCanvasTexture(512, 256, (ctx) => drawBallSkin(ctx, true), anisotropy)
    this.ball = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 40, 24),
      new THREE.MeshStandardMaterial({
        map: skin,
        emissiveMap: glow,
        emissive: '#22d3ee',
        emissiveIntensity: 1.1,
        metalness: 0.5,
        roughness: 0.35,
      }),
    )
    this.ball.castShadow = true
    scene.add(this.ball)

    // Head: a floating dome that always stays upright and turns toward the direction of travel
    const shell = new THREE.MeshStandardMaterial({ color: '#e2e8f0', metalness: 0.35, roughness: 0.3 })
    const dark = new THREE.MeshStandardMaterial({ color: '#0b1226', metalness: 0.6, roughness: 0.25 })
    const neon = new THREE.MeshStandardMaterial({ color: '#22d3ee', emissive: '#22d3ee', emissiveIntensity: 2.5 })
    const pink = new THREE.MeshStandardMaterial({ color: '#f472b6', emissive: '#f472b6', emissiveIntensity: 3 })

    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), shell)
    dome.castShadow = true
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.035, 8, 40), neon)
    collar.rotation.x = Math.PI / 2
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.05, 24), dark)
    lens.rotation.x = Math.PI / 2
    lens.position.set(0, 0.17, 0.33)
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 12), neon)
    eye.position.set(0, 0.17, 0.36)
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.34, 6), dark)
    antenna.position.set(0.15, 0.47, -0.05)
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), pink)
    tip.position.set(0.15, 0.65, -0.05)
    this.head.add(dome, collar, lens, eye, antenna, tip)
    this.head.rotation.order = 'YXZ'
    scene.add(this.head)

    this.light = new THREE.PointLight('#22d3ee', 4, 6, 2)
    scene.add(this.light)

    // Boost sparkle trail
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(this.trailPositions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(this.trailColors, 3))
    this.trail = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.22,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    this.trail.frustumCulled = false
    scene.add(this.trail)

    this.sync(0)
  }

  private updateGrounded() {
    const p = this.body.position
    this.rayFrom.set(p.x, p.y, p.z)
    this.rayTo.set(p.x, p.y - RADIUS - 0.18, p.z)
    this.rayResult.reset()
    this.physics.raycastClosest(
      this.rayFrom,
      this.rayTo,
      { collisionFilterMask: this.body.collisionFilterMask, skipBackfaces: true },
      this.rayResult,
    )
    this.grounded = this.rayResult.hasHit
  }

  /** Apply input before the physics step. */
  control(input: Input, dt: number) {
    this.updateGrounded()
    const move = input.move
    const moving = move.x !== 0 || move.z !== 0
    const boosting = input.boost && moving
    const accel = (this.grounded ? 26 : 9) * (boosting ? 1.7 : 1)
    const v = this.body.velocity

    v.x += move.x * accel * dt
    v.z += move.z * accel * dt

    if (!moving && this.grounded) {
      const brake = 1 - damp(2.2, dt)
      v.x *= brake
      v.z *= brake
    }

    const max = boosting ? 15 : 9.5
    const speed = Math.hypot(v.x, v.z)
    if (speed > max) {
      const k = 1 - damp(6, dt) * (1 - max / speed)
      v.x *= k
      v.z *= k
    }

    // Keep the spin consistent with the travel direction so the ball visibly rolls
    if (this.grounded) {
      const w = this.body.angularVelocity
      const t = damp(10, dt)
      w.x += (v.z / RADIUS - w.x) * t
      w.z += (-v.x / RADIUS - w.z) * t
    }

    if (input.consumeJump() && this.grounded) {
      v.y = 9.2
      this.hop = 1
    }

    if (boosting && this.grounded) {
      this.trailTimer -= dt
      if (this.trailTimer <= 0) {
        this.trailTimer = 0.018
        this.emitSpark()
      }
    }

    const dist = Math.hypot(this.body.position.x, this.body.position.z)
    if (!this.offIsland && dist > ISLAND_RADIUS - 0.15) {
      this.offIsland = true
      this.body.collisionFilterMask = MASK_OFF_ISLAND
    }
  }

  private emitSpark() {
    const i = this.trailCursor
    this.trailCursor = (this.trailCursor + 1) % TRAIL_SIZE
    const p = this.body.position
    this.trailPositions[i * 3] = p.x + (Math.random() - 0.5) * 0.5
    this.trailPositions[i * 3 + 1] = p.y - RADIUS * 0.6 + Math.random() * 0.3
    this.trailPositions[i * 3 + 2] = p.z + (Math.random() - 0.5) * 0.5
    this.trailLife[i] = 0.6
  }

  /** Copy physics state to the visuals after the physics step. */
  sync(dt: number) {
    const p = this.body.position
    const q = this.body.quaternion
    this.position.set(p.x, p.y, p.z)
    this.ball.position.copy(this.position)
    this.ball.quaternion.set(q.x, q.y, q.z, q.w)

    const v = this.body.velocity
    const speed = Math.hypot(v.x, v.z)
    if (speed > 0.6) this.yaw = lerpAngle(this.yaw, Math.atan2(v.x, v.z), damp(8, dt))

    this.hop = Math.max(0, this.hop - dt * 2.5)
    const bob = Math.sin(performance.now() * 0.004) * 0.025 + this.hop * 0.12
    this.head.position.set(p.x, p.y + RADIUS - 0.03 + bob, p.z)
    this.head.rotation.y = this.yaw
    this.head.rotation.x = Math.min(speed * 0.022, 0.28)

    this.light.position.set(p.x, p.y + 0.9, p.z)

    // Fade sparks
    for (let i = 0; i < TRAIL_SIZE; i++) {
      const life = this.trailLife[i] ?? 0
      if (life <= 0) continue
      const next = Math.max(0, life - dt)
      this.trailLife[i] = next
      this.trailPositions[i * 3 + 1] = (this.trailPositions[i * 3 + 1] ?? 0) + dt * 0.6
      const k = next / 0.6
      this.trailColors[i * 3] = 0.13 * k
      this.trailColors[i * 3 + 1] = 0.83 * k
      this.trailColors[i * 3 + 2] = 0.93 * k
    }
    const geo = this.trail.geometry
    ;(geo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
    ;(geo.getAttribute('color') as THREE.BufferAttribute).needsUpdate = true
  }

  respawn() {
    this.body.position.set(SPAWN.x, SPAWN.y + 1.5, SPAWN.z)
    this.body.velocity.setZero()
    this.body.angularVelocity.setZero()
    this.body.quaternion.set(0, 0, 0, 1)
    this.body.collisionFilterMask = MASK_ON_ISLAND
    this.offIsland = false
    this.yaw = 0
  }

  get fellOff(): boolean {
    return this.body.position.y < -18
  }
}
