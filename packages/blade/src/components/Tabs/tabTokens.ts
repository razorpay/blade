import type { TabsProps } from './types';
import type { DotNotationSpacingStringToken } from '~utils/types';
import type { DeviceType } from '~utils';

type TabSizes = NonNullable<TabsProps['size']>;
type TabVariants = Exclude<NonNullable<TabsProps['variant']>, 'borderless'>;
type TabOrientation = 'horizontal' | 'vertical';

type TabItemPadding = Record<
  TabVariants,
  Record<TabOrientation, Record<DeviceType, Record<TabSizes, DotNotationSpacingStringToken>>>
>;

const paddingY: TabItemPadding = {
  bordered: {
    horizontal: {
      desktop: {
        medium: 'spacing.5',
        large: 'spacing.4',
      },
      mobile: {
        medium: 'spacing.3',
        large: 'spacing.3',
      },
    },
    vertical: {
      desktop: {
        medium: 'spacing.2',
        large: 'spacing.2',
      },
      mobile: {
        medium: 'spacing.2',
        large: 'spacing.2',
      },
    },
  },
  filled: {
    horizontal: {
      desktop: {
        medium: 'spacing.3',
        large: 'spacing.3',
      },
      mobile: {
        medium: 'spacing.2',
        large: 'spacing.2',
      },
    },
    vertical: {
      desktop: {
        medium: 'spacing.4',
        large: 'spacing.4',
      },
      mobile: {
        medium: 'spacing.3',
        large: 'spacing.3',
      },
    },
  },
};

const paddingX: TabItemPadding = {
  bordered: {
    horizontal: {
      desktop: {
        medium: 'spacing.0',
        large: 'spacing.0',
      },
      mobile: {
        medium: 'spacing.0',
        large: 'spacing.0',
      },
    },
    vertical: {
      desktop: {
        medium: 'spacing.4',
        large: 'spacing.4',
      },
      mobile: {
        medium: 'spacing.4',
        large: 'spacing.4',
      },
    },
  },
  filled: {
    horizontal: {
      desktop: {
        medium: 'spacing.3',
        large: 'spacing.3',
      },
      mobile: {
        medium: 'spacing.2',
        large: 'spacing.2',
      },
    },
    vertical: {
      desktop: {
        medium: 'spacing.4',
        large: 'spacing.4',
      },
      mobile: {
        medium: 'spacing.3',
        large: 'spacing.3',
      },
    },
  },
};

const trackColor = 'surface.border.gray.muted';
const textColor = {
  selected: {
    default: 'interactive.text.primary.subtle',
    highlighted: 'interactive.text.primary.normal',
    disabled: 'interactive.text.primary.normal',
  },
  unselected: {
    default: 'interactive.text.gray.muted',
    highlighted: 'interactive.text.gray.subtle',
    disabled: 'interactive.text.gray.disabled',
  },
} as const;

const backgroundColor = {
  unselected: {
    bordered: {
      default: 'colors.transparent',
      highlighted: 'colors.transparent',
      disabled: 'colors.transparent',
    },
    borderless: {
      default: 'colors.transparent',
      highlighted: 'colors.transparent',
      disabled: 'colors.transparent',
    },
    filled: {
      default: 'colors.transparent',
      highlighted: 'colors.interactive.background.gray.default',
      disabled: 'colors.transparent',
    },
  },
  selected: {
    bordered: {
      default: 'colors.transparent',
      highlighted: 'colors.transparent',
      disabled: 'colors.transparent',
    },
    borderless: {
      default: 'colors.transparent',
      highlighted: 'colors.transparent',
      disabled: 'colors.transparent',
    },
    filled: {
      default: 'colors.interactive.background.primary.faded',
      highlighted: 'colors.interactive.background.primary.faded',
      disabled: 'colors.transparent',
    },
  },
} as const;

const iconColor = {
  unselected: {
    default: 'interactive.icon.gray.muted',
    highlighted: 'interactive.icon.gray.subtle',
    disabled: 'interactive.icon.gray.disabled',
  },
  selected: {
    default: 'interactive.icon.primary.subtle',
    highlighted: 'interactive.icon.primary.normal',
    disabled: 'interactive.icon.primary.disabled',
  },
} as const;

export { backgroundColor, textColor, iconColor, trackColor, paddingY, paddingX };
