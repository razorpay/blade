import { onDestroy } from 'svelte';
import { getAdapters } from '../../adapters';
import type { OverlayEntry, OverlayStack } from './overlays.svelte';

/** What a rendering host marks on its imperative stack while mounted. */
export interface StackHost<E> {
  stack: OverlayStack<E>;
  hasHost: boolean;
  reportError?: (error: unknown) => void;
}

export interface MountedStack<E> {
  /** The stack's entries; tracked by whatever reads it. */
  readonly entries: ReadonlyArray<OverlayEntry<E>>;
}

/**
 * Marks the stack as hosted for as long as the rendering component lives,
 * with load failures reported through the adapters. Call during component
 * initialisation.
 */
export function hostStack<E>(host: StackHost<E>): MountedStack<E> {
  const adapters = getAdapters();
  host.hasHost = true;
  host.reportError = (error) => adapters.captureError?.(error);
  onDestroy(() => {
    host.hasHost = false;
    host.reportError = undefined;
  });
  return {
    get entries() {
      return host.stack.entries;
    },
  };
}
