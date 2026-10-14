import type { AxisValue } from '../../axes';
import type { Placement, PlacementSide } from '../../runes/layer/placement';
import type { SurfaceClasses } from '../layer/styles';
import { MENU_ROWS, MENU_SURFACE, POPUP_GAP } from '../shared/popup-list';
import { NATIVE_PLACEMENT } from '../tooltip/styles';

/**
 * The parts of a floating panel: on web FloatingPanel measures and places
 * it (inline left/top) inside the OverlayStack; native cannot measure into
 * a host and places it with `nativePlacement` classes inside the trigger's
 * wrapper. Enter/exit ride the panel's `data-state`, as everywhere.
 */
export interface FloatingClasses {
  /** The floating element. */
  panel: string;
  /** Native only: applied to the panel per requested placement. */
  nativePlacement: Record<Placement, string>;
  /** Distance between the trigger and the panel, in px. */
  gap: number;
  /**
   * The arrow toward the trigger, when the panel has one; FloatingPanel
   * sets `--popover-arrow` to where it sits along the facing edge.
   */
  arrow?: string;
  /** Applied to the arrow per side the panel ended up on. */
  arrowSide?: Record<PlacementSide, string>;
}

/**
 * The parts of a Modal. Static class strings only. Open/closed styling
 * rides `data-state`: Modal stamps `data-state="open" | "closed"` on
 * the root, and the enter/exit visuals key on it
 * (`group-data-[state=closed]:…`) as CSS transitions. The modal stays
 * mounted for the longest computed transition among the backdrop and the
 * panel, so the reduced-motion variant (no transition) unmounts immediately with no
 * extra wiring. On native the platform sheet owns the scrim and enter/exit,
 * shaped through `nativeSheet` (see `SurfaceClasses`).
 */
export interface ModalClasses extends SurfaceClasses {
  /**
   * How the variant renders: a `surface` on the layer stack (modal, sheet,
   * drawers, and an anchored variant presented as a sheet), or a
   * `floating` panel by its trigger (popover, menu).
   */
  kind: 'surface' | 'floating';
  /** The trigger's `aria-haspopup`, and the panel's role for a floating one. */
  popup: 'dialog' | 'menu';
  /** The floating panel's parts; undefined for a surface. */
  floating?: FloatingClasses;
  /** Blade's BaseHeader: the padded box with its hairline below. */
  header: string;
  /** The row: the leading item, the title block, the trailing item; then the close button. */
  headerRow: string;
  /** The back button, first in the row: a 20px glyph on the title's 28px line, 16px before what follows. */
  back: string;
  /** Before the title block: an asset or avatar in Figma's 32px slot, centred on the title block, 8px from it. */
  leading: string;
  /** A leading glyph (`leading` as an icon): on the title's 28px first line, 8px from it. */
  leadingIcon: string;
  /** The title and what follows it (`titleSuffix`), 8px apart. */
  titleRow: string;
  /** Beside the title: a Counter or a Badge, centred on the title line. */
  titleSuffix: string;
  /** After the title block: a Badge, text, a Link or an action, 16px clear of it and of the close button. */
  trailing: string;
  /** The title over the `header` snippet. */
  titleBlock: string;
  /** Added to the header row while the close button shows: room for it. */
  closeClearance: string;
  /** A `title` string's type; a snippet sits in the same place. */
  title: string;
  /** The `subtitle` line under the title: Blade's body small, muted. */
  subtitle: string;
  /** The close button, in the chrome, level with the title. */
  close: string;
  /** The close button when there is no header: floating at the top edge. */
  floatingClose: string;
  /** Holds the floating close button, where the header would be. */
  emptyHeader: string;
  body: string;
  footer: string;
}

export type ModalStyleResolver<P> = (props: P) => ModalClasses;

/** The blade taxonomy as data. */
export const MODAL_AXES = {
  variant: ['modal', 'sheet', 'drawer', 'left-drawer', 'popover', 'menu'],
  size: ['small', 'medium', 'large', 'full'],
  pace: ['default', 'snappy'],
  presentation: ['anchored', 'sheet'],
} as const;

