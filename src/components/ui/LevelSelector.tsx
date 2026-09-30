import { levels } from '../../levels/levels'
import { difficultyFor, type Block, type Level } from '../../levels/levelTypes'
import { useGameStore } from '../../store/gameStore'
import { Icon } from './Icon'

const turn = (block: Block) => `rotate(${-(block.angle ?? 0) * 180 / Math.PI} ${block.position[0]} ${-block.position[1]})`

function Miniature({ level }: { level: Level }) {
  return <svg className="level-miniature" viewBox="-8.5 -5 17 10" aria-hidden="true">
    {[...level.platforms, ...level.obstacles].map((b, i) => <rect key={i} transform={turn(b)} x={b.position[0] - b.size[0] / 2} y={-b.position[1] - b.size[1] / 2} width={b.size[0]} height={b.size[1]} rx="0.1" fill="currentColor" />)}
    {level.hazards.map((b, i) => <rect key={i} transform={turn(b)} x={b.position[0] - b.size[0] / 2} y={-b.position[1] - b.size[1] / 2} width={b.size[0]} height={b.size[1]} fill="#d7949a" />)}
    {level.bumpers?.map((b, i) => <circle key={i} cx={b.position[0]} cy={-b.position[1]} r={b.radius} fill={b.spring ? '#8abdb2' : 'currentColor'} />)}
    <circle cx={level.spawn[0]} cy={-level.spawn[1]} r="0.44" fill="#e0b33e" /><circle cx={level.exit[0]} cy={-level.exit[1]} r="0.6" fill="none" stroke="#67bcb4" strokeWidth="0.25" />
  </svg>
}
export function LevelSelector() {
  const { levelIndex, solved, selectLevel, status } = useGameStore()
  function chooseLevel(index: number) {
    selectLevel(index)
    const heading = document.getElementById('current-level')
    heading?.focus({ preventScroll: true })
    heading?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }
  return <section id="levels" className="level-journey" aria-label="Choose a level">
    <div className="journey-heading"><div><h2 className="eyebrow">CHOOSE YOUR NEXT PERSPECTIVE</h2><p>All {levels.length} levels are open. Start anywhere.</p></div><span>{solved.length} / {levels.length} solved</span></div>
    <div className="level-list">{levels.map((level, i) => <button key={level.id}
      className={`level-item ${i === levelIndex ? 'selected' : ''} ${solved.includes(i) ? 'solved' : ''}`}
      aria-current={i === levelIndex ? 'step' : undefined}
      aria-label={`Level ${level.id}: ${level.name}, ${difficultyFor(level.id)}${solved.includes(i) ? ', solved' : ''}`}
      disabled={status === 'transitioning'} onClick={() => chooseLevel(i)}>
      <div className="level-item-top"><span className="level-number">{String(level.id).padStart(2, '0')}</span><span className="level-state">{solved.includes(i) ? <><Icon name="check" size={14} /><span>Solved</span></> : i === levelIndex ? <span>Playing</span> : null}</span></div>
      <div className="level-item-bottom"><div><strong>{level.name}</strong><span className={`level-difficulty difficulty-${difficultyFor(level.id).toLowerCase()}`}>{difficultyFor(level.id)}</span></div><Miniature level={level} /></div>
    </button>)}</div>
  </section>
}
