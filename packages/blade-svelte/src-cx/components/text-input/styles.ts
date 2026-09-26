import type { ValidationState } from '../../runes/form/hint';
import type { IconSource } from '../../runes/icon/source';
import { search } from '../icons';
import { FIELD_HINT, FIELD_HINT_TONE } from '../shared/field';
import {
  INPUT_ACTIVE,
  INPUT_ACTIVE_ON_FOCUS,
  INPUT_DISABLED_CONTENT,
  INPUT_DISABLED_FILL,
  INPUT_DISABLED_ON_CONTROL,
  INPUT_DISABLED_TEXT_ON_CONTROL,
  INPUT_FILL,
  INPUT_INACTIVE,
  INPUT_LABEL,
  INPUT_TEXT,
} from '../shared/input';

export type TextInputValidationState = ValidationState;

type Validated = Exclude<TextInputValidationState, 'none'>;

/** Alone the control draws its own frame; in an InputGroup the group does. */
export type TextInputFrame = 'solo' | 'grouped';

/**
 * TextInput's parts. Static class strings only. The box is the drawn field —
 * border, fill, padding, focus ring — and the control inside it is bare, so
 * the affixes sit inside the field and the box's flex row spaces them. Focus
 * is toggled from JS: the ring belongs to the box, and `focus-within:` is
 * not in the grammar native maps.
 */
export interface TextInputClasses {
  root: string;
  /**
   * The root inside an InputGroup, in place of `root`: the member's cell.
   * It names no width — the group's grid sizes the cell, and stretches the
   * member by the pixel it pulls back over its neighbour's frame.
   */
  grouped: string;
  /**
   * Applied while the field is disabled: to the root, the box and each
   * affix. Toggled from JS like focus — `has-*` is not in native's grammar.
   */
  disabled: Record<'root' | 'box' | 'affix', string>;
  /** The visible label text. */
  label: string;
  /** The drawn field: the row holding the affixes and the control. */
  box: string;
  /** The input element: text only, no frame of its own. */
  control: string;
  /** The box's border and radius. */
  frame: Record<TextInputFrame, string>;
  /**
   * Applied to the box by whether the control has focus. Keyed on both
   * states: the two differ in border colour and `cx` resolves no conflicts.
   */
  focus: Record<TextInputFrame, Record<'focused' | 'blurred', string>>;
  /** Applied to the box per validation state. */
  validation: Record<TextInputFrame, Record<Validated, string>>;
  /** The leading/trailing wrapper, text or snippet alike. */
  affix: string;
  /** Leads a `type="search"` field that has no `leading` of its own. */
  searchIcon: IconSource;
  /** The one line under the control. */
  hint: string;
  /** Applied to the hint line per validation state. */
  hintTone: Record<TextInputValidationState, string>;
}

/** Style props in, the parts out. */
export type TextInputStyleResolver<P> = (props: P) => TextInputClasses;

/** Blade's text field has one look here: no style axes yet. */
export type TextInputStyleProps = Record<never, never>;

// Semantic tokens only — merchant theming reaches every class through the
// CSS-var seam. 16px on phones: iOS zooms into a smaller field.
const TEXT_SIZE = 'text-200 leading-200 m:text-100 m:leading-100';

// The box is the field: the affixes sit inside its border and its flex row
// spaces them, so the control carries no frame and no side padding.
const BOX = `relative flex min-h-9 w-full cursor-text items-center gap-2 px-3 text-surface-gray-muted ${INPUT_FILL} ${TEXT_SIZE}`;
const CONTROL = `min-w-0 flex-1 self-stretch bg-transparent py-0 ${INPUT_TEXT} ${INPUT_DISABLED_TEXT_ON_CONTROL}`;

// In an InputGroup the member draws the same frame it has alone — the
// group rounds the corners it holds — and overlaps its neighbours' by a
// pixel, so a shared edge shows whichever member is on top. The states
// are stacked for that: focus over error over hover over rest, as z-index
// steps inside the group's isolated context. A raised state carries a
// hover twin, since a plain `hover:` step would otherwise outrank it.
const FRAME = {
  solo: 'rounded-small border-thin border-solid',
  grouped: 'border-thin border-solid',
};
const FOCUS = {
  solo: { focused: `z-5 ${INPUT_ACTIVE}`, blurred: INPUT_INACTIVE },
  grouped: {
    focused: `z-30 hover:z-30 ${INPUT_ACTIVE}`,
    blurred: `hover:z-10 ${INPUT_INACTIVE}`,
  },
};

/** The same field drawn on one element: what a text area's control is. */
export const FRAMED_CONTROL = `h-full min-h-9 w-full rounded-small border-thin border-solid px-3 py-2 focus:z-5 ${INPUT_FILL} ${INPUT_TEXT} ${INPUT_INACTIVE} ${INPUT_ACTIVE_ON_FOCUS} ${INPUT_DISABLED_ON_CONTROL} ${TEXT_SIZE}`;
// Blade (baseInputTokens / baseInput.module.css): error is a thick negative
// border in every state, and focus keeps the same primary-muted ring; success
// keeps the gray border — only its hint line turns positive.
export const FRAMED_VALIDATION = {
  error:
    'z-1 !border-thick !border-interactive-negative-default focus:!border-interactive-negative-default',
  success: '',
};

export const resolveTextInput: TextInputStyleResolver<
  TextInputStyleProps
> = () => {
  return {
    root: 'relative flex w-full flex-col gap-1',
    // No `w-full`: a width of its own would end the member a pixel short
    // of its cell, and its frame would sit beside the next one's instead
    // of under it. Stretched by the grid, it is the cell plus that pixel.
    grouped: 'relative flex min-w-0 flex-col',
    disabled: {
      root: 'pointer-events-none',
      box: INPUT_DISABLED_FILL,
      affix: INPUT_DISABLED_CONTENT,
    },
    label: INPUT_LABEL,
    box: BOX,
    control: CONTROL,
    frame: FRAME,
    focus: FOCUS,
    // Blade: error overrides the border (thick negative) in every state but
    // leaves the focus ring primary-muted; success keeps the gray border.
    validation: {
      solo: {
        error: 'z-1 !border-thick !border-interactive-negative-default',
        success: '',
      },
      grouped: {
        error: 'z-20 hover:z-20 !border-thick !border-interactive-negative-default',
        success: '',
      },
    },
    affix: 'flex shrink-0 items-center',
    searchIcon: search,
    hint: FIELD_HINT,
    hintTone: FIELD_HINT_TONE,
  };
};
