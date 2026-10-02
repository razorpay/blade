import { defineContext } from './runes/context';
import type { ElementHandle } from './runes/dom/element';
import type { FieldStore } from './runes/form/field.svelte';

/**
 * The injection seam for app services. Styling is NOT here — classes are the
 * component's own (`components/<name>/styles.ts`) and runtime theming is CSS
 * vars only. Every adapter is optional: components run
 * standalone (kitchen-sink, tests) on no-op defaults.
 */
export interface BladeAdapters {
  /** Analytics sink for component lifecycle and interaction events. */
  track?: (event: string, payload?: Record<string, unknown>) => void;
  haptics?: { warning: () => void; medium: () => void };
  /** External key-value store a field's `store` prop mirrors into. */
  fieldStore?: FieldStore;
  /** Focus and scroll the first invalid field's handle after a failed submit. */
  revealField?: (handle: ElementHandle, name: string) => void;
  captureError?: (error: unknown) => void;
  /**
   * An app router's hook into Link: called for a plain click on an internal
   * href. Return true once the navigation is handled, and the browser's is
   * cancelled.
   */
  navigate?: (href: string, event: MouseEvent) => boolean;
}

const ADAPTERS = defineContext<BladeAdapters>('blade-adapters');

/** Call during component init at the app root; descendants read via getAdapters. */
export function provideAdapters(adapters: BladeAdapters): void {
  ADAPTERS.set(adapters);
}

export function getAdapters(): BladeAdapters {
  return ADAPTERS.get() ?? {};
}
