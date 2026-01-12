# Migration Plan: Alert

## Metadata

- Component Name: Alert
- Migration Complexity: Medium-High
- Estimated Time: 6-8 hours
- Planning Date: Friday Jan 9, 2026

## Target Directory Structure

```
packages/blade-svelte/src/components/Alert/
├── Alert.svelte                # Main component implementation
├── Alert.stories.svelte        # Storybook stories
├── types.ts                    # TypeScript type definitions
└── index.ts                    # Public exports

packages/blade-core/src/styles/Alert/
├── alert.module.css            # Alert styles
├── alert.ts                    # CVA configuration and helper functions
└── index.ts                    # Public exports
```

## Props Mapping

| React Prop | Type | Svelte Prop | Type | Notes |
|------------|------|-------------|------|-------|
| description | ReactChild | description | string \| Snippet | Body content - supports text or JSX snippet |
| title | string \| undefined | title | string \| undefined | Brief heading |
| isDismissible | boolean | isDismissible | boolean | Shows dismiss button (default: true) |
| onDismiss | () => void | onDismiss | () => void | Callback when dismiss button clicked |
| icon | IconComponent | icon | Snippet | Custom icon renderer |
| emphasis | 'subtle' \| 'intense' | emphasis | SubtleOrIntense | Prominence level (default: subtle) |
| isFullWidth | boolean | isFullWidth | boolean | Span full width, borderless (default: false) |
| color | FeedbackColors | color | FeedbackColors | Color tone (default: neutral) |
| actions | { primary?, secondary? } | actions | { primary?, secondary? } | Action buttons/links |
| actions.primary | PrimaryAction | actions.primary | PrimaryAction | Primary action button |
| actions.secondary | SecondaryAction | actions.secondary | SecondaryAction | Secondary action button/link |
| testID | string | testID | string | Test identifier |
| ...rest | StyledPropsBlade & DataAnalyticsAttribute | ...rest | StyledPropsBlade & DataAnalyticsAttribute | Styled props and analytics |

## CSS Module Plan

### Files to Create

1. `alert.module.css` - Alert container, content layout, variants
2. `alert.ts` - CVA configuration, helper functions for colors and icon mapping

### CVA Variants

```typescript
// Planned CVA structure in alert.ts
export const alertStyles = cva(styles.alert, {
  variants: {
    color: {
      neutral: styles['color-neutral'],
      information: styles['color-information'],
      positive: styles['color-positive'],
      negative: styles['color-negative'],
      notice: styles['color-notice'],
    },
    emphasis: {
      subtle: styles['emphasis-subtle'],
      intense: styles['emphasis-intense'],
    },
    isFullWidth: {
      true: styles['full-width'],
      false: styles['constrained'],
    },
  },
  compoundVariants: [
    // Color + emphasis combinations for backgrounds
    { color: 'neutral', emphasis: 'subtle', class: styles['bg-neutral-subtle'] },
    { color: 'neutral', emphasis: 'intense', class: styles['bg-neutral-intense'] },
    { color: 'information', emphasis: 'subtle', class: styles['bg-information-subtle'] },
    { color: 'information', emphasis: 'intense', class: styles['bg-information-intense'] },
    { color: 'positive', emphasis: 'subtle', class: styles['bg-positive-subtle'] },
    { color: 'positive', emphasis: 'intense', class: styles['bg-positive-intense'] },
    { color: 'negative', emphasis: 'subtle', class: styles['bg-negative-subtle'] },
    { color: 'negative', emphasis: 'intense', class: styles['bg-negative-intense'] },
    { color: 'notice', emphasis: 'subtle', class: styles['bg-notice-subtle'] },
    { color: 'notice', emphasis: 'intense', class: styles['bg-notice-intense'] },
  ],
  defaultVariants: {
    color: 'neutral',
    emphasis: 'subtle',
    isFullWidth: false,
  },
});
```

### CSS Classes Plan

