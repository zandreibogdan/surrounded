import { OrthographicCamera } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

export function Camera() {
  const size = useThree((state) => state.size)
  return <OrthographicCamera makeDefault position={[0, 3.2, 30]} zoom={Math.min(size.width / 18.8, size.height / 12.1)} near={0.1} far={100} onUpdate={(camera) => camera.lookAt(0, 0, 0)} />
}
