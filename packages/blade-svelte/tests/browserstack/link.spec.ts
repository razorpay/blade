import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Link renders as an anchor with correct href', async ({ page }) => {
  await page.goto('iframe.html?id=components-link--anchor-link');
  const link = page.getByRole('link').first();
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', /.+/);
});
