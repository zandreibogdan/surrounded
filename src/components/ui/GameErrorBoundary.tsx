import { Component, type ReactNode } from 'react'

export class GameErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <div className="stage-overlay"><div><span className="eyebrow">A SMALL TECHNICAL PAUSE</span><h2>Let’s try that again.</h2><p>The 3D playground needs a browser with WebGL enabled.</p><button className="primary-button" onClick={() => window.location.reload()}>Reload the playground</button></div></div>
    return this.props.children
  }
}
