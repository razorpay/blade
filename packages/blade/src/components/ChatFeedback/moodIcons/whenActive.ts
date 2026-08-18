/**
 * The states a mood glyph animates on.
 *
 * The glyph is not the hover target. `ChatFeedbackMoodScale` draws a 20px face inside a 32px
 * button, so two thirds of the control is padding; keying the animation on the SVG itself would
 * leave it inert for most of the area a merchant actually points at, and dead entirely for anyone
 * on a keyboard. Every rule hangs off the ancestor button instead.
 *
 * `aria-checked` is included because the button treats hover, focus and selection as one
 * treatment. A glyph that snapped back to rest the moment the pointer left would undo the only
 * confirmation a merchant gets that the rating registered.
 */
const WHEN_ACTIVE =
  "button:hover:not(:disabled) &, button:focus-visible &, button[aria-checked='true'] &";

export { WHEN_ACTIVE };