```css
/* alert.module.css */

/* Base alert container */
.alert {
  display: flex;
  flex-direction: row;
  padding: var(--spacing-4);
  gap: var(--spacing-4);
  position: relative;
}

/* Width variants */
.constrained {
  max-width: 584px;
  border-radius: var(--border-radius-medium);
}

.full-width {
  max-width: 100%;
  border-radius: var(--border-radius-none);
}

/* Color backgrounds - compound variants */
.bg-neutral-subtle {
  background-color: var(--colors-feedback-background-neutral-subtle);
}

.bg-neutral-intense {
  background-color: var(--colors-feedback-background-neutral-intense);
}

/* ... similar for other color/emphasis combinations */

/* Layout classes */
.icon-container {
  display: flex;
  align-self: flex-start;
  /* Dynamic margin-top based on layout - may need variants */
}

.icon-container-centered {
  align-self: center;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.title {
  margin-bottom: var(--spacing-2);
}

.description {
  margin-top: var(--spacing-1);
}

.description-no-offset {
  margin-top: var(--spacing-0);
}

.actions-vertical {
  margin-top: var(--spacing-4);
  display: flex;
  flex-direction: row;
  align-items: center;
}

.actions-horizontal {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.primary-action {
  margin-right: var(--spacing-5);
  display: inline-flex;
}

.secondary-action {
  margin-right: var(--spacing-4);
  display: inline-flex;
}

.close-button {
  align-self: flex-start;
}
```

## Utilities Plan

### Utilities to Add/Check in blade-core

- **getAlertTextColor**: Returns text color token path based on emphasis
  - Location: `packages/blade-core/src/styles/Alert/alert.ts`
  - Returns: Color token string for Text component
  
- **getAlertIconForColor**: Maps color to default icon component
  - Location: `packages/blade-core/src/styles/Alert/alert.ts`
  - Returns: Icon name/identifier for the color
  
- **getAlertAccessibilityRole**: Determines ARIA role based on color
  - Location: `packages/blade-core/src/utils/makeAccessible/` (check if exists)
  - Returns: 'alert' or 'status' based on color severity

- **getAlertIconOffset**: Calculates icon top margin based on layout
  - Location: `packages/blade-core/src/styles/Alert/alert.ts`
  - Returns: Spacing token for icon alignment

### Existing Utilities to Use

- **getStyledPropsClasses**: `packages/blade-core/src/utils/styledProps/`
- **makeAnalyticsAttribute**: `packages/blade-core/src/utils/makeAnalyticsAttribute/`
- **metaAttribute**: `packages/blade-core/src/utils/metaAttribute/`
- **makeAccessible**: `packages/blade-core/src/utils/makeAccessible/` (verify Alert-specific role logic)

## Compound Components Plan

**Not Applicable** - Alert uses an object-based API for actions instead of compound components. This design decision (documented in discovery file) favors better discoverability and constraint enforcement.

## Dependency Components

### Components Used

- **Text**: ✅ Already migrated (`packages/blade-svelte/src/components/Typography/Text/`)
- **BaseButton**: ✅ Already migrated (`packages/blade-svelte/src/components/Button/BaseButton/`)
- **BaseLink**: ✅ Already migrated (`packages/blade-svelte/src/components/Link/BaseLink/`)
- **Icon Components**: ⚠️ Need to verify availability
  - AlertOctagonIcon (negative)
  - AlertTriangleIcon (notice)
  - CheckCircleIcon (positive)
  - InfoIcon (information/neutral)
  - CloseIcon (dismiss button)
- **IconButton**: ❓ Need to check if migrated - used for dismiss button
  - **Alternative**: Can use BaseButton with icon if IconButton not available

### Migration Order

1. Verify Icon components are available in Svelte
2. Check if IconButton exists, otherwise plan to use BaseButton with icon-only variant
3. Implement Alert component using existing Text, BaseButton, BaseLink

## Event Handlers Plan

| React Handler | Svelte Implementation | Notes |
|---------------|----------------------|-------|
| onDismiss | `onDismiss: () => void` prop | Called when dismiss button clicked, component manages internal visibility state |
| actions.primary.onClick | `actions.primary.onClick: () => void` prop | Passed through to primary BaseButton's onClick |
| actions.secondary.onClick | `actions.secondary.onClick?: () => void` prop | Optional, passed to secondary action (button or link) |

