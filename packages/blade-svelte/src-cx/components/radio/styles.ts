import type { RadioGroupPick, RadioGroupValidationState } from '../../runes/radio/group.svelte';
import type { AxisValue } from '../../axes';

export type { RadioGroupPick, RadioGroupValidationState };

/** The parts of one Radio; resolved by the group, so its look is decided once. */
export interface RadioClasses {
  /** The label wrapping the control and its text; caller `class` lands here. */
  row: string;
  /** Applied to the row while this radio or its group is disabled. */
  disabled: string;
  /**
   * Applied to the row per pick state — toggled from JS, keyed on both
   * states: a look that restyles the row (a segment) cannot rely on
   * `peer-checked:` reaching native, and `cx` resolves no conflicts.
   */
  pick: Record<'picked' | 'unpicked', string>;
  /** The input element: semantics and keys only, the indicator is the visual. */
  control: string;
  label: string;
  /** Under the row, lined up with the label: the Radio's `helpText`. */
  support?: string;
  supportText?: string;
  /** A glyph's size inside the label (a segment's `leading`). */
  iconSize?: 'medium' | 'large';
  /**
   * The drawn control: a circle and its always-mounted dot, keyed from JS
   * like `pick`. Absent when the row itself is the visual (a segment).
   */
  indicator?: {
    root: string;
    /** Keyed on both axes: `cx` resolves no conflicts. */
    look: Record<'default' | 'invalid', Record<'picked' | 'unpicked', string>>;
    dot: Record<'picked' | 'unpicked', string>;
  };
}

/**
 * RadioGroup's parts. One resolver serves both components: the group hands
 * `radio` to its Radios by context, so a Radio has no style props of its own.
 */
export interface RadioGroupClasses {
  root: string;
  /** Applied to the root while the group is disabled. */
  disabled: string;
  /** The box the Radios sit in. */
  options: string;
  radio: RadioClasses;
  /** The FieldLabel's and FieldHint's size. */
  fieldSize?: 'small' | 'medium' | 'large';
  /**
   * One shape drawn in `options` under the rows, sliding to the pick: the
   * group sets `--segment-index`/`--segment-count` on it from its pick, so
   * the look sizes and moves it with those alone (SegmentedControl's thumb).
   * Absent for plain radios, so nothing is drawn.
   */
  thumb?: string;
}

/** Style props in, the parts out. */
export type RadioGroupStyleResolver<P> = (props: P) => RadioGroupClasses;

/**
 * Library-internal seam. A spelling of RadioGroup (SegmentedControl) hands
 * the group its resolver instead of style props: not an axis, no public
 * grammar, no explorer control. The exported looks (`segmentedLook`) are
 * the sanctioned values, and the group imports nothing of them.
 */
export interface RadioGroupLookProp {
  look?: RadioGroupStyleResolver<RadioGroupStyleProps>;
}

/** The blade taxonomy as data. */
export const RADIO_GROUP_AXES = {
  orientation: ['vertical', 'horizontal'],
  size: ['small', 'medium', 'large'],
} as const;

type Axis<K extends keyof typeof RADIO_GROUP_AXES> = AxisValue<typeof RADIO_GROUP_AXES, K>;

/** Derived from RADIO_GROUP_AXES: add an axis value there, never here. */
export interface RadioGroupStyleProps {
  /** @default 'vertical' */
  orientation?: Axis<'orientation'>;
  /** Every Radio's size, and the label's and hint's. @default 'medium' */
  size?: Axis<'size'>;
}

// Semantic tokens only — merchant theming reaches every class through the
// CSS-var seam.
// Blade's RadioGroup (radioTokens.ts `group.gap`): the same gap between
// radios either way — 4, 8 or 12px by size. Horizontal rows wrap: a phone
// is narrower than Blade's `nowrap` default assumes.
const ORIENTATION: Record<Axis<'orientation'>, string> = {
  vertical: 'flex-col',
  horizontal: 'flex-row flex-wrap',
};
const GAP: Record<Axis<'size'>, string> = {
  small: 'gap-1',
  medium: 'gap-2',
  large: 'gap-3',
};

// Per size, as Checkbox (Blade DSL's Radio in Figma; Blade's SelectorTitle,
// SelectorSupportText and radioTokens.ts `icon`): the circle in its 2px
// margin, its dot (4, 6 or 8px), the title's type, the help text's indent
// (the circle plus 8px) and caption. At small the circle sits 3px from the
// top (2px elsewhere): with the margin it spans the 17px title line, which
// puts it where Figma's 1px-padded container does.
const SIZE: Record<
  Axis<'size'>,
  { circle: string; dot: string; title: string; indent: string; caption: string }
