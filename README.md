# VSM School Merger

**VSM (Velocity State Machine) Training System** - A mobile-first knowledge work training platform with ritual-based time management and card-based progression.

---

## 🎯 Project Vision

> **"Codex explains. Pulse sets rhythm. Prime aligns state. Produce creates value. Archive remembers."**

This system trains velocity (sustainable speed) through ritualized micro-sessions. Users progress through training tracks by completing cards, each card being a self-contained instructional atom.

---

## 📱 Core Flow (6 Steps)

```
Pulse → Codex → Track → Prime → Produce → Archive
```

1. **Pulse** - Select time window (10m / 25m / 45m)
2. **Codex** - Optional narrative context (skippable)
3. **Track** - Choose training track (Genesis / Source Code / Powerhouse)
4. **Prime** - Timed state alignment (30-60s conditioning)
5. **Produce** - Work surface for output capture
6. **Archive** - Success + knowledge atom logging

**Mobile-First:** Each step is full-screen, thumb-driven, distraction-free.

---

## 🏗️ Architecture

### Monorepo Structure

```
vsm_school_merger/
├── apps/
│   └── vsm-school-web/              # Next.js 14 training app
├── packages/
│   ├── ritual/
│   │   ├── brand/                   # Theme compiler (@gttm/ritual-brand)
│   │   └── ui-lib/                  # React components (@gttm/ritual-ui)
│   └── rsys-os/
│       └── design-source/           # Design tokens (@rsys-os/design-source)
└── docs/
    └── specs/                       # Technical specifications
```

### Data Flow

```
JSON Design Tokens → CSS Variables → React Components → Next.js App
```

1. Design tokens defined in `packages/rsys-os/design-source/tokens/`
2. Compiled to CSS by `packages/ritual/brand/`
3. Consumed by `packages/ritual/ui-lib/`
4. Rendered in `apps/vsm-school-web/`

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (workspace manager)
- bun (for package build scripts)

### Installation

```bash
# Clone repository
git clone <repo-url>
cd vsm_school_merger

# Install dependencies
pnpm install

# Build packages (REQUIRED before running app)
pnpm build:packages

# Run development server
cd apps/vsm-school-web
pnpm dev
```

**App runs at:** http://localhost:3000

### Build Order

Packages must be built in dependency order:

1. `@rsys-os/design-source` (no build needed)
2. `@gttm/ritual-brand` (compiles design tokens)
3. `@gttm/ritual-ui` (builds components)
4. `apps/vsm-school-web` (Next.js app)

**Tip:** Run `pnpm build` from root to build everything.

---

## 📚 Training Tracks

### 1. Genesis (The Alphabet)
**Focus:** Pre-literary visual primitives

- The Dot (•) - Data points
- The Rectangle (▭) - Processes
- The Diamond (◇) - Decisions
- The Arrow (→) - Causality

### 2. Source Code (The Doctrine)
**Focus:** Systems-Work Workbook drills

- Logic Flow (Card A)
- Swimlane (Card B)
- Feedback Loop (Card C)

### 3. Powerhouse (The Mission)
**Focus:** Creative dexterity + strategy

- High Ground (palm stance)
- Interlock (shuffle structure)
- Hidden Move (glide empathy)

---

## 🎨 Design System

### Ritual Phases

The system revolves around 5 ritual phases:

| Phase | Duration | Color | Purpose |
|-------|----------|-------|---------|
| Plan | 5 min | Amber | Set intentions |
| Sprint | 25 min | Emerald | Focused work |
| Rest | 5 min | Sky Blue | Physical recovery |
| Reflect | 10 min | Purple | Learning capture |
| Recover | 5 min | Rose | Mental reset |

### Design Tokens

Located in `packages/rsys-os/design-source/tokens/`:

- `colors.json` - Phase colors + semantic palette
- `phases.json` - Phase definitions (duration, color, icon)
- `spacing.json` - Consistent spacing scale
- `typography.json` - Font sizes and weights
- `audio.json` - Phase-specific audio tracks

---

## 🗄️ Database Schema

### Core Tables

- `genesis_drills` - 10 foundational drills
- `training_windows` - Time window configs (sprint/standard/grind)
- `training_blocks` - Training blocks with skills
- `training_cards` - Card front/back content
- `story_nodes` - Codex narrative nodes
- `user_genesis_progress` - Completion tracking
- `user_training_sessions` - Session history
- `atoms` - Knowledge atom archive

**Backend:** Supabase PostgreSQL

---

## 📝 Naming Conventions (CRITICAL)

