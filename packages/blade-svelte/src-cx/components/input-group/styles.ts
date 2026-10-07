import type { ValidationState } from '../../runes/form/hint';
import type {
  InputGroupCorner,
  InputGroupCorners,
  InputGroupSpan,
} from '../../runes/input-group/layout';

export type InputGroupValidationState = ValidationState;

export type { InputGroupCorner, InputGroupCorners, InputGroupSpan };

/**
 * InputGroup's parts. Every member draws its own frame, as it does alone,
 * and the group joins them: its box lays the members out so their frames
 * overlap, and a member's states are stacked so the shared edge shows the
 * one that matters (focus over hover over rest). An error turns no frame
 * red: the group's line under the members carries it. The group works
 * out from the spans which members hold its corners, so only those are
 * rounded; no member does that bookkeeping itself.
 */
export interface InputGroupClasses {
  root: string;
  /** Applied to the root while the group is disabled. */
  disabled: string;
  /** The grid the members sit in. */
  box: string;
  /** Applied to a member's root: the join with its neighbours. */
  member: string;
  /** Applied to a member's root per span. */
  span: Record<InputGroupSpan, string>;
  /** Applied to a member's frame per corner of the group it holds. */
  corner: Record<InputGroupCorner, string>;
}

/** Style props in, the parts out. */
export type InputGroupStyleResolver<P> = (props: P) => InputGroupClasses;

/** The blade taxonomy as data: Blade DSL's Input Group (Figma) sizes. */
export const INPUT_GROUP_AXES = {
  size: ['medium', 'large'],
} as const;

/** Blade's InputGroup sizes its members and its label and hint. */
export interface InputGroupStyleProps {
  /** Every member's size, and the label's and hint's. @default 'medium' */
  size?: (typeof INPUT_GROUP_AXES.size)[number];
}

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
// radius a lone field of the group's size has all round (12px at large).
const CORNER: Record<InputGroupCorner, string> = {
  tl: 'rounded-tl-small',
  tr: 'rounded-tr-small',
  bl: 'rounded-bl-small',
  br: 'rounded-br-small',
};
const CORNER_LARGE: Record<InputGroupCorner, string> = {
  tl: 'rounded-tl-medium',
  tr: 'rounded-tr-medium',
  bl: 'rounded-bl-medium',
  br: 'rounded-br-medium',
};

export const resolveInputGroup: InputGroupStyleResolver<InputGroupStyleProps> = (
  props: InputGroupStyleProps = {},
) => {
  return {
    root: 'relative flex w-full flex-col',
    // Each member draws its own disabled look, as a lone field does.
    disabled: 'pointer-events-none',
    // Each member draws its own 1px border, as a lone field does, and
    // overlaps its neighbours' by that pixel: the box pads the top and
    // left by it and every member pulls back by it, so the first row and
    // column land on the box's edge and the shared edges are one line.
    // That only holds while the grid sizes the member — stretched, it is
    // its cell plus the pixel — so a member's grouped root names no width.
    // `isolate` keeps the members' stacking — focus over hover over rest,
    // TextInput's grouped tiers — inside the group.
    box: 'isolate grid w-full grid-cols-12 pl-px pt-px',
    member: '-ml-px -mt-px',
    span: SPAN,
    corner: props.size === 'large' ? CORNER_LARGE : CORNER,
  };
};
