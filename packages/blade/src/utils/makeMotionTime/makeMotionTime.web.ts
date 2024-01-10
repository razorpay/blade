import type { MakeMotionTime } from './types';
import type { Platform } from '~utils';

export const makeMotionTime = <T extends number>(time: T): Platform.CastWeb<MakeMotionTime<T>> => {
  return `${time}ms`;
};
