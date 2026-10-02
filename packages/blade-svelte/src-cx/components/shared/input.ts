// The input family's states in one place — TextInput (PhoneNumberInput is
// one), TextArea and OTPInput — so no field drifts from the rest.
// Uno reads class names literally, so a state comes in the spelling
// its host needs: plain, for a part the core toggles from JS, or as a
// variant on a control that draws its own frame. Both spellings of a
// state sit together here; change them together.

/** Placeholder and inactive: the fill, the typed text and its hint. */
export const INPUT_FILL = 'bg-surface-gray-intense transition-all duration-xquick ease-standard';
// Blade's baseInput: the value in `interactive.text.gray.normal`, the
// placeholder in `surface.text.gray.disabled`.
export const INPUT_TEXT =
  'text-interactive-gray-normal outline-none placeholder:text-surface-gray-disabled';

/** Inactive and hover: the border colour; the host sets its width. */
export const INPUT_INACTIVE = 'border-interactive-gray-default hover:border-interactive-gray-highlighted';

/**
 * Active: a thicker primary border and Blade's focus ring — a 4px
 * `surface.border.primary.muted` outline, 1px off the box.
 */
export const INPUT_ACTIVE =
  'border-thick border-interactive-primary-default outline-solid outline-4 outline-offset-1 outline-surface-primary-muted';
export const INPUT_ACTIVE_ON_FOCUS =
  'focus:border-thick focus:border-interactive-primary-default focus:outline-solid focus:outline-4 focus:outline-offset-1 focus:outline-surface-primary-muted';

/**
 * Disabled: a grey fill, the disabled grey border, and the content in the
 * disabled greys (Blade's baseInput `[data-disabled]` and BaseInputVisuals).
 */
// Important: it overrides the fill and border on the same element, and `cx`
// resolves no conflicts.
export const INPUT_DISABLED_FILL =
  '!bg-surface-gray-moderate !border-interactive-gray-disabled';
export const INPUT_DISABLED_CONTENT = 'text-surface-gray-disabled';
export const INPUT_DISABLED_TEXT_ON_CONTROL =
  'disabled:cursor-not-allowed disabled:text-surface-gray-disabled';
export const INPUT_DISABLED_ON_CONTROL = `${INPUT_DISABLED_TEXT_ON_CONTROL} disabled:bg-surface-gray-moderate disabled:border-interactive-gray-disabled`;
