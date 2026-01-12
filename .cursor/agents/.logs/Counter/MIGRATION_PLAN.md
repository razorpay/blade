# Migration Plan: Counter

## Metadata

- Component Name: Counter
- Migration Complexity: Medium
- Estimated Time: 3-4 hours
- Planning Date: Friday Jan 9, 2026

## Target Directory Structure

```
packages/blade-svelte/src/components/Counter/
├── Counter.svelte           # Main Counter component
├── types.ts                 # TypeScript type definitions
├── index.ts                 # Public exports
└── Counter.stories.svelte   # Storybook stories (for testing)

packages/blade-core/src/styles/Counter/
├── counter.module.css       # Base styles and variants
├── counter.ts               # CVA configuration and helper functions
└── index.ts                 # Public exports
```

## Props Mapping

| React Prop | Type | Svelte Prop | Type | Notes |
|------------|------|-------------|------|-------|
| value | number | value | number | Required. The numeric value to display |
| max | number \| undefined | max | number \| undefined | Optional. If value > max, displays "{max}+" |
| color | FeedbackColors \| 'primary' | color | FeedbackColors \| 'primary' | Default: 'neutral' |
| emphasis | SubtleOrIntense | emphasis | SubtleOrIntense | Default: 'subtle' |
| size | 'small' \| 'medium' \| 'large' | size | 'small' \| 'medium' \| 'large' | Default: 'medium' |
| testID | string \| undefined | testID | string \| undefined | For testing |
| ...rest (StyledPropsBlade) | StyledPropsBlade | ...rest | StyledPropsBlade | Margin, position, display props |
| ...rest (DataAnalyticsAttribute) | DataAnalyticsAttribute | ...rest | DataAnalyticsAttribute | data-analytics-* attributes |

**Type Definitions:**
- `FeedbackColors = 'information' | 'negative' | 'neutral' | 'notice' | 'positive'`
- `SubtleOrIntense = 'subtle' | 'intense'`

## CSS Module Plan

### Files to Create

1. **`counter.module.css`** - Base styles and variants
2. **`counter.ts`** - CVA configuration and helper functions
3. **`index.ts`** - Barrel export

### CVA Variants

```typescript
// packages/blade-core/src/styles/Counter/counter.ts
import { cva } from 'class-variance-authority';
import styles from './counter.module.css';

export type CounterSize = 'small' | 'medium' | 'large';
export type CounterColor = 'neutral' | 'information' | 'negative' | 'notice' | 'positive' | 'primary';
export type CounterEmphasis = 'subtle' | 'intense';

export type CounterVariants = {
  size?: CounterSize;
  color?: CounterColor;
  emphasis?: CounterEmphasis;
};

export const counterStyles = cva(styles.counter, {
  variants: {
    size: {
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
  defaultVariants: {
    size: 'medium',
    color: 'neutral',
    emphasis: 'subtle',
  },
});

// Helper function to get color props
export function getCounterColorProps({
  color,
  emphasis,
}: {
  color: CounterColor;
  emphasis: CounterEmphasis;
}): {
  textColor: string;
  backgroundColor: string;
} {
  const props = {
    textColor: 'feedback.text.neutral.intense',
    backgroundColor: 'feedback.background.neutral.subtle',
  };

  if (color === 'primary') {
    props.textColor =
      emphasis === 'intense' ? 'surface.text.staticWhite.normal' : 'surface.text.primary.normal';
    props.backgroundColor = `surface.background.primary.${emphasis}`;
  } else {
    props.textColor =
      emphasis === 'intense' ? 'surface.text.staticWhite.normal' : `feedback.text.${color}.intense`;
    props.backgroundColor = `feedback.background.${color}.${emphasis}`;
  }

  return props;
}

// Helper function to get text size based on counter size
export function getCounterTextSize(size: CounterSize): {
  variant: 'body';
  size: 'xsmall' | 'small' | 'medium';
} {
  const counterTextSizes = {
    small: { variant: 'body' as const, size: 'xsmall' as const },
    medium: { variant: 'body' as const, size: 'small' as const },
    large: { variant: 'body' as const, size: 'medium' as const },
  };

  return counterTextSizes[size];
}

// Export content class for template
export const counterContentClass = styles.content;

// Helper to get template classes (prevents tree-shaking)
export function getCounterTemplateClasses(): Record<string, string> {
  return {
    content: counterContentClass,
  } as const;
}
```

