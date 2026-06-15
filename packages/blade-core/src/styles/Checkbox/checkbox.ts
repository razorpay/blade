import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './checkbox.module.css';

export type CheckboxSize = 'small' | 'medium' | 'large';
export type CheckboxIconVariant = 'default' | 'disabled' | 'negative';

export type CheckboxIconVariants = {
  size?: CheckboxSize;
  variant?: CheckboxIconVariant;
  isChecked?: boolean;
  isIndeterminate?: boolean;
};

/**
 * Icon-wrapper (the visible box) classes. Combines `size` (width/height +
 * border-width + small padding) with `variant` × `isChecked` compounds that
 * drive background-color and border-color. `isIndeterminate` only affects the
 * small padding-top (suppressed when indeterminate, mirroring React).
 */
export const checkboxIconCva = cva(styles.icon, {
  variants: {
    size: {
      small: styles['icon-small'],
      medium: styles['icon-medium'],
      large: styles['icon-large'],
    },
    variant: {
      default: null,
      disabled: null,
      negative: null,
    },
    isChecked: {
      true: styles.checked,
      false: styles.unchecked,
    },
    isIndeterminate: {
      true: null,
      false: null,
    },
  },
  compoundVariants: [
    { variant: 'default', isChecked: true, class: styles['default-checked'] },
    { variant: 'default', isChecked: false, class: styles['default-unchecked'] },
    { variant: 'disabled', isChecked: true, class: styles['disabled-checked'] },
    { variant: 'disabled', isChecked: false, class: styles['disabled-unchecked'] },
    { variant: 'negative', isChecked: true, class: styles['negative-checked'] },
    { variant: 'negative', isChecked: false, class: styles['negative-unchecked'] },
    { size: 'small', isIndeterminate: false, class: styles['icon-small-pad'] },
  ],
  defaultVariants: {
    size: 'medium',
    variant: 'default',
    isChecked: false,
    isIndeterminate: false,
  },
});

export function getCheckboxIconClasses(props: CheckboxIconVariants): string {
  return checkboxIconCva(props);
}

/** Resolve the icon variant from disabled/negative flags (React precedence). */
export function getCheckboxIconVariant(
  isDisabled?: boolean,
  isNegative?: boolean,
): CheckboxIconVariant {
  if (isDisabled) return 'disabled';
  if (isNegative) return 'negative';
  return 'default';
}

export type CheckboxSvgVariants = {
  size?: CheckboxSize;
  isDisabled?: boolean;
};

export const checkboxSvgCva = cva(styles.svg, {
  variants: {
    size: {
      small: styles['svg-small'],
      medium: styles['svg-medium'],
      large: styles['svg-large'],
    },
    isDisabled: {
      true: styles['svg-disabled'],
      false: null,
    },
  },
  defaultVariants: {
    size: 'medium',
    isDisabled: false,
  },
});

export function getCheckboxSvgClasses(props: CheckboxSvgVariants): string {
  return checkboxSvgCva(props);
}

export type CheckboxTitleVariants = {
  size?: CheckboxSize;
  isDisabled?: boolean;
};

export const checkboxTitleCva = cva(styles.title, {
  variants: {
    size: {
      small: styles['title-small'],
      medium: styles['title-medium'],
      large: styles['title-large'],
    },
    isDisabled: {
      true: styles['title-disabled'],
      false: null,
    },
  },
  defaultVariants: {
    size: 'medium',
    isDisabled: false,
  },
});

export function getCheckboxTitleClasses(props: CheckboxTitleVariants): string {
  return checkboxTitleCva(props);
}

export type CheckboxSupportVariants = {
  size?: CheckboxSize;
};

/** Support-text block wrapper — carries the size-keyed left spacing only.
 * Font styling lives on the inline `.support-text` child (see below) so the
 * wrapper can establish React's taller line box for correct vertical leading. */
