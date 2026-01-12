# Migration Plan: Card

## Metadata

- Component Name: Card
- Migration Complexity: High
- Estimated Time: 3-4 days (full implementation with all compound components)
- Planning Date: January 9, 2026

## Target Directory Structure

```
packages/blade-svelte/src/components/Card/
├── Card.svelte                          # Main Card wrapper component
├── CardBody.svelte                      # Card body container
├── CardHeader/
│   ├── CardHeader.svelte                # Header container
│   ├── CardHeaderLeading.svelte         # Leading section with title/subtitle
│   ├── CardHeaderTrailing.svelte        # Trailing section with visual
│   ├── CardHeaderIcon.svelte            # Icon wrapper
│   ├── CardHeaderCounter.svelte         # Counter pass-through
│   ├── CardHeaderBadge.svelte           # Badge pass-through
│   ├── CardHeaderAmount.svelte          # Amount pass-through
│   ├── CardHeaderText.svelte            # Text pass-through
│   ├── CardHeaderLink.svelte            # Link pass-through
│   └── CardHeaderIconButton.svelte      # Icon button wrapper
├── CardFooter/
│   ├── CardFooter.svelte                # Footer container
│   ├── CardFooterLeading.svelte         # Leading section with title/subtitle
│   └── CardFooterTrailing.svelte        # Trailing section with actions
├── CardRoot.svelte                      # Platform-specific root (web only)
├── CardSurface.svelte                   # Surface with elevation styles
├── LinkOverlay.svelte                   # Link overlay pattern for clickable cards
├── CardContext.ts                       # Svelte context for size management
├── types.ts                             # Type definitions
├── constants.ts                         # Constants
├── index.ts                             # Public exports
└── Card.stories.svelte                  # Storybook stories

packages/blade-core/src/styles/Card/
├── card.module.css                      # Base card styles
├── card.ts                              # CVA configuration for Card
├── cardHeader.module.css                # Header styles
├── cardHeader.ts                        # CVA for header
├── cardFooter.module.css                # Footer styles
├── cardFooter.ts                        # CVA for footer
├── cardSurface.module.css               # Surface and elevation styles
├── cardSurface.ts                       # CVA for surface
├── linkOverlay.module.css               # Link overlay styles
├── linkOverlay.ts                       # CVA for link overlay
└── index.ts                             # Re-exports
```

## Props Mapping

### Card (Main Component)

| React Prop | Type | Svelte Prop | Type | Notes |
|------------|------|-------------|------|-------|
| children | React.ReactNode | children | Snippet | Use Svelte snippets |
| backgroundColor | CardSurfaceBackgroundColors | backgroundColor | string | Keep same token strings |
| borderRadius | 'medium' \| 'large' \| 'xlarge' | borderRadius | 'medium' \| 'large' \| 'xlarge' | No change |
| elevation | keyof Elevation | elevation | keyof Elevation | No change |
| padding | CardSpacingValueType | padding | CardSpacingValueType | No change |
| width | BoxProps['width'] | width | string | Simplified to string type |
| height | BoxProps['height'] | height | string | Simplified to string type |
| minHeight | BoxProps['minHeight'] | minHeight | string | Simplified to string type |
| minWidth | BoxProps['minWidth'] | minWidth | string | Simplified to string type |
| maxWidth | BoxProps['maxWidth'] | maxWidth | string | Simplified to string type |
| isSelected | boolean | isSelected | boolean | No change |
| href | string | href | string | No change |
| target | string | target | string | No change |
| rel | string | rel | string | No change |
| onClick | Function | onClick | Function | Prop-based event handler |
| onHover | Function | onHover | Function | Web only - prop-based |
| shouldScaleOnHover | boolean | shouldScaleOnHover | boolean | Deprecated but maintain |
| accessibilityLabel | string | accessibilityLabel | string | No change |
| size | 'large' \| 'medium' | size | 'large' \| 'medium' | No change |
| as | 'label' | as | 'label' | No change |
| cursor | string | cursor | string | Web only |
| testID | string | testID | string | No change |
| ...DataAnalyticsAttribute | Record<string, string> | ...rest | Record<string, string> | Spread operator |
| ...StyledPropsBlade | StyledProps | ...rest | StyledProps | Use getStyledPropsClasses |

### CardBody

| React Prop | Type | Svelte Prop | Type | Notes |
|------------|------|-------------|------|-------|
| children | React.ReactNode | children | Snippet | Use Svelte snippets |
| height | BoxProps['height'] | height | string | Simplified type |
| testID | string | testID | string | No change |
| ...DataAnalyticsAttribute | Record<string, string> | ...rest | Record<string, string> | Spread operator |

### CardHeader

