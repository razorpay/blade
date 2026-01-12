# Migration Plan: Badge

## Metadata

- Component Name: Badge
- Migration Complexity: Medium
- Estimated Time: 3-5 days
- Planning Date: Friday Jan 9, 2026

## Target Directory Structure

```
packages/blade-svelte/src/components/Badge/
├── Badge.svelte                    # Main component
├── types.ts                        # TypeScript type definitions
├── index.ts                        # Public exports
└── Badge.stories.svelte            # Storybook stories

packages/blade-core/src/styles/Badge/
├── badge.module.css                # Badge styles
├── badge.ts                        # CVA configuration and color/size utilities
└── index.ts                        # Exports
```

## Props Mapping

| React Prop | Type | Svelte Prop | Type | Notes |
|------------|------|-------------|------|-------|
| children | StringChildrenType | children | string \| Snippet | String content or snippet in Svelte |
| color | FeedbackColors \| 'primary' | color | FeedbackColors \| 'primary' | Same - 'information' \| 'negative' \| 'neutral' \| 'notice' \| 'positive' \| 'primary' |
| emphasis | SubtleOrIntense | emphasis | 'subtle' \| 'intense' | Same - controls color intensity |
| size | 'xsmall' \| 'small' \| 'medium' \| 'large' | size | 'xsmall' \| 'small' \| 'medium' \| 'large' | Same |
| icon | IconComponent | icon | Snippet | Icon as Svelte snippet instead of React component |
| testID | string | testID | string | Same |
| ...StyledPropsBlade | margin, position, etc. | ...StyledPropsBlade | margin, position, etc. | Same styled props support |
| ...DataAnalyticsAttribute | data-analytics-* | ...DataAnalyticsAttribute | data-analytics-* | Same analytics support |

## CSS Module Plan

### Files to Create

1. `badge.module.css` - Base styles, size variants, and color variants
2. `badge.ts` - CVA configuration, color computation utilities, and size mappings

### CVA Variants

```typescript
// badge.ts - Planned CVA structure
import { cva } from 'class-variance-authority';
import styles from './badge.module.css';

export const badgeStyles = cva(styles.badge, {
  variants: {
    size: {
      xsmall: styles.xsmall,
      small: styles.small,
      medium: styles.medium,
      large: styles.large,
    },
    color: {
      neutral: styles['color-neutral'],
      information: styles['color-information'],
      negative: styles['color-negative'],
      notice: styles['color-notice'],
      positive: styles['color-positive'],
      primary: styles['color-primary'],
    },
    emphasis: {
      subtle: styles['emphasis-subtle'],
      intense: styles['emphasis-intense'],
    },
  },
  compoundVariants: [
    // Each color + emphasis combination
    // e.g., { color: 'primary', emphasis: 'subtle', class: styles['primary-subtle'] }
    // These will handle the specific background, text, and icon color combinations
  ],
  defaultVariants: {
    size: 'medium',
    color: 'neutral',
    emphasis: 'subtle',
  },
});
```

### CSS Classes Plan

