## Component Name

Icon

## Description

Icon draws one icon from `@razorpay/blade-svelte/icons` (or one of the app's own single-colour SVGs) at a Blade size and colour. Icons are sources, not components: you import `InfoIcon` and pass it to `<Icon source={InfoIcon} />`, or to another component's `icon` or `leading` prop. It paints with the text colour, so by default it takes its parent's; it is decorative and hidden from screen readers unless given an `accessibilityLabel`.

## Important Constraints

- Never render an icon as a tag (`<InfoIcon />`): import it from `@razorpay/blade-svelte/icons` and pass it as `source`
- Only the icons listed in [AvailableIcons](../general/AvailableIcons.md) exist; pick the closest listed one when a name is missing
- Where a component has an `icon`, `leading` or `trailing` prop (Button, Badge, Alert, CardGroupItem…), pass the source there instead of an `<Icon>` in its children: it sizes and spaces it
- `color` defaults to `inherit`: the icon follows its host's text colour
- Icons are single colour; a logo or flag with its own colours is an image
- To animate a chevron turning, rotate one icon through `class` (`-rotate-90` points `ChevronDownIcon` right) rather than swapping sources
- `class` places it (margin, rotate, flex item); its look is `size` and `color`

## Props

```typescript
type IconSize = '2xsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
type IconColor = 'default' | 'subtle' | 'muted' | 'primary' | 'negative' | 'positive' | 'white' | 'inherit';

interface IconProps {
  /** An icon import from `@razorpay/blade-svelte/icons`, or the app's own SVG import. */
  source: IconSource;
  /** 6, 8, 12, 16, 20, 24 or 32px square. @default 'medium' */
  size?: IconSize;
  /** Blade's icon colours; `inherit` follows the host's text colour. @default 'inherit' */
  color?: IconColor;
  /** Names the icon (`role="img"`); without it the icon is decorative and `aria-hidden`. */
  accessibilityLabel?: string;
  testID?: string;
  /** Placement only: margin, rotation, its part in a flex parent. */
  class?: string;
}
```

## Guidelines

- Pass `accessibilityLabel` only when the icon alone carries meaning (a status with no text); leave it out next to text that already says the same.
- Match the icon's size to the text beside it: `small` (12px) with small text, `medium` (16px) with medium text, `large` (20px) with large text.
- Use `color` for status (`positive`, `negative`) and `muted` for secondary icons; leave it `inherit` inside a coloured host.
- For a clickable icon use IconButton, not an Icon with a click handler.
- Don't recolour or resize it with `text-*`, `w-*` or `h-*` classes: use `color` and `size`.

## Examples

### Sizes and colours

```svelte
<script lang="ts">
  import { Icon } from '@razorpay/blade-svelte/components';
  import { CheckCircleIcon, InfoIcon, LockIcon } from '@razorpay/blade-svelte/icons';
</script>

<div class="flex items-center gap-blade-4">
  <Icon source={LockIcon} size="small" color="muted" />
  <Icon source={InfoIcon} color="primary" />
  <Icon source={CheckCircleIcon} size="xlarge" color="positive" accessibilityLabel="Verified" />
</div>
```

### Beside text

```svelte
<script lang="ts">
  import { Icon, Text } from '@razorpay/blade-svelte/components';
  import { AlertTriangleIcon, LockIcon } from '@razorpay/blade-svelte/icons';
</script>

<div class="flex flex-col gap-blade-3">
  <div class="flex items-center gap-blade-2">
    <Icon source={LockIcon} size="small" color="muted" />
    <Text size="small" color="muted">Payments are encrypted end to end</Text>
  </div>
  <div class="flex items-center gap-blade-2">
    <Icon source={AlertTriangleIcon} color="negative" />
    <Text color="negative">The card has expired</Text>
  </div>
</div>
```

### A source passed to another component

```svelte
<script lang="ts">
  import { Badge, Button } from '@razorpay/blade-svelte/components';
  import { DownloadIcon, CheckCircleIcon } from '@razorpay/blade-svelte/icons';
</script>

<div class="flex items-center gap-blade-3">
  <Button icon={DownloadIcon} variant="secondary">Download</Button>
  <Badge color="positive" icon={CheckCircleIcon}>Settled</Badge>
</div>
```

### A rotated chevron

```svelte
<script lang="ts">
  import { Icon } from '@razorpay/blade-svelte/components';
  import { ChevronDownIcon } from '@razorpay/blade-svelte/icons';
</script>

<Icon source={ChevronDownIcon} class="-rotate-90" color="muted" />
