export type RitualPhase = "codex" | "instruction" | "prime" | "produce"

export type MissionCardId =
    | "dot"
    | "rectangle"
    | "diamond"
    | "arrow"
    | "logic_flow"
    | "swimlane"
    | "feedback_loop"
    | "dexterity"
    | "interlock"
    | "hidden_move"
    | "high_ground"


export type MissionTrackId = "genesis" | "source_code" | "powerhouse"

export interface MissionCard {
    id: MissionCardId
    trackId: MissionTrackId
    title: string
    phases: RitualPhase[]
    lessonRef?: { kind: "blackout" | "workbook"; slug: string }
    drill: {
        seconds: number
        medium: "paper" | "editor" | "mixed" | "deck" | "digital" | "verbal" | "physical" | "paper + deck"
        prompt: string
    }
    forgePrompt?: string
}

export interface MissionTrack {
    id: MissionTrackId
    title: string
    description: string
    cards: MissionCardId[]
    order?: number
}


export const MISSION_REGISTRY: Record<MissionTrackId, MissionTrack> = {

    genesis: {
        id: "genesis",
        title: "The Alphabet",
        description: "Pre-Literary Visual Primitives",
        cards: ["dot", "rectangle", "diamond", "arrow"],
        order: 1
    },
    source_code: {
        id: "source_code",
        title: "The Doctrine",
        description: "Systems-Work Workbook Sentences",
        cards: ["logic_flow", "swimlane", "feedback_loop"],
        order: 2
    },
    powerhouse: {
        id: "powerhouse",
        title: "The Powerhouse",
        description: "Creative Dexterity & Strategy",
        cards: ["dexterity", "high_ground", "interlock", "hidden_move"],
        order: 3
    }
}

export const CARD_REGISTRY: Record<MissionCardId, MissionCard> = {
    // --- GENESIS TRACK ---
    dot: {
        id: "dot",
        trackId: "genesis",
        title: "The Dot",
        lessonRef: { kind: "blackout", slug: "transmission-dot" },
        phases: ["codex", "instruction", "prime", "produce"],
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
        lessonRef: { kind: "blackout", slug: "transmission-rectangle" },
        phases: ["codex", "instruction", "prime", "produce"],
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
        lessonRef: { kind: "blackout", slug: "transmission-diamond" },
        phases: ["codex", "instruction", "prime", "produce"],
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
        lessonRef: { kind: "blackout", slug: "transmission-arrow" },
        phases: ["codex", "instruction", "prime", "produce"],
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
        lessonRef: { kind: "blackout", slug: "transmission-logic" },
        phases: ["codex", "instruction", "prime", "produce"],
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
        lessonRef: { kind: "blackout", slug: "transmission-swimlane" },
        phases: ["codex", "instruction", "prime", "produce"],
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
        lessonRef: { kind: "blackout", slug: "transmission-loop" },
        phases: ["codex", "instruction", "prime", "produce"],
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
        lessonRef: { kind: "blackout", slug: "transmission-stance" },
        phases: ["codex", "instruction", "prime", "produce"],
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
        lessonRef: { kind: "blackout", slug: "transmission-structure" },
        phases: ["codex", "instruction", "prime", "produce"],
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
        lessonRef: { kind: "blackout", slug: "transmission-splinter" },
        phases: ["codex", "instruction", "prime", "produce"],
        drill: {
            seconds: 180,
            medium: "deck",
            prompt: "Execute 20 Double Lifts. Between reps, re-format one core idea into 3 different assets."
        },
        forgePrompt: "Splinter Effect: Re-format your Declaration into a tweet, an IG headline, and a CLI command."
    },
    dexterity: {
        id: "dexterity",
        trackId: "powerhouse",
        title: "Dexterity",
        lessonRef: { kind: "blackout", slug: "transmission-dexterity" },
        phases: ["codex", "instruction", "prime", "produce"],
        drill: {
            seconds: 120,
            medium: "physical",
            prompt: "Execute slow, controlled hand movements. No speed. No flourish."
        },
        forgePrompt: "Describe a specific moment when physical precision prevented failure. What instrument did you control? What was at stake?"
    }

}
