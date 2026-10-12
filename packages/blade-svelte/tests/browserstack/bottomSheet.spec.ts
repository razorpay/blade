import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('BottomSheet opens on trigger click, locks body scroll while open, and restores on dismiss', async ({
  page,
}) => {
  await page.goto('iframe.html?id=components-bottomsheet--default');

  // The Default story renders enough Lorem Ipsum to make the page scrollable.
  await page.evaluate(() => window.scrollTo(0, 300));
  const scrollYBeforeOpen = await page.evaluate(() => window.scrollY);

  // Open the BottomSheet.
  const openButton = page.getByRole('button', { name: 'open' });
  await openButton.click();

  const sheet = page.getByRole('dialog');
  await expect(sheet).toBeVisible();

  // The scroll lock runs in an effect after the sheet content is measured,
  // so wait for the inline overflow style rather than checking synchronously.
  await page.waitForFunction(() => document.body.style.overflow === 'hidden');

  // The page's scroll position is preserved — the old body-scroll-lock-upgrade
  // library moved the page to position:fixed on iOS, jumping it to the top.
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollYBeforeOpen);

  // Dismiss and verify the lock is released.
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.waitForFunction(() => document.body.style.overflow !== 'hidden');
});
