import { BallCollider, RigidBody } from '@react-three/rapier'
import { CoefficientCombineRule } from '@dimforge/rapier3d-compat'
import type { Bumper as BumperDefinition } from '../../levels/levelTypes'
import { PHYSICS } from '../../physics/config'

/** Round pillars deflect the ball; mint spring rings return more momentum. */
export function Bumper({ bumper }: { bumper: BumperDefinition }) {
  const { position, radius, spring } = bumper
  return <RigidBody type="fixed" colliders={false} position={[...position, 0]}>
    <BallCollider args={[radius]}
      friction={spring ? PHYSICS.springFriction : PHYSICS.friction}
      restitution={spring ? PHYSICS.springRestitution : PHYSICS.restitution}
      restitutionCombineRule={spring ? CoefficientCombineRule.Max : CoefficientCombineRule.Average} />
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, PHYSICS.depth, 48]} />
      <meshStandardMaterial color={spring ? '#b7d5ce' : '#d4cbdc'} roughness={0.65} />
    </mesh>
    <mesh position={[0, 0, PHYSICS.depth / 2 + 0.015]}>
      <torusGeometry args={[radius * 0.76, spring ? 0.035 : 0.018, 8, 48]} />
      <meshStandardMaterial color={spring ? '#73b8aa' : '#b9aacb'} roughness={0.5} />
    </mesh>
    {spring && <mesh position={[0, 0, PHYSICS.depth / 2 + 0.02]}>
      <circleGeometry args={[radius * 0.18, 20]} />
      <meshBasicMaterial color="#effcf5" />
    </mesh>}
  </RigidBody>
}