### CSS Classes Plan

```css
/* packages/blade-core/src/styles/Counter/counter.module.css */

/* Base Counter Styles */
.counter {
  display: inline-flex;
  flex-wrap: nowrap;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-max);
  position: relative;
  overflow: hidden;
  width: fit-content;
}

/* Size Variants - Heights and Padding */
.small {
  min-height: 16px;
  max-width: 100px; /* mobile max-width */
}

.medium {
  min-height: 20px;
  max-width: 100px;
}

.large {
  min-height: 24px;
  max-width: 100px;
}

/* Desktop max-width adjustment (if needed) */
@media (min-width: 768px) {
  .small,
  .medium,
  .large {
    max-width: 120px;
  }
}

/* Content wrapper */
.content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Content padding variants by size */
.small .content {
  padding-left: var(--spacing-2);
  padding-right: var(--spacing-2);
}

.medium .content {
  padding-left: var(--spacing-3);
  padding-right: var(--spacing-3);
}

.large .content {
  padding-left: var(--spacing-3);
  padding-right: var(--spacing-3);
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

All required utilities already exist in `blade-core/src/utils`:
- ✅ `getStyledPropsClasses` - For StyledPropsBlade support (margin, position, etc.)
- ✅ `metaAttribute` - For component metadata and testID
- ✅ `makeAnalyticsAttribute` - For data-analytics-* attributes
- ✅ `MetaConstants` - Contains Counter constant

### Existing Utilities to Use

- `getStyledPropsClasses` from `@razorpay/blade-core/utils`
- `metaAttribute` from `@razorpay/blade-core/utils`
- `makeAnalyticsAttribute` from `@razorpay/blade-core/utils`
- `MetaConstants` from `@razorpay/blade-core/utils`

## Compound Components Plan

**No compound components.** Counter is a single, standalone display component.

## Dependency Components

### Components Used

- **Text**: ✅ Already migrated (`packages/blade-svelte/src/components/Typography/Text/`)
  - Used to display the counter value with proper typography
  - Requires variant, size, weight, color, and truncateAfterLines props

### Migration Order

No dependencies need migration. Counter only depends on Text which is already available in Svelte.

## Event Handlers Plan

**No event handlers.** Counter is a non-interactive display component.

## Migration Tasks Checklist

### Task 1: Setup CSS Modules in blade-core
- [ ] Create `packages/blade-core/src/styles/Counter/` directory
- [ ] Create `counter.module.css` with base styles and all variants
- [ ] Create `counter.ts` with CVA configuration
- [ ] Implement `getCounterColorProps()` helper function
- [ ] Implement `getCounterTextSize()` helper function
- [ ] Implement `getCounterTemplateClasses()` helper function
- [ ] Create `index.ts` barrel export
- [ ] Add Counter export to `packages/blade-core/src/styles/index.ts`

### Task 2: Setup Component Structure in blade-svelte
- [ ] Create `packages/blade-svelte/src/components/Counter/` directory
- [ ] Create `types.ts` with CounterProps interface
- [ ] Create `index.ts` barrel export

### Task 3: Implement Counter Component
- [ ] Create `Counter.svelte` file
- [ ] Import types from `types.ts`
- [ ] Import Text component from Typography
- [ ] Import CVA styles and helpers from blade-core
- [ ] Import utilities (getStyledPropsClasses, metaAttribute, makeAnalyticsAttribute)
- [ ] Implement props with $props() rune
- [ ] Implement content calculation logic (value > max ? `${max}+` : `${value}`)
- [ ] Use $derived for computed values:
  - colorProps = getCounterColorProps({ color, emphasis })
  - textSize = getCounterTextSize(size)
  - counterClasses = counterStyles({ size, color, emphasis })
  - styledPropsClasses = getStyledPropsClasses(rest)
  - allClasses = combine counterClasses + styledPropsClasses
- [ ] Implement template with div wrapper and Text child
- [ ] Apply metaAttribute for metadata and testID
- [ ] Apply makeAnalyticsAttribute for analytics attributes

### Task 4: Testing Setup
- [ ] Create `Counter.stories.svelte` with all variants
- [ ] Add story for all color variants (6 colors × 2 emphasis = 12 combinations)
- [ ] Add story for all size variants (3 sizes)
- [ ] Add story for max value behavior (value > max)
- [ ] Add story demonstrating styled props (margin, position)
- [ ] Add story with analytics attributes

### Task 5: Update Package Exports
- [ ] Add Counter to `packages/blade-svelte/src/components/index.ts`
- [ ] Verify export path works correctly
- [ ] Update barrel exports if needed

### Task 6: Validation and Testing
- [ ] Test all color × emphasis combinations render correctly
- [ ] Test all size variants render correctly
- [ ] Test max value logic (e.g., value=120, max=99 displays "99+")
- [ ] Test styled props work (margin, position, display)
- [ ] Test testID attribute is applied
- [ ] Test data-analytics-* attributes are applied
- [ ] Verify no TypeScript errors
- [ ] Verify CSS classes are applied correctly
- [ ] Visual comparison with React Counter component

## Component Structure Preview

```svelte
<!-- packages/blade-svelte/src/components/Counter/Counter.svelte -->
<script lang="ts">
  import type { CounterProps } from './types';
  import Text from '../Typography/Text/Text.svelte';
  import {
    counterStyles,
    getCounterColorProps,
    getCounterTextSize,
    getCounterTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import {
    getStyledPropsClasses,
    makeAnalyticsAttribute,
    metaAttribute,
    MetaConstants,
  } from '@razorpay/blade-core/utils';

  let {
    value,
    max,
    color = 'neutral',
    emphasis = 'subtle',
    size = 'medium',
    testID,
    ...rest
  }: CounterProps = $props();

  // Calculate display content
  const content = $derived(max !== undefined && value > max ? `${max}+` : `${value}`);

  // Get color props
  const colorProps = $derived(getCounterColorProps({ color, emphasis }));

  // Get text size
  const textSize = $derived(getCounterTextSize(size));

  // Generate counter CSS classes
  const counterClasses = $derived(counterStyles({ size, color, emphasis }));

  // Get styled props classes
  const styledPropsClasses = $derived(getStyledPropsClasses(rest));

  // Get template classes
  const templateClasses = getCounterTemplateClasses();

  // Combine all classes
  const allClasses = $derived([counterClasses, styledPropsClasses].filter(Boolean).join(' '));

  // Get analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);
</script>

<div
  class={allClasses}
  {...metaAttribute({ name: MetaConstants.Counter, testID })}
  {...analyticsAttrs}
>
  <div class={templateClasses.content}>
    <Text
      variant={textSize.variant}
      size={textSize.size}
      weight="medium"
      textAlign="center"
      truncateAfterLines={1}
      color={colorProps.textColor}
    >
      {content}
    </Text>
  </div>
</div>
```

```typescript
// packages/blade-svelte/src/components/Counter/types.ts
import type { StyledPropsBlade, TestID, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';

export type FeedbackColors = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';
export type SubtleOrIntense = 'subtle' | 'intense';

export type CounterProps = {
  /**
   * Sets the value for the counter.
   */
  value: number;

  /**
   * Sets the max value for the counter.
   * If value exceeds `max` it will render `{max}+`
   */
  max?: number;

  /**
   * Sets the color of the counter.
   *
   * @default 'neutral'
   */
  color?: FeedbackColors | 'primary';

  /**
   * Sets the contrast of the counter.
   *
   * @default 'subtle'
   */
  emphasis?: SubtleOrIntense;

  /**
   * Sets the size of the counter.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;
```

## Known Challenges

1. **Max-width responsive handling**: The React component uses platform detection (mobile vs desktop) to set max-width (100px vs 120px). In pure CSS Svelte implementation, we'll use media queries instead.

2. **Width fit-content**: Need to ensure `width: fit-content` works correctly across browsers while also respecting max-width constraints.

3. **Text truncation**: Must ensure `truncateAfterLines={1}` on Text component handles overflow correctly within the Counter's max-width constraint.

4. **Color token resolution**: Need to verify all color token paths (e.g., `feedback.text.neutral.intense`) are correctly mapped in blade-core's CSS variables.

5. **CVA compound variants**: Unlike Badge, Counter doesn't need compound variants, but need to ensure color + emphasis combinations work correctly via CSS class combinations.

## Approval Required For

1. **Max-width implementation approach**: Confirm using CSS media queries for responsive max-width (100px mobile, 120px desktop) instead of platform detection is acceptable.

2. **counterTokens migration**: Confirm whether `counterTokens.ts` (height, padding, maxWidth constants) should be:
   - a) Embedded directly in CSS variables
   - b) Kept as a separate TypeScript file in blade-core
   - c) Merged into the counter.ts CVA file as constants

3. **Ref forwarding**: React Counter uses `React.forwardRef` for ref forwarding. Confirm if Svelte Counter needs `bind:this` support for DOM element access.

4. **Development validation**: Confirm if we need to add validation (like Badge's dev-mode check for children) for value/max prop validation.

## Notes

- Counter is simpler than Badge: no icon support, no complex compound variants
- Very similar color/emphasis logic to Badge (can reference Badge implementation)
- Pure display component with no interactivity or state management
- Main logic is content calculation: `value > max ? '${max}+' : '${value}'`
- Migration complexity is medium mainly due to CSS module setup and color variant combinations

---

## Plan Review

### Review Date
Friday Jan 9, 2026

### Review Status
✅ Approved

### Guideline Compliance

| Guideline | Status | Notes |
|-----------|--------|-------|
| Directory structure follows PascalCase | ✅ | Correct: `Counter/` directory with `Counter.svelte`, proper file naming conventions followed |
| CSS modules in blade-core | ✅ | Properly placed in `packages/blade-core/src/styles/Counter/` with `counter.module.css` and `counter.ts` |
| CVA used for variants | ✅ | Excellent CVA implementation with size, color, and emphasis variants. Includes defaultVariants |
| No inline styles | ✅ | All styles in CSS modules using CSS custom properties. No inline styles in component template |
| Utilities in blade-core | ✅ | All utilities referenced from blade-core: `getStyledPropsClasses`, `metaAttribute`, `makeAnalyticsAttribute`, `MetaConstants` |
| Props consistency | ✅ | 1:1 mapping between React and Svelte props. All prop types match including StyledPropsBlade and DataAnalyticsAttribute |
| Prop-based event handlers | ✅ | N/A - Counter is a non-interactive display component with no event handlers |
| Compound components structure | ✅ | N/A - Counter is a standalone component, no compound component pattern needed |

### Issues Found

None. The migration plan is comprehensive and follows all Blade Svelte guidelines correctly.

### Recommendations

1. **CSS Descendant Selectors**: The CSS uses descendant selectors like `.small .content` which is correct for the nested structure. Ensure the content div always has the `content` class applied.

2. **Helper Function Exports**: The `getCounterTemplateClasses()` function is well-designed to prevent tree-shaking of CSS classes. This pattern should be maintained.

3. **Color Token Validation**: During implementation, verify all color token paths (e.g., `feedback.text.neutral.intense`, `surface.background.primary.subtle`) exist in the CSS custom properties.

4. **Text Component Dependency**: Ensure Text component's `truncateAfterLines` prop works correctly within Counter's max-width constraints. Test with long numbers.

5. **Media Query Approach**: The decision to use CSS media queries (`@media (min-width: 768px)`) instead of platform detection is appropriate for Svelte implementation and aligns with modern responsive design practices.

6. **Type Exports**: Consider exporting `FeedbackColors` and `SubtleOrIntense` types from blade-core if they're used across multiple components, to maintain DRY principles.

### Approval Items

The following items mentioned in "Approval Required For" are recommended approaches:

1. **Max-width implementation**: ✅ Approved - Using CSS media queries is the correct approach for Svelte
2. **counterTokens migration**: ✅ Recommended - Option (a) embedding directly in CSS variables is appropriate for this component's simplicity
3. **Ref forwarding**: Recommend adding `bind:this` support for DOM element access for consistency
4. **Development validation**: Optional - Given Counter's simple props, validation is not critical but could be added for max < value edge cases

### Final Verdict

✅ **Approved to proceed with implementation**

The migration plan is thorough, well-structured, and adheres to all Blade Svelte guidelines. The approach is clean, maintainable, and consistent with existing patterns. All CSS is properly modularized, utilities are correctly placed in blade-core, and the component structure follows best practices. The plan demonstrates excellent understanding of CVA usage, responsive design, and the Blade design system architecture.
