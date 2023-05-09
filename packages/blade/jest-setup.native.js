/** Setup the React Native globals to differentiate between a web and react native app.
 * For browser we have `window`, for node we have `process` as globals, for React Native it's `global.navigator.product: ReactNative`
 **/

Object.defineProperty(global.navigator, 'product', {
  value: 'ReactNative',
});
require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();
jest.mock('react-native-reanimated', () => ({
  ...require('react-native-reanimated/mock'),
  Easing: {
    bezier: jest.fn((x1, y1, x2, y2) => {
      return `${x1} ${y1} ${x2} ${y2}`; // mock an implementation of Easing.bezier that returns a string
    }),
    out: jest.fn(() => ''),
  },
  // apparently reanimated doesn't mock the Keyframe :(
  Keyframe: class Keyframe {
    duration() {
      return '';
    }
    delay() {
      return '';
    }
    withCallback() {
      return '';
    }
  },
  makeMutable: (value) => ({ value }),
  useWorkletCallback: require('react').useCallback,
}));
