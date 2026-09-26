import { createControllable } from './controllable.svelte';

export type Compare<T> = (a: T, b: T) => boolean;

export interface SelectionOptions<T> {
  mode: 'single' | 'multiple';
  /** Single mode: clicking the selected item clears it. Default true. */
  allowDeselect?: boolean;
  compare?: Compare<T>;
  value?: () => readonly T[] | undefined;
  defaultValue?: readonly T[];
  disabled?: () => boolean;
  onChange?: (values: readonly T[]) => void;
}

export interface SelectionModel<T> {
  /** Tracked by whatever reads it. */
  get(): readonly T[];
  set(values: readonly T[]): void;
  select(item: T): void;
  deselect(item: T): void;
  toggle(item: T): void;
  clear(): void;
  isSelected(item: T): boolean;
  /** Single mode convenience: the one selected item, or null. */
  single(): T | null;
}

const same = <T>(a: T, b: T): boolean => a === b;

/** The set algebra behind option lists, radio/checkbox/chip groups and tabs. */
export function createSelection<T>(
  options: SelectionOptions<T>
): SelectionModel<T> {
  const compare = options.compare || same;
  const allowDeselect = options.allowDeselect ?? true;
  const values = createControllable<readonly T[]>({
    value: options.value,
    defaultValue: options.defaultValue || [],
    equals: (a, b) =>
      a.length === b.length && a.every((item, i) => compare(item, b[i])),
    onChange: (next) => options.onChange?.(next),
  });

  const has = (list: readonly T[], item: T): boolean =>
    list.some((it) => compare(it, item));
  const without = (list: readonly T[], item: T): T[] =>
    list.filter((it) => !compare(it, item));

  function commit(next: readonly T[]): void {
    if (!options.disabled?.()) {
      values.set(next);
    }
  }

  const model: SelectionModel<T> = {
    get: values.get,
    set: commit,
    isSelected: (item) => has(values.get(), item),
    single: () => values.get()[0] ?? null,
    select(item) {
      const current = values.get();
      if (has(current, item)) {
        return;
      }
      commit(options.mode === 'single' ? [item] : [...current, item]);
    },
    deselect(item) {
      const current = values.get();
      if (!has(current, item)) {
        return;
      }
      if (options.mode === 'single' && !allowDeselect) {
        return;
      }
      commit(without(current, item));
    },
    toggle(item) {
      if (model.isSelected(item)) {
        model.deselect(item);
      } else {
        model.select(item);
      }
    },
    clear() {
      if (values.get().length) {
        commit([]);
      }
    },
  };
  return model;
}

/**
 * Equality for a selection's whole value — one item, an array of them, or
 * nothing — built from the per-item `compare`. What a field holding a
 * selection hands to its model as `compare`.
 */
export function sameSelection<T>(
  compare: Compare<T> = (a, b) => a === b
): (a: unknown, b: unknown) => boolean {
  return (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return (
        a.length === b.length &&
        a.every((item, index) => compare(item as T, b[index] as T))
      );
    }
    if (a === null || a === undefined || b === null || b === undefined) {
      return (a ?? null) === (b ?? null);
    }
    return !Array.isArray(a) && !Array.isArray(b) && compare(a as T, b as T);
  };
}
