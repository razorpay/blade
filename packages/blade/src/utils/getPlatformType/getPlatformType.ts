export type PlatformTypes = 'browser' | 'node' | 'react-native' | undefined;

const getPlatformType = (): PlatformTypes => {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'react-native';
  }

  if (typeof document !== 'undefined') {
    return 'browser';
  }

  if (typeof process !== 'undefined') {
    return 'node';
  }

  return undefined;
};

export default getPlatformType;
