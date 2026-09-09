import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('PhoneNumberInput accepts typed digits', async ({ page }) => {
  await page.goto('iframe.html?id=components-input-phonenumberinput--default');
  const input = page.getByRole('textbox').last();
  await expect(input).toBeVisible();
  await input.fill('9876543210');
  // BrowserStack's mobile SDK doesn't support the toHaveValue assertion proxy,
  // so read the value directly instead.
  expect(await input.inputValue()).toBe('9876543210');
});
