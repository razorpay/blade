import { size } from '~tokens/global';

const avatarSizeTokens = {
  xsmall: size[20],
  small: size[28],
  medium: size[36],
  large: size[48],
  xlarge: size[56],
} as const;

const avatarIconSizeTokens = {
  xsmall: 'small',
  small: 'medium',
  medium: 'medium',
  large: 'large',
  xlarge: 'xlarge',
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

const avatarToBottomAddonSize = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'small',
  large: 'medium',
  xlarge: 'large',
} as const;

const avatarToIndicatorSize = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'medium',
  xlarge: 'large',
} as const;

const avatarTopAddonOffsets = {
  circle: {
    xsmall: {
      right: '0px',
      top: '0px',
    },
    small: {
      right: '1px',
      top: '1px',
    },
    medium: {
      right: '1px',
      top: '2px',
    },
    large: {
      right: '4px',
      top: '2px',
    },
    xlarge: {
      right: '4px',
      top: '2px',
    },
  },
  square: {
    xsmall: {
      right: '-2px',
      top: '-2px',
    },
    small: {
      right: '-2px',
      top: '-2px',
    },
    medium: {
      right: '-2px',
      top: '-2px',
    },
    large: {
      right: '-3px',
      top: '-3px',
    },
    xlarge: {
      right: '-4px',
      top: '-4px',
    },
  },
} as const;

export {
  avatarSizeTokens,
  avatarIconSizeTokens,
  avatarTextSizeMapping,
  avatarColorTokens,
  avatarBorderRadiusTokens,
  avatarToBottomAddonSize,
  avatarToIndicatorSize,
  avatarTopAddonOffsets,
};
