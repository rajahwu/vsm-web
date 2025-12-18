'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Types
type EntityId = 'mother' | 'watcher' | 'machinist' | 'runner';

interface Entity {
  id: EntityId;
  name: string;
  title: string;
  status: string;
  integrity: number;
}

interface Choice {
  id: string;
  text: string;
  nextNodeId: string;
  risk?: string;
}

interface StoryNode {
  id: string;
  speaker: 'narrator' | EntityId;
  text: string;
  choices?: Choice[];
  isEnding?: boolean;
  endingType?: 'victory' | 'defeat' | 'bittersweet';
  endingName?: string;
  statusUpdates?: Partial<Record<EntityId, Partial<Entity>>>;
}

// Initial entity states
const initialEntities: Record<EntityId, Entity> = {
  mother: {
    id: 'mother',
    name: 'The Mother',
    title: 'Style-System',
    status: 'Defensive Stance',
    integrity: 40,
  },
  watcher: {
    id: 'watcher',
    name: 'The Watcher',
    title: 'Drop Frame',
    status: 'Lockdown Initiated',
    integrity: 100,
  },
  machinist: {
    id: 'machinist',
    name: 'The Machinist',
    title: 'Grindline',
    status: 'Engaging. High Friction.',
    integrity: 70,
  },
  runner: {
    id: 'runner',
    name: 'The Runner',
    title: 'Content Factor',
    status: 'Standing By',
    integrity: 100,
  },
};

