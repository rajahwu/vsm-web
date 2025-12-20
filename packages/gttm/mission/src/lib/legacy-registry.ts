// Mission registry scaffold for training blocks (to replace hardcoded data)
// Tracks map to time windows: sprint (10m), standard (25m), grind (45m)

export type TrainingWindowId = 'sprint' | 'standard' | 'grind';

export interface TrainingCard {
  front: string;
  back: string;
}

export interface TrainingSkills {
  physical: { name: string; description: string };
  mental: { name: string; description: string };
}

export interface TrainingBlock {
  id: string; // e.g., control-001
  title: string;
  theme: string;
  skills: TrainingSkills;
  cards: TrainingCard[];
}

export interface TrainingWindow {
  id: TrainingWindowId;
  displayName: string;
  durationMinutes: number;
  blocks: TrainingBlock[];
}

export interface MissionRegistry {
  trainingWindows: TrainingWindow[];
  defaultWindow: TrainingWindowId;
}

export const missionRegistry: MissionRegistry = {
  defaultWindow: 'sprint',
  trainingWindows: [
    {
      id: 'sprint',
      displayName: 'Sprint',
      durationMinutes: 10,
      blocks: [
        {
          id: 'control-001',
          title: 'Control the Deck, Release the Draft',
          theme: 'Hands + Brain Sync',
          skills: {
            physical: { name: 'Overhand Shuffle Control', description: 'Keep top card intact.' },
            mental: { name: 'Ugly First Draft (TUFD)', description: 'Embrace imperfect output.' }
          },
          cards: [
            { front: 'Scenario: Describe this room as a crime scene.', back: 'Action: Shuffle 3x. Write 3 min.' },
            { front: 'Scenario: Describe it as a sanctuary.', back: 'Action: Palm card. Write 3 min.' },
            { front: 'Scenario: Combine both perspectives.', back: 'Action: Riffle shuffle. Synthesize.' }
          ]
        }
      ]
    },
    {
      id: 'standard',
      displayName: 'Standard',
      durationMinutes: 25,
      blocks: [
        {
          id: 'interlock-002',
          title: 'The Interlock: Plan Before You Ink',
          theme: 'Structure + Clarity',
          skills: {
            physical: { name: 'Riffle Shuffle', description: 'Perfect distribution.' },
            mental: { name: 'Outlining', description: 'Structure before flesh.' }
          },
          cards: [
            { front: 'Scenario: Explain Drop Frame to a novice.', back: 'Action: Write headers only.' },
            { front: 'Scenario: Single most important thing?', back: 'Action: Thesis statement.' },
            { front: 'Scenario: How to teach this?', back: 'Action: Numbered steps 1-5.' }
          ]
        }
      ]
    },
    {
      id: 'grind',
      displayName: 'Grind',
      durationMinutes: 45,
      blocks: [
        {
          id: 'hidden-003',
          title: 'The Hidden Move',
          theme: 'Subtlety',
          skills: {
            physical: { name: 'The Glide', description: 'Invisible control.' },
            mental: { name: 'You-Focused Writing', description: 'Hide the ego.' }
          },
          cards: [
            { front: 'Scenario: Selling to a skeptical prospect.', back: 'Action: Rewrite from THEIR perspective.' },
            { front: 'Scenario: 5 Value Props.', back: 'Action: Deal bottom card. Replace "We" with "You".' },
            { front: 'Scenario: Pick the strongest.', back: 'Action: Circle it. Copy the pattern.' }
          ]
        }
      ]
    }
  ]
};
