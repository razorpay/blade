# Migration Changelog: Card

## Metadata

- Component Name: Card
- Migration Date: January 9, 2026
- Status: ✅ Complete

## Files Created

### Svelte Component Files

- `packages/blade-svelte/src/components/Card/Card.svelte`: Main Card component wrapper with context provider
- `packages/blade-svelte/src/components/Card/CardBody.svelte`: Card body container for content
- `packages/blade-svelte/src/components/Card/CardRoot.svelte`: Root container handling interactive states and styling
- `packages/blade-svelte/src/components/Card/CardSurface.svelte`: Surface component managing background, elevation, and border radius
- `packages/blade-svelte/src/components/Card/LinkOverlay.svelte`: Link overlay pattern for clickable cards
- `packages/blade-svelte/src/components/Card/CardHeader/CardHeader.svelte`: Header container with divider support
- `packages/blade-svelte/src/components/Card/CardHeader/CardHeaderLeading.svelte`: Leading section with title/subtitle and prefix/suffix
- `packages/blade-svelte/src/components/Card/CardHeader/CardHeaderTrailing.svelte`: Trailing section for visual ornaments
- `packages/blade-svelte/src/components/Card/CardFooter/CardFooter.svelte`: Footer container with responsive layout
- `packages/blade-svelte/src/components/Card/CardFooter/CardFooterLeading.svelte`: Leading section with title/subtitle
- `packages/blade-svelte/src/components/Card/CardFooter/CardFooterTrailing.svelte`: Trailing section with action buttons
- `packages/blade-svelte/src/components/Card/types.ts`: TypeScript type definitions for all Card components
- `packages/blade-svelte/src/components/Card/constants.ts`: Constants including component IDs and scale values
- `packages/blade-svelte/src/components/Card/CardContext.ts`: Svelte context for size management and validation
- `packages/blade-svelte/src/components/Card/index.ts`: Public exports
- `packages/blade-svelte/src/components/Card/Card.stories.svelte`: Storybook stories for testing

### CSS Module Files

- `packages/blade-core/src/styles/Card/card.module.css`: Base card styles with interactive states and animations
- `packages/blade-core/src/styles/Card/card.ts`: CVA configuration for Card root with 7 variant types
- `packages/blade-core/src/styles/Card/cardSurface.module.css`: Surface styles for background, elevation, border radius, and padding
- `packages/blade-core/src/styles/Card/cardSurface.ts`: CVA configuration for CardSurface with 4 variant categories
- `packages/blade-core/src/styles/Card/cardHeader.module.css`: Header layout and divider styles
- `packages/blade-core/src/styles/Card/cardHeader.ts`: CVA configuration for CardHeader with spacing and divider variants
- `packages/blade-core/src/styles/Card/cardFooter.module.css`: Footer responsive layout and divider styles
- `packages/blade-core/src/styles/Card/cardFooter.ts`: CVA configuration for CardFooter with layout and spacing variants
- `packages/blade-core/src/styles/Card/linkOverlay.module.css`: Link overlay pattern styles with z-index management
- `packages/blade-core/src/styles/Card/linkOverlay.ts`: CVA configuration for LinkOverlay

### Utility Files

No new utility files were added. The migration uses existing utilities from blade-core:
- `getStyledPropsClasses` - for margin/position props support
- `makeAccessible` - for accessibility attributes
- `makeAnalyticsAttribute` - for data-analytics attributes
- `metaAttribute` - for component metadata and testID

## Implementation Summary

### Props Implemented

**Card Component:**
- `children` (Snippet)
- `backgroundColor` ('surface.background.gray.intense' | 'moderate' | 'subtle')
- `borderRadius` ('medium' | 'large' | 'xlarge')
- `elevation` ('none' | 'lowRaised' | 'midRaised' | 'highRaised')
- `padding` (CardSpacingValueType)
- `width`, `height`, `minHeight`, `minWidth`, `maxWidth` (string)
- `isSelected` (boolean)
- `href`, `target`, `rel` (string)
- `accessibilityLabel` (string)
- `shouldScaleOnHover` (boolean, deprecated)
- `onHover` (function)
- `size` ('large' | 'medium')
- `onClick` (function)
- `as` ('label')
- `cursor` (string)
- `testID` (string)
- `...DataAnalyticsAttribute`
- `...StyledPropsBlade`

**CardBody:**
- `children` (Snippet)
- `height` (string)
- `testID` (string)
- `...DataAnalyticsAttribute`

**CardHeader:**
- `children` (Snippet)
- `paddingBottom`, `marginBottom` (CardSpacingValueType)
- `showDivider` (boolean, default: true)
- `testID` (string)
- `...DataAnalyticsAttribute`

