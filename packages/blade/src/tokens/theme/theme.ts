import type { StringWithAutocomplete } from '~utils/types';
import type {
  Border,
  Breakpoints,
  Motion,
  Spacing,
  TypographyWithPlatforms,
  ElevationWithColorModes,
} from '~tokens/global';

export type ColorSchemeNames = 'dark' | 'light';
export type ColorSchemeNamesInput = ColorSchemeNames | 'system';

export type ColorSchemeModes = 'onDark' | 'onLight';

export type TextTypes = 'muted' | 'normal' | 'placeholder' | 'subdued' | 'subtle';

export type ColorContrastTypes = 'low' | 'high';

export type Feedback = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';

export type ColorContrast = {
  [K in ColorContrastTypes as `${Extract<K, string>}Contrast`]: string;
};

// @TODO: this shall rather be Surface = 'level1' | 'level2' | 'level3' to keep in sync with color tokens
export type SurfaceLevels = 1 | 2 | 3;

export type ActionStates = {
  default: string;
  hover: string;
  focus: string;
  active: string;
  disabled: string;
};

export type LinkActionStates = ActionStates & {
  visited: string;
};

export type ActionStatesWithContrast = {
  default: ColorContrast;
  hover: ColorContrast;
  focus: ColorContrast;
  active: ColorContrast;
  disabled: ColorContrast;
};

export type ActionStatesWithLowContrast = {
  default: Pick<ColorContrast, 'lowContrast'>;
  hover: Pick<ColorContrast, 'lowContrast'>;
  focus: Pick<ColorContrast, 'lowContrast'>;
  active: Pick<ColorContrast, 'lowContrast'>;
  disabled: Pick<ColorContrast, 'lowContrast'>;
};

export type LinkActionStatesWithContrast = ActionStatesWithContrast & {
  visited: ColorContrast;
};

export type ActionVariants = {
  primary: ActionStates;
  secondary: ActionStates;
  tertiary: ActionStates;
  link: LinkActionStates;
};

export type ActionVariantsWithContrast = {
  primary: ActionStatesWithContrast;
  secondary: ActionStatesWithContrast;
  tertiary: ActionStatesWithContrast;
  link: ActionStatesWithContrast;
};

export type SecondaryFeedbackActionStatesWithContrast = {
  secondary: {
    default: Pick<ColorContrast, 'lowContrast'>;
    hover: Pick<ColorContrast, 'lowContrast'>;
    focus: Pick<ColorContrast, 'lowContrast'>;
    active: Pick<ColorContrast, 'lowContrast'>;
    disabled: Pick<ColorContrast, 'lowContrast'>;
  };
};

// export type ActionProperties = {
//   background: ActionVariants;
//   border: ActionVariants;
//   text: ActionVariants;
//   icon: ActionVariants;
// };

export type FeedbackActions = {
  action: {
    background: {
      primary: ActionStatesWithContrast;
      secondary: ActionStatesWithLowContrast;
    };
    border: {
      primary: ActionStatesWithContrast;
      secondary: ActionStatesWithLowContrast;
    };
    text: {
      link: ActionStatesWithContrast;
      primary: ActionStatesWithContrast;
      secondary: ActionStatesWithLowContrast;
    };
    icon: {
      link: ActionStatesWithContrast;
      primary: ActionStatesWithContrast;
      secondary: ActionStatesWithLowContrast;
    };
  };
};

export type WhiteColors = {
  background: Pick<ActionVariants, 'primary' | 'secondary' | 'tertiary'>;
  border: Pick<ActionVariants, 'primary' | 'secondary' | 'tertiary'>;
  text: Pick<ActionVariants, 'link' | 'primary' | 'secondary' | 'tertiary'>;
  icon: Pick<ActionVariants, 'link' | 'primary' | 'secondary' | 'tertiary'>;
};

export type Colors = {
  brand: {
    primary: Record<300 | 400 | 500 | 600 | 700 | 800, string>;
    secondary: Record<500, string>;
    gray: Record<200 | 300 | 400 | 500 | 600 | 700 | 'a50' | 'a100', ColorContrast>;
  };
  feedback: {
    background: Record<Feedback, ColorContrast>;
    border: Record<Feedback, ColorContrast>;
    text: Record<Feedback, ColorContrast>;
    icon: Record<Feedback, ColorContrast>;
    positive: FeedbackActions;
    negative: FeedbackActions;
    information: FeedbackActions;
    notice: FeedbackActions;
    neutral: FeedbackActions;
  };
  surface: {
    background: Record<'level1' | 'level2' | 'level3', ColorContrast>;
    border: Record<'normal' | 'subtle', ColorContrast>;
    text: Record<TextTypes, ColorContrast>;
    action: {
      icon: ActionStatesWithContrast;
    };
    overlay: Record<'background', Record<400 | 800, string>>;
    popup: Record<'background', string>;
  };
  overlay: Record<'background', string>;
  action: {
    background: Omit<ActionVariants, 'link'>;
    border: Omit<ActionVariants, 'link'>;
    text: ActionVariants;
    icon: ActionVariants;
  };
  badge: {
    background: {
      blue: ColorContrast;
    };
    border: {
      blue: ColorContrast;
    };
    text: {
      blue: ColorContrast;
    };
    icon: {
      blue: ColorContrast;
    };
  };
  static: {
    white: string;
  };
  white: {
    action: WhiteColors;
  };
};

export type ColorsWithModes = Record<ColorSchemeModes, Colors>;

export type ThemeTokens = {
  name: 'paymentTheme' | 'bankingTheme' | StringWithAutocomplete; // Can be used to watch over state changes between theme without watching over entire theme object
  border: Border;
  breakpoints: Breakpoints;
  colors: ColorsWithModes;
  motion: Motion;
  elevation: ElevationWithColorModes;
  spacing: Spacing;
  typography: TypographyWithPlatforms;
};

export type SpacingValues = `${Spacing[keyof Spacing]}px`;
export type BorderWidthValues = `${Border['width'][keyof Border['width']]}px`;
export type BorderRadiusValues =
  | `${Border['radius'][Exclude<keyof Border['radius'], 'round'>]}px`
  | `${Border['radius'][Extract<keyof Border['radius'], 'round'>]}`;

export const colorSchemeNamesInput: ColorSchemeNamesInput[] = ['light', 'dark', 'system'];
