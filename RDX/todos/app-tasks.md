# RDX TODO - Application Tasks

**Last Updated:** 2025-12-19
**Scope:** Product UX, routes, content, and mobile readiness.

---

## P0 - Verification

- [ ] Confirm VSM Schools landing page functionality (navigation, CTA behavior, responsive layout).
- [ ] Test the main training flow end-to-end (state transitions, timers, card flips, logging).
- [ ] Cross-browser/device testing (Chrome/Firefox/Safari/Edge, iOS/Android).

## P1 - Core UX

- [ ] Create onboarding flow (welcome, tour, first session guidance).
- [ ] Add accessibility enhancements (keyboard nav, screen reader support, focus management).
- [ ] Build settings interface (timer prefs, notifications, theme, export). Status: `SettingsDialog` integrated in Sidebar.
- [x] Implement /editor and /blackjack routes (purpose + UX definition).
- [x] Add Genesis persistence (localStorage save, reset, import/export).
- [x] Add responsive sidebar with persisted state.
- [x] Implement theme switcher + dark mode tokens.
- [x] Add audio controls (track selection, play/pause, volume, preload). Status: `SettingsDialog` + `useRitualSound`.
- [x] Wire landing page CTAs to /mission.
- [x] Add session persistence to VSMTrainer.

## P2 - Mobile & Engagement

- [ ] Mobile PWA optimization (install, offline handling, viewport fixes).
- [ ] Expand training library (new blocks, learning paths, multi-level difficulty).
- [ ] Add progress tracking UI (history, graphs, achievements).
- [ ] Implement gamification and social features (streaks, sharing, optional leaderboards).
- [ ] Enhance motion/animations and audio feedback.
- [ ] Implement rsys.style.system and multi-brand switching UI.
- [ ] Explore AI-assisted brand generation workflow (prompts -> design source).
