const { getJestConfig } = require('@storybook/test-runner');

// The default Jest configuration comes from @storybook/test-runner
const testRunnerConfig = getJestConfig();

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  ...testRunnerConfig,
  moduleFileExtensions: ['web.ts', 'web.tsx', 'ts', 'tsx', 'js', 'json', 'node'],
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
  /** Add your own overrides below, and make sure
   *  to merge testRunnerConfig properties with your own
   * @see https://jestjs.io/docs/configuration
   */
};
