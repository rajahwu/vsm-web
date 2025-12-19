'use client';

import { useState } from 'react';

import { StoryPlayer } from './StoryPlayer';

import {
  initialEntities,
  type Entity,
  type EntityId,
  type StoryNode,
  StoryNodeId,
} from '@/lib/story/story-map';

import { advanceNode } from '@/lib/story/engine';

/* =========================
   Props
   ========================= */

interface StorySessionProps {
  startNodeId: StoryNodeId;
  storyNodes: StoryNode[]
  onTriggerTraining: (cardId: string) => void;
  onComplete?: () => void;
}

/* =========================
   Helpers
   ========================= */

function applyStatusUpdates(
  prev: Record<EntityId, Entity>,
  updates: Partial<Record<EntityId, Partial<Entity>>>
): Record<EntityId, Entity> {
  const next = { ...prev };

  for (const [id, changes] of Object.entries(updates)) {
    const entityId = id as EntityId;
    if (!next[entityId]) continue;

    next[entityId] = {
      ...next[entityId],
      ...changes,
    };
  }

  return next;
}

/* =========================
   StorySession
   ========================= */

export function StorySession({
  startNodeId,
  onTriggerTraining,
  onComplete,
  storyNodes,
}: StorySessionProps) {
  const [nodeId, setNodeId] = useState(startNodeId);
  const [entities, setEntities] = useState<Record<EntityId, Entity>>(
    initialEntities
  );

  const node: StoryNode = storyNodes.find(n => n.id === startNodeId) || storyNodes[0];

  const choiceIds = node.choices?.map(c => c.id) || [];
  function handleChoose(choiceId: string) {
    const result = advanceNode({storyNodes: storyNodes, currentNode: node, choiceId: choiceId || node.choices[0].id});
    if (!result) return;

    // // Apply entity state changes
    // if (result.statusUpdates) {
    //   setEntities(prev =>
    //     applyStatusUpdates(prev, result.statusUpdates!)
    //   );
    // }

    // 🚨 HANDOFF: story → training
    if (result.triggersCardId) {
      onTriggerTraining(result.triggersCardId);
      return;
    }

    // // Ending reached
    // if (storyNodes[result.nextNodeId]?.isEnding) {
    //   setNodeId(result.nextNodeId);
    //   return;
    // }

    // Normal progression
    setNodeId(result.nextNodeId);
  }

  function restart() {
    setEntities(initialEntities);
    setNodeId(startNodeId);
  }

  return (
    <StoryPlayer
      node={node}
      entities={entities}
      onChoose={handleChoose}
      onRestart={restart}
    />
  );
}
