import { cva } from 'class-variance-authority';
import type { BaseInputSize } from '../Input/baseInputTokens';

export type InputGroupLabelPosition = 'top' | 'left';

export type InputGroupFieldVariants = {
  labelPosition?: InputGroupLabelPosition;
};

/**
 * Classes for the label + inputs box. `left` switches to a row layout on desktop
 * (`@media (min-width: 768px)`, via the `.blade-input-group-field-left` plugin class); on mobile it
 * falls back to the column layout. The field box lives in the plugin (not as a utility) so the
 * desktop override wins by source order.
 */
export const inputGroupFieldCva = cva('blade-input-group-field', {
  variants: {
    labelPosition: {
      top: null,
      left: 'blade-input-group-field-left',
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
 * xsmall/small/medium → 136px, large → 192px. The margin only applies on desktop, so it uses the
 * `m` (768px) responsive prefix.
 */
const hintIndentBySize: Record<BaseInputSize, string> = {
  xsmall: 'm:ml-[136px]',
  small: 'm:ml-[136px]',
  medium: 'm:ml-[136px]',
  large: 'm:ml-[192px]',
};

export function getInputGroupHintIndentClass(size: BaseInputSize): string {
  return hintIndentBySize[size];
}

/**
 * Structural classes referenced only inside Svelte templates. Calling this from
 * the component prevents tree-shaking from dropping them (and the corner-rounding
 * rules scoped under `.blade-input-group`).
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
    inputGroup: 'blade-input-group',
    group: 'flex flex-col w-full',
    fieldBox: 'blade-input-group-field',
    inputsWrapper: 'flex flex-col',
    inputRow: 'grid blade-input-group-row',
    hintBox: 'ml-spacing-0',
    hintInner: 'flex flex-row justify-between',
  };
}
