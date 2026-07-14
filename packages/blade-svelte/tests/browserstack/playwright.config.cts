import path from 'path';
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME;
const BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY;
const CHROMATIC_URL = process.env.CHROMATIC_URL ?? '';

function getCdpEndpoint(capabilities: Record<string, unknown>): string {
  const caps = {
    ...capabilities,
    'browserstack.username': BROWSERSTACK_USERNAME,
    'browserstack.accessKey': BROWSERSTACK_ACCESS_KEY,
    project: 'Blade Interaction Tests',
    build: 'Blade Interaction Test Suite',
  };
  return `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`;
}

export default defineConfig({
  testDir: './',
  use: {
    baseURL: `${CHROMATIC_URL.replace(/\/$/, '')}/svelte/`,
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: {
        connectOptions: {
          wsEndpoint: getCdpEndpoint({
            browser: 'chrome',
            browser_version: 'latest',
            os: 'Windows',
            os_version: '11',
          }),
        },
      },
    },
    {
      name: 'desktop-safari',
      use: {
        connectOptions: {
          wsEndpoint: getCdpEndpoint({
            browser: 'playwright-webkit',
            browser_version: 'latest',
            os: 'OS X',
            os_version: 'Ventura',
          }),
        },
      },
    },
  ],
});
