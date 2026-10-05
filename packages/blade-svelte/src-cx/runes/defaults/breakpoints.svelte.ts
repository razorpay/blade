import { createSubscriber } from 'svelte/reactivity';

/** Blade's breakpoint names, smallest first; `base` is below the first width. */
export const BREAKPOINT_NAMES = ['base', 'xs', 's', 'm', 'l', 'xl'] as const;
export type BreakpointName = typeof BREAKPOINT_NAMES[number];

/** Minimum widths in px, per named breakpoint above `base`. */
export type Breakpoints = Partial<Record<Exclude<BreakpointName, 'base'>, number>>;

/**
 * Which breakpoint the viewport is in, tracked. `base` where there is no
 * `matchMedia` (a server render, the native renderer): a breakpoint-aware
 * value then renders its `base` form until the page can measure.
 */
export interface BreakpointState {
  readonly current: BreakpointName;
}

const hasMatchMedia = (): boolean => typeof matchMedia === 'function';

/**
 * A breakpoint tracker over `matchMedia`, one query per width. Reading
 * `current` inside an effect or a template subscribes; with no reader
 * there are no listeners.
 */
export function createBreakpoints(widths: () => Breakpoints): BreakpointState {
  const queries = (): Array<readonly [BreakpointName, string]> =>
    BREAKPOINT_NAMES.filter((name) => name !== 'base' && widths()[name] !== undefined).map(
      (name) =>
        [name, `(min-width: ${widths()[name as Exclude<BreakpointName, 'base'>]}px)`] as const,
    );

  const subscribe = createSubscriber((update) => {
    if (!hasMatchMedia()) {
      return undefined;
    }
    const lists = queries().map(([, query]) => matchMedia(query));
    lists.forEach((list) => list.addEventListener('change', update));
    return () => lists.forEach((list) => list.removeEventListener('change', update));
  });

  return {
    get current() {
      subscribe();
      if (!hasMatchMedia()) {
        return 'base';
      }
      let found: BreakpointName = 'base';
      for (const [name, query] of queries()) {
        if (matchMedia(query).matches) {
          found = name;
        }
      }
      return found;
    },
  };
}

/**
 * The widths the stylesheet was built with, from the `--blade-breakpoint-*`
 * custom properties the preset writes on `:root`. Undefined where there is
 * no document or none are set: the caller falls back to Blade's.
 */
export function readCssBreakpoints(): Breakpoints | undefined {
  if (typeof document === 'undefined' || typeof getComputedStyle !== 'function') {
    return undefined;
  }
  const style = getComputedStyle(document.documentElement);
  const found: Breakpoints = {};
  for (const name of BREAKPOINT_NAMES) {
    if (name === 'base') {
      continue;
    }
    const value = parseFloat(style.getPropertyValue(`--blade-breakpoint-${name}`));
    if (Number.isFinite(value)) {
      found[name] = value;
    }
  }
  return Object.keys(found).length ? found : undefined;
}
