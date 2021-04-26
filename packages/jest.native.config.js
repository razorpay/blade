const jestPreset = require('@testing-library/react-native/jest-preset');
const ignores = ['/node_modules/'];

module.exports = {
  roots: ['../packages/'],
  preset: 'react-native',
  testPathIgnorePatterns: [...ignores],
  collectCoverageFrom: ['../packages/**/*.native.{ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  moduleFileExtensions: ['native.ts', 'native.tsx', 'ts', 'tsx', 'js', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.native.test.{ts,tsx}'],
  transform: {
    '^.+\\.(js|ts|tsx)?$': './jest-preprocess.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native.*|@?react-navigation.*|@?react-navigation-stack)/)',
  ],
  setupFiles: [
    ...jestPreset.setupFiles,
    './jest-setup.native.js',
    // './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  setupFilesAfterEnv: ['@testing-library/react-native/cleanup-after-each'],
};