**CardHeaderLeading:**
- `title` (string, required)
- `subtitle` (string)
- `prefix`, `suffix` (Snippet)
- `...DataAnalyticsAttribute`

**CardHeaderTrailing:**
- `visual` (Snippet)

**CardFooter:**
- `children` (Snippet)
- `paddingTop`, `marginTop` (CardSpacingValueType)
- `showDivider` (boolean, default: true)
- `testID` (string)
- `...DataAnalyticsAttribute`

**CardFooterLeading:**
- `title`, `subtitle` (string)
- `...DataAnalyticsAttribute`

**CardFooterTrailing:**
- `actions` (object with primary/secondary CardFooterAction)
- `...DataAnalyticsAttribute`

### CSS Classes Created

**card.module.css:**
- `.card` - Base card container with flexbox and transitions
- `.interactive` - Cursor pointer for interactive cards
- `.selected` - Border highlight for selected state
- `.focused` - Focus ring with double border
- `.validation-error` - Error state border
- `.validation-success` - Success state border
- `.scale-hover` - Hover scale animation
- `.pressed` - Press scale animation
- `.label` - Cursor for label element

**cardSurface.module.css:**
- `.surface` - Base surface container
- `.bg-gray-intense`, `.bg-gray-moderate`, `.bg-gray-subtle` - Background colors
- `.radius-medium`, `.radius-large`, `.radius-xlarge` - Border radius variants
- `.elevation-none`, `.elevation-low-raised`, `.elevation-mid-raised`, `.elevation-high-raised` - Elevation shadows
- `.padding-0` through `.padding-7` - Padding variants

**cardHeader.module.css:**
- `.header` - Header flex container
- `.header-leading` - Leading section layout
- `.header-leading-content` - Content wrapper
- `.header-leading-title-row` - Title row flex container
- `.header-trailing` - Trailing section
- `.with-divider` - Bottom border for divider
- `.pb-0` through `.pb-7`, `.mb-0` through `.mb-7` - Spacing variants

**cardFooter.module.css:**
- `.footer` - Footer flex container
- `.layout-desktop`, `.layout-mobile` - Responsive layout classes
- `.footer-leading` - Leading section layout
- `.footer-trailing` - Trailing actions section
- `.with-divider` - Top border for divider
- `.pt-0` through `.pt-7`, `.mt-0` through `.mt-7` - Spacing variants

**linkOverlay.module.css:**
- `.link-overlay` - Base overlay for links
- `.link-overlay::before` - Pseudo-element covering entire card
- `.link-overlay ~ *` - Z-index for nested elements
- `.link-overlay-button` - Button variant of overlay

### CVA Variants Configured

**card.ts:**
```typescript
{
  variants: {
    isSelected: { true, false },
    isFocused: { true, false },
    shouldScaleOnHover: { true, false },
    isPressed: { true, false },
    validationState: { none, error, success },
    isInteractive: { true, false },
    as: { div, label }
  }
}
```

**cardSurface.ts:**
```typescript
{
  variants: {
    backgroundColor: { 'surface.background.gray.intense', 'moderate', 'subtle' },
    borderRadius: { medium, large, xlarge },
    elevation: { none, lowRaised, midRaised, highRaised },
    padding: { 'spacing.0', 'spacing.3', 'spacing.4', 'spacing.5', 'spacing.7' }
  }
}
```

**cardHeader.ts:**
```typescript
{
  variants: {
    showDivider: { true, false },
    paddingBottom: { 'spacing.0' through 'spacing.7' },
    marginBottom: { 'spacing.0' through 'spacing.7' }
  }
}
```

**cardFooter.ts:**
```typescript
{
  variants: {
    showDivider: { true, false },
    paddingTop: { 'spacing.0' through 'spacing.7' },
    marginTop: { 'spacing.0' through 'spacing.7' },
    layout: { mobile, desktop }
  }
}
```

**linkOverlay.ts:**
```typescript
{
  variants: {
    as: { a, button }
  }
}
```

### Event Handlers Implemented

- `onClick` - Prop-based handler for card clicks
- `onHover` - Prop-based handler for card hover (mouseenter)
- Internal handlers for focus/blur state management
- Internal handlers for press state (mousedown/mouseup, touchstart/touchend)
- CardFooterTrailing action button onClick handlers

### Compound Components

Created complete compound component structure:
- **Card** - Root wrapper with context provider
- **CardBody** - Content container
- **CardHeader** - Header with leading/trailing sections
  - CardHeaderLeading - Title/subtitle with prefix/suffix snippets
  - CardHeaderTrailing - Visual ornament section
- **CardFooter** - Footer with leading/trailing sections
  - CardFooterLeading - Title/subtitle section
  - CardFooterTrailing - Action buttons section

## Code Quality Checklist

