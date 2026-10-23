import type { Snippet } from 'svelte';
import type { PopupItemClasses } from '../shared/popup-list';
import type { CardGroupValidationState } from '../../runes/card-group/list.svelte';
import type { CardGroupItemState } from '../../runes/card-group/context';
import type { CardGroupDataSection } from '../../runes/card-group/rows';

export type { CardGroupValidationState, CardGroupItemState, CardGroupDataSection };

/**
 * What CardGroup's (and ActionList's) `onChange` reports: the group's
 * `value`, shaped as `bind:value` is — the pick (or `null`) for a single
 * choice, an array for a multiple one.
 */
export type CardGroupChange<T> = { name: string | undefined; value: T | null | T[] };

/**
 * What a row's `onClick` gets, as React's ActionListItem: `name` is the
 * row's value, `value` whether the row was selected when it was pressed.
 */
export interface CardGroupItemClick<T> {
  name: T;
  value: boolean;
  event: MouseEvent | KeyboardEvent;
}

/** What CardGroup's `children` get: where the keyboard is, for a window that mounts a slice of `items`. */
export interface CardGroupView {
  /** The option the keyboard moved to, while it is driving; -1 otherwise. Reveal it: it may not be mounted. */
  readonly activeIndex: number;
  /** The option Tab enters at: the pick, else the active or first enabled one. Open a window at it. */
  readonly tabStop: number;
}

/** The parts of one row; the CardGroupItem owns the row, its props or `children` its content. */
export interface CardGroupRowClasses {
  /** The label around the control and the content. */
  row: string;
  /**
   * Applied to the row per pick state — toggled from JS and keyed on both
   * states: `cx` resolves no conflicts.
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
   * A disclosure's button (a row with `content`), beside `row`: what a
   * button needs to look like the row — full width, start-aligned, no
   * fill or border of its own. @default 'w-full text-start'
   */
  button?: string;
  /**
   * A link row's or a disclosure trigger's focus, beside `row`: they are
   * tab stops of their own, not the list's roving one, so `:focus-visible`
   * draws it. @default '' (the browser's outline)
   */
  rowFocusVisible?: string;
  /**
   * Around a link row's chevron and a trigger's; `hidden` drops it (a menu's
   * link rows have none). @default the built-in look's
   */
  chevron?: string;
}

/** The parts CardGroup reads its classes by. */
export interface CardGroupClasses extends CardGroupRowClasses {
  root: string;
  /** Applied to the root while the list is disabled. */
  disabled: string;
  /** The box the rows sit in. */
  options: string;
  /** The sections: CardGroupSection's. */
  section?: CardGroupSectionClasses;
  /**
   * The parts of a row's content (ActionListItem's: leading, title,
   * subtitle, suffix, trailing), so a row drawn inside the list matches
   * the look. @default the menu's row parts
   */
  item?: PopupItemClasses;
  /**
   * A CardGroupItem with `content`: the wrapper around the row and what it
   * reveals, and the revealed part, under the row. @default the built-in look's
   */
  collapsible?: { root: string; body: string };
  /** The parts a virtualized list (`isVirtualized`) draws instead. */
  virtual: CardGroupVirtualClasses;
}

/**
 * The parts of a virtualized list. Rows are measured one by one, so no
 * element may hold a section's rows: a boxed look draws its box per row,
 * the first opening it and the last closing it, and a heading is a row.
 */
export interface CardGroupVirtualClasses {
  /** Added to the root: a column the viewport fills, inside the bounded height the caller's `class` gives. */
  root: string;
  /** In place of `options`: what holds the viewport. */
  options: string;
  /** Scrolls, and carries the list's frame, so the frame does not scroll away. */
  viewport: string;
  /** The rows' box inside the viewport. */
  rows: string;
  /** A section's heading, a row of its own: atop the list, or after a section. */
  title: Record<'first' | 'rest', string>;
  /** Each row's share of its section's box, by its place in the section. */
  rowFrame: Record<'only' | 'first' | 'middle' | 'last', string>;
}

/** The parts of a section. */
export interface CardGroupSectionClasses {
  /** CardGroupSection: the labelled group. */
  root: string;
  /** Before the heading: a hairline, or nothing. */
  separator: string;
  title: string;
  /** Holds the section's rows. */
  box: string;
}

/** What a look may depend on besides its props: the list's own state. */
export interface CardGroupLookState {
  /** The rows sit in sections. */
  hasSections: boolean;
}

/**
 * CardGroup's `classes`: a whole class map, or one per state — a boxed look
 * draws one box, or one per section.
 */
export type CardGroupClassesProp =
  | CardGroupClasses
  | ((state: CardGroupLookState) => CardGroupClasses);

