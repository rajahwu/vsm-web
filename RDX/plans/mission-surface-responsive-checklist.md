# Mission Surface Responsive Test Checklist

**Last Updated:** 2025-12-19 18:30
**Scope:** CardRitual, MissionSurface, WorkSurface, PrimePanel, MissionSuccess.
**Status:** ✅ Test infrastructure complete | ⚠️ Browser deps required

---

## Test Infrastructure Status

### ✅ Completed
- [x] Playwright + Vitest dependencies installed
- [x] `playwright.config.ts` configured with webServer + feature flag
- [x] `tests/mission-surface.spec.ts` written with 3 viewport tests
- [x] Core flow test covers: Pulse → Codex → Track → Prime → Produce → Archive
- [x] Test scripts added: `test:e2e`, `test:unit`
- [x] Vitest config for unit tests

### ⚠️ Blocked
- [ ] System dependencies (libnspr4.so) required for Chromium
- [ ] Run `sudo apt-get install -y libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2`
- [ ] Then run: `pnpm --filter vsm-school-web test:e2e`

---

## Viewports

- Mobile: 375x812
- Tablet: 768x1024
- Desktop: 1440x900

## Test Coverage Checklist

### CardRitual
- [ ] Codex phase: content scrolls, header/footer fixed, audio controls visible
- [ ] Instruction phase: story text readable, choices accessible, audio controls visible
- [ ] Prime phase: timer readable, CTA accessible, no overflow
- [ ] Produce phase: editor/panel fill screen, audio controls visible

### MissionSurface
- [ ] Pulse screen: window cards stack and are tappable
- [ ] Track screen: track cards stack, percent readable, no text overflow
- [ ] Success screen: CTA visible and not clipped

### WorkSurface
- [ ] Sticky context bar stays visible during scroll
- [ ] Editor/preview toggle works; preview scrolls
- [ ] Keyboard shortcuts on desktop: Cmd/Ctrl+Enter, Cmd/Ctrl+P

### PrimePanel
- [ ] Timer circle fits viewport; button visible
- [ ] Instruction content readable without clipping

### MissionSuccess
- [ ] Progress bar visible; CTA button fits viewport

---

## Next Steps

1. **Install System Dependencies** (requires sudo):
   ```bash
   sudo apt-get update
   sudo apt-get install -y libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 \
     libcups2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 \
     libpango-1.0-0 libcairo2 libasound2
   ```

2. **Run Tests**:
   ```bash
   pnpm --filter vsm-school-web test:e2e
   ```

3. **Manual Testing** (alternative if deps can't be installed):
   - Set `NEXT_PUBLIC_USE_MISSION_SURFACE=true` in `.env.local`
   - Run `pnpm --filter vsm-school-web dev`
   - Use browser DevTools responsive mode
   - Test each viewport manually (375x812, 768x1024, 1440x900)
   - Walk through full flow and check each item in coverage checklist