type Axis<K extends keyof typeof MODAL_AXES> = AxisValue<typeof MODAL_AXES, K>;

/** Derived from MODAL_AXES: add a value there, never here. */
export interface ModalStyleProps {
  /**
   * `modal`: centred; `sheet`: Blade's BottomSheet — on the bottom edge
   * with a handle, dragged down to dismiss; `drawer`: Blade's Drawer, full
   * height on the right edge; `left-drawer`: the same on the left;
   * `popover`: Blade's Popover, a non-modal panel by its `trigger` with an
   * arrow toward it; `menu`: Blade's Menu, the panel of actions by its
   * trigger (an ActionList inside takes `menuitem` rows). The app picks
   * it; desktop tweaks within one variant are its `d:` classes.
   * @default 'modal'
   */
  variant?: Axis<'variant'>;
  /**
   * How `popover` and `menu` show: `anchored`, floating by the trigger, or
   * as a bottom `sheet` — the phone presentation, set once for the app
   * through BladeProvider defaults (`{ Modal: { presentation: 'sheet' } }`).
   * Nothing reads the viewport: the app decides. The other variants
   * ignore it.
   * @default 'anchored'
   */
  presentation?: Axis<'presentation'>;
  /**
   * The panel's width on desktop (`d`) — Blade's 400, 760 or 1024px column, or
   * `full` to span the host, 8px in. Below `m` every panel spans the host.
   * A drawer has its own width and ignores it.
   * @default 'small'
   */
  size?: Axis<'size'>;
  /** `snappy`: v2's quick-buy drawer — 250ms, expo-out. */
  pace?: Axis<'pace'>;
  /**
   * Whether a sheet or a drawer can be dragged away — a sheet down, by its
   * handle strip and header; a drawer toward its edge, by its header. A
   * sheet shows its handle only while draggable. The modal variant ignores
   * it.
   * @default true for `sheet`, false for the drawers
   */
  isDraggable?: boolean;
}

// Ported from app/v2/modules/navstack/components/Overlay.svelte and
// app/v2/modules/common/components/Modal.svelte. Semantic tokens only —
// merchant theming reaches every class through the CSS-var seam. Enter/exit
// are CSS transitions keyed on the root's data-state, so an interrupted open
// reverses from where it is; the scrim is the OverlayStack's (../overlay-stack),
// one under every open modal, and fades at the default pace here.
const PACE: Record<Axis<'pace'>, string> = {
  default: 'duration-moderate ease-entrance motion-reduce:transition-none',
  // 250ms in v2; Blade's nearest step is `moderate` (280ms), so the pace
  // differs from the default by its easing only.
  snappy:
    'duration-moderate [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
};

// The root inherits the host box's `pointer-events-none`; the panel opts
// back in, so a click beside it falls through to the host's scrim.
const ROOT = 'group absolute inset-0 z-50 flex';

// The panel does not clip: the chrome on its top edge may hang outside it.
// The content box inside it clips, to the panel's corners.
const PANEL =
  'pointer-events-auto relative flex max-h-full flex-col bg-popup-gray-subtle text-surface-gray-normal outline-none transition-all';
const CONTENT = 'flex min-h-0 flex-auto flex-col overflow-hidden [border-radius:inherit]';
// A full-width, zero-height box on the panel's top edge: what sits in it
// positions itself — above the panel (`bottom-full`) or over it (`top-*`).
const CHROME = 'absolute inset-x-0 top-0 z-10 h-0';

// Blade DSL's Drawer (Figma): full height on its edge, 24px short of the
// host's width on phones with square corners; 380px on desktop (`d`), where
// it floats 8px in with large corners, casting Blade's highRaised elevation.
const DRAWER = 'h-full w-[calc(100%_-_1.5rem)] d:w-[380px] shadow-highRaised d:rounded-large';

// Blade's Modal: centred, scaling and fading in place.
const CENTRED = {
  root: 'items-center justify-center p-4',
  panel:
    'w-full rounded-large shadow-highRaised group-data-[state=closed]:scale-95 group-data-[state=closed]:opacity-0',
};

