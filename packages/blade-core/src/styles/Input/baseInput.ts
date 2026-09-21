import { cva } from 'class-variance-authority';
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
 * Classes for the input wrapper (`.blade-input-wrapper`): drives border color/width via validation
 * state (interaction handled by CSS `:hover`/`:focus-within` in the plugin) and the wrapper radius.
 * The stateful box-shadow border + `:focus-within` behavior lives in the `.blade-input-*` plugin
 * classes; here the CVA just selects which of those classes apply.
 */
export const baseInputWrapperCva = cva('blade-input-wrapper', {
  variants: {
    validationState: {
      none: null,
      error: 'blade-input-validation-error',
      // success keeps the default gray thin border (matches React).
      success: null,
    },
    borderRadius: {
      small: null,
      medium: 'blade-input-radius-medium',
    },
  },
  defaultVariants: {
    validationState: 'none',
    borderRadius: 'small',
  },
});

/**
 * Classes for the native input/textarea element: size (height + vertical padding + font + placeholder
 * font), heading vs text font, and text alignment. Placeholder + compound `value-heading.size-*`
 * rules live in the plugin's `.blade-input-*` classes.
 */
export const baseInputElementCva = cva('blade-input-el', {
  variants: {
    size: {
      xsmall: 'blade-input-size-xsmall',
      small: 'blade-input-size-small',
      medium: 'blade-input-size-medium',
      large: 'blade-input-size-large',
    },
    valueComponentType: {
      text: null,
      heading: 'blade-input-value-heading',
    },
    textAlign: {
      left: 'blade-input-text-left',
      center: 'blade-input-text-center',
      right: 'blade-input-text-right',
    },
  },
  defaultVariants: {
    size: 'medium',
    valueComponentType: 'text',
  },
});

// Left/right padding are plain atomic utilities (were `.pad-{left,right}-*` / `.has-{leading,trailing}`).
const leftPadBySize: Record<BaseInputSize, string> = {
  xsmall: 'pl-spacing-3',
  small: 'pl-spacing-3',
  medium: 'pl-spacing-4',
  large: 'pl-spacing-4',
};

const rightPadBySize: Record<BaseInputSize, string> = {
  xsmall: 'pr-spacing-3',
  small: 'pr-spacing-3',
  medium: 'pr-spacing-4',
  large: 'pr-spacing-4',
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

  const leftPad = hasLeadingVisual ? 'pl-spacing-3' : leftPadBySize[size];
  const rightPad = hasTrailingVisual ? 'pr-spacing-3' : rightPadBySize[size];

  return [baseInputElementCva({ size, valueComponentType, textAlign }), leftPad, rightPad]
    .filter(Boolean)
    .join(' ');
}

/**
 * Structural classes referenced only inside Svelte templates. Calling this from
 * the component prevents tree-shaking from dropping them. Structural/stateful classes are
 * `.blade-input-*` (plugin); layout/padding/text-align helpers are plain utilities.
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
    outer: 'blade-input-outer',
    field: 'blade-input-field',
    labelLeft: 'blade-input-label-left',
    labelRow: 'blade-input-label-row',
    focusRingWrapper: 'blade-input-focus-ring-wrapper',
    radiusMedium: 'blade-input-radius-medium',
    visuals: 'flex flex-row items-center self-center',
    visualsStretch: 'self-stretch',
    leadingIcon: 'pl-spacing-4 flex',
    prefix: 'flex items-center',
    prefixWithIcon: 'pl-spacing-3',
    prefixNoIcon: 'pl-spacing-4',
    leadingInteraction: 'flex items-stretch self-stretch',
    leadingInteractionPad: 'pl-spacing-2',
    trailingInteraction: 'flex items-stretch self-stretch',
    trailingInteractionSolo: 'pr-spacing-4',
    trailingInteractionCombo: 'pr-spacing-2',
    suffix: 'flex items-center',
    suffixWithTrailing: 'pr-spacing-3',
    suffixNoTrailing: 'pr-spacing-4',
    trailingIcon: 'flex justify-center items-center',
    trailingIconWithButton: 'pr-spacing-3',
    trailingIconNoButton: 'pr-spacing-4',
    trailingButton: 'pr-spacing-4 flex',
    insideValidation: 'flex items-center',
    insideValidationSm: 'pr-spacing-3',
    insideValidationLg: 'pr-spacing-4',
    hintRow: 'flex flex-row',
    hasHint: 'justify-between',
    noHint: 'justify-end',
  };
}