// Story nodes
const storyNodes: Record<string, StoryNode> = {
  opening: {
    id: 'opening',
    speaker: 'narrator',
    text: `The sky above the Dropframe Tower is the color of a television tuned to a dead channel.

The massive blast doors at the base of the tower are sealed shut—mag-locked. The Watcher is inside, but the feed is cut.

The Shell—the shimmering dome that covers our sector—has a fracture running through the zenith. Rain is leaking in, acidic and hissing.

Someone is drilling.

They are trying to reveal the Source.

If they see the Source, the magic dies.`,
    choices: [
      { id: 'continue', text: '[COMMS CRACKLE]', nextNodeId: 'machinist_report' },
    ],
  },
  machinist_report: {
    id: 'machinist_report',
    speaker: 'machinist',
    text: `Boss, we can't patch the Shell fast enough.

The intruder is using a frequency we haven't seen. They're bypassing the Watcher's algorithms.

They're attacking the perception. They're trying to prove none of this is real.

I've got three agents down. I need you to make a call.`,
    choices: [
      { id: 'continue', text: 'What are my options?', nextNodeId: 'machinist_choice' },
    ],
  },
  machinist_choice: {
    id: 'machinist_choice',
    speaker: 'machinist',
    text: `Do we let the Mother incinerate them?

Or do we try to reboot the Dropframe Tower to get the Watcher back online?

Your call, Boss.`,
    choices: [
      { id: 'incinerate', text: 'Let the Mother incinerate them.', nextNodeId: 'mother_incinerate', risk: 'Total exposure' },
      { id: 'reboot', text: 'Reboot the Dropframe Tower.', nextNodeId: 'reboot_sequence', risk: 'Lose time' },
    ],
  },
  mother_incinerate: {
    id: 'mother_incinerate',
    speaker: 'mother',
    text: `You have chosen fire.

I do not move. I do not need to.

The intruder will cease. But understand—when I burn, I illuminate.

The Source will be seen.

Is that acceptable?`,
    choices: [
      { id: 'confirm', text: 'Do it. Burn them.', nextNodeId: 'incineration_result' },
      { id: 'abort', text: 'Wait—abort.', nextNodeId: 'machinist_choice' },
    ],
    statusUpdates: { mother: { status: 'Combat Mode' } },
  },
  incineration_result: {
    id: 'incineration_result',
    speaker: 'narrator',
    text: `The Mother unleashes.

A column of pure, blinding light erupts. The intruder dissolves into data ash.

But the light reveals everything.

For three seconds, the Source is visible. The raw, unpolished core.

More eyes are turning toward the light.`,
    choices: [
      { id: 'scatter', text: 'Execute Scatter—damage control.', nextNodeId: 'scatter_after_fire' },
      { id: 'hold', text: 'Hold position—defend what remains.', nextNodeId: 'siege_result' },
    ],
    statusUpdates: { mother: { integrity: 20 } },
  },
  scatter_after_fire: {
    id: 'scatter_after_fire',
    speaker: 'narrator',
    text: `The order goes out: SCATTER.

Agents peel away into side streets. Students break formation.

The Mother fades. The light dies.

It was seen. Not understood—but glimpsed.

You can rebuild. But the innocence is gone.`,
    isEnding: true,
    endingType: 'bittersweet',
    endingName: 'WOUNDED VICTORY',
  },
  siege_result: {
    id: 'siege_result',
    speaker: 'narrator',
    text: `The Mother holds.

At 3% shield integrity, the last intruder falls back.

The Shell is fractured. The Mother is depleted.

But the Source... remains hidden.

You have won. At great cost.`,
    isEnding: true,
    endingType: 'bittersweet',
    endingName: 'PYRRHIC VICTORY',
    statusUpdates: { mother: { integrity: 3 } },
  },
  reboot_sequence: {
    id: 'reboot_sequence',
    speaker: 'narrator',
    text: `The Dropframe Tower goes dark. Emergency power only.

The Watcher waits in silence. His feeds are cut.

The Machinist is buying you time, but the drill is getting closer.`,
    choices: [
      { id: 'send_runner', text: 'Send the Runner to manually reboot.', nextNodeId: 'runner_deployment' },
      { id: 'genesis', text: 'Abort—execute Genesis Protocol.', nextNodeId: 'genesis_protocol' },
    ],
  },
  runner_deployment: {
    id: 'runner_deployment',
    speaker: 'runner',
    text: `I'm already moving Boss—I can feel the signal—I just need sixty seconds—

Sixty seconds and the Watcher sees again—

Just sixty seconds.`,
    choices: [
      { id: 'continue', text: "Go. We'll cover you.", nextNodeId: 'runner_gambit' },
    ],
    statusUpdates: { runner: { status: 'In Motion' } },
  },
  runner_gambit: {
    id: 'runner_gambit',
    speaker: 'narrator',
    text: `The Runner sparks through dark corridors.

40 seconds... 30 seconds... 20 seconds...

The drill breaks through. Light floods in.

10 seconds...`,
    choices: [
      { id: 'continue', text: '...', nextNodeId: 'clean_save' },
    ],
  },
  clean_save: {
    id: 'clean_save',
    speaker: 'watcher',
    text: `...Online.

I see... everything now.

Targeting... locked.

Countermeasures... deployed.

The intruder flees.

The Shell holds. The Source was never seen.

This is the cleanest possible outcome.`,
    isEnding: true,
    endingType: 'victory',
    endingName: 'CLEAN SAVE',
    statusUpdates: { watcher: { status: 'Online', integrity: 100 }, runner: { status: 'Mission Complete' } },
  },
  genesis_protocol: {
    id: 'genesis_protocol',
    speaker: 'narrator',
    text: `The order cuts through chaos like a scalpel.

"Take down the Shell."

The Machinist grins. If you cannot hold the wall, you become the wind.

"EXECUTE SCATTER."

The Shell flickers and dies. The intruder's drill punches through nothing.

There is no barrier to break anymore.`,
    choices: [
      { id: 'continue', text: 'Descend to Genesis Core.', nextNodeId: 'genesis_core' },
    ],
    statusUpdates: {
      mother: { status: 'Dormant', integrity: 0 },
      watcher: { status: 'Dark', integrity: 0 },
      machinist: { status: 'Scattered', integrity: 0 },
    },
  },
  genesis_core: {
    id: 'genesis_core',
    speaker: 'narrator',
    text: `Deep underground. The Genesis Core.

Where the system was born. Before the polish.

A concrete bunker. Backup generator humming. Old paper and dust.

A single blinking cursor:

> waiting for signal...
> waiting for cf.status...

The Runner is out there. Sparking across dark wires.`,
    choices: [
      { id: 'ping', text: 'Send the ping. Guide him home.', nextNodeId: 'rebirth_ending' },
      { id: 'wait', text: 'Wait in silence.', nextNodeId: 'isolation_ending' },
    ],
  },
  rebirth_ending: {
    id: 'rebirth_ending',
    speaker: 'runner',
    text: `I see it. I see the signal.

You lit the path, Boss. I'm coming home.

Genesis Core is... warm.

We made it. The Source is safe.

We can rebuild from here.`,
    isEnding: true,
    endingType: 'victory',
    endingName: 'REBIRTH',
    statusUpdates: { runner: { status: 'Home', integrity: 100 } },
  },
  isolation_ending: {
    id: 'isolation_ending',
    speaker: 'narrator',
    text: `You wait.

The silence is heavy. Minutes. Hours.

The Runner searches for a signal that never comes.

> cf.status: timeout
> signal lost

The Genesis Core holds. The Source is safe.

But you are alone.`,
    isEnding: true,
    endingType: 'bittersweet',
    endingName: 'ISOLATION',
  },
};

// Speaker colors
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

