# VSM School Merger - TODO

**Last Updated:** December 18, 2025  
**Status:** Active Development

---

## 🔴 Critical (Do Immediately)

### Build & Infrastructure
- [x] **Add root-level build scripts** ✅ COMPLETED
  - `pnpm build` - Build all packages recursively
  - `pnpm dev` - Start Next.js dev server
  - `pnpm clean` - Clean all dist folders
  - Add to `package.json` at workspace root

- [x] **Fix workspace build order** ✅ COMPLETED
  - `@rsys-os/design-source` has no build step (JSON tokens only)
  - `@gttm/ritual-brand` imports from design-source and builds first
  - `@gttm/ritual-ui` depends on ritual-brand and builds second
  - pnpm automatically respects dependency graph for build order

### Component Integration
- [x] **Create `/genesis` route** ✅ COMPLETED
  - File: `apps/vsm-school-web/src/app/genesis/page.tsx`
  - Render `GenesisTracker` component
  - Add page metadata (title, description)

- [x] **Update Sidebar navigation** ✅ COMPLETED
  - Add Genesis link: `<NavLink href="/genesis" label="Genesis Curriculum" icon="📚" />`
  - Reorder: Home → Genesis → Editor → Blackjack

### Cleanup
- [x] **Remove duplicate audio files** ✅ COMPLETED
  - Delete `packages/rsys-os/design-source/assets/audio/VictorV_Audio/` folder
  - Verify all tracks in `audio.json` point to root audio folder
  - Update any hardcoded paths in `useRitualSound.ts`

---

## 🟠 High Priority (This Week)

### Testing Infrastructure
- [ ] **Set up Vitest**
  - Install: `pnpm add -D -w vitest @testing-library/react @testing-library/jest-dom`
  - Create `vitest.config.ts` at workspace root
  - Add test scripts to each package

- [ ] **Write component tests**
  - `GenesisTracker.test.tsx` - Toggle completion, progress calculation
  - `RitualCycleTracker.test.tsx` - Smoke test (mounts without crashing)
  - `useRitualSound.test.ts` - Mock Web Audio API

- [ ] **Set up GitHub Actions**
  - `.github/workflows/test.yml` - Run tests on PR
  - `.github/workflows/build.yml` - Verify build succeeds
  - Add status badges to README

### Documentation
- [ ] **Document audio.json schema**
  - Create `packages/rsys-os/design-source/tokens/README.md`
  - Explain track structure, rating system, phase assignment
  - Provide example of adding new track

- [ ] **Update .github/copilot-instructions.md**
  - Reflect new package structure (`ritual/` and `rsys-os/` folders)
  - Document `@rsys-os/design-source` package
  - Update build commands
  - Add GenesisTracker component info

- [ ] **Create CONTRIBUTING.md**
  - How to add new design tokens
  - How to add new audio tracks
  - Component contribution guidelines
  - Code style and commit conventions

---

## 🟡 Medium Priority (Next 2 Weeks)

### Feature Development
- [ ] **Implement `/editor` route**
  - Purpose: Code editor or content editor (clarify use case)
  - Placeholder page with "Coming Soon" message
  - Add to navigation

- [ ] **Implement `/blackjack` route**
  - Purpose: Training simulator (blackjack as analogy?)
  - Placeholder page with feature description
  - Add to navigation

- [ ] **Add Genesis persistence**
  - Save completion state to localStorage
  - Add "Reset Progress" button
  - Export/import completion JSON

### Design System Refinement
- [ ] **Refactor phase colors to use CSS variables**
  - Update `PHASES` array in `RitualCycleTracker.tsx`
  - Replace `bg-amber-600` strings with `var(--color-phase-sprint)`
  - Test all phase transitions

- [ ] **Add responsive sidebar**
  - Breakpoint at 768px (tablet)
  - Collapse to hamburger menu on mobile
  - Preserve sidebar state in localStorage

- [ ] **Create theme switcher**
  - Light/dark mode toggle
  - Generate dark mode CSS variables
  - Store preference in localStorage

### Audio System
- [ ] **Implement audio track selection**
  - Allow user to choose track per phase (from `audio.json` manifest)
  - Show track metadata (title, BPM, rating)
  - Save preferences to localStorage

- [ ] **Add audio playback controls**
  - Play/pause during phase
  - Volume slider
  - Skip to next track (if multiple available)

- [ ] **Preload audio files**
  - Load phase audio before transition
  - Show loading state
  - Graceful fallback if file missing

---

## 🟢 Low Priority (Future Enhancements)

### External Integrations
- [ ] **Supabase setup**
  - Create Supabase project
  - Design schema (users, sessions, progress)
  - Implement auth (magic links)
  - Add database migrations

- [ ] **Shell API integration**
  - Define API contract
  - Replace `console.log("Ship to Shell")` with POST request
  - Add retry logic
  - Offline queue with sync

