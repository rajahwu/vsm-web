export type EntityId = 'mother' | 'watcher' | 'machinist' | 'runner';

export const initialEntities: Record<EntityId, Entity> = {
    mother: {
        id: 'mother',
        name: 'The Mother',
        title: 'Style-System',
        status: 'Defensive Stance',
        integrity: 40,
    },
    watcher: {
        id: 'watcher',
        name: 'The Watcher',
        title: 'Drop Frame',
        status: 'Lockdown Initiated',
        integrity: 100,
    },
    machinist: {
        id: 'machinist',
        name: 'The Machinist',
        title: 'Grindline',
        status: 'Engaging. High Friction.',
        integrity: 70,
    },
    runner: {
        id: 'runner',
        name: 'The Runner',
        title: 'Content Factor',
        status: 'Standing By',
        integrity: 100,
    },
};


export interface Entity {
    id: EntityId;
    name: string;
    title: string;
    status: string;
    integrity: number;
}


export type storyNodes = StoryNode[]

export type StoryNodeId = string;

export type StoryChoice = {
    id: string;
    text: string;
    risk?: string;
    nextNodeId: StoryNodeId;
}

export type StoryNode = {
    id: StoryNodeId;
    speaker: 'narrator' | EntityId;
    text: string;
    isEnding?: boolean;
    endingType?: 'victory' | 'defeat' | 'bittersweet';
    endingName?: string;
    choices?: StoryChoice[];
    statusUpdates?: Partial<Record<EntityId, Partial<Entity>>>;
    triggersCardId?: string; // Mission card to trigger after this node
};

