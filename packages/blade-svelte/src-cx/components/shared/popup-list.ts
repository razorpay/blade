import { checkboxSizeParts, resolveCheckbox } from '../checkbox/styles';

// The look Menu, Dropdown and ActionList share, per Blade DSL (Figma): Menu
// and _Menu Item for Menu; Dropdown, _Action List and _Action List Item for
// Dropdown and ActionList. Both panels are 240 to 400px wide, 8px from the
// trigger, on the popup surface (Figma's _components/Popup: the medium blur,
// the 1px rim drawn inside over the raised shadow): Menu's 12px round with
// its rows 2px apart, Dropdown's 16px round with none between; 8px round
// the rows in both. A row is the same in both: 36px, 8px radius, 8px
// padding; the leading item (a 16px glyph, or a 20px asset or avatar), the
// title (Body/Medium 14/20) with its suffix and an optional description
// (Body/Small 12/17), and the trailing item, each 8px apart. Transparent at
// rest; `interactive.background.gray.default` while active (under the
// pointer, or the keyboard's row, which also takes Figma's 4px
// `interactive.border.primary.faded` ring); a negative row (a destructive
// action) has a red wash. Text, icons and descriptions take Figma's
// `interactive.text.*` / `interactive.icon.*` tokens, `…disabled` when
// disabled. The panel opens sliding 8px down as it fades in, over `quick`.

const SURFACE =
  'pointer-events-auto absolute z-50 flex min-w-[240px] max-w-[400px] flex-col bg-popup-gray-moderate text-surface-gray-normal shadow-dropdown backdrop-blur-medium outline-none transition-all duration-quick ease-entrance data-[state=closed]:-translate-y-2 data-[state=closed]:opacity-0 motion-reduce:transition-none';

/** Menu's panel: Figma's Menu, 12px round. */
export const MENU_SURFACE = `${SURFACE} rounded-medium`;

/** The box a Dropdown's parts sit in: Figma's Dropdown, 16px round. */
export const DROPDOWN_SURFACE = `${SURFACE} rounded-large`;

/** Menu's rows: 8px round them (Figma's body and item insets), 2px between. */
export const MENU_ROWS = 'flex flex-col gap-0.5 p-2 outline-none';

/** An action list's rows (Dropdown's, ActionList's): 8px round them (Figma's body and list insets), none between. */
export const ACTION_LIST_ROWS = 'flex flex-col p-2 outline-none';

/** Distance from the trigger, in px. */
export const POPUP_GAP = 8;

export type PopupItemIntent = 'none' | 'negative';

/** A row's parts, shared by MenuItem and DropdownItem. */
export interface PopupItemClasses {
  item: string;
  /** Per state: enabled rows answer `data-active`; disabled ones never become active. */
  itemState: Record<'enabled' | 'disabled', string>;
  /** Text colour and active fill per intent (enabled rows only). */
  itemIntent: Record<PopupItemIntent, string>;
  /** The title and its description, stacked. */
  itemBody: string;
  /** The item's title: one line. */
  itemTitle: string;
  /** The title and its suffix (a Badge), 8px apart. */
  itemTitleRow: string;
  /** A disabled row's title (and body): the row's text colour, `…disabled`. */
  itemBodyDisabled: string;
  /** Under the title: muted (`…disabled` when disabled), may wrap. */
  itemDescription: Record<'enabled' | 'disabled', string>;
  /** A leading glyph's box: 16px on the title's 20px line. */
  itemIcon: string;
  /** The glyph's colour: Figma's item icon per intent, `…disabled` when disabled. */
  itemIconTone: Record<PopupItemIntent | 'disabled', string>;
  /** A leading asset or avatar's 20px box. */
  itemLeading: string;
  /** Beside the title: a Badge. */
  itemTitleSuffix: string;
  /** After the title: a glyph (a check, a chevron) or shortcut text, 8px clear of it. */
  itemTrailing: string;
}

