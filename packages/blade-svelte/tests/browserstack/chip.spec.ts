import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('ChipGroup selects a chip on click (single selection)', async ({ page }) => {
  await page.goto('iframe.html?id=components-chip-chipgroup--single-selection');
  const chips = page.locator('input[type="radio"], input[type="checkbox"]');
  const firstChip = chips.nth(0);
  const secondChip = chips.nth(1);

  await expect(firstChip).toBeVisible();
  // The native input backing the chip is visually hidden (sr-only) in favor of
  // the styled chip surface, so `.check()` tries to click the input's own
  // (invisible/off-viewport) bounding box and times out on BrowserStack's
  // mobile SDK. Click the ancestor <label> (the visible chip surface) instead.
  const secondChipLabel = secondChip.locator('xpath=ancestor::label[1]');
  await secondChipLabel.click();
  await expect(secondChip).toBeChecked();
});
