import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './inputGroup.module.css';
import type { BaseInputSize } from '../Input/baseInputTokens';

export type InputGroupLabelPosition = 'top' | 'left';

export type InputGroupFieldVariants = {
  labelPosition?: InputGroupLabelPosition;
};

/**
 * Classes for the label + inputs box. `left` switches to a row layout on desktop
 * (`@media (min-width: 768px)`); on mobile it falls back to the column layout.
 */
export const inputGroupFieldCva = cva(styles['field-box'], {
  variants: {
    labelPosition: {
      top: null,
      left: styles['field-box-left'],
    },
  },
  defaultVariants: {
    labelPosition: 'top',
  },
});

export function getInputGroupFieldClasses(props: InputGroupFieldVariants): string {
  return inputGroupFieldCva(props);
}

/*
 * Left-label hint indent per size (mirrors React `formHintLeftLabelMarginLeft`):
 * xsmall/small/medium → 136px, large → 192px. The margin only applies on desktop
 * (the class carries the value inside the `@media` query).
 */
const hintIndentBySize: Record<BaseInputSize, string> = {
  xsmall: styles['hint-indent-medium'],
  small: styles['hint-indent-medium'],
  medium: styles['hint-indent-medium'],
  large: styles['hint-indent-large'],
};

export function getInputGroupHintIndentClass(size: BaseInputSize): string {
  return hintIndentBySize[size];
}

/**
 * Structural classes referenced only inside Svelte templates. Calling this from
 * the component prevents CSS-module tree-shaking from dropping them (and the
 * corner-rounding rules scoped under `.input-group`).
 */
export function getInputGroupTemplateClasses(): {
  inputGroup: string;
  group: string;
  fieldBox: string;
  inputsWrapper: string;
  inputRow: string;
  hintBox: string;
  hintInner: string;
} {
  return {
    inputGroup: styles['input-group'],
    group: styles.group,
    fieldBox: styles['field-box'],
    inputsWrapper: styles['inputs-wrapper'],
    inputRow: styles['input-row'],
    hintBox: styles['hint-box'],
    hintInner: styles['hint-inner'],
  };
}
