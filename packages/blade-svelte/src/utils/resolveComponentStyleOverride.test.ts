import { describe, expect, it } from 'vitest';
import { resolveComponentStyleOverride } from './resolveComponentStyleOverride';
import type { BladeThemeContextValue } from '../components/BladeProvider/types';
import type { ButtonSlot } from '@razorpay/blade-core/styles';

const mockGetter = (
  componentConfig: BladeThemeContextValue['componentConfig'],
) => (): BladeThemeContextValue => ({
  theme: {} as BladeThemeContextValue['theme'],
  themeTokens: {} as BladeThemeContextValue['themeTokens'],
  colorScheme: 'light',
  setColorScheme: () => undefined,
  platform: 'web',
  componentConfig,
});

describe('resolveComponentStyleOverride', () => {
  it('returns instance override when no provider context', () => {
    expect(
      resolveComponentStyleOverride<ButtonSlot>(
        'Button',
        { root: 'instance-cta', text: 'instance-label' },
        undefined,
      ),
    ).toEqual({
      root: 'instance-cta',
      text: 'instance-label',
    });
  });

  it('merges provider config with instance override; instance wins on conflicts', () => {
    const getter = mockGetter({
      Button: {
        styleOverride: { root: 'provider-cta', text: 'provider-label', icon: 'provider-icon' },
      },
    });

    expect(
      resolveComponentStyleOverride<ButtonSlot>(
        'Button',
        { root: 'instance-cta', content: 'instance-content' },
        getter,
      ),
    ).toEqual({
      root: 'instance-cta',
      text: 'provider-label',
      icon: 'provider-icon',
      content: 'instance-content',
    });
  });

  it('returns provider override when instance override is undefined', () => {
    const getter = mockGetter({
      Button: { styleOverride: { root: 'provider-cta' } },
    });

    expect(resolveComponentStyleOverride<ButtonSlot>('Button', undefined, getter)).toEqual({
      root: 'provider-cta',
    });
  });
});
