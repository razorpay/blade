/**
 * Form Class Generators
 * Functions to generate CSS classes for Form components
 */

// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './form.module.css';
import type { FormSize, LabelPosition, NecessityIndicator } from './formTokens';

export type FormLabelOptions = {
  position: LabelPosition;
  size: FormSize;
  necessityIndicator?: NecessityIndicator;
};

export type FormHintOptions = {
  size: FormSize;
};

/**
 * Get CSS classes for form label
 */
export function getFormLabelClasses(options: FormLabelOptions): string {
  const { position, size } = options;

  const classes = [styles.formLabel, styles[`formLabel--${position}`]];

  if (position === 'left') {
    classes.push(styles[`formLabel--leftWidth-${size}`]);
    classes.push(styles[`formLabel--leftMargin-${size}`]);
  } else {
    classes.push(styles[`formLabel--topMargin-${size}`]);
  }

  return classes.filter(Boolean).join(' ');
}

/**
 * Get CSS classes for label text container
 */
export function getLabelTextContainerClasses(necessityIndicator: NecessityIndicator): string {
  const classes = [styles.labelTextContainer];

  if (necessityIndicator === 'optional') {
    classes.push(styles['labelTextContainer--optional']);
  } else if (necessityIndicator === 'required') {
    classes.push(styles['labelTextContainer--required']);
  }

  return classes.filter(Boolean).join(' ');
}

/**
 * Get CSS classes for the label content wrapper that holds the text row and
 * optional trailing slot. Switches axis based on label position.
 */
export function getLabelContentClasses(isLabelLeft: boolean): string {
  const classes = [styles.labelContent];
  classes.push(isLabelLeft ? styles['labelContent--left'] : styles['labelContent--top']);
  return classes.filter(Boolean).join(' ');
}

/**
 * Get CSS classes for the inner row that holds the label text container
 * and an optional label suffix.
 */
export function getLabelTextRowClasses(): string {
  return styles.labelTextRow;
}

/**
 * CSS class to visually hide content while keeping it accessible to
 * screen readers.
 */
export const visuallyHiddenClass: string = styles.visuallyHidden;

/**
 * Get CSS classes for label suffix
 */
export function getLabelSuffixClasses(): string {
  return styles.labelSuffix;
}

/**
 * Get CSS classes for label trailing
 */
export function getLabelTrailingClasses(isLabelLeft: boolean): string {
  const classes = [styles.labelTrailing];

  if (isLabelLeft) {
    classes.push(styles['labelTrailing--left']);
  }

  return classes.filter(Boolean).join(' ');
}

/**
 * Get CSS classes for form hint
 */
export function getFormHintClasses(options: FormHintOptions): string {
  const { size } = options;

  return `${styles.formHint} ${styles[`formHint--marginTop-${size}`]}`;
}

/**
 * Get CSS classes for hint icon
 */
export function getHintIconClasses(): string {
  return styles.hintIcon;
}

/**
 * Get CSS classes for character counter
 */
export function getCharacterCounterClasses(size: FormSize, hasMarginRight?: boolean): string {
  const classes = [styles.characterCounter, styles[`characterCounter--marginTop-${size}`]];

  if (hasMarginRight) {
    classes.push(styles['characterCounter--marginRight']);
  }

  return classes.filter(Boolean).join(' ');
}

/**
 * Get template classes for use in Svelte components
 */
export function getFormTemplateClasses(): Record<string, string> {
  return {
    formLabel: styles.formLabel,
    labelTextContainer: styles.labelTextContainer,
    labelSuffix: styles.labelSuffix,
    labelTrailing: styles.labelTrailing,
    formHint: styles.formHint,
    hintIcon: styles.hintIcon,
    characterCounter: styles.characterCounter,
  };
}
