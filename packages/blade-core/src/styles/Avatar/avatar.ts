import { cva, cx } from 'class-variance-authority';

// ===== Avatar outer wrapper CVA =====

export type AvatarWrapperVariants = {
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'circle' | 'square';
  isInteractive?: boolean;
};

/**
 * `--avatar-radius` is a CSS custom property set by the shape/size compounds and consumed (with a
 * `var(--border-radius-max)` fallback) by the wrapper, button, and its `img` — expressed via
 * Tailwind's arbitrary-property (`[--avatar-radius:...]`) and arbitrary-value (`rounded-[var(...)]`)
 * syntax, so no plugin class is needed. The outline shorthand (width+style+color together) is set
 * via a single arbitrary property to stay byte-faithful to the original declaration.
 */
export const avatarWrapperStyles = cva(
  'flex relative overflow-hidden bg-surface-background-gray-intense [outline:var(--border-width-thinner)_solid_var(--surface-border-gray-subtle)] rounded-[var(--avatar-radius,var(--border-radius-max))]',
  {
    variants: {
      size: {
        xsmall: 'w-[20px] h-[20px]',
        small: 'w-[28px] h-[28px]',
        medium: 'w-[36px] h-[36px]',
        large: 'w-[48px] h-[48px]',
        xlarge: 'w-[56px] h-[56px]',
      },
      variant: {
        circle: '[--avatar-radius:var(--border-radius-max)]',
        square: '',
      },
      isInteractive: {
        true:
          'hover:[outline:var(--border-width-thick)_solid_var(--surface-border-gray-muted)] hover:bg-surface-background-gray-moderate',
        false: '',
      },
    },
    compoundVariants: [
      { variant: 'square', size: 'xsmall', class: '[--avatar-radius:var(--border-radius-xsmall)]' },
      { variant: 'square', size: 'small', class: '[--avatar-radius:var(--border-radius-xsmall)]' },
      { variant: 'square', size: 'medium', class: '[--avatar-radius:var(--border-radius-small)]' },
      { variant: 'square', size: 'large', class: '[--avatar-radius:var(--border-radius-small)]' },
      { variant: 'square', size: 'xlarge', class: '[--avatar-radius:var(--border-radius-medium)]' },
    ],
    defaultVariants: {
      size: 'medium',
      variant: 'circle',
      isInteractive: false,
    },
  },
);

export function getAvatarWrapperClasses(props: AvatarWrapperVariants): string {
  return avatarWrapperStyles(props);
}

// ===== AvatarButton inner element CVA =====

export type AvatarButtonVariants = {
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'circle' | 'square';
  color?: 'primary' | 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
  isInteractive?: boolean;
  isSelected?: boolean;
};

const avatarButtonBase =
  'block text-center no-underline border-none outline-none p-spacing-0 bg-none cursor-default overflow-hidden rounded-[var(--avatar-radius,var(--border-radius-max))] [&_img]:block [&_img]:object-cover [&_img]:w-full [&_img]:h-full [&_img]:rounded-[var(--avatar-radius,var(--border-radius-max))]';

export const avatarButtonStyles = cva(avatarButtonBase, {
  variants: {
    size: {
      xsmall: 'min-h-[20px] h-[20px] w-[20px]',
      small: 'min-h-[28px] h-[28px] w-[28px]',
      medium: 'min-h-[36px] h-[36px] w-[36px]',
      large: 'min-h-[48px] h-[48px] w-[48px]',
      xlarge: 'min-h-[56px] h-[56px] w-[56px]',
    },
    // Radius is inherited from `--avatar-radius` (set on the wrapper) — the button carries no
    // shape-specific class of its own (matches the original, which had no `.btn-square-*` rules).
    variant: {
      circle: '',
      square: '',
    },
    color: {
      primary: 'bg-interactive-background-primary-faded',
      positive: 'bg-interactive-background-positive-faded',
      negative: 'bg-interactive-background-negative-faded',
      notice: 'bg-interactive-background-notice-faded',
      information: 'bg-interactive-background-information-faded',
      neutral: 'bg-interactive-background-neutral-faded',
    },
    isInteractive: {
      true:
        'cursor-pointer focus-visible:[outline:1px_solid_var(--surface-background-primary-subtle)] focus-visible:shadow-[0px_0px_0px_4px_var(--surface-border-primary-muted)]',
      false: '',
    },
    isSelected: {
      true: '[border:var(--border-width-thicker)_solid_var(--surface-border-primary-normal)]',
      false: '',
    },
  },
  defaultVariants: {
    size: 'medium',
    variant: 'circle',
    color: 'neutral',
    isInteractive: false,
    isSelected: false,
  },
});

export function getAvatarButtonClasses(props: AvatarButtonVariants): string {
  return avatarButtonStyles(props);
}

/** Text color token for AvatarGroup overflow (+N) counter */
export const avatarGroupOverflowTextColorToken = 'interactive.text.neutral.muted' as const;

