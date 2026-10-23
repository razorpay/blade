## Component Name

InputGroup

## Description

InputGroup joins related fields into one framed block with one label and one hint line: a card's number, expiry and CVV, or an address. Its members are TextInput, PasswordInput, TextArea and PhoneNumberInput, laid out on a 12-column grid where each member's `span` (`full`, `1/2`, `1/3`, `2/3`, `1/4`, `3/4`) says how much of a row it takes; neighbours share one border line and the group rounds its outer corners.

## Important Constraints

- There is no row component: members flow in order, and spans that add up to 1 form a row; each row should add up to 1 so the corner members round correctly
- `span` is set on each member (default `full`), not on the group
- Inside the group a member's `label` names its control but is not shown, and its own hint line is not shown: the group's `label`, `helpText`, `errorText` and `successText` are the visible ones. Give every member a `label` (or `accessibilityLabel`)
- The group's `size` (`medium`, default, or `large`) sizes every member, over the member's own `size`
- `isDisabled` disables every member
- An error turns the group's hint line negative and marks the members `aria-invalid`; their frames stay gray, as Blade React. Omit `validationState` inside the app's form to mirror the first visible member error
- `label` is a plain string; without one, name the group with `accessibilityLabel`

## Props

```typescript
interface InputGroupProps {
  /** Plain text above the group. */
  label?: string;
  /** Omit inside the app's form to mirror its members' errors. @default 'none' */
  validationState?: 'none' | 'error' | 'success';
  /** The line under the group, and the stand-in for a missing error or success text. */
  helpText?: string | Snippet;
  /** The line while `validationState` is `error`. */
  errorText?: string | Snippet;
  /** The line while `validationState` is `success`. */
  successText?: string | Snippet;
  /** Disables every member. @default false */
  isDisabled?: boolean;
  /** Names the group when there is no visible `label`. */
  accessibilityLabel?: string;
  testID?: string;
  /** Placement only. */
  class?: string;
  /** The fields; each takes its `span` of a row. */
  children?: Snippet;
  /** Every member's size, and the label's and hint's. @default 'medium' (or BladeProvider's `size`) */
  size?: 'medium' | 'large';
}
```

## Guidelines

- Group fields that are read as one value (a card, an address, a date range), not unrelated fields.
- Keep each member's `label` short and meaningful; screen readers announce it even though it is hidden.
- Set the group's width with `class` (`w-full`, `max-w-[400px]`); the members fill their spans.
- Report a member's problem in the group's `errorText` (one line for the whole group).
- Don't nest InputGroups, and don't put SearchInput, OTPInput or CounterInput in one: they take no `span`.

## Examples

### Card details

```svelte
<script lang="ts">
  import { InputGroup, PasswordInput, TextInput } from '@razorpay/blade-svelte/components';

  let number = $state<string | number | null | undefined>('');
  let expiry = $state<string | number | null | undefined>('');
  let cvv = $state<string | number | null | undefined>('');
  let name = $state<string | number | null | undefined>('');
</script>

<InputGroup label="Card details" helpText="We don't store your CVV" class="w-full">
  <TextInput bind:value={number} label="Card number" placeholder="Card number" inputMode="numeric" format="#### #### #### ####" />
  <TextInput bind:value={expiry} label="Expiry" placeholder="MM/YY" inputMode="numeric" format="##/##" span="1/2" />
  <PasswordInput bind:value={cvv} label="CVV" placeholder="CVV" maxCharacters={4} span="1/2" showRevealButton={false} />
  <TextInput bind:value={name} label="Name on card" placeholder="Name on card" autoComplete="cc-name" />
</InputGroup>
```

### Address with an error

```svelte
<script lang="ts">
  import { InputGroup, TextArea, TextInput } from '@razorpay/blade-svelte/components';

  let pincode = $state<string | number | null | undefined>('5600');
  const invalid = $derived(String(pincode ?? '').length !== 6);
</script>

<InputGroup
  label="Delivery address"
  size="large"
  validationState={invalid ? 'error' : 'none'}
  errorText="Enter a 6-digit pincode"
>
  <TextArea label="Address" placeholder="House, street, area" numberOfLines={2} />
  <TextInput label="City" placeholder="City" span="2/3" />
  <TextInput bind:value={pincode} label="Pincode" placeholder="Pincode" inputMode="numeric" maxCharacters={6} span="1/3" />
</InputGroup>
```
