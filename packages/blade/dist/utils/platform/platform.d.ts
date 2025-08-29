import { Brand, NativeOrWebBrand } from './types';
declare namespace Platform {
    type Name = 'web';
    /**
     * Right now, the module resolution is set to resolve `.web` files,
     *
     * Thus Platform.Select<> type will return the `web` type
     */
    type Select<Options extends {
        web: unknown;
        native: unknown;
    }> = Brand<Options[Name], 'platform-web'>;
    type CastNative<T extends NativeOrWebBrand | undefined> = Extract<T, {
        __brand__?: 'platform-native' | 'platform-all';
    }>;
    type CastWeb<T extends NativeOrWebBrand | undefined> = Extract<T, {
        __brand__?: 'platform-web' | 'platform-all';
    }>;
}
export type { Platform };
