import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Spinner renders as a status indicator', async ({ page }) => {
  await page.goto('iframe.html?id=components-spinner--basic-spinner');
  const spinner = page.getByRole('progressbar');
  await expect(spinner).toBeVisible();
});
