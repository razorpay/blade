import { checkboxSizeParts, resolveCheckbox } from '../checkbox/styles';

// The one look Menu, Dropdown and ActionList share (Blade DSL's Menu, _Menu Item and
// Dropdown; the designer aligned the two on Menu's spacing). The panel is
// 240 to 400px wide, 8px from its trigger, on the popup surface: 12px
// radius, the medium blur, the 1px rim drawn inside over the raised shadow,
// 8px round the rows and 2px between them. A row is 36px with an 8px
// radius and 8px padding: the leading item (a 16px glyph, or a 20px asset
// or avatar), the title (Body/Medium 14/20) with its suffix and an optional
// description (Body/Small 12/17, muted), and the trailing item, each 8px
// apart. Transparent at rest; `interactive.background.gray.default` while
// active (under the pointer, or the keyboard's row, which also takes
// Blade's 4px `surface.border.primary.muted` ring); the title
// `interactive.text.gray.normal`, `…disabled` when disabled. A negative row
// (a destructive action) is red, its fill a red wash. The panel opens
// sliding 8px down as it fades in, over `quick`.

/** The panel's classes: Menu's panel, and the box a Dropdown's parts sit in. */
export const POPUP_SURFACE =
  'pointer-events-auto absolute z-50 flex min-w-[240px] max-w-[400px] flex-col rounded-medium bg-popup-gray-moderate text-surface-gray-normal shadow-dropdown backdrop-blur-medium outline-none transition-all duration-quick ease-entrance data-[state=closed]:-translate-y-2 data-[state=closed]:opacity-0 motion-reduce:transition-none';

/** The rows' box: 8px round them, 2px between. */
export const POPUP_ROWS = 'flex flex-col gap-0.5 p-2 outline-none';

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
  /** Under the title: muted, may wrap. */
  itemDescription: string;
  /** A leading glyph's box: 16px on the title's 20px line. */
  itemIcon: string;
  /** A leading asset or avatar's 20px box. */
  itemLeading: string;
  /** Beside the title: a Badge. */
  itemTitleSuffix: string;
  /** After the title: a glyph (a check, a chevron) or shortcut text, 8px clear of it. */
  itemTrailing: string;
}

export const POPUP_ITEM: PopupItemClasses = {
  item:
    'flex w-full flex-row items-center gap-2 rounded-small border-none bg-transparent p-2 text-left font-blade-text text-100 leading-100 tracking-50 whitespace-nowrap outline-none select-none',
  itemState: {
    enabled:
      'cursor-pointer data-[active=keyboard]:outline-solid data-[active=keyboard]:outline-4 data-[active=keyboard]:outline-offset-1 data-[active=keyboard]:outline-surface-primary-muted',
    disabled: 'cursor-not-allowed text-interactive-gray-disabled',
  },
  itemIntent: {
    none: 'text-interactive-gray-normal data-[active]:bg-interactive-gray-default',
    negative: 'text-interactive-negative-normal data-[active]:bg-interactive-negative-faded',
  },
  itemBody: 'flex min-w-0 flex-1 flex-col gap-0.5',
  itemTitle: 'min-w-0 flex-1 truncate',
  itemTitleRow: 'flex min-w-0 flex-1 items-center gap-2',
  itemDescription: 'whitespace-normal text-75 leading-75 tracking-50 text-surface-gray-muted',
  itemTitleSuffix: 'flex shrink-0 items-center',
  itemLeading: 'flex w-5 h-5 shrink-0 items-center justify-center self-start',
  itemTrailing: 'flex h-5 shrink-0 items-center self-start',
  // No colour of its own: Blade's item icon is `interactive.icon.gray.normal`
  // (`…disabled` when disabled), the same values as the item's text.
  itemIcon: 'flex h-5 shrink-0 items-center self-start',
};

/** Blade DSL's _Menu Header / _Dropdown Header: 16px in, 12px under, Heading/Small-ish title. */
export const POPUP_HEADER = {
  root: 'flex flex-col gap-3 px-4 pt-4 pb-3',
  titleRow: 'flex min-w-0 flex-row items-start gap-2',
  title: 'm-0 min-w-0 flex-1 truncate font-blade-text font-blade-semibold text-200 leading-200 tracking-25 text-surface-gray-normal',
  subtitle: 'm-0 font-blade-text text-75 leading-75 tracking-50 text-surface-gray-muted',
} as const;

/** Blade DSL's _Menu Footer / _Dropdown Footer: 16px in at the sides and below. */
export const POPUP_FOOTER = 'flex flex-row items-center justify-end gap-4 px-4 pb-4 pt-2';

const CHECK = resolveCheckbox({ size: 'medium' }).indicator;

/** A multiple-choice row's leading checkbox: Checkbox's own box, drawn (the row is the control). */
export const POPUP_CHECK = {
  box: `${CHECK.root} w-4 h-4 m-0.5 border-thick ${checkboxSizeParts('medium').tickNudge}`,
  look: CHECK.look.default,
  mark: {
    shown: `${CHECK.mark.shown} ${checkboxSizeParts('medium').mark}`,
    hidden: `${CHECK.mark.hidden} ${checkboxSizeParts('medium').mark}`,
  },
} as const;

/** A single pick's row: Figma's darker wash. */
export const POPUP_SELECTED = 'bg-interactive-gray-faded-highlighted';

/**
 * ActionListSection: a group with Figma's section heading (Semibold 12/17,
 * muted, 8px in, 2px under), a hairline above every section but the first.
 */
export const POPUP_SECTION = {
  root: 'flex flex-col gap-0.5 border-t-thin border-x-none border-b-none border-solid border-surface-gray-muted pt-0.5 first:border-t-none first:pt-0',
  title:
    'px-2 pt-2 pb-0.5 font-blade-text font-blade-semibold text-75 leading-75 tracking-50 text-interactive-gray-muted',
} as const;
