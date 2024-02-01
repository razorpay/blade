import {
  getSpacingValue,
  getColorValue,
  getBaseBoxStyles,
  getBorderRadiusValue,
} from '../BaseBox/baseBoxStyles';
import bladeLightTheme from '~components/BladeProvider/__tests__/bladeLightTheme';

export const removeUndefinedValues = (props: Record<string, unknown>): Record<string, unknown> =>
  JSON.parse(JSON.stringify(props));

describe('getColorValue', () => {
  it('should return correct background color value', () => {
    expect(
      getColorValue('interactive.background.primary.default', bladeLightTheme, 'base'),
    ).toMatchInlineSnapshot(`"hsla(227, 100%, 59%, 1)"`);
    expect(getColorValue('red', bladeLightTheme, 'base')).toBe('red');
    expect(getColorValue('red', bladeLightTheme, 'm')).toBe(undefined);
    expect(getColorValue({ base: 'red', s: '#f30' }, bladeLightTheme, 's')).toBe('#f30');
  });
});

describe('getBorderRadiusValue', () => {
  it('should return correct border-radius value', () => {
    expect(getBorderRadiusValue('max', bladeLightTheme, 'base')).toBe('9999px');
    expect(getBorderRadiusValue('small', bladeLightTheme, 'base')).toBe('2px');
    expect(getBorderRadiusValue(undefined, bladeLightTheme, 'm')).toBe(undefined);
    expect(getBorderRadiusValue({ base: 'medium', s: 'max' }, bladeLightTheme, 's')).toBe('9999px');
  });
});

describe('getSpacingValue', () => {
  it('handle tokens, absolute values, and auto', () => {
    expect(getSpacingValue('spacing.1', bladeLightTheme, 'base')).toBe('2px');
    expect(getSpacingValue('spacing.0', bladeLightTheme, 'base')).toBe('0px');
    expect(getSpacingValue('1234px', bladeLightTheme, 'base')).toBe('1234px');
    expect(getSpacingValue('auto', bladeLightTheme, 'base')).toBe('auto');
  });

  it('handle array shorthands', () => {
    expect(getSpacingValue(['spacing.1', '12px', 'auto', '100%'], bladeLightTheme, 'base')).toBe(
      '2px 12px auto 100%',
    );

    expect(getSpacingValue(['spacing.0', '100px'], bladeLightTheme, 'base')).toBe('0px 100px');
    expect(getSpacingValue(['spacing.0', '100px', 'spacing.1'], bladeLightTheme, 'base')).toBe(
      '0px 100px 2px',
    );
  });
});

describe('getBaseBoxStyles', () => {
  it('should add base css property', () => {
    const boxStyles = getBaseBoxStyles({ backgroundColor: 'red', theme: bladeLightTheme });
    const boxStylesWithoutUndefined = JSON.parse(JSON.stringify(boxStyles));
    expect(boxStylesWithoutUndefined).toMatchInlineSnapshot(`
      {
        "backgroundColor": "red",
      }
    `);
  });

  it('should add no css', () => {
    const boxStyles = getBaseBoxStyles({
      theme: bladeLightTheme,
    });
    const boxStylesWithoutUndefined = JSON.parse(JSON.stringify(boxStyles));
    expect(boxStylesWithoutUndefined).toMatchInlineSnapshot(`{}`);
  });
});
