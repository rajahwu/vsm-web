🌑 Genesis Transmission Nodes: The First Wave
These nodes are designed for the StoryPlayer component. They provide the narrative "Why" before the user enters the Dojo.

Node: transmission-dot (Card 01)
Speaker: The Machinist

Text: "The sky above the tower is static. The Shell is fractured, and the data stream is a mess of noise. We can't identify the actors. Before we can fix the system, we need to mark the Sources. Who is actually in the room? Who is pulling the lever? Find the Dots, or we're flying blind."

Action: Transition to Dojo: The Dot.

Node: transmission-rectangle (Card 02)
Speaker: The Mother

Text: "Dots are just locations, but the Rectangle is where the time burns. Every action you take is a box. If you don't box your work, the work boxes you. A client request isn't a story; it's a series of process steps. Map the grind before it grinds you down."

Action: Transition to Dojo: The Rectangle.

Node: transmission-diamond (Card 03)
Speaker: The Watcher

Text: "I see the flow, but it's moving too fast. We're missing the gates. A system without a Diamond is a system without a choice. You need to know where the 'No' happens. If everything is a 'Yes,' then nothing is a priority. Build the gate."

Action: Transition to Dojo: The Diamond.

Node: transmission-arrow (Card 04)
Speaker: The Runner

Text: "The actors are marked. The work is boxed. The gates are set. Now, we need the commitment. An Arrow is a promise that 'This' leads to 'That.' Without the Arrow, we have components, but we don't have a system. Connect the dots. Ship the flow."

Action: Transition to Dojo: The Arrow.

🛠️ How to Integrate with the Mission Registry
In your MISSION_REGISTRY, each card now has a lessonRef.slug that matches these node IDs.

Selection: The user selects "The Dot".

Transmission: The MissionSurface sees transmission-dot and loads the Machinist's brief via the StoryPlayer.

Handoff: Once the user finishes the text, the onComplete trigger moves them into the CardRitual (Dojo).

📊 Literacy Progression
By completing these "Transmissions," the user isn't just checking boxes; they are advancing the narrative integrity of the RitualHub.

Completion of Genesis: Once all 4 atoms are shipped, the "Alphabet" is mastered, and the Source Code track (The Doctrine) becomes the active mission.
