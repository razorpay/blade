import { expect, test } from '@playwright/test';

test.describe.parallel('Button', () => {
  test('Button should click', async ({ page }) => {
    await page.goto(
      'https://blade.razorpay.com/iframe.html?id=components-button--button-ref&viewMode=story',
    );
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    await page.press('body', 'Tab');
    // const focusedElementText = await page.evaluate(() => document?.activeElement?.textContent);
    await expect(page.getByRole('button', { name: 'Button', exact: true })).toBeFocused();
    await page.press('body', 'Tab');
    await expect(
      page.getByRole('button', { name: 'Click to focus other button', exact: true }),
    ).toBeFocused({
      timeout: 1000,
    });
    await page.press('body', 'Enter');
    await expect(page.getByRole('button', { name: 'Button', exact: true })).toBeFocused({
      timeout: 1000,
    });
  });
});
