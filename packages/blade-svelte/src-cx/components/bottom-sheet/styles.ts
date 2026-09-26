// BottomSheet: Blade's name over Modal, drawn through the modal's internal
// `look`. Modal imports nothing here, so a plain modal bundles no sheet.
// Apart from index.ts because that re-exports the component, which imports
// these types — one file would be an import cycle.
import type { Component, Snippet } from 'svelte';
import type { AxisValue } from '../../axes';
import type { BackAnswer } from '../../runes/base/back';
import type { DialogCloseSource } from '../../runes/modal/dialog.svelte';
import {
  MODAL_AXES,
  MODAL_PLACEMENT,
  modalClasses,
  type ModalLayout,
  type ModalStyleProps,
  type ModalStyleResolver,
} from '../modal/styles';
import { PHONE_MEDIA } from '../shared/breakpoint';

/** The blade taxonomy as data: the Modal axes a sheet still decides. */
export const BOTTOM_SHEET_AXES = {
  size: MODAL_AXES.size,
  pace: MODAL_AXES.pace,
} as const;

type Axis<K extends keyof typeof BOTTOM_SHEET_AXES> = AxisValue<
  typeof BOTTOM_SHEET_AXES,
  K
>;

/** Derived from BOTTOM_SHEET_AXES: add a value there, never here. */
export interface BottomSheetStyleProps {
  /** The panel's width on desktop; on mobile a sheet spans the viewport. */
  size?: Axis<'size'>;
  /** `snappy`: v2's quick-buy drawer — 250ms, expo-out. */
  pace?: Axis<'pace'>;
  /**
   * A sheet on phones and a modal above the preset's breakpoint: one
   * surface, switched by the viewport. Not an axis: a switch the look
   * reads.
   */
  adaptive?: boolean;
  /**
   * The modal the adaptive sheet is on desktop: centred, or a handle-less
   * panel still on the bottom edge. Read only with `adaptive`; a sheet is
   * always at the bottom.
   */
  placement?: 'center' | 'bottom';
}

/**
 * Blade's BottomSheet, spelt over Modal with `bottomSheetLook` fixed: the
 * same model, layer stack, focus and back, so every prop is the modal's
 * except the one the look decides (`placement`). A sheet is dismissible by
 * default and drag closes it.
 */
export interface BottomSheetBehaviourProps {
  isOpen?: boolean;
  /** Fires once per close the sheet decided itself, with what closed it. */
  onDismiss?: (source: DialogCloseSource) => void;
  /** The exit finished and the sheet left the DOM, whoever closed it. */
  onClosed?: () => void;
  /** Whether the backdrop, Escape, back and a drag may close it. */
  isDismissible?: boolean;
  /**
   * The content may own back: `true` = it handled back, nothing closes;
   * `false` = it cedes, the sheet closes even when not dismissible;
   * `undefined` = no opinion, `isDismissible` rules.
   */
  onBack?: () => BackAnswer;
  role?: 'dialog' | 'alertdialog';
  /** The sheet's name, first in the header: a string or a snippet. */
  title?: string | Snippet;
  /** The rest of the header, under the title (a subtitle). */
  header?: Snippet;
  /**
   * Content in the preset's padded, scrolling body. `close` is for the
   * content's own actions (a Cancel button). Ignored when `children` is
   * given.
   */
  body?: Snippet<[{ close: () => void }]>;
  footer?: Snippet;
  /** Raw content: no container, no padding — the content owns its box. */
  children?: Snippet<[{ close: () => void }]>;
  /**
   * Localized name of the close button — the library ships no copy. The
   * button exists only when it has a name.
   */
  closeLabel?: string;
  /** Names the sheet when there is no `title`. */
  accessibilityLabel?: string;
  /** Lands on the panel, the element that carries the modal role. */
  testID?: string;
  class?: string;
}

/** The blade BottomSheet: its behaviour props over its style props. */
export type BottomSheetComponent = Component<
  BottomSheetBehaviourProps & BottomSheetStyleProps
>;

// The zone — the handle strip and the header — takes the drag, so it must
// not scroll or pull-to-refresh.
const DRAG = {
  isEnabled: true,
  zone: 'shrink-0 cursor-grab touch-none select-none active:cursor-grabbing',
  handle: 'flex justify-center pb-1 pt-2',
  grip: 'h-1 w-10 rounded-max bg-interactive-gray-faded',
};
// On desktop the adaptive sheet is a modal: no handle, no grab cursor, and
// the drag itself stops at the same breakpoint.
const ADAPTIVE_DRAG = {
  ...DRAG,
  media: PHONE_MEDIA,
  zone: `${DRAG.zone} m:cursor-auto m:touch-auto m:select-auto m:active:cursor-auto`,
  handle: `${DRAG.handle} m:hidden`,
};

const NATIVE_BOTTOM_SHEET = {
  'data-draggable': 'true',
  'data-showhandle': 'true',
};

// Blade's sheet casts its shadow upward (bottomSheet.module.css).
const SHEET: ModalLayout = {
  ...MODAL_PLACEMENT.bottom,
  panel:
    'w-full rounded-tl-small rounded-tr-small shadow-bottomSheet group-data-[state=closed]:translate-y-full m:rounded-small',
  drag: DRAG,
  nativeSheet: NATIVE_BOTTOM_SHEET,
};

// The adaptive sheet, centred: the bottom placement below the breakpoint,
// the centre one above it — the closed panel parks off the bottom edge on
// phones and fades and shrinks in place on desktop.
const ADAPTIVE_CENTER: ModalLayout = {
  root: 'items-end justify-center m:items-center m:p-4',
  panel:
    'w-full rounded-tl-small rounded-tr-small shadow-bottomSheet m:shadow-highRaised group-data-[state=closed]:translate-y-full m:rounded-small m:group-data-[state=closed]:translate-y-0 m:group-data-[state=closed]:scale-95 m:group-data-[state=closed]:opacity-0',
  drag: ADAPTIVE_DRAG,
  nativeSheet: NATIVE_BOTTOM_SHEET,
};

// The adaptive sheet on the bottom edge: the sheet's own placement, which
// already rises from the bottom on desktop too; only the handle and the
// drag stop at the breakpoint.
const ADAPTIVE_BOTTOM: ModalLayout = { ...SHEET, drag: ADAPTIVE_DRAG };

// What the look reads: the sheet's props with `placement` as the modal
// spells it, so the look fits the modal's seam (and `openModal`) — `bottom`
// is the one value read, anything else centres.
type SheetLookProps = Omit<BottomSheetStyleProps, 'placement'> &
  Pick<ModalStyleProps, 'placement'>;

function sheetLayout({ adaptive, placement }: SheetLookProps) {
  if (!adaptive) {
    return SHEET;
  }
  return placement === 'bottom' ? ADAPTIVE_BOTTOM : ADAPTIVE_CENTER;
}

/**
 * Modal drawn as Blade's BottomSheet: anchored to the bottom edge with a
 * handle, dragged down to dismiss — or, `adaptive`, that sheet on phones and
 * a modal on desktop, centred or (`placement: 'bottom'`) a handle-less panel
 * on the same edge. What BottomSheet hands Modal, and what
 * `openModal({ look: bottomSheetLook, adaptive })` opens (the phone field's
 * country picker).
 */
export const bottomSheetLook: ModalStyleResolver<SheetLookProps> = (
  props: SheetLookProps = {}
) => modalClasses(sheetLayout(props), props);
