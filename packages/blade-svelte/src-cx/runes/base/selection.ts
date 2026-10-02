export type Compare<T> = (a: T, b: T) => boolean;

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
