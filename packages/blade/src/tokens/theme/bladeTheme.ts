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
    interactive: {
      icon: {
        gray: {
          normal: globalColors.neutral.blueGrayLight[1200],
          subtle: globalColors.neutral.blueGrayLight[900],
          muted: globalColors.neutral.blueGrayLight[600],
          disabled: globalColors.neutral.blueGrayLight.a200,
        },
        staticWhite: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[300],
          disabled: globalColors.neutral.white[100],
        },
        positive: {
          normal: globalColors.chromatic.emerald[700],
          subtle: globalColors.chromatic.emerald[600],
          muted: globalColors.chromatic.emerald[400],
          disabled: globalColors.chromatic.emerald.a200,
        },
        negative: {
          normal: globalColors.chromatic.crimson[700],
          subtle: globalColors.chromatic.crimson[600],
          muted: globalColors.chromatic.crimson[400],
          disabled: globalColors.chromatic.crimson.a200,
        },
        notice: {
          normal: globalColors.chromatic.cider[700],
          subtle: globalColors.chromatic.cider[600],
          muted: globalColors.chromatic.cider[400],
          disabled: globalColors.chromatic.cider.a200,
        },
        information: {
          normal: globalColors.chromatic.sapphire[700],
          subtle: globalColors.chromatic.sapphire[600],
          muted: globalColors.chromatic.sapphire[400],
          disabled: globalColors.chromatic.sapphire.a200,
        },
        neutral: {
          normal: globalColors.neutral.blueGrayLight[1200],
          subtle: globalColors.neutral.blueGrayLight[900],
          muted: globalColors.neutral.blueGrayLight[600],
          disabled: globalColors.neutral.blueGrayLight.a200,
        },
        primary: {
          normal: globalColors.chromatic.azure[700],
          subtle: globalColors.chromatic.azure[600],
          muted: globalColors.chromatic.azure[400],
          disabled: globalColors.chromatic.azure.a100,
        },
        staticBlack: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[400],
          muted: globalColors.neutral.black[300],
          disabled: globalColors.neutral.black[100],
        },
      },
      background: {
        positive: {
          default: globalColors.chromatic.emerald[600],
          highlighted: globalColors.chromatic.emerald[700],
          disabled: globalColors.chromatic.emerald.a50,
          faded: globalColors.chromatic.emerald.a100,
        },
        negative: {
          default: globalColors.chromatic.crimson[600],
          highlighted: globalColors.chromatic.crimson[700],
          disabled: globalColors.chromatic.crimson.a50,
          faded: globalColors.chromatic.crimson.a100,
        },
        notice: {
          default: globalColors.chromatic.cider[600],
          highlighted: globalColors.chromatic.cider[700],
          disabled: globalColors.chromatic.cider.a50,
          faded: globalColors.chromatic.cider.a100,
        },
        information: {
          default: globalColors.chromatic.sapphire[600],
          highlighted: globalColors.chromatic.sapphire[700],
          disabled: globalColors.chromatic.sapphire.a50,
          faded: globalColors.chromatic.sapphire.a100,
        },
        neutral: {
          default: globalColors.neutral.blueGrayLight[1000],
          highlighted: globalColors.neutral.blueGrayLight[1100],
          disabled: globalColors.neutral.blueGrayLight.a100,
          faded: globalColors.neutral.blueGrayLight.a100,
        },
        primary: {
          default: globalColors.chromatic.azure[500],
          highlighted: globalColors.chromatic.azure[700],
          disabled: globalColors.chromatic.azure.a100,
          faded: globalColors.chromatic.azure.a100,
        },
        gray: {
          default: globalColors.neutral.blueGrayLight.a50,
          highlighted: globalColors.neutral.blueGrayLight.a100,
          disabled: globalColors.neutral.blueGrayLight.a50,
          faded: globalColors.neutral.blueGrayLight.a75,
        },
        staticBlack: {
          default: globalColors.neutral.black[500],
          highlighted: globalColors.neutral.black[500],
          disabled: globalColors.neutral.black[200],
          faded: globalColors.neutral.black[50],
        },
        staticWhite: {
          default: globalColors.neutral.white[500],
          highlighted: globalColors.neutral.white[500],
          disabled: globalColors.neutral.white[300],
          faded: globalColors.neutral.white[50],
        },
      },
      border: {
        positive: {
          default: globalColors.chromatic.emerald[600],
          highlighted: globalColors.chromatic.emerald[700],
          disabled: globalColors.chromatic.emerald.a100,
          faded: globalColors.chromatic.emerald.a100,
        },
        negative: {
          default: globalColors.chromatic.crimson[600],
          highlighted: globalColors.chromatic.crimson[700],
          disabled: globalColors.chromatic.crimson.a100,
          faded: globalColors.chromatic.crimson.a100,
        },
        notice: {
          default: globalColors.chromatic.cider[600],
          highlighted: globalColors.chromatic.cider[700],
          disabled: globalColors.chromatic.cider.a100,
          faded: globalColors.chromatic.cider.a100,
        },
        information: {
          default: globalColors.chromatic.sapphire[600],
          highlighted: globalColors.chromatic.sapphire[700],
          disabled: globalColors.chromatic.sapphire.a100,
          faded: globalColors.chromatic.sapphire.a100,
        },
        neutral: {
          default: globalColors.neutral.blueGrayLight[400],
          highlighted: globalColors.neutral.blueGrayLight[400],
          disabled: globalColors.neutral.blueGrayLight[300],
          faded: globalColors.neutral.blueGrayLight.a100,
        },
        primary: {
          default: globalColors.chromatic.azure[500],
          highlighted: globalColors.chromatic.azure[500],
          disabled: globalColors.chromatic.azure.a200,
          faded: globalColors.chromatic.azure.a100,
        },
        staticWhite: {
          default: globalColors.neutral.white[500],
          highlighted: globalColors.neutral.white[500],
          disabled: globalColors.neutral.white[100],
          faded: globalColors.neutral.white[50],
        },
        staticBlack: {
          default: globalColors.neutral.black[500],
          highlighted: globalColors.neutral.black[500],
          disabled: globalColors.neutral.black[100],
          faded: globalColors.neutral.black[100],
        },
        gray: {
          default: globalColors.neutral.blueGrayLight[400],
          highlighted: globalColors.neutral.blueGrayLight[400],
          disabled: globalColors.neutral.blueGrayLight[200],
          faded: globalColors.neutral.blueGrayLight.a100,
        },
      },
      text: {
        positive: {
          normal: globalColors.chromatic.emerald[700],
          subtle: globalColors.chromatic.emerald[600],
          muted: globalColors.chromatic.emerald[400],
          disabled: globalColors.chromatic.emerald.a200,
        },
        negative: {
          normal: globalColors.chromatic.crimson[700],
          subtle: globalColors.chromatic.crimson[600],
          muted: globalColors.chromatic.crimson[400],
          disabled: globalColors.chromatic.crimson.a200,
        },
        notice: {
          normal: globalColors.chromatic.cider[700],
          subtle: globalColors.chromatic.cider[600],
          muted: globalColors.chromatic.cider[400],
          disabled: globalColors.chromatic.cider.a200,
        },
        information: {
          normal: globalColors.chromatic.sapphire[700],
          subtle: globalColors.chromatic.sapphire[600],
          muted: globalColors.chromatic.sapphire[400],
          disabled: globalColors.chromatic.sapphire.a200,
        },
        neutral: {
          normal: globalColors.neutral.blueGrayLight[1200],
          subtle: globalColors.neutral.blueGrayLight[900],
          muted: globalColors.neutral.blueGrayLight[600],
          disabled: globalColors.neutral.blueGrayLight.a200,
        },
        gray: {
          normal: globalColors.neutral.blueGrayLight[1200],
          subtle: globalColors.neutral.blueGrayLight[900],
          muted: globalColors.neutral.blueGrayLight[600],
          disabled: globalColors.neutral.blueGrayLight.a200,
        },
        primary: {
          normal: globalColors.chromatic.azure[700],
          subtle: globalColors.chromatic.azure[600],
          muted: globalColors.chromatic.azure[400],
          disabled: globalColors.chromatic.azure.a100,
        },
        staticWhite: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[300],
          disabled: globalColors.neutral.white[100],
        },
        staticBlack: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[400],
          muted: globalColors.neutral.black[300],
          disabled: globalColors.neutral.black[100],
        },
      },
    },
    surface: {
      background: {
        gray: {
          subtle: globalColors.neutral.blueGrayLight[100],
          moderate: globalColors.neutral.blueGrayLight[50],
          intense: globalColors.neutral.blueGrayLight[0],
        },
        primary: {
          subtle: globalColors.chromatic.azure.a100,
          intense: globalColors.chromatic.azure[500],
        },
        sea: { subtle: globalColors.chromatic.sea[50], intense: globalColors.chromatic.sea[700] },
        cloud: {
          subtle: globalColors.chromatic.cloud[50],
          intense: globalColors.chromatic.cloud[700],
        },
      },
      border: {
        gray: {
          normal: globalColors.neutral.blueGrayLight[500],
          subtle: globalColors.neutral.blueGrayLight[300],
          muted: globalColors.neutral.blueGrayLight.a100,
        },
        primary: {
          normal: globalColors.chromatic.azure[500],
          muted: globalColors.chromatic.azure.a200,
        },
      },
      text: {
        staticBlack: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[300],
          muted: globalColors.neutral.black[200],
          disabled: globalColors.neutral.black[100],
        },
        gray: {
          normal: globalColors.neutral.blueGrayLight[1200],
          subtle: globalColors.neutral.blueGrayLight[900],
          muted: globalColors.neutral.blueGrayLight[600],
          disabled: globalColors.neutral.blueGrayLight.a200,
        },
        staticWhite: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[200],
          disabled: globalColors.neutral.white[100],
        },
        onSea: {
          onSubtle: globalColors.chromatic.forest[800],
          onIntense: globalColors.chromatic.forest[200],
        },
        onCloud: {
          onSubtle: globalColors.chromatic.azure[600],
          onIntense: globalColors.chromatic.azure[200],
        },
        primary: { normal: globalColors.chromatic.azure[500] },
      },
      icon: {
        onSea: {
          onSubtle: globalColors.chromatic.forest[600],
          onIntense: globalColors.chromatic.forest[400],
        },
        onCloud: {
          onSubtle: globalColors.chromatic.azure[400],
          onIntense: globalColors.chromatic.azure[300],
        },
        staticBlack: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[300],
          muted: globalColors.neutral.black[200],
          disabled: globalColors.neutral.black[100],
        },
        gray: {
          normal: globalColors.neutral.blueGrayLight[1200],
          subtle: globalColors.neutral.blueGrayLight[900],
          muted: globalColors.neutral.blueGrayLight[600],
          disabled: globalColors.neutral.blueGrayLight.a200,
        },
        staticWhite: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[200],
          disabled: globalColors.neutral.white[100],
        },
        primary: { normal: globalColors.chromatic.azure[500] },
      },
    },
    overlay: {
      background: {
        moderate: globalColors.neutral.blueGrayLight.a200,
        subtle: globalColors.neutral.black[200],
      },
    },
    popup: {
      background: {
        subtle: globalColors.neutral.blueGrayLight[0],
        intense: globalColors.neutral.blueGrayLight[1000],
      },
      border: {
        subtle: globalColors.neutral.blueGrayLight.a100,
        Intense: globalColors.neutral.blueGrayLight[900],
      },
    },
    feedback: {
      background: {
        positive: {
          subtle: globalColors.chromatic.emerald.a50,
          intense: globalColors.chromatic.emerald[600],
        },
        negative: {
          subtle: globalColors.chromatic.crimson.a50,
          intense: globalColors.chromatic.crimson[600],
        },
        notice: {
          subtle: globalColors.chromatic.cider.a50,
          intense: globalColors.chromatic.cider[600],
        },
        information: {
          subtle: globalColors.chromatic.sapphire.a50,
          intense: globalColors.chromatic.sapphire[600],
        },
        neutral: {
          subtle: globalColors.neutral.blueGrayLight.a50,
          intense: globalColors.neutral.blueGrayLight[1000],
        },
      },
      border: {
        positive: {
          subtle: globalColors.chromatic.emerald.a100,
          intense: globalColors.chromatic.emerald[700],
        },
        negative: {
          subtle: globalColors.chromatic.crimson.a100,
          intense: globalColors.chromatic.crimson[700],
        },
        notice: {
          subtle: globalColors.chromatic.cider.a100,
          intense: globalColors.chromatic.cider[700],
        },
        Information: {
          subtle: globalColors.chromatic.sapphire.a100,
          intense: globalColors.chromatic.sapphire[700],
        },
        neutral: {
          subtle: globalColors.neutral.blueGrayLight.a100,
          intense: globalColors.neutral.blueGrayLight[1100],
        },
      },
      text: {
        positive: {
          subtle: globalColors.chromatic.emerald[100],
          intense: globalColors.chromatic.emerald[800],
        },
        negative: {
          subtle: globalColors.chromatic.crimson[100],
          intense: globalColors.chromatic.crimson[800],
        },
        notice: {
          subtle: globalColors.chromatic.cider[100],
          intense: globalColors.chromatic.cider[800],
        },
        information: {
          subtle: globalColors.chromatic.sapphire[100],
          intense: globalColors.chromatic.sapphire[800],
        },
        neutral: {
          subtle: globalColors.neutral.blueGrayLight[500],
          intense: globalColors.neutral.blueGrayLight[1100],
        },
      },
      icon: {
        positive: {
          subtle: globalColors.chromatic.emerald[100],
          intense: globalColors.chromatic.emerald[800],
        },
        negative: {
          subtle: globalColors.chromatic.crimson[100],
          intense: globalColors.chromatic.crimson[800],
        },
        notice: {
          subtle: globalColors.chromatic.cider[100],
          intense: globalColors.chromatic.cider[800],
        },
        information: {
          subtle: globalColors.chromatic.sapphire[100],
          intense: globalColors.chromatic.sapphire[800],
        },
        neutral: {
          subtle: globalColors.neutral.blueGrayLight[500],
          intense: globalColors.neutral.blueGrayLight[1100],
        },
      },
    },
  },
  onDark: {
    interactive: {
      icon: {
        gray: {
          normal: globalColors.neutral.blueGrayDark[50],
          subtle: globalColors.neutral.blueGrayDark[300],
          muted: globalColors.neutral.blueGrayDark[600],
          disabled: globalColors.neutral.blueGrayDark.a200,
        },
        staticWhite: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[300],
          disabled: globalColors.neutral.white[100],
        },
        positive: {
          normal: globalColors.chromatic.emerald[400],
          subtle: globalColors.chromatic.emerald[500],
          muted: globalColors.chromatic.emerald[700],
          disabled: globalColors.chromatic.emerald.a200,
        },
        negative: {
          normal: globalColors.chromatic.crimson[400],
          subtle: globalColors.chromatic.crimson[500],
          muted: globalColors.chromatic.crimson[700],
          disabled: globalColors.chromatic.crimson.a200,
        },
        notice: {
          normal: globalColors.chromatic.cider[400],
          subtle: globalColors.chromatic.cider[500],
          muted: globalColors.chromatic.cider[700],
          disabled: globalColors.chromatic.cider.a200,
        },
        information: {
          normal: globalColors.chromatic.sapphire[400],
          subtle: globalColors.chromatic.sapphire[500],
          muted: globalColors.chromatic.sapphire[700],
          disabled: globalColors.chromatic.sapphire.a200,
        },
        neutral: {
          normal: globalColors.neutral.blueGrayDark[50],
          subtle: globalColors.neutral.blueGrayDark[300],
          muted: globalColors.neutral.blueGrayDark[600],
          disabled: globalColors.neutral.blueGrayDark.a200,
        },
        primary: {
          normal: globalColors.chromatic.azure[400],
          subtle: globalColors.chromatic.azure[500],
          muted: globalColors.chromatic.azure[700],
          disabled: globalColors.chromatic.azure.a200,
        },
        staticBlack: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[400],
          muted: globalColors.neutral.black[300],
          disabled: globalColors.neutral.black[100],
        },
      },
      background: {
        positive: {
          default: globalColors.chromatic.emerald[700],
          highlighted: globalColors.chromatic.emerald[800],
          disabled: globalColors.chromatic.emerald.a100,
          faded: globalColors.chromatic.emerald.a200,
        },
        negative: {
          default: globalColors.chromatic.crimson[700],
          highlighted: globalColors.chromatic.crimson[800],
          disabled: globalColors.chromatic.crimson.a100,
          faded: globalColors.chromatic.crimson.a200,
        },
        notice: {
          default: globalColors.chromatic.cider[700],
          highlighted: globalColors.chromatic.cider[800],
          disabled: globalColors.chromatic.cider.a100,
          faded: globalColors.chromatic.cider.a200,
        },
        information: {
          default: globalColors.chromatic.sapphire[700],
          highlighted: globalColors.chromatic.sapphire[800],
          disabled: globalColors.chromatic.sapphire.a100,
          faded: globalColors.chromatic.sapphire.a200,
        },
        neutral: {
          default: globalColors.neutral.blueGrayDark[900],
          highlighted: globalColors.neutral.blueGrayDark[1000],
          disabled: globalColors.neutral.blueGrayDark.a100,
          faded: globalColors.neutral.blueGrayDark.a100,
        },
        primary: {
          default: globalColors.chromatic.azure[600],
          highlighted: globalColors.chromatic.azure[800],
          disabled: globalColors.chromatic.azure.a200,
          faded: globalColors.chromatic.azure.a200,
        },
        gray: {
          default: globalColors.neutral.blueGrayDark.a50,
          highlighted: globalColors.neutral.blueGrayDark.a100,
          disabled: globalColors.neutral.blueGrayDark.a50,
          faded: globalColors.neutral.blueGrayDark.a75,
        },
        staticBlack: {
          default: globalColors.neutral.black[500],
          highlighted: globalColors.neutral.black[500],
          disabled: globalColors.neutral.black[200],
          faded: globalColors.neutral.black[50],
        },
        staticWhite: {
          default: globalColors.neutral.white[500],
          highlighted: globalColors.neutral.white[500],
          disabled: globalColors.neutral.white[300],
          faded: globalColors.neutral.white[50],
        },
      },
      border: {
        positive: {
          default: globalColors.chromatic.emerald[700],
          highlighted: globalColors.chromatic.emerald[800],
          disabled: globalColors.chromatic.emerald.a100,
          faded: globalColors.chromatic.emerald.a100,
        },
        negative: {
          default: globalColors.chromatic.crimson[700],
          highlighted: globalColors.chromatic.crimson[800],
          disabled: globalColors.chromatic.crimson.a100,
          faded: globalColors.chromatic.crimson.a100,
        },
        notice: {
          default: globalColors.chromatic.cider[700],
          highlighted: globalColors.chromatic.cider[800],
          disabled: globalColors.chromatic.cider.a100,
          faded: globalColors.chromatic.cider.a100,
        },
        information: {
          default: globalColors.chromatic.sapphire[700],
          highlighted: globalColors.chromatic.sapphire[800],
          disabled: globalColors.chromatic.sapphire.a100,
          faded: globalColors.chromatic.sapphire.a100,
        },
        neutral: {
          default: globalColors.neutral.blueGrayDark[800],
          highlighted: globalColors.neutral.blueGrayDark[800],
          disabled: globalColors.neutral.blueGrayLight[900],
          faded: globalColors.neutral.blueGrayDark.a100,
        },
        primary: {
          default: globalColors.chromatic.azure[600],
          highlighted: globalColors.chromatic.azure[600],
          disabled: globalColors.chromatic.azure.a200,
          faded: globalColors.chromatic.azure.a100,
        },
        staticWhite: {
          default: globalColors.neutral.white[500],
          highlighted: globalColors.neutral.white[500],
          disabled: globalColors.neutral.white[100],
          faded: globalColors.neutral.white[50],
        },
        staticBlack: {
          default: globalColors.neutral.black[500],
          highlighted: globalColors.neutral.black[500],
          disabled: globalColors.neutral.black[100],
          faded: globalColors.neutral.black[100],
        },
        gray: {
          default: globalColors.neutral.blueGrayDark[800],
          highlighted: globalColors.neutral.blueGrayDark[800],
          disabled: globalColors.neutral.blueGrayDark[1000],
          faded: globalColors.neutral.blueGrayDark.a100,
        },
      },
      text: {
        positive: {
          normal: globalColors.chromatic.emerald[400],
          subtle: globalColors.chromatic.emerald[500],
          muted: globalColors.chromatic.emerald[700],
          disabled: globalColors.chromatic.emerald.a200,
        },
        negative: {
          normal: globalColors.chromatic.crimson[400],
          subtle: globalColors.chromatic.crimson[500],
          muted: globalColors.chromatic.crimson[700],
          disabled: globalColors.chromatic.crimson.a200,
        },
        notice: {
          normal: globalColors.chromatic.cider[400],
          subtle: globalColors.chromatic.cider[500],
          muted: globalColors.chromatic.cider[700],
          disabled: globalColors.chromatic.cider.a200,
        },
        information: {
          normal: globalColors.chromatic.sapphire[400],
          subtle: globalColors.chromatic.sapphire[500],
          muted: globalColors.chromatic.sapphire[700],
          disabled: globalColors.chromatic.sapphire.a200,
        },
        neutral: {
          normal: globalColors.neutral.blueGrayDark[50],
          subtle: globalColors.neutral.blueGrayDark[300],
          muted: globalColors.neutral.blueGrayDark[600],
          disabled: globalColors.neutral.blueGrayDark.a200,
        },
        gray: {
          normal: globalColors.neutral.blueGrayDark[50],
          subtle: globalColors.neutral.blueGrayDark[300],
          muted: globalColors.neutral.blueGrayDark[600],
          disabled: globalColors.neutral.blueGrayDark.a200,
        },
        primary: {
          normal: globalColors.chromatic.azure[400],
          subtle: globalColors.chromatic.azure[500],
          muted: globalColors.chromatic.azure[700],
          disabled: globalColors.chromatic.azure.a200,
        },
        staticWhite: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[300],
          disabled: globalColors.neutral.white[100],
        },
        staticBlack: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[400],
          muted: globalColors.neutral.black[300],
          disabled: globalColors.neutral.black[100],
        },
      },
    },
    surface: {
      background: {
        gray: {
          subtle: globalColors.neutral.blueGrayDark[1300],
          moderate: globalColors.neutral.blueGrayDark[1200],
          intense: globalColors.neutral.blueGrayDark[1100],
        },
        primary: {
          subtle: globalColors.chromatic.azure.a100,
          intense: globalColors.chromatic.azure[500],
        },
        sea: { subtle: globalColors.chromatic.sea[800], intense: globalColors.chromatic.sea[100] },
        cloud: {
          subtle: globalColors.chromatic.cloud[800],
          intense: globalColors.chromatic.cloud[100],
        },
      },
      border: {
        gray: {
          normal: globalColors.neutral.blueGrayDark[700],
          subtle: globalColors.neutral.blueGrayDark[900],
          muted: globalColors.neutral.blueGrayDark.a100,
        },
        primary: {
          normal: globalColors.chromatic.azure[500],
          muted: globalColors.chromatic.azure.a200,
        },
      },
      text: {
        staticBlack: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[300],
          muted: globalColors.neutral.black[200],
          disabled: globalColors.neutral.black[100],
        },
        gray: {
          normal: globalColors.neutral.blueGrayDark[50],
          subtle: globalColors.neutral.blueGrayDark[300],
          muted: globalColors.neutral.blueGrayDark[600],
          disabled: globalColors.neutral.blueGrayDark.a200,
        },
        staticWhite: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[200],
          disabled: globalColors.neutral.white[100],
        },
        onSea: {
          onSubtle: globalColors.chromatic.forest[200],
          onIntense: globalColors.chromatic.forest[800],
        },
        onCloud: {
          onSubtle: globalColors.chromatic.azure[200],
          onIntense: globalColors.chromatic.azure[600],
        },
        primary: { normal: globalColors.chromatic.azure[300] },
      },
      icon: {
        onSea: {
          onSubtle: globalColors.chromatic.forest[400],
          onIntense: globalColors.chromatic.forest[600],
        },
        onCloud: {
          onSubtle: globalColors.chromatic.azure[300],
          onIntense: globalColors.chromatic.azure[400],
        },
        staticBlack: {
          normal: globalColors.neutral.black[500],
          subtle: globalColors.neutral.black[300],
          muted: globalColors.neutral.black[200],
          disabled: globalColors.neutral.black[100],
        },
        gray: {
          normal: globalColors.neutral.blueGrayDark[50],
          subtle: globalColors.neutral.blueGrayDark[300],
          muted: globalColors.neutral.blueGrayDark[600],
          disabled: globalColors.neutral.blueGrayDark.a200,
        },
        staticWhite: {
          normal: globalColors.neutral.white[500],
          subtle: globalColors.neutral.white[400],
          muted: globalColors.neutral.white[200],
          disabled: globalColors.neutral.white[100],
        },
        primary: { normal: globalColors.chromatic.azure[300] },
      },
    },
    overlay: {
      background: {
        moderate: globalColors.neutral.blueGrayDark.a200,
        subtle: globalColors.neutral.black[400],
      },
    },
    popup: {
      background: {
        subtle: globalColors.neutral.blueGrayDark[1000],
        intense: globalColors.neutral.blueGrayDark[1000],
      },
      border: {
        subtle: globalColors.neutral.blueGrayDark.a100,
        Intense: globalColors.neutral.blueGrayDark.a100,
      },
    },
    feedback: {
      background: {
        positive: {
          subtle: globalColors.chromatic.emerald.a100,
          intense: globalColors.chromatic.emerald[700],
        },
        negative: {
          subtle: globalColors.chromatic.crimson.a100,
          intense: globalColors.chromatic.crimson[700],
        },
        notice: {
          subtle: globalColors.chromatic.cider.a100,
          intense: globalColors.chromatic.cider[700],
        },
        information: {
          subtle: globalColors.chromatic.sapphire.a100,
          intense: globalColors.chromatic.sapphire[700],
        },
        neutral: {
          subtle: globalColors.neutral.blueGrayDark.a50,
          intense: globalColors.neutral.blueGrayDark[200],
        },
      },
      border: {
        positive: {
          subtle: globalColors.chromatic.emerald.a200,
          intense: globalColors.chromatic.emerald[800],
        },
        negative: {
          subtle: globalColors.chromatic.crimson.a200,
          intense: globalColors.chromatic.crimson[800],
        },
        notice: {
          subtle: globalColors.chromatic.cider.a200,
          intense: globalColors.chromatic.cider[800],
        },
        Information: {
          subtle: globalColors.chromatic.sapphire.a200,
          intense: globalColors.chromatic.sapphire[800],
        },
        neutral: {
          subtle: globalColors.neutral.blueGrayLight.a100,
          intense: globalColors.neutral.blueGrayLight[100],
        },
      },
      text: {
        positive: {
          subtle: globalColors.chromatic.emerald[50],
          intense: globalColors.chromatic.emerald[500],
        },
        negative: {
          subtle: globalColors.chromatic.crimson[50],
          intense: globalColors.chromatic.crimson[500],
        },
        notice: {
          subtle: globalColors.chromatic.cider[50],
          intense: globalColors.chromatic.cider[500],
        },
        information: {
          subtle: globalColors.chromatic.sapphire[50],
          intense: globalColors.chromatic.sapphire[500],
        },
        neutral: {
          subtle: globalColors.neutral.blueGrayDark[700],
          intense: globalColors.neutral.blueGrayDark[100],
        },
      },
      icon: {
        positive: {
          subtle: globalColors.chromatic.emerald[50],
          intense: globalColors.chromatic.emerald[500],
        },
        negative: {
          subtle: globalColors.chromatic.crimson[50],
          intense: globalColors.chromatic.crimson[500],
        },
        notice: {
          subtle: globalColors.chromatic.cider[50],
          intense: globalColors.chromatic.cider[500],
        },
        information: {
          subtle: globalColors.chromatic.sapphire[50],
          intense: globalColors.chromatic.sapphire[500],
        },
        neutral: {
          subtle: globalColors.neutral.blueGrayDark[700],
          intense: globalColors.neutral.blueGrayDark[100],
        },
      },
    },
  },
};

const bladeTheme: ThemeTokens = {
  name: 'bladeTheme',
  border,
  breakpoints,
  colors,
  motion,
  spacing,
  elevation,
  typography,
};

export default bladeTheme;
