/* eslint-disable @typescript-eslint/no-namespace */
import { getPlatformType } from '../getPlatformType';

namespace Platform {
  export type IsReactNative = false;
  export type IfReactNative<If, Else> = IsReactNative extends true ? If : Else;
  export type Select<Options extends { web: unknown; native: unknown }> = IfReactNative<
    Options['native'],
    Options['web']
  >;
}

const isReactNative = (): Platform.IsReactNative => {
  return (getPlatformType() === 'react-native') as Platform.IsReactNative;
};

export { isReactNative, Platform };
