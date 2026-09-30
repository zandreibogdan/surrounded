import { RoundedBox } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import type { Block } from '../../levels/levelTypes'
import { PHYSICS } from '../../physics/config'

export function Platform({ block, obstacle = false }: { block: Block; obstacle?: boolean }) {
  return <RigidBody type="fixed" position={[...block.position, 0]} rotation={[0, 0, block.angle ?? 0]} colliders={false}>
    <CuboidCollider args={[block.size[0] / 2, block.size[1] / 2, PHYSICS.depth / 2]} friction={PHYSICS.friction} restitution={PHYSICS.restitution} />
    <RoundedBox args={[...block.size, PHYSICS.depth]} radius={0.075} smoothness={3} castShadow receiveShadow>
      <meshStandardMaterial color={obstacle ? '#d8d4df' : '#f5f3f5'} roughness={0.7} />
    </RoundedBox>
  </RigidBody>
}
