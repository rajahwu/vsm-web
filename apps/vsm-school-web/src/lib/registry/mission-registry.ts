export const MISSION_REGISTRY = {
  tracks: {
    genesis: {
      id: "genesis",
      title: "The Alphabet",
      description: "Pre-Literary Visual Primitives",
      cardIds: ["dot", "rectangle", "diamond", "arrow"],
      order: 1
    },
    source_code: {
      id: "source_code",
      title: "The Doctrine",
      description: "Systems-Work Workbook Sentences",
      cardIds: ["logic_flow", "swimlane", "feedback_loop"],
      order: 2
    },
    powerhouse: {
      id: "powerhouse",
      title: "The Powerhouse",
      description: "Creative Dexterity & Strategy",
      cardIds: ["high_ground", "interlock", "hidden_move"],
      order: 3
    }
  },
  cards: {
    // --- GENESIS TRACK ---
    dot: {
      id: "dot",
      trackId: "genesis",
      title: "The Dot",
      lessonRef: { slug: "transmission-dot" },
      drill: {
        seconds: 60,
        medium: "paper",
        prompt: "Place 10 dots. Label each with a real actor (person, tool, or client) you dealt with today."
      },
      forgePrompt: "In 3–5 sentences, describe your dots. Who are these actors, and which one is the most critical source of data today?"
    },
    rectangle: {
      id: "rectangle",
      trackId: "genesis",
      title: "The Rectangle",
      lessonRef: { slug: "transmission-rectangle" },
      drill: {
        seconds: 30,
        medium: "paper",
        prompt: "Draw a box. Inside, write one verb for a task that takes you at least 30 minutes to complete."
      },
      forgePrompt: "Explain your box. What work happens inside it? Where does the time go?"
    },
    diamond: {
      id: "diamond",
      trackId: "genesis",
      title: "The Diamond",
      lessonRef: { slug: "transmission-diamond" },
      drill: {
        seconds: 30,
        medium: "paper",
        prompt: "Draw a Diamond. Label it with a real Yes/No decision gate you faced today."
      },
      forgePrompt: "Describe the gate. What happens on 'Yes'? What happens on 'No'? Where is the risk?"
    },
    arrow: {
      id: "arrow",
      trackId: "genesis",
      title: "The Arrow",
      lessonRef: { slug: "transmission-arrow" },
      drill: {
        seconds: 60,
        medium: "paper",
        prompt: "Map one real flow: Input → Process → Output → Feedback."
      },
      forgePrompt: "What was the Input? What was the Process box? How does the Feedback arrow change the next Input?"
    },

    // --- SOURCE CODE TRACK ---
    logic_flow: {
      id: "logic_flow",
      trackId: "source_code",
      title: "Logic Flow",
      lessonRef: { slug: "transmission-logic" },
      drill: {
        seconds: 30,
        medium: "paper",
        prompt: "Map 'The Client Request': Start → Receive (box) → Scope? (diamond) → Path A/B → End."
      },
      forgePrompt: "Where would you tighten this doctrine? What happens to the requests that hit the 'No' path?"
    },
    swimlane: {
      id: "swimlane",
      trackId: "source_code",
      title: "The Swimlane",
      lessonRef: { slug: "transmission-swimlane" },
      drill: {
        seconds: 60,
        medium: "paper",
        prompt: "Draw 3 lanes: DropFrame | Content Factor | Grindeline. Map a handoff crossing all lanes."
      },
      forgePrompt: "Describe each handoff. Name the riskiest crossing you circled and how to harden it."
    },
    feedback_loop: {
      id: "feedback_loop",
      trackId: "source_code",
      title: "Feedback Loop",
      lessonRef: { slug: "transmission-loop" },
      drill: {
        seconds: 60,
        medium: "paper",
        prompt: "Draw a Reinforcing Loop: Content Quality → Client Trust → Budget/Freedom (+)."
      },
      forgePrompt: "Where is this loop alive in your work? Where does it break, and what is the small fix?"
    },

    // --- POWERHOUSE TRACK ---
    high_ground: {
      id: "high_ground",
      trackId: "powerhouse",
      title: "The High Ground",
      lessonRef: { slug: "transmission-stance" },
      drill: {
        seconds: 180,
        medium: "paper + deck",
        prompt: "Palm a card while relaxed. Then write a 3-sentence Declaration of Professionalism."
      },
      forgePrompt: "Rewrite your Declaration: 'I am not a hobbyist. I am a [Role]. My job today is to...'"
    },
    interlock: {
      id: "interlock",
      trackId: "powerhouse",
      title: "The Interlock",
      lessonRef: { slug: "transmission-structure" },
      drill: {
        seconds: 180,
        medium: "paper",
        prompt: "Sketch 5 rapid Input → Process → Output flows for your current project."
      },
      forgePrompt: "In bullets: Describe the 'Before' state (chaos) and the 'After' state (control) for this transformation."
    },
    hidden_move: {
      id: "hidden_move",
      trackId: "powerhouse",
      title: "The Hidden Move",
      lessonRef: { slug: "transmission-splinter" },
      drill: {
        seconds: 180,
        medium: "deck",
        prompt: "Execute 20 Double Lifts. Between reps, re-format one core idea into 3 different assets."
      },
      forgePrompt: "Splinter Effect: Re-format your Declaration into a tweet, an IG headline, and a CLI command."
    }
  }
};
