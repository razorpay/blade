// Drawer: Blade's name over Modal docked to the left or right edge. Apart
// from index.ts because that re-exports the component, which imports these
// types — one file would be an import cycle.
import type { Component, Snippet } from 'svelte';
import type { AxisValue } from '../../axes';
import type { ResponsiveProps } from '../../runes/defaults/responsive';
import type { DialogDismissEvent } from '../../runes/modal/dialog.svelte';
import { MODAL_AXES } from '../modal/styles';

/** The blade taxonomy as data: the drawer variants (its edge), and its pace. */
export const DRAWER_AXES = {
  variant: ['drawer', 'left-drawer'],
  pace: MODAL_AXES.pace,
} as const;

type Axis<K extends keyof typeof DRAWER_AXES> = AxisValue<typeof DRAWER_AXES, K>;

/** Derived from DRAWER_AXES: add a value there, never here. */
export interface DrawerStyleProps {
  /**
   * `drawer`: on the right edge, as Blade's; `left-drawer`: on the left.
   * Full height either way, sliding in from its edge.
   * @default 'drawer'
   */
  variant?: Axis<'variant'>;
  /**
   * `snappy`: v2's quick-buy drawer — 250ms, expo-out.
   * @default 'default'
   */
  pace?: Axis<'pace'>;
  /**
   * Whether it can be dragged toward its edge to dismiss, by its header.
   * @default false
   */
  isDraggable?: boolean;
}

/**
 * Blade's Drawer, spelt over Modal in a drawer variant: the same model,
 * layer stack, focus and back, so every prop is the modal's.
 */
export interface DrawerBehaviourProps {
  isOpen?: boolean;
  /**
   * The user asked it to go — the close button, the backdrop, Escape, back
   * or a drag (`source`) — whether or not it is dismissible. A dismissible
   * drawer closes once this returns, and nothing prevents it; otherwise it
   * stays open until `close` is called.
   */
  onDismiss?: (event: DialogDismissEvent) => void;
  /** The exit finished and the drawer left the DOM, whoever closed it. */
  onClosed?: () => void;
  /**
   * Whether a dismissal closes it by itself, and whether the close
   * button shows.
   * @default true
   */
  isDismissible?: boolean;
  /** @default 'dialog' */
  role?: 'dialog' | 'alertdialog';
  /** The drawer's name, first in the header: a string or a snippet. */
  title?: string | Snippet;
  /** One muted line under the title; it describes the drawer. */
  subtitle?: string;
  /**
   * The header's content, around the drawn title and subtitle: it receives
   * them as snippets (`title`, `subtitle`; each renders nothing when its
   * prop is unset) and places them with anything else — a badge beside the
   * title, a back button, a line under them. Render `title`: it names the
   * drawer. Without `header` the two render on their own.
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
   * over it (`absolute top-*`) — beside the close button.
   */
  chrome?: Snippet<[{ close: () => void }]>;
  /**
   * The close button's accessible name; the button shows while the drawer
   * is dismissible.
   * @default 'Close'
   */
  closeLabel?: string;
  /** Names the drawer when there is no `title`. */
  accessibilityLabel?: string;
  /** Lands on the panel, the element that carries the modal role. */
  testID?: string;
  class?: string;
}

/** The blade Drawer: its behaviour props over its style props. */
export type DrawerComponent = Component<DrawerBehaviourProps & ResponsiveProps<DrawerStyleProps>>;
