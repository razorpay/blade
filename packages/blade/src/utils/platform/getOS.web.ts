import type { Platform } from 'react-native';

export const getOS = (): typeof Platform.OS => {
  return 'web';
};

export const isAndroid = (): boolean => false;
