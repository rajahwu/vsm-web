# RDX TODO - Platform / Infra

**Last Updated:** 2025-12-19
**Scope:** Build, testing, CI, documentation, and technical debt.

---

## P0 - Build & Tests

- [ ] Set up Vitest + Testing Library at workspace root.
- [ ] Add component tests (GenesisTracker, RitualCycleTracker, useRitualSound).
- [ ] Add E2E/visual test strategy (Playwright baseline).
- [ ] Add CI workflows for build + test on PRs.

## P1 - Documentation & DX

- [ ] Document `audio.json` schema and contribution workflow.
- [ ] Update `.github/copilot-instructions.md` to reflect package structure and build commands.
- [ ] Create `CONTRIBUTING.md` with token/audio/component guidelines.
- [ ] Add package READMEs with usage examples.
- [ ] Set up Storybook for shared components.
- [ ] Add API docs (TypeDoc) for RitualBrand and hooks.

## P2 - Technical Debt & Quality

- [ ] Investigate `ritual-brand` CSS export vs built CSS output.
- [ ] Consolidate CSS files (ritual-ui.css, styles.css, variables.css).
- [ ] Remove commented-out Express code in `rsys-os/style/system/index.ts`.
- [ ] Optimize bundle size (route-based splitting, tree-shaking, dep audit).
- [ ] Improve error boundaries and logging.
