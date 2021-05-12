import overrideTheme from '../overrideTheme';
import { paymentTheme, bankingTheme } from '../';
import { cloneDeep } from '../../../utils';
import type { Theme } from '../../theme';

const invalidOverridesObjectError = '[Blade:overrideTheme]: The overrides object is not valid';
const invalidBaseThemeError =
  '[Blade:overrideTheme]: The base theme provided is not a valid Blade theme';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('overrideTheme', () => {
  it('should return new theme based on overrides for paymentTheme', () => {
    const overrides = {
      colors: {
        brand: {
          primary: {
            300: {
              onLight: 'someothercolor',
            },
          },
        },
        feedback: {
          background: {
            positive: {
              highContrast: {
                onLight: 'someothercolor',
              },
            },
          },
        },
      },
    };

    const overridenTheme: Theme = cloneDeep(paymentTheme);
    overridenTheme.colors.brand.primary[300] = {
      ...overridenTheme.colors.brand.primary[300],
      ...overrides.colors.brand.primary[300],
    };
    overridenTheme.colors.feedback.background.positive.highContrast = {
      ...overridenTheme.colors.feedback.background.positive.highContrast,
      ...overrides.colors.feedback.background.positive.highContrast,
    };

    const overrideThemeResult = overrideTheme({ baseTheme: paymentTheme, overrides });
    expect(overrideThemeResult).toEqual(overridenTheme);
  });

  it('should return new theme based on overrides for bankingTheme', () => {
    const overrides = {
      colors: {
        brand: {
          primary: {
            300: {
              onLight: 'someothercolor',
            },
          },
        },
        feedback: {
          background: {
            positive: {
              highContrast: {
                onLight: 'someothercolor',
              },
            },
          },
        },
      },
    };

    const overridenTheme: Theme = cloneDeep(bankingTheme);
    overridenTheme.colors.brand.primary[300] = {
      ...overridenTheme.colors.brand.primary[300],
      ...overrides.colors.brand.primary[300],
    };
    overridenTheme.colors.feedback.background.positive.highContrast = {
      ...overridenTheme.colors.feedback.background.positive.highContrast,
      ...overrides.colors.feedback.background.positive.highContrast,
    };

    const overrideThemeResult = overrideTheme({ baseTheme: bankingTheme, overrides });
    expect(overrideThemeResult).toEqual(overridenTheme);
  });

  it('should throw error when overrides object is invalid', () => {
    const overrides = {
      colors: {
        brand: {
          primary: {
            300: {
              // this will fail the test since empty value is not allowed
              onLight: '',
            },
          },
        },
        feedback: {
          background: {
            positive: {
              highContrast: {
                onLight: 'someothercolor',
              },
            },
          },
        },
      },
    };

    expect(() => {
      overrideTheme({
        baseTheme: paymentTheme,
        overrides,
      });
    }).toThrowError(invalidOverridesObjectError);
  });

  it('should throw error when base theme is invalid', () => {
    const invalidBaseTheme = {
      colors: {
        brand: {
          primary: {
            300: {
              // this will fail the test since empty value is not allowed
              onLight: '',
            },
          },
        },
        feedback: {
          background: {
            positive: {
              highContrast: {
                onLight: 'someothercolor',
              },
            },
          },
        },
      },
    };

    expect(() => {
      overrideTheme({
        // @ts-expect-error test the invalid base theme case
        baseTheme: invalidBaseTheme,
        overrides: invalidBaseTheme,
      });
    }).toThrowError(invalidBaseThemeError);
  });
});
