# VSM Training System

## Overview

The VSM Training System is a complete, full-featured React-based training platform that implements the entire VSM (Velocity State Machine) methodology. It provides a sophisticated training dojo with four hierarchical states, integrated Pomodoro timer, card flip mechanics, and responsive design, serving as the comprehensive training environment for knowledge work velocity skills.

## Purpose

Deliver production-grade VSM training through:
- Complete implementation of Time Window → Block → Page → Card hierarchy
- Immersive, distraction-free full-screen training experience
- Pomodoro-style time management with visual urgency indicators
- Interactive scenario-based learning with flip card mechanics
- Session completion tracking and knowledge atom logging
- Responsive design for desktop, tablet, and mobile training

## Key Features

### Four-State Hierarchy

#### 1. Time Window Selection
- **Sprint (10 minutes):** Quick momentum-building session
- **Standard (25 minutes):** Full Pomodoro focus block
- **Grind (45 minutes):** Deep work intensive session
- Visual card selection interface
- Hover states and selection feedback

#### 2. Block Selection
- Browse training blocks filtered by selected time window
- Rich metadata display:
  - Block title and ID
  - Theme/focus area
  - Physical skill component
  - Mental concept component
  - Difficulty level
- Navigation controls (back to time window)
- Visual preview of block content

#### 3. Page View (Drill Mat)
- **Full-screen immersive mode** eliminating all distractions
- **Live countdown timer** with color-coded urgency:
  - Green: Normal operation
  - Yellow: Final minute warning
  - Red with pulse: Critical final seconds
- **Card display system:**
  - Front: Scenario description or problem
  - Back: Action protocol or solution
- **Interactive controls:**
  - Flip Card button (spacebar shortcut)
  - Next/Previous card navigation
  - Card progress indicator (e.g., "3 of 8")
  - Pause Timer control
  - Complete Session button
  - Exit drill button
- **Header persistence:** Block name and timer always visible

#### 4. Completion View
- Session completion confirmation (✓)
- Statistics display:
  - Total time spent
  - Cards completed vs. available
  - Block identifier
- **"Ship to Shell" action** — Logs knowledge atom
- **"Train Again" option** — Restart flow
- Console/API logging of training data

### Technical Capabilities

✅ **Modern React Architecture** — Component-based with hooks  
✅ **TypeScript** — Type-safe development  
✅ **Vite Build System** — Fast development and optimized builds  
✅ **shadcn/ui Components** — Accessible, themeable UI primitives  
✅ **Tailwind CSS** — Utility-first styling with design tokens  
✅ **React Query** — Data fetching and caching  
✅ **Supabase Integration** — Backend-ready architecture  
✅ **Responsive Design** — Mobile, tablet, desktop optimized  
✅ **Keyboard Navigation** — Full keyboard accessibility  

### Subproject: VSM Schools Landing Page

Located in `VSM Schools Landing Page/` subdirectory, this appears to be a public-facing marketing/information site for VSM training:
- Introduces VSM methodology to prospective learners
- Marketing copy and value proposition
- Call-to-action for training enrollment
- Separate React application (own build system)

## Technical Stack

### Core Technologies
- **React 18** — UI framework
- **TypeScript** — Type safety and developer experience
- **Vite** — Build tool and dev server
- **shadcn/ui** — Component library (Radix UI primitives)
- **Tailwind CSS** — Styling framework
- **React Query** (@tanstack/react-query) — Server state management

### Supporting Libraries
- **Radix UI** — Unstyled, accessible components
- **Lucide React** — Icon library
- **class-variance-authority** — Component variants
- **clsx** & **tailwind-merge** — Class name utilities
- **React Hook Form** — Form management
- **Zod** — Schema validation
- **date-fns** — Date utilities

### Infrastructure
- **Supabase** — Backend as a service (configured, integration status TBD)
- **ESLint** — Code linting
- **PostCSS** — CSS processing
- **pnpm** — Package management

## File Structure

```
VSM Training System/
├── vsm-training-dojo.md           # Specification document
├── README.md                      # This file
├── TODO.md                        # Task backlog
├── exported-assets/
│   └── index.html                 # Exported static version (if exists)
└── VSM Schools Landing Page/      # Separate React app
    ├── src/
    ├── public/
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    └── ... (full React project structure)
```

## Usage

### Development

