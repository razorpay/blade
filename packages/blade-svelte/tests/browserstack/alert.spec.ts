import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Alert dismisses on close button click', async ({ page }) => {
  await page.goto('iframe.html?id=components-alert--default');
  const alert = page.getByRole('status').first();
  await expect(alert).toBeVisible();

  const dismissButton = page.getByRole('button', { name: 'Dismiss alert' });
  await dismissButton.click();
  await expect(alert).not.toBeVisible();
});
