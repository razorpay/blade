import path from 'path';
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

/**
 * Visual snapshot run: screenshots every story of the deployed blade-svelte Storybook
 * in a specific (old) Chrome version on BrowserStack, so regressions on the minimum
 * supported browser can be eyeballed. Not a pass/fail visual-diff suite — the output
 * is a folder of PNGs plus an HTML gallery under `packages/blade-svelte/screenshots/`.
 *
 * Environment:
 *   CHROMATIC_URL               Storybook host (required). `/svelte/` is appended.
 *   BROWSERSTACK_USERNAME       BrowserStack credentials (required unless SCREENSHOT_TARGET=local).
 *   BROWSERSTACK_ACCESS_KEY
 *   CHROME_VERSION              Branded Chrome version to run on BrowserStack. Default `98`.
 *                               BrowserStack accepts `83` and above on Windows 11.
 *   BROWSERSTACK_OS_VERSION     Windows version. Default `11`.
 *   BROWSERSTACK_PARALLELS      Concurrent BrowserStack sessions. Default `2`.
 *   SCREENSHOT_TARGET           `browserstack` (default) or `local` to use a local Chromium
 *                               instead — handy for dry runs without credentials.
 *   CHROMIUM_EXECUTABLE         Optional path to a local Chromium binary for SCREENSHOT_TARGET=local.
 *   STORY_TITLE_FILTER          Regex applied to story titles. Default `^Components/`.
 */
// Package-level .env.local (matches tests/browserstack/*), with the repo root as a fallback.
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../../../.env.local') });

const CHROMATIC_URL = process.env.CHROMATIC_URL ?? '';
const SCREENSHOT_TARGET = process.env.SCREENSHOT_TARGET ?? 'browserstack';
const CHROME_VERSION = process.env.CHROME_VERSION ?? '98';
const BROWSERSTACK_OS_VERSION = process.env.BROWSERSTACK_OS_VERSION ?? '11';
const BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME;
const BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY;

if (!CHROMATIC_URL) {
  throw new Error('CHROMATIC_URL must be set');
}

if (SCREENSHOT_TARGET === 'browserstack' && (!BROWSERSTACK_USERNAME || !BROWSERSTACK_ACCESS_KEY)) {
  throw new Error(
    'BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY must be set (or use SCREENSHOT_TARGET=local)',
  );
}

const PACKAGE_ROOT = path.resolve(__dirname, '../..');
const SCREENSHOTS_DIR = path.join(PACKAGE_ROOT, 'screenshots');

// Handed to the spec + teardown; Playwright forwards process.env to worker processes.
process.env.BLADE_SVELTE_ROOT = PACKAGE_ROOT;
process.env.BLADE_SCREENSHOTS_DIR = SCREENSHOTS_DIR;

const BUILD_NAME = `Blade Svelte Screenshots - Chrome ${CHROME_VERSION}`;

function getCdpEndpoint(capabilities: Record<string, unknown>): string {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { version: clientPlaywrightVersion } = require('@playwright/test/package.json') as {
    version: string;
  };
  const caps = {
    ...capabilities,
    'browserstack.username': BROWSERSTACK_USERNAME,
    'browserstack.accessKey': BROWSERSTACK_ACCESS_KEY,
    // BrowserStack needs to spin up a matching Playwright server version.
    'client.playwrightVersion': clientPlaywrightVersion,
    project: 'Blade Svelte Screenshots',
    build: BUILD_NAME,
    resolution: '1920x1080',
  };
  return `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`;
}

const viewport = { width: 1280, height: 800 };

export default defineConfig({
  testDir: './',
  testMatch: /screenshots\.spec\.ts$/,
  // Every test walks all stories of one component through a single BrowserStack
  // session, so it needs far more than Playwright's 30s default.
  timeout: 15 * 60 * 1000,
  fullyParallel: true,
  retries: 0,
  workers:
    SCREENSHOT_TARGET === 'local' ? 4 : Number.parseInt(process.env.BROWSERSTACK_PARALLELS ?? '2', 10),
  reporter: [['list']],
  globalTeardown: './buildGallery.cts',
  use: {
    baseURL: `${CHROMATIC_URL.replace(/\/$/, '')}/svelte/`,
    viewport,
    // Storybook on old Chrome can take a while on a cold BrowserStack VM.
    navigationTimeout: 60 * 1000,
    actionTimeout: 30 * 1000,
  },
  projects:
    SCREENSHOT_TARGET === 'local'
      ? [
          {
            name: 'local-chromium',
            use: {
              ...devices['Desktop Chrome'],
              viewport,
              launchOptions: process.env.CHROMIUM_EXECUTABLE
                ? { executablePath: process.env.CHROMIUM_EXECUTABLE }
                : undefined,
            },
          },
        ]
      : [
          {
            name: `chrome-${CHROME_VERSION}-win${BROWSERSTACK_OS_VERSION}`,
            use: {
              connectOptions: {
                wsEndpoint: getCdpEndpoint({
                  browser: 'chrome',
                  browser_version: CHROME_VERSION,
                  os: 'Windows',
                  os_version: BROWSERSTACK_OS_VERSION,
                }),
              },
            },
          },
        ],
});
