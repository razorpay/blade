import {
  getSpacingValue,
  getBackgroundValue,
  getDependencyProps,
  getBaseBoxStyles,
  shouldAddBreakpoint,
  getBorderRadiusValue,
} from './getBaseBoxStyles';
import paymentLightTheme from '~components/BladeProvider/__tests__/paymentLightTheme';

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
    expect(getBackgroundValue({ base: 'red', s: '#f30' }, paymentLightTheme, 's')).toBe('#f30');
  });
});

describe('getBorderRadiusValue', () => {
  it('should return correct border-radius value', () => {
    expect(getBorderRadiusValue('max', paymentLightTheme, 'base')).toBe('9999px');
    expect(getBorderRadiusValue('small', paymentLightTheme, 'base')).toBe('2px');
    expect(getBorderRadiusValue(undefined, paymentLightTheme, 'm')).toBe(undefined);
    expect(getBorderRadiusValue({ base: 'medium', s: 'max' }, paymentLightTheme, 's')).toBe(
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

  it('should add no css', () => {
    const boxStyles = getBaseBoxStyles({
      theme: paymentLightTheme,
    });
    const boxStylesWithoutUndefined = JSON.parse(JSON.stringify(boxStyles));
    expect(boxStylesWithoutUndefined).toMatchInlineSnapshot(`Object {}`);
  });
});
