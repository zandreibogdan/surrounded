// Tune the verified input timings away from collision boundaries. This is
// development tooling, not an autoplay feature or part of the shipped game.
import { levels } from '../src/levels/levels.ts'
import { solutions } from '../tests/solutions.ts'
import { createSimulation, initPhysics } from '../tests/simulation.ts'

await initPhysics()
let seed = 947
const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
const requested = process.argv.slice(2).map(Number)
for (const level of levels.filter(level => level.id > 5 && (!requested.length || requested.includes(level.id)))) {
  const initial = [...solutions[level.id - 1]]
  initial[initial.length - 1] += 240
  const variations = Array.from({ length: 24 }, () => initial.map(() => Math.round(random() * 12) - 6))
  function succeeds(route: number[], variation: number[] = []) {
    const sim = createSimulation(level)
    for (let i = 0; i < route.length; i++) {
      sim.rotate()
      sim.step(Math.max(18, route[i] + (variation[i] ?? 0)))
    }
    const result = sim.getResult() === 'won'
    sim.world.free()
    return result
  }
  const score = (route: number[]) => succeeds(route) ? variations.filter(v => succeeds(route, v)).length : -1
  let best = initial
  let bestScore = score(best)
  for (let attempt = 0; attempt < 320 && bestScore < 23; attempt++) {
    const candidate = [...best]
    const changes = random() < 0.3 ? 2 : 1
    for (let change = 0; change < changes; change++) {
      const index = Math.floor(random() * (candidate.length - 1))
      const offset = [2, 4, 8, 16, 32][Math.floor(random() * 5)] * (random() < 0.5 ? -1 : 1)
      candidate[index] = Math.max(24, candidate[index] + offset)
    }
    const candidateScore = score(candidate)
    if (candidateScore > bestScore || (candidateScore === bestScore && random() < 0.15)) {
      best = candidate
      bestScore = candidateScore
    }
  }
  console.log(level.id, bestScore + '/24', JSON.stringify(best))
}
