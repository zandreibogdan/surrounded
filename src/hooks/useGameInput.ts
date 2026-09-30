import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && !!target.closest('button, a, input, textarea, select, [contenteditable="true"], [role="dialog"]')
}

export function useGameInput() {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code === 'Escape' && !event.repeat) {
        const state = useGameStore.getState()
        if (state.helpOpen) state.toggleHelp()
        else state.togglePause()
        return
      }
      if (isInteractiveTarget(event.target) || event.ctrlKey || event.metaKey || event.altKey) return
      if (event.code === 'Space') {
        event.preventDefault()
        if (!event.repeat) useGameStore.getState().rotate()
      }
      if (event.code === 'KeyR' && !event.repeat) useGameStore.getState().restart()
    }
    function onPointer(event: PointerEvent) {
      if (event.button !== 0 || !event.isPrimary || isInteractiveTarget(event.target)) return
      if (event.target instanceof Element && event.target.closest('[data-play-surface]')) {
        event.preventDefault()
        useGameStore.getState().rotate()
      }
    }
    function onVisibility() { if (document.hidden) useGameStore.getState().pause() }
    const onBlur = () => useGameStore.getState().pause()
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])
}