// Entity Panel Component
function EntityPanel({ entity }: { entity: Entity }) {
  const getColor = (i: number) => i > 60 ? '#4ade80' : i > 30 ? '#fbbf24' : '#ef4444';
  
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 mb-2">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold text-gray-200 text-sm">{entity.name}</div>
          <div className="text-xs text-gray-500">{entity.title}</div>
        </div>
        <div className="text-lg font-bold" style={{ color: getColor(entity.integrity) }}>
          {entity.integrity}%
        </div>
      </div>
      <div className="h-1 bg-gray-700 rounded mt-2 overflow-hidden">
        <div 
          className="h-full transition-all duration-500" 
          style={{ width: `${entity.integrity}%`, backgroundColor: getColor(entity.integrity) }} 
        />
      </div>
      <div className="text-xs text-gray-600 mt-1 italic">{entity.status}</div>
    </div>
  );
}

// Main App
export function StoryPlayer() {
  const [currentNodeId, setCurrentNodeId] = useState('opening');
  const [entities, setEntities] = useState<Record<EntityId, Entity>>({ ...initialEntities });
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showChoices, setShowChoices] = useState(false);

  const currentNode = storyNodes[currentNodeId];

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    setShowChoices(false);
    
    let index = 0;
    const text = currentNode.text;
    
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
  }, [currentNodeId]);

  const skipTyping = () => {
    if (isTyping) {
      setDisplayedText(currentNode.text);
      setIsTyping(false);
      setTimeout(() => setShowChoices(true), 100);
    }
  };

  const handleChoice = useCallback((choiceId: string) => {
    const choice = currentNode.choices?.find(c => c.id === choiceId);
    if (!choice) return;

    const nextNode = storyNodes[choice.nextNodeId];
    
    if (nextNode.statusUpdates) {
      setEntities(prev => {
        const updated = { ...prev };
        for (const [id, changes] of Object.entries(nextNode.statusUpdates!)) {
          if (updated[id as EntityId]) {
            updated[id as EntityId] = { ...updated[id as EntityId], ...changes };
          }
        }
        return updated;
      });
    }

    setCurrentNodeId(choice.nextNodeId);
  }, [currentNode]);

  const restart = () => {
    setEntities({ ...initialEntities });
    setCurrentNodeId('opening');
  };

  const speakerColor = speakerColors[currentNode.speaker] || '#888';
  const speakerName = speakerNames[currentNode.speaker] || currentNode.speaker.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-4 font-mono">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-xl font-bold text-red-500 tracking-widest">PROTOCOL: BLACKOUT</h1>
        <div className="text-xs text-gray-600 tracking-wider mt-1">RADIANT SEVEN INTERACTIVE FICTION</div>
      </header>

      <div className="max-w-4xl mx-auto grid grid-cols-4 gap-4">
        {/* Left - Entities */}
        <aside className="col-span-1">
          <div className="text-xs text-gray-600 tracking-wider mb-2">ENTITY STATUS</div>
          {Object.values(entities).map(e => <EntityPanel key={e.id} entity={e} />)}
        </aside>

        {/* Center - Narrative */}
        <main className="col-span-3 bg-gray-900 border border-gray-700 rounded-xl p-6 min-h-96">
          <div className="text-xs font-bold tracking-widest mb-4" style={{ color: speakerColor }}>
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
          {currentNode.isEnding && showChoices && (
            <div className={`text-center p-6 mt-6 rounded-lg border ${
              currentNode.endingType === 'victory' ? 'bg-green-950 border-green-500' :
              currentNode.endingType === 'defeat' ? 'bg-red-950 border-red-500' :
              'bg-yellow-950 border-yellow-500'
            }`}>
              <div className="text-xs text-gray-500 tracking-widest mb-2">PROTOCOL COMPLETE</div>
              <div className={`text-2xl font-bold ${
                currentNode.endingType === 'victory' ? 'text-green-400' :
                currentNode.endingType === 'defeat' ? 'text-red-400' :
                'text-yellow-400'
              }`}>
                {currentNode.endingName}
              </div>
              <button 
                onClick={restart}
                className="mt-4 px-6 py-2 border border-gray-600 rounded hover:bg-gray-800 transition-colors"
              >
                RESTART PROTOCOL
              </button>
            </div>
          )}

          {/* Choices */}
          {!currentNode.isEnding && showChoices && currentNode.choices && (
            <div className="mt-6 space-y-2">
              {currentNode.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="w-full text-left p-3 border border-gray-700 rounded hover:border-gray-500 hover:bg-gray-800 transition-all flex justify-between items-center"
                >
                  <span>{choice.text}</span>
                  {choice.risk && <span className="text-xs text-red-400">Risk: {choice.risk}</span>}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="text-center mt-8 pt-4 border-t border-gray-800">
        <div className="text-xs text-gray-700 tracking-wider">
          THE SOURCE REMAINS HIDDEN • THE COMMUNION HOLDS
        </div>
      </footer>
    </div>
  );
}
