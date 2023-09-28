---
'@razorpay/blade': minor
---

feat: add `color` prop to `Alert`, `Badge`, `Button`, `Chip`, `ChipGroup`, `Counter`, `Link`, & `Spinner`

#### Color Tokens Update

**[New White Color Tokens:](https://blade.razorpay.com/?path=/docs/tokens-colors--page)** Introducing white color tokens, enabling white buttons and links for enhanced design options.

#### Deprecated `intent` prop in favor of the new `color` prop

- **Alert** - Deprecated `intent` prop.
- **Badge** - Deprecated `variant` prop.
- **Chip & ChipGroup** - Deprecated `intent` prop.
- **Counter** - Deprecated `variant` and `intent` prop.
- **Spinner** - Deprecated the `contrast` prop.

#### Jest Snapshots

Your existing component snapshots may update, there is no change in the functionality of components. Feel free to commit the updated the snapshots.
