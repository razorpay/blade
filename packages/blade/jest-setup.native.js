/** Setup the React Native environment for Jest.
 *
 * Jest runs in Node, which lacks browser globals.
 * We use `global.navigator.product === 'ReactNative'`
 * to detect React Native platforms at test time.
 */
import { configure } from '@testing-library/react-native';

// Since v12, all queries exclude elements hidden from accessibility by default
configure({
  defaultIncludeHiddenElements: true,
});

// Required to let Blade components detect React Native in tests:
global.navigator = {
  product: 'ReactNative',
};

jest.mock('react-native-reanimated', () => ({
  ...require('react-native-reanimated/mock'),
  Easing: {
    bezier: jest.fn((x1, y1, x2, y2) => 
      `${x1} ${y1} ${x2} ${y2}`),
    out: jest.fn(() => ''),
  },
  // Mocking Keyframe since react-native-reanimated mock doesn’t include it
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
  // Mocks for Gorhom BottomSheet internals
  makeMutable: (value) => ({ value }),
  useWorkletCallback: require('react').useCallback,
}));
