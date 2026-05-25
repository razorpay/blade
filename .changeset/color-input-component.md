---
'@razorpay/blade': minor
---

feat(ColorInput): add ColorInput component

Adds a new `ColorInput` component that allows users to enter color values in hex format (e.g. `#FF5733`). The component renders a color swatch preview alongside the input field to provide visual feedback of the entered color.

**Features:**
- Color swatch preview that shows the entered hex color
- Supports 3, 4, 6, and 8 character hex color formats
- Swatch only renders when a value is present
- Supports all standard input props: label, helpText, validationState, errorText, successText, isDisabled, isRequired, necessityIndicator, size (medium/large), controlled & uncontrolled usage, and ref forwarding

**Usage:**
```jsx
import { ColorInput } from '@razorpay/blade/components';

<ColorInput
  label="Brand Color"
  placeholder="#000000"
  onChange={({ value }) => console.log(value)}
/>
```
