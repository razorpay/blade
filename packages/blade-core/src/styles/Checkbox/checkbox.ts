import { cva } from 'class-variance-authority';

export type CheckboxSize = 'small' | 'medium' | 'large';
export type CheckboxIconVariant = 'default' | 'disabled' | 'negative';

export type CheckboxIconVariants = {
  size?: CheckboxSize;
  variant?: CheckboxIconVariant;
  isChecked?: boolean;
  isIndeterminate?: boolean;
};

/**
 * Icon-wrapper (the visible box) classes. Combines `size` (width/height + border-width + small
 * padding) with `variant` × `isChecked` compounds that drive background-color and border-color.
 * The compound classes (`.blade-checkbox-*-checked/unchecked`) and the label-hover override live in
 * the plugin — the hover selector targets these class names directly. `isIndeterminate` only
 * affects the small padding-top (suppressed when indeterminate, mirroring React).
 */
export const checkboxIconCva = cva(
  'blade-checkbox-icon relative flex items-center justify-center shrink-0 border-solid m-spacing-1 rounded-xsmall box-border',
  {
    variants: {
      size: {
        small: 'w-[12px] h-[12px] border-thick',
        medium: 'w-[16px] h-[16px] border-thick',
        large: 'w-[20px] h-[20px] border-thicker',
      },
      variant: {
        default: null,
        disabled: null,
        negative: null,
      },
      isChecked: {
        true: 'blade-checkbox-checked',
        false: 'blade-checkbox-unchecked',
      },
      isIndeterminate: {
        true: null,
        false: null,
      },
    },
    compoundVariants: [
      { variant: 'default', isChecked: true, class: 'blade-checkbox-default-checked' },
      { variant: 'default', isChecked: false, class: 'blade-checkbox-default-unchecked' },
      { variant: 'disabled', isChecked: true, class: 'blade-checkbox-disabled-checked' },
      { variant: 'disabled', isChecked: false, class: 'blade-checkbox-disabled-unchecked' },
      { variant: 'negative', isChecked: true, class: 'blade-checkbox-negative-checked' },
      { variant: 'negative', isChecked: false, class: 'blade-checkbox-negative-unchecked' },
      { size: 'small', isIndeterminate: false, class: 'pt-[1px]' },
    ],
    defaultVariants: {
      size: 'medium',
      variant: 'default',
      isChecked: false,
      isIndeterminate: false,
    },
  },
);

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

