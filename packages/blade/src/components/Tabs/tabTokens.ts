import type { TabsProps } from './types';
import type { DotNotationSpacingStringToken } from '~utils/types';

type TabSizes = NonNullable<TabsProps['size']>;
type TabVariants = Exclude<NonNullable<TabsProps['variant']>, 'borderless'>;
type TabOrientation = 'horizontal' | 'vertical';

type TabItemPadding = Record<
  TabVariants,
  Record<TabOrientation, Record<TabSizes, DotNotationSpacingStringToken>>
>;

const paddingTop: TabItemPadding = {
  bordered: {
    horizontal: {
      small: 'spacing.0',
      medium: 'spacing.2',
      large: 'spacing.4',
    },
    vertical: {
      small: 'spacing.1',
      medium: 'spacing.2',
      large: 'spacing.3',
    },
  },
  filled: {
    horizontal: {
      small: 'spacing.1',
      medium: 'spacing.2',
      large: 'spacing.3',
    },
    vertical: {
      small: 'spacing.3',
      medium: 'spacing.4',
      large: 'spacing.4',
    },
  },
};

const paddingBottom: TabItemPadding = {
  bordered: {
    horizontal: {
      small: 'spacing.3',
      medium: 'spacing.4',
      large: 'spacing.4',
    },
    vertical: {
      small: 'spacing.1',
      medium: 'spacing.2',
      large: 'spacing.3',
    },
  },
  filled: {
    horizontal: {
      small: 'spacing.1',
      medium: 'spacing.2',
      large: 'spacing.3',
    },
    vertical: {
      small: 'spacing.3',
      medium: 'spacing.4',
      large: 'spacing.4',
    },
  },
};

const paddingX: TabItemPadding = {
  bordered: {
    horizontal: {
      small: 'spacing.0',
      medium: 'spacing.0',
      large: 'spacing.0',
    },
    vertical: {
      small: 'spacing.4',
      medium: 'spacing.4',
      large: 'spacing.4',
    },
  },
  filled: {
    horizontal: {
      small: 'spacing.3',
      medium: 'spacing.3',
      large: 'spacing.3',
    },
    vertical: {
      small: 'spacing.4',
      medium: 'spacing.4',
      large: 'spacing.4',
    },
  },
};

const trackColor = 'surface.border.gray.muted';
const textColor = {
  selected: {
    default: 'interactive.text.gray.normal',
    highlighted: 'interactive.text.gray.normal',
    disabled: 'interactive.text.gray.disabled',
  },
  unselected: {
    default: 'interactive.text.gray.muted',
    highlighted: 'interactive.text.gray.subtle',
    disabled: 'interactive.text.gray.disabled',
  },
} as const;

