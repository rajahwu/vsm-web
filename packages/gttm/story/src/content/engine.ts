import type { StoryNode, EntityId, Entity } from './story-map';

type AdvanceNodeResult = {
  nextNodeId: string;
  statusUpdates?: Partial<Record<EntityId, Partial<Entity>>>;
  triggersCardId?: string;
}

type AdvanceNodeParams = {
  storyNodes: StoryNode[];
  currentNode: StoryNode;
  choiceId: string;
}

export function advanceNode(
  { storyNodes, currentNode, choiceId }: AdvanceNodeParams
): AdvanceNodeResult | null {
  const choice = currentNode.choices?.find(c => c.id === choiceId);
  if (!choice) return null;

  const nextNode = storyNodes.find(n => n.id === choice.nextNodeId);
  if (!nextNode) return null;

  return {
    nextNodeId: choice.nextNodeId,
    statusUpdates: nextNode.statusUpdates,
    triggersCardId: nextNode.triggersCardId, // Card triggering now implemented
  };
}
