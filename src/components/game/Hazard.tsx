import { CuboidCollider, RigidBody } from '@react-three/rapier'
import type { Block } from '../../levels/levelTypes'
import { useGameStore } from '../../store/gameStore'

export function Hazard({ block }: { block: Block }) {
  const teeth = Math.max(1, Math.floor(block.size[0] / 0.28))
  return <RigidBody type="fixed" colliders={false} position={[...block.position, 0]} rotation={[0, 0, block.angle ?? 0]}>
    <CuboidCollider sensor args={[block.size[0] / 2, block.size[1] / 2, 0.6]} onIntersectionEnter={({ other }) => {
      if (other.rigidBodyObject?.name === 'player') useGameStore.getState().restart(true)
    }} />
    <mesh castShadow>
      <boxGeometry args={[...block.size, 0.55]} />
      <meshStandardMaterial color="#e58c91" roughness={0.65} />
    </mesh>
    {Array.from({ length: teeth }, (_, i) => <mesh key={i} position={[(i + 0.5) * block.size[0] / teeth - block.size[0] / 2, 0, 0.285]} rotation={[0, 0, Math.PI / 4]}>
      <planeGeometry args={[0.075, 0.075]} />
      <meshBasicMaterial color="#fff0e9" />
    </mesh>)}
  </RigidBody>
}
