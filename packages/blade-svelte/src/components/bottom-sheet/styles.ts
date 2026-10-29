// BottomSheet: Blade's BottomSheet over the modal machinery. Apart from
// index.ts because that re-exports the component, which imports these
// types — one file would be an import cycle.
import type { AnalyticsAttributes } from '../../runes/dom/analytics';
import type { Component, Snippet } from 'svelte';
import type { AxisValue } from '../../axes';
import type { DialogDismissEvent } from '../../runes/modal/dialog.svelte';
import { DRAG_ZONE, MODAL_AXES, NO_DRAG, surfaceClasses } from '../modal/styles';
import type { ModalClassesProp, ModalStyleResolver, SurfaceSpec } from '../modal/styles';

/**
 * The blade taxonomy as data: the Modal axes a sheet still decides. Blade
 * DSL's Bottom Sheet (Figma) has no sizes: on phones it spans the viewport,
 * and on desktop (`d`) it is the small (400px) column.
 */
export const BOTTOM_SHEET_AXES = {
  pace: MODAL_AXES.pace,
} as const;

type Axis<K extends keyof typeof BOTTOM_SHEET_AXES> = AxisValue<typeof BOTTOM_SHEET_AXES, K>;

/** Derived from BOTTOM_SHEET_AXES: add a value there, never here. */
export interface BottomSheetStyleProps {
  /** `snappy`: v2's quick-buy drawer — 250ms, expo-out. */
  pace?: Axis<'pace'>;
  /**
   * Whether it can be dragged down to dismiss, by its handle strip and
   * header. The handle shows only while it can.
   * @default true
   */
  isDraggable?: boolean;
}

/**
 * Blade's BottomSheet, over the modal machinery: the same model, layer
 * stack, focus and back, so every prop is the modal's. A sheet is dismissible by
 * default and drag closes it.
 *
 * The `data-analytics-*` attributes land on the dialog element.
 */
export interface BottomSheetBehaviourProps extends Partial<AnalyticsAttributes> {
  isOpen?: boolean;
  /**
   * The user asked it to go — the close button, the backdrop, Escape, back
   * or a drag (`source`) — whether or not it is dismissible. A dismissible
   * sheet closes once this returns, unless the event's `preventDefault` was
   * called (to ask first); otherwise it stays open until `close` is called.
   */
  onDismiss?: (event: DialogDismissEvent) => void;
  /**
   * It closed, by a dismissal or `close`. Not when the owner sets
   * `isOpen`.
   */
  onOpenChange?: (change: { isOpen: boolean }) => void;
  /** The exit finished and the sheet left the DOM, whoever closed it. */
  onClosed?: () => void;
  /**
   * Whether a dismissal closes it by itself, and whether the close
   * button shows.
   * @default true
   */
  isDismissible?: boolean;
  role?: 'dialog' | 'alertdialog';
  /**
   * The content: BottomSheetHeader, BottomSheetBody and
   * BottomSheetFooter (or a part built from their classes),
   * or anything that owns its box. `close` is for the content's own actions.
   */
  children?: Snippet<[{ close: () => void }]>;
  /**
   * Things that hang off the panel: a full-width, zero-height box on its
   * top edge that the panel does not clip, and that moves with it. What
   * goes in positions itself — above the panel (`absolute bottom-full`) or
   * over it (`absolute top-*`) — beside the close button and the handle.
   */
  chrome?: Snippet<[{ close: () => void }]>;
  /**
   * The close button's accessible name; the button shows while the sheet
   * is dismissible.
   * @default 'Close'
   */
  closeLabel?: string;
  /** Names the sheet when its header has no title. */
  accessibilityLabel?: string;
  /**
   * Takes focus when it opens, in place of the panel: an element inside
   * it, bound with `bind:this`.
   */
  initialFocusRef?: HTMLElement | null;
  /** Lands on the panel, the element that carries the modal role. */
  testID?: string;
  /**
   * Classes in place of the layout's: `root` (where the panel sits in the
   * host) and `panel` (its look and size, e.g. `{ panel: 'w-full d:w-[480px] rounded-t-large translate-y-0 group-data-[state=closed]:translate-y-full' }`),
   * each over the base that makes it work; or a function rewriting every
   * class.
   */
  classes?: ModalClassesProp;
  class?: string;
}

/** The blade BottomSheet: its behaviour props over its style props. */
export type BottomSheetComponent = Component<BottomSheetBehaviourProps & BottomSheetStyleProps>;

// Blade DSL's Bottom Sheet (Figma). The zone — the handle strip and the
// header — takes the drag, so it must not scroll or pull-to-refresh; the
// grab handle, in the chrome over the strip, is a 56 × 4px pill, 12px from
// the top, 4px above the header. The header is 12px under the strip, 16px
// in and below; its title Body/LargeSemibold (16/24) on a 28px line, the
// close button centred on it. The body and the footer are 16px all round,
// the footer on the sheet's surface under a hairline. The sheet casts its
// shadow upward and rounds its top corners 16px (all four on desktop, where
// it floats 8px in at the end).
const SHEET: SurfaceSpec = {
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
  close: 'absolute top-9 right-4',
  floatingClose: 'absolute top-4 right-4',
};

/** Blade's BottomSheet: the surface on the bottom edge, with its handle while draggable. */
export const resolveBottomSheet: ModalStyleResolver<BottomSheetStyleProps> = (props = {}) => {
  const { pace = 'default' } = props;
  if (props.isDraggable ?? true) {
    return surfaceClasses(SHEET, { pace });
  }
  // Not draggable: no handle, no strip, so the header starts 16px down and
  // the close button sits where a modal's does.
  const { drag: _drag, close: _close, floatingClose: _floating, ...still } = SHEET;
  return surfaceClasses({ ...still, close: 'absolute top-5 right-4', drag: NO_DRAG }, { pace });
};
