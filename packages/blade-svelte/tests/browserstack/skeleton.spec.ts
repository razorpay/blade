import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('Skeleton renders visibly in the DOM', async ({ page }) => {
  await page.goto('iframe.html?id=components-skeleton--basic');
  const root = page.locator('#storybook-root');
  await expect(root.locator('div').first()).toBeVisible();
});
