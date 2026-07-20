import { describe, expect, it } from 'vitest';
import { cx } from '@razorpay/blade-core/utils';
import { utilityClasses } from '@razorpay/blade-core/styles';
import { resolveComponentStyleOverride } from '../../../utils/resolveComponentStyleOverride';
import type { BladeThemeContextValue } from '../../BladeProvider/types';
import type { AmountSlot, StyleOverride } from '@razorpay/blade-core/styles';

const mockGetter = (
  styleOverride: StyleOverride<AmountSlot> | undefined,
) => (): BladeThemeContextValue => ({
  theme: {} as BladeThemeContextValue['theme'],
  themeTokens: {} as BladeThemeContextValue['themeTokens'],
  colorScheme: 'light',
  setColorScheme: () => {},
  platform: 'web',
  componentConfig: styleOverride ? { Amount: { styleOverride } } : undefined,
});

describe('Amount styleOverride slot class attachment', () => {
  const resolved = resolveComponentStyleOverride<AmountSlot>(
    'Amount',
    {
      root: 'checkout-amount-root',
      content: 'checkout-amount-content',
      currency: 'checkout-currency',
      value: 'checkout-value',
      integer: 'checkout-integer',
      decimal: 'checkout-decimal',
      minusSign: 'checkout-minus',
      strikethrough: 'checkout-strike',
    },
    undefined,
  );

  it('folds root override into outer container classes', () => {
    const rootClasses = cx(
      utilityClasses['display-inline-flex'],
      utilityClasses['flex-direction-row'],
      resolved?.root,
    );

    expect(rootClasses).toContain('checkout-amount-root');
  });

  it('attaches content slot on inner baseline wrapper', () => {
    const contentClasses = cx(
      utilityClasses['display-inline-flex'],
      utilityClasses['flex-direction-row'],
      utilityClasses['position-relative'],
      resolved?.content,
    );

    expect(contentClasses).toContain('checkout-amount-content');
  });

  it('passes currency slot as BaseText className', () => {
    expect(resolved?.currency).toBe('checkout-currency');
  });

  it('passes value slot as BaseText className on single-span path', () => {
    expect(resolved?.value).toBe('checkout-value');
  });

  it('passes integer and decimal slots on split decimals path', () => {
    expect(resolved?.integer).toBe('checkout-integer');
    expect(resolved?.decimal).toBe('checkout-decimal');
  });

  it('passes minusSign slot as BaseText className', () => {
    expect(resolved?.minusSign).toBe('checkout-minus');
  });

  it('attaches strikethrough slot on overlay element', () => {
    const strikeClasses = cx(utilityClasses['position-absolute'], resolved?.strikethrough);

    expect(strikeClasses).toContain(utilityClasses['position-absolute']);
    expect(strikeClasses).toContain('checkout-strike');
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
