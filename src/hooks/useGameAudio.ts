import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

/** Quiet synthesized feedback, without downloads or a music loop. */
export function useGameAudio() {
  useEffect(() => {
    let audio: AudioContext | undefined
    const tone = (frequency: number, duration: number, delay = 0) => {
      if (!audio || audio.state !== 'running') return
      const oscillator = audio.createOscillator(), gain = audio.createGain(), start = audio.currentTime + delay
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, start)
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.045, start + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
      oscillator.connect(gain).connect(audio.destination)
      oscillator.start(start); oscillator.stop(start + duration)
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
    }
    const unlock = () => {
      if (useGameStore.getState().muted) return
      try { audio ??= new AudioContext(); void audio.resume().catch(() => {}) } catch { /* Gameplay also works without audio. */ }
    }
    window.addEventListener('pointerdown', unlock, { capture: true }); window.addEventListener('keydown', unlock, { capture: true })
    const unsubscribe = useGameStore.subscribe((state, previous) => {
      if (state.muted) return
      if (state.status === 'transitioning' && previous.status !== state.status) { tone(523.25, 0.4); tone(659.25, 0.4, 0.1); tone(783.99, 0.5, 0.2) }
      else if (state.deaths > previous.deaths) tone(180, 0.18)
      else if (state.totalRotations > previous.totalRotations) tone([329.63, 392, 440, 523.25][state.gravity], 0.13)
    })
    return () => {
      window.removeEventListener('pointerdown', unlock, { capture: true }); window.removeEventListener('keydown', unlock, { capture: true }); unsubscribe(); void audio?.close().catch(() => {})
    }
  }, [])
}
