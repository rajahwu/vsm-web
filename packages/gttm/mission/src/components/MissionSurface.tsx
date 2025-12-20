'use client';

import React, { useMemo, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

import { CardRitual } from './CardRitual';
import { MissionSuccess } from './MissionSuccess';
import { FlowErrorBoundary } from './FlowErrorBoundary';
import { useMissionProgress } from '../hooks/useMissionProgress';

import type {
  MissionTrackId,
  MissionCardId,
  MissionCard,
} from '../registry';

import {
  MISSION_REGISTRY as MISSION_TRACKS,
  CARD_REGISTRY as MISSION_CARDS,
} from '../registry';

/* =========================
   Types
   ========================= */

type MissionStage = 'pulse' | 'track' | 'ritual' | 'success';

type MissionWindowId = 'sprint' | 'standard' | 'grind';

type MissionState = {
  stage: MissionStage;
  selectedWindow?: MissionWindowId;
  selectedTrackId?: MissionTrackId;
  selectedCardId?: MissionCardId;
  lastCompletedCardId?: MissionCardId;
  nextCardId?: MissionCardId;
};

const MISSION_WINDOWS: Array<{
  id: MissionWindowId;
  label: string;
  minutes: number;
  description: string;
}> = [
  {
    id: 'sprint',
    label: 'Sprint',
    minutes: 10,
    description: 'Short burn for tight execution windows.',
  },
  {
    id: 'standard',
    label: 'Standard',
    minutes: 25,
    description: 'Default training pace for most rituals.',
  },
  {
    id: 'grind',
    label: 'Grind',
    minutes: 45,
    description: 'Deep focus for longer drills and reflection.',
  },
];

/* =========================
   MissionSurface
   ========================= */

interface MissionSurfaceProps {
  supabase: SupabaseClient;
  userId?: string;
}

export const MissionSurface: React.FC<MissionSurfaceProps> = ({ supabase, userId }) => {
  const [state, setState] = useState<MissionState>({
    stage: 'pulse',
  });

  const { completedCardIds, literacy, isLoading } = useMissionProgress(supabase, userId);

  const selectedCard: MissionCard | undefined = useMemo(() => {
    if (!state.selectedCardId) return undefined;
    return MISSION_CARDS[state.selectedCardId];
  }, [state.selectedCardId]);

  function getFirstIncompleteCard(trackId: MissionTrackId) {
    const track = MISSION_TRACKS[trackId];

    for (const cardId of track.cards) {
      if (!completedCardIds.has(cardId)) return cardId;
    }

    return track.cards[0];
  }

  function getNextCardId(trackId: MissionTrackId, currentCardId: MissionCardId) {
    const track = MISSION_TRACKS[trackId];
    const currentIndex = track.cards.indexOf(currentCardId);
    if (currentIndex === -1) return undefined;

    const nextCardId = track.cards[currentIndex + 1];
    return nextCardId;
  }

  async function markCardComplete(trackId: MissionTrackId, cardId: MissionCardId, output?: string) {
    // Ship to Supabase (matching Training page pattern)
    const logEntry = {
      userId,
      trackId,
      cardId,
      outputSummary: output || 'Ritual completed',
      timestamp: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from('atoms').insert({
        type: 'vsm_session',
        val: logEntry
      });
      if (error) throw error;
    } catch (err) {
      console.error('Failed to persist progress:', err);
    }
  }

  function handleSelectWindow(windowId: MissionWindowId) {
    setState({
      stage: 'track',
      selectedWindow: windowId,
    });
  }

  function handleSelectTrack(trackId: MissionTrackId) {
    const nextCardId = getFirstIncompleteCard(trackId);

    setState(prev => ({
      ...prev,
      stage: 'ritual',
      selectedTrackId: trackId,
      selectedCardId: nextCardId,
      nextCardId: undefined,
      lastCompletedCardId: undefined,
    }));
  }

  async function handleRitualComplete(payload: { cardId: string; output?: string }) {
    if (!state.selectedTrackId || !state.selectedCardId) return;

    const trackId = state.selectedTrackId;
    const cardId = state.selectedCardId;
    const nextCardId = getNextCardId(trackId, cardId);

    await markCardComplete(trackId, cardId, payload.output);

    setState(prev => ({
      ...prev,
      stage: 'success',
      lastCompletedCardId: cardId,
      nextCardId,
    }));
  }

  function handleSuccessContinue() {
    if (!state.selectedTrackId) {
      setState({ stage: 'track' });
      return;
    }

    if (state.nextCardId) {
      setState(prev => ({
        ...prev,
        stage: 'ritual',
        selectedCardId: state.nextCardId,
        nextCardId: undefined,
        lastCompletedCardId: undefined,
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      stage: 'track',
      selectedCardId: undefined,
      nextCardId: undefined,
      lastCompletedCardId: undefined,
    }));
  }

  /* =========================
     Render
     ========================= */

  if (isLoading) {
    return (
      <div id="loading-core" className="min-h-screen bg-zinc-950 flex items-center justify-center text-teal-500 font-mono text-sm tracking-widest animate-pulse">
        SYNCHRONIZING WITH CORE...
      </div>
    );
  }

  let content: React.ReactNode = null;

  if (state.stage === 'pulse') {
    content = (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <header className="border-b border-zinc-800 px-6 py-8">
          <h1 className="text-3xl font-black uppercase tracking-tight text-teal-500">
            Choose Time Window
          </h1>
          <p className="text-sm text-zinc-500 mt-2 uppercase tracking-wider">
            Set the pace before you enter the ritual
          </p>
        </header>

        <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
          <div className="grid gap-4">
            {MISSION_WINDOWS.map(window => (
              <button
                key={window.id}
                className="group text-left p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-teal-600 hover:bg-zinc-900/80 transition-all duration-200"
                onClick={() => handleSelectWindow(window.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-teal-400 transition-colors">
                      {window.label}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-4">
                      {window.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-zinc-600 uppercase tracking-wider">
                      <span>{window.minutes} minutes</span>
                      <span>•</span>
                      <span>Mission window</span>
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

        <footer className="border-t border-zinc-800 px-6 py-4">
          <p className="text-xs text-zinc-600 text-center uppercase tracking-wider">
            Adjust windows anytime from Mission Select
          </p>
        </footer>
      </div>
    );
  }

  if (state.stage === 'track') {
    content = (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <header className="border-b border-zinc-800 px-6 py-8">
          <h1 className="text-3xl font-black uppercase tracking-tight text-teal-500">
            Select Mission Track
          </h1>
          <p className="text-sm text-zinc-500 mt-2 uppercase tracking-wider">
            Choose your path to visual systems mastery
          </p>
        </header>

        <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
          <div className="grid gap-4 md:grid-cols-1">
            {Object.values(MISSION_TRACKS)
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map(track => {
                const progressPercent = literacy[track.id] || 0;

                return (
                  <button
                    key={track.id}
                    className="group text-left p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-teal-600 hover:bg-zinc-900/80 transition-all duration-200"
                    onClick={() => handleSelectTrack(track.id)}
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
                          <span>{track.cards.length} cards</span>
                          <span>•</span>
                          <span>{progressPercent}% complete</span>
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
                );
              })}
          </div>
        </div>

        <footer className="border-t border-zinc-800 px-6 py-4">
          <p className="text-xs text-zinc-600 text-center uppercase tracking-wider">
            Complete tracks sequentially for optimal mastery
          </p>
        </footer>
      </div>
    );
  }

  if (state.stage === 'ritual' && selectedCard) {
    content = (
      <CardRitual
        card={selectedCard}
        onComplete={handleRitualComplete}
        onCancel={() =>
          setState(prev => ({
            ...prev,
            stage: 'track',
            selectedCardId: undefined,
          }))
        }
      />
    );
  }

  if (state.stage === 'success' && state.selectedTrackId && state.lastCompletedCardId) {
    const totalCount = MISSION_TRACKS[state.selectedTrackId].cards.length;
    const literacyGain = Math.round(100 / totalCount);
    const newTotal = literacy[state.selectedTrackId] || 0;
    const nextCardTitle = state.nextCardId
      ? MISSION_CARDS[state.nextCardId].title
      : undefined;

    content = (
      <MissionSuccess
        cardTitle={MISSION_CARDS[state.lastCompletedCardId].title}
        literacyGain={literacyGain}
        newTotalLiteracy={newTotal}
        nextCardTitle={nextCardTitle}
        onContinue={handleSuccessContinue}
      />
    );
  }

  return (
    <FlowErrorBoundary
      onReset={() =>
        setState({
          stage: 'pulse',
        })
      }
    >
      {content}
    </FlowErrorBoundary>
  );
};
