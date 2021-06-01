import type { Spacing } from '../global/spacing';
import type { Border } from '../global/border';
import type { Typography } from '../global/typography';

export type ColorSchemeNames = 'dark' | 'light';
export type ColorSchemeNamesInput = ColorSchemeNames | 'system';

export type ColorSchemeModes = {
  onLight: string;
  onDark: string;
};

export type ShadowLevels = 1 | 2 | 3 | 4 | 5;
export type Shadows = {
  offsetX: {
    level: Record<ShadowLevels, number>;
  };
  offsetY: {
    level: Record<ShadowLevels, number>;
  };
  blurRadius: {
    level: Record<ShadowLevels, number>;
  };
  color: {
    level: Record<ShadowLevels, ColorSchemeModes>;
  };
  androidElevation: {
    level: Record<ShadowLevels, number>;
  };
};

export type Feedback = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';

export type ColorContrast = {
  highContrast: ColorSchemeModes;
  lowContrast: ColorSchemeModes;
};

type ActionStates = {
  default: ColorContrast | ColorSchemeModes;
  hover: ColorContrast | ColorSchemeModes;
  focus: ColorContrast | ColorSchemeModes;
  active: ColorContrast | ColorSchemeModes;
  disabled: ColorContrast | ColorSchemeModes;
};

type ActionVariants = {
  primary: ActionStates;
  secondary: ActionStates;
  tertiary: ActionStates;
  link: ActionStates;
};

type ActionProperties = {
  background: ActionVariants;
  border: ActionVariants;
  text: ActionVariants;
  icon: ActionVariants;
};

export type Colors = {
  brand: {
    primary: Record<300 | 400 | 500 | 600 | 700, ColorSchemeModes>;
    secondary: Record<500, ColorSchemeModes>;
    gray: Record<300 | 400 | 500 | 600 | 700, ColorSchemeModes>;
  };
  feedback: {
    background: Record<Feedback, ColorContrast>;
    border: Record<Feedback, ColorContrast>;
    text: Record<Feedback, ColorContrast>;
    icon: Record<Feedback, ColorContrast>;
    positive: {
      action: {
        background: Pick<ActionVariants, 'primary'>;
        border: Pick<ActionVariants, 'primary'>;
        text: Pick<ActionVariants, 'primary', 'link'>;
        icon: Pick<ActionVariants, 'primary', 'link'>;
      };
    };
    negative: {
      action: {
        background: Pick<ActionVariants, 'primary'>;
        border: Pick<ActionVariants, 'primary'>;
        text: Pick<ActionVariants, 'primary', 'link'>;
        icon: Pick<ActionVariants, 'primary', 'link'>;
      };
    };
    information: {
      action: {
        background: Pick<ActionVariants, 'primary'>;
        border: Pick<ActionVariants, 'primary'>;
        text: Pick<ActionVariants, 'primary', 'link'>;
        icon: Pick<ActionVariants, 'primary', 'link'>;
      };
    };
    notice: {
      action: {
        background: Pick<ActionVariants, 'primary'>;
        border: Pick<ActionVariants, 'primary'>;
        text: Pick<ActionVariants, 'primary', 'link'>;
        icon: Pick<ActionVariants, 'primary', 'link'>;
      };
    };
    neutral: {
      action: {
        background: Pick<ActionVariants, 'primary'>;
        border: Pick<ActionVariants, 'primary'>;
        text: Pick<ActionVariants, 'primary', 'link'>;
        icon: Pick<ActionVariants, 'primary', 'link'>;
      };
    };
  };
  surface: {
    background: Record<'level1' | 'level2' | 'level3', ColorContrast>;
    border: Record<'normal' | 'subtle', ColorContrast>;
    text: Record<'muted' | 'normal' | 'placeholder' | 'subdued' | 'subtle', ColorContrast>;
    action: {
      icon: Pick<ActionVariants, 'link'>;
    };
  };
  action: {
    background: Omit<ActionVariants, 'link'>;
    border: Omit<ActionVariants, 'link'>;
    text: ActionVariants;
    icon: ActionVariants;
  };
};

export type Theme = {
  colors: Colors;
  border: Border;
  spacing: Spacing;
  shadows: Shadows;
  typography: Typography;
};