> = {
  small: {
    circle: 'w-3 h-3 mx-0.5 mb-0.5 [margin-top:3px]',
    dot: 'w-1 h-1',
    title: 'text-75 leading-75 tracking-50',
    indent: 'ml-5',
    caption: 'text-50 leading-50',
  },
  medium: {
    circle: 'w-4 h-4 m-0.5',
    dot: 'w-1.5 h-1.5',
    title: 'text-100 leading-100 tracking-50',
    indent: 'ml-6',
    caption: 'text-50 leading-50',
  },
  large: {
    circle: 'w-5 h-5 m-0.5',
    dot: 'w-2 h-2',
    title: 'text-200 leading-200 tracking-25',
    indent: 'ml-7',
    caption: 'text-100 leading-50',
  },
};

// Blade's RadioIcon (blade-core Radio/radio.module.css): a 16px circle with
// a 1.5px border and a 6px dot. Colours per variant × checked, as Checkbox:
// picked `interactive.background.primary.default` with the
// `interactive.border.primary.default` border; on hover fill and border both
// `interactive.background.primary.highlighted` (a transparent border over the
// highlighted fill here). Unpicked `interactive.border.gray.highlighted`,
// `interactive.background.gray.faded` on hover. Negative
// `interactive.*.negative.default`. Disabled wins: picked
// `interactive.background.primary.disabled`, no border; unpicked
// `interactive.border.gray.disabled`. The dot is
// `interactive.icon.on-primary.normal`. The hidden input is the `peer`, so
// hovering the label (which hovers the labelled control) and keyboard focus
// restyle the circle. Colours move at Blade's xquick/exit, hover in at
// 2xquick/standard. The dot stays mounted: picked, it scales in at
// xquick/entrance; unpicked, it only fades at xquick/exit and snaps small
// once invisible — its size holds while it leaves.
const PICKED_DISABLED =
  'peer-disabled:bg-interactive-primary-disabled peer-disabled:border-transparent';
const UNPICKED_DISABLED = 'peer-disabled:border-interactive-gray-disabled';
const DOT = 'rounded-max bg-current';
const INDICATOR = {
  root:
    'relative flex shrink-0 items-center justify-center rounded-max border-thick border-solid icon-interactive-on-primary-normal transition-colors duration-xquick ease-exit peer-hover:duration-2xquick peer-hover:ease-standard peer-focus-visible:outline-solid peer-focus-visible:outline-4 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-surface-primary-muted',
  look: {
    default: {
      picked: `border-interactive-primary-default bg-interactive-primary-default peer-hover:border-transparent peer-hover:bg-interactive-primary-highlighted ${PICKED_DISABLED}`,
      unpicked: `border-interactive-gray-highlighted bg-transparent peer-hover:bg-interactive-gray-faded ${UNPICKED_DISABLED}`,
    },
    invalid: {
      picked: `border-interactive-negative-default bg-interactive-negative-default ${PICKED_DISABLED}`,
      unpicked: `border-interactive-negative-default bg-transparent ${UNPICKED_DISABLED}`,
    },
  },
  dot: {
    picked: `${DOT} scale-100 opacity-blade-1300 [transition:opacity_160ms_cubic-bezier(0,0,0.2,1),transform_160ms_cubic-bezier(0,0,0.2,1)] motion-reduce:transition-none`,
    unpicked: `${DOT} scale-[.2] [opacity:0.1] [transition:opacity_160ms_cubic-bezier(0.17,0,1,1),transform_0s_160ms] motion-reduce:transition-none`,
  },
};

const GROUP = {
  root: 'flex flex-col',
  // Blade fades nothing: each radio takes its disabled colours.
  disabled: '',
};

export const resolveRadioGroup: RadioGroupStyleResolver<RadioGroupStyleProps> = (
  props: RadioGroupStyleProps = {},
) => {
  const { orientation = 'vertical', size = 'medium' } = props;
  const look = SIZE[size];
  const sized = (dot: string): string => `${dot} ${look.dot}`;
  return {
    ...GROUP,
    options: `flex ${ORIENTATION[orientation]} ${GAP[size]}`,
    fieldSize: size,
    radio: {
      // `relative`: the hidden control is absolutely positioned, and it must sit
      // in its own row — else focusing it scrolls whatever ancestor it lands in.
      // Blade's SelectorLabel: 2px above and below each radio.
      row: 'relative my-0.5 flex cursor-pointer flex-wrap items-center',
      pick: { picked: '', unpicked: '' },
      disabled: 'pointer-events-none',
      control: 'peer sr-only',
      // Blade's SelectorTitle: `surface.text.gray.subtle`, disabled greyed.
      label: `ml-1 font-blade-text font-blade-regular text-surface-gray-subtle peer-disabled:text-surface-gray-disabled ${look.title}`,
      // A full-width line under the row, so the row wraps it below.
      support: `w-full ${look.indent}`,
      supportText: `font-blade-text font-blade-regular tracking-50 text-surface-gray-muted ${look.caption}`,
      indicator: {
        ...INDICATOR,
        root: `${INDICATOR.root} ${look.circle}`,
        dot: {
          picked: sized(INDICATOR.dot.picked),
          unpicked: sized(INDICATOR.dot.unpicked),
        },
      },
    },
  };
};
