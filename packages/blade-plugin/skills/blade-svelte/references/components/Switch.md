## Component Name

Switch

## Description

Switch turns a setting on or off with immediate effect: auto-capture, notifications, a feature flag. It binds `isChecked`, reports `onChange({ isChecked, value })`, comes in `small` (28×16 track) and `medium` (36×20) sizes, and shows `isLoading` (a spinner in the thumb, toggles refused, still focusable) while the change is saved. To assistive tech it is a `role="switch"`; to the app's form it is a checkbox (`name`, `value`, `parse`). Its label is optional `children`; without one it needs `accessibilityLabel`.

## Important Constraints

- `isChecked` is bindable; there is no `defaultChecked`. `onChange` gets `{ isChecked, value }`, never the DOM event
- A switch with no `children` needs `accessibilityLabel`
- `isLoading` keeps the switch in the tab order but refuses toggles; `isDisabled` takes it out of use entirely
- There is no help or error text and no `activeColor`/`inactiveColor`: colours are the theme's
- `value` is what a native form submits while the switch is on; `parse` maps the state to what the app's form collects

## Props

```typescript
type SwitchSize = 'small' | 'medium';

interface SwitchProps {
  /** On: the initial state, a `bind:isChecked`, or host-driven. @default false */
  isChecked?: boolean;
  /** A user toggle: the new state and the input's `value`. */
  onChange?: (change: { isChecked: boolean; value: string | undefined }) => void;
  /** @default false */
  isDisabled?: boolean;
  /** A change is in flight: `aria-busy`, a spinner in the thumb, toggles refused; it stays focusable. @default false */
  isLoading?: boolean;
  /** Registers the field with the app's form (`adapters.form`) under this key. */
  name?: string;
  /** The input's `value` attribute: what a native form submits while it is on. */
  value?: string;
  /** Maps the checked state to the value the form collects. */
  parse?: (isChecked: boolean) => unknown;
  /** Track 28×16 (`small`) or 36×20 (`medium`). @default 'medium' (or BladeProvider's `size`) */
  size?: SwitchSize;
  /** Names the control when there are no `children`. */
  accessibilityLabel?: string;
  /** Lands on the input. */
  testID?: string;
  /** Placement only. */
  class?: string;
  /** The label beside the switch; receives `{ isChecked, isDisabled }`. */
  children?: Snippet<[{ isChecked: boolean; isDisabled: boolean }]>;
}
```

## Guidelines

- Use Switch for a setting that applies as soon as it is flipped; use Checkbox for a choice submitted with a form.
- Bind `isChecked` for local state; for a setting saved on the server, pass `isChecked`, set `isLoading` while the request runs, and update the state from `onChange`.
- Give every switch a name: a `children` label, or `accessibilityLabel` when the label is elsewhere in the row.
- Don't restyle it through `class` or change its colours: they come from the theme.

## Examples

### A labelled setting

```svelte
<script lang="ts">
  import { Switch } from '@razorpay/blade-svelte/components';

  let autoCapture = $state(true);
</script>

<Switch bind:isChecked={autoCapture}>Auto-capture payments</Switch>
```

### Saved on the server

```svelte
<script lang="ts">
  import { Switch } from '@razorpay/blade-svelte/components';

  let isEnabled = $state(false);
  let isSaving = $state(false);

  async function save({ isChecked }: { isChecked: boolean }): Promise<void> {
    isSaving = true;
    try {
      await fetch('/api/settings/notifications', { method: 'PUT', body: JSON.stringify({ isChecked }) });
      isEnabled = isChecked;
    } finally {
      isSaving = false;
    }
  }
</script>

<Switch isChecked={isEnabled} isLoading={isSaving} onChange={save}>Email notifications</Switch>
```

### In a settings row, named by accessibilityLabel

```svelte
<script lang="ts">
  import { Switch, Text } from '@razorpay/blade-svelte/components';

  let isInternational = $state(false);
</script>

<div class="flex items-center justify-between gap-blade-4 rounded-medium bg-surface-gray-intense p-blade-5 surface-raised">
  <div class="flex flex-col gap-blade-1">
    <Text weight="semibold">International payments</Text>
    <Text size="small" color="muted">Accept cards issued outside India</Text>
  </div>
  <Switch size="small" bind:isChecked={isInternational} accessibilityLabel="International payments" />
</div>
```