- [ ] **Content Factor API**
  - Define API contract for training blocks
  - Replace `GenesisCurriculum.ts` with API calls
  - Add caching layer
  - Version management

### Developer Experience
- [ ] **Set up Storybook**
  - Install `@storybook/react`
  - Create stories for `RitualCycleTracker`
  - Create stories for `GenesisTracker`
  - Document component props

- [ ] **Add API documentation**
  - Generate TypeDoc for `RitualBrand` class
  - Document `useRitualSound` hook API
  - Create design token reference

- [ ] **Improve error handling**
  - Add error boundaries around components
  - Display user-friendly error messages
  - Log errors to Sentry (or similar)

### Advanced Features
- [ ] **Implement rsys.style.system**
  - Complete `createDesignSource()` function
  - Implement brand registry
  - Add multi-brand switching UI

- [ ] **AI-assisted brand generation**
  - Parse `generation-prompts/` templates
  - Query AI for brand colors, typography
  - Generate complete design-source from prompt

- [ ] **Training analytics**
  - Track time spent per phase
  - Card flip patterns
  - Session completion rates
  - Visualize progress over time

- [ ] **Social features**
  - Share completed Genesis curriculum
  - Public learner profiles
  - Training leaderboards

---

## 📋 Backlog (Ideas / Explorations)

### Technical Debt
- [ ] Investigate why `ritual-brand` exports `src/ritual.css` instead of built CSS
- [ ] Consolidate CSS files (ritual-ui.css, styles.css, variables.css)
- [ ] Remove commented-out Express code in `rsys-os/style/system/index.ts`
- [ ] Add package README files with usage examples

### Research Spikes
- [ ] Evaluate React Native compatibility for `@gttm/ritual-ui`
- [ ] Assess Tailwind v4 features (CSS-first config)
- [ ] Research Web Audio API alternatives (Howler.js?)
- [ ] Investigate edge function patterns for audio transcoding

### Content
- [ ] Expand Genesis curriculum to 20+ drills
- [ ] Create learning paths (beginner → advanced)
- [ ] Add video demonstrations for each drill
- [ ] Translate training content (i18n)

---

## ✅ Completed

- [x] Extract design tokens to `@rsys-os/design-source` package
- [x] Refactor `@gttm/ritual-brand` to import from `@rsys-os/design-source`
- [x] Create audio manifest (`tokens/audio.json`)
- [x] Implement `GenesisTracker` component
- [x] Add Genesis curriculum data (`GenesisCurriculum.ts`)
- [x] Create `.github/copilot-instructions.md`
- [x] Write comprehensive repository analysis report

---

## 🎯 Current Sprint (Week of Dec 18)

**Goal:** Ship Genesis curriculum route and establish testing foundation.

**Tasks:**
1. Add root build scripts (30 min)
2. Create `/genesis` route (15 min)
3. Update Sidebar navigation (10 min)
4. Set up Vitest (1 hour)
5. Write GenesisTracker tests (1 hour)
6. Clean up duplicate audio files (30 min)

**Blocker:** None currently identified.

**Next Sprint Preview:** Implement editor/blackjack placeholders, Supabase schema design.

---

## 📞 Questions / Decisions Needed

1. **Editor Route Purpose:** What should `/editor` do? 
   - Code playground for training exercises?
   - Content creation tool for new blocks?
   - Markdown editor for notes?

2. **Blackjack Route Purpose:** Is this a training simulator? 
   - Blackjack as card-counting practice?
   - Generic game-based learning platform?
   - Something else entirely?

3. **rsys.style.system:** Keep or remove?
   - If keeping, define MVP scope
   - If removing, clean up placeholder code

4. **Audio Strategy:** Synthetic tones + background music, or fully recorded audio?
   - Current: Synthetic oscillators for transitions, `.wav` files for ambiance
   - Consider: Consolidate to one approach

5. **Mobile Strategy:** PWA or native app?
   - Desktop-first (current)
   - Responsive web (Phase 2)
   - React Native app (Phase 3)

---

## 🚀 Milestones

### v0.2.0 - "Genesis Launch" (Target: Dec 25, 2025)
- Genesis curriculum route live
- Basic test coverage (>50%)
- Clean audio asset structure
- Updated documentation

### v0.3.0 - "Integration Foundation" (Target: Jan 15, 2026)
- Supabase auth working
- Session logging to database
- Editor and Blackjack placeholders
- CI/CD pipeline

### v0.4.0 - "Audio Experience" (Target: Feb 1, 2026)
- Track selection UI
- Preloaded audio files
- Volume controls
- Mobile-responsive audio player

### v1.0.0 - "Public Beta" (Target: Mar 1, 2026)
- Full Genesis curriculum (20+ drills)
- Complete training analytics
- Shell API integration
- Mobile PWA support

---

**Notes:**
- Prioritize user-facing features over internal tooling
- Test coverage should increase with each milestone
- Maintain backwards compatibility for design tokens
- Document all breaking changes in CHANGELOG.md
