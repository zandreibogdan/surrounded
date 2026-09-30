import { levels } from '../src/levels/levels.ts'
import { solutions } from '../tests/solutions.ts'
import { createSimulation, initPhysics } from '../tests/simulation.ts'

await initPhysics()
let seed = 1749
const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
for (const level of levels.slice(5)) {
  let won = 0
  for (let trial = 0; trial < 60; trial++) {
    const sim = createSimulation(level)
    const route = solutions[level.id - 1]
    for (let i = 0; i < route.length; i++) {
      sim.rotate()
      sim.step(i === route.length - 1 ? route[i] + 240 : Math.max(18, route[i] + Math.round(random() * 12) - 6))
    }
    if (sim.getResult() === 'won') won++
    sim.world.free()
  }
  console.log(`${level.id} ${level.name}: ${won}/60 with ±50ms variation at each turn`)
}
