import type { ValidationState } from '../../runes/form/hint';
import { framedControl, FRAMED_VALIDATION, resolveTextInput } from '../text-input/styles';
import type { TextInputStyleProps } from '../text-input/styles';

export type TextAreaValidationState = ValidationState;

/**
 * TextArea's parts. Static class strings only; focus and disabled
 * styling of the control ride the variant grammar (`focus:`, `disabled:`)
 * so native needs no bridge round-trip — the JS-toggled parts below are the
 * states the grammar lacks.
 */
export interface TextAreaClasses {
  root: string;
  /** Applied to the root while the field is disabled. */
  disabled: string;
  /** The textarea element. */
  control: string;
  /** Applied to the control per validation state. */
  validation: Record<Exclude<TextAreaValidationState, 'none'>, string>;
  /** Holds the control and the clear button over its top end. */
  box: string;
  /** The clear button (`showClearButton`), pinned to the box's top end. */
  clear: string;
  /** Applied to the control while the clear button shows: room for it. */
  clearRoom: string;
  /** The hint line and the character counter, side by side. */
  footer: string;
  counter: string;
}

/** Style props in, the parts out. */
export type TextAreaStyleResolver<P> = (props: P) => TextAreaClasses;

/** The blade taxonomy as data: Blade DSL's TextArea Input (Figma) sizes. */
export const TEXT_AREA_AXES = {
  size: ['medium', 'large'],
} as const;

/** The text field's sizes. */
export interface TextAreaStyleProps {
  /** Also sizes the label and the hint. @default 'medium' */
  size?: Extract<TextInputStyleProps['size'], 'medium' | 'large'>;
}

// A text area is blade's text field grown to several lines: every part
// comes from text-input's styles, so the two cannot drift. It has no
// affixes, so its control draws the frame itself: 8px top and bottom, 12px
// in, 8px round (12px at large), as Blade DSL's TextArea Input (Figma).
export const resolveTextArea: TextAreaStyleResolver<TextAreaStyleProps> = (
  props: TextAreaStyleProps = {},
) => {
  const field = resolveTextInput({ size: props.size });
  return {
    root: field.root,
    disabled: field.disabled.root,
    control: `${framedControl(props.size)} block resize-none`,
    validation: FRAMED_VALIDATION,
    box: 'relative',
    // Blade's trailing slot: 8px down, 12px in, 8px from the text.
    clear: `absolute top-2 right-3 z-10 ${field.clear}`,
    clearRoom: 'pr-9',
    footer: field.footer,
    counter: field.counter,
  };
};
