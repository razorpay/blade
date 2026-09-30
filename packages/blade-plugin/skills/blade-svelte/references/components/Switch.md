## Component Name

Switch

## Description

Switch is a toggle for a single on/off setting that takes effect immediately, with no separate submit step, such as enabling international payments or auto-capture. It comes in `small` and `medium` sizes, supports controlled and uncontrolled use, and has no built-in visible label, so it is paired with your own label text.

## Important Constraints

- `accessibilityLabel` is required; Switch renders no visible label
- A disabled Switch ignores clicks and does not call `onChange`
- In controlled mode, if `onChange` does not update `isChecked`, the Switch snaps back to `isChecked`
- There is no `SwitchGroup`; each Switch is an individual control
- Use `bind:this` to get a `SwitchInstance` with a `focus()` method

## TypeScript Types

These are the props the Switch component accepts.

```typescript
/**
 * Payload passed to the `onChange` callback when the switch toggles.
 */
type SwitchOnChange = (event: { isChecked: boolean; value?: string; event?: Event }) => void;

interface SwitchProps extends StyledPropsBlade {
  /**
   * If `true`, the switch will be checked. This also makes the switch controlled.
   * Use `onChange` to update its value.
   *
   * @default false
   */
  isChecked?: boolean;
  /**
   * If `true`, the switch will be initially checked. This also makes the switch uncontrolled.
   *
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The callback invoked when the checked state of the `Switch` changes.
   */
  onChange?: SwitchOnChange;
  /**
   * The name of the input field in a switch (useful for form submission).
   */
  name?: string;
  /**
   * The value to be used in the switch input.
   * This is the value that will be returned on form submission.
   */
  value?: string;
  /**
   * If `true`, the switch will be disabled.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Size of the switch.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium';
  /**
   * Provides accessible label for the internal checkbox/switch input.
   * Required for screen reader support since the Switch has no visible text label.
   */
  accessibilityLabel: string;
  /**
   * The id of the input field in a switch, useful for associating a label element
   * with the input via `htmlFor` prop.
   */
  id?: string;
  /**
   * Test ID for the outer wrapper element.
   */
  testID?: string;
  /**
   * Analytics data attributes (`data-analytics-*`).
   */
  [key: `data-analytics-${string}`]: string | undefined;
}

/**
 * Imperative handle exposed via `bind:this={instance}`.
 * Mirrors React's `BladeElementRef` for the Switch component.
 */
interface SwitchInstance {
  /** Move keyboard focus to the underlying input element. */
  focus: () => void;
}
```

## Usage Guidelines

**Do**

- Use `Switch` for a single setting where toggling is the action, such as turning on auto-capture for payments.
- Always pass an `accessibilityLabel` that matches the visible label text.
- Build the visible label by wrapping `Switch` and `Text` in `<Box as="label" className="display-flex items-center gap-spacing-3">` so clicking the text toggles the switch.
- Use `size="small"` in settings lists and dense cards; use `medium` for a prominent standalone toggle.
- Use `isChecked` with `onChange={({ isChecked }) => ...}` when the value is saved to a server, so you can revert on failure.

**Don't**

- Don't use `Switch` for a choice that is only applied after a submit or save button; use `Checkbox`.
- Don't use `Switch` to pick one option from several; use `RadioGroup`, `ChipGroup` or `SegmentedControl`.
- Don't render a Switch without a visible label next to it; wrap it with `Text` inside `<Box as="label" className="display-flex items-center gap-spacing-3">`.
- Don't pass both `isChecked` and `defaultChecked`; pick controlled or uncontrolled.

## Examples

### Card transaction controls

A settings card with labelled, uncontrolled small switches for each transaction type.

```svelte
<script lang="ts">
  import { Box, Switch, Text } from '@razorpay/blade-svelte/components';

  const controls = [
    { id: 'international', label: 'International transactions', enabled: false },
    { id: 'online', label: 'Online transactions', enabled: true },
    { id: 'contactless', label: 'Contactless payments', enabled: true },
  ];

  function handleToggle(id: string, isChecked: boolean): void {
    console.log(`${id} is now ${isChecked ? 'on' : 'off'}`);
  }
</script>

<Box className="display-flex flex-col gap-spacing-4">
  <Text weight="semibold">Activate or lock methods for card transactions</Text>
  {#each controls as control (control.id)}
    <Box as="label" className="display-flex items-center justify-between gap-spacing-3">
      <Text size="small">{control.label}</Text>
      <Switch
        size="small"
        name={control.id}
        defaultChecked={control.enabled}
        accessibilityLabel={control.label}
        onChange={({ isChecked }) => handleToggle(control.id, isChecked)}
        data-analytics-control={control.id}
      />
    </Box>
  {/each}
</Box>
```

### Controlled toggle saved to the server

A controlled switch that updates optimistically, disables while saving and reverts if the request fails.

```svelte
<script lang="ts">
  import { Box, Switch, Text } from '@razorpay/blade-svelte/components';

  let isAutoCaptureOn = $state(true);
  let isSaving = $state(false);

  async function saveAutoCapture(next: boolean): Promise<void> {
    const previous = isAutoCaptureOn;
    isAutoCaptureOn = next;
    isSaving = true;
    try {
      await fetch('/api/settings/auto-capture', {
        method: 'POST',
        body: JSON.stringify({ enabled: next }),
      });
    } catch {
      isAutoCaptureOn = previous;
    } finally {
      isSaving = false;
    }
  }
</script>

<Box as="label" className="display-flex items-center gap-spacing-3">
  <Switch
    accessibilityLabel="Auto-capture payments"
    isChecked={isAutoCaptureOn}
    isDisabled={isSaving}
    onChange={({ isChecked }) => saveAutoCapture(isChecked)}
    testID="auto-capture-switch"
  />
  <Text>Auto-capture payments</Text>
</Box>
```
