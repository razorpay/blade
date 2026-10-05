import { test, expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { gotoStory } from './support/story';

// Modal, BottomSheet and Drawer in a real browser: what jsdom cannot show —
// transitions that finish and unmount, real focus, real pointer drags, and
// layout (an edge-docked panel, chrome hanging outside the panel).

const lastSource = (page: Page): Locator => page.getByTestId('last-source');

/** Where the panel is now, rounded: a moving panel reads differently each frame. */
async function placement(panel: Locator): Promise<string> {
  const box = await panel.boundingBox();
  return box ? [box.x, box.y, box.width, box.height].map(Math.round).join(',') : '';
}

/** Waits until the panel's enter transition has finished: two reads apart agree. */
async function settled(panel: Locator): Promise<void> {
  let last = '';
  await expect
    .poll(async () => {
      const now = await placement(panel);
      const same = now !== '' && now === last;
      last = now;
      return same;
    })
    .toBe(true);
}

async function open(page: Page, panel: string): Promise<Locator> {
  await page.getByTestId('open').click();
  const dialog = page.getByTestId(panel);
  await expect(dialog).toBeVisible();
  await settled(dialog);
  return dialog;
}

/** Drags from the middle of `zone` by (dx, dy) with a real pointer, in steps. */
async function drag(page: Page, zone: Locator, dx: number, dy: number): Promise<void> {
  const box = await zone.boundingBox();
  if (!box) {
    throw new Error('drag zone is not laid out');
  }
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 12 });
  await page.mouse.up();
}

test.describe('Modal', () => {
  test('opens with focus inside, keeps Tab inside, and Escape closes it back to the trigger', async ({
    page,
  }) => {
    await gotoStory(page, 'components-modal--basic');
    const dialog = await open(page, 'modal');
    await expect(dialog).toHaveAttribute('role', 'dialog');
    await expect(dialog).toHaveAccessibleName('Remove this card?');

    // Focus moved in, and Tab never leaves the dialog.
    await expect
      .poll(() => dialog.evaluate((node) => node.contains(document.activeElement)))
      .toBe(true);
    // One key at a time: each Tab is checked where it lands.
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press('Tab');
      expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
    }
    /* eslint-enable no-await-in-loop */

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(lastSource(page)).toHaveText('escape');
    await expect(page.getByTestId('open')).toBeFocused();
  });

  test('the close button and the scrim dismiss it, each reporting its source', async ({ page }) => {
    await gotoStory(page, 'components-modal--basic');
    let dialog = await open(page, 'modal');
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).toBeHidden();
    await expect(lastSource(page)).toHaveText('cross');

    dialog = await open(page, 'modal');
    // The scrim is under everything outside the panel: press the frame's corner.
    const trigger = await page.getByTestId('open').boundingBox();
    if (!trigger) {
      throw new Error('trigger is not laid out');
    }
    await page.mouse.click(trigger.x + 2, trigger.y + 2);
    await expect(dialog).toBeHidden();
    await expect(lastSource(page)).toHaveText('blur');
  });

  test('a non-dismissible modal reports Escape but stays open, with no close button', async ({
    page,
  }) => {
    await gotoStory(page, 'components-modal--basic', { isDismissible: false });
    const dialog = await open(page, 'modal');
    await expect(dialog.getByRole('button', { name: 'Close' })).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(lastSource(page)).toHaveText('escape');
    await expect(dialog).toBeVisible();
  });

  test('chrome hangs above the panel and is not clipped by it', async ({ page }) => {
    await gotoStory(page, 'components-modal--basic', { withChrome: true });
    const dialog = await open(page, 'modal');
    const badge = page.getByTestId('chrome-badge');
    await expect(badge).toBeVisible();
    const [badgeBox, panelBox] = await Promise.all([badge.boundingBox(), dialog.boundingBox()]);
    expect(badgeBox && panelBox && badgeBox.y < panelBox.y).toBe(true);
    // The part above the panel's edge is still the badge: nothing clips it.
    const hit = await badge.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      const top = document.elementFromPoint(rect.left + rect.width / 2, rect.top + 4);
      return Boolean(top && node.contains(top));
    });
    expect(hit).toBe(true);
  });
});

test.describe('BottomSheet', () => {
  test('a drag down past half its height dismisses it with source drag', async ({ page }) => {
    await gotoStory(page, 'components-modal--bottom-sheet');
    const sheet = await open(page, 'sheet');
    const height = (await sheet.boundingBox())?.height ?? 0;
    await drag(page, page.getByTestId('sheet-drag-zone'), 0, height);
    await expect(sheet).toBeHidden();
    await expect(lastSource(page)).toHaveText('drag');
  });

  test('a short drag settles back and dismisses nothing', async ({ page }) => {
    await gotoStory(page, 'components-modal--bottom-sheet');
    const sheet = await open(page, 'sheet');
    const before = await sheet.boundingBox();
    await drag(page, page.getByTestId('sheet-drag-zone'), 0, 24);
    await expect(sheet).toBeVisible();
    await expect(lastSource(page)).toHaveText('—');
    // Settled where it rests, with the inline transform gone.
    await expect.poll(async () => (await sheet.boundingBox())?.y).toBeCloseTo(before?.y ?? 0, 0);
    await expect(sheet).toHaveAttribute('style', /^(?!.*translate)/);
  });

  test('not draggable: no handle and no drag zone', async ({ page }) => {
    await gotoStory(page, 'components-modal--bottom-sheet', { isDraggable: false });
    await open(page, 'sheet');
    await expect(page.getByTestId('sheet-drag-zone')).toHaveCount(0);
  });
});

test.describe('Drawer', () => {
  test('docks to the right edge at full height and Escape closes it', async ({ page }) => {
    await gotoStory(page, 'components-modal--drawer');
    const drawer = await open(page, 'drawer');
    const frame = page.locator('#storybook-root > div').first();
    const [drawerBox, frameBox] = await Promise.all([drawer.boundingBox(), frame.boundingBox()]);
    if (!drawerBox || !frameBox) {
      throw new Error('drawer or frame is not laid out');
    }
    // Flush with the frame's right edge (8px in from 768px up).
    const gap = frameBox.x + frameBox.width - (drawerBox.x + drawerBox.width);
    expect(gap).toBeGreaterThanOrEqual(0);
    expect(gap).toBeLessThanOrEqual(10);
    expect(drawerBox.height).toBeGreaterThan(frameBox.height * 0.9);

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(lastSource(page)).toHaveText('escape');
  });

  test('when draggable, a drag toward its edge dismisses it', async ({ page }) => {
    await gotoStory(page, 'components-modal--drawer', { isDraggable: true });
    const drawer = await open(page, 'drawer');
    const width = (await drawer.boundingBox())?.width ?? 0;
    await drag(page, page.getByTestId('drawer-drag-zone'), width, 0);
    await expect(drawer).toBeHidden();
    await expect(lastSource(page)).toHaveText('drag');
  });
});
