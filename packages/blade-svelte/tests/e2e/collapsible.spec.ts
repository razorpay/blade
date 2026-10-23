import { test, expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { gotoStory } from './support/story';

// Collapsible, a pure disclosure, in a real browser: the caller's Button
// toggles it with no wiring, the body slides open beside it, and the aria
// state follows.

async function boxOf(locator: Locator): Promise<{ y: number; height: number }> {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error('element is not laid out');
  }
  return box;
}

test.describe('Collapsible', () => {
  test('a press opens the body under the trigger and closes it again', async ({ page }) => {
    await gotoStory(page, 'components-collapsible--with-a-button');
    const trigger = page.getByTestId('trigger');
    const body = page.getByTestId('body');
    await expect(body).toHaveCount(0);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    await expect(body).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // The trigger controls the panel the body slides in.
    const panelId = await body.locator('xpath=..').getAttribute('id');
    await expect(trigger).toHaveAttribute('aria-controls', panelId ?? '');
    await expect
      .poll(async () => {
        const [triggerBox, bodyBox] = await Promise.all([boxOf(trigger), boxOf(body)]);
        return bodyBox.y - (triggerBox.y + triggerBox.height);
      })
      .toBeGreaterThanOrEqual(-1);

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    // Unmounted once the slide closes.
    await expect(body).toHaveCount(0);
  });

  test('direction top opens the body above the trigger', async ({ page }) => {
    await gotoStory(page, 'components-collapsible--with-a-button', { direction: 'top' });
    const trigger = page.getByTestId('trigger');
    await trigger.click();
    const body = page.getByTestId('body');
    await expect(body).toBeVisible();
    // The body grows upward over the slide, pushing the trigger down: compare
    // once it has settled.
    await expect
      .poll(async () => {
        const [triggerBox, bodyBox] = await Promise.all([boxOf(trigger), boxOf(body)]);
        return triggerBox.y - (bodyBox.y + bodyBox.height);
      })
      .toBeGreaterThanOrEqual(-1);
  });

  test('the keyboard toggles it through the Button', async ({ page }) => {
    await gotoStory(page, 'components-collapsible--with-a-button');
    const trigger = page.getByTestId('trigger');
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('body')).toBeVisible();
    await page.keyboard.press(' ');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
