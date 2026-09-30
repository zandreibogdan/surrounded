import { useGameStore } from '../../store/gameStore'
import { levels } from '../../levels/levels'
import { Icon } from './Icon'

export function CompletionScreen() {
  const { status, totalRotations, deaths, restartGame, rotations, levelIndex, togglePause, solved } = useGameStore()
  if (status === 'paused') return <div className="stage-overlay"><div className="pause-card"><span className="eyebrow">A MOMENT TO THINK</span><h2>Take your time.</h2><p>Your next perspective will be right here.</p><button className="primary-button" onClick={togglePause}><Icon name="play" size={16} />Keep going</button><span className="overlay-caption">or press Esc to resume</span></div></div>
  if (status === 'transitioning') return <div className="stage-overlay success-overlay" role="status"><div className="success-card"><div className="success-orbit"><Icon name="check" size={30} /></div><span className="eyebrow">PERSPECTIVE FOUND</span><h2>Nicely shifted.</h2><p>{levels[levelIndex].name} · {rotations} rotation{rotations === 1 ? '' : 's'}</p><div className="transition-track"><span /></div></div></div>
  if (status !== 'completed') return null
  return <div className="stage-overlay final-overlay"><div className="completion-card"><div className="completion-art" aria-hidden="true"><span className="final-ring" /><span className="final-ball" /><i /><i /><i /></div><span className="eyebrow">{levels.length} LEVELS. A NEW PERSPECTIVE.</span><h2>You came full circle.</h2><p>Turns out, a little shift changes everything.</p><div className="final-stats"><div><strong>{totalRotations}</strong><span>Total rotations</span></div><div><strong>{solved.length}</strong><span>Levels explored</span></div><div><strong>{deaths}</strong><span>Fresh starts</span></div></div><button className="primary-button" onClick={restartGame}><Icon name="restart" size={17} />One more journey</button></div></div>
}
