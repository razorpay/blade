import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('ActionList selects an item on click', async ({ page }) => {
  await page.goto('iframe.html?id=components-actionlist--single-select-interactive');
  const options = page.getByRole('option');
  const firstOption = options.first();

  await expect(firstOption).toBeVisible();
  await firstOption.click();
  await expect(firstOption).toHaveAttribute('aria-selected', 'true');
});