| React Prop | Type | Svelte Prop | Type | Notes |
|------------|------|-------------|------|-------|
| children | React.ReactNode | children | Snippet | Use Svelte snippets |
| paddingBottom | CardSpacingValueType | paddingBottom | CardSpacingValueType | Default: 'spacing.4' |
| marginBottom | CardSpacingValueType | marginBottom | CardSpacingValueType | Default: 'spacing.4' |
| showDivider | boolean | showDivider | boolean | Default: true |
| testID | string | testID | string | No change |
| ...DataAnalyticsAttribute | Record<string, string> | ...rest | Record<string, string> | Spread operator |

### CardHeaderLeading

| React Prop | Type | Svelte Prop | Type | Notes |
|------------|------|-------------|------|-------|
| title | string | title | string | Required |
| subtitle | string | subtitle | string | Optional |
| prefix | React.ReactNode | prefix | Snippet | For CardHeaderIcon |
| suffix | React.ReactNode | suffix | Snippet | For Counter/Link |
| ...DataAnalyticsAttribute | Record<string, string> | ...rest | Record<string, string> | Spread operator |

### CardHeaderTrailing

| React Prop | Type | Svelte Prop | Type | Notes |
|------------|------|-------------|------|-------|
| visual | React.ReactNode | visual | Snippet | Any visual ornament |

### CardFooter

| React Prop | Type | Svelte Prop | Type | Notes |
|------------|------|-------------|------|-------|
| children | React.ReactNode | children | Snippet | Use Svelte snippets |
| paddingTop | CardSpacingValueType | paddingTop | CardSpacingValueType | Default: 'spacing.4' |
| marginTop | CardSpacingValueType | marginTop | CardSpacingValueType | Default: 'spacing.4' |
| showDivider | boolean | showDivider | boolean | Default: true |
| testID | string | testID | string | No change |
| ...DataAnalyticsAttribute | Record<string, string> | ...rest | Record<string, string> | Spread operator |

### CardFooterLeading

| React Prop | Type | Svelte Prop | Type | Notes |
|------------|------|-------------|------|-------|
| title | string | title | string | Optional |
| subtitle | string | subtitle | string | Optional |
| ...DataAnalyticsAttribute | Record<string, string> | ...rest | Record<string, string> | Spread operator |

### CardFooterTrailing

| React Prop | Type | Svelte Prop | Type | Notes |
|------------|------|-------------|------|-------|
| actions | { primary?: CardFooterAction; secondary?: CardFooterAction } | actions | Object | Action configuration |
| ...DataAnalyticsAttribute | Record<string, string> | ...rest | Record<string, string> | Spread operator |

## CSS Module Plan

### Files to Create

1. **card.module.css** - Base card container styles
2. **card.ts** - CVA configuration for Card root
3. **cardSurface.module.css** - Surface with elevation and border styles
4. **cardSurface.ts** - CVA for surface variants
5. **cardHeader.module.css** - Header layout and divider styles
6. **cardHeader.ts** - CVA for header
7. **cardFooter.module.css** - Footer layout (responsive) and divider styles
8. **cardFooter.ts** - CVA for footer
9. **linkOverlay.module.css** - Link overlay pattern styles
10. **linkOverlay.ts** - CVA for link overlay

### CVA Variants

#### card.ts (CardRoot styles)

```typescript
import { cva } from 'class-variance-authority';
import styles from './card.module.css';

export const cardStyles = cva(styles.card, {
  variants: {
    isSelected: {
      true: styles.selected,
      false: '',
    },
    isFocused: {
      true: styles.focused,
      false: '',
    },
    shouldScaleOnHover: {
      true: styles['scale-hover'],
      false: '',
    },
    isPressed: {
      true: styles.pressed,
      false: '',
    },
    validationState: {
      none: '',
      error: styles['validation-error'],
      success: styles['validation-success'],
    },
    isInteractive: {
      true: styles.interactive,
      false: '',
    },
    as: {
      div: '',
      label: styles.label,
    },
  },
  defaultVariants: {
    isSelected: false,
    isFocused: false,
    shouldScaleOnHover: false,
    isPressed: false,
    validationState: 'none',
    isInteractive: false,
    as: 'div',
  },
});
```

#### cardSurface.ts (Surface/Elevation styles)

```typescript
import { cva } from 'class-variance-authority';
import styles from './cardSurface.module.css';

export const cardSurfaceStyles = cva(styles.surface, {
  variants: {
    backgroundColor: {
      'surface.background.gray.intense': styles['bg-gray-intense'],
      'surface.background.gray.moderate': styles['bg-gray-moderate'],
      'surface.background.gray.subtle': styles['bg-gray-subtle'],
    },
    borderRadius: {
      medium: styles['radius-medium'],
      large: styles['radius-large'],
      xlarge: styles['radius-xlarge'],
    },
    elevation: {
      none: styles['elevation-none'],
      lowRaised: styles['elevation-low-raised'],
      midRaised: styles['elevation-mid-raised'],
      highRaised: styles['elevation-high-raised'],
    },
    padding: {
      'spacing.0': styles['padding-0'],
      'spacing.3': styles['padding-3'],
      'spacing.4': styles['padding-4'],
      'spacing.5': styles['padding-5'],
      'spacing.7': styles['padding-7'],
    },
  },
  defaultVariants: {
    backgroundColor: 'surface.background.gray.intense',
    borderRadius: 'medium',
    elevation: 'lowRaised',
    padding: 'spacing.7',
  },
});
```

