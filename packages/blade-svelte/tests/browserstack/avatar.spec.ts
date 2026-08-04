import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Interactive Avatar renders as a link when href is set', async ({ page }) => {
  await page.goto(
    'iframe.html?id=components-avatar-avatar--interactive-and-non-interactive-avatar',
  );
  const link = page.getByRole('link');
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', 'https://razorpay.com');
});
