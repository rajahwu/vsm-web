import { describe, it, expect } from 'vitest';
import { PHASES } from '../phases';

describe('ritual phases', () => {
  it('defines the 5 core ritual phases', () => {
    expect(PHASES).toHaveLength(5);
    const ids = PHASES.map(p => p.id);
    expect(ids).toEqual(['plan', 'sprint', 'rest', 'reflect', 'recover']);
  });

  it('has valid durations for all phases', () => {
    PHASES.forEach(phase => {
      expect(phase.duration).toBeGreaterThan(0);
      expect(typeof phase.duration).toBe('number');
    });
  });

  it('contains required UI metadata for every phase', () => {
    PHASES.forEach(phase => {
      expect(phase.color).toBeDefined();
      expect(phase.textColor).toBeDefined();
      expect(phase.borderColor).toBeDefined();
      expect(phase.gesture).toBeDefined();
      expect(phase.prompt).toBeDefined();
    });
  });
});
