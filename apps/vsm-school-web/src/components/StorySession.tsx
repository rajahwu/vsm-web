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

  // Fix: Find node based on current nodeId state, not startNodeId
  const node: StoryNode = storyNodes.find(n => n.id === nodeId) || storyNodes[0];

  function handleChoose(choiceId: string) {
    const result = advanceNode({
      storyNodes: storyNodes,
      currentNode: node,
      choiceId: choiceId
    });

    if (!result) return;

    // Apply entity state changes
    if (result.statusUpdates) {
      setEntities(prev =>
        applyStatusUpdates(prev, result.statusUpdates!)
      );
    }

    // 🚨 HANDOFF: story → training
    if (result.triggersCardId) {
      onTriggerTraining(result.triggersCardId);
      return;
    }

    // Ending reached
    const nextNode = storyNodes.find(n => n.id === result.nextNodeId);
    if (nextNode?.isEnding && onComplete) {
      setNodeId(result.nextNodeId);
      onComplete();
      return;
    }

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
