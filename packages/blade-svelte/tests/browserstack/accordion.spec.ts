import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Accordion expands and collapses an item on click', async ({ page }) => {
  await page.goto('iframe.html?id=components-accordion--basic-example');
  const firstHeader = page.getByRole('button').first();

  await expect(firstHeader).toHaveAttribute('aria-expanded', 'false');
  await firstHeader.click();
  await expect(firstHeader).toHaveAttribute('aria-expanded', 'true');
  await firstHeader.click();
  await expect(firstHeader).toHaveAttribute('aria-expanded', 'false');
});