export const POPUP_ITEM: PopupItemClasses = {
  item:
    'flex w-full flex-row items-center gap-2 rounded-small border-none bg-transparent p-2 text-left font-sans text-100 leading-100 tracking-50 whitespace-nowrap outline-none select-none',
  itemState: {
    enabled:
      'cursor-pointer data-[active=keyboard]:outline-solid data-[active=keyboard]:outline-4 data-[active=keyboard]:outline-offset-1 data-[active=keyboard]:outline-interactive-primary-faded',
    disabled: 'cursor-not-allowed text-interactive-gray-disabled',
  },
  itemIntent: {
    none: 'text-interactive-gray-normal data-[active]:bg-interactive-gray-default',
    negative: 'text-interactive-negative-normal data-[active]:bg-interactive-negative-faded',
  },
  itemBody: 'flex min-w-0 flex-1 flex-col gap-0.5',
  itemTitle: 'min-w-0 flex-1 truncate',
  itemTitleRow: 'flex min-w-0 flex-1 items-center gap-2',
  itemBodyDisabled: 'text-interactive-gray-disabled',
  itemDescription: {
    enabled: 'whitespace-normal text-75 leading-75 tracking-50 text-interactive-gray-muted',
    disabled: 'whitespace-normal text-75 leading-75 tracking-50 text-interactive-gray-disabled',
  },
  itemTitleSuffix: 'flex shrink-0 items-center',
  itemLeading: 'flex w-5 h-5 shrink-0 items-center justify-center self-start',
  itemTrailing: 'flex h-5 shrink-0 items-center self-start',
  itemIcon: 'flex h-5 shrink-0 items-center self-start',
  itemIconTone: {
    none: 'icon-interactive-gray-normal',
    negative: 'icon-feedback-negative-intense',
    disabled: 'icon-interactive-gray-disabled',
  },
};

/**
 * Blade DSL's _Dropdown Header: 16px in all round, 16px from the title to the
 * search, Body/Large Semibold title and Body/Small muted subtitle, Figma's
 * divider under it.
 */
export const POPUP_HEADER = {
  root:
    'flex flex-col gap-4 p-4 border-b-thin border-x-none border-t-none border-solid border-surface-gray-muted',
  titleRow: 'flex min-w-0 flex-row items-start gap-2',
  title:
    'm-0 min-w-0 flex-1 truncate font-sans font-semibold text-200 leading-200 tracking-25 text-surface-gray-normal',
  subtitle: 'm-0 font-sans text-75 leading-75 tracking-50 text-surface-gray-muted',
} as const;

/** Blade DSL's _Dropdown Menu/ Footer: Figma's divider over it, then 16px in all round, 16px between actions. */
export const POPUP_FOOTER =
  'flex flex-row items-center justify-end gap-4 p-4 border-t-thin border-x-none border-b-none border-solid border-surface-gray-muted';

const CHECK = resolveCheckbox({ size: 'medium' }).indicator;

/** A multiple-choice row's leading checkbox: Checkbox's own box, drawn (the row is the control). */
export const POPUP_CHECK = {
  box: `${CHECK.root} w-4 h-4 m-0.5 border-thick ${checkboxSizeParts('medium').tickNudge}`,
  look: CHECK.look.default,
  /** A disabled row's box, as Checkbox's disabled one (the row has no input to key it from). */
  lookDisabled: {
    checked:
      'border-transparent bg-interactive-primary-disabled icon-interactive-static-white-disabled',
    unchecked: 'border-interactive-gray-disabled bg-transparent',
  },
  mark: {
    shown: `${CHECK.mark.shown} ${checkboxSizeParts('medium').mark}`,
    hidden: `${CHECK.mark.hidden} ${checkboxSizeParts('medium').mark}`,
  },
} as const;

/** A single pick's row: Figma's darker wash, kept under the pointer and the keys. */
export const POPUP_SELECTED =
  'bg-interactive-gray-faded-highlighted data-[active]:bg-interactive-gray-faded-highlighted';

/**
 * ActionListSection: a group with Figma's section heading (Semibold 12/17,
 * muted, 8px in, 2px under), after Figma's separator row (a hairline 8px in,
 * 4px tall) in every section but the first.
 */
export const POPUP_SECTION = {
  root: 'group/section flex flex-col',
  separator:
    'mx-2 my-[1.5px] h-0 border-t-thin border-x-none border-b-none border-solid border-surface-gray-muted group-first/section:hidden',
  title:
    'px-2 pt-2 pb-0.5 font-sans font-semibold text-75 leading-75 tracking-50 text-interactive-gray-muted',
} as const;

/** MenuDivider: Figma's _Menu Item separator, a hairline 1px in from the panel's edges, 4px tall. */
export const MENU_DIVIDER =
  '-mx-[7px] my-[1.5px] h-0 border-t-thin border-x-none border-b-none border-solid border-surface-gray-muted';
