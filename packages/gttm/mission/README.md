# @gttm/mission

**Mission Orchestration System**

This package contains the high-level logic for the VSM Training "Mission Surface". It coordinates the 4-phase ritual flow (Pulse -> Track -> Ritual -> Success) and manages the Mission Registry.

## Components

### `<MissionSurface />`
The main entry point for the mission experience. Manages the high-level state machine between selecting a time window, picking a track, and executing a ritual.

```tsx
import { MissionSurface } from '@gttm/mission';

export default function Page() {
  return <MissionSurface />;
}
```

### `<CardRitual />`
The executor for a specific card's training loop. Moves the user through:
1. **Codex**: Reading the concept.
2. **Instruction**: Narrative briefing (via `@gttm/story`).
3. **Prime**: Time-boxed preparation.
4. **Produce**: The actual work/drill.

## Registry
Exports the definitions for Tracks (Genesis, Source Code, Powerhouse) and Cards.

```ts
import { MISSION_REGISTRY } from '@gttm/mission';
```

## Hooks

### `useMissionProgress`
Fetches user progress from Supabase to track completed cards and literacy scores.
