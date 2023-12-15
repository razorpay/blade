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

const textColor = {
  selected: {
    default: 'interactive.background.primary.default',
    hover: 'interactive.background.primary.highlighted',
    focus: 'interactive.background.primary.highlighted',
    active: 'interactive.background.primary.highlighted',
    disabled: 'surface.text.gray.disabled',
  },
  unselected: {
    default: 'surface.text.gray.muted',
    hover: 'surface.text.gray.muted',
    focus: 'surface.text.gray.muted',
    active: 'surface.text.gray.muted',
    disabled: 'surface.text.gray.disabled',
  },
} as const;

const backgroundColor = {
  unselected: {
    bordered: {
      default: 'transparent',
      hover: 'transparent',
      focus: 'transparent',
      active: 'transparent',
      disabled: 'transparent',
    },
    borderless: {
      default: 'transparent',
      hover: 'transparent',
      focus: 'transparent',
      active: 'transparent',
      disabled: 'transparent',
    },
    filled: {
      default: 'transparent',
      hover: 'colors.interactive.background.gray.default',
      focus: 'colors.interactive.background.gray.default',
      active: 'colors.interactive.background.gray.default',
      disabled: 'transparent',
    },
  },
  selected: {
    bordered: {
      default: 'transparent',
      hover: 'transparent',
      focus: 'transparent',
      active: 'transparent',
      disabled: 'transparent',
    },
    borderless: {
      default: 'transparent',
      hover: 'transparent',
      focus: 'transparent',
      active: 'transparent',
      disabled: 'transparent',
    },
    filled: {
      default: 'colors.interactive.background.primary.disabled',
      hover: 'colors.interactive.background.primary.faded',
      focus: 'colors.interactive.background.primary.faded',
      active: 'colors.interactive.background.primary.faded',
      disabled: 'transparent',
    },
  },
} as const;

export { backgroundColor, textColor, paddingY, paddingX };
