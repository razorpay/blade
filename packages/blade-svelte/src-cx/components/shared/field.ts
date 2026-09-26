// The line above and below every field, in one place: a restyle of labels
// or hints is one edit, and no field drifts from the rest.

/** The caption above a field or a group of options. */
export const FIELD_LABEL = 'text-75 leading-50 text-surface-gray-subtle';

/** The one line under a field. Its colour is `FIELD_HINT_TONE`'s, never here. */
export const FIELD_HINT = 'text-75 leading-50';

/** Keyed on every state: `cx` resolves no conflicts. */
export const FIELD_HINT_TONE = {
  none: 'text-surface-gray-muted',
  error: 'text-feedback-negative-intense',
  success: 'text-feedback-positive-intense',
};
