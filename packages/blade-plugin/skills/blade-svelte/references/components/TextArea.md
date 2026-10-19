## Component Name

TextArea

## Description

TextArea is the multi-line text field: a delivery note, an address, a reason for a refund. It has TextInput's label, hint lines, validation, clear button and character counter, shows `numberOfLines` rows (2 by default) without growing with its content, and takes `span` inside an InputGroup. It has no affixes, `type` or `format`, and comes in `medium` and `large`.

## Important Constraints

- `label` is a plain string above the field; without one, name it with `accessibilityLabel`
- `value` is a string; `onChange` receives `{ name, value }`; bind it with `bind:value`
- `numberOfLines` sets the visible rows (default 2); the control does not grow or resize, and scrolls past them
- `maxCharacters` caps the length and shows a counter under the field
- The clear button (`showClearButton`) sits at the top end while there is text
- `size` is `medium` (default) or `large`; there is no `small`. Inside an InputGroup the group's size wins
- Omit `validationState` inside the app's form (`adapters.form`) to mirror its error; pass it to own the state

## Props

```typescript
type InputGroupSpan = 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4';

interface TextAreaProps {
  /** Plain text above the field. */
  label?: string;
  /** After the label: `*` or `(optional)`. `required` also makes the control required. @default 'none' */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /** Bindable. @default '' */
  value?: string;
  placeholder?: string;
  /** Visible rows; the control does not grow with its content. @default 2 */
  numberOfLines?: number;
  /** A user edit: `{ name, value }`. */
  onChange?: (change: { name: string | undefined; value: string }) => void;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  /** @default false */
  isDisabled?: boolean;
  /** @default false */
  isRequired?: boolean;
  /** @default false */
  isReadOnly?: boolean;
  /** Omit inside the app's form to mirror its error. @default 'none' */
  validationState?: 'none' | 'error' | 'success';
  /** The line under the field, and the stand-in for a missing error or success text. */
  helpText?: string | Snippet;
  /** The line while `validationState` is `error`. */
  errorText?: string | Snippet;
  /** The line while `validationState` is `success`. */
  successText?: string | Snippet;
  /** @default false */
  autoFocus?: boolean;
  /** A clear button while the field holds text. @default false */
  showClearButton?: boolean;
  /** The clear button was pressed; the field is already empty. */
  onClearButtonClick?: () => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  /** Inside an InputGroup: this field's share of its row. @default 'full' */
  span?: InputGroupSpan;
  /** The key the app's form submits it under. */
  name?: string;
  /** Caps the length and shows a counter. */
  maxCharacters?: number;
  /** Names the control when there is no visible `label`. */
  accessibilityLabel?: string;
  /** Lands on the `<textarea>`. */
  testID?: string;
  /** Placement only. */
  class?: string;
  /** Also sizes the label and the hint. @default 'medium' (or BladeProvider's `size`) */
  size?: 'medium' | 'large';
}
```

## Guidelines

- Use TextArea for free text that can run past one line; use TextInput for a single line.
- Set `maxCharacters` when the backend has a limit, so the user sees the counter.
- Raise `numberOfLines` for longer content (an address, feedback) instead of setting a height through `class`.
- Don't restyle it through `class`; place it (`w-full`, `mt-blade-4`) and pick a `size`.

## Examples

### A note with a counter

```svelte
<script lang="ts">
  import { TextArea } from '@razorpay/blade-svelte/components';

  let note = $state('');
</script>

<TextArea
  bind:value={note}
  label="Delivery instructions"
  necessityIndicator="optional"
  placeholder="Leave it at the door"
  numberOfLines={3}
  maxCharacters={120}
  showClearButton
/>
```

### Required reason with an error

```svelte
<script lang="ts">
  import { Button, TextArea } from '@razorpay/blade-svelte/components';

  let reason = $state('');
  let submitted = $state(false);
  const missing = $derived(submitted && reason.trim() === '');
</script>

<div class="flex flex-col gap-blade-4">
  <TextArea
    bind:value={reason}
    label="Reason for refund"
    name="reason"
    isRequired
    numberOfLines={4}
    validationState={missing ? 'error' : 'none'}
    helpText="This is shared with the customer"
    errorText="Tell us why you're refunding"
  />
  <Button class="self-end" onClick={() => (submitted = true)}>Refund</Button>
</div>
```
