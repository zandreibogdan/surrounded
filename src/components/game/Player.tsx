import { useRef } from 'react'
import { BallCollider, RigidBody, useBeforePhysicsStep, type RapierRigidBody } from '@react-three/rapier'
import { PHYSICS, limitVelocity } from '../../physics/config'
import { useGameStore } from '../../store/gameStore'
import type { Point } from '../../levels/levelTypes'

export function Player({ spawn }: { spawn: Point }) {
  const body = useRef<RapierRigidBody>(null)
  useBeforePhysicsStep(() => {
    if (!body.current) return
    const velocity = limitVelocity(body.current.linvel())
    if (velocity) body.current.setLinvel(velocity, true)
    const p = body.current.translation()
    if (Math.abs(p.x) > 12 || Math.abs(p.y) > 9) useGameStore.getState().restart(true)
  })
  return <RigidBody ref={body} name="player" userData={{ player: true }} position={[...spawn, 0]} colliders={false}
    ccd canSleep={false} enabledTranslations={[true, true, false]} enabledRotations={[false, false, true]}
    linearDamping={PHYSICS.linearDamping} angularDamping={PHYSICS.angularDamping}>
    <BallCollider args={[PHYSICS.radius]} mass={PHYSICS.mass} friction={PHYSICS.friction} restitution={PHYSICS.restitution} />
    <mesh castShadow>
      <sphereGeometry args={[PHYSICS.radius, 32, 24]} />
      <meshStandardMaterial color="#facb45" roughness={0.3} metalness={0.08} />
    </mesh>
  </RigidBody>
}
