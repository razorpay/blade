import type { Theme } from '~components/BladeProvider';
import type { SelectorInputHoverTokens } from '~components/Form/Selector/types';
import type { DurationString, EasingString } from '~tokens/global/motion';
import { size } from '~tokens/global';
import type { DotNotationColorStringToken } from '~utils/types';

type ColorTokens = `colors.${DotNotationColorStringToken<Theme['colors']>}` | 'transparent';
type State = {
  checked: ColorTokens;
  unchecked: ColorTokens;
};
type SwitchColors = {
  track: Record<'default' | 'disabled', Record<string, State>>;
  thumb: Record<'default' | 'disabled', Record<string, ColorTokens>>;
  thumbIcon: Record<'default' | 'disabled', Record<string, ColorTokens>>;
};

const switchSizes = {
  track: {
    desktop: {
      small: {
        width: size[28],
        height: 'spacing.5',
      },
      medium: {
        width: size[36],
        height: 'spacing.6',
      },
    },
    mobile: {
      small: {
        width: size[36],
        height: 'spacing.6',
      },
      medium: {
        width: size[44],
        height: 'spacing.7',
      },
    },
  },
  thumb: {
    desktop: {
      small: {
        width: 'spacing.4',
        height: 'spacing.4',
      },
      medium: {
        width: 'spacing.5',
        height: 'spacing.5',
      },
    },
    mobile: {
      small: {
        width: 'spacing.5',
        height: 'spacing.5',
      },
      medium: {
        width: 'spacing.6',
        height: 'spacing.6',
      },
    },
  },
} as const;

const switchColors: SwitchColors = {
  track: {
    default: {
      background: {
        checked: 'colors.interactive.background.primary.default',
        unchecked: 'colors.interactive.border.gray.highlighted',
      },
    },
    disabled: {
      background: {
        checked: 'colors.interactive.background.primary.faded',
        unchecked: 'colors.interactive.background.gray.disabled',
      },
    },
  },
  thumb: {
    default: {
      background: 'colors."'UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN'"',
    },
    disabled: {
      background: 'colors.interactive.background.staticWhite.disabled',
    },
  },
  thumbIcon: {
    default: {
      fill: 'colors."'UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN'"',
    },
    disabled: {
      fill: 'colors.surface.text.gray.disabled',
    },
  },
};

const switchMotion: Record<string, Record<string, `motion.${EasingString | DurationString}`>> = {
  easing: {
    thumb: 'motion.easing.standard.effective',
    thumbIcon: 'motion.easing.standard.effective',
    track: 'motion.easing.standard.effective',
  },
  duration: {
    thumb: 'motion.duration.xquick',
    thumbIcon: 'motion.duration.xquick',
    track: 'motion.duration.xquick',
  },
};

const switchHoverTokens: SelectorInputHoverTokens = {
  default: {
    background: {
      checked: 'colors.interactive.background.primary.highlighted',
      unchecked: 'colors.interactive.background.gray.highlighted',
    },
  },
};

export { switchColors, switchSizes, switchHoverTokens, switchMotion };
