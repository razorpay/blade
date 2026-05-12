/**
 * React Native (Fabric/New Architecture) requires numeric values for style props like
 * `borderWidth` and `borderRadius`. Old Architecture auto-coerced strings but Fabric
 * enforces strict types and throws "java.lang.String cannot be cast to java.lang.Double".
 *
 * Overload signatures intentionally match the web version (`${T}px`) so all existing
 * call sites remain type-safe — the `as unknown as` casts are only in the implementation
 * body and are never visible to callers.
 */
export function makeBorderSize<T extends number>(size: T): `${T}px`;
export function makeBorderSize<T extends string>(size: T): T;
export function makeBorderSize<T extends number | string>(size: T): `${T}px` | T {
  if (typeof size === 'number') {
    return size as unknown as `${T}px`;
  }
  return (parseFloat(size as string) || 0) as unknown as T;
}