#### cardHeader.ts

```typescript
import { cva } from 'class-variance-authority';
import styles from './cardHeader.module.css';

export const cardHeaderStyles = cva(styles.header, {
  variants: {
    showDivider: {
      true: styles['with-divider'],
      false: '',
    },
    paddingBottom: {
      'spacing.0': styles['pb-0'],
      'spacing.3': styles['pb-3'],
      'spacing.4': styles['pb-4'],
      'spacing.5': styles['pb-5'],
      'spacing.7': styles['pb-7'],
    },
    marginBottom: {
      'spacing.0': styles['mb-0'],
      'spacing.3': styles['mb-3'],
      'spacing.4': styles['mb-4'],
      'spacing.5': styles['mb-5'],
      'spacing.7': styles['mb-7'],
    },
  },
  defaultVariants: {
    showDivider: true,
    paddingBottom: 'spacing.4',
    marginBottom: 'spacing.4',
  },
});
```

#### cardFooter.ts

```typescript
import { cva } from 'class-variance-authority';
import styles from './cardFooter.module.css';

export const cardFooterStyles = cva(styles.footer, {
  variants: {
    showDivider: {
      true: styles['with-divider'],
      false: '',
    },
    paddingTop: {
      'spacing.0': styles['pt-0'],
      'spacing.3': styles['pt-3'],
      'spacing.4': styles['pt-4'],
      'spacing.5': styles['pt-5'],
      'spacing.7': styles['pt-7'],
    },
    marginTop: {
      'spacing.0': styles['mt-0'],
      'spacing.3': styles['mt-3'],
      'spacing.4': styles['mt-4'],
      'spacing.5': styles['mt-5'],
      'spacing.7': styles['mt-7'],
    },
    layout: {
      mobile: styles['layout-mobile'],
      desktop: styles['layout-desktop'],
    },
  },
  defaultVariants: {
    showDivider: true,
    paddingTop: 'spacing.4',
    marginTop: 'spacing.4',
    layout: 'desktop',
  },
});
```

### CSS Classes Plan

#### card.module.css

```css
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  outline: none;
  transition: transform var(--motion-duration-xquick) var(--motion-easing-standard),
              box-shadow var(--motion-duration-xquick) var(--motion-easing-standard);
}

/* Interactive states */
.interactive {
  cursor: pointer;
}

.selected {
  box-shadow: 0 0 0 var(--border-width-thicker) var(--colors-surface-border-primary-normal);
}

.focused {
  box-shadow: 
    0 0 0 var(--border-width-thicker) var(--colors-surface-border-primary-normal),
    0 0 0 4px var(--colors-surface-border-primary-muted);
}

.validation-error {
  box-shadow: 0 0 0 var(--border-width-thicker) var(--colors-interactive-border-negative-default);
}

.validation-success {
  box-shadow: 0 0 0 var(--border-width-thicker) var(--colors-interactive-border-positive-default);
}

/* Animations */
.scale-hover:hover {
  transform: scale(1.05);
}

.pressed {
  transform: scale(0.95);
}

.label {
  cursor: pointer;
}
```

#### cardSurface.module.css

```css
.surface {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Background colors */
.bg-gray-intense {
  background-color: var(--colors-surface-background-gray-intense);
}

.bg-gray-moderate {
  background-color: var(--colors-surface-background-gray-moderate);
}

.bg-gray-subtle {
  background-color: var(--colors-surface-background-gray-subtle);
}

/* Border radius */
.radius-medium {
  border-radius: var(--border-radius-medium);
}

.radius-large {
  border-radius: var(--border-radius-large);
}

.radius-xlarge {
  border-radius: var(--border-radius-xlarge);
}

/* Elevation */
.elevation-none {
  box-shadow: none;
  border: var(--border-width-thin) solid var(--colors-surface-border-gray-muted);
}

.elevation-low-raised {
  box-shadow: var(--elevation-lowRaised);
}

.elevation-mid-raised {
  box-shadow: var(--elevation-midRaised);
}

.elevation-high-raised {
  box-shadow: var(--elevation-highRaised);
}

/* Padding variants */
.padding-0 { padding: var(--spacing-0); }
.padding-3 { padding: var(--spacing-3); }
.padding-4 { padding: var(--spacing-4); }
.padding-5 { padding: var(--spacing-5); }
.padding-7 { padding: var(--spacing-7); }
```

