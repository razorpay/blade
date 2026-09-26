import type { ValidationState } from '../../runes/form/hint';
import {
  FRAMED_CONTROL,
  FRAMED_VALIDATION,
  resolveTextInput,
} from '../text-input/styles';

export type TextAreaInputValidationState = ValidationState;

/**
 * TextAreaInput's parts. Static class strings only; focus and disabled
 * styling of the control ride the variant grammar (`focus:`, `disabled:`)
 * so native needs no bridge round-trip — the JS-toggled parts below are the
 * states the grammar lacks.
 */
export interface TextAreaInputClasses {
  root: string;
  /** Applied to the root while the field is disabled. */
  disabled: string;
  /** The visible label text. */
  label: string;
  /** The textarea element. */
  control: string;
  /** Applied to the control per validation state. */
  validation: Record<Exclude<TextAreaInputValidationState, 'none'>, string>;
  /** The one line under the control. */
  hint: string;
  /** Applied to the hint line per validation state. */
  hintTone: Record<TextAreaInputValidationState, string>;
}

/** Style props in, the parts out. */
export type TextAreaInputStyleResolver<P> = (props: P) => TextAreaInputClasses;

/** No style axes yet, like the text field it is grown from. */
export type TextAreaInputStyleProps = Record<never, never>;

// A text area is blade's text field grown to several lines: every part
// comes from text-input's styles, so the two cannot drift. It has no
// affixes, so its control draws the frame itself.
export const resolveTextAreaInput: TextAreaInputStyleResolver<
  TextAreaInputStyleProps
> = () => {
  const field = resolveTextInput({});
  return {
    root: field.root,
    disabled: field.disabled.root,
    label: field.label,
    control: `${FRAMED_CONTROL} resize-none`,
    validation: FRAMED_VALIDATION,
    hint: field.hint,
    hintTone: field.hintTone,
  };
};
