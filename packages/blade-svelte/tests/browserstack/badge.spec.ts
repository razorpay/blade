import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Badge renders visible label text', async ({ page }) => {
  await page.goto('iframe.html?id=components-badge--playground');
  const badge = page.getByText('Badge');
  await expect(badge).toBeVisible();
});
