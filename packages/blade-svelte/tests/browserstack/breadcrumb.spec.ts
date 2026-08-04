import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Breadcrumb renders links with correct hrefs and marks current page', async ({ page }) => {
  await page.goto('iframe.html?id=components-breadcrumb--basic');
  const dashboardLink = page.getByRole('link', { name: 'Dashboard' });
  await expect(dashboardLink).toHaveAttribute('href', '/dashboard');

  const currentPage = page.getByText('Settlements');
  await expect(currentPage).toBeVisible();
});
