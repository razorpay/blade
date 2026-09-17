import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Divider renders as a separator', async ({ page }) => {
  await page.goto('iframe.html?id=components-divider--horizontal');
  const divider = page.getByRole('separator').first();
  await expect(divider).toBeVisible();
});
