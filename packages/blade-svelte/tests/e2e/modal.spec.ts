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
/**
 * Drags from the middle of `zone` by (dx, dy). Over `duration` ms, in steps:
 * the sheet reads speed as well as distance (a fast flick dismisses), so a
 * drag meant to settle has to be slow, as a finger's is.
 */
async function drag(
  page: Page,
  zone: Locator,
  dx: number,
  dy: number,
  duration = 0,
): Promise<void> {
  const box = await zone.boundingBox();
  if (!box) {
    throw new Error('drag zone is not laid out');
  }
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const steps = 12;
  await page.mouse.move(x, y);
  await page.mouse.down();
  /* eslint-disable no-await-in-loop -- one pointer move at a time, paced */
  for (let step = 1; step <= steps; step += 1) {
    await page.mouse.move(x + (dx * step) / steps, y + (dy * step) / steps);
    if (duration) await page.waitForTimeout(duration / steps);
  }
  /* eslint-enable no-await-in-loop */
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

// The app's shell, as the docs recommend: BladeProvider's positioned parent,
// at most the screen, with the app's scrolling element as BladeProvider's
// direct child — so the overlay host BladeProvider renders after it covers
// exactly the shell. These reshape the story's box (already the positioned
// parent) into a full-height shell or a short one inside a longer page.
type Shell = 'full' | 'short';

async function reshape(page: Page, shell: Shell): Promise<void> {
  await page.evaluate((kind) => {
    const box = document.querySelector<HTMLElement>('#storybook-root > div')!;
    const scrim = document.querySelector<HTMLElement>('[aria-hidden="true"][data-state]')!;
    const content = scrim.parentElement!.previousElementSibling as HTMLElement;
    Object.assign(box.style, {
      height: 'auto',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
    });
    content.dataset.testid = 'shell-content';
    const tall = document.createElement('div');
    tall.style.height = '3000px';
    if (kind === 'full') {
      box.style.maxHeight = '100dvh';
      Object.assign(content.style, { minHeight: '0', flex: '1 1 auto', overflow: 'auto' });
      content.append(tall);
    } else {
      box.after(tall);
    }
  }, shell);
}

const scrollPositions = (page: Page): Promise<{ page: number; content: number }> =>
  page.evaluate(() => ({
    page: Math.round(scrollY),
    content: Math.round(document.querySelector('[data-testid="shell-content"]')!.scrollTop),
  }));

/** The shell: the overlay host's parent. */
const shellOf = (page: Page): Locator =>
  page.locator('[aria-hidden="true"][data-state]').locator('xpath=../..');

test.describe('Shell', () => {
  test('a full-height shell scrolls its content; a modal opens in view and nothing behind it scrolls', async ({
    page,
    browserName,
    isMobile,
  }) => {
    await gotoStory(page, 'components-modal--basic');
    await reshape(page, 'full');
    const viewport = page.viewportSize()!;
    const shell = await shellOf(page).boundingBox();
    expect(shell && Math.round(shell.height)).toBe(viewport.height);

    await page.getByTestId('shell-content').evaluate((node) => {
      node.scrollTop = 1500;
    });
    await page.getByTestId('open').evaluate((node: HTMLElement) => node.click());
    const dialog = page.getByTestId('modal');
    await expect(dialog).toBeVisible();
    await settled(dialog);
    await expect(dialog).toBeInViewport({ ratio: 1 });

    // Mobile WebKit has no mouse wheel: the wheel behind the overlay is a
    // desktop's to prove.
    if (browserName === 'webkit' && isMobile) return;

    const box = (await dialog.boundingBox())!;
    // Over the scrim (inside the shell: Storybook pads around it), then the panel.
    await page.mouse.move(shell!.x + 10, viewport.height / 2);
    await page.mouse.wheel(0, 1200);
    await page.mouse.move(box.x + 20, box.y + 15);
    await page.mouse.wheel(0, 1200);
    await expect.poll(() => scrollPositions(page)).toEqual({ page: 0, content: 1500 });
  });

  test('over a shorter shell the overlay covers only the shell, and a wheel over it moves no page', async ({
    page,
    browserName,
    isMobile,
  }) => {
    test.skip(browserName === 'webkit' && isMobile, 'mobile WebKit has no mouse wheel');
    await gotoStory(page, 'components-modal--basic');
    await reshape(page, 'short');
    await open(page, 'modal');
    const [shell, scrim] = await Promise.all([
      shellOf(page).boundingBox(),
      page.locator('[aria-hidden="true"][data-state]').boundingBox(),
    ]);
    // Inside the story box's 1px border.
    expect(scrim).toEqual({
      x: shell!.x + 1,
      y: shell!.y + 1,
      width: shell!.width - 2,
      height: shell!.height - 2,
    });
    expect(shell!.height).toBeLessThan(page.viewportSize()!.height);

    await page.mouse.move(shell!.x + 10, shell!.y + shell!.height - 10);
    await page.mouse.wheel(0, 1200);
    await expect.poll(() => scrollPositions(page)).toEqual({ page: 0, content: 0 });
  });

  test('a shell of set height is what the overlay covers', async ({ page }) => {
    await gotoStory(page, 'components-modal--basic');
    await open(page, 'modal');
    const [shell, scrim] = await Promise.all([
      page.locator('#storybook-root > div').boundingBox(),
      page.locator('[aria-hidden="true"][data-state]').boundingBox(),
    ]);
    // Inside the story box's 1px border.
    expect(Math.round(scrim!.height)).toBe(Math.round(shell!.height) - 2);
  });
});

test.describe('BottomSheet', () => {
  test('a drag down past half its height dismisses it with source drag', async ({ page }) => {
    await gotoStory(page, 'components-bottomsheet--basic');
    const sheet = await open(page, 'sheet');
    const height = (await sheet.boundingBox())?.height ?? 0;
    await drag(page, page.getByTestId('sheet-drag-zone'), 0, height);
    await expect(sheet).toBeHidden();
    await expect(lastSource(page)).toHaveText('drag');
  });

  test('a short drag settles back and dismisses nothing', async ({ page }) => {
    await gotoStory(page, 'components-bottomsheet--basic');
    const sheet = await open(page, 'sheet');
    const before = await sheet.boundingBox();
    // 24px over 480ms: 50px/s, far below a fling.
    await drag(page, page.getByTestId('sheet-drag-zone'), 0, 24, 480);
    await expect(sheet).toBeVisible();
    await expect(lastSource(page)).toHaveText('—');
    // Settled where it rests, with the inline transform gone.
    await expect.poll(async () => (await sheet.boundingBox())?.y).toBeCloseTo(before?.y ?? 0, 0);
    await expect(sheet).toHaveAttribute('style', /^(?!.*translate)/);
  });

  test('not draggable: no handle and no drag zone', async ({ page }) => {
    await gotoStory(page, 'components-bottomsheet--basic', { isDraggable: false });
    await open(page, 'sheet');
    await expect(page.getByTestId('sheet-drag-zone')).toHaveCount(0);
  });
});

test.describe('Drawer', () => {
  test('docks to the right edge at full height and Escape closes it', async ({ page }) => {
    await gotoStory(page, 'components-drawer--basic');
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
    await gotoStory(page, 'components-drawer--basic', { isDraggable: true });
    const drawer = await open(page, 'drawer');
    const width = (await drawer.boundingBox())?.width ?? 0;
    await drag(page, page.getByTestId('drawer-drag-zone'), width, 0);
    await expect(drawer).toBeHidden();
    await expect(lastSource(page)).toHaveText('drag');
  });
});
