const { getJestConfig, getTestRunnerConfig } = require('@storybook/test-runner');

/**
 * BrowserStack-specific Storybook test-runner Jest configuration.
 *
 * This config reuses the same .test.stories.{ts,tsx} interaction tests as the
 * local config but routes Playwright through a BrowserStack remote CDP endpoint
 * so tests run against real older browser versions.
 *
 * Required environment variables:
 *   BROWSERSTACK_USERNAME      – BrowserStack account username
 *   BROWSERSTACK_ACCESS_KEY    – BrowserStack access key
 *
 * Optional environment variables (used for CI matrix):
 *   BROWSERSTACK_OS            – e.g. "Windows" (default: "Windows")
 *   BROWSERSTACK_OS_VERSION    – e.g. "10"     (default: "10")
 *   BROWSERSTACK_BROWSER       – e.g. "chrome"  (default: "chrome")
 *   BROWSERSTACK_BROWSER_VERSION – e.g. "83"    (default: "latest")
 *   GITHUB_RUN_ID              – used for build name
 *
 * BrowserStack Local must be started separately (see CI workflow) so that the
 * remote browser can reach the local Storybook server at 127.0.0.1:9009.
 */

const BS_USERNAME = process.env.BROWSERSTACK_USERNAME;
const BS_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY;

if (!BS_USERNAME || !BS_ACCESS_KEY) {
  throw new Error(
    '[BrowserStack] BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY must be set. ' +
      'See packages/blade/docs/browserstack-interaction-tests.md for setup instructions.',
  );
}

const BS_OS = process.env.BROWSERSTACK_OS || 'Windows';
const BS_OS_VERSION = process.env.BROWSERSTACK_OS_VERSION || '10';
const BS_BROWSER = (process.env.BROWSERSTACK_BROWSER || 'chrome').toLowerCase();
const BS_BROWSER_VERSION = process.env.BROWSERSTACK_BROWSER_VERSION || 'latest';
const BUILD_NAME = process.env.GITHUB_RUN_ID
  ? `blade-interaction-${process.env.GITHUB_RUN_ID}`
  : `blade-interaction-local-${Date.now()}`;

const SESSION_NAME = `${BS_BROWSER}-${BS_BROWSER_VERSION}-${BS_OS}-${BS_OS_VERSION}`;

// BrowserStack CDP endpoint for Playwright remote connection
// See: https://www.browserstack.com/docs/playwright/get-started/node
const CDP_ENDPOINT = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
  JSON.stringify({
    browser: BS_BROWSER,
    browser_version: BS_BROWSER_VERSION,
    os: BS_OS,
    os_version: BS_OS_VERSION,
    'browserstack.username': BS_USERNAME,
    'browserstack.accessKey': BS_ACCESS_KEY,
    'browserstack.local': 'true',
    'browserstack.project': 'Blade',
    'browserstack.buildName': BUILD_NAME,
    'browserstack.sessionName': `blade-interaction-${SESSION_NAME}`,
    'browserstack.consoleLogs': 'errors',
    'browserstack.networkLogs': 'true',
    client: 'playwright',
  }),
)}`;

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
  testTimeout: 60000,
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
      // Connect to a remote BrowserStack browser via CDP instead of launching a local browser.
      connectOptions: {
        wsEndpoint: CDP_ENDPOINT,
      },
      // Skip local browser launch — the remote browser is provided by BrowserStack.
      skipLaunch: true,
      // Map the requested browser type for jest-playwright's internal bookkeeping.
      // The actual browser is determined by the BrowserStack CDP caps above.
      browsers: [
        BS_BROWSER === 'edge' ? 'chromium' : BS_BROWSER === 'firefox' ? 'firefox' : 'chromium',
      ],
    },
  },
};
