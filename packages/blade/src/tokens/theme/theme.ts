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

type ColorSchemeModes = 'onDark' | 'onLight';

type Feedback = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';

type Emphasis = {
  subtle: string;
  moderate: string;
  intense: string;
  normal: string;
  muted: string;
  disabled: string;
};

type SubtleOrIntense = Pick<Emphasis, 'subtle' | 'intense'>;
type InteractiveStates = {
  default: string;
  highlighted: string;
  disabled: string;
  faded: string;
};

type InteractionKeys = Feedback | Exclude<keyof ColorFamilyType, 'onSea' | 'onCloud'>;

type OnEmphasis = {
  onSubtle: string;
  onIntense: string;
};

type ColorFamilyType = {
  staticBlack: Pick<Emphasis, 'normal' | 'subtle' | 'muted' | 'disabled'>;
  staticWhite: Pick<Emphasis, 'normal' | 'subtle' | 'muted' | 'disabled'>;
  gray: Pick<Emphasis, 'normal' | 'subtle' | 'muted' | 'disabled'>;
  onSea: Pick<OnEmphasis, 'onSubtle' | 'onIntense'>;
  onCloud: Pick<OnEmphasis, 'onSubtle' | 'onIntense'>;
  primary: Pick<Emphasis, 'normal'>;
};

export type Colors = {
  interactive: {
    background: Record<InteractionKeys, InteractiveStates>;
    border: Record<InteractionKeys, InteractiveStates>;
    text: Record<InteractionKeys, Pick<Emphasis, 'normal' | 'subtle' | 'muted' | 'disabled'>>;
    icon: Record<InteractionKeys, Pick<Emphasis, 'normal' | 'subtle' | 'muted' | 'disabled'>>;
  };
  feedback: {
    background: Record<Feedback, SubtleOrIntense>;
    border: Record<Feedback, SubtleOrIntense>;
    text: Record<Feedback, SubtleOrIntense>;
    icon: Record<Feedback, SubtleOrIntense>;
  };
  surface: {
    background: {
      gray: Pick<Emphasis, 'subtle' | 'moderate' | 'intense'>;
      primary: SubtleOrIntense;
      sea: SubtleOrIntense;
      cloud: SubtleOrIntense;
    };
    border: {
      gray: Pick<Emphasis, 'normal' | 'subtle' | 'muted'>;
      primary: Pick<Emphasis, 'normal' | 'muted'>;
    };
    text: ColorFamilyType;
    icon: ColorFamilyType;
  };
  overlay: {
    background: Pick<Emphasis, 'moderate' | 'subtle'>;
  };
  popup: {
    background: SubtleOrIntense;
    border: SubtleOrIntense;
  };
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