/**
 * AvatarGroup overflow (+N) body text size mapping (avatar size → Text size).
 * All sizes use Body/Semibold; xlarge uses Heading/SmallSemibold separately.
 */
export const avatarGroupOverflowTextSizeMapping = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'small',
  large: 'medium',
} as const;

export type AvatarGroupOverflowBodyTextSize = typeof avatarGroupOverflowTextSizeMapping[keyof typeof avatarGroupOverflowTextSizeMapping];

export function getAvatarGroupOverflowBodyTextSize(
  size: Exclude<NonNullable<AvatarGroupVariants['size']>, 'xlarge'>,
): AvatarGroupOverflowBodyTextSize {
  return avatarGroupOverflowTextSizeMapping[size];
}

/**
 * Button classes for AvatarGroup overflow (+N) counter avatar.
 *
 * Builds on `color: 'neutral'` (kept inside the public color enum) and layers
 * a Svelte-only override on top to give the counter its distinct panel-style
 * background. The override is intentionally not exposed via
 * `AvatarButtonVariants['color']` so the public type stays aligned with
 * React's `AvatarProps['color']`.
 */
export function getAvatarGroupOverflowButtonClasses(
  props: Pick<AvatarButtonVariants, 'size' | 'variant'>,
): string {
  return cx(
    avatarButtonStyles({
      ...props,
      color: 'neutral',
      isInteractive: false,
      isSelected: false,
    }),
    'bg-surface-background-gray-subtle text-interactive-text-neutral-muted',
  );
}

// ===== AvatarGroup CVA =====

export type AvatarDensity = 'compact' | 'normal' | 'comfortable';

export type AvatarGroupVariants = {
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  density?: AvatarDensity;
};

/**
 * Overlap margin + stacking z-index live on `> :not(:first-child)` — expressed via Tailwind's
 * arbitrary child-combinator variant (`[&>*:not(:first-child)]:...`), no plugin needed.
 */
export const avatarGroupStyles = cva('inline-flex flex-row [&>*:not(:first-child)]:z-[2]', {
  variants: {
    // size variant carries no margin directly — all spacing is controlled by
    // density × size compound variants below, so that there is a single
    // authoritative source for every margin value regardless of density.
    size: {
      xsmall: '',
      small: '',
      medium: '',
      large: '',
      xlarge: '',
    },
    density: {
      normal: '',
      compact: '',
      comfortable: '',
    },
  },
  compoundVariants: [
    // normal density — same overlap as the original size-only classes
    { density: 'normal', size: 'xsmall', class: '[&>*:not(:first-child)]:ml-[-6px]' },
    { density: 'normal', size: 'small', class: '[&>*:not(:first-child)]:ml-[-10px]' },
    { density: 'normal', size: 'medium', class: '[&>*:not(:first-child)]:ml-[-14px]' },
    { density: 'normal', size: 'large', class: '[&>*:not(:first-child)]:ml-[-20px]' },
    { density: 'normal', size: 'xlarge', class: '[&>*:not(:first-child)]:ml-[-24px]' },
    // compact density — tighter overlap
    { density: 'compact', size: 'xsmall', class: '[&>*:not(:first-child)]:ml-[-10px]' },
    { density: 'compact', size: 'small', class: '[&>*:not(:first-child)]:ml-[-14px]' },
    { density: 'compact', size: 'medium', class: '[&>*:not(:first-child)]:ml-[-18px]' },
    { density: 'compact', size: 'large', class: '[&>*:not(:first-child)]:ml-[-24px]' },
    { density: 'compact', size: 'xlarge', class: '[&>*:not(:first-child)]:ml-[-30px]' },
    // comfortable density — looser overlap
    { density: 'comfortable', size: 'xsmall', class: '[&>*:not(:first-child)]:ml-[-2px]' },
    { density: 'comfortable', size: 'small', class: '[&>*:not(:first-child)]:ml-[-4px]' },
    { density: 'comfortable', size: 'medium', class: '[&>*:not(:first-child)]:ml-[-6px]' },
    { density: 'comfortable', size: 'large', class: '[&>*:not(:first-child)]:ml-[-10px]' },
    { density: 'comfortable', size: 'xlarge', class: '[&>*:not(:first-child)]:ml-[-14px]' },
  ],
  defaultVariants: {
    size: 'medium',
    density: 'normal',
  },
});

export function getAvatarGroupClasses(props: AvatarGroupVariants): string {
  return avatarGroupStyles(props);
}

// ===== Token maps =====

/**
 * Avatar icon size mapping (avatar size → icon size)
 */
export const avatarIconSizeTokens = {
  xsmall: 'small',
  small: 'medium',
  medium: 'medium',
  large: 'large',
  xlarge: 'xlarge',
} as const;

/**
 * Avatar text size mapping (avatar size → text size)
 */
