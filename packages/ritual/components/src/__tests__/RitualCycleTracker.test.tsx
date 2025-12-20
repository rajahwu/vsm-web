/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { RitualCycleTracker } from '../components/RitualCycleTracker';
import React from 'react';

// Mock audio context since jsdom doesn't support it
global.AudioContext = vi.fn().mockImplementation(() => ({
  state: 'suspended',
  resume: vi.fn(),
  createOscillator: vi.fn(),
  createGain: vi.fn(),
  destination: {},
}));

describe('RitualCycleTracker', () => {
  it('renders the initial state correctly', () => {
    render(<RitualCycleTracker />);
    
    // Check for main heading
    expect(screen.getByText(/Ritual Cycle/i)).toBeInTheDocument();
    
    // Check for initial phase
    expect(screen.getByText(/Phase 1 of 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Plan/i)).toBeInTheDocument();
    
    // Check for controls
    expect(screen.getByRole('button', { name: /Start/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Skip/i })).toBeInTheDocument();
  });
});
