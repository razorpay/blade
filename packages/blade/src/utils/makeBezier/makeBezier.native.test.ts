import { Easing } from 'react-native-reanimated';
import { makeBezier } from './';

describe('makeBezier', () => {
  it(`should call the Easing Function from react-native-reanimated with the right parameters`, () => {
    const easing = makeBezier(0.5, 1, 0, 1.5);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(Easing.bezier).toHaveBeenCalledWith(0.5, 1, 0, 1.5); // ensure Easing.bezier is called
    expect(easing).toBe('0.5 1 0 1.5'); // ensure that returned value of Easing.bezier is also returned by makeBezier
  });
});
