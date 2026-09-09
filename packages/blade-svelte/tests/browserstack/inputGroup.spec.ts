import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('InputGroup fields accept input independently', async ({ page }) => {
  await page.goto('iframe.html?id=components-inputgroup--default');
  const inputs = page.getByRole('textbox');
  await expect(inputs.first()).toBeVisible();

  await inputs.first().fill('John');
  // BrowserStack's mobile SDK doesn't support the toHaveValue assertion proxy,
  // so read the value directly instead.
  expect(await inputs.first().inputValue()).toBe('John');
});
