const ignores = ['/node_modules/'];

module.exports = {
  preset: 'react-native',
  testPathIgnorePatterns: [...ignores, 'web.test'],
  collectCoverageFrom: ['./src/**/*.native.{ts,tsx}'],
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
    '**/__tests__/**/*.native.test.{ts,tsx}',
    '**/__tests__/**/*.test.{ts,tsx}',
    '**/*.native.test.{ts,tsx}',
    '**/*.test.{ts,tsx}',
  ],
  transform: {
    '\\.(js|ts|tsx)?$': './jest-preprocess.js',
  },
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native.*|@react-native.*|@?react-navigation.*|@?react-navigation-stack)/)',
  ],
};
