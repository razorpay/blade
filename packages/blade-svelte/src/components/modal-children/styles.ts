// The parts of an overlay — header, body and footer — for Modal,
// BottomSheet and Drawer, as Blade React spells them. Each part has its own
// resolver: a consumer building a header of their own uses the classes
// (`resolveBottomSheetHeader().title`, …) on their own markup. The
// overlays' classes (`../modal/styles`) read these; nothing here reads them.
import type { HeaderClasses } from '../card-children/styles';
import type { Intent } from '../shared/intent';
import { MENU_ROWS } from '../shared/popup-list';

/**
 * A header's parts: CardHeader's shape (`../card-children`), which every
 * overlay header builds on and draws in its own look.
 */
export type OverlayHeaderClasses = HeaderClasses;

export interface OverlayBodyClasses {
  /** The body: the overlay's scroll box. */
  root: string;
}

export interface OverlayFooterClasses {
  root: string;
}

/**
 * Blade's IconButton (size large): a 20px muted icon, subtle on hover,
 * press and keyboard focus, with Blade's 4px focus ring. The back button's,
 * and the overlays' close button's.
 */
export const OVERLAY_ICON_BUTTON =
  'flex shrink-0 items-center justify-center border-none bg-transparent p-0 icon-interactive-gray-muted transition-colors duration-xquick ease-standard hover:icon-interactive-gray-subtle active:icon-interactive-gray-subtle focus-visible:icon-interactive-gray-subtle focus-visible:rounded-2xsmall focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-offset-1 focus-visible:outline-surface-primary-muted';

const HAIRLINE_BELOW = 'border-b-thin border-solid border-surface-gray-muted';
const HAIRLINE_ABOVE = 'border-t-thin border-solid border-surface-gray-muted';

// Blade DSL's _Modal Header (Figma): the row's parts. The back button is a
// large IconButton (ChevronLeft), 16px before the leading item or the
// title, level with the title's 28px line.
const SUBTITLE =
  'm-0 font-sans text-75 leading-75 font-normal [word-break:break-word] text-surface-gray-muted';
const ROW = {
  row: 'relative flex items-start select-none',
  back: `me-4 h-7 w-5 ${OVERLAY_ICON_BUTTON}`,
  prefix: 'me-2 flex w-8 h-8 shrink-0 items-center justify-center self-center',
  prefixIcon: 'me-2 flex h-7 shrink-0 items-center',
  titleRow: 'flex min-w-0 items-start gap-2',
  suffix: 'flex h-7 shrink-0 items-center',
  trailing: 'ms-4 flex h-7 shrink-0 items-center',
  titleBlock: 'me-auto flex min-w-0 flex-auto flex-col',
  subtitle: SUBTITLE,
};

// Heading/SmallSemibold (18/24, the heading face) on a 28px line.
const HEADING_TITLE =
  'm-0 pt-0.5 font-heading font-semibold text-300 leading-300 [word-break:break-word] text-surface-gray-normal';

// `spacing.0`: a column the content fills and shrinks into, so a list
// inside can bound its own scroll box by the panel's height.
const FLUSH_BODY = 'flex min-h-0 flex-auto flex-col overflow-auto';

/**
 * ModalHeader: Blade DSL's _Modal Header (Figma) — 20px above and beside,
 * 16px below, at every width, a hairline under it; then 16px and the
 * close button's 28px box.
 */
export function resolveModalHeader(): OverlayHeaderClasses {
  return {
    ...ROW,
    root: `shrink-0 ${HAIRLINE_BELOW} px-5 pt-5 pb-4`,
    closeClearance: 'pr-11',
    title: HEADING_TITLE,
  };
}

export interface BottomSheetHeaderLook {
  /**
   * The sheet drags, so its handle strip sits above the header: the header
   * starts 12px under it, not 16px from the top.
   * @default true
   */
  hasHandle?: boolean;
}

/**
 * BottomSheetHeader: Blade DSL's Bottom Sheet (Figma) — 12px under the
 * handle strip (16px down without one), 16px in and below, a hairline
 * under it; the title Body/LargeSemibold (16/24) on a 28px line.
 */
export function resolveBottomSheetHeader(look: BottomSheetHeaderLook = {}): OverlayHeaderClasses {
  const { hasHandle = true } = look;
  return {
    ...ROW,
    root: `shrink-0 ${HAIRLINE_BELOW} ${hasHandle ? 'px-4 pt-3 pb-4' : 'p-4'}`,
    // The 20px button 16px from the end, and 16px beside it.
    closeClearance: 'pr-9',
    title:
      'm-0 pt-0.5 font-sans text-200 leading-200 tracking-25 font-semibold [word-break:break-word] text-surface-gray-normal',
  };
}

export interface DrawerHeaderLook {
  /** A feedback colour's subtle fill behind the header. */
  color?: Intent;
  /**
   * A hairline under the header. Figma's _Drawer Header draws none.
   * @default false
   */
  showDivider?: boolean;
}

const DRAWER_TINT: Record<Intent, string> = {
  neutral: 'bg-feedback-neutral-subtle',
  information: 'bg-feedback-information-subtle',
  positive: 'bg-feedback-positive-subtle',
  notice: 'bg-feedback-notice-subtle',
  negative: 'bg-feedback-negative-subtle',
};

