'use client';

import React, { useState } from 'react';

import { CodexViewer } from './CodexViewer';
import { StorySession } from './StorySession';
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

import { getTransmissionNode } from '@/lib/registry/story';

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
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        {/* Header */}
        <header className="border-b border-zinc-800 px-6 py-8">
          <h1 className="text-3xl font-black uppercase tracking-tight text-teal-500">
            Select Mission Track
          </h1>
          <p className="text-sm text-zinc-500 mt-2 uppercase tracking-wider">
            Choose your path to visual systems mastery
          </p>
        </header>

        {/* Track Cards */}
        <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
          <div className="grid gap-4 md:grid-cols-1">
            {Object.values(MISSION_TRACKS)
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map(track => (
                <button
                  key={track.id}
                  className="group text-left p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-teal-600 hover:bg-zinc-900/80 transition-all duration-200"
                  onClick={() => startTrack(track.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-teal-400 transition-colors">
                        {track.title}
                      </h3>
                      <p className="text-sm text-zinc-400 mb-4">
                        {track.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-zinc-600 uppercase tracking-wider">
                        <span>{track.cards.length} Cards</span>
                        <span>•</span>
                        <span>Track {(track.order ?? 0) + 1}</span>
                      </div>
                    </div>
                    <div className="text-teal-600 group-hover:text-teal-400 transition-colors">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-800 px-6 py-4">
          <p className="text-xs text-zinc-600 text-center uppercase tracking-wider">
            Complete tracks sequentially for optimal mastery
          </p>
        </footer>
      </div>
    );
  }

  /* =========================
     Phase Router (Single Source of Truth)
     ========================= */

  switch (currentPhase) {
    /* -------- CODEX (Reference Material) -------- */
    case 'codex': {
      const slug = selectedCard.lessonRef?.slug;

      return (
        <CodexViewer
          slug={slug}
          onContinue={advancePhase}
          onSkip={advancePhase}
        />
      );
    }

    /* -------- INSTRUCTION (Story Transmission) -------- */
    case 'instruction': {
      const slug = selectedCard.lessonRef?.slug;
      if (!slug) {
        // No transmission, skip to prime
        advancePhase();
        return null;
      }

      const node = getTransmissionNode(slug);
      if (!node) {
        // Transmission not found, skip to prime
        advancePhase();
        return null;
      }

      return (
        <StorySession
          startNodeId={node.id}
          storyNodes={[node]}
          onTriggerTraining={(cardId) => {
            // Card triggered from story, advance to prime phase
            advancePhase();
          }}
          onComplete={() => {
            // Story complete, advance to prime
            advancePhase();
          }}
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
