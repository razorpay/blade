import { mount, unmount } from 'svelte';
import type { Component } from 'svelte';
import Run from './fixtures/Run.svelte';

export interface Ran<T> {
  value: T;
  unmount(): void;
}

/**
 * Runs `setup` inside a mounted component, as a rune is called from one:
 * context is readable and `onDestroy` registers. `context` seeds
 * `getContext` for the run.
 */
export function run<T>(setup: () => T, options: { context?: Map<unknown, unknown> } = {}): Ran<T> {
  let value: T | undefined;
  const target = document.body.appendChild(document.createElement('div'));
  const app = mount(Run as Component<{ setup: () => T; onReady: (value: T) => void }>, {
    target,
    context: options.context,
    props: {
      setup,
      onReady: (ready) => {
        value = ready;
      },
    },
  });
  return {
    value: value as T,
    unmount: () => {
      void unmount(app);
      target.remove();
    },
  };
}
