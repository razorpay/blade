// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './radio.module.css';

export type RadioSize = 'small' | 'medium' | 'large';
export type RadioOrientation = 'vertical' | 'horizontal';
export type RadioLabelPosition = 'top' | 'left';

/**
 * Returns the CSS class for the radio icon wrapper based on size.
 */
export function getRadioIconSizeClass(size: RadioSize): string {
  return {
    small: styles.sizeSmall,
    medium: styles.sizeMedium,
    large: styles.sizeLarge,
  }[size];
}

/**
 * Returns the CSS classes for the radio icon wrapper based on state.
 */
export function getRadioIconWrapperClasses({
  size,
  isChecked,
  isNegative,
}: {
  size: RadioSize;
  isChecked: boolean;
  isDisabled?: boolean;
  isNegative?: boolean;
}): string {
  return [
    styles.iconWrapper,
    getRadioIconSizeClass(size),
    isChecked ? styles.checked : '',
    isNegative ? styles.negative : '',
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Returns the CSS classes for the dot (checked indicator).
 */
export function getRadioDotClasses(isChecked: boolean): string {
  return [styles.dot, isChecked ? styles.dotVisible : styles.dotHidden].filter(Boolean).join(' ');
}

/**
 * Returns classes for the radio title text.
 */
export function getRadioTitleClasses({
  size,
  isDisabled,
}: {
  size: RadioSize;
  isDisabled?: boolean;
}): string {
  const sizeClass = {
    small: styles.titleSmall,
    medium: styles.titleMedium,
    large: styles.titleLarge,
  }[size];
  return [styles.title, sizeClass, isDisabled ? styles.titleDisabled : '']
    .filter(Boolean)
    .join(' ');
}

/**
 * Returns classes for the RadioGroup field container based on labelPosition.
 */
export function getRadioGroupFieldClasses(labelPosition: RadioLabelPosition): string {
  return [
    styles.groupField,
    labelPosition === 'left' ? styles.groupFieldLeft : styles.groupFieldTop,
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Returns classes for the RadioGroup label based on size and position.
 */
export function getRadioGroupLabelClasses({
  size,
  labelPosition,
}: {
  size: RadioSize;
  labelPosition: RadioLabelPosition;
}): string {
  const sizeClass = {
    small: styles.groupLabelSmall,
    medium: styles.groupLabelMedium,
    large: styles.groupLabelLarge,
  }[size];
  return [styles.groupLabel, sizeClass, labelPosition === 'left' ? styles.groupLabelLeft : '']
    .filter(Boolean)
    .join(' ');
}

/**
 * Returns gap class for RadioGroup children based on size.
 */
export function getRadioGroupGapClass(size: RadioSize): string {
  return {
    small: styles.gapSmall,
    medium: styles.gapMedium,
    large: styles.gapLarge,
  }[size];
}

/**
 * Returns classes for the radios container based on orientation.
 */
export function getRadioGroupRadiosClasses(orientation: RadioOrientation): string {
  return [styles.radios, orientation === 'vertical' ? styles.vertical : styles.horizontal]
    .filter(Boolean)
    .join(' ');
}

/**
 * Returns classes for the help text, including the left margin offset matching the icon size.
 */
export function getRadioHelpTextClasses(size: RadioSize): string {
  const sizeClass = {
    small: styles.helpTextSmall,
    medium: styles.helpTextMedium,
    large: styles.helpTextLarge,
  }[size];
  return [styles.helpText, sizeClass].filter(Boolean).join(' ');
}

/**
 * Get all template classes as object — prevents tree-shaking from dropping
 * classes referenced only inside Svelte templates.
 */
export function getRadioTemplateClasses(): {
  radio: string;
  label: string;
  row: string;
  input: string;
  helpText: string;
  group: string;
  necessity: string;
  hintText: string;
  hintHelp: string;
  hintError: string;
  srOnly: string;
} {
  return {
    radio: styles.radio,
    label: styles.label,
    row: styles.row,
    input: styles.input,
    helpText: styles.helpText,
    group: styles.group,
    necessity: styles.necessity,
    hintText: styles.hintText,
    hintHelp: styles.hintHelp,
    hintError: styles.hintError,
    srOnly: styles.srOnly,
  };
}
