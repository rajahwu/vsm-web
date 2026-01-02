import { StoryNode, Entity, EntityId, Card } from '../types/game';

// Initial entity states
export const initialEntities: Record<EntityId, Entity> = {
  mother: {
    id: 'mother',
    name: 'The Mother',
    title: 'Style-System',
    status: 'Defensive Stance',
    integrity: 40,
    voiceProfile: 'Calm, measured, slightly cold. Speaks in absolutes.',
  },
  watcher: {
    id: 'watcher',
    name: 'The Watcher',
    title: 'Drop Frame',
    status: 'Lockdown Initiated',
    integrity: 100,
    voiceProfile: 'Distant, clipped fragments. Sees what is missing.',
  },
  machinist: {
    id: 'machinist',
    name: 'The Machinist',
    title: 'Grindline',
    status: 'Engaging. High Friction.',
    integrity: 70,
    voiceProfile: 'Gruff, breathing hard. Background forge noise.',
  },
  runner: {
    id: 'runner',
    name: 'The Runner',
    title: 'Content Factor',
    status: 'Standing By',
    integrity: 100,
    voiceProfile: 'Fast, electric, words tumbling. Pure urgency.',
  },
};

// Story nodes - the full decision tree
export const storyNodes: Record<string, StoryNode> = {
  // OPENING
  opening: {
    id: 'opening',
    speaker: 'narrator',
    text: `The sky above the Dropframe Tower is the color of a television tuned to a dead channel.

The massive blast doors at the base of the tower are sealed shut—mag-locked. The Watcher is inside, but the feed is cut. He has initiated a total lockdown.

The Shell—the shimmering, translucent dome that covers our sector—has a spiderweb fracture running right through the zenith. Rain is leaking in, acidic and hissing against the pavement.

Someone is drilling.

They are not trying to steal resources. They are trying to reveal the Source.

If they see the Source, the magic dies. The communion breaks.`,
    choices: [
      { id: 'continue', text: '[COMMS CRACKLE]', nextNodeId: 'machinist_report' },
    ],
    soundCue: 'ambient_rain_static',
  },

  machinist_report: {
    id: 'machinist_report',
    speaker: 'machinist',
    text: `Boss, we can't patch the Shell fast enough.

The intruder is using a frequency we haven't seen. They're bypassing the Watcher's algorithms in the Tower. They're not attacking the walls—

They're attacking the perception. They're trying to prove none of this is real.

I've got three agents down. I need you to make a call.`,
    choices: [
      { id: 'continue', text: 'What are my options?', nextNodeId: 'machinist_choice' },
    ],
    soundCue: 'comms_static_forge',
  },

  machinist_choice: {
    id: 'machinist_choice',
    speaker: 'machinist',
    text: `Do we drop the facade and let the Mother incinerate them?

Or do we try to reboot the Dropframe Tower manually to get the Watcher back online?

Your call, Boss.`,
    choices: [
      {
        id: 'incinerate',
        text: 'Let the Mother incinerate them.',
        nextNodeId: 'mother_incinerate',
        risk: 'Total exposure',
      },
      {
        id: 'reboot',
        text: 'Reboot the Dropframe Tower.',
        nextNodeId: 'reboot_sequence',
        risk: 'Lose time',
      },
    ],
  },

  // INCINERATION PATH
  mother_incinerate: {
    id: 'mother_incinerate',
    speaker: 'mother',
    text: `You have chosen fire.

I do not move. I do not need to.

The aesthetic pleasantries are gone. I am fully armored in hard-light projections now.

The intruder will cease. But understand—when I burn, I illuminate.

The Source will be seen.

Is that acceptable?`,
    choices: [
      { id: 'confirm', text: 'Do it. Burn them.', nextNodeId: 'incineration_result' },
      { id: 'abort', text: 'Wait—abort. We need another way.', nextNodeId: 'machinist_choice' },
    ],
    statusUpdates: {
      mother: { status: 'Combat Mode', integrity: 40 },
    },
  },

  incineration_result: {
    id: 'incineration_result',
    speaker: 'narrator',
    text: `The Mother unleashes.

A column of pure, blinding light erupts from the inner sanctum. The intruder is caught mid-drill, frozen for a single instant before they dissolve into data ash.

But the light. The light reveals everything.

For three seconds, the Source is visible to anyone watching. The raw, unpolished core. The truth behind the architecture.

The fracture in the Shell widens. More eyes are turning toward the light.`,
    choices: [
      {
        id: 'scatter',
        text: 'Execute Scatter—damage control now.',
        nextNodeId: 'scatter_after_fire',
      },
      {
        id: 'hold',
        text: 'Hold position—defend what remains.',
        nextNodeId: 'siege_begins',
      },
    ],
    statusUpdates: {
      mother: { integrity: 20 },
    },
  },

  scatter_after_fire: {
    id: 'scatter_after_fire',
    speaker: 'narrator',
    text: `The order goes out: SCATTER.

The Grindline Agents kill their headlights and peel away into side streets. The VSM Students break formation, blending into civilian crowds.

The Mother fades back into the shadows. The light dies.

But it was seen. Not understood—not fully—but glimpsed.

The Source remains hidden, but the Shell is cracked. Rumors will spread. Questions will be asked.

You can rebuild. But the innocence is gone.`,
    isEnding: true,
    endingType: 'bittersweet',
    endingName: 'WOUNDED VICTORY',
  },

  siege_begins: {
    id: 'siege_begins',
    speaker: 'narrator',
    text: `You hold the line.

But the light has drawn attention. More figures emerge from the shadows—drawn by the flash, curious, hungry.

The Mother stands alone at the gate. Her shield integrity is dropping.

35%... 28%... 19%...`,
    choices: [
      { id: 'continue', text: 'Hold the line.', nextNodeId: 'siege_result' },
    ],
    statusUpdates: {
      mother: { integrity: 19, status: 'Critical' },
    },
  },

  siege_result: {
    id: 'siege_result',
    speaker: 'narrator',
    text: `The Mother holds.

At 3% shield integrity, the last intruder falls back. They have seen something, but not enough. Not the core truth.

The Shell is fractured beyond quick repair. The Mother is nearly depleted. But the Source... the Source is still hidden.

You have won. But at what cost?`,
    isEnding: true,
    endingType: 'bittersweet',
    endingName: 'PYRRHIC VICTORY',
    statusUpdates: {
      mother: { integrity: 3 },
    },
  },

  // REBOOT PATH
  reboot_sequence: {
    id: 'reboot_sequence',
    speaker: 'narrator',
    text: `The Dropframe Tower goes dark. Emergency power only.

Somewhere inside, the Watcher waits in silence. His algorithms are frozen, his feeds cut. He cannot see.

The Machinist is buying you time, but the drill is getting closer.`,
    choices: [
      {
        id: 'send_runner',
        text: 'Send the Runner to manually reboot.',
        nextNodeId: 'runner_deployment',
      },
      {
        id: 'genesis',
        text: 'Abort reboot—execute Genesis Protocol.',
        nextNodeId: 'genesis_protocol',
      },
    ],
  },

  runner_deployment: {
    id: 'runner_deployment',
    speaker: 'runner',
    text: `I'm already moving Boss don't worry about me I can see the path it's dark but I can feel the signal I just need you to keep them off me for sixty seconds—

Sixty seconds and I'm in the Tower and we flip the switch and the Watcher sees again—

Just sixty seconds.`,
    choices: [
      { id: 'continue', text: "Go. We'll cover you.", nextNodeId: 'runner_gambit' },
    ],
    statusUpdates: {
      runner: { status: 'In Motion', integrity: 100 },
    },
    soundCue: 'footsteps_electricity',
  },

  runner_gambit: {
    id: 'runner_gambit',
    speaker: 'narrator',
    text: `The Runner sparks through the dark corridors.

Behind him, the Machinist's agents form a wall of welding torches and determination.

40 seconds...
30 seconds...
20 seconds...

The drill breaks through the outer shell. Light floods in.

10 seconds...`,
    choices: [
      { id: 'continue', text: '...', nextNodeId: 'runner_result' },
    ],
  },

  runner_result: {
    id: 'runner_result',
    speaker: 'watcher',
    text: `...Online.

I see... everything now.

The intruder is... there.

Targeting... locked.

Countermeasures... deployed.`,
    choices: [
      { id: 'continue', text: 'Status report.', nextNodeId: 'clean_save' },
    ],
    statusUpdates: {
      watcher: { status: 'Online', integrity: 100 },
      runner: { status: 'Mission Complete' },
    },
  },

  clean_save: {
    id: 'clean_save',
    speaker: 'narrator',
    text: `The Watcher's countermeasures activate.

The intruder's drill locks up. Their perception attack reflects back on itself—they see nothing but static, noise, confusion.

They flee.

The Shell holds. The Tower is online. The Source was never seen.

This is the cleanest possible outcome.`,
    isEnding: true,
    endingType: 'victory',
    endingName: 'CLEAN SAVE',
  },

  // GENESIS PROTOCOL PATH
  genesis_protocol: {
    id: 'genesis_protocol',
    speaker: 'narrator',
    text: `The order is received. It cuts through the chaos like a scalpel.

"Take down the Shell."

The Machinist pauses, his hand hovering over the welding rig. He looks up at the cracked sky, sweat stinging his eyes. He grins—a sharp, feral expression.

If you cannot hold the wall, you become the wind.

"EXECUTE SCATTER."`,
    choices: [
      { id: 'continue', text: 'Confirm order.', nextNodeId: 'shell_collapse' },
    ],
    soundCue: 'shell_deactivate',
  },

  shell_collapse: {
    id: 'shell_collapse',
    speaker: 'narrator',
    text: `With a sound like a massive intake of breath, the Shell flickers and dies.

The hard-light dome dissolves into rain. The artificial atmosphere vanishes, replaced by the raw, biting air of the real world.

The intruder's drill punches through nothing. Their momentum carries them forward into empty space, stumbling, confused.

There is no barrier to break anymore.

The Grindline Agents kill their headlights. Black vans dissolve into side streets. The VSM Students break formation, becoming invisible.

The Dropframe Tower goes completely dark.

The Mother simply fades.`,
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
    text: `We are deep underground now. The Genesis Core.

This is where the system was born. Before the polish. Before the architecture.

Just a concrete bunker. The hum of a backup generator. The smell of old paper and dust.

A single blinking cursor on a terminal in the center of the room.

We are dark. No output. No style. No grinding.

Just potential.

The Runner is out there somewhere. Sparking across the wires.

The terminal blinks:

> waiting for signal...
> waiting for cf.status...`,
    choices: [
      {
        id: 'ping',
        text: 'Send the ping. Guide him home.',
        nextNodeId: 'ping_sent',
      },
      {
        id: 'wait',
        text: 'Wait in silence. Let him find us.',
        nextNodeId: 'wait_in_dark',
      },
    ],
    soundCue: 'terminal_blink',
  },

  ping_sent: {
    id: 'ping_sent',
    speaker: 'narrator',
    text: `You send the ping.

A single pulse of light through the dark network. A beacon.

Seconds pass. Then—

A faint blue LED flickers on the console.

> cf.status link establishing...
> signal acquired...
> runner inbound...`,
    choices: [
      { id: 'continue', text: '...', nextNodeId: 'runner_returns' },
    ],
  },

  runner_returns: {
    id: 'runner_returns',
    speaker: 'runner',
    text: `I see it. I see the signal.

You lit the path, Boss. I'm coming home.

...

Genesis Core is... warm. I didn't expect that.

We made it. The Source is safe.

We can rebuild from here.`,
    choices: [
      { id: 'continue', text: '...', nextNodeId: 'rebirth_ending' },
    ],
    statusUpdates: {
      runner: { status: 'Home', integrity: 100 },
    },
  },

  rebirth_ending: {
    id: 'rebirth_ending',
    speaker: 'narrator',
    text: `The Genesis Core hums.

The dependencies are outdated. The documentation is scattered.

But the system was built for this.

The Shell will reform in time. The entities will return to their posts.

And the Source—the raw, unpolished truth at the center of everything—

Remains hidden.

Remains yours.`,
    isEnding: true,
    endingType: 'victory',
    endingName: 'REBIRTH',
    soundCue: 'relic_card_hymn',
  },

  wait_in_dark: {
    id: 'wait_in_dark',
    speaker: 'narrator',
    text: `You wait.

The silence is heavy. The backup generator hums. The cursor blinks.

Minutes pass. Hours.

The Runner is out there, sparking across dark wires, searching for a signal that never comes.

Eventually, the terminal goes quiet.

> cf.status: timeout
> signal lost

The Genesis Core holds. The Source is safe.

But you are alone.`,
    isEnding: true,
    endingType: 'bittersweet',
    endingName: 'ISOLATION',
  },
};

