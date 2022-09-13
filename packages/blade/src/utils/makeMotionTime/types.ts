import type { Platform } from '../isReactNative/index.all';

type MakeMotionTime<Value extends number> = Platform.Select<{
  native: number;
  web: `${Value}ms`;
}>;

export { MakeMotionTime };
