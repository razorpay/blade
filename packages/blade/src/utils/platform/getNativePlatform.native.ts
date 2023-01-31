import { Platform } from 'react-native';

export const getNativePlatform = (): typeof Platform.OS => {
  return Platform.OS;
};

export const isAndroid = (): boolean => getNativePlatform() === 'android';