### ✅ Canonical Terms

- **Codex** → Lore/doctrine (NOT Blackout)
- **Pulse** → Time window selector
- **Prime** → State alignment (NOT Dojo)
- **Produce** → Work surface (NOT Forge)
- **Archive** → Persistence (NOT Ship to Shell)

### ❌ Forbidden Terms

Never use these legacy terms:
- ~~Blackout~~ → Use **Codex**
- ~~Transmission~~ → Use **Codex Entry**
- ~~Dojo~~ → Use **Prime**
- ~~Forge~~ → Use **Produce**
- ~~Ship to Shell~~ → Use **Archive**

**Reference:** `apps/vsm-school-web/naming-canonical-lock.md`

---

## 🧩 Key Components

### Mission Surface
6-step orchestrator that coordinates the full flow.

**Location:** `apps/vsm-school-web/src/app/mission/`

### CardRitual
4-phase card execution component.

**Phases:** Codex → Instruction → Prime → Produce

**Location:** `apps/vsm-school-web/src/components/CardRitual/`

### WorkSurface
Full-screen distraction-free editor for output capture.

**Location:** `apps/vsm-school-web/src/components/WorkSurface/`

### Pulse (RitualCycleTracker)
Timer + phase management component.

**Location:** `packages/ritual/ui-lib/src/RitualCycleTracker.tsx`

---

## 🧪 Testing

**Current Status:** 0% coverage (needs setup)

**Planned:**
- Unit tests (Vitest)
- Integration tests (Playwright)
- Visual regression tests (Percy/Chromatic)

**Target:** 60% coverage

---

## 🔧 Development

### Workspace Commands

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm build

# Build only packages (not app)
pnpm build:packages

# Build only app
pnpm build:app

# Run app in dev mode
pnpm dev

# Clean build artifacts
pnpm clean
```

### Package-Specific Commands

```bash
# Build ritual-brand package
cd packages/ritual/brand
pnpm build

# Build ritual-ui package
cd packages/ritual/ui-lib
pnpm build
```

### Database Seeding

```bash
# Seed Supabase with training data
cd apps/vsm-school-web
bun run scripts/seed-mission-registry.ts
```

**Required:** Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

---

## 📊 Project Status

**Completion:** 83% (B+ grade)

**Routes:**
- ✅ `/` - Cycle Tracker (Pulse)
- ✅ `/codex` - Codex viewer (518 lines narrative game)
- ✅ `/genesis` - Genesis Curriculum checklist
- ❌ `/editor` - Content management (placeholder)
- ✅ `/training` - Training flow (4-state)
- ⏳ `/mission` - Mission Surface (stub, under development)

**Critical Tasks (P0):**
1. Execute database seeding
2. Implement CardRitual component
3. Implement WorkSurface component
4. Refactor training page to use database

**See:** `RDX/TODO.md` for the full task list.

---

## 🤝 Contributing

### Code Style

- TypeScript strict mode
- ESLint + Prettier
- No `any` types
- Components under 300 lines
- Functions under 50 lines

### Commit Messages

```
feat: Add WorkSurface component
fix: Correct phase color mapping
docs: Update naming conventions
refactor: Extract CardRitual to package
```

### PR Checklist

- [ ] Follow canonical naming system
- [ ] Update relevant documentation
- [ ] Add tests for new features
- [ ] Build passes (`pnpm build`)
- [ ] No TypeScript errors

---

## 📖 Documentation

- [Naming Canonical Lock](apps/vsm-school-web/naming-canonical-lock.md) - Naming system enforcement
- [TODO](RDX/TODO.md) - Task tracking (categorized)
- [VSM Training Dojo](docs/specs/vsm-training-dojo.md) - Training interface spec
- [Copilot Instructions](.github/copilot-instructions.md) - AI agent guidance
- [RDX Reports](RDX/) - Audit and migration reports

---

## 🔗 External Integrations

### Current
- **Supabase** - PostgreSQL database + auth
- **Vercel** - Hosting (Next.js deployment)

### Planned
- **Content Factor API** - Dynamic training content
- **Analytics** - User behavior tracking
- **PWA** - Installable mobile app

---

## 📜 License

[Add License Here]

---

## 🙏 Credits

**Design Philosophy:** Minimal, ritualistic, distraction-free.

**Architecture Pattern:** Mobile-first, card-based progression, database-driven content.

**Mission:** Train velocity (sustainable speed) through ritualized knowledge work.

---

**Last Updated:** December 18, 2025  
**Version:** 0.8.3 (83% complete)
