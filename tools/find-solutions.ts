import RAPIER from '@dimforge/rapier3d-compat'
import { levels } from '../src/levels/levels.ts'
import { GRAVITY, limitVelocity, nextGravity, type GravityDirection } from '../src/physics/config.ts'
import { createSimulation, initPhysics } from '../tests/simulation.ts'
import { routeWaypoints } from './route-waypoints.ts'

await initPhysics()
const waits = [24, 36, 48, 60, 90, 120, 180, 240, 360]
const robust = process.argv.includes('--robust')
const requested = process.argv.slice(2).filter(arg => arg !== '--robust').map(Number)
for (const level of levels.filter(level => !requested.length || requested.includes(level.id))) {
  const base = createSimulation(level)
  const playerHandle = base.player.handle
  const ballHandle = base.ball.handle
  const waypoints = [...(routeWaypoints[level.id] ?? []), level.exit]
  type Node = { snapshot: Uint8Array; path: number[]; direction: GravityDirection; waypoint: number; score: number }
  let beam: Node[] = [{ snapshot: base.world.takeSnapshot(), path: [], direction: level.initialGravity, waypoint: 0, score: 0 }]
  base.world.free()
  let solution: number[] | undefined
  let bestScore = -1
  let done = false
  const found = new Set<string>()
  function scoreRoute(route: number[]) {
    let won = 0
    for (let trial = 0; trial < 12; trial++) {
      const replay = createSimulation(level)
      for (let i = 0; i < route.length; i++) {
        replay.rotate()
        const offset = trial === 0 || i === route.length - 1 ? 0 : Math.round(Math.sin((trial + 1) * (i + 3) * 137.7) * 6)
        replay.step(Math.max(18, route[i] + offset))
      }
      if (replay.getResult() === 'won') won++
      replay.world.free()
    }
    return won
  }
  for (let depth = 0; depth < 36 && !done; depth++) {
    const candidates: Node[] = []
    const seen = new Set<string>()
    for (const node of beam) {
      for (const wait of waits) {
        // A settled start is easier for a person to reproduce. Keep the full
        // search when a coral left wall makes that approach unsuitable.
        if (robust && !node.path.length && !level.hazards.some(h => h.position[0] < -6) && wait !== 180) continue
        const world = RAPIER.World.restoreSnapshot(node.snapshot)
        const player = world.getRigidBody(playerHandle)
        const ball = world.getCollider(ballHandle)
        const sensors: RAPIER.Collider[] = []
        world.forEachCollider(c => { if (c.isSensor()) sensors.push(c) })
        const exit = sensors.pop()!
        const direction = nextGravity(node.direction)
        const [x, y, z] = GRAVITY[direction].vector
        world.gravity = { x, y, z }
        let failed = false
        let won = false
        let waypoint = node.waypoint
        for (let frame = 0; frame < wait; frame++) {
          const v = limitVelocity(player.linvel())
          if (v) player.setLinvel(v, true)
          world.step()
          if (sensors.some(s => world.intersectionPair(ball, s))) { failed = true; break }
          if (world.intersectionPair(ball, exit)) {
            won = true
            const route = [...node.path, frame + 1 + (robust ? 240 : 0)]
            const key = route.join(',')
            if (!found.has(key)) {
              found.add(key)
              const score = robust ? scoreRoute(route) : 12
              if (score > bestScore) { solution = route; bestScore = score }
              if (score >= 11 || found.size >= 100) done = true
            }
            break
          }
          const p = player.translation()
          if (waypoint < waypoints.length - 1 && Math.hypot(p.x - waypoints[waypoint][0], p.y - waypoints[waypoint][1]) < 1.5) waypoint++
        }
        if (done) { world.free(); break }
        if (!failed && !won) {
          const p = player.translation(), v = player.linvel()
          const key = [direction, waypoint, Math.round(p.x * 3), Math.round(p.y * 3), Math.round(v.x), Math.round(v.y)].join(',')
          if (!seen.has(key)) {
            seen.add(key)
            const target = waypoints[waypoint]
            const score = waypoint * 25 - Math.hypot(p.x - target[0], p.y - target[1])
            candidates.push({ snapshot: world.takeSnapshot(), path: [...node.path, wait], direction, waypoint, score })
          }
        }
        world.free()
      }
      if (done) break
    }
    beam = candidates.sort((a, b) => b.score - a.score).slice(0, 140)
    if (!beam.length) break
  }
  if (solution) {
    const replay = createSimulation(level)
    for (const frames of solution) { replay.rotate(); replay.step(frames) }
    if (replay.getResult() !== 'won') throw new Error(`Invalid route: ${level.name}`)
    replay.world.free()
  }
  console.log(level.id, level.name, solution ? JSON.stringify(solution) : 'NO SOLUTION', robust ? `${bestScore}/12 timing variations` : '')
}
