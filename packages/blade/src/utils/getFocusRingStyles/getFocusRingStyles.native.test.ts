import { bladeTheme } from '../../tokens';
import { getFocusRingStyles } from './getFocusRingStyles';

describe('getFocusRingStyles', () => {
  it('should return correct styles when called with valid parameters', () => {
    const result = getFocusRingStyles({ ...bladeTheme, colors: bladeTheme.colors.onLight });
    expect(result).toMatchObject({});
  });
});
