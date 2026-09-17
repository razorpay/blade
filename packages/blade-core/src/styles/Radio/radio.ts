import { cva } from 'class-variance-authority';

export type RadioSize = 'small' | 'medium' | 'large';
export type RadioVariant = 'default' | 'disabled' | 'negative';

// ── RadioIcon wrapper: size + (variant × checked) compound colors ──

export type RadioIconWrapperVariants = {
  size?: RadioSize;
  variant?: RadioVariant;
  isChecked?: boolean;
};

/**
 * CVA for the radio icon (circle) wrapper. `size` drives dimensions (atomic utilities); the
 * `variant` × `isChecked` compound drives background + border color via the `.blade-radio-*`
 * plugin classes, which the hidden input's hover/focus-visible sibling selectors also target.
 */
export const radioIconWrapperStyles = cva('blade-radio-icon-wrapper', {
  variants: {
    size: {
      small: 'min-w-[12px] w-[12px] h-[12px] mt-[3px]',
      medium: 'min-w-[16px] w-[16px] h-[16px]',
      large: 'min-w-[20px] w-[20px] h-[20px]',
    },
    variant: {
      default: null,
      disabled: null,
      negative: null,
    },
    isChecked: {
      true: null,
      false: null,
    },
  },
  compoundVariants: [
    { variant: 'default', isChecked: false, class: 'blade-radio-default-unchecked' },
    { variant: 'default', isChecked: true, class: 'blade-radio-default-checked' },
    { variant: 'disabled', isChecked: false, class: 'blade-radio-disabled-unchecked' },
    { variant: 'disabled', isChecked: true, class: 'blade-radio-disabled-checked' },
    { variant: 'negative', isChecked: false, class: 'blade-radio-negative-unchecked' },
    { variant: 'negative', isChecked: true, class: 'blade-radio-negative-checked' },
  ],
  defaultVariants: {
    size: 'medium',
    variant: 'default',
    isChecked: false,
  },
});

export function getRadioIconWrapperClasses(props: RadioIconWrapperVariants): string {
  return radioIconWrapperStyles(props);
}

/**
 * Resolve the icon variant from disabled/negative flags.
 * Precedence matches React: negative wins over disabled.
 */
export function getRadioIconVariant(isDisabled?: boolean, isNegative?: boolean): RadioVariant {
  if (isNegative) return 'negative';
  if (isDisabled) return 'disabled';
  return 'default';
}

// ── Per-radio title (label text) size ──

