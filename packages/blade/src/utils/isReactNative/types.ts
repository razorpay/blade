/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
// export type Brand<Base, Branding, ReservedName extends string = '__type__'> = Base &
//   { [K in ReservedName]?: Branding };

export declare const _brand: unique symbol;
/**
 * Brands a type making them act as nominal
 */
export type Brand<Type, Name extends string> = Type & { [_brand]?: Name };

export type NativeOrWebBrand = Brand<any, 'native' | 'web'>;
export type IsFunction<T> = T extends (...args: any[]) => void ? true : false;
