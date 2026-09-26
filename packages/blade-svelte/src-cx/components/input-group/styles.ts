import type { ValidationState } from '../../runes/form/hint';
import type {
  InputGroupCorner,
  InputGroupCorners,
  InputGroupSpan,
} from '../../runes/input-group/layout';
import { FIELD_HINT, FIELD_HINT_TONE } from '../shared/field';
import { INPUT_LABEL } from '../shared/input';

export type InputGroupValidationState = ValidationState;

export type { InputGroupCorner, InputGroupCorners, InputGroupSpan };

/**
 * InputGroup's parts. Every member draws its own frame, as it does alone,
 * and the group joins them: its box lays the members out so their frames
 * overlap, and a member's states are stacked so the shared edge shows the
 * one that matters (focus over error over hover over rest). The group works
 * out from the spans which members hold its corners, so only those are
 * rounded; no member does that bookkeeping itself.
 */
export interface InputGroupClasses {
  root: string;
  /** Applied to the root while the group is disabled. */
  disabled: string;
  /** The visible label text. */
  label: string;
  /** The grid the members sit in. */
  box: string;
  /** Applied to a member's root: the join with its neighbours. */
  member: string;
  /** Applied to a member's root per span. */
  span: Record<InputGroupSpan, string>;
  /** Applied to a member's frame per corner of the group it holds. */
  corner: Record<InputGroupCorner, string>;
  /** The one line under the box. */
  hint: string;
  /** Applied to the hint line per validation state. */
  hintTone: Record<InputGroupValidationState, string>;
}

/** Style props in, the parts out. */
export type InputGroupStyleResolver<P> = (props: P) => InputGroupClasses;

/** No style axes yet: a member's width is its own `span`. */
export type InputGroupStyleProps = Record<never, never>;

// The box is a 12-track grid (12 divides by 2, 3 and 4), so a member's
// fraction of the row is a literal col-span. `grid-cols-12`/`col-span-N`
// is also the grid grammar the native renderer maps.
const SPAN: Record<InputGroupSpan, string> = {
  full: 'col-span-full',
  '1/2': 'col-span-6',
  '1/3': 'col-span-4',
  '2/3': 'col-span-8',
  '1/4': 'col-span-3',
  '3/4': 'col-span-9',
};

// The members that hold a corner of the group are rounded there, at the
// radius a lone field has all round.
const CORNER: Record<InputGroupCorner, string> = {
  tl: 'rounded-tl-small',
  tr: 'rounded-tr-small',
  bl: 'rounded-bl-small',
  br: 'rounded-br-small',
};

export const resolveInputGroup: InputGroupStyleResolver<
  InputGroupStyleProps
> = () => {
  return {
    root: 'relative flex w-full flex-col gap-1',
    // Each member draws its own disabled look, as a lone field does.
    disabled: 'pointer-events-none',
    label: INPUT_LABEL,
    // Each member draws its own 1px border, as a lone field does, and
    // overlaps its neighbours' by that pixel: the box pads the top and
    // left by it and every member pulls back by it, so the first row and
    // column land on the box's edge and the shared edges are one line.
    // That only holds while the grid sizes the member — stretched, it is
    // its cell plus the pixel — so a member's grouped root names no width.
    // `isolate` keeps the members' stacking — focus over error over hover
    // over rest, TextInput's grouped tiers — inside the group.
    box: 'isolate grid w-full grid-cols-12 pl-px pt-px',
    member: '-ml-px -mt-px',
    span: SPAN,
    corner: CORNER,
    hint: FIELD_HINT,
    hintTone: FIELD_HINT_TONE,
  };
};
