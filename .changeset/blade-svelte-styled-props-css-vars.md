---
'@razorpay/blade-core': patch
'@razorpay/blade-svelte': patch
---

refactor(blade-svelte): only set CSS custom properties through the `style` attribute

The `style` attribute on blade-svelte components now only ever carries CSS custom properties — never raw CSS declarations. The actual declarations live in the blade-core CSS modules and consume the vars (`width: var(--modal-width)` instead of an inline `width: 12px`).

A new `getStyledProps(componentName, props)` utility in `@razorpay/blade-svelte/utils` builds the var string: `const { modalStyles } = getStyledProps('modal', { width: '12px' })` → `style="--modal-width: 12px"`. It converts camelCase props to kebab-case vars, drops empty values, and expands the `margin` shorthand into its four longhands.

Migrated every production component that wrote raw inline styles: Accordion, AccordionItemHeader, ActionList, Amount (strikethrough), BaseInput (hint indent), BottomSheet + Backdrop, Checkbox, CheckboxGroup, Chip, CollapsibleBody, CollapsibleLink, CounterInput, InputGroup, InputRow, Modal, ModalBody, OTPInput, PhoneNumberInput's CountrySelector, SegmentedControlIndicator, Skeleton, Switch, TabIndicator, ToastContainer, and Tooltip (portal transform + arrow). Arbitrary-value styled props (margin/zIndex/offsets/grid) on component roots are now fed the same way and consumed through zero-specificity `:where()` rules, so utility classes and style overrides keep winning regardless of CSS source order.

Left out on purpose: CollapsibleBody's imperative expand/collapse animation (frame-by-frame `bodyRef.style.*` writes, not the template attribute), BladeProvider's theme-token vars (already vars-only), and stories/docs/demo/test-harness files (demo-only layout styling).
