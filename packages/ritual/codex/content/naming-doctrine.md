# Naming Doctrine

**Canonical Language for VSM School**

This document locks down the authoritative terminology for the VSM School system. Deviation from these terms creates confusion and undermines the mental model.

## Core Principle

**Codex** and **Archive** are **PLACES** (nouns).
**Prime** and **Produce** are **ACTIONS** (verbs).

## Canonical Terms

### Doctrine & Reference
- **Codex** — The doctrinal reference layer (definitions, principles, knowledge)
- ❌ **NOT**: Blackout, Transmission (legacy terms from Protocol Blackout)

### Temporal Rhythm
- **Pulse** — Time window selection (10m / 25m / 45m)
- ❌ **NOT**: Session, Duration

### Literacy Domain
- **Track** — Literacy domain (Genesis, Source Code, Powerhouse)
- ❌ **NOT**: Course, Module, Path

### Instructional Atom
- **Card** — Single instructional atom with lesson, drill, and forge components
- ❌ **NOT**: Lesson, Exercise, Mission (when referring to individual units)

### Execution Phases

#### Phase 1: State Alignment
- **Prime** — Timed physical/visual drill to prepare the mind (formerly "Dojo")
- **Primer** — The state of being primed
- ❌ **NOT**: Dojo, Warm-up, Practice

#### Phase 2: Production
- **Produce** — The act of creating output (formerly "Forge")
- **Work Surface** — The execution environment for output creation (formerly "Forge Editor")
- ❌ **NOT**: Forge, Write, Create

### Persistence Layer
- **Archive** — The persistence layer where completed atoms are stored
- **Archive Entry** — A single shipped atom (formerly "Log")
- ❌ **NOT**: Ship to Shell, Log, Save

### Meta-Learning
- **Review** — Reflection on completed work and progress
- ❌ **NOT**: Retrospective, Analysis

## Forbidden Terms

These terms are **banned** from all user-facing language and data layer:

- ❌ **Dojo** — Use "Prime" instead
- ❌ **Forge** — Use "Produce" or "Work Surface" instead
- ❌ **Blackout** — Use "Codex" instead
- ❌ **Transmission** — Use "Codex Entry" instead
- ❌ **Ship to Shell** — Use "Archive" instead
- ❌ **Log** — Use "Archive Entry" instead

## Database Language

The canonical atom type in Supabase is:
```typescript
type: "vsm_session"
```

Never use legacy terms in database writes or queries.

## Canonical Flow

The complete 6-step mission flow:

```
Pulse → Codex → Track → Prime → Produce → Archive
```

Each step is discrete and sequential. Never skip or reorder.

## Phase Types

```typescript
type RitualPhase = "codex" | "instruction" | "prime" | "produce"
```

Note: "instruction" is the internal phase name for pre-prime briefing. User-facing term is still "Codex."

## Examples

### ✅ Correct Usage
- "Select your Pulse: 10 minutes, 25 minutes, or 45 minutes"
- "Review the Codex entry before beginning Prime"
- "Complete the Prime drill, then move to the Work Surface"
- "Your output has been archived as a vsm_session atom"

### ❌ Incorrect Usage
- "Choose your session duration"
- "Read the Blackout transmission before the Dojo"
- "Finish the warm-up drill, then open the Forge Editor"
- "Your work has been shipped to the Shell"

## Rationale

Consistent terminology creates:
1. **Clarity** — Users know exactly what each term means
2. **Mental Models** — Spatial metaphors (Codex, Archive) vs action verbs (Prime, Produce)
3. **Searchability** — Documentation and code use identical language
4. **Professionalism** — No混 terminology drift over time

## Enforcement

All code, documentation, and user-facing text must use these canonical terms. Pull requests introducing forbidden terms will be rejected.

**Last Updated:** 2025-12-19
**Authority:** VSM School Core Team
