// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './chip.module.css';

export type ChipColor = 'primary' | 'positive' | 'negative';
export type ChipSize = 'xsmall' | 'small' | 'medium' | 'large';

/* ======================================= */
/* Template classes (anti tree-shaking)    */
/* ======================================= */

/**
 * Call this function to prevent Svelte tree-shaking on CSS module imports.
 * Use the returned object to reference class names in templates.
 */
export function getChipTemplateClasses(): Record<string, string> {
  return {
    chipOuter: styles.chipOuter,
    chipLabel: styles.chipLabel,
    hiddenInput: styles.hiddenInput,
    chipAnimated: styles.chipAnimated,
    chipAnimatedPressed: styles.chipAnimatedPressed,
    chipWrapper: styles.chipWrapper,
    chipIconWrapper: styles.chipIconWrapper,
    chipText: styles.chipText,
    // Sizes
    xsmall: styles.xsmall,
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
    // Border width
    borderThinner: styles.borderThinner,
    borderThin: styles.borderThin,
    // Padding without icon
    'paddingWithoutIcon-xsmall': styles['paddingWithoutIcon-xsmall'],
    'paddingWithoutIcon-small': styles['paddingWithoutIcon-small'],
    'paddingWithoutIcon-medium': styles['paddingWithoutIcon-medium'],
    'paddingWithoutIcon-large': styles['paddingWithoutIcon-large'],
    // Padding with icon
    'paddingWithIcon-xsmall': styles['paddingWithIcon-xsmall'],
    'paddingWithIcon-small': styles['paddingWithIcon-small'],
    'paddingWithIcon-medium': styles['paddingWithIcon-medium'],
    'paddingWithIcon-large': styles['paddingWithIcon-large'],
    // Color states (chip wrapper)
    unchecked: styles.unchecked,
    uncheckedDisabled: styles.uncheckedDisabled,
    primary: styles.primary,
    primaryDisabled: styles.primaryDisabled,
    positive: styles.positive,
    positiveDisabled: styles.positiveDisabled,
    negative: styles.negative,
    negativeDisabled: styles.negativeDisabled,
    disabledWrapper: styles.disabledWrapper,
    // Animated border
    'animatedBorder-unchecked': styles['animatedBorder-unchecked'],
    'animatedBorder-uncheckedDisabled': styles['animatedBorder-uncheckedDisabled'],
    'animatedBorder-primary': styles['animatedBorder-primary'],
    'animatedBorder-primaryDisabled': styles['animatedBorder-primaryDisabled'],
    'animatedBorder-positive': styles['animatedBorder-positive'],
    'animatedBorder-positiveDisabled': styles['animatedBorder-positiveDisabled'],
    'animatedBorder-negative': styles['animatedBorder-negative'],
    'animatedBorder-negativeDisabled': styles['animatedBorder-negativeDisabled'],
    // Text colors
    textUnchecked: styles.textUnchecked,
    textDisabled: styles.textDisabled,
    textPrimary: styles.textPrimary,
    textPositive: styles.textPositive,
    textNegative: styles.textNegative,
    // Text sizes
    textSizeXsmall: styles.textSizeXsmall,
    textSizeSmall: styles.textSizeSmall,
    textSizeMedium: styles.textSizeMedium,
    textSizeLarge: styles.textSizeLarge,
    // ChipGroup
    chipGroupField: styles.chipGroupField,
    chipGroupFieldTop: styles.chipGroupFieldTop,
    chipGroupFieldLeft: styles.chipGroupFieldLeft,
    chipGroupLabel: styles.chipGroupLabel,
    chipGroupLabelLeft: styles.chipGroupLabelLeft,
    chipGroupLabelSmall: styles.chipGroupLabelSmall,
    chipGroupLabelMedium: styles.chipGroupLabelMedium,
    chipGroupLabelLarge: styles.chipGroupLabelLarge,
    necessityRequired: styles.necessityRequired,
    necessityOptional: styles.necessityOptional,
    chipGroupContainer: styles.chipGroupContainer,
    'chipGroupGap-xsmall': styles['chipGroupGap-xsmall'],
    'chipGroupGap-small': styles['chipGroupGap-small'],
    'chipGroupGap-medium': styles['chipGroupGap-medium'],
    'chipGroupGap-large': styles['chipGroupGap-large'],
    chipGroupHint: styles.chipGroupHint,
    chipGroupHintSmall: styles.chipGroupHintSmall,
    chipGroupHintMedium: styles.chipGroupHintMedium,
    chipGroupHintLarge: styles.chipGroupHintLarge,
    chipGroupHintHelp: styles.chipGroupHintHelp,
    chipGroupHintError: styles.chipGroupHintError,
    srOnly: styles.srOnly,
  } as const;
}

/* ======================================= */
/* Helper: get chip wrapper classes        */
/* ======================================= */

/**
 * Returns the CSS class string for a Chip's inner wrapper.
 */
export function getChipWrapperClasses({
  size,
  hasIcon,
  isChecked,
  isDisabled,
  chipColor,
}: {
  size: ChipSize;
  hasIcon: boolean;
  isChecked: boolean;
  isDisabled: boolean;
  chipColor: ChipColor;
}): string {
  const cls = getChipTemplateClasses();
  const classes: string[] = [cls.chipWrapper];

  // Size → height
  classes.push(cls[size] || '');

  // Padding
  const paddingKey = hasIcon
    ? `paddingWithIcon-${size}`
    : `paddingWithoutIcon-${size}`;
  classes.push(cls[paddingKey] || '');

  // Color / state
  if (isDisabled) {
    if (isChecked) {
      classes.push(cls[`${chipColor}Disabled`] || '');
    } else {
      classes.push(cls.uncheckedDisabled);
    }
    classes.push(cls.disabledWrapper);
  } else if (isChecked) {
    classes.push(cls[chipColor] || '');
  } else {
    classes.push(cls.unchecked);
  }

  return classes.filter(Boolean).join(' ');
}

