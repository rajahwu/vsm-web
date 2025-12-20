# **VSM School Merger \- Component & Data Migration Plan**

Created: December 18, 2025 \- 16:45 UTC  
Status: 📋 Planning Phase  
Target Completion: Q1 2026

---

## **🎯 Executive Summary**

This document outlines a phased migration strategy to:

1. Decouple components from CSS \- Extract styling logic into design tokens and theme system  
2. Move reusable components to packages \- Create shared component library  
3. Replace hardcoded data with database \- Migrate static data to Supabase with proper schema  
4. Maintain zero downtime \- Incremental refactoring with feature flags

Estimated Timeline: 6-8 weeks  
Risk Level: Medium (requires database schema design and careful refactoring)  
Team Size: 2-3 developers

---

## **📊 Current State Analysis**

### **Components Currently Coupled to CSS**

| Component | Location | Lines | CSS Coupling | Reusability | Priority |
| ----- | ----- | ----- | ----- | ----- | ----- |
| GenesisTracker | apps/vsm-school-web/src/components/ | \~80 | HIGH (16+ className strings) | HIGH | P0 |
| ProtocolBlackout | apps/vsm-school-web/src/app/blackout/ | 518 | MEDIUM | HIGH | P1 |
| VSMTrainer | apps/vsm-school-web/src/app/training/ | 291 | MEDIUM | HIGH | P0 |
| Sidebar | apps/vsm-school-web/src/components/ | \~50 | LOW (design system aware) | HIGH | P2 |

### **Hardcoded Data to Migrate**

| Data Type | Location | Size | Complexity | Priority |
| ----- | ----- | ----- | ----- | ----- |
| Genesis Curriculum | src/data/GenesisCurriculum.ts | 10 items | LOW | P0 |
| Training Blocks | src/app/training/page.tsx | 3 windows × items | MEDIUM | P0 |
| Protocol Blackout Story | src/app/blackout/ProtocolBlackout.tsx | \~50 nodes | HIGH | P1 |
| Phase Definitions | packages/ritual/ui-lib/src/phases.ts | 5 phases | LOW | P2 |

### **Package Structure (Target State)**

packages/  
├── ritual/  
│   ├── brand/              \# Theme compiler (existing)  
│   ├── ui-lib/             \# Core UI components (existing)  
│   └── components/         \# 🆕 Shared app components  
│       ├── curriculum/     \# GenesisTracker variants  
│       ├── training/       \# VSMTrainer core logic  
│       ├── narrative/      \# Story engine components  
│       └── progress/       \# Progress tracking components  
├── rsys-os/  
│   ├── design-source/      \# Design tokens (existing)  
│   └── data-client/        \# 🆕 Database abstraction layer  
│       ├── queries/        \# Supabase query hooks  
│       ├── mutations/      \# Write operations  
│       └── types/          \# Shared TypeScript types

---

## **🗄️ Database Schema Design**

### **Phase 1: Core Content Tables**

#### **genesis\_drills Table**

CREATE TABLE genesis\_drills (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  order\_index INT NOT NULL,  
  title TEXT NOT NULL,  
  category TEXT NOT NULL CHECK (category IN ('Primitive', 'Sentence', 'Protocol', 'Analysis')),  
  drill\_description TEXT NOT NULL,  
  symbol TEXT NOT NULL,  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  updated\_at TIMESTAMPTZ DEFAULT NOW(),  
  is\_active BOOLEAN DEFAULT TRUE  
);

CREATE INDEX idx\_genesis\_drills\_order ON genesis\_drills(order\_index);  
CREATE INDEX idx\_genesis\_drills\_category ON genesis\_drills(category);

Migration Data:

\[  
  {  
    "order\_index": 1,  
    "title": "The Dot",  
    "category": "Primitive",  
    "drill\_description": "Draw 10 dots randomly. Connect them to form a network.",  
    "symbol": "•"  
  },  
  // ... 9 more drills  
\]

---

#### **training\_windows Table**

