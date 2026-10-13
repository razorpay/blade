import type {
  OptionListClasses,
  OptionListLookState,
  OptionSectionClasses,
} from '../option-list/styles';
import { POPUP_ITEM, POPUP_SECTION } from '../shared/popup-list';
import type { PopupItemClasses } from '../shared/popup-list';

/** ActionList's looks: Dropdown's rows in no box, or rows divided in a card. */
export const ACTION_LIST_AXES = {
  variant: ['plain', 'card'],
} as const;

export type ActionListVariant = typeof ACTION_LIST_AXES.variant[number];

/** What the look depends on: the variant, and the list's own state. */
export interface ActionListLook extends Partial<OptionListLookState> {
  /** @default 'plain' */
  variant?: ActionListVariant;
}

// ActionList standalone, `plain`: OptionList's anatomy (a native radio or
// checkbox row) in Dropdown's look (`shared/popup-list`; Figma's _Action
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
  OptionListClasses,
  'root' | 'disabled' | 'options' | 'virtual' | 'section' | 'item'
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
  action: 'w-full text-start',
};

// `card`: the rows of a bank or method picker — divided by hairlines in a
// rounded, bordered box (OptionList's own frame), 16px in, 12px tall, the
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
  action: 'w-full text-start',
};

// Sections. `plain`: Figma's section heading inside the list, after a
// hairline in every section but the first (as in a Dropdown). `card`: the
// heading above, then the section's own box; sections 24px apart, the
// heading 12px over its box. In a virtual list the heading is a row of its
// own, and a card's box is drawn per row (rows are measured one by one, so
// no element may hold a section's rows) — the first row opens it, the last
// closes it.
const CARD_TITLE =
  'm-0 font-sans font-medium text-100 leading-100 tracking-50 text-surface-gray-muted';
const ROW_FRAME =
  'overflow-hidden border-l-thin border-r-thin border-solid border-surface-gray-muted';
const CARD_SECTION: OptionSectionClasses = {
  root: 'flex flex-col gap-3',
  separator: 'hidden',
  title: CARD_TITLE,
  box: BOX,
  virtual: {
    title: { first: `${CARD_TITLE} pb-3`, rest: `${CARD_TITLE} pb-3 pt-6` },
    rowFrame: {
      only: `${ROW_FRAME} rounded-small border-t-thin border-b-thin`,
      first: `${ROW_FRAME} rounded-tl-small rounded-tr-small border-t-thin`,
      middle: `${ROW_FRAME} border-t-thin`,
      last: `${ROW_FRAME} rounded-bl-small rounded-br-small border-t-thin border-b-thin`,
    },
  },
};
const PLAIN_SECTION: OptionSectionClasses = {
  ...POPUP_SECTION,
  box: 'flex flex-col',
  virtual: {
    title: {
      first: POPUP_SECTION.title,
      rest: `${POPUP_SECTION.title} mt-1 border-t-thin border-solid border-surface-gray-muted`,
    },
    rowFrame: { only: '', first: '', middle: '', last: '' },
  },
};

/**
 * A `card` row's parts (ActionListRow): a 24px leading box (a bank's logo),
 * and the leading, trailing and glyph centred on the title block, as a
 * picker row draws them; the rest as Dropdown's.
 */
const CARD_ITEM: PopupItemClasses = {
  ...POPUP_ITEM,
  itemLeading: 'flex w-6 h-6 shrink-0 items-center justify-center self-center',
  itemTrailing: 'flex shrink-0 items-center self-center',
  itemIcon: 'flex shrink-0 items-center self-center',
};

/**
 * ActionList's look as an OptionList class map: the rows, the box, the
 * sections and the row parts ActionListItem draws. In `card` without
 * sections the list itself is the box; with sections each section draws its
 * own. PhoneNumberInput's country picker takes the `plain` one.
 */
export function resolveActionList(look: ActionListLook = {}): OptionListClasses {
  const { variant = 'plain', hasSections = false } = look;
  const card = variant === 'card';
  return {
    root: 'flex w-full flex-col',
    disabled: 'opacity-blade-600',
    options: card && !hasSections ? BOX : card ? 'flex flex-col gap-6' : 'flex flex-col',
    // Virtual: `card` without sections boxes the viewport, its rows on
    // hairlines (each row carries its own top line, the content pulled up a
    // pixel under the box's); with sections the rows frame themselves.
    virtual:
      card && !hasSections
        ? {
            root: 'min-h-0',
            viewport:
              'min-h-0 flex-1 overflow-hidden rounded-small border-thin border-solid border-surface-gray-muted bg-surface-gray-intense',
            options:
              'flex flex-col -mt-px *:border-t-thin *:border-solid *:border-surface-gray-muted',
          }
        : { root: 'min-h-0', viewport: 'min-h-0 flex-1', options: 'flex flex-col' },
    section: card ? CARD_SECTION : PLAIN_SECTION,
    item: card ? CARD_ITEM : POPUP_ITEM,
    ...(card ? CARD_ROW : PLAIN_ROW),
  };
}

/**
 * ActionList's look for an OptionList's or VirtualOptionList's `classes`:
 * it follows the list's state (one box, or one per section).
 *
 * ```svelte
 * <VirtualOptionList classes={actionListClasses('card')} sections={…} …>
 * ```
 */
export function actionListClasses(
  variant: ActionListVariant = 'plain',
): (state: OptionListLookState) => OptionListClasses {
  return (state) => resolveActionList({ variant, ...state });
}
