import { createSubscriber } from 'svelte/reactivity';
import type { BackAnswer } from '../base/back';
import { createLayerStack } from '../base/layer-stack.svelte';
import type { Layer } from '../base/layer-stack.svelte';

/** What an open overlay answers to the stack. */
export interface LayerEntry {
  /**
   * A modal surface (modal, sheet, drawer): it owns the scrim, inerts the
   * rest and answers back. A floating one (popover, menu, tooltip) only
   * answers Escape while it is the topmost layer. Default true.
   */
  isModal?: boolean;
  /**
   * Escape pressed, or the shared scrim tapped, while this layer is on
   * top. Returns whether it closed.
   */
  dismiss(source: 'escape' | 'blur'): boolean;
  /** Back pressed while this layer is the top modal one. */
  back(): BackAnswer;
}

export interface Layers {
  /** Adds an open overlay on top; the returned function removes it. */
  push(entry: LayerEntry): () => void;
  /** Whether it is the top modal layer. Tracked by whatever reads it. */
  isTop(entry: LayerEntry): boolean;
  /** The top modal entry, undefined with none open. Tracked by whatever reads it. */
  readonly top: LayerEntry | undefined;
  /**
   * Back pressed: the app's back handler calls this before its own
   * navigation. Returns whether a layer handled it.
   */
  back(): boolean;
  /** The scrim was tapped: asks the top layer to dismiss. Returns whether it closed. */
  dismissTop(source: 'blur'): boolean;
  /**
   * The overlay host's element: non-modal overlays (tooltips, popovers,
   * toasts) render into it, above the surfaces box. Tracked by whatever
   * reads it: the host mounts after the content, so an overlay open on the
   * first render moves in once it is there.
   */
  host(): HTMLElement | undefined;
  /** The host's box modal surfaces render into; undefined without a host. Tracked. */
  surfaces(): HTMLElement | undefined;
  /** The host's one scrim under every open modal; undefined without a host. Tracked. */
  scrim(): HTMLElement | undefined;
  setHost(element: HTMLElement | undefined, parts?: OverlayHostParts): void;
}

/** What BladeProvider's overlay host registers beside its element. */
export interface OverlayHostParts {
  surfaces?: HTMLElement;
  scrim?: HTMLElement;
}

/**
 * Coordinates the open overlays of one app: stacking order, a single Escape
 * listener that reaches only the topmost one — floating or modal — and the
 * back answer, the top modal one's. The key listener exists only while a
 * layer is open.
 */
export function createLayers(): Layers {
  const stack = createLayerStack<LayerEntry>();
  // The host's parts are read by whatever renders into them; a plain `.ts`
  // file has no runes, so a subscriber (`hostChanged`) tells the readers.
  let hostElement: HTMLElement | undefined, hostChanged: (() => void) | undefined;
  let hostParts: OverlayHostParts = {};
  let listening = false;
  const watchHost = createSubscriber((update) => {
    hostChanged = update;
    return () => {
      hostChanged = undefined;
    };
  });

  // Floating layers sit among the modal ones but take no part in the
  // scrim, the inert page or back.
  function top(): Layer<LayerEntry> | undefined {
    const list = stack.entries;
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].entry.isModal !== false) {
        return list[i];
      }
    }
    return undefined;
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && stack.top()?.entry.dismiss('escape')) {
      event.preventDefault();
    }
  }

  function syncListener(): void {
    const needed = stack.size() > 0;
    if (needed === listening || typeof document === 'undefined') {
      return;
    }
    listening = needed;
    if (needed) {
      document.addEventListener('keydown', onKeyDown);
    } else {
      document.removeEventListener('keydown', onKeyDown);
    }
  }

  return {
    push(entry) {
      const layer = stack.push(entry);
      syncListener();
      return () => {
        layer.close();
        syncListener();
      };
    },
    isTop: (entry) => top()?.entry === entry,
    get top() {
      return top()?.entry;
    },
    back() {
      const current = top();
      if (!current) {
        return false;
      }
      // An open surface always decides; one that defers is already closing.
      return current.entry.back() ?? false;
    },
    dismissTop: (source) => top()?.entry.dismiss(source) ?? false,
    host() {
      watchHost();
      return hostElement;
    },
    surfaces() {
      watchHost();
      return hostParts.surfaces;
    },
    scrim() {
      watchHost();
      return hostParts.scrim;
    },
    setHost(element, parts = {}) {
      hostElement = element;
      hostParts = element ? parts : {};
      hostChanged?.();
    },
  };
}

/**
 * The page's one coordinator: every overlay joins it, inside a
 * BladeProvider or not, and the outermost provider hosts it.
 */
export const globalLayers = createLayers();

/** The layers an overlay joins. Call during component init. */
export function getLayers(): Layers {
  return globalLayers;
}

/**
 * Back pressed: asks the open overlays — the top modal one answers — and
 * returns whether one handled it. An app's back handler calls it before its
 * own navigation; from a component or a `.ts` flow alike.
 */
export function back(): boolean {
  return globalLayers.back();
}
