import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('PasswordInput toggles visibility on reveal button click', async ({ page }) => {
  await page.goto('iframe.html?id=components-input-passwordinput--default');
  const input = page.locator('input[type="password"], input[type="text"]').first();
  const revealButton = page.getByRole('button').first();

  await expect(input).toHaveAttribute('type', 'password');
  await input.fill('secret123');
  await revealButton.click();
  await expect(input).toHaveAttribute('type', 'text');
  await revealButton.click();
  await expect(input).toHaveAttribute('type', 'password');
});
