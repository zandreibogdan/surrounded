import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Camera } from './components/game/Camera'
import { Player } from './components/game/Player'
import { Platform } from './components/game/Platform'
import { GRAVITY, PHYSICS } from './physics/config'
import { levels } from './levels/levels'
import { useGameStore } from './store/gameStore'
import { useGameInput } from './hooks/useGameInput'
import { useProgression } from './hooks/useProgression'
import { Hazard } from './components/game/Hazard'
import { Exit } from './components/game/Exit'
import { LevelDecor } from './components/game/LevelDecor'
import { SceneLabels } from './components/ui/SceneLabels'
import { GameErrorBoundary } from './components/ui/GameErrorBoundary'
import { PhysicsReady } from './components/game/PhysicsReady'
import { Bumper } from './components/game/Bumper'

export function Game() {
  useGameInput()
  useProgression()
  const { levelIndex, gravity, status, helpOpen, runId, physicsReady } = useGameStore()
  const level = levels[levelIndex]
  return <div className="game-canvas" data-play-surface>
    <GameErrorBoundary>
    <Canvas shadows dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <Camera />
      <ambientLight intensity={2.5} />
      <directionalLight position={[-3, 6, 14]} intensity={1.8} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-normalBias={0.025} shadow-bias={-0.0001} shadow-radius={4} />
      <mesh position={[0, 0, -0.65]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#e2d7ef" roughness={1} />
      </mesh>
      <Suspense fallback={null}>
        <Physics gravity={[...GRAVITY[gravity].vector]} timeStep={PHYSICS.timeStep} paused={status !== 'playing' || helpOpen} colliders={false}>
          <PhysicsReady />
          <group key={runId}>
            {level.platforms.map((block, i) => <Platform key={i} block={block} />)}
            {level.obstacles.map((block, i) => <Platform key={`o${i}`} block={block} obstacle />)}
            {level.hazards.map((block, i) => <Hazard key={`h${i}`} block={block} />)}
            {level.bumpers?.map((bumper, i) => <Bumper key={`b${i}`} bumper={bumper} />)}
            <Exit position={level.exit} />
            <Player spawn={level.spawn} />
          </group>
        </Physics>
        <LevelDecor />
      </Suspense>
    </Canvas>
    </GameErrorBoundary>
    {physicsReady ? <SceneLabels level={level} /> : <div className="loading-overlay" role="status"><span className="loading-orbit" />Finding our center of gravity…</div>}
  </div>
}
