// Development-only fixture: exercise real screens without replaying every level.
// This HTML entry is not included in the production build.
import { createRoot } from 'react-dom/client'
import App from '../src/App'
import { useGameStore } from '../src/store/gameStore'
import { levels } from '../src/levels/levels'
import '../src/styles.css'

function showCompletion() {
  useGameStore.setState({
    status: 'completed', levelIndex: levels.length - 1,
    solved: levels.map((_, index) => index), totalRotations: 137, deaths: 12,
  })
}

if (new URLSearchParams(window.location.search).get('screen') === 'completed') showCompletion()

createRoot(document.getElementById('root')!).render(<>
  <App />
  <nav aria-label="Layout verification" style={{ display: 'flex', justifyContent: 'center', gap: 16, padding: 16 }}>
    <button onClick={showCompletion}>Preview completion</button>
    <button onClick={() => useGameStore.getState().restartGame()}>Preview new game</button>
  </nav>
</>)
