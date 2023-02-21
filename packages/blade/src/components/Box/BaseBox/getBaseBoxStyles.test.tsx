import {
  getResponsiveValue,
  getSpacingValue,
  getBackgroundValue,
  getDependencyProps,
  getBaseBoxStyles,
  shouldAddBreakpoint,
  getBorderRadiusValue,
} from './getBaseBoxStyles';
import type { BaseBoxProps } from './types';
import paymentLightTheme from '~components/BladeProvider/__tests__/paymentLightTheme';

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
    expect(getResponsiveValue({ base: 3, m: 0 }, 'm')).toBe(0);
  });

  it('should return the right responsive value for given size', () => {
    expect(getResponsiveValue({ base: 'base-value', m: 'medium-value' }, 'm')).toBe('medium-value');
    expect(getResponsiveValue({ base: 'base-value', m: 'medium-value' }, 'base')).toBe(
      'base-value',
    );
    expect(getResponsiveValue({ base: 'base-value', m: 'medium-value' }, 's')).toBe(undefined);
  });
});

describe('getDependencyProp', () => {
  it('should return react usememo dependency prop', () => {
    expect(
      getDependencyProps({
        paddingLeft: '12px',
        display: 'block',
        id: 'yo',
        className: 'hi',
        children: 'wuuhuuu',
        // @ts-expect-error: we don't have to care about actual theme object. It is ignored in this function
        theme: { something: 'something' },
      }),
    ).toMatchInlineSnapshot(`"{\\"paddingLeft\\":\\"12px\\",\\"display\\":\\"block\\"}"`);
  });
});

describe('getBackgroundValue', () => {
  it('should return correct background color value', () => {
    expect(
      getBackgroundValue('action.background.primary.active', paymentLightTheme, 'base'),
    ).toMatchInlineSnapshot(`"hsla(227, 100%, 45%, 1)"`);
    expect(getBackgroundValue('red', paymentLightTheme, 'base')).toBe('red');
    expect(getBackgroundValue('red', paymentLightTheme, 'm')).toBe(undefined);
    expect(getBackgroundValue({ base: 'red', m: '#f30' }, paymentLightTheme, 'm')).toBe('#f30');
  });
});

describe('getBorderRadiusValue', () => {
  it('should return correct border-radius value', () => {
    expect(getBorderRadiusValue('max', paymentLightTheme, 'base')).toBe('9999px');
    expect(getBorderRadiusValue('small', paymentLightTheme, 'base')).toBe('2px');
    expect(getBorderRadiusValue(undefined, paymentLightTheme, 'm')).toBe(undefined);
    expect(getBorderRadiusValue({ base: 'medium', m: 'max' }, paymentLightTheme, 'm')).toBe(
      '9999px',
    );
  });
});

describe('shouldAddBreakpoint', () => {
  it('should return false if all values in props are undefined', () => {
    expect(shouldAddBreakpoint({ display: undefined, position: undefined })).toBe(false);
  });

  it('should return false for empty object', () => {
    expect(shouldAddBreakpoint({})).toBe(false);
  });

  it('should return true if one of the value is not undefined', () => {
    expect(shouldAddBreakpoint({ display: '', position: undefined })).toBe(true);
  });
});

describe('getSpacingValue', () => {
  it('handle tokens, absolute values, and auto', () => {
    expect(getSpacingValue('spacing.1', paymentLightTheme, 'base')).toBe('2px');
    expect(getSpacingValue('spacing.0', paymentLightTheme, 'base')).toBe('0px');
    expect(getSpacingValue('1234px', paymentLightTheme, 'base')).toBe('1234px');
    expect(getSpacingValue('auto', paymentLightTheme, 'base')).toBe('auto');
  });

  it('handle array shorthands', () => {
    expect(getSpacingValue(['spacing.1', '12px', 'auto', '100%'], paymentLightTheme, 'base')).toBe(
      '2px 12px auto 100%',
    );

    expect(getSpacingValue(['spacing.0', '100px'], paymentLightTheme, 'base')).toBe('0px 100px');
    expect(getSpacingValue(['spacing.0', '100px', 'spacing.1'], paymentLightTheme, 'base')).toBe(
      '0px 100px 2px',
    );
  });

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
  it('should add base css property', () => {
    const boxStyles = getBaseBoxStyles({ backgroundColor: 'red', theme: paymentLightTheme });
    const boxStylesWithoutUndefined = JSON.parse(JSON.stringify(boxStyles));
    expect(boxStylesWithoutUndefined).toMatchInlineSnapshot(`
      Object {
        "backgroundColor": "red",
      }
    `);
  });

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

  it('should add no css', () => {
    const boxStyles = getBaseBoxStyles({
      theme: paymentLightTheme,
    });
    const boxStylesWithoutUndefined = JSON.parse(JSON.stringify(boxStyles));
    expect(boxStylesWithoutUndefined).toMatchInlineSnapshot(`Object {}`);
  });
});
