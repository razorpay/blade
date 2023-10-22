import type { TabsProps } from './types';
import type { DotNotationSpacingStringToken } from '~utils/types';

type Devices = 'desktop' | 'mobile';
type TabSizes = NonNullable<TabsProps['size']>;
type TabVariants = Exclude<NonNullable<TabsProps['variant']>, 'borderless'>;
type TabOrientation = 'horizontal' | 'vertical';

type TabItemPadding = Record<
  TabVariants,
  Record<TabOrientation, Record<Devices, Record<TabSizes, DotNotationSpacingStringToken>>>
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
    borderless: {
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
    borderless: {
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

export { backgroundColor, textColor, paddingY, paddingX };
