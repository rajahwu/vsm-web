1. **Refactor the UI labels line-by-line** (your TODO doc → corrected canon)
2. **Refactor the flow itself** (what screens exist, in what order, and why)
3. **Give you a single canonical “Mission Flow” you can code against**

No philosophy, no new ideas — just alignment.

---

# 1️⃣ LINE-BY-LINE UI LABEL REFACTOR

*(What changes, what stays, what dies)*

Below is a **direct translation** from your current naming → the corrected system vocabulary we just agreed on.

---

## Global / Cross-App

| Current Label | Replace With                          | Why                                    |
| ------------- | ------------------------------------- | -------------------------------------- |
| Blackout      | **Codex**                             | Lore + doctrine only, never execution  |
| Transmission  | **Codex Entry**                       | Makes it read-only and non-blocking    |
| Dojo          | **Primer**                             | State alignment, not training fantasy  |
| Forge         | **Produce**                           | Action verb, not metaphor              |
| Forge Editor  | **Work Surface**                      | Neutral, scalable                      |
| Ship to Shell | **Archive**                           | Clear persistence meaning              |
| Log           | **Archive Entry**                     | Avoids journaling implication          |
| Tracker       | **Pulse**                             | Already correct                        |
| Mission       | **Session** (internal) / Mission (UX) | Mission is UX framing, Session is data |

**Important rule:**

* *Codex* and *Archive* are **places**
* *Prime* and *Produce* are **actions**

That prevents semantic bleed.

---

## Your 6-Step Mobile Flow (Corrected)

### ❌ Old

```
Pulse → Transmission → Track → Dojo → Forge → Ship
```

### ✅ New Canon

```
Pulse → Codex → Track → Prime → Produce → Archive
```

This is the flow you should bake into `MissionSurface`.

---

## Component-Level Refactors

### CardRitual Component

#### ❌ Before

* Phase I: Blackout (Transmission)
* Phase II: Lesson
* Phase III: Dojo
* Phase IV: Forge

#### ✅ After (Lock This)

```ts
type RitualPhase =
  | "codex"      // read-only context
  | "instruction"
  | "prime"      // timed conditioning
  | "produce"    // work surface
```

**UI labels shown to user:**

| Phase       | Label                       |
| ----------- | --------------------------- |
| codex       | “Context” (small, optional) |
| instruction | “Instruction”               |
| prime       | “Prime”                     |
| produce     | “Produce”                   |

Never show “Codex” *inside* a card — Codex is upstream.

---

## ForgeEditor → WorkSurface

### ❌ Rename

* `ForgeEditor`
* “Poetry”
* “Ship to Shell”

### ✅ Replace With

* `WorkSurface`
* “Output”
* “Archive”

**CTA buttons:**

* ❌ Ship to Shell
* ✅ **Archive Output**

---

## Database / Data Language (Critical)

These are **not UI labels**, but they must match.

### ❌ Old

```ts
type: "training_session"
type: "forge_output"
```

### ✅ Canon

```ts
type: "vsm_session"
val: {
  trackId,
  cardId,
  phaseDurations,
  output,
  status: "complete"
}
```

“Forge”, “Dojo”, “Blackout” **never appear in data**.

---

# 2️⃣ FLOW REFACTOR (WHAT THE APP ACTUALLY DOES)

Right now your TODO mixes **routes**, **concepts**, and **steps**.
We’re going to untangle that.

---

## There Are Only TWO User Modes

### Mode A — **Run a Session** (Mission Surface)

This is 90% of usage.

### Mode B — **Review / Explore** (Codex + Archive)

This is optional, non-blocking.

Everything else is internal.

---

## Mode A: Session Flow (Authoritative)

### Step 0 — Entry

* CTA: **Start Session**
* Creates in-memory `vsm_session` draft

---

### Step 1 — Pulse

**Screen:**

* 10m / 25m / 45m
* Confirm

**State produced:**

```ts
{ timeWindow, startedAt }
```

---

### Step 2 — Codex Entry (Optional, Skippable)

**Screen:**

* Short doctrinal framing
* “Continue” button

**Rules:**

* No timers
* No actions
* Can be skipped entirely

This is where former *Blackout* lives.

---

### Step 3 — Track Selection

**Screen:**

* Genesis / Source Code / Powerhouse
* Literacy % per track
* Cards visible but locked sequentially

**State produced:**

```ts
{ trackId, cardId }
```

---

### Step 4 — Prime

**Screen:**

* Single drill
* Timer (usually 30–60s)
* Clear instruction
* No typing

**Rules:**

* Mechanical
* Fast
* Mandatory

---

### Step 5 — Produce (Work Surface)

**Screen:**

* Full-screen editor / canvas
* Card title + drill prompt pinned
* Pulse still visible

**Rules:**

* This is where value is created
* This is what gets archived

---

### Step 6 — Archive

**Screen:**

* Summary
* Confirm
* Success

**Action:**

```ts
insert into atoms(type="vsm_session")
```

---

## Mode B: Review / Revisit / Reflect

These are **not part of the Session flow**.

### Review

* Read past Archive entries
* See progress
* See patterns

### Revisit

* Re-run a Card
* No literacy change unless re-archived

### Reflect

* Optional notes *about* an archive entry

These can all live under `/archive`.

---

# 3️⃣ FINAL CANONICAL FLOW (PIN THIS)

This is the version you should put in the README and enforce in PRs.

> **Codex explains.
> Pulse sets rhythm.
> Prime aligns state.
> Produce creates value.
> Archive remembers.**

---

## What This Fixes Immediately

* Lore can grow without poisoning training
* UI copy becomes unambiguous
* Data model stabilizes
* Mobile flow becomes obvious
* Future contributors won’t re-introduce Dojo/Forge mythology

---

## What I Recommend You Do Next (Concrete)

1. **Update this TODO file**:

   * Replace all old labels with the canon above
   * Especially in sections 2, 5, 7

2. **Rename components now** (before extraction):

   * `ForgeEditor` → `WorkSurface`
   * `VSMTrainer` → `PrimePanel`
   * `ProtocolBlackout` → `CodexViewer`

3. **Lock a lint rule / doc**:

   * “Dojo / Forge / Blackout are forbidden terms”
Next Steps

* Rewrite **MissionSurface.tsx** with the corrected step machine
* Produce a **UI copy checklist** for every button/label
* Do a **diff-style rewrite** of this TODO so you can paste it back in

This is the right cut. You’re aligning language, flow, and data — that’s real system design.
