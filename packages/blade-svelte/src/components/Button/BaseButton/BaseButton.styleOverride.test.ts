import { describe, expect, it } from 'vitest';
import { cx } from '@razorpay/blade-core/utils';
import { getButtonClasses, getButtonTemplateClasses } from '@razorpay/blade-core/styles';
import { resolveComponentStyleOverride } from '../../../utils/resolveComponentStyleOverride';
import type { BladeThemeContextValue } from '../BladeProvider/types';
import type { ButtonSlot, StyleOverride } from '@razorpay/blade-core/styles';

const buttonClasses = getButtonTemplateClasses();

const mockGetter = (
  styleOverride: StyleOverride<ButtonSlot> | undefined,
) => (): BladeThemeContextValue => ({
  theme: {} as BladeThemeContextValue['theme'],
  themeTokens: {} as BladeThemeContextValue['themeTokens'],
  colorScheme: 'light',
  setColorScheme: () => undefined,
  platform: 'web',
  componentConfig: styleOverride ? { Button: { styleOverride } } : undefined,
});

describe('Button styleOverride slot class attachment', () => {
  const resolved = resolveComponentStyleOverride<ButtonSlot>(
    'Button',
    {
      root: 'checkout-cta',
      content: 'checkout-content',
      icon: 'checkout-icon',
      text: 'checkout-label',
      loader: 'checkout-loader',
      avatarGroup: 'checkout-avatars',
    },
    undefined,
  );

  it('folds root override into getButtonClasses className', () => {
    const rootClasses = getButtonClasses({
      variant: 'primary',
      color: 'primary',
      size: 'medium',
      className: cx(resolved?.root),
    });

    expect(rootClasses).toContain('checkout-cta');
  });

  it('attaches content slot class alongside hashed part class', () => {
    const contentClasses = cx(buttonClasses.content, 'focus-ring-child', resolved?.content);

    expect(contentClasses).toContain(buttonClasses.content);
    expect(contentClasses).toContain('checkout-content');
  });

  it('attaches icon slot class alongside hashed part class', () => {
    const iconClasses = cx(buttonClasses.icon, resolved?.icon);

    expect(iconClasses).toContain(buttonClasses.icon);
    expect(iconClasses).toContain('checkout-icon');
  });

  it('passes text slot as BaseText className', () => {
    expect(resolved?.text).toBe('checkout-label');
  });

  it('attaches loader slot class to dots loader element', () => {
    const loaderClasses = cx(buttonClasses.dotsLoader, resolved?.loader);

    expect(loaderClasses).toContain(buttonClasses.dotsLoader);
    expect(loaderClasses).toContain('checkout-loader');
  });

  it('attaches avatarGroup slot class alongside hashed part class', () => {
    const avatarGroupClasses = cx(buttonClasses.avatarGroup, resolved?.avatarGroup);

    expect(avatarGroupClasses).toContain(buttonClasses.avatarGroup);
    expect(avatarGroupClasses).toContain('checkout-avatars');
  });

  it('instance override wins over provider for root slot', () => {
    const getter = mockGetter({ root: 'provider-cta', text: 'provider-label' });
    const merged = resolveComponentStyleOverride<ButtonSlot>(
      'Button',
      { root: 'instance-cta' },
      getter,
    );

    const rootClasses = getButtonClasses({
      variant: 'primary',
      color: 'primary',
      size: 'medium',
      className: cx(merged?.root),
    });

    expect(rootClasses).toContain('instance-cta');
    expect(rootClasses).not.toContain('provider-cta');
  });
});
