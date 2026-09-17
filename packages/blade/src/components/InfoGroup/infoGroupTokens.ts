import { size } from '~tokens/global';

// Gap between leading/trailing elements and content
const elementGap = {
  xsmall: 'spacing.1',
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
} as const;

// Size mapping for InfoItemKey
const titleTextSize = {
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

// Text sizes for help text (has different mapping)
const helpTextSize = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'xsmall',
  large: 'small',
} as const;

// Icon sizes for different InfoGroup sizes
const iconSize = {
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

const itemTitleHeight = {
  xsmall: size['14'],
  small: size['18'],
  medium: size['20'],
  large: size['24'],
};

/**
 * Fixed width of the key/label column for horizontal `itemOrientation`.
 *
 * On web the key column is `max-content` (content-sized) inside a CSS grid, which keeps every
 * value column aligned across rows. React Native has no CSS grid, so we give the key column a
 * definite width per size instead. This keeps the value columns deterministically aligned across
 * rows WITHOUT any `onLayout`/measurement → setState cycle (which oscillates on device).
 *
 * Each width is sized to hug the longest realistic label (a ~18-char title + a leading icon at
 * that size) so the single `spacing.6` column gap matches web's mobile gap as closely as possible
 * without the label wrapping. A wider value would push the value column too far right (the excess
 * gap the user reported); a narrower one would wrap long labels.
 */
const titleColumnWidth = {
  xsmall: size['120'],
  small: size['140'],
  medium: size['176'],
  large: size['200'],
} as const;

const avatarAdjustmentPaddingY = {
  xsmall: 'spacing.1',
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
} as const;

export {
  elementGap,
  titleTextSize,
  helpTextSize,
  iconSize,
  itemTitleHeight,
  titleColumnWidth,
  avatarAdjustmentPaddingY,
};
