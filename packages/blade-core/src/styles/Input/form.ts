import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import labelStyles from './formLabel.module.css';
// @ts-expect-error - CSS modules may not have type definitions in build
import hintStyles from './formHint.module.css';
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

export const formLabelCva = cva(labelStyles.label, {
  variants: {
    position: {
      top: null,
      left: labelStyles['label-left'],
    },
    size: {
      xsmall: labelStyles['size-xsmall'],
      small: labelStyles['size-small'],
      medium: labelStyles['size-medium'],
      large: labelStyles['size-large'],
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

export const formLabelInnerCva = cva(labelStyles['label-inner'], {
  variants: {
    position: {
      top: null,
      left: labelStyles['label-left'],
    },
    size: {
      xsmall: labelStyles['size-xsmall'],
      small: labelStyles['size-small'],
      medium: labelStyles['size-medium'],
      large: labelStyles['size-large'],
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

export const formHintCva = cva(hintStyles.hint, {
  variants: {
    size: {
      xsmall: null,
      small: null,
      medium: null,
      large: hintStyles['size-large'],
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
  labelSuffix: string;
  labelTrailing: string;
  labelLeft: string;
  hintWrapper: string;
  hintIcon: string;
  hintTextLargeWithIcon: string;
} {
  return {
    labelTextGroup: labelStyles['label-text-group'],
    labelSuffix: labelStyles['label-suffix'],
    labelTrailing: labelStyles['label-trailing'],
    labelLeft: labelStyles['label-left'],
    hintWrapper: hintStyles['hint-wrapper'],
    hintIcon: hintStyles['hint-icon'],
    hintTextLargeWithIcon: hintStyles['hint-text-large-with-icon'],
  };
}
