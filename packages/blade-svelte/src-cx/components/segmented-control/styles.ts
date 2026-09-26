// SegmentedControl: Blade's names over RadioGroup, plus the pill look it
// hands the group. RadioGroup receives the look and imports nothing here,
// so a consumer of plain radios bundles none of it.
import type { Snippet } from 'svelte';
import type { IconSource } from '../../runes/icon/source';
import type {
  RadioGroupClasses,
  RadioGroupStyleProps,
  RadioGroupStyleResolver,
  RadioGroupValidationState,
} from '../radio/styles';
import type { AxisValue } from '../../axes';
import { FIELD_HINT, FIELD_HINT_TONE, FIELD_LABEL } from '../shared/field';

/** Blade's SegmentedControl sizes. */
export const SEGMENT_SIZES = ['small', 'medium', 'large'] as const;

export type SegmentSize = (typeof SEGMENT_SIZES)[number];

// Blade's SegmentedControl: the pill's padding is 2px at `small`, 4px
// otherwise, and the segments sit 2px apart. The thumb is one segment wide
// and slides by whole segments plus that gap, so nothing is measured:
// `--segment-index` and `--segment-count` come from the group. The design
// draws `medium` 36px tall: 14px text on 28px segments in a 12px-radius
// track that is the faded gray (6%) over whatever it sits on.
const THUMB =
  'pointer-events-none absolute [translate:calc(var(--segment-index)*(100%_+_0.125rem))_0] bg-surface-gray-intense transition-transform duration-quick ease-standard motion-reduce:transition-none';
const THUMB_MEDIUM =
  'inset-y-1 left-1 [width:calc((100%_-_0.5rem_-_(var(--segment-count)_-_1)*0.125rem)/var(--segment-count))] rounded-small';

const SEGMENT_SIZE: Record<
  SegmentSize,
  { options: string; row: string; label: string; thumb: string }
> = {
  small: {
    options: 'gap-0.5 rounded-small p-0.5',
    row: 'rounded-xsmall',
    label: 'rounded-xsmall px-2 py-0.5 text-100 leading-100',
    thumb:
      'inset-y-0.5 left-0.5 [width:calc((100%_-_0.25rem_-_(var(--segment-count)_-_1)*0.125rem)/var(--segment-count))] rounded-xsmall',
  },
  medium: {
    options: 'gap-0.5 rounded-medium p-1',
    row: 'rounded-small',
    label: 'rounded-small px-2 py-1 text-75 leading-50',
    thumb: THUMB_MEDIUM,
  },
  large: {
    options: 'gap-0.5 rounded-medium p-1',
    row: 'rounded-small',
    label: 'rounded-small px-2 py-2 text-200 leading-200',
    thumb: THUMB_MEDIUM,
  },
};

/** The surface the pill sits on: a light one, or a brand-colour pane. */
export const SEGMENT_COLORS = ['neutral', 'white'] as const;

export type SegmentColor = (typeof SEGMENT_COLORS)[number];

// The track is a translucent tint of what it sits on, so `white` draws
// the pill over a brand-colour pane: white at 18% for the track, white
// unpicked text, and the same white thumb with dark text on it.
const SEGMENT_COLOR: Record<
  SegmentColor,
  { options: string; unpicked: string; disabled: string }
> = {
  // Blade's SegmentedControlItem: unpicked text and icon
  // `interactive.*.gray.muted`, `interactive.background.gray.default` on
  // hover, no press tint; disabled `interactive.*.gray.disabled`.
  neutral: {
    options: 'bg-interactive-gray-faded',
    unpicked: 'text-interactive-gray-muted hover:bg-interactive-gray-default',
    disabled: 'peer-disabled:text-interactive-gray-disabled',
  },
  // No Blade counterpart: the neutral rules in the static-white tokens.
  white: {
    options: 'bg-interactive-static-white-faded',
    unpicked:
      'text-interactive-static-white-normal hover:bg-interactive-static-white-faded',
    disabled: 'peer-disabled:text-interactive-static-white-disabled',
  },
};

