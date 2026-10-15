import * as CANNON from 'cannon-es'
import { GROUP } from './layout'

export function addStaticBox(
  physics: CANNON.World,
  x: number, y: number, z: number,
  hx: number, hy: number, hz: number,
  euler?: [number, number, number],
) {
  const body = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Box(new CANNON.Vec3(hx, hy, hz)),
    position: new CANNON.Vec3(x, y, z),
    collisionFilterGroup: GROUP.STATIC,
  })
  if (euler) body.quaternion.setFromEuler(euler[0], euler[1], euler[2])
  physics.addBody(body)
  return body
}

export function addStaticCylinder(
  physics: CANNON.World,
  x: number, y: number, z: number,
  radius: number, height: number, segments = 10,
) {
  const body = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Cylinder(radius, radius, height, segments),
    position: new CANNON.Vec3(x, y, z),
    collisionFilterGroup: GROUP.STATIC,
  })
  physics.addBody(body)
  return body
}

export function addStaticSphere(physics: CANNON.World, x: number, y: number, z: number, radius: number) {
  const body = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Sphere(radius),
    position: new CANNON.Vec3(x, y, z),
    collisionFilterGroup: GROUP.STATIC,
  })
  physics.addBody(body)
  return body
}
