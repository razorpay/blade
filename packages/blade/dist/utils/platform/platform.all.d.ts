import { Brand, IsBothFunction, NativeOrWebBrand } from './types';
declare namespace Platform {
    type Name = 'web' | 'native';
    /**
     * While working on blade, Platform.Select<> type unions both web & native types.
     *
     * We need the union of both types because while working on blade we don't know if a file is meant to be a `native` module or `web` module,
     * Thus we union them together and then use `castWebType` & `castNativeType` functions to extract platform specific types.
     *
     * For more info see docs at `rfcs/writing-cross-platform-typescript.md`
     */
    type Select<Options extends {
        web: any;
        native: any;
    }> = IsBothFunction<Options['native'], Options['web']> extends true ? Brand<Options['native'] & Options['web'], 'platform-all'> : Brand<Options['native'], 'platform-native'> | Brand<Options['web'], 'platform-web'>;
    type CastNative<T extends NativeOrWebBrand | undefined> = Extract<T, {
        __brand__?: 'platform-native' | 'platform-all';
    }>;
    type CastWeb<T extends NativeOrWebBrand | undefined> = Extract<T, {
        __brand__?: 'platform-web' | 'platform-all';
    }>;
}
export type { Platform };