- [x] No inline styles used (except for dynamic dimensions)
- [x] All styles use CSS classes
- [x] CVA used for variants
- [x] Props consistent with React version
- [x] Prop-based event handlers (no createEventDispatcher)
- [x] TypeScript types defined
- [x] PascalCase naming conventions
- [x] Utilities in blade-core
- [x] Compound components structure correct
- [x] Context-based validation implemented
- [x] Development-only warnings

## Deviations from Plan

1. **Mobile Detection**: Used pure CSS with media queries in component-level `<style>` blocks instead of creating a JS-based utility. This is more performant and simpler.

2. **Divider**: Used CSS borders directly instead of importing Divider component. Implemented via `.with-divider` class with border-bottom/border-top.

3. **Nested wrapper components**: Did not create CardHeaderIcon, CardHeaderBadge, CardHeaderCounter, etc. as separate wrapper components. Users can pass these directly as snippets in prefix/suffix/visual props. This is more flexible and Svelte-idiomatic.

4. **Icon handling**: Icons are passed as snippets rather than requiring specific Icon component migration. This allows users to pass any icon implementation.

5. **Inline dimension styles**: Used inline styles for width/height/minHeight/etc. instead of CSS classes since these are dynamic user-provided values. This is acceptable per Blade guidelines for dynamic properties.

## Challenges Encountered

1. **Snippet syntax complexity**: Svelte's snippet syntax requires nested `{#snippet}` blocks which made the component structure more verbose than React. Resolved by creating clear examples in stories.

2. **$bindable for LinkOverlay**: Used `$bindable` rune for `isPressed` state to allow parent Card component to manage press state. This required careful state synchronization.

3. **CardFooter button integration**: Had to properly integrate Button component props into CardFooterTrailing. Resolved by destructuring CardFooterAction props and passing them to Button.

4. **CSS module imports**: Had to import both the CVA function and raw CSS module classes for complex layout classes. Used pattern: `import styles from '@razorpay/blade-core/styles/Card/cardHeader.module.css'` for direct class access.

5. **Text component import**: Had to ensure Text component was imported correctly for CardHeaderLeading and CardFooterLeading. Used relative imports from Typography folder.

## Dependencies

### Components Used
- **Text**: `packages/blade-svelte/src/components/Typography/Text/Text.svelte` - Used in CardHeaderLeading, CardFooterLeading
- **Button**: `packages/blade-svelte/src/components/Button/Button.svelte` - Used in CardFooterTrailing for actions
- **Badge**: `packages/blade-svelte/src/components/Badge/Badge.svelte` - Used in stories for examples

### Utilities Used
- **getStyledPropsClasses**: `@razorpay/blade-core/utils` - For margin/position props
- **makeAccessible**: `@razorpay/blade-core/utils` - For accessibility attributes
- **makeAnalyticsAttribute**: `@razorpay/blade-core/utils` - For data-analytics attributes
- **metaAttribute**: `@razorpay/blade-core/utils` - For component metadata and testID

## Next Steps

1. **Test all stories** in Storybook to validate rendering and interactions
2. **Test prop combinations** including all elevation, background, border radius variants
3. **Test responsive layout** for CardFooter on mobile viewports
4. **Test interactive states** - onClick, href, hover, focus, press
5. **Test accessibility** - keyboard navigation, screen reader support
6. **Validate context system** - ensure child components verify parent context correctly
7. **Add advanced examples** to stories:
   - Card with form elements (as="label")
   - Card with complex header (prefix icon, suffix counter)
   - Card with validation states
   - Card with custom dimensions
   - Card with shouldScaleOnHover (deprecated)

## Notes

- **Web-only implementation**: This is a web-only migration. React Native-specific features were intentionally omitted.
- **Deprecation warning**: `shouldScaleOnHover` prop is implemented for backward compatibility but is deprecated. Users should migrate to motion presets.
- **Form integration**: CheckboxGroup and RadioGroup validation integration was deferred to a later phase as per plan recommendations.
- **Ref exposure**: Users can use Svelte's `bind:this` directly on Card component rather than exposing a ref prop.
- **Performance**: Pure CSS approach for responsive layout and hover effects ensures optimal performance without JS overhead.
- **Flexibility**: Using snippets for prefix/suffix/visual props provides maximum flexibility for users to pass any content.

## Migration Statistics

- **Total Files Created**: 26 files (16 Svelte components, 10 CSS/TS style files)
- **Total Props Migrated**: 40+ props across all components
- **CSS Classes Created**: 60+ classes across 5 CSS modules
- **CVA Variants**: 18 variant types across 5 CVA configurations
- **Lines of Code**: ~1200 lines (estimated)
- **Migration Time**: Completed in single session as planned
- **Complexity Level**: High (as estimated in plan)
