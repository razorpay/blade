import { bladeNeutralTheme, bladeTheme, overrideTheme } from '../';
import type { ThemeTokens } from '../theme';
import { hasSameObjectStructure } from '~utils/hasSameObjectStructure';
import type { ObjectWithKeys } from '~utils/hasSameObjectStructure';

describe('bladeNeutralTheme', () => {
  it('should have the correct name', () => {
    expect(bladeNeutralTheme.name).toBe('bladeNeutralTheme');
  });

  it('should satisfy the ThemeTokens type (same structure as bladeTheme)', () => {
    expect(
      hasSameObjectStructure(
        (bladeNeutralTheme as unknown) as ObjectWithKeys,
        (bladeTheme as unknown) as ObjectWithKeys,
      ),
    ).toBe(true);
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

    const result: ThemeTokens = overrideTheme({
      baseThemeTokens: bladeNeutralTheme,
      overrides,
    });

    expect(result.colors.onLight.surface.background.primary.intense).toBe('someothercolor');
    expect(result.name).toBe('bladeNeutralTheme');
  });

  it('should have both onLight and onDark color modes', () => {
    expect(bladeNeutralTheme.colors.onLight).toBeDefined();
    expect(bladeNeutralTheme.colors.onDark).toBeDefined();
  });
});
