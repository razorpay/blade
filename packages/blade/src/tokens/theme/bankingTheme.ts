import type { ThemeTokens, ColorsWithModes } from './theme';
import {
  border,
  breakpoints,
  colors as globalColors,
  motion,
  spacing,
  typography,
  elevation,
} from '~tokens/global';

const colors: ColorsWithModes = {
  onLight: {
    surface: {
      background: {
        level1: {
          lowContrast: globalColors.neutral.navyGrayLight[100],
          highContrast: globalColors.neutral.navyGrayLight[1200],
        },
        level2: {
          lowContrast: globalColors.neutral.navyGrayLight[0],
          highContrast: globalColors.neutral.navyGrayLight[1100],
        },
        level3: {
          lowContrast: globalColors.neutral.navyGrayLight[50],
          highContrast: globalColors.neutral.navyGrayLight[1000],
        },
      },
      border: {
        normal: {
          lowContrast: globalColors.neutral.navyGrayLight.a100,
          highContrast: globalColors.neutral.navyGrayLight.a400,
        },
        subtle: {
          lowContrast: globalColors.neutral.navyGrayLight.a50,
          highContrast: globalColors.neutral.navyGrayLight.a300,
        },
      },
      text: {
        normal: {
          lowContrast: globalColors.neutral.navyGrayLight[1200],
          highContrast: globalColors.neutral.navyGrayLight[0],
        },
        subtle: {
          lowContrast: globalColors.neutral.navyGrayLight[900],
          highContrast: globalColors.neutral.navyGrayLight[100],
        },
        subdued: {
          lowContrast: globalColors.neutral.navyGrayLight[800],
          highContrast: globalColors.neutral.navyGrayLight[300],
        },
        muted: {
          lowContrast: globalColors.neutral.navyGrayLight[600],
          highContrast: globalColors.neutral.navyGrayLight[400],
        },
        placeholder: {
          lowContrast: globalColors.neutral.navyGrayLight[500],
          highContrast: globalColors.neutral.navyGrayLight[500],
        },
      },
      action: {
        icon: {
          default: {
            lowContrast: globalColors.neutral.navyGrayLight[500],
            highContrast: globalColors.neutral.navyGrayLight.a500,
          },
          hover: {
            lowContrast: globalColors.neutral.navyGrayLight[800],
            highContrast: globalColors.neutral.navyGrayLight[0],
          },
          focus: {
            lowContrast: globalColors.neutral.navyGrayLight[800],
            highContrast: globalColors.neutral.navyGrayLight[0],
          },
          active: {
            lowContrast: globalColors.neutral.navyGrayLight[800],
            highContrast: globalColors.neutral.navyGrayLight[0],
          },
          disabled: {
            lowContrast: globalColors.neutral.navyGrayLight.a100,
            highContrast: globalColors.neutral.navyGrayLight.a100,
          },
        },
      },
      overlay: {
        background: {
          400: globalColors.neutral.navyGrayLight.a1100,
          800: globalColors.neutral.ashGrayLight.a1100,
        },
      },
      popup: { background: globalColors.neutral.navyGrayLight[700] },
    },
    overlay: {
      background: globalColors.neutral.ashGrayLight.a1100,
    },
    brand: {
      primary: {
        300: globalColors.chromatic.azure.a50,
        400: globalColors.chromatic.azure.a100,
        500: globalColors.chromatic.azure[600],
        600: globalColors.chromatic.azure[700],
        700: globalColors.chromatic.azure[800],
        800: globalColors.chromatic.azure[950],
      },
      gray: {
        200: {
          lowContrast: globalColors.neutral.navyGrayLight[50],
          highContrast: globalColors.neutral.navyGrayLight[1000],
        },
        300: {
          lowContrast: globalColors.neutral.navyGrayLight[100],
          highContrast: globalColors.neutral.navyGrayLight[900],
        },
        400: {
          lowContrast: globalColors.neutral.navyGrayLight[300],
          highContrast: globalColors.neutral.navyGrayLight[800],
        },
        500: {
          lowContrast: globalColors.neutral.navyGrayLight[500],
          highContrast: globalColors.neutral.navyGrayLight[700],
        },
        600: {
          lowContrast: globalColors.neutral.navyGrayLight[600],
          highContrast: globalColors.neutral.navyGrayLight[500],
        },
        700: {
          lowContrast: globalColors.neutral.navyGrayLight[800],
          highContrast: globalColors.neutral.navyGrayLight[100],
        },
        a50: {
          lowContrast: globalColors.neutral.navyGrayLight.a50,
          highContrast: globalColors.neutral.navyGrayLight.a300,
        },
        a100: {
          lowContrast: globalColors.neutral.navyGrayLight.a100,
          highContrast: globalColors.neutral.navyGrayLight.a400,
        },
      },
      secondary: { 500: globalColors.chromatic.cider[600] },
    },
    feedback: {
      background: {
        positive: {
          lowContrast: globalColors.chromatic.emerald.a50,
          highContrast: globalColors.chromatic.emerald[700],
        },
        negative: {
          lowContrast: globalColors.chromatic.crimson.a50,
          highContrast: globalColors.chromatic.crimson[700],
        },
        notice: {
          lowContrast: globalColors.chromatic.cider.a50,
          highContrast: globalColors.chromatic.cider[700],
        },
        information: {
          lowContrast: globalColors.chromatic.sapphire.a50,
          highContrast: globalColors.chromatic.sapphire[600],
        },
        neutral: {
          lowContrast: globalColors.neutral.navyGrayLight.a50,
          highContrast: globalColors.neutral.navyGrayLight[1000],
        },
      },
      border: {
        positive: {
          lowContrast: globalColors.chromatic.emerald.a200,
          highContrast: globalColors.chromatic.emerald[700],
        },
        negative: {
          lowContrast: globalColors.chromatic.crimson.a200,
          highContrast: globalColors.chromatic.crimson[700],
        },
        notice: {
          lowContrast: globalColors.chromatic.cider.a200,
          highContrast: globalColors.chromatic.cider[700],
        },
        information: {
          lowContrast: globalColors.chromatic.sapphire.a200,
          highContrast: globalColors.chromatic.sapphire[600],
        },
        neutral: {
          lowContrast: globalColors.neutral.navyGrayLight.a200,
          highContrast: globalColors.neutral.navyGrayLight[1000],
        },
      },
      text: {
        positive: {
          lowContrast: globalColors.chromatic.emerald[700],
          highContrast: globalColors.neutral.navyGrayLight[0],
        },
        negative: {
          lowContrast: globalColors.chromatic.crimson[700],
          highContrast: globalColors.neutral.navyGrayLight[0],
        },
        notice: {
          lowContrast: globalColors.chromatic.cider[700],
          highContrast: globalColors.neutral.navyGrayLight[0],
        },
        information: {
          lowContrast: globalColors.chromatic.sapphire[600],
          highContrast: globalColors.neutral.navyGrayLight[0],
        },
        neutral: {
          lowContrast: globalColors.neutral.navyGrayLight[900],
          highContrast: globalColors.neutral.navyGrayLight[0],
        },
      },
      icon: {
        positive: {
          lowContrast: globalColors.chromatic.emerald[700],
          highContrast: globalColors.neutral.navyGrayLight[0],
        },
        negative: {
          lowContrast: globalColors.chromatic.crimson[700],
          highContrast: globalColors.neutral.navyGrayLight[0],
        },
        notice: {
          lowContrast: globalColors.chromatic.cider[700],
          highContrast: globalColors.neutral.navyGrayLight[0],
        },
        information: {
          lowContrast: globalColors.chromatic.sapphire[600],
          highContrast: globalColors.neutral.navyGrayLight[0],
        },
        neutral: {
          lowContrast: globalColors.neutral.navyGrayLight[900],
          highContrast: globalColors.neutral.navyGrayLight[0],
        },
      },
      positive: {
        action: {
          background: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.emerald[700],
                lowContrast: globalColors.chromatic.emerald.a50,
              },
              hover: {
                highContrast: globalColors.chromatic.emerald[800],
                lowContrast: globalColors.chromatic.emerald.a100,
              },
              focus: {
                highContrast: globalColors.chromatic.emerald[900],
                lowContrast: globalColors.chromatic.emerald.a200,
              },
              active: {
                highContrast: globalColors.chromatic.emerald[900],
                lowContrast: globalColors.chromatic.emerald.a100,
              },
              disabled: {
                highContrast: globalColors.chromatic.emerald[700],
                lowContrast: globalColors.chromatic.emerald.a50,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.emerald.a50 },
              hover: { lowContrast: globalColors.chromatic.emerald.a100 },
              focus: { lowContrast: globalColors.chromatic.emerald.a200 },
              active: { lowContrast: globalColors.chromatic.emerald.a100 },
              disabled: { lowContrast: globalColors.chromatic.emerald.a50 },
            },
          },
          border: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald.a200,
              },
              hover: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald.a200,
              },
              focus: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald.a200,
              },
              active: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald.a200,
              },
              disabled: {
                highContrast: globalColors.chromatic.emerald[500],
                lowContrast: globalColors.chromatic.emerald.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.emerald.a200 },
              hover: { lowContrast: globalColors.chromatic.emerald.a200 },
              focus: { lowContrast: globalColors.chromatic.emerald.a200 },
              active: { lowContrast: globalColors.chromatic.emerald.a200 },
              disabled: { lowContrast: globalColors.chromatic.emerald.a200 },
            },
          },
          text: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[700],
              },
              hover: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[700],
              },
              focus: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[700],
              },
              active: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[700],
              },
              disabled: {
                highContrast: globalColors.chromatic.emerald[500],
                lowContrast: globalColors.chromatic.emerald.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.emerald[700] },
              hover: { lowContrast: globalColors.chromatic.emerald[700] },
              focus: { lowContrast: globalColors.chromatic.emerald[700] },
              active: { lowContrast: globalColors.chromatic.emerald[700] },
              disabled: { lowContrast: globalColors.chromatic.emerald.a200 },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald[600],
                highContrast: globalColors.chromatic.emerald[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald[800],
                highContrast: globalColors.chromatic.emerald[100],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald[800],
                highContrast: globalColors.chromatic.emerald[100],
              },
              disabled: {
                lowContrast: globalColors.chromatic.emerald[200],
                highContrast: globalColors.chromatic.emerald[100],
              },
            },
          },
          icon: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[700],
              },
              hover: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[700],
              },
              focus: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[700],
              },
              active: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[700],
              },
              disabled: {
                highContrast: globalColors.chromatic.emerald[500],
                lowContrast: globalColors.chromatic.emerald.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.emerald[700] },
              hover: { lowContrast: globalColors.chromatic.emerald[700] },
              focus: { lowContrast: globalColors.chromatic.emerald[700] },
              active: { lowContrast: globalColors.chromatic.emerald[700] },
              disabled: { lowContrast: globalColors.chromatic.emerald.a200 },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald[600],
                highContrast: globalColors.chromatic.emerald[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald[800],
                highContrast: globalColors.chromatic.emerald[100],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald[800],
                highContrast: globalColors.chromatic.emerald[100],
              },
              disabled: {
                lowContrast: globalColors.chromatic.emerald[200],
                highContrast: globalColors.chromatic.emerald[100],
              },
            },
          },
        },
      },
      negative: {
        action: {
          background: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.crimson[700],
                lowContrast: globalColors.chromatic.crimson.a50,
              },
              hover: {
                highContrast: globalColors.chromatic.crimson[800],
                lowContrast: globalColors.chromatic.crimson.a100,
              },
              focus: {
                highContrast: globalColors.chromatic.crimson[900],
                lowContrast: globalColors.chromatic.crimson.a200,
              },
              active: {
                highContrast: globalColors.chromatic.crimson[900],
                lowContrast: globalColors.chromatic.crimson.a200,
              },
              disabled: {
                highContrast: globalColors.chromatic.crimson[700],
                lowContrast: globalColors.chromatic.crimson.a50,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.crimson.a50 },
              hover: { lowContrast: globalColors.chromatic.crimson.a100 },
              focus: { lowContrast: globalColors.chromatic.crimson.a200 },
              active: { lowContrast: globalColors.chromatic.crimson.a200 },
              disabled: { lowContrast: globalColors.chromatic.crimson.a50 },
            },
          },
          border: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson.a200,
              },
              hover: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson.a200,
              },
              focus: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson.a200,
              },
              active: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson.a200,
              },
              disabled: {
                highContrast: globalColors.chromatic.crimson[500],
                lowContrast: globalColors.chromatic.crimson.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.crimson.a200 },
              hover: { lowContrast: globalColors.chromatic.crimson.a200 },
              focus: { lowContrast: globalColors.chromatic.crimson.a200 },
              active: { lowContrast: globalColors.chromatic.crimson.a200 },
              disabled: { lowContrast: globalColors.chromatic.crimson.a200 },
            },
          },
          text: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[700],
              },
              hover: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[700],
              },
              focus: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[700],
              },
              active: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[700],
              },
              disabled: {
                highContrast: globalColors.chromatic.crimson[500],
                lowContrast: globalColors.chromatic.crimson.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.crimson[700] },
              hover: { lowContrast: globalColors.chromatic.crimson[700] },
              focus: { lowContrast: globalColors.chromatic.crimson[700] },
              active: { lowContrast: globalColors.chromatic.crimson[700] },
              disabled: { lowContrast: globalColors.chromatic.crimson.a200 },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.crimson[700],
                highContrast: globalColors.chromatic.crimson[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.crimson[600],
                highContrast: globalColors.chromatic.crimson[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.crimson[800],
                highContrast: globalColors.chromatic.crimson[100],
              },
              active: {
                lowContrast: globalColors.chromatic.crimson[800],
                highContrast: globalColors.chromatic.crimson[100],
              },
              disabled: {
                lowContrast: globalColors.chromatic.crimson.a200,
                highContrast: globalColors.chromatic.crimson[500],
              },
            },
          },
          icon: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[700],
              },
              hover: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[700],
              },
              focus: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[700],
              },
              active: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[700],
              },
              disabled: {
                highContrast: globalColors.chromatic.crimson[500],
                lowContrast: globalColors.chromatic.crimson.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.crimson[700] },
              hover: { lowContrast: globalColors.chromatic.crimson[700] },
              focus: { lowContrast: globalColors.chromatic.crimson[700] },
              active: { lowContrast: globalColors.chromatic.crimson[700] },
              disabled: { lowContrast: globalColors.chromatic.crimson.a200 },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.crimson[700],
                highContrast: globalColors.chromatic.crimson[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.crimson[600],
                highContrast: globalColors.chromatic.crimson[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.crimson[800],
                highContrast: globalColors.chromatic.crimson[100],
              },
              active: {
                lowContrast: globalColors.chromatic.crimson[800],
                highContrast: globalColors.chromatic.crimson[100],
              },
              disabled: {
                lowContrast: globalColors.chromatic.crimson.a200,
                highContrast: globalColors.chromatic.crimson[500],
              },
            },
          },
        },
      },
      notice: {
        action: {
          background: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.cider[700],
                lowContrast: globalColors.chromatic.cider.a50,
              },
              hover: {
                highContrast: globalColors.chromatic.cider[800],
                lowContrast: globalColors.chromatic.cider.a100,
              },
              focus: {
                highContrast: globalColors.chromatic.cider[900],
                lowContrast: globalColors.chromatic.cider.a200,
              },
              active: {
                highContrast: globalColors.chromatic.cider[900],
                lowContrast: globalColors.chromatic.cider.a200,
              },
              disabled: {
                highContrast: globalColors.chromatic.cider[700],
                lowContrast: globalColors.chromatic.cider.a50,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.cider.a50 },
              hover: { lowContrast: globalColors.chromatic.cider.a100 },
              focus: { lowContrast: globalColors.chromatic.cider.a200 },
              active: { lowContrast: globalColors.chromatic.cider.a200 },
              disabled: { lowContrast: globalColors.chromatic.cider.a50 },
            },
          },
          border: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider.a200,
              },
              hover: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider.a200,
              },
              focus: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider.a200,
              },
              active: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider.a200,
              },
              disabled: {
                highContrast: globalColors.chromatic.cider[500],
                lowContrast: globalColors.chromatic.cider.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.cider.a200 },
              hover: { lowContrast: globalColors.chromatic.cider.a200 },
              focus: { lowContrast: globalColors.chromatic.cider.a200 },
              active: { lowContrast: globalColors.chromatic.cider.a200 },
              disabled: { lowContrast: globalColors.chromatic.cider.a200 },
            },
          },
          text: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[700],
              },
              hover: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[700],
              },
              focus: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[700],
              },
              active: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[700],
              },
              disabled: {
                highContrast: globalColors.chromatic.cider[500],
                lowContrast: globalColors.chromatic.cider.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.cider[700] },
              hover: { lowContrast: globalColors.chromatic.cider[700] },
              focus: { lowContrast: globalColors.chromatic.cider[700] },
              active: { lowContrast: globalColors.chromatic.cider[700] },
              disabled: { lowContrast: globalColors.chromatic.cider.a200 },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.cider[700],
                highContrast: globalColors.chromatic.cider[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.cider[600],
                highContrast: globalColors.chromatic.cider[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.cider[800],
                highContrast: globalColors.chromatic.cider[100],
              },
              active: {
                lowContrast: globalColors.chromatic.cider[800],
                highContrast: globalColors.chromatic.cider[100],
              },
              disabled: {
                lowContrast: globalColors.chromatic.cider.a200,
                highContrast: globalColors.chromatic.cider[500],
              },
            },
          },
          icon: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[700],
              },
              hover: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[700],
              },
              focus: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[700],
              },
              active: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[700],
              },
              disabled: {
                highContrast: globalColors.chromatic.cider[500],
                lowContrast: globalColors.chromatic.cider.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.cider[700] },
              hover: { lowContrast: globalColors.chromatic.cider[700] },
              focus: { lowContrast: globalColors.chromatic.cider[700] },
              active: { lowContrast: globalColors.chromatic.cider[700] },
              disabled: { lowContrast: globalColors.chromatic.cider.a200 },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.cider[700],
                highContrast: globalColors.chromatic.cider[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.cider[600],
                highContrast: globalColors.chromatic.cider[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.cider[800],
                highContrast: globalColors.chromatic.cider[100],
              },
              active: {
                lowContrast: globalColors.chromatic.cider[800],
                highContrast: globalColors.chromatic.cider[100],
              },
              disabled: {
                lowContrast: globalColors.chromatic.cider.a200,
                highContrast: globalColors.chromatic.cider[500],
              },
            },
          },
        },
      },
      information: {
        action: {
          background: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.sapphire[600],
                lowContrast: globalColors.chromatic.sapphire.a50,
              },
              hover: {
                highContrast: globalColors.chromatic.sapphire[700],
                lowContrast: globalColors.chromatic.sapphire.a100,
              },
              focus: {
                highContrast: globalColors.chromatic.sapphire[800],
                lowContrast: globalColors.chromatic.sapphire.a200,
              },
              active: {
                highContrast: globalColors.chromatic.sapphire[800],
                lowContrast: globalColors.chromatic.sapphire.a200,
              },
              disabled: {
                highContrast: globalColors.chromatic.sapphire[600],
                lowContrast: globalColors.chromatic.sapphire.a50,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.sapphire.a50 },
              hover: { lowContrast: globalColors.chromatic.sapphire.a100 },
              focus: { lowContrast: globalColors.chromatic.sapphire.a200 },
              active: { lowContrast: globalColors.chromatic.sapphire.a200 },
              disabled: { lowContrast: globalColors.chromatic.sapphire.a50 },
            },
          },
          border: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire.a200,
              },
              hover: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire.a200,
              },
              focus: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire.a200,
              },
              active: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire.a200,
              },
              disabled: {
                highContrast: globalColors.chromatic.sapphire[400],
                lowContrast: globalColors.chromatic.sapphire.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.sapphire.a200 },
              hover: { lowContrast: globalColors.chromatic.sapphire.a200 },
              focus: { lowContrast: globalColors.chromatic.sapphire.a200 },
              active: { lowContrast: globalColors.chromatic.sapphire.a200 },
              disabled: { lowContrast: globalColors.chromatic.sapphire.a200 },
            },
          },
          text: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[700],
              },
              hover: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[700],
              },
              focus: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[700],
              },
              active: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[700],
              },
              disabled: {
                highContrast: globalColors.chromatic.sapphire[400],
                lowContrast: globalColors.chromatic.sapphire.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.sapphire[700] },
              hover: { lowContrast: globalColors.chromatic.sapphire[700] },
              focus: { lowContrast: globalColors.chromatic.sapphire[700] },
              active: { lowContrast: globalColors.chromatic.sapphire[700] },
              disabled: { lowContrast: globalColors.chromatic.sapphire.a200 },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.sapphire[600],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.sapphire[800],
                highContrast: globalColors.chromatic.sapphire[100],
              },
              active: {
                lowContrast: globalColors.chromatic.sapphire[800],
                highContrast: globalColors.chromatic.sapphire[100],
              },
              disabled: {
                lowContrast: globalColors.chromatic.sapphire.a200,
                highContrast: globalColors.chromatic.sapphire[400],
              },
            },
          },
          icon: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[700],
              },
              hover: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[700],
              },
              focus: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[700],
              },
              active: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[700],
              },
              disabled: {
                highContrast: globalColors.chromatic.sapphire[400],
                lowContrast: globalColors.chromatic.sapphire.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.sapphire[700] },
              hover: { lowContrast: globalColors.chromatic.sapphire[700] },
              focus: { lowContrast: globalColors.chromatic.sapphire[700] },
              active: { lowContrast: globalColors.chromatic.sapphire[700] },
              disabled: { lowContrast: globalColors.chromatic.sapphire.a200 },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.sapphire[600],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.sapphire[800],
                highContrast: globalColors.chromatic.sapphire[100],
              },
              active: {
                lowContrast: globalColors.chromatic.sapphire[800],
                highContrast: globalColors.chromatic.sapphire[100],
              },
              disabled: {
                lowContrast: globalColors.chromatic.sapphire.a200,
                highContrast: globalColors.chromatic.sapphire[400],
              },
            },
          },
        },
      },
      neutral: {
        action: {
          background: {
            primary: {
              default: {
                highContrast: globalColors.neutral.navyGrayLight[1000],
                lowContrast: globalColors.neutral.navyGrayLight.a50,
              },
              hover: {
                highContrast: globalColors.neutral.navyGrayLight[1100],
                lowContrast: globalColors.neutral.navyGrayLight.a100,
              },
              focus: {
                highContrast: globalColors.neutral.navyGrayLight[1200],
                lowContrast: globalColors.neutral.navyGrayLight.a200,
              },
              active: {
                highContrast: globalColors.neutral.navyGrayLight[1200],
                lowContrast: globalColors.neutral.navyGrayLight.a200,
              },
              disabled: {
                highContrast: globalColors.neutral.navyGrayLight[1000],
                lowContrast: globalColors.neutral.navyGrayLight.a50,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.neutral.navyGrayLight.a50 },
              hover: { lowContrast: globalColors.neutral.navyGrayLight.a100 },
              focus: { lowContrast: globalColors.neutral.navyGrayLight.a200 },
              active: { lowContrast: globalColors.neutral.navyGrayLight.a200 },
              disabled: { lowContrast: globalColors.neutral.navyGrayLight.a50 },
            },
          },
          border: {
            primary: {
              default: {
                highContrast: globalColors.neutral.navyGrayLight[500],
                lowContrast: globalColors.neutral.navyGrayLight.a200,
              },
              hover: {
                highContrast: globalColors.neutral.navyGrayLight[500],
                lowContrast: globalColors.neutral.navyGrayLight.a200,
              },
              focus: {
                highContrast: globalColors.neutral.navyGrayLight[500],
                lowContrast: globalColors.neutral.navyGrayLight.a200,
              },
              active: {
                highContrast: globalColors.neutral.navyGrayLight[500],
                lowContrast: globalColors.neutral.navyGrayLight.a200,
              },
              disabled: {
                highContrast: globalColors.neutral.navyGrayLight[700],
                lowContrast: globalColors.neutral.navyGrayLight.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.neutral.navyGrayLight.a200 },
              hover: { lowContrast: globalColors.neutral.navyGrayLight.a200 },
              focus: { lowContrast: globalColors.neutral.navyGrayLight.a200 },
              active: { lowContrast: globalColors.neutral.navyGrayLight.a200 },
              disabled: { lowContrast: globalColors.neutral.navyGrayLight.a200 },
            },
          },
          text: {
            primary: {
              default: {
                highContrast: globalColors.neutral.navyGrayLight[50],
                lowContrast: globalColors.neutral.navyGrayLight[900],
              },
              hover: {
                highContrast: globalColors.neutral.navyGrayLight[50],
                lowContrast: globalColors.neutral.navyGrayLight[900],
              },
              focus: {
                highContrast: globalColors.neutral.navyGrayLight[50],
                lowContrast: globalColors.neutral.navyGrayLight[900],
              },
              active: {
                highContrast: globalColors.neutral.navyGrayLight[50],
                lowContrast: globalColors.neutral.navyGrayLight[900],
              },
              disabled: {
                highContrast: globalColors.neutral.navyGrayLight[700],
                lowContrast: globalColors.neutral.navyGrayLight.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.neutral.navyGrayLight[900] },
              hover: { lowContrast: globalColors.neutral.navyGrayLight[900] },
              focus: { lowContrast: globalColors.neutral.navyGrayLight[900] },
              active: { lowContrast: globalColors.neutral.navyGrayLight[900] },
              disabled: { lowContrast: globalColors.neutral.navyGrayLight.a200 },
            },
            link: {
              default: {
                lowContrast: globalColors.neutral.navyGrayLight[900],
                highContrast: globalColors.neutral.navyGrayLight[50],
              },
              hover: {
                lowContrast: globalColors.neutral.navyGrayLight[800],
                highContrast: globalColors.neutral.navyGrayLight[200],
              },
              focus: {
                lowContrast: globalColors.neutral.navyGrayLight[1000],
                highContrast: globalColors.neutral.navyGrayLight[400],
              },
              active: {
                lowContrast: globalColors.neutral.navyGrayLight[1000],
                highContrast: globalColors.neutral.navyGrayLight[400],
              },
              disabled: {
                lowContrast: globalColors.neutral.navyGrayLight.a200,
                highContrast: globalColors.neutral.navyGrayLight[700],
              },
            },
          },
          icon: {
            primary: {
              default: {
                highContrast: globalColors.neutral.navyGrayLight[50],
                lowContrast: globalColors.neutral.navyGrayLight[900],
              },
              hover: {
                highContrast: globalColors.neutral.navyGrayLight[50],
                lowContrast: globalColors.neutral.navyGrayLight[900],
              },
              focus: {
                highContrast: globalColors.neutral.navyGrayLight[50],
                lowContrast: globalColors.neutral.navyGrayLight[900],
              },
              active: {
                highContrast: globalColors.neutral.navyGrayLight[50],
                lowContrast: globalColors.neutral.navyGrayLight[900],
              },
              disabled: {
                highContrast: globalColors.neutral.navyGrayLight[700],
                lowContrast: globalColors.neutral.navyGrayLight.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.neutral.navyGrayLight[900] },
              hover: { lowContrast: globalColors.neutral.navyGrayLight[900] },
              focus: { lowContrast: globalColors.neutral.navyGrayLight[900] },
              active: { lowContrast: globalColors.neutral.navyGrayLight[900] },
              disabled: { lowContrast: globalColors.neutral.navyGrayLight.a200 },
            },
            link: {
              default: {
                lowContrast: globalColors.neutral.navyGrayLight[900],
                highContrast: globalColors.neutral.navyGrayLight[50],
              },
              hover: {
                lowContrast: globalColors.neutral.navyGrayLight[800],
                highContrast: globalColors.neutral.navyGrayLight[200],
              },
              focus: {
                lowContrast: globalColors.neutral.navyGrayLight[1000],
                highContrast: globalColors.neutral.navyGrayLight[400],
              },
              active: {
                lowContrast: globalColors.neutral.navyGrayLight[1000],
                highContrast: globalColors.neutral.navyGrayLight[400],
              },
              disabled: {
                lowContrast: globalColors.neutral.navyGrayLight.a200,
                highContrast: globalColors.neutral.navyGrayLight[700],
              },
            },
          },
        },
      },
    },
    action: {
      background: {
        primary: {
          default: globalColors.chromatic.azure[600],
          hover: globalColors.chromatic.azure[700],
          focus: globalColors.chromatic.azure[800],
          active: globalColors.chromatic.azure[900],
          disabled: globalColors.neutral.navyGrayLight[300],
        },
        secondary: {
          default: globalColors.chromatic.azure.a00,
          hover: globalColors.chromatic.azure.a50,
          focus: globalColors.chromatic.azure.a100,
          active: globalColors.chromatic.azure.a200,
          disabled: globalColors.neutral.navyGrayLight.a00,
        },
        tertiary: {
          default: globalColors.neutral.navyGrayLight.a50,
          hover: globalColors.neutral.navyGrayLight.a100,
          focus: globalColors.neutral.navyGrayLight.a200,
          active: globalColors.neutral.navyGrayLight.a200,
          disabled: globalColors.neutral.navyGrayLight.a50,
        },
      },
      border: {
        primary: {
          default: globalColors.chromatic.azure[600],
          hover: globalColors.chromatic.azure[700],
          focus: globalColors.chromatic.azure[800],
          active: globalColors.chromatic.azure[900],
          disabled: globalColors.neutral.navyGrayLight[300],
        },
        secondary: {
          default: globalColors.chromatic.azure[600],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[600],
          active: globalColors.chromatic.azure[600],
          disabled: globalColors.neutral.navyGrayLight[400],
        },
        tertiary: {
          default: globalColors.neutral.navyGrayLight.a00,
          hover: globalColors.neutral.navyGrayLight[400],
          focus: globalColors.neutral.navyGrayLight[400],
          active: globalColors.neutral.navyGrayLight[400],
          disabled: globalColors.neutral.navyGrayLight[300],
        },
      },
      text: {
        primary: {
          default: globalColors.neutral.navyGrayLight[0],
          hover: globalColors.neutral.navyGrayLight[0],
          focus: globalColors.neutral.navyGrayLight[0],
          active: globalColors.neutral.navyGrayLight[0],
          disabled: globalColors.neutral.navyGrayLight[600],
        },
        secondary: {
          default: globalColors.chromatic.azure[600],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[600],
          active: globalColors.chromatic.azure[600],
          disabled: globalColors.neutral.navyGrayLight[400],
        },
        tertiary: {
          default: globalColors.neutral.navyGrayLight[1000],
          hover: globalColors.neutral.navyGrayLight[1000],
          focus: globalColors.neutral.navyGrayLight[1000],
          active: globalColors.neutral.navyGrayLight[1000],
          disabled: globalColors.neutral.navyGrayLight[400],
        },
        link: {
          default: globalColors.chromatic.azure[600],
          hover: globalColors.chromatic.azure[700],
          focus: globalColors.chromatic.azure[800],
          active: globalColors.chromatic.azure[800],
          disabled: globalColors.neutral.navyGrayLight[400],
          visited: globalColors.chromatic.orchid[400],
        },
      },
      icon: {
        primary: {
          default: globalColors.neutral.navyGrayLight[0],
          hover: globalColors.neutral.navyGrayLight[0],
          focus: globalColors.neutral.navyGrayLight[0],
          active: globalColors.neutral.navyGrayLight[0],
          disabled: globalColors.neutral.navyGrayLight[600],
        },
        secondary: {
          default: globalColors.chromatic.azure[600],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[600],
          active: globalColors.chromatic.azure[600],
          disabled: globalColors.neutral.navyGrayLight[400],
        },
        tertiary: {
          default: globalColors.neutral.navyGrayLight[1000],
          hover: globalColors.neutral.navyGrayLight[1000],
          focus: globalColors.neutral.navyGrayLight[1000],
          active: globalColors.neutral.navyGrayLight[1000],
          disabled: globalColors.neutral.navyGrayLight[400],
        },
        link: {
          default: globalColors.chromatic.azure[600],
          hover: globalColors.chromatic.azure[700],
          focus: globalColors.chromatic.azure[800],
          active: globalColors.chromatic.azure[800],
          disabled: globalColors.neutral.navyGrayLight[400],
          visited: globalColors.chromatic.orchid[400],
        },
      },
    },
    static: { white: globalColors.neutral.ashGrayLight[0] },
    white: {
      action: {
        background: {
          primary: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[200],
            focus: globalColors.neutral.ashGrayLight[300],
            active: globalColors.neutral.ashGrayLight[300],
            disabled: globalColors.neutral.ashGrayLight.a400,
          },
          secondary: {
            default: globalColors.neutral.ashGrayLight.a00,
            hover: globalColors.neutral.ashGrayLight.a400,
            focus: globalColors.neutral.ashGrayLight.a500,
            active: globalColors.neutral.ashGrayLight.a500,
            disabled: globalColors.neutral.ashGrayLight.a00,
          },
          tertiary: {
            default: globalColors.neutral.ashGrayLight.a300,
            hover: globalColors.neutral.ashGrayLight.a400,
            focus: globalColors.neutral.ashGrayLight.a500,
            active: globalColors.neutral.ashGrayLight.a500,
            disabled: globalColors.neutral.ashGrayLight.a300,
          },
        },
        border: {
          primary: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[200],
            focus: globalColors.neutral.ashGrayLight[300],
            active: globalColors.neutral.ashGrayLight[300],
            disabled: globalColors.neutral.ashGrayLight.a400,
          },
          secondary: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[0],
            focus: globalColors.neutral.ashGrayLight[0],
            active: globalColors.neutral.ashGrayLight[0],
            disabled: globalColors.neutral.ashGrayLight.a500,
          },
          tertiary: {
            default: globalColors.neutral.ashGrayLight.a00,
            hover: globalColors.neutral.ashGrayLight.a00,
            focus: globalColors.neutral.ashGrayLight.a00,
            active: globalColors.neutral.ashGrayLight.a00,
            disabled: globalColors.neutral.ashGrayLight.a00,
          },
        },
        text: {
          primary: {
            default: globalColors.chromatic.azure[600],
            hover: globalColors.chromatic.azure[600],
            focus: globalColors.chromatic.azure[600],
            active: globalColors.chromatic.azure[600],
            disabled: globalColors.neutral.ashGrayLight.a500,
          },
          secondary: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[0],
            focus: globalColors.neutral.ashGrayLight[0],
            active: globalColors.neutral.ashGrayLight[0],
            disabled: globalColors.neutral.ashGrayLight.a500,
          },
          tertiary: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[0],
            focus: globalColors.neutral.ashGrayLight[0],
            active: globalColors.neutral.ashGrayLight[0],
            disabled: globalColors.neutral.ashGrayLight.a500,
          },
          link: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[300],
            focus: globalColors.neutral.ashGrayLight[400],
            active: globalColors.neutral.ashGrayLight[400],
            disabled: globalColors.neutral.ashGrayLight.a500,
            visited: globalColors.chromatic.orchid[400],
          },
        },
        icon: {
          primary: {
            default: globalColors.chromatic.azure[600],
            hover: globalColors.chromatic.azure[600],
            focus: globalColors.chromatic.azure[600],
            active: globalColors.chromatic.azure[600],
            disabled: globalColors.neutral.ashGrayLight.a500,
          },
          secondary: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[0],
            focus: globalColors.neutral.ashGrayLight[0],
            active: globalColors.neutral.ashGrayLight[0],
            disabled: globalColors.neutral.ashGrayLight.a500,
          },
          tertiary: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[0],
            focus: globalColors.neutral.ashGrayLight[0],
            active: globalColors.neutral.ashGrayLight[0],
            disabled: globalColors.neutral.ashGrayLight.a500,
          },
          link: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[300],
            focus: globalColors.neutral.ashGrayLight[400],
            active: globalColors.neutral.ashGrayLight[400],
            disabled: globalColors.neutral.ashGrayLight.a500,
            visited: globalColors.chromatic.orchid[400],
          },
        },
      },
    },
    badge: {
      background: {
        blue: {
          lowContrast: globalColors.chromatic.azure.a50,
          highContrast: globalColors.chromatic.azure[600],
        },
      },
      border: {
        blue: {
          lowContrast: globalColors.chromatic.azure.a200,
          highContrast: globalColors.chromatic.azure[600],
        },
      },
      text: {
        blue: {
          lowContrast: globalColors.chromatic.azure[600],
          highContrast: globalColors.neutral.navyGrayLight[0],
        },
      },
      icon: {
        blue: {
          lowContrast: globalColors.chromatic.azure[600],
          highContrast: globalColors.neutral.navyGrayLight[0],
        },
      },
    },
  },
  onDark: {
    surface: {
      background: {
        level1: {
          lowContrast: globalColors.neutral.navyGrayDark[1300],
          highContrast: globalColors.neutral.navyGrayDark[800],
        },
        level2: {
          lowContrast: globalColors.neutral.navyGrayDark[1100],
          highContrast: globalColors.neutral.navyGrayDark[700],
        },
        level3: {
          lowContrast: globalColors.neutral.navyGrayDark[900],
          highContrast: globalColors.neutral.navyGrayDark[600],
        },
      },
      border: {
        normal: {
          lowContrast: globalColors.neutral.navyGrayDark.a100,
          highContrast: globalColors.neutral.navyGrayDark.a400,
        },
        subtle: {
          lowContrast: globalColors.neutral.navyGrayDark.a50,
          highContrast: globalColors.neutral.navyGrayDark.a300,
        },
      },
      text: {
        normal: {
          lowContrast: globalColors.neutral.navyGrayDark[0],
          highContrast: globalColors.neutral.navyGrayDark[0],
        },
        subtle: {
          lowContrast: globalColors.neutral.navyGrayDark[50],
          highContrast: globalColors.neutral.navyGrayDark[50],
        },
        subdued: {
          lowContrast: globalColors.neutral.navyGrayDark[100],
          highContrast: globalColors.neutral.navyGrayDark[100],
        },
        muted: {
          lowContrast: globalColors.neutral.navyGrayDark[200],
          highContrast: globalColors.neutral.navyGrayDark[200],
        },
        placeholder: {
          lowContrast: globalColors.neutral.navyGrayDark[300],
          highContrast: globalColors.neutral.navyGrayDark[300],
        },
      },
      action: {
        icon: {
          default: {
            lowContrast: globalColors.neutral.navyGrayDark[400],
            highContrast: globalColors.neutral.navyGrayDark.a200,
          },
          hover: {
            lowContrast: globalColors.neutral.navyGrayDark[200],
            highContrast: globalColors.neutral.navyGrayDark[0],
          },
          focus: {
            lowContrast: globalColors.neutral.navyGrayDark[200],
            highContrast: globalColors.neutral.navyGrayDark[0],
          },
          active: {
            lowContrast: globalColors.neutral.navyGrayDark[200],
            highContrast: globalColors.neutral.navyGrayDark[0],
          },
          disabled: {
            lowContrast: globalColors.neutral.navyGrayDark.a100,
            highContrast: globalColors.neutral.navyGrayDark.a100,
          },
        },
      },
      overlay: {
        background: {
          400: globalColors.neutral.navyGrayDark.a1100,
          800: globalColors.neutral.ashGrayDark.a1100,
        },
      },
      popup: { background: globalColors.neutral.navyGrayDark[700] },
    },
    overlay: {
      background: globalColors.neutral.ashGrayDark.a1100,
    },
    brand: {
      primary: {
        300: globalColors.chromatic.azure.a100,
        400: globalColors.chromatic.azure.a200,
        500: globalColors.chromatic.azure[400],
        600: globalColors.chromatic.azure[500],
        700: globalColors.chromatic.azure[600],
        800: globalColors.chromatic.azure[900],
      },
      gray: {
        200: {
          lowContrast: globalColors.neutral.navyGrayDark[800],
          highContrast: globalColors.neutral.navyGrayDark[600],
        },
        300: {
          lowContrast: globalColors.neutral.navyGrayDark[700],
          highContrast: globalColors.neutral.navyGrayDark[500],
        },
        400: {
          lowContrast: globalColors.neutral.navyGrayDark[600],
          highContrast: globalColors.neutral.navyGrayDark[400],
        },
        500: {
          lowContrast: globalColors.neutral.navyGrayDark[500],
          highContrast: globalColors.neutral.navyGrayDark[300],
        },
        600: {
          lowContrast: globalColors.neutral.navyGrayDark[400],
          highContrast: globalColors.neutral.navyGrayDark[200],
        },
        700: {
          lowContrast: globalColors.neutral.navyGrayDark[200],
          highContrast: globalColors.neutral.navyGrayDark[50],
        },
        a50: {
          lowContrast: globalColors.neutral.navyGrayDark.a50,
          highContrast: globalColors.neutral.navyGrayDark.a300,
        },
        a100: {
          lowContrast: globalColors.neutral.navyGrayDark.a100,
          highContrast: globalColors.neutral.navyGrayDark.a400,
        },
      },
      secondary: { 500: globalColors.chromatic.cider[600] },
    },
    feedback: {
      background: {
        positive: {
          lowContrast: globalColors.chromatic.emerald.a100,
          highContrast: globalColors.chromatic.emerald[700],
        },
        negative: {
          lowContrast: globalColors.chromatic.crimson.a100,
          highContrast: globalColors.chromatic.crimson[700],
        },
        notice: {
          lowContrast: globalColors.chromatic.cider.a100,
          highContrast: globalColors.chromatic.cider[800],
        },
        information: {
          lowContrast: globalColors.chromatic.sapphire.a100,
          highContrast: globalColors.chromatic.sapphire[600],
        },
        neutral: {
          lowContrast: globalColors.neutral.navyGrayDark.a100,
          highContrast: globalColors.neutral.navyGrayDark.a100,
        },
      },
      border: {
        positive: {
          lowContrast: globalColors.chromatic.emerald.a200,
          highContrast: globalColors.chromatic.emerald[700],
        },
        negative: {
          lowContrast: globalColors.chromatic.crimson.a200,
          highContrast: globalColors.chromatic.crimson[700],
        },
        notice: {
          lowContrast: globalColors.chromatic.cider.a200,
          highContrast: globalColors.chromatic.cider[800],
        },
        information: {
          lowContrast: globalColors.chromatic.sapphire.a200,
          highContrast: globalColors.chromatic.sapphire[600],
        },
        neutral: {
          lowContrast: globalColors.neutral.navyGrayDark.a200,
          highContrast: globalColors.neutral.navyGrayDark[50],
        },
      },
      text: {
        positive: {
          lowContrast: globalColors.chromatic.emerald[500],
          highContrast: globalColors.neutral.navyGrayDark[0],
        },
        negative: {
          lowContrast: globalColors.chromatic.crimson[400],
          highContrast: globalColors.neutral.navyGrayDark[0],
        },
        notice: {
          lowContrast: globalColors.chromatic.cider[400],
          highContrast: globalColors.neutral.navyGrayDark[0],
        },
        information: {
          lowContrast: globalColors.chromatic.sapphire[400],
          highContrast: globalColors.neutral.navyGrayDark[0],
        },
        neutral: {
          lowContrast: globalColors.neutral.navyGrayDark[100],
          highContrast: globalColors.neutral.navyGrayDark[50],
        },
      },
      icon: {
        positive: {
          lowContrast: globalColors.chromatic.emerald[500],
          highContrast: globalColors.neutral.navyGrayDark[0],
        },
        negative: {
          lowContrast: globalColors.chromatic.crimson[400],
          highContrast: globalColors.neutral.navyGrayDark[0],
        },
        notice: {
          lowContrast: globalColors.chromatic.cider[400],
          highContrast: globalColors.neutral.navyGrayDark[0],
        },
        information: {
          lowContrast: globalColors.chromatic.sapphire[400],
          highContrast: globalColors.neutral.navyGrayDark[0],
        },
        neutral: {
          lowContrast: globalColors.neutral.navyGrayDark[100],
          highContrast: globalColors.neutral.navyGrayDark[50],
        },
      },
      positive: {
        action: {
          background: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.emerald[700],
                lowContrast: globalColors.chromatic.emerald.a50,
              },
              hover: {
                highContrast: globalColors.chromatic.emerald[800],
                lowContrast: globalColors.chromatic.emerald.a100,
              },
              focus: {
                highContrast: globalColors.chromatic.emerald[900],
                lowContrast: globalColors.chromatic.emerald.a200,
              },
              active: {
                highContrast: globalColors.chromatic.emerald[900],
                lowContrast: globalColors.chromatic.emerald.a200,
              },
              disabled: {
                highContrast: globalColors.chromatic.emerald[700],
                lowContrast: globalColors.chromatic.emerald.a50,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.emerald.a50 },
              hover: { lowContrast: globalColors.chromatic.emerald.a100 },
              focus: { lowContrast: globalColors.chromatic.emerald.a200 },
              active: { lowContrast: globalColors.chromatic.emerald.a200 },
              disabled: { lowContrast: globalColors.chromatic.emerald.a50 },
            },
          },
          border: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[700],
              },
              hover: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[700],
              },
              focus: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[700],
              },
              active: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[700],
              },
              disabled: {
                highContrast: globalColors.chromatic.emerald[500],
                lowContrast: globalColors.chromatic.emerald[700],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.emerald[700] },
              hover: { lowContrast: globalColors.chromatic.emerald[700] },
              focus: { lowContrast: globalColors.chromatic.emerald[700] },
              active: { lowContrast: globalColors.chromatic.emerald[700] },
              disabled: { lowContrast: globalColors.chromatic.emerald[700] },
            },
          },
          text: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[500],
              },
              hover: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[500],
              },
              focus: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[500],
              },
              active: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[500],
              },
              disabled: {
                highContrast: globalColors.chromatic.emerald[500],
                lowContrast: globalColors.chromatic.emerald[800],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.emerald[500] },
              hover: { lowContrast: globalColors.chromatic.emerald[500] },
              focus: { lowContrast: globalColors.chromatic.emerald[500] },
              active: { lowContrast: globalColors.chromatic.emerald[500] },
              disabled: { lowContrast: globalColors.chromatic.emerald[800] },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.emerald[500],
                highContrast: globalColors.chromatic.emerald[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald[600],
                highContrast: globalColors.chromatic.emerald[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[100],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[100],
              },
              disabled: {
                lowContrast: globalColors.chromatic.emerald[800],
                highContrast: globalColors.chromatic.emerald[100],
              },
            },
          },
          icon: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[500],
              },
              hover: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[500],
              },
              focus: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[500],
              },
              active: {
                highContrast: globalColors.chromatic.emerald[50],
                lowContrast: globalColors.chromatic.emerald[500],
              },
              disabled: {
                highContrast: globalColors.chromatic.emerald[500],
                lowContrast: globalColors.chromatic.emerald[800],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.emerald[500] },
              hover: { lowContrast: globalColors.chromatic.emerald[500] },
              focus: { lowContrast: globalColors.chromatic.emerald[500] },
              active: { lowContrast: globalColors.chromatic.emerald[500] },
              disabled: { lowContrast: globalColors.chromatic.emerald[800] },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.emerald[500],
                highContrast: globalColors.chromatic.emerald[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald[600],
                highContrast: globalColors.chromatic.emerald[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[100],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[100],
              },
              disabled: {
                lowContrast: globalColors.chromatic.emerald[800],
                highContrast: globalColors.chromatic.emerald[100],
              },
            },
          },
        },
      },
      negative: {
        action: {
          background: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.crimson[700],
                lowContrast: globalColors.chromatic.crimson.a50,
              },
              hover: {
                highContrast: globalColors.chromatic.crimson[800],
                lowContrast: globalColors.chromatic.crimson.a100,
              },
              focus: {
                highContrast: globalColors.chromatic.crimson[900],
                lowContrast: globalColors.chromatic.crimson.a200,
              },
              active: {
                highContrast: globalColors.chromatic.crimson[900],
                lowContrast: globalColors.chromatic.crimson.a200,
              },
              disabled: {
                highContrast: globalColors.chromatic.crimson[700],
                lowContrast: globalColors.chromatic.crimson.a50,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.crimson.a50 },
              hover: { lowContrast: globalColors.chromatic.crimson.a100 },
              focus: { lowContrast: globalColors.chromatic.crimson.a200 },
              active: { lowContrast: globalColors.chromatic.crimson.a200 },
              disabled: { lowContrast: globalColors.chromatic.crimson.a50 },
            },
          },
          border: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[500],
              },
              hover: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[500],
              },
              focus: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[500],
              },
              active: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[500],
              },
              disabled: {
                highContrast: globalColors.chromatic.crimson[500],
                lowContrast: globalColors.chromatic.crimson[900],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.crimson[500] },
              hover: { lowContrast: globalColors.chromatic.crimson[500] },
              focus: { lowContrast: globalColors.chromatic.crimson[500] },
              active: { lowContrast: globalColors.chromatic.crimson[500] },
              disabled: { lowContrast: globalColors.chromatic.crimson[900] },
            },
          },
          text: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[400],
              },
              hover: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[400],
              },
              focus: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[400],
              },
              active: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[400],
              },
              disabled: {
                highContrast: globalColors.chromatic.crimson[500],
                lowContrast: globalColors.chromatic.crimson[800],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.crimson[400] },
              hover: { lowContrast: globalColors.chromatic.crimson[400] },
              focus: { lowContrast: globalColors.chromatic.crimson[400] },
              active: { lowContrast: globalColors.chromatic.crimson[400] },
              disabled: { lowContrast: globalColors.chromatic.crimson[800] },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.crimson[500],
                highContrast: globalColors.chromatic.crimson[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.crimson[400],
                highContrast: globalColors.chromatic.crimson[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.crimson[600],
                highContrast: globalColors.chromatic.crimson[100],
              },
              active: {
                lowContrast: globalColors.chromatic.crimson[600],
                highContrast: globalColors.chromatic.crimson[100],
              },
              disabled: {
                lowContrast: globalColors.chromatic.crimson[900],
                highContrast: globalColors.chromatic.crimson[500],
              },
            },
          },
          icon: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[400],
              },
              hover: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[400],
              },
              focus: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[400],
              },
              active: {
                highContrast: globalColors.chromatic.crimson[50],
                lowContrast: globalColors.chromatic.crimson[400],
              },
              disabled: {
                highContrast: globalColors.chromatic.crimson[500],
                lowContrast: globalColors.chromatic.crimson[800],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.crimson[400] },
              hover: { lowContrast: globalColors.chromatic.crimson[400] },
              focus: { lowContrast: globalColors.chromatic.crimson[400] },
              active: { lowContrast: globalColors.chromatic.crimson[400] },
              disabled: { lowContrast: globalColors.chromatic.crimson[800] },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.crimson[500],
                highContrast: globalColors.chromatic.crimson[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.crimson[400],
                highContrast: globalColors.chromatic.crimson[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.crimson[600],
                highContrast: globalColors.chromatic.crimson[100],
              },
              active: {
                lowContrast: globalColors.chromatic.crimson[600],
                highContrast: globalColors.chromatic.crimson[100],
              },
              disabled: {
                lowContrast: globalColors.chromatic.crimson[900],
                highContrast: globalColors.chromatic.crimson[500],
              },
            },
          },
        },
      },
      notice: {
        action: {
          background: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.cider[800],
                lowContrast: globalColors.chromatic.cider.a50,
              },
              hover: {
                highContrast: globalColors.chromatic.cider[900],
                lowContrast: globalColors.chromatic.cider.a100,
              },
              focus: {
                highContrast: globalColors.chromatic.cider[950],
                lowContrast: globalColors.chromatic.cider.a200,
              },
              active: {
                highContrast: globalColors.chromatic.cider[950],
                lowContrast: globalColors.chromatic.cider.a200,
              },
              disabled: {
                highContrast: globalColors.chromatic.cider[800],
                lowContrast: globalColors.chromatic.cider.a50,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.cider.a50 },
              hover: { lowContrast: globalColors.chromatic.cider.a100 },
              focus: { lowContrast: globalColors.chromatic.cider.a200 },
              active: { lowContrast: globalColors.chromatic.cider.a200 },
              disabled: { lowContrast: globalColors.chromatic.cider.a50 },
            },
          },
          border: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[800],
              },
              hover: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[800],
              },
              focus: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[800],
              },
              active: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[800],
              },
              disabled: {
                highContrast: globalColors.chromatic.cider[500],
                lowContrast: globalColors.chromatic.cider[900],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.cider[800] },
              hover: { lowContrast: globalColors.chromatic.cider[800] },
              focus: { lowContrast: globalColors.chromatic.cider[800] },
              active: { lowContrast: globalColors.chromatic.cider[800] },
              disabled: { lowContrast: globalColors.chromatic.cider[900] },
            },
          },
          text: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[500],
              },
              hover: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[500],
              },
              focus: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[500],
              },
              active: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[500],
              },
              disabled: {
                highContrast: globalColors.chromatic.cider[500],
                lowContrast: globalColors.chromatic.cider[900],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.cider[500] },
              hover: { lowContrast: globalColors.chromatic.cider[500] },
              focus: { lowContrast: globalColors.chromatic.cider[500] },
              active: { lowContrast: globalColors.chromatic.cider[500] },
              disabled: { lowContrast: globalColors.chromatic.cider[900] },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.cider[500],
                highContrast: globalColors.chromatic.cider[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.cider[400],
                highContrast: globalColors.chromatic.cider[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.cider[600],
                highContrast: globalColors.chromatic.cider[100],
              },
              active: {
                lowContrast: globalColors.chromatic.cider[600],
                highContrast: globalColors.chromatic.cider[100],
              },
              disabled: {
                lowContrast: globalColors.chromatic.cider[600],
                highContrast: globalColors.chromatic.cider[500],
              },
            },
          },
          icon: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[500],
              },
              hover: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[500],
              },
              focus: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[500],
              },
              active: {
                highContrast: globalColors.chromatic.cider[50],
                lowContrast: globalColors.chromatic.cider[500],
              },
              disabled: {
                highContrast: globalColors.chromatic.cider[500],
                lowContrast: globalColors.chromatic.cider[900],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.cider[500] },
              hover: { lowContrast: globalColors.chromatic.cider[500] },
              focus: { lowContrast: globalColors.chromatic.cider[500] },
              active: { lowContrast: globalColors.chromatic.cider[500] },
              disabled: { lowContrast: globalColors.chromatic.cider[900] },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.cider[500],
                highContrast: globalColors.chromatic.cider[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.cider[400],
                highContrast: globalColors.chromatic.cider[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.cider[600],
                highContrast: globalColors.chromatic.cider[100],
              },
              active: {
                lowContrast: globalColors.chromatic.cider[600],
                highContrast: globalColors.chromatic.cider[100],
              },
              disabled: {
                lowContrast: globalColors.chromatic.cider[600],
                highContrast: globalColors.chromatic.cider[500],
              },
            },
          },
        },
      },
      information: {
        action: {
          background: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.sapphire[600],
                lowContrast: globalColors.chromatic.sapphire.a50,
              },
              hover: {
                highContrast: globalColors.chromatic.sapphire[700],
                lowContrast: globalColors.chromatic.sapphire.a100,
              },
              focus: {
                highContrast: globalColors.chromatic.sapphire[800],
                lowContrast: globalColors.chromatic.sapphire.a200,
              },
              active: {
                highContrast: globalColors.chromatic.sapphire[800],
                lowContrast: globalColors.chromatic.sapphire.a200,
              },
              disabled: {
                highContrast: globalColors.chromatic.sapphire[600],
                lowContrast: globalColors.chromatic.sapphire.a50,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.sapphire.a50 },
              hover: { lowContrast: globalColors.chromatic.sapphire.a100 },
              focus: { lowContrast: globalColors.chromatic.sapphire.a200 },
              active: { lowContrast: globalColors.chromatic.sapphire.a200 },
              disabled: { lowContrast: globalColors.chromatic.sapphire.a50 },
            },
          },
          border: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[700],
              },
              hover: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[700],
              },
              focus: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[700],
              },
              active: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[700],
              },
              disabled: {
                highContrast: globalColors.chromatic.sapphire[400],
                lowContrast: globalColors.chromatic.sapphire[900],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.sapphire[700] },
              hover: { lowContrast: globalColors.chromatic.sapphire[700] },
              focus: { lowContrast: globalColors.chromatic.sapphire[700] },
              active: { lowContrast: globalColors.chromatic.sapphire[700] },
              disabled: { lowContrast: globalColors.chromatic.sapphire[900] },
            },
          },
          text: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[500],
              },
              hover: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[500],
              },
              focus: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[500],
              },
              active: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[500],
              },
              disabled: {
                highContrast: globalColors.chromatic.sapphire[400],
                lowContrast: globalColors.chromatic.sapphire[900],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.sapphire[500] },
              hover: { lowContrast: globalColors.chromatic.sapphire[500] },
              focus: { lowContrast: globalColors.chromatic.sapphire[500] },
              active: { lowContrast: globalColors.chromatic.sapphire[500] },
              disabled: { lowContrast: globalColors.chromatic.sapphire[900] },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.sapphire[500],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.sapphire[400],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.sapphire[600],
                highContrast: globalColors.chromatic.sapphire[100],
              },
              active: {
                lowContrast: globalColors.chromatic.sapphire[600],
                highContrast: globalColors.chromatic.sapphire[100],
              },
              disabled: {
                lowContrast: globalColors.chromatic.sapphire[900],
                highContrast: globalColors.chromatic.sapphire[400],
              },
            },
          },
          icon: {
            primary: {
              default: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[500],
              },
              hover: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[500],
              },
              focus: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[500],
              },
              active: {
                highContrast: globalColors.chromatic.sapphire[50],
                lowContrast: globalColors.chromatic.sapphire[500],
              },
              disabled: {
                highContrast: globalColors.chromatic.sapphire[400],
                lowContrast: globalColors.chromatic.sapphire[900],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.chromatic.sapphire[500] },
              hover: { lowContrast: globalColors.chromatic.sapphire[500] },
              focus: { lowContrast: globalColors.chromatic.sapphire[500] },
              active: { lowContrast: globalColors.chromatic.sapphire[500] },
              disabled: { lowContrast: globalColors.chromatic.sapphire[900] },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.sapphire[500],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.sapphire[400],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.sapphire[600],
                highContrast: globalColors.chromatic.sapphire[100],
              },
              active: {
                lowContrast: globalColors.chromatic.sapphire[600],
                highContrast: globalColors.chromatic.sapphire[100],
              },
              disabled: {
                lowContrast: globalColors.chromatic.sapphire[900],
                highContrast: globalColors.chromatic.sapphire[400],
              },
            },
          },
        },
      },
      neutral: {
        action: {
          background: {
            primary: {
              default: {
                highContrast: globalColors.neutral.navyGrayDark[50],
                lowContrast: globalColors.neutral.navyGrayDark.a50,
              },
              hover: {
                highContrast: globalColors.neutral.navyGrayDark[100],
                lowContrast: globalColors.neutral.navyGrayDark.a100,
              },
              focus: {
                highContrast: globalColors.neutral.navyGrayDark[200],
                lowContrast: globalColors.neutral.navyGrayDark.a200,
              },
              active: {
                highContrast: globalColors.neutral.navyGrayDark[200],
                lowContrast: globalColors.neutral.navyGrayDark.a200,
              },
              disabled: {
                highContrast: globalColors.neutral.navyGrayDark[50],
                lowContrast: globalColors.neutral.navyGrayDark.a50,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.neutral.navyGrayDark.a50 },
              hover: { lowContrast: globalColors.neutral.navyGrayDark.a100 },
              focus: { lowContrast: globalColors.neutral.navyGrayDark.a200 },
              active: { lowContrast: globalColors.neutral.navyGrayDark.a200 },
              disabled: { lowContrast: globalColors.neutral.navyGrayDark.a50 },
            },
          },
          border: {
            primary: {
              default: {
                highContrast: globalColors.neutral.navyGrayDark[300],
                lowContrast: globalColors.neutral.navyGrayDark[400],
              },
              hover: {
                highContrast: globalColors.neutral.navyGrayDark[300],
                lowContrast: globalColors.neutral.navyGrayDark[400],
              },
              focus: {
                highContrast: globalColors.neutral.navyGrayDark[300],
                lowContrast: globalColors.neutral.navyGrayDark[400],
              },
              active: {
                highContrast: globalColors.neutral.navyGrayDark[300],
                lowContrast: globalColors.neutral.navyGrayDark[400],
              },
              disabled: {
                highContrast: globalColors.neutral.navyGrayDark[300],
                lowContrast: globalColors.neutral.navyGrayDark[400],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.neutral.navyGrayDark[400] },
              hover: { lowContrast: globalColors.neutral.navyGrayDark[400] },
              focus: { lowContrast: globalColors.neutral.navyGrayDark[400] },
              active: { lowContrast: globalColors.neutral.navyGrayDark[400] },
              disabled: { lowContrast: globalColors.neutral.navyGrayDark[400] },
            },
          },
          text: {
            primary: {
              default: {
                highContrast: globalColors.neutral.navyGrayDark[700],
                lowContrast: globalColors.neutral.navyGrayDark[100],
              },
              hover: {
                highContrast: globalColors.neutral.navyGrayDark[700],
                lowContrast: globalColors.neutral.navyGrayDark[100],
              },
              focus: {
                highContrast: globalColors.neutral.navyGrayDark[700],
                lowContrast: globalColors.neutral.navyGrayDark[100],
              },
              active: {
                highContrast: globalColors.neutral.navyGrayDark[700],
                lowContrast: globalColors.neutral.navyGrayDark[100],
              },
              disabled: {
                highContrast: globalColors.neutral.navyGrayDark[300],
                lowContrast: globalColors.neutral.navyGrayDark[400],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.neutral.navyGrayDark[100] },
              hover: { lowContrast: globalColors.neutral.navyGrayDark[100] },
              focus: { lowContrast: globalColors.neutral.navyGrayDark[100] },
              active: { lowContrast: globalColors.neutral.navyGrayDark[100] },
              disabled: { lowContrast: globalColors.neutral.navyGrayDark[400] },
            },
            link: {
              default: {
                lowContrast: globalColors.neutral.navyGrayDark[100],
                highContrast: globalColors.neutral.navyGrayDark[100],
              },
              hover: {
                lowContrast: globalColors.neutral.navyGrayDark[200],
                highContrast: globalColors.neutral.navyGrayDark[200],
              },
              focus: {
                lowContrast: globalColors.neutral.navyGrayDark[300],
                highContrast: globalColors.neutral.navyGrayDark[300],
              },
              active: {
                lowContrast: globalColors.neutral.navyGrayDark[300],
                highContrast: globalColors.neutral.navyGrayDark[300],
              },
              disabled: {
                lowContrast: globalColors.neutral.navyGrayDark[400],
                highContrast: globalColors.neutral.navyGrayDark[400],
              },
            },
          },
          icon: {
            primary: {
              default: {
                highContrast: globalColors.neutral.navyGrayDark[700],
                lowContrast: globalColors.neutral.navyGrayDark[100],
              },
              hover: {
                highContrast: globalColors.neutral.navyGrayDark[700],
                lowContrast: globalColors.neutral.navyGrayDark[100],
              },
              focus: {
                highContrast: globalColors.neutral.navyGrayDark[700],
                lowContrast: globalColors.neutral.navyGrayDark[100],
              },
              active: {
                highContrast: globalColors.neutral.navyGrayDark[700],
                lowContrast: globalColors.neutral.navyGrayDark[100],
              },
              disabled: {
                highContrast: globalColors.neutral.navyGrayDark[300],
                lowContrast: globalColors.neutral.navyGrayDark[400],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.neutral.navyGrayDark[100] },
              hover: { lowContrast: globalColors.neutral.navyGrayDark[100] },
              focus: { lowContrast: globalColors.neutral.navyGrayDark[100] },
              active: { lowContrast: globalColors.neutral.navyGrayDark[100] },
              disabled: { lowContrast: globalColors.neutral.navyGrayDark[400] },
            },
            link: {
              default: {
                lowContrast: globalColors.neutral.navyGrayDark[100],
                highContrast: globalColors.neutral.navyGrayDark[100],
              },
              hover: {
                lowContrast: globalColors.neutral.navyGrayDark[200],
                highContrast: globalColors.neutral.navyGrayDark[200],
              },
              focus: {
                lowContrast: globalColors.neutral.navyGrayDark[300],
                highContrast: globalColors.neutral.navyGrayDark[300],
              },
              active: {
                lowContrast: globalColors.neutral.navyGrayDark[300],
                highContrast: globalColors.neutral.navyGrayDark[300],
              },
              disabled: {
                lowContrast: globalColors.neutral.navyGrayDark[400],
                highContrast: globalColors.neutral.navyGrayDark[400],
              },
            },
          },
        },
      },
    },
    action: {
      background: {
        primary: {
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[700],
          active: globalColors.chromatic.azure[800],
          disabled: globalColors.neutral.navyGrayDark[600],
        },
        secondary: {
          default: globalColors.chromatic.azure.a00,
          hover: globalColors.chromatic.azure.a50,
          focus: globalColors.chromatic.azure.a100,
          active: globalColors.chromatic.azure.a200,
          disabled: globalColors.neutral.navyGrayDark.a00,
        },
        tertiary: {
          default: globalColors.neutral.navyGrayDark.a50,
          hover: globalColors.neutral.navyGrayDark.a100,
          focus: globalColors.neutral.navyGrayDark.a200,
          active: globalColors.neutral.navyGrayDark.a200,
          disabled: globalColors.neutral.navyGrayDark.a50,
        },
      },
      border: {
        primary: {
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[700],
          active: globalColors.chromatic.azure[800],
          disabled: globalColors.neutral.navyGrayDark[600],
        },
        secondary: {
          default: globalColors.chromatic.azure[400],
          hover: globalColors.chromatic.azure[400],
          focus: globalColors.chromatic.azure[400],
          active: globalColors.chromatic.azure[400],
          disabled: globalColors.neutral.navyGrayDark[500],
        },
        tertiary: {
          default: globalColors.neutral.navyGrayDark.a00,
          hover: globalColors.neutral.navyGrayDark[400],
          focus: globalColors.neutral.navyGrayDark[400],
          active: globalColors.neutral.navyGrayDark[400],
          disabled: globalColors.neutral.navyGrayDark[600],
        },
      },
      text: {
        primary: {
          default: globalColors.neutral.navyGrayDark[0],
          hover: globalColors.neutral.navyGrayDark[0],
          focus: globalColors.neutral.navyGrayDark[0],
          active: globalColors.neutral.navyGrayDark[0],
          disabled: globalColors.neutral.navyGrayDark[300],
        },
        secondary: {
          default: globalColors.chromatic.azure[400],
          hover: globalColors.chromatic.azure[400],
          focus: globalColors.chromatic.azure[400],
          active: globalColors.chromatic.azure[400],
          disabled: globalColors.neutral.navyGrayDark[500],
        },
        tertiary: {
          default: globalColors.neutral.navyGrayDark[100],
          hover: globalColors.neutral.navyGrayDark[100],
          focus: globalColors.neutral.navyGrayDark[100],
          active: globalColors.neutral.navyGrayDark[100],
          disabled: globalColors.neutral.navyGrayDark[500],
        },
        link: {
          default: globalColors.chromatic.azure[300],
          hover: globalColors.chromatic.azure[400],
          focus: globalColors.chromatic.azure[500],
          active: globalColors.chromatic.azure[500],
          disabled: globalColors.neutral.navyGrayDark[400],
          visited: globalColors.chromatic.orchid[300],
        },
      },
      icon: {
        primary: {
          default: globalColors.neutral.navyGrayDark[0],
          hover: globalColors.neutral.navyGrayDark[0],
          focus: globalColors.neutral.navyGrayDark[0],
          active: globalColors.neutral.navyGrayDark[0],
          disabled: globalColors.neutral.navyGrayDark[300],
        },
        secondary: {
          default: globalColors.chromatic.azure[400],
          hover: globalColors.chromatic.azure[400],
          focus: globalColors.chromatic.azure[400],
          active: globalColors.chromatic.azure[400],
          disabled: globalColors.neutral.navyGrayDark[500],
        },
        tertiary: {
          default: globalColors.neutral.navyGrayDark[100],
          hover: globalColors.neutral.navyGrayDark[100],
          focus: globalColors.neutral.navyGrayDark[100],
          active: globalColors.neutral.navyGrayDark[100],
          disabled: globalColors.neutral.navyGrayDark[500],
        },
        link: {
          default: globalColors.chromatic.azure[300],
          hover: globalColors.chromatic.azure[400],
          focus: globalColors.chromatic.azure[500],
          active: globalColors.chromatic.azure[500],
          disabled: globalColors.neutral.navyGrayDark[400],
          visited: globalColors.chromatic.orchid[300],
        },
      },
    },
    static: { white: globalColors.neutral.ashGrayLight[0] },
    white: {
      action: {
        background: {
          primary: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[200],
            focus: globalColors.neutral.ashGrayLight[300],
            active: globalColors.neutral.ashGrayLight[300],
            disabled: globalColors.neutral.ashGrayLight.a400,
          },
          secondary: {
            default: globalColors.neutral.ashGrayLight.a00,
            hover: globalColors.neutral.ashGrayLight.a400,
            focus: globalColors.neutral.ashGrayLight.a500,
            active: globalColors.neutral.ashGrayLight.a500,
            disabled: globalColors.neutral.ashGrayLight.a00,
          },
          tertiary: {
            default: globalColors.neutral.ashGrayLight.a300,
            hover: globalColors.neutral.ashGrayLight.a400,
            focus: globalColors.neutral.ashGrayLight.a500,
            active: globalColors.neutral.ashGrayLight.a500,
            disabled: globalColors.neutral.ashGrayLight.a300,
          },
        },
        border: {
          primary: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[200],
            focus: globalColors.neutral.ashGrayLight[300],
            active: globalColors.neutral.ashGrayLight[300],
            disabled: globalColors.neutral.ashGrayLight.a400,
          },
          secondary: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[0],
            focus: globalColors.neutral.ashGrayLight[0],
            active: globalColors.neutral.ashGrayLight[0],
            disabled: globalColors.neutral.ashGrayLight.a500,
          },
          tertiary: {
            default: globalColors.neutral.ashGrayLight.a00,
            hover: globalColors.neutral.ashGrayLight.a00,
            focus: globalColors.neutral.ashGrayLight.a00,
            active: globalColors.neutral.ashGrayLight.a00,
            disabled: globalColors.neutral.ashGrayLight.a00,
          },
        },
        text: {
          primary: {
            default: globalColors.chromatic.azure[500],
            hover: globalColors.chromatic.azure[500],
            focus: globalColors.chromatic.azure[500],
            active: globalColors.chromatic.azure[500],
            disabled: globalColors.neutral.ashGrayLight.a500,
          },
          secondary: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[0],
            focus: globalColors.neutral.ashGrayLight[0],
            active: globalColors.neutral.ashGrayLight[0],
            disabled: globalColors.neutral.ashGrayLight.a500,
          },
          tertiary: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[0],
            focus: globalColors.neutral.ashGrayLight[0],
            active: globalColors.neutral.ashGrayLight[0],
            disabled: globalColors.neutral.ashGrayLight.a500,
          },
          link: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[300],
            focus: globalColors.neutral.ashGrayLight[400],
            active: globalColors.neutral.ashGrayLight[400],
            disabled: globalColors.neutral.ashGrayLight.a500,
            visited: globalColors.chromatic.orchid[300],
          },
        },
        icon: {
          primary: {
            default: globalColors.chromatic.azure[500],
            hover: globalColors.chromatic.azure[500],
            focus: globalColors.chromatic.azure[500],
            active: globalColors.chromatic.azure[500],
            disabled: globalColors.neutral.ashGrayLight.a500,
          },
          secondary: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[0],
            focus: globalColors.neutral.ashGrayLight[0],
            active: globalColors.neutral.ashGrayLight[0],
            disabled: globalColors.neutral.ashGrayLight.a500,
          },
          tertiary: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[0],
            focus: globalColors.neutral.ashGrayLight[0],
            active: globalColors.neutral.ashGrayLight[0],
            disabled: globalColors.neutral.ashGrayLight.a500,
          },
          link: {
            default: globalColors.neutral.ashGrayLight[0],
            hover: globalColors.neutral.ashGrayLight[300],
            focus: globalColors.neutral.ashGrayLight[400],
            active: globalColors.neutral.ashGrayLight[400],
            disabled: globalColors.neutral.ashGrayLight.a500,
            visited: globalColors.chromatic.orchid[300],
          },
        },
      },
    },
    badge: {
      background: {
        blue: {
          lowContrast: globalColors.chromatic.azure.a100,
          highContrast: globalColors.chromatic.azure[600],
        },
      },
      border: {
        blue: {
          lowContrast: globalColors.chromatic.azure.a200,
          highContrast: globalColors.chromatic.azure[600],
        },
      },
      text: {
        blue: {
          lowContrast: globalColors.chromatic.azure[400],
          highContrast: globalColors.neutral.navyGrayDark[0],
        },
      },
      icon: {
        blue: {
          lowContrast: globalColors.chromatic.azure[400],
          highContrast: globalColors.neutral.navyGrayDark[0],
        },
      },
    },
  },
};

const bankingTheme: ThemeTokens = {
  name: 'bankingTheme',
  border,
  breakpoints,
  colors,
  motion,
  spacing,
  elevation,
  typography,
};

export default bankingTheme;
