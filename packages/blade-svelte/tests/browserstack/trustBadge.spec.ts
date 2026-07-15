import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('TrustBadge renders its label text', async ({ page }) => {
  await page.goto('iframe.html?id=components-trustbadge--intense');
  const label = page.getByText('Razorpay Trusted Business');
  await expect(label).toBeVisible();
});
