export type GenesisRequirement = {
  id: string;
  title: string;
  category: 'Primitive' | 'Sentence' | 'Protocol' | 'Analysis';
  drill: string;
  symbol: string;
};

export const GENESIS_REQUIREMENTS: GenesisRequirement[] = [
  // 1. The Primitives
  {
    id: '01',
    title: 'The Dot',
    category: 'Primitive',
    drill: 'Draw 10 dots randomly. Connect them to form a network.',
    symbol: '•'
  },
  {
    id: '02',
    title: 'The Rectangle',
    category: 'Primitive',
    drill: 'Draw a box. Write a single verb inside (The Atom of Work).',
    symbol: '▭'
  },
  {
    id: '03',
    title: 'The Diamond',
    category: 'Primitive',
    drill: 'Draw a gate. Label it "Approved?". Draw Yes/No exits.',
    symbol: '◇'
  },
  {
    id: '04',
    title: 'The Arrow',
    category: 'Primitive',
    drill: 'Draw a curved arrow returning to its start (The Loop).',
    symbol: '→'
  },

  // 2. The Sentences
  {
    id: '05',
    title: 'Logic Flow (Card A)',
    category: 'Sentence',
    drill: 'Map "Client Request": Input → Gate → Action.',
    symbol: 'A'
  },
  {
    id: '06',
    title: 'The Swimlane (Card B)',
    category: 'Sentence',
    drill: 'Draw "You" vs "Core" lanes. Circle the Handoff Risk.',
    symbol: 'B'
  },
  {
    id: '07',
    title: 'Velocity Loop (Card C)',
    category: 'Sentence',
    drill: 'Map Content → Data → Insight. Mark the (+) sign.',
    symbol: 'C'
  },

  // 3. The Protocols
  {
    id: '08',
    title: 'Speed Run',
    category: 'Protocol',
    drill: 'Execute one random Card (A, B, or C) in under 60 seconds.',
    symbol: '⚡'
  },
  {
    id: '09',
    title: 'Identify the Actor',
    category: 'Analysis',
    drill: 'Point to a real-world system. Find the "Dot".',
    symbol: '🔍'
  },
  {
    id: '10',
    title: 'Trace the Consequence',
    category: 'Analysis',
    drill: 'Point to a real-world failure. Find the missing "Arrow".',
    symbol: '📉'
  }
];
