import type { Snippet } from 'svelte';
import type { PopupItemClasses } from '../shared/popup-list';
import type { OptionListValidationState } from '../../runes/option-list/list.svelte';
import type { OptionState } from '../../runes/option-list/context';

export type { OptionListValidationState, OptionState };

/** The parts of one row; the OptionItem owns the row, its props or `children` its content. */
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
   * The native input: visually hidden, never removed — semantics, keys and
   * the form stay native; the row's picked state shows the pick.
   */
  control: Record<'radio' | 'checkbox', string>;
  /** Applied to the control while the list is invalid. */
  invalid: string;
  content: string;
  /**
   * An action row's button (`selectionType="none"`), beside `row`: what a
   * button needs to look like the row — full width, start-aligned, the
   * font and fill the look gives. @default 'w-full text-start'
   */
  action?: string;
}

/** The parts OptionList reads its classes by. */
export interface OptionListClasses extends OptionRowClasses {
  root: string;
  /** Applied to the root while the list is disabled. */
  disabled: string;
  /** The box the rows sit in. */
  options: string;
  /**
   * VirtualOptionList: the root gets a bounded height from the caller's `class`
   * and lays out as a column; the viewport scrolls and carries the frame,
   * so it does not scroll away; the rows' box inside it goes frameless.
   */
  virtual: { root: string; viewport: string; options: string };
  /** The sections: OptionListSection's, and VirtualOptionList's `sections`. */
  section?: OptionSectionClasses;
  /**
   * The parts of a row's content (ActionListItem's: leading, title,
   * subtitle, suffix, trailing), so a row drawn inside the list matches
   * the look. @default the menu's row parts
   */
  item?: PopupItemClasses;
}

/** The parts of a section, in a plain list and in a virtual one. */
export interface OptionSectionClasses {
  /** OptionListSection: the labelled group. */
  root: string;
  /** Before the heading: a hairline, or nothing. */
  separator: string;
  title: string;
  /** Holds the section's rows. */
  box: string;
  /**
   * VirtualOptionList: the heading, a row of its own — `first` atop the
   * list, `rest` after a section — and the frame around each option row, by
   * its place in its section. Rows are measured one by one, so no element
   * may hold a section's rows: a boxed look draws its box per row.
   */
  virtual: {
    title: Record<'first' | 'rest', string>;
    rowFrame: Record<'only' | 'first' | 'middle' | 'last', string>;
  };
}

/** What a look may depend on besides its props: the list's own state. */
export interface OptionListLookState {
  /** The rows sit in sections. */
  hasSections: boolean;
}

/**
 * OptionList's `classes`: a whole class map, or one per state — a boxed look
 * draws one box, or one per section.
 */
export type OptionListClassesProp =
  | OptionListClasses
  | ((state: OptionListLookState) => OptionListClasses);

/** Style props in, the parts out. */
export type OptionListStyleResolver<P> = (props: P) => OptionListClasses;

/** One titled section of a VirtualOptionList's items. */
export interface OptionSection<T> {
  /** Identifies the section; keys its heading row. */
  key: string;
  /** The heading over the section's items. */
  title: string;
  items: readonly T[];
}

/** What an OptionList hands its OptionItems. */
export interface OptionListShared {
  classes: OptionListClasses;
  /** The list's test id: each item's control gets `${testID}-${index}`. */
  testID?: string;
  /** Inside an anchored menu (Modal `variant="menu"`): the rows are `menuitem`s. */
  rowRole?: 'menuitem';
}

/** The usual content of a row: what OptionItem lays out when it has no `children`. */
export interface OptionItemContentProps {
  title?: string;
  description?: string;
  leading?: string | Snippet;
  trailing?: string | Snippet;
}

/** The parts of an OptionItem's usual content. */
export interface OptionItemClasses {
  root: string;
  leading: string;
  text: string;
  title: string;
  description: string;
  trailing: string;
}

/** No style axes: one look of its own; any other comes in as `classes`. */
export const OPTION_LIST_AXES = {} as const;

/** OptionList has no style props: its look is `resolveOptionList()`, or `classes`. */
export type OptionListStyleProps = Record<never, never>;

