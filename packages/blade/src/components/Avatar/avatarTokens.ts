import type { Theme } from '~components/BladeProvider';
import { size } from '~tokens/global';
import type { DotNotationToken } from '~utils/lodashButBetter/get';

const avatarSizeTokens = {
  xsmall: size[20],
  small: size[28],
  medium: size[36],
  large: size[48],
  xlarge: size[56],
};

const avatarIconSizeTokens = {
  xsmall: size[16],
  small: size[16],
  medium: size[20],
  large: size[24],
  xlarge: size[30],
};

const avatarTextSizeMapping = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'small',
  large: 'medium',
  xlarge: 'medium',
} as const;

type InteractiveTextColors<
  T extends 'positive' | 'negative' | 'primary' | 'notice' | 'information' | 'neutral'
> = `interactive.text.${T}.${DotNotationToken<Theme['colors']['interactive']['text'][T]>}`;

type InteractiveBackgroundColors<
  T extends 'positive' | 'negative' | 'primary' | 'notice' | 'information' | 'neutral'
> = `interactive.background.${T}.${DotNotationToken<
  Theme['colors']['interactive']['background'][T]
>}`;

type AvatarBackgroundColors =
  | InteractiveBackgroundColors<'positive'>
  | InteractiveBackgroundColors<'negative'>
  | InteractiveBackgroundColors<'primary'>
  | InteractiveBackgroundColors<'notice'>
  | InteractiveBackgroundColors<'neutral'>
  | InteractiveBackgroundColors<'information'>;

type AvatarTextColors =
  | InteractiveTextColors<'positive'>
  | InteractiveTextColors<'negative'>
  | InteractiveTextColors<'primary'>
  | InteractiveTextColors<'notice'>
  | InteractiveTextColors<'neutral'>
  | InteractiveTextColors<'information'>;

type AvatarColorTokensType = {
  text: Record<string, AvatarTextColors>;
  background: Record<string, AvatarBackgroundColors>;
};

const avatarColorTokens: AvatarColorTokensType = {
  text: {
    primary: 'interactive.text.primary.normal',
    positive: 'interactive.text.positive.normal',
    negative: 'interactive.text.negative.normal',
    notice: 'interactive.text.notice.normal',
    information: 'interactive.text.information.normal',
    neutral: 'interactive.text.neutral.normal',
  },
  background: {
    primary: 'interactive.background.primary.faded',
    positive: 'interactive.background.positive.faded',
    negative: 'interactive.background.negative.faded',
    notice: 'interactive.background.notice.faded',
    information: 'interactive.background.information.faded',
    neutral: 'interactive.background.neutral.faded',
  },
};

const avatarBorderRadiusTokens = {
  circle: 'max',
  square: 'medium',
} as const;

export {
  avatarSizeTokens,
  avatarIconSizeTokens,
  avatarTextSizeMapping,
  avatarColorTokens,
  avatarBorderRadiusTokens,
};
