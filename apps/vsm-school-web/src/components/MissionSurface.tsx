'use client';

import React, { useState } from 'react';

import { CodexViewer } from './CodexViewer';
import { PrimePanel } from './PrimePanel';
import { WorkSurface } from './WorkSurface';
import { MissionSuccess } from './MissionSuccess';

import type {
  MissionTrackId,
  MissionCardId,
  MissionCard,
  RitualPhase,
} from '@/lib/registry';

import {
  MISSION_REGISTRY as MISSION_TRACKS,
  CARD_REGISTRY as MISSION_CARDS,
} from '@/lib/registry';

/* =========================
   Mission State
   ========================= */

interface MissionState {
  selectedTrackId?: MissionTrackId;
  selectedCardId?: MissionCardId;
  phaseIndex: number;
}

/* =========================
   MissionSurface
   ========================= */

export const MissionSurface: React.FC = () => {
  const [state, setState] = useState<MissionState>({
    phaseIndex: 0,
  });

  /* =========================
     Derived Data (Authoritative)
     ========================= */

  const selectedCard: MissionCard | undefined =
    state.selectedCardId
      ? MISSION_CARDS[state.selectedCardId]
      : undefined;

  const currentPhase: RitualPhase | undefined =
    selectedCard?.phases[state.phaseIndex];

  /* =========================
     State Transitions
     ========================= */

  function startTrack(trackId: MissionTrackId) {
    const track = MISSION_TRACKS[trackId];
    const firstCardId = track.cards[0];

    setState({
      selectedTrackId: trackId,
      selectedCardId: firstCardId,
      phaseIndex: 0,
    });
  }

  function advancePhase() {
    if (!selectedCard) return;

    const nextIndex = state.phaseIndex + 1;

    if (nextIndex < selectedCard.phases.length) {
      setState(prev => ({
        ...prev,
        phaseIndex: nextIndex,
      }));
    } else {
      // End of ritual → archive
      setState(prev => ({
        ...prev,
        phaseIndex: selectedCard.phases.length, // sentinel
      }));
    }
  }

  function resetToTrackSelect() {
    setState({
      phaseIndex: 0,
    });
  }

  /* =========================
     Render Guards
     ========================= */

  // No card yet → Track selection is the entry point
  if (!selectedCard || !currentPhase) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">Select Track</h2>
        {Object.values(MISSION_TRACKS)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map(track => (
            <button
              key={track.id}
              className="block w-full text-left p-3 mb-2 border rounded"
              onClick={() => startTrack(track.id)}
            >
              <div className="font-semibold">{track.title}</div>
              <div className="text-sm text-muted-foreground">
                {track.description}
              </div>
            </button>
          ))}
      </div>
    );
  }

  /* =========================
     Phase Router (Single Source of Truth)
     ========================= */

  switch (currentPhase) {
    /* -------- CODEX / INSTRUCTION -------- */
    case 'codex':
    case 'instruction': {
      const slug = selectedCard.lessonRef?.slug;

      return (
        <CodexViewer
          slug={slug}
          onContinue={advancePhase}
          onSkip={advancePhase}
        />
      );
    }

    /* -------- PRIME -------- */
    case 'prime':
      return (
        <PrimePanel
          card={selectedCard}
          onComplete={advancePhase}
        />
      );

    /* -------- PRODUCE -------- */
    case 'produce':
      return (
        <WorkSurface
          card={selectedCard}
          onShip={async (_output: string) => {
            // Persistence happens here later (Supabase)
            advancePhase();
          }}
        />
      );

    /* -------- ARCHIVE / SUCCESS -------- */
    default:
      return (
        <MissionSuccess
          cardTitle={selectedCard.title}
          literacyGain={25}
          newTotalLiteracy={50}
          onContinue={resetToTrackSelect}
        />
      );
  }
};