#### cardHeader.module.css

```css
.header {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
}

.header-leading {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--spacing-4);
  flex: 1;
  min-width: 0; /* Allow text truncation */
}

.header-leading-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  flex: 1;
  min-width: 0;
}

.header-trailing {
  display: flex;
  align-items: flex-start;
  margin-left: var(--spacing-4);
}

.with-divider {
  border-bottom: var(--border-width-thin) solid var(--colors-surface-border-gray-muted);
}

/* Spacing variants */
.pb-0 { padding-bottom: var(--spacing-0); }
.pb-3 { padding-bottom: var(--spacing-3); }
.pb-4 { padding-bottom: var(--spacing-4); }
.pb-5 { padding-bottom: var(--spacing-5); }
.pb-7 { padding-bottom: var(--spacing-7); }

.mb-0 { margin-bottom: var(--spacing-0); }
.mb-3 { margin-bottom: var(--spacing-3); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-5 { margin-bottom: var(--spacing-5); }
.mb-7 { margin-bottom: var(--spacing-7); }
```

#### cardFooter.module.css

```css
.footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.layout-desktop {
  flex-direction: row;
}

.layout-mobile {
  flex-direction: column;
  align-items: stretch;
}

.footer-leading {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  flex: 1;
  min-width: 0;
}

.footer-trailing {
  display: flex;
  gap: var(--spacing-3);
}

.layout-mobile .footer-trailing {
  flex-direction: column;
  width: 100%;
}

.layout-desktop .footer-trailing {
  flex-direction: row;
  align-items: center;
  margin-left: auto;
}

.with-divider {
  border-top: var(--border-width-thin) solid var(--colors-surface-border-gray-muted);
}

/* Spacing variants */
.pt-0 { padding-top: var(--spacing-0); }
.pt-3 { padding-top: var(--spacing-3); }
.pt-4 { padding-top: var(--spacing-4); }
.pt-5 { padding-top: var(--spacing-5); }
.pt-7 { padding-top: var(--spacing-7); }

.mt-0 { margin-top: var(--spacing-0); }
.mt-3 { margin-top: var(--spacing-3); }
.mt-4 { margin-top: var(--spacing-4); }
.mt-5 { margin-top: var(--spacing-5); }
.mt-7 { margin-top: var(--spacing-7); }
```

#### linkOverlay.module.css

```css
.link-overlay {
  position: static;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.link-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  pointer-events: auto;
}

/* Nested interactive elements should be above overlay */
.link-overlay ~ * {
  position: relative;
  z-index: 2;
}

.link-overlay-button {
  all: unset;
  position: static;
  cursor: pointer;
}

.link-overlay-button::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  pointer-events: auto;
}
```

## Utilities Plan

### Utilities to Add/Check in blade-core

1. **getStyledPropsClasses** - Already exists in blade-core/utils/styledProps
   - Location: `packages/blade-core/src/utils/styledProps/getStyledPropsClasses.ts`
   - Usage: Convert styled props to CSS classes

2. **makeAccessible** - Already exists in blade-core/utils/makeAccessible
   - Location: `packages/blade-core/src/utils/makeAccessible`
   - Usage: Generate accessibility attributes

3. **makeAnalyticsAttribute** - Already exists in blade-core/utils/makeAnalyticsAttribute
   - Location: `packages/blade-core/src/utils/makeAnalyticsAttribute`
   - Usage: Generate data-analytics attributes

4. **metaAttribute** - Already exists in blade-core/utils/metaAttribute
   - Location: `packages/blade-core/src/utils/metaAttribute`
   - Usage: Add component metadata and testID

5. **useIsMobile** - Need to create or check if exists
   - Location: `packages/blade-core/src/utils/responsive` (to be created)
   - Usage: Detect mobile viewport for responsive footer layout
   - **Action**: Check if exists, if not create as a Svelte-compatible utility

### Existing Utilities to Use

- **getStyledPropsClasses**: Extract margin, position, grid, etc. from rest props
- **makeAccessible**: Generate aria-label, role, etc.
- **makeAnalyticsAttribute**: Extract and format data-analytics-* attributes
- **metaAttribute**: Add data-blade-component and testID
- **MetaConstants**: Constants for component names

## Compound Components Plan

### Structure

```
Card (Root Container)
├── CardContext (Provides size to children)
├── CardSurface (Background, elevation, border radius)
├── LinkOverlay (Optional - if href or onClick)
├── CardHeader (Optional)
│   ├── CardHeaderLeading (Required if header exists)
│   │   ├── prefix: CardHeaderIcon (Optional)
│   │   ├── title + subtitle (Required)
│   │   └── suffix: CardHeaderCounter | CardHeaderLink (Optional)
│   └── CardHeaderTrailing (Optional)
│       └── visual: CardHeaderBadge | CardHeaderText | CardHeaderAmount | CardHeaderIconButton
├── CardBody (Required)
│   └── Any content (slots/snippets)
└── CardFooter (Optional)
    ├── CardFooterLeading (Optional)
    │   ├── title (Optional)
    │   └── subtitle (Optional)
    └── CardFooterTrailing (Optional)
        └── actions: { primary, secondary } (Optional)
```

