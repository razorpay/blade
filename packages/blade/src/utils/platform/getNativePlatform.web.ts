import type { Platform } from 'react-native';

export const getNativePlatform = (): typeof Platform.OS => {
  return 'web';
};

export const isAndroid = (): boolean => false;
