import type { ThemeTokens, ColorsWithModes } from './theme.d';
import {
  border,
  breakpoints,
  colors as globalColors,
  motion,
  spacing,
  typography,
  shadows,
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
          highContrast: globalColors.neutral.blueGrayLight.a100,
        },
        subtle: {
          lowContrast: globalColors.neutral.blueGrayLight.a50,
          highContrast: globalColors.neutral.blueGrayLight.a50,
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
          highContrast: globalColors.neutral.blueGrayLight[700],
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
            lowContrast: globalColors.neutral.blueGrayLight[300],
            highContrast: globalColors.neutral.blueGrayLight.a100,
          },
        },
      },
    },
    overlay: { background: globalColors.neutral.blueGrayLight.a200 },
    brand: {
      primary: {
        300: globalColors.chromatic.azure.a50,
        400: globalColors.chromatic.azure.a100,
        500: globalColors.chromatic.azure[500],
        600: globalColors.chromatic.azure[600],
        700: globalColors.chromatic.azure[700],
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
        neutral: {
          lowContrast: globalColors.neutral.blueGrayLight.a50,
          highContrast: globalColors.neutral.blueGrayLight[1000],
        },
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
      },
      border: {
        neutral: {
          lowContrast: globalColors.neutral.blueGrayLight.a200,
          highContrast: globalColors.neutral.blueGrayLight[1000],
        },
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
      },
      text: {
        neutral: {
          lowContrast: globalColors.neutral.blueGrayLight[900],
          highContrast: globalColors.neutral.blueGrayLight[0],
        },
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
      },
      icon: {
        neutral: {
          lowContrast: globalColors.neutral.blueGrayLight[900],
          highContrast: globalColors.neutral.blueGrayLight[0],
        },
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
      },
      neutral: {
        action: {
          background: {
            primary: {
              default: {
                lowContrast: globalColors.neutral.blueGrayLight.a50,
                highContrast: globalColors.neutral.blueGrayLight[1000],
              },
              hover: {
                lowContrast: globalColors.neutral.blueGrayLight.a100,
                highContrast: globalColors.neutral.blueGrayLight[1100],
              },
              focus: {
                lowContrast: globalColors.neutral.blueGrayLight.a200,
                highContrast: globalColors.neutral.blueGrayLight[1200],
              },
              active: {
                lowContrast: globalColors.neutral.blueGrayLight.a200,
                highContrast: globalColors.neutral.blueGrayLight[1200],
              },
              disabled: {
                lowContrast: globalColors.neutral.blueGrayLight.a50,
                highContrast: globalColors.neutral.blueGrayLight[1000],
              },
            },
          },
          border: {
            primary: {
              default: {
                lowContrast: globalColors.neutral.blueGrayLight.a200,
                highContrast: globalColors.neutral.blueGrayLight[500],
              },
              hover: {
                lowContrast: globalColors.neutral.blueGrayLight.a200,
                highContrast: globalColors.neutral.blueGrayLight[500],
              },
              focus: {
                lowContrast: globalColors.neutral.blueGrayLight.a200,
                highContrast: globalColors.neutral.blueGrayLight[500],
              },
              active: {
                lowContrast: globalColors.neutral.blueGrayLight.a200,
                highContrast: globalColors.neutral.blueGrayLight[500],
              },
              disabled: {
                lowContrast: globalColors.neutral.blueGrayLight.a200,
                highContrast: globalColors.neutral.blueGrayLight[700],
              },
            },
          },
          text: {
            primary: {
              default: {
                lowContrast: globalColors.neutral.blueGrayLight[900],
                highContrast: globalColors.neutral.blueGrayLight[50],
              },
              hover: {
                lowContrast: globalColors.neutral.blueGrayLight[900],
                highContrast: globalColors.neutral.blueGrayLight[50],
              },
              focus: {
                lowContrast: globalColors.neutral.blueGrayLight[900],
                highContrast: globalColors.neutral.blueGrayLight[50],
              },
              active: {
                lowContrast: globalColors.neutral.blueGrayLight[900],
                highContrast: globalColors.neutral.blueGrayLight[50],
              },
              disabled: {
                lowContrast: globalColors.neutral.blueGrayLight.a200,
                highContrast: globalColors.neutral.blueGrayLight[700],
              },
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
                lowContrast: globalColors.neutral.blueGrayLight[900],
                highContrast: globalColors.neutral.blueGrayLight[50],
              },
              hover: {
                lowContrast: globalColors.neutral.blueGrayLight[900],
                highContrast: globalColors.neutral.blueGrayLight[50],
              },
              focus: {
                lowContrast: globalColors.neutral.blueGrayLight[900],
                highContrast: globalColors.neutral.blueGrayLight[50],
              },
              active: {
                lowContrast: globalColors.neutral.blueGrayLight[900],
                highContrast: globalColors.neutral.blueGrayLight[50],
              },
              disabled: {
                lowContrast: globalColors.neutral.blueGrayLight.a200,
                highContrast: globalColors.neutral.blueGrayLight[700],
              },
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
      positive: {
        action: {
          background: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.emerald.a50,
                highContrast: globalColors.chromatic.emerald[700],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald.a100,
                highContrast: globalColors.chromatic.emerald[800],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald.a200,
                highContrast: globalColors.chromatic.emerald[900],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald.a200,
                highContrast: globalColors.chromatic.emerald[900],
              },
              disabled: {
                lowContrast: globalColors.chromatic.emerald.a50,
                highContrast: globalColors.chromatic.emerald[700],
              },
            },
          },
          border: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.emerald.a200,
                highContrast: globalColors.chromatic.emerald[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald.a200,
                highContrast: globalColors.chromatic.emerald[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald.a200,
                highContrast: globalColors.chromatic.emerald[50],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald.a200,
                highContrast: globalColors.chromatic.emerald[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.emerald.a200,
                highContrast: globalColors.chromatic.emerald[500],
              },
            },
          },
          text: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[50],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.emerald.a200,
                highContrast: globalColors.chromatic.emerald[500],
              },
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
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[50],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.emerald.a200,
                highContrast: globalColors.chromatic.emerald[500],
              },
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
                lowContrast: globalColors.chromatic.crimson.a50,
                highContrast: globalColors.chromatic.crimson[700],
              },
              hover: {
                lowContrast: globalColors.chromatic.crimson.a100,
                highContrast: globalColors.chromatic.crimson[800],
              },
              focus: {
                lowContrast: globalColors.chromatic.crimson.a200,
                highContrast: globalColors.chromatic.crimson[900],
              },
              active: {
                lowContrast: globalColors.chromatic.crimson.a200,
                highContrast: globalColors.chromatic.crimson[900],
              },
              disabled: {
                lowContrast: globalColors.chromatic.crimson.a50,
                highContrast: globalColors.chromatic.crimson[700],
              },
            },
          },
          border: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.crimson.a200,
                highContrast: globalColors.chromatic.crimson[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.crimson.a200,
                highContrast: globalColors.chromatic.crimson[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.crimson.a200,
                highContrast: globalColors.chromatic.crimson[50],
              },
              active: {
                lowContrast: globalColors.chromatic.crimson.a200,
                highContrast: globalColors.chromatic.crimson[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.crimson.a200,
                highContrast: globalColors.chromatic.crimson[500],
              },
            },
          },
          text: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.crimson[700],
                highContrast: globalColors.chromatic.crimson[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.crimson[700],
                highContrast: globalColors.chromatic.crimson[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.crimson[700],
                highContrast: globalColors.chromatic.crimson[50],
              },
              active: {
                lowContrast: globalColors.chromatic.crimson[700],
                highContrast: globalColors.chromatic.crimson[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.crimson.a200,
                highContrast: globalColors.chromatic.crimson[500],
              },
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
                lowContrast: globalColors.chromatic.crimson[700],
                highContrast: globalColors.chromatic.crimson[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.crimson[700],
                highContrast: globalColors.chromatic.crimson[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.crimson[700],
                highContrast: globalColors.chromatic.crimson[50],
              },
              active: {
                lowContrast: globalColors.chromatic.crimson[700],
                highContrast: globalColors.chromatic.crimson[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.crimson.a200,
                highContrast: globalColors.chromatic.crimson[500],
              },
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
                lowContrast: globalColors.chromatic.cider.a50,
                highContrast: globalColors.chromatic.cider[700],
              },
              hover: {
                lowContrast: globalColors.chromatic.cider.a100,
                highContrast: globalColors.chromatic.cider[800],
              },
              focus: {
                lowContrast: globalColors.chromatic.cider.a200,
                highContrast: globalColors.chromatic.cider[900],
              },
              active: {
                lowContrast: globalColors.chromatic.cider.a200,
                highContrast: globalColors.chromatic.cider[900],
              },
              disabled: {
                lowContrast: globalColors.chromatic.cider.a50,
                highContrast: globalColors.chromatic.cider[700],
              },
            },
          },
          border: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.cider.a200,
                highContrast: globalColors.chromatic.cider[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.cider.a200,
                highContrast: globalColors.chromatic.cider[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.cider.a200,
                highContrast: globalColors.chromatic.cider[50],
              },
              active: {
                lowContrast: globalColors.chromatic.cider.a200,
                highContrast: globalColors.chromatic.cider[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.cider.a200,
                highContrast: globalColors.chromatic.cider[500],
              },
            },
          },
          text: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.cider[700],
                highContrast: globalColors.chromatic.cider[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.cider[700],
                highContrast: globalColors.chromatic.cider[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.cider[700],
                highContrast: globalColors.chromatic.cider[50],
              },
              active: {
                lowContrast: globalColors.chromatic.cider[700],
                highContrast: globalColors.chromatic.cider[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.cider.a200,
                highContrast: globalColors.chromatic.cider[500],
              },
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
                lowContrast: globalColors.chromatic.cider[700],
                highContrast: globalColors.chromatic.cider[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.cider[700],
                highContrast: globalColors.chromatic.cider[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.cider[700],
                highContrast: globalColors.chromatic.cider[50],
              },
              active: {
                lowContrast: globalColors.chromatic.cider[700],
                highContrast: globalColors.chromatic.cider[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.cider.a200,
                highContrast: globalColors.chromatic.cider[500],
              },
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
                lowContrast: globalColors.chromatic.sapphire.a50,
                highContrast: globalColors.chromatic.sapphire[600],
              },
              hover: {
                lowContrast: globalColors.chromatic.sapphire.a100,
                highContrast: globalColors.chromatic.sapphire[700],
              },
              focus: {
                lowContrast: globalColors.chromatic.sapphire.a200,
                highContrast: globalColors.chromatic.sapphire[800],
              },
              active: {
                lowContrast: globalColors.chromatic.sapphire.a200,
                highContrast: globalColors.chromatic.sapphire[800],
              },
              disabled: {
                lowContrast: globalColors.chromatic.sapphire.a50,
                highContrast: globalColors.chromatic.sapphire[600],
              },
            },
          },
          border: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.sapphire.a200,
                highContrast: globalColors.chromatic.sapphire[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.sapphire.a200,
                highContrast: globalColors.chromatic.sapphire[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.sapphire.a200,
                highContrast: globalColors.chromatic.sapphire[50],
              },
              active: {
                lowContrast: globalColors.chromatic.sapphire.a200,
                highContrast: globalColors.chromatic.sapphire[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.sapphire.a200,
                highContrast: globalColors.chromatic.sapphire[400],
              },
            },
          },
          text: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              active: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.sapphire.a200,
                highContrast: globalColors.chromatic.sapphire[400],
              },
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
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              active: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.sapphire.a200,
                highContrast: globalColors.chromatic.sapphire[400],
              },
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
    },
    action: {
      background: {
        primary: {
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[700],
          active: globalColors.chromatic.azure[800],
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
          default: globalColors.neutral.blueGrayLight[0],
          hover: globalColors.neutral.blueGrayLight[50],
          focus: globalColors.neutral.blueGrayLight[100],
          active: globalColors.neutral.blueGrayLight[200],
          disabled: globalColors.neutral.blueGrayLight[0],
        },
      },
      border: {
        primary: {
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[700],
          active: globalColors.chromatic.azure[800],
          disabled: globalColors.neutral.blueGrayLight[300],
        },
        secondary: {
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[500],
          focus: globalColors.chromatic.azure[500],
          active: globalColors.chromatic.azure[500],
          disabled: globalColors.neutral.blueGrayLight[400],
        },
        tertiary: {
          default: globalColors.neutral.blueGrayLight[300],
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
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[500],
          focus: globalColors.chromatic.azure[500],
          active: globalColors.chromatic.azure[500],
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
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[700],
          active: globalColors.chromatic.azure[700],
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
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[500],
          focus: globalColors.chromatic.azure[500],
          active: globalColors.chromatic.azure[500],
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
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[700],
          active: globalColors.chromatic.azure[700],
          disabled: globalColors.neutral.blueGrayLight[400],
          visited: globalColors.chromatic.orchid[400],
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
          highContrast: globalColors.neutral.blueGrayDark.a100,
        },
        subtle: {
          lowContrast: globalColors.neutral.blueGrayDark.a50,
          highContrast: globalColors.neutral.blueGrayDark.a50,
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
            lowContrast: globalColors.neutral.blueGrayDark[600],
            highContrast: globalColors.neutral.blueGrayDark.a100,
          },
        },
      },
    },
    overlay: { background: globalColors.neutral.blueGrayDark.a400 },
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
        neutral: {
          lowContrast: globalColors.neutral.blueGrayDark.a100,
          highContrast: globalColors.neutral.blueGrayDark.a100,
        },
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
      },
      border: {
        neutral: {
          lowContrast: globalColors.neutral.blueGrayDark.a200,
          highContrast: globalColors.neutral.blueGrayDark[50],
        },
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
      },
      text: {
        neutral: {
          lowContrast: globalColors.neutral.blueGrayDark[100],
          highContrast: globalColors.neutral.blueGrayDark[50],
        },
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
      },
      icon: {
        neutral: {
          lowContrast: globalColors.neutral.blueGrayDark[100],
          highContrast: globalColors.neutral.blueGrayDark[50],
        },
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
      },
      neutral: {
        action: {
          background: {
            primary: {
              default: {
                lowContrast: globalColors.neutral.blueGrayDark.a50,
                highContrast: globalColors.neutral.blueGrayDark[50],
              },
              hover: {
                lowContrast: globalColors.neutral.blueGrayDark.a100,
                highContrast: globalColors.neutral.blueGrayDark[100],
              },
              focus: {
                lowContrast: globalColors.neutral.blueGrayDark.a200,
                highContrast: globalColors.neutral.blueGrayDark[200],
              },
              active: {
                lowContrast: globalColors.neutral.blueGrayDark.a200,
                highContrast: globalColors.neutral.blueGrayDark[200],
              },
              disabled: {
                lowContrast: globalColors.neutral.blueGrayDark.a50,
                highContrast: globalColors.neutral.blueGrayDark[50],
              },
            },
          },
          border: {
            primary: {
              default: {
                lowContrast: globalColors.neutral.blueGrayDark[400],
                highContrast: globalColors.neutral.blueGrayDark[300],
              },
              hover: {
                lowContrast: globalColors.neutral.blueGrayDark[400],
                highContrast: globalColors.neutral.blueGrayDark[300],
              },
              focus: {
                lowContrast: globalColors.neutral.blueGrayDark[400],
                highContrast: globalColors.neutral.blueGrayDark[300],
              },
              active: {
                lowContrast: globalColors.neutral.blueGrayDark[400],
                highContrast: globalColors.neutral.blueGrayDark[300],
              },
              disabled: {
                lowContrast: globalColors.neutral.blueGrayDark[400],
                highContrast: globalColors.neutral.blueGrayDark[300],
              },
            },
          },
          text: {
            primary: {
              default: {
                lowContrast: globalColors.neutral.blueGrayDark[100],
                highContrast: globalColors.neutral.blueGrayDark[700],
              },
              hover: {
                lowContrast: globalColors.neutral.blueGrayDark[100],
                highContrast: globalColors.neutral.blueGrayDark[700],
              },
              focus: {
                lowContrast: globalColors.neutral.blueGrayDark[100],
                highContrast: globalColors.neutral.blueGrayDark[700],
              },
              active: {
                lowContrast: globalColors.neutral.blueGrayDark[100],
                highContrast: globalColors.neutral.blueGrayDark[700],
              },
              disabled: {
                lowContrast: globalColors.neutral.blueGrayDark[400],
                highContrast: globalColors.neutral.blueGrayDark[300],
              },
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
                lowContrast: globalColors.neutral.blueGrayDark[100],
                highContrast: globalColors.neutral.blueGrayDark[700],
              },
              hover: {
                lowContrast: globalColors.neutral.blueGrayDark[100],
                highContrast: globalColors.neutral.blueGrayDark[700],
              },
              focus: {
                lowContrast: globalColors.neutral.blueGrayDark[100],
                highContrast: globalColors.neutral.blueGrayDark[700],
              },
              active: {
                lowContrast: globalColors.neutral.blueGrayDark[100],
                highContrast: globalColors.neutral.blueGrayDark[700],
              },
              disabled: {
                lowContrast: globalColors.neutral.blueGrayDark[400],
                highContrast: globalColors.neutral.blueGrayDark[300],
              },
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
      positive: {
        action: {
          background: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.emerald.a50,
                highContrast: globalColors.chromatic.emerald[700],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald.a100,
                highContrast: globalColors.chromatic.emerald[800],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald.a200,
                highContrast: globalColors.chromatic.emerald[900],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald.a200,
                highContrast: globalColors.chromatic.emerald[900],
              },
              disabled: {
                lowContrast: globalColors.chromatic.emerald.a50,
                highContrast: globalColors.chromatic.emerald[700],
              },
            },
          },
          border: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[50],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.emerald[700],
                highContrast: globalColors.chromatic.emerald[500],
              },
            },
          },
          text: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.emerald[500],
                highContrast: globalColors.chromatic.emerald[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald[500],
                highContrast: globalColors.chromatic.emerald[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald[500],
                highContrast: globalColors.chromatic.emerald[50],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald[500],
                highContrast: globalColors.chromatic.emerald[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.emerald[800],
                highContrast: globalColors.chromatic.emerald[500],
              },
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
                lowContrast: globalColors.chromatic.emerald[500],
                highContrast: globalColors.chromatic.emerald[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald[500],
                highContrast: globalColors.chromatic.emerald[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald[500],
                highContrast: globalColors.chromatic.emerald[50],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald[500],
                highContrast: globalColors.chromatic.emerald[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.emerald[800],
                highContrast: globalColors.chromatic.emerald[500],
              },
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
                lowContrast: globalColors.chromatic.crimson.a50,
                highContrast: globalColors.chromatic.crimson[700],
              },
              hover: {
                lowContrast: globalColors.chromatic.crimson.a100,
                highContrast: globalColors.chromatic.crimson[800],
              },
              focus: {
                lowContrast: globalColors.chromatic.crimson.a200,
                highContrast: globalColors.chromatic.crimson[900],
              },
              active: {
                lowContrast: globalColors.chromatic.crimson.a200,
                highContrast: globalColors.chromatic.crimson[900],
              },
              disabled: {
                lowContrast: globalColors.chromatic.crimson.a50,
                highContrast: globalColors.chromatic.crimson[700],
              },
            },
          },
          border: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.crimson[500],
                highContrast: globalColors.chromatic.crimson[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.crimson[500],
                highContrast: globalColors.chromatic.crimson[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.crimson[500],
                highContrast: globalColors.chromatic.crimson[50],
              },
              active: {
                lowContrast: globalColors.chromatic.crimson[500],
                highContrast: globalColors.chromatic.crimson[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.crimson[900],
                highContrast: globalColors.chromatic.crimson[500],
              },
            },
          },
          text: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.crimson[400],
                highContrast: globalColors.chromatic.crimson[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.crimson[400],
                highContrast: globalColors.chromatic.crimson[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.crimson[400],
                highContrast: globalColors.chromatic.crimson[50],
              },
              active: {
                lowContrast: globalColors.chromatic.crimson[400],
                highContrast: globalColors.chromatic.crimson[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.crimson[800],
                highContrast: globalColors.chromatic.crimson[500],
              },
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
                lowContrast: globalColors.chromatic.crimson[400],
                highContrast: globalColors.chromatic.crimson[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.crimson[400],
                highContrast: globalColors.chromatic.crimson[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.crimson[400],
                highContrast: globalColors.chromatic.crimson[50],
              },
              active: {
                lowContrast: globalColors.chromatic.crimson[400],
                highContrast: globalColors.chromatic.crimson[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.crimson[800],
                highContrast: globalColors.chromatic.crimson[500],
              },
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
                lowContrast: globalColors.chromatic.cider.a50,
                highContrast: globalColors.chromatic.cider[800],
              },
              hover: {
                lowContrast: globalColors.chromatic.cider.a100,
                highContrast: globalColors.chromatic.cider[900],
              },
              focus: {
                lowContrast: globalColors.chromatic.cider.a200,
                highContrast: globalColors.chromatic.cider[950],
              },
              active: {
                lowContrast: globalColors.chromatic.cider.a200,
                highContrast: globalColors.chromatic.cider[950],
              },
              disabled: {
                lowContrast: globalColors.chromatic.cider.a50,
                highContrast: globalColors.chromatic.cider[800],
              },
            },
          },
          border: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.cider[800],
                highContrast: globalColors.chromatic.cider[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.cider[800],
                highContrast: globalColors.chromatic.cider[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.cider[800],
                highContrast: globalColors.chromatic.cider[50],
              },
              active: {
                lowContrast: globalColors.chromatic.cider[800],
                highContrast: globalColors.chromatic.cider[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.cider[900],
                highContrast: globalColors.chromatic.cider[500],
              },
            },
          },
          text: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.cider[500],
                highContrast: globalColors.chromatic.cider[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.cider[500],
                highContrast: globalColors.chromatic.cider[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.cider[500],
                highContrast: globalColors.chromatic.cider[50],
              },
              active: {
                lowContrast: globalColors.chromatic.cider[500],
                highContrast: globalColors.chromatic.cider[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.cider[900],
                highContrast: globalColors.chromatic.cider[500],
              },
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
                lowContrast: globalColors.chromatic.cider[500],
                highContrast: globalColors.chromatic.cider[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.cider[500],
                highContrast: globalColors.chromatic.cider[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.cider[500],
                highContrast: globalColors.chromatic.cider[50],
              },
              active: {
                lowContrast: globalColors.chromatic.cider[500],
                highContrast: globalColors.chromatic.cider[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.cider[900],
                highContrast: globalColors.chromatic.cider[500],
              },
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
                lowContrast: globalColors.chromatic.sapphire.a50,
                highContrast: globalColors.chromatic.sapphire[600],
              },
              hover: {
                lowContrast: globalColors.chromatic.sapphire.a100,
                highContrast: globalColors.chromatic.sapphire[700],
              },
              focus: {
                lowContrast: globalColors.chromatic.sapphire.a200,
                highContrast: globalColors.chromatic.sapphire[800],
              },
              active: {
                lowContrast: globalColors.chromatic.sapphire.a200,
                highContrast: globalColors.chromatic.sapphire[800],
              },
              disabled: {
                lowContrast: globalColors.chromatic.sapphire.a50,
                highContrast: globalColors.chromatic.sapphire[600],
              },
            },
          },
          border: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              active: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.sapphire[900],
                highContrast: globalColors.chromatic.sapphire[400],
              },
            },
          },
          text: {
            primary: {
              default: {
                lowContrast: globalColors.chromatic.sapphire[500],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.sapphire[500],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.sapphire[500],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              active: {
                lowContrast: globalColors.chromatic.sapphire[500],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.sapphire[900],
                highContrast: globalColors.chromatic.sapphire[400],
              },
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
                lowContrast: globalColors.chromatic.sapphire[500],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.sapphire[500],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.sapphire[500],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              active: {
                lowContrast: globalColors.chromatic.sapphire[500],
                highContrast: globalColors.chromatic.sapphire[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.sapphire[900],
                highContrast: globalColors.chromatic.sapphire[400],
              },
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
          default: globalColors.neutral.blueGrayDark[900],
          hover: globalColors.neutral.blueGrayDark[900],
          focus: globalColors.neutral.blueGrayDark[1000],
          active: globalColors.neutral.blueGrayLight[1100],
          disabled: globalColors.neutral.blueGrayDark[800],
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
          default: globalColors.neutral.blueGrayDark[400],
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
          disabled: globalColors.neutral.blueGrayDark[400],
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
          disabled: globalColors.neutral.blueGrayDark[400],
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
  shadows,
  typography,
};

export default paymentTheme;
