# ONE BUTTON

A complete 20-level gravity puzzle for desktop, tablet, and mobile browsers. Move a warm yellow ball through a lavender world by changing gravity, one quarter-turn at a time.

## Run locally

Use Node.js 22.18+ (Node 24 is recommended).

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Vite. Production output is generated in `dist/`:

```sh
npm run typecheck
npm run test
npm run build
npm run preview
```

No server-side application, accounts, API keys, or environment variables are required. WebGL must be enabled. Fonts use Google Fonts with system fallbacks; gameplay and all geometry are bundled locally.

## Play

- **Space**, **left-click/tap the playground**, or the **Rotate gravity** button: rotate gravity Down → Left → Up → Right → Down.
- **R** or **Restart**: reset the current attempt, including position, velocity, angular velocity, and gravity.
- **Esc** or the pause button: pause/resume. Switching away also pauses the game.
- Reach the **turquoise ring** to advance automatically.
- Touch a **coral surface** for an immediate fresh start. Press Space when ready to try again.
- **Need a little nudge?** reveals a hint. The question mark explains the controls.
- **Choose level** opens the level grid. All 20 cards are available from the start, with previews, difficulty labels, and solved markers. Selecting a card returns you to the playground.
- Angled ramps and round pillars redirect momentum; mint spring bumpers provide a stronger rebound.
- Complete levels in any order. The game advances to the next unsolved level, wrapping around after level 20. Solve all 20 to see the final totals and restart the journey.

The HUD counts rotations in the current attempt. The final total includes every accepted rotation across retries and replays. There is no timer or turn limit. Progress is held for the current browser session and resets on page refresh.

## Implementation

- Vite + React 19 + TypeScript, React Three Fiber + Drei, Rapier, and Zustand.
- `src/levels/levels.ts`: the five introductory levels, followed by 15 additional layouts in `advancedLevels.ts`. Levels 6–10 introduce ramps and bumpers; levels 11–15 add tighter gates and winding routes; levels 16–20 combine those obstacles.
- `src/physics/config.ts`: one source for gravity, the 150 ms input cooldown, 120 Hz timestep, ball radius/mass/materials, speed cap, and completion timing.
- `src/components/game/`: fixed camera, physics bodies, sensors, and procedural geometry.
- `src/store/gameStore.ts`: gameplay state, input acceptance, resets, free level selection, and progression in any order.
- `src/hooks/`: input events, completion timer, and optional synthesized audio.
- `src/components/ui/`: HUD, progress cards, help dialog, labels, and completion screens.

The dynamic ball uses continuous collision detection, fixed Z translation, and Z-only rotation. Gravity changes the physics world's gravity vector without changing velocity. Velocity is capped before physics steps; no per-frame position manipulation drives the ball. Fixed ledges and ramps use cuboid colliders with matching visual rotations. Round pillars and spring bumpers use ball colliders, constrained to the same XY cross-section as the player. Spring bumpers use a higher restitution with the maximum combine rule. Hazards and the exit use sensor colliders. A new attempt remounts the level bodies, discarding old momentum. The camera stays fixed.

## Verification

`npm test` runs real Rapier simulations and DOM/state tests. Coverage includes:

- Momentum preservation at a gravity change, stable collisions, plane constraints, and high-speed containment.
- A successful gravity-only route through each of the 20 levels, checked against the actual collider dimensions and physics settings, plus ramp deflection and spring rebound behavior.
- Hazard detection, safe spawn points, input cooldown boundaries, held Space, left/right mouse input, ignored UI input, focus-loss pause, restart, and input blocked during help/pause/completion/transitions/loading.
- Immediate access to every level, selecting level 20 first, replaying solved levels, completion in any order, the completion timer, final totals, and restarting the full journey.

Reproducible solution timings are in `tests/solutions.ts`. Each number is how many 120 Hz simulation frames to wait after pressing the gravity button. These fixtures never teleport the player or modify its velocity. The optional `npm run solve` command searches for routes again using physics snapshots and replays each result from a fresh world. Pass level IDs to search selected levels, for example `npm run solve -- 15 20`. Add `--robust` to compare timing variations across candidate routes.

Visual quality, sound quality, and performance across different GPUs still need human evaluation. Automated physics tests establish reachability, not subjective difficulty. The Rapier dependency may emit an upstream initialization deprecation warning; it does not prevent simulation.

For responsive layout checks, run the dev server and open `/tools/layout-preview.html?screen=completed`. This separate development fixture displays the real completion screen without replaying all 20 levels. It is excluded from the production build. Verify the button stays centered inside the playground, then use it to test the normal game at phone, tablet, and desktop widths. The picker uses five columns on desktop, four on tablets, and two on phones, with no horizontal page overflow.
