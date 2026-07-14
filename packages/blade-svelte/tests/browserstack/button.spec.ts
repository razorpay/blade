import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

const stories = [
  'components-button--playground',
  'components-button--disabled',
  'components-button--icon-only',
];

// BrowserStack mobile SDK sessions allow only one browser context per test run,
// so all stories are checked within a single test/context instead of one test each.
test('Button stories render and are interactive', async ({ page }) => {
  for (const storyId of stories) {
    // eslint-disable-next-line no-await-in-loop
    await page.goto(`iframe.html?id=${storyId}`);
    const button = page.getByRole('button').first();
    // eslint-disable-next-line no-await-in-loop
    await expect(button).toBeVisible();
    // eslint-disable-next-line no-await-in-loop
    if (await button.isEnabled()) {
      // eslint-disable-next-line no-await-in-loop
      await button.click();
    }
  }
});