// Semantic tokens only — merchant theming reaches every class through the
// CSS-var seam. The look is keyed on the pick state: the background lives
// in the state, never in `row` — `cx` resolves no conflicts, so a picked
// tint next to a base fill would lose.
//
// OptionList's own look: divided rows in one box. Blade's ActionList item
// colours (blade-core ActionList/actionList.module.css):
// `interactive.background.gray.default` on hover, `…faded-highlighted` when
// selected (hovered too), no pressed fill. The native control is always
// visually hidden: the row's picked state is the indicator.
const SECTION_TITLE =
  'px-4 pt-3 pb-2 font-sans font-medium text-75 leading-75 tracking-50 text-surface-gray-muted bg-surface-gray-intense';

export const resolveOptionList: OptionListStyleResolver<OptionListStyleProps> = () => ({
  root: 'flex w-full flex-col',
  disabled: 'opacity-blade-600',
  options:
    'flex flex-col [&>*+*]:border-t-thin [&>*+*]:border-solid [&>*+*]:border-surface-gray-muted overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted',
  virtual: {
    root: 'min-h-0',
    viewport: 'min-h-0 flex-1 rounded-small border-thin border-solid border-surface-gray-muted',
    // Every row carries its own top line — not `[&>*+*]:`, which skips the
    // first child: a mounted row's height would then depend on its place
    // in the slice, and each shift of the slice would re-measure it. The
    // content pulls up a pixel so the first row's line hides under the box's.
    options: 'flex flex-col -mt-px *:border-t-thin *:border-solid *:border-surface-gray-muted',
  },
  // `relative`: the hidden control is absolutely positioned, and it must sit
  // in its own row — else focusing it scrolls whatever ancestor it lands in.
  // The box clips to its radius: the end rows round with it (its radius
  // less the border), or the inset active ring is cut at the corners.
  row:
    'relative flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors first:[border-top-left-radius:7px] first:[border-top-right-radius:7px] last:[border-bottom-left-radius:7px] last:[border-bottom-right-radius:7px]',
  rowState: {
    picked: 'bg-interactive-gray-faded-highlighted font-medium text-interactive-gray-normal',
    unpicked:
      'bg-surface-gray-intense text-interactive-gray-normal hover:bg-interactive-gray-default',
  },
  // The box clips the rows, so the ring sits inside.
  rowActive: 'shadow-focus-inset',
  rowDisabled: 'pointer-events-none opacity-blade-600',
  control: { radio: 'sr-only', checkbox: 'sr-only' },
  invalid: 'outline-solid outline-thin outline-interactive-negative-default',
  content: 'min-w-0 flex-1',
  // A VirtualOptionList's sections in the one box: a muted heading band
  // over each section's rows, on the box's hairlines.
  // Sections in the one box: a muted heading over each section's rows, on
  // the box's hairlines.
  section: {
    root: 'flex flex-col',
    separator: 'hidden',
    title: SECTION_TITLE,
    box:
      'flex flex-col border-t-thin border-solid border-surface-gray-muted [&>*+*]:border-t-thin [&>*+*]:border-solid [&>*+*]:border-surface-gray-muted',
    virtual: {
      title: { first: SECTION_TITLE, rest: SECTION_TITLE },
      rowFrame: { only: '', first: '', middle: '', last: '' },
    },
  },
});

/** One look: the row decides the colours, the content only lays out. */
export function resolveOptionItem(): OptionItemClasses {
  return {
    root: 'flex w-full min-w-0 items-center gap-3',
    // Blade's ActionList item: the leading icon is
    // `interactive.icon.gray.normal` — the row's text colour, so it inherits.
    leading: 'flex shrink-0 items-center',
    text: 'flex min-w-0 flex-1 flex-col',
    // No colour of its own: the row's pick state colours the title.
    title: 'truncate text-100 leading-100',
    description: 'text-75 leading-50 text-interactive-gray-muted',
    trailing: 'flex shrink-0 items-center text-75 leading-50 text-interactive-gray-muted',
  };
}
