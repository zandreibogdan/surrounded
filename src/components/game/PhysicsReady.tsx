import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'

/** Mounted only after Rapier's WASM has initialized. */
export function PhysicsReady() {
  useEffect(() => {
    useGameStore.setState({ physicsReady: true })
    return () => { useGameStore.setState({ physicsReady: false }) }
  }, [])
  return null
}
