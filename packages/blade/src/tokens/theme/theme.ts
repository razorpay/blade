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

export type FeedbackColors = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';

export type Emphasis = {
  subtle: string;
  moderate: string;
  intense: string;
  normal: string;
  muted: string;
  disabled: string;
};

type SubtleOrIntenseEmphasis = Pick<Emphasis, 'subtle' | 'intense'>;
// Exporting this for usage in other components
export type SubtleOrIntense = keyof SubtleOrIntenseEmphasis;
type InteractiveStates = {
  default: string;
  highlighted: string;
  disabled: string;
  faded: string;
};

type OnEmphasis = {
  onSubtle: string;
  onIntense: string;
};

type ColorCategories = {
  staticBlack: Pick<Emphasis, 'normal' | 'subtle' | 'muted' | 'disabled'>;
  staticWhite: Pick<Emphasis, 'normal' | 'subtle' | 'muted' | 'disabled'>;
  gray: Pick<Emphasis, 'normal' | 'subtle' | 'muted' | 'disabled'>;
  onSea: Pick<OnEmphasis, 'onSubtle' | 'onIntense'>;
  onCloud: Pick<OnEmphasis, 'onSubtle' | 'onIntense'>;
  primary: Pick<Emphasis, 'normal'>;
};

type InteractiveColorKeys = FeedbackColors | Exclude<keyof ColorCategories, 'onSea' | 'onCloud'>;

export type Colors = {
  interactive: {
    background: Record<InteractiveColorKeys, InteractiveStates & { fadedHighlighted: string }>;
    border: Record<InteractiveColorKeys, InteractiveStates>;
    text: Record<
      InteractiveColorKeys | 'onPrimary',
      Pick<Emphasis, 'normal' | 'subtle' | 'muted' | 'disabled'>
    >;
    icon: Record<
      InteractiveColorKeys | 'onPrimary',
      Pick<Emphasis, 'normal' | 'subtle' | 'muted' | 'disabled'>
    >;
  };
  feedback: {
    background: Record<FeedbackColors, SubtleOrIntenseEmphasis>;
    border: Record<FeedbackColors, SubtleOrIntenseEmphasis>;
    text: Record<FeedbackColors, SubtleOrIntenseEmphasis>;
    icon: Record<FeedbackColors, SubtleOrIntenseEmphasis>;
  };
  surface: {
    background: {
      gray: Pick<Emphasis, 'subtle' | 'moderate' | 'intense'>;
      primary: SubtleOrIntenseEmphasis;
      sea: SubtleOrIntenseEmphasis;
      cloud: SubtleOrIntenseEmphasis;
    };
    border: {
      gray: Pick<Emphasis, 'normal' | 'subtle' | 'muted'>;
      primary: Pick<Emphasis, 'normal' | 'muted'>;
    };
    text: ColorCategories;
    icon: ColorCategories;
  };
  overlay: {
    background: Pick<Emphasis, 'moderate' | 'subtle'>;
  };
  popup: {
    background: SubtleOrIntenseEmphasis;
    border: SubtleOrIntenseEmphasis;
  };
  transparent: string;
};

export type ColorsWithModes = Record<ColorSchemeModes, Colors>;

export type ThemeTokens = {
  name: 'bladeTheme' | StringWithAutocomplete; // Can be used to watch over state changes between theme without watching over entire theme object
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
