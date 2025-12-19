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

This is a **pnpm workspace monorepo** with four main packages:

```
apps/vsm-school-web/              # Next.js 14 training app
packages/rsys-os/design-source/   # Design tokens & brand assets (@rsys-os/design-source)
packages/ritual/brand/            # Theme compiler (@gttm/ritual-brand)
packages/ritual/ui-lib/           # React components (@gttm/ritual-ui)
```

**Key Architecture Pattern**: The design system flows from JSON tokens → CSS variables → React components. The `@rsys-os/design-source` package contains JSON design tokens, `@gttm/ritual-brand` compiles them into CSS variables, which `@gttm/ritual-ui` consumes to build themed components.

### Data Flow

1. **Design Tokens** (`packages/rsys-os/design-source/tokens/`) are stored as JSON
2. **Theme Compiler** (`packages/ritual/brand/src/RitualBrand.ts`) imports tokens and compiles to CSS variables
3. **UI Components** (`packages/ritual/ui-lib/`) consume theme via CSS variables
4. **Next.js App** (`apps/vsm-school-web/`) imports and renders `@gttm/ritual-ui` components

## Critical Conventions

### Workspace Dependencies

Use `workspace:*` protocol for internal packages:
```json
"@gttm/ritual-brand": "workspace:*",
"@gttm/ritual-ui": "workspace:*",
"@rsys-os/design-source": "workspace:*"
```

Never use relative file paths between packages. Always import through the workspace namespace.

**Package Import Pattern:**
```typescript
// Correct: Import tokens from design-source package
import colors from '@rsys-os/design-source/tokens/colors.json';

// Wrong: Relative path between packages
import colors from '../../../rsys-os/design-source/tokens/colors.json';
```

### Build Toolchain

- **Packages**: Use `bun` for build scripts (`build-theme.ts`, `build-ui.ts`)
- **App**: Standard Next.js build pipeline
- **Commands**: `pnpm dev` (app), `pnpm build` (packages)

**Important**: Packages MUST be built before the Next.js app can import them during development.

### Phase-Based Architecture

The system revolves around 5 ritual phases (see [packages/ritual/ui-lib/src/phases.ts](packages/ritual/ui-lib/src/phases.ts)):

- **Plan** (5 min, amber): Set intentions
- **Sprint** (25 min, emerald): Focused work (Pomodoro)
- **Rest** (5 min, sky blue): Physical recovery
- **Reflect** (10 min, purple): Learning capture
- **Recover** (5 min, rose): Mental reset

Every timer, color scheme, and UI flow is organized around these phases.

### Six-Step Session Flow

The VSM session flow (documented in [docs/specs/vsm-training-dojo.md](docs/specs/vsm-training-dojo.md)) follows:

1. **Pulse**: Choose time window (Sprint 10m, Standard 25m, Grind 45m)
2. **Codex**: Optional doctrinal framing (skippable)
3. **Track**: Select training track (Genesis / Source Code / Powerhouse)
4. **Prime**: Timed state alignment drill (30-60 seconds)
5. **Produce**: Work surface for output capture
6. **Archive**: Session completion + knowledge atom logging

**Pattern**: Each step is full-screen, thumb-driven, part of continuous flow.

## Key File Locations

- **Design Tokens**: [packages/rsys-os/design-source/tokens/](packages/rsys-os/design-source/tokens/) (colors, phases, typography, spacing, audio)
- **Audio Assets**: [packages/rsys-os/design-source/assets/audio/](packages/rsys-os/design-source/assets/audio/) (phase-specific .wav files)
- **Training Curriculum**: [apps/vsm-school-web/src/data/GenesisCurriculum.ts](apps/vsm-school-web/src/data/GenesisCurriculum.ts) (10 foundational drills)
- **Genesis Tracker**: [apps/vsm-school-web/src/components/GenesisTracker.tsx](apps/vsm-school-web/src/components/GenesisTracker.tsx) (interactive checklist component)
- **Main UI Component**: [packages/ritual/ui-lib/src/RitualCycleTracker.tsx](packages/ritual/ui-lib/src/RitualCycleTracker.tsx) (integrated timer + phase logic)
- **Theme Compiler**: [packages/ritual/brand/scripts/build-theme.ts](packages/ritual/brand/scripts/build-theme.ts) (converts JSON → CSS)
- **Layout Structure**: [apps/vsm-school-web/src/app/layout.tsx](apps/vsm-school-web/src/app/layout.tsx) (fixed sidebar + main stage pattern)

## Development Workflow

**Prerequisites**: 
- `pnpm` (workspace package manager)
- `bun` (for package build scripts)

```bash
# Install all dependencies (from workspace root)
pnpm install

# Build packages in dependency order (required before running app)
cd packages/ritual/brand && pnpm build    # First: compile design tokens
cd ../ui-lib && pnpm build                # Second: build UI components
cd ../../apps/vsm-school-web && pnpm dev # Third: run Next.js app

# Alternative: Build all packages recursively (from workspace root)
pnpm -r --filter './packages/**' build

# Build everything (all packages + app)
pnpm -r build
```

