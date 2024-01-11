import { bladeTheme } from '../../tokens';
import { getFocusRingStyles } from './getFocusRingStyles';

describe('getFocusRingStyles', () => {
  it('should return correct styles when called with valid parameters', () => {
    const result = getFocusRingStyles({ ...bladeTheme, colors: bladeTheme.colors.onLight });
    expect(result).toMatchObject({
      outline: '4px solid hsla(227, 100%, 59%, 0.18)',
      outlineOffset: '1px',
      transitionDuration: '70ms',
      transitionProperty: 'outline-width',
      transitionTimingFunction: 'cubic-bezier(0.3, 0, 0.2, 1)',
    });
  });
});
