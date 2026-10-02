import { defineContext } from '../context';
import {
  createBreakpoints,
  readCssBreakpoints,
  type BreakpointState,
  type Breakpoints,
} from './breakpoints.svelte';
import { atBreakpoint, isResponsive, type Responsive } from './responsive';

/** What one BladeProvider says: an overall size and per-component values. */
export interface DefaultsLayer {
  /**
   * The size every sized control takes unless told otherwise, snapped to
   * the nearest size the control has.
   */
  size?: Responsive<string>;
  /** Per component (by name): style props, each optionally per breakpoint. */
  components?: Record<string, Record<string, unknown> | undefined>;
}

interface DefaultsNode {
  readonly layer: () => DefaultsLayer;
  readonly parent: DefaultsNode | undefined;
  readonly breakpoints: BreakpointState;
}

const DEFAULTS = defineContext<DefaultsNode>('blade-defaults');

/** Blade's widths: `breakpoints` in `@razorpay/blade-core/tokens`. */
export const BLADE_BREAKPOINTS: Breakpoints = {
  xs: 320,
  s: 480,
  m: 768,
  l: 1024,
  xl: 1200,
};

// Without widths from a provider every component shares one tracker, at
// the widths the stylesheet was built with (`--blade-breakpoint-*`), else
// Blade's. Read once: the build does not change under a running page.
let fallback: BreakpointState | undefined;
let fallbackWidths: Breakpoints | undefined;
function fallbackBreakpoints(): BreakpointState {
  fallback ??= createBreakpoints(() => {
    fallbackWidths ??= readCssBreakpoints();
    return fallbackWidths ?? BLADE_BREAKPOINTS;
  });
  return fallback;
}

/**
 * Call during component init (BladeProvider): components below read this
 * layer, then the layers of providers above it. `widths` replaces the
 * enclosing tracker's; omit it to share the parent's.
 */
export function provideDefaults(
  layer: () => DefaultsLayer,
  widths?: () => Breakpoints | undefined
): BreakpointState {
  const parent = DEFAULTS.get();
  const breakpoints = widths
    ? createBreakpoints(
        () => widths() ?? BLADE_BREAKPOINTS
      )
    : (parent?.breakpoints ?? fallbackBreakpoints());
  DEFAULTS.set({ layer, parent, breakpoints });
  return breakpoints;
}

/** The breakpoint tracker in scope: the nearest provider's, else Blade's. */
export function getBreakpoints(): BreakpointState {
  return DEFAULTS.get()?.breakpoints ?? fallbackBreakpoints();
}

// Sizes in order, so an overall size can snap to the scale a component has.
const SIZE_ORDER = ['2xsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge', '2xlarge'];

/**
 * The size nearest `wanted` among `scale`; on a tie, the larger (a touch
 * target errs big). `wanted` outside the order is returned as is if the
 * scale has it.
 */
export function snapSize(wanted: string, scale: readonly string[]): string | undefined {
  if (scale.includes(wanted)) {
    return wanted;
  }
  const at = SIZE_ORDER.indexOf(wanted);
  if (at < 0) {
    return undefined;
  }
  let best: string | undefined;
  let bestDistance = Infinity;
  for (const size of scale) {
    const index = SIZE_ORDER.indexOf(size);
    if (index < 0) {
      continue;
    }
    const distance = Math.abs(index - at);
    if (distance < bestDistance || (distance === bestDistance && index > at)) {
      best = size;
      bestDistance = distance;
    }
  }
  return best;
}

export interface UseDefaultsOptions {
  /**
   * The component's size scale, when it follows the providers' overall
   * `size`. Omit for a component whose size is not density (a modal's
   * column) or that has none.
   */
  sizes?: readonly string[];
}

export interface Defaults<P> {
  /** The props with every unset style prop filled from the providers. Tracked. */
  readonly current: P;
}

/**
 * A component's style props with the providers' defaults: a prop given
 * wins, then — nearest provider first — that provider's value for this
 * component, then its overall `size`; with none, the prop stays unset and
 * the resolver's own default (Blade's) applies. Values given per
 * breakpoint, as props or defaults, resolve against the viewport. Call
 * during component init.
 */
export function useDefaults<P extends object>(
  name: string,
  props: () => P,
  options: UseDefaultsOptions = {}
): Defaults<P> {
  const node = DEFAULTS.get();
  const breakpoints = node?.breakpoints ?? fallbackBreakpoints();

  function fromProviders(key: string): unknown {
    for (let at = node; at; at = at.parent) {
      const layer = at.layer();
      const own = layer.components?.[name]?.[key];
      if (own !== undefined) {
        return atBreakpoint(own as Responsive<unknown>, breakpoints.current);
      }
      if (key === 'size' && options.sizes && layer.size !== undefined) {
        const snapped = snapSize(
          atBreakpoint(layer.size, breakpoints.current),
          options.sizes
        );
        if (snapped !== undefined) {
          return snapped;
        }
      }
    }
    return undefined;
  }

  const current = $derived.by(() => {
    const given = props() as Record<string, unknown>;
    const keys = new Set(Object.keys(given));
    for (let at = node; at; at = at.parent) {
      Object.keys(at.layer().components?.[name] ?? {}).forEach((key) => keys.add(key));
      if (options.sizes && at.layer().size !== undefined) {
        keys.add('size');
      }
    }
    const merged: Record<string, unknown> = {};
    for (const key of keys) {
      const value = given[key];
      if (value !== undefined) {
        merged[key] = isResponsive(value)
          ? atBreakpoint(value as Responsive<unknown>, breakpoints.current)
          : value;
      } else {
        const inherited = fromProviders(key);
        if (inherited !== undefined) {
          merged[key] = inherited;
        }
      }
    }
    return merged as P;
  });

  return {
    get current() {
      return current;
    },
  };
}
