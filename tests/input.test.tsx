// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGameInput } from '../src/hooks/useGameInput'
import { useProgression } from '../src/hooks/useProgression'
import { useGameStore } from '../src/store/gameStore'
import { PHYSICS } from '../src/physics/config'

function InputHarness() {
  useGameInput()
  return <><div data-play-surface data-testid="surface" /><button>UI control</button><input aria-label="text" /></>
}
beforeEach(() => { useGameStore.getState().restartGame(); useGameStore.setState({ cooldown: PHYSICS.inputCooldown, physicsReady: true }) })
afterEach(() => { cleanup(); vi.useRealTimers() })

describe('real DOM input handling', () => {
  it('rotates exactly once when Space is held, even after the cooldown', () => {
    render(<InputHarness />)
    fireEvent.keyDown(window, { code: 'Space' })
    useGameStore.setState({ lastRotation: -Infinity })
    for (let i = 0; i < 20; i++) fireEvent.keyDown(window, { code: 'Space', repeat: true })
    expect(useGameStore.getState().rotations).toBe(1)
    fireEvent.keyUp(window, { code: 'Space' })
    fireEvent.keyDown(window, { code: 'Space' })
    expect(useGameStore.getState().rotations).toBe(2)
  })
  it('accepts one primary left pointer press and ignores right clicks and UI controls', () => {
    const view = render(<InputHarness />)
    const pointer = (target: Element, button: number, isPrimary = true) => {
      const event = new Event('pointerdown', { bubbles: true })
      Object.defineProperties(event, { button: { value: button }, isPrimary: { value: isPrimary } })
      fireEvent(target, event)
    }
    pointer(view.getByTestId('surface'), 0)
    expect(useGameStore.getState().rotations).toBe(1)
    useGameStore.setState({ lastRotation: -Infinity })
    pointer(view.getByTestId('surface'), 2)
    pointer(view.getByTestId('surface'), 0, false)
    pointer(view.getByRole('button'), 0)
    fireEvent.click(view.getByTestId('surface'))
    expect(useGameStore.getState().rotations).toBe(1)
  })
  it('ignores Space inside interactive controls and with modifier keys', () => {
    const view = render(<InputHarness />)
    fireEvent.keyDown(view.getByRole('button'), { code: 'Space' })
    fireEvent.keyDown(view.getByRole('textbox'), { code: 'Space' })
    fireEvent.keyDown(window, { code: 'Space', ctrlKey: true })
    expect(useGameStore.getState().rotations).toBe(0)
  })
  it('pauses on lost focus, blocks Space, and resumes with Escape', () => {
    render(<InputHarness />)
    fireEvent.keyDown(window, { code: 'Space' })
    fireEvent.blur(window)
    expect(useGameStore.getState().status).toBe('paused')
    useGameStore.setState({ lastRotation: -Infinity })
    fireEvent.keyDown(window, { code: 'Space' })
    expect(useGameStore.getState().rotations).toBe(1)
    fireEvent.keyDown(window, { code: 'Escape' })
    expect(useGameStore.getState().status).toBe('playing')
    fireEvent.keyDown(window, { code: 'KeyR' })
    expect(useGameStore.getState()).toMatchObject({ status: 'ready', gravity: 0, rotations: 0 })
  })
  it('ignores gravity input while instructions are open', () => {
    render(<InputHarness />)
    useGameStore.getState().toggleHelp()
    fireEvent.keyDown(window, { code: 'Space' })
    expect(useGameStore.getState().rotations).toBe(0)
    fireEvent.keyDown(window, { code: 'Escape' })
    expect(useGameStore.getState().helpOpen).toBe(false)
  })
  it('automatically advances once after the completion animation', () => {
    vi.useFakeTimers()
    renderHook(useProgression)
    act(() => { useGameStore.getState().rotate(0); useGameStore.getState().finishLevel() })
    act(() => vi.advanceTimersByTime(PHYSICS.transitionDuration - 1))
    expect(useGameStore.getState().levelIndex).toBe(0)
    act(() => vi.advanceTimersByTime(1))
    expect(useGameStore.getState()).toMatchObject({ levelIndex: 1, status: 'ready', gravity: 0, rotations: 0 })
    act(() => vi.advanceTimersByTime(PHYSICS.transitionDuration * 2))
    expect(useGameStore.getState().levelIndex).toBe(1)
  })
})
