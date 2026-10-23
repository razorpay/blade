## Component Name

TextInput

## Description

TextInput is the single-line text field: a name, an email, a UPI ID, an amount, a card number. It shows a label above the control and one hint line below it (help, error or success), takes text affixes (`prefix`, `suffix`) and icon or snippet slots (`leading`, `trailing`), an optional clear button and a character counter (`maxCharacters`), and lays typed characters into a Blade `format` mask such as `#### #### #### ####`. `type` is the HTML input type, and each type brings Blade's keyboard and autofill defaults.

## Important Constraints

- `label` is a plain string above the field; without one, name the control with `accessibilityLabel`
- `onChange` receives `{ name, value }`, never a DOM event; bind the value with `bind:value` (there is no `defaultValue`)
- With `format`, the value is the formatted text, as in Blade React (`1225` under `##/##` is `"12/25"`), and `onChange` adds `rawValue`, the typed characters alone (`"1225"`). A completed group places its delimiter right away: typing `12` gives `"12/"`
- `format` keeps letters and digits only, caps the length at the pattern's length and hides the character counter; `#` is a typed character and anything else a delimiter, so use no letters or digits in the pattern
- `type` is the HTML type: `text`, `tel`, `email`, `url`, `number` (rendered as `type="text"` with the decimal keypad, as Blade). `tel` brings `autocomplete="tel"` and the done key, `email` `autocomplete="email"` and no autocapitalize, `url` the go key. `inputMode`, `enterKeyHint`, `autoComplete` and `autoCapitalize` override them. For a password or a search field use PasswordInput or SearchInput, not `type`
- `leading` and `trailing` each take an icon source or a snippet, not both. An icon `leading` sits first, before `prefix`; a snippet `leading` (a currency or country selector) sits after `prefix`. A snippet `trailing` is for a Link or a button
- `size` is `small` (32px), `medium` (36px, default) or `large` (48px). Inside an InputGroup the group's `size` wins, the group shows the label and hint line, and the field's `span` sets its share of the row
- Omit `validationState` inside the app's form (`adapters.form`): the field shows its form error once touched or after a submit. Pass it to own the state

## Props

```typescript
type TextInputType = 'text' | 'tel' | 'email' | 'url' | 'number' | 'password';
type TextInputValue = string | number | null | undefined;
type InputGroupSpan = 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4';

interface TextInputProps {
  /** Plain text above the field; it names the control. */
  label?: string;
  /** After the label: `*` or `(optional)`. `required` also makes the control required. @default 'none' */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /** Bindable. With `format`, the formatted text. @default '' */
  value?: TextInputValue;
  placeholder?: string;
  /** The HTML input type, with Blade's keyboard and autofill defaults; `number` renders as `text` with the decimal keypad. `password` is the bare masked control PasswordInput builds on. @default 'text' */
  type?: TextInputType;
  /** The control's role, for a composition that is one (SearchInput's `searchbox`). */
  role?: 'searchbox';
  /** The virtual keyboard when it should differ from the type's: `numeric` for digits in a `text` field. */
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  /** A user edit: `{ name, value }`; with `format`, also `rawValue`, the typed characters alone. */
  onChange?: (change: { name: string | undefined; value: TextInputValue; rawValue?: string }) => void;
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
  /** The line under the field, and the stand-in for a missing error or success text. A snippet for a line with a Link. */
  helpText?: string | Snippet;
  /** The line while `validationState` is `error`. */
  errorText?: string | Snippet;
  /** The line while `validationState` is `success`. */
  successText?: string | Snippet;
  /** Text before the value: ₹, +91. */
  prefix?: string;
  /** Before the text: an icon (a glyph, before `prefix`) or a snippet (a selector, after `prefix`). */
  leading?: IconSource | Snippet;
  /** Text after the value: @okaxis. */
  suffix?: string;
  /** After the text, last: an icon (a glyph) or a snippet (a Link, a button). */
  trailing?: IconSource | Snippet;
  /** @default false */
  autoFocus?: boolean;
  /** A clear button while the field holds text. @default false */
  showClearButton?: boolean;
  /** The clear button was pressed; the field is already empty and `onChange` has fired. */
  onClearButtonClick?: () => void;
  /** The return key's label on a virtual keyboard (`done`, `go`, `next`, `search`, `send`…). */
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  /** HTML `autocapitalize`: `none`, `sentences`, `words`, `characters`. */
  autoCapitalize?: string;
  /** An HTML autofill token: `name`, `tel`, `email`, `one-time-code`, `off`… */
  autoComplete?: string;
  onClick?: (event: MouseEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  /** Inside an InputGroup: this field's share of its row. @default 'full' */
  span?: InputGroupSpan;
  /** The key the app's form registers and submits the field under. */
  name?: string;
  /** Caps the length and shows a counter under the field (not with `format`). */
  maxCharacters?: number;
  /** A validity pattern the field hands the app's form. */
  pattern?: string | RegExp;
  /** Blade's mask: `#` takes one typed letter or digit, anything else is a delimiter the field places (`#### #### #### ####`, `##/##`, `##/##/####`, `(###) ###-####`, `##:##`…). */
  format?: string;
  /** A stored value that differs from the text shown, as two functions; ignored with `format`. Not in Blade React. */
  transform?: { parse: (value: TextInputValue) => TextInputValue; format: (value: TextInputValue) => string };
  /** Names the control when there is no visible `label`. */
  accessibilityLabel?: string;
  /** Lands on the `<input>`, the element tests type into. */
  testID?: string;
  /** Placement only: margin, width, its part in a flex or grid parent. */
  class?: string;
  /** A composition's attachment on the `<input>` (PhoneNumberInput's). */
  attach?: (node: HTMLInputElement) => void | (() => void);
  /** A composition's handle on the field: `change(value)` sets a value as a user edit would. */
  field?: (field: { change: (value: TextInputValue) => boolean }) => void;
  /** 32, 36 or 48px tall; also sizes the label and hint. @default 'medium' (or BladeProvider's `size`) */
  size?: 'small' | 'medium' | 'large';
  /** @default 'left' */
  textAlign?: 'left' | 'center' | 'right';
}
```

## Guidelines

- Pick the HTML `type` that matches the data (`email`, `tel`, `url`) for the right keyboard and autofill; add `inputMode="numeric"` to a `text` field that takes digits, such as a card number or an expiry.
- Use `format` for fixed-shape values (card numbers, dates, expiries); store and validate the formatted text, or read `rawValue` from `onChange` when you need the digits alone.
- Use `prefix`/`suffix` for text affixes (₹, @okaxis) and `leading`/`trailing` for icons or a snippet; don't put an icon into `prefix`.
- Show validation with `validationState="error"` and `errorText`; keep `helpText` for guidance, it stands in when `errorText` or `successText` is missing.
- Make a field full width or place it with `class` (`w-full`, `mt-blade-4`); its look is `size` and `textAlign`.
- Don't use `type="password"` or a search icon on TextInput for those fields: use PasswordInput or SearchInput.
- Don't set `maxCharacters` with `format`: the pattern caps the length and the counter is hidden.
- `bind:this` exposes `focus()` for moving focus to the field from code.

## Examples

### Labels, types and hint lines

```svelte
<script lang="ts">
  import { TextInput } from '@razorpay/blade-svelte/components';

  let email = $state<string | number | null | undefined>('');
  let note = $state<string | number | null | undefined>('');
