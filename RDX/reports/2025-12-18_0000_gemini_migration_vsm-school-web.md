# VSM School Web Migration & Integration Report

**Date:** 2025-12-18
**Author:** Gemini Agent
**Subject:** Migration of VSM Landing Page to vsm-school-web

## 1. Overview
This report outlines the strategy for migrating the standalone Vite/React landing page prototype (`tmp/VSM_Landing_Page`) into the primary Next.js application (`apps/vsm-school-web`). It also details the integration of the existing "Blackout" feature into the application's navigation structure.

## 2. Current State Analysis

### Target Application: `apps/vsm-school-web`
*   **Framework:** Next.js 14 (App Router)
*   **Styling:** Tailwind CSS
*   **Structure:**
    *   `src/app/page.tsx`: Current entry point (to be replaced).
    *   `src/app/blackout/page.tsx`: Existing feature page (to be preserved).
    *   `src/components/Sidebar.tsx`: Main navigation component.

### Source Application: `tmp/VSM_Landing_Page`
*   **Framework:** Vite + React
*   **Styling:** Tailwind CSS + Shadcn UI
*   **Key Assets:**
    *   `src/pages/Index.tsx`: The main landing page design.
    *   `src/components/ui/`: Reusable UI components (likely Shadcn).
    *   `public/images/`: Critical visual assets.

## 3. Migration Plan

The migration will follow a non-destructive, additive approach.

### Step 1: Dependency & Configuration Synchronization
1.  **Dependencies:** Install missing dependencies in `apps/vsm-school-web` found in the source `package.json` (e.g., `clsx`, `tailwind-merge`, `lucide-react`, `@radix-ui/*` primitives).
2.  **Tailwind Config:** Merge `tmp/VSM_Landing_Page/tailwind.config.ts` into `apps/vsm-school-web/tailwind.config.ts`. This is critical to ensure custom colors, fonts, and animations from the prototype render correctly in the main app.

### Step 2: Asset Migration
1.  **Public Assets:** Copy `tmp/VSM_Landing_Page/public/images` to `apps/vsm-school-web/public/images`.
2.  **UI Components:** Copy the `src/components/ui` folder from the source to the target. Ensure no filename conflicts exist; if they do, resolve by merging or renaming.

### Step 3: Landing Page Integration
1.  **Page Logic:** Refactor `tmp/VSM_Landing_Page/src/pages/Index.tsx` to replace `apps/vsm-school-web/src/app/page.tsx`.
2.  **Next.js Adaptation:**
    *   Replace standard `<img>` tags with `next/image` for optimization.
    *   Update `<a>` tags to `next/link` for client-side navigation.
    *   Ensure all components are compatible with Next.js Server Components or marked with `"use client"`.

### Step 4: Sidebar & Navigation Updates
1.  **Preserve Cycle Tracker:**
    *   Move the current content of `apps/vsm-school-web/src/app/page.tsx` (the Ritual Cycle Tracker) to a new route: `apps/vsm-school-web/src/app/tracker/page.tsx`.
2.  **Sidebar Modification:** Edit `apps/vsm-school-web/src/components/Sidebar.tsx`.
    *   **Update Cycle Tracker Link:** Change the `href` for "Cycle Tracker" from `/` to `/tracker`.
    *   **Add Blackout Link:** Add a new `NavLink` for "Blackout Protocol" pointing to `/blackout` (currently missing from the sidebar).
    *   **Fix Broken Links:** Remove or correct the `/blackjack` link if it is intended to be the Blackout page, or ensure a `blackjack` route exists.

## 4. Suggested Improvements

1.  **Shared UI Library:** Since both parts of the system likely use similar UI patterns, consider extracting common components (buttons, cards) into the workspace `packages/ui-lib` to avoid code duplication between `vsm-school-web` and future apps.
2.  **SEO Optimization:** The new landing page is content-rich. Ensure `metadata` in `page.tsx` is correctly populated with title, description, and OpenGraph tags.
3.  **Lazy Loading:** For the heavy media assets on the landing page, implement lazy loading (automatic with `next/image` but verify loading strategies) to maintain high Core Web Vitals scores.
4.  **Route Grouping:** Consider moving the actual application logic (like the Blackout tool) behind a `(dashboard)` or `(app)` route group to visually and logically separate the public landing page from the interactive tools.

## 5. Next Steps
Proceed with **Step 1** and **Step 2** of the migration plan immediately to prepare the foundation.

## 6. Execution Log (2025-12-18)
The migration plan was executed successfully.

### Key Actions
1.  **Dependencies Installed:** Added `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`, `lucide-react`, `radix-ui` primitives, `embla-carousel-react`, `sonner`, `next-themes`.
2.  **Version Adjustments:**
    *   Downgraded `react-day-picker` to `^8.10.1` (from v9) to maintain compatibility with Shadcn UI components.
    *   Downgraded `date-fns` to `^3.6.0` (from v4) to satisfy `react-day-picker` peer dependency.
    *   Downgraded `recharts` to `^2.12.7` (from v3) to fix type errors in `chart.tsx`.
    *   Downgraded `react-resizable-panels` to `^2.1.3` (from v4) to match `resizable.tsx` component usage.
3.  **Code Adjustments:**
    *   Added `'use client'` to `src/app/blackout/ProtocolBlackout.tsx` to fix build error.
    *   Updated `src/app/globals.css` with Tailwind 4 `@theme` configuration to support Shadcn variables and custom fonts.
    *   Adapted `src/app/page.tsx` to use `next/image` and handle client-side scrolling.
4.  **Verification:**
    *   `pnpm build` passed successfully.
    *   Routes verified: `/` (Landing), `/tracker`, `/blackout`.

5.  **Trainer System Migration:**
    *   Converted `tmp/VSM Training System.html` (Vanilla JS/HTML) to a Next.js Page Component at `src/app/blackjack/page.tsx`.
    *   Implemented React state management to replace vanilla DOM manipulation.
    *   Migrated embedded CSS to `blackjack.module.css` to preserve exact styling.
    *   Verified build success for the `/blackjack` route.

