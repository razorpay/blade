## Component Name

ProgressBar

## Description

ProgressBar shows how far along a task is (`type="progress"`, `role="progressbar"`) or where a value sits in a range (`type="meter"`, `role="meter"`), as a linear bar or a ring (`variant="circular"`). A progress bar shows its floored percentage and pulses; it can be `isIndeterminate` when there is no value to report. A meter is static and shows no percentage. The fill takes a feedback colour, or the primary surface's when unset, and moves to a new value with a transition.

## Important Constraints

- `value` is clamped to `min`–`max` (default 0–100); the percentage shown is computed from them
- `label` sits above a linear bar and below a ring, and is the default `accessibilityLabel`; give `accessibilityLabel` when there is no `label`
- A linear bar has sizes `small` and `medium` (a 2px or 4px track); `large` exists only with `variant="circular"` (24, 48 or 72px rings)
- `isIndeterminate` and `showPercentage` exist only on `type="progress"`; a ring ignores `isIndeterminate`
- A linear bar fills the width it is given: set the width on its parent or in `class`
- To act when it completes, watch your own value in an `$effect`; ProgressBar has no callback

## Props

```typescript
type ProgressBarVariant = 'linear' | 'circular';
type ProgressBarSize = 'small' | 'medium' | 'large';
type ProgressBarColor = 'neutral' | 'information' | 'positive' | 'notice' | 'negative';

interface ProgressBarProps {
  /** `linear` bar or `circular` ring. @default 'linear' */
  variant?: ProgressBarVariant;
  /** `progress` (`role="progressbar"`) pulses and shows its percentage; `meter` (`role="meter"`) is static and does not. @default 'progress' */
  type?: 'progress' | 'meter';
  /** Linear: a 2px or 4px track (`small`, `medium`; no `large`). Circular: 24, 48 or 72px across. @default 'small' */
  size?: ProgressBarSize;
  /** The fill's feedback colour; unset, the primary surface's. @default undefined */
  color?: ProgressBarColor;
  /** @default 0 */
  value?: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** Above a linear bar, below a ring; also the default `accessibilityLabel`. */
  label?: string;
  /** Names the bar for assistive tech. @default label */
  accessibilityLabel?: string;
  /** Progress only: no value to report, a short fill slides across. Linear only. @default false */
  isIndeterminate?: boolean;
  /** Progress only: beside a linear bar's label; inside a ring above `small`, below a small one. @default true */
  showPercentage?: boolean;
  testID?: string;
  /** Placement only: width, margin, its part in a flex or grid parent. */
  class?: string;
}
```

## Guidelines

- Use `type="progress"` for a task that moves forward (an upload, onboarding steps) and `type="meter"` for a level (credit used, points balance).
- Use `isIndeterminate` while a task has started but its progress is unknown; switch to a value as soon as you have one.
- Use `color="positive"`, `notice` or `negative` only when the value carries that meaning (a limit nearly reached); leave it unset otherwise.
- Use a small ring inline (beside a list row) and a large one as a screen's focal point.
- Don't animate the value yourself: set `value`, and the fill transitions.
- Use DotLoader or Skeleton, not an indeterminate bar, for a short wait inside content.

## Examples

### A labelled progress bar

```svelte
<script lang="ts">
  import { Button, ProgressBar } from '@razorpay/blade-svelte/components';

  let spent = $state(300);
  const goal = 1200;
</script>

<div class="flex w-full max-w-[20rem] flex-col gap-blade-4">
  <ProgressBar label="Towards free delivery" value={spent} max={goal} color="positive" size="medium" />
  <Button size="small" variant="secondary" onClick={() => (spent = Math.min(goal, spent + 300))}>
    Add ₹300
  </Button>
</div>
```

### A meter and an indeterminate bar

```svelte
<script lang="ts">
  import { ProgressBar } from '@razorpay/blade-svelte/components';
</script>

<div class="flex w-full max-w-[20rem] flex-col gap-blade-5">
  <ProgressBar type="meter" label="Credit limit used" value={82000} max={100000} color="notice" />
  <ProgressBar isIndeterminate label="Preparing your report" />
</div>
```

### Rings

```svelte
<script lang="ts">
  import { ProgressBar } from '@razorpay/blade-svelte/components';
</script>

<div class="flex items-start gap-blade-6">
  <ProgressBar variant="circular" size="large" value={60} label="KYC" />
  <ProgressBar variant="circular" size="medium" value={60} accessibilityLabel="Profile complete" />
  <ProgressBar variant="circular" size="small" value={60} accessibilityLabel="Upload" />
</div>
```

### Reacting to completion

```svelte
<script lang="ts">
  import { ProgressBar, showToast } from '@razorpay/blade-svelte/components';

  let { uploaded }: { uploaded: number } = $props();

  $effect(() => {
    if (uploaded >= 100) void showToast({ content: 'Upload complete', color: 'positive' });
  });
</script>

<ProgressBar label="Uploading statement" value={uploaded} class="w-full" />
```
