export interface Registry<T> {
  /** In registration order; tracked by whatever reads it. */
  readonly items: readonly T[];
  /**
   * Adds `item` and returns its unregister. Registration order is the order
   * of ordered reads (a form's first invalid field), so a child that
   * remounts should pass `at` — its position among its siblings — or it
   * re-registers at the end. An out-of-range `at` appends.
   */
  register(item: T, at?: number): () => void;
  indexOf(item: T): number;
  at(index: number): T | undefined;
  size(): number;
}

/** Ordered child registration with stable indices: fields, options, panels, cells. */
export function createRegistry<T>(): Registry<T> {
  let items = $state.raw<readonly T[]>([]);
  return {
    get items() {
      return items;
    },
    register(item, at) {
      const current = items;
      if (at === undefined || at < 0 || at >= current.length) {
        items = [...current, item];
      } else {
        items = [...current.slice(0, at), item, ...current.slice(at)];
      }
      return () => {
        items = items.filter((it) => it !== item);
      };
    },
    indexOf: (item) => items.indexOf(item),
    at: (index) => items[index],
    size: () => items.length,
  };
}
