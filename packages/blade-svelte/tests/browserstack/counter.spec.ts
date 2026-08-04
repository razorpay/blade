import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Counter renders its numeric value', async ({ page }) => {
  await page.goto('iframe.html?id=components-counter--default');
  const counter = page.getByText('20');
  await expect(counter).toBeVisible();
});
