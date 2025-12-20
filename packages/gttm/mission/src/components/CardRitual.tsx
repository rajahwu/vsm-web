'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { StorySession } from '@gttm/story';
import { CodexViewer } from './CodexViewer';
import { PrimePanel } from './PrimePanel';
import { WorkSurface } from './WorkSurface';

import type { MissionCard, RitualPhase } from '../registry';
import { getTransmissionNode } from '../lib/story-registry';
import { getCodexEntry } from '@gttm/codex';
import { useRitualSound, type PhaseId } from '@ritual/ui-lib';

interface CardRitualProps {
  card: MissionCard;
  onComplete: (payload: { cardId: string; output?: string }) => void;
  onCancel?: () => void;
  haptics?: boolean;
}

const phaseToAudioPhase: Record<RitualPhase, PhaseId> = {
  codex: 'plan',
  instruction: 'plan',
  prime: 'sprint',
  produce: 'reflect',
};

function useHaptics(enabled: boolean) {
  return useCallback(() => {
    if (!enabled) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  }, [enabled]);
}

export const CardRitual: React.FC<CardRitualProps> = ({
  card,
  onComplete,
  onCancel,
  haptics = true,
}) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<RitualPhase[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const currentPhase = useMemo(
    () => card.phases[phaseIndex],
    [card.phases, phaseIndex]
  );

  const triggerHaptics = useHaptics(haptics);
  const audioPhase = phaseToAudioPhase[currentPhase];
  const audio = useRitualSound({
    phaseId: audioPhase,
    isRunning: audioEnabled,
  });

  useEffect(() => {
    triggerHaptics();
  }, [currentPhase, triggerHaptics]);

  function advancePhase(output?: string) {
    const nextIndex = phaseIndex + 1;
    const phase = card.phases[phaseIndex];

    if (phase && !completedPhases.includes(phase)) {
      setCompletedPhases(prev => [...prev, phase]);
    }

    if (nextIndex < card.phases.length) {
      setPhaseIndex(nextIndex);
      return;
    }

    onComplete({ cardId: card.id, output });
  }

  function handleCancel() {
    if (onCancel) onCancel();
  }

  if (!currentPhase) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950 text-zinc-400">
        Loading ritual phase...
      </div>
    );
  }

  const audioControls = (
    <div className="fixed top-4 right-4 z-50 bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 shadow-lg">
      <div className="flex items-center gap-2 mb-1">
        <span className="uppercase tracking-widest text-[10px] text-zinc-500">
          Audio
        </span>
        <button
          className="text-zinc-400 hover:text-zinc-200"
          onClick={() => setAudioEnabled(prev => !prev)}
        >
          {audioEnabled ? 'On' : 'Off'}
        </button>
        <button
          className="text-zinc-400 hover:text-zinc-200"
          onClick={() => audio.setIsMuted(!audio.isMuted)}
        >
          {audio.isMuted ? 'Muted' : 'Mute'}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="text-zinc-400 hover:text-zinc-200"
          onClick={audio.prevTrack}
          disabled={audio.availableTracks.length <= 1}
        >
          ◀
        </button>
        <div className="max-w-[160px] truncate text-zinc-200">
          {audio.currentTrack?.title ?? 'No track'}
        </div>
        <button
          className="text-zinc-400 hover:text-zinc-200"
          onClick={audio.nextTrack}
          disabled={audio.availableTracks.length <= 1}
        >
          ▶
        </button>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] text-zinc-500 uppercase">Vol</span>
        <input
          className="w-24"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={audio.volume}
          onChange={(event) => audio.setVolume(Number(event.target.value))}
        />
      </div>
    </div>
  );

  switch (currentPhase) {
    case 'codex':
      return (
        <>
          {audioControls}
          <CodexViewer
            slug={card.lessonRef?.slug}
            getEntry={getCodexEntry}
            onContinue={() => advancePhase()}
            onSkip={() => advancePhase()}
          />
        </>
      );

    case 'instruction': {
      const slug = card.lessonRef?.slug;
      if (!slug) {
        advancePhase();
        return null;
      }

      const node = getTransmissionNode(slug);
      if (!node) {
        advancePhase();
        return null;
      }

      return (
        <>
          {audioControls}
          <StorySession
            startNodeId={node.id}
            storyNodes={[node]}
            onTriggerTraining={() => advancePhase()}
            onComplete={() => advancePhase()}
          />
        </>
      );
    }

    case 'prime':
      return (
        <>
          {audioControls}
          <PrimePanel
            card={card}
            onComplete={() => advancePhase()}
          />
        </>
      );

    case 'produce':
      return (
        <>
          {audioControls}
          <WorkSurface
            card={card}
            onShip={async (output: string) => {
              advancePhase(output);
            }}
            onCancel={handleCancel}
          />
        </>
      );

    default:
      onComplete({ cardId: card.id });
      return null;
  }
};
