import { getPlatformType } from '../getPlatformType';

const isBrowser = (): boolean => {
  return getPlatformType() === 'browser';
};

export { isBrowser };
