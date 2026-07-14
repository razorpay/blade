import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Amount renders formatted currency value', async ({ page }) => {
  await page.goto('iframe.html?id=components-amount--basic-amount');
  const amount = page.getByText('1,234.56');
  await expect(amount).toBeVisible();
});
