/* eslint-disable @typescript-eslint/no-namespace */
import type { Brand, NativeOrWebBrand } from './types';

namespace Platform {
  export type Name = 'native';
  /**
   * Right now, the module resolution is set to resolve `.native` files,
   *
   * Thus Platform.Select<> type will return the `native` type
   */
  export type Select<Options extends { web: unknown; native: unknown }> = Brand<
    Options[Name],
    'platform-native'
  >;

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
