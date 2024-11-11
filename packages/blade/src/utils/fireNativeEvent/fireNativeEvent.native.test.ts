import { fireNativeEvent } from './fireNativeEvent.native';

describe('fireNativeEvent', () => {
  it('should throw specific error', () => {
    expect(() => fireNativeEvent()).toThrowError(
      '[Blade: FireNativeEvent]: FireNativeEvent is not supported on react-native',
    );
  });
});
