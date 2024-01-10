import { Platform } from 'react-native';

export const getOS = (): typeof Platform.OS => {
  return Platform.OS;
};

export const isAndroid = (): boolean => getOS() === 'android';
