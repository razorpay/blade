const { rebrandedComponents } = require('./rebranded-components');

const ignores = ['/node_modules/'];

module.exports = {
  preset: 'react-native',
  testPathIgnorePatterns: [...ignores, 'web.test', 'ssr.test'],
  collectCoverageFrom: [
    ...rebrandedComponents.map((component) => `./src/**/${component}.native.{ts,tsx}`),
    '**/Icons/*Icon/*.native.test.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  moduleFileExtensions: ['native.ts', 'native.tsx', 'ts', 'tsx', 'js', 'json', 'node'],
  testMatch: [
    ...rebrandedComponents.map((component) => `**/${component}.native.test.{ts,tsx}`),
    '**/Icons/*Icon/*.native.test.{ts,tsx}',
  ],
  transform: {
    '\\.(js|ts|tsx)?$': './jest-preprocess.js',
  },
  testEnvironment: 'node', // Ref: https://github.com/callstack/react-native-testing-library/issues/896#issuecomment-1190249878
  transformIgnorePatterns: [
    'node_modules/(?!(react-native.*|@react-native.*|@?react-navigation.*|@?react-navigation-stack)/)',
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    './jest-setup.native.js',
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  moduleNameMapper: {
    '^\\~src/(.*)': '<rootDir>/src/$1',
    '^\\~components/(.*)': '<rootDir>/src/components/$1',
    '^\\~utils$': '<rootDir>/src/utils',
    '^\\~utils/(.*)': '<rootDir>/src/utils/$1',
    '^\\~tokens/(.*)': '<rootDir>/src/tokens/$1',
  },
};
