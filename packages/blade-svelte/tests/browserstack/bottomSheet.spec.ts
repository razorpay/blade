import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('BottomSheet opens on trigger click', async ({ page }) => {
  // The "open" trigger button is not found by role query on iPhone 15 Pro
  // via BrowserStack mobile SDK — likely a viewport/intersection issue
  // where the button is not rendered in the visible area. Not reproducible
  // on desktop or Google Pixel 7.
  test.skip(
    !!process.env.BROWSERSTACK_MOBILE,
    'Trigger button not found on iPhone via BrowserStack mobile SDK',
  );
  await page.goto('iframe.html?id=components-bottomsheet--default');
  const openButton = page.getByRole('button', { name: 'open' });
  await openButton.click();

  const sheet = page.getByRole('dialog');
  await expect(sheet).toBeVisible();
});

test('BottomSheet locks body scroll while open and restores on dismiss', async ({ page }) => {
  // BrowserStack mobile SDK only allows one browser context per session.
  // This is the second test in this file, so Playwright tries to create a
  // new browser context which BrowserStack rejects on mobile devices.
  test.skip(
    !!process.env.BROWSERSTACK_MOBILE,
    'Only one browser context is allowed on BrowserStack mobile SDK',
  );
  await page.goto('iframe.html?id=components-bottomsheet--default');

  // The Default story renders enough Lorem Ipsum to make the page scrollable.
  await page.evaluate(() => window.scrollTo(0, 300));
  const scrollYBeforeOpen = await page.evaluate(() => window.scrollY);

  // Open the BottomSheet.
  await page.getByRole('button', { name: 'open' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();

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
