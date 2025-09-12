/* eslint-disable @typescript-eslint/no-namespace */
import { getPlatformType } from './getPlatformType';

const isReactNative = (): boolean => {
  return getPlatformType() === 'react-native';
};

export { isReactNative };

