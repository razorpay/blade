import cloneDeep from 'lodash/cloneDeep';
import overrideTheme from '../overrideTheme';
import { bladeTheme } from '../';
import type { ThemeTokens } from '../../theme';

const invalidOverridesObjectError = '[Blade: overrideTheme]: The overrides object is not valid';
const invalidBaseThemeError =
  '[Blade: overrideTheme]: The base theme provided is not a valid Blade theme';

describe('overrideTheme', () => {
  it('should return new theme based on overrides for bladeTheme', () => {
    const overrides = {
      colors: {
        onLight: {
          brand: {
            primary: {
              300: 'someothercolor',
            },
          },
          feedback: {
            background: {
              positive: {
                highContrast: 'someothercolor',
              },
            },
          },
        },
      },
    };

    const overridenTheme: ThemeTokens = cloneDeep(bladeTheme);
    overridenTheme.colors.onLight.brand.primary[300] = overrides.colors.onLight.brand.primary[300];
    overridenTheme.colors.onLight.feedback.background.positive.highContrast =
      overrides.colors.onLight.feedback.background.positive.highContrast;

    const overrideThemeResult = overrideTheme({ baseThemeTokens: bladeTheme, overrides });
    expect(overrideThemeResult).toEqual(overridenTheme);
  });

  it('should return new theme based on overrides for bankingTheme', () => {
    const overrides = {
      colors: {
        onLight: {
          brand: {
            primary: {
              300: 'someothercolor',
            },
          },
          feedback: {
            background: {
              positive: {
                highContrast: 'someothercolor',
              },
            },
          },
        },
      },
    };

    const overridenTheme: ThemeTokens = cloneDeep(bladeTheme);
    overridenTheme.colors.onLight.brand.primary[300] = overrides.colors.onLight.brand.primary[300];
    overridenTheme.colors.onLight.feedback.background.positive.highContrast =
      overrides.colors.onLight.feedback.background.positive.highContrast;

    const overrideThemeResult = overrideTheme({ baseThemeTokens: bladeTheme, overrides });
    expect(overrideThemeResult).toEqual(overridenTheme);
  });

  it('should throw error when overrides object is invalid', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    const overrides = {
      colors: {
        onLight: {
          brand: {
            primary: {
              // this will fail the test since empty value is not allowed
              300: '',
            },
          },
          feedback: {
            background: {
              positive: {
                highContrast: 'someothercolor',
              },
            },
          },
        },
      },
    };

    expect(() => {
      overrideTheme({
        baseThemeTokens: bladeTheme,
        overrides,
      });
    }).toThrowError(invalidOverridesObjectError);
    mockConsoleError.mockRestore();
  });

  it('should throw error when base theme is invalid', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    const invalidBaseTheme = {
      colors: {
        onLight: {
          brand: {
            primary: {
              // this will fail the test since empty value is not allowed
              300: '',
            },
          },
          feedback: {
            background: {
              positive: {
                highContrast: 'someothercolor',
              },
            },
          },
        },
      },
    };

    expect(() => {
      overrideTheme({
        // @ts-expect-error test the invalid base theme case
        baseThemeTokens: invalidBaseTheme,
        overrides: invalidBaseTheme,
      });
    }).toThrowError(invalidBaseThemeError);
    mockConsoleError.mockRestore();
  });
});