/** Style props in, the parts out. */
export type CardGroupStyleResolver<P> = (
  props: P,
  state?: Partial<CardGroupLookState>,
) => CardGroupClasses;

/** What a CardGroup hands its CardGroupItems. */
export interface CardGroupShared {
  classes: CardGroupClasses;
  /** The list's test id: each item's control gets `${testID}-${index}`. */
  testID?: string;
}

/** The usual content of a row: what CardGroupItem lays out when it has no `children`. */
export interface CardGroupItemContentProps {
  title?: string;
  description?: string;
  leading?: string | Snippet;
  trailing?: string | Snippet;
}

/** The parts of a CardGroupItem's usual content. */
export interface CardGroupItemClasses {
  root: string;
  leading: string;
  text: string;
  title: string;
  description: string;
  /** The description of a disabled row: `interactive.text.gray.disabled`. */
  descriptionDisabled: string;
  trailing: string;
  /** A link row's chevron (right) and a disclosure trigger's (down). */
  chevron: string;
  /** The chevron of a disabled row: `interactive.icon.gray.disabled`. */
  chevronDisabled: string;
  /** Added to the trigger's chevron while its content shows: it flips. */
  chevronExpanded: string;
}

/** No style axes: one look of its own (ActionList's is its own component). */
export const CARD_GROUP_AXES = {} as const;

/** CardGroup has no style props: its look is `resolveCardGroup()`. */
export type CardGroupStyleProps = Record<never, never>;

// Semantic tokens only — merchant theming reaches every class through the
// CSS-var seam. The look is keyed on the pick state: the background lives
// in the state, never in `row` — `cx` resolves no conflicts, so a picked
// look next to a base one would lose.
//
// CardGroup's own look: Blade DSL's Card Group — one raised surface (Card's
// `primary`, 12px corners) with the rows edge to edge, a subtle hairline
// between them. The native control is always visually hidden: a picked
// row's 1.5px primary ring is the indicator, on the plain surface.
// A section's heading sits above its own card: body medium, subtle.
const SECTION_TITLE =
  'm-0 font-sans font-normal text-100 leading-100 tracking-50 text-surface-gray-subtle';

// The surface's rim and lip are inset shadows the rows' fills cover: an
// overlay redraws them above the rows (Blade's `.cardGroup::after`).
const RIM =
  'after:content-empty after:pointer-events-none after:absolute after:inset-0 after:z-1 after:rounded-inherit after:shadow-card-group-rim';

const DIVIDED = '[&>*+*]:border-t-thin [&>*+*]:border-solid [&>*+*]:border-surface-gray-subtle';

// The end rows take the group's corners, so their inset rings curve with it
// (and a row's wrapper, around it and its body, hands them to its own end children).
const END_CORNERS =
  '[&>:first-child]:rounded-tl-medium [&>:first-child]:rounded-tr-medium [&>:last-child]:rounded-bl-medium [&>:last-child]:rounded-br-medium';
const INHERIT_CORNERS =
  '[&>:first-child]:[border-top-left-radius:inherit] [&>:first-child]:[border-top-right-radius:inherit] [&>:last-child]:[border-bottom-left-radius:inherit] [&>:last-child]:[border-bottom-right-radius:inherit]';

// The focus ring sits on the row's ::before, so it composes with a picked
// row's ring on the row itself; the row rises over the rim overlay.
const FOCUS_RING =
  'z-5 before:content-empty before:pointer-events-none before:absolute before:inset-0 before:rounded-inherit before:shadow-card-group-focus';

// The raised card the rows sit on: the group's, or each section's.
const SURFACE = `relative isolate flex flex-col overflow-hidden rounded-medium bg-surface-gray-intense surface-raised ${RIM} ${DIVIDED} ${END_CORNERS}`;

const ROW_FRAME =
  'overflow-hidden bg-surface-gray-intense border-l-thin border-r-thin border-solid border-surface-gray-subtle';

/**
 * A boxed look's virtual rows: each row draws its share of its section's
 * box — the first opens it, the last closes it, the rest a top line.
 */
export function virtualRowFrames(
  frame: string,
  radius: 'medium' | 'small',
): CardGroupVirtualClasses['rowFrame'] {
  const corners = {
    medium: {
      top: 'rounded-tl-medium rounded-tr-medium',
      bottom: 'rounded-bl-medium rounded-br-medium',
      all: 'rounded-medium',
    },
    small: {
      top: 'rounded-tl-small rounded-tr-small',
      bottom: 'rounded-bl-small rounded-br-small',
      all: 'rounded-small',
    },
  }[radius];
  return {
    only: `${frame} ${corners.all} border-t-thin border-b-thin`,
    first: `${frame} ${corners.top} border-t-thin`,
    middle: `${frame} border-t-thin`,
    last: `${frame} ${corners.bottom} border-t-thin border-b-thin`,
  };
}

