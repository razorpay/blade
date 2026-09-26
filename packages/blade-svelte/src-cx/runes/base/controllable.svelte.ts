import { untrack } from 'svelte';

export interface ControllableOptions<T> {
  /** Getter for the host-owned value. Returning `undefined` on the first call means uncontrolled. */
  value?: () => T | undefined;
  defaultValue: T;
  equals?: (a: T, b: T) => boolean;
  onChange?: (next: T, meta?: unknown) => void;
}

export interface Controllable<T> {
  /** The value; in controlled mode it reads through to the host. Tracked by whatever reads it. */
  get(): T;
  /** Applies the value and notifies `onChange` unless silent or unchanged. */
  set(next: T, opts?: { silent?: boolean; meta?: unknown }): void;
  isControlled: boolean;
}

const strictEquals = <T>(a: T, b: T): boolean => a === b;

/**
 * One value, two sources. Controlled-ness is decided once, at construction, so a
 * host cannot flip a field between modes mid-life.
 */
export function createControllable<T>(
  options: ControllableOptions<T>
): Controllable<T> {
  const initial = options.value?.();
  const isControlled = initial !== undefined;
  const equals = options.equals || strictEquals;
  let value = $state.raw<T>(
    isControlled ? (initial as T) : options.defaultValue
  );

  function get(): T {
    if (isControlled) {
      const current = options.value?.();
      return current === undefined ? value : current;
    }
    return value;
  }

  return {
    get,
    isControlled,
    set(next, opts = {}) {
      const changed = !equals(next, untrack(get));
      value = next;
      if (changed && !opts.silent) {
        options.onChange?.(next, opts.meta);
      }
    },
  };
}
