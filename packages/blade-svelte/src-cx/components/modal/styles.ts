import type { AxisValue } from '../../axes';
import type { SurfaceClasses } from '../layer/styles';

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
  /** Blade's BaseHeader: the padded box with its hairline below. */
  header: string;
  /** The row: the leading item, the title block, the trailing item; then the close button. */
  headerRow: string;
  /** Before the title block: an asset or avatar, 8px from the title. */
  leading: string;
  /** A leading glyph's box: the title's 28px first line. */
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
  variant: ['modal', 'sheet', 'drawer', 'left-drawer'],
  size: ['small', 'medium', 'large', 'full'],
  pace: ['default', 'snappy'],
} as const;

type Axis<K extends keyof typeof MODAL_AXES> = AxisValue<typeof MODAL_AXES, K>;

/** Derived from MODAL_AXES: add a value there, never here. */
export interface ModalStyleProps {
  /**
   * `modal`: centred; `sheet`: Blade's BottomSheet — on the bottom edge
   * with a handle, dragged down to dismiss; `drawer`: Blade's Drawer, full
   * height on the right edge; `left-drawer`: the same on the left. Given
   * per breakpoint it switches with the viewport:
   * `{ base: 'sheet', m: 'modal' }`.
   * @default 'modal'
   */
  variant?: Axis<'variant'>;
  /**
   * The panel's width from `m` up — Blade's 400, 760 or 1024px column, or
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
// reverses from where it is; the scrim is the LayerHost's (../layer-host),
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
// host's width on phones with square corners; 380px from `m`, where it
// floats 8px in with large corners, casting Blade's highRaised elevation.
const DRAWER = 'h-full w-[calc(100%_-_1.5rem)] m:w-[380px] shadow-highRaised m:rounded-large';

// Blade's Modal: centred, scaling and fading in place.
const CENTRED = {
  root: 'items-center justify-center p-4',
  panel:
    'w-full rounded-large shadow-highRaised group-data-[state=closed]:scale-95 group-data-[state=closed]:opacity-0',
};

// Per edge: how the root lays the drawer out, and where the closed one parks.
const DRAWER_EDGE: Record<'drawer' | 'left-drawer', { root: string; panel: string }> = {
  drawer: {
    root: 'items-stretch justify-end m:p-2',
    panel: `${DRAWER} group-data-[state=closed]:translate-x-full`,
  },
  'left-drawer': {
    root: 'items-stretch justify-start m:p-2',
    panel: `${DRAWER} group-data-[state=closed]:-translate-x-full`,
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
// root's 8px inset). A centred modal is at most 80% of the host's height.
const SIZE: Record<Axis<'size'>, string> = {
  small: 'm:w-[400px]',
  medium: 'm:w-[760px]',
  large: 'm:w-[1024px]',
  full: '',
};
// Important: the panel's `max-h-full` sits on the same element.
const CENTRED_HEIGHT = '!max-h-[80%]';
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
}

// The close button sits in the chrome, level with the title's 28px first
// line: the header's 16px (20px from `m`) plus 4px, from the top and the
// end. With no header it floats in a 28px circle, 16px in, 4px above the
// edge.
const CLOSE = 'absolute top-5 right-4 m:top-6 m:right-5';
const FLOATING_CLOSE = 'absolute -top-1 right-4';

/**
 * The modal's parts for a layout: the fixed root and panel, the pace, the
 * desktop column, the chrome and the sections.
 */
function modalClasses(layout: ModalLayout, props: ModalStyleProps = {}): ModalClasses {
  const { size = 'small', pace = 'default' } = props;
  return {
    root: `${ROOT} ${layout.root}`,
    drag: layout.drag,
    nativeSheet: layout.nativeSheet,
    panel: `${PANEL} ${PACE[pace]} ${layout.panel} ${SIZE[size]}`,
    content: CONTENT,
    chrome: CHROME,
    // Blade DSL's _Modal Header (Figma): 16px in (20px above and beside it
    // from 768px), 16px below, a hairline under it; the close button
    // centred on the title's 28px first line.
    header:
      layout.header ?? 'shrink-0 border-b-thin border-solid border-surface-gray-muted p-4 m:px-5 m:pt-5',
    headerRow: 'relative flex items-start select-none',
    leading: 'me-2 flex shrink-0 items-start',
    leadingIcon: 'flex h-7 items-center',
    titleRow: 'flex min-w-0 items-start gap-2',
    titleSuffix: 'flex h-7 shrink-0 items-center',
    trailing: 'ms-4 flex h-7 shrink-0 items-center',
    titleBlock: 'me-auto flex min-w-0 flex-auto flex-col',
    // The 20px button and 16px beside it.
    closeClearance: 'pr-9',
    // Heading/SmallSemibold (18/24, the heading face) on a 28px line.
    title:
      layout.title ??
      'm-0 pt-0.5 font-heading font-semibold text-300 leading-300 [word-break:break-word] text-surface-gray-normal',
    subtitle:
      'm-0 font-text text-75 leading-75 font-regular [word-break:break-word] text-surface-gray-muted',
    close: `${layout.close ?? CLOSE} w-5 h-5 ${ICON_BUTTON}`,
    floatingClose: `${
      layout.floatingClose ?? FLOATING_CLOSE
    } w-7 h-7 rounded-max bg-popup-gray-subtle ${ICON_BUTTON}`,
    emptyHeader: 'relative h-2 shrink-0',
    body: layout.body ?? 'overflow-auto p-5',
    // Blade DSL's _Modal Footer (Figma): a hairline, then the actions 16px
    // under it, 16px in (20px beside and below from `m`); the caller lays
    // out what is in it.
    footer:
      layout.footer ?? 'shrink-0 border-t-thin border-solid border-surface-gray-muted p-4 m:px-5 m:pb-5',
  };
}

// Blade DSL's Bottom Sheet (Figma). The zone — the handle strip and the
// header — takes the drag, so it must not scroll or pull-to-refresh; the
// grab handle, in the chrome over the strip, is a 56 × 4px pill, 12px from
// the top, 4px above the header. The header is 12px under the strip, 16px
// in and below; its title Body/LargeSemibold (16/24) on a 28px line, the
// close button centred on it. The body and the footer are 16px all round,
// the footer on the sheet's surface under a hairline. The sheet casts its
// shadow upward and rounds its top corners 16px (all four from `m`, where
// it may be a column).
const SHEET: ModalLayout = {
  root: 'items-end justify-center m:justify-end m:p-2',
  panel:
    'w-full rounded-tl-large rounded-tr-large shadow-bottomSheet group-data-[state=closed]:translate-y-full m:rounded-large',
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
    'm-0 pt-0.5 font-text text-200 leading-200 tracking-25 font-semibold [word-break:break-word] text-surface-gray-normal',
  close: 'absolute top-9 right-4',
  floatingClose: 'absolute top-4 right-4',
};

// Blade DSL's _Drawer Header and _Drawer Footer (Figma): the header 20px
// all round with no hairline, its title Heading/SmallSemibold; the footer's
// actions 20px under its hairline and 20px in. The close button centred on
// the title's first line, 20px from the end.
const DRAWER_SECTIONS = {
  header: 'shrink-0 p-5',
  footer: 'shrink-0 border-t-thin border-solid border-surface-gray-muted p-5',
  close: 'absolute top-6 right-5',
};

export const resolveModal: ModalStyleResolver<ModalStyleProps> = (props: ModalStyleProps = {}) => {
  const { variant = 'modal', size = 'small', pace = 'default' } = props;
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
