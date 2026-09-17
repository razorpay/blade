import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Amount renders formatted currency value', async ({ page }) => {
  await page.goto('iframe.html?id=components-amount--basic-amount');
  // The integer and decimal parts render in separate spans (subtle affix
  // styling), so the formatted value never appears as a single text node.
  await expect(page.getByText('1,234', { exact: true })).toBeVisible();
  await expect(page.getByText('.56', { exact: true })).toBeVisible();
});
