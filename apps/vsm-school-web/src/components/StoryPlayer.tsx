'use client';

import React, { useState, useEffect } from 'react';

/* =========================
   Types (UI-only)
   ========================= */

export type EntityId = 'mother' | 'watcher' | 'machinist' | 'runner';

export interface Entity {
  id: EntityId;
  name: string;
  title: string;
  status: string;
  integrity: number;
}

export interface Choice {
  id: string;
  text: string;
  risk?: string;
}

export interface StoryNode {
  id: string;
  speaker: 'narrator' | EntityId;
  text: string;
  choices?: Choice[];
  isEnding?: boolean;
  endingType?: 'victory' | 'defeat' | 'bittersweet';
  endingName?: string;
}

/* =========================
   Props
   ========================= */

interface StoryPlayerProps {
  node: StoryNode;
  entities: Record<EntityId, Entity>;
  onChoose: (choiceId: string) => void;
  onRestart?: () => void;
}

/* =========================
   Speaker Presentation
   ========================= */

const speakerColors: Record<string, string> = {
  narrator: '#888888',
  mother: '#c084fc',
  watcher: '#60a5fa',
  machinist: '#f97316',
  runner: '#22d3ee',
};

const speakerNames: Record<string, string> = {
  narrator: 'SYSTEM',
  mother: 'THE MOTHER',
  watcher: 'THE WATCHER',
  machinist: 'THE MACHINIST',
  runner: 'THE RUNNER',
};

/* =========================
   Entity Panel
   ========================= */

function EntityPanel({ entity }: { entity: Entity }) {
  const getColor = (i: number) =>
    i > 60 ? '#4ade80' : i > 30 ? '#fbbf24' : '#ef4444';

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 mb-2">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold text-gray-200 text-sm">{entity.name}</div>
          <div className="text-xs text-gray-500">{entity.title}</div>
        </div>
        <div
          className="text-lg font-bold"
          style={{ color: getColor(entity.integrity) }}
        >
          {entity.integrity}%
        </div>
      </div>

      <div className="h-1 bg-gray-700 rounded mt-2 overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${entity.integrity}%`,
            backgroundColor: getColor(entity.integrity),
          }}
        />
      </div>

      <div className="text-xs text-gray-600 mt-1 italic">
        {entity.status}
      </div>
    </div>
  );
}

/* =========================
   StoryPlayer
   ========================= */

export function StoryPlayer({
  node,
  entities,
  onChoose,
  onRestart,
}: StoryPlayerProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showChoices, setShowChoices] = useState(false);

  /* --- Typewriter Effect --- */
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    setShowChoices(false);

    let index = 0;
    const text = node.text;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setTimeout(() => setShowChoices(true), 300);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [node.id]);

  const skipTyping = () => {
    if (!isTyping) return;
    setDisplayedText(node.text);
    setIsTyping(false);
    setTimeout(() => setShowChoices(true), 100);
  };

  const speakerColor = speakerColors[node.speaker] || '#888';
  const speakerName =
    speakerNames[node.speaker] || node.speaker.toUpperCase();

  /* =========================
     Render
     ========================= */

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-4 font-mono">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-xl font-bold text-red-500 tracking-widest">
          STORY PROTOCOL
        </h1>
        <div className="text-xs text-gray-600 tracking-wider mt-1">
          INSTRUCTIONAL NARRATIVE
        </div>
      </header>

      <div className="max-w-4xl mx-auto grid grid-cols-4 gap-4">
        {/* Left – Entities */}
        <aside className="col-span-1">
          <div className="text-xs text-gray-600 tracking-wider mb-2">
            ENTITY STATUS
          </div>
          {Object.values(entities).map(e => (
            <EntityPanel key={e.id} entity={e} />
          ))}
        </aside>

        {/* Center – Narrative */}
        <main className="col-span-3 bg-gray-900 border border-gray-700 rounded-xl p-6 min-h-96">
          <div
            className="text-xs font-bold tracking-widest mb-4"
            style={{ color: speakerColor }}
          >
            [{speakerName}]
          </div>

          <div
            onClick={skipTyping}
            className="whitespace-pre-wrap leading-relaxed cursor-pointer"
            style={{ minHeight: '200px' }}
          >
            {displayedText}
            {isTyping && <span className="animate-pulse">▊</span>}
          </div>

          {/* Ending */}
          {node.isEnding && showChoices && (
            <div
              className={`text-center p-6 mt-6 rounded-lg border ${
                node.endingType === 'victory'
                  ? 'bg-green-950 border-green-500'
                  : node.endingType === 'defeat'
                  ? 'bg-red-950 border-red-500'
                  : 'bg-yellow-950 border-yellow-500'
              }`}
            >
              <div className="text-xs text-gray-500 tracking-widest mb-2">
                PROTOCOL COMPLETE
              </div>

              <div
                className={`text-2xl font-bold ${
                  node.endingType === 'victory'
                    ? 'text-green-400'
                    : node.endingType === 'defeat'
                    ? 'text-red-400'
                    : 'text-yellow-400'
                }`}
              >
                {node.endingName}
              </div>

              {onRestart && (
                <button
                  onClick={onRestart}
                  className="mt-4 px-6 py-2 border border-gray-600 rounded hover:bg-gray-800 transition-colors"
                >
                  RESTART STORY
                </button>
              )}
            </div>
          )}

          {/* Choices */}
          {!node.isEnding && showChoices && node.choices && (
            <div className="mt-6 space-y-2">
              {node.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => onChoose(choice.id)}
                  className="w-full text-left p-3 border border-gray-700 rounded hover:border-gray-500 hover:bg-gray-800 transition-all flex justify-between items-center"
                >
                  <span>{choice.text}</span>
                  {choice.risk && (
                    <span className="text-xs text-red-400">
                      Risk: {choice.risk}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="text-center mt-8 pt-4 border-t border-gray-800">
        <div className="text-xs text-gray-700 tracking-wider">
          INSTRUCTION LAYER • NO EXECUTION
        </div>
      </footer>
    </div>
  );
}
