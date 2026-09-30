import { GRAVITY, nextGravity } from '../../physics/config'
import { useGameStore } from '../../store/gameStore'
import { Icon } from './Icon'

export function GameHUD() {
  const { gravity, rotations, status, restart, togglePause } = useGameStore()
  const inactive = status === 'transitioning' || status === 'completed'
  return <aside className="game-hud" aria-label="Game controls">
    <span className="eyebrow">A NEW DIRECTION</span>
    <div className="gravity-compass" aria-hidden="true">
      <span className={`compass-dot north ${gravity === 2 ? 'active' : ''}`} /><span className={`compass-dot east ${gravity === 3 ? 'active' : ''}`} /><span className={`compass-dot south ${gravity === 0 ? 'active' : ''}`} /><span className={`compass-dot west ${gravity === 1 ? 'active' : ''}`} />
      <div className="compass-inner"><svg className="gravity-arrow" style={{ transform: `rotate(${rotations * 90}deg)` }} viewBox="0 0 60 60" fill="none"><path d="M30 13v34m-13-13 13 13 13-13" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
    </div>
    <div className="gravity-name" aria-live="polite"><strong>{GRAVITY[gravity].name}</strong><span>Current gravity</span></div>
    <div className="next-gravity">Next <span>{GRAVITY[nextGravity(gravity)].arrow} {GRAVITY[nextGravity(gravity)].name}</span></div><div className="hud-divider" />
    <div className="rotation-count"><span className="eyebrow">ROTATIONS</span><strong data-testid="rotation-count">{String(rotations).padStart(2, '0')}</strong><span>Small shifts. Infinite possibilities.</span></div>
    <div className="hud-actions"><button className="restart-button" onClick={() => restart()} disabled={inactive} aria-label="Restart level"><Icon name="restart" size={16} />Restart<span className="key-hint">R</span></button><button className="icon-button pause-button" onClick={togglePause} disabled={inactive} aria-label={status === 'paused' ? 'Resume game' : 'Pause game'} title="Pause · Esc"><Icon name={status === 'paused' ? 'play' : 'pause'} size={16} /></button></div>
  </aside>
}
