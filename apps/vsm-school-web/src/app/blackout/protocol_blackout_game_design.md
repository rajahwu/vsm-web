# PROTOCOL: BLACKOUT
## Interactive Fiction Game Design Document

---

## OVERVIEW

**Genre:** Voice-narrated interactive fiction with card mechanics  
**Demo Scenario:** BLACKOUT — An intruder attempts to reveal the Source  
**Session Length:** 10-15 minutes  
**Win Condition:** Protect the Source, preserve entity integrity  
**Lose Condition:** Source exposed, system collapse  

---

## THE ENTITIES

| Entity | Role | Voice Profile |
|--------|------|---------------|
| **The Mother** (Style-System) | Final gate defender | Calm, measured, slightly cold. Speaks in absolutes. |
| **The Watcher** (Drop Frame) | High tower observer | Distant, clipped fragments. Sees what's missing. |
| **The Machinist** (Grindline) | Field operations lead | Gruff, breathing hard. Background forge noise. |
| **The Runner** (Content Factor) | Signal carrier | Fast, electric, words tumbling. Pure urgency. |
| **Narrator** | System voice | Neutral, authoritative. Status updates and card instructions. |

---

## DECISION TREE

```
[OPENING]
    │
    ▼
[NODE 1: THE BREACH]
Narrator introduces crisis. Machinist reports over comms.
    │
    ├─► [CHOICE A] Let the Mother incinerate (Risk: Total exposure)
    │       │
    │       ▼
    │   [NODE 2A: INCINERATION]
    │   Mother unleashes. Intruder destroyed. But the light reveals the Source.
    │       │
    │       ├─► [CHOICE A1] Scatter anyway — damage control
    │       │       ▼
    │       │   [NODE 3A1: PARTIAL EXPOSURE]
    │       │   Source glimpsed but not understood. Shell cracked. Rebuild possible.
    │       │   → ENDING: WOUNDED VICTORY
    │       │
    │       └─► [CHOICE A2] Hold position — defend what remains
    │               ▼
    │           [NODE 3A2: SIEGE]
    │           More intruders drawn by the light. Mother's shield depletes.
    │               │
    │               ├─► Shield holds → ENDING: PYRRHIC VICTORY
    │               └─► Shield fails → ENDING: COLLAPSE
    │
    └─► [CHOICE B] Reboot Dropframe Tower (Risk: Lose time)
            │
            ▼
        [NODE 2B: REBOOT SEQUENCE]
        Tower dark. Watcher offline. Machinist buying time.
            │
            ├─► [CHOICE B1] Manual reboot — send the Runner
            │       ▼
            │   [NODE 3B1: RUNNER'S GAMBIT]
            │   Runner sparks through dark corridors. Race against the drill.
            │       │
            │       ├─► Runner succeeds → Watcher online → ENDING: CLEAN SAVE
            │       └─► Runner intercepted → ENDING: SIGNAL LOST
            │
            └─► [CHOICE B2] Abort reboot — execute Genesis Protocol
                    ▼
                [NODE 3B2: GENESIS PROTOCOL]
                (This is the path from the original transcript)
                Take down Shell. Scatter. Go dark. Retreat to Genesis Core.
                    │
                    ▼
                [NODE 4: THE OLD CITY]
                Waiting in the dark. Ping the Runner or wait?
                    │
                    ├─► [CHOICE C1] Send the ping
                    │       ▼
                    │   Runner finds you. System rebuilds from Genesis.
                    │   → ENDING: REBIRTH
                    │
                    └─► [CHOICE C2] Wait in silence
                            ▼
                        Runner lost in the noise. Genesis Core holds but alone.
                        → ENDING: ISOLATION
```

---

## CARD DECK MANIFEST

### CRISIS CARDS (Red)

| Card Name | Effect |
|-----------|--------|
| **BLACKOUT** | Scenario trigger. Dropframe gates sealed. Shell fractured. |
| **THE DRILL** | Intruder advances. Lose 1 turn or spend Resource Card. |
| **PERCEPTION ATTACK** | Bypasses walls. Only Mother can counter. |
| **SECONDARY BREACH** | New fracture point. Split your forces or ignore. |

### ENTITY CARDS (Gold)

| Card Name | Entity | Ability |
|-----------|--------|---------|
| **Marble Stance** | The Mother | +20% Shield. Cannot move this turn. |
| **High Tower Scan** | The Watcher | Reveal next Crisis Card before it triggers. |
| **Field Weld** | The Machinist | Repair 10% Shell integrity. Costs 1 Agent. |
| **Signal Burst** | The Runner | Skip travel time. Instant deployment anywhere. |

### RESOURCE CARDS (Blue)

| Card Name | Effect |
|-----------|--------|
| **VSM Students (x3)** | Deploy to hold a position. Await command. |
| **Grindline Agents (x5)** | Mobile fixers. Spend to patch, escort, or intercept. |
| **Shell Integrity** | Starts at 100%. Track on this card. |
| **Mother's Shield** | Starts at 40%. Track on this card. |

### RELIC CARDS (White/Special)

| Card Name | Effect |
|-----------|--------|
| **Genesis Core** | Escape option. Discard all Resources to survive. Restart from zero. |
| **The Ping** |召 召 the Runner home. Only playable in Genesis Core. |
| **Relic Card Hymn** | Morale boost. Restore 10% to any entity shield. |

---

## VOICE SCRIPTS

