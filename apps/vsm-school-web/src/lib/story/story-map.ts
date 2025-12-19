export type EntityId = 'mother' | 'watcher' | 'machinist' | 'runner';

export const initialEntities: Record<EntityId, Entity> = {
    mother: {
        id: 'mother',
        name: 'The Mother',
        title: 'Style-System',
        status: '',
        integrity: 100,
    },
    watcher: {
        id: 'watcher',
        name: 'The Watcher',
        title: 'Drop Frame',
        status: '',
        integrity: 100,
    },
    machinist: {
        id: 'machinist',
        name: 'The Machinist',
        title: 'Grindline',
        status: '',
        integrity: 100,
    },
    runner: {
        id: 'runner',
        name: 'The Runner',
        title: 'Content Factor',
        status: '',
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
    risk: string;
    nextNodeId: StoryNodeId;
}

export type StoryNode = {
    id: StoryNodeId;
    title: string;
    content: string;
    speaker: EntityId;
    text: string;
    isEnding?: boolean;
    endingType?: 'victory' | 'defeat' | 'bittersweet';
    endingName?: string; 
    choices: StoryChoice[];
    statusUpdates?: { status: string; integrityChange: number };
};

