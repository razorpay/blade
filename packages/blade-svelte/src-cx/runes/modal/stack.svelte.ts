import { onDestroy } from 'svelte';
import { getAdapters } from '../../adapters';
import type { LoadHost } from '../base/lazy-component';
import type { OverlayEntry, OverlayStack } from './overlays.svelte';

/** What a rendering host marks on its imperative stack while mounted. */
export interface StackHost<E> extends LoadHost {
  stack: OverlayStack<E>;
  hasHost: boolean;
}

export interface MountedStack<E> {
  /** The stack's entries; tracked by whatever reads it. */
  readonly entries: ReadonlyArray<OverlayEntry<E>>;
}

/**
 * Marks `host` as rendered for as long as the calling component lives,
 * with load failures reported through the adapters: what ModalStack and
 * NavStack do for their stacks. Call during component initialisation.
 */
export function hostLoads(host: LoadHost): void {
  const adapters = getAdapters();
  host.hasHost = true;
  host.reportError = (error) => adapters.captureError?.(error);
  onDestroy(() => {
    host.hasHost = false;
    host.reportError = undefined;
  });
}

/**
 * Marks the stack as hosted for as long as the rendering component lives,
 * with load failures reported through the adapters. Call during component
 * initialisation.
 */
export function hostStack<E>(host: StackHost<E>): MountedStack<E> {
  hostLoads(host);
  return {
    get entries() {
      return host.stack.entries;
    },
  };
}
