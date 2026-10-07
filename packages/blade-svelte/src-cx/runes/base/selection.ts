export type Compare<T> = (a: T, b: T) => boolean;

const isPlain = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const proto = Object.getPrototypeOf(value) as unknown;
  return proto === Object.prototype || proto === Array.prototype || proto === null;
};

/**
 * The default equality of a choice's value: the same value, or plain
 * objects and arrays alike in every key. A host that binds object values to
 * `$state` holds Svelte's proxies of them, never the objects its items were
 * given, so identity alone would never match a pick. Pass `compare` for
 * anything else (an id field).
 */
export function sameItem<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) {
    return true;
  }
  if (!isPlain(a) || !isPlain(b) || Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }
  const keys = Object.keys(a);
  return (
    keys.length === Object.keys(b).length &&
    keys.every((key) => Object.prototype.hasOwnProperty.call(b, key) && sameItem(a[key], b[key]))
  );
}

/**
 * Equality for a selection's whole value — one item, an array of them, or
 * nothing — built from the per-item `compare`. What a field holding a
 * selection hands to its model as `compare`.
 */
export function sameSelection<T>(
  compare: Compare<T> = sameItem,
): (a: unknown, b: unknown) => boolean {
  return (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every((item, index) => compare(item as T, b[index] as T));
    }
    if (a === null || a === undefined || b === null || b === undefined) {
      return (a ?? null) === (b ?? null);
    }
    return !Array.isArray(a) && !Array.isArray(b) && compare(a as T, b as T);
  };
}