**Note**: Internal state management uses Svelte `$state()` for `isVisible` to handle dismissal.

## Responsive Behavior Plan

### Breakpoint Detection
- React uses `useBreakpoint` hook
- Svelte equivalent: Need to create/use a reactive breakpoint utility
- **Action Required**: Check if breakpoint utility exists in blade-core, or plan to add CSS-based responsive solution using media queries

### Layout Adaptations

1. **Actions Layout**:
   - Desktop + Full Width: Actions inline (horizontal) with content
   - Mobile or Non-Full Width: Actions stacked vertically below content
   - **Implementation**: Use CSS media queries or reactive breakpoint store

2. **Icon Alignment**:
   - Complex offset calculations based on:
     - Desktop vs Mobile
     - Full-width vs Constrained
     - With/without title
   - **Simplified Approach**: Use CSS alignment instead of dynamic spacing tokens where possible

### Responsive CSS Plan

```css
/* Mobile-first approach */
.actions-container {
  margin-top: var(--spacing-4);
  flex-direction: column;
  gap: var(--spacing-3);
}

/* Desktop + Full Width: horizontal actions */
@media (min-width: 768px) {
  .alert.full-width .actions-horizontal {
    flex-direction: row;
    margin-top: 0;
    margin-left: var(--spacing-4);
  }
}
```

## Migration Tasks Checklist

### Task 1: Setup Component Structure
- [ ] Create Alert directory in `packages/blade-svelte/src/components/`
- [ ] Create `types.ts` file with AlertProps, PrimaryAction, SecondaryAction types
- [ ] Create `Alert.svelte` main component file
- [ ] Create `index.ts` for public exports

### Task 2: Create CSS Modules in blade-core
- [ ] Create `Alert/` directory in `packages/blade-core/src/styles/`
- [ ] Create `alert.module.css` with base styles and variants
- [ ] Create `alert.ts` with CVA configuration
- [ ] Add helper functions: `getAlertTextColor`, `getAlertIconForColor`, `getAlertIconOffset`
- [ ] Export all from `index.ts`
- [ ] Update `packages/blade-core/src/styles/index.ts` to export Alert styles

### Task 3: Verify Icon Dependencies
- [ ] Check if Icon components exist in blade-svelte
- [ ] Check if IconButton component exists in blade-svelte
- [ ] If IconButton missing, plan to use BaseButton with icon-only props
- [ ] Document icon component names/identifiers for mapping

### Task 4: Implement Alert.svelte Component
- [ ] Define props using Svelte 5 `$props()` rune
- [ ] Add internal state for visibility using `$state(true)`
- [ ] Implement icon mapping based on color prop
- [ ] Render leading icon with proper alignment
- [ ] Render title (if provided) using Text component
- [ ] Render description using Text component
- [ ] Handle primary action rendering (BaseButton)
- [ ] Handle secondary action rendering (BaseLink with type guards for href)
- [ ] Implement dismiss button (IconButton or BaseButton)
- [ ] Apply CVA classes for variants
- [ ] Add styled props support via getStyledPropsClasses
- [ ] Add analytics attributes
- [ ] Add accessibility attributes (role, aria-live)

### Task 5: Handle Actions Logic
- [ ] Implement primary action rendering with correct props
- [ ] Implement secondary action with union type handling
- [ ] Add type guard logic to detect button vs link secondary action
- [ ] Set up horizontal vs vertical action layout based on responsive behavior
- [ ] Pass through onClick handlers correctly

### Task 6: Responsive Behavior Implementation
- [ ] Implement responsive actions layout (horizontal on desktop + full-width)
- [ ] Handle icon alignment offsets
- [ ] Test layout switching at different breakpoints
- [ ] Adjust CSS for mobile-first approach

### Task 7: Accessibility Implementation
- [ ] Set `role="alert"` for negative/notice colors
- [ ] Set `role="status"` for information/positive/neutral colors
- [ ] Add `aria-live="polite"` for notice intent
- [ ] Set `aria-label="Dismiss alert"` on close button
- [ ] Test with screen readers

