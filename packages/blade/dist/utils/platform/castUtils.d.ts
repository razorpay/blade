import { Platform } from '.';
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
declare const castWebType: <T>(value: T) => Extract<T, {
    __brand__?: "platform-web" | "platform-all" | undefined;
}>;
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
declare const castNativeType: <T>(value: T) => Extract<T, {
    __brand__?: "platform-native" | "platform-all" | undefined;
}>;
export { castWebType, castNativeType };
