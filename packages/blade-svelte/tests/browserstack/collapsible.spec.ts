import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Collapsible expands and collapses body on button click', async ({ page }) => {
  await page.goto('iframe.html?id=components-collapsible--with-collapsible-button');
  const trigger = page.getByRole('button').first();

  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});