export const avatarTextSizeMapping = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'small',
  large: 'medium',
  xlarge: 'medium',
} as const;

/**
 * Avatar bottom addon size mapping (avatar size → icon size)
 */
export const avatarToBottomAddonSize = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'small',
  large: 'medium',
  xlarge: 'large',
} as const;

/**
 * Avatar top addon (Indicator) size mapping
 */
export const avatarToIndicatorSize = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'medium',
  xlarge: 'large',
} as const;

// ===== Literal class lookup tables (top/bottom addon positioning) =====

const topAddonCircleBySize = {
  xsmall: 'right-[0px] top-[0px]',
  small: 'right-[1px] top-[1px]',
  medium: 'right-[1px] top-[2px]',
  large: 'right-[4px] top-[2px]',
  xlarge: 'right-[4px] top-[4px]',
} as const;

const topAddonSquareBySize = {
  xsmall: 'right-[-2px] top-[-2px]',
  small: 'right-[-2px] top-[-2px]',
  medium: 'right-[-2px] top-[-2px]',
  large: 'right-[-3px] top-[-3px]',
  xlarge: 'right-[-4px] top-[-4px]',
} as const;

const bottomAddonByVariant = {
  circle: 'bottom-[0%] right-[0%]',
  square: 'bottom-[-10%] right-[-10%]',
} as const;

// ===== Template classes (prevent Svelte tree-shaking) =====

/**
 * Get all Avatar component template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 */
export function getAvatarTemplateClasses(): Record<string, string> {
  return {
    // Root + body wrapper
    avatarRoot: 'inline-flex relative',
    avatarWrapper: avatarWrapperStyles({}),
    interactive:
      'hover:[outline:var(--border-width-thick)_solid_var(--surface-border-gray-muted)] hover:bg-surface-background-gray-moderate',
    // Button
    avatarBtn: avatarButtonBase,
    btnContent: 'flex flex-row items-center justify-center z-[1] h-full',
    btnInteractive:
      'cursor-pointer focus-visible:[outline:1px_solid_var(--surface-background-primary-subtle)] focus-visible:shadow-[0px_0px_0px_4px_var(--surface-border-primary-muted)]',
    btnSelected: '[border:var(--border-width-thicker)_solid_var(--surface-border-primary-normal)]',
    // Addon containers
    topAddon: 'absolute z-[2]',
    bottomAddon: 'absolute z-[2]',
    // Top addon offsets - circle
    topAddonCircleXsmall: topAddonCircleBySize.xsmall,
    topAddonCircleSmall: topAddonCircleBySize.small,
    topAddonCircleMedium: topAddonCircleBySize.medium,
    topAddonCircleLarge: topAddonCircleBySize.large,
    topAddonCircleXlarge: topAddonCircleBySize.xlarge,
    // Top addon offsets - square
    topAddonSquareXsmall: topAddonSquareBySize.xsmall,
    topAddonSquareSmall: topAddonSquareBySize.small,
    topAddonSquareMedium: topAddonSquareBySize.medium,
    topAddonSquareLarge: topAddonSquareBySize.large,
    topAddonSquareXlarge: topAddonSquareBySize.xlarge,
    // Bottom addon offsets
    bottomAddonCircle: bottomAddonByVariant.circle,
    bottomAddonSquare: bottomAddonByVariant.square,
    // Group
    avatarGroup: 'inline-flex flex-row [&>*:not(:first-child)]:z-[2]',
    // Group density compact
    groupDensityCompactXsmall: '[&>*:not(:first-child)]:ml-[-10px]',
    groupDensityCompactSmall: '[&>*:not(:first-child)]:ml-[-14px]',
    groupDensityCompactMedium: '[&>*:not(:first-child)]:ml-[-18px]',
    groupDensityCompactLarge: '[&>*:not(:first-child)]:ml-[-24px]',
    groupDensityCompactXlarge: '[&>*:not(:first-child)]:ml-[-30px]',
    // Group density comfortable
    groupDensityComfortableXsmall: '[&>*:not(:first-child)]:ml-[-2px]',
    groupDensityComfortableSmall: '[&>*:not(:first-child)]:ml-[-4px]',
    groupDensityComfortableMedium: '[&>*:not(:first-child)]:ml-[-6px]',
    groupDensityComfortableLarge: '[&>*:not(:first-child)]:ml-[-10px]',
    groupDensityComfortableXlarge: '[&>*:not(:first-child)]:ml-[-14px]',
  } as const;
}

/**
 * Get the top addon position class for a given variant and size.
 */
export function getTopAddonClass(
  variant: 'circle' | 'square',
  size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge',
): string {
  const table = variant === 'circle' ? topAddonCircleBySize : topAddonSquareBySize;
  return table[size] || '';
}

/**
 * Get the bottom addon position class for a given variant.
 */
export function getBottomAddonClass(variant: 'circle' | 'square'): string {
  return bottomAddonByVariant[variant] || '';
}
