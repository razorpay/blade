// Drawer: Blade's name over Modal docked to the left or right edge. Apart
// from index.ts because that re-exports the component, which imports these
// types — one file would be an import cycle.
import type { AnalyticsAttributes } from '../../runes/dom/analytics';
import type { Component, Snippet } from 'svelte';
import type { AxisValue } from '../../axes';
import type { DialogDismissEvent } from '../../runes/modal/dialog.svelte';
import { DRAG_ZONE, MODAL_AXES, NO_DRAG, surfaceClasses } from '../modal/styles';
import type { ModalClasses, ModalClassesProp, ModalStyleResolver } from '../modal/styles';

/** The blade taxonomy as data: the drawer's edge, its pace and body. */
export const DRAWER_AXES = {
  side: ['right', 'left'],
  pace: MODAL_AXES.pace,
} as const;

type Axis<K extends keyof typeof DRAWER_AXES> = AxisValue<typeof DRAWER_AXES, K>;

/** Derived from DRAWER_AXES: add a value there, never here. */
export interface DrawerStyleProps {
  /**
   * The edge it docks to: `right`, as Blade's, or `left`. Full height
   * either way, sliding in from its edge.
   * @default 'right'
   */
  side?: Axis<'side'>;
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
 * Blade's Drawer, over the modal machinery: the same model, layer stack,
 * focus and back, so every prop is the modal's.
 *
 * The `data-analytics-*` attributes land on the dialog element: Blade's
 * Drawer puts them on its outer box, which here takes no pointer.
 */
export interface DrawerBehaviourProps extends Partial<AnalyticsAttributes> {
  isOpen?: boolean;
  /**
   * The user asked it to go — the close button, the backdrop, Escape, back
   * or a drag (`source`) — whether or not it is dismissible. A dismissible
   * drawer closes once this returns, and nothing prevents it; otherwise it
   * stays open until `close` is called.
   */
  onDismiss?: (event: DialogDismissEvent) => void;
  /**
   * It closed, by a dismissal or `close`. Not when the owner sets
   * `isOpen`.
   */
  onOpenChange?: (change: { isOpen: boolean }) => void;
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
  /**
   * The content: DrawerHeader, DrawerBody and
   * DrawerFooter (or a part built from their classes),
   * or anything that owns its box. `close` is for the content's own actions.
   */
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
  /** Names the drawer when its header has no title. */
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
   * host) and `panel` (its look and size, e.g. `{ panel: 'h-full w-full d:w-[560px] translate-x-0 group-data-[state=closed]:translate-x-full' }`),
   * each over the base that makes it work; or a function rewriting every
   * class.
   */
  classes?: ModalClassesProp;
  class?: string;
}

/** The blade Drawer: its behaviour props over its style props. */
export type DrawerComponent = Component<DrawerBehaviourProps & DrawerStyleProps>;

// Blade DSL's Drawer (Figma): full height on its edge, 24px short of the
// host's width on phones with square corners; 380px on desktop (`d`), where
// it floats 8px in with large corners, casting Blade's highRaised elevation.
const DRAWER = 'h-full w-[calc(100%_-_1.5rem)] d:w-[380px] shadow-highRaised d:rounded-large';

// Per edge: how the root lays the drawer out, and where the closed one parks.
// The open panel carries a transform at rest (`translate-x-0`): a drag moves
// it by setting the axis's variable, which needs the composed transform on.
const EDGE: Record<Axis<'side'>, { root: string; panel: string }> = {
  right: {
    root: 'items-stretch justify-end d:p-2',
    panel: `${DRAWER} translate-x-0 group-data-[state=closed]:translate-x-full`,
  },
  left: {
    root: 'items-stretch justify-start d:p-2',
    panel: `${DRAWER} translate-x-0 group-data-[state=closed]:-translate-x-full`,
  },
};

// Blade DSL's _Drawer Header (Figma): the close button centred on the
// title's first line, 20px from the end. The sections are DrawerHeader's,
// DrawerBody's and DrawerFooter's.
const DRAWER_CLOSE = 'absolute top-6 right-5';

/** Blade's Drawer: the surface docked to its edge, dragged toward it when draggable. */
export const resolveDrawer: ModalStyleResolver<DrawerStyleProps> = (props = {}) => {
  const { side = 'right', pace = 'default' } = props;
  // Dragged toward its own edge, by its header (there is no handle).
  const drag: ModalClasses['drag'] = props.isDraggable
    ? {
        ...NO_DRAG,
        isEnabled: true,
        axis: 'x',
        direction: side === 'right' ? 1 : -1,
        zone: DRAG_ZONE,
      }
    : NO_DRAG;
  // A drawer has its own width: no column over it.
  return surfaceClasses({ ...EDGE[side], close: DRAWER_CLOSE, drag }, { size: 'full', pace });
};
