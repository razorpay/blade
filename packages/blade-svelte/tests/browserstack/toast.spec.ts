import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Toast shows on trigger click and dismisses on dismiss click', async ({ page }) => {
  await page.goto('iframe.html?id=components-toast--basic');
  const showButton = page.getByRole('button', { name: 'Show Toast' });
  await showButton.click();

  const toastContent = page.getByText('Payment successful');
  await expect(toastContent).toBeVisible();

  const dismissButton = page.getByRole('button', { name: 'Dismiss toast' });
  await dismissButton.click();
  await expect(toastContent).not.toBeVisible();
});
