import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'
import { Icon } from './Icon'

export function HelpDialog() {
  const dialog = useRef<HTMLDialogElement>(null)
  const { helpOpen, toggleHelp } = useGameStore()
  useEffect(() => { if (helpOpen) dialog.current?.showModal(); else dialog.current?.close() }, [helpOpen])
  return <dialog ref={dialog} className="help-dialog" onCancel={(event) => { event.preventDefault(); if (useGameStore.getState().helpOpen) toggleHelp() }} aria-labelledby="help-title">
    <button className="icon-button close-help" aria-label="Close instructions" onClick={toggleHelp}><Icon name="close" /></button><span className="eyebrow">ONE BUTTON. ENDLESS PERSPECTIVES.</span><h2 id="help-title">Go with the gravity.</h2><p>You are the little yellow ball. Find your way to the turquoise portal by changing which way is down.</p>
    <div className="help-cycle"><span>↓<small>Down</small></span><i>→</i><span>←<small>Left</small></span><i>→</i><span>↑<small>Up</small></span><i>→</i><span>→<small>Right</small></span></div>
    <ul><li><kbd>Space</kbd><span>or tap the playground to rotate 90° clockwise.</span></li><li><span className="help-dot coral" /><span>Coral surfaces restart the level. Experiment freely.</span></li><li><span className="help-dot mint" /><span>Mint bumpers bounce you back. Round pillars and ramps redirect your momentum.</span></li><li><kbd>R</kbd><span>Start this level again. <kbd>Esc</kbd> takes a pause.</span></li></ul><p className="help-note">Your momentum carries through each turn. There is no timer or limit on trying. Choose any level from the cards below the playground.</p><button className="primary-button" onClick={toggleHelp} autoFocus>Let’s give it a spin<Icon name="arrow" size={17} /></button>
  </dialog>
}
