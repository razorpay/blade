import type { ThemeTokens, ColorsWithModes, Shadows } from './theme.d';
import border from '~tokens/global/border';
import breakpoints from '~tokens/global/breakpoints';
import spacing from '~tokens/global/spacing';
import globalColors from '~tokens/global/colors';
import typography from '~tokens/global/typography';
import motion from '~tokens/global/motion';

const colors: ColorsWithModes = {
  onLight: {
    surface: {
      background: {
        level1: {
          lowContrast: globalColors.neutral.navyGrayLight[100],
          highContrast: globalColors.neutral.navyGrayLight[1100],
        },
        level2: {
          lowContrast: globalColors.neutral.navyGrayLight[0],
          highContrast: globalColors.neutral.navyGrayLight[900],
        },
        level3: {
          lowContrast: globalColors.neutral.navyGrayLight[50],
          highContrast: globalColors.neutral.navyGrayLight[1300],
        },
      },
      border: {
        normal: {
          lowContrast: globalColors.neutral.navyGrayLight[400],
          highContrast: globalColors.neutral.navyGrayLight[400],
        },
        subtle: {
          lowContrast: globalColors.neutral.navyGrayLight[800],
          highContrast: globalColors.neutral.navyGrayLight[800],
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
          highContrast: globalColors.neutral.navyGrayLight[700],
        },
      },
      action: {
        icon: {
          default: {
            lowContrast: globalColors.neutral.navyGrayLight[500],
            highContrast: globalColors.neutral.navyGrayLight[300],
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
            lowContrast: globalColors.neutral.navyGrayLight[300],
            highContrast: globalColors.neutral.navyGrayLight.a200,
          },
        },
      },
    },
    overlay: { background: globalColors.neutral.navyGrayLight.a200 },
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
        200: globalColors.neutral.navyGrayLight[50],
        300: globalColors.neutral.navyGrayLight[100],
        400: globalColors.neutral.navyGrayLight[300],
        500: globalColors.neutral.navyGrayLight[500],
        600: globalColors.neutral.navyGrayLight[600],
        700: globalColors.neutral.navyGrayLight[800],
      },
      secondary: { 500: globalColors.chromatic.cider[600] },
    },
    feedback: {
      background: {
        neutral: {
          lowContrast: globalColors.neutral.navyGrayLight.a50,
          highContrast: globalColors.neutral.navyGrayLight[1000],
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
          lowContrast: globalColors.neutral.navyGrayLight.a200,
          highContrast: globalColors.neutral.navyGrayLight[1000],
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
          lowContrast: globalColors.neutral.navyGrayLight[900],
          highContrast: globalColors.neutral.navyGrayLight[0],
        },
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
      },
      icon: {
        neutral: {
          lowContrast: globalColors.neutral.navyGrayLight[900],
          highContrast: globalColors.neutral.navyGrayLight[0],
        },
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
      },
      neutral: {
        action: {
          background: {
            primary: {
              default: {
                lowContrast: globalColors.neutral.navyGrayLight.a50,
                highContrast: globalColors.neutral.navyGrayLight[1000],
              },
              hover: {
                lowContrast: globalColors.neutral.navyGrayLight.a100,
                highContrast: globalColors.neutral.navyGrayLight[1100],
              },
              focus: {
                lowContrast: globalColors.neutral.navyGrayLight.a200,
                highContrast: globalColors.neutral.navyGrayLight[1200],
              },
              active: {
                lowContrast: globalColors.neutral.navyGrayLight.a200,
                highContrast: globalColors.neutral.navyGrayLight[1200],
              },
              disabled: {
                lowContrast: globalColors.neutral.navyGrayLight.a50,
                highContrast: globalColors.neutral.navyGrayLight[1000],
              },
            },
          },
          border: {
            primary: {
              default: {
                lowContrast: globalColors.neutral.navyGrayLight.a200,
                highContrast: globalColors.neutral.navyGrayLight[500],
              },
              hover: {
                lowContrast: globalColors.neutral.navyGrayLight.a200,
                highContrast: globalColors.neutral.navyGrayLight[500],
              },
              focus: {
                lowContrast: globalColors.neutral.navyGrayLight.a200,
                highContrast: globalColors.neutral.navyGrayLight[500],
              },
              active: {
                lowContrast: globalColors.neutral.navyGrayLight.a200,
                highContrast: globalColors.neutral.navyGrayLight[500],
              },
              disabled: {
                lowContrast: globalColors.neutral.navyGrayLight.a200,
                highContrast: globalColors.neutral.navyGrayLight[700],
              },
            },
          },
          text: {
            primary: {
              default: {
                lowContrast: globalColors.neutral.navyGrayLight[900],
                highContrast: globalColors.neutral.navyGrayLight[50],
              },
              hover: {
                lowContrast: globalColors.neutral.navyGrayLight[900],
                highContrast: globalColors.neutral.navyGrayLight[50],
              },
              focus: {
                lowContrast: globalColors.neutral.navyGrayLight[900],
                highContrast: globalColors.neutral.navyGrayLight[50],
              },
              active: {
                lowContrast: globalColors.neutral.navyGrayLight[900],
                highContrast: globalColors.neutral.navyGrayLight[50],
              },
              disabled: {
                lowContrast: globalColors.neutral.navyGrayLight.a200,
                highContrast: globalColors.neutral.navyGrayLight[700],
              },
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
                lowContrast: globalColors.neutral.navyGrayLight[900],
                highContrast: globalColors.neutral.navyGrayLight[50],
              },
              hover: {
                lowContrast: globalColors.neutral.navyGrayLight[900],
                highContrast: globalColors.neutral.navyGrayLight[50],
              },
              focus: {
                lowContrast: globalColors.neutral.navyGrayLight[900],
                highContrast: globalColors.neutral.navyGrayLight[50],
              },
              active: {
                lowContrast: globalColors.neutral.navyGrayLight[900],
                highContrast: globalColors.neutral.navyGrayLight[50],
              },
              disabled: {
                lowContrast: globalColors.neutral.navyGrayLight.a200,
                highContrast: globalColors.neutral.navyGrayLight[700],
              },
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
                lowContrast: globalColors.chromatic.emerald.a100,
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
          default: globalColors.neutral.navyGrayLight[0],
          hover: globalColors.neutral.navyGrayLight[50],
          focus: globalColors.neutral.navyGrayLight[100],
          active: globalColors.neutral.navyGrayLight[200],
          disabled: globalColors.neutral.navyGrayLight[0],
        },
      },
      border: {
        primary: {
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[700],
          active: globalColors.chromatic.azure[800],
          disabled: globalColors.neutral.navyGrayLight[300],
        },
        secondary: {
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[500],
          focus: globalColors.chromatic.azure[500],
          active: globalColors.chromatic.azure[500],
          disabled: globalColors.neutral.navyGrayLight[400],
        },
        tertiary: {
          default: globalColors.neutral.navyGrayLight[400],
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
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[500],
          focus: globalColors.chromatic.azure[500],
          active: globalColors.chromatic.azure[500],
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
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[700],
          active: globalColors.chromatic.azure[700],
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
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[500],
          focus: globalColors.chromatic.azure[500],
          active: globalColors.chromatic.azure[500],
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
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[700],
          active: globalColors.chromatic.azure[700],
          disabled: globalColors.neutral.navyGrayLight[400],
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
          highContrast: globalColors.neutral.navyGrayDark[700],
        },
        level2: {
          lowContrast: globalColors.neutral.navyGrayDark[1100],
          highContrast: globalColors.neutral.navyGrayDark[600],
        },
        level3: {
          lowContrast: globalColors.neutral.navyGrayDark[900],
          highContrast: globalColors.neutral.navyGrayDark[1100],
        },
      },
      border: {
        normal: {
          lowContrast: globalColors.neutral.navyGrayDark[600],
          highContrast: globalColors.neutral.navyGrayDark[600],
        },
        subtle: {
          lowContrast: globalColors.neutral.navyGrayDark[500],
          highContrast: globalColors.neutral.navyGrayDark[500],
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
            highContrast: globalColors.neutral.navyGrayDark[100],
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
            lowContrast: globalColors.neutral.navyGrayDark[600],
            highContrast: globalColors.neutral.navyGrayDark.a200,
          },
        },
      },
    },
    overlay: { background: globalColors.neutral.navyGrayDark[600] },
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
        200: globalColors.neutral.navyGrayDark[800],
        300: globalColors.neutral.navyGrayDark[700],
        400: globalColors.neutral.navyGrayDark[600],
        500: globalColors.neutral.navyGrayDark[500],
        600: globalColors.neutral.navyGrayDark[400],
        700: globalColors.neutral.navyGrayDark[200],
      },
      secondary: { 500: globalColors.chromatic.cider[600] },
    },
    feedback: {
      background: {
        neutral: {
          lowContrast: globalColors.neutral.navyGrayDark.a100,
          highContrast: globalColors.neutral.navyGrayDark[50],
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
          lowContrast: globalColors.neutral.navyGrayDark.a200,
          highContrast: globalColors.neutral.navyGrayDark[50],
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
          lowContrast: globalColors.neutral.navyGrayDark[100],
          highContrast: globalColors.neutral.navyGrayDark[800],
        },
        positive: {
          lowContrast: globalColors.chromatic.emerald[300],
          highContrast: globalColors.neutral.navyGrayDark[0],
        },
        negative: {
          lowContrast: globalColors.chromatic.crimson[400],
          highContrast: globalColors.neutral.navyGrayDark[0],
        },
        notice: {
          lowContrast: globalColors.chromatic.crimson[400],
          highContrast: globalColors.neutral.navyGrayDark[0],
        },
        information: {
          lowContrast: globalColors.chromatic.sapphire[400],
          highContrast: globalColors.neutral.navyGrayDark[0],
        },
      },
      icon: {
        neutral: {
          lowContrast: globalColors.neutral.navyGrayDark[100],
          highContrast: globalColors.neutral.navyGrayDark[800],
        },
        positive: {
          lowContrast: globalColors.chromatic.emerald[300],
          highContrast: globalColors.neutral.navyGrayDark[0],
        },
        negative: {
          lowContrast: globalColors.chromatic.crimson[600],
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
      },
      neutral: {
        action: {
          background: {
            primary: {
              default: {
                lowContrast: globalColors.neutral.navyGrayDark.a50,
                highContrast: globalColors.neutral.navyGrayDark[50],
              },
              hover: {
                lowContrast: globalColors.neutral.navyGrayDark.a100,
                highContrast: globalColors.neutral.navyGrayDark[100],
              },
              focus: {
                lowContrast: globalColors.neutral.navyGrayDark.a200,
                highContrast: globalColors.neutral.navyGrayDark[200],
              },
              active: {
                lowContrast: globalColors.neutral.navyGrayDark.a200,
                highContrast: globalColors.neutral.navyGrayDark[200],
              },
              disabled: {
                lowContrast: globalColors.neutral.navyGrayDark.a50,
                highContrast: globalColors.neutral.navyGrayDark[50],
              },
            },
          },
          border: {
            primary: {
              default: {
                lowContrast: globalColors.neutral.navyGrayDark[400],
                highContrast: globalColors.neutral.navyGrayDark[300],
              },
              hover: {
                lowContrast: globalColors.neutral.navyGrayDark[400],
                highContrast: globalColors.neutral.navyGrayDark[300],
              },
              focus: {
                lowContrast: globalColors.neutral.navyGrayDark[400],
                highContrast: globalColors.neutral.navyGrayDark[300],
              },
              active: {
                lowContrast: globalColors.neutral.navyGrayDark[400],
                highContrast: globalColors.neutral.navyGrayDark[300],
              },
              disabled: {
                lowContrast: globalColors.neutral.navyGrayDark[400],
                highContrast: globalColors.neutral.navyGrayDark[300],
              },
            },
          },
          text: {
            primary: {
              default: {
                lowContrast: globalColors.neutral.navyGrayDark[100],
                highContrast: globalColors.neutral.navyGrayDark[700],
              },
              hover: {
                lowContrast: globalColors.neutral.navyGrayDark[100],
                highContrast: globalColors.neutral.navyGrayDark[700],
              },
              focus: {
                lowContrast: globalColors.neutral.navyGrayDark[100],
                highContrast: globalColors.neutral.navyGrayDark[700],
              },
              active: {
                lowContrast: globalColors.neutral.navyGrayDark[100],
                highContrast: globalColors.neutral.navyGrayDark[700],
              },
              disabled: {
                lowContrast: globalColors.neutral.navyGrayDark[400],
                highContrast: globalColors.neutral.navyGrayDark[300],
              },
            },
            link: {
              default: {
                lowContrast: globalColors.neutral.navyGrayDark[100],
                highContrast: globalColors.neutral.navyGrayDark[700],
              },
              hover: {
                lowContrast: globalColors.neutral.navyGrayDark[200],
                highContrast: globalColors.neutral.navyGrayDark[500],
              },
              focus: {
                lowContrast: globalColors.neutral.navyGrayDark[300],
                highContrast: globalColors.neutral.navyGrayDark[400],
              },
              active: {
                lowContrast: globalColors.neutral.navyGrayDark[300],
                highContrast: globalColors.neutral.navyGrayDark[400],
              },
              disabled: {
                lowContrast: globalColors.neutral.navyGrayDark[400],
                highContrast: globalColors.neutral.navyGrayDark[300],
              },
            },
          },
          icon: {
            primary: {
              default: {
                lowContrast: globalColors.neutral.navyGrayDark[100],
                highContrast: globalColors.neutral.navyGrayDark[700],
              },
              hover: {
                lowContrast: globalColors.neutral.navyGrayDark[100],
                highContrast: globalColors.neutral.navyGrayDark[700],
              },
              focus: {
                lowContrast: globalColors.neutral.navyGrayDark[100],
                highContrast: globalColors.neutral.navyGrayDark[700],
              },
              active: {
                lowContrast: globalColors.neutral.navyGrayDark[100],
                highContrast: globalColors.neutral.navyGrayDark[700],
              },
              disabled: {
                lowContrast: globalColors.neutral.navyGrayDark[400],
                highContrast: globalColors.neutral.navyGrayDark[300],
              },
            },
            link: {
              default: {
                lowContrast: globalColors.neutral.navyGrayDark[100],
                highContrast: globalColors.neutral.navyGrayDark[700],
              },
              hover: {
                lowContrast: globalColors.neutral.navyGrayDark[200],
                highContrast: globalColors.neutral.navyGrayDark[500],
              },
              focus: {
                lowContrast: globalColors.neutral.navyGrayDark[300],
                highContrast: globalColors.neutral.navyGrayDark[400],
              },
              active: {
                lowContrast: globalColors.neutral.navyGrayDark[300],
                highContrast: globalColors.neutral.navyGrayDark[400],
              },
              disabled: {
                lowContrast: globalColors.neutral.navyGrayDark[400],
                highContrast: globalColors.neutral.navyGrayDark[300],
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
                lowContrast: globalColors.chromatic.emerald[300],
                highContrast: globalColors.chromatic.emerald[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald[300],
                highContrast: globalColors.chromatic.emerald[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald[300],
                highContrast: globalColors.chromatic.emerald[50],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald[300],
                highContrast: globalColors.chromatic.emerald[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.emerald[800],
                highContrast: globalColors.chromatic.emerald[500],
              },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.emerald[300],
                highContrast: globalColors.chromatic.emerald[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald[400],
                highContrast: globalColors.chromatic.emerald[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald[500],
                highContrast: globalColors.chromatic.emerald[100],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald[500],
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
                lowContrast: globalColors.chromatic.emerald[300],
                highContrast: globalColors.chromatic.emerald[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald[300],
                highContrast: globalColors.chromatic.emerald[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald[300],
                highContrast: globalColors.chromatic.emerald[50],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald[300],
                highContrast: globalColors.chromatic.emerald[50],
              },
              disabled: {
                lowContrast: globalColors.chromatic.emerald[800],
                highContrast: globalColors.chromatic.emerald[500],
              },
            },
            link: {
              default: {
                lowContrast: globalColors.chromatic.emerald[300],
                highContrast: globalColors.chromatic.emerald[50],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald[400],
                highContrast: globalColors.chromatic.emerald[50],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald[500],
                highContrast: globalColors.chromatic.emerald[100],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald[500],
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
                lowContrast: globalColors.chromatic.crimson[900],
                highContrast: globalColors.chromatic.crimson[500],
              },
            },
          },
          text: {
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
                lowContrast: globalColors.chromatic.cider[600],
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
          default: globalColors.neutral.navyGrayDark[900],
          hover: globalColors.neutral.navyGrayDark[700],
          focus: globalColors.neutral.navyGrayDark[600],
          active: globalColors.neutral.navyGrayDark[600],
          disabled: globalColors.neutral.navyGrayDark[1000],
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
          default: globalColors.neutral.navyGrayDark[400],
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
          disabled: globalColors.neutral.navyGrayDark[400],
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
          disabled: globalColors.neutral.navyGrayDark[400],
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

const shadows: Shadows = {
  offsetX: {
    level: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  },
  offsetY: {
    level: {
      1: 1,
      2: 3,
      3: 8,
      4: 10,
      5: 18,
    },
  },
  blurRadius: {
    level: {
      1: 2,
      2: 8,
      3: 12,
      4: 18,
      5: 28,
    },
  },
  color: {
    onLight: {
      level: {
        1: globalColors.neutral.navyGrayLight.a100,
        2: globalColors.neutral.navyGrayLight.a100,
        3: globalColors.neutral.navyGrayLight.a100,
        4: globalColors.neutral.navyGrayLight.a100,
        5: globalColors.neutral.navyGrayLight.a100,
      },
    },
    onDark: {
      level: {
        1: globalColors.neutral.navyGrayDark.a100,
        2: globalColors.neutral.navyGrayDark.a100,
        3: globalColors.neutral.navyGrayDark.a100,
        4: globalColors.neutral.navyGrayDark.a100,
        5: globalColors.neutral.navyGrayDark.a100,
      },
    },
  },
  androidElevation: {
    // this is required for android
    level: {
      1: 5,
      2: 5,
      3: 5,
      4: 5,
      5: 5,
    },
  },
  // shadowOpacity: 1, // this is required for iOS
};

const bankingTheme: ThemeTokens = {
  border,
  breakpoints,
  colors,
  motion,
  spacing,
  shadows,
  typography,
};

export default bankingTheme;
