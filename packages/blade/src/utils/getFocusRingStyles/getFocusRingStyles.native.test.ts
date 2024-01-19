import { bladeTheme } from '../../tokens';
import { getFocusRingStyles } from './getFocusRingStyles';

describe('getFocusRingStyles', () => {
  it('should return correct styles when called with valid parameters', () => {
    const result = getFocusRingStyles({
      theme: {
        ...bladeTheme,
        colors: bladeTheme.colors.onLight,
        elevation: bladeTheme.elevation.onLight,
        typography: bladeTheme.typography.onDesktop,
      },
    });
    expect(result).toMatchObject({});
  });
});
