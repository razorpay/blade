const ignores = ['/node_modules/'];

module.exports = {
  preset: 'react-native',
  testPathIgnorePatterns: [...ignores, 'web.test', 'ssr.test'],
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
  testMatch: ['**/*.test.{ts,tsx}'],
  transform: {
    '\\.(js|ts|tsx)?$': './jest-preprocess.js',
  },
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native.*|@react-native.*|@?react-navigation.*|@?react-navigation-stack)/)',
  ],
  setupFiles: ['./jest-setup.native.js'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleNameMapper: {
    '^\\~src/(.*)': '<rootDir>/src/$1',
    '^\\~components/(.*)': '<rootDir>/src/components/$1',
    '^\\~utils': '<rootDir>/src/utils',
    '^\\~tokens/(.*)': '<rootDir>/src/tokens/$1',
  },
};
