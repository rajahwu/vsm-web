🏟️ VSM Mission Architecture: The Registry & Ritual
🧭 Core Philosophy: "Conditioning Before Poetry"
The mission architecture is designed to enforce a specific sequence of work. A user cannot enter the Forge (writing) without first clearing the Dojo (physical conditioning).

Instruction: Narrative framing through the Blackout Protocol (The Transmission).

Conditioning: High-velocity visual or physical drills (The Dojo).

Execution: Distraction-free application and reflection (The Forge).

🗂️ Data Structure
The system is entirely data-driven, governed by three primary objects:

1. Tracks (The Silos)
A Track is a vertical container for a specific doctrine.

Genesis: Mastering the "Alphabet" of visual primitives.

Source Code: Mastering the "Sentences" of system logic.

Powerhouse: Mastering "Creative Dexterity" and shipping.

2. Cards (The Atoms)
A Card is the individual unit of instruction. Each card belongs to a track and defines its own:

Lesson Reference: Pointer to a specific Blackout story node.

Drill Specification: Duration, medium (paper/deck), and prompt.

Forge Prompt: Cognitive questions to guide the writing phase.

3. Knowledge Atoms (The Logs)
When a card is completed, it is "shipped" to the public.atoms table in Supabase as a vsm_session type. This data is used to calculate the user's Literacy Score.

🔄 The 4-Phase Ritual Flow
The MissionSurface component orchestrates these phases in a linear, mobile-first sequence:

Transmission (Phase I): StoryPlayer loads the narrative brief associated with the current card.

Dojo (Phase II & III): CardRitual provides the instruction and runs the 60/180-second countdown timer.

Forge (Phase IV): ForgeEditor opens a text workspace with a "sticky" hint of the card's prompt.

Ship: The user confirms the output, logging a timestamped atom to the database.

🛠️ Implementation & Hooks
useMissionProgress
This hook is the engine's "Brain." It:

Queries Supabase for all vsm_session atoms for the current user.

Determines which cards are "Mastered" and which are "Locked".

Identifies the Next Mission by finding the first incomplete card in the sorted registry.

The Mission Surface HUD
The UI is optimized for mobile high-velocity work:

Haptic Feedback: Triggers at the end of Dojo timers.

Progressive Unlocking: Users are guided through tracks linearly (Genesis → Source Code → Powerhouse).

Minimalist Aesthetic: Emerald-on-Black "Blackout" styling to maintain focus.

🚀 Scaling the System
To add new content to the school, simply:

Add new Cards and Tracks to the MISSION_REGISTRY.

Add corresponding Story Nodes to the Blackout engine.

The UI will automatically render the new content and handle the progress logic.

Current Status: Mission Architecture v1.0 Live. Closed-loop from story to data.
