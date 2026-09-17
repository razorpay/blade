import { describe, expect, it } from 'vitest';
import { resolveComponentStyleOverride } from '../../../utils/resolveComponentStyleOverride';
import type { BladeThemeContextValue } from '../../BladeProvider/types';
import type { AmountSlot, StyleOverride } from '@razorpay/blade-core/styles';

const mockGetter = (
  styleOverride: StyleOverride<AmountSlot> | undefined,
) => (): BladeThemeContextValue => ({
  theme: {} as BladeThemeContextValue['theme'],
  themeTokens: {} as BladeThemeContextValue['themeTokens'],
  colorScheme: 'light',
  setColorScheme: () => undefined,
  platform: 'web',
  componentConfig: styleOverride ? { Amount: { styleOverride } } : undefined,
});

describe('Amount styleOverride slot class attachment', () => {
  const resolved = resolveComponentStyleOverride<AmountSlot>(
    'Amount',
    {
      currency: 'checkout-currency',
      value: 'checkout-value',
    },
    undefined,
  );

  it('passes currency slot as BaseText className', () => {
    expect(resolved?.currency).toBe('checkout-currency');
  });

  it('passes value slot for numeric spans (single-span and split decimals paths)', () => {
    expect(resolved?.value).toBe('checkout-value');
  });

  it('instance override wins over provider for value slot', () => {
    const getter = mockGetter({ value: 'provider-value', currency: 'provider-currency' });
    const merged = resolveComponentStyleOverride<AmountSlot>(
      'Amount',
      { value: 'instance-value' },
      getter,
    );

    expect(merged?.value).toBe('instance-value');
    expect(merged?.currency).toBe('provider-currency');
  });
});
