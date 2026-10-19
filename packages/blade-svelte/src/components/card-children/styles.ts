import type { ButtonType } from '../../runes/button/press.svelte';
import type { IconSource } from '../../runes/icon/source';

// Card's parts — CardHeader, CardBody, CardFooter — as Blade React spells
// them, and the shapes every header and footer's classes take. CardHeader
// is the base the overlays' headers build on (ModalHeader,
// BottomSheetHeader, DrawerHeader): each passes its own classes, in this
// shape, from its own resolver.

/** A header's parts: the shape CardHeader draws, whoever's look it wears. */
export interface HeaderClasses {
  /** The header box. `class` from the caller lands here too. */
  root: string;
  /** The row: `start`, the prefix, the title block, the trailing item. */
  row: string;
  /** A back button, for a header that has one (in `start`). */
  back: string;
  /** A prefix snippet: an asset, an avatar. */
  prefix: string;
  /** A prefix icon, on the title's first line. */
  prefixIcon: string;
  /** The title and its suffix, side by side. */
  titleRow: string;
  /** Beside the title: a Counter or a Badge. */
  suffix: string;
  /** After the title block. */
  trailing: string;
  /** The title and the subtitle, or the header's `content`. */
  titleBlock: string;
  /** Room the row leaves for a close button beside it (an overlay's). */
  closeClearance: string;
  title: string;
  subtitle: string;
}

export interface BodyClasses {
  root: string;
}

/** A footer's parts: the shape CardFooter draws. */
export interface FooterClasses {
  /** The footer box. */
  root: string;
  /** The leading text and the actions, the ends pushed apart. */
  row: string;
  /** The title over the subtitle. */
  leading: string;
  title: string;
  subtitle: string;
  /** The actions: secondary, then primary. */
  actions: string;
}

/** One of CardFooterTrailing's actions, drawn as a Button. */
export interface CardFooterAction {
  text: string;
  onClick?: (event: MouseEvent) => void;
  /** @default 'button' */
  type?: ButtonType;
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: IconSource;
  /** @default 'left' */
  iconPosition?: 'left' | 'right';
  accessibilityLabel?: string;
}

const DIVIDER = 'border-solid border-surface-gray-muted';

export interface CardHeaderLook {
  /** A hairline under the header, 12px either side of it. @default true */
  showDivider?: boolean;
}

/**
 * CardHeader: Blade's CardHeaderLeading and CardHeaderTrailing in a row,
 * 12px above the hairline and 12px past it. The prefix, the title block
 * and the trailing item 16px apart, centred; the title Text large
 * semibold, the subtitle Text small in `surface.text.gray.subtle`.
 */
export function resolveCardHeader(look: CardHeaderLook = {}): HeaderClasses {
  const { showDivider = true } = look;
  return {
    root: `mb-3 pb-3 ${showDivider ? `border-b-thin ${DIVIDER}` : ''}`.trim(),
    row: 'flex items-center gap-4',
    back: '',
    prefix: 'flex shrink-0 items-center',
    prefixIcon: 'flex shrink-0 items-center',
    titleRow: 'flex min-w-0 items-center gap-2',
    suffix: 'flex shrink-0 items-center',
    trailing: 'flex shrink-0 items-center',
    titleBlock: 'flex min-w-0 flex-1 flex-col',
    closeClearance: '',
    title:
      'm-0 font-sans font-semibold text-200 leading-200 tracking-25 [word-break:break-word] text-surface-gray-normal',
    subtitle:
      'm-0 font-sans font-normal text-75 leading-75 tracking-50 [word-break:break-word] text-surface-gray-subtle',
  };
}

/** CardBody: the content between the header and the footer; the card pads it. */
export function resolveCardBody(): BodyClasses {
  return { root: 'min-w-0' };
}

export interface CardFooterLook {
  /** A hairline above the footer, 12px either side of it. @default true */
  showDivider?: boolean;
}

/**
 * CardFooter: Blade's CardFooterLeading (a title over a subtitle) and
 * CardFooterTrailing (the actions), 12px past the hairline.
 */
export function resolveCardFooter(look: CardFooterLook = {}): FooterClasses {
  const { showDivider = true } = look;
  return {
    root: `mt-3 pt-3 ${showDivider ? `border-t-thin ${DIVIDER}` : ''}`.trim(),
    row: 'flex items-center justify-between gap-4',
    leading: 'flex min-w-0 flex-col',
    title: 'm-0 font-sans font-semibold text-100 leading-100 tracking-50 text-surface-gray-normal',
    subtitle: 'm-0 font-sans font-normal text-75 leading-75 tracking-50 text-surface-gray-subtle',
    actions: 'ms-auto flex shrink-0 items-center gap-3',
  };
}
