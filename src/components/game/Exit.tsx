import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BallCollider, RigidBody } from '@react-three/rapier'
import type { Group } from 'three'
import type { Point } from '../../levels/levelTypes'
import { PHYSICS } from '../../physics/config'
import { useGameStore } from '../../store/gameStore'

export function Exit({ position }: { position: Point }) {
  const glow = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (glow.current) glow.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2.4) * 0.035)
  })
  return <RigidBody type="fixed" colliders={false} position={[...position, 0]}>
    <BallCollider sensor args={[PHYSICS.exitRadius]} onIntersectionEnter={({ other }) => {
      if (other.rigidBodyObject?.name === 'player') useGameStore.getState().finishLevel()
    }} />
    <group ref={glow}>
      <mesh position={[0, 0, -0.18]}>
        <circleGeometry args={[0.6, 48]} />
        <meshBasicMaterial color="#77d6cf" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh castShadow>
        <torusGeometry args={[0.57, 0.072, 12, 64]} />
        <meshStandardMaterial color="#58c9c1" emissive="#42b5ae" emissiveIntensity={0.45} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, -0.1]}>
        <torusGeometry args={[0.74, 0.012, 6, 64]} />
        <meshBasicMaterial color="#78c9c5" transparent opacity={0.4} />
      </mesh>
    </group>
  </RigidBody>
}
