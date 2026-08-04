import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('BottomSheet opens on trigger click', async ({ page }) => {
  await page.goto('iframe.html?id=components-bottomsheet--default');
  const openButton = page.getByRole('button', { name: 'open' });
  await openButton.click();

  const sheet = page.getByRole('dialog');
  await expect(sheet).toBeVisible();
});
