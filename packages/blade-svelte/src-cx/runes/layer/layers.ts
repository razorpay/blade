import { getContext, setContext } from 'svelte';
import type { BackAnswer } from '../base/back';
import { createLayerStack, type Layer } from '../base/layer-stack.svelte';

/** What an open surface (modal, sheet, drawer) answers to the stack. */
export interface LayerEntry {
  /**
   * Escape pressed, or the shared scrim tapped, while this layer is on
   * top. Returns whether it closed.
   */
  dismiss(source: 'escape' | 'blur'): boolean;
  /** Back pressed while this layer is on top. */
  back(): BackAnswer;
}

export interface Layers {
  /** Adds an open surface on top; the returned function removes it. */
  push(entry: LayerEntry): () => void;
  /** Tracked by whatever reads it. */
  isTop(entry: LayerEntry): boolean;
  /** The top entry, undefined with nothing open. Tracked by whatever reads it. */
  readonly top: LayerEntry | undefined;
  /**
   * Back pressed: the app's back handler calls this before its own
   * navigation. Returns whether a layer handled it.
   */
  back(): boolean;
  /** The scrim was tapped: asks the top layer to dismiss. Returns whether it closed. */
  dismissTop(source: 'blur'): boolean;
  /**
   * The LayerHost's element: non-modal overlays (tooltips, popovers,
   * toasts) render into it, above the surfaces box.
   */
  host(): HTMLElement | undefined;
  /** The host's box modal surfaces render into; undefined without a web host. */
  surfaces(): HTMLElement | undefined;
  /** The host's one scrim under every open modal; undefined without a web host. */
  scrim(): HTMLElement | undefined;
  setHost(element: HTMLElement | undefined, parts?: LayerHostParts): void;
}

/** What a web LayerHost registers beside its element. */
export interface LayerHostParts {
  surfaces?: HTMLElement;
  scrim?: HTMLElement;
}

/**
 * Coordinates the open surfaces of one app: stacking order, a single Escape
 * listener that reaches only the top layer, and the back answer. The key
 * listener exists only while a layer is open.
 */
export function createLayers(): Layers {
  const stack = createLayerStack<LayerEntry>();
  let hostElement: HTMLElement | undefined;
  let hostParts: LayerHostParts = {};
  let listening = false;

  const top = (): Layer<LayerEntry> | undefined => stack.top();

  function onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && top()?.entry.dismiss('escape')) {
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
    host: () => hostElement,
    surfaces: () => hostParts.surfaces,
    scrim: () => hostParts.scrim,
    setHost(element, parts = {}) {
      hostElement = element;
      hostParts = element ? parts : {};
    },
  };
}

/** Used when no provider is set up: tests, the explorer, a single-root app. */
export const globalLayers = createLayers();

const LAYERS = Symbol('blade-layers');

/** Call during component init at the app root to scope layers to that tree. */
export function provideLayers(): Layers {
  const layers = createLayers();
  setContext(LAYERS, layers);
  return layers;
}

export function getLayers(): Layers {
  return getContext<Layers | undefined>(LAYERS) ?? globalLayers;
}
