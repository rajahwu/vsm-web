# GitHub Copilot Instructions

This codebase implements the **VSM (Velocity State Machine) Training System** — a productivity methodology training platform with ritual-based time management and phase-based learning cycles.

## Canonical Naming System (CRITICAL)

**🚨 ENFORCE THIS NAMING IN ALL CODE AND UI:**

### Core Terms (Locked)
- **Codex** → Lore/doctrine (read-only, non-blocking)
- **Pulse** → Time window + rhythm (already correct)
- **Prime** → State alignment (timed conditioning)
- **Produce** → Work surface (value creation)
- **Archive** → Persistence (knowledge atoms)

### 6-Step Mission Flow
```
Pulse → Codex → Track → Prime → Produce → Archive
```

### Forbidden Terms
❌ **NEVER USE:** Blackout, Transmission, Dojo, Forge, Ship to Shell
- These are legacy terms from earlier iterations
- Use the canonical replacements above

### Component Naming
- `CardRitual` - 4-phase execution (codex → instruction → prime → produce)
- `WorkSurface` - Output capture editor (NOT ForgeEditor)
- `CodexViewer` - Narrative/lore display (NOT ProtocolBlackout)
- `MissionSurface` - 6-step orchestrator

### Data Model Terms
- Session type: `vsm_session` (NOT training_session)
- Atom types: Use action verbs (archive, produce) not metaphors

**Reference:** [apps/vsm-school-web/naming-canonical-lock.md](apps/vsm-school-web/naming-canonical-lock.md)

## Architecture Overview

This is a **pnpm workspace monorepo** with nested package structure:

```
apps/vsm-school-web/              # Next.js 14 training app
packages/
  gttm/                          # GTTM-branded packages
    mission/                      # Mission orchestration (@gttm/mission)
    story/                        # Narrative/story system (@gttm/story)
    codex/                        # Codex content (@gttm/codex)
    components/                   # Shared UI primitives (@gttm/components)
    brand/                        # GTTM brand tokens (@gttm/brand)
  ritual/                         # Ritual-branded packages
    brand/                        # Theme compiler (@ritual/brand)
    ui-lib/                       # Themed components (@ritual/ui-lib)
    components/                   # Ritual mechanics & UI (@ritual/components)
    codex/                        # Ritual content (@ritual/codex)
  rsys-os/                        # Cross-brand system packages
    design-source/                # Design tokens & assets (@rsys-os/design-source)
    data/                         # Data layer (@rsys-os/data)
    style/                        # Multi-brand system (@rsys-os/style - planned)
  vsm/                            # VSM-branded packages
    brand/                        # VSM brand tokens (@vsm/brand)
```

### Critical Data Flow (Training System)

**🚨 CURRENT STATE (Active):**

The app has successfully migrated to Supabase for core training data.

1. **Database (Active)**: Supabase tables `training_windows`, `training_blocks`, `training_cards`, `atoms`.
   - Schema: [RDX/plans/supabase-schema.sql](RDX/plans/supabase-schema.sql)
   - Data Layer: `@rsys-os/data` provides typed client and interfaces.
   - Hooks: `apps/vsm-school-web/src/hooks/useTrainingData.ts` (`useTrainingWindows`, `useTrainingBlocks`, `useTrainingCards`)
   - Progress: `useMissionProgress` hook in `@gttm/mission` tracks completed cards.

2. **Legacy (Preserved)**: Hardcoded `missionRegistry` moved to `@gttm/mission/src/lib/legacy-registry.ts`.
   - Used for seeding and fallback reference.

**Data Flow Diagram:**
```
[Supabase] ──(@rsys-os/data)──> [useTrainingData Hooks] ──> [training/page.tsx] ──> [UI]
```

**Pattern**: Use `@rsys-os/data` for all Supabase interactions to maintain type safety.

### Design Token Flow

1. **Design Tokens** (`packages/rsys-os/design-source/tokens/`) stored as JSON
2. **Theme Compiler** (`packages/ritual/brand/src/RitualBrand.ts`) imports tokens → CSS variables
3. **UI Components** (`packages/ritual/components/`) functional logic and primitives
4. **UI Library** (`packages/ritual/ui-lib/`) themed wrappers and re-exports
5. **Next.js App** (`apps/vsm-school-web/`) renders themed components

## Critical Conventions

### Workspace Dependencies & Package Structure

The monorepo uses **nested package structure** (`packages/gttm/`, `packages/ritual/`, `packages/rsys-os/`, `packages/vsm/`).

**pnpm-workspace.yaml:**
```yaml
packages:
  - 'apps/*'
  - 'packages/**/*'
```

Use `workspace:*` protocol for internal packages:
```json
"@gttm/mission": "workspace:*",
"@ritual/brand": "workspace:*",
"@ritual/ui-lib": "workspace:*",
"@rsys-os/data": "workspace:*"
```

**Never use relative file paths between packages.** Always import through workspace namespace.

### Build Toolchain

- **Packages**: Use `tsc` for building TS packages, `bun` for compiler scripts.
- **App**: Next.js 14 (App Router).
- **Commands**: `pnpm build` (all), `pnpm dev` (app).

**Build Order (Critical):**
1. `@rsys-os/design-source` (Tokens)
2. `@rsys-os/data` (Types & Client)
3. `@ritual/brand` (CSS Compiler)
4. `@gttm/components` & `@ritual/components` (Primitives)
5. `@gttm/story` & `@gttm/codex` (Narrative)
6. `@gttm/mission` (Orchestration)
7. `@ritual/ui-lib` (Themed Exports)
8. `vsm-school-web` (Application)

**Parallel Build (from root):**
```bash
pnpm build
```

### Phase-Based Architecture

The system revolves around 5 ritual phases defined in `@ritual/components`:

- **Plan** (amber): Set intentions
- **Sprint** (emerald): Focused work
- **Rest** (sky blue): Physical recovery
- **Reflect** (purple): Learning capture
- **Recover** (rose): Mental reset

## Key File Locations

- **Design Tokens**: `packages/rsys-os/design-source/tokens/`
- **Data Types**: `packages/rsys-os/data/src/types.ts`
- **Mission Components**: `packages/gttm/mission/src/components/`
- **Ritual Tracker**: `packages/ritual/components/src/components/RitualCycleTracker.tsx`
- **Legacy Registry**: `packages/gttm/mission/src/lib/legacy-registry.ts`

## Naming Conventions

- **Packages**: kebab-case with `@ritual/`, `@gttm/`, `@vsm/`, or `@rsys-os/` scope.
- **Terms**: Pulse, Codex, Track, Prime, Produce, Archive (The 6-Step Flow).

## Migration Status

**✅ Core Extraction Complete (Dec 2025):** 
- Monolith components extracted to product packages.
- Naming standardized to `@ritual/*` and `@gttm/*`.
- Supabase persistence integrated for Mission and Trainer.
- `@rsys-os/data` provides unified data access.

### RDX Directory Structure
- `RDX/reports/` - Completed audits and reports.
- `RDX/plans/` - Migration plans and schemas.
- `RDX/todos/` - Categorized task backlogs.
- `RDX/TODO.md` - Index of all active TODOs.

## Common Pitfalls

1. **Workspace Resolution**: Changing a package requires a rebuild (`pnpm build`).
2. **Margin Overlap**: Main content must have `ml-64` to avoid sidebar overlap.
3. **Implicit Any**: Always type `children` props in component primitives.
4. **Data Access**: Always use `@rsys-os/data` types; avoid local interfaces for DB rows.