### Task 8: Dismissal Logic
- [ ] Create internal `isVisible` state variable
- [ ] Implement `onClickDismiss` handler that calls `onDismiss` prop and sets state
- [ ] Return `null` (or hide with CSS) when `isVisible` is false
- [ ] Pass dismiss handler to close button

### Task 9: Testing & Stories
- [ ] Create `Alert.stories.svelte` file
- [ ] Add story for each color variant (neutral, information, positive, negative, notice)
- [ ] Add story for emphasis variants (subtle, intense)
- [ ] Add story with title and description
- [ ] Add story with description only
- [ ] Add story with primary action
- [ ] Add story with primary + secondary actions
- [ ] Add story with secondary link action (href)
- [ ] Add story with custom icon
- [ ] Add story for full-width layout
- [ ] Add story for dismissible behavior
- [ ] Test responsive behavior manually
- [ ] Test keyboard navigation

### Task 10: Documentation & Cleanup
- [ ] Update component index.ts exports
- [ ] Verify TypeScript types are strict and complete
- [ ] Add JSDoc comments to exported functions
- [ ] Update blade-svelte components index to export Alert
- [ ] Test in example app

## Known Challenges

1. **Icon Component Availability**:
   - Need to verify all required icon components are migrated to Svelte
   - May need to defer migration or migrate icons first
   - **Mitigation**: Map icon names and check availability before implementing

2. **IconButton Component**:
   - React uses IconButton for dismiss functionality
   - If not available in Svelte, need to use BaseButton with icon-only styling
   - **Mitigation**: Check blade-svelte for IconButton, fallback to BaseButton

3. **Responsive Breakpoint Detection**:
   - React uses `useBreakpoint` hook for device detection
   - Svelte needs equivalent reactive breakpoint store or CSS-only approach
   - **Mitigation**: Prefer CSS media queries for layout switching, create utility if complex logic needed

4. **Icon Alignment Complexity**:
   - React has complex conditional logic for icon offset based on platform, device, layout
   - Platform-specific code (React Native) not relevant for Svelte
   - **Mitigation**: Simplify alignment using CSS flexbox, test visually for edge cases

5. **Secondary Action Union Type**:
   - SecondaryAction can be button or link (with href)
   - Need type guards to differentiate and pass correct props
   - **Mitigation**: Use TypeScript type narrowing with `'href' in action.secondary` checks

6. **State Management on Dismiss**:
   - Component manages internal visibility state, becomes null after dismiss
   - Need to coordinate internal state with optional `onDismiss` callback
   - **Mitigation**: Use Svelte `$state()` for reactivity, call callback before state update

7. **Full-Width Horizontal Actions**:
   - Actions should appear inline only on desktop when isFullWidth is true
   - Complex conditional rendering logic
   - **Mitigation**: Use CSS media queries combined with isFullWidth class modifier

8. **Accessibility Roles**:
   - Role changes based on color/severity (alert vs status)
   - Need to ensure correct ARIA attributes
   - **Mitigation**: Create helper function `getAlertAccessibilityRole(color)` in alert.ts

## Approval Required For

1. **Icon Component Readiness**:
   - Confirm all required icons (AlertOctagon, AlertTriangle, CheckCircle, Info, Close) are available in Svelte
   - Approve approach for icon rendering (Snippet-based vs component imports)

2. **IconButton Fallback**:
   - If IconButton not migrated, approve using BaseButton for dismiss functionality
   - Alternative: Migrate IconButton first (would add 2-3 hours)

3. **Responsive Implementation Approach**:
   - Approve CSS-only approach for responsive actions layout vs creating breakpoint utility
   - Simplify icon alignment logic vs replicating exact React behavior

4. **Platform-Specific Code**:
   - Confirm we can skip React Native specific code (CloseButtonWrapper, platform casting)
   - Svelte implementation is web-only

5. **Type Strictness**:
   - Approve union type approach for SecondaryAction (button vs link)
   - Confirm type guard pattern for differentiating action types

6. **Testing Scope**:
   - Stories-based manual testing vs automated tests
   - Level of visual regression testing needed

## Additional Notes

