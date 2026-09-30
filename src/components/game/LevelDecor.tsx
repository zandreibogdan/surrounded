import { useMemo } from 'react'
import { BufferGeometry, Float32BufferAttribute } from 'three'

export function LevelDecor() {
  const geometry = useMemo(() => {
    const positions: number[] = []
    for (let x = -7; x <= 7; x += 0.5) for (let y = -3.5; y <= 3.5; y += 0.5) positions.push(x, y, -0.62)
    return new BufferGeometry().setAttribute('position', new Float32BufferAttribute(positions, 3))
  }, [])
  return <>
    <points geometry={geometry}><pointsMaterial color="#b7adc7" size={0.032} sizeAttenuation transparent opacity={0.65} /></points>
  </>
}
