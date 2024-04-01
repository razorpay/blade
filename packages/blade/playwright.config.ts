import { defineConfig, devices } from '@playwright/test';

console.log(process.cwd());
console.log(__dirname);

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e-tests',
  testMatch: '**/*.test.ts',
  fullyParallel: true,
  /* Maximum time one test can run for. */
  timeout: 90 * 1000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    // TODO: PLAYWRIGHT_BASE_URL should be dynamically set from chromatic's build url in PRs
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'https://blade.razorpay.com/iframe.html',
  },
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'line',
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Safari
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Firefox
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // Mobile
    {
      name: 'mobile',
      use: { ...devices['iPhone 12 Pro Max'] },
    },
  ],
});
