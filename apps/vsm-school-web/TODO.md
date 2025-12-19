# VSM School Web - TODO

**Created:** December 18, 2025  
**Status:** 🚧 Active Development  
**Architecture:** Mission Surface (Track → Card → Ritual Flow)

---

## 🎯 Mission Context

This app implements the **VSM (Velocity State Machine) Training System** with a mobile-first, card-based progression architecture. The core flow:

**6-Step Mobile Flow:** Pulse → Codex → Track → Prime → Produce → Archive

**3 Training Tracks:**
- Genesis (The Alphabet) - Visual primitives: Dot, Rectangle, Diamond, Arrow
- Source Code (The Doctrine) - Systems-Work Workbook drills
- Powerhouse (The Mission) - Creative dexterity and strategy

---

## 🔴 CRITICAL (P0) - Next 2 Weeks

### 1. Database Migration & Seeding
**Owner:** Backend  
**Effort:** 16 hours  
**Blocking:** All feature development

- [ ] Execute Supabase schema creation (see RDX migration plan)
  - [ ] genesis_drills table (10 primitives)
  - [ ] training_windows table (sprint/standard/grind)
  - [ ] training_blocks table (blocks with physical/mental skills)
  - [ ] training_cards table (card front/back content)
  - [ ] story_nodes, story_choices, story_entities (Protocol Blackout)
  - [ ] user_genesis_progress, user_training_sessions, user_story_progress
- [ ] Run seed script: `apps/vsm-school-web/scripts/seed-mission-registry.ts`
  - Script already created, needs execution with Supabase credentials
  - Migrates 3 training windows, 9 blocks, 27 cards from mission-registry.ts
- [ ] Verify seed data in Supabase dashboard
- [ ] Document rollback procedure in case of seed failure

**Dependencies:**
- Supabase project with proper RLS policies
- Environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

**Reference:**
- [vsm-school-merger-component-data-migration-plan.md](./vsm-school-merger-component-data-migration-plan.md) lines 50-150
- [RDX/2025-12-18_migration-plan-components-data.md](../../RDX/2025-12-18_migration-plan-components-data.md)

---

### 2. Implement CardRitual Component
**Owner:** Frontend  
**Effort:** 24 hours  
**Blocking:** Mission Surface route

Create the 4-phase card execution flow as a reusable component.

**Requirements:**
- [ ] Create `src/components/CardRitual/` directory
- [ ] Implement CardRitual.tsx with 4 phases:
  - **Phase I: Codex** - Read-only context (optional, skippable)
  - **Phase II: Instruction** - Clear drill guidance
  - **Phase III: Prime** - Timed state alignment (30-60s)
  - **Phase IV: Produce** - Work surface for output capture
- [ ] Mobile-first design with vertical swipe or "Next" button navigation
- [ ] Integrate with existing `@gttm/ritual-brand` theme system
- [ ] Support haptic feedback on phase transitions (mobile)
- [ ] Track phase completion in local state
- [ ] Props interface:
  ```typescript
  type RitualPhase = 'codex' | 'instruction' | 'prime' | 'produce';
  
  interface CardRitualProps {
    card: TrainingCard;           // From mission-registry
    onComplete: (output: string) => void;
    onCancel?: () => void;
  }
  ```
- [ ] Unit tests for phase transitions
- [ ] Responsive layout tests (mobile 375px, tablet 768px, desktop 1440px)

**Design References:**
- [vsm-web-review-migration.md](./vsm-web-review-migration.md) lines 140-175 (4-Phase Ritual UI)
- [vsm-training-dojo.md](../../docs/specs/vsm-training-dojo.md) (immersive card-flip interface)
- [mission-surface-migration-checklist.md](./mission-surface-migration-checklist.md) Phase 2: Components

**Acceptance Criteria:**
- Card can progress through all 4 phases without errors
- Prime timer counts down from specified duration
- Produce surface captures output text
- onComplete callback fires with user's output
- Visual design matches Ritual brand (phase colors from phases.json)

---

### 3. Implement WorkSurface Component
**Owner:** Frontend  
**Effort:** 16 hours  
**Blocking:** Mission Surface completion view

Full-screen distraction-free editor for output capture.

