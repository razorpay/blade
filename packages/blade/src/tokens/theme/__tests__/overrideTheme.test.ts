import overrideTheme from '../overrideTheme';
import paymentsTheme from '../paymentsTheme';
import { cloneDeep } from '../../../utils';
import { Theme } from '../theme.d';

const invalidOverridesObjectError = '[Blade:overrideTheme]: The overrides object is not valid';
const invalidBaseThemeError =
  '[Blade:overrideTheme]: The base theme provided is not a valid Blade theme';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('overrideTheme', () => {
  it('should return new theme based on overrides', () => {
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

    const overridenTheme: Theme = cloneDeep(paymentsTheme);
    overridenTheme.colors.brand.primary[300] = {
      ...overridenTheme.colors.brand.primary[300],
      ...overrides.colors.brand.primary[300],
    };
    overridenTheme.colors.feedback.background.positive.highContrast = {
      ...overridenTheme.colors.feedback.background.positive.highContrast,
      ...overrides.colors.feedback.background.positive.highContrast,
    };

    const overrideThemeResult = overrideTheme({ baseTheme: paymentsTheme, overrides });
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
        baseTheme: paymentsTheme,
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
