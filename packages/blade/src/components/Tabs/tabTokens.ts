import type { TabsProps } from './types';
import type { DotNotationSpacingStringToken } from '~utils/types';

type Devices = 'desktop' | 'mobile';
type TabSizes = NonNullable<TabsProps['size']>;
type TabVariants = NonNullable<TabsProps['variant']>;
type TabOrientation = NonNullable<TabsProps['orientation']>;

type TabItemPaddings = Record<
  TabVariants,
  Record<
    TabOrientation,
    Record<
      Devices,
      {
        top: Record<TabSizes, DotNotationSpacingStringToken>;
        bottom: Record<TabSizes, DotNotationSpacingStringToken>;
        left: Record<TabSizes, DotNotationSpacingStringToken>;
        right: Record<TabSizes, DotNotationSpacingStringToken>;
      }
    >
  >
>;

const paddings: TabItemPaddings = {
  bordered: {
    horizontal: {
      desktop: {
        top: {
          medium: 'spacing.2',
          large: 'spacing.2',
        },
        bottom: {
          medium: 'spacing.5',
          large: 'spacing.4',
        },
        left: {
          medium: 'spacing.6',
          large: 'spacing.6',
        },
        right: {
          medium: 'spacing.6',
          large: 'spacing.6',
        },
      },
      mobile: {
        top: {
          medium: 'spacing.2',
          large: 'spacing.2',
        },
        bottom: {
          medium: 'spacing.3',
          large: 'spacing.3',
        },
        left: {
          medium: 'spacing.5',
          large: 'spacing.5',
        },
        right: {
          medium: 'spacing.5',
          large: 'spacing.5',
        },
      },
    },
    vertical: {
      desktop: {
        top: {
          medium: 'spacing.2',
          large: 'spacing.2',
        },
        bottom: {
          medium: 'spacing.2',
          large: 'spacing.2',
        },
        left: {
          medium: 'spacing.4',
          large: 'spacing.4',
        },
        right: {
          // TODO: Check with RK once,
          // in design it's 0, but I'm deviating here because otherwise the text is too close to the edge of the tab
          // And it's better to be consistent with the padding all around the tab imo
          medium: 'spacing.4',
          large: 'spacing.4',
        },
      },
      mobile: {
        top: {
          medium: 'spacing.2',
          large: 'spacing.2',
        },
        bottom: {
          medium: 'spacing.2',
          large: 'spacing.2',
        },
        left: {
          medium: 'spacing.4',
          large: 'spacing.4',
        },
        right: {
          // TODO: Same here, Check with RK once,
          medium: 'spacing.4',
          large: 'spacing.4',
        },
      },
    },
  },
  filled: {
    horizontal: {
      desktop: {
        top: {
          medium: 'spacing.3',
          large: 'spacing.3',
        },
        bottom: {
          medium: 'spacing.3',
          large: 'spacing.3',
        },
        left: {
          medium: 'spacing.0',
          large: 'spacing.0',
        },
        right: {
          medium: 'spacing.0',
          large: 'spacing.0',
        },
      },
      mobile: {
        top: {
          medium: 'spacing.2',
          large: 'spacing.2',
        },
        bottom: {
          medium: 'spacing.2',
          large: 'spacing.2',
        },
        left: {
          medium: 'spacing.0',
          large: 'spacing.0',
        },
        right: {
          medium: 'spacing.0',
          large: 'spacing.0',
        },
      },
    },
    vertical: {
      desktop: {
        top: {
          medium: 'spacing.4',
          large: 'spacing.4',
        },
        bottom: {
          medium: 'spacing.4',
          large: 'spacing.4',
        },
        left: {
          medium: 'spacing.4',
          large: 'spacing.4',
        },
        right: {
          // TODO: Check with RK once,
          // on design SPEC it says it's 0, but when inspecting it shows spacing.4 which looks better
          medium: 'spacing.4',
          large: 'spacing.4',
        },
      },
      mobile: {
        top: {
          medium: 'spacing.3',
          large: 'spacing.3',
        },
        bottom: {
          medium: 'spacing.3',
          large: 'spacing.3',
        },
        left: {
          medium: 'spacing.3',
          large: 'spacing.3',
        },
        right: {
          medium: 'spacing.3',
          large: 'spacing.3',
        },
      },
    },
  },
};

const textColor = {
  selected: {
    default: 'brand.primary.500',
    hover: 'brand.primary.600',
    focus: 'brand.primary.600',
    active: 'brand.primary.600',
    disabled: 'surface.text.placeholder.lowContrast',
  },
  unselected: {
    default: 'surface.text.muted.lowContrast',
    hover: 'surface.text.subdued.lowContrast',
    focus: 'surface.text.subdued.lowContrast',
    active: 'surface.text.subdued.lowContrast',
    disabled: 'surface.text.placeholder.lowContrast',
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
    filled: {
      default: 'transparent',
      hover: 'colors.brand.gray.a50.lowContrast',
      focus: 'colors.brand.gray.a50.lowContrast',
      active: 'colors.brand.gray.a50.lowContrast',
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
    filled: {
      default: 'colors.brand.primary.300',
      hover: 'colors.brand.primary.400',
      focus: 'colors.brand.primary.400',
      active: 'colors.brand.primary.400',
      disabled: 'transparent',
    },
  },
} as const;

export { backgroundColor, textColor, paddings };
