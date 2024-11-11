import { fireNativeEvent } from './fireNativeEvent.native';

describe('fireNativeEvent', () => {
  it('should throw error', () => {
    expect(() => fireNativeEvent()).toThrowError();
  });
});
