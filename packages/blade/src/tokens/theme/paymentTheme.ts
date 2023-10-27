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
          lowContrast: globalColors.neutral.blueGrayLight[100],
          highContrast: globalColors.neutral.blueGrayLight[1200],
        },
        level2: {
          lowContrast: globalColors.neutral.blueGrayLight[0],
          highContrast: globalColors.neutral.blueGrayLight[1100],
        },
        level3: {
          lowContrast: globalColors.neutral.blueGrayLight[50],
          highContrast: globalColors.neutral.blueGrayLight[1000],
        },
      },
      border: {
        normal: {
          lowContrast: globalColors.neutral.blueGrayLight.a100,
          highContrast: globalColors.neutral.blueGrayLight.a400,
        },
        subtle: {
          lowContrast: globalColors.neutral.blueGrayLight.a50,
          highContrast: globalColors.neutral.blueGrayLight.a300,
        },
      },
      text: {
        normal: {
          lowContrast: globalColors.neutral.blueGrayLight[1200],
          highContrast: globalColors.neutral.blueGrayLight[0],
        },
        subtle: {
          lowContrast: globalColors.neutral.blueGrayLight[900],
          highContrast: globalColors.neutral.blueGrayLight[100],
        },
        subdued: {
          lowContrast: globalColors.neutral.blueGrayLight[800],
          highContrast: globalColors.neutral.blueGrayLight[300],
        },
        muted: {
          lowContrast: globalColors.neutral.blueGrayLight[600],
          highContrast: globalColors.neutral.blueGrayLight[400],
        },
        placeholder: {
          lowContrast: globalColors.neutral.blueGrayLight[500],
          highContrast: globalColors.neutral.blueGrayLight[500],
        },
      },
      action: {
        icon: {
          default: {
            lowContrast: globalColors.neutral.blueGrayLight[500],
            highContrast: globalColors.neutral.blueGrayLight.a500,
          },
          hover: {
            lowContrast: globalColors.neutral.blueGrayLight[800],
            highContrast: globalColors.neutral.blueGrayLight[0],
          },
          focus: {
            lowContrast: globalColors.neutral.blueGrayLight[800],
            highContrast: globalColors.neutral.blueGrayLight[0],
          },
          active: {
            lowContrast: globalColors.neutral.blueGrayLight[800],
            highContrast: globalColors.neutral.blueGrayLight[0],
          },
          disabled: {
            lowContrast: globalColors.neutral.blueGrayLight.a100,
            highContrast: globalColors.neutral.blueGrayLight.a100,
          },
        },
      },
      overlay: {
        background: {
          400: globalColors.neutral.blueGrayLight.a1100,
          800: globalColors.neutral.ashGrayLight.a1100,
        },
      },
      popup: { background: globalColors.neutral.blueGrayLight[100] },
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
          lowContrast: globalColors.neutral.blueGrayLight[50],
          highContrast: globalColors.neutral.blueGrayLight[1000],
        },
        300: {
          lowContrast: globalColors.neutral.blueGrayLight[100],
          highContrast: globalColors.neutral.blueGrayLight[900],
        },
        400: {
          lowContrast: globalColors.neutral.blueGrayLight[300],
          highContrast: globalColors.neutral.blueGrayLight[800],
        },
        500: {
          lowContrast: globalColors.neutral.blueGrayLight[500],
          highContrast: globalColors.neutral.blueGrayLight[700],
        },
        600: {
          lowContrast: globalColors.neutral.blueGrayLight[600],
          highContrast: globalColors.neutral.blueGrayLight[500],
        },
        700: {
          lowContrast: globalColors.neutral.blueGrayLight[800],
          highContrast: globalColors.neutral.blueGrayLight[100],
        },
        a50: {
          lowContrast: globalColors.neutral.blueGrayLight.a50,
          highContrast: globalColors.neutral.blueGrayLight.a300,
        },
        a100: {
          lowContrast: globalColors.neutral.blueGrayLight.a100,
          highContrast: globalColors.neutral.blueGrayLight.a400,
        },
      },
      secondary: { 500: globalColors.chromatic.emerald[500] },
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
          lowContrast: globalColors.neutral.blueGrayLight.a50,
          highContrast: globalColors.neutral.blueGrayLight[1000],
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
          lowContrast: globalColors.neutral.blueGrayLight.a200,
          highContrast: globalColors.neutral.blueGrayLight[1000],
        },
      },
      text: {
        positive: {
          lowContrast: globalColors.chromatic.emerald[700],
          highContrast: globalColors.neutral.blueGrayLight[0],
        },
        negative: {
          lowContrast: globalColors.chromatic.crimson[700],
          highContrast: globalColors.neutral.blueGrayLight[0],
        },
        notice: {
          lowContrast: globalColors.chromatic.cider[700],
          highContrast: globalColors.neutral.blueGrayLight[0],
        },
        information: {
          lowContrast: globalColors.chromatic.sapphire[600],
          highContrast: globalColors.neutral.blueGrayLight[0],
        },
        neutral: {
          lowContrast: globalColors.neutral.blueGrayLight[900],
          highContrast: globalColors.neutral.blueGrayLight[0],
        },
      },
      icon: {
        positive: {
          lowContrast: globalColors.chromatic.emerald[700],
          highContrast: globalColors.neutral.blueGrayLight[0],
        },
        negative: {
          lowContrast: globalColors.chromatic.crimson[700],
          highContrast: globalColors.neutral.blueGrayLight[0],
        },
        notice: {
          lowContrast: globalColors.chromatic.cider[700],
          highContrast: globalColors.neutral.blueGrayLight[0],
        },
        information: {
          lowContrast: globalColors.chromatic.sapphire[600],
          highContrast: globalColors.neutral.blueGrayLight[0],
        },
        neutral: {
          lowContrast: globalColors.neutral.blueGrayLight[900],
          highContrast: globalColors.neutral.blueGrayLight[0],
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
                highContrast: globalColors.neutral.blueGrayLight[1000],
                lowContrast: globalColors.neutral.blueGrayLight.a50,
              },
              hover: {
                highContrast: globalColors.neutral.blueGrayLight[1100],
                lowContrast: globalColors.neutral.blueGrayLight.a100,
              },
              focus: {
                highContrast: globalColors.neutral.blueGrayLight[1200],
                lowContrast: globalColors.neutral.blueGrayLight.a200,
              },
              active: {
                highContrast: globalColors.neutral.blueGrayLight[1200],
                lowContrast: globalColors.neutral.blueGrayLight.a200,
              },
              disabled: {
                highContrast: globalColors.neutral.blueGrayLight[1000],
                lowContrast: globalColors.neutral.blueGrayLight.a50,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.neutral.blueGrayLight.a50 },
              hover: { lowContrast: globalColors.neutral.blueGrayLight.a100 },
              focus: { lowContrast: globalColors.neutral.blueGrayLight.a200 },
              active: { lowContrast: globalColors.neutral.blueGrayLight.a200 },
              disabled: { lowContrast: globalColors.neutral.blueGrayLight.a50 },
            },
          },
          border: {
            primary: {
              default: {
                highContrast: globalColors.neutral.blueGrayLight[500],
                lowContrast: globalColors.neutral.blueGrayLight.a200,
              },
              hover: {
                highContrast: globalColors.neutral.blueGrayLight[500],
                lowContrast: globalColors.neutral.blueGrayLight.a200,
              },
              focus: {
                highContrast: globalColors.neutral.blueGrayLight[500],
                lowContrast: globalColors.neutral.blueGrayLight.a200,
              },
              active: {
                highContrast: globalColors.neutral.blueGrayLight[500],
                lowContrast: globalColors.neutral.blueGrayLight.a200,
              },
              disabled: {
                highContrast: globalColors.neutral.blueGrayLight[700],
                lowContrast: globalColors.neutral.blueGrayLight.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.neutral.blueGrayLight.a200 },
              hover: { lowContrast: globalColors.neutral.blueGrayLight.a200 },
              focus: { lowContrast: globalColors.neutral.blueGrayLight.a200 },
              active: { lowContrast: globalColors.neutral.blueGrayLight.a200 },
              disabled: { lowContrast: globalColors.neutral.blueGrayLight.a200 },
            },
          },
          text: {
            primary: {
              default: {
                highContrast: globalColors.neutral.blueGrayLight[50],
                lowContrast: globalColors.neutral.blueGrayLight[900],
              },
              hover: {
                highContrast: globalColors.neutral.blueGrayLight[50],
                lowContrast: globalColors.neutral.blueGrayLight[900],
              },
              focus: {
                highContrast: globalColors.neutral.blueGrayLight[50],
                lowContrast: globalColors.neutral.blueGrayLight[900],
              },
              active: {
                highContrast: globalColors.neutral.blueGrayLight[50],
                lowContrast: globalColors.neutral.blueGrayLight[900],
              },
              disabled: {
                highContrast: globalColors.neutral.blueGrayLight[700],
                lowContrast: globalColors.neutral.blueGrayLight.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.neutral.blueGrayLight[900] },
              hover: { lowContrast: globalColors.neutral.blueGrayLight[900] },
              focus: { lowContrast: globalColors.neutral.blueGrayLight[900] },
              active: { lowContrast: globalColors.neutral.blueGrayLight[900] },
              disabled: { lowContrast: globalColors.neutral.blueGrayLight.a200 },
            },
            link: {
              default: {
                lowContrast: globalColors.neutral.blueGrayLight[900],
                highContrast: globalColors.neutral.blueGrayLight[50],
              },
              hover: {
                lowContrast: globalColors.neutral.blueGrayLight[800],
                highContrast: globalColors.neutral.blueGrayLight[200],
              },
              focus: {
                lowContrast: globalColors.neutral.blueGrayLight[1000],
                highContrast: globalColors.neutral.blueGrayLight[400],
              },
              active: {
                lowContrast: globalColors.neutral.blueGrayLight[1000],
                highContrast: globalColors.neutral.blueGrayLight[400],
              },
              disabled: {
                lowContrast: globalColors.neutral.blueGrayLight.a200,
                highContrast: globalColors.neutral.blueGrayLight[700],
              },
            },
          },
          icon: {
            primary: {
              default: {
                highContrast: globalColors.neutral.blueGrayLight[50],
                lowContrast: globalColors.neutral.blueGrayLight[900],
              },
              hover: {
                highContrast: globalColors.neutral.blueGrayLight[50],
                lowContrast: globalColors.neutral.blueGrayLight[900],
              },
              focus: {
                highContrast: globalColors.neutral.blueGrayLight[50],
                lowContrast: globalColors.neutral.blueGrayLight[900],
              },
              active: {
                highContrast: globalColors.neutral.blueGrayLight[50],
                lowContrast: globalColors.neutral.blueGrayLight[900],
              },
              disabled: {
                highContrast: globalColors.neutral.blueGrayLight[700],
                lowContrast: globalColors.neutral.blueGrayLight.a200,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.neutral.blueGrayLight[900] },
              hover: { lowContrast: globalColors.neutral.blueGrayLight[900] },
              focus: { lowContrast: globalColors.neutral.blueGrayLight[900] },
              active: { lowContrast: globalColors.neutral.blueGrayLight[900] },
              disabled: { lowContrast: globalColors.neutral.blueGrayLight.a200 },
            },
            link: {
              default: {
                lowContrast: globalColors.neutral.blueGrayLight[900],
                highContrast: globalColors.neutral.blueGrayLight[50],
              },
              hover: {
                lowContrast: globalColors.neutral.blueGrayLight[800],
                highContrast: globalColors.neutral.blueGrayLight[200],
              },
              focus: {
                lowContrast: globalColors.neutral.blueGrayLight[1000],
                highContrast: globalColors.neutral.blueGrayLight[400],
              },
              active: {
                lowContrast: globalColors.neutral.blueGrayLight[1000],
                highContrast: globalColors.neutral.blueGrayLight[400],
              },
              disabled: {
                lowContrast: globalColors.neutral.blueGrayLight.a200,
                highContrast: globalColors.neutral.blueGrayLight[700],
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
          disabled: globalColors.neutral.blueGrayLight[300],
        },
        secondary: {
          default: globalColors.chromatic.azure.a00,
          hover: globalColors.chromatic.azure.a50,
          focus: globalColors.chromatic.azure.a100,
          active: globalColors.chromatic.azure.a200,
          disabled: globalColors.neutral.blueGrayLight.a00,
        },
        tertiary: {
          default: globalColors.neutral.blueGrayLight.a50,
          hover: globalColors.neutral.blueGrayLight.a100,
          focus: globalColors.neutral.blueGrayLight.a200,
          active: globalColors.neutral.blueGrayLight.a200,
          disabled: globalColors.neutral.blueGrayLight.a50,
        },
      },
      border: {
        primary: {
          default: globalColors.chromatic.azure[600],
          hover: globalColors.chromatic.azure[700],
          focus: globalColors.chromatic.azure[800],
          active: globalColors.chromatic.azure[900],
          disabled: globalColors.neutral.blueGrayLight[300],
        },
        secondary: {
          default: globalColors.chromatic.azure[600],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[600],
          active: globalColors.chromatic.azure[600],
          disabled: globalColors.neutral.blueGrayLight[400],
        },
        tertiary: {
          default: globalColors.neutral.blueGrayLight.a00,
          hover: globalColors.neutral.blueGrayLight[300],
          focus: globalColors.neutral.blueGrayLight[300],
          active: globalColors.neutral.blueGrayLight[300],
          disabled: globalColors.neutral.blueGrayLight[300],
        },
      },
      text: {
        primary: {
          default: globalColors.neutral.blueGrayLight[0],
          hover: globalColors.neutral.blueGrayLight[0],
          focus: globalColors.neutral.blueGrayLight[0],
          active: globalColors.neutral.blueGrayLight[0],
          disabled: globalColors.neutral.blueGrayLight[600],
        },
        secondary: {
          default: globalColors.chromatic.azure[600],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[600],
          active: globalColors.chromatic.azure[600],
          disabled: globalColors.neutral.blueGrayLight[400],
        },
        tertiary: {
          default: globalColors.neutral.blueGrayLight[1000],
          hover: globalColors.neutral.blueGrayLight[1000],
          focus: globalColors.neutral.blueGrayLight[1000],
          active: globalColors.neutral.blueGrayLight[1000],
          disabled: globalColors.neutral.blueGrayLight[400],
        },
        link: {
          default: globalColors.chromatic.azure[600],
          hover: globalColors.chromatic.azure[700],
          focus: globalColors.chromatic.azure[800],
          active: globalColors.chromatic.azure[800],
          disabled: globalColors.neutral.blueGrayLight[400],
          visited: globalColors.chromatic.orchid[400],
        },
      },
      icon: {
        primary: {
          default: globalColors.neutral.blueGrayLight[0],
          hover: globalColors.neutral.blueGrayLight[0],
          focus: globalColors.neutral.blueGrayLight[0],
          active: globalColors.neutral.blueGrayLight[0],
          disabled: globalColors.neutral.blueGrayLight[600],
        },
        secondary: {
          default: globalColors.chromatic.azure[600],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[600],
          active: globalColors.chromatic.azure[600],
          disabled: globalColors.neutral.blueGrayLight[400],
        },
        tertiary: {
          default: globalColors.neutral.blueGrayLight[1000],
          hover: globalColors.neutral.blueGrayLight[1000],
          focus: globalColors.neutral.blueGrayLight[1000],
          active: globalColors.neutral.blueGrayLight[1000],
          disabled: globalColors.neutral.blueGrayLight[400],
        },
        link: {
          default: globalColors.chromatic.azure[600],
          hover: globalColors.chromatic.azure[700],
          focus: globalColors.chromatic.azure[800],
          active: globalColors.chromatic.azure[800],
          disabled: globalColors.neutral.blueGrayLight[400],
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
          highContrast: globalColors.neutral.blueGrayLight[0],
        },
      },
      icon: {
        blue: {
          lowContrast: globalColors.chromatic.azure[600],
          highContrast: globalColors.neutral.blueGrayLight[0],
        },
      },
    },
  },
  onDark: {
    surface: {
      background: {
        level1: {
          lowContrast: globalColors.neutral.blueGrayDark[1300],
          highContrast: globalColors.neutral.blueGrayDark[800],
        },
        level2: {
          lowContrast: globalColors.neutral.blueGrayDark[1100],
          highContrast: globalColors.neutral.blueGrayDark[700],
        },
        level3: {
          lowContrast: globalColors.neutral.blueGrayDark[900],
          highContrast: globalColors.neutral.blueGrayDark[600],
        },
      },
      border: {
        normal: {
          lowContrast: globalColors.neutral.blueGrayDark.a100,
          highContrast: globalColors.neutral.blueGrayDark.a400,
        },
        subtle: {
          lowContrast: globalColors.neutral.blueGrayDark.a50,
          highContrast: globalColors.neutral.blueGrayDark.a300,
        },
      },
      text: {
        normal: {
          lowContrast: globalColors.neutral.blueGrayDark[0],
          highContrast: globalColors.neutral.blueGrayDark[0],
        },
        subtle: {
          lowContrast: globalColors.neutral.blueGrayDark[50],
          highContrast: globalColors.neutral.blueGrayDark[50],
        },
        subdued: {
          lowContrast: globalColors.neutral.blueGrayDark[100],
          highContrast: globalColors.neutral.blueGrayDark[100],
        },
        muted: {
          lowContrast: globalColors.neutral.blueGrayDark[200],
          highContrast: globalColors.neutral.blueGrayDark[200],
        },
        placeholder: {
          lowContrast: globalColors.neutral.blueGrayDark[300],
          highContrast: globalColors.neutral.blueGrayDark[300],
        },
      },
      action: {
        icon: {
          default: {
            lowContrast: globalColors.neutral.blueGrayDark[400],
            highContrast: globalColors.neutral.blueGrayDark.a200,
          },
          hover: {
            lowContrast: globalColors.neutral.blueGrayDark[200],
            highContrast: globalColors.neutral.blueGrayDark[0],
          },
          focus: {
            lowContrast: globalColors.neutral.blueGrayDark[200],
            highContrast: globalColors.neutral.blueGrayDark[0],
          },
          active: {
            lowContrast: globalColors.neutral.blueGrayDark[200],
            highContrast: globalColors.neutral.blueGrayDark[0],
          },
          disabled: {
            lowContrast: globalColors.neutral.blueGrayDark.a100,
            highContrast: globalColors.neutral.blueGrayDark.a100,
          },
        },
      },
      overlay: {
        background: {
          400: globalColors.neutral.blueGrayDark.a1100,
          800: globalColors.neutral.ashGrayDark.a1100,
        },
      },
      popup: { background: globalColors.neutral.blueGrayDark[100] },
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
          lowContrast: globalColors.neutral.blueGrayDark[800],
          highContrast: globalColors.neutral.blueGrayDark[600],
        },
        300: {
          lowContrast: globalColors.neutral.blueGrayDark[700],
          highContrast: globalColors.neutral.blueGrayDark[500],
        },
        400: {
          lowContrast: globalColors.neutral.blueGrayDark[600],
          highContrast: globalColors.neutral.blueGrayDark[400],
        },
        500: {
          lowContrast: globalColors.neutral.blueGrayDark[500],
          highContrast: globalColors.neutral.blueGrayDark[300],
        },
        600: {
          lowContrast: globalColors.neutral.blueGrayDark[400],
          highContrast: globalColors.neutral.blueGrayDark[200],
        },
        700: {
          lowContrast: globalColors.neutral.blueGrayDark[200],
          highContrast: globalColors.neutral.blueGrayDark[50],
        },
        a50: {
          lowContrast: globalColors.neutral.blueGrayDark.a50,
          highContrast: globalColors.neutral.blueGrayDark.a300,
        },
        a100: {
          lowContrast: globalColors.neutral.blueGrayDark.a100,
          highContrast: globalColors.neutral.blueGrayDark.a400,
        },
      },
      secondary: { 500: globalColors.chromatic.emerald[500] },
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
          lowContrast: globalColors.neutral.blueGrayDark.a100,
          highContrast: globalColors.neutral.blueGrayDark.a100,
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
          lowContrast: globalColors.neutral.blueGrayDark.a200,
          highContrast: globalColors.neutral.blueGrayDark[50],
        },
      },
      text: {
        positive: {
          lowContrast: globalColors.chromatic.emerald[500],
          highContrast: globalColors.neutral.blueGrayDark[0],
        },
        negative: {
          lowContrast: globalColors.chromatic.crimson[400],
          highContrast: globalColors.neutral.blueGrayDark[0],
        },
        notice: {
          lowContrast: globalColors.chromatic.cider[400],
          highContrast: globalColors.neutral.blueGrayDark[0],
        },
        information: {
          lowContrast: globalColors.chromatic.sapphire[400],
          highContrast: globalColors.neutral.blueGrayDark[0],
        },
        neutral: {
          lowContrast: globalColors.neutral.blueGrayDark[100],
          highContrast: globalColors.neutral.blueGrayDark[50],
        },
      },
      icon: {
        positive: {
          lowContrast: globalColors.chromatic.emerald[500],
          highContrast: globalColors.neutral.blueGrayDark[0],
        },
        negative: {
          lowContrast: globalColors.chromatic.crimson[400],
          highContrast: globalColors.neutral.blueGrayDark[0],
        },
        notice: {
          lowContrast: globalColors.chromatic.cider[400],
          highContrast: globalColors.neutral.blueGrayDark[0],
        },
        information: {
          lowContrast: globalColors.chromatic.sapphire[400],
          highContrast: globalColors.neutral.blueGrayDark[0],
        },
        neutral: {
          lowContrast: globalColors.neutral.blueGrayDark[100],
          highContrast: globalColors.neutral.blueGrayDark[50],
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
                lowContrast: globalColors.chromatic.cider[900],
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
                lowContrast: globalColors.chromatic.cider[900],
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
                highContrast: globalColors.neutral.blueGrayDark[50],
                lowContrast: globalColors.neutral.blueGrayDark.a50,
              },
              hover: {
                highContrast: globalColors.neutral.blueGrayDark[100],
                lowContrast: globalColors.neutral.blueGrayDark.a100,
              },
              focus: {
                highContrast: globalColors.neutral.blueGrayDark[200],
                lowContrast: globalColors.neutral.blueGrayDark.a200,
              },
              active: {
                highContrast: globalColors.neutral.blueGrayDark[200],
                lowContrast: globalColors.neutral.blueGrayDark.a200,
              },
              disabled: {
                highContrast: globalColors.neutral.blueGrayDark[50],
                lowContrast: globalColors.neutral.blueGrayDark.a50,
              },
            },
            secondary: {
              default: { lowContrast: globalColors.neutral.blueGrayDark.a50 },
              hover: { lowContrast: globalColors.neutral.blueGrayDark.a100 },
              focus: { lowContrast: globalColors.neutral.blueGrayDark.a200 },
              active: { lowContrast: globalColors.neutral.blueGrayDark.a200 },
              disabled: { lowContrast: globalColors.neutral.blueGrayDark.a50 },
            },
          },
          border: {
            primary: {
              default: {
                highContrast: globalColors.neutral.blueGrayDark[300],
                lowContrast: globalColors.neutral.blueGrayDark[400],
              },
              hover: {
                highContrast: globalColors.neutral.blueGrayDark[300],
                lowContrast: globalColors.neutral.blueGrayDark[400],
              },
              focus: {
                highContrast: globalColors.neutral.blueGrayDark[300],
                lowContrast: globalColors.neutral.blueGrayDark[400],
              },
              active: {
                highContrast: globalColors.neutral.blueGrayDark[300],
                lowContrast: globalColors.neutral.blueGrayDark[400],
              },
              disabled: {
                highContrast: globalColors.neutral.blueGrayDark[300],
                lowContrast: globalColors.neutral.blueGrayDark[400],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.neutral.blueGrayDark[400] },
              hover: { lowContrast: globalColors.neutral.blueGrayDark[400] },
              focus: { lowContrast: globalColors.neutral.blueGrayDark[400] },
              active: { lowContrast: globalColors.neutral.blueGrayDark[400] },
              disabled: { lowContrast: globalColors.neutral.blueGrayDark[400] },
            },
          },
          text: {
            primary: {
              default: {
                highContrast: globalColors.neutral.blueGrayDark[700],
                lowContrast: globalColors.neutral.blueGrayDark[100],
              },
              hover: {
                highContrast: globalColors.neutral.blueGrayDark[700],
                lowContrast: globalColors.neutral.blueGrayDark[100],
              },
              focus: {
                highContrast: globalColors.neutral.blueGrayDark[700],
                lowContrast: globalColors.neutral.blueGrayDark[100],
              },
              active: {
                highContrast: globalColors.neutral.blueGrayDark[700],
                lowContrast: globalColors.neutral.blueGrayDark[100],
              },
              disabled: {
                highContrast: globalColors.neutral.blueGrayDark[300],
                lowContrast: globalColors.neutral.blueGrayDark[400],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.neutral.blueGrayDark[100] },
              hover: { lowContrast: globalColors.neutral.blueGrayDark[100] },
              focus: { lowContrast: globalColors.neutral.blueGrayDark[100] },
              active: { lowContrast: globalColors.neutral.blueGrayDark[100] },
              disabled: { lowContrast: globalColors.neutral.blueGrayDark[400] },
            },
            link: {
              default: {
                lowContrast: globalColors.neutral.blueGrayDark[100],
                highContrast: globalColors.neutral.blueGrayDark[100],
              },
              hover: {
                lowContrast: globalColors.neutral.blueGrayDark[200],
                highContrast: globalColors.neutral.blueGrayDark[200],
              },
              focus: {
                lowContrast: globalColors.neutral.blueGrayDark[300],
                highContrast: globalColors.neutral.blueGrayDark[300],
              },
              active: {
                lowContrast: globalColors.neutral.blueGrayDark[300],
                highContrast: globalColors.neutral.blueGrayDark[300],
              },
              disabled: {
                lowContrast: globalColors.neutral.blueGrayDark[400],
                highContrast: globalColors.neutral.blueGrayDark[400],
              },
            },
          },
          icon: {
            primary: {
              default: {
                highContrast: globalColors.neutral.blueGrayDark[700],
                lowContrast: globalColors.neutral.blueGrayDark[100],
              },
              hover: {
                highContrast: globalColors.neutral.blueGrayDark[700],
                lowContrast: globalColors.neutral.blueGrayDark[100],
              },
              focus: {
                highContrast: globalColors.neutral.blueGrayDark[700],
                lowContrast: globalColors.neutral.blueGrayDark[100],
              },
              active: {
                highContrast: globalColors.neutral.blueGrayDark[700],
                lowContrast: globalColors.neutral.blueGrayDark[100],
              },
              disabled: {
                highContrast: globalColors.neutral.blueGrayDark[300],
                lowContrast: globalColors.neutral.blueGrayDark[400],
              },
            },
            secondary: {
              default: { lowContrast: globalColors.neutral.blueGrayDark[100] },
              hover: { lowContrast: globalColors.neutral.blueGrayDark[100] },
              focus: { lowContrast: globalColors.neutral.blueGrayDark[100] },
              active: { lowContrast: globalColors.neutral.blueGrayDark[100] },
              disabled: { lowContrast: globalColors.neutral.blueGrayDark[400] },
            },
            link: {
              default: {
                lowContrast: globalColors.neutral.blueGrayDark[100],
                highContrast: globalColors.neutral.blueGrayDark[100],
              },
              hover: {
                lowContrast: globalColors.neutral.blueGrayDark[200],
                highContrast: globalColors.neutral.blueGrayDark[200],
              },
              focus: {
                lowContrast: globalColors.neutral.blueGrayDark[300],
                highContrast: globalColors.neutral.blueGrayDark[300],
              },
              active: {
                lowContrast: globalColors.neutral.blueGrayDark[300],
                highContrast: globalColors.neutral.blueGrayDark[300],
              },
              disabled: {
                lowContrast: globalColors.neutral.blueGrayDark[400],
                highContrast: globalColors.neutral.blueGrayDark[400],
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
          disabled: globalColors.neutral.blueGrayDark[600],
        },
        secondary: {
          default: globalColors.chromatic.azure.a00,
          hover: globalColors.chromatic.azure.a50,
          focus: globalColors.chromatic.azure.a100,
          active: globalColors.chromatic.azure.a200,
          disabled: globalColors.neutral.blueGrayDark.a00,
        },
        tertiary: {
          default: globalColors.neutral.blueGrayDark.a50,
          hover: globalColors.neutral.blueGrayDark.a100,
          focus: globalColors.neutral.blueGrayDark.a200,
          active: globalColors.neutral.blueGrayLight.a200,
          disabled: globalColors.neutral.blueGrayDark.a50,
        },
      },
      border: {
        primary: {
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[700],
          active: globalColors.chromatic.azure[800],
          disabled: globalColors.neutral.blueGrayDark[600],
        },
        secondary: {
          default: globalColors.chromatic.azure[400],
          hover: globalColors.chromatic.azure[400],
          focus: globalColors.chromatic.azure[400],
          active: globalColors.chromatic.azure[400],
          disabled: globalColors.neutral.blueGrayDark[500],
        },
        tertiary: {
          default: globalColors.neutral.blueGrayDark.a00,
          hover: globalColors.neutral.blueGrayDark[400],
          focus: globalColors.neutral.blueGrayDark[400],
          active: globalColors.neutral.blueGrayDark[400],
          disabled: globalColors.neutral.blueGrayDark[600],
        },
      },
      text: {
        primary: {
          default: globalColors.neutral.blueGrayDark[0],
          hover: globalColors.neutral.blueGrayDark[0],
          focus: globalColors.neutral.blueGrayDark[0],
          active: globalColors.neutral.blueGrayDark[0],
          disabled: globalColors.neutral.blueGrayDark[300],
        },
        secondary: {
          default: globalColors.chromatic.azure[400],
          hover: globalColors.chromatic.azure[400],
          focus: globalColors.chromatic.azure[400],
          active: globalColors.chromatic.azure[400],
          disabled: globalColors.neutral.blueGrayDark[500],
        },
        tertiary: {
          default: globalColors.neutral.blueGrayDark[100],
          hover: globalColors.neutral.blueGrayDark[100],
          focus: globalColors.neutral.blueGrayDark[100],
          active: globalColors.neutral.blueGrayDark[100],
          disabled: globalColors.neutral.blueGrayDark[500],
        },
        link: {
          default: globalColors.chromatic.azure[300],
          hover: globalColors.chromatic.azure[400],
          focus: globalColors.chromatic.azure[500],
          active: globalColors.chromatic.azure[500],
          disabled: globalColors.neutral.blueGrayDark[400],
          visited: globalColors.chromatic.orchid[300],
        },
      },
      icon: {
        primary: {
          default: globalColors.neutral.blueGrayDark[0],
          hover: globalColors.neutral.blueGrayDark[0],
          focus: globalColors.neutral.blueGrayDark[0],
          active: globalColors.neutral.blueGrayDark[0],
          disabled: globalColors.neutral.blueGrayDark[300],
        },
        secondary: {
          default: globalColors.chromatic.azure[400],
          hover: globalColors.chromatic.azure[400],
          focus: globalColors.chromatic.azure[400],
          active: globalColors.chromatic.azure[400],
          disabled: globalColors.neutral.blueGrayDark[500],
        },
        tertiary: {
          default: globalColors.neutral.blueGrayDark[100],
          hover: globalColors.neutral.blueGrayDark[100],
          focus: globalColors.neutral.blueGrayLight[1000],
          active: globalColors.neutral.blueGrayDark[100],
          disabled: globalColors.neutral.blueGrayDark[500],
        },
        link: {
          default: globalColors.chromatic.azure[300],
          hover: globalColors.chromatic.azure[400],
          focus: globalColors.chromatic.azure[500],
          active: globalColors.chromatic.azure[500],
          disabled: globalColors.neutral.blueGrayDark[400],
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
          highContrast: globalColors.neutral.blueGrayDark[0],
        },
      },
      icon: {
        blue: {
          lowContrast: globalColors.chromatic.azure[400],
          highContrast: globalColors.neutral.blueGrayDark[0],
        },
      },
    },
  },
};

const paymentTheme: ThemeTokens = {
  name: 'paymentTheme',
  border,
  breakpoints,
  colors,
  motion,
  spacing,
  elevation,
  typography,
};

export default paymentTheme;
