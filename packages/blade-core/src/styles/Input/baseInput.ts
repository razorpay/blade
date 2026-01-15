/**
 * BaseInput Class Generators
 * Functions to generate CSS classes for Input components
 */

// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './baseInput.module.css';
import type { BaseInputSize, BaseInputState } from './baseInputTokens';

export type InputWrapperOptions = {
  state: BaseInputState;
  size: BaseInputSize;
  isTextArea?: boolean;
  isDisabled?: boolean;
};

export type StyledInputOptions = {
  size: BaseInputSize;
  hasLeadingIcon?: boolean;
  hasPrefix?: boolean;
  hasTrailingIcon?: boolean;
  hasSuffix?: boolean;
  hasTrailingInteractionElement?: boolean;
  hasLeadingInteractionElement?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  isDisabled?: boolean;
};

export type InputVisualsOptions = {
  type: 'leading' | 'trailing';
  hasIcon?: boolean;
  hasText?: boolean;
  hasInteractionElement?: boolean;
  hasOtherTrailingElements?: boolean;
};

/**
 * Get CSS classes for the input wrapper
 */
export function getInputWrapperClasses(options: InputWrapperOptions): string {
  const { state, size, isTextArea } = options;

  const classes = [
    styles.inputWrapper,
    styles[`inputWrapper--${state}`],
    styles[`inputWrapper--${size}`],
  ];

  if (isTextArea) {
    classes.push(styles['inputWrapper--textarea']);
  }

  return classes.filter(Boolean).join(' ');
}

/**
 * Get CSS classes for the focus ring wrapper
 */
export function getFocusRingWrapperClasses(): string {
  return styles.focusRingWrapper;
}

/**
 * Get CSS classes for the styled input element
 */
export function getStyledInputClasses(options: StyledInputOptions): string {
  const {
    size,
    hasLeadingIcon,
    hasPrefix,
    hasTrailingIcon,
    hasSuffix,
    hasTrailingInteractionElement,
    hasLeadingInteractionElement,
    textAlign = 'left',
  } = options;

  const classes = [
    styles.styledInput,
    styles[`styledInput--${size}`],
    styles[`styledInput--textAlign-${textAlign}`],
  ];

  // Left padding logic
  if (hasLeadingIcon || hasPrefix || hasLeadingInteractionElement) {
    classes.push(styles['styledInput--paddingLeft-small']);
  } else {
    classes.push(styles['styledInput--paddingLeft-medium']);
  }

  // Right padding logic
  if (hasTrailingIcon || hasSuffix || hasTrailingInteractionElement) {
    classes.push(styles['styledInput--paddingRight-small']);
  } else {
    classes.push(styles['styledInput--paddingRight-medium']);
  }

  return classes.filter(Boolean).join(' ');
}

/**
 * Get CSS classes for input visuals container
 */
export function getInputVisualsClasses(options: InputVisualsOptions): string {
  const { type } = options;

  const classes = [
    styles.inputVisuals,
    styles[`inputVisuals--${type}`],
  ];

  return classes.filter(Boolean).join(' ');
}

/**
 * Get CSS classes for visual icon
 */
export function getVisualIconClasses(type: 'leading' | 'trailing'): string {
  return `${styles.visualIcon} ${styles[`visualIcon--${type}`]}`;
}

/**
 * Get CSS classes for visual text (prefix/suffix)
 */
export function getVisualTextClasses(
  type: 'prefix' | 'suffix',
  hasAdjacentIcon: boolean
): string {
  const classes = [styles.visualText];

  if (type === 'prefix') {
    classes.push(hasAdjacentIcon ? styles['visualText--prefixWithIcon'] : styles['visualText--prefix']);
  } else {
    classes.push(hasAdjacentIcon ? styles['visualText--suffixWithIcon'] : styles['visualText--suffix']);
  }

  return classes.filter(Boolean).join(' ');
}

/**
 * Get CSS classes for interaction element container
 */
export function getInteractionElementClasses(
  type: 'leading' | 'trailing',
  hasOtherTrailingElements?: boolean
): string {
  const classes = [styles.interactionElement];

  if (type === 'leading') {
    classes.push(styles['interactionElement--leading']);
  } else {
    classes.push(
      hasOtherTrailingElements
        ? styles['interactionElement--trailingWithOther']
        : styles['interactionElement--trailing']
    );
  }

  return classes.filter(Boolean).join(' ');
}

/**
 * Get CSS classes for input container
 */
export function getInputContainerClasses(isLabelLeft: boolean): string {
  const classes = [styles.inputContainer];

  if (isLabelLeft) {
    classes.push(styles['inputContainer--labelLeft']);
  }

  return classes.filter(Boolean).join(' ');
}

/**
 * Get CSS classes for label row
 */
export function getLabelRowClasses(isLabelLeft: boolean): string {
  const classes = [styles.labelRow];

  if (isLabelLeft) {
    classes.push(styles['labelRow--labelLeft']);
  }

  return classes.filter(Boolean).join(' ');
}

/**
 * Get CSS classes for hint row
 */
export function getHintRowClasses(): string {
  return styles.hintRow;
}

/**
 * Get CSS classes for trailing button
 */
export function getTrailingButtonClasses(): string {
  return styles.trailingButton;
}

/**
 * Get template classes for use in Svelte components
 * This prevents tree-shaking of CSS classes
 */
export function getBaseInputTemplateClasses() {
  return {
    inputWrapper: styles.inputWrapper,
    focusRingWrapper: styles.focusRingWrapper,
    styledInput: styles.styledInput,
    inputVisuals: styles.inputVisuals,
    inputContainer: styles.inputContainer,
    labelRow: styles.labelRow,
    hintRow: styles.hintRow,
    visualIcon: styles.visualIcon,
    visualText: styles.visualText,
    interactionElement: styles.interactionElement,
    trailingButton: styles.trailingButton,
  };
}

