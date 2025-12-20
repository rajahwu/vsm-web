# @gttm/story

**The Instructional Narrative Engine**

This package handles the "Story Mode" of the VSM Training system. It provides the engine for interactive narratives, dialogue, and entity state management (The Mother, The Watcher, etc.).

## Components

### `<StoryPlayer />`
The core presentational component for rendering story nodes, typewriter effects, and choices.

```tsx
import { StoryPlayer } from '@gttm/story';

<StoryPlayer 
  node={currentNode}
  entities={currentEntities}
  onChoose={(choiceId) => handleChoice(choiceId)}
/>
```

### `<StorySession />`
A wrapper component that manages the story state (current node, entity integrity) and handles the "handoff" to the training system.

```tsx
import { StorySession } from '@gttm/story';

<StorySession
  startNodeId="transmission-dot"
  storyNodes={allNodes}
  onTriggerTraining={(cardId) => startRitual(cardId)}
/>
```

## Architecture
- **Engine**: Pure logic for advancing nodes and applying state updates (`content/engine.ts`).
- **Content**: Typed definitions for story nodes (`content/story-map.ts`).
- **State**: Tracks Entity Integrity (0-100) and Status.
