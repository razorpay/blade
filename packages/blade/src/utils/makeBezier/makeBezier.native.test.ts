import { Easing } from 'react-native-reanimated';
import makeBezier from './makeBezier.native';

jest.mock('react-native-reanimated', () => ({
  Easing: {
    bezier: jest.fn((x1: number, y1: number, x2: number, y2: number) => {
      return `${x1} ${y1} ${x2} ${y2}`; // mock an implementation of Easing.bezier that returns a string
    }),
  },
}));

afterAll(() => {
  jest.clearAllMocks();
});

describe('makeBezier', () => {
  it.only(`should call the Easing Function from react-native-reanimated with the right parameters`, () => {
    const easing = makeBezier(0.5, 1, 0, 1.5);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(Easing.bezier).toHaveBeenCalledWith(0.5, 1, 0, 1.5); // ensure Easing.bezier is called
    expect(easing).toBe('0.5 1 0 1.5'); // ensure that returned value of Easing.bezier is also returned by makeBezier
  });
});