/**
 * The group's parts when it is drawn as one joined pill: what
 * SegmentedControl hands RadioGroup as its `look`. It ignores the group's
 * own style props — a pill has no orientation.
 */
export function segmentedLook(
  size: SegmentSize,
  color: SegmentColor = 'neutral'
): RadioGroupStyleResolver<RadioGroupStyleProps> {
  const segment = SEGMENT_SIZE[size];
  const tint = SEGMENT_COLOR[color];
  const classes: RadioGroupClasses = {
    root: 'flex flex-col gap-2',
    // Blade fades nothing: each segment takes its disabled text colour.
    disabled: '',
    label: FIELD_LABEL,
    hint: FIELD_HINT,
    hintTone: FIELD_HINT_TONE,
    options: `relative flex w-full items-center ${tint.options} ${segment.options}`,
    thumb: `${THUMB} ${segment.thumb}`,
    radio: {
      // A segment shows interaction only. The pick is the thumb that
      // RadioGroup slides under the rows, so a picked row has no
      // style of its own; the hover and press tints are the unpicked rows',
      // because over the thumb they would grey the pick out.
      row: `relative flex min-w-0 flex-1 cursor-pointer transition-colors duration-xquick ease-standard ${segment.row}`,
      pick: {
        // Blade: `interactive.text.gray.normal` over the thumb.
        picked: 'text-interactive-gray-normal',
        unpicked: tint.unpicked,
      },
      // The input is the label's peer, so the disabled colour outranks the pick's.
      disabled: `pointer-events-none ${tint.disabled}`,
      // The segment is the visual; the input stays for semantics and keys.
      // It is the label's `peer`, so the focus ring is the keyboard's only
      // (`focus-visible`): on a click a ring would reach the new segment
      // before the thumb does. The label fills the segment to carry it.
      control: 'peer sr-only',
      // A flex label: a segment may carry an icon before its text.
      label: `flex min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap font-medium peer-focus-visible:shadow-focus-inset ${segment.label}`,
    },
  };
  return () => classes;
}

/** The blade taxonomy as data. */
export const SEGMENTED_CONTROL_AXES = {
  size: SEGMENT_SIZES,
  color: SEGMENT_COLORS,
} as const;

/** Derived from SEGMENTED_CONTROL_AXES: add a value there, never here. */
export interface SegmentedControlStyleProps {
  size?: AxisValue<typeof SEGMENTED_CONTROL_AXES, 'size'>;
  /** `white`: the pill over a brand-colour pane, as Button's `white`. */
  color?: AxisValue<typeof SEGMENTED_CONTROL_AXES, 'color'>;
}

/**
 * Blade's SegmentedControl, spelt over RadioGroup through the group's
 * internal `look`: the same form field with the same grammar, so every prop
 * but `size` and `color` is the group's.
 */
export interface SegmentedControlProps extends SegmentedControlStyleProps {
  label?: string;
  /**
   * The picked segment's `value`: the initial one, a `bind:value`, or a
   * value the host keeps driving — so there is no `defaultValue`.
   */
  value?: string;
  onChange?: (value: string) => void;
  /** Registers the control with the enclosing Form under this key. */
  name?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  /** Omit inside a Form to mirror its error; pass it to own the state. */
  validationState?: RadioGroupValidationState;
  /** The line under the segments, and the stand-in for `errorText`; a visible form error replaces it. */
  helpText?: string;
  /** The line while `validationState` is `error`. */
  errorText?: string;
  /** Names the control when there is no visible `label`. */
  accessibilityLabel?: string;
  testID?: string;
  class?: string;
  /** The SegmentedControlItems. */
  children: Snippet;
}

/** One segment: a Radio whose label may start with an icon. */
export interface SegmentedControlItemProps {
  /** What the control's `value` becomes when this segment is picked. */
  value: string;
  /** An icon before the label; alone, it is the label and needs a name. */
  leading?: IconSource;
  isDisabled?: boolean;
  /** Names an icon-only segment. */
  accessibilityLabel?: string;
  /** Lands on the radio input, the element tests click. */
  testID?: string;
  class?: string;
  /** The label text. */
  children?: Snippet;
}
