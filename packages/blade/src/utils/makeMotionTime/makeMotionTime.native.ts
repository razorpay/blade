import type { MakeMotionTime } from './types';
import type { Platform } from '~utils';

export const makeMotionTime = <T extends number>(
  time: T,
): Platform.CastNative<MakeMotionTime<T>> => {
  return time;
};
