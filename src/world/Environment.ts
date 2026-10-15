import * as THREE from 'three'
import type * as CANNON from 'cannon-es'
import { ISLAND_RADIUS, ZONES, isReserved } from './layout'
import { addStaticCylinder, addStaticSphere } from './bodies'
import { makeCanvasTexture, mulberry32 } from './utils'

const FIREFLY_COUNT = 140
const hdr = (hex: string, k: number) => new THREE.Color(hex).multiplyScalar(k)

/** Jitter vertices of a geometry, giving identical offsets to vertices that share a position (no seams). */
function roughen(geo: THREE.BufferGeometry, rng: () => number, amount: THREE.Vector3, keep: (v: THREE.Vector3) => boolean) {
  const pos = geo.getAttribute('position') as THREE.BufferAttribute
  const offsets = new Map<string, THREE.Vector3>()
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    if (keep(v)) continue
    const key = `${v.x.toFixed(3)}|${v.y.toFixed(3)}|${v.z.toFixed(3)}`
    let o = offsets.get(key)
    if (!o) {
      o = new THREE.Vector3((rng() - 0.5) * amount.x, (rng() - 0.5) * amount.y, (rng() - 0.5) * amount.z)
      offsets.set(key, o)
    }
    pos.setXYZ(i, v.x + o.x, v.y + o.y, v.z + o.z)
  }
  geo.computeVertexNormals()
}

/** Sky, lights, the island itself, and all decoration that is not a portfolio landmark. */
export class Environment {
  private stars!: THREE.Points
  private fireflies!: THREE.Points
  private fireflyBase = new Float32Array(FIREFLY_COUNT * 3)
  private fireflyPhase = new Float32Array(FIREFLY_COUNT)
  private islets: { obj: THREE.Object3D; baseY: number; phase: number }[] = []
  private crystalMats: THREE.MeshStandardMaterial[] = []

  constructor(scene: THREE.Scene, physics: CANNON.World, anisotropy: number, highQuality: boolean) {
    const rng = mulberry32(20260)
    scene.background = new THREE.Color('#050813')
    scene.fog = new THREE.Fog('#0b1026', 55, 160)

    this.crystalMats = ['#a855f7', '#22d3ee', '#60a5fa', '#f472b6'].map(
      (c) =>
        new THREE.MeshStandardMaterial({
          color: c,
          emissive: c,
          emissiveIntensity: 0.9,
          roughness: 0.25,
          metalness: 0.1,
          flatShading: true,
        }),
    )

    this.addSky(scene, rng)
    this.addLights(scene, highQuality)
    this.addIsland(scene, rng, anisotropy)
    this.addPaths(scene)
    this.addDecor(scene, physics, rng)
    this.addIslets(scene, rng)
    this.addFireflies(scene, rng)
  }

