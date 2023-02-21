import { getBaseBoxStyles, getResponsiveValue, getSpacingValue } from './getBaseBoxStyles';
import type { BaseBoxProps } from './types';
import paymentLightTheme from '~components/BladeProvider/__tests__/paymentLightTheme/paymentLightTheme';

describe('getResponsiveValue', () => {
  it('should return correctly for plain values', () => {
    expect(getResponsiveValue('hello', 'base')).toBe('hello');
    expect(getResponsiveValue('hello', 'xs')).toBe(undefined);
  });

  it('should correctly handle falsy values', () => {
    expect(getResponsiveValue(undefined)).toBe(undefined);
    // @ts-expect-error: intentional null to check the falsy values
    expect(getResponsiveValue(null)).toBe(undefined);
    expect(getResponsiveValue(0)).toBe(0);
    expect(getResponsiveValue('')).toBe('');
    expect(getResponsiveValue({ base: 3, s: 0 })).toBe(0);
  });

  it('should return responsive values in decreasing sequence starting from s token', () => {
    expect(getResponsiveValue({ base: 'base-value', xs: 'xs-value', s: 'small-value' })).toBe(
      'small-value',
    );
    expect(getResponsiveValue({ base: 'base-value', xs: 'xs-value' })).toBe('xs-value');
    expect(getResponsiveValue({ base: 'base-value' })).toBe('base-value');
    expect(getResponsiveValue({ m: 'medium-value' })).toBe(undefined);
  });
});

describe('getSpacingValue', () => {
  it('should always return s token value if exist', () => {
    expect(getSpacingValue('spacing.2', paymentLightTheme, 'base')).toBe('4px');
    expect(getSpacingValue('spacing.2', paymentLightTheme, 'm')).toBe(undefined);

    const responsiveSpacingProp: BaseBoxProps['padding'] = {
      base: 'spacing.10',
      xs: '12px',
      s: ['spacing.1', '12px', '100%', 'auto'],
    };
    expect(getSpacingValue(responsiveSpacingProp, paymentLightTheme, 'base')).toBe(
      '2px 12px 100% auto',
    );
    expect(getSpacingValue(responsiveSpacingProp, paymentLightTheme, 'xs')).toBe(
      '2px 12px 100% auto',
    );
  });
});

describe('getBaseBoxStyles', () => {
  it('should return s token value', () => {
    const boxStyles = getBaseBoxStyles({
      margin: {
        base: 'spacing.1',
        s: ['spacing.1', '12px', '100%'],
        m: '22px',
        xl: 'auto',
      },
      theme: paymentLightTheme,
    });
    const boxStylesWithoutUndefined = JSON.parse(JSON.stringify(boxStyles));
    expect(boxStylesWithoutUndefined).toMatchInlineSnapshot(`
      Object {
        "margin": "2px 12px 100%",
      }
    `);
  });
});