**Requirements:**
- [ ] Create `src/components/WorkSurface/` directory
- [ ] Implement WorkSurface.tsx with:
  - Full-screen mode (no chrome, no distractions)
  - Markdown preview (split view or toggle)
  - "Sticky" reference card at top showing drill context
  - Character/word count
  - Auto-save to localStorage every 30 seconds
  - "Archive Output" CTA button
- [ ] Props interface:
  ```typescript
  interface WorkSurfaceProps {
    cardContext: {
      track: string;       // 'genesis' | 'source_code' | 'powerhouse'
      cardTitle: string;
      drillPrompt: string;
    };
    initialContent?: string;  // For resuming sessions
    onArchive: (content: string) => void;
    onCancel?: () => void;
  }
  ```
- [ ] Integrate with atoms table for Archive logging
- [ ] Keyboard shortcuts (Cmd+Enter to Archive, Cmd+P for preview)
- [ ] Mobile keyboard optimization (avoid viewport shift)

**Design References:**
- [vsm-web-review-migration.md](./vsm-web-review-migration.md) lines 200-230 (Step 5: Produce)
- [mission-surface-migration-checklist.md](./mission-surface-migration-checklist.md) Phase 2: Components

**Acceptance Criteria:**
- Editor renders with full screen on mobile
- Markdown preview works correctly
- Auto-save recovers content after browser crash
- Archive button writes to Supabase atoms table with trackId/cardId/outputSummary
- Context card remains visible during scrolling

---

### 4. Refactor Training Page to Use Mission Registry
**Owner:** Backend + Frontend  
**Effort:** 8 hours  
**Status:** ⚠️ Partially complete

Migration from hardcoded blocks to database-driven content.

**Current State:**
- ✅ Mission registry created in `src/lib/mission-registry.ts`
- ✅ Training page imports from registry instead of inline data
- ✅ Ship-to-Shell payload enriched with trackId/cardId/outputSummary
- ⏳ Data still hardcoded in mission-registry.ts (not from database)

**Remaining Work:**
- [ ] Create React Query hooks in `src/lib/hooks/useTrainingData.ts`:
  - `useTrainingWindows()` - Fetch from training_windows table
  - `useTrainingBlocks(windowType)` - Fetch blocks for selected window
  - `useTrainingCards(blockId)` - Fetch cards for selected block
- [ ] Replace mission-registry imports with database queries:
  ```typescript
  // Before:
  import { missionRegistry } from '@/lib/mission-registry';
  
  // After:
  const { data: windows } = useTrainingWindows();
  const { data: blocks } = useTrainingBlocks(selectedWindow);
  const { data: cards } = useTrainingCards(selectedBlock);
  ```
- [ ] Add loading states for async data fetching
- [ ] Add error boundaries for failed queries
- [ ] Add optimistic updates for Ship-to-Shell writes
- [ ] Feature flag: USE_DATABASE_TRAINING (toggle between registry and database)

**Migration Strategy:**
1. Keep mission-registry.ts as fallback data source
2. Use feature flag to enable database mode
3. Gradually roll out to users (0% → 10% → 50% → 100%)
4. Monitor Supabase query performance
5. Remove mission-registry.ts after 100% rollout

**Reference:**
- [RDX/2025-12-18_1710_GitHub-Copilot_mission-surface-audit.md](../../RDX/2025-12-18_1710_GitHub-Copilot_mission-surface-audit.md) - Immediate Next Steps section

---

## 🟠 HIGH PRIORITY (P1) - Weeks 3-4

### 5. Implement MissionSurface Orchestrator
**Owner:** Frontend  
**Effort:** 32 hours  
**Blocking:** Unified 6-step flow

Create the master page that coordinates Pulse → Codex → Track → Prime → Produce → Archive.

**Requirements:**
- [ ] Create `src/app/mission/MissionSurface.tsx`
- [ ] Implement state machine for 6-step flow:
  ```typescript
  type MissionStep = 'pulse' | 'codex' | 'track' | 'prime' | 'produce' | 'archive';
  
  interface MissionState {
    currentStep: MissionStep;
    selectedWindow?: 'sprint' | 'standard' | 'grind';
    selectedTrack?: 'genesis' | 'source_code' | 'powerhouse';
    selectedCard?: TrainingCard;
    primeOutput?: string;
    produceOutput?: string;
  }
  ```