// Per edge: how the root lays the drawer out, and where the closed one parks.
// The open panel carries a transform at rest (`translate-x-0`): a drag moves
// it by setting the axis's variable, which needs the composed transform on.
const DRAWER_EDGE: Record<'drawer' | 'left-drawer', { root: string; panel: string }> = {
  drawer: {
    root: 'items-stretch justify-end d:p-2',
    panel: `${DRAWER} translate-x-0 group-data-[state=closed]:translate-x-full`,
  },
  'left-drawer': {
    root: 'items-stretch justify-start d:p-2',
    panel: `${DRAWER} translate-x-0 group-data-[state=closed]:-translate-x-full`,
  },
};

// Native: the platform sheet is bottom-anchored and content-sized; only a
// full-size modal changes its shape.
const NATIVE_FULL = { 'data-height': 'full', 'data-radius': '0' };

const NO_DRAG: ModalClasses['drag'] = {
  isEnabled: false,
  axis: 'y',
  direction: 1,
  zone: '',
  strip: '',
  handle: '',
  grip: '',
};

// The zone takes the drag, so it must not scroll or pull-to-refresh.
const DRAG_ZONE = 'shrink-0 cursor-grab touch-none select-none active:cursor-grabbing';

// Blade's modalTokens.ts: the column per size; `full` spans the host (the
// root's 8px inset), as does every size on phones. A centred modal is at
// most 80% of the host's height.
const SIZE: Record<Axis<'size'>, string> = {
  small: 'd:w-[400px]',
  medium: 'd:w-[760px]',
  large: 'd:w-[1024px]',
  full: '',
};
// Important: the panel's `max-h-full` sits on the same element.
const CENTRED_HEIGHT = 'max-h-[80%]!';
// A centred `full` modal fills the host, 8px in (Blade's `modalMargin`), in
// place of the centred root's 16px.
const CENTRED_FULL = { root: 'items-center justify-center p-2', panel: 'h-full' };

// Blade's IconButton (size large): a 20px muted icon, subtle on hover,
// press and keyboard focus, with Blade's 4px focus ring.
const ICON_BUTTON =
  'flex shrink-0 items-center justify-center border-none bg-transparent p-0 icon-interactive-gray-muted transition-colors duration-xquick ease-standard hover:icon-interactive-gray-subtle active:icon-interactive-gray-subtle focus-visible:icon-interactive-gray-subtle focus-visible:rounded-2xsmall focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-offset-1 focus-visible:outline-surface-primary-muted';

/** What a variant decides: the layout per state, the drag, the native sheet. */
interface ModalLayout {
  root: string;
  panel: string;
  drag: ModalClasses['drag'];
  nativeSheet: ModalClasses['nativeSheet'];
  /** The variant's own body and footer boxes, over the modal's. */
  body?: string;
  footer?: string;
  /** The variant's own header box and title type, over the modal's. */
  header?: string;
  title?: string;
  /** Where the close buttons sit in the chrome, over the modal's. */
  close?: string;
  floatingClose?: string;
  /** The room the header row leaves for the close button, over the modal's. */
  closeClearance?: string;
}

// Blade DSL's _Modal Header (Figma) draws the close as a 20px icon in a
// 28px box, last in the header row: so it sits level with the title's 28px
// first line, 24px from the top (the header's 20px plus 4px) and 24px from
// the end (20px plus 4px). cx keeps it in the chrome — it also floats with
// no header — at that spot. With no header it floats in a 28px circle,
// 16px in, 4px above the edge.
const CLOSE = 'absolute top-6 right-6';
const FLOATING_CLOSE = 'absolute -top-1 right-4';

/**
 * The modal's parts for a layout: the fixed root and panel, the pace, the
 * desktop column, the chrome and the sections.
 */
