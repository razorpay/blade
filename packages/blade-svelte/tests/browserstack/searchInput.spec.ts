import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('SearchInput accepts typed input', async ({ page }) => {
  await page.goto('iframe.html?id=components-input-searchinput--default');
  const input = page.getByRole('searchbox').or(page.getByRole('textbox')).first();
  await expect(input).toBeVisible();
  await input.fill('razorpay');
  // BrowserStack's mobile SDK doesn't support the toHaveValue assertion proxy,
  // so read the value directly instead.
  expect(await input.inputValue()).toBe('razorpay');
});
