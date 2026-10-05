import { untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { captureFocusReturn, trappedTabTarget } from '../dom/focus';
import { createNodeRef } from '../dom/node.svelte';
import { createSheetDrag } from './sheet-drag';
import { getLayers } from './layers';
import { portal } from './portal';
import { createPresence } from './presence';

export interface SurfaceOptions {
  isOpen: () => boolean;
  /** Lower layers go inert so only the top surface takes focus and input. */
  isTop: () => boolean;
  /** Whether a drag may close it; a sheet that may not resists. */
  isDismissible: () => boolean;
  /** A media query the drag is confined to, when the styles give one. */
  dragMedia: () => string | undefined;
  /** The way out: the axis the drag follows, and its sign along it. */
  dragAxis: () => { axis: 'x' | 'y'; direction: 1 | -1 };
  /** The user dragged or flung the sheet away; the owner's model decides. */
  onDismissRequest: (source: 'drag') => void;
}

export interface Surface {
  readonly presence: ReturnType<typeof createPresence>;
  /** On the root: renders it into the LayerHost's surfaces box. */
  readonly toHost: Attachment<HTMLElement>;
  /** On the panel: the element focus and the drag act on. */
  readonly panel: Attachment<HTMLElement>;
  handleKeyDown(event: KeyboardEvent): void;
  handleDragStart(event: PointerEvent): void;
  handleDragMove(event: PointerEvent): void;
  handleDragEnd(): void;
  handleDragCancel(): void;
}

/**
 * The web half of an overlay surface: everything DOM-bound (presence,
 * portal, focus, Tab trap, drag-to-dismiss). Call during component
 * initialisation; the native twin uses `createNativeSurface`.
 */
export function createSurface(options: SurfaceOptions): Surface {
  const layers = getLayers();
  const panel = createNodeRef<HTMLElement>();

  // Where focus returns on close: what had it the moment the surface opened,
  // captured before the page beneath goes inert and the browser drops it.
  // It is handed back after the closing flush, once the page is no longer
  // inert: a focus call on an inert element silently fails.
  $effect(() => {
    if (!options.isOpen()) {
      return undefined;
    }
    return untrack(() => {
      const restore = captureFocusReturn(() => panel.current);
      return () => queueMicrotask(restore);
    });
  });

  // Focus moves in once the panel is mounted and the surface is the top
  // layer: until both, the panel is missing or inert (`inert={!isTop}`), and
  // a focus call would silently fail — a child's effects run before its
  // owner's, so this runs before the dialog has pushed its layer. Reading
  // `isTop` also brings focus back in when a surface above it closes without
  // returning focus here. Content with its own autoFocus has already taken
  // focus. The panel is still at its closed position (translated off the
  // host), and an overflow-hidden host would scroll to reveal it: never
  // scroll.
  $effect(() => {
    const node = panel.current;
    if (!options.isOpen() || !options.isTop() || !node) {
      return;
    }
    untrack(() => {
      if (!node.contains(document.activeElement)) {
        node.focus({ preventScroll: true });
      }
    });
  });

  const presence = createPresence(() => [panel.current]);

  // Drag-to-dismiss, when the classes enable it (a sheet, down; a drawer,
  // toward its edge). Positions are read along the way out, so the pure
  // model only ever sees a pull in the positive direction. The decisions
  // are the pure `createSheetDrag`; here the panel follows the finger with
  // an inline transform and its transition off, and the host's scrim thins
  // with it — only while this is the top layer, so a sheet under another
  // surface never touches the shared scrim. Clearing both on release lets
  // the CSS transitions carry them home — or out, from where the sheet was
  // dropped, when the owner closes it.
  const drag = createSheetDrag({ dismissible: options.isDismissible });

  function follow(offset: number): void {
    const node = panel.current;
    if (!node) {
      return;
    }
    const dragging = drag.isDragging();
    node.style.transition = dragging ? 'none' : '';
    const { axis, direction } = options.dragAxis();
    node.style.transform = dragging
      ? `translate${axis.toUpperCase()}(${offset * direction}px)`
      : '';
    const scrim = options.isTop() ? layers.scrim() : undefined;
    if (scrim) {
      scrim.style.transition = dragging ? 'none' : '';
      scrim.style.opacity = dragging ? String(1 - Math.min(1, offset / (extent(node) || 1))) : '';
    }
  }

  // Where the pointer is along the way out.
  function along(event: PointerEvent): number {
    const { axis, direction } = options.dragAxis();
    return (axis === 'x' ? event.clientX : event.clientY) * direction;
  }

  // The panel's length along the way out.
  function extent(node: HTMLElement): number {
    return options.dragAxis().axis === 'x' ? node.offsetWidth : node.offsetHeight;
  }

  // The styles may confine the drag to a media query; where it does not
  // match — or cannot be asked — the zone is plain content.
  function mayDrag(): boolean {
    const media = options.dragMedia();
    return !media || typeof matchMedia !== 'function' || matchMedia(media).matches;
  }

  return {
    presence,
    // Surfaces render into the LayerHost's surfaces box when the app mounted
    // one, so they stay inside its frame under its one scrim; without a host
    // they render in place, unscrimmed.
    toHost: portal(() => layers.surfaces() ?? layers.host()),
    panel: panel.attach,
    handleKeyDown(event) {
      const node = panel.current;
      if (event.key !== 'Tab' || !node) {
        return;
      }
      const target = trappedTabTarget(node, document.activeElement, event.shiftKey);
      if (target) {
        event.preventDefault();
        target.focus();
      }
    },
    handleDragStart(event) {
      if (!mayDrag()) {
        return;
      }
      drag.start(along(event), event.timeStamp);
    },
    handleDragMove(event) {
      if (!drag.isDragging()) {
        return;
      }
      const offset = drag.move(along(event), event.timeStamp);
      // Captured only once it moves: a plain press on something interactive
      // inside the header must still reach it as a click.
      if (offset > 0) {
        (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
      }
      follow(offset);
    },
    handleDragEnd() {
      if (!drag.isDragging()) {
        return;
      }
      const node = panel.current;
      const outcome = drag.end(node ? extent(node) : 0);
      follow(0);
      if (outcome === 'dismiss') {
        options.onDismissRequest('drag');
      }
    },
    handleDragCancel() {
      drag.cancel();
      follow(0);
    },
  };
}

/**
 * The native half: the platform plays the exit after the element unmounts,
 * so there is nothing to wait for and closing is reported at once. Call
 * during component initialisation.
 */
export function createNativeSurface(options: {
  isOpen: () => boolean;
  onClosed: () => void;
}): void {
  let wasOpen = false;
  $effect(() => {
    if (options.isOpen()) {
      wasOpen = true;
    } else if (wasOpen) {
      wasOpen = false;
      options.onClosed();
    }
  });
}
