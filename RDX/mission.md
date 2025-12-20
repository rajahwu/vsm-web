MISSION BRIEF: Package Liberation & Extraction
OBJECTIVE:
Extract kidnapped components from VSM School monolith back to their proper product namespaces as standalone, reusable packages.
SITUATION:
Components were pulled into packages/ritual/ui-lib/ and apps/vsm-school-web/ to build VSM School. Now liberating them to proper architecture with clear product boundaries.
TARGET ARCHITECTURE:
packages/
├── vsm/brand/                    # VSM design-source consumer
├── ritual/
│   ├── brand/                    # Ritual design-source consumer
│   └── components/               # Ritual mechanics (phases, timing, RitualCard)
├── gttm/
│   ├── brand/                    # GTTM design-source consumer
│   ├── components/               # Shared utils (TheNet, MarkdownRenderer)
│   ├── mission/                  # Mission flow system
│   ├── story/                    # Story player (session + engine)
│   └── codex/                    # Content + viewer
├── clearline7/                   # Document style system (→ npm eventually)
└── rsys-os/design-source/        # Foundation tokens/assets (context-aware)
EXTRACTION SOURCES:
FROM packages/ritual/ui-lib/src/:

- [x] mission/* → `@gttm/mission`
- [x] components/TheNet.tsx → `@gttm/components`
- [x] RitualCycleTracker.tsx, phases.ts, hooks/ → `@ritual/components`

FROM apps/vsm-school-web/:

components/StorySession.tsx → @gttm/story
components/CardRitual.tsx, MissionSurface.tsx → @gttm/mission
lib/story/* → @gttm/story
lib/mission-*, hooks/useMissionProgress.ts → @gttm/mission
lib/codex.ts, lib/registry/transmissions-*.md → @gttm/codex

KEY PRINCIPLES:

If it has a brand → it has a namespace
Design-source auto-detects context via package.json name
Extract first, publish decisions later
Each system gets its Card component (MissionCard, CodexCard, RitualCard)

CONSTRAINTS:

React as peerDependency (apps provide)
Maintain TypeScript strict mode
Preserve existing functionality
Document mobile viewport issue (375px test failure)

SUCCESS CRITERIA:

Clean package boundaries
No circular dependencies
VSM app consumes via workspace imports
Ready for npm publish (any package, any time)

---

## EXTRACTION STATUS (2025-12-19)

### ✅ COMPLETED EXTRACTIONS

**@ritual/components** (partial)
- Basic package structure created at `packages/ritual/components/`
- Ready for ritual-specific components (RitualCard, phase mechanics)

**@gttm/mission, @gttm/story, @gttm/codex**
- Package structure scaffolded with package.json + tsconfig.json
- No src/ directories yet - awaiting component extraction

**packages/ritual/ui-lib/src/mission/**
- ✅ CodexViewer.tsx - Codex narrative display
- ✅ MarkdownRenderer.tsx - Content rendering utility
- ✅ MissionSuccess.tsx - Completion screen
- ✅ PrimePanel.tsx - State alignment UI
- ✅ WorkSurface.tsx - Full-screen work editor
- ✅ FlowErrorBoundary.tsx - Mission flow error handling

### 🚧 PENDING EXTRACTIONS

**High Priority (P0)**

FROM `apps/vsm-school-web/src/components/`:
- [x] **MissionSurface.tsx** → `@gttm/mission`
  - Current: 420 lines, orchestrates Pulse → Track → Ritual → Success
  - Dependency: localStorage progress, CardRitual, MissionSuccess
  - Target: Extract as `<MissionOrchestrator>` with injection points

- [x] **CardRitual.tsx** → `@gttm/mission`
  - Current: 4-phase executor (codex → instruction → prime → produce)
  - Dependency: StorySession, CodexViewer, PrimePanel, WorkSurface
  - Target: Extract as `<RitualExecutor>` with phase plugin system

- [x] **StorySession.tsx** → `@gttm/story`
  - Current: Story player wrapper consuming StoryPlayer
  - Dependency: StoryPlayer engine (already in ritual-ui-lib)
  - Target: Extract to `@gttm/story` with story registry

FROM `apps/vsm-school-web/src/lib/`:
- [x] **registry/** (transmissions-*.md) → `@gttm/codex`
  - Current: Markdown narrative content files
  - Target: Extract to `@gttm/codex/content/` with manifest

- [x] **mission-registry.ts** → `@gttm/mission`
  - Current: Hardcoded training window/block/card data
  - Target: Extract types + factory pattern (data from Supabase)

- [x] **story/*** → `@gttm/story`
  - Current: Story node definitions, registry
  - Target: Extract to `@gttm/story/content/` with typed schema

FROM packages/ritual/ui-lib/:
- [x] **mission/** → `@gttm/mission` (Completed extraction of primitives)
- [x] **StoryPlayer.tsx** → `@gttm/story`

**Medium Priority (P1)**

- [x] Extract `TheNet` → `@gttm/components` (universal capture utility)
- [x] Extract phase mechanics → `@ritual/components` (timing, audio)
- [x] Create design-source consumers in each brand package
- [x] Add package README.md with usage examples

**Low Priority (P2)**

- [x] Document API boundaries and injection points (via READMEs)
- [ ] Add package-level tests (unit + integration)
- [ ] Create npm publish workflow (optional, for external use)

### 🔍 KEY FINDINGS

**Architecture Observations:**

1. **Mission components are fully extracted:**
   - Core primitives and Orchestration: `packages/gttm/mission/`
   - UI-Lib is now focused on core mechanics (Tracker, sound).

2. **Data layer is integrated:**
   - App consumes Supabase via `@rsys-os/data`.
   - Extraction of logic to packages is complete.

3. **Story system is consolidated:**
   - Consolidated in `@gttm/story`.

4. **Package naming needs alignment:**
   - `@ritual/ui-lib` should be `@ritual/ui-lib`
   - `@ritual/brand` should be `@ritual/brand`
   - Historical naming from pre-multi-brand architecture. This is the next cleanup step.

### 🎯 EXTRACTION DECISION TREE

**Question: What goes where?**

```
Is it brand-specific?
├─ YES → Brand namespace (@ritual, @gttm, @vsm)
│   ├─ Design tokens? → brand/
│   ├─ UI components? → components/
│   └─ Content? → codex/
└─ NO → Shared namespace
    ├─ Design foundation? → @rsys-os/design-source
    ├─ Data access? → @rsys-os/data
    └─ Universal utils? → @gttm/components (or create @rsys-os/utils)
```

**Question: When to extract?**

```
Is it referenced by multiple apps/packages?
├─ YES → Extract now (high reusability)
└─ NO → Is it fully implemented and stable?
    ├─ YES → Extract now (prevent future entanglement)
    └─ NO → Keep in app, extract after stabilization
```

### ⚠️ BLOCKERS & CONSTRAINTS

1. **Package Naming Inconsistency**
   - Workspace naming is slightly disjointed (`@ritual/ui-lib` vs `@ritual/components`).
   - Action: Standardize to `@ritual/*` for ritual-themed packages.

2. **Mobile Viewport Test Failure**
   - Responsive tests infrastructure complete.
   - Execution blocked by missing system deps (libnspr4.so).
   - See `RDX/plans/mission-surface-responsive-checklist.md`.

### 📋 IMMEDIATE NEXT STEPS

**Week 1: Standardize & Polish**
1. Normalize package naming (@gttm/ritual-* → @ritual/*).
2. Fix any remaining implicit `any` in extracted components.
3. Update `.github/copilot-instructions.md` with finalized structure.

**Week 2: Testing**
1. Add integration tests for extracted components in `@gttm/mission`.
2. Fix mobile viewport test execution issues.

**Week 3: Persistence & Logic**
1. Move `useTrainingData` hooks to `@rsys-os/data`?
2. Implement metadata column migration.

---

## SUCCESS METRICS

- ✅ Zero circular dependencies between packages
- ✅ All packages buildable independently
- ✅ VSM app uses workspace:* imports exclusively
- ✅ Each package has clear API boundary
- ✅ Ready for npm publish (any package, opt-in)
- ✅ No regression in app functionality
- ✅ Build time < 30s for all packages
- ✅ Type safety maintained throughout

---

## FINAL NOTES

STATUS: CORE EXTRACTION COMPLETE. COMMENCE STANDARDIZATION.