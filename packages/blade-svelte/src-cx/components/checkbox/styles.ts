import type { Snippet } from 'svelte';
import { FIELD_HINT, FIELD_HINT_TONE } from '../shared/field';

export type CheckboxValidationState = 'none' | 'error';

/**
 * Checkbox's parts. Static class strings only. The input is semantics and
 * keys; the drawn indicator is the visual, keyed from JS on both axes (`cx`
 * resolves no conflicts) so native needs no `peer-checked:` bridge.
 */
export interface CheckboxClasses {
  root: string;
  /** Applied to the root while the checkbox is disabled. */
  disabled: string;
  /** The label element wrapping the control and its text. */
  row: string;
  /** The checkbox input. */
  control: string;
  /** The drawn control: a box and its always-mounted mark. */
  indicator: {
    root: string;
    look: Record<
      'default' | 'invalid',
      Record<'checked' | 'unchecked', string>
    >;
    /** Wraps the check mark. */
    mark: Record<'checked' | 'unchecked', string>;
  };
  /** The label text (the component's children). */
  label: string;
  /** The one line under the control. */
  hint: string;
  /** Applied to the hint line per validation state. */
  hintTone: Record<CheckboxValidationState, string>;
}

/** Style props in, the parts out. */
export type CheckboxStyleResolver<P> = (props: P) => CheckboxClasses;

/** The glyph drawn inside the indicator; Checkbox draws it itself now. */
export type CheckboxMarkSnippet<P> = Snippet<[P]>;

/** Checkout has one checkbox size: no style axes. */
export type CheckboxStyleProps = Record<never, never>;

// Blade's CheckboxIcon (blade-core Checkbox/checkbox.module.css): a 16px box
// with a 1.5px border and 4px radius. Colours per variant × checked:
// default-checked `interactive.background.primary.default` fill with the
// `interactive.border.primary.default` border; on hover the fill and border
// both take `interactive.background.primary.highlighted` — drawn here as a
// transparent border over the highlighted fill, as the border token set has
// no class for a background token. Unchecked: `interactive.border.gray.
// highlighted`, `interactive.background.gray.faded` on hover. Negative:
// `interactive.*.negative.default`. Disabled wins over negative:
// `interactive.background.primary.disabled` with no border when checked,
// `interactive.border.gray.disabled` when not. The tick is
// `interactive.icon.on-primary.normal`, `interactive.icon.static-white.
// disabled` when disabled — set on the box, and the mark's stroke is
// `currentColor`. The hidden input is the `peer`, so hovering the label
// (which hovers the labelled control) and keyboard focus restyle the box;
// hover in moves at 2xquick/standard, the rest is instant, as in Blade. The
// mark stays mounted and scales between .6 and 1 while it fades, xquick —
// entrance easing in, exit easing out.
const CHECKED_DISABLED =
  'peer-disabled:bg-interactive-primary-disabled peer-disabled:border-transparent';
const UNCHECKED_DISABLED = 'peer-disabled:border-interactive-gray-disabled';
const INDICATOR = {
  root: 'relative flex w-4 h-4 shrink-0 items-center justify-center rounded-xsmall border-thick border-solid icon-interactive-on-primary-normal peer-disabled:icon-interactive-static-white-disabled peer-hover:transition-colors peer-hover:duration-2xquick peer-hover:ease-standard peer-focus-visible:shadow-focus',
  look: {
    default: {
      checked: `border-interactive-primary-default bg-interactive-primary-default peer-hover:border-transparent peer-hover:bg-interactive-primary-highlighted ${CHECKED_DISABLED}`,
      unchecked: `border-interactive-gray-highlighted bg-transparent peer-hover:bg-interactive-gray-faded ${UNCHECKED_DISABLED}`,
    },
    invalid: {
      checked: `border-interactive-negative-default bg-interactive-negative-default ${CHECKED_DISABLED}`,
      unchecked: `border-interactive-negative-default bg-transparent ${UNCHECKED_DISABLED}`,
    },
  },
  mark: {
    checked:
      'flex w-3 h-3 scale-100 opacity-1300 transition-all duration-xquick ease-entrance motion-reduce:transition-none',
    unchecked:
      'flex w-3 h-3 [scale:.6] opacity-0 transition-all duration-xquick ease-exit motion-reduce:transition-none',
  },
};

// Semantic tokens only — merchant theming reaches every class through the
// CSS-var seam.
export const resolveCheckbox: CheckboxStyleResolver<
  CheckboxStyleProps
> = () => {
  return {
    root: 'flex flex-col gap-1',
    disabled: 'pointer-events-none',
    // `relative`: the hidden control is absolutely positioned, and it must sit
    // in its own row — else focusing it scrolls whatever ancestor it lands in.
    row: 'relative flex cursor-pointer items-center gap-2',
    control: 'peer sr-only',
    indicator: INDICATOR,
    label: 'text-100 leading-100 text-surface-gray-subtle peer-disabled:text-surface-gray-disabled',
    hint: FIELD_HINT,
    hintTone: FIELD_HINT_TONE,
  };
};