  private addSky(scene: THREE.Scene, rng: () => number) {
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(240, 32, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          top: { value: new THREE.Color('#2e2a7a') },
          mid: { value: new THREE.Color('#0b1026') },
          bottom: { value: new THREE.Color('#02040d') },
        },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 top;
          uniform vec3 mid;
          uniform vec3 bottom;
          varying vec3 vDir;
          void main() {
            float h = vDir.y;
            vec3 c = h > 0.0 ? mix(mid, top, pow(h, 0.55)) : mix(mid, bottom, pow(-h, 0.45));
            gl_FragColor = vec4(c, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`,
      }),
    )
    scene.add(sky)

    // Moon + halo
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(5, 32, 16),
      new THREE.MeshBasicMaterial({ color: hdr('#e0e7ff', 1.6), fog: false }),
    )
    moon.position.set(-70, 78, -150)
    scene.add(moon)
    const haloTex = makeCanvasTexture(256, 256, (ctx) => {
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
      g.addColorStop(0, 'rgba(199,210,254,0.55)')
      g.addColorStop(0.35, 'rgba(129,140,248,0.18)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 256, 256)
    })
    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }),
    )
    halo.scale.setScalar(60)
    halo.position.copy(moon.position)
    scene.add(halo)

    // Stars on the upper hemisphere
    const count = 1400
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = rng() * Math.PI * 2
      const phi = Math.acos(rng() * 0.95)
      const r = 180 + rng() * 25
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r
      positions[i * 3 + 1] = Math.cos(phi) * r - 10
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.stars = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: '#ffffff', size: 1.2, transparent: true, opacity: 0.85, depthWrite: false, fog: false }),
    )
    scene.add(this.stars)

    // Faint glow far below the island for depth
    const abyssTex = makeCanvasTexture(256, 256, (ctx) => {
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
      g.addColorStop(0, 'rgba(79,70,229,0.45)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 256, 256)
    })
    const abyss = new THREE.Mesh(
      new THREE.PlaneGeometry(320, 320),
      new THREE.MeshBasicMaterial({ map: abyssTex, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }),
    )
    abyss.rotation.x = -Math.PI / 2
    abyss.position.y = -55
    scene.add(abyss)
  }

  private addLights(scene: THREE.Scene, highQuality: boolean) {
    scene.add(new THREE.HemisphereLight('#a5b4fc', '#0f172a', 1.15))

    const moonLight = new THREE.DirectionalLight('#c7d2fe', 2.4)
    moonLight.position.set(-22, 38, 16)
    moonLight.castShadow = true
    const size = highQuality ? 2048 : 1024
    moonLight.shadow.mapSize.set(size, size)
    const cam = moonLight.shadow.camera
    cam.left = -42
    cam.right = 42
    cam.top = 42
    cam.bottom = -42
    cam.near = 1
    cam.far = 110
    moonLight.shadow.bias = -0.0004
    moonLight.shadow.normalBias = 0.03
    scene.add(moonLight)

    const backLight = new THREE.DirectionalLight('#f0abfc', 0.7)
    backLight.position.set(25, 12, -30)
    scene.add(backLight)
  }

  private addIsland(scene: THREE.Scene, rng: () => number, anisotropy: number) {
    const repeat = 18
    const gridMap = makeCanvasTexture(256, 256, (ctx) => {
      ctx.fillStyle = '#121a38'
      ctx.fillRect(0, 0, 256, 256)
      ctx.strokeStyle = '#26406c'
      ctx.lineWidth = 3
      ctx.strokeRect(0, 0, 256, 256)
    }, anisotropy)
    const gridGlow = makeCanvasTexture(256, 256, (ctx) => {
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, 256, 256)
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.strokeRect(0, 0, 256, 256)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(124, 124, 8, 8)
    }, anisotropy)
    for (const t of [gridMap, gridGlow]) {
      t.wrapS = THREE.RepeatWrapping
      t.wrapT = THREE.RepeatWrapping
      t.repeat.set(repeat, repeat)
    }

    const top = new THREE.Mesh(
      new THREE.CircleGeometry(ISLAND_RADIUS, 128),
      new THREE.MeshStandardMaterial({
        map: gridMap,
        emissiveMap: gridGlow,
        emissive: '#38bdf8',
        emissiveIntensity: 0.5,
        roughness: 0.85,
        metalness: 0.1,
      }),
    )
    top.rotation.x = -Math.PI / 2
    top.receiveShadow = true
    scene.add(top)

    // Soft glow pooled around the spawn point
    const glowTex = makeCanvasTexture(256, 256, (ctx) => {
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
      g.addColorStop(0, 'rgba(56,189,248,0.22)')
      g.addColorStop(1, 'rgba(56,189,248,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 256, 256)
    })
    const pool = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    )
    pool.rotation.x = -Math.PI / 2
    pool.position.set(0, 0.012, 2)
    scene.add(pool)

    const rockMat = new THREE.MeshStandardMaterial({ color: '#1a1f3d', roughness: 0.95, flatShading: true })

    // Cliff band under the rim (top ring stays exact so it meets the grid disc)
    const sideGeo = new THREE.CylinderGeometry(ISLAND_RADIUS, ISLAND_RADIUS - 4.5, 3.2, 72, 2, true)
    roughen(sideGeo, rng, new THREE.Vector3(1.4, 0, 1.4), (v) => v.y > 1.59)
    const side = new THREE.Mesh(sideGeo, rockMat)
    side.position.y = -1.6
    scene.add(side)

    // Inverted rocky cone beneath (its base ring ends up on top after flipping, so keep that exact)
    const coneGeo = new THREE.ConeGeometry(ISLAND_RADIUS - 4.5, 20, 30, 5)
    roughen(coneGeo, rng, new THREE.Vector3(2.6, 1.6, 2.6), (v) => v.y < -9.99)
    const cone = new THREE.Mesh(coneGeo, rockMat)
    cone.rotation.x = Math.PI
    cone.position.y = -3.2 - 10
    scene.add(cone)

    // Neon rim
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(ISLAND_RADIUS, 0.07, 8, 200),
      new THREE.MeshBasicMaterial({ color: hdr('#38bdf8', 2.2) }),
    )
    rim.rotation.x = Math.PI / 2
    rim.position.y = 0.02
    scene.add(rim)
  }

  /** Dotted breadcrumbs from the centre toward each area. */
  private addPaths(scene: THREE.Scene) {
    const targets: { x: number; z: number; stop: number }[] = [
      { x: -17, z: 0, stop: 4.5 },
      { x: 17, z: -3, stop: 6.3 },
      { x: 0, z: -18, stop: 3.5 },
      { x: 15, z: 15, stop: 4.8 },
      { x: -15, z: 18, stop: 4.8 },
      { x: 0, z: 21, stop: 1 },
    ]
    const points: THREE.Vector2[] = []
    for (const t of targets) {
      const len = Math.hypot(t.x, t.z)
      for (let d = 5.5; d < len - t.stop; d += 1.5) {
        points.push(new THREE.Vector2((t.x / len) * d, (t.z / len) * d))
      }
    }
    const dots = new THREE.InstancedMesh(
      new THREE.CircleGeometry(0.11, 10),
      new THREE.MeshBasicMaterial({ color: hdr('#38bdf8', 1.6), transparent: true, opacity: 0.7, depthWrite: false }),
      points.length,
    )
    const m = new THREE.Matrix4()
    const rot = new THREE.Matrix4().makeRotationX(-Math.PI / 2)
    points.forEach((p, i) => {
      m.makeTranslation(p.x, 0.015, p.y).multiply(rot)
      dots.setMatrixAt(i, m)
    })
    scene.add(dots)
  }

  private addDecor(scene: THREE.Scene, physics: CANNON.World, rng: () => number) {
    const crystalGeo = new THREE.OctahedronGeometry(0.42, 0)
    const baseGeo = new THREE.DodecahedronGeometry(0.85, 0)
    const rockGeo = new THREE.DodecahedronGeometry(1, 0)
    const rockMat = new THREE.MeshStandardMaterial({ color: '#232a52', roughness: 0.9, flatShading: true })

    const placed: [number, number][] = []
    const scatter = (minR: number, maxR: number, count: number, gap: number, build: (x: number, z: number) => void) => {
      let n = 0
      for (let attempt = 0; n < count && attempt < count * 60; attempt++) {
        const a = rng() * Math.PI * 2
        const r = minR + rng() * (maxR - minR)
        const x = Math.cos(a) * r
        const z = Math.sin(a) * r
        if (isReserved(x, z, 2.2)) continue
        if (placed.some(([px, pz]) => Math.hypot(px - x, pz - z) < gap)) continue
        placed.push([x, z])
        build(x, z)
        n++
      }
    }

    const crystalCluster = (x: number, z: number) => {
      const group = new THREE.Group()
      group.position.set(x, 0, z)
      group.rotation.y = rng() * Math.PI * 2
      const base = new THREE.Mesh(baseGeo, rockMat)
      base.scale.set(1, 0.45, 1)
      base.position.y = 0.15
      base.castShadow = true
      base.receiveShadow = true
      group.add(base)
      const mat = this.crystalMats[Math.floor(rng() * this.crystalMats.length)] ?? this.crystalMats[0]
      const n = 2 + Math.floor(rng() * 3)
      for (let i = 0; i < n; i++) {
        const h = 1.6 + rng() * 2.6
        const c = new THREE.Mesh(crystalGeo, mat)
        c.scale.set(1, h, 1)
        c.position.set((rng() - 0.5) * 0.7, 0.42 * h * 0.75, (rng() - 0.5) * 0.7)
        c.rotation.set((rng() - 0.5) * 0.6, rng() * Math.PI, (rng() - 0.5) * 0.6)
        c.castShadow = true
        group.add(c)
      }
      scene.add(group)
      addStaticCylinder(physics, x, 1.5, z, 0.85, 3, 8)
    }

    const rock = (x: number, z: number) => {
      const s = 0.5 + rng() * 1.1
      const mesh = new THREE.Mesh(rockGeo, rockMat)
      mesh.scale.set(s, s * 0.7, s * 0.9)
      mesh.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI)
      mesh.position.set(x, s * 0.25, z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      scene.add(mesh)
      addStaticSphere(physics, x, s * 0.25, z, s * 0.8)
    }

    scatter(25, 34, 26, 3.6, crystalCluster)
    scatter(11, 24, 8, 4, crystalCluster)
    scatter(13, 34.5, 18, 2.6, rock)

    // A few crystals around zone edges so areas feel framed
    for (const zone of ZONES) {
      if (zone.id.startsWith('project') || zone.id === 'about') continue
      const a = Math.atan2(zone.z, zone.x)
      const x = zone.x + Math.cos(a) * (zone.radius + 2.2)
      const z = zone.z + Math.sin(a) * (zone.radius + 2.2)
      if (Math.hypot(x, z) < ISLAND_RADIUS - 2 && !placed.some(([px, pz]) => Math.hypot(px - x, pz - z) < 3)) {
        placed.push([x, z])
        crystalCluster(x, z)
      }
    }
  }

  private addIslets(scene: THREE.Scene, rng: () => number) {
    const topMat = new THREE.MeshStandardMaterial({ color: '#18213f', roughness: 0.9, flatShading: true })
    const crystalGeo = new THREE.OctahedronGeometry(0.42, 0)
    const total = 7
    for (let i = 0; i < total; i++) {
      const r = 3 + rng() * 4
      const a = (i / total) * Math.PI * 2 + rng() * 0.5
      const dist = 62 + rng() * 30
      const group = new THREE.Group()
      const top = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.9, 0.8, 10), topMat)
      const under = new THREE.Mesh(new THREE.ConeGeometry(r * 0.9, r * 1.7, 9), topMat)
      under.rotation.x = Math.PI
      under.position.y = -0.4 - r * 0.85
      group.add(top, under)
      const mat = this.crystalMats[i % this.crystalMats.length] ?? this.crystalMats[0]
      for (let j = 0; j < 2; j++) {
        const h = 2 + rng() * 3
        const c = new THREE.Mesh(crystalGeo, mat)
        c.scale.set(1.4, h, 1.4)
        c.position.set((rng() - 0.5) * r, 0.4 + 0.42 * h * 0.7, (rng() - 0.5) * r)
        group.add(c)
      }
      const baseY = -14 + rng() * 24
      group.position.set(Math.cos(a) * dist, baseY, Math.sin(a) * dist)
      scene.add(group)
      this.islets.push({ obj: group, baseY, phase: rng() * Math.PI * 2 })
    }
  }

  private addFireflies(scene: THREE.Scene, rng: () => number) {
    const positions = new Float32Array(FIREFLY_COUNT * 3)
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const a = rng() * Math.PI * 2
      const r = Math.sqrt(rng()) * (ISLAND_RADIUS - 2)
      this.fireflyBase[i * 3] = Math.cos(a) * r
      this.fireflyBase[i * 3 + 1] = 0.5 + rng() * 5
      this.fireflyBase[i * 3 + 2] = Math.sin(a) * r
      this.fireflyPhase[i] = rng() * Math.PI * 2
    }
    positions.set(this.fireflyBase)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.fireflies = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: hdr('#67e8f9', 2),
        size: 0.16,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    )
    this.fireflies.frustumCulled = false
    scene.add(this.fireflies)
  }

  update(t: number) {
    const attr = this.fireflies.geometry.getAttribute('position') as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const ph = this.fireflyPhase[i] ?? 0
      arr[i * 3] = (this.fireflyBase[i * 3] ?? 0) + Math.sin(t * 0.6 + ph) * 0.7
      arr[i * 3 + 1] = (this.fireflyBase[i * 3 + 1] ?? 0) + Math.sin(t * 0.9 + ph * 1.3) * 0.45
      arr[i * 3 + 2] = (this.fireflyBase[i * 3 + 2] ?? 0) + Math.cos(t * 0.5 + ph) * 0.7
    }
    attr.needsUpdate = true

    for (const islet of this.islets) {
      islet.obj.position.y = islet.baseY + Math.sin(t * 0.4 + islet.phase) * 1.2
      islet.obj.rotation.y += 0.0008
    }

    this.stars.rotation.y = t * 0.004
    this.crystalMats.forEach((m, i) => {
      m.emissiveIntensity = 0.85 + Math.sin(t * 1.4 + i * 1.7) * 0.3
    })
  }
}
