# API Decision Critique

Evaluate component API decisions against Blade's established patterns. Surface only real inconsistencies — not stylistic preferences.

## Grounding step

Before reviewing, sample 3–5 similar existing components to confirm current conventions:

```bash
ls packages/blade/src/components/
```

Use their type definitions as the source of truth — API decision docs may be outdated.

## Prop naming conventions

- **Booleans**: `isDisabled`, `isLoading`, `isSelected`, `isChecked`, `isOpen`, `isRequired`, `isFullWidth` — always `is` prefix, never bare (`disabled`, `loading`) or negated (`notEnabled`)
- **Event handlers**: `onClick`, `onChange`, `onBlur`, `onFocus`, `onOpenChange`, `onDismiss` — always `on` + PascalCase verb
- **Accessibility**: `accessibilityLabel` (not `ariaLabel`, `aria-label`, `a11yLabel`)
- **Test hooks**: `testID` (not `data-testid`, `dataTestId`)
- **Size**: `size` prop with token values (`xsmall`, `small`, `medium`, `large`, `xlarge`) — not `isSmall`/`isLarge` booleans
- **Variant semantics**: `variant` for structural variants; `color` or `intent` only where a well-established Blade pattern already exists

## Component naming conventions

Composable components (Modal, Card, Drawer, Tabs, StepGroup) use flat named subcomponents:

```jsx
<Modal>
  <ModalHeader />
  <ModalBody />
  <ModalFooter />
</Modal>
```

Never dot-notation (`Modal.Header`, `Modal.Body`).

Atomic components (Button, Link, inputs) are single flat components.

## Structural consistency

- Does the new prop overlap with an existing prop that already covers the use case?
- Does the component structure mirror similar components (e.g. does a new input follow the same shape as `TextInput`)?
- Are breaking changes introduced without a deprecation path?
