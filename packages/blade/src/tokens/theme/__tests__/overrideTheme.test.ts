import cloneDeep from 'lodash/cloneDeep';
import overrideTheme from '../overrideTheme';
import { paymentTheme, bankingTheme } from '../';
import type { ThemeTokens } from '../../theme';

const invalidOverridesObjectError =
  '[@razorpay/blade:overrideTheme]: The overrides object is not valid';
const invalidBaseThemeError =
  '[@razorpay/blade:overrideTheme]: The base theme provided is not a valid Blade theme';

describe('overrideTheme', () => {
  it('should return new theme based on overrides for paymentTheme', () => {
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

    const overridenTheme: ThemeTokens = cloneDeep(paymentTheme);
    overridenTheme.colors.onLight.brand.primary[300] = overrides.colors.onLight.brand.primary[300];
    overridenTheme.colors.onLight.feedback.background.positive.highContrast =
      overrides.colors.onLight.feedback.background.positive.highContrast;

    const overrideThemeResult = overrideTheme({ baseThemeTokens: paymentTheme, overrides });
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

    const overridenTheme: ThemeTokens = cloneDeep(bankingTheme);
    overridenTheme.colors.onLight.brand.primary[300] = overrides.colors.onLight.brand.primary[300];
    overridenTheme.colors.onLight.feedback.background.positive.highContrast =
      overrides.colors.onLight.feedback.background.positive.highContrast;

    const overrideThemeResult = overrideTheme({ baseThemeTokens: bankingTheme, overrides });
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
        baseThemeTokens: paymentTheme,
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