</script>

<div class="flex flex-col gap-blade-5">
  <TextInput
    bind:value={email}
    label="Email"
    type="email"
    name="email"
    placeholder="you@example.com"
    necessityIndicator="required"
    helpText="We'll send the receipt here"
  />
  <TextInput
    bind:value={note}
    label="Note for the merchant"
    necessityIndicator="optional"
    maxCharacters={40}
    showClearButton
  />
</div>
```

### Formatted card number and expiry

```svelte
<script lang="ts">
  import { TextInput } from '@razorpay/blade-svelte/components';

  let card = $state<string | number | null | undefined>('');
  let expiry = $state<string | number | null | undefined>('');
  let digits = $state('');
</script>

<div class="flex flex-col gap-blade-5">
  <!-- value is "4111 1111 1111 1111"; rawValue is "4111111111111111". -->
  <TextInput
    bind:value={card}
    label="Card number"
    inputMode="numeric"
    autoComplete="cc-number"
    placeholder="0000 0000 0000 0000"
    format="#### #### #### ####"
    onChange={({ rawValue }) => (digits = rawValue ?? '')}
  />
  <!-- Typing 12 shows "12/"; 1225 shows "12/25". -->
  <TextInput
    bind:value={expiry}
    label="Expiry"
    inputMode="numeric"
    autoComplete="cc-exp"
    placeholder="MM/YY"
    format="##/##"
  />
</div>
```

### Prefix, suffix, icons and a trailing link

```svelte
<script lang="ts">
  import { Link, TextInput } from '@razorpay/blade-svelte/components';
  import { InfoIcon, SearchIcon } from '@razorpay/blade-svelte/icons';
</script>

<div class="flex flex-col gap-blade-5">
  <TextInput label="UPI ID" placeholder="handle" suffix="@okaxis" />
  <TextInput label="Bank" placeholder="Bank name" leading={SearchIcon} trailing={InfoIcon} />
  <TextInput label="Amount" type="number" placeholder="0.00" prefix="₹" textAlign="right">
    {#snippet trailing()}
      <Link href="/rates" size="small">Rates</Link>
    {/snippet}
  </TextInput>
</div>
```

### Validation the app owns

```svelte
<script lang="ts">
  import { TextInput } from '@razorpay/blade-svelte/components';

  let upi = $state<string | number | null | undefined>('');
  const isValid = $derived(/^[\w.-]+@[\w]+$/.test(String(upi ?? '')));
  const upiState = $derived(upi === '' ? 'none' : isValid ? 'success' : 'error');
</script>

<TextInput
  bind:value={upi}
  label="UPI ID"
  placeholder="name@bank"
  validationState={upiState}
  helpText="Find it in your UPI app"
  errorText="Enter a UPI ID like name@bank"
  successText="UPI ID verified"
/>
```
