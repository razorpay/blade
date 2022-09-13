import type { Platform } from './';

const castWeb = <T>(value: T): Platform.CastWeb<T> => {
  return value as Platform.CastWeb<typeof value>;
};

const castNative = <T>(value: T): Platform.CastNative<T> => {
  return value as Platform.CastNative<typeof value>;
};

export { castWeb, castNative };