function modalClasses(layout: ModalLayout, props: ModalStyleProps = {}): ModalClasses {
  const { size = 'small', pace = 'default' } = props;
  return {
    kind: 'surface',
    popup: 'dialog',
    root: `${ROOT} ${layout.root}`,
    drag: layout.drag,
    nativeSheet: layout.nativeSheet,
    panel: `${PANEL} ${PACE[pace]} ${layout.panel} ${SIZE[size]}`,
    content: CONTENT,
    chrome: CHROME,
    // Blade DSL's _Modal Header (Figma): 20px above and beside it, 16px
    // below, at every width; a hairline under it.
    header:
      layout.header ??
      'shrink-0 border-b-thin border-solid border-surface-gray-muted px-5 pt-5 pb-4',
    headerRow: 'relative flex items-start select-none',
    // Blade's BaseHeader: a large IconButton (ChevronLeft), 16px (spacing.5)
    // before the leading item or the title, level with the title line.
    back: `me-4 h-7 w-5 ${ICON_BUTTON}`,
    leading: 'me-2 flex w-8 h-8 shrink-0 items-center justify-center self-center',
    leadingIcon: 'me-2 flex h-7 shrink-0 items-center',
    titleRow: 'flex min-w-0 items-start gap-2',
    titleSuffix: 'flex h-7 shrink-0 items-center',
    trailing: 'ms-4 flex h-7 shrink-0 items-center',
    titleBlock: 'me-auto flex min-w-0 flex-auto flex-col',
    // Figma: 16px, then the close's 28px box.
    closeClearance: layout.closeClearance ?? 'pr-11',
    // Heading/SmallSemibold (18/24, the heading face) on a 28px line.
    title:
      layout.title ??
      'm-0 pt-0.5 font-heading font-semibold text-300 leading-300 [word-break:break-word] text-surface-gray-normal',
    subtitle:
      'm-0 font-sans text-75 leading-75 font-normal [word-break:break-word] text-surface-gray-muted',
    close: `${layout.close ?? CLOSE} w-5 h-5 ${ICON_BUTTON}`,
    floatingClose: `${
      layout.floatingClose ?? FLOATING_CLOSE
    } w-7 h-7 rounded-max bg-popup-gray-subtle ${ICON_BUTTON}`,
    emptyHeader: 'relative h-2 shrink-0',
    body: layout.body ?? 'overflow-auto p-5',
    // Blade DSL's _Modal Footer (Figma): a hairline, then the actions 16px
    // under it, 16px in (20px beside and below on desktop); the caller lays
    // out what is in it.
    footer:
      layout.footer ??
      'shrink-0 border-t-thin border-solid border-surface-gray-muted p-4 d:px-5 d:pb-5',
  };
}

// Blade DSL's Bottom Sheet (Figma). The zone — the handle strip and the
// header — takes the drag, so it must not scroll or pull-to-refresh; the
// grab handle, in the chrome over the strip, is a 56 × 4px pill, 12px from
// the top, 4px above the header. The header is 12px under the strip, 16px
// in and below; its title Body/LargeSemibold (16/24) on a 28px line, the
// close button centred on it. The body and the footer are 16px all round,
// the footer on the sheet's surface under a hairline. The sheet casts its
// shadow upward and rounds its top corners 16px (all four on desktop, where
// it floats 8px in at the end).
const SHEET: ModalLayout = {
  root: 'items-end justify-center d:justify-end d:p-2',
  panel:
    'w-full rounded-tl-large rounded-tr-large shadow-bottomSheet translate-y-0 group-data-[state=closed]:translate-y-full d:rounded-large',
  drag: {
    isEnabled: true,
    axis: 'y',
    direction: 1,
    zone: DRAG_ZONE,
    strip: 'h-5',
    handle: 'pointer-events-none absolute inset-x-0 top-3 flex justify-center',
    grip: 'h-1 w-14 rounded-max bg-interactive-gray-faded',
  },
  nativeSheet: { 'data-draggable': 'true', 'data-showhandle': 'true' },
  body: 'overflow-auto p-4',
  footer: 'shrink-0 border-t-thin border-solid border-surface-gray-muted bg-popup-gray-subtle p-4',
  header: 'shrink-0 border-b-thin border-solid border-surface-gray-muted px-4 pt-3 pb-4',
  title:
    'm-0 pt-0.5 font-sans text-200 leading-200 tracking-25 font-semibold [word-break:break-word] text-surface-gray-normal',
  close: 'absolute top-9 right-4',
  floatingClose: 'absolute top-4 right-4',
  // The 20px button 16px from the end, and 16px beside it.
  closeClearance: 'pr-9',
};

