import { beforeEach, describe, expect, it } from 'vitest'
import { useGameStore } from '../src/store/gameStore'
import { levels } from '../src/levels/levels'

beforeEach(() => { useGameStore.getState().restartGame(); useGameStore.setState({ physicsReady: true }) })
describe('gravity input and state', () => {
  it('ignores inputs until the physics engine has loaded', () => {
    useGameStore.setState({ physicsReady: false })
    expect(useGameStore.getState().rotate(0)).toBe(false)
  })
  it('cycles Down → Left → Up → Right → Down with one rotation per accepted press', () => {
    const directions = [1, 2, 3, 0]
    directions.forEach((direction, i) => {
      expect(useGameStore.getState().rotate(i * 200)).toBe(true)
      expect(useGameStore.getState().gravity).toBe(direction)
    })
    expect(useGameStore.getState().rotations).toBe(4)
  })
  it('rejects rapid duplicate inputs but accepts an input at the cooldown boundary', () => {
    useGameStore.getState().rotate(0)
    expect(useGameStore.getState().rotate(149)).toBe(false)
    expect(useGameStore.getState().rotate(150)).toBe(true)
    expect(useGameStore.getState().rotations).toBe(2)
  })
  it.each(['paused', 'transitioning', 'completed'] as const)('ignores gameplay input while %s', status => {
    useGameStore.setState({ status })
    expect(useGameStore.getState().rotate(1000)).toBe(false)
    expect(useGameStore.getState().rotations).toBe(0)
  })
  it('restarts the attempt while keeping all rotations in the run total', () => {
    useGameStore.getState().rotate(0)
    const previousRun = useGameStore.getState().runId
    useGameStore.getState().restart(true)
    expect(useGameStore.getState()).toMatchObject({ gravity: 0, rotations: 0, totalRotations: 1, deaths: 1, status: 'ready', runId: previousRun + 1 })
  })
  it('completes all twenty levels with an accurate total', () => {
    levels.forEach((_, i) => {
      expect(useGameStore.getState().levelIndex).toBe(i)
      useGameStore.getState().rotate(0)
      useGameStore.getState().rotate(200)
      useGameStore.getState().finishLevel()
      useGameStore.getState().finishLevel()
      expect(useGameStore.getState().status).toBe('transitioning')
      useGameStore.getState().nextLevel()
    })
    expect(useGameStore.getState()).toMatchObject({ status: 'completed', totalRotations: levels.length * 2, solved: levels.map((_, i) => i) })
    useGameStore.getState().restartGame()
    expect(useGameStore.getState()).toMatchObject({ status: 'ready', levelIndex: 0, totalRotations: 0, solved: [] })
  })
  it('allows any level from the beginning and prevents invalid selection', () => {
    useGameStore.getState().selectLevel(19)
    expect(useGameStore.getState().levelIndex).toBe(19)
    for (const index of [-1, levels.length, NaN, 0.5]) useGameStore.getState().selectLevel(index)
    expect(useGameStore.getState().levelIndex).toBe(19)
    useGameStore.getState().selectLevel(0)
    expect(useGameStore.getState().levelIndex).toBe(0)
  })
  it('continues to the first unsolved level after completing level twenty first', () => {
    useGameStore.getState().selectLevel(19)
    useGameStore.getState().rotate(0); useGameStore.getState().finishLevel(); useGameStore.getState().nextLevel()
    expect(useGameStore.getState()).toMatchObject({ levelIndex: 0, solved: [19], status: 'ready' })
  })
  it('counts replays once and completes the journey in any order', () => {
    const order = [19, 19, ...levels.slice(0, -1).map((_, i) => i).reverse()]
    for (const index of order) {
      useGameStore.getState().selectLevel(index)
      useGameStore.getState().rotate(0)
      useGameStore.getState().finishLevel()
      useGameStore.getState().nextLevel()
    }
    expect(useGameStore.getState().status).toBe('completed')
    expect(useGameStore.getState().solved).toHaveLength(levels.length)
  })
  it('resets momentum and UI state when selecting a different level', () => {
    useGameStore.getState().rotate(0)
    useGameStore.setState({ hintOpen: true, helpOpen: true, status: 'paused' })
    const oldRun = useGameStore.getState().runId
    useGameStore.getState().selectLevel(16)
    expect(useGameStore.getState()).toMatchObject({ levelIndex: 16, gravity: 0, rotations: 0, runId: oldRun + 1, hintOpen: false, helpOpen: false, status: 'ready' })
  })
})