### Context System

**CardContext.ts:**

```typescript
import { getContext, setContext } from 'svelte';

type CardContextType = {
  size: 'large' | 'medium';
};

const CARD_CONTEXT_KEY = Symbol('card-context');

export function setCardContext(context: CardContextType): void {
  setContext(CARD_CONTEXT_KEY, context);
}

export function getCardContext(): CardContextType | undefined {
  return getContext(CARD_CONTEXT_KEY);
}

export function useVerifyInsideCard(componentName: string): void {
  const context = getCardContext();
  if (!context) {
    if (import.meta.env.DEV) {
      console.error(`[Blade: ${componentName}]: ${componentName} must be used inside Card component.`);
    }
  }
}
```

### Component Validation

- Use Svelte's `$effect` or component mounting to validate hierarchy
- Check context existence for compound components
- Development-only warnings (check `import.meta.env.DEV`)
- No runtime validation in production

## Dependency Components

### Components Used

1. **Text** - ✅ Migrated (used for titles, subtitles, descriptions)
2. **Heading** - ✅ Migrated (used for header title)
3. **Badge** - ✅ Migrated (CardHeaderBadge)
4. **Counter** - ✅ Migrated (CardHeaderCounter)
5. **Amount** - ✅ Migrated (CardHeaderAmount)
6. **Button** - ✅ Migrated (footer actions, CardHeaderIconButton)
7. **Link** - ✅ Migrated (CardHeaderLink, LinkOverlay)
8. **Divider** - ⚠️ Needs check (header/footer dividers - might need migration)
9. **Icon** - ⚠️ Needs check (CardHeaderIcon wrapper)
10. **Box/BaseBox** - ⚠️ May not be needed (use CSS classes instead)

### Migration Order

Since most dependencies are already migrated, we can proceed with:

1. **Phase 1**: Check if Divider is migrated, if not use simple border via CSS
2. **Phase 2**: Implement core Card components (Card, CardBody, CardSurface, CardRoot)
3. **Phase 3**: Implement CardHeader and CardFooter
4. **Phase 4**: Implement nested components (Icon, Counter, Badge wrappers)
5. **Phase 5**: Implement LinkOverlay and interactions

## Event Handlers Plan

| React Handler | Svelte Implementation | Notes |
|---------------|----------------------|-------|
| onClick | Prop-based: `onClick?: (event: MouseEvent) => void` | Pass function as prop, don't use `on:click` directive |
| onHover | Prop-based: `onHover?: () => void` | Triggered via `onmouseenter` on Card root |
| onFocus | Internal: `onfocus` handler | Manage focus state for focus ring |
| onBlur | Internal: `onblur` handler | Remove focus state |
| onTouchStart | Internal: `ontouchstart` handler | Mobile press state |
| onTouchEnd | Internal: `ontouchend` handler | Mobile press state |
| onMouseDown | Internal: `onmousedown` handler | Desktop press state |
| onMouseUp | Internal: `onmouseup` handler | Desktop press state |

**Implementation Pattern:**

```svelte
<script lang="ts">
  let { onClick, onHover, ...rest }: CardProps = $props();
  let isFocused = $state(false);
  let isPressed = $state(false);
  
  function handleClick(event: MouseEvent): void {
    if (onClick) {
      onClick(event);
    }
  }
  
  function handleMouseEnter(): void {
    if (onHover) {
      onHover();
    }
  }
  
  function handleFocus(): void {
    isFocused = true;
  }
  
  function handleBlur(): void {
    isFocused = false;
  }
</script>

<div
  role={href ? 'link' : onClick ? 'button' : undefined}
  tabindex={onClick || href ? 0 : undefined}
  onclick={handleClick}
  onmouseenter={handleMouseEnter}
  onfocus={handleFocus}
  onblur={handleBlur}
>
  <!-- content -->
</div>
```

## Migration Tasks Checklist

### Task 1: Setup Component Structure

- [ ] Create `Card/` directory in blade-svelte/src/components
- [ ] Create `Card/` directory in blade-core/src/styles
- [ ] Create types.ts with all prop interfaces
- [ ] Create constants.ts with component IDs and animation constants
- [ ] Create CardContext.ts with Svelte context utilities
- [ ] Create index.ts for public exports

### Task 2: Create CSS Modules in blade-core

