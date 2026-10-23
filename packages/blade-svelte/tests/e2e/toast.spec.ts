import { test, expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { gotoStory } from './support/story';

// The app's ToastContainer in a real browser: its toasts move into the
// overlay host and stack there, real timers that a hover holds, and an
// action whose promise keeps it busy.

async function bottomOf(locator: Locator): Promise<number> {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error('element is not laid out');
  }
  return box.y + box.height;
}

test.describe('ToastContainer', () => {
  test('shows its toasts in the overlay host, the newest at the edge', async ({ page }) => {
    await gotoStory(page, 'components-toast--basic', { duration: 0 });
    await page.getByTestId('show').click();
    await page.getByTestId('show').click();

    const region = page.getByTestId('toasts');
    await expect(region).toHaveAttribute('aria-label', 'Notifications');
    // Moved into BladeProvider's host, beside its live region: over open modals.
    await expect(region.locator('xpath=..').locator('[role="log"]')).toHaveCount(1);
    await expect(page.getByTestId('toast-1')).toBeVisible();
    await expect(page.getByTestId('toast-2')).toBeVisible();
    // `placement: bottom`: the newest sits at the bottom edge, the older one above it.
    expect(await bottomOf(page.getByTestId('toast-1'))).toBeLessThan(
      await bottomOf(page.getByTestId('toast-2')),
    );
  });

  test('a hover holds the timer; leaving lets it run out', async ({ page, isMobile }) => {
    test.skip(isMobile, 'no hover on a phone: a tap expands the stack instead');
    await gotoStory(page, 'components-toast--basic', { duration: 1200 });
    await page.getByTestId('show').click();
    const toast = page.getByTestId('toast-1');
    await expect(toast).toBeVisible();

    await toast.hover();
    await page.waitForTimeout(2000);
    await expect(toast).toBeVisible();

    await page.mouse.move(2, 2);
    await expect(toast).toBeHidden({ timeout: 4000 });
    await expect(page.getByTestId('last')).toHaveText('timeout');
  });

  test("the action's promise shows it busy, then its cancel dismisses the toast", async ({
    page,
  }) => {
    await gotoStory(page, 'components-toast--basic', { duration: 0 });
    await page.getByTestId('show').click();
    const toast = page.getByTestId('toast-1');
    const undo = toast.getByText('Undo');
    await undo.click();
    await expect(undo).toHaveAttribute('aria-busy', 'true');
    await expect(toast).toBeHidden({ timeout: 4000 });
    await expect(page.getByTestId('last')).toHaveText('undone');
  });

  test('in a short shell (overflow-hidden, as documented) an expanded stack stays inside it', async ({
    page,
    isMobile,
  }) => {
    await gotoStory(page, 'components-toast--basic', { duration: 0 });
    // The story's box is the shell: as tall as its content, so three
    // expanded toasts are taller than it.
    const shell = page.locator('#storybook-root > div');
    await shell.evaluate((node: HTMLElement) => {
      node.style.height = 'auto';
    });
    const show = page.getByTestId('show');
    for (let shown = 0; shown < 3; shown += 1) {
      // A toast covers the trigger in a shell this short.
      // eslint-disable-next-line no-await-in-loop -- one toast at a time, in order
      await show.evaluate((node: HTMLElement) => node.click());
    }
    const newest = page.getByTestId('toast-3');
    await expect(newest).toBeVisible();
    // A pointer holds the stack expanded; a tap toggles it.
    await (isMobile ? newest.tap() : newest.hover());
    const toasts = page.locator('[data-testid^="toast-"]');
    await expect
      .poll(async () => {
        const [box, tops] = await Promise.all([
          shell.boundingBox(),
          toasts.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top)),
        ]);
        return Boolean(box) && Math.min(...tops) < box!.y;
      })
      .toBe(true);
    // The stack reaches past the shell's top, but nothing of it is drawn there.
    const drawnAbove = await shell.evaluate((node) => {
      const box = node.getBoundingClientRect();
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top - 4);
      return Boolean(hit?.closest('[data-testid^="toast-"]'));
    });
    expect(drawnAbove).toBe(false);
  });
});
