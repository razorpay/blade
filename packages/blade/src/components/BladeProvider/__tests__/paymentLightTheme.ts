import globalColors from '../../../tokens/global/colors';
import border from '../../../tokens/global/border';
import breakpoints from '../../../tokens/global/breakpoints';
import spacing from '../../../tokens/global/spacing';
import typography from '../../../tokens/global/typography';
import { Theme } from '../useTheme';

const paymentLightTheme: Theme = {
  colors: {
    surface: {
      background: {
        level1: {
          lowContrast: globalColors.neutral.blueGrayLight[100],
          highContrast: globalColors.neutral.blueGrayLight[1100],
        },
        level2: {
          lowContrast: globalColors.neutral.blueGrayLight[0],
          highContrast: globalColors.neutral.blueGrayLight[900],
        },
        level3: {
          lowContrast: globalColors.neutral.blueGrayLight[50],
          highContrast: globalColors.neutral.blueGrayLight[1300],
        },
      },
      border: {
        normal: {
          lowContrast: globalColors.neutral.blueGrayLight[800],
          highContrast: globalColors.neutral.blueGrayLight[400],
        },
        subtle: {
          lowContrast: globalColors.neutral.blueGrayLight[400],
          highContrast: globalColors.neutral.blueGrayLight[800],
        },
      },
      text: {
        normal: {
          lowContrast: globalColors.neutral.blueGrayLight[1200],
          highContrast: globalColors.neutral.blueGrayLight[0],
        },
        subtle: {
          lowContrast: globalColors.neutral.blueGrayLight[1000],
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
          link: {
            default: {
              lowContrast: globalColors.neutral.blueGrayLight[500],
              highContrast: globalColors.neutral.blueGrayLight[300],
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
              highContrast: globalColors.neutral.blueGrayLight.a200,
            },
          },
        },
      },
    },
    overlay: {
      background: globalColors.neutral.blueGrayLight.a200,
    },
    brand: {
      primary: {
        300: globalColors.chromatic.azure.a50,
        400: globalColors.chromatic.azure.a100,
        500: globalColors.chromatic.azure[500],
        600: globalColors.chromatic.azure[600],
        700: globalColors.chromatic.azure[700],
      },
      gray: {
        300: globalColors.neutral.blueGrayLight[50],
        400: globalColors.neutral.blueGrayLight[300],
        500: globalColors.neutral.blueGrayLight[500],
        600: globalColors.neutral.blueGrayLight[600],
        700: globalColors.neutral.blueGrayLight[800],
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
                lowContrast: globalColors.chromatic.emerald.a50,
                highContrast: globalColors.chromatic.crimson[700],
              },
              hover: {
                lowContrast: globalColors.chromatic.emerald.a100,
                highContrast: globalColors.chromatic.crimson[800],
              },
              focus: {
                lowContrast: globalColors.chromatic.emerald.a200,
                highContrast: globalColors.chromatic.crimson[900],
              },
              active: {
                lowContrast: globalColors.chromatic.emerald.a200,
                highContrast: globalColors.chromatic.crimson[900],
              },
              disabled: {
                lowContrast: globalColors.chromatic.emerald.a50,
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
                highContrast: globalColors.chromatic.sapphire[600],
              },
              hover: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[600],
              },
              focus: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[600],
              },
              active: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[600],
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
                highContrast: globalColors.chromatic.sapphire[600],
              },
              hover: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[600],
              },
              focus: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[600],
              },
              active: {
                lowContrast: globalColors.chromatic.sapphire[700],
                highContrast: globalColors.chromatic.sapphire[600],
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
          disabled: globalColors.neutral.blueGrayLight[600],
        },
        tertiary: {
          default: globalColors.neutral.blueGrayLight[400],
          hover: globalColors.neutral.blueGrayLight[400],
          focus: globalColors.neutral.blueGrayLight[400],
          active: globalColors.neutral.blueGrayLight[400],
          disabled: globalColors.neutral.blueGrayLight[400],
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
          disabled: globalColors.neutral.blueGrayLight[600],
        },
        tertiary: {
          default: globalColors.neutral.blueGrayLight[1000],
          hover: globalColors.neutral.blueGrayLight[1000],
          focus: globalColors.neutral.blueGrayLight[1000],
          active: globalColors.neutral.blueGrayLight[1000],
          disabled: globalColors.neutral.blueGrayLight[500],
        },
        link: {
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[700],
          active: globalColors.chromatic.azure[700],
          disabled: globalColors.neutral.blueGrayLight[400],
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
          disabled: globalColors.neutral.blueGrayLight[600],
        },
        tertiary: {
          default: globalColors.neutral.blueGrayLight[1000],
          hover: globalColors.neutral.blueGrayLight[1000],
          focus: globalColors.neutral.blueGrayLight[1000],
          active: globalColors.neutral.blueGrayLight[1000],
          disabled: globalColors.neutral.blueGrayLight[500],
        },
        link: {
          default: globalColors.chromatic.azure[500],
          hover: globalColors.chromatic.azure[600],
          focus: globalColors.chromatic.azure[700],
          active: globalColors.chromatic.azure[700],
          disabled: globalColors.neutral.blueGrayLight[400],
        },
      },
    },
  },
  border,
  motion: {
    delay: {
      '2xshort': 70,
      xshort: 120,
      short: 180,
      long: 3000,
      xlong: 5000,
    },
    duration: {
      quick1: 70,
      quick2: 150,
      quick3: 200,
      moderate1: 250,
      moderate2: 300,
      gentle1: 400,
      gentle2: 600,
      gentle3: 900,
    },
    easing: {
      standard: {
        attentive: 'cubic-bezier(0.5, 0, 0.3, 1.5)',
        effective: 'cubic-bezier(0.3, 0, 0.2, 1)',
        revealing: 'cubic-bezier(0.5, 0, 0, 1)',
        wary: 'cubic-bezier(1, 0.5, 0, 0.5)',
      },
      entrance: {
        attentive: 'cubic-bezier(0.5, 0, 0.3, 1.5)',
        effective: 'cubic-bezier(0, 0, 0.2, 1)',
        revealing: 'cubic-bezier(0, 0, 0, 1)',
      },
      exit: {
        attentive: 'cubic-bezier(0.7, 0, 0.5, 1)',
        effective: 'cubic-bezier(0.17, 0, 1, 1)',
        revealing: 'cubic-bezier(0.5, 0, 1, 1)',
      },
    },
  },
  spacing,
  breakpoints,
  shadows: {
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
      level: {
        1: globalColors.neutral.blueGrayLight.a100,
        2: globalColors.neutral.blueGrayLight.a100,
        3: globalColors.neutral.blueGrayLight.a100,
        4: globalColors.neutral.blueGrayLight.a100,
        5: globalColors.neutral.blueGrayLight.a100,
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
  },
  typography: typography.onMobile,
};

export default paymentLightTheme;
