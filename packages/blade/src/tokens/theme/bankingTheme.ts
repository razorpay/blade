import border from '../global/border';
import spacing from '../global/spacing';
import globalColors from '../global/colors';
import typography from '../global/typography';
import type { Theme, Colors, Shadows } from '../theme';

const colors: Colors = {
  surface: {
    background: {
      level1: {
        lowContrast: {
          onLight: globalColors.neutral.navyGrayLight[100],
          onDark: globalColors.neutral.navyGrayDark[1300],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[1100],
          onDark: globalColors.neutral.navyGrayDark[700],
        },
      },
      level2: {
        lowContrast: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[800],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[900],
          onDark: globalColors.neutral.navyGrayDark[600],
        },
      },
      level3: {
        lowContrast: {
          onLight: globalColors.neutral.navyGrayLight[50],
          onDark: globalColors.neutral.navyGrayDark[1200],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[1300],
          onDark: globalColors.neutral.navyGrayDark[1100],
        },
      },
    },
    border: {
      normal: {
        lowContrast: {
          onLight: globalColors.neutral.navyGrayLight[400],
          onDark: globalColors.neutral.navyGrayDark[600],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[400],
          onDark: globalColors.neutral.navyGrayDark[600],
        },
      },
      subtle: {
        lowContrast: {
          onLight: globalColors.neutral.navyGrayLight[800],
          onDark: globalColors.neutral.navyGrayDark[500],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[800],
          onDark: globalColors.neutral.navyGrayDark[500],
        },
      },
    },
    text: {
      normal: {
        lowContrast: {
          onLight: globalColors.neutral.navyGrayLight[1200],
          onDark: globalColors.neutral.navyGrayDark[50],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[1200],
        },
      },
      subtle: {
        lowContrast: {
          onLight: globalColors.neutral.navyGrayLight[1000],
          onDark: globalColors.neutral.navyGrayDark[100],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[100],
          onDark: globalColors.neutral.navyGrayDark[1000],
        },
      },
      subdued: {
        lowContrast: {
          onLight: globalColors.neutral.navyGrayLight[800],
          onDark: globalColors.neutral.navyGrayDark[200],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[300],
          onDark: globalColors.neutral.navyGrayDark[700],
        },
      },
      muted: {
        lowContrast: {
          onLight: globalColors.neutral.navyGrayLight[600],
          onDark: globalColors.neutral.navyGrayDark[300],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[400],
          onDark: globalColors.neutral.navyGrayDark[400],
        },
      },
      placeholder: {
        lowContrast: {
          onLight: globalColors.neutral.navyGrayLight[500],
          onDark: globalColors.neutral.navyGrayDark[400],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[700],
          onDark: globalColors.neutral.navyGrayDark[200],
        },
      },
    },
    action: {
      icon: {
        link: {
          default: {
            lowContrast: {
              onLight: globalColors.neutral.navyGrayLight[500],
              onDark: globalColors.neutral.navyGrayDark[400],
            },
            highContrast: {
              onLight: globalColors.neutral.navyGrayLight[300],
              onDark: globalColors.neutral.navyGrayDark[100],
            },
          },
          hover: {
            lowContrast: {
              onLight: globalColors.neutral.navyGrayLight[800],
              onDark: globalColors.neutral.navyGrayDark[200],
            },
            highContrast: {
              onLight: globalColors.neutral.navyGrayLight[0],
              onDark: globalColors.neutral.navyGrayDark[0],
            },
          },
          focus: {
            lowContrast: {
              onLight: globalColors.neutral.navyGrayLight[800],
              onDark: globalColors.neutral.navyGrayDark[200],
            },
            highContrast: {
              onLight: globalColors.neutral.navyGrayLight[0],
              onDark: globalColors.neutral.navyGrayDark[0],
            },
          },
          active: {
            lowContrast: {
              onLight: globalColors.neutral.navyGrayLight[800],
              onDark: globalColors.neutral.navyGrayDark[200],
            },
            highContrast: {
              onLight: globalColors.neutral.navyGrayLight[0],
              onDark: globalColors.neutral.navyGrayDark[0],
            },
          },
          disabled: {
            lowContrast: {
              onLight: globalColors.neutral.navyGrayLight[300],
              onDark: globalColors.neutral.navyGrayDark[600],
            },
            highContrast: {
              onLight: globalColors.neutral.navyGrayLight.a200,
              onDark: globalColors.neutral.navyGrayDark.a200,
            },
          },
        },
      },
    },
  },
  brand: {
    primary: {
      300: { onLight: globalColors.chromatic.azure.a50, onDark: globalColors.chromatic.azure.a100 },
      400: {
        onLight: globalColors.chromatic.azure.a100,
        onDark: globalColors.chromatic.azure.a200,
      },
      500: {
        onLight: globalColors.chromatic.azure[500],
        onDark: globalColors.chromatic.azure[400],
      },
      600: {
        onLight: globalColors.chromatic.azure[600],
        onDark: globalColors.chromatic.azure[500],
      },
      700: {
        onLight: globalColors.chromatic.azure[700],
        onDark: globalColors.chromatic.azure[600],
      },
    },
    gray: {
      300: {
        onLight: globalColors.neutral.navyGrayLight[50],
        onDark: globalColors.neutral.navyGrayDark[600],
      },
      400: {
        onLight: globalColors.neutral.navyGrayLight[300],
        onDark: globalColors.neutral.navyGrayDark[400],
      },
      500: {
        onLight: globalColors.neutral.navyGrayLight[500],
        onDark: globalColors.neutral.navyGrayDark[300],
      },
      600: {
        onLight: globalColors.neutral.navyGrayLight[600],
        onDark: globalColors.neutral.navyGrayDark[200],
      },
      700: {
        onLight: globalColors.neutral.navyGrayLight[800],
        onDark: globalColors.neutral.navyGrayDark[50],
      },
    },
    secondary: {
      500: {
        onLight: globalColors.chromatic.cider[600],
        onDark: globalColors.chromatic.cider[600],
      },
    },
  },
  feedback: {
    background: {
      neutral: {
        lowContrast: {
          onLight: globalColors.neutral.navyGrayLight.a50,
          onDark: globalColors.neutral.navyGrayDark.a100,
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[1000],
          onDark: globalColors.neutral.navyGrayDark[50],
        },
      },
      positive: {
        lowContrast: {
          onLight: globalColors.chromatic.emerald.a50,
          onDark: globalColors.chromatic.emerald.a100,
        },
        highContrast: {
          onLight: globalColors.chromatic.emerald[700],
          onDark: globalColors.chromatic.emerald[700],
        },
      },
      negative: {
        lowContrast: {
          onLight: globalColors.chromatic.crimson.a50,
          onDark: globalColors.chromatic.crimson.a100,
        },
        highContrast: {
          onLight: globalColors.chromatic.crimson[700],
          onDark: globalColors.chromatic.crimson[700],
        },
      },
      notice: {
        lowContrast: {
          onLight: globalColors.chromatic.cider.a50,
          onDark: globalColors.chromatic.cider.a100,
        },
        highContrast: {
          onLight: globalColors.chromatic.cider[700],
          onDark: globalColors.chromatic.cider[700],
        },
      },
      information: {
        lowContrast: {
          onLight: globalColors.chromatic.sapphire.a50,
          onDark: globalColors.chromatic.sapphire.a100,
        },
        highContrast: {
          onLight: globalColors.chromatic.sapphire[600],
          onDark: globalColors.chromatic.sapphire[600],
        },
      },
    },
    border: {
      neutral: {
        lowContrast: {
          onLight: globalColors.neutral.navyGrayLight.a200,
          onDark: globalColors.neutral.navyGrayDark.a200,
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[1000],
          onDark: globalColors.neutral.navyGrayDark[50],
        },
      },
      positive: {
        lowContrast: {
          onLight: globalColors.chromatic.emerald.a200,
          onDark: globalColors.chromatic.emerald.a200,
        },
        highContrast: {
          onLight: globalColors.chromatic.emerald[700],
          onDark: globalColors.chromatic.emerald[700],
        },
      },
      negative: {
        lowContrast: {
          onLight: globalColors.chromatic.crimson.a200,
          onDark: globalColors.chromatic.crimson.a200,
        },
        highContrast: {
          onLight: globalColors.chromatic.crimson[700],
          onDark: globalColors.chromatic.crimson[700],
        },
      },
      notice: {
        lowContrast: {
          onLight: globalColors.chromatic.cider.a200,
          onDark: globalColors.chromatic.cider.a200,
        },
        highContrast: {
          onLight: globalColors.chromatic.cider[700],
          onDark: globalColors.chromatic.cider[700],
        },
      },
      information: {
        lowContrast: {
          onLight: globalColors.chromatic.sapphire.a200,
          onDark: globalColors.chromatic.sapphire.a200,
        },
        highContrast: {
          onLight: globalColors.chromatic.sapphire[600],
          onDark: globalColors.chromatic.sapphire[600],
        },
      },
    },
    text: {
      neutral: {
        lowContrast: {
          onLight: globalColors.neutral.navyGrayLight[900],
          onDark: globalColors.neutral.navyGrayDark[100],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[800],
        },
      },
      positive: {
        lowContrast: {
          onLight: globalColors.chromatic.emerald[700],
          onDark: globalColors.chromatic.emerald[300],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[0],
        },
      },
      negative: {
        lowContrast: {
          onLight: globalColors.chromatic.crimson[700],
          onDark: globalColors.chromatic.crimson[400],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[0],
        },
      },
      notice: {
        lowContrast: {
          onLight: globalColors.chromatic.cider[700],
          onDark: globalColors.chromatic.crimson[400],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[0],
        },
      },
      information: {
        lowContrast: {
          onLight: globalColors.chromatic.sapphire[600],
          onDark: globalColors.chromatic.sapphire[400],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[0],
        },
      },
    },
    icon: {
      neutral: {
        lowContrast: {
          onLight: globalColors.neutral.navyGrayLight[900],
          onDark: globalColors.neutral.navyGrayDark[100],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[800],
        },
      },
      positive: {
        lowContrast: {
          onLight: globalColors.chromatic.emerald[700],
          onDark: globalColors.chromatic.emerald[300],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[0],
        },
      },
      negative: {
        lowContrast: {
          onLight: globalColors.chromatic.crimson[700],
          onDark: globalColors.chromatic.crimson[600],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[0],
        },
      },
      notice: {
        lowContrast: {
          onLight: globalColors.chromatic.cider[700],
          onDark: globalColors.chromatic.cider[400],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[0],
        },
      },
      information: {
        lowContrast: {
          onLight: globalColors.chromatic.sapphire[600],
          onDark: globalColors.chromatic.sapphire[400],
        },
        highContrast: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[0],
        },
      },
    },
    neutral: {
      action: {
        background: {
          primary: {
            default: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight.a50,
                onDark: globalColors.neutral.navyGrayDark.a50,
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[1000],
                onDark: globalColors.neutral.navyGrayDark[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight.a100,
                onDark: globalColors.neutral.navyGrayDark.a100,
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[1100],
                onDark: globalColors.neutral.navyGrayDark[100],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight.a200,
                onDark: globalColors.neutral.navyGrayDark.a200,
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[1200],
                onDark: globalColors.neutral.navyGrayDark[200],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight.a200,
                onDark: globalColors.neutral.navyGrayDark.a200,
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[1200],
                onDark: globalColors.neutral.navyGrayDark[200],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight.a50,
                onDark: globalColors.neutral.navyGrayDark.a50,
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[1000],
                onDark: globalColors.neutral.navyGrayDark[50],
              },
            },
          },
        },
        border: {
          primary: {
            default: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight.a200,
                onDark: globalColors.neutral.navyGrayDark[400],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[500],
                onDark: globalColors.neutral.navyGrayDark[300],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight.a200,
                onDark: globalColors.neutral.navyGrayDark[400],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[500],
                onDark: globalColors.neutral.navyGrayDark[300],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight.a200,
                onDark: globalColors.neutral.navyGrayDark[400],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[500],
                onDark: globalColors.neutral.navyGrayDark[300],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight.a200,
                onDark: globalColors.neutral.navyGrayDark[400],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[500],
                onDark: globalColors.neutral.navyGrayDark[300],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight.a200,
                onDark: globalColors.neutral.navyGrayDark[400],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[700],
                onDark: globalColors.neutral.navyGrayDark[300],
              },
            },
          },
        },
        text: {
          primary: {
            default: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight[900],
                onDark: globalColors.neutral.navyGrayDark[100],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[50],
                onDark: globalColors.neutral.navyGrayDark[700],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight[900],
                onDark: globalColors.neutral.navyGrayDark[100],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[50],
                onDark: globalColors.neutral.navyGrayDark[700],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight[900],
                onDark: globalColors.neutral.navyGrayDark[100],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[50],
                onDark: globalColors.neutral.navyGrayDark[700],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight[900],
                onDark: globalColors.neutral.navyGrayDark[100],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[50],
                onDark: globalColors.neutral.navyGrayDark[700],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight.a200,
                onDark: globalColors.neutral.navyGrayDark[400],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[700],
                onDark: globalColors.neutral.navyGrayDark[300],
              },
            },
          },
          link: {
            default: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight[900],
                onDark: globalColors.neutral.navyGrayDark[100],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[50],
                onDark: globalColors.neutral.navyGrayDark[700],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight[800],
                onDark: globalColors.neutral.navyGrayDark[200],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[200],
                onDark: globalColors.neutral.navyGrayDark[500],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight[1000],
                onDark: globalColors.neutral.navyGrayDark[300],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[400],
                onDark: globalColors.neutral.navyGrayDark[400],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight[1000],
                onDark: globalColors.neutral.navyGrayDark[300],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[400],
                onDark: globalColors.neutral.navyGrayDark[400],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight.a200,
                onDark: globalColors.neutral.navyGrayDark[400],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[700],
                onDark: globalColors.neutral.navyGrayDark[300],
              },
            },
          },
        },
        icon: {
          primary: {
            default: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight[900],
                onDark: globalColors.neutral.navyGrayDark[100],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[50],
                onDark: globalColors.neutral.navyGrayDark[700],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight[900],
                onDark: globalColors.neutral.navyGrayDark[100],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[50],
                onDark: globalColors.neutral.navyGrayDark[700],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight[900],
                onDark: globalColors.neutral.navyGrayDark[100],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[50],
                onDark: globalColors.neutral.navyGrayDark[700],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight[900],
                onDark: globalColors.neutral.navyGrayDark[100],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[50],
                onDark: globalColors.neutral.navyGrayDark[700],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight.a200,
                onDark: globalColors.neutral.navyGrayDark[400],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[700],
                onDark: globalColors.neutral.navyGrayDark[300],
              },
            },
          },
          link: {
            default: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight[900],
                onDark: globalColors.neutral.navyGrayDark[100],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[50],
                onDark: globalColors.neutral.navyGrayDark[700],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight[800],
                onDark: globalColors.neutral.navyGrayDark[200],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[200],
                onDark: globalColors.neutral.navyGrayDark[500],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight[1000],
                onDark: globalColors.neutral.navyGrayDark[300],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[400],
                onDark: globalColors.neutral.navyGrayDark[400],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight[1000],
                onDark: globalColors.neutral.navyGrayDark[300],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[400],
                onDark: globalColors.neutral.navyGrayDark[400],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.neutral.navyGrayLight.a200,
                onDark: globalColors.neutral.navyGrayDark[400],
              },
              highContrast: {
                onLight: globalColors.neutral.navyGrayLight[700],
                onDark: globalColors.neutral.navyGrayDark[300],
              },
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
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a50,
                onDark: globalColors.chromatic.emerald.a50,
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[700],
                onDark: globalColors.chromatic.emerald[700],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a100,
                onDark: globalColors.chromatic.emerald.a100,
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[800],
                onDark: globalColors.chromatic.emerald[800],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a200,
                onDark: globalColors.chromatic.emerald.a200,
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[900],
                onDark: globalColors.chromatic.emerald[900],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a100,
                onDark: globalColors.chromatic.emerald.a200,
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[900],
                onDark: globalColors.chromatic.emerald[900],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a50,
                onDark: globalColors.chromatic.emerald.a50,
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[700],
                onDark: globalColors.chromatic.emerald[700],
              },
            },
          },
        },
        border: {
          primary: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a200,
                onDark: globalColors.chromatic.emerald[700],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[50],
                onDark: globalColors.chromatic.emerald[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a200,
                onDark: globalColors.chromatic.emerald[700],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[50],
                onDark: globalColors.chromatic.emerald[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a200,
                onDark: globalColors.chromatic.emerald[700],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[50],
                onDark: globalColors.chromatic.emerald[50],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a200,
                onDark: globalColors.chromatic.emerald[700],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[50],
                onDark: globalColors.chromatic.emerald[50],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a200,
                onDark: globalColors.chromatic.emerald[700],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[500],
                onDark: globalColors.chromatic.emerald[500],
              },
            },
          },
        },
        text: {
          primary: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[700],
                onDark: globalColors.chromatic.emerald[300],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[50],
                onDark: globalColors.chromatic.emerald[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[700],
                onDark: globalColors.chromatic.emerald[300],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[50],
                onDark: globalColors.chromatic.emerald[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[700],
                onDark: globalColors.chromatic.emerald[300],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[50],
                onDark: globalColors.chromatic.emerald[50],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[700],
                onDark: globalColors.chromatic.emerald[300],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[50],
                onDark: globalColors.chromatic.emerald[50],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a200,
                onDark: globalColors.chromatic.emerald[800],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[500],
                onDark: globalColors.chromatic.emerald[500],
              },
            },
          },
          link: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[700],
                onDark: globalColors.chromatic.emerald[300],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[50],
                onDark: globalColors.chromatic.emerald[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[600],
                onDark: globalColors.chromatic.emerald[400],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[50],
                onDark: globalColors.chromatic.emerald[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[800],
                onDark: globalColors.chromatic.emerald[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[100],
                onDark: globalColors.chromatic.emerald[100],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[800],
                onDark: globalColors.chromatic.emerald[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[100],
                onDark: globalColors.chromatic.emerald[100],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[200],
                onDark: globalColors.chromatic.emerald[800],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[100],
                onDark: globalColors.chromatic.emerald[100],
              },
            },
          },
        },
        icon: {
          primary: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[700],
                onDark: globalColors.chromatic.emerald[300],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[50],
                onDark: globalColors.chromatic.emerald[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[700],
                onDark: globalColors.chromatic.emerald[300],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[50],
                onDark: globalColors.chromatic.emerald[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[700],
                onDark: globalColors.chromatic.emerald[300],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[50],
                onDark: globalColors.chromatic.emerald[50],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[700],
                onDark: globalColors.chromatic.emerald[300],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[50],
                onDark: globalColors.chromatic.emerald[50],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a200,
                onDark: globalColors.chromatic.emerald[800],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[500],
                onDark: globalColors.chromatic.emerald[500],
              },
            },
          },
          link: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[700],
                onDark: globalColors.chromatic.emerald[300],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[50],
                onDark: globalColors.chromatic.emerald[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[600],
                onDark: globalColors.chromatic.emerald[400],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[50],
                onDark: globalColors.chromatic.emerald[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[800],
                onDark: globalColors.chromatic.emerald[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[100],
                onDark: globalColors.chromatic.emerald[100],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[800],
                onDark: globalColors.chromatic.emerald[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[100],
                onDark: globalColors.chromatic.emerald[100],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald[200],
                onDark: globalColors.chromatic.emerald[800],
              },
              highContrast: {
                onLight: globalColors.chromatic.emerald[100],
                onDark: globalColors.chromatic.emerald[100],
              },
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
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a50,
                onDark: globalColors.chromatic.crimson.a50,
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[700],
                onDark: globalColors.chromatic.crimson[700],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a100,
                onDark: globalColors.chromatic.crimson.a100,
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[800],
                onDark: globalColors.chromatic.crimson[800],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a200,
                onDark: globalColors.chromatic.crimson.a200,
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[900],
                onDark: globalColors.chromatic.crimson[900],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a200,
                onDark: globalColors.chromatic.crimson.a200,
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[900],
                onDark: globalColors.chromatic.crimson[900],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.emerald.a50,
                onDark: globalColors.chromatic.crimson.a50,
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[700],
                onDark: globalColors.chromatic.crimson[700],
              },
            },
          },
        },
        border: {
          primary: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson.a200,
                onDark: globalColors.chromatic.crimson[700],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[50],
                onDark: globalColors.chromatic.crimson[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson.a200,
                onDark: globalColors.chromatic.crimson[700],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[50],
                onDark: globalColors.chromatic.crimson[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson.a200,
                onDark: globalColors.chromatic.crimson[700],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[50],
                onDark: globalColors.chromatic.crimson[50],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson.a200,
                onDark: globalColors.chromatic.crimson[700],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[50],
                onDark: globalColors.chromatic.crimson[50],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson.a200,
                onDark: globalColors.chromatic.crimson[900],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[500],
                onDark: globalColors.chromatic.crimson[500],
              },
            },
          },
        },
        text: {
          primary: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson[700],
                onDark: globalColors.chromatic.crimson[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[50],
                onDark: globalColors.chromatic.crimson[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson[700],
                onDark: globalColors.chromatic.crimson[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[50],
                onDark: globalColors.chromatic.crimson[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson[700],
                onDark: globalColors.chromatic.crimson[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[50],
                onDark: globalColors.chromatic.crimson[50],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson[700],
                onDark: globalColors.chromatic.crimson[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[50],
                onDark: globalColors.chromatic.crimson[50],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson.a200,
                onDark: globalColors.chromatic.crimson[800],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[500],
                onDark: globalColors.chromatic.crimson[500],
              },
            },
          },
          link: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson[700],
                onDark: globalColors.chromatic.crimson[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[50],
                onDark: globalColors.chromatic.crimson[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson[600],
                onDark: globalColors.chromatic.crimson[400],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[50],
                onDark: globalColors.chromatic.crimson[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson[800],
                onDark: globalColors.chromatic.crimson[600],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[100],
                onDark: globalColors.chromatic.crimson[100],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson[800],
                onDark: globalColors.chromatic.crimson[600],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[100],
                onDark: globalColors.chromatic.crimson[100],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson.a200,
                onDark: globalColors.chromatic.crimson[900],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[500],
                onDark: globalColors.chromatic.crimson[500],
              },
            },
          },
        },
        icon: {
          primary: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson[700],
                onDark: globalColors.chromatic.crimson[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[50],
                onDark: globalColors.chromatic.crimson[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson[700],
                onDark: globalColors.chromatic.crimson[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[50],
                onDark: globalColors.chromatic.crimson[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson[700],
                onDark: globalColors.chromatic.crimson[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[50],
                onDark: globalColors.chromatic.crimson[50],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson[700],
                onDark: globalColors.chromatic.crimson[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[50],
                onDark: globalColors.chromatic.crimson[50],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson.a200,
                onDark: globalColors.chromatic.crimson[800],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[500],
                onDark: globalColors.chromatic.crimson[500],
              },
            },
          },
          link: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson[700],
                onDark: globalColors.chromatic.crimson[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[50],
                onDark: globalColors.chromatic.crimson[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson[600],
                onDark: globalColors.chromatic.crimson[400],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[50],
                onDark: globalColors.chromatic.crimson[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson[800],
                onDark: globalColors.chromatic.crimson[600],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[100],
                onDark: globalColors.chromatic.crimson[100],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson[800],
                onDark: globalColors.chromatic.crimson[600],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[100],
                onDark: globalColors.chromatic.crimson[100],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.crimson.a200,
                onDark: globalColors.chromatic.crimson[900],
              },
              highContrast: {
                onLight: globalColors.chromatic.crimson[500],
                onDark: globalColors.chromatic.crimson[500],
              },
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
              lowContrast: {
                onLight: globalColors.chromatic.cider.a50,
                onDark: globalColors.chromatic.cider.a50,
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[700],
                onDark: globalColors.chromatic.cider[700],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.cider.a100,
                onDark: globalColors.chromatic.cider.a100,
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[800],
                onDark: globalColors.chromatic.cider[800],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.cider.a200,
                onDark: globalColors.chromatic.cider.a200,
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[900],
                onDark: globalColors.chromatic.cider[900],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.cider.a200,
                onDark: globalColors.chromatic.cider.a200,
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[900],
                onDark: globalColors.chromatic.cider[900],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.cider.a50,
                onDark: globalColors.chromatic.cider.a50,
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[700],
                onDark: globalColors.chromatic.cider[700],
              },
            },
          },
        },
        border: {
          primary: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.cider.a200,
                onDark: globalColors.chromatic.cider[800],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[50],
                onDark: globalColors.chromatic.cider[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.cider.a200,
                onDark: globalColors.chromatic.cider[800],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[50],
                onDark: globalColors.chromatic.cider[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.cider.a200,
                onDark: globalColors.chromatic.cider[800],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[50],
                onDark: globalColors.chromatic.cider[50],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.cider.a200,
                onDark: globalColors.chromatic.cider[800],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[50],
                onDark: globalColors.chromatic.cider[50],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.cider.a200,
                onDark: globalColors.chromatic.cider[900],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[500],
                onDark: globalColors.chromatic.cider[500],
              },
            },
          },
        },
        text: {
          primary: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.cider[700],
                onDark: globalColors.chromatic.cider[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[50],
                onDark: globalColors.chromatic.cider[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.cider[700],
                onDark: globalColors.chromatic.cider[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[50],
                onDark: globalColors.chromatic.cider[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.cider[700],
                onDark: globalColors.chromatic.cider[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[50],
                onDark: globalColors.chromatic.cider[50],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.cider[700],
                onDark: globalColors.chromatic.cider[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[50],
                onDark: globalColors.chromatic.cider[50],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.cider.a200,
                onDark: globalColors.chromatic.cider[900],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[500],
                onDark: globalColors.chromatic.cider[500],
              },
            },
          },
          link: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.cider[700],
                onDark: globalColors.chromatic.cider[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[50],
                onDark: globalColors.chromatic.cider[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.cider[600],
                onDark: globalColors.chromatic.cider[400],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[50],
                onDark: globalColors.chromatic.cider[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.cider[800],
                onDark: globalColors.chromatic.cider[600],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[100],
                onDark: globalColors.chromatic.cider[100],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.cider[800],
                onDark: globalColors.chromatic.cider[600],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[100],
                onDark: globalColors.chromatic.cider[100],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.cider.a200,
                onDark: globalColors.chromatic.cider[600],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[500],
                onDark: globalColors.chromatic.cider[500],
              },
            },
          },
        },
        icon: {
          primary: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.cider[700],
                onDark: globalColors.chromatic.cider[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[50],
                onDark: globalColors.chromatic.cider[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.cider[700],
                onDark: globalColors.chromatic.cider[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[50],
                onDark: globalColors.chromatic.cider[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.cider[700],
                onDark: globalColors.chromatic.cider[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[50],
                onDark: globalColors.chromatic.cider[50],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.cider[700],
                onDark: globalColors.chromatic.cider[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[50],
                onDark: globalColors.chromatic.cider[50],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.cider.a200,
                onDark: globalColors.chromatic.cider[900],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[500],
                onDark: globalColors.chromatic.cider[500],
              },
            },
          },
          link: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.cider[700],
                onDark: globalColors.chromatic.cider[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[50],
                onDark: globalColors.chromatic.cider[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.cider[600],
                onDark: globalColors.chromatic.cider[400],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[50],
                onDark: globalColors.chromatic.cider[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.cider[800],
                onDark: globalColors.chromatic.cider[600],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[100],
                onDark: globalColors.chromatic.cider[100],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.cider[800],
                onDark: globalColors.chromatic.cider[600],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[100],
                onDark: globalColors.chromatic.cider[100],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.cider.a200,
                onDark: globalColors.chromatic.cider[600],
              },
              highContrast: {
                onLight: globalColors.chromatic.cider[500],
                onDark: globalColors.chromatic.cider[500],
              },
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
              lowContrast: {
                onLight: globalColors.chromatic.sapphire.a50,
                onDark: globalColors.chromatic.sapphire[700],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[600],
                onDark: globalColors.chromatic.sapphire[600],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire.a100,
                onDark: globalColors.chromatic.sapphire.a100,
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[700],
                onDark: globalColors.chromatic.sapphire[700],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire.a200,
                onDark: globalColors.chromatic.sapphire.a200,
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[800],
                onDark: globalColors.chromatic.sapphire[800],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire.a200,
                onDark: globalColors.chromatic.sapphire.a200,
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[800],
                onDark: globalColors.chromatic.sapphire[800],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire.a50,
                onDark: globalColors.chromatic.sapphire.a50,
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[600],
                onDark: globalColors.chromatic.sapphire[600],
              },
            },
          },
        },
        border: {
          primary: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire.a200,
                onDark: globalColors.chromatic.sapphire[700],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[50],
                onDark: globalColors.chromatic.sapphire[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire.a200,
                onDark: globalColors.chromatic.sapphire[700],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[50],
                onDark: globalColors.chromatic.sapphire[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire.a200,
                onDark: globalColors.chromatic.sapphire[700],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[50],
                onDark: globalColors.chromatic.sapphire[50],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire.a200,
                onDark: globalColors.chromatic.sapphire[700],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[50],
                onDark: globalColors.chromatic.sapphire[50],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire.a200,
                onDark: globalColors.chromatic.sapphire[900],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[400],
                onDark: globalColors.chromatic.sapphire[400],
              },
            },
          },
        },
        text: {
          primary: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire[700],
                onDark: globalColors.chromatic.sapphire[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[600],
                onDark: globalColors.chromatic.sapphire[600],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire[700],
                onDark: globalColors.chromatic.sapphire[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[600],
                onDark: globalColors.chromatic.sapphire[600],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire[700],
                onDark: globalColors.chromatic.sapphire[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[600],
                onDark: globalColors.chromatic.sapphire[600],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire[700],
                onDark: globalColors.chromatic.sapphire[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[600],
                onDark: globalColors.chromatic.sapphire[600],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire.a200,
                onDark: globalColors.chromatic.sapphire[900],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[400],
                onDark: globalColors.chromatic.sapphire[400],
              },
            },
          },
          link: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire[700],
                onDark: globalColors.chromatic.sapphire[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[50],
                onDark: globalColors.chromatic.sapphire[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire[600],
                onDark: globalColors.chromatic.sapphire[400],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[50],
                onDark: globalColors.chromatic.sapphire[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire[800],
                onDark: globalColors.chromatic.sapphire[600],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[100],
                onDark: globalColors.chromatic.sapphire[100],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire[800],
                onDark: globalColors.chromatic.sapphire[600],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[100],
                onDark: globalColors.chromatic.sapphire[100],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire.a200,
                onDark: globalColors.chromatic.sapphire[900],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[400],
                onDark: globalColors.chromatic.sapphire[400],
              },
            },
          },
        },
        icon: {
          primary: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire[700],
                onDark: globalColors.chromatic.sapphire[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[600],
                onDark: globalColors.chromatic.sapphire[600],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire[700],
                onDark: globalColors.chromatic.sapphire[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[600],
                onDark: globalColors.chromatic.sapphire[600],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire[700],
                onDark: globalColors.chromatic.sapphire[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[600],
                onDark: globalColors.chromatic.sapphire[600],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire[700],
                onDark: globalColors.chromatic.sapphire[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[600],
                onDark: globalColors.chromatic.sapphire[600],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire.a200,
                onDark: globalColors.chromatic.sapphire[900],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[400],
                onDark: globalColors.chromatic.sapphire[400],
              },
            },
          },
          link: {
            default: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire[700],
                onDark: globalColors.chromatic.sapphire[500],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[50],
                onDark: globalColors.chromatic.sapphire[50],
              },
            },
            hover: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire[600],
                onDark: globalColors.chromatic.sapphire[400],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[50],
                onDark: globalColors.chromatic.sapphire[50],
              },
            },
            focus: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire[800],
                onDark: globalColors.chromatic.sapphire[600],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[100],
                onDark: globalColors.chromatic.sapphire[100],
              },
            },
            active: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire[800],
                onDark: globalColors.chromatic.sapphire[600],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[100],
                onDark: globalColors.chromatic.sapphire[100],
              },
            },
            disabled: {
              lowContrast: {
                onLight: globalColors.chromatic.sapphire.a200,
                onDark: globalColors.chromatic.sapphire[900],
              },
              highContrast: {
                onLight: globalColors.chromatic.sapphire[400],
                onDark: globalColors.chromatic.sapphire[400],
              },
            },
          },
        },
      },
    },
  },
  action: {
    background: {
      primary: {
        default: {
          onLight: globalColors.chromatic.azure[500],
          onDark: globalColors.chromatic.azure[500],
        },
        hover: {
          onLight: globalColors.chromatic.azure[600],
          onDark: globalColors.chromatic.azure[600],
        },
        focus: {
          onLight: globalColors.chromatic.azure[700],
          onDark: globalColors.chromatic.azure[700],
        },
        active: {
          onLight: globalColors.chromatic.azure[800],
          onDark: globalColors.chromatic.azure[800],
        },
        disabled: {
          onLight: globalColors.neutral.navyGrayLight[300],
          onDark: globalColors.neutral.navyGrayDark[600],
        },
      },
      secondary: {
        default: {
          onLight: globalColors.chromatic.azure.a00,
          onDark: globalColors.chromatic.azure.a00,
        },
        hover: {
          onLight: globalColors.chromatic.azure.a50,
          onDark: globalColors.chromatic.azure.a50,
        },
        focus: {
          onLight: globalColors.chromatic.azure.a100,
          onDark: globalColors.chromatic.azure.a100,
        },
        active: {
          onLight: globalColors.chromatic.azure.a200,
          onDark: globalColors.chromatic.azure.a200,
        },
        disabled: {
          onLight: globalColors.neutral.navyGrayLight.a00,
          onDark: globalColors.neutral.navyGrayDark.a00,
        },
      },
      tertiary: {
        default: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[800],
        },
        hover: {
          onLight: globalColors.neutral.navyGrayLight[50],
          onDark: globalColors.neutral.navyGrayDark[900],
        },
        focus: {
          onLight: globalColors.neutral.navyGrayLight[100],
          onDark: globalColors.neutral.navyGrayDark[1000],
        },
        active: {
          onLight: globalColors.neutral.navyGrayLight[200],
          onDark: globalColors.neutral.navyGrayDark[1100],
        },
        disabled: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[800],
        },
      },
    },
    border: {
      primary: {
        default: {
          onLight: globalColors.chromatic.azure[500],
          onDark: globalColors.chromatic.azure[500],
        },
        hover: {
          onLight: globalColors.chromatic.azure[600],
          onDark: globalColors.chromatic.azure[600],
        },
        focus: {
          onLight: globalColors.chromatic.azure[700],
          onDark: globalColors.chromatic.azure[700],
        },
        active: {
          onLight: globalColors.chromatic.azure[800],
          onDark: globalColors.chromatic.azure[800],
        },
        disabled: {
          onLight: globalColors.neutral.navyGrayLight[300],
          onDark: globalColors.neutral.navyGrayDark[600],
        },
      },
      secondary: {
        default: {
          onLight: globalColors.chromatic.azure[500],
          onDark: globalColors.chromatic.azure[500],
        },
        hover: {
          onLight: globalColors.chromatic.azure[500],
          onDark: globalColors.chromatic.azure[500],
        },
        focus: {
          onLight: globalColors.chromatic.azure[500],
          onDark: globalColors.chromatic.azure[500],
        },
        active: {
          onLight: globalColors.chromatic.azure[500],
          onDark: globalColors.chromatic.azure[500],
        },
        disabled: {
          onLight: globalColors.neutral.navyGrayLight[600],
          onDark: globalColors.neutral.navyGrayDark[300],
        },
      },
      tertiary: {
        default: {
          onLight: globalColors.neutral.navyGrayLight[400],
          onDark: globalColors.neutral.navyGrayDark[400],
        },
        hover: {
          onLight: globalColors.neutral.navyGrayLight[400],
          onDark: globalColors.neutral.navyGrayDark[400],
        },
        focus: {
          onLight: globalColors.neutral.navyGrayLight[400],
          onDark: globalColors.neutral.navyGrayDark[400],
        },
        active: {
          onLight: globalColors.neutral.navyGrayLight[400],
          onDark: globalColors.neutral.navyGrayDark[400],
        },
        disabled: {
          onLight: globalColors.neutral.navyGrayLight[400],
          onDark: globalColors.neutral.navyGrayDark[600],
        },
      },
    },
    text: {
      primary: {
        default: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[0],
        },
        hover: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[0],
        },
        focus: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[0],
        },
        active: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[0],
        },
        disabled: {
          onLight: globalColors.neutral.navyGrayLight[600],
          onDark: globalColors.neutral.navyGrayDark[300],
        },
      },
      secondary: {
        default: {
          onLight: globalColors.chromatic.azure[600],
          onDark: globalColors.chromatic.azure[600],
        },
        hover: {
          onLight: globalColors.chromatic.azure[600],
          onDark: globalColors.chromatic.azure[600],
        },
        focus: {
          onLight: globalColors.chromatic.azure[600],
          onDark: globalColors.chromatic.azure[600],
        },
        active: {
          onLight: globalColors.chromatic.azure[600],
          onDark: globalColors.chromatic.azure[600],
        },
        disabled: {
          onLight: globalColors.neutral.navyGrayLight[600],
          onDark: globalColors.neutral.navyGrayDark[300],
        },
      },
      tertiary: {
        default: {
          onLight: globalColors.neutral.navyGrayLight[1000],
          onDark: globalColors.neutral.navyGrayDark[100],
        },
        hover: {
          onLight: globalColors.neutral.navyGrayLight[1000],
          onDark: globalColors.neutral.navyGrayDark[100],
        },
        focus: {
          onLight: globalColors.neutral.navyGrayLight[1000],
          onDark: globalColors.neutral.navyGrayDark[100],
        },
        active: {
          onLight: globalColors.neutral.navyGrayLight[1000],
          onDark: globalColors.neutral.navyGrayDark[100],
        },
        disabled: {
          onLight: globalColors.neutral.navyGrayLight[500],
          onDark: globalColors.neutral.navyGrayDark[400],
        },
      },
      link: {
        default: {
          onLight: globalColors.chromatic.azure[500],
          onDark: globalColors.chromatic.azure[300],
        },
        hover: {
          onLight: globalColors.chromatic.azure[600],
          onDark: globalColors.chromatic.azure[400],
        },
        focus: {
          onLight: globalColors.chromatic.azure[700],
          onDark: globalColors.chromatic.azure[500],
        },
        active: {
          onLight: globalColors.chromatic.azure[700],
          onDark: globalColors.chromatic.azure[500],
        },
        disabled: {
          onLight: globalColors.neutral.navyGrayLight[400],
          onDark: globalColors.neutral.navyGrayDark[400],
        },
      },
    },
    icon: {
      primary: {
        default: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[0],
        },
        hover: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[0],
        },
        focus: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[0],
        },
        active: {
          onLight: globalColors.neutral.navyGrayLight[0],
          onDark: globalColors.neutral.navyGrayDark[0],
        },
        disabled: {
          onLight: globalColors.neutral.navyGrayLight[600],
          onDark: globalColors.neutral.navyGrayDark[300],
        },
      },
      secondary: {
        default: {
          onLight: globalColors.chromatic.azure[600],
          onDark: globalColors.chromatic.azure[600],
        },
        hover: {
          onLight: globalColors.chromatic.azure[600],
          onDark: globalColors.chromatic.azure[600],
        },
        focus: {
          onLight: globalColors.chromatic.azure[600],
          onDark: globalColors.chromatic.azure[600],
        },
        active: {
          onLight: globalColors.chromatic.azure[600],
          onDark: globalColors.chromatic.azure[600],
        },
        disabled: {
          onLight: globalColors.neutral.navyGrayLight[600],
          onDark: globalColors.neutral.navyGrayDark[300],
        },
      },
      tertiary: {
        default: {
          onLight: globalColors.neutral.navyGrayLight[1000],
          onDark: globalColors.neutral.navyGrayDark[100],
        },
        hover: {
          onLight: globalColors.neutral.navyGrayLight[1000],
          onDark: globalColors.neutral.navyGrayDark[100],
        },
        focus: {
          onLight: globalColors.neutral.navyGrayLight[1000],
          onDark: globalColors.neutral.navyGrayDark[100],
        },
        active: {
          onLight: globalColors.neutral.navyGrayLight[1000],
          onDark: globalColors.neutral.navyGrayDark[100],
        },
        disabled: {
          onLight: globalColors.neutral.navyGrayLight[500],
          onDark: globalColors.neutral.navyGrayDark[400],
        },
      },
      link: {
        default: {
          onLight: globalColors.chromatic.azure[500],
          onDark: globalColors.chromatic.azure[300],
        },
        hover: {
          onLight: globalColors.chromatic.azure[600],
          onDark: globalColors.chromatic.azure[400],
        },
        focus: {
          onLight: globalColors.chromatic.azure[700],
          onDark: globalColors.chromatic.azure[500],
        },
        active: {
          onLight: globalColors.chromatic.azure[700],
          onDark: globalColors.chromatic.azure[500],
        },
        disabled: {
          onLight: globalColors.neutral.navyGrayLight[400],
          onDark: globalColors.neutral.navyGrayDark[400],
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
      1: 2,
      2: 2,
      3: 2,
      4: 2,
      5: 2,
    },
  },
  blurRadius: {
    level: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  },
  color: {
    level: {
      1: {
        onLight: colors.brand.gray[700].onLight,
        onDark: colors.brand.gray[700].onDark,
      },
      2: {
        onLight: colors.brand.gray[700].onLight,
        onDark: colors.brand.gray[700].onDark,
      },
      3: {
        onLight: colors.brand.gray[700].onLight,
        onDark: colors.brand.gray[700].onDark,
      },
      4: {
        onLight: colors.brand.gray[700].onLight,
        onDark: colors.brand.gray[700].onDark,
      },
      5: {
        onLight: colors.brand.gray[700].onLight,
        onDark: colors.brand.gray[700].onDark,
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

const bankingTheme: Theme = {
  colors,
  border,
  spacing,
  shadows,
  typography,
};

export default bankingTheme;
