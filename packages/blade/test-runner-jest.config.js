const { getJestConfig, getTestRunnerConfig } = require('@storybook/test-runner');

// The default Jest configuration comes from @storybook/test-runner
const jestConfig = getJestConfig();
const testRunnerConfig = getTestRunnerConfig();

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  ...jestConfig,
  moduleFileExtensions: ['web.ts', 'web.tsx', 'ts', 'tsx', 'js', 'json', 'node'],
  testMatch: ['**/*.test.stories.{ts,tsx}'],
  testTimeout: 30000,
  moduleNameMapper: {
    '^\\~src/(.*)': '<rootDir>/src/$1',
    '^\\~components/(.*)': '<rootDir>/src/components/$1',
    '^\\~utils$': '<rootDir>/src/utils',
    '^\\~utils/(.*)': '<rootDir>/src/utils/$1',
    '^\\~tokens/(.*)': '<rootDir>/src/tokens/$1',
  },
  testPathIgnorePatterns: ['stories.internal', '_KitchenSink'],
  globals: {
    __DEV__: true,
  },
  testEnvironmentOptions: {
    ...testRunnerConfig,
    'jest-playwright': {
      browsers: ['chromium', 'firefox'],
    },
  },
};
