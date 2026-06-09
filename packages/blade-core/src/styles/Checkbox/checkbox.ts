import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './checkbox.module.css';

export type CheckboxSize = 'small' | 'medium' | 'large';

// ─── Icon Wrapper ────────────────────────────────────────────────────────────

const checkboxIconWrapperStyles = cva(styles['icon-wrapper'], {
  variants: {
    size: {
      small: styles['size-small'],
      medium: styles['size-medium'],
      large: styles['size-large'],
    },
    isChecked: {
      true: styles.checked,
      false: null,
    },
    isIndeterminate: {
      true: styles.indeterminate,
      false: null,
    },
    isNegative: {
      true: styles.negative,
      false: null,
    },
  },
  defaultVariants: {
    size: 'medium',
    isChecked: false,
    isIndeterminate: false,
    isNegative: false,
  },
});

export function getCheckboxIconWrapperClasses(props: {
  size?: CheckboxSize;
  isChecked?: boolean;
  isIndeterminate?: boolean;
  isNegative?: boolean;
}): string {
  return checkboxIconWrapperStyles({
    size: props.size,
    isChecked: Boolean(props.isChecked),
    isIndeterminate: Boolean(props.isIndeterminate),
    isNegative: Boolean(props.isNegative),
  });
}

// ─── Label Text ──────────────────────────────────────────────────────────────

const checkboxLabelTextStyles = cva(styles['label-text'], {
  variants: {
    size: {
      small: styles['size-small'],
      medium: styles['size-medium'],
      large: styles['size-large'],
    },
  },
  defaultVariants: { size: 'medium' },
});

export function getCheckboxLabelTextClasses(props: { size?: CheckboxSize }): string {
  return checkboxLabelTextStyles({ size: props.size });
}

// ─── Help Text ───────────────────────────────────────────────────────────────

const checkboxHelpTextStyles = cva(styles['help-text'], {
  variants: {
    size: {
      small: null,
      medium: null,
      large: styles['size-large'],
    },
  },
  defaultVariants: { size: 'medium' },
});

export function getCheckboxHelpTextClasses(props: { size?: CheckboxSize }): string {
  return checkboxHelpTextStyles({ size: props.size });
}

// ─── Error Text ──────────────────────────────────────────────────────────────

const checkboxErrorTextStyles = cva(styles['error-text'], {
  variants: {
    size: {
      small: null,
      medium: null,
      large: styles['size-large'],
    },
  },
  defaultVariants: { size: 'medium' },
});

export function getCheckboxErrorTextClasses(props: { size?: CheckboxSize }): string {
  return checkboxErrorTextStyles({ size: props.size });
}

// ─── Supporting Text Wrapper ──────────────────────────────────────────────────

const checkboxSupportingTextWrapperStyles = cva(styles['supporting-text-wrapper'], {
  variants: {
    size: {
      small: styles['size-small'],
      medium: styles['size-medium'],
      large: styles['size-large'],
    },
  },
  defaultVariants: { size: 'medium' },
});

export function getCheckboxSupportingTextWrapperClasses(props: { size?: CheckboxSize }): string {
  return checkboxSupportingTextWrapperStyles({ size: props.size });
}

// ─── Group styles ─────────────────────────────────────────────────────────────

const checkboxGroupFieldStyles = cva(styles['group-field'], {
  variants: {
    labelPosition: {
      top: styles['label-position-top'],
      left: styles['label-position-left'],
    },
  },
  defaultVariants: { labelPosition: 'top' },
});

export function getCheckboxGroupFieldClasses(props: { labelPosition?: 'top' | 'left' }): string {
  return checkboxGroupFieldStyles({ labelPosition: props.labelPosition });
}

const checkboxGroupLabelStyles = cva(styles['group-label'], {
  variants: {
    size: {
      small: styles['size-small'],
      medium: styles['size-medium'],
      large: styles['size-large'],
    },
    labelPosition: {
      top: null,
      left: styles['label-position-left'],
    },
    necessityIndicator: {
      required: styles['necessity-required'],
      optional: styles['necessity-optional'],
      none: null,
    },
  },
  defaultVariants: {
    size: 'medium',
    labelPosition: 'top',
    necessityIndicator: 'none',
  },
});

export function getCheckboxGroupLabelClasses(props: {
  size?: CheckboxSize;
  labelPosition?: 'top' | 'left';
  necessityIndicator?: 'required' | 'optional' | 'none';
}): string {
  return checkboxGroupLabelStyles({
    size: props.size,
    labelPosition: props.labelPosition,
    necessityIndicator: props.necessityIndicator,
  });
}

const checkboxGroupItemsStyles = cva(styles['group-items'], {
  variants: {
    orientation: {
      vertical: styles['orientation-vertical'],
      horizontal: styles['orientation-horizontal'],
    },
    size: {
      small: styles['gap-small'],
      medium: styles['gap-medium'],
      large: styles['gap-large'],
    },
  },
  defaultVariants: { orientation: 'vertical', size: 'medium' },
});

export function getCheckboxGroupItemsClasses(props: {
  orientation?: 'vertical' | 'horizontal';
  size?: CheckboxSize;
}): string {
  return checkboxGroupItemsStyles({
    orientation: props.orientation,
    size: props.size,
  });
}

const checkboxGroupHintStyles = cva(styles['group-hint'], {
  variants: {
    size: {
      small: null,
      medium: null,
      large: styles['size-large'],
    },
    type: {
      error: styles['group-hint-error'],
      help: styles['group-hint-help'],
    },
  },
  defaultVariants: { size: 'medium', type: 'help' },
});

export function getCheckboxGroupHintClasses(props: {
  size?: CheckboxSize;
  type?: 'error' | 'help';
}): string {
  return checkboxGroupHintStyles({ size: props.size, type: props.type });
}

// ─── Template classes (prevents tree-shaking of template-only references) ─────

export function getCheckboxTemplateClasses(): {
  checkbox: string;
  label: string;
  input: string;
  row: string;
  iconSvg: string;
  iconSvgVisible: string;
  groupWrapper: string;
} {
  return {
    checkbox: styles.checkbox,
    label: styles.label,
    input: styles.input,
    row: styles.row,
    iconSvg: styles['icon-svg'],
    iconSvgVisible: styles.visible,
    groupWrapper: styles['group-wrapper'],
  };
}