- [ ] Create card.module.css with base card styles
- [ ] Create card.ts with CVA config for Card root
- [ ] Create cardSurface.module.css with elevation and background styles
- [ ] Create cardSurface.ts with CVA config for surface
- [ ] Create cardHeader.module.css with header layout styles
- [ ] Create cardHeader.ts with CVA config for header
- [ ] Create cardFooter.module.css with responsive footer styles
- [ ] Create cardFooter.ts with CVA config for footer
- [ ] Create linkOverlay.module.css with overlay pattern styles
- [ ] Create linkOverlay.ts with CVA config
- [ ] Add all card styles to blade-core/src/styles/index.ts

### Task 3: Implement Core Components

- [ ] Implement CardRoot.svelte (interactive container)
- [ ] Implement CardSurface.svelte (background/elevation wrapper)
- [ ] Implement CardBody.svelte (content container)
- [ ] Implement LinkOverlay.svelte (link overlay pattern)
- [ ] Implement Card.svelte (main wrapper with context)
- [ ] Test basic card rendering with elevation and background

### Task 4: Implement CardHeader

- [ ] Implement CardHeader.svelte (header container with divider)
- [ ] Implement CardHeaderLeading.svelte (title/subtitle section)
- [ ] Implement CardHeaderTrailing.svelte (visual section)
- [ ] Test header layout and divider
- [ ] Test size context passing to title

### Task 5: Implement CardFooter

- [ ] Implement CardFooter.svelte (footer container with divider)
- [ ] Implement CardFooterLeading.svelte (title/subtitle section)
- [ ] Implement CardFooterTrailing.svelte (actions section)
- [ ] Test footer responsive layout (mobile/desktop)
- [ ] Test action buttons rendering

### Task 6: Implement Nested Components

- [ ] Implement CardHeaderIcon.svelte (icon wrapper)
- [ ] Implement CardHeaderCounter.svelte (counter pass-through)
- [ ] Implement CardHeaderBadge.svelte (badge pass-through)
- [ ] Implement CardHeaderAmount.svelte (amount pass-through)
- [ ] Implement CardHeaderText.svelte (text pass-through)
- [ ] Implement CardHeaderLink.svelte (link pass-through)
- [ ] Implement CardHeaderIconButton.svelte (icon button wrapper)
- [ ] Test all nested components in header

### Task 7: Implement Interactions

- [ ] Add onClick handler support
- [ ] Add onHover handler support
- [ ] Add href support with LinkOverlay
- [ ] Add focus state management and focus ring
- [ ] Add press state animations (scale down)
- [ ] Add shouldScaleOnHover support (deprecated)
- [ ] Test keyboard navigation and accessibility

### Task 8: Add Advanced Features

- [ ] Add isSelected prop with border highlight
- [ ] Add validation state support (error/success borders)
- [ ] Add as="label" support for form integration
- [ ] Add cursor prop support
- [ ] Test with checkbox/radio group context (if needed)

### Task 9: StyledPropsBlade Support

- [ ] Use getStyledPropsClasses for margin/position props
- [ ] Test margin variants
- [ ] Test position variants
- [ ] Test responsive styled props

### Task 10: Context Validation

- [ ] Add context checks for all compound components
- [ ] Add development warnings for improper usage
- [ ] Test validation in dev mode
- [ ] Ensure no runtime overhead in production

### Task 11: Accessibility

- [ ] Add proper ARIA roles (link/button)
- [ ] Add accessibilityLabel support
- [ ] Add keyboard navigation (Enter/Space)
- [ ] Add focus management
- [ ] Test with screen readers

### Task 12: Testing & Stories

- [ ] Create Card.stories.svelte with basic variants
- [ ] Add elevation variants to stories
- [ ] Add background color variants to stories
- [ ] Add border radius variants to stories
- [ ] Add interactive card stories (href, onClick)
- [ ] Add selected state stories
- [ ] Add header variants (with/without icon, counter, etc.)
- [ ] Add footer variants (actions, leading/trailing)
- [ ] Add validation state stories
- [ ] Add as="label" stories
- [ ] Add complex nested examples
- [ ] Add responsive layout examples

### Task 13: Documentation & Export

- [ ] Update blade-svelte/src/components/index.ts with Card exports
- [ ] Export all compound components
- [ ] Export types
- [ ] Add JSDoc comments to props
- [ ] Create migration notes for React to Svelte users

## Known Challenges

### 1. Compound Component Validation
**Challenge:** React uses `useVerifyAllowedChildren` hook to validate component hierarchy at runtime. Svelte doesn't have equivalent Children API.

**Solution:** Use context-based validation with development-only warnings. Accept that validation won't be as strict as React version.

### 2. Link Overlay Pattern
**Challenge:** Link overlay uses CSS pseudo-elements (::before) which need to work with Svelte's scoped styles.

**Solution:** Keep styles in CSS modules (not scoped) to ensure ::before works properly. Add z-index management for nested interactive elements.

### 3. Responsive Footer Layout
**Challenge:** Footer changes layout based on viewport size (mobile vs desktop).

