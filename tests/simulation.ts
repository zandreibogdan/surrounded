import RAPIER from '@dimforge/rapier3d-compat'
import type { Level } from '../src/levels/levelTypes.ts'
import { GRAVITY, PHYSICS, limitVelocity, nextGravity } from '../src/physics/config.ts'

export async function initPhysics() { await RAPIER.init() }

/** Runs the same shapes, materials, plane constraints and timestep as the game. */
export function createSimulation(level: Level) {
  const initialGravity = GRAVITY[level.initialGravity].vector
  const world = new RAPIER.World({ x: initialGravity[0], y: initialGravity[1], z: 0 })
  world.timestep = PHYSICS.timeStep
  const rotation = (angle = 0) => ({ x: 0, y: 0, z: Math.sin(angle / 2), w: Math.cos(angle / 2) })
  for (const block of [...level.platforms, ...level.obstacles]) {
    world.createCollider(RAPIER.ColliderDesc.cuboid(block.size[0] / 2, block.size[1] / 2, PHYSICS.depth / 2)
      .setTranslation(...block.position, 0).setRotation(rotation(block.angle)).setFriction(PHYSICS.friction).setRestitution(PHYSICS.restitution))
  }
  for (const bumper of level.bumpers ?? []) {
    world.createCollider(RAPIER.ColliderDesc.ball(bumper.radius).setTranslation(...bumper.position, 0)
      .setFriction(bumper.spring ? PHYSICS.springFriction : PHYSICS.friction)
      .setRestitution(bumper.spring ? PHYSICS.springRestitution : PHYSICS.restitution)
      .setRestitutionCombineRule(bumper.spring ? RAPIER.CoefficientCombineRule.Max : RAPIER.CoefficientCombineRule.Average))
  }
  const hazards = level.hazards.map(block => world.createCollider(
    RAPIER.ColliderDesc.cuboid(block.size[0] / 2, block.size[1] / 2, 0.6).setTranslation(...block.position, 0).setRotation(rotation(block.angle)).setSensor(true)))
  const exit = world.createCollider(RAPIER.ColliderDesc.ball(PHYSICS.exitRadius).setTranslation(...level.exit, 0).setSensor(true))
  const player = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(...level.spawn, 0)
    .setCcdEnabled(true).setCanSleep(false).setLinearDamping(PHYSICS.linearDamping).setAngularDamping(PHYSICS.angularDamping))
  player.setEnabledTranslations(true, true, false, true)
  player.setEnabledRotations(false, false, true, true)
  const ball = world.createCollider(RAPIER.ColliderDesc.ball(PHYSICS.radius).setMass(PHYSICS.mass)
    .setFriction(PHYSICS.friction).setRestitution(PHYSICS.restitution), player)
  let direction = level.initialGravity
  let result: 'playing' | 'won' | 'failed' = 'playing'
  function step(frames: number) {
    for (let i = 0; i < frames && result === 'playing'; i++) {
      const velocity = limitVelocity(player.linvel())
      if (velocity) player.setLinvel(velocity, true)
      world.step()
      if (hazards.some(hazard => world.intersectionPair(ball, hazard))) result = 'failed'
      else if (world.intersectionPair(ball, exit)) result = 'won'
    }
    return result
  }
  function rotate() {
    direction = nextGravity(direction)
    const [x, y, z] = GRAVITY[direction].vector
    world.gravity = { x, y, z }
  }
  return { world, player, ball, step, rotate, getResult: () => result, getDirection: () => direction }
}
