import { cva } from 'class-variance-authority';
import type { BaseInputSize } from './baseInputTokens';

export type FormSize = BaseInputSize;
export type FormLabelPosition = 'top' | 'left';
export type FormHintType = 'help' | 'error' | 'success';

/* ── Token maps (ported from React formTokens.ts). Consumed by the Svelte
 *    FormLabel/FormHint to drive the migrated `Text` component. ── */

export const labelTextSize = {
  top: { xsmall: 'small', small: 'small', medium: 'small', large: 'medium' },
  left: { xsmall: 'small', small: 'small', medium: 'medium', large: 'large' },
} as const;

export const labelOptionalIndicatorTextSize: Record<FormSize, 'small' | 'medium'> = {
  xsmall: 'small',
  small: 'small',
  medium: 'small',
  large: 'medium',
};

export const labelTextColor: Record<FormSize, string> = {
  xsmall: 'surface.text.gray.muted',
  small: 'surface.text.gray.muted',
  medium: 'surface.text.gray.subtle',
  large: 'surface.text.gray.subtle',
};

export const hintTextSize: Record<FormSize, 'small' | 'medium'> = {
  xsmall: 'small',
  small: 'small',
  medium: 'small',
  large: 'medium',
};

export const hintIconSize: Record<FormSize, 'small' | 'medium'> = {
  xsmall: 'small',
  small: 'small',
  medium: 'small',
  large: 'medium',
};

export const hintTextColor: Record<FormHintType, string> = {
  help: 'surface.text.gray.muted',
  error: 'feedback.text.negative.intense',
  success: 'feedback.text.positive.intense',
};

/* ── Label CVA ── */

export const formLabelCva = cva('blade-form-label', {
  variants: {
    position: {
      top: null,
      left: 'blade-form-label-left',
    },
    size: {
      xsmall: 'blade-form-size-xsmall',
      small: 'blade-form-size-small',
      medium: 'blade-form-size-medium',
      large: 'blade-form-size-large',
    },
  },
  defaultVariants: {
    position: 'top',
    size: 'medium',
  },
});

export function getFormLabelClasses(props: {
  position?: FormLabelPosition;
  size?: FormSize;
}): string {
  return formLabelCva(props);
}

export const formLabelInnerCva = cva('blade-form-label-inner', {
  variants: {
    position: {
      top: null,
      left: 'blade-form-label-left',
    },
    size: {
      xsmall: 'blade-form-size-xsmall',
      small: 'blade-form-size-small',
      medium: 'blade-form-size-medium',
      large: 'blade-form-size-large',
    },
  },
  defaultVariants: {
    position: 'top',
    size: 'medium',
  },
});

export function getFormLabelInnerClasses(props: {
  position?: FormLabelPosition;
  size?: FormSize;
}): string {
  return formLabelInnerCva(props);
}

/* ── Hint CVA ── */

export const formHintCva = cva('blade-form-hint', {
  variants: {
    size: {
      xsmall: null,
      small: null,
      medium: null,
      large: 'blade-form-size-large',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export function getFormHintClasses(props: { size?: FormSize }): string {
  return formHintCva(props);
}

/**
 * Structural label/hint classes referenced only inside templates. Calling this
 * from the Svelte components prevents CSS-module tree-shaking.
 */
export function getFormTemplateClasses(): {
  labelTextGroup: string;
  labelTextGroupTight: string;
  labelSuffix: string;
  labelTrailing: string;
  labelLeft: string;
  hintWrapper: string;
  hintIcon: string;
  hintTextLargeWithIcon: string;
} {
  return {
    labelTextGroup: 'blade-form-label-text-group',
    labelTextGroupTight: 'blade-form-necessity-tight',
    labelSuffix: 'blade-form-label-suffix',
    labelTrailing: 'blade-form-label-trailing',
    labelLeft: 'blade-form-label-left',
    hintWrapper: 'blade-form-hint-wrapper',
    hintIcon: 'blade-form-hint-icon',
    hintTextLargeWithIcon: 'blade-form-hint-text-large-with-icon',
  };
}
