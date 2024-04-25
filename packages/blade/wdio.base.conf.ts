/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
  specs: ['./src/**/*.e2e.test.ts'],
  exclude: [],
  logLevel: 'warn',
  baseUrl: process.env.E2E_BASE_URL || 'http://localhost:9009/iframe.html',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  capabilities: [],
  filesToWatch: [
    // TODO: How should we organize the e2e stories? Like _KitchenSin?
    './src/**/*.stories.tsx',
  ],
  before: async (_, __, browser) => {
    await browser.maximizeWindow();
  },
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
};
