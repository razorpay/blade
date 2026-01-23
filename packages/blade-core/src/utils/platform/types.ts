/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Brands a type making them act as nominal
 * @see https://medium.com/@KevinBGreene/surviving-the-typescript-ecosystem-branding-and-type-tagging-6cf6e516523d
 */
export type Brand<Type, Name extends string> = Type & { __brand__?: Name };

export type NativeOrWebBrand = Brand<any, 'native' | 'web'>;

/**
 * @template T any type
 * @returns boolean
 */
export type IsFunction<T> = T extends (...args: any[]) => void ? true : false;

export type IsBothFunction<T, K> = [IsFunction<T>, IsFunction<K>] extends [true, true]
  ? true
  : false;