```bash
cd "VSM Schools Landing Page"
npm install
npm run dev
```

Visit `http://localhost:5173` to access the application.

### Production Build

```bash
npm run build
npm run preview  # Preview production build
```

### Deployment

```bash
# Build optimized bundle
npm run build

# Deploy dist/ folder to:
# - Vercel, Netlify, or similar
# - AWS S3 + CloudFront
# - Your preferred hosting platform
```

## Integration Points

### Upstream Dependencies
- **Radiant Design Language** — Color tokens, spacing, typography
- **VSM Content** — Training blocks, cards, scenarios
- **Time Window Methodology** — Duration standards and pacing
- **shadcn/ui** — Component library foundation

### Downstream Consumers
- **Shell Control Panel** — Receives training completion data
- **User Profile System** — Stores progress and achievements
- **Analytics Dashboard** — Training effectiveness metrics
- **Content Factor** — Sources training material
- **Style-System** — Governance over training standards

### Data Flow

```
User → Training Session → Completion
                ↓
        Knowledge Atom Generated
                ↓
        Shell API Endpoint
                ↓
        [Content Factor Routes]
                ↓
    User Profile + Analytics Storage
```

## Design Compliance

Strictly adheres to Radiant Systems Design Language:
- **Colors:** Teal primary (#21808D), cream backgrounds (#FCFCF9), red for urgency
- **Typography:** Clean sans-serif with monospace for technical content
- **Spacing:** Generous padding, clear visual hierarchy
- **Components:** shadcn/ui themed to match Radiant palette
- **Interactions:** Smooth animations, clear focus states, accessibility-first

## Use Cases

### Individual VSM Mastery
- Daily training routine for velocity skills
- Deliberate practice in specific areas
- Personal development tracking

### Team Onboarding
- Standardized training for new hires
- Consistent knowledge baseline
- Team-wide skill development

### Workshop/Training Events
- Facilitator-led training sessions
- Live demonstration of VSM principles
- Hands-on practice environment

### Continuous Learning
- Ongoing skill reinforcement
- Advanced technique exploration
- Mastery path progression

## Relationship to Training App MVP

**VSM Training System** vs. **Training App MVP:**
- Training System: Full-featured React app with backend integration
- MVP: Lightweight single-file HTML for immediate deployment

**Strategic Options:**
1. **Parallel:** Maintain both (MVP for quick access, System for full features)
2. **Consolidation:** Merge MVP features into System, deprecate MVP
3. **Tiered:** MVP as entry point, System for advanced users

**Recommendation:** Evaluate feature overlap and user preferences before deciding.

## Success Metrics

**Adoption:**
- 500+ sessions per month per 100 users
- 75% completion rate for started sessions
- 50% users train 3+ times per week

**Performance:**
- <2 second initial load time
- 60 FPS animations throughout
- <100ms interaction latency
- Works on 98%+ device/browser combinations

**Learning Effectiveness:**
- 80% report "improved execution velocity" after 2 weeks
- 70% apply learning within 24 hours
- 60% complete full learning paths
- 85% rate training as "valuable and engaging"

**Technical:**
- Zero critical bugs in production
- 99.9% uptime
- Lighthouse score: 90+ across all categories

## Maintenance

- Update training content monthly
- Refresh design tokens quarterly to match design language
- Test new browser versions within 2 weeks of release
- Accessibility audit annually
- Performance monitoring continuous
- User feedback integration ongoing

## Related Components

- [Training App MVP](../Traning%20App%20MVP/) — Lightweight alternative
- [Interactive System Primer](../Interactive-System-Primer/) — Conceptual introduction
- [Shell Control Panel](../Shell%20Control%20Panel/) — Operational dashboard
- [Tonal State Machine](../Tonal%20State%20Machine/) — Communication training component
- [Radiant Design Language](../Radiant%20Design%20Language/) — Visual standards

## Future Enhancements

- AI-powered personalized learning paths
- Team collaboration features
- Advanced analytics and insights
- Gamification and achievements
- Mobile native applications
- Offline training capability (PWA)
- Integration with productivity tools
- Community block marketplace

## License

Part of the Radiant Systems ecosystem. See project root for license details.

---

**Note:** The VSM Schools Landing Page appears to be a separate subproject. Its relationship to the main training system should be clarified (marketing site? separate product? shared codebase?).
