// The line above and below every field, in one place: a restyle of labels
// or hints is one edit, and no field drifts from the rest.

/** Blade's form sizes (FormLabel, FormHint, CharacterCounter). */
export type FieldSize = 'xsmall' | 'small' | 'medium' | 'large';

/** Blade's FormHint sizes; all but `large` share a caption. */
export type FieldHintSize = FieldSize;
export type FieldHintTone = 'help' | 'error' | 'success';

export interface FieldHintClasses {
  root: string;
  icon: string;
  text: string;
}

// Blade's FormHint (Form/FormHint.tsx, formTokens.ts): 4px above (8px at
// large), an icon for error and success — 12px (16px at large), 2px down,
// 4px before the text — and a caption: 11/16 (14/16 at large, nudged 2px
// down beside an icon).
const HINT_SIZE: Record<FieldHintSize, { gap: string; caption: string; besideIcon: string }> = {
  xsmall: { gap: 'mt-1', caption: 'text-50 leading-50', besideIcon: '' },
  small: { gap: 'mt-1', caption: 'text-50 leading-50', besideIcon: '' },
  medium: { gap: 'mt-1', caption: 'text-50 leading-50', besideIcon: '' },
  large: { gap: 'mt-2', caption: 'text-100 leading-50', besideIcon: 'mt-0.5' },
};

const HINT_TONE: Record<FieldHintTone, string> = {
  help: 'text-surface-gray-muted',
  error: 'text-feedback-negative-intense',
  success: 'text-feedback-positive-intense',
};

/** The parts of one hint line; `FieldHint` draws it. */
export function resolveFieldHint(size: FieldHintSize, tone: FieldHintTone): FieldHintClasses {
  const look = HINT_SIZE[size];
  const hasIcon = tone !== 'help';
  return {
    root: `flex items-start gap-1 ${look.gap}`,
    icon: 'flex shrink-0 mt-0.5',
    text: `font-sans font-normal tracking-50 ${look.caption} ${HINT_TONE[tone]} ${
      hasIcon ? look.besideIcon : ''
    }`,
  };
}

export type FieldNecessity = 'required' | 'optional' | 'none';

export interface FieldLabelClasses {
  /**
   * The label's row, full width: the label alone, or whatever `labelRow`
   * places beside it. Holds the gap to the field.
   */
  row: string;
  /** The label (or span) element: the text and its necessity, nothing else. */
  label: string;
  text: string;
  required: string;
  optional: string;
}

// Blade's FormLabel on top (Form/FormLabel.tsx, formTokens.ts; Blade DSL's
// _FormGroup-Header in Figma): body text, medium weight, clamped to two
// lines — small at every size but large, muted at xsmall and small, subtle
// above — 4px above the field (8px at large). Required is a body-small
// semibold `*` in `feedback.text.negative.intense`, 2px after the text and
// pinned to the first line; optional a regular caption, 4px after the text,
// in `surface.text.gray.muted`. Anything a `labelRow` adds sits 4px apart
// (Blade's `labelSuffix` gap); `ms-auto` pushes an item to the row's end
// (Blade's `labelTrailing`).
const LABEL_SIZE: Record<FieldSize, { text: string; gap: string; optional: string }> = {
  xsmall: {
    text: 'text-75 leading-75 text-surface-gray-muted',
    gap: 'mb-1',
    optional: 'text-50 leading-50',
  },
  small: {
    text: 'text-75 leading-75 text-surface-gray-muted',
    gap: 'mb-1',
    optional: 'text-50 leading-50',
  },
  medium: {
    text: 'text-75 leading-75 text-surface-gray-subtle',
    gap: 'mb-1',
    optional: 'text-50 leading-50',
  },
  large: {
    text: 'text-100 leading-100 text-surface-gray-subtle',
    gap: 'mb-2',
    optional: 'text-100 leading-50',
  },
};

/** The parts of a field's label; `FieldLabel` draws it. */
export function resolveFieldLabel(size: FieldSize, necessity: FieldNecessity): FieldLabelClasses {
  const look = LABEL_SIZE[size];
  return {
    row: `flex w-full shrink-0 items-center gap-1 ${look.gap}`,
    label: `flex max-h-9 items-center ${necessity === 'optional' ? 'gap-1' : ''}`,
    text: `m-0 clamp-2 font-sans font-medium tracking-50 ${look.text}`,
    required:
      'ms-0.5 self-start font-sans font-semibold text-75 leading-75 tracking-50 text-feedback-negative-intense',
    optional: `font-sans font-normal tracking-50 text-surface-gray-muted ${look.optional}`,
  };
}

/**
 * Blade's CharacterCounter: `current/max` as a regular caption in
 * `surface.text.gray.muted`, 11/16 at every size — Figma's _FormGroup-Footer
 * keeps the count small even where the help text is 14/16 (large). Where it
 * sits is the field's.
 */
export function resolveFieldCounter(_size: FieldSize): string {
  return 'font-sans font-normal tracking-50 text-surface-gray-muted text-50 leading-50';
}

/** The hint's tone for a field's validation state. */
export function hintToneOf(state: 'none' | 'error' | 'success'): FieldHintTone {
  return state === 'none' ? 'help' : state;
}