/* ======================================= */
/* Helper: get animated wrapper classes    */
/* ======================================= */

/**
 * Returns the CSS class string for a Chip's animated outer wrapper.
 */
export function getChipAnimatedClasses({
  size,
  isPressed,
  isChecked,
  isDisabled,
  chipColor,
}: {
  size: ChipSize;
  isPressed: boolean;
  isChecked: boolean;
  isDisabled: boolean;
  chipColor: ChipColor;
}): string {
  const cls = getChipTemplateClasses();
  const classes: string[] = [cls.chipAnimated];

  // Border width: xsmall/small → thinner, medium/large → thin
  if (size === 'xsmall' || size === 'small') {
    classes.push(cls.borderThinner);
  } else {
    classes.push(cls.borderThin);
  }

  if (isPressed && !isDisabled) {
    classes.push(cls.chipAnimatedPressed);
  }

  // Animated border color
  const colorKey = isChecked ? chipColor : 'unchecked';
  const disabledSuffix = isDisabled ? 'Disabled' : '';
  classes.push(cls[`animatedBorder-${colorKey}${disabledSuffix}`] || '');

  return classes.filter(Boolean).join(' ');
}

/* ======================================= */
/* Helper: get text color class            */
/* ======================================= */

/**
 * Returns the CSS class for chip text color.
 */
export function getChipTextColorClass({
  isChecked,
  isDisabled,
  chipColor,
}: {
  isChecked: boolean;
  isDisabled: boolean;
  chipColor: ChipColor;
}): string {
  const cls = getChipTemplateClasses();
  if (isDisabled) return cls.textDisabled;
  if (isChecked) {
    const map: Record<ChipColor, string> = {
      primary: cls.textPrimary,
      positive: cls.textPositive,
      negative: cls.textNegative,
    };
    return map[chipColor] || cls.textUnchecked;
  }
  return cls.textUnchecked;
}

/* ======================================= */
/* Helper: get text size class             */
/* ======================================= */

/**
 * Returns the CSS class for chip text size based on ChipGroup size.
 */
export function getChipTextSizeClass(size: ChipSize): string {
  const cls = getChipTemplateClasses();
  const map: Record<ChipSize, string> = {
    xsmall: cls.textSizeXsmall,
    small: cls.textSizeSmall,
    medium: cls.textSizeMedium,
    large: cls.textSizeLarge,
  };
  return map[size] || cls.textSizeSmall;
}

/* ======================================= */
/* Helper: ChipGroup classes               */
/* ======================================= */

/**
 * Returns the CSS class string for ChipGroup field container.
 */
export function getChipGroupFieldClasses({
  labelPosition,
}: {
  labelPosition: 'top' | 'left';
}): string {
  const cls = getChipTemplateClasses();
  const classes: string[] = [cls.chipGroupField];
  if (labelPosition === 'left') {
    classes.push(cls.chipGroupFieldLeft);
  } else {
    classes.push(cls.chipGroupFieldTop);
  }
  return classes.filter(Boolean).join(' ');
}

/**
 * Returns the CSS class string for ChipGroup label.
 */
export function getChipGroupLabelClasses({
  size,
  labelPosition,
  necessityIndicator,
}: {
  size: ChipSize;
  labelPosition: 'top' | 'left';
  necessityIndicator: 'required' | 'optional' | 'none';
}): string {
  const cls = getChipTemplateClasses();
  const classes: string[] = [cls.chipGroupLabel];

  // Label size
  const sizeMap: Record<ChipSize, string> = {
    xsmall: cls.chipGroupLabelSmall,
    small: cls.chipGroupLabelMedium,
    medium: cls.chipGroupLabelLarge,
    large: cls.chipGroupLabelLarge,
  };
  classes.push(sizeMap[size] || cls.chipGroupLabelMedium);

  if (labelPosition === 'left') {
    classes.push(cls.chipGroupLabelLeft);
  }

  // Necessity indicator
  if (necessityIndicator === 'required') {
    classes.push(cls.necessityRequired);
  } else if (necessityIndicator === 'optional') {
    classes.push(cls.necessityOptional);
  }

  return classes.filter(Boolean).join(' ');
}

/**
 * Returns the CSS class string for ChipGroup chips container.
 */
export function getChipGroupContainerClasses({
  size,
}: {
  size: ChipSize;
}): string {
  const cls = getChipTemplateClasses();
  return [
    cls.chipGroupContainer,
    cls[`chipGroupGap-${size}`] || cls['chipGroupGap-small'],
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Returns the CSS class string for ChipGroup hint/error text.
 */
export function getChipGroupHintClasses({
  size,
  type,
}: {
  size: ChipSize;
  type: 'help' | 'error';
}): string {
  const cls = getChipTemplateClasses();
  const classes: string[] = [cls.chipGroupHint];

  // Size
  const sizeMap: Record<ChipSize, string> = {
    xsmall: cls.chipGroupHintSmall,
    small: cls.chipGroupHintSmall,
    medium: cls.chipGroupHintMedium,
    large: cls.chipGroupHintLarge,
  };
  classes.push(sizeMap[size] || cls.chipGroupHintSmall);

  // Type
  if (type === 'error') {
    classes.push(cls.chipGroupHintError);
  } else {
    classes.push(cls.chipGroupHintHelp);
  }

  return classes.filter(Boolean).join(' ');
}

/* ======================================= */
/* Icon size map                           */
/* ======================================= */

export const chipIconSizes: Record<ChipSize, 'small' | 'medium' | 'large'> = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'large',
};
