import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('AppBar renders as a banner landmark', async ({ page }) => {
  await page.goto('iframe.html?id=components-appbar--default');
  const banner = page.getByRole('banner');
  await expect(banner).toBeVisible();
});
