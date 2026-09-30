import { beforeAll, describe, expect, it } from 'vitest'
import { levels } from '../src/levels/levels'
import { PHYSICS } from '../src/physics/config'
import { createSimulation, initPhysics } from './simulation'
import { solutions } from './solutions'

beforeAll(initPhysics)
describe('the playable physics prototype', () => {
  it('preserves momentum at the moment gravity changes', () => {
    const sim = createSimulation({ ...levels[0], spawn: [0, 2] })
    sim.step(30)
    const before = sim.player.linvel()
    sim.rotate()
    expect(sim.player.linvel()).toEqual(before)
    sim.step(1)
    expect(sim.player.linvel().x).toBeLessThan(before.x)
    expect(sim.player.linvel().y).toBeLessThan(-2)
    sim.world.free()
  })
  it('collides with the floor and stays in the XY plane', () => {
    const sim = createSimulation({ ...levels[0], spawn: [0, 2] })
    sim.player.applyImpulse({ x: 0, y: 0, z: 40 }, true)
    sim.player.applyTorqueImpulse({ x: 5, y: 5, z: 2 }, true)
    sim.step(600)
    expect(sim.player.translation().y).toBeCloseTo(-4 + PHYSICS.radius, 1)
    expect(sim.player.translation().z).toBe(0)
    expect(sim.player.angvel().x).toBe(0)
    expect(sim.player.angvel().y).toBe(0)
    sim.world.free()
  })
  it('keeps high-speed collisions inside the enclosure', () => {
    const sim = createSimulation({ ...levels[0], spawn: [0, 0] })
    sim.player.setLinvel({ x: 80, y: 50, z: 0 }, true)
    for (let i = 0; i < 8; i++) {
      sim.rotate()
      sim.step(100)
      const position = sim.player.translation()
      expect(Math.abs(position.x)).toBeLessThan(7.41)
      expect(Math.abs(position.y)).toBeLessThan(4.01)
    }
    sim.world.free()
  })
  it('uses an angled collider to redirect the falling ball along a ramp', () => {
    const sim = createSimulation({ ...levels[0], spawn: [0, 3], obstacles: [{ position: [0, 0], size: [6, 0.5], angle: Math.PI / 6 }] })
    sim.step(160)
    expect(sim.player.translation().x).toBeLessThan(-1)
    expect(sim.player.translation().z).toBe(0)
    sim.world.free()
  })
  it('gives mint spring bumpers a stronger rebound than round pillars', () => {
    const bounceSpeed = (spring: boolean) => {
      const sim = createSimulation({ ...levels[0], spawn: [0, 3.3], bumpers: [{ position: [0, -1], radius: 1, spring }] })
      let upward = 0
      for (let frame = 0; frame < 180; frame++) {
        sim.step(1)
        upward = Math.max(upward, sim.player.linvel().y)
      }
      sim.world.free()
      return upward
    }
    const normal = bounceSpeed(false)
    const spring = bounceSpeed(true)
    expect(spring).toBeGreaterThan(4)
    expect(spring).toBeGreaterThan(normal * 3)
  })
})

describe('handcrafted levels', () => {
  it('includes twenty distinct, sequentially numbered levels and twenty solutions', () => {
    expect(levels.map(level => level.id)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1))
    expect(new Set(levels.map(level => level.name)).size).toBe(20)
    expect(solutions).toHaveLength(20)
  })
  it.each(levels.map((level, i) => ({ level, route: solutions[i] })))('$level.name is completable using only clockwise gravity rotations', ({ level, route }) => {
    const sim = createSimulation(level)
    for (const frames of route) {
      expect(frames * PHYSICS.timeStep * 1000).toBeGreaterThanOrEqual(PHYSICS.inputCooldown)
      sim.rotate()
      sim.step(frames)
    }
    expect(sim.getResult()).toBe('won')
    expect(sim.player.translation().z).toBe(0)
    sim.world.free()
  })
  it('detects the gap hazard with a sensor', () => {
    const sim = createSimulation({ ...levels[2], spawn: [0, 0] })
    sim.step(240)
    expect(sim.getResult()).toBe('failed')
    sim.world.free()
  })
  it('starts every level safely and without moving into a hazard', () => {
    for (const level of levels) {
      const sim = createSimulation(level)
      sim.step(600)
      expect(sim.getResult()).toBe('playing')
      sim.world.free()
    }
  })
})
