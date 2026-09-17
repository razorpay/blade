import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import InputGroupPerFieldValidation from './InputGroupPerFieldValidation.svelte';

// Regression coverage for CB-053 / B-032: InputGroup's own `validationState`
// only drives the group-level hint text — it is intentionally NOT propagated
// through inputGroupContext to child inputs (only `size`/`isDisabled` are).
// Each child keeps its own `validationState` prop, so per-field error
// highlighting already works without any group-level override.
describe('<InputGroup /> per-field validation', () => {
  it('only marks the invalid field, not every field in the group', async () => {
    render(InputGroupPerFieldValidation);

    const cardNumber = await screen.findByPlaceholderText('Card Number');
    const cvv = await screen.findByPlaceholderText('CVV');

    expect(cardNumber).toHaveAttribute('aria-invalid', 'true');
    expect(cvv).not.toHaveAttribute('aria-invalid', 'true');
  });
});
