import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './avatar.module.css';

// ===== Avatar outer wrapper CVA =====

export type AvatarWrapperVariants = {
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'circle' | 'square';
  isInteractive?: boolean;
};

export const avatarWrapperStyles = cva(styles['avatar-wrapper'], {
  variants: {
    size: {
      xsmall: styles['size-xsmall'],
      small: styles['size-small'],
      medium: styles['size-medium'],
      large: styles['size-large'],
      xlarge: styles['size-xlarge'],
    },
    variant: {
      circle: styles['variant-circle'],
      square: styles['variant-square'],
    },
    isInteractive: {
      true: styles.interactive,
      false: '',
    },
  },
  compoundVariants: [
    { variant: 'square', size: 'xsmall', class: styles['square-xsmall'] },
    { variant: 'square', size: 'small', class: styles['square-small'] },
    { variant: 'square', size: 'medium', class: styles['square-medium'] },
    { variant: 'square', size: 'large', class: styles['square-large'] },
    { variant: 'square', size: 'xlarge', class: styles['square-xlarge'] },
  ],
  defaultVariants: {
    size: 'medium',
    variant: 'circle',
    isInteractive: false,
  },
});

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

export const avatarButtonStyles = cva(styles['avatar-btn'], {
  variants: {
    size: {
      xsmall: styles['btn-size-xsmall'],
      small: styles['btn-size-small'],
      medium: styles['btn-size-medium'],
      large: styles['btn-size-large'],
      xlarge: styles['btn-size-xlarge'],
    },
    variant: {
      circle: styles['btn-variant-circle'],
      square: styles['btn-variant-square'],
    },
    color: {
      primary: styles['btn-color-primary'],
      positive: styles['btn-color-positive'],
      negative: styles['btn-color-negative'],
      notice: styles['btn-color-notice'],
      information: styles['btn-color-information'],
      neutral: styles['btn-color-neutral'],
    },
    isInteractive: {
      true: styles['btn-interactive'],
      false: '',
    },
    isSelected: {
      true: styles['btn-selected'],
      false: '',
    },
  },
  compoundVariants: [
    { variant: 'square', size: 'xsmall', class: styles['btn-square-xsmall'] },
    { variant: 'square', size: 'small', class: styles['btn-square-small'] },
    { variant: 'square', size: 'medium', class: styles['btn-square-medium'] },
    { variant: 'square', size: 'large', class: styles['btn-square-large'] },
    { variant: 'square', size: 'xlarge', class: styles['btn-square-xlarge'] },
  ],
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

// ===== AvatarGroup CVA =====

export type AvatarGroupVariants = {
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
};

export const avatarGroupStyles = cva(styles['avatar-group'], {
  variants: {
    size: {
      xsmall: styles['group-size-xsmall'],
      small: styles['group-size-small'],
      medium: styles['group-size-medium'],
      large: styles['group-size-large'],
      xlarge: styles['group-size-xlarge'],
    },
  },
  defaultVariants: {
    size: 'medium',
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

// ===== Template classes (prevent Svelte tree-shaking) =====

/**
 * Get all Avatar component template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 */
export function getAvatarTemplateClasses(): Record<string, string> {
  return {
    // Wrapper
    avatarWrapper: styles['avatar-wrapper'],
    interactive: styles.interactive,
    // Button
    avatarBtn: styles['avatar-btn'],
    btnContent: styles['btn-content'],
    btnInteractive: styles['btn-interactive'],
    btnSelected: styles['btn-selected'],
    // Addon containers
    addonWrapper: styles['addon-wrapper'],
    topAddon: styles['top-addon'],
    bottomAddon: styles['bottom-addon'],
    // Top addon offsets - circle
    topAddonCircleXsmall: styles['top-addon-circle-xsmall'],
    topAddonCircleSmall: styles['top-addon-circle-small'],
    topAddonCircleMedium: styles['top-addon-circle-medium'],
    topAddonCircleLarge: styles['top-addon-circle-large'],
    topAddonCircleXlarge: styles['top-addon-circle-xlarge'],
    // Top addon offsets - square
    topAddonSquareXsmall: styles['top-addon-square-xsmall'],
    topAddonSquareSmall: styles['top-addon-square-small'],
    topAddonSquareMedium: styles['top-addon-square-medium'],
    topAddonSquareLarge: styles['top-addon-square-large'],
    topAddonSquareXlarge: styles['top-addon-square-xlarge'],
    // Bottom addon offsets
    bottomAddonCircle: styles['bottom-addon-circle'],
    bottomAddonSquare: styles['bottom-addon-square'],
    // Group
    avatarGroup: styles['avatar-group'],
  } as const;
}

/**
 * Get the top addon position class for a given variant and size.
 */
export function getTopAddonClass(
  variant: 'circle' | 'square',
  size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge',
): string {
  const key = `top-addon-${variant}-${size}` as keyof typeof styles;
  return styles[key] || '';
}

/**
 * Get the bottom addon position class for a given variant.
 */
export function getBottomAddonClass(variant: 'circle' | 'square'): string {
  const key = `bottom-addon-${variant}` as keyof typeof styles;
  return styles[key] || '';
}
