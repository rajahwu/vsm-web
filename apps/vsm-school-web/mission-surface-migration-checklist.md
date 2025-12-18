# VSM Mission Surface Migration Checklist 

This guide will help you transition your current monorepo from a collection of separate tools into a unified **Mission Surface**. This process follows the architectural shifts we’ve defined: moving toward a mobile-first, track-based mastery path where every card runs through a consistent 4-phase ritual.

---

## 🏛️ Phase 1: Data & Registry Initialization

The goal is to move the doctrine from hardcoded page logic into a centralized, data-driven registry.

* **[ ] Create `MISSION_REGISTRY**`: Move all 10 card definitions (Genesis, Source Code, Powerhouse) into a shared `lib` or package.
* **[ ] Standardize Atom Schema**: Ensure the `vsm_session` atom payload in Supabase includes `trackId`, `cardId`, and `outputSummary`.
* **[ ] Audit Supabase Tables**: Verify the `atoms` table is ready to store the session metadata from the Forge.
* **[ ] Define "Literacy" Logic**: Create a helper function to calculate track progress based on the count of unique `cardId` atoms logged.

---

## 🛠️ Phase 2: Core Component Migration

We are building the "Dojo" and "Forge" as reusable components that can be mounted inside the Mission Surface.

* **[ ] Implement `CardRitual.tsx**`: Build the instruction and 60-second timer engine for the Dojo phase.
* **[ ] Implement `ForgeEditor.tsx**`: Create the distraction-free editor (The Forge) with sticky card hints.
* **[ ] Update `StoryPlayer.tsx**`: Ensure the narrative engine can resolve story nodes based on the `lessonRef` slug in the card registry.
* **[ ] Refactor `RitualCycleTracker**`: Slim this down into the "Pulse" indicator to act as a background timer for the mission.

---

## 📱 Phase 3: Mission Surface Orchestration

This is the "One Page" that manages the user flow on mobile.

* **[ ] Create `MissionSurface.tsx**`: Build the master coordinator that manages phase transitions (Transmission → Dojo → Forge).
* **[ ] Implement Phase Reducer**: Create a simple state machine to track if the user is in "Context," "Instruction," "Dojo," or "Forge".
* **[ ] Wire Haptic Feedback**: Add vibration triggers for mobile users at the end of the Dojo timer.
* **[ ] Integrate "Ship to Shell"**: Link the Forge's completion button to the Supabase `insert` call and progress update.

---

## 📚 Phase 4: Content Injection

Move the specific instructional content into the story nodes and cards.

* **[ ] Map Genesis Transmissions**: Add the Machinist, Mother, and Watcher briefs for Cards 01–04.
* **[ ] Map Source Code Drills**: Inject the Logic Flow, Swimlane, and Loop instructions from the workbook.
* **[ ] Map Powerhouse Drills**: Add the Palm, Stance, and Splinter instructions for the final track.
* **[ ] Establish Track Unlocks**: Set the logic so Source Code only unlocks after 100% Genesis literacy.

---

## 🧪 Phase 5: Validation & Launch

Ensuring the "Closed Loop" works before decommissioning old routes.

* **[ ] Run End-to-End "Dot" Test**: Perform a full session for Card 01 on mobile and verify the atom appears in Supabase.
* **[ ] Verify Literacy UI**: Ensure the progress bar on the Track Selector updates in real-time after shipping.
* **[ ] Performance Audit**: Check that the Mission Surface loads within a 2-second budget on mobile networks.
* **[ ] Decommission Legacy Routes**: Once `/mission` is stable, point the sidebar links for "Trainer" and "Curriculum" to the new unified flow.

### 🚀 Immediate Next Step