```css
/* badge.module.css - Planned CSS classes */

/* Base Badge Styles */
.badge {
  display: inline-flex;
  flex-wrap: nowrap;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-max); /* Fully rounded corners */
  position: relative;
  overflow: hidden;
}

/* Size Variants - Heights and Padding */
.xsmall {
  height: 14px;
  padding-left: var(--spacing-2);  /* 4px */
  padding-right: var(--spacing-2);
}

.small {
  height: 16px;
  padding-left: var(--spacing-3);  /* 8px */
  padding-right: var(--spacing-3);
}

.medium {
  height: 20px;
  padding-left: var(--spacing-3);
  padding-right: var(--spacing-3);
}

.large {
  height: 24px;
  padding-left: var(--spacing-4);  /* 12px */
  padding-right: var(--spacing-4);
}

/* Content wrapper */
.content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Icon wrapper */
.icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* Icon padding based on size */
.xsmall .icon {
  padding-right: var(--spacing-1);  /* 2px */
}

.small .icon {
  padding-right: var(--spacing-1);
}

.medium .icon {
  padding-right: var(--spacing-2);  /* 4px */
}

.large .icon {
  padding-right: var(--spacing-2);
}

/* Color + Emphasis Combinations - Primary Color */
.color-primary.emphasis-subtle {
  background-color: var(--surface-background-primary-subtle);
}

.color-primary.emphasis-intense {
  background-color: var(--surface-background-primary-intense);
}

/* Color + Emphasis Combinations - Feedback Colors */
.color-neutral.emphasis-subtle {
  background-color: var(--feedback-background-neutral-subtle);
}

.color-neutral.emphasis-intense {
  background-color: var(--feedback-background-neutral-intense);
}

.color-information.emphasis-subtle {
  background-color: var(--feedback-background-information-subtle);
}

.color-information.emphasis-intense {
  background-color: var(--feedback-background-information-intense);
}

.color-negative.emphasis-subtle {
  background-color: var(--feedback-background-negative-subtle);
}

.color-negative.emphasis-intense {
  background-color: var(--feedback-background-negative-intense);
}

.color-notice.emphasis-subtle {
  background-color: var(--feedback-background-notice-subtle);
}

.color-notice.emphasis-intense {
  background-color: var(--feedback-background-notice-intense);
}

.color-positive.emphasis-subtle {
  background-color: var(--feedback-background-positive-subtle);
}

.color-positive.emphasis-intense {
  background-color: var(--feedback-background-positive-intense);
}
```

## Utilities Plan

### Utilities to Add/Check in blade-core

These utilities are used by Badge and need to be verified/added in `packages/blade-core/src/utils`:

- **getStyledPropsClasses**: Extract and convert styled props (margin, position, etc.) to CSS classes
  - Location: `packages/blade-core/src/utils/styledProps/getStyledPropsClasses.ts`
  - Status: ✅ Already exists

- **makeAnalyticsAttribute**: Create analytics tracking attributes from props
  - Location: `packages/blade-core/src/utils/makeAnalyticsAttribute/makeAnalyticsAttribute.ts`
  - Status: ✅ Already exists

- **metaAttribute**: Add metadata attributes for component identification
  - Location: `packages/blade-core/src/utils/metaAttribute/metaAttribute.ts`
  - Status: ✅ Already exists

### New Utilities to Add in blade-core

- **getBadgeColorProps**: Utility function to compute text, icon, and background color tokens based on color and emphasis
  - Location: `packages/blade-core/src/styles/Badge/badge.ts`
  - Purpose: Returns the correct color token paths for a given color + emphasis combination
  - Will replace React's `getColorProps` function

- **getBadgeTextSize**: Utility function to get text variant and size based on badge size
  - Location: `packages/blade-core/src/styles/Badge/badge.ts`
  - Purpose: Maps badge size to appropriate text component props
  - Returns: `{ variant: 'body', size: 'xsmall' | 'small' }`

- **getBadgeIconSize**: Utility function to get icon size based on badge size
  - Location: `packages/blade-core/src/styles/Badge/badge.ts`
  - Purpose: Maps badge size to icon size ('xsmall' or 'small')

### Existing Utilities to Use

- **makeAnalyticsAttribute**: `@razorpay/blade-core/utils`
- **getStyledPropsClasses**: `@razorpay/blade-core/utils`
- **metaAttribute**: `@razorpay/blade-core/utils`

## Compound Components Plan

Badge does not use compound components. It's a standalone component with a simple structure:
- Main Badge wrapper
- Optional Icon
- Text label

## Dependency Components

### Components Used

- **Text**: Typography component for the badge label
  - Status: ✅ Already migrated to Svelte
  - Path: `packages/blade-svelte/src/components/Typography/Text/Text.svelte`

- **Icon system**: For optional icon display
  - Status: ⚠️ **NEEDS CONFIRMATION** - Check if icon components are available in Svelte
  - Note: In React, icons are passed as components. In Svelte, they should be passed as snippets

- **BaseBox**: Used for layout wrapper in React version
  - Status: ⚠️ **NEEDS CONFIRMATION** - Check if BaseBox exists in Svelte or if we should use native div with classes

### Migration Order

