import { virtualRowFrames } from '../card-group/styles';
import type {
  CardGroupClasses,
  CardGroupLookState,
  CardGroupSectionClasses,
  CardGroupVirtualClasses,
} from '../card-group/styles';
import { cx } from '../../cx';
import { POPUP_ITEM, POPUP_SECTION } from '../shared/popup-list';
import type { PopupItemClasses } from '../shared/popup-list';

/** ActionList's looks: a menu's rows in no box, or rows divided in a card. */
export const ACTION_LIST_AXES = {
  variant: ['plain', 'card'],
  inset: ['none', 'medium', 'large', 'overlay'],
} as const;

export type ActionListVariant = typeof ACTION_LIST_AXES.variant[number];
export type ActionListInset = typeof ACTION_LIST_AXES.inset[number];

/** What the look depends on: the variant, the inset, and whether the list has sections. */
interface ActionListLook extends Partial<CardGroupLookState> {
  /** @default 'plain' */
  variant?: ActionListVariant;
  /** @default 'none' */
  inset?: ActionListInset;
}

// The inset: the gutter a list keeps inside the box that scrolls it, so on a
// Modal's bare body (`padding="none"`) its scrollbar meets the panel's edge
// while its rows keep the body's padding — 16px (a sheet's), or 20px (a
// modal's on desktop). `overlay`: the overlay's own (`--overlay-gutter`,
// set per layout on its panel), so it follows a layout switch; none
// outside an overlay.
const INSET = {
  none: { sides: '', top: '', bottom: '' },
  medium: { sides: 'px-4', top: 'pt-4', bottom: 'pb-4' },
  large: { sides: 'px-5', top: 'pt-5', bottom: 'pb-5' },
  overlay: {
    sides: 'px-[var(--overlay-gutter,0px)]',
    top: 'pt-[var(--overlay-gutter,0px)]',
    bottom: 'pb-[var(--overlay-gutter,0px)]',
  },
} as const;

function rowsInset(inset: ActionListInset): string {
  const { sides, top, bottom } = INSET[inset];
  return cx(sides, top, bottom);
}

// ActionList standalone, `plain`: CardGroup's anatomy (a radio or
// checkbox row) in a menu's look (`shared/popup-list`; Figma's _Action
// List) — rows touching, in no box; each 36px, 8px in, 8px radius, its parts
// side by side 8px apart; the selected wash, `interactive.background.gray
// .default` under the pointer, Figma's 4px `interactive.border.primary
// .faded` ring from the keys. The native control is hidden: the row draws
// its pick (the wash, or ActionListRow's checkbox), and ActionListRow draws
// a disabled row in Figma's `…disabled` tokens. A negative row
// (`data-intent`) is red with a red wash.
const ROW_PICKED =
  'bg-interactive-gray-faded-highlighted text-interactive-gray-normal data-[intent=negative]:bg-interactive-negative-faded-highlighted data-[intent=negative]:text-interactive-negative-normal';
const ROW_UNPICKED =
  'text-interactive-gray-normal hover:bg-interactive-gray-default data-[intent=negative]:text-interactive-negative-normal data-[intent=negative]:hover:bg-interactive-negative-faded';

const PLAIN_ROW: Omit<
  CardGroupClasses,
  'root' | 'disabled' | 'options' | 'section' | 'item' | 'virtual'
> = {
  // `relative`: the hidden control is absolutely positioned inside its row.
  row:
    'relative flex cursor-pointer items-center gap-2 p-2 rounded-small font-sans text-100 leading-100 tracking-50 whitespace-nowrap select-none transition-colors',
  rowState: { picked: ROW_PICKED, unpicked: `bg-transparent ${ROW_UNPICKED}` },
  rowActive: 'outline-solid outline-4 outline-offset-1 outline-interactive-primary-faded',
  rowDisabled: 'pointer-events-none',
  control: { radio: 'sr-only', checkbox: 'sr-only' },
  invalid: 'outline-solid outline-thin outline-interactive-negative-default',
  content: 'flex min-w-0 flex-1 flex-row items-center gap-2',
  button: 'w-full text-start',
};

// `card`: the rows of a bank or method picker — divided by hairlines in a
// rounded, bordered box (CardGroup's own frame), 16px in, 12px tall, the
// parts 12px apart. Measured from checkout's bank list; to be checked
// against Figma. The row's fill is its own, so the box's corners clip it.
const BOX =
  'flex flex-col overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted bg-surface-gray-intense [&>*+*]:border-t-thin [&>*+*]:border-solid [&>*+*]:border-surface-gray-muted';
