## Component Name

Spinner

## Description

Spinner is a looping animation that shows indeterminate loading, such as fetching transactions or verifying a bank account. It comes in three sizes and five colors, and can show a short visible label to the right of or below the animation. It renders with `role="progressbar"` and the required `accessibilityLabel`.

## Important Constraints

- `accessibilityLabel` is required
- `label` is only rendered when it is a non-empty string
- Svelte `Spinner` has no `onNeutral` color (React has one); for spinners on a filled neutral surface, use a loading `Button` with `isLoading` instead
- blade-svelte does not export a `SpinnerProps` type; the props below are the component's real props

## TypeScript Types

These are the props the Spinner component accepts.

```typescript
type SpinnerSize = 'medium' | 'large' | 'xlarge';
type SpinnerColor = 'primary' | 'white' | 'positive' | 'negative' | 'neutral';

type SpinnerProps = {
  /**
   * Sets the size of the spinner.
   *
   * @default 'medium'
   */
  size?: SpinnerSize;
  /**
   * Sets the color of the spinner.
   *
   * @default 'neutral'
   */
  color?: SpinnerColor;
  /**
   * Sets the aria-label of the spinner.
   */
  accessibilityLabel: string;
  /**
   * Sets the label of the spinner.
   */
  label?: string;
  /**
   * Sets the position of the label.
   *
   * @default 'right'
   */
  labelPosition?: 'right' | 'bottom';
  testID?: string;
} & StyledPropsBlade;
```

## Usage Guidelines

**Do**

- Use `Spinner` for loading states where you don't know how long the wait is.
- Write a specific `accessibilityLabel`, such as "Loading settlements" instead of "Loading".
- Use `label` to tell sighted users what is loading, and keep it to a few words.
- Use `size="medium"` for inline loading in rows and small sections; use `large` or `xlarge` for section or page loading.
- Use `labelPosition="bottom"` for centered, page-level loading states.
- Use `color="white"` on backgrounds that are dark in both color schemes.

**Don't**

- Don't put a Spinner inside a `Button`; use the Button's `isLoading` prop.
- Don't use a Spinner when the layout of the loading content is known; use `Skeleton`.
- Don't show several spinners for the same operation; show one, sized for the area it covers.
- Don't use `positive` or `negative` colors to show the result of an operation; show the result with `Badge` or `Alert` once loading ends.

## Examples

### Section loading state

A centered spinner with a visible label while settlements load.

```svelte
<script lang="ts">
  import { Spinner, Text } from '@razorpay/blade-svelte/components';

  let isLoading = $state(true);
  let settlementCount = $state(0);

  $effect(() => {
    fetch('/api/settlements')
      .then((response) => response.json())
      .then((data: { count: number }) => {
        settlementCount = data.count;
        isLoading = false;
      });
  });
</script>

<div class="settlements-panel">
  {#if isLoading}
    <Spinner
      size="xlarge"
      color="primary"
      label="Loading settlements"
      labelPosition="bottom"
      accessibilityLabel="Loading settlements"
      testID="settlements-spinner"
    />
  {:else}
    <Text size="medium">{settlementCount} settlements this week</Text>
  {/if}
</div>

<style>
  .settlements-panel {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-8);
  }
</style>
```

### Inline verification status

A medium spinner beside a row label while a bank account is verified.

```svelte
<script lang="ts">
  import { Spinner, Text } from '@razorpay/blade-svelte/components';
</script>

<div class="account-row">
  <Text size="small">HDFC Bank ••4521</Text>
  <Spinner size="medium" color="neutral" label="Verifying" accessibilityLabel="Verifying bank account" marginLeft="spacing.3" />
</div>

<style>
  .account-row {
    display: flex;
    align-items: center;
  }
</style>
```
