// BottomSheet: Blade's name over Modal in its `sheet` variant. Apart from
// index.ts because that re-exports the component, which imports these
// types — one file would be an import cycle.
import type { Component, Snippet } from 'svelte';
import type { AxisValue } from '../../axes';
import type { ResponsiveProps } from '../../runes/defaults/responsive';
import type { DialogDismissEvent } from '../../runes/modal/dialog.svelte';
import { MODAL_AXES } from '../modal/styles';

/**
 * The blade taxonomy as data: the Modal axes a sheet still decides. Blade
 * DSL's Bottom Sheet (Figma) has no sizes: on phones it spans the viewport,
 * and from `m` it is the small (400px) column.
 */
export const BOTTOM_SHEET_AXES = {
  variant: ['sheet', 'modal'],
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
  /**
   * `sheet` (the default here): anchored to the bottom with a handle,
   * dragged down to dismiss; `modal`: the modal variant. Per breakpoint,
   * it is the adaptive sheet: `{ base: 'sheet', m: 'modal' }`.
   * @default 'sheet'
   */
  variant?: Axis<'variant'>;
}

/**
 * Blade's BottomSheet, spelt over Modal in its `sheet` variant: the same
 * model, layer stack, focus and back, so every prop is the modal's. A sheet is dismissible by
 * default and drag closes it.
 */
export interface BottomSheetBehaviourProps {
  isOpen?: boolean;
  /**
   * The user asked it to go — the close button, the backdrop, Escape, back
   * or a drag (`source`) — whether or not it is dismissible. A dismissible
   * sheet closes once this returns, and nothing prevents it; otherwise it
   * stays open until `close` is called.
   */
  onDismiss?: (event: DialogDismissEvent) => void;
  /** The exit finished and the sheet left the DOM, whoever closed it. */
  onClosed?: () => void;
  /**
   * Whether a dismissal closes it by itself, and whether the close
   * button shows.
   * @default true
   */
  isDismissible?: boolean;
  role?: 'dialog' | 'alertdialog';
  /** The sheet's name, first in the header: a string or a snippet. */
  title?: string | Snippet;
  /** One muted line under the title; it describes the sheet. */
  subtitle?: string;
  /** Before the title: an asset in Figma's 32px box, 8px from it. */
  leading?: Snippet;
  /** Beside the title, 8px from it: a Counter or a Badge. */
  titleSuffix?: Snippet;
  /**
   * After the title block, 16px clear of it and of the close button: a
   * Badge, text, a Link or an action.
   */
  trailing?: Snippet<[{ close: () => void }]>;
  /**
   * The header's content, around the drawn title and subtitle: it receives
   * them as snippets (`title`, `subtitle`; each renders nothing when its
   * prop is unset) and places them with anything else — a badge beside the
   * title, a back button, a line under them. Render `title`: it names the
   * sheet. Without `header` the two render on their own.
   */
  header?: Snippet<[{ title: Snippet; subtitle: Snippet; close: () => void }]>;
  /**
   * Content in the preset's padded, scrolling body. `close` is for the
   * content's own actions (a Cancel button). Ignored when `children` is
   * given.
   */
  body?: Snippet<[{ close: () => void }]>;
  /** `close` is for the footer's own actions (Cancel, Done). */
  footer?: Snippet<[{ close: () => void }]>;
  /** Raw content: no container, no padding — the content owns its box. */
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
  /** Names the sheet when there is no `title`. */
  accessibilityLabel?: string;
  /** Lands on the panel, the element that carries the modal role. */
  testID?: string;
  class?: string;
}

/** The blade BottomSheet: its behaviour props over its style props. */
export type BottomSheetComponent = Component<
  BottomSheetBehaviourProps & ResponsiveProps<BottomSheetStyleProps>
>;
