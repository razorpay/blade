## Component Name

Heading

## Description

Heading renders page and section titles with Blade heading typography. Each `size` maps to a semantic tag automatically (`small` → h6, `medium` → h5, `large` → h4, `xlarge` → h3, `2xlarge` → h2), and `as` overrides the tag when the visual size and the document outline differ. `weight`, `color` and text props adjust the style, and `as="span"` nests Headings for inline color changes.

## Important Constraints

- `as` only accepts `span`, `h1`, `h2`, `h3`, `h4`, `h5` and `h6`; other values log an error.
- Setting `styleOverride.root` switches the heading color to `currentColor`, so the override class must set `color`.
- Only `data-analytics-*` attributes reach the DOM besides the documented props; `id`, `aria-*` and other HTML attributes are not supported.
- `textDecorationLine="dotted"` from React Blade is not supported.

## TypeScript Types

These are the props the Heading component accepts; defaults are `size="small"`, `weight="semibold"` and `color="surface.text.gray.normal"`, and the tag follows `size` unless `as` is set.

```typescript
type HeadingAs = 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Text color tokens, e.g. 'surface.text.gray.normal', 'surface.text.primary.normal',
 * 'feedback.text.information.intense'. See Tokens.md for the full list.
 */
type TextColors =
  | `interactive.text.${string}`
  | `surface.text.${string}`
  | `feedback.text.${string}`;

type HeadingSlot = 'root';

type HeadingProps = {
  as?: HeadingAs;
  /**
   * Overrides the color of the Heading component.
   *
   * **Note** This takes priority over `type` and `contrast` prop to decide color of heading
   */
  color?: TextColors | 'currentColor';
  weight?: 'regular' | 'medium' | 'semibold';
  children: Snippet | string;
  textAlign?: 'center' | 'justify' | 'left' | 'right';
  textDecorationLine?: 'line-through' | 'none' | 'underline';
  size?: 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
  textTransform?:
    | 'none'
    | 'capitalize'
    | 'uppercase'
    | 'lowercase'
    | 'full-width'
    | 'full-size-kana';
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
  testID?: string;
  styleOverride?: Partial<Record<HeadingSlot, string>>;
} & StyledPropsBlade;
```

## Usage Guidelines

**Do**

- Use `Heading` for page titles, section titles and card titles.
- Keep one heading level per section and don't skip levels in the page outline.
- Use `as` to fix the semantic level when the visual size differs, for example `size="large" as="h1"` for a dashboard page title.
- Use `as="span"` on a nested Heading to change the color or weight of part of a title.
- Keep the default `weight="semibold"` for hierarchy; use `regular` only for secondary headings the design calls for.

**Don't**

- Don't use `Heading` for paragraphs, labels or helper copy; use `Text`.
- Don't override `as` just to change the size; pick the matching `size` instead.
- Don't use large sizes for card or table titles; use `small` or `medium` and save `xlarge`/`2xlarge` for page titles.
- Don't style headings with custom font CSS; use `size`, `weight` and `color`.

## Examples

### Dashboard page and section titles

A page title with an explicit `h1`, a section title and an inline colored span.

```svelte
<script lang="ts">
  import { Box, Heading, Text } from '@razorpay/blade-svelte/components';

  const merchantName = 'Acme Retail';
</script>

<Box as="header" className="display-flex flex-col gap-spacing-2">
  <Heading as="h1" size="xlarge" testID="page-title">Payments</Heading>
  <Text color="surface.text.gray.muted">Track every payment collected by {merchantName}.</Text>
</Box>

<Box as="section" className="display-flex flex-col gap-spacing-3 margin-top-spacing-6">
  <Heading size="large">
    Accept payments at just <Heading as="span" size="large" color="feedback.text.information.intense">2%</Heading>
  </Heading>
  <Text>Enable UPI, cards and netbanking from a single integration.</Text>
</Box>
```

### Card title with muted subtitle

A small heading paired with a caption-sized subtitle inside a settings block.

```svelte
<script lang="ts">
  import { Box, Divider, Heading, Text } from '@razorpay/blade-svelte/components';
</script>

<Box as="section" className="display-flex flex-col">
  <Heading as="h2" size="small" weight="semibold" textTransform="capitalize" marginBottom="spacing.1">
    settlement preferences
  </Heading>
  <Text size="small" color="surface.text.gray.muted">Choose how often funds reach your bank account.</Text>
  <Divider marginY="spacing.4" />
  <Heading as="h3" size="small" weight="regular" color="surface.text.gray.subtle">Instant settlements</Heading>
</Box>
```
