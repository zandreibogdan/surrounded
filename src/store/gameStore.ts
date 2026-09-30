import { create } from 'zustand'
import { levels } from '../levels/levels'
import { nextGravity, PHYSICS, type GravityDirection } from '../physics/config'

export type GameStatus = 'ready' | 'playing' | 'paused' | 'transitioning' | 'completed'
interface GameState {
  physicsReady: boolean
  levelIndex: number
  gravity: GravityDirection
  rotations: number
  totalRotations: number
  status: GameStatus
  runId: number
  deaths: number
  lastRotation: number
  cooldown: number
  solved: number[]
  muted: boolean
  helpOpen: boolean
  hintOpen: boolean
  rotate: (now?: number) => boolean
  restart: (failed?: boolean) => void
  finishLevel: () => void
  nextLevel: () => void
  restartGame: () => void
  selectLevel: (index: number) => void
  togglePause: () => void
  pause: () => void
  toggleSound: () => void
  toggleHelp: () => void
  toggleHint: () => void
}

const initial = {
  physicsReady: false,
  levelIndex: 0,
  gravity: levels[0].initialGravity,
  rotations: 0,
  totalRotations: 0,
  status: 'ready' as GameStatus,
  runId: 0,
  deaths: 0,
  lastRotation: -Infinity,
  cooldown: PHYSICS.inputCooldown as number,
  solved: [] as number[],
  muted: false,
  helpOpen: false,
  hintOpen: false,
}

export const useGameStore = create<GameState>((set, get) => ({
  ...initial,
  rotate: (now = performance.now()) => {
    const state = get()
    if (!state.physicsReady || !['ready', 'playing'].includes(state.status) || state.helpOpen || now - state.lastRotation < state.cooldown) return false
    set({ gravity: nextGravity(state.gravity), rotations: state.rotations + 1,
      totalRotations: state.totalRotations + 1, status: 'playing', lastRotation: now })
    return true
  },
  restart: (failed = false) => {
    const state = get()
    if (state.status === 'completed' || state.status === 'transitioning') return
    set({ gravity: levels[state.levelIndex].initialGravity, rotations: 0,
      status: 'ready', runId: state.runId + 1, lastRotation: -Infinity,
      deaths: state.deaths + (failed ? 1 : 0) })
  },
  finishLevel: () => {
    const state = get()
    if (state.status !== 'playing') return
    set({ status: 'transitioning',
      solved: [...new Set([...state.solved, state.levelIndex])] })
  },
  nextLevel: () => {
    const state = get()
    if (state.status !== 'transitioning') return
    if (state.solved.length === levels.length) { set({ status: 'completed' }); return }
    // Free selection can finish levels in any order. Continue with the next
    // unsolved level, wrapping around after the last one.
    let index = (state.levelIndex + 1) % levels.length
    while (state.solved.includes(index)) index = (index + 1) % levels.length
    set({ levelIndex: index, gravity: levels[index].initialGravity, rotations: 0,
      status: 'ready', runId: state.runId + 1, lastRotation: -Infinity, hintOpen: false })
  },
  restartGame: () => set((state) => ({ ...initial, physicsReady: state.physicsReady, muted: state.muted, runId: state.runId + 1 })),
  selectLevel: (index) => {
    const state = get()
    if (!Number.isInteger(index) || index < 0 || index >= levels.length || state.status === 'transitioning') return
    set({ levelIndex: index, gravity: levels[index].initialGravity, rotations: 0,
      status: 'ready', runId: state.runId + 1, lastRotation: -Infinity, hintOpen: false, helpOpen: false })
  },
  togglePause: () => set((state) => ({ status: state.status === 'paused' ? (state.rotations ? 'playing' : 'ready') : ['ready', 'playing'].includes(state.status) ? 'paused' : state.status })),
  pause: () => set((state) => ({ status: ['ready', 'playing'].includes(state.status) ? 'paused' : state.status })),
  toggleSound: () => set((state) => ({ muted: !state.muted })),
  toggleHelp: () => set((state) => ({ helpOpen: !state.helpOpen })),
  toggleHint: () => set((state) => ({ hintOpen: !state.hintOpen })),
}))