const backgroundColor = {
  selected: {
    bordered: {
      horizontal: {
        default: 'colors.transparent',
        highlighted: 'colors.transparent',
        disabled: 'colors.transparent',
      },
      vertical: {
        default: 'colors.transparent',
        highlighted: 'colors.transparent',
        disabled: 'colors.transparent',
      },
    },
    filled: {
      // Horizontal filled selected tabs use 'transparent' because
      // the TabIndicator (white pill) handles the selected background
      horizontal: {
        default: 'colors.transparent',
        highlighted: 'colors.transparent',
        disabled: 'colors.transparent',
      },
      vertical: {
        default: 'colors.surface.background.gray.intense',
        highlighted: 'colors.surface.background.gray.intense',
        disabled: 'colors.transparent',
      },
    },
  },
  unselected: {
    bordered: {
      horizontal: {
        default: 'colors.transparent',
        highlighted: 'colors.transparent',
        disabled: 'colors.transparent',
      },
      vertical: {
        default: 'colors.transparent',
        highlighted: 'colors.transparent',
        disabled: 'colors.transparent',
      },
    },
    filled: {
      horizontal: {
        default: 'colors.transparent',
        highlighted: 'colors.interactive.background.gray.default',
        disabled: 'colors.transparent',
      },
      vertical: {
        default: 'colors.transparent',
        highlighted: 'colors.interactive.background.gray.default',
        disabled: 'colors.transparent',
      },
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
    default: 'interactive.icon.gray.normal',
    highlighted: 'interactive.icon.gray.normal',
    disabled: 'interactive.icon.gray.disabled',
  },
} as const;

const textSizeMap = {
  small: 'medium',
  medium: 'medium',
  large: 'large',
} as const;

type BorderWidthValue = 'none' | 'thick' | 'thicker';

const borderWidth: Record<TabVariants, Record<TabOrientation, BorderWidthValue>> = {
  bordered: {
    horizontal: 'thicker',
    vertical: 'thick',
  },
  filled: {
    horizontal: 'none',
    vertical: 'none',
  },
};

type BorderRadiusToken = 'none' | 'small' | 'medium';

const borderRadius: Record<
  TabVariants,
  Record<TabOrientation, Record<TabSizes, BorderRadiusToken>>
> = {
  bordered: {
    horizontal: { small: 'none', medium: 'none', large: 'none' },
    vertical: { small: 'none', medium: 'none', large: 'none' },
  },
  filled: {
    horizontal: { small: 'medium', medium: 'small', large: 'small' },
    vertical: { small: 'small', medium: 'small', large: 'small' },
  },
};

const focusBorderRadius: Record<
  TabVariants,
  Record<TabOrientation, Record<TabSizes, Exclude<BorderRadiusToken, 'none'>>>
> = {
  bordered: {
    horizontal: { small: 'medium', medium: 'medium', large: 'medium' },
    vertical: { small: 'medium', medium: 'medium', large: 'medium' },
  },
  filled: {
    horizontal: { small: 'medium', medium: 'small', large: 'small' },
    vertical: { small: 'small', medium: 'small', large: 'small' },
  },
};

const borderColor = {
  selected: {
    bordered: {
      horizontal: {
        default: 'colors.transparent',
        highlighted: 'colors.transparent',
        disabled: 'colors.transparent',
      },
      vertical: {
        default: 'colors.transparent',
        highlighted: 'colors.transparent',
        disabled: 'colors.transparent',
      },
    },
    filled: {
      horizontal: {
        default: 'colors.transparent',
        highlighted: 'colors.transparent',
        disabled: 'colors.transparent',
      },
      vertical: {
        default: 'colors.transparent',
        highlighted: 'colors.transparent',
        disabled: 'colors.transparent',
      },
    },
  },
  unselected: {
    bordered: {
      horizontal: {
        default: 'colors.transparent',
        highlighted: 'colors.interactive.border.gray.highlighted',
        disabled: 'colors.transparent',
      },
      vertical: {
        default: 'colors.transparent',
        highlighted: 'colors.interactive.border.gray.highlighted',
        disabled: 'colors.transparent',
      },
    },
    filled: {
      horizontal: {
        default: 'colors.transparent',
        highlighted: 'colors.transparent',
        disabled: 'colors.transparent',
      },
      vertical: {
        default: 'colors.transparent',
        highlighted: 'colors.transparent',
        disabled: 'colors.transparent',
      },
    },
  },
} as const;

/**
 * In horizontal filled tabs, the TabIndicator (white pill) is rendered
 * as an absolutely positioned sibling element AFTER the tab items in the DOM.
 * The tab button needs `position: relative` + `zIndex: 1` so its content
 * renders above the indicator.
 */
const needsStackingContext: Record<TabVariants, Record<TabOrientation, boolean>> = {
  bordered: {
    horizontal: false,
    vertical: false,
  },
  filled: {
    horizontal: true,
    vertical: false,
  },
};

export {
  backgroundColor,
  textColor,
  iconColor,
  trackColor,
  paddingTop,
  paddingBottom,
  paddingX,
  textSizeMap,
  borderWidth,
  borderRadius,
  focusBorderRadius,
  borderColor,
  needsStackingContext,
};

export type { BorderRadiusToken, BorderWidthValue };
