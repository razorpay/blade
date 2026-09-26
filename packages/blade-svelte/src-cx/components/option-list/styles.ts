import type { Component, Snippet } from 'svelte';
import type {
  OptionListValidationState,
  OptionState,
} from '../../runes/option-list/list.svelte';
import type { AxisValue } from '../../axes';
import { FIELD_HINT, FIELD_HINT_TONE, FIELD_LABEL } from '../shared/field';

export type { OptionListValidationState, OptionState };

/** The parts of one row; the list owns the row, the `item` snippet its content. */
export interface OptionRowClasses {
  /** The label around the control and the content. */
  row: string;
  /**
   * Applied to the row per pick state — toggled from JS and keyed on both
   * states: `cx` resolves no conflicts, and native has no `peer-checked:`.
   */
  rowState: Record<'picked' | 'unpicked', string>;
  /**
   * Applied to the row the keyboard is on — toggled from JS, only while
   * the keyboard is what moved it: `:focus-visible` on the row would need
   * `:has()`, and a mouse click should not draw a ring.
   */
  rowActive: string;
  rowDisabled: string;
  /**
   * The native input, which is also the indicator: shown at an edge or
   * hidden visually, never removed.
   */
  control: Record<'radio' | 'checkbox', string>;
  /** Applied to the control while the list is invalid. */
  invalid: string;
  content: string;
}

/** The parts OptionList reads its classes by. */
export interface OptionListClasses extends OptionRowClasses {
  root: string;
  /** Applied to the root while the list is disabled. */
  disabled: string;
  /** The visible label text. */
  label: string;
  /** The box the rows sit in. */
  options: string;
  /**
   * `virtualize`: the root gets a bounded height from the caller's `class`
   * and lays out as a column; the viewport scrolls and carries the frame,
   * so it does not scroll away; the rows' box inside it goes frameless.
   */
  virtual: { root: string; viewport: string; options: string };
  /** The one line under the options. */
  hint: string;
  hintTone: Record<OptionListValidationState, string>;
}

/** Style props in, the parts out. */
export type OptionListStyleResolver<P> = (props: P) => OptionListClasses;

/** The usual content of a row; `OptionListItem` types itself by this. */
export interface OptionListItemBehaviourProps {
  title: string;
  description?: string;
  leading?: string | Snippet;
  trailing?: string | Snippet;
  testID?: string;
  class?: string;
}

export type OptionListItemComponent<P> = Component<
  OptionListItemBehaviourProps & P
>;

/** The blade taxonomy as data. */
export const OPTION_LIST_AXES = {
  variant: ['plain', 'card'],
  indicator: ['none', 'leading', 'trailing'],
} as const;

type Axis<K extends keyof typeof OPTION_LIST_AXES> = AxisValue<
  typeof OPTION_LIST_AXES,
  K
>;

/** Derived from OPTION_LIST_AXES: add a value there, never here. */
export interface OptionListStyleProps {
  /** `plain`: divided rows in one box. `card`: each row its own bordered card. */
  variant?: Axis<'variant'>;
  /**
   * Where the native radio or checkbox shows. `none` hides it visually —
   * the picked row carries the look — but it stays for keys and semantics.
   */
  indicator?: Axis<'indicator'>;
}

// Semantic tokens only — merchant theming reaches every class through the
// CSS-var seam. One row look per variant, keyed on the pick state: the
// background lives in the state, never in `row` — `cx` resolves no
// conflicts, so a picked tint next to a base fill would lose.
const VARIANT: Record<
  Axis<'variant'>,
  {
    options: string;
    virtualViewport: string;
    virtualOptions: string;
    row: string;
    picked: string;
    unpicked: string;
    /** Blade's 4px focus ring, per variant. */
    active: string;
  }
> = {
  plain: {
    options:
      'flex flex-col [&>*+*]:border-t-thin [&>*+*]:border-solid [&>*+*]:border-surface-gray-muted overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted',
    virtualViewport: 'rounded-small border-thin border-solid border-surface-gray-muted',
    // Every row carries its own top line — not `[&>*+*]:`, which skips the
    // first child: a mounted row's height would then depend on its place
    // in the slice, and each shift of the slice would re-measure it. The
    // content pulls up a pixel so the first row's line hides under the box's.
    virtualOptions:
      'flex flex-col -mt-px *:border-t-thin *:border-solid *:border-surface-gray-muted',
    // The box clips to its radius: the end rows round with it (its radius
    // less the border), or the inset active ring is cut at the corners.
    row: 'first:[border-top-left-radius:7px] first:[border-top-right-radius:7px] last:[border-bottom-left-radius:7px] last:[border-bottom-right-radius:7px]',
    // Blade's ActionList item (blade-core ActionList/actionList.module.css):
    // `interactive.background.gray.default` on hover, `…faded-highlighted`
    // when selected (hovered too), no pressed fill.
    picked: 'bg-interactive-gray-faded-highlighted font-medium text-interactive-gray-normal',
    unpicked:
      'bg-surface-gray-intense text-interactive-gray-normal hover:bg-interactive-gray-default',
    // The box clips the rows, so the ring sits inside.
    active: 'shadow-focus-inset',
  },
  card: {
    options: 'flex flex-col gap-2',
    virtualViewport: '',
    virtualOptions: 'flex flex-col gap-2',
    row: 'rounded-small border-thin border-solid',
    // Blade's Card (blade-core Card/card.module.css): the surface's
    // `interactive.border.gray.disabled` rim at rest, a
    // `surface.border.primary.normal` border when selected, no hover or
    // pressed colour.
    picked: 'border-surface-primary-normal bg-surface-gray-intense font-medium text-interactive-gray-normal',
    unpicked: 'border-interactive-gray-disabled bg-surface-gray-intense text-interactive-gray-normal',
    active: 'shadow-focus',
  },
};

// The native control takes Blade's checked fill
// (`interactive.background.primary.default`) through `accent-color`.
const INDICATOR: Record<Axis<'indicator'>, string> = {
  none: 'sr-only',
  leading:
    'order-first w-4 h-4 shrink-0 cursor-pointer accent-interactive-primary-default',
  trailing:
    'order-last w-4 h-4 shrink-0 cursor-pointer accent-interactive-primary-default',
};

export const resolveOptionList: OptionListStyleResolver<
  OptionListStyleProps
> = (props: OptionListStyleProps = {}) => {
  const { variant = 'plain', indicator = 'none' } = props;
  const look = VARIANT[variant];
  return {
    root: 'flex w-full flex-col gap-2',
    disabled: 'opacity-600',
    label: FIELD_LABEL,
    options: look.options,
    virtual: {
      root: 'min-h-0',
      viewport: `min-h-0 flex-1 ${look.virtualViewport}`,
      options: look.virtualOptions,
    },
    // `relative`: the hidden control is absolutely positioned, and it must sit
    // in its own row — else focusing it scrolls whatever ancestor it lands in.
    row: `relative flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors ${look.row}`,
    rowState: { picked: look.picked, unpicked: look.unpicked },
    rowActive: look.active,
    rowDisabled: 'pointer-events-none opacity-600',
    control: { radio: INDICATOR[indicator], checkbox: INDICATOR[indicator] },
    invalid: 'outline-solid outline-thin outline-interactive-negative-default',
    content: 'min-w-0 flex-1',
    hint: FIELD_HINT,
    hintTone: FIELD_HINT_TONE,
  };
};
