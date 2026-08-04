import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('AnnouncementBanner renders as a region with its text', async ({ page }) => {
  await page.goto('iframe.html?id=components-announcementbanner--default');
  const banner = page.getByRole('region');
  await expect(banner).toBeVisible();
  await expect(banner).toContainText('Enter promotional text here');
});
