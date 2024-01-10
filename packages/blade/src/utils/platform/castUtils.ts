import type { Platform } from '.';

/**
 * @description
 *
 * Casts a Platform.Select<> type to web type
 *
 * @example
 *
 * ```ts
 * type Example = Platform.Select<{ web: string; native: number }>;
 *
 * const extractedWebType = castWebType('' as Example);
 * //    ^ string
 * ```
 */
const castWebType = <T>(value: T): Platform.CastWeb<T> => {
  return value as Platform.CastWeb<typeof value>;
};

/**
 * @description
 *
 * Casts a Platform.Select<> type to native type
 *
 * @example
 *
 * ```ts
 * type Example = Platform.Select<{ web: string; native: number }>;
 *
 * const extractedNativeType = castNativeType('' as Example);
 * //    ^ number
 * ```
 */
const castNativeType = <T>(value: T): Platform.CastNative<T> => {
  return value as Platform.CastNative<typeof value>;
};

export { castWebType, castNativeType };
