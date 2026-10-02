import { BREAKPOINT_NAMES, type BreakpointName } from './breakpoints.svelte';

/**
 * A value, or one per breakpoint, mobile first: `{ base: 'sheet', m:
 * 'modal' }` is a sheet below `m` and a modal from `m` up.
 */
export type Responsive<T> =
  | T
  | ({ base: T } & Partial<Record<Exclude<BreakpointName, 'base'>, T>>);

/** Each property of `P` may be given per breakpoint. */
export type ResponsiveProps<P> = { [K in keyof P]?: Responsive<P[K]> };

export function isResponsive(value: unknown): value is { base: unknown } {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.hasOwnProperty.call(value, 'base')
  );
}

/** The value for the breakpoint: its own, else the nearest smaller one's. */
export function atBreakpoint<T>(value: Responsive<T>, current: BreakpointName): T {
  if (!isResponsive(value)) {
    return value as T;
  }
  const byName = value as Record<string, T>;
  const upTo = BREAKPOINT_NAMES.indexOf(current);
  for (let i = upTo; i >= 0; i -= 1) {
    const name = BREAKPOINT_NAMES[i];
    if (byName[name] !== undefined) {
      return byName[name];
    }
  }
  return byName.base;
}
