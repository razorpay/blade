// This `.all` file is special only for platform.ts file. Do not use anywhere else
// This file only contains type level code and putting any runtime code will cause errors since our
// bundler is not setup to handle this extension.

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import type { Brand, IsBothFunction, NativeOrWebBrand } from './types';

namespace Platform {
  export type Name = 'web' | 'native';

  // Unionify both web & native types, this will help us blade developers internally
  export type Select<Options extends { web: any; native: any }> = IsBothFunction<
    Options['native'],
    Options['web']
  > extends true
    ? // functions has to be intersected
      Brand<Options['native'] & Options['web'], 'platform-all'>
    : Brand<Options['native'], 'platform-native'> | Brand<Options['web'], 'platform-web'>;

  export type CastNative<T extends NativeOrWebBrand | undefined> = Extract<
    T,
    { __brand__?: 'platform-native' | 'platform-all' }
  >;

  export type CastWeb<T extends NativeOrWebBrand | undefined> = Extract<
    T,
    { __brand__?: 'platform-web' | 'platform-all' }
  >;
}

export { Platform };
