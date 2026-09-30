import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { PHYSICS } from '../physics/config'

export function useProgression() {
  const status = useGameStore(s => s.status)
  const runId = useGameStore(s => s.runId)
  useEffect(() => {
    if (status !== 'transitioning') return
    const timer = window.setTimeout(() => useGameStore.getState().nextLevel(), PHYSICS.transitionDuration)
    return () => window.clearTimeout(timer)
  }, [status, runId])
}
