## Component Name

InputGroup

## Description

InputGroup lays out related inputs (an address, card details, bank account details) as one connected block with a shared label, help, error or success text, size and disabled state. Wrap inputs in `InputRow` (documented here) to place one or more inputs per row, and set `gridTemplateColumns` on each row to control column widths.

## Important Constraints

- Child inputs don't render their own `label`, `helpText`, `errorText` or `successText`; only the group's label and hint are shown
- Because the child label is not rendered, a child input's accessible name comes only from its `accessibilityLabel`; set it on every child
- The group's `size` and `isDisabled` override the child inputs' own `size` and `isDisabled`
- A child's `validationState` still colours that input's border, so you can mark the failing field while the group shows the message
- `labelPosition="left"` falls back to `top` below 768px
- `size` accepts only `'medium'` or `'large'`
- `InputRow` lays out its children with CSS grid; `gridTemplateColumns` takes any `grid-template-columns` value

## TypeScript Types

These are the props the InputGroup and InputRow components accept.

```typescript
type BaseInputValidationState = 'none' | 'error' | 'success';
type LabelPosition = 'top' | 'left';

/**
 * Props for the `InputGroup` component.
 */
type InputGroupProps = {
  /** Label for the entire input group. */
  label?: string;
  /**
   * Position of the label relative to the group. `left` is a desktop-only layout
   * (falls back to `top` below 768px).
   * @default 'top'
   */
  labelPosition?: LabelPosition;
  /**
   * Controls the size of the input group and its child inputs.
   * @default 'medium'
   */
  size?: 'medium' | 'large';
  /** Help text displayed at the bottom of the group. */
  helpText?: string;
  /** Error message that appears when `validationState` is `'error'`. */
  errorText?: string;
  /** Success message that appears when `validationState` is `'success'`. */
  successText?: string;
  /**
   * Current validation state of the input group.
   * @default 'none'
   */
  validationState?: BaseInputValidationState;
  /**
   * Disables all inputs within the group.
   * @default false
   */
  isDisabled?: boolean;
  /** Should be `InputRow` components (or other valid inputs). */
  children: Snippet;
  /** Test ID for automation. */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

/**
 * Props for the `InputRow` component.
 */
type InputRowProps = {
  /**
   * CSS `grid-template-columns` value controlling how space is distributed
   * between child inputs (e.g. `"1fr 2fr"` or `"200px 1fr"`).
   * @default '1fr'
   */
  gridTemplateColumns?: string;
  /** Input components to render in this row. */
  children: Snippet;
  /** Test ID for automation. */
  testID?: string;
};
```

## Usage Guidelines

**Do**

- Use `InputGroup` for fields that form one value together: billing address, card details, bank account and IFSC.
- Put every input inside an `InputRow`, and use `gridTemplateColumns` such as `"2fr 1fr"` to size columns by importance.
- Give each child input an `accessibilityLabel` and a `placeholder` that names the field.
- Report errors with the group's `validationState` and `errorText`, and set `validationState="error"` on the failing child to highlight it.
- Use `isDisabled` on the group to lock every field, for example while a form submits.
- Switch rows to `"1fr"` on small screens when you use several columns.

**Don't**

- Don't use `InputGroup` for a single input; use the input component directly.
- Don't nest an `InputGroup` inside another `InputGroup`; use one group with more `InputRow`s.
- Don't put buttons, text or other non-input content inside an `InputRow`; place them outside the group.
- Don't rely on per-input `label` or `errorText` inside a group; use the group `label`, `errorText` and child `accessibilityLabel`.

## Examples

### Card details with group validation

A controlled card form: the group shows one error message and the failing field is highlighted.

```svelte
<script lang="ts">
  import { InputGroup, InputRow, TextInput, Button, Box } from '@razorpay/blade-svelte/components';

  let cardNumber = $state('');
  let expiry = $state('');
  let cvv = $state('');
  let cardholderName = $state('');
  let invalidField = $state<'cardNumber' | 'expiry' | 'cvv' | ''>('');
  let isSaving = $state(false);

  const errorMessages = {
    cardNumber: 'Card number is incomplete',
    expiry: 'Enter expiry as MM/YY',
    cvv: 'CVV must be 3 digits',
  };

  const saveCard = (): void => {
    if (cardNumber.length < 16) invalidField = 'cardNumber';
    else if (expiry.length !== 4) invalidField = 'expiry';
    else if (cvv.length !== 3) invalidField = 'cvv';
    else {
      invalidField = '';
      isSaving = true;
    }
  };
</script>

<Box className="display-flex flex-col gap-spacing-4">
  <InputGroup
    label="Card details"
    helpText="Your card is saved securely for future payments"
    validationState={invalidField ? 'error' : 'none'}
    errorText={invalidField ? errorMessages[invalidField] : undefined}
    isDisabled={isSaving}
    data-analytics-section="saved-card"
  >
    <InputRow>
      <TextInput
        accessibilityLabel="Card number"
        placeholder="Card number"
        format="#### #### #### ####"
        type="telephone"
        value={cardNumber}
        onChange={({ rawValue }) => (cardNumber = rawValue ?? '')}
        validationState={invalidField === 'cardNumber' ? 'error' : 'none'}
      />
    </InputRow>
    <InputRow gridTemplateColumns="1fr 1fr">
      <TextInput
        accessibilityLabel="Expiry date"
        placeholder="MM/YY"
        format="##/##"
        type="telephone"
        value={expiry}
        onChange={({ rawValue }) => (expiry = rawValue ?? '')}
        validationState={invalidField === 'expiry' ? 'error' : 'none'}
      />
      <TextInput
        accessibilityLabel="CVV"
        placeholder="CVV"
        keyboardType="numeric"
        maxCharacters={3}
        value={cvv}
        onChange={({ value }) => (cvv = value ?? '')}
        validationState={invalidField === 'cvv' ? 'error' : 'none'}
      />
    </InputRow>
    <InputRow>
      <TextInput
        accessibilityLabel="Name on card"
        placeholder="Name on card"
        autoCompleteSuggestionType="name"
        value={cardholderName}
        onChange={({ value }) => (cardholderName = value ?? '')}
      />
    </InputRow>
  </InputGroup>
  <Button variant="primary" isLoading={isSaving} onClick={saveCard}>Save card</Button>
</Box>
```

### Settlement bank account

A large group with the label on the left and uneven column widths for account number and IFSC.

```svelte
<script lang="ts">
  import { InputGroup, InputRow, TextInput, PasswordInput } from '@razorpay/blade-svelte/components';

  let accountNumber = $state('');
  let ifsc = $state('');
  let beneficiaryName = $state('');
</script>

<InputGroup
  label="Settlement account"
  labelPosition="left"
  size="large"
  helpText="Settlements are credited to this account every working day"
>
  <InputRow>
    <TextInput
      accessibilityLabel="Beneficiary name"
      placeholder="Beneficiary name"
      value={beneficiaryName}
      onChange={({ value }) => (beneficiaryName = value ?? '')}
    />
  </InputRow>
  <InputRow gridTemplateColumns="2fr 1fr">
    <PasswordInput
      accessibilityLabel="Account number"
      placeholder="Account number"
      value={accountNumber}
      onChange={({ value }) => (accountNumber = value ?? '')}
    />
    <TextInput
      accessibilityLabel="IFSC code"
      placeholder="IFSC code"
      autoCapitalize="characters"
      value={ifsc}
      onChange={({ value }) => (ifsc = (value ?? '').toUpperCase())}
    />
  </InputRow>
</InputGroup>
```
