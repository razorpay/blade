import { fireNativeEvent } from './fireNativeEvent.native';

describe('fireNativeEvent', () => {
  const ref: React.RefObject<HTMLElement> = { current: null };
  it('should log specific error', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    fireNativeEvent(ref, ['change']);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Blade: FireNativeEvent]: FireNativeEvent is not supported on react-native',
    );

    consoleErrorSpy.mockRestore();
  });
});