- The component should remain **API-compatible** with React version for consistency
- Max-width of 584px is a global design token, should be defined in CSS as constant
- Secondary action should only be used with primary action (document constraint, not enforced in types)
- Component is fully controlled for visibility after first dismiss (no way to re-show once dismissed)
- Consider adding explicit `isVisible` controlled prop in future for more flexible visibility control

## Plan Review

### Review Date
Friday Jan 9, 2026

### Review Status
✅ Approved with Prerequisites

### Guideline Compliance

| Guideline | Status | Notes |
|-----------|--------|-------|
| Directory structure follows PascalCase | ✅ | Correct structure: `Alert/Alert.svelte`, proper nesting planned |
| CSS modules in blade-core | ✅ | Properly planned in `packages/blade-core/src/styles/Alert/` with `alert.module.css` |
| CVA used for variants | ✅ | Comprehensive CVA structure with variants and compoundVariants for color/emphasis combinations |
| No inline styles | ✅ | All styles planned via CSS classes, no inline styles mentioned |
| Utilities in blade-core | ✅ | Helper functions correctly planned in `alert.ts` within blade-core |
| Props consistency | ✅ | Detailed props mapping shows consistent API between React and Svelte versions |
| Prop-based event handlers | ✅ | Uses `onDismiss: () => void` prop, correctly avoids createEventDispatcher |
| Compound components structure | ✅ | N/A - Uses object-based API for actions, design decision documented |

### Issues Found

**None** - The migration plan is comprehensive and follows all guidelines correctly.

### Recommendations

1. **Icon Dependencies Verification (Critical)**
   - Before starting implementation, verify all icon components are available:
     - `AlertOctagonIcon`, `AlertTriangleIcon`, `CheckCircleIcon`, `InfoIcon`, `CloseIcon`
   - If any icons are missing, they should be migrated first or the Alert migration should be deferred

2. **IconButton Fallback Approach**
   - Recommendation: Use BaseButton with icon-only styling for dismiss button
   - This is cleaner than migrating IconButton separately unless it's needed by other components
   - Document the icon-only button pattern for future components

3. **Responsive Implementation**
   - Recommendation: Use CSS-only approach with media queries for responsive actions layout
   - This is more maintainable and doesn't require JavaScript breakpoint detection
   - The planned CSS approach in the document is sound

4. **Icon Alignment Simplification**
   - Recommendation: Use CSS flexbox alignment instead of complex offset calculations
   - Test visually to ensure alignment looks correct in all scenarios
   - Skip React Native specific code as Svelte is web-only

5. **CSS Token Usage**
   - Ensure max-width constant (584px) is defined as a CSS custom property or referenced from design tokens
   - All spacing values correctly use `var(--spacing-*)` format

6. **Type Guards for Secondary Actions**
   - The planned approach using `'href' in action.secondary` is correct
   - Consider adding explicit type narrowing comments in implementation for clarity

### Approval Items

Before proceeding with implementation, confirm:

1. ✅ **All required Icon components are available** in blade-svelte (or plan to migrate them first)
2. ✅ **Approve CSS-only responsive approach** instead of creating breakpoint utility
3. ✅ **Approve using BaseButton** for dismiss functionality instead of IconButton
4. ✅ **Approve simplified icon alignment** using CSS flexbox instead of complex offsets
5. ✅ **Stories-based manual testing approach** is sufficient (no automated tests required initially)

### Final Verdict

**✅ Approved to Proceed** - This migration plan is well-structured and comprehensive. The plan follows all Blade Svelte guidelines correctly and addresses all necessary aspects of the Alert component migration.

**Prerequisites before execution:**
- Verify icon component availability and document findings
- Confirm BaseButton can support icon-only variant or document the approach
- Make final decision on responsive implementation approach (recommendation: CSS-only)

**Estimated complexity remains accurate:** Medium-High (6-8 hours) is reasonable given:
- Component complexity with multiple variants and responsive behavior
- Dependencies on Icon components need verification
- Comprehensive testing across all variants needed

**Next Steps:**
1. Run dependency verification task to check icon/button availability
2. Document findings in the plan
3. Proceed with Task 1 (Setup Component Structure) once prerequisites are confirmed
