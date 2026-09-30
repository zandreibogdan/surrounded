import type { Level } from '../../levels/levelTypes'
import { useGameStore } from '../../store/gameStore'

/** Static labels projected to match the fixed camera, without extra React roots. */
export function SceneLabels({ level }: { level: Level }) {
  const ready = useGameStore(s => s.status === 'ready')
  const position = (x: number, y: number) => ({ left: `calc(50% + ${x} * var(--unit))`, top: `calc(50% - ${y * 0.99436} * var(--unit))` })
  return <div className="scene-annotations">
    {ready && <span className="scene-label world-label player-label" style={position(level.spawn[0], level.spawn[1] + 0.95)}>YOU<span>↓</span></span>}
    <span className="scene-label world-label exit-label" style={position(level.exit[0], level.exit[1] + 1.02)}>EXIT</span>
    {level.id === 1 && <div className="scene-label world-message" style={position(0, 0.45)}><span className="tiny-orbit">↻</span><strong>A little shift in perspective.</strong><span>You move gravity. Gravity moves you.</span></div>}
  </div>
}