- [ ] Step 1: Pulse - Time window selector (10m/25m/45m)
- [ ] Step 2: Codex - Optional doctrinal framing (skippable)
- [ ] Step 3: Track - Select Genesis/Source Code/Powerhouse
- [ ] Step 4: Prime - CardRitual component (timed state alignment)
- [ ] Step 5: Produce - WorkSurface component (capture output)
- [ ] Step 6: Archive - Success animation + progress update
- [ ] Navigation: Each step is full-screen, "Next" button advances
- [ ] Back button logic: Allow going back to previous step
- [ ] Session persistence: Save progress to localStorage
- [ ] Resume flow: If user exits mid-session, offer to resume

**Integration Points:**
- RitualCycleTracker (Pulse) for timer/phase management
- CardRitual for step 4 (Prime)
- WorkSurface for step 5 (Produce)
- Supabase atoms table for Archive logging
- user_training_sessions table for session tracking

**Design References:**
- [vsm-web-review-migration.md](./vsm-web-review-migration.md) lines 240-310 (6-Step Mobile Flow)
- [vsm-training-dojo.md](../../docs/specs/vsm-training-dojo.md)
- [naming-canonical-lock.md](./naming-canonical-lock.md) - Canonical flow definition

**Acceptance Criteria:**
- User can complete full 6-step flow without errors
- Each step transitions smoothly with animations
- Session state persists across page refreshes
- Archive writes to database with complete metadata (type: vsm_session)
- Mobile experience is thumb-driven (large tap targets)

---

### 6. Track-Based Progress System
**Owner:** Backend + Frontend  
**Effort:** 20 hours  
**Blocking:** User retention features

Display user progress as "Literacy Score" per track.

**Requirements:**
- [ ] Create progress calculation queries:
  ```typescript
  // Example: Genesis track progress
  SELECT 
    COUNT(DISTINCT card_id) * 100.0 / (SELECT COUNT(*) FROM training_cards WHERE track = 'genesis') as literacy_percent
  FROM user_training_sessions
  WHERE user_id = $1 AND track = 'genesis' AND completed_at IS NOT NULL;
  ```
- [ ] Implement progress bars in Track selection UI:
  ```
  TRACK: GENESIS
  Status: 25% Literate (1/4 Cards)
  [✓] CARD 01: THE DOT - Mastered
  [▶] CARD 02: THE RECTANGLE - In Progress
  [ ] CARD 03: THE DIAMOND - Locked
  [ ] CARD 04: THE ARROW - Locked
  ```
- [ ] Card locking logic: Card N+1 unlocks after completing Card N
- [ ] Badge system: Award badges at 25%, 50%, 75%, 100% literacy
- [ ] Export progress as JSON for user portfolio
- [ ] Dashboard route: `/dashboard` showing all tracks and progress

**Database Queries:**
- user_genesis_progress for Genesis track
- user_training_sessions for Source Code and Powerhouse
- Aggregate queries for overall progress metrics

**Reference:**
- [vsm-web-review-migration.md](./vsm-web-review-migration.md) lines 175-210 (Data-Driven Progress)

---

### 7. Codex Integration with Mission Surface
**Owner:** Frontend  
**Effort:** 12 hours  
**Dependency:** CardRitual component complete

Link Codex (narrative/lore) to training sessions.

**Requirements:**
- [ ] Identify story nodes that should trigger training
  - Example: "Machinist Report" node → Load "Swimlane" (Card B) drill
- [ ] Add `triggers_training_card` column to story_choices table:
  ```sql
  ALTER TABLE story_choices ADD COLUMN triggers_training_card UUID REFERENCES training_cards(id);
  ```
- [ ] When user makes choice with training trigger:
  1. Save story state to user_story_progress
  2. Transition to Mission Surface with pre-selected card
  3. After session completion, return to Codex with updated entity states
- [ ] Visual indicator in Codex: Mark choices that unlock training
- [ ] Achievement: "Synced Narrative" badge for completing 5 Codex-triggered sessions

**Design Goal:**
Make Codex (formerly Protocol Blackout) the narrative wrapper for VSM training. Story choices become "mission briefings" that flow into training sessions.

**Reference:**
- [vsm-web-review-migration.md](./vsm-web-review-migration.md) lines 310-340 (Unified Mission Control)
- [RDX/2025-12-18_audit-vsm-school-web.md](../../RDX/2025-12-18_audit-vsm-school-web.md) (Protocol Blackout is 518 lines)

---

