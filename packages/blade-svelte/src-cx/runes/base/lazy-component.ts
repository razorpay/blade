import type { Component } from 'svelte';
import { isPromise } from './promise';

type Module<C> = C | { default: C };

/** A component, or the promise of one (a dynamic import resolves as is). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- a component's props are its own
export type LazyComponent<P extends Record<string, any>> =
  | Component<P>
  | Promise<Module<Component<P>>>;

type AnyComponent = Component<Record<string, unknown>>;

/** The component to render now: undefined while a promised one loads. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- as above
export function readyComponent<P extends Record<string, any>>(
  component: LazyComponent<P>,
): AnyComponent | undefined {
  return isPromise(component) ? undefined : (component as AnyComponent);
}

/**
 * Follows a promised component: `onLoaded` with it once it arrives (a module
 * or its default export), `onError` when the load fails. A component that is
 * already there needs nothing.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- as above
export function loadComponent<P extends Record<string, any>>(
  component: LazyComponent<P>,
  handlers: {
    onLoaded: (component: AnyComponent) => void;
    onError: (error: unknown) => void;
  },
): void {
  if (!isPromise<Module<Component<P>>>(component)) {
    return;
  }
  component
    .then((loaded) => {
      const resolved = typeof loaded === 'function' ? loaded : loaded.default;
      handlers.onLoaded(resolved as AnyComponent);
    })
    .catch(handlers.onError);
}

/**
 * The `update(props)` of an opened component: each patch lands on top of
 * every earlier one, and `apply` gets the whole set.
 */
export function createPropsPatch<P extends object>(
  initial: P,
  apply: (props: Record<string, unknown>) => void,
): (next: Partial<P>) => void {
  let current = { ...initial } as Record<string, unknown>;
  return (next) => {
    current = { ...current, ...next };
    apply(current);
  };
}

/** What a rendering host marks on an imperative stack while mounted. */
export interface LoadHost {
  /** Whether a host is mounted to render what gets opened. */
  hasHost?: boolean;
  /** Set by the mounted host: where load failures are reported. */
  reportError?: (error: unknown) => void;
}
