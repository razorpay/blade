import { render } from '@testing-library/react';
import { bladeNeutralTheme, bladeTheme, overrideTheme } from '../';
import { BladeProvider } from '~components/BladeProvider';
import { Button } from '~components/Button';
import type { ThemeTokens } from '../theme';

describe('bladeNeutralTheme', () => {
  it('should satisfy the ThemeTokens type', () => {
    const theme: ThemeTokens = bladeNeutralTheme;
    expect(theme).toBeDefined();
    expect(theme.name).toBe('bladeNeutralTheme');
  });

  it('should have the same object structure as bladeTheme', () => {
    expect(bladeNeutralTheme).toEqual(
      expect.objectContaining({
        name: 'bladeNeutralTheme',
        border: bladeTheme.border,
        backdropBlur: bladeTheme.backdropBlur,
        breakpoints: bladeTheme.breakpoints,
        motion: bladeTheme.motion,
        spacing: bladeTheme.spacing,
        elevation: bladeTheme.elevation,
        typography: bladeTheme.typography,
      }),
    );
  });

  it('should pass through overrideTheme without shape errors', () => {
    const overrides = {
      colors: {
        onLight: {
          surface: {
            background: {
              primary: {
                intense: 'someothercolor',
              },
            },
          },
        },
      },
    };

    const overrideThemeResult = overrideTheme({
      baseThemeTokens: bladeNeutralTheme,
      overrides,
    });

    expect(overrideThemeResult).toBeDefined();
    expect(overrideThemeResult.name).toBe('bladeNeutralTheme');
    expect(overrideThemeResult.colors.onLight.surface.background.primary.intense).toBe(
      'someothercolor',
    );
  });

  it('should render with BladeProvider without shape errors', () => {
    const { getByRole } = render(
      <BladeProvider themeTokens={bladeNeutralTheme} colorScheme="light">
        <Button>Pay now</Button>
      </BladeProvider>,
    );

    expect(getByRole('button')).toBeTruthy();
  });
});
