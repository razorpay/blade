/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import type { Brand, IsFunction, NativeOrWebBrand, _brand } from './types';

namespace Platform {
  export type Name = 'web' | 'native';
  export type Select<Options extends { web: any; native: any }> = IsFunction<
    Options['native']
  > extends true
    ? IsFunction<Options['web']> extends true
      ? // functions has to be intersected
        Brand<Options['native'] & Options['web'], 'platform-all'>
      : Brand<Options['native'], 'platform-native'> | Brand<Options['web'], 'platform-web'>
    : Brand<Options['native'], 'platform-native'> | Brand<Options['web'], 'platform-web'>;

  export type CastNative<T extends NativeOrWebBrand | undefined> = Extract<
    T,
    { [_brand]?: 'platform-native' | 'platform-all' }
  >;

  export type CastWeb<T extends NativeOrWebBrand | undefined> = Extract<
    T,
    { [_brand]?: 'platform-web' | 'platform-all' }
  >;
}

export { Platform };
