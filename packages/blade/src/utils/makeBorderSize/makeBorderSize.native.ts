/**
 * React Native (Fabric/New Architecture) requires numeric values for style props like
 * `borderWidth` and `borderRadius`. Old Architecture auto-coerced strings but Fabric
 * enforces strict types and throws "java.lang.String cannot be cast to java.lang.Double".
 *
 * Unlike the web version which returns `${T}px` strings, the native version honestly
 * returns numbers — callers on native receive numeric values, not string representations.
 */
export function makeBorderSize<T extends number>(size: T): number;
export function makeBorderSize<T extends string>(size: T): number;
export function makeBorderSize<T extends number | string>(size: T): number {
  if (typeof size === 'number') {
    return size;
  }
  return parseFloat(size) || 0;
}
