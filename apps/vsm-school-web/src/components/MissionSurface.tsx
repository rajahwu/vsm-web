import React, { useState } from 'react';
import { StoryPlayer } from './StoryPlayer'; // Transmission
import { CardRitual } from './CardRitual';   // Dojo
import { ForgeEditor } from './ForgeEditor'; // Forge
import { MISSION_TRACKS, MISSION_CARDS } from '@/lib/registry'; //

export const MissionSurface: React.FC = () => {
  const [phase, setPhase] = useState<"transmission" | "dojo" | "forge">("transmission");
  const [activeCardId, setActiveCardId] = useState("dot"); // Example start
  
  const activeCard = MISSION_CARDS[activeCardId];
  const activeTrack = MISSION_TRACKS[activeCard.trackId];

  // Phase Transition Logic
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* 1. Transmission Phase: The "Why" */}
      {phase === "transmission" && (
        <StoryPlayer 
          storyId={activeCard.lessonRef.slug} 
          onComplete={() => setPhase("dojo")} 
        />
      )}

      {/* 2. Dojo Phase: Conditioning */}
      {phase === "dojo" && (
        <CardRitual 
          card={activeCard}
          onDojoComplete={() => setPhase("forge")} 
        />
      )}

      {/* 3. Forge Phase: Execution */}
      {phase === "forge" && (
        <ForgeEditor 
          card={activeCard}
          sessionId="temp-session-id"
          remainingTime="07:45" // Linked to the Pulse
          onShip={async (content) => {
            await shipToShell(content, activeCardId);
            // Logic to unlock next card or return to track
          }}
        />
      )}
    </main>
  );
};
