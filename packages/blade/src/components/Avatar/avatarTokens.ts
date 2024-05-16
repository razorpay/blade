import { size } from '~tokens/global';

const avatarSizeTokens = {
  xsmall: size[20],
  small: size[28],
  medium: size[36],
  large: size[48],
  xlarge: size[56],
} as const;

const avatarIconSizeTokens = {
  xsmall: size[16],
  small: size[16],
  medium: size[20],
  large: size[24],
  xlarge: size[30],
} as const;

const avatarTextSizeMapping = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'small',
  large: 'medium',
  xlarge: 'medium',
} as const;

const avatarColorTokens = {
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
} as const;

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