// Blade DSL's _Drawer Header and _Drawer Footer (Figma): the header 20px
// all round with no hairline, its title Heading/SmallSemibold; the footer's
// actions 20px under its hairline and 20px in. The close button centred on
// the title's first line, 20px from the end.
const DRAWER_SECTIONS = {
  header: 'shrink-0 p-5',
  footer: 'shrink-0 border-t-thin border-solid border-surface-gray-muted p-5',
  close: 'absolute top-6 right-5',
  closeClearance: 'pr-9',
};

// Blade's PopoverContentWrapper: the popup fill, 16px round, the popup
// shadow (a 1px rim drawn inside over the raised shadow), the high backdrop
// blur; 328px at most (288px on phones).
const POPOVER_PANEL =
  'pointer-events-auto absolute z-50 flex flex-col rounded-large bg-popup-gray-moderate text-surface-gray-normal shadow-dropdown backdrop-blur-high outline-none transition-all duration-xquick ease-entrance data-[state=closed]:scale-95 data-[state=closed]:opacity-0 motion-reduce:transition-none';

// Blade's popover arrow: 22×12, pointing at the trigger from the panel's
// facing edge, in the panel's fill; the panel sits 4px past its tip.
const ARROW = 'absolute bg-popup-gray-moderate';
const ARROW_SIDE: Record<PlacementSide, string> = {
  top:
    'top-full w-[22px] h-3 [left:var(--popover-arrow)] -translate-x-1/2 [clip-path:polygon(0_0,100%_0,50%_100%)]',
  bottom:
    'bottom-full w-[22px] h-3 [left:var(--popover-arrow)] -translate-x-1/2 [clip-path:polygon(50%_0,100%_100%,0_100%)]',
  left:
    'left-full w-3 h-[22px] [top:var(--popover-arrow)] -translate-y-1/2 [clip-path:polygon(0_0,100%_50%,0_100%)]',
  right:
    'right-full w-3 h-[22px] [top:var(--popover-arrow)] -translate-y-1/2 [clip-path:polygon(100%_0,100%_100%,0_50%)]',
};

// Blade's IconButton, medium: a 16px muted glyph, subtle on hover and
// focus, with the 4px focus ring — the popover's close, smaller than a
// modal's.
const POPOVER_CLOSE = `${ICON_BUTTON} rounded-2xsmall`;

/**
 * A floating variant's parts: the anchored panel in place of a surface,
 * and the modal's sections laid out inside it. Blade's PopoverContent (and
 * Blade DSL's Popover in Figma): 16px in, the header's leading item 8px
 * before the title, the title large semibold, 24px from its end to the
 * close button; the content 4px under the header, the footer 16px under
 * the content. Menu: Figma's Menu panel (12px round), 8px round the rows.
 */
