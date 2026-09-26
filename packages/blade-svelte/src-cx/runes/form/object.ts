function isNonNullObject(o: unknown): o is object {
  return o !== null && typeof o === 'object';
}

export function hasOwn(obj: unknown, prop: PropertyKey): boolean {
  return isNonNullObject(obj)
    ? Object.prototype.hasOwnProperty.call(obj, prop)
    : false;
}

/** True for an object or array with no own keys; false for non-objects. */
export function isEmptyObject(obj: unknown): boolean {
  return isNonNullObject(obj) ? !Object.keys(obj as object).length : false;
}

/**
 * Turns dotted (or bracketed) keys into nested objects:
 * `{ 'card.number': 1, 'a[b]': 2 }` → `{ card: { number: 1 }, a: { b: 2 } }`.
 */
export function unflatten(
  flat: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const rawKey of Object.keys(flat)) {
    const keys = rawKey.replace(/\[([^[\]]+)\]/g, '.$1').split('.');
    let cursor = result;
    keys.forEach((key, i) => {
      if (i < keys.length - 1) {
        if (!hasOwn(cursor, key)) {
          cursor[key] = {};
        }
        cursor = cursor[key] as Record<string, unknown>;
      } else {
        cursor[key] = flat[rawKey];
      }
    });
  }

  return result;
}
