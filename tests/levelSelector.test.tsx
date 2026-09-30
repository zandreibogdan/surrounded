// @vitest-environment jsdom
import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { LevelSelector } from '../src/components/ui/LevelSelector'
import { useGameStore } from '../src/store/gameStore'

beforeEach(() => {
  useGameStore.getState().restartGame()
  vi.stubGlobal('matchMedia', () => ({ matches: true }))
  Element.prototype.scrollIntoView = vi.fn()
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

it('offers all twenty levels immediately and moves focus back to the selected playground', () => {
  const view = render(<><section id="current-level" tabIndex={-1} /><LevelSelector /></>)
  const buttons = view.getAllByRole('button')
  expect(buttons).toHaveLength(20)
  expect(buttons.every(button => !(button as HTMLButtonElement).disabled)).toBe(true)
  fireEvent.click(view.getByRole('button', { name: 'Level 20: Full Circle, Expert' }))
  expect(useGameStore.getState().levelIndex).toBe(19)
  expect(document.activeElement?.id).toBe('current-level')
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' })
})

it('shows solved progress and allows replay after the journey is complete', () => {
  useGameStore.setState({ status: 'completed', solved: Array.from({ length: 20 }, (_, i) => i) })
  const view = render(<LevelSelector />)
  expect(view.getByText('20 / 20 solved')).toBeTruthy()
  fireEvent.click(view.getByRole('button', { name: 'Level 8: Spring Theory, Tricky, solved' }))
  expect(useGameStore.getState()).toMatchObject({ levelIndex: 7, status: 'ready' })
  expect(useGameStore.getState().solved).toHaveLength(20)
})
