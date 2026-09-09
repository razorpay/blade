import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Heading renders its text content', async ({ page }) => {
  await page.goto('iframe.html?id=components-typography-heading--heading');
  const heading = page.getByText('Get Started With Payment Gateway');
  await expect(heading).toBeVisible();
});
