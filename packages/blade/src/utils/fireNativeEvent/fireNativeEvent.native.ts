import { logger } from '../logger';
/**
 * FireNativeEvent is not supported on react-native
 */

export const fireNativeEvent = (
  _ref: React.RefObject<HTMLElement> | null,
  _eventTypes: Array<'change' | 'input'>,
): void => {
  logger({
    message: 'FireNativeEvent is not supported on react-native',
    moduleName: 'FireNativeEvent',
    type: 'error',
  });
};