### 8. Audio Integration for Mission Surface
**Owner:** Frontend  
**Effort:** 8 hours  
**Dependency:** Mission Surface orchestrator

Phase-specific audio for each mission step.

**Requirements:**
- [ ] Use existing `useRitualSound` hook from `@gttm/ritual-ui`
- [ ] Audio manifest already exists in `@rsys-os/design-source/tokens/audio.json`
- [ ] Map mission steps to ritual phases:
  - Pulse → Plan phase (amber, 5 min)
  - Codex → Plan phase
  - Track → Plan phase
  - Prime → Sprint phase (emerald, 25 min)
  - Produce → Reflect phase (purple, 10 min)
  - Archive → Recover phase (rose, 5 min)
- [ ] Background music plays during Prime (Sprint tracks)
- [ ] Chime sounds on phase transitions
- [ ] Mute button in UI (persistent preference in localStorage)
- [ ] Web Audio fallback if audio context unavailable

**Audio Assets:**
Already exist in `packages/rsys-os/design-source/assets/audio/`:
- plan_focus_v1.wav
- sprint_flow_v1.wav
- reflect_capture_v1.wav
- recover_reset_v1.wav

**Reference:**
- [.github/copilot-instructions.md](../../.github/copilot-instructions.md) Audio Architecture section
- [packages/ritual/ui-lib/src/hooks/useRitualSound.ts](../../packages/ritual/ui-lib/src/hooks/useRitualSound.ts)

---

## 🟡 MEDIUM PRIORITY (P2) - Weeks 5-6

### 9. Component Decoupling - Extract to Packages
**Owner:** Frontend  
**Effort:** 40 hours  
**Goal:** Make components reusable across future apps

Create shared component packages for curriculum, training, and narrative engines.

**Package Structure:**
```
packages/ritual/components/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── curriculum/
│   │   ├── GenesisTracker.tsx        (extracted from apps/vsm-school-web)
│   │   └── ProgressChecklist.tsx     (generalized version)
│   ├── session/
│   │   ├── CardRitual.tsx            (from P0 task #2)
│   │   ├── WorkSurface.tsx           (from P0 task #3)
│   │   └── MissionSurface.tsx        (from P1 task #5)
│   ├── codex/
│   │   ├── CodexViewer.tsx           (extracted from Protocol Blackout)
│   │   └── ChoiceNode.tsx
│   └── progress/
│       ├── LiteracyBar.tsx
│       └── TrackStatus.tsx
```

**Migration Tasks:**
- [ ] Create `packages/ritual/components/` package
- [ ] Extract GenesisTracker from apps/vsm-school-web/src/components/
- [ ] Refactor GenesisTracker to remove app-specific dependencies
  - Replace direct Supabase calls with props/callbacks
  - Use design tokens from @rsys-os/design-source
- [ ] Extract Codex (Protocol Blackout) story engine logic
  - Separate data (story_nodes) from UI (rendering)
  - Create generic CodexViewer that accepts node graph as prop
- [ ] Write Storybook stories for all components
- [ ] Document component APIs in README.md
- [ ] Update apps/vsm-school-web to import from new package:
  ```typescript
  import { GenesisTracker, CardRitual, WorkSurface } from '@gttm/ritual-components';
  ```

**Testing Requirements:**
- [ ] Visual regression tests (Chromatic or Percy)
- [ ] Unit tests for component logic (Vitest)
- [ ] Integration tests for Mission Surface flow (Playwright)

**Reference:**
- [RDX/2025-12-18_migration-plan-components-data.md](../../RDX/2025-12-18_migration-plan-components-data.md) Phase 3: Component Extraction

---

### 10. Data Client Package - Supabase Abstraction
**Owner:** Backend  
**Effort:** 32 hours  
**Goal:** Centralize database queries and mutations

Create dedicated package for all Supabase interactions.

**Package Structure:**
```
packages/rsys-os/data-client/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── client.ts              (Supabase client singleton)
│   ├── types/                 (Generated from database schema)
│   │   ├── database.types.ts
│   │   ├── genesis.types.ts
│   │   ├── training.types.ts
│   │   └── story.types.ts
│   ├── queries/               (React Query hooks)
│   │   ├── useGenesisDrills.ts
│   │   ├── useTrainingData.ts
│   │   ├── useStoryProgress.ts
│   │   └── useUserProgress.ts
│   └── mutations/             (Write operations)
│       ├── useShipToShell.ts
│       ├── useCompleteCard.ts
│       └── useUpdateProgress.ts
```