**Solution:** Create utility to detect mobile viewport or use CSS media queries with layout classes. Prefer CSS-only solution if possible.

### 4. Animation States (Hover, Press)
**Challenge:** Managing multiple animation states (hover, press, focus) without React state.

**Solution:** Use Svelte's reactive state ($state) for press and focus. Hover can be pure CSS. Coordinate states carefully to avoid conflicts.

### 5. Platform-Specific Code
**Challenge:** React Card has separate web/native implementations. Svelte version is web-only.

**Solution:** Implement web-only version. Skip native-specific features (react-native-reanimated, Pressable, etc.).

### 6. forwardRef Pattern
**Challenge:** React uses forwardRef to expose card element ref.

**Solution:** Svelte's `bind:this` is simpler. Export ref as prop or use `$bindable()` rune.

### 7. Context for Form Integration
**Challenge:** Card reads CheckboxGroupContext and RadioGroupContext for validation states.

**Solution:** Defer form integration to later phase. Focus on standalone card first. Can add context reading later if needed.

### 8. Component ID Assignment
**Challenge:** React uses `assignWithoutSideEffects` to add component IDs for validation.

**Solution:** Skip component ID system. Use context-based validation instead.

### 9. Dynamic Children Validation
**Challenge:** Validating that CardHeader only contains CardHeaderLeading/Trailing.

**Solution:** Document proper usage. Add development warnings when context is missing. Don't enforce at runtime.

### 10. StyledPropsBlade Complexity
**Challenge:** StyledPropsBlade includes responsive props and many layout options.

**Solution:** Use existing `getStyledPropsClasses` utility from blade-core. Test thoroughly with margin and position props.

## Approval Required For

### 1. Divider Component Migration
**Question:** CardHeader and CardFooter use Divider component for borders. Is Divider migrated to Svelte?

**Options:**
- A) If yes, use the migrated Divider component
- B) If no, use simple border via CSS (border-bottom/border-top)

**Recommendation:** Option B - Use CSS borders to keep it simple

### 2. Mobile Detection Utility
**Question:** How should we detect mobile viewport for responsive footer?

**Options:**
- A) Create JS utility using `window.matchMedia` and Svelte store
- B) Use pure CSS with media queries and multiple layout classes
- C) Use both - JS for component logic, CSS for visual layout

**Recommendation:** Option B - Pure CSS with media queries

### 3. Icon Component Handling
**Question:** CardHeaderIcon wraps Icon component. How to handle icons?

**Options:**
- A) Assume Icon component is migrated, import and use it
- B) Accept icon as snippet and let user pass any icon
- C) Create lightweight icon wrapper

**Recommendation:** Option B - Accept icon as snippet (most flexible)

### 4. Form Integration Depth
**Question:** Should we implement CheckboxGroup/RadioGroup validation integration?

**Options:**
- A) Yes, implement full form integration from the start
- B) No, defer to later phase, focus on standalone card first
- C) Create placeholder for future integration

**Recommendation:** Option B - Defer form integration, implement standalone first

### 5. Ref Exposure
**Question:** Should Card expose element ref like React version?

**Options:**
- A) Yes, expose ref using `$bindable()` rune
- B) No, let users use `bind:this` directly on Card component
- C) Export ref but document that users should use bind:this

**Recommendation:** Option B - Users can bind:this directly on Card

### 6. Animation Deprecation
**Question:** `shouldScaleOnHover` is deprecated in React. Should we implement it?

**Options:**
- A) Yes, implement for backward compatibility
- B) No, skip deprecated feature
- C) Document that users should use motion presets instead

**Recommendation:** Option A - Implement for compatibility, add deprecation warning

### 7. Testing Approach
**Question:** What level of testing is needed?

**Options:**
- A) Storybook stories only (visual testing)
- B) Stories + unit tests with Vitest
- C) Stories + unit tests + E2E tests

**Recommendation:** Option A - Storybook stories (consistent with current pattern)

### 8. Export Structure
**Question:** How should compound components be exported?

**Options:**
- A) Export all from Card/index.ts: `export { Card, CardHeader, CardBody, ... }`
- B) Named exports from main index: `export { Card } from './Card/Card.svelte'`
- C) Both - re-export from component index and main index

**Recommendation:** Option C - Both for maximum flexibility

## Notes

- Focus on web-only implementation (no React Native)
- Maintain API consistency with React version where possible
- Use CSS modules + CVA for all styling (no inline styles)
- Leverage existing blade-core utilities
- Follow WISIWYG philosophy (compound components structure)
- Development-only validation (no runtime overhead in production)
- Defer form integration and advanced features to later phase
- Prioritize core functionality and common use cases first

---

## Plan Review

### Review Date
January 9, 2026

### Review Status
✅ Approved

### Guideline Compliance

