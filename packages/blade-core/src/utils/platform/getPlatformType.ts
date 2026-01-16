export type PlatformTypes = 'browser' | 'node' | 'react-native' | 'unknown';

// Declare process for environments where @types/node may not be available
declare const process: { env?: Record<string, string | undefined> } | undefined;

export const getPlatformType = (): PlatformTypes => {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'react-native';
  }

  if (typeof document !== 'undefined') {
    return 'browser';
  }

  if (typeof process !== 'undefined') {
    return 'node';
  }

  return 'unknown';
};
