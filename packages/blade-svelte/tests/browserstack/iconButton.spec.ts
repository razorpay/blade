import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('IconButton is focusable and clickable', async ({ page }) => {
  await page.goto('iframe.html?id=components-iconbutton--icon-button');
  const button = page.getByRole('button', { name: 'Close' });
  await expect(button).toBeVisible();
  await button.focus();
  await expect(button).toBeFocused();
  await button.click();
});