**Implementation Tasks:**
- [ ] Generate TypeScript types from Supabase schema:
  ```bash
  npx supabase gen types typescript --project-id <ref> > src/types/database.types.ts
  ```
- [ ] Create React Query hooks for all tables
- [ ] Implement query caching strategy (5-minute cache for static content)
- [ ] Add optimistic updates for mutations
- [ ] Error handling and retry logic
- [ ] Rate limiting for Ship-to-Shell writes
- [ ] Mock client for testing (in-memory database)

**Example Hook:**
```typescript
// packages/rsys-os/data-client/src/queries/useTrainingCards.ts
export function useTrainingCards(blockId: string) {
  return useQuery({
    queryKey: ['training-cards', blockId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_cards')
        .select('*')
        .eq('block_id', blockId)
        .order('card_order');
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

**Reference:**
- [RDX/2025-12-18_migration-plan-components-data.md](../../RDX/2025-12-18_migration-plan-components-data.md) Phase 4: Data Client

---

### 11. Testing Strategy - Achieve 60% Coverage
**Owner:** QA + All  
**Effort:** 48 hours  
**Current State:** 0% coverage (per RDX audit)

Establish testing infrastructure and cover critical paths.

**Testing Layers:**
1. **Unit Tests** (Vitest) - 40% coverage target
   - Component logic (CardRitual state machine)
   - Utility functions (mission-registry helpers)
   - Hooks (useTrainingData, useRitualSound)
   
2. **Integration Tests** (Playwright) - 10% coverage target
   - Full mission flow (Pulse → Ship)
   - Training page card selection
   - Ship-to-Shell database write
   
3. **Visual Regression Tests** (Percy/Chromatic) - 10% coverage target
   - RitualCycleTracker desktop/mobile
   - CardRitual 4 phases
   - ForgeEditor layouts

**Priority Test Cases:**
- [ ] Mission Surface: User completes 6-step flow
- [ ] Training Page: Select window → block → card → ship
- [ ] Genesis Tracker: Toggle drill completion
- [ ] Protocol Blackout: Make choice → update entities
- [ ] Ship-to-Shell: Write to atoms table with correct metadata
- [ ] Progress System: Calculate literacy percentage
- [ ] Audio System: Phase transitions trigger sounds

**Test Data:**
- [ ] Create fixtures for training data (windows, blocks, cards)
- [ ] Mock Supabase client for unit tests
- [ ] Seed test database for integration tests

**CI/CD Integration:**
- [ ] Add GitHub Actions workflow for tests
- [ ] Block PRs if tests fail
- [ ] Generate coverage reports
- [ ] Alert if coverage drops below 60%

**Reference:**
- [RDX/2025-12-18_audit-vsm-school-web.md](../../RDX/2025-12-18_audit-vsm-school-web.md) Critical Gaps section

---

### 12. Editor Route - Content Management Interface
**Owner:** Frontend  
**Effort:** 24 hours  
**Status:** Placeholder route exists

Build admin interface for managing training content.

**Requirements:**
- [ ] Remove placeholder in `src/app/editor/page.tsx`
- [ ] Create CRUD interface for training content:
  - Genesis drills (10 items)
  - Training blocks (9 blocks)
  - Training cards (27 cards)
  - Story nodes (~50 nodes)
- [ ] Rich text editor for card content (Tiptap or Lexical)
- [ ] Preview mode: Test card in CardRitual component
- [ ] Validation: Ensure required fields are filled
- [ ] Publish workflow: Draft → Review → Published states
- [ ] Version history: Track changes to training content
- [ ] Bulk import: CSV upload for new cards

**Authentication:**
- [ ] Protect /editor route with Supabase auth
- [ ] Admin role check (only content creators can access)
- [ ] Audit log for content changes

**Design:**
- [ ] Table view with search/filter
- [ ] Modal or slide-out panel for editing
- [ ] Drag-and-drop reordering for card sequences

**Reference:**
- [RDX/2025-12-18_audit-vsm-school-web.md](../../RDX/2025-12-18_audit-vsm-school-web.md) - /editor route placeholder identified

---

## 🟢 LOW PRIORITY (P3) - Weeks 7-8

### 13. Authentication & User Management
**Owner:** Backend + Frontend  
**Effort:** 24 hours  
**Dependency:** Supabase RLS policies

Implement Supabase Auth for user accounts.

**Requirements:**
- [ ] Add Supabase Auth UI component
- [ ] Sign up flow with email verification
- [ ] Login flow (email/password, magic link, OAuth)
- [ ] Password reset flow
- [ ] User profile page: Display name, avatar, progress stats
- [ ] Session management (persistent login)
- [ ] Row Level Security (RLS) policies:
  ```sql
  -- Users can only read their own progress
  CREATE POLICY "Users can view own progress" ON user_training_sessions
    FOR SELECT USING (auth.uid() = user_id);
  
  -- Users can only write their own atoms
  CREATE POLICY "Users can insert own atoms" ON atoms
    FOR INSERT WITH CHECK (auth.uid() = user_id);
  ```

**UI Components:**
- [ ] Login modal (triggered from Sidebar)
- [ ] User menu in header (avatar dropdown)
- [ ] Anonymous mode: Allow using app without account (localStorage only)
- [ ] Account upgrade prompt: After 5 sessions, suggest creating account

**Reference:**
- [RDX/2025-12-18_audit-vsm-school-web.md](../../RDX/2025-12-18_audit-vsm-school-web.md) Critical Gaps section

---

### 14. Mobile PWA Optimization
**Owner:** Frontend  
**Effort:** 16 hours  
**Goal:** Make app installable on mobile devices

**Requirements:**
- [ ] Create `manifest.json` with app metadata
- [ ] Add service worker for offline support
- [ ] Cache static assets (audio files, images)
- [ ] Offline mode: Allow completing training without internet
- [ ] Sync queued Ship-to-Shell writes when connection restored
- [ ] Add to Home Screen prompt (iOS Safari, Android Chrome)
- [ ] Splash screen with VSM branding
- [ ] Haptic feedback for interactions (navigator.vibrate API)
- [ ] Lock screen orientation to portrait on mobile

**PWA Checklist:**
- [ ] HTTPS enabled (required for service worker)
- [ ] Lighthouse PWA score > 90
- [ ] Works offline after first visit
- [ ] Fast load time (<3s on 3G)

**Reference:**
- [vsm-web-review-migration.md](./vsm-web-review-migration.md) - Mobile-first architecture emphasized throughout

---

### 15. Analytics & Monitoring
**Owner:** Backend  
**Effort:** 12 hours  
**Goal:** Track user behavior and app performance

**Requirements:**
- [ ] Integrate analytics (Posthog, Mixpanel, or Vercel Analytics)
- [ ] Track key events:
  - Mission started (window type)
  - Card completed (track, card_id, duration)
  - Ship-to-Shell (word count, session duration)
  - Drop-off points (which step users abandon)
- [ ] Error tracking (Sentry or Supabase Edge Functions)
- [ ] Performance monitoring:
  - Page load times
  - Database query latency
  - Audio loading delays
- [ ] A/B testing framework for UI experiments
- [ ] Dashboard for admin: User retention, completion rates, popular tracks

**Privacy:**
- [ ] GDPR compliance (cookie consent banner)
- [ ] Anonymous mode (no tracking if user opted out)
- [ ] Data export: Users can download their analytics data

---

### 16. Content Expansion - New Training Tracks
**Owner:** Content + Frontend  
**Effort:** 40 hours  
**Goal:** Add more tracks beyond Genesis/Source Code/Powerhouse

**Proposed Tracks:**
1. **Command Line Velocity** - Terminal/CLI speed drills
2. **Creative Dexterity** - Hand-eye coordination (card shuffling, sketching)
3. **Strategic Vision** - High-level systems thinking
4. **Empathy Maps** - User research and stakeholder analysis

**For Each Track:**
- [ ] Define 4-6 cards with front/back content
- [ ] Write Blackout narrative introduction
- [ ] Create drill instructions (60-second exercises)
- [ ] Design visual assets (if needed)
- [ ] Seed data to training_blocks and training_cards tables
- [ ] Add to Track selection UI

**Reference:**
- [vsm-web-review-migration.md](./vsm-web-review-migration.md) lines 220-240 (Track examples)

---

## 🔵 INFRASTRUCTURE & DEVOPS

### 17. CI/CD Pipeline
**Owner:** DevOps  
**Effort:** 12 hours  

**Requirements:**
- [ ] GitHub Actions workflow for:
  - Build packages (ritual-brand, ritual-ui)
  - Build Next.js app
  - Run tests
  - Deploy to Vercel (staging + production)
- [ ] Automated database migrations (Supabase CLI)
- [ ] Rollback strategy for failed deployments
- [ ] Preview deployments for PRs

---

### 18. Documentation
**Owner:** All  
**Effort:** 16 hours  
**Status:** Partially complete

**Required Documentation:**
- [ ] Update [README.md](../../README.md) with new architecture
- [ ] Component API docs in Storybook
- [ ] Database schema documentation (ER diagram)
- [ ] Developer onboarding guide
- [ ] User guide: How to use Mission Surface
- [ ] Content creator guide: How to add new training cards
- [ ] Troubleshooting guide (common errors)

---

## 📊 METRICS & SUCCESS CRITERIA

**Definition of Done for P0 Tasks:**
- [ ] User can complete full Mission Surface flow (6 steps)
- [ ] Training data loads from Supabase (not hardcoded)
- [ ] Ship-to-Shell writes to atoms table with complete metadata
- [ ] Progress tracking calculates literacy percentage per track
- [ ] Zero critical bugs in production

**Phase 1 Success (End of Week 4):**
- 100% of P0 tasks complete
- 80% of P1 tasks complete
- Test coverage > 40%
- Mission Surface deployed to production with feature flag

**Phase 2 Success (End of Week 8):**
- All P0 and P1 tasks complete
- 60% of P2 tasks complete
- Test coverage > 60%
- Component packages published to npm
- Data client package published to npm
- 100+ daily active users

---

## 🚨 KNOWN BLOCKERS & RISKS

### Blockers:
1. **Supabase credentials** - Need NEXT_PUBLIC_SUPABASE_URL and ANON_KEY
2. **Audio asset licensing** - Verify VictorV_Audio files are licensed for production
3. **Content approval** - Training card content needs review before production

### Risks:
1. **Database performance** - 1000+ users hitting Supabase may require indexing
2. **Mobile audio** - iOS Safari has strict autoplay policies
3. **Offline sync conflicts** - Multiple devices editing same session
4. **Component coupling** - Mission Surface tightly couples 5+ components

### Mitigation:
- Use feature flags for gradual rollout (catch performance issues early)
- Add database connection pooling (Supabase Pro plan)
- Write comprehensive error handling for audio failures
- Document component boundaries and interfaces clearly

---

## 📝 ADDITIONAL NOTES

### Design Philosophy:
> "Minimal, ritualistic, distraction-free. This is the **dojo mat you step onto**."

Keep UI simple, phase-driven, and mobile-first. Avoid feature creep.

### Architecture Principles:
1. **Design tokens flow:** JSON → CSS variables → React components
2. **Data separation:** Content lives in database, not component code
3. **Component isolation:** Each component has single responsibility
4. **Progressive enhancement:** Works without JS, better with JS
5. **Mobile-first:** Thumb-driven, vertical scrolling, full-screen steps

### Code Quality Standards:
- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- No `any` types (use `unknown` and narrow)
- Components under 300 lines (extract subcomponents)
- Functions under 50 lines (extract helpers)
- Meaningful variable names (no abbreviations)

---

## 🔗 RELATED DOCUMENTS

- [agent-mission.md](./agent-mission.md) - Original mission brief
- [vsm-web-review-migration.md](./vsm-web-review-migration.md) - Mobile architecture vision
- [vsm-school-merger-component-data-migration-plan.md](./vsm-school-merger-component-data-migration-plan.md) - Database schema
- [mission-surface-migration-checklist.md](./mission-surface-migration-checklist.md) - Phase-by-phase checklist
- [RDX/2025-12-18_audit-vsm-school-web.md](../../RDX/2025-12-18_audit-vsm-school-web.md) - Comprehensive app audit
- [RDX/2025-12-18_migration-plan-components-data.md](../../RDX/2025-12-18_migration-plan-components-data.md) - 8-week migration plan
- [docs/specs/vsm-training-dojo.md](../../docs/specs/vsm-training-dojo.md) - Training interface design spec

---

**Last Updated:** December 18, 2025  
**Next Review:** December 25, 2025 (after P0 completion)
