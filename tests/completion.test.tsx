// @vitest-environment jsdom
import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { CompletionScreen } from '../src/components/ui/CompletionScreen'
import { useGameStore } from '../src/store/gameStore'
import { levels } from '../src/levels/levels'

beforeEach(() => { useGameStore.getState().restartGame(); useGameStore.setState({ physicsReady: true }) })
afterEach(cleanup)

it('renders the final run totals and restarts from the completion button', () => {
  useGameStore.setState({ status: 'completed', levelIndex: levels.length - 1, solved: levels.map((_, i) => i), totalRotations: 37, deaths: 3 })
  const view = render(<CompletionScreen />)
  expect(view.getByRole('heading', { name: 'You came full circle.' })).toBeTruthy()
  expect(view.getByText('37')).toBeTruthy()
  expect(view.getByText('3')).toBeTruthy()
  expect(view.getByText('20')).toBeTruthy()
  fireEvent.click(view.getByRole('button', { name: 'One more journey' }))
  expect(useGameStore.getState()).toMatchObject({ status: 'ready', levelIndex: 0, totalRotations: 0, deaths: 0 })
  expect(view.queryByRole('heading')).toBeNull()
})

it('resumes from the pause overlay without resetting the attempt', () => {
  useGameStore.setState({ status: 'paused', gravity: 2, rotations: 6 })
  const view = render(<CompletionScreen />)
  fireEvent.click(view.getByRole('button', { name: 'Keep going' }))
  expect(useGameStore.getState()).toMatchObject({ status: 'playing', gravity: 2, rotations: 6 })
})
