import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('RadioGroup selects a single radio on click', async ({ page }) => {
  await page.goto('iframe.html?id=components-radio-radiogroup--default');
  const radios = page.getByRole('radio');
  const firstRadio = radios.nth(0);
  const secondRadio = radios.nth(1);

  await expect(firstRadio).toBeVisible();
  // The native input is visually hidden (clipped) in favor of a custom icon
  // rendered by a sibling element, so `.check()` tries to click the input's
  // own (invisible/off-viewport) bounding box and times out on BrowserStack's
  // mobile SDK. Click the ancestor <label> instead.
  const secondRadioLabel = secondRadio.locator('xpath=ancestor::label[1]');
  await secondRadioLabel.click();
  await expect(secondRadio).toBeChecked();
  await expect(firstRadio).not.toBeChecked();
});
