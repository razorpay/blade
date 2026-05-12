import { getPlatformType } from '~utils/getPlatformType';

/**
 * On React Native (all versions), style props like `borderWidth` and `borderRadius`
 * must be numbers. Old Architecture auto-coerced strings but New Architecture (Fabric,
 * enabled by default from RN 0.76+) enforces strict types and throws:
 *   "java.lang.String cannot be cast to java.lang.Double"
 *
 * Web continues to receive the "Npx" string which is required for CSS.
 */
export function makeBorderSize<T extends number>(size: T): `${T}px` | T;
export function makeBorderSize<T extends string>(size: T): T | number;
export function makeBorderSize<T extends number | string>(size: T): `${T}px` | T | number {
  if (getPlatformType() === 'react-native') {
    // Return raw number — works on all RN versions (Old Arch coerces, New Arch requires it)
    if (typeof size === 'number') {
      return size;
    }
    return parseFloat(size) || 0;
  }
  // Web: return CSS px string
  if (typeof size === 'number') {
    return `${size}px`;
  }
  return size;
}