export const checkboxSupportCva = cva(styles.support, {
  variants: {
    size: {
      small: styles['support-spacing-small'],
      medium: styles['support-spacing-medium'],
      large: styles['support-spacing-large'],
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export function getCheckboxSupportClasses(props: CheckboxSupportVariants): string {
  return checkboxSupportCva(props);
}

/** Inline support-text — caption font/line-height + color. */
export const checkboxSupportTextCva = cva(styles['support-text'], {
  variants: {
    size: {
      small: styles['support-small'],
      medium: styles['support-medium'],
      large: styles['support-large'],
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export function getCheckboxSupportTextClasses(props: CheckboxSupportVariants): string {
  return checkboxSupportTextCva(props);
}

export type CheckboxHintVariants = {
  size?: CheckboxSize;
  type?: 'help' | 'error';
};

export const checkboxHintCva = cva(styles.hint, {
  variants: {
    size: {
      small: styles['hint-small'],
      medium: styles['hint-medium'],
      large: styles['hint-large'],
    },
    type: {
      help: styles['hint-help'],
      error: styles['hint-error'],
    },
  },
  compoundVariants: [
    // React offsets the large error Text 2px down to align with the larger icon.
    { size: 'large', type: 'error', class: styles['hint-large-error'] },
  ],
  defaultVariants: {
    size: 'medium',
    type: 'help',
  },
});

export function getCheckboxHintClasses(props: CheckboxHintVariants): string {
  return checkboxHintCva(props);
}

export type CheckboxHintWrapperVariants = {
  size?: CheckboxSize;
};

/**
 * Form-hint wrapper classes — combines the structural `hint-wrapper` (flex row)
 * with the size-keyed top spacing that mirrors React's `hintMarginTop`.
 */
export const checkboxHintWrapperCva = cva(styles['hint-wrapper'], {
  variants: {
    size: {
      small: styles['hint-wrapper-spacing-small'],
      medium: styles['hint-wrapper-spacing-medium'],
      large: styles['hint-wrapper-spacing-large'],
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export function getCheckboxHintWrapperClasses(props: CheckboxHintWrapperVariants): string {
  return checkboxHintWrapperCva(props);
}

/** Get template/structural classes — call from Svelte to prevent tree-shaking. */
export function getCheckboxTemplateClasses(): {
  checkbox: string;
  label: string;
  field: string;
  row: string;
  input: string;
  fade: string;
  fadeShown: string;
  fadeIn: string;
  fadeOut: string;
  hintWrapper: string;
  hintIcon: string;
} {
  return {
    checkbox: styles.checkbox,
    label: styles.label,
    field: styles.field,
    row: styles.row,
    input: styles.input,
    fade: styles.fade,
    fadeShown: styles['fade-shown'],
    fadeIn: styles['fade-in'],
    fadeOut: styles['fade-out'],
    hintWrapper: styles['hint-wrapper'],
    hintIcon: styles['hint-icon'],
  };
}

/* ───────────────────────── CheckboxGroup ───────────────────────── */

export type CheckboxGroupFieldVariants = {
  labelPosition?: 'top' | 'left';
};

export const checkboxGroupFieldCva = cva(styles['group-field'], {
  variants: {
    labelPosition: {
      top: styles['field-top'],
      left: styles['field-left'],
    },
  },
  defaultVariants: {
    labelPosition: 'top',
  },
});

export function getCheckboxGroupFieldClasses(props: CheckboxGroupFieldVariants): string {
  return checkboxGroupFieldCva(props);
}

export type CheckboxGroupOptionsVariants = {
  orientation?: 'vertical' | 'horizontal';
  size?: CheckboxSize;
};

export const checkboxGroupOptionsCva = cva(styles.options, {
  variants: {
    orientation: {
      vertical: styles['options-vertical'],
      horizontal: styles['options-horizontal'],
    },
    size: {
      small: styles['gap-small'],
      medium: styles['gap-medium'],
      large: styles['gap-large'],
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    size: 'medium',
  },
});

export function getCheckboxGroupOptionsClasses(props: CheckboxGroupOptionsVariants): string {
  return checkboxGroupOptionsCva(props);
}

export function getCheckboxGroupLabelSizeClass(size: CheckboxSize): string {
  const map: Record<CheckboxSize, string> = {
    small: styles['group-label-small'],
    medium: styles['group-label-medium'],
    large: styles['group-label-large'],
  };
  return map[size];
}

/** Get group template/structural classes — call from Svelte to prevent tree-shaking. */
export function getCheckboxGroupTemplateClasses(): {
  groupLabel: string;
  labelRow: string;
  labelSuffix: string;
  labelTrailing: string;
  necessityRequired: string;
  necessityOptional: string;
  hint: string;
  hintHelp: string;
  hintError: string;
  hintWrapper: string;
  hintIcon: string;
  srOnly: string;
} {
  return {
    groupLabel: styles['group-label'],
    labelRow: styles['label-row'],
    labelSuffix: styles['label-suffix'],
    labelTrailing: styles['label-trailing'],
    necessityRequired: styles['necessity-required'],
    necessityOptional: styles['necessity-optional'],
    hint: styles.hint,
    hintHelp: styles['hint-help'],
    hintError: styles['hint-error'],
    hintWrapper: styles['hint-wrapper'],
    hintIcon: styles['hint-icon'],
    srOnly: styles['sr-only'],
  };
}
