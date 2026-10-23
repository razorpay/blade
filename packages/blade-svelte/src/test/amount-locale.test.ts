import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';

describe('Amount and the provider’s locale', () => {
  it('formats with adapters.locale, follows a change, and its own locale wins', async () => {
    const { default: Harness } = await import('./fixtures/AmountLocaleHarness.svelte');
    const { getByTestId, rerender } = render(Harness, { props: { locale: 'en-IN' } });
    expect(getByTestId('amount').textContent).toContain('12,34,567');
    await rerender({ locale: 'en-US' });
    expect(getByTestId('amount').textContent).toContain('1,234,567');
    await rerender({ locale: 'en-US', ownLocale: 'en-IN' });
    expect(getByTestId('amount').textContent).toContain('12,34,567');
  });
});