1. **Prerequisite checks**:
   - Verify Icon system availability in Svelte (or use snippet-based approach)
   - Confirm approach for BaseBox (use BaseBox or native div)

2. **Badge migration** (current component):
   - Can proceed once Icon approach is confirmed

## Event Handlers Plan

Badge is a purely presentational component with **no event handlers**. No click, hover, or other interaction handlers are needed.

| React Handler | Svelte Implementation | Notes |
|---------------|----------------------|-------|
| None | None | Badge is display-only |

## Migration Tasks Checklist

### Task 1: Setup Component Structure
- [ ] Create `packages/blade-svelte/src/components/Badge/` directory
- [ ] Create `Badge.svelte` file
- [ ] Create `types.ts` file with BadgeProps interface
- [ ] Create `index.ts` for exports
- [ ] Create `Badge.stories.svelte` file

### Task 2: Create CSS Modules in blade-core
- [ ] Create `packages/blade-core/src/styles/Badge/` directory
- [ ] Create `badge.module.css` with all badge styles
  - [ ] Base badge styles (display, border-radius, flex)
  - [ ] Size variants (xsmall, small, medium, large)
  - [ ] Color variants (neutral, information, negative, notice, positive, primary)
  - [ ] Emphasis variants (subtle, intense)
  - [ ] Compound variants (color + emphasis combinations)
  - [ ] Icon and content wrapper styles
- [ ] Create `badge.ts` with CVA config
  - [ ] Define badgeStyles CVA with all variants
  - [ ] Create getBadgeColorProps utility function
  - [ ] Create getBadgeTextSize utility function
  - [ ] Create getBadgeIconSize utility function
  - [ ] Define badge height constants
  - [ ] Define icon padding constants
  - [ ] Export all utilities and classes
- [ ] Create `index.ts` for exports

### Task 3: Implement Badge Component
- [ ] Port BadgeProps interface to Svelte types
  - [ ] Map React StringChildrenType to string | Snippet
  - [ ] Map IconComponent to Snippet type
  - [ ] Include StyledPropsBlade support
  - [ ] Include DataAnalyticsAttribute support
- [ ] Implement Badge.svelte component
  - [ ] Accept all props using `$props()`
  - [ ] Set default values (color='neutral', emphasis='subtle', size='medium')
  - [ ] Use `$derived` for computed values (classes, color props, text size)
  - [ ] Generate CSS classes using badgeStyles CVA
  - [ ] Apply styled props classes using getStyledPropsClasses
  - [ ] Add meta attributes using metaAttribute
  - [ ] Add analytics attributes using makeAnalyticsAttribute
  - [ ] Implement badge markup structure
  - [ ] Conditionally render icon if provided (using snippet)
  - [ ] Render text using Text component with proper props
  - [ ] Handle text truncation (truncateAfterLines={1})
- [ ] Add dev mode validation for empty children string

### Task 4: Handle Dependencies
- [ ] ✅ Verify Text component exists in Svelte
- [ ] ⚠️ **CONFIRM** Icon system approach in Svelte
  - Option 1: Use icon components with snippet pattern
  - Option 2: Use SVG-based icon system
- [ ] ⚠️ **CONFIRM** BaseBox approach
  - Option 1: Use existing BaseBox if available
  - Option 2: Use native div with utility classes
- [ ] Import required utilities from blade-core
- [ ] Export Badge component from index files

### Task 5: Testing Setup & Stories
- [ ] Create Badge.stories.svelte with story variants
  - [ ] Default badge (neutral, subtle, medium)
  - [ ] All color variants
  - [ ] All emphasis variants
  - [ ] All size variants
  - [ ] With icon variants
  - [ ] Long text truncation test
  - [ ] Styled props examples
  - [ ] Analytics attributes examples
- [ ] Test all prop combinations
- [ ] Verify text truncation works
- [ ] Verify icon display (if icons are available)
- [ ] Verify styled props integration
- [ ] Verify color contrast in both subtle and intense modes

### Task 6: Documentation & Cleanup
- [ ] Document component usage in stories
- [ ] Add JSDoc comments to types
- [ ] Verify all CSS classes are used
- [ ] Clean up unused code
- [ ] Update exports in component index files