| Guideline | Status | Notes |
|-----------|--------|-------|
| Directory structure follows PascalCase | ✅ | All component directories (Card, CardHeader, CardFooter) follow PascalCase naming convention |
| CSS modules in blade-core | ✅ | All CSS modules properly placed in `packages/blade-core/src/styles/Card/` with correct naming |
| CVA used for variants | ✅ | Comprehensive CVA configuration for card.ts, cardSurface.ts, cardHeader.ts, cardFooter.ts with appropriate variants |
| No inline styles | ✅ | All styles use CSS classes via CSS modules; no inline styles planned |
| Utilities in blade-core | ✅ | Plan correctly identifies existing utilities (getStyledPropsClasses, makeAccessible, makeAnalyticsAttribute, metaAttribute) from blade-core |
| Props consistency | ✅ | Detailed props mapping table shows 1:1 consistency with React component; only type simplifications where appropriate (e.g., BoxProps['width'] → string) |
| Prop-based event handlers | ✅ | onClick and onHover implemented as props with function signatures; no createEventDispatcher usage |
| Compound components structure | ✅ | Proper compound component hierarchy with CardContext using Svelte's getContext/setContext pattern |

### Issues Found

None critical. Minor observations:

1. **Mobile detection utility (useIsMobile)** - Marked as "to be created", but recommendation suggests using pure CSS media queries which is the better approach
2. **Divider component** - Listed as "⚠️ Needs check" but recommendation correctly suggests using CSS borders instead
3. **Icon component** - Listed as "⚠️ Needs check" but recommendation correctly suggests accepting icon as snippet

### Recommendations

1. **Mobile Footer Layout**: Stick with pure CSS media queries (Option B from Approval section) - this avoids JS overhead and follows responsive design best practices. Use `.layout-mobile` and `.layout-desktop` classes with media queries.

2. **Divider Implementation**: Use CSS borders (Option B) - Already correctly planned in cardHeader.module.css and cardFooter.module.css with `.with-divider` classes.

3. **Icon Handling**: Accept icon as snippet (Option B) - Most flexible approach that doesn't require Icon component migration.

4. **Form Integration**: Defer to later phase (Option B) - Focus on standalone card functionality first, add CheckboxGroup/RadioGroup integration later if needed.

5. **Ref Exposure**: Let users use `bind:this` directly (Option B) - Simpler and more Svelte-idiomatic than exposing ref prop.

6. **shouldScaleOnHover**: Implement with deprecation warning (Option A) - Important for backward compatibility during migration period.

7. **Testing**: Start with Storybook stories only (Option A) - Consistent with current Blade Svelte pattern.

8. **CSS Class Organization**: Consider grouping spacing utility classes (padding-0 through padding-7, margin variants) in a shared utilities file to avoid duplication across card components.

9. **LinkOverlay Pattern**: The CSS pseudo-element approach is correct. Ensure z-index management is well-documented in comments for nested interactive elements.

10. **Context Validation**: The planned `useVerifyInsideCard` function is good for development warnings. Document that this is development-only and won't affect production bundle size.

### Approval Items

All items from "Approval Required For" section have clear recommendations that align with Blade Svelte guidelines:

1. ✅ Divider: Use CSS borders
2. ✅ Mobile Detection: Pure CSS with media queries  
3. ✅ Icon Component: Accept as snippet
4. ✅ Form Integration: Defer to later phase
5. ✅ Ref Exposure: Use bind:this pattern
6. ✅ Animation Deprecation: Implement shouldScaleOnHover with warning
7. ✅ Testing: Storybook stories initially
8. ✅ Export Structure: Both component index and main index (Option C)

### Final Verdict

**✅ Approved to proceed with implementation**

This migration plan is comprehensive, well-structured, and fully compliant with Blade Svelte guidelines. The plan demonstrates:

- **Strong adherence to conventions**: Directory structure, naming, CSS modules placement, and CVA usage all follow established patterns
- **API consistency**: Props mapping maintains consistency with React version while making appropriate Svelte-specific adaptations
- **Proper styling approach**: All styles through CSS classes, no inline styles, comprehensive CVA variants
- **Correct event handling**: Prop-based handlers instead of createEventDispatcher
- **Good architectural decisions**: Context-based compound components, utilities in blade-core, development-only validations

**Complexity Assessment**: High complexity is appropriate given 17+ compound components, multiple interaction states, responsive layouts, and link overlay pattern.

**Estimated Timeline**: 3-4 days is reasonable for full implementation including all compound components, styles, interactions, accessibility features, and Storybook stories.

**Next Steps**:
1. Proceed with Task 1 (Setup Component Structure)
2. Follow the planned task order which logically builds from core to advanced features
3. Implement recommended approaches for the approval items (CSS borders for dividers, pure CSS for responsive layout, etc.)
4. Use the provided CVA configurations and CSS class structures as blueprint
5. Test incrementally after each task phase
