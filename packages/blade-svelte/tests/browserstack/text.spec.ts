import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Text renders its text content', async ({ page }) => {
  await page.goto('iframe.html?id=components-typography-text--text');
  const text = page.getByText('Lorem ipsum dolor sit amet');
  await expect(text).toBeVisible();
});
