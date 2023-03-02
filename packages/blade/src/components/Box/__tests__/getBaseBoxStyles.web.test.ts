import {
  getBaseBoxStyles,
  getResponsiveValue,
  getSpacingValue,
  shouldAddBreakpoint,
  getAllMediaQueries,
  getAllProps,
} from '../BaseBox/getBaseBoxStyles';
import type { BaseBoxProps } from '../BaseBox/types';
import { removeUndefinedValues } from './getBaseBoxStyles.test';
import paymentLightTheme from '~components/BladeProvider/__tests__/paymentLightTheme/paymentLightTheme';
import type { Theme } from '~components/BladeProvider';

describe('getResponsiveValue', () => {
  it('should return correctly for plain values', () => {
    expect(getResponsiveValue('hello', 'base')).toBe('hello');
    expect(getResponsiveValue('hello', 'xs')).toBe(undefined);
  });

  it('should correctly handle falsy values', () => {
    expect(getResponsiveValue(undefined, 'base')).toBe(undefined);
    // @ts-expect-error: intentional null to check the falsy values
    expect(getResponsiveValue(null, 'base')).toBe(undefined);
    expect(getResponsiveValue(0, 'base')).toBe(0);
    expect(getResponsiveValue('', 'base')).toBe('');
    expect(getResponsiveValue({ base: 3, s: 0 }, 's')).toBe(0);
  });

  it('should return the right responsive value for given size', () => {
    expect(getResponsiveValue({ base: 'base-value', m: 'medium-value' }, 'm')).toBe('medium-value');
    expect(getResponsiveValue({ base: 'base-value', m: 'medium-value' }, 'base')).toBe(
      'base-value',
    );
    expect(getResponsiveValue({ base: 'base-value', m: 'medium-value' }, 's')).toBe(undefined);
  });
});

describe('shouldAddBreakpoint', () => {
  it('should return false if all values in props are undefined', () => {
    expect(shouldAddBreakpoint({ display: undefined, position: undefined })).toBe(false);
  });

  it('should return false for empty object', () => {
    expect(shouldAddBreakpoint({})).toBe(false);
  });

  it('should return true if one of the value is defined', () => {
    expect(shouldAddBreakpoint({ display: '', position: undefined })).toBe(true);
  });
});

describe('getSpacingValue', () => {
  it('should return correct responsive spacing value', () => {
    expect(getSpacingValue('spacing.2', paymentLightTheme, 'base')).toBe('4px');
    expect(getSpacingValue('spacing.2', paymentLightTheme, 'm')).toBe(undefined);

    const responsiveSpacingProp: BaseBoxProps['padding'] = {
      base: 'spacing.10',
      xs: '12px',
      s: ['spacing.1', '12px', '100%', 'auto'],
    };
    expect(getSpacingValue(responsiveSpacingProp, paymentLightTheme, 'base')).toBe('48px');
    expect(getSpacingValue(responsiveSpacingProp, paymentLightTheme, 'xs')).toBe('12px');
    expect(getSpacingValue(responsiveSpacingProp, paymentLightTheme, 's')).toBe(
      '2px 12px 100% auto',
    );
  });
});

describe('getBaseBoxStyles', () => {
  it('should add given media queries', () => {
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
            "@media screen and (min-width: 1200px)": Object {
              "margin": "auto",
            },
            "@media screen and (min-width: 480px)": Object {
              "margin": "2px 12px 100%",
            },
            "@media screen and (min-width: 768px)": Object {
              "margin": "22px",
            },
            "margin": "2px",
          }
      `);
  });
});

describe('getAllMediaQueries', () => {
  it('should return empty object', () => {
    expect(
      removeUndefinedValues(getAllMediaQueries({ display: 'block', theme: paymentLightTheme })),
    ).toMatchInlineSnapshot(`Object {}`);
  });

  it('should return the media queries', () => {
    expect(
      removeUndefinedValues(
        getAllMediaQueries({
          display: { base: 'block', m: 'none', xl: 'flex' },
          theme: paymentLightTheme,
        }),
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "@media screen and (min-width: 1200px)": Object {
          "display": "flex",
        },
        "@media screen and (min-width: 768px)": Object {
          "display": "none",
        },
      }
    `);
  });
});

describe('getAllProps', () => {
  it('should return all values for given screen size', () => {
    const baseBoxProps: BaseBoxProps & { theme: Theme } = {
      display: 'block',
      padding: { base: 'spacing.1', l: '20px' },
      margin: { m: 'spacing.1' },
      theme: paymentLightTheme,
    };

    expect(removeUndefinedValues(getAllProps(baseBoxProps))).toMatchInlineSnapshot(`
      Object {
        "display": "block",
        "padding": "2px",
      }
    `);

    expect(removeUndefinedValues(getAllProps(baseBoxProps, 'm'))).toMatchInlineSnapshot(`
      Object {
        "margin": "2px",
      }
    `);

    expect(removeUndefinedValues(getAllProps(baseBoxProps, 'l'))).toMatchInlineSnapshot(`
      Object {
        "padding": "20px",
      }
    `);
  });
});
