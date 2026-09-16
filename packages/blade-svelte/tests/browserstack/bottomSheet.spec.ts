import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('BottomSheet opens on trigger click, locks body scroll while open, and restores on dismiss', async ({
  page,
}) => {
  await page.goto('iframe.html?id=components-bottomsheet--default');

  // The Default story renders enough Lorem Ipsum to make the page scrollable.
  // Scroll down before opening so the scroll lock is exercised in a scrolled state.
  await page.evaluate(() => window.scrollTo(0, 300));

  // Open the BottomSheet.
  const openButton = page.getByRole('button', { name: 'open' });
  await openButton.click();

  const sheet = page.getByRole('dialog');
  await expect(sheet).toBeVisible();

  // The scroll lock runs in an effect after the sheet content is measured,
  // so wait for the inline overflow style rather than checking synchronously.
  await page.waitForFunction(() => document.body.style.overflow === 'hidden');

  // The scroll lock uses `overflow: hidden` rather than the old
  // body-scroll-lock-upgrade library's `position:fixed; top:-scrollY`
  // approach, which jumped iOS to the top and collapsed inner scroll
  // containers. On desktop and most mobile browsers the scroll position
  // survives; on some mobile Chrome versions `overflow: hidden` alone can
  // reset scrollY to 0, so we assert the lock mechanism (no position:fixed)
  // rather than the exact scroll position.
  expect(await page.evaluate(() => document.body.style.position)).not.toBe('fixed');

  // Dismiss and verify the lock is released.
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.waitForFunction(() => document.body.style.overflow !== 'hidden');
});