CREATE TABLE training\_windows (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  window\_type TEXT NOT NULL UNIQUE CHECK (window\_type IN ('sprint', 'standard', 'grind')),  
  duration\_minutes INT NOT NULL,  
  display\_name TEXT NOT NULL,  
  description TEXT,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

---

#### **training\_blocks Table**

CREATE TABLE training\_blocks (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  block\_code TEXT NOT NULL UNIQUE, \-- e.g., 'control-001'  
  window\_type TEXT NOT NULL REFERENCES training\_windows(window\_type),  
  title TEXT NOT NULL,  
  theme TEXT NOT NULL,  
  physical\_skill\_name TEXT NOT NULL,  
  physical\_skill\_description TEXT NOT NULL,  
  mental\_skill\_name TEXT NOT NULL,  
  mental\_skill\_description TEXT NOT NULL,  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  is\_active BOOLEAN DEFAULT TRUE  
);

CREATE INDEX idx\_training\_blocks\_window ON training\_blocks(window\_type);

---

#### **training\_cards Table**

CREATE TABLE training\_cards (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  block\_id UUID NOT NULL REFERENCES training\_blocks(id) ON DELETE CASCADE,  
  card\_order INT NOT NULL,  
  front\_text TEXT NOT NULL,  
  back\_text TEXT NOT NULL,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

CREATE INDEX idx\_training\_cards\_block ON training\_cards(block\_id, card\_order);

---

#### **story\_nodes Table (Protocol Blackout)**

CREATE TABLE story\_nodes (  
  id TEXT PRIMARY KEY, \-- e.g., 'opening', 'machinist\_report'  
  speaker TEXT NOT NULL, \-- 'narrator' | entity\_id  
  text\_content TEXT NOT NULL,  
  is\_ending BOOLEAN DEFAULT FALSE,  
  ending\_type TEXT CHECK (ending\_type IN ('victory', 'defeat', 'bittersweet')),  
  ending\_name TEXT,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

---

#### **story\_choices Table**

CREATE TABLE story\_choices (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  node\_id TEXT NOT NULL REFERENCES story\_nodes(id) ON DELETE CASCADE,  
  choice\_order INT NOT NULL,  
  choice\_text TEXT NOT NULL,  
  next\_node\_id TEXT NOT NULL REFERENCES story\_nodes(id),  
  risk\_label TEXT,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

CREATE INDEX idx\_story\_choices\_node ON story\_choices(node\_id, choice\_order);

---

#### **story\_entities Table**

CREATE TABLE story\_entities (  
  id TEXT PRIMARY KEY, \-- e.g., 'mother', 'watcher'  
  name TEXT NOT NULL,  
  title TEXT NOT NULL,  
  initial\_status TEXT NOT NULL,  
  initial\_integrity INT NOT NULL,  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

---

### **Phase 2: User Progress Tables**

#### **user\_genesis\_progress Table**

CREATE TABLE user\_genesis\_progress (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  user\_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,  
  drill\_id UUID NOT NULL REFERENCES genesis\_drills(id) ON DELETE CASCADE,  
  completed\_at TIMESTAMPTZ DEFAULT NOW(),  
  UNIQUE(user\_id, drill\_id)  
);

CREATE INDEX idx\_user\_genesis\_progress\_user ON user\_genesis\_progress(user\_id);

---

#### **user\_training\_sessions Table**

CREATE TABLE user\_training\_sessions (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  user\_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,  
  block\_id UUID NOT NULL REFERENCES training\_blocks(id),  
  started\_at TIMESTAMPTZ NOT NULL,  
  completed\_at TIMESTAMPTZ,  
  duration\_seconds INT,  
  cards\_viewed INT,  
  session\_data JSONB, \-- Stores cards completed, flip counts, etc.  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

CREATE INDEX idx\_user\_training\_sessions\_user ON user\_training\_sessions(user\_id);  
CREATE INDEX idx\_user\_training\_sessions\_completed ON user\_training\_sessions(completed\_at);

---

#### **user\_story\_progress Table**

CREATE TABLE user\_story\_progress (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  user\_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,  
  story\_id TEXT NOT NULL DEFAULT 'protocol\_blackout',  
  current\_node\_id TEXT NOT NULL REFERENCES story\_nodes(id),  
  entity\_states JSONB NOT NULL, \-- Stores integrity and status for all entities  
  choices\_made JSONB, \-- Array of choice IDs taken  
  started\_at TIMESTAMPTZ NOT NULL,  
  last\_played\_at TIMESTAMPTZ DEFAULT NOW(),  
  completed BOOLEAN DEFAULT FALSE,  
  ending\_reached TEXT,  
  UNIQUE(user\_id, story\_id)  
);

CREATE INDEX idx\_user\_story\_progress\_user ON user\_story\_progress(user\_id);

---

## **🔧 Migration Phases**

### **Phase 0: Preparation (Week 1\)**

Goal: Set up infrastructure and tooling

Tasks:

*  Create packages/rsys-os/data-client package  
*  Install Supabase CLI for migration management  
*  Set up database migration workflow  
*  Create TypeScript types from schema  
*  Write seed data scripts

Deliverables:

* Migration files in supabase/migrations/  
* Seed data in supabase/seed.sql  
* Type definitions in packages/rsys-os/data-client/types/

---

### **Phase 1: Data Migration (Week 2\)**

Goal: Migrate all hardcoded data to Supabase

#### **Step 1.1: Genesis Curriculum**

Migration Script:

// scripts/migrate-genesis-curriculum.ts  
import { supabase } from '@/lib/supabase/client';  
import { GENESIS\_REQUIREMENTS } from '../src/data/GenesisCurriculum';

async function migrateGenesisCurriculum() {  
  const records \= GENESIS\_REQUIREMENTS.map((req, index) \=\> ({  
    order\_index: index \+ 1,  
    title: req.title,  
    category: req.category,  
    drill\_description: req.drill,  
    symbol: req.symbol,  
  }));

  const { data, error } \= await supabase  
    .from('genesis\_drills')  
    .insert(records)  
    .select();

  if (error) throw error;  
  console.log(\`✅ Migrated ${data.length} Genesis drills\`);  
}

Verification:

*  All 10 drills inserted correctly  
*  Order preserved  
*  Categories match enum constraints

---

#### **Step 1.2: Training Blocks**

Migration Script:

// scripts/migrate-training-blocks.ts  
import { supabase } from '@/lib/supabase/client';  
import { blocks } from '../src/app/training/page';

async function migrateTrainingBlocks() {  
  // 1\. Insert windows  
  const windows \= \[  
    { window\_type: 'sprint', duration\_minutes: 10, display\_name: 'Sprint' },  
    { window\_type: 'standard', duration\_minutes: 25, display\_name: 'Standard' },  
    { window\_type: 'grind', duration\_minutes: 45, display\_name: 'Grind' },  
  \];  
    
  await supabase.from('training\_windows').insert(windows);

  // 2\. Insert blocks  
  for (const \[windowType, windowData\] of Object.entries(blocks)) {  
    for (const item of windowData.items) {  
      const { data: blockData } \= await supabase  
        .from('training\_blocks')  
        .insert({  
          block\_code: item.id,  
          window\_type: windowType,  
          title: item.title,  
          theme: item.theme,  
          physical\_skill\_name: item.skills.physical.name,  
          physical\_skill\_description: item.skills.physical.description,  
          mental\_skill\_name: item.skills.mental.name,  
          mental\_skill\_description: item.skills.mental.description,  
        })  
        .select()  
        .single();

      // 3\. Insert cards for this block  
      const cards \= item.cards.map((card, index) \=\> ({  
        block\_id: blockData.id,  
        card\_order: index \+ 1,  
        front\_text: card.front,  
        back\_text: card.back,  
      }));

      await supabase.from('training\_cards').insert(cards);  
    }  
  }  
}

Verification:

*  3 training windows created  
*  3 training blocks created (one per window)  
*  9 training cards created (3 per block)

---

#### **Step 1.3: Protocol Blackout Story**

Migration Script:

// scripts/migrate-story-data.ts  
import { supabase } from '@/lib/supabase/client';  
import { storyNodes, initialEntities } from '../src/app/blackout/ProtocolBlackout';

async function migrateStoryData() {  
  // 1\. Migrate entities  
  const entityRecords \= Object.values(initialEntities).map(entity \=\> ({  
    id: entity.id,  
    name: entity.name,  
    title: entity.title,  
    initial\_status: entity.status,  
    initial\_integrity: entity.integrity,  
  }));  
    
  await supabase.from('story\_entities').insert(entityRecords);

  // 2\. Migrate story nodes  
  const nodeRecords \= Object.values(storyNodes).map(node \=\> ({  
    id: node.id,  
    speaker: node.speaker,  
    text\_content: node.text,  
    is\_ending: node.isEnding || false,  
    ending\_type: node.endingType,  
    ending\_name: node.endingName,  
  }));

  await supabase.from('story\_nodes').insert(nodeRecords);

  // 3\. Migrate choices  
  const choiceRecords \= \[\];  
  Object.values(storyNodes).forEach(node \=\> {  
    if (node.choices) {  
      node.choices.forEach((choice, index) \=\> {  
        choiceRecords.push({  
          node\_id: node.id,  
          choice\_order: index \+ 1,  
          choice\_text: choice.text,  
          next\_node\_id: choice.nextNodeId,  
          risk\_label: choice.risk,  
        });  
      });  
    }  
  });

  await supabase.from('story\_choices').insert(choiceRecords);  
}

Verification:

*  4 entities migrated (Mother, Watcher, Machinist, Runner)  
*  All story nodes preserved (count from source file)  
*  All choices linked correctly with risk labels

---

### **Phase 2: Component Decoupling (Weeks 3-4)**

Goal: Extract CSS-coupled components into reusable packages

#### **Step 2.1: Create Component Package**

\# Create new package structure  
mkdir \-p packages/ritual/components/src/{curriculum,training,narrative,progress}

Package Configuration:

// packages/ritual/components/package.json  
{  
  "name": "@gttm/ritual-components",  
  "version": "0.1.0",  
  "main": "src/index.ts",  
  "exports": {  
    "./curriculum": "./src/curriculum/index.ts",  
    "./training": "./src/training/index.ts",  
    "./narrative": "./src/narrative/index.ts",  
    "./progress": "./src/progress/index.ts"  
  },  
  "dependencies": {  
    "@ritual/brand": "workspace:\*",  
    "@rsys-os/design-source": "workspace:\*",  
    "react": "^18"  
  }  
}

---

#### **Step 2.2: Refactor GenesisTracker**

Current Problems:

* Hardcoded Tailwind classes (bg-indigo-600, text-gray-500)  
* Inline state management (should allow external state)  
* No theme system integration  
* Not reusable across different curricula

New Architecture:

File: packages/ritual/components/src/curriculum/CurriculumTracker.tsx

import { useTheme } from '@ritual/brand';

interface CurriculumItem {  
  id: string;  
  title: string;  
  category: string;  
  description: string;  
  symbol: string;  
}

interface CurriculumTrackerProps {  
  items: CurriculumItem\[\];  
  completed: Set\<string\>;  
  onToggle: (id: string) \=\> void;  
  variant?: 'compact' | 'detailed';  
  theme?: 'light' | 'dark';  
}

export function CurriculumTracker({  
  items,  
  completed,  
  onToggle,  
  variant \= 'detailed',  
  theme \= 'light'  
}: CurriculumTrackerProps) {  
  const themeColors \= useTheme();  
  const progress \= Math.round((completed.size / items.length) \* 100);

  return (  
    \<div   
      className="curriculum-tracker"   
      data-variant={variant}  
      data-theme={theme}  
    \>  
      {/\* CSS decoupled \- uses CSS variables from theme \*/}  
      \<div className="tracker-header"\>  
        \<h2 className="tracker-title"\>{items.length} Item Curriculum\</h2\>  
        \<span className="tracker-progress"\>{progress}% Complete\</span\>  
      \</div\>

      \<div className="tracker-progress-bar"\>  
        \<div   
          className="tracker-progress-fill"   
          style={{ width: \`${progress}%\` }}  
        /\>  
      \</div\>

      \<div className="tracker-items"\>  
        {items.map((item) \=\> (  
          \<CurriculumItem  
            key={item.id}  
            item={item}  
            completed={completed.has(item.id)}  
            onToggle={() \=\> onToggle(item.id)}  
          /\>  
        ))}  
      \</div\>  
    \</div\>  
  );  
}

CSS File: packages/ritual/components/src/curriculum/curriculum-tracker.css

/\* Uses design tokens \*/  
.curriculum-tracker {  
  max-width: var(--content-width-md);  
  margin: 0 auto;  
  padding: var(--spacing-6);  
  background: var(--surface-elevated);  
  border-radius: var(--radius-lg);  
  border: 1px solid var(--border-subtle);  
}

.curriculum-tracker\[data-theme="dark"\] {  
  background: var(--surface-elevated-dark);  
  border-color: var(--border-subtle-dark);  
}

.tracker-header {  
  display: flex;  
  justify-content: space-between;  
  align-items: center;  
  margin-bottom: var(--spacing-4);  
}

.tracker-title {  
  font-size: var(--text-2xl);  
  font-weight: var(--font-bold);  
  color: var(--text-primary);  
}

.tracker-progress {  
  font-size: var(--text-sm);  
  font-family: var(--font-mono);  
  color: var(--text-secondary);  
}

.tracker-progress-bar {  
  width: 100%;  
  height: 10px;  
  background: var(--progress-bg);  
  border-radius: var(--radius-full);  
  overflow: hidden;  
}

.tracker-progress-fill {  
  height: 100%;  
  background: var(--color-primary);  
  transition: width 500ms var(--ease-out);  
}

/\* Item styles \*/  
.curriculum-item {  
  display: flex;  
  align-items: start;  
  padding: var(--spacing-4);  
  border-radius: var(--radius-md);  
  border: 1px solid var(--border-default);  
  cursor: pointer;  
  transition: all 200ms;  
}

.curriculum-item:hover {  
  border-color: var(--color-primary-light);  
  box-shadow: var(--shadow-md);  
}

.curriculum-item\[data-completed="true"\] {  
  background: var(--color-primary-surface);  
  border-color: var(--color-primary-border);  
}

Benefits:

* ✅ No hardcoded colors (uses design tokens)  
* ✅ Theme switching support  
* ✅ Externalized state (controlled component)  
* ✅ Reusable for any curriculum type  
* ✅ Accessible CSS class names

---

#### **Step 2.3: Refactor VSMTrainer**

Problems:

* Hardcoded training blocks  
* Complex state management mixed with UI  
* Timer logic coupled to component

New Architecture:

Core Logic: packages/ritual/components/src/training/TrainingEngine.tsx

export class TrainingEngine {  
  private currentBlock: TrainingBlock | null \= null;  
  private currentCardIndex: number \= 0;  
  private timeRemaining: number \= 0;  
  private timerId: NodeJS.Timeout | null \= null;

  constructor(  
    private onTick: (timeRemaining: number) \=\> void,  
    private onComplete: () \=\> void  
  ) {}

  startSession(block: TrainingBlock, duration: number) {  
    this.currentBlock \= block;  
    this.timeRemaining \= duration;  
    this.startTimer();  
  }

  private startTimer() {  
    this.timerId \= setInterval(() \=\> {  
      this.timeRemaining--;  
      this.onTick(this.timeRemaining);  
        
      if (this.timeRemaining \<= 0\) {  
        this.stopTimer();  
        this.onComplete();  
      }  
    }, 1000);  
  }

  // ... more methods  
}

UI Component: packages/ritual/components/src/training/TrainingSession.tsx

interface TrainingSessionProps {  
  block: TrainingBlock;  
  duration: number;  
  onComplete: (stats: SessionStats) \=\> void;  
}

export function TrainingSession({ block, duration, onComplete }: TrainingSessionProps) {  
  const \[engine\] \= useState(() \=\> new TrainingEngine(  
    (time) \=\> setTimeRemaining(time),  
    () \=\> handleComplete()  
  ));

  // Clean separation of UI and logic  
  return (  
    \<div className="training-session"\>  
      \<SessionHeader block={block} timeRemaining={timeRemaining} /\>  
      \<CardDisplay card={currentCard} /\>  
      \<SessionControls onFlip={flipCard} onNext={nextCard} /\>  
    \</div\>  
  );  
}

---

#### **Step 2.4: Refactor Protocol Blackout**

Problems:

* 518 lines in single component  
* Story data hardcoded  
* Entity state management mixed with UI

New Architecture:

Story Engine: packages/ritual/components/src/narrative/StoryEngine.ts

export class StoryEngine {  
  constructor(  
    private nodes: Map\<string, StoryNode\>,  
    private entities: Map\<EntityId, Entity\>  
  ) {}

  static async load(storyId: string): Promise\<StoryEngine\> {  
    // Fetch from Supabase  
    const nodes \= await fetchStoryNodes(storyId);  
    const entities \= await fetchStoryEntities(storyId);  
    return new StoryEngine(nodes, entities);  
  }

  navigate(choiceId: string): StoryNode {  
    const choice \= this.currentNode.choices.find(c \=\> c.id \=== choiceId);  
    this.applyStatusUpdates(choice);  
    this.currentNode \= this.nodes.get(choice.nextNodeId);  
    return this.currentNode;  
  }

  // Separation of concerns \- logic only  
}

UI Component: packages/ritual/components/src/narrative/StoryPlayer.tsx

interface StoryPlayerProps {  
  storyId: string;  
  onComplete: (ending: string) \=\> void;  
}

export function StoryPlayer({ storyId, onComplete }: StoryPlayerProps) {  
  const \[engine, setEngine\] \= useState\<StoryEngine | null\>(null);  
  const \[currentNode, setCurrentNode\] \= useState\<StoryNode | null\>(null);

  useEffect(() \=\> {  
    StoryEngine.load(storyId).then(setEngine);  
  }, \[storyId\]);

  const handleChoice \= (choiceId: string) \=\> {  
    const nextNode \= engine.navigate(choiceId);  
    setCurrentNode(nextNode);  
    if (nextNode.isEnding) onComplete(nextNode.endingName);  
  };

  if (\!engine || \!currentNode) return \<LoadingState /\>;

  return (  
    \<div className="story-player"\>  
      \<EntityStatus entities={engine.entities} /\>  
      \<StoryNode node={currentNode} /\>  
      \<ChoiceList choices={currentNode.choices} onSelect={handleChoice} /\>  
    \</div\>  
  );  
}

---

### **Phase 3: Data Client Layer (Week 5\)**

Goal: Create abstraction layer for database access

File: packages/rsys-os/data-client/src/queries/useCurriculum.ts

import { useQuery } from '@tanstack/react-query';  
import { supabase } from '../client';

export function useCurriculum() {  
  return useQuery({  
    queryKey: \['genesis-curriculum'\],  
    queryFn: async () \=\> {  
      const { data, error } \= await supabase  
        .from('genesis\_drills')  
        .select('\*')  
        .eq('is\_active', true)  
        .order('order\_index');

      if (error) throw error;  
      return data;  
    },  
    staleTime: 5 \* 60 \* 1000, // Cache for 5 minutes  
  });  
}

export function useUserProgress(userId: string) {  
  return useQuery({  
    queryKey: \['user-genesis-progress', userId\],  
    queryFn: async () \=\> {  
      const { data, error } \= await supabase  
        .from('user\_genesis\_progress')  
        .select('drill\_id')  
        .eq('user\_id', userId);

      if (error) throw error;  
      return new Set(data.map(d \=\> d.drill\_id));  
    },  
  });  
}

File: packages/rsys-os/data-client/src/mutations/useToggleDrill.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';  
import { supabase } from '../client';

export function useToggleDrill(userId: string) {  
  const queryClient \= useQueryClient();

  return useMutation({  
    mutationFn: async ({ drillId, completed }: { drillId: string; completed: boolean }) \=\> {  
      if (completed) {  
        const { error } \= await supabase  
          .from('user\_genesis\_progress')  
          .insert({ user\_id: userId, drill\_id: drillId });  
        if (error) throw error;  
      } else {  
        const { error } \= await supabase  
          .from('user\_genesis\_progress')  
          .delete()  
          .eq('user\_id', userId)  
          .eq('drill\_id', drillId);  
        if (error) throw error;  
      }  
    },  
    onSuccess: () \=\> {  
      // Invalidate cache to refetch progress  
      queryClient.invalidateQueries(\['user-genesis-progress', userId\]);  
    },  
  });  
}

---

### **Phase 4: App Integration (Week 6\)**

Goal: Update app to use new packages and database

File: apps/vsm-school-web/src/app/genesis/page.tsx (Refactored)

'use client';

import { CurriculumTracker } from '@gttm/ritual-components/curriculum';  
import { useCurriculum, useUserProgress, useToggleDrill } from '@rsys-os/data-client';  
import { useAuth } from '@/hooks/useAuth';

export default function GenesisPage() {  
  const { user } \= useAuth();  
  const { data: drills, isLoading } \= useCurriculum();  
  const { data: completed } \= useUserProgress(user?.id);  
  const toggleDrill \= useToggleDrill(user?.id);

  if (isLoading) return \<Skeleton /\>;

  return (  
    \<div className="min-h-screen p-8"\>  
      \<div className="max-w-4xl mx-auto"\>  
        \<PageHeader title="Genesis Curriculum" /\>  
          
        \<CurriculumTracker  
          items={drills}  
          completed={completed}  
          onToggle={(id) \=\> {  
            const isCompleted \= completed.has(id);  
            toggleDrill.mutate({ drillId: id, completed: \!isCompleted });  
          }}  
          variant="detailed"  
          theme="light"  
        /\>  
      \</div\>  
    \</div\>  
  );  
}

Benefits:

* ✅ Component decoupled from data source  
* ✅ Automatic cache invalidation  
* ✅ Loading states handled  
* ✅ User-specific progress tracking  
* ✅ Reusable across different pages

---

### **Phase 5: Testing & Rollout (Weeks 7-8)**

Goal: Ensure migration success and rollback plan

#### **Testing Checklist**

Unit Tests:

*  CurriculumTracker renders with mock data  
*  TrainingEngine timer logic works correctly  
*  StoryEngine navigation works  
*  Database queries return correct data

Integration Tests:

*  Genesis page loads drills from database  
*  User can toggle drill completion  
*  Progress persists across sessions  
*  Training session creates database record

E2E Tests:

*  Complete training session flow (database → UI → database)  
*  Story playthrough saves progress  
*  User can resume saved story

Performance Tests:

*  Database queries cached appropriately  
*  No N+1 query problems  
*  Components render within 100ms budget

---

## **🚀 Rollout Strategy**

### **Feature Flag Pattern**

// lib/features.ts  
export const FEATURES \= {  
  USE\_DATABASE\_CURRICULUM: process.env.NEXT\_PUBLIC\_USE\_DB\_CURRICULUM \=== 'true',  
  USE\_DATABASE\_TRAINING: process.env.NEXT\_PUBLIC\_USE\_DB\_TRAINING \=== 'true',  
  USE\_DATABASE\_STORY: process.env.NEXT\_PUBLIC\_USE\_DB\_STORY \=== 'true',  
};

// apps/vsm-school-web/src/app/genesis/page.tsx  
import { FEATURES } from '@/lib/features';

export default function GenesisPage() {  
  if (FEATURES.USE\_DATABASE\_CURRICULUM) {  
    return \<GenesisPageV2 /\>; // New database version  
  }  
  return \<GenesisPageV1 /\>; // Old hardcoded version  
}

### **Rollout Phases**

Week 7: Alpha (Internal Testing)

* Deploy with all feature flags OFF  
* Enable flags for internal users only  
* Monitor errors and performance  
* Fix critical bugs

Week 8: Beta (Staged Rollout)

* Enable Genesis curriculum flag for 10% of users  
* Monitor database load and query performance  
* Enable training blocks flag for 20% of users  
* Enable story data flag for 30% of users

Week 9: General Availability

* Enable all flags for 100% of users  
* Remove feature flag code  
* Delete old hardcoded data files  
* Celebrate\! 🎉

---

## **🔄 Rollback Plan**

### **If Database Migration Fails**

Immediate Actions:

1. Set all feature flags to false  
2. App reverts to hardcoded data (zero downtime)  
3. Investigate database errors in Supabase logs

Recovery Steps:

1. Fix database schema issues  
2. Re-run migration scripts  
3. Verify data integrity  
4. Re-enable feature flags gradually

### **If Component Refactor Breaks**

Immediate Actions:

1. Revert package changes via Git  
2. Rebuild workspace (pnpm \-r build)  
3. Redeploy app

Prevention:

* All changes behind feature flags  
* Comprehensive test coverage  
* Gradual rollout

---

## **📏 Success Metrics**

### **Technical Metrics**

| Metric | Before | Target | Measurement |
| ----- | ----- | ----- | ----- |
| Component reusability | 0% | 80% | Components in packages vs apps |
| CSS coupling | High | Low | className strings per component |
| Database queries | 0 | 100% | % of data from Supabase |
| Test coverage | 0% | 70% | Jest/Vitest coverage report |
| Bundle size | TBD | \-15% | Webpack bundle analyzer |

### **Business Metrics**

| Metric | Target | Measurement |
| ----- | ----- | ----- |
| Zero downtime | 100% | Uptime monitoring |
| User-reported bugs | \< 5 | Support tickets |
| Page load time | \< 2s | Lighthouse score |
| Database query time | \< 100ms | Supabase dashboard |

---

## **💰 Cost Analysis**

### **Development Time**

| Phase | Estimated Hours | Cost (@$150/hr) |
| ----- | ----- | ----- |
| Phase 0: Preparation | 40h | $6,000 |
| Phase 1: Data Migration | 60h | $9,000 |
| Phase 2: Component Refactor | 80h | $12,000 |
| Phase 3: Data Client | 40h | $6,000 |
| Phase 4: App Integration | 60h | $9,000 |
| Phase 5: Testing & Rollout | 60h | $9,000 |
| Total | 340h | $51,000 |

### **Infrastructure Costs**

| Service | Current | After Migration | Monthly Cost |
| ----- | ----- | ----- | ----- |
| Supabase (Free tier) | $0 | $0 | $0 |
| Supabase (Pro) | \- | Optional | $25/mo |
| Vercel (Hobby) | $0 | $0 | $0 |
| Total | $0 | $0-25 | $0-25/mo |

Note: Migration stays within free tiers initially. Upgrade to Pro when user base grows.

---

## **⚠️ Risks & Mitigation**

### **Risk 1: Data Loss During Migration**

Likelihood: Medium  
Impact: HIGH  
Mitigation:

* Create database backups before migration  
* Test migration scripts on staging database  
* Use transactions for atomic operations  
* Keep hardcoded data as backup

---

### **Risk 2: Performance Degradation**

Likelihood: Low  
Impact: Medium  
Mitigation:

* Add database indexes on foreign keys  
* Implement query caching with React Query  
* Use Supabase edge functions for complex queries  
* Monitor query performance with Supabase dashboard

---

### **Risk 3: Breaking Changes to Components**

Likelihood: Medium  
Impact: Medium  
Mitigation:

* Feature flags for gradual rollout  
* Comprehensive test suite  
* Git branching strategy (feature branches)  
* Ability to revert quickly

---

### **Risk 4: User State Loss**

Likelihood: Low  
Impact: HIGH  
Mitigation:

* Migrate existing localStorage state to database  
* Provide export/import functionality  
* Graceful degradation if database unavailable

---

## **📋 Pre-Migration Checklist**

Infrastructure:

*  Supabase project created  
*  Environment variables configured  
*  Database migrations folder set up  
*  CI/CD pipeline updated for new packages

Development:

*  Create @gttm/ritual-components package  
*  Create @rsys-os/data-client package  
*  Install React Query in app  
*  Set up feature flag system

Data:

*  Export all hardcoded data to JSON  
*  Write database seed scripts  
*  Create database backup strategy  
*  Document data models

Testing:

*  Write unit tests for new components  
*  Write integration tests for database queries  
*  Set up E2E test environment  
*  Create test data sets

Documentation:

*  Update README with new architecture  
*  Document database schema  
*  Create migration runbook  
*  Update .github/copilot-instructions.md

---

## **📚 Post-Migration Benefits**

### **Developer Experience**

✅ Reusable Components \- Use CurriculumTracker for any curriculum  
✅ Type Safety \- Database types generated from schema  
✅ Easier Testing \- Components testable without database  
✅ Clear Separation \- Logic, data, and UI in separate layers  
✅ Theme Consistency \- All components use design tokens

### **User Experience**

✅ Faster Load Times \- Cached queries reduce API calls  
✅ Offline Support \- React Query cache enables offline mode  
✅ Cross-Device Sync \- Progress saved to database  
✅ Dynamic Content \- Admin can update content without code deploy  
✅ Personalization \- User-specific data enables recommendations

### **Business Value**

✅ Content Management \- Non-technical staff can update curriculum  
✅ A/B Testing \- Easy to create variants in database  
✅ Analytics \- Track which drills users complete  
✅ Scalability \- Add new features without refactoring  
✅ Multi-Tenant \- Support multiple brands/clients

---

## **🎯 Conclusion**

This migration plan transforms the VSM School Web app from a hardcoded prototype into a scalable, database-driven platform with reusable component architecture.

Key Achievements:

* Component reusability increases from 0% to 80%  
* All data moved to Supabase (enables CRUD operations)  
* CSS decoupled from components (theme system integration)  
* Zero downtime migration (feature flags \+ gradual rollout)

Timeline: 8 weeks  
Cost: $51,000 development \+ $0-25/mo infrastructure  
Risk: Medium (mitigated with feature flags and testing)

Recommendation: Proceed with migration. The architectural improvements will pay dividends as the platform grows.

---

Migration Plan Authored By: GitHub Copilot  
Last Updated: December 18, 2025  
Status: Ready for Review → Approval → Execution  