**Debugging Tip**: If Next.js can't resolve `@gttm/*` or `@rsys-os/*` imports, packages haven't been built yet.

## Design System Integration

Colors are semantic and phase-aware:

```typescript
// DON'T: Hardcode colors
className="bg-blue-500"

// DO: Use phase-based semantic colors
className={PHASES[currentPhase].color}  // e.g., 'bg-amber-600' for Sprint
```

**Pattern**: Components should reference `PHASES` array for dynamic theming, not manual color assignments.

## Audio Architecture

The `RitualCycleTracker` uses two audio systems:

1. **Phase Transitions** - Synthetic tones via Web Audio oscillators
   - Custom oscillators for chimes (see `playTone()` in `RitualCycleTracker.tsx`)
   - Fallback to visual-only if audio context unavailable

2. **Phase Background Music** - Curated `.wav` files
   - Located in `packages/rsys-os/design-source/assets/audio/`
   - Managed via `useRitualSound` hook consuming `tokens/audio.json` manifest
   - Multiple tracks per phase with ratings, versions, BPM metadata

**Audio Manifest Pattern:**
```typescript
import audioManifest from '@rsys-os/design-source/tokens/audio.json';

// Access phase tracks
const planTracks = audioManifest.phases.plan.tracks;
const defaultTrack = planTracks.find(t => t.id === audioManifest.phases.plan.defaultTrack);
```

Currently **no external state library**. All state is local React state within `RitualCycleTracker`:

```typescript
const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
const [timeRemaining, setTimeRemaining] = useState(PHASES[0].duration);
const [isRunning, setIsRunning] = useState(false);
```

**Future Integration**: Docs mention Supabase for persistence + "Shell API" for knowledge atom logging (currently console only).

## Testing Strategy

No test suite exists yet. `package.json` has placeholder:
```json
"test:visual": "echo \"Visual snapshot tests need...\" && exit 0"
```

**Planned**: Visual regression tests for CycleTracker desktop/mobile layouts and Net open/closed states.

## External Integrations (Planned)

From `docs/specs/TODO.md`:

- **Supabase**: Auth + training data persistence
- **Archive API**: Replace `console.log("Archiving...")` with real Supabase write
- **Content Factor API**: Dynamic training block loading (currently hardcoded)

**Pattern**: API integration points write to atoms table with type `vsm_session`.

## Naming Conventions

- **Packages**: kebab-case with `@gttm/` scope (`@gttm/ritual-brand`)
- **Files**: PascalCase for components, camelCase for utilities
- **CSS Variables**: Double-dash prefix (`--color-phase-sprint`, `--spacing-md`)

## Recent Refactoring (Dec 2025)

The codebase was recently refactored to externalize design tokens:

**Before:**
- Design tokens lived inside `ritual-brand` package
- Relative imports between packages

**After:**
- Design tokens extracted to `@rsys-os/design-source` package
- Proper workspace imports via package names
- Audio manifest added (`tokens/audio.json`)
- Nested package structure (`packages/ritual/`, `packages/rsys-os/`)

**New Components:**
- `GenesisTracker` - Interactive checklist for 10 foundational drills
- Audio system with manifest-driven track management

**In Progress:**
- `/editor` route (placeholder)
- `/blackjack` route (placeholder)
- `rsys.style.system` - Multi-brand design system (architecture defined, not implemented)

## Common Pitfalls

1. **Workspace Resolution**: Changing a package requires rebuilding it before Next.js sees updates
2. **Design Tokens**: Editing JSON in [packages/rsys-os/design-source/tokens/](packages/rsys-os/design-source/tokens/) requires running `pnpm build` in `packages/ritual/brand`
3. **Phase Durations**: Values in `PHASES` array are in **seconds** (300 = 5 min), not milliseconds
4. **Sidebar Layout**: Main content must have `ml-64` (margin-left) to avoid overlap with fixed sidebar
5. **Audio Files**: Must use filename convention `{phase}_{track-name}_v{version}.wav` and update `audio.json` manifest
6. **Package Paths**: The workspace uses nested package structure (`packages/ritual/`, `packages/rsys-os/`), not flat structure

## Mission Context

This system is part of the "BLACKOUT_GENESIS" project (see workspace path). The VSM methodology is a knowledge work training approach focused on **velocity** (sustainable speed) rather than raw productivity. The "Ritual" branding emphasizes mindful, repeatable patterns.

**Design Philosophy**: Minimal, ritualistic, distraction-free. See [docs/specs/vsm-training-dojo.md](docs/specs/vsm-training-dojo.md): "This is the **dojo mat you step onto**. Minimal, focused, ritualistic."
