import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Code renders its text content', async ({ page }) => {
  await page.goto('iframe.html?id=components-typography-code--code-highlighted');
  const code = page.getByText('SENTRY_AUTH_TOKEN');
  await expect(code).toBeVisible();
});
