## Component Name

TrustBadge

## Description

TrustBadge is the "Razorpay Trusted Business" marker: Razorpay's brand shield and a line of text in a 24px tinted pill, or the shield alone (`variant="icon-only"`). The library ships no copy, so the app passes the translated line as `label`, which also names the shield when it stands alone. The shield is an image that keeps its own colours whatever the theme; it is not one of the icons.

## Important Constraints

- `label` is required, even with `variant="icon-only"`, where it becomes the shield's alt text
- The shield is the component's own asset: it is not in `@razorpay/blade-svelte/icons`, and `Icon` can't draw it
- Beside its label the shield is decorative (`alt=""`)
- `class` places the badge (margin, `self-start`); it has no size or colour props

## Props

```typescript
type TrustBadgeVariant = 'default' | 'icon-only';

interface TrustBadgeProps {
  /** The line beside the shield, translated by the app; the shield's name when it stands alone. */
  label: string;
  /** `default`: the shield and its line in a tinted pill. `icon-only`: the shield alone. @default 'default' */
  variant?: TrustBadgeVariant;
  testID?: string;
  /** Placement only. */
  class?: string;
}
```

## Guidelines

- Use `icon-only` where space is tight (beside a name in a list row); use the default pill elsewhere.
- Pass the label through your app's translations; the usual English line is "Razorpay Trusted Business".
- Don't recreate the shield with an icon or restyle the pill through `class`.

## Examples

### Beside a business name

```svelte
<script lang="ts">
  import { Avatar, Text, TrustBadge } from '@razorpay/blade-svelte/components';
</script>

<div class="flex items-center gap-blade-3">
  <Avatar name="Acme Stores" variant="square" color="primary" />
  <div class="flex flex-col gap-blade-1">
    <Text weight="semibold">Acme Stores</Text>
    <TrustBadge label="Razorpay Trusted Business" class="self-start" />
  </div>
</div>
```

### Icon only

```svelte
<script lang="ts">
  import { Text, TrustBadge } from '@razorpay/blade-svelte/components';
</script>

<div class="flex items-center gap-blade-2">
  <Text weight="semibold">Acme Stores</Text>
  <TrustBadge variant="icon-only" label="Razorpay Trusted Business" />
</div>
```
