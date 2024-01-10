/* eslint-disable @typescript-eslint/no-namespace */
import type { Brand, NativeOrWebBrand } from './types';

namespace Platform {
  export type Name = 'web';
  /**
   * Right now, the module resolution is set to resolve `.web` files,
   *
   * Thus Platform.Select<> type will return the `web` type
   */
  export type Select<Options extends { web: unknown; native: unknown }> = Brand<
    Options[Name],
    'platform-web'
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
