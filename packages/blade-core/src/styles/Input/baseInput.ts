import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './baseInput.module.css';
import type {
  BaseInputSize,
  BaseInputValidationState,
  BaseInputValueComponentType,
} from './baseInputTokens';

export type BaseInputWrapperVariants = {
  size?: BaseInputSize;
  validationState?: BaseInputValidationState;
  borderRadius?: 'small' | 'medium';
};

export type BaseInputElementVariants = {
  size?: BaseInputSize;
  valueComponentType?: BaseInputValueComponentType;
  hasLeadingVisual?: boolean;
  hasTrailingVisual?: boolean;
  textAlign?: 'left' | 'center' | 'right';
};

/**
 * Classes for the input wrapper (`.input-wrapper`): drives border color/width
 * via validation state (interaction handled by CSS `:hover`/`:focus-within`)
 * and the wrapper radius (large size → medium radius, else small).
 */
export const baseInputWrapperCva = cva(styles['input-wrapper'], {
  variants: {
    validationState: {
      none: null,
      error: styles['validation-error'],
      // success keeps the default gray thin border (matches React — success only
      // changes the hint text + trailing success icon, not the wrapper border).
      success: null,
    },
    borderRadius: {
      small: null,
      medium: styles['radius-medium'],
    },
  },
  defaultVariants: {
    validationState: 'none',
    borderRadius: 'small',
  },
});

/**
 * Classes for the native input/textarea element: size (height + vertical
 * padding + font), heading vs text font, left/right padding (default per size,
 * collapsed when a leading/trailing visual is present), and text alignment.
 */
export const baseInputElementCva = cva(styles.input, {
  variants: {
    size: {
      xsmall: styles['size-xsmall'],
      small: styles['size-small'],
      medium: styles['size-medium'],
      large: styles['size-large'],
    },
    valueComponentType: {
      text: null,
      heading: styles['value-heading'],
    },
    textAlign: {
      left: styles['text-left'],
      center: styles['text-center'],
      right: styles['text-right'],
    },
  },
  defaultVariants: {
    size: 'medium',
    valueComponentType: 'text',
  },
});

const leftPadBySize: Record<BaseInputSize, string> = {
  xsmall: styles['pad-left-xsmall'],
  small: styles['pad-left-small'],
  medium: styles['pad-left-medium'],
  large: styles['pad-left-large'],
};

const rightPadBySize: Record<BaseInputSize, string> = {
  xsmall: styles['pad-right-xsmall'],
  small: styles['pad-right-small'],
  medium: styles['pad-right-medium'],
  large: styles['pad-right-large'],
};

/**
 * Combined class string for the input wrapper element.
 */
export function getBaseInputWrapperClasses(props: BaseInputWrapperVariants): string {
  return baseInputWrapperCva(props);
}

/**
 * Combined class string for the native input element. Left/right padding is
 * resolved here (rather than a CVA variant) because it depends on both `size`
 * and the presence of leading/trailing visuals.
 */
export function getBaseInputClasses(props: BaseInputElementVariants): string {
  const {
    size = 'medium',
    valueComponentType,
    hasLeadingVisual,
    hasTrailingVisual,
    textAlign,
  } = props;

  const leftPad = hasLeadingVisual ? styles['has-leading'] : leftPadBySize[size];
  const rightPad = hasTrailingVisual ? styles['has-trailing'] : rightPadBySize[size];

  return [baseInputElementCva({ size, valueComponentType, textAlign }), leftPad, rightPad]
    .filter(Boolean)
    .join(' ');
}

/**
 * Structural classes referenced only inside Svelte templates. Calling this from
 * the component prevents CSS-module tree-shaking from dropping them.
 */
export function getBaseInputTemplateClasses(): {
  outer: string;
  field: string;
  labelLeft: string;
  labelRow: string;
  focusRingWrapper: string;
  radiusMedium: string;
  visuals: string;
  visualsStretch: string;
  leadingIcon: string;
  prefix: string;
  prefixWithIcon: string;
  prefixNoIcon: string;
  leadingInteraction: string;
  leadingInteractionPad: string;
  trailingInteraction: string;
  trailingInteractionSolo: string;
  trailingInteractionCombo: string;
  suffix: string;
  suffixWithTrailing: string;
  suffixNoTrailing: string;
  trailingIcon: string;
  trailingIconWithButton: string;
  trailingIconNoButton: string;
  trailingButton: string;
  insideValidation: string;
  insideValidationSm: string;
  insideValidationLg: string;
  hintRow: string;
  hasHint: string;
  noHint: string;
} {
  return {
    outer: styles.outer,
    field: styles.field,
    labelLeft: styles['label-left'],
    labelRow: styles['label-row'],
    focusRingWrapper: styles['focus-ring-wrapper'],
    radiusMedium: styles['radius-medium'],
    visuals: styles.visuals,
    visualsStretch: styles['visuals-stretch'],
    leadingIcon: styles['leading-icon'],
    prefix: styles.prefix,
    prefixWithIcon: styles['prefix-with-icon'],
    prefixNoIcon: styles['prefix-no-icon'],
    leadingInteraction: styles['leading-interaction'],
    leadingInteractionPad: styles['leading-interaction-pad'],
    trailingInteraction: styles['trailing-interaction'],
    trailingInteractionSolo: styles['trailing-interaction-solo'],
    trailingInteractionCombo: styles['trailing-interaction-combo'],
    suffix: styles.suffix,
    suffixWithTrailing: styles['suffix-with-trailing'],
    suffixNoTrailing: styles['suffix-no-trailing'],
    trailingIcon: styles['trailing-icon'],
    trailingIconWithButton: styles['trailing-icon-with-button'],
    trailingIconNoButton: styles['trailing-icon-no-button'],
    trailingButton: styles['trailing-button'],
    insideValidation: styles['inside-validation'],
    insideValidationSm: styles['inside-validation-sm'],
    insideValidationLg: styles['inside-validation-lg'],
    hintRow: styles['hint-row'],
    hasHint: styles['has-hint'],
    noHint: styles['no-hint'],
  };
}