const CARD_ROW: typeof PLAIN_ROW = {
  row:
    'relative flex cursor-pointer items-center gap-3 px-4 py-3 font-sans text-100 leading-100 tracking-50 select-none transition-colors no-underline',
  rowState: {
    picked: ROW_PICKED,
    unpicked: `bg-surface-gray-intense ${ROW_UNPICKED}`,
  },
  // The box clips the rows, so the ring sits inside.
  rowActive: 'shadow-focus-inset',
  rowDisabled: 'pointer-events-none',
  control: { radio: 'sr-only', checkbox: 'sr-only' },
  invalid: 'outline-solid outline-thin outline-interactive-negative-default',
  content: 'flex min-w-0 flex-1 flex-row items-center gap-3',
  button: 'w-full text-start',
};

// Sections. `plain`: Figma's section heading inside the list, after a
// hairline in every section but the first (as in a menu). `card`: the
// heading above, then the section's own box; sections 24px apart, the
// heading 12px over its box.
const CARD_TITLE =
  'm-0 font-sans font-medium text-100 leading-100 tracking-50 text-surface-gray-muted';
const CARD_SECTION: CardGroupSectionClasses = {
  root: 'flex flex-col gap-3',
  separator: 'hidden',
  title: CARD_TITLE,
  box: BOX,
};
const PLAIN_SECTION: CardGroupSectionClasses = {
  ...POPUP_SECTION,
  box: 'flex flex-col',
};

// Virtualized, the rows are measured one by one, so no element holds a
// section's rows. `card`: without sections the viewport is the box and
// every row carries its own top line; with sections each row draws its
// share of its section's box. `plain`: the gutter moves onto the viewport,
// and a section's heading is a row after a hairline.
const CARD_FRAME =
  'overflow-hidden border-l-thin border-r-thin border-solid border-surface-gray-muted';
const PLAIN_TITLE = POPUP_SECTION.title;
const NO_FRAME = { only: '', first: '', middle: '', last: '' };

function virtualLook(card: boolean, hasSections: boolean, gutter: string): CardGroupVirtualClasses {
  const base = { root: 'min-h-0', options: 'flex min-h-0 flex-1 flex-col' };
  if (card) {
    return {
      ...base,
      viewport: hasSections
        ? 'min-h-0 flex-1'
        : 'min-h-0 flex-1 overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted bg-surface-gray-intense',
      rows: hasSections
        ? 'flex flex-col'
        : 'flex flex-col -mt-px *:border-t-thin *:border-solid *:border-surface-gray-muted',
      title: { first: `${CARD_TITLE} pb-3`, rest: `${CARD_TITLE} pb-3 pt-6` },
      rowFrame: virtualRowFrames(CARD_FRAME, 'small'),
    };
  }
  return {
    ...base,
    viewport: cx('min-h-0 flex-1', gutter),
    rows: 'flex flex-col',
    title: {
      first: PLAIN_TITLE,
      rest: cx(PLAIN_TITLE, 'mt-1 border-t-thin border-solid border-surface-gray-muted'),
    },
    rowFrame: NO_FRAME,
  };
}

/**
 * A `card` row's parts (ActionListRow): a 24px leading box (a bank's logo),
 * and the leading, trailing and glyph centred on the title block, as a
 * picker row draws them; the rest as a menu's.
 */
const CARD_ITEM: PopupItemClasses = {
  ...POPUP_ITEM,
  itemLeading: 'flex w-6 h-6 shrink-0 items-center justify-center self-center',
  itemTrailing: 'flex shrink-0 items-center self-center',
  itemIcon: 'flex shrink-0 items-center self-center',
};

/**
 * ActionList's look as a CardGroup class map: the rows, the box, the
 * sections and the row parts ActionListItem draws. In `card` without
 * sections the list itself is the box; with sections each section draws its
 * own. PhoneNumberInput's country picker takes the `plain` one.
 */
export function resolveActionList(look: ActionListLook = {}): CardGroupClasses {
  const { variant = 'plain', hasSections = false, inset = 'none' } = look;
  const card = variant === 'card';
  // A plain list's gutter goes inside the rows; a card's around its boxes,
  // which draw their own edges.
  const gutter = rowsInset(inset);
  const plainGutter = card ? '' : gutter;
  return {
    root: card && gutter ? `flex w-full flex-col ${gutter}` : 'flex w-full flex-col',
    disabled: 'opacity-blade-600',
    options:
      card && !hasSections
        ? BOX
        : card
        ? 'flex flex-col gap-6'
        : `flex flex-col ${plainGutter}`.trim(),
    section: card ? CARD_SECTION : PLAIN_SECTION,
    item: card ? CARD_ITEM : POPUP_ITEM,
    // A menu's link rows draw no chevron: ActionListRow has its own trailing.
    chevron: 'hidden',
    ...(card ? CARD_ROW : PLAIN_ROW),
    virtual: virtualLook(card, hasSections, plainGutter),
  };
}

/**
 * ActionList's look as a `classes` function: it follows the list's state
 * (one box, or one per section). ActionList hands it to CardGroup's base.
 */
export function actionListClasses(
  variant: ActionListVariant = 'plain',
  inset: ActionListInset = 'none',
): (state: CardGroupLookState) => CardGroupClasses {
  return (state) => resolveActionList({ variant, inset, ...state });
}
