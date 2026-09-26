import { onDestroy } from 'svelte';
import { getAdapters } from '../../adapters';
import {
  type Nav,
  type NavContent,
  type NavDirection,
  type NavEntry,
} from './nav';

export interface ShownScreen {
  layer: NavEntry;
  content: NavContent;
  Content: NonNullable<NavContent['component']>;
}

export interface NavStackOptions {
  nav: Nav;
  /** The screen on show changed. */
  onChange?: (entry: NavEntry | undefined, direction: NavDirection) => void;
}

export interface NavStackBinding {
  /** The topmost screen whose component has loaded. */
  readonly shown: ShownScreen | undefined;
  /** A screen is on the stack that cannot show yet. */
  readonly isBusy: boolean;
  /** The first screen on show does not slide in. */
  isFirst(id: number): boolean;
}

/**
 * Hosts the nav for as long as the rendering stack is mounted, and picks
 * the screen to show: the topmost whose component has loaded, so a
 * promised screen joins at once but shows only when it can. Call during
 * component initialisation.
 */
export function createNavStack(options: NavStackOptions): NavStackBinding {
  const { nav } = options;
  const adapters = getAdapters();

  nav.hasHost = true;
  nav.reportError = (error) => adapters.captureError?.(error);
  onDestroy(() => {
    nav.hasHost = false;
    nav.reportError = undefined;
  });

  // The first screen on show does not slide in.
  const first: { id?: number } = {};

  // A fresh object per change: `update` swaps an entry's content in place.
  const shown = $derived.by((): ShownScreen | undefined => {
    const stack = nav.entries;
    for (let i = stack.length - 1; i >= 0; i--) {
      const { id, entry } = stack[i];
      if (entry.component) {
        first.id = first.id === undefined || first.id === id ? id : -1;
        return { layer: stack[i], content: entry, Content: entry.component };
      }
    }
    return undefined;
  });
  const isBusy = $derived.by(() => {
    const stack = nav.entries;
    return stack.length > 0 && stack[stack.length - 1] !== shown?.layer;
  });

  let lastShown: number | undefined;
  $effect(() => {
    const id = shown?.layer.id;
    if (id !== lastShown) {
      lastShown = id;
      options.onChange?.(shown?.layer, nav.direction);
    }
  });

  return {
    get shown() {
      return shown;
    },
    get isBusy() {
      return isBusy;
    },
    isFirst: (id) => id === first.id,
  };
}
