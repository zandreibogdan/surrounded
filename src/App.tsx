import { Game } from './Game'
import { useGameStore } from './store/gameStore'
import { levels } from './levels/levels'
import { Icon } from './components/ui/Icon'
import { GameHUD } from './components/ui/GameHUD'
import { LevelSelector } from './components/ui/LevelSelector'
import { CompletionScreen } from './components/ui/CompletionScreen'
import { HelpDialog } from './components/ui/HelpDialog'
import { useGameAudio } from './hooks/useGameAudio'

export default function App() {
  const state = useGameStore()
  const level = levels[state.levelIndex]
  useGameAudio()
  return <main className="app-shell" onClickCapture={(event) => {
    // Pointer users can press Space immediately after Restart or a level selection.
    // Preserve native keyboard focus and the instructions dialog's focus trap.
    if (event.detail > 0 && event.target instanceof Element && !event.target.closest('dialog')) {
      const button = event.target.closest('button')
      if (button) queueMicrotask(() => button.blur())
    }
  }}>
    <header className="site-header"><div className="brand"><span className="brand-mark" aria-hidden="true"><span /></span><h1>ONE BUTTON<span>A GRAVITY PUZZLE</span></h1></div><div className="header-right"><span className="header-tagline">A small shift. A whole new world.</span><span className="header-separator" /><button className="icon-button" aria-label={state.muted ? 'Enable sound' : 'Mute sound'} title={state.muted ? 'Sound off' : 'Sound on'} onClick={state.toggleSound}><Icon name={state.muted ? 'mute' : 'sound'} size={19} /></button><button className="icon-button" aria-label="How to play" title="How to play" onClick={state.toggleHelp}><Icon name="help" size={20} /></button></div></header>
    <section id="current-level" className="level-heading" tabIndex={-1} aria-label={`Playing level ${level.id}`}><div><div className="level-kicker"><span className="eyebrow">THE JOURNEY</span><span className="small-line" /><span>LEVEL {String(level.id).padStart(2, '0')} OF {levels.length}</span></div><h2>{level.name}<span className="title-dot">.</span></h2><p>{level.idea}</p></div><div className="level-index" aria-hidden="true"><span>{String(level.id).padStart(2, '0')}</span><span>/ {levels.length}</span></div></section>
    <section className="play-layout" aria-label={`Level ${level.id}: ${level.name}`}><div className="playground"><div className="stage-heading"><span className="eyebrow"><span className="small-cross">+</span> THE PLAYGROUND</span><span className="stage-status"><i />{state.status === 'paused' ? 'ON A LITTLE BREAK' : state.status === 'transitioning' || state.status === 'completed' ? 'A SHIFT WELL MADE' : 'TAKE YOUR TIME'}</span></div><Game /><div className="stage-bottom"><span><i className="legend-ball" />You</span><span><i className="legend-portal" />Your destination</span>{level.hazards.length > 0 && <span><i className="legend-hazard" />A fresh start</span>}{level.bumpers?.some(bumper => bumper.spring) && <span><i className="legend-spring" />Spring bumper</span>}<span className="stage-dimension">X · Y / A NEW PERSPECTIVE</span></div><CompletionScreen />{state.deaths > 0 && state.status === 'ready' && <div className="retry-toast" key={state.runId} role="status">A fresh start. You’ve got this.</div>}</div><GameHUD /></section>
    <div className="controls-strip">
      <div className="input-instruction">
        <button className="space-button" onClick={() => state.rotate()} disabled={['paused', 'transitioning', 'completed'].includes(state.status)} aria-label="Rotate gravity">
          <span className="keyboard-input-label">SPACE</span><span className="space-symbol" aria-hidden="true">␣</span>
          <span className="touch-input-label">Rotate gravity</span><span className="touch-input-label" aria-hidden="true">↻</span>
        </button>
        <span className="desktop-input-copy">or click the playground <span className="instruction-arrow">→</span> <strong>rotate gravity</strong></span>
        <span className="touch-input-copy">Or tap anywhere in the playground.</span>
      </div>
      <div className="secondary-controls"><a className="level-browser-link" href="#levels" onClick={state.pause}>Choose level <span aria-hidden="true">↘</span></a><button className="hint-button" onClick={state.toggleHint} aria-expanded={state.hintOpen}><span>✧</span>{state.hintOpen ? 'Hide little nudge' : 'Need a little nudge?'}</button></div>
    </div>
    {state.hintOpen && <div className="hint-panel" role="status"><span>↳</span>{level.hint}</div>}<LevelSelector />
    <footer><span>ONE BUTTON. <strong>INFINITE PERSPECTIVES.</strong></span><span>No timer. No limits. Just a little curiosity.<span className="footer-spark">✳</span></span></footer><HelpDialog />
  </main>
}