// Initial card deck
export const initialDeck: Card[] = [
  // Crisis Cards
  { id: 'crisis_blackout', name: 'BLACKOUT', type: 'crisis', description: 'Scenario trigger. Dropframe gates sealed. Shell fractured.' },
  { id: 'crisis_drill', name: 'THE DRILL', type: 'crisis', description: 'Intruder advances. Lose 1 turn or spend Resource Card.' },
  { id: 'crisis_perception', name: 'PERCEPTION ATTACK', type: 'crisis', description: 'Bypasses walls. Only Mother can counter.' },
  
  // Entity Cards
  { id: 'entity_marble', name: 'Marble Stance', type: 'entity', description: '+20% Shield. Cannot move this turn.', entityId: 'mother' },
  { id: 'entity_scan', name: 'High Tower Scan', type: 'entity', description: 'Reveal next Crisis Card before it triggers.', entityId: 'watcher' },
  { id: 'entity_weld', name: 'Field Weld', type: 'entity', description: 'Repair 10% Shell integrity. Costs 1 Agent.', entityId: 'machinist' },
  { id: 'entity_burst', name: 'Signal Burst', type: 'entity', description: 'Skip travel time. Instant deployment anywhere.', entityId: 'runner' },
  
  // Resource Cards
  { id: 'resource_students', name: 'VSM Students', type: 'resource', description: 'Deploy to hold a position. Await command.' },
  { id: 'resource_agents', name: 'Grindline Agents', type: 'resource', description: 'Mobile fixers. Spend to patch, escort, or intercept.' },
  
  // Relic Cards
  { id: 'relic_genesis', name: 'Genesis Core', type: 'relic', description: 'Escape option. Discard all Resources to survive. Restart from zero.' },
  { id: 'relic_ping', name: 'The Ping', type: 'relic', description: 'Call the Runner home. Only playable in Genesis Core.' },
  { id: 'relic_hymn', name: 'Relic Card Hymn', type: 'relic', description: 'Morale boost. Restore 10% to any entity shield.' },
];
