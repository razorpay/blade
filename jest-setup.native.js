// All third-party related mocks will go here.
jest.mock('react-native-reanimated', () =>
  jest.requireActual('./node_modules/react-native-reanimated/mock'),
);
