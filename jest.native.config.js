const jestPreset = require('@testing-library/react-native/jest-preset');
const ignores = ['/node_modules/'];

module.exports = {
  preset: '@testing-library/react-native',
  transform: { '^.+\\.js$': './jest-preprocess.js' },
  setupFiles: [
    ...jestPreset.setupFiles,
    './jest-setup.native.js',
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native.*|@?react-navigation.*|@?react-navigation-stack)/)',
  ],
  setupFilesAfterEnv: ['@testing-library/react-native/cleanup-after-each'],
  testPathIgnorePatterns: [...ignores],
  collectCoverageFrom: ['./src/**/*.native.{js,ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  moduleFileExtensions: ['ts', 'js', 'jsx', 'tsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.native.test.js', '<rootDir>/src/_helpers/__tests__/**/*.test.js'],
};
