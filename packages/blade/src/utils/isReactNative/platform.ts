/* eslint-disable @typescript-eslint/no-namespace */
import type { Brand, NativeOrWebBrand, _brand } from './types';

namespace Platform {
  export type Name = 'web';
  export type Select<Options extends { web: unknown; native: unknown }> = Brand<
    Options[Name],
    'platform-web'
  >;

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