function floatingClasses(variant: 'popover' | 'menu', pace: Axis<'pace'>): ModalClasses {
  const menu = variant === 'menu';
  return {
    kind: 'floating',
    popup: menu ? 'menu' : 'dialog',
    floating: menu
      ? { panel: MENU_SURFACE, nativePlacement: NATIVE_PLACEMENT, gap: POPUP_GAP }
      : {
          panel: `${POPOVER_PANEL} w-max max-w-[288px] d:max-w-[328px]`,
          nativePlacement: NATIVE_PLACEMENT,
          gap: 16,
          arrow: ARROW,
          arrowSide: ARROW_SIDE,
        },
    root: '',
    drag: NO_DRAG,
    nativeSheet: {},
    panel: PACE[pace],
    content: 'flex min-h-0 flex-auto flex-col',
    chrome: CHROME,
    header: 'shrink-0 px-4 pt-4 pb-1',
    headerRow: 'relative flex items-center select-none',
    back: `me-2 h-6 w-5 ${ICON_BUTTON}`,
    leading: 'me-2 flex w-5 h-5 shrink-0 items-center justify-center',
    leadingIcon: 'me-2 flex h-6 shrink-0 items-center',
    titleRow: 'flex min-w-0 items-center gap-2',
    titleSuffix: 'flex h-6 shrink-0 items-center',
    trailing: 'ms-3 flex h-6 shrink-0 items-center',
    titleBlock: 'me-auto flex min-w-0 flex-auto flex-col',
    // The title's 12px, then the 16px close in its 24px box: 24px from the title's end.
    closeClearance: 'pr-9',
    title:
      'm-0 font-sans font-semibold text-200 leading-200 tracking-25 [word-break:break-word] text-surface-gray-normal',
    subtitle:
      'm-0 font-sans text-75 leading-75 font-normal [word-break:break-word] text-surface-gray-muted',
    close: `absolute top-4 right-4 w-5 h-5 ${POPOVER_CLOSE}`,
    floatingClose: `absolute top-3 right-3 w-6 h-6 rounded-max ${POPOVER_CLOSE}`,
    emptyHeader: 'relative h-0 shrink-0',
    body: menu ? `overflow-auto ${MENU_ROWS}` : 'overflow-auto p-4',
    footer: 'shrink-0 px-4 pb-4',
  };
}

export const resolveModal: ModalStyleResolver<ModalStyleProps> = (props: ModalStyleProps = {}) => {
  const { size = 'small', pace = 'default', presentation = 'anchored' } = props;
  const { variant = 'modal' } = props;
  if (variant === 'popover' || variant === 'menu') {
    if (presentation === 'anchored') {
      return floatingClasses(variant, pace);
    }
    // The phone presentation: the same content as a bottom sheet. The
    // trigger's popup stays what was asked for, so a menu's rows still
    // act and close; the sheet's role is a dialog's.
    const sheet = resolveModal({ ...props, variant: 'sheet' });
    return { ...sheet, popup: variant === 'menu' ? 'menu' : 'dialog' };
  }
  if (variant === 'sheet') {
    if (props.isDraggable ?? true) {
      return modalClasses(SHEET, { size, pace });
    }
    // Not draggable: no handle, no strip, so the header starts 16px down and
    // the close button sits where a modal's does; the platform sheet
    // neither drags nor shows a handle.
    const {
      drag: _drag,
      nativeSheet: _native,
      close: _close,
      floatingClose: _floating,
      header: _header,
      ...still
    } = SHEET;
    return modalClasses(
      {
        ...still,
        header: 'shrink-0 border-b-thin border-solid border-surface-gray-muted p-4',
        close: 'absolute top-5 right-4',
        drag: NO_DRAG,
        nativeSheet: {},
      },
      { size, pace },
    );
  }
  if (variant === 'drawer' || variant === 'left-drawer') {
    // Dragged toward its own edge, by its header (there is no handle).
    const drag: ModalClasses['drag'] = props.isDraggable
      ? {
          ...NO_DRAG,
          isEnabled: true,
          axis: 'x',
          direction: variant === 'drawer' ? 1 : -1,
          zone: DRAG_ZONE,
        }
      : NO_DRAG;
    // A drawer has its own width: no column over it.
    return modalClasses(
      {
        ...DRAWER_EDGE[variant],
        ...DRAWER_SECTIONS,
        drag,
        nativeSheet: props.isDraggable ? { 'data-draggable': 'true' } : {},
      },
      { size: 'full', pace },
    );
  }
  const full = size === 'full';
  return modalClasses(
    {
      root: full ? CENTRED_FULL.root : CENTRED.root,
      panel: `${CENTRED.panel} ${full ? CENTRED_FULL.panel : CENTRED_HEIGHT}`,
      drag: NO_DRAG,
      nativeSheet: full ? NATIVE_FULL : {},
    },
    { size, pace },
  );
};
