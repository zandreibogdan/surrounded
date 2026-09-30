import type { Level } from './levelTypes'
import { FRAME } from './frame.ts'
import { advancedLevels } from './advancedLevels.ts'

export const levels: Level[] = [
  {
    id: 1,
    name: 'First Contact',
    idea: 'Every journey starts with a little shift.',
    hint: 'The walls can be your floor. Follow the room around to the glowing exit.',
    spawn: [-6.1, -3.68],
    initialGravity: 0,
    platforms: [...FRAME],
    obstacles: [],
    hazards: [],
    exit: [6.35, -3.3],
  },
  {
    id: 2, name: 'The Wall',
    idea: 'An obstacle is just another way around.',
    hint: 'Go up the left side, travel above the wall, then fall toward the exit.',
    spawn: [-6.1, -3.68], initialGravity: 0,
    platforms: [...FRAME],
    obstacles: [{ position: [-0.5, -1.3], size: [0.8, 5.4] }],
    hazards: [], exit: [6.35, -3.3],
  },
  {
    id: 3, name: 'The Gap',
    idea: 'Trust the momentum. Find your landing.',
    hint: 'Rise from the left ledge, then carry your momentum right. The coral floor is a fresh start.',
    spawn: [-6.1, -1.22], initialGravity: 0,
    platforms: [...FRAME,
      { position: [-5, -1.8], size: [4.8, 0.55] },
      { position: [5, -1.8], size: [4.8, 0.55] },
    ],
    obstacles: [{ position: [0, 1.35], size: [2.5, 0.55] }],
    hazards: [{ position: [0, -3.83], size: [5.3, 0.34] }],
    exit: [6.35, -0.95],
  },
  {
    id: 4, name: 'The Trap',
    idea: 'A little patience goes a long way.',
    hint: 'Drop through the opening on the left. Follow the narrow passage right, then drop again.',
    spawn: [-6.1, -0.6], initialGravity: 0,
    platforms: [...FRAME],
    obstacles: [
      { position: [1.95, 0.55], size: [10.9, 0.55] },
      { position: [-1.95, -1.2], size: [10.9, 0.55] },
    ],
    hazards: [
      { position: [0, 3.83], size: [10, 0.34] },
      { position: [0, -3.83], size: [7, 0.34] },
      { position: [0.4, 0.14], size: [2.3, 0.26] },
    ],
    exit: [6.35, -3.3],
  },
  {
    id: 5, name: 'The Sequence',
    idea: 'Put the first pieces together.',
    hint: 'Above the first wall. Below the second. Use the safe corners to plan your next turn.',
    spawn: [-6.1, -3.68], initialGravity: 0,
    platforms: [...FRAME],
    obstacles: [
      { position: [-2.4, -1.3], size: [0.7, 5.4] },
      { position: [2.4, 1.3], size: [0.7, 5.4] },
    ],
    hazards: [
      { position: [0.1, -3.83], size: [3.2, 0.34] },
      { position: [0.1, 3.83], size: [3.2, 0.34] },
    ],
    exit: [6.35, -3.3],
  },
  ...advancedLevels,
]
