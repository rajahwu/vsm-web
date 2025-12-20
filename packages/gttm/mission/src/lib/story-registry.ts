/**
 * Mission Training Story Nodes
 *
 * These story nodes provide narrative context before each card ritual.
 * They use the Protocol Blackout entities (Mother, Watcher, Machinist, Runner)
 * to deliver instructional transmissions.
 */

import type { StoryNode } from '@gttm/story';

export const TRANSMISSION_NODES: Record<string, StoryNode> = {
  /* =========================
     GENESIS TRACK TRANSMISSIONS
     ========================= */

  'transmission-dot': {
    id: 'transmission-dot',
    speaker: 'machinist',
    text: `The sky above the tower is static. The Shell is fractured, and the data stream is a mess of noise.

We can't identify the actors. Before we can fix the system, we need to mark the Sources.

Who is actually in the room? Who is pulling the lever?

Find the Dots, or we're flying blind.`,
    choices: [
      { id: 'continue', text: 'Begin the Dot Ritual', nextNodeId: 'transmission-dot' }
    ],
    triggersCardId: 'dot'
  },

  'transmission-rectangle': {
    id: 'transmission-rectangle',
    speaker: 'mother',
    text: `Dots are just locations, but the Rectangle is where the time burns.

Every action you take is a box. If you don't box your work, the work boxes you.

A client request isn't a story; it's a series of process steps.

Map the grind before it grinds you down.`,
    choices: [
      { id: 'continue', text: 'Begin the Rectangle Ritual', nextNodeId: 'transmission-rectangle' }
    ],
    triggersCardId: 'rectangle'
  },

  'transmission-diamond': {
    id: 'transmission-diamond',
    speaker: 'watcher',
    text: `I see the flow, but it's moving too fast. We're missing the gates.

A system without a Diamond is a system without a choice.

You need to know where the 'No' happens. If everything is a 'Yes,' then nothing is a priority.

Build the gate.`,
    choices: [
      { id: 'continue', text: 'Begin the Diamond Ritual', nextNodeId: 'transmission-diamond' }
    ],
    triggersCardId: 'diamond'
  },

  'transmission-arrow': {
    id: 'transmission-arrow',
    speaker: 'runner',
    text: `The actors are marked. The work is boxed. The gates are set.

Now, we need the commitment.

An Arrow is a promise that 'This' leads to 'That.' Without the Arrow, we have components, but we don't have a system.

Connect the dots. Ship the flow.`,
    choices: [
      { id: 'continue', text: 'Begin the Arrow Ritual', nextNodeId: 'transmission-arrow' }
    ],
    triggersCardId: 'arrow'
  },

  /* =========================
     SOURCE CODE TRACK TRANSMISSIONS
     ========================= */

  'transmission-logic': {
    id: 'transmission-logic',
    speaker: 'machinist',
    text: `The primitives are mastered. Now we build sentences.

Logic Flow is the backbone. It's the ordered sequence from start to end.

If you can't map the flow, you can't optimize it. If you can't see the path, you can't defend it.

Map the flow. Kill the waste.`,
    choices: [
      { id: 'continue', text: 'Begin the Logic Flow Ritual', nextNodeId: 'transmission-logic' }
    ],
    triggersCardId: 'logic_flow'
  },

  'transmission-swimlane': {
    id: 'transmission-swimlane',
    speaker: 'runner',
    text: `A flow without ownership is a flow that stalls.

Swimlanes force the question: Who owns this step?

When work crosses lanes, that's where the handoff breaks. That's where the blame starts.

Circle the risk. Secure the handoff.`,
    choices: [
      { id: 'continue', text: 'Begin the Swimlane Ritual', nextNodeId: 'transmission-swimlane' }
    ],
    triggersCardId: 'swimlane'
  },

  'transmission-loop': {
    id: 'transmission-loop',
    speaker: 'mother',
    text: `Intel is worthless if it's static. Systems must learn.

The Feedback Loop is how a system corrects itself. Output becomes input. Outcomes inform decisions.

Open loops drift. Closed loops adapt.

Close the circle. Make the system reinforce itself.`,
    choices: [
      { id: 'continue', text: 'Begin the Feedback Loop Ritual', nextNodeId: 'transmission-loop' }
    ],
    triggersCardId: 'feedback_loop'
  },

  /* =========================
     POWERHOUSE TRACK TRANSMISSIONS
     ========================= */

  'transmission-dexterity': {
    id: 'transmission-dexterity',
    speaker: 'watcher',
    text: `Before stance, before structure, before the hidden move—you need control.

The hands betray the mind. If your fingers shake when pressure arrives, your system collapses.

This isn't about speed. This is about precision under load.

Execute the movements slowly. Feel the tension. Master the instrument before you attempt the performance.

Control precedes confidence.`,
    choices: [
      { id: 'continue', text: 'Begin the Dexterity Ritual', nextNodeId: 'transmission-dexterity' }
    ],
    triggersCardId: 'dexterity'
  },

  'transmission-stance': {
    id: 'transmission-stance',
    speaker: 'machinist',
    text: `The hands and the head must move as one.

In the Tower, we don't believe in 'hobbies.' A hobbyist waits for inspiration; a Pro builds a stance.

Hold the card palmed until the tension vanishes. Write your declaration.

If you don't define who you are, the noise will define it for you.

Turn Pro or get out of the way.`,
    choices: [
      { id: 'continue', text: 'Begin the High Ground Ritual', nextNodeId: 'transmission-stance' }
    ],
    triggersCardId: 'high_ground'
  },

  'transmission-structure': {
    id: 'transmission-structure',
    speaker: 'mother',
    text: `Intel is useless if it's static. You must learn to interlock the system with the story.

Draw the boxes and arrows until they are muscle memory.

Map the transformation from the chaos of 'Before' to the control of 'After.'

If you can't see the shift, you can't sell the solution.

Lock the structure.`,
    choices: [
      { id: 'continue', text: 'Begin the Interlock Ritual', nextNodeId: 'transmission-structure' }
    ],
    triggersCardId: 'interlock'
  },

  'transmission-splinter': {
    id: 'transmission-splinter',
    speaker: 'runner',
    text: `Execution is the final gate.

We don't recycle ideas; we reimagine them. The 'Hidden Move' is making one core atom look like a hundred different assets.

Two cards as one. One idea as many. If the edges align, the system scales.

Splinter the content. Ship the mission.`,
    choices: [
      { id: 'continue', text: 'Begin the Hidden Move Ritual', nextNodeId: 'transmission-splinter' }
    ],
    triggersCardId: 'hidden_move'
  }
};

/**
 * Get story node by slug (for use with MissionCard.lessonRef.slug)
 */
export function getTransmissionNode(slug: string): StoryNode | undefined {
  return TRANSMISSION_NODES[slug];
}

/**
 * Get all transmission nodes for a track
 */
export function getTrackTransmissions(trackId: 'genesis' | 'source_code' | 'powerhouse'): StoryNode[] {
  const trackPrefixes: Record<string, string[]> = {
    genesis: ['transmission-dot', 'transmission-rectangle', 'transmission-diamond', 'transmission-arrow'],
    source_code: ['transmission-logic', 'transmission-swimlane', 'transmission-loop'],
    powerhouse: ['transmission-dexterity', 'transmission-stance', 'transmission-structure', 'transmission-splinter']
  };

  return trackPrefixes[trackId]
    .map(slug => TRANSMISSION_NODES[slug])
    .filter(Boolean);
}
