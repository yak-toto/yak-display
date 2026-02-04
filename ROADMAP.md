# Yak Display - Development Roadmap

This document outlines planned improvements and new features for the application.

## Completed Improvements ✅

### Component Refactoring
- **MatchBetRow Component** - Extracted reusable match betting row component
  - Simplified API with focused props (team names, scores, locked state)
  - Proper separation of concerns (UI vs business logic)
  - Clean event emission pattern for score updates

### Code Quality
- Added explicit TypeScript typing for `modifyBets` array
- Improved separation of concerns between components
- Removed non-null assertions for better type safety
- Added npm lockfile validation to pre-commit hooks

## Planned Components

### 2. StatusNotification Component
**Priority:** High
**Description:** Reusable toast/notification component for success/error messages

**Current Issue:**
- Success/error messages are hardcoded in GroupComponent template
- No consistent notification pattern across the app
- 2-second timeout is hardcoded

**Proposed Solution:**
```vue
<!-- Usage -->
<StatusNotification
  :show="displayStatus"
  :type="notificationType"
  :message="statusMessage"
  @close="displayStatus = false"
/>
```

**Features:**
- Multiple notification types (success, error, info, warning)
- Configurable duration
- Auto-dismiss with countdown
- Smooth animations (slide-in/fade-out)
- Support for icons
- Stacking multiple notifications

**Files to create:**
- `src/components/StatusNotification.vue`

**Related improvements:**
- Refactor GroupComponent to use the new notification component
- Add notification composable: `src/composables/useNotification.ts`

---

### 3. LoadingSpinner Component
**Priority:** High
**Description:** Reusable loading indicator component

**Current Issue:**
- No loading states shown during API calls
- Users don't know when data is being fetched
- Poor UX during network requests

**Proposed Solution:**
```vue
<!-- Usage -->
<LoadingSpinner v-if="isLoading" size="large" message="Loading bets..." />
```

**Features:**
- Multiple sizes (small, medium, large)
- Optional loading message
- Customizable colors
- Overlay mode for blocking UI
- Skeleton loaders for specific content types

**Files to create:**
- `src/components/LoadingSpinner.vue`

**Integration points:**
- GroupComponent: Show while fetching bets and rankings
- LoginComponent: Show during authentication
- All API call points

**Related improvements:**
- Add `isLoading` state to all components with async operations
- Consider adding a global loading state in Pinia store

---

### 7. BettingHistory Component
**Priority:** Medium
**Description:** Display user's previous betting history and accuracy statistics

**Current Issue:**
- No way to view past bets
- No tracking of betting accuracy
- Users can't see their prediction performance

**Proposed Solution:**
```vue
<!-- Usage -->
<BettingHistory
  :userId="currentUser.id"
  :limit="10"
  :showStats="true"
/>
```

**Features:**
- List of past bets with actual match results
- Accuracy statistics (correct predictions, points earned)
- Filter by competition/phase
- Sort by date, accuracy, points
- Visualization of prediction accuracy over time
- Compare predictions vs actual results

**Data Requirements:**
- Need historical bet data from API
- Need match results data
- Calculate accuracy metrics

**Files to create:**
- `src/components/BettingHistory.vue`
- `src/components/BettingHistoryCard.vue` (individual bet display)

**API Endpoints needed:**
- `GET /api/v1/users/{userId}/betting-history`
- `GET /api/v1/stats/user/{userId}`

**Related improvements:**
- Add statistics calculation utilities
- Create charts/visualizations for betting accuracy
- Add export functionality (CSV, PDF)

---

## UI/UX Redesign

### Overall Design System Overhaul
**Priority:** High
**Description:** Complete redesign of the user interface and visual design

**Current Issues:**
- Inconsistent styling across components
- Basic/dated visual design
- Poor visual hierarchy
- Limited color palette
- No design system or guidelines
- Inconsistent spacing and typography
- Mobile experience could be improved

**Proposed Improvements:**

#### 1. Design System Foundation
- **Color Palette:**
  - Define primary, secondary, accent colors
  - Success/error/warning/info states
  - Dark mode support
  - Proper contrast ratios (WCAG AA compliance)

- **Typography:**
  - Modern font stack (consider Inter, Poppins, or system fonts)
  - Consistent heading hierarchy (h1-h6)
  - Text size scale (xs, sm, base, lg, xl, 2xl, etc.)
  - Line heights and letter spacing

- **Spacing System:**
  - Consistent spacing scale (4px, 8px, 16px, 24px, 32px, etc.)
  - Remove arbitrary padding/margin values
  - Grid system for layouts

#### 2. Component-Specific Improvements

**Navigation:**
- Modern navbar with better visual hierarchy
- Active state indicators
- Improved mobile menu (hamburger)
- Breadcrumbs for better navigation context

**Match Betting Interface:**
- Card-based design instead of plain grid
- Visual separation between matches
- Team flags/logos if available
- Better locked state indication (not just grayed out)
- Visual feedback for score changes
- Match date/time display

**Forms & Inputs:**
- Modern input styling with focus states
- Better placeholder text
- Floating labels
- Input validation visual feedback
- Consistent button styles (primary, secondary, danger)

