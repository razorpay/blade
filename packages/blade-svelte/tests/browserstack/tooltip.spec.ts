import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Tooltip shows on trigger hover', async ({ page }) => {
  await page.goto('iframe.html?id=components-tooltip--default');
  const trigger = page.getByRole('button', { name: 'Hover over me' });
  await expect(trigger).toBeVisible();

  await trigger.hover();
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toBeVisible();
});
