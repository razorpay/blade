# PaymentInput Decisions <!-- omit in toc -->

PaymentInput extends existing TextInput and PasswordInput components with formatting capabilities for payment-related data including card numbers, expiry dates, and CVV codes.

<img src="./payment-input-anatomy.png" width="380" alt="PaymentInput component anatomy" />

- [Design](#design)
- [API](#api)
  - [TextInput with Formatting](#textinput-with-formatting)
  - [CVV Input (PasswordInput)](#cvv-input-passwordinput)
- [Usage Examples](#usage-examples)
- [Decisions](#decisions)
- [Open Questions](#open-questions)
- [References](#references)

## Design

[Figma Link](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=10953-185841&p=f&m=dev) to all variants of the PaymentInput component

## API

### TextInput with Formatting

We extend existing TextInput with formatting capabilities using a generic approach:

```ts
type TextInputProps = BaseInputProps & {
  /**
   * Format pattern where # represents input characters and other symbols act as delimiters
   * When provided, input will be automatically formatted
   *
   * **Note:**
   * 1. Format pattern should only contain # symbols and special characters as delimiters.
   *    Alphanumeric characters (letters and numbers) are not allowed in the format pattern.
   * 2. When format is provided, user input is restricted to alphanumeric characters only.
   *    Special characters and symbols will be filtered out automatically from user input.
   *
   * @example "#### #### #### ####" for card numbers
   * @example "##/##" for expiry dates
   * @example "(###) ###-####" for phone numbers
   */
  format?:
    | '#### #### #### ####'
    | '##/##'
    | '##/##/####'
    | '(###) ###-####'
    | '###-##-####'
    | '##:##'
    | '##:##:##'
    | '#### #### ####'
    | '###.###.###.###'
    | '## ## ####'
    | '##-###-##'
    | (string & {});

  /**
   * Trailing React component (e.g., Image, Icon)
   * When provided, component will be shown at the end of the input
   */
  trailing?: React.ComponentType<any>;

  /**
   * Enhanced onChange provides both formatted and raw values
   */
  onChange?: ({
    value: string; // Formatted value (e.g., "1234 5678 9012 3456")
    rawValue: string; // Raw input without delimiters (e.g., "1234567890123456")
    name?: string;
  }) => void;
};
```

### CVV Input (PasswordInput)

For CVV, we keep it simple with just character limits:

```ts
type PasswordInputProps = BaseInputProps & {
  /**
   * Maximum number of characters allowed
   * Will hide the character limit display at bottom for CVV inputs
   * @default 4
   */
  maxCharacter?: number;
};
```

## Usage Examples

### Basic Payment Form

```jsx
import { TextInput, PasswordInput, Box } from '@razorpay/blade/components';

const [cardIcon, setCardIcon] = useState(null);

<Box display="flex" flexDirection="column" gap="spacing.4">
  <TextInput
    label="Card Number"
    format="#### #### #### ####"
    trailing={cardIcon}
    onChange={({ rawValue }) => {
      if (rawValue.length === 4) {
        const cardType = detectCardType(rawValue);
        setCardIcon(getCardIcon(cardType));
      }
    }}
  />

  <Box display="flex" gap="spacing.3">
    <TextInput label="Expiry Date" format="##/##" placeholder="MM/YY" />
    <PasswordInput label="CVV" maxCharacter={3} placeholder="123" />
  </Box>
</Box>;
```

### With InputGroup

```jsx
<InputGroup>
  <InputRow templateColumns="1fr">
    <TextInput label="Card Number" format="#### #### #### ####" trailing={cardIcon} />
  </InputRow>
  <InputRow templateColumns="1fr 1fr">
    <TextInput label="Expiry Date" format="##/##" />
    <PasswordInput label="CVV" maxCharacter={3} />
  </InputRow>
</InputGroup>
```

### Other Formatting Use Cases

```jsx
// Phone number
<TextInput
  label="Phone Number"
  format="(###) ###-####"
/>

// Social Security Number
<TextInput
  label="SSN"
  format="###-##-####"
/>
```

## Decisions

### Generic Formatting Approach

**Decision**: We chose a generic formatting API over payment-specific components.

**Rationale**:

- **Reusability**: The `format` prop can be used for phone numbers, SSN, dates, and other formatted inputs
- **Consistency**: Maintains API consistency with existing TextInput components
- **Flexibility**: Teams can use the same API for various formatting needs

### User-Managed Icon Handling

**Decision**: Users pass React components via `trailing` prop instead of built-in card type detection and automatic icon display provided by Blade.

**What are card type icons?** Visual indicators showing the detected payment card brand (Visa, Mastercard, Amex, etc.) that appear in the input field to provide user feedback.

**Alternative Approaches Considered:**

**Option A: Built-in Card Type Icons (Rejected)**

```jsx
// Component automatically detects card type based on user input and shows appropriate icon
<PaymentInput
  type="cardNumber"
  showCardIcon={true} // Blade decides which icon to show
/>
```

**Option B: User-Managed Icons (Chosen)**

```jsx
// User controls detection logic and icon display
const [cardIcon, setCardIcon] = useState(null);

<TextInput
  format="#### #### #### ####"
  trailing={cardIcon}
  onChange={({ rawValue }) => {
    const cardType = detectCardType(rawValue); // User's logic
    setCardIcon(<VisaIcon />); // User's icon component
  }}
/>;
```

**Pros of User-Managed Approach:**

- **Custom Detection Logic**: Teams can use their preferred card detection libraries or custom rules
- **Brand Flexibility**: Use custom icon designs that match brand guidelines
- **Generic Reusability**: Same pattern works for bank icons, validation icons, or any trailing component
- **Business Logic Integration**: Card detection often involves business-specific rules (supported cards, regional variations)

**Cons of User-Managed Approach:**

- **Requires Existing Detection Logic**: Teams need to integrate their existing card detection and icon management
- **Potential Inconsistency**: Different teams might implement different detection behaviors

**Pros of Built-in Approach (Why we didn't choose it):**

- **Ease of Use**: Simple boolean prop to enable card icons
- **Consistency**: All teams get the same detection behavior
- **Less Code**: No need to implement detection logic

**Cons of Built-in Approach (Why we rejected it):**

- **Limited Flexibility**: Hard to customize detection rules or icon appearance
- **Business Logic Conflicts**: Built-in detection might not match business requirements
- **Generic Use Case Limitation**: Doesn't work for non-payment formatting scenarios
- **Additional Learning Curve**: Teams need to learn Blade's specific card detection API and behavior

### Enhanced onChange with Dual Values

**Decision**: `onChange` provides both `value` (formatted) and `rawValue` (without delimiters) instead of separate formatting functions.

**Rationale**:

- **Simplicity**: Single event handler provides all needed data
- **Performance**: No additional function calls or state management needed
- **Familiarity**: Follows standard React event patterns
- **Flexibility**: Users can choose which value to use for validation, storage, or display

### Format-Based Constraints

**Decision**: `maxLength` and `minLength` are automatically derived from the `format` pattern.

**Rationale**:

- **Consistency**: Format pattern is the single source of truth
- **Simplicity**: Users don't need to specify redundant constraints
- **Error Prevention**: Eliminates mismatches between format and length constraints
- **Maintainability**: Changing format automatically updates all related constraints

### User-Managed Card Detection

**Decision**: Card type detection is handled by users in `onChange` callback rather than built-in detection.

**Rationale**:

- **Flexibility**: Teams can implement custom detection logic or use existing libraries
- **Bundle Size**: We don't bundle card detection patterns
- **Business Logic**: Card detection often involves business-specific rules
- **Generic Approach**: Keeps the component usable for non-payment formatting

### User-Controlled Format Values

**Decision**: Users determine format patterns based on detected card type rather than automatic format switching.

**Rationale**:

- **Predictability**: Format doesn't change unexpectedly during user input
- **Control**: Teams can implement custom format switching logic
- **Simplicity**: Component behavior is more predictable and testable
- **Edge Cases**: Avoids complex scenarios with format switching mid-input

## Open Questions

### Development

1. **Native Compatibility**: How to handle card scanning and autofill on native platforms?
   - Need to investigate if scanned card data can populate formatted inputs correctly
   - Ensure `textContentType` works properly with formatting

### Design

1. **Visual Feedback**: How should we indicate card type detection visually?
2. **Error States**: Should formatting errors be shown differently from validation errors?
3. **Icon Positioning**: Should trailing icons have consistent sizing and positioning?

## References

### Internal

- [Alternative Payment-Specific API Approach](https://docs.google.com/document/d/16k_3DEYSXSUeFEZGgL_bQ39GNKZMjE5ER8ouJvrd58o/edit?tab=t.0) - Payment-focused API with built-in behaviors

### External

- [Razorpay Checkout](https://razorpay.com/demopg3/) - Payment input UX patterns
- [Stripe Elements](https://checkout.stripe.dev/checkout) - Payment input UX patterns
- [Ant Design Input](https://ant.design/components/input-number#input-number-demo-formatter) - Formatter function
  approach
- [React Input Auto Format](https://danielyefet.github.io/react-input-auto-format/) - Format pattern approach
- [Chakra UI Input](https://chakra-ui.com/docs/components/input) - Mask and format patterns
