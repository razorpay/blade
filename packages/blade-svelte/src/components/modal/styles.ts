import type { AxisValue } from '../../axes';
import type { AnalyticsAttributes } from '../../runes/dom/analytics';
import { OVERLAY_ICON_BUTTON } from '../modal-children/styles';
import type { Snippet } from 'svelte';
import type { PlacementSide } from '../../runes/layer/placement';
import type { DialogDismissEvent } from '../../runes/modal/dialog.svelte';
import { OVERLAY_GUTTER } from '../layer/styles';
import type { SurfaceClasses } from '../layer/styles';

/**
 * The parts of a floating panel: FloatingPanel measures and places it
 * (inline left/top) in the overlay host. Enter/exit ride the panel's
 * `data-state`, as everywhere.
 */
export interface FloatingClasses {
  /** The floating element. */
  panel: string;
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
 * extra wiring.
 */
export interface ModalClasses extends SurfaceClasses {
  /** The close button, in the chrome, level with the title. */
  close: string;
  /** The close button when there is no header: floating at the top edge. */
  floatingClose: string;
  /** Holds the floating close button, where the header would be. */
  emptyHeader: string;
}

export type ModalStyleResolver<P> = (props: P) => ModalClasses;

/**
 * A floating overlay's parts (Popover, Menu): the anchored panel, and the
 * chrome, content and close button inside it. Always a dialog: a menu's
 * panel holds whatever the app puts in it (a CardGroup or an ActionList is
 * a choice list, not `menuitem`s).
 */
export interface FloatingOverlayClasses {
  floating: FloatingClasses;
  content: string;
  chrome: string;
  close: string;
  floatingClose: string;
  emptyHeader: string;
}

/** The blade taxonomy as data: Modal's own axes, the centred dialog's. */
export const MODAL_AXES = {
  size: ['small', 'medium', 'large', 'full'],
  pace: ['default', 'snappy'],
} as const;

type Axis<K extends keyof typeof MODAL_AXES> = AxisValue<typeof MODAL_AXES, K>;

/** Derived from MODAL_AXES: add a value there, never here. */
export interface ModalStyleProps {
  /**
   * The panel's width on desktop (`d`) — Blade's 400, 760 or 1024px column, or
   * `full` to span the host, 8px in. Below `m` every panel spans the host.
   * @default 'small'
   */
  size?: Axis<'size'>;
  /** `snappy`: v2's quick-buy drawer — 250ms, expo-out. */
  pace?: Axis<'pace'>;
}

/**
 * Modal's behaviour props. BottomSheet and Drawer take the same; Popover
 * and Menu take them less `classes`, with their content as props.
 *
 * The `data-analytics-*` attributes land on the dialog element.
 */
export interface ModalBehaviourProps extends Partial<AnalyticsAttributes> {
  isOpen?: boolean;
  /**
   * The user asked it to go — the close button, the backdrop, Escape, back
   * or a drag (`source`) — whether or not it is dismissible. A dismissible
   * modal closes once this returns, and nothing prevents it; otherwise it
   * stays open until `close` is called.
   */
  onDismiss?: (event: DialogDismissEvent) => void;
  /**
   * It opened or closed, whoever asked: a dismissal or `close` (and, on
   * Popover and Menu, the trigger). Not when the owner sets `isOpen`.
   */
  onOpenChange?: (change: { isOpen: boolean }) => void;
  /** The exit finished and the modal left the DOM, whoever closed it. */
  onClosed?: () => void;
  /**
   * Whether a dismissal closes it by itself, and whether the close
   * button shows.
   * @default true
   */
  isDismissible?: boolean;
  role?: 'dialog' | 'alertdialog';
  /**
   * The content: ModalHeader, ModalBody and ModalFooter (or parts built
   * from their classes), or anything that owns its box. `close` closes
   * without a dismissal.
   */
  children?: Snippet<[{ close: () => void }]>;
  /**
   * Things that hang off the panel: a full-width, zero-height box on its
   * top edge that the panel does not clip, and that moves with it. What
   * goes in positions itself — above the panel (`absolute bottom-full`,
   * an illustration) or over it (`absolute top-*`). It sits beside the
   * close button, which lives there too.
   */
  chrome?: Snippet<[{ close: () => void }]>;
  /**
   * The close button's accessible name; the button shows while the modal
   * is dismissible.
   * @default 'Close'
   */
  closeLabel?: string;
  /** Names the overlay when its header has no title. */
  accessibilityLabel?: string;
  /**
   * Takes focus when it opens, in place of the panel: an element inside
   * it, bound with `bind:this`.
   */
  initialFocusRef?: HTMLElement | null;
  /** Lands on the panel, the element that carries the modal role. */
  testID?: string;
  /**
   * Classes in place of Modal's: `root` (where the panel sits in the host)
   * and `panel` (its look and size), each over the base that makes it
   * work; or a function rewriting every class.
   */
  classes?: ModalClassesProp;
  class?: string;
}

// Ported from app/v2/modules/navstack/components/Overlay.svelte and
// app/v2/modules/common/components/Modal.svelte. Semantic tokens only —
// merchant theming reaches every class through the CSS-var seam. Enter/exit
// are CSS transitions keyed on the root's data-state, so an interrupted open
// reverses from where it is; the scrim is the overlay host's (BladeProvider),
// one under every open modal, and fades at the default pace here.
export const PACE: Record<Axis<'pace'>, string> = {
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

// Blade's Modal: centred, scaling and fading in place.
const CENTRED = {
  root: 'items-center justify-center p-4',
  panel:
    'w-full rounded-large shadow-highRaised group-data-[state=closed]:scale-95 group-data-[state=closed]:opacity-0',
};

export const NO_DRAG: ModalClasses['drag'] = {
  isEnabled: false,
  axis: 'y',
  direction: 1,
  zone: '',
  strip: '',
  handle: '',
  grip: '',
};

// The zone takes the drag, so it must not scroll or pull-to-refresh.
export const DRAG_ZONE = 'shrink-0 cursor-grab touch-none select-none active:cursor-grabbing';

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

/** What a surface decides: its boxes per state and the drag. */
export interface SurfaceSpec {
  root: string;
  panel: string;
  drag: ModalClasses['drag'];
  /** Where the close buttons sit in the chrome, over the modal's. */
  close?: string;
  floatingClose?: string;
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
 * A surface's parts (Modal, BottomSheet, Drawer): the fixed root and panel,
 * the pace, the desktop column, the chrome and the close buttons.
 */
export function surfaceClasses(layout: SurfaceSpec, props: ModalStyleProps = {}): ModalClasses {
  const { size = 'small', pace = 'default' } = props;
  return {
    root: `${ROOT} ${layout.root}`,
    drag: layout.drag,
    panel: `${PANEL} ${PACE[pace]} ${layout.panel} ${SIZE[size]}`,
    content: CONTENT,
    chrome: CHROME,
    close: `${layout.close ?? CLOSE} w-5 h-5 ${OVERLAY_ICON_BUTTON}`,
    floatingClose: `${
      layout.floatingClose ?? FLOATING_CLOSE
    } w-7 h-7 rounded-max bg-popup-gray-subtle ${OVERLAY_ICON_BUTTON}`,
    // Blade's empty header: an 8px strip under the floating close.
    emptyHeader: 'relative h-2 shrink-0',
  };
}

// Blade's IconButton, medium: a 16px muted glyph, subtle on hover and
// focus, with the 4px focus ring — a floating panel's close, smaller than a
// modal's.
const FLOATING_PANEL_CLOSE = `${OVERLAY_ICON_BUTTON} rounded-2xsmall`;

/**
 * A floating overlay's parts around its panel (Popover's, Menu's): the
 * chrome, the content box and the close buttons. Its header, body and
 * footer are Popover's (`resolvePopoverHeader`, …, `resolveMenuBody` in
 * `../modal-children`).
 */
export function floatingOverlayClasses(floating: FloatingClasses): FloatingOverlayClasses {
  return {
    floating,
    // A popover's and a menu's gutter alike.
    content: `flex min-h-0 flex-auto flex-col ${OVERLAY_GUTTER.popover}`,
    chrome: CHROME,
    close: `absolute top-4 right-4 w-5 h-5 ${FLOATING_PANEL_CLOSE}`,
    floatingClose: `absolute top-3 right-3 w-6 h-6 rounded-max ${FLOATING_PANEL_CLOSE}`,
    emptyHeader: 'relative h-0 shrink-0',
  };
}

/**
 * The caller's classes for a surface (Modal, BottomSheet, Drawer), in place
 * of the layout's. Each part replaces the layout's own, over the base that
 * makes it work — so a modal can sit anywhere in the host:
 * `{ root: 'items-start justify-end p-6' }` puts it top right.
 */
export interface ModalClassesOverride {
  /**
   * How the root lays the panel out in the host: its alignment and gutter
   * (`items-center justify-center p-4` for a modal). The root stays a
   * positioned flex layer over the host.
   */
  root?: string;
  /**
   * The panel's look, size and enter/exit (width, radius, shadow,
   * transforms). The panel stays the pointer-taking flex column it is, in
   * the overlay's fill and pace. A sheet's or a drawer's drag needs its
   * transform at rest (`translate-y-0`, `translate-x-0`).
   */
  panel?: string;
}

/** Part overrides, or every class the layout resolved, rewritten. */
export type ModalClassesProp = ModalClassesOverride | ((classes: ModalClasses) => ModalClasses);

/** The layout's classes with the caller's in place. */
export function applyModalClasses(
  classes: ModalClasses,
  override: ModalClassesProp | undefined,
  pace: Axis<'pace'> = 'default',
): ModalClasses {
  if (!override) {
    return classes;
  }
  if (typeof override === 'function') {
    return override(classes);
  }
  return {
    ...classes,
    ...(override.root === undefined ? {} : { root: `${ROOT} ${override.root}` }),
    ...(override.panel === undefined ? {} : { panel: `${PANEL} ${PACE[pace]} ${override.panel}` }),
  };
}

/** Blade's Modal: the centred dialog, in its desktop column. */
export const resolveModal: ModalStyleResolver<ModalStyleProps> = (props: ModalStyleProps = {}) => {
  const { size = 'small', pace = 'default' } = props;
  const full = size === 'full';
  return surfaceClasses(
    {
      root: full ? CENTRED_FULL.root : CENTRED.root,
      panel: `${CENTRED.panel} ${full ? CENTRED_FULL.panel : CENTRED_HEIGHT}`,
      drag: NO_DRAG,
    },
    { size, pace },
  );
};