/**
 * DrawerHeader: Blade DSL's _Drawer Header (Figma) — 20px all round, the
 * title Heading/SmallSemibold, the close button 20px from the end.
 */
export function resolveDrawerHeader(look: DrawerHeaderLook = {}): OverlayHeaderClasses {
  const { color, showDivider = false } = look;
  return {
    ...ROW,
    root: `shrink-0 p-5 ${showDivider ? HAIRLINE_BELOW : ''} ${color ? DRAWER_TINT[color] : ''}`
      .replace(/\s+/g, ' ')
      .trim(),
    closeClearance: 'pr-9',
    title: HEADING_TITLE,
  };
}

export interface ModalBodyLook {
  /** Blade's tokens: `spacing.6` (20px) all round, or none. @default 'spacing.6' */
  padding?: 'spacing.0' | 'spacing.6';
}

/** ModalBody: 20px all round, scrolling what is in it. */
export function resolveModalBody(look: ModalBodyLook = {}): OverlayBodyClasses {
  return { root: look.padding === 'spacing.0' ? FLUSH_BODY : 'overflow-auto p-5' };
}

export interface BottomSheetBodyLook {
  /** Blade's tokens: `spacing.5` (16px) all round, or none. @default 'spacing.5' */
  padding?: 'spacing.0' | 'spacing.5';
}

/** BottomSheetBody: 16px all round, scrolling what is in it. */
export function resolveBottomSheetBody(look: BottomSheetBodyLook = {}): OverlayBodyClasses {
  return { root: look.padding === 'spacing.0' ? FLUSH_BODY : 'overflow-auto p-4' };
}

export interface DrawerBodyLook {
  /**
   * Blade's `drawerPadding` (`spacing.6`, 20px) all round, or none — a
   * column its content fills, edge to edge.
   * @default 'spacing.6'
   */
  padding?: 'spacing.0' | 'spacing.6';
}

/** DrawerBody: 20px all round (Blade's `drawerPadding`, spacing.6), scrolling. */
export function resolveDrawerBody(look: DrawerBodyLook = {}): OverlayBodyClasses {
  return { root: look.padding === 'spacing.0' ? FLUSH_BODY : 'overflow-auto p-5' };
}

/**
 * ModalFooter: Blade DSL's _Modal Footer (Figma) — a hairline, then the
 * actions 16px under it, 16px in (20px beside and below on desktop); the
 * caller lays out what is in it.
 */
export function resolveModalFooter(): OverlayFooterClasses {
  return { root: `shrink-0 ${HAIRLINE_ABOVE} p-4 d:px-5 d:pb-5` };
}

/** BottomSheetFooter: 16px all round, on the sheet's surface, under a hairline. */
export function resolveBottomSheetFooter(): OverlayFooterClasses {
  return { root: `shrink-0 ${HAIRLINE_ABOVE} bg-popup-gray-subtle p-4` };
}

export interface DrawerFooterLook {
  /** A hairline above the actions. @default true */
  showDivider?: boolean;
}

/** DrawerFooter: Blade DSL's _Drawer Footer (Figma) — 20px under its hairline and in. */
export function resolveDrawerFooter(look: DrawerFooterLook = {}): OverlayFooterClasses {
  const { showDivider = true } = look;
  return { root: `shrink-0 ${showDivider ? `${HAIRLINE_ABOVE} ` : ''}p-5` };
}

// Blade's PopoverContent (and Blade DSL's Popover in Figma): 16px in, the
// leading item 8px before the title, the title large semibold on a 24px
// line, 24px from its end to the 16px close; the content 4px under the
// header, the footer 16px under the content. Popover and Menu draw these.
const POPOVER_ICON_BUTTON = `${OVERLAY_ICON_BUTTON} rounded-2xsmall`;

/** Popover's (and Menu's) header. */
export function resolvePopoverHeader(): OverlayHeaderClasses {
  return {
    root: 'shrink-0 px-4 pt-4 pb-1',
    row: 'relative flex items-center select-none',
    back: `me-2 h-6 w-5 ${POPOVER_ICON_BUTTON}`,
    prefix: 'me-2 flex w-5 h-5 shrink-0 items-center justify-center',
    prefixIcon: 'me-2 flex h-6 shrink-0 items-center',
    titleRow: 'flex min-w-0 items-center gap-2',
    suffix: 'flex h-6 shrink-0 items-center',
    trailing: 'ms-3 flex h-6 shrink-0 items-center',
    titleBlock: 'me-auto flex min-w-0 flex-auto flex-col',
    closeClearance: 'pr-9',
    title:
      'm-0 font-sans font-semibold text-200 leading-200 tracking-25 [word-break:break-word] text-surface-gray-normal',
    subtitle: SUBTITLE,
  };
}

/** Popover's body: 16px all round, scrolling. */
export function resolvePopoverBody(
  look: { padding?: 'spacing.0' | 'spacing.5' } = {},
): OverlayBodyClasses {
  return { root: look.padding === 'spacing.0' ? FLUSH_BODY : 'overflow-auto p-4' };
}

/** Popover's (and Menu's) footer: 16px in and below. */
export function resolvePopoverFooter(): OverlayFooterClasses {
  return { root: 'shrink-0 px-4 pb-4' };
}

/** Menu's body: Figma's Menu panel, 8px round its rows. */
export function resolveMenuBody(): OverlayBodyClasses {
  return { root: `overflow-auto ${MENU_ROWS}` };
}