**Tables:**
- Better table design with hover states
- Sticky headers for long tables
- Alternating row colors
- Better mobile table responsiveness

**Status Messages:**
- Toast notifications instead of inline messages
- Icons for different message types
- Better positioning (top-right corner)
- Smooth animations

#### 3. Layout Improvements

- **Whitespace:** More breathing room between elements
- **Cards:** Use card containers for content sections
- **Shadows:** Subtle shadows for depth
- **Borders:** Consistent border radius (4px, 8px, 12px)
- **Responsive Grid:** Better breakpoints for tablets

#### 4. Interactive Elements

- **Hover States:** All clickable elements should have hover feedback
- **Focus States:** Keyboard navigation indicators
- **Loading States:** Skeleton screens instead of spinners
- **Transitions:** Smooth transitions for state changes (200-300ms)
- **Micro-animations:** Subtle animations for better UX

#### 5. Accessibility Improvements

- Proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Color contrast compliance
- Screen reader friendly

#### 6. Dark Mode Support

- Toggle in user preferences
- Separate color palette for dark theme
- Persistent preference (localStorage)

### Implementation Approach

**Phase 1: Foundation** (Week 1-2)
- [ ] Create design system documentation
- [ ] Define color palette and CSS variables
- [ ] Set up typography scale
- [ ] Create spacing utilities
- [ ] Set up CSS custom properties (CSS variables)

**Phase 2: Core Components** (Week 3-4)
- [ ] Redesign navbar and navigation
- [ ] Update button styles (primary, secondary, etc.)
- [ ] Redesign form inputs
- [ ] Create card component for content containers
- [ ] Update status notifications

**Phase 3: Page-Level Redesign** (Week 5-6)
- [ ] Redesign GroupComponent layout
- [ ] Improve table designs (GroupRank, ScoreBoard)
- [ ] Update login/signup pages
- [ ] Refine mobile responsiveness

**Phase 4: Polish** (Week 7-8)
- [ ] Add micro-animations
- [ ] Implement dark mode
- [ ] Final accessibility audit
- [ ] Browser compatibility testing

### Design Tools & Resources

**Recommended Approach:**
1. Create mockups first (Figma, Sketch, or Adobe XD)
2. Get feedback before implementation
3. Implement design system incrementally
4. Use CSS variables for easy theming

**CSS Framework Options:**
- **Tailwind CSS** - Utility-first, highly customizable
- **UnoCSS** - Faster alternative to Tailwind
- **Component Library:**
  - Vuetify - Material Design
  - PrimeVue - Rich component set
  - Naive UI - Modern Vue 3 components
  - Headless UI - Unstyled, accessible components

**Design Inspiration:**
- [Dribbble](https://dribbble.com) - Sports betting UI designs
- [Behance](https://behance.net) - Dashboard designs
- Modern sports apps (ESPN, The Athletic, etc.)

### Success Metrics

- Improved user satisfaction
- Reduced user confusion/support requests
- Better mobile engagement
- Faster task completion times
- Accessibility compliance (WCAG AA)

---

## Future Considerations

### Additional Improvements from Initial Analysis

These were suggested but not prioritized yet:

4. **BetSummary Component** - Show user betting statistics (total bets, pending, locked, etc.)
5. **MatchCard Component** - Alternative card-based layout for mobile
6. **LiveMatchIndicator Component** - Real-time match score updates
8. **LeaderboardCard Component** - Mini leaderboard widget

### Code Quality Improvements

From the initial component analysis:

1. **Add Loading States** - Show spinners during API calls
2. **Better Error Handling** - Structured error messages and logging
3. **Client-Side Validation** - Validate scores before submission
4. **Computed Properties** - Use computed for derived values (e.g., `hasChanges`, `hasLockedBets`)
5. **Composables for Reusable Logic**:
   - `useGroupBets.ts` - Handle bet fetching/updating
   - `useGroupRank.ts` - Handle ranking logic
   - `useToast.ts` - Handle notifications

### Architectural Improvements

1. **State Management** - Consider centralizing bet state in Pinia store
2. **Form Validation Library** - VeeValidate or Vuelidate for complex forms
3. **UI Component Library** - Consider Vuetify or PrimeVue for consistency

---

## Implementation Priority

1. **High Priority** (Better UX, immediate value):
   - **UI/UX Redesign - Phase 1** (Design system foundation)
   - StatusNotification Component
   - LoadingSpinner Component
   - **UI/UX Redesign - Phase 2** (Core components)

2. **Medium Priority** (Enhanced features):
   - **UI/UX Redesign - Phase 3** (Page-level redesign)
   - BettingHistory Component
   - Error handling improvements
   - Client-side validation

3. **Low Priority** (Nice to have):
   - **UI/UX Redesign - Phase 4** (Polish & dark mode)
   - Additional statistics components
   - Advanced visualizations

---

## Notes

- Each component should follow the established patterns (composition API, TypeScript, scoped styles)
- Maintain separation of concerns (presentation vs business logic)
- Ensure all components are properly typed
- Add components to pre-commit checks
- Write tests for new components (when testing framework is added)

---

**Last Updated:** 2026-02-04
**Version:** 0.3.0
