/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */

/**
 * @readme
 *
 * This `.all` file is special only for platform.ts file. Do not use anywhere else
 * This file only contains type level code and putting any runtime code will cause errors since our
 * bundler is not setup to handle this extension.
 */

import type { Brand, IsBothFunction, NativeOrWebBrand } from './types';

namespace Platform {
  export type Name = 'web' | 'native';

  /**
   * While working on blade, Platform.Select<> type unions both web & native types.
   *
   * We need the union of both types because while working on blade we don't know if a file is meant to be a `native` module or `web` module,
   * Thus we union them together and then use `castWebType` & `castNativeType` functions to extract platform specific types.
   *
   * For more info see docs at `rfcs/writing-cross-platform-typescript.md`
   */
  export type Select<Options extends { web: any; native: any }> = IsBothFunction<
    Options['native'],
    Options['web']
  > extends true
    ? // If both web & native types are a function,
      // We need to intersect the functions because we need overloads
      // See: https://tsplay.dev/N9PZ9w
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

export type { Platform };
