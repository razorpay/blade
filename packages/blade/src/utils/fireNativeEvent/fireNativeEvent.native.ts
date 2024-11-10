import { throwBladeError } from '../logger';
/**
 * FireNativeEvent is not supported on react-native
 */

export const FireNativeEvent = (): void => {
  throwBladeError({
    message: 'FireNativeEvent is not supported on react-native',
    moduleName: 'FireNativeEvent',
  });
};