export const radioTitleStyles = cva(
  'font-text font-regular text-surface-text-gray-subtle ml-spacing-2',
  {
    variants: {
      size: {
        small: 'text-75 leading-75 tracking-50',
        medium: 'text-100 leading-100 tracking-50',
        large: 'text-200 leading-200 tracking-25',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  },
);

export function getRadioTitleClasses(props: { size?: RadioSize }): string {
  return radioTitleStyles(props);
}

// ── Per-radio support text (helpText) offset + size ──

export const radioSupportTextWrapperStyles = cva('flex', {
  variants: {
    size: {
      small: 'ml-[calc(12px_+_var(--spacing-3))]',
      medium: 'ml-[calc(16px_+_var(--spacing-3))]',
      large: 'ml-[calc(20px_+_var(--spacing-3))]',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export function getRadioSupportTextWrapperClasses(props: { size?: RadioSize }): string {
  return radioSupportTextWrapperStyles(props);
}

export const radioSupportTextStyles = cva('font-text font-regular text-surface-text-gray-muted', {
  variants: {
    size: {
      small: 'text-50 leading-50 tracking-50',
      medium: 'text-50 leading-50 tracking-50',
      large: 'text-100 leading-50 tracking-50',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export function getRadioSupportTextClasses(props: { size?: RadioSize }): string {
  return radioSupportTextStyles(props);
}

/**
 * Structural classes for the Radio template. Calling this from the Svelte
 * component prevents tree-shaking from dropping classes only referenced in
 * the template (label, input, dot, etc.).
 */
export function getRadioTemplateClasses(): {
  radioWrapper: string;
  label: string;
  column: string;
  row: string;
  input: string;
  iconWrapper: string;
  dot: string;
  dotChecked: string;
  dotCircle: string;
} {
  return {
    radioWrapper: 'block',
    label: 'inline-flex m-spacing-0 p-spacing-0 select-none',
    column: 'flex flex-col',
    row: 'flex flex-row items-center',
    input:
      'absolute w-[1px] h-[1px] p-spacing-0 -m-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 blade-radio-input',
    iconWrapper: 'blade-radio-icon-wrapper',
    dot: 'blade-radio-dot',
    dotChecked: 'blade-radio-checked',
    dotCircle: 'fill-interactive-icon-on-primary-normal',
  };
}

// ── RadioGroup styles ──

export const radioGroupFieldStyles = cva('flex', {
  variants: {
    labelPosition: {
      top: 'flex-col',
      left: 'blade-radio-group-field-left',
    },
  },
  defaultVariants: {
    labelPosition: 'top',
  },
});

export function getRadioGroupFieldClasses(props: { labelPosition?: 'top' | 'left' }): string {
  return radioGroupFieldStyles(props);
}

export const radioGroupItemsStyles = cva('flex flex-nowrap', {
  variants: {
    orientation: {
      vertical: 'flex-col',
      horizontal: 'flex-row',
    },
    size: {
      small: 'gap-spacing-2',
      medium: 'gap-spacing-3',
      large: 'gap-spacing-4',
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

export function getRadioGroupItemsClasses(props: {
  orientation?: 'vertical' | 'horizontal';
  size?: RadioSize;
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}): string {
  return radioGroupItemsStyles(props);
}

/**
 * `labelLeft` uses `.blade-radio-group-label-left(-medium|-large)` plugin classes so the
 * `@media (max-width: 767px)` collapse (React forces top-position labels on mobile) can override
 * the fixed width/margin/typography together.
 */
export function getRadioGroupLabelSizeClass(
  size: RadioSize,
  labelPosition: 'top' | 'left' = 'top',
): string {
  if (labelPosition === 'left') {
    const leftMap: Record<RadioSize, string> = {
      small:
        'flex-col items-start shrink-0 mb-spacing-0 break-words blade-radio-group-label-left w-[120px] mr-spacing-3 text-75 leading-75 tracking-50',
      medium:
        'flex-col items-start shrink-0 mb-spacing-0 break-words blade-radio-group-label-left blade-radio-group-label-left-medium w-[120px] mr-spacing-4 text-100 leading-100 tracking-50',
      large:
        'flex-col items-start shrink-0 mb-spacing-0 break-words blade-radio-group-label-left blade-radio-group-label-left-large w-[176px] mr-spacing-5 text-200 leading-200 tracking-25',
    };
    return leftMap[size];
  }
  const map: Record<RadioSize, string> = {
    small: 'text-75 leading-75 tracking-50',
    medium: 'text-75 leading-75 tracking-50',
    large: 'text-100 leading-100 tracking-50',
  };
  return map[size];
}

export function getRadioGroupHintTextClass(size: RadioSize): string {
  const map: Record<RadioSize, string> = {
    small: 'text-50 leading-50 tracking-50',
    medium: 'text-50 leading-50 tracking-50',
    large: 'text-100 leading-50 tracking-50',
  };
  return map[size];
}

export function getRadioGroupHintMarginClass(size: RadioSize): string {
  const map: Record<RadioSize, string> = {
    small: 'mt-spacing-2',
    medium: 'mt-spacing-2',
    large: 'mt-spacing-3',
  };
  return map[size];
}

export function getRadioGroupTemplateClasses(): {
  groupLabel: string;
  necessityRequired: string;
  necessityOptional: string;
  helpText: string;
  errorText: string;
  hintWrapper: string;
  hintIcon: string;
  srOnly: string;
} {
  return {
    groupLabel:
      'inline-flex flex-row items-center gap-spacing-2 font-text font-medium text-surface-text-gray-subtle mb-spacing-2',
    // React renders `*` immediately after the label (gap spacing.0); Tailwind's content utility
    // handles the pseudo-element without a plugin class.
    necessityRequired: "gap-spacing-0 after:content-['*'] after:text-feedback-text-negative-intense",
    necessityOptional:
      "after:content-['(optional)'] after:text-surface-text-gray-muted after:font-regular after:text-50 after:leading-50 after:tracking-50",
    helpText: 'block font-text font-regular text-surface-text-gray-muted',
    errorText:
      'block font-text font-regular text-feedback-text-negative-intense blade-radio-group-error-text',
    hintWrapper: 'flex flex-row items-start gap-spacing-2 blade-radio-group-hint-wrapper',
    hintIcon: 'shrink-0 mt-spacing-1 [&>svg]:block',
    srOnly:
      'absolute w-[1px] h-[1px] p-spacing-0 -m-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0',
  };
}
