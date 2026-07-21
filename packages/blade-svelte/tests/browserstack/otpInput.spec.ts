import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('OTPInput accepts digits and moves focus across fields', async ({ page }) => {
  await page.goto('iframe.html?id=components-input-otpinput--otp-input');
  const fields = page.getByRole('textbox');
  await expect(fields.first()).toBeVisible();
  const fieldCount = await fields.count();
  expect(fieldCount).toBeGreaterThan(1);

  await fields.nth(0).click();
  await page.keyboard.type('1');
  await expect(fields.nth(1)).toBeFocused();
});
