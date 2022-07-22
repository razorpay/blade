import { isPartialMatchObjectKeys } from './isPartialMatchObjectKeys';

const baseTheme = {
  colors: {
    brand: {
      primary: {
        300: {
          onLight: 'somecolor',
          onDark: 'somecolor',
        },
      },
    },
    feedback: {
      background: {
        positive: {
          highContrast: {
            onLight: 'somevalue',
            onDark: 'somevalue',
          },
          lowContrast: {
            onLight: 'somevalue',
            onDark: 'somevalue',
          },
        },
      },
    },
  },
};

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('isPartialMatchObjectKeys', () => {
  it('should return "true" when objectToMatch is subset of objectToInspect', () => {
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

    const isPartialMatchObjectKeysResult = isPartialMatchObjectKeys({
      objectToMatch: overrides,
      objectToInspect: baseTheme,
    });
    expect(isPartialMatchObjectKeysResult).toBe(true);
  });

  it('should return "false" when objectToMatch has different keys than objectToInspect', () => {
    const overrides = {
      mycolors: {
        mybrand: {
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

    const isPartialMatchObjectKeysResult = isPartialMatchObjectKeys({
      // @ts-expect-error checking the error case
      objectToMatch: overrides,
      objectToInspect: baseTheme,
    });
    expect(isPartialMatchObjectKeysResult).toBe(false);
  });

  it('should return "false" when objectToMatch has falsy values for keys in objectToInspect', () => {
    const overrides = {
      colors: {
        brand: {
          primary: {
            300: {
              onLight: 'someothervalue',
            },
          },
        },
        feedback: {
          background: {
            positive: {
              highContrast: {
                onLight: '',
              },
            },
          },
        },
      },
    };

    const isPartialMatchObjectKeysResult = isPartialMatchObjectKeys({
      objectToMatch: overrides,
      objectToInspect: baseTheme,
    });
    expect(isPartialMatchObjectKeysResult).toBe(false);
  });
});
