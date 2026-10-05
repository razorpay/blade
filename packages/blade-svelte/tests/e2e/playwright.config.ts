import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';

/**
 * The src-cx end-to-end suite: the same specs on two targets.
 *
 * - `TARGET=local` (default): Playwright's own browsers, desktop and
 *   emulated phones, against the built Storybook served on localhost. Needs
 *   no credentials. Specs tagged `@device` (real-device behaviour that
 *   emulation cannot reproduce) are skipped.
 * - `TARGET=browserstack`: run through `browserstack-node-sdk`, which reads
 *   the platforms from `browserstack.yml` and tunnels localhost (BrowserStack
 *   Local), so one project stands for every platform.
 *
 * `STORYBOOK_URL` points the suite at a published Storybook instead of the
 * local build, and no server is started.
 */
const target = process.env.TARGET ?? 'local';
const port = Number(process.env.E2E_PORT ?? 6108);
const storybookUrl = (process.env.STORYBOOK_URL ?? `http://localhost:${port}`).replace(/\/$/, '');
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.ts',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  // Outputs land at the package root (gitignored), where CI uploads them.
  outputDir: '../../test-results',
  reporter: isCI
    ? [['list'], ['html', { open: 'never', outputFolder: '../../playwright-report' }]]
    : 'list',
  grepInvert: target === 'local' ? /@device/ : undefined,
  use: {
    baseURL: `${storybookUrl}/`,
    trace: 'retain-on-failure',
  },
  webServer: process.env.STORYBOOK_URL
    ? undefined
    : {
        command: `node support/serve.mjs ${port}`,
        cwd: fileURLToPath(new URL('.', import.meta.url)),
        url: `${storybookUrl}/iframe.html`,
        reuseExistingServer: !isCI,
      },
  projects:
    target === 'browserstack'
      ? [{ name: 'browserstack' }]
      : [
          { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
          { name: 'desktop-webkit', use: { ...devices['Desktop Safari'] } },
          { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
          { name: 'mobile-webkit', use: { ...devices['iPhone 15'] } },
        ],
});