// Virtualized: without sections the viewport is the card, and every row
// carries its own top line, so a mounted row's height does not depend on
// its place in the slice; with sections the rows frame themselves.
function virtualLook(hasSections: boolean): CardGroupVirtualClasses {
  return {
    root: 'min-h-0',
    options: 'flex min-h-0 flex-1 flex-col',
    viewport: hasSections
      ? 'min-h-0 flex-1'
      : `relative isolate min-h-0 flex-1 rounded-medium bg-surface-gray-intense surface-raised ${RIM}`,
    rows: hasSections
      ? 'flex flex-col'
      : 'flex flex-col -mt-px *:border-t-thin *:border-solid *:border-surface-gray-subtle',
    title: { first: `${SECTION_TITLE} pb-3`, rest: `${SECTION_TITLE} pb-3 pt-6` },
    rowFrame: virtualRowFrames(ROW_FRAME, 'medium'),
  };
}

export const resolveCardGroup: CardGroupStyleResolver<CardGroupStyleProps> = (
  _props,
  { hasSections = false } = {},
) => ({
  root: 'flex w-full flex-col',
  disabled: 'opacity-blade-600',
  // With sections, each is a card of its own under its heading, 24px apart.
  options: hasSections ? 'flex flex-col gap-6' : SURFACE,
  // `relative`: the hidden control is absolutely positioned, and it must sit
  // in its own row — else focusing it scrolls whatever ancestor it lands in.
  // Blade's row: 16px in, 8px between its parts, body medium in medium weight.
  row:
    'relative box-border flex w-full items-center gap-2 p-4 m-0 text-start no-underline font-sans font-medium text-100 leading-100 text-surface-gray-normal transition-colors',
  rowState: {
    // Picked keeps the plain surface on hover: the ring is the affordance.
    picked: 'z-5 cursor-pointer shadow-card-group-picked',
    unpicked: 'cursor-pointer hover:bg-surface-gray-moderate',
  },
  // The keyboard's row: Blade's 4px faded primary ring, inset as the group clips.
  rowActive: FOCUS_RING,
  // As Blade's disabled ActionListItem: no fade, the disabled text colour —
  // the title's here (important, over the row's own), the description's and
  // the chevron's in their disabled classes; a caller's snippet keeps its own.
  rowDisabled: 'pointer-events-none text-interactive-gray-disabled!',
  rowFocusVisible:
    'outline-none focus-visible:z-5 focus-visible:before:content-empty focus-visible:before:pointer-events-none focus-visible:before:absolute focus-visible:before:inset-0 focus-visible:before:rounded-inherit focus-visible:before:shadow-card-group-focus',
  control: { radio: 'sr-only', checkbox: 'sr-only' },
  invalid: 'outline-solid outline-thin outline-interactive-negative-default',
  content: 'min-w-0 flex-1',
  button: 'bg-transparent border-none',
  // Sections: the heading above, 12px over the section's own card.
  section: {
    root: 'flex flex-col gap-3',
    separator: 'hidden',
    title: SECTION_TITLE,
    box: SURFACE,
  },
  // The revealed content: a hairline under the trigger, 16px by 12px in, on
  // the subtle surface that sets it apart from the rows around it.
  collapsible: {
    root: `flex flex-col ${INHERIT_CORNERS}`,
    body:
      'rounded-inherit border-t-thin border-solid border-surface-gray-subtle px-3 py-4 bg-surface-gray-subtle',
  },
  virtual: virtualLook(hasSections),
});

const DESCRIPTION = 'font-normal text-75 leading-75 tracking-50';
const CHEVRON =
  'flex shrink-0 items-center transition-transform duration-moderate ease-standard motion-reduce:transition-none';

/** One look: the row decides the colours, the content only lays out. */
export function resolveCardGroupItem(): CardGroupItemClasses {
  return {
    root: 'flex w-full min-w-0 items-center gap-2',
    // Leading and trailing keep their size; the content grows and truncates
    // rather than pushing them out.
    leading: 'flex shrink-0 items-center',
    text: 'flex min-w-0 flex-1 flex-col',
    // No colour of its own: the row's colours the title.
    title: 'truncate',
    description: `${DESCRIPTION} text-surface-gray-muted`,
    descriptionDisabled: `${DESCRIPTION} text-interactive-gray-disabled`,
    trailing: 'flex shrink-0 items-center',
    chevron: `${CHEVRON} icon-surface-gray-subtle`,
    chevronDisabled: `${CHEVRON} icon-interactive-gray-disabled`,
    chevronExpanded: '-rotate-180',
  };
}
