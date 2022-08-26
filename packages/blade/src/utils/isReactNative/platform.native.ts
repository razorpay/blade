/* eslint-disable @typescript-eslint/no-namespace */

namespace Platform {
  export type IsReactNative = true;
  type IfReactNative<If, Else> = IsReactNative extends true ? If : Else;
  export type Select<Options extends { web: unknown; native: unknown }> = IfReactNative<
    Options['native'],
    Options['web']
  >;
}

export { Platform };
