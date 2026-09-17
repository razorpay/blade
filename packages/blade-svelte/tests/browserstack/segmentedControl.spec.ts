import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('SegmentedControl selects an item on click', async ({ page }) => {
  await page.goto('iframe.html?id=components-segmentedcontrol--default');
  const items = page.getByRole('radio');
  const firstItem = items.nth(0);
  const secondItem = items.nth(1);

  await expect(firstItem).toBeVisible();
  await secondItem.click();
  await expect(secondItem).toHaveAttribute('aria-checked', 'true');
  await expect(firstItem).toHaveAttribute('aria-checked', 'false');
});
