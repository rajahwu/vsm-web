# VSM Training System - Task Backlog

**Last Updated:** 2025-12-17

---

## High Priority

### Verification & Testing
- [ ] **Confirm VSM Schools Landing Page functionality**
  - Test all pages and navigation
  - Verify CTA buttons work
  - Check responsive design
  - Document missing features

- [ ] **Test main training flow end-to-end**
  - All four states functional
  - Timer accuracy and visual states
  - Card flip mechanics smooth
  - Data logging works correctly

- [ ] **Cross-browser and cross-device testing**
  - Desktop: Chrome, Firefox, Safari, Edge
  - Mobile: iOS Safari, Chrome Android
  - Tablet: iPad Safari, Android Chrome
  - Document device-specific issues

### Integration
- [ ] **Complete Supabase integration**
  - Authentication flow
  - Database schema for training data
  - Edge functions for business logic
  - Real-time subscriptions (if needed)

- [ ] **Connect to Shell API**
  - Replace console logging with API calls
  - Handle authentication tokens
  - Retry logic for failed requests
  - Queue offline data for sync

- [ ] **Implement session persistence**
  - Save progress across page refreshes
  - Resume interrupted sessions
  - Sync across devices
  - Clear data option

## Medium Priority

### Features
- [ ] **Build training content management**
  - Admin interface for blocks/cards
  - Content versioning
  - Preview before publishing
  - Import/export functionality

- [ ] **Add user progress tracking**
  - Completion history
  - Skill development graphs
  - Achievement system
  - Learning path progress

- [ ] **Implement advanced analytics**
  - Time-on-card metrics
  - Flip patterns analysis
  - Dropout point identification
  - Personalized recommendations

### User Experience
- [ ] **Create onboarding flow**
  - Welcome screen
  - Feature tour
  - First session guidance
  - Help documentation

- [ ] **Add accessibility enhancements**
  - Full keyboard navigation
  - Screen reader optimization
  - High contrast mode
  - Focus management improvements

- [ ] **Build settings interface**
  - Timer preferences
  - Notification settings
  - Theme customization
  - Data export options

### Content
- [ ] **Expand training library**
  - Add 20+ new blocks
  - Create learning paths
  - Multi-level difficulty
  - Specialized tracks

- [ ] **Implement content API**
  - Dynamic content loading
  - Content versioning
  - A/B testing support
  - Multi-language content

## Low Priority

### Enhancement
- [ ] **Add social features**
  - Training streaks
  - Team challenges
  - Leaderboards (optional)
  - Share achievements

- [ ] **Build mobile app versions**
  - React Native iOS app
  - React Native Android app
  - OR Progressive Web App
  - App store deployment

- [ ] **Implement gamification**
  - Points and badges
  - Level progression
  - Unlockable content
  - Training milestones

### Polish
- [ ] **Enhanced animations**
  - Smooth state transitions
  - Celebration effects
  - Loading states
  - Micro-interactions

- [ ] **Dark mode**
  - Theme toggle
  - System preference detection
  - Persistent preference
  - Design token adjustments

- [ ] **Audio enhancements**
  - Timer alerts (optional)
  - Completion sounds
  - Background focus music
  - Voiceover for cards

## Technical Debt

- [ ] **Refactor component structure**
  - Extract reusable components
  - Improve prop interfaces
  - Better state management
  - Code organization cleanup

- [ ] **Add comprehensive testing**
  - Unit tests (Vitest)
  - Component tests (Testing Library)
  - E2E tests (Playwright)
  - Visual regression tests

- [ ] **Optimize bundle size**
  - Code splitting by route
  - Lazy load components
  - Tree shake unused code
  - Optimize dependencies

- [ ] **Improve error handling**
  - Error boundaries
  - User-friendly messages
  - Error logging service
  - Recovery mechanisms

## Questions to Resolve

- [ ] **Relationship to Training App MVP?**
  - Consolidate or maintain separately?
  - Feature parity or differentiation?
  - Migration path for MVP users?

- [ ] **VSM Schools Landing Page purpose?**
  - Marketing site or product?
  - Shared codebase strategy?
  - Deployment approach?

- [ ] **Backend architecture decisions?**
  - Continue with Supabase?
  - Custom API server?
  - Serverless functions?

- [ ] **Content management ownership?**
  - Who creates training blocks?
  - Review/approval process?
  - Community contributions?

- [ ] **Monetization strategy?**
  - Free vs. paid tiers?
  - Enterprise licensing?
  - Training certification fees?

## Completed

- [x] React application scaffolded
- [x] shadcn/ui components integrated
- [x] Radiant design tokens applied
- [x] Specification document created
- [x] README documentation written
- [x] TODO backlog established

---

**Priority Levels:**
- **High:** Core functionality, integrations, critical bugs
- **Medium:** Important features, UX improvements, content
- **Low:** Nice-to-have features, polish, future planning
