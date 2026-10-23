## Component Name

Checkbox

## Description

Checkbox is a single on/off choice with a label: agreeing to terms, opting in, picking one of several independent options. It binds `isChecked`, reports `onChange({ isChecked, value })`, draws Blade's box in three sizes, shows a dash with `isIndeterminate` (a parent over a partly checked list), and carries help text under its title and an error line under the whole control. It registers with the app's form under `name`, and `parse` maps the checked state to the value the form collects.

## Important Constraints

- The label is `children` (a snippet that receives `{ isChecked, isDisabled }`); a checkbox with no `children` needs `accessibilityLabel`
- `isChecked` is bindable; there is no `defaultChecked`. `onChange` gets `{ isChecked, value }`, never the DOM event
- `isIndeterminate` draws the dash and reads as mixed whatever `isChecked` is; set it from your own state
- `helpText` shows under the title in every state; `errorText` shows under the control only while `validationState="error"`
- There is no CheckboxGroup: render several Checkboxes in your own layout, or use ChipGroup/CardGroup with `selectionType="multiple"`
- With `parse`, keep the unchecked result falsy: `isChecked` reads the truthiness of the form's value

## Props

```typescript
type CheckboxSize = 'small' | 'medium' | 'large';

interface CheckboxProps {
  /** Checked: the initial state, a `bind:isChecked`, or host-driven. @default false */
  isChecked?: boolean;
  /** A user toggle: the new state and the input's `value`. */
  onChange?: (change: { isChecked: boolean; value: string | undefined }) => void;
  /** Some but not all of what it stands for is on: a dash, read as mixed. @default false */
  isIndeterminate?: boolean;
  /** @default false */
  isDisabled?: boolean;
  /** The app's form blocks submission until it is checked. @default false */
  isRequired?: boolean;
  /** Omit inside a form to mirror its error once toggled or submitted; pass it to own the state. */
  validationState?: 'none' | 'error';
  /** Under the title, lined up with it; shown in every state. */
  helpText?: string | Snippet;
  /** The line under the control while `validationState` is `error`. */
  errorText?: string | Snippet;
  /** Registers the field with the app's form (`adapters.form`) under this key. */
  name?: string;
  /** The input's `value` attribute. */
  value?: string;
  tabIndex?: number;
  /** Maps the checked state to the value the form collects. */
  parse?: (isChecked: boolean) => unknown;
  /** Box 12, 16 or 20px; title 12, 14 or 16px. @default 'medium' (or BladeProvider's `size`) */
  size?: CheckboxSize;
  /** Names the control when there are no `children`. */
  accessibilityLabel?: string;
  /** Lands on the input. */
  testID?: string;
  /** Placement only. */
  class?: string;
  /** The label; receives `{ isChecked, isDisabled }`. */
  children?: Snippet<[{ isChecked: boolean; isDisabled: boolean }]>;
}
```

## Guidelines

- Use Checkbox for independent yes/no choices; use Switch for a setting that takes effect at once, and RadioGroup for one of several.
- Bind `isChecked`, or read `onChange`'s `isChecked`.
- Write the label as `children` text; use `helpText` for the detail line under it.
- Use `isIndeterminate` on a "select all" checkbox while only some of its items are checked.
- Inside the app's form, give it a `name` and leave `validationState` out so the form drives its error.
- Don't put a Link in the label `children`; put it in a `helpText` snippet.

## Examples

### Basic and sizes

```svelte
<script lang="ts">
  import { Checkbox } from '@razorpay/blade-svelte/components';

  let saveCard = $state(true);
</script>

<div class="flex flex-col gap-blade-4">
  <Checkbox bind:isChecked={saveCard} helpText="Secured as per RBI guidelines">
    Save this card for future payments
  </Checkbox>
  <Checkbox size="small">Send me offers</Checkbox>
  <Checkbox size="large" isDisabled>Auto-debit (unavailable)</Checkbox>
</div>
```

### Select all with an indeterminate parent

```svelte
<script lang="ts">
  import { Checkbox } from '@razorpay/blade-svelte/components';

  const methods = ['UPI', 'Cards', 'Netbanking'];
  let enabled = $state<Record<string, boolean>>({ UPI: true, Cards: false, Netbanking: false });

  const count = $derived(methods.filter((method) => enabled[method]).length);
</script>

<div class="flex flex-col gap-blade-3">
  <Checkbox
    isChecked={count === methods.length}
    isIndeterminate={count > 0 && count < methods.length}
    onChange={({ isChecked }) => {
      for (const method of methods) enabled[method] = isChecked;
    }}
  >
    All payment methods
  </Checkbox>
  <div class="flex flex-col gap-blade-3 pl-blade-6">
    {#each methods as method (method)}
      <Checkbox bind:isChecked={enabled[method]}>{method}</Checkbox>
    {/each}
  </div>
</div>
```

### Required, with an error and a link in the help text

```svelte
<script lang="ts">
  import { Button, Checkbox, Link } from '@razorpay/blade-svelte/components';

  let agreed = $state(false);
  let submitted = $state(false);
</script>

<div class="flex flex-col items-start gap-blade-4">
  <Checkbox
    bind:isChecked={agreed}
    name="terms"
    isRequired
    validationState={submitted && !agreed ? 'error' : 'none'}
    errorText="Accept the terms to continue"
  >
    I accept the terms and conditions
    {#snippet helpText()}
      Read the <Link href="/terms" size="small">terms</Link>
    {/snippet}
  </Checkbox>
  <Button onClick={() => (submitted = true)}>Continue</Button>
</div>
```
