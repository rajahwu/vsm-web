# Playwright Responsive Test Error Report

**Date:** 2025-12-19 04:15
**Author:** Codex
**Scope:** Vitest + Playwright setup and responsive checklist execution for Mission Surface.

---

## What I Did

- Added Playwright + Vitest dev dependencies and scripts to `apps/vsm-school-web/package.json`.
- Added `apps/vsm-school-web/playwright.config.ts` with webServer config and mission surface flag.
- Added responsive Playwright test `apps/vsm-school-web/tests/mission-surface.spec.ts`.
- Added Vitest config `apps/vsm-school-web/vitest.config.ts`.
- Added unit test `apps/vsm-school-web/src/__tests__/mission-registry.test.ts`.
- Attempted to install Playwright browsers and run `pnpm --filter vsm-school-web test:e2e`.

## Error Summary

- Playwright tests failed at browser launch.
- Chromium headless shell could not load `libnspr4.so`.
- Attempts to install system dependencies timed out in this environment.

## Error Details

- Failure on test run:
  - `browserType.launch: Target page, context or browser has been closed`
  - `/chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file`
- `sudo pnpm exec playwright install-deps` timed out.
- `sudo apt-get update` and `sudo apt-get install -y libnspr4` also timed out.

## Suggestions

1. Install system deps on the host (libnspr4 and other Playwright deps).
2. Re-run `pnpm --filter vsm-school-web test:e2e` after deps install.
3. If system package installs remain blocked, run tests on a dev machine with Playwright deps already installed.

## Next Steps

- Run:
  - `sudo apt-get update`
  - `sudo apt-get install -y libnspr4`
- Then run:
  - `pnpm --filter vsm-school-web test:e2e`
- If failures persist, run:
  - `sudo pnpm exec playwright install-deps`
  - `pnpm --filter vsm-school-web test:e2e`
