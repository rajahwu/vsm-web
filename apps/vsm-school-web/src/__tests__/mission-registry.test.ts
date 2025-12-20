import { describe, it, expect } from 'vitest';
import { missionRegistry } from '@gttm/mission';

const windowIds = ['sprint', 'standard', 'grind'] as const;

describe('mission registry', () => {
  it('defines the expected training windows', () => {
    const ids = missionRegistry.trainingWindows.map(window => window.id);
    expect(ids).toEqual(windowIds);
  });

  it('contains at least one block per window', () => {
    for (const window of missionRegistry.trainingWindows) {
      expect(window.blocks.length).toBeGreaterThan(0);
    }
  });

  it('contains cards for every block', () => {
    const emptyBlocks = missionRegistry.trainingWindows.flatMap(window =>
      window.blocks.filter(block => block.cards.length === 0)
    );

    expect(emptyBlocks).toEqual([]);
  });
});
