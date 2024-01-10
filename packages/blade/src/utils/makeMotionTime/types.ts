import type { Platform } from '~utils';

type MakeMotionTime<Value extends number> = Platform.Select<{
  native: number;
  web: `${Value}ms`;
}>;

export type { MakeMotionTime };