export const checkboxSvgCva = cva('text-interactive-icon-on-primary-normal', {
  variants: {
    size: {
      small: 'w-[8px] h-[8px]',
      medium: 'w-[12px] h-[12px]',
      large: 'w-[16px] h-[16px]',
    },
    isDisabled: {
      true: 'text-interactive-icon-static-white-disabled',
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

export const checkboxTitleCva = cva(
  'ml-spacing-2 font-text font-regular text-surface-text-gray-subtle',
  {
    variants: {
      size: {
        small: 'text-75 leading-75',
        medium: 'text-100 leading-100',
        large: 'text-200 leading-200',
      },
      isDisabled: {
        true: 'text-surface-text-gray-disabled',
        false: null,
      },
    },
    defaultVariants: {
      size: 'medium',
      isDisabled: false,
    },
  },
);

export function getCheckboxTitleClasses(props: CheckboxTitleVariants): string {
  return checkboxTitleCva(props);
}

export type CheckboxSupportVariants = {
  size?: CheckboxSize;
};

/** Support-text block wrapper — carries the size-keyed left spacing only.
 * Font styling lives on the inline `.support-text` child (see below) so the
 * wrapper can establish React's taller line box for correct vertical leading. */
export const checkboxSupportCva = cva('block text-200 [line-height:normal]', {
  variants: {
    size: {
      small: 'ml-[20px]',
      medium: 'ml-[24px]',
      large: 'ml-[28px]',
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
export const checkboxSupportTextCva = cva('font-text font-regular text-surface-text-gray-muted', {
  variants: {
    size: {
      small: 'text-50 leading-50',
      medium: 'text-50 leading-50',
      large: 'text-100 leading-50',
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

export const checkboxHintCva = cva('font-text font-regular', {
  variants: {
    size: {
      small: 'text-50 leading-50',
      medium: 'text-50 leading-50',
      large: 'text-100 leading-50',
    },
    type: {
      help: 'text-surface-text-gray-muted',
      error: 'text-feedback-text-negative-intense',
    },
  },
  compoundVariants: [
    // React offsets the large error Text 2px down to align with the larger icon.
    { size: 'large', type: 'error', class: 'mt-spacing-1' },
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
 * Form-hint wrapper classes — combines the structural flex row with the size-keyed top spacing
 * that mirrors React's `hintMarginTop`.
 */
export const checkboxHintWrapperCva = cva('flex flex-row items-start gap-spacing-2', {
  variants: {
    size: {
      small: 'mt-spacing-2',
      medium: 'mt-spacing-2',
      large: 'mt-spacing-3',
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
    checkbox: 'block',
    label: 'blade-checkbox-label',
    field: 'flex flex-col',
    row: 'flex flex-row',
    input:
      'absolute w-[1px] h-[1px] p-spacing-0 -m-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 blade-checkbox-input',
    fade: 'absolute flex opacity-0',
    fadeShown: 'opacity-100',
    fadeIn: 'blade-checkbox-fade-in',
    fadeOut: 'blade-checkbox-fade-out',
    hintWrapper: 'flex flex-row items-start gap-spacing-2',
    // One-off descendant rule (`svg` inside the hint icon renders block) — an arbitrary variant is
    // simpler here than a dedicated plugin class for a single declaration.
    hintIcon: 'shrink-0 mt-spacing-1 flex [line-height:0] [&>svg]:block',
  };
}

/* ───────────────────────── CheckboxGroup ───────────────────────── */

export type CheckboxGroupFieldVariants = {
  labelPosition?: 'top' | 'left';
};

export const checkboxGroupFieldCva = cva('flex', {
  variants: {
    labelPosition: {
      top: 'flex-col',
      left: 'flex-row items-start gap-spacing-4',
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
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
};

export const checkboxGroupOptionsCva = cva('flex', {
  variants: {
    orientation: {
      vertical: 'flex-col',
      horizontal: 'flex-row',
    },
    size: {
      small: 'gap-spacing-2',
      medium: 'gap-spacing-3',
      large: 'gap-spacing-3',
    },
    flexWrap: {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
      'wrap-reverse': 'flex-wrap-reverse',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    size: 'medium',
    flexWrap: 'nowrap',
  },
});

export function getCheckboxGroupOptionsClasses(props: CheckboxGroupOptionsVariants): string {
  return checkboxGroupOptionsCva(props);
}

export function getCheckboxGroupLabelSizeClass(size: CheckboxSize): string {
  const map: Record<CheckboxSize, string> = {
    small: 'text-75 leading-75 text-surface-text-gray-muted',
    medium: 'text-75 leading-75 text-surface-text-gray-subtle',
    large: 'text-100 leading-100 text-surface-text-gray-subtle',
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
    groupLabel: 'inline-flex items-center font-text font-medium mb-spacing-3 gap-spacing-2',
    labelRow: 'flex items-center w-full',
    labelSuffix: 'inline-flex items-center ml-spacing-2',
    labelTrailing: 'inline-flex items-center ml-auto',
    // `after:content-[...]` uses Tailwind's underscore-for-space escaping in arbitrary values.
    necessityRequired: "after:content-['_*'] after:text-feedback-text-negative-intense",
    necessityOptional:
      "after:content-['_(optional)'] after:text-surface-text-gray-muted after:font-regular",
    hint: 'font-text font-regular',
    hintHelp: 'text-surface-text-gray-muted',
    hintError: 'text-feedback-text-negative-intense',
    hintWrapper: 'flex flex-row items-start gap-spacing-2',
    hintIcon: 'shrink-0 mt-spacing-1 flex [line-height:0] [&>svg]:block',
    srOnly:
      'absolute w-[1px] h-[1px] p-spacing-0 -m-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0',
  };
}
