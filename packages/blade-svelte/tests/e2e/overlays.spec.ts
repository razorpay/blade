import { test, expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { gotoStory } from './support/story';

// Popover, Tooltip and Menu in a real browser: real placement against the
// trigger and the frame's edges, hover and tap, keyboard, and one Escape
// reaching only the topmost overlay.

type Box = { x: number; y: number; width: number; height: number };

async function boxOf(locator: Locator): Promise<Box> {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error('element is not laid out');
  }
  return box;
}

const focusedWithin = (locator: Locator): Promise<boolean> =>
  locator.evaluate((node) => node.contains(document.activeElement));

/** Moves focus to an element the keyboard's way, without a pointer. */
async function focusByKeyboard(page: Page, target: Locator): Promise<void> {
  await target.evaluate((node: HTMLElement) => node.focus());
  // A real key press, so `:focus-visible` and keyboard-only paths apply.
  await page.keyboard.press('Shift');
}

test.describe('Popover', () => {
  test('a press opens it above its trigger with focus inside; Escape closes it back to the trigger', async ({
    page,
  }) => {
    await gotoStory(page, 'components-popover--basic');
    const trigger = page.getByTestId('trigger');
    await trigger.click();
    const panel = page.getByTestId('popover');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('role', 'dialog');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect.poll(() => focusedWithin(panel)).toBe(true);

    // `placement: top`: the panel sits above the trigger, centred on it.
    const [panelBox, triggerBox] = await Promise.all([boxOf(panel), boxOf(trigger)]);
    expect(panelBox.y + panelBox.height).toBeLessThanOrEqual(triggerBox.y);
    expect(
      Math.abs(panelBox.x + panelBox.width / 2 - (triggerBox.x + triggerBox.width / 2)),
    ).toBeLessThan(2);

    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('placement bottom puts it under the trigger; a press outside closes it', async ({
    page,
  }) => {
    await gotoStory(page, 'components-popover--basic', { placement: 'bottom' });
    const trigger = page.getByTestId('trigger');
    await trigger.click();
    const panel = page.getByTestId('popover');
    await expect(panel).toBeVisible();
    const [panelBox, triggerBox] = await Promise.all([boxOf(panel), boxOf(trigger)]);
    expect(panelBox.y).toBeGreaterThanOrEqual(triggerBox.y + triggerBox.height);

    await page.mouse.click(2, 2);
    await expect(panel).toBeHidden();
  });

  test('one Escape closes only the topmost overlay: the tooltip inside, then the popover', async ({
    page,
  }) => {
    await gotoStory(page, 'components-popover--basic', { withTooltip: true });
    await page.getByTestId('trigger').click();
    const panel = page.getByTestId('popover');
    await expect(panel).toBeVisible();

    await focusByKeyboard(page, page.getByTestId('tip-trigger'));
    const tip = page.getByTestId('tip');
    await expect(tip).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(tip).toBeHidden();
    await expect(panel).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });

  test('openInteraction hover: opens under the pointer, with no close button, and closes when it leaves', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'a device that cannot hover opens it on a tap instead');
    await gotoStory(page, 'components-popover--basic', { openInteraction: 'hover' });
    await page.getByTestId('trigger').hover();
    const panel = page.getByTestId('popover');
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('button', { name: 'Close' })).toHaveCount(0);
    await page.mouse.move(2, 2);
    await expect(panel).toBeHidden();
  });
});

test.describe('Tooltip', () => {
  test('keyboard focus shows it and describes the trigger; blur hides it', async ({ page }) => {
    await gotoStory(page, 'components-tooltip--basic', { content: 'Charged by your bank' });
    const trigger = page.getByTestId('trigger');
    await focusByKeyboard(page, trigger);
    const tip = page.getByTestId('tip');
    await expect(tip).toBeVisible();
    await expect(tip).toHaveAttribute('role', 'tooltip');
    await expect(trigger).toHaveAttribute('aria-describedby', (await tip.getAttribute('id')) ?? '');

    await trigger.evaluate((node: HTMLElement) => node.blur());
    await expect(tip).toBeHidden();
    await expect(trigger).not.toHaveAttribute('aria-describedby', /.+/);
  });

  test('a pointer shows it: hover on desktop, a tap on a phone', async ({ page, isMobile }) => {
    await gotoStory(page, 'components-tooltip--basic', { content: 'Charged by your bank' });
    const trigger = page.getByTestId('trigger');
    if (isMobile) {
      await trigger.tap();
    } else {
      await trigger.hover();
    }
    await expect(page.getByTestId('tip')).toBeVisible();
  });

  test('flips and shifts to stay inside the frame from every corner', async ({ page }) => {
    await gotoStory(page, 'components-tooltip--edges', { placement: 'top' });
    const frame = await boxOf(page.getByTestId('frame'));
    for (const index of [0, 1, 2, 3]) {
      // One corner at a time: each tooltip is measured on its own.
      /* eslint-disable no-await-in-loop */
      await focusByKeyboard(page, page.getByTestId(`trigger-${index}`));
      const tip = page.getByTestId(`tip-${index}`);
      await expect(tip).toBeVisible();
      const box = await boxOf(tip);
      expect(box.x).toBeGreaterThanOrEqual(frame.x - 1);
      expect(box.y).toBeGreaterThanOrEqual(frame.y - 1);
      expect(box.x + box.width).toBeLessThanOrEqual(frame.x + frame.width + 1);
      expect(box.y + box.height).toBeLessThanOrEqual(frame.y + frame.height + 1);
      await page.getByTestId(`trigger-${index}`).evaluate((node: HTMLElement) => node.blur());
      await expect(tip).toBeHidden();
      /* eslint-enable no-await-in-loop */
    }
  });
});

test.describe('Menu', () => {
  test('opens on its first item, arrows skip the disabled one, Enter chooses and closes back to the trigger', async ({
    page,
  }) => {
    await gotoStory(page, 'components-menu--basic');
    const trigger = page.getByTestId('trigger');
    await trigger.click();
    const menu = page.getByTestId('menu');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute('role', 'menu');
    await expect(trigger).toHaveAttribute('aria-controls', (await menu.getAttribute('id')) ?? '');

    const items = menu.getByRole('menuitem');
    await expect(items.first()).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(items.nth(1)).toBeFocused();
    // "Make default" is disabled: the arrow lands on "Remove".
    await page.keyboard.press('ArrowDown');
    await expect(items.nth(3)).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(menu).toBeHidden();
    await expect(page.getByTestId('chose')).toHaveText('Remove');
    await expect(trigger).toBeFocused();
  });

  test('typing a letter jumps to the item, and Escape closes back to the trigger', async ({
    page,
  }) => {
    await gotoStory(page, 'components-menu--basic');
    const trigger = page.getByTestId('trigger');
    await trigger.click();
    const menu = page.getByTestId('menu');
    await expect(menu.getByRole('menuitem').first()).toBeFocused();
    await page.keyboard.press('c');
    await expect(menu.getByRole('menuitem', { name: 'Copy address' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(page.getByTestId('chose')).toHaveText('—');
  });
});