## Known Challenges

### 1. Icon Component Pattern
**Challenge**: React uses IconComponent type where icons are passed as components. Svelte uses a different pattern.

**Solution**: Use Svelte snippets for icon prop. Icons will be passed as `{#snippet icon()}...{/snippet}` and rendered using `{@render icon()}`.

**Approval Required**: Confirm icon system approach with team.

### 2. BaseBox vs Native Elements
**Challenge**: React version uses BaseBox for layout wrapper. Need to decide Svelte approach.

**Options**:
- Use BaseBox if it exists in Svelte
- Use native div with utility classes and styled props

**Approval Required**: Confirm BaseBox availability and approach.

### 3. Text Truncation
**Challenge**: React uses `truncateAfterLines={1}` on Text component. Need to verify this prop exists in Svelte Text component.

**Solution**: Check Svelte Text component API. If not available, add CSS-based text truncation using:
```css
.badge-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### 4. Theme Token Access
**Challenge**: React version accesses theme tokens via styled-components theme. Svelte uses CSS custom properties.

**Solution**: All color tokens are already available as CSS variables (e.g., `var(--feedback-background-neutral-subtle)`). CVA will use these directly in CSS modules.

### 5. Platform-Specific Code
**Challenge**: React has separate web/native implementations. Svelte is web-only.

**Solution**: Simplify by removing native-specific code. Use `display: inline-flex` and `width: fit-content` for web.

### 6. Color Computation Logic
**Challenge**: Complex color token path computation based on color + emphasis combination.

**Solution**: 
- Pre-compute all color combinations in CSS (color-neutral.emphasis-subtle, etc.)
- Use CVA compound variants to apply correct combination
- Create utility function `getBadgeColorProps` in badge.ts for any dynamic needs

### 7. Children Validation
**Challenge**: React validates children is non-empty string at runtime.

**Solution**: Add similar validation in Svelte using `$effect` in dev mode:
```typescript
$effect(() => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    if (!children || (typeof children === 'string' && !children.trim())) {
      console.error('[Blade: Badge]: Text as children is required for Badge.');
    }
  }
});
```

## Approval Required For

1. **Icon System Approach**
   - How are icons being handled in Svelte Badge?
   - Should we use snippets or component-based approach?
   - Are Blade icon components available in Svelte?

2. **BaseBox Component**
   - Is BaseBox available in blade-svelte?
   - Should we use BaseBox or native div with utility classes?

3. **Migration Priority**
   - Should Badge be migrated now or wait for icon system?
   - Any dependencies that should be migrated first?

4. **Text Component API**
   - Does Svelte Text component support `truncateAfterLines` prop?
   - If not, should we add it or use CSS-based truncation?

5. **CSS Organization**
   - Confirm compound variants approach for color + emphasis combinations
   - Approve the CVA structure and CSS class naming

6. **Snippet Pattern for Icons**
   - Confirm the snippet-based approach for icon prop is acceptable
   - Example usage:
   ```svelte
   <Badge color="positive">
     {#snippet icon()}
       <CheckIcon />
     {/snippet}
     Success
   </Badge>
   ```

## Additional Notes

- Badge is a relatively simple component with no event handlers or complex interactions
- The main complexity is in color token mapping and size configurations
- All styling should be class-based, no inline styles
- Follow WYSIWYG (What You See Is What You Get) philosophy
- Ensure strict TypeScript checks
- Test all color + emphasis combinations for proper contrast
- Verify responsive behavior with styled props (margin, position, etc.)

---

## Plan Review

### Review Date
Friday Jan 9, 2026

### Review Status
✅ Approved with Minor Confirmations Needed

### Guideline Compliance

| Guideline | Status | Notes |
|-----------|--------|-------|
| Directory structure follows PascalCase | ✅ | Correctly uses `Badge/` with `Badge.svelte`, `types.ts`, `index.ts` |
| CSS modules in blade-core | ✅ | Properly planned in `packages/blade-core/src/styles/Badge/` |
| CVA used for variants | ✅ | Well-structured CVA with size, color, emphasis variants and compound variants |
| No inline styles | ✅ | Plan explicitly states class-based styling only |
| Utilities in blade-core | ✅ | All utilities correctly planned in blade-core (getBadgeColorProps, getBadgeTextSize, getBadgeIconSize) |
| Props consistency | ✅ | Props properly mapped from React to Svelte with appropriate adaptations (IconComponent → Snippet) |
| Prop-based event handlers | ✅ | N/A - Badge has no event handlers (display-only component) |
| Compound components structure | ✅ | N/A - Badge is standalone, correctly identified in plan |

### Issues Found

**No critical issues found.** The migration plan is comprehensive and follows all Blade Svelte guidelines correctly.

### Recommendations

1. **CSS Class Naming**: Consider using kebab-case consistently for CSS class names (e.g., `color-neutral` instead of mixing patterns). The plan already uses this correctly.

2. **Icon Gap Styling**: The plan uses nested selectors like `.xsmall .icon` for icon padding. Consider using CVA compound variants for better maintainability:
   ```typescript
   compoundVariants: [
     { size: 'xsmall', hasIcon: true, class: styles['icon-gap-xsmall'] },
     { size: 'small', hasIcon: true, class: styles['icon-gap-small'] },
     // etc.
   ]
   ```

3. **Text Component Verification**: The plan correctly identifies the need to verify `truncateAfterLines` prop availability. If not available, the CSS fallback is a good approach.

4. **Dev Mode Validation**: The `$effect` approach for validation is good, but consider using `import.meta.env.DEV` instead of `window.location.hostname === 'localhost'` for better build-time optimization.

5. **Color Token Organization**: The compound CSS classes for color+emphasis combinations are well-organized. Ensure all 12 combinations (6 colors × 2 emphasis levels) are covered.

### Approval Items

Before proceeding with implementation, confirm the following:

1. **Icon System Approach** ⚠️
   - Is the snippet-based approach `{#snippet icon()}...{/snippet}` acceptable for the team?
   - Are Blade icon components available in Svelte?
   - Example usage pattern approved?

2. **BaseBox Component** ⚠️
   - Is BaseBox available in blade-svelte?
   - If not, confirm using native `<div>` with utility classes is acceptable

3. **Text Component API** ⚠️
   - Does Svelte Text component support `truncateAfterLines={1}` prop?
   - If not, approve CSS-based truncation fallback

4. **Migration Priority** ⚠️
   - Should Badge migration proceed now or wait for icon system stabilization?
   - Text component is confirmed migrated ✅

### Technical Review

**Strengths:**
- ✅ Comprehensive CVA structure with proper variants and compound variants
- ✅ All CSS tokens correctly mapped to CSS custom properties
- ✅ Utilities properly scoped to blade-core
- ✅ Props maintain API consistency with React version
- ✅ No inline styles - 100% class-based approach
- ✅ Proper handling of styled props (margin, position, etc.)
- ✅ Analytics and testing attributes included
- ✅ Clear separation of concerns (styles in blade-core, component in blade-svelte)

**CSS Structure Quality:**
- ✅ Base styles properly defined
- ✅ Size variants with correct spacing tokens
- ✅ Color + emphasis combinations cover all cases
- ✅ Border radius using semantic token (`var(--border-radius-max)`)
- ✅ Proper use of CSS custom properties for theming

**TypeScript & Type Safety:**
- ✅ Proper type mapping from React to Svelte
- ✅ Snippet type correctly used for children and icon
- ✅ StyledPropsBlade support maintained
- ✅ DataAnalyticsAttribute support maintained

### Final Verdict

**✅ APPROVED TO PROCEED** with the following dependencies confirmed first:

1. Confirm Icon system approach (snippet-based) - **BLOCKER**
2. Confirm BaseBox availability or native div approach - **BLOCKER**
3. Verify Text component `truncateAfterLines` prop - **MINOR** (has CSS fallback)

Once the two blocker items are confirmed, the implementation can proceed immediately. The migration plan is thorough, follows all guidelines, and demonstrates a clear understanding of both the React source component and Svelte best practices.

**Estimated Success Rate**: 95% - The plan is solid, with minimal risk pending dependency confirmations.
