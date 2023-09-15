/** Setup the React Native globals to differentiate between a web and react native app.
 * For browser we have `window`, for node we have `process` as globals, for React Native it's `global.navigator.product: ReactNative`
 **/
import { configure } from '@testing-library/react-native';

// Since v12, all queries exclude elements hidden from accessibility by default
configure({
  defaultIncludeHiddenElements: true,
});

global.navigator = {
  product: 'ReactNative',
};

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
  // mocking these two for BottomSheet, internally Gorhom BottomSheet is using them
  makeMutable: (value) => ({ value }),
  useWorkletCallback: require('react').useCallback,
}));
