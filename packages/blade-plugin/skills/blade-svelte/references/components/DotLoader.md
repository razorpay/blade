## Component Name

DotLoader

## Description

DotLoader is Blade's indefinite three-dot loader, for a short wait with no progress to report: the dots rise in turn and settle back, never dipping below the rest line. It comes in three sizes (18, 24 and 36px squares) and takes Icon's colours, `inherit` included. With `accessibilityLabel` it announces the wait as `role="status"`; without one it is hidden from assistive tech, for hosts that announce their own loading state (as Button does, which draws a DotLoader over its label while busy).

## Important Constraints

- Give `accessibilityLabel` when the DotLoader is the only sign of the wait; leave it out when the host already announces it, so screen readers don't hear it twice
- For a busy button use Button's `isLoading` or a promise from `onClick`, never a DotLoader inside a Button
- Under reduced motion the dots hold a static pose (the middle dot at its peak)
- `class` places it (margin, `self-center`); its look is `size` and `color`

## Props

```typescript
type DotLoaderSize = 'small' | 'medium' | 'large';
type DotLoaderColor = 'default' | 'subtle' | 'muted' | 'primary' | 'negative' | 'positive' | 'white' | 'inherit';

interface DotLoaderProps {
  /** 18px square with 3px dots, 24px with 4px, or 36px with 6px. @default 'medium' */
  size?: DotLoaderSize;
  /** Icon's colours; `inherit` takes the host's text colour, `white` is for dark surfaces. @default 'muted' */
  color?: DotLoaderColor;
  /** Announces the wait (`role="status"`); unset, the dots are `aria-hidden`. */
  accessibilityLabel?: string;
  testID?: string;
  /** Placement only. */
  class?: string;
}
```

## Guidelines

- Use DotLoader for a brief, indefinite wait inside a region (a list loading more, a field checking a value).
- Use Skeleton when the shape of the loading content is known, and ProgressBar when progress can be measured.
- Use `small` beside text and compact controls, `medium` by default, and `large` to fill an empty area.
- Use `color="white"` on dark or brand-coloured surfaces, and `inherit` to follow the surrounding text.
- Don't show several DotLoaders for one wait.

## Examples

### Announcing a wait

```svelte
<script lang="ts">
  import { DotLoader, Text } from '@razorpay/blade-svelte/components';
</script>

<div class="flex items-center gap-blade-3">
  <DotLoader accessibilityLabel="Loading transactions" />
  <Text size="small" color="muted">Fetching your transactions</Text>
</div>
```

### While data loads

```svelte
<script lang="ts">
  import { DotLoader, Text } from '@razorpay/blade-svelte/components';

  const load = fetch('/api/balance').then((response) => response.json() as Promise<{ balance: string }>);
</script>

{#await load}
  <DotLoader size="large" accessibilityLabel="Loading balance" class="self-center" />
{:then data}
  <Text weight="semibold">{data.balance}</Text>
{/await}
```

### Sizes and colours

```svelte
<script lang="ts">
  import { DotLoader } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-wrap items-center gap-blade-4">
  <DotLoader size="small" />
  <DotLoader />
  <DotLoader size="large" color="primary" />
  <span class="rounded-small bg-feedback-neutral-intense p-blade-2">
    <DotLoader color="white" />
  </span>
</div>
```
