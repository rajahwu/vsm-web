// Interfaces for the Mission Surface components (CardRitual, WorkSurface, etc.)
// These are contracts only; implementation will live in shared packages.

export type MissionStep =
    | 'pulse'
    | 'codex'
    | 'track'
    | 'prime'
    | 'produce'
    | 'archive'

export type TrackId = 'genesis' | 'source_code' | 'powerhouse';


export interface MissionCard {
    id: string;
    trackId: string;
    title: string;
    instruction: string; // Scenario / prompt
    action: string; // Action protocol text
    durationSeconds: number; // Prime timer length
    lessonRef?: string; // Links to codex node or lesson content
}

export type RitualPhase = 'codex' | 'instruction' | 'prime' | 'produce';

export interface CardRitualProps {
    card: MissionCard;
    onTick?: (secondsRemaining: number) => void;
    onComplete: (result: { cardId: string; elapsedSeconds: number; output?: string }) => void;
    onSkip?: () => void;
    haptics?: boolean; // Trigger vibration when timer ends
    autoStart?: boolean;
}

export interface WorkSurfaceProps {
    card: MissionCard;
    initialText?: string;
    stickyHint?: string; // Card instruction shown while typing
    onChange?: (text: string) => void;
    onArchive: (output: { cardId: string; text: string; outputSummary?: string }) => void;
    disabled?: boolean;
}

export interface MissionSurfaceState {
    phase: 'codex' | 'instruction' | 'prime' | 'produce';
    cardIndex: number;
    completedCardIds: string[];
}

export interface MissionState {
    currentStep: MissionStep;
    selectedWindow?: 'sprint' | 'standard' | 'grind';
    selectedTrack?: TrackId;
    selectedCard?: MissionCard;

    // Codex
    codexSlug?: string;

    // Outputs
    primeComplete?: boolean;
    produceOutput?: string;
}

export interface MissionSurfaceActions {
    startCodex: (card: MissionCard) => void;
    startPrime: () => void;
    startProduce: () => void;
    archive: (payload: {
        trackId: string;
        cardId: string;
        outputSummary: string;
        atoms?: Record<string, unknown>;
    }) => Promise<void>;
    nextCard: () => void;
    reset: () => void;
}
