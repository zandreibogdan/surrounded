import type { GravityDirection } from '../physics/config'

export type Point = [number, number]
export interface Block {
  position: Point
  size: Point
  /** Rotation about Z, in radians. */
  angle?: number
}
export interface Bumper {
  position: Point
  radius: number
  spring?: boolean
}
export interface Level {
  id: number
  name: string
  idea: string
  hint: string
  spawn: Point
  initialGravity: GravityDirection
  platforms: Block[]
  obstacles: Block[]
  hazards: Block[]
  bumpers?: Bumper[]
  exit: Point
}

export function difficultyFor(id: number) {
  return id <= 5 ? 'Warm-up' : id <= 10 ? 'Tricky' : id <= 15 ? 'Hard' : 'Expert'
}
