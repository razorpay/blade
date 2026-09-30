import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Switch toggles checked state on click', async ({ page }) => {
  // The label-click workaround still times out on iPhone 15 Pro via
  // BrowserStack mobile SDK — the click doesn't reliably toggle the
  // switch input. Not reproducible on desktop or Google Pixel 7.
  test.skip(
    !!process.env.BROWSERSTACK_MOBILE,
    'Switch toggle via label click times out on iPhone via BrowserStack mobile SDK',
  );
  await page.goto('iframe.html?id=components-switch--default');
  const switchInput = page.getByRole('switch').first();
  await expect(switchInput).toBeVisible();
  await expect(switchInput).not.toBeChecked();
  // The native input is visually hidden (clipped) in favor of a custom
  // track/thumb rendered by a sibling element, so `.check()`/`.uncheck()`
  // try to click the input's own (invisible/off-viewport) bounding box and
  // time out on BrowserStack's mobile SDK. Click the ancestor <label> instead.
  const switchLabel = switchInput.locator('xpath=ancestor::label[1]');
  await switchLabel.click();
  await expect(switchInput).toBeChecked();
  await switchLabel.click();
  await expect(switchInput).not.toBeChecked();
});
