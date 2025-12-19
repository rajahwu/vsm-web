import type { StoryChoice, StoryNode } from './story-map';

type AdvanceNodeResult = {
  nextNodeId: string;
  statusUpdates?: { status: string; integrityChange: number };
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
  currentNode ? storyNodes.find(c => choice.nextNodeId === c.id) : currentNode;
  ;
  return {
    nextNodeId: choice.nextNodeId,
    statusUpdates: currentNode.statusUpdates,
    triggersCardId: undefined, // future hook
  };
}
