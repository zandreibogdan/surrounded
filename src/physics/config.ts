export const GRAVITY = [
  { name: 'Down', arrow: '↓', vector: [0, -9.81, 0] },
  { name: 'Left', arrow: '←', vector: [-9.81, 0, 0] },
  { name: 'Up', arrow: '↑', vector: [0, 9.81, 0] },
  { name: 'Right', arrow: '→', vector: [9.81, 0, 0] },
] as const
export type GravityDirection = 0 | 1 | 2 | 3
export const nextGravity = (direction: GravityDirection): GravityDirection =>
  ((direction + 1) % 4) as GravityDirection

export const PHYSICS = {
  timeStep: 1 / 120,
  inputCooldown: 150,
  radius: 0.3,
  mass: 1,
  friction: 0.38,
  restitution: 0.12,
  linearDamping: 0.12,
  angularDamping: 0.3,
  maxSpeed: 11,
  depth: 0.85,
  exitRadius: 0.64,
  springRestitution: 0.88,
  springFriction: 0.12,
  transitionDuration: 1600,
} as const

/** Shared by the actual player and the headless physics verification. */
export function limitVelocity(v: { x: number; y: number; z: number }) {
  const speed = Math.hypot(v.x, v.y)
  if (speed <= PHYSICS.maxSpeed) return null
  const ratio = PHYSICS.maxSpeed / speed
  return { x: v.x * ratio, y: v.y * ratio, z: 0 }
}