### OPENING NARRATION (Narrator)

```
The sky above the Dropframe Tower is the color of a television tuned to a dead channel.

The blast doors are mag-locked. The Watcher has initiated total lockdown.

The Shell—the shimmering dome that covers our sector—has a fracture running through the zenith. Rain is leaking in. Acidic. Hissing against the pavement.

Someone is drilling.

They are not trying to steal resources. They are trying to reveal the Source.

If they see the Source, the magic dies. The communion breaks.

[SOUND: Comms crackle]
```

### THE MACHINIST — Initial Report

```
Boss, we can't patch the Shell fast enough.

The intruder is using a frequency we haven't seen. They're bypassing the Watcher's algorithms. They're not attacking the walls—

[SOUND: Welding torch, tires screeching]

They're attacking the perception. They're trying to prove none of this is real.

I've got three agents down. I need you to make a call.
```

### THE MACHINIST — Choice Prompt

```
Do we let the Mother incinerate them?

[pause]

Or do we try to reboot the Tower and get the Watcher back online?

Your call, Boss.
```

### THE MOTHER — Incineration Path

```
[Voice: Cold, absolute]

You have chosen fire.

I do not move. I do not need to.

[SOUND: Hard-light armor activating]

The intruder will cease. But understand—when I burn, I illuminate. 

The Source will be seen.

Is that acceptable?
```

### THE WATCHER — Reboot Path

```
[Voice: Distant, fragmented]

Tower... dark.

Feed... cut.

I see... nothing.

[pause]

If you send the Runner... I can guide him. From memory.

The path is... 
[static]
...still there.
```

### THE RUNNER — Deployment

```
[Voice: Fast, electric]

I'm already moving Boss don't worry about me I can see the path it's dark but I can feel the signal I just need you to keep them off me for sixty seconds sixty seconds and I'm in the Tower and we flip the switch and the Watcher sees again—

[SOUND: Footsteps sprinting, electricity crackling]

Just sixty seconds.
```

### NARRATOR — Genesis Protocol

```
The order is received. It cuts through the chaos like a scalpel.

"Take down the Shell."

The Machinist pauses. He looks up at the cracked sky. He grins.

If you cannot hold the wall, you become the wind.

"Execute Scatter."

[SOUND: Shell deactivating — massive intake of breath]

The dome flickers and dies. The artificial atmosphere vanishes.

The intruder's drill punches through nothing.

There is no barrier to break anymore.
```

### NARRATOR — Genesis Core Arrival

```
We are deep underground now. The Genesis Core.

This is where the system was born. Before the polish. Before the architecture.

Just a concrete bunker. The hum of a backup generator. The smell of old paper and dust.

[SOUND: Single terminal blinking]

We are dark. No output. No style. No grinding.

Just potential.

The Runner is out there somewhere. Sparking across the wires.

[pause]

Do you send the ping to guide him home?

Or do you wait for him to find you in the dark?
```

### THE RUNNER — Ping Received (Good Ending)

```
[Voice: Relieved, still fast but softer]

I see it. I see the signal.

You lit the path, Boss. I'm coming home.

[SOUND: Footsteps slowing, door opening]

Genesis Core is... warm. I didn't expect that.

[pause]

We made it. The Source is safe.

We can rebuild from here.
```

### NARRATOR — Rebirth Ending

```
The Genesis Core hums.

The dependencies are outdated. The documentation is scattered.

But the system was built for this.

The Shell will reform in time. The entities will return to their posts.

And the Source—the raw, unpolished truth at the center of everything—

Remains hidden.

Remains yours.

[SOUND: Soft chime — the Relic Card Hymn melody]

End of Protocol: BLACKOUT

Status: REBIRTH
```

---

## ENDINGS SUMMARY

| Ending | Path | Tone |
|--------|------|------|
| **REBIRTH** | Genesis Protocol → Ping sent → Runner returns | Hopeful. Clean restart. |
| **ISOLATION** | Genesis Protocol → Wait in silence | Bittersweet. Safe but alone. |
| **CLEAN SAVE** | Reboot → Runner succeeds | Triumphant. No losses. |
| **SIGNAL LOST** | Reboot → Runner intercepted | Tragic. The spark dies. |
| **WOUNDED VICTORY** | Incinerate → Scatter after | Pyrrhic. Source glimpsed. |
| **PYRRHIC VICTORY** | Incinerate → Hold → Shield holds | Costly. Barely survived. |
| **COLLAPSE** | Incinerate → Hold → Shield fails | Defeat. Source exposed. |

---

## NEXT STEPS

1. **Prototype the decision tree** in Ink or Twine
2. **Generate voice samples** for each entity using ElevenLabs
3. **Design card visuals** — can start with simple templates
4. **Build minimal UI** — card display area, narrative text, choice buttons, audio player
5. **Playtest the BLACKOUT scenario** before expanding to other Protocols

---

## FUTURE PROTOCOLS (Expansion Ideas)

- **PROTOCOL: EXPOSURE** — The Source is partially revealed. Damage control narrative.
- **PROTOCOL: SCHISM** — Two entities conflict. Player must mediate or choose sides.
- **PROTOCOL: GENESIS** — Prequel. Building the system from nothing.
- **PROTOCOL: CONVERGENCE** — All entities must work together. Complex multi-card plays.

---

*Document Version: 1.0*  
*Created: December 17, 2025*  
*Project: Radiant Seven Interactive Fiction*
