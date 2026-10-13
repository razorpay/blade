import { test, expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { gotoStory } from './support/story';

// OTPInput, a formatted TextInput and PhoneNumberInput in a real browser:
// real typing, pasting and caret positions, and the country picker's form on
// a phone and on a desktop.

const cell = (page: Page, index: number): Locator => page.getByTestId(`otp-${index}`);

/** Pastes text into the focused element as the clipboard would. */
async function paste(target: Locator, text: string): Promise<void> {
  await target.evaluate((node, value) => {
    const data = new DataTransfer();
    data.setData('text/plain', value);
    node.dispatchEvent(
      new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }),
    );
  }, text);
}

/** The control's text and caret, read together. */
const caret = (input: Locator): Promise<{ value: string; at: number | null }> =>
  input.evaluate((node: HTMLInputElement) => ({ value: node.value, at: node.selectionStart }));

test.describe('OTPInput', () => {
  test('typing moves focus cell to cell and fills the value', async ({ page }) => {
    await gotoStory(page, 'components-input-otpinput--basic', { otpLength: 4 });
    await cell(page, 0).click();
    for (const [index, digit] of ['1', '2', '3', '4'].entries()) {
      // A user types one digit at a time; each lands in its own cell.
      /* eslint-disable no-await-in-loop */
      await page.keyboard.type(digit);
      if (index < 3) {
        await expect(cell(page, index + 1)).toBeFocused();
      }
      /* eslint-enable no-await-in-loop */
    }
    await expect(page.getByTestId('value')).toHaveText('"1234"');
  });

  test('a pasted code fills every cell', async ({ page }) => {
    await gotoStory(page, 'components-input-otpinput--basic', { otpLength: 4 });
    await cell(page, 0).click();
    await paste(cell(page, 0), '9876');
    await expect(page.getByTestId('value')).toHaveText('"9876"');
    await expect(cell(page, 3)).toHaveValue('6');
  });

  test('Backspace clears a cell and steps back', async ({ page }) => {
    await gotoStory(page, 'components-input-otpinput--basic', { otpLength: 4 });
    await cell(page, 0).click();
    await page.keyboard.type('123');
    await expect(cell(page, 3)).toBeFocused();
    await page.keyboard.press('Backspace');
    await expect(cell(page, 2)).toBeFocused();
    await page.keyboard.press('Backspace');
    await expect(page.getByTestId('value')).toHaveText('"1"');
  });
});

test.describe('TextInput with format', () => {
  test('groups a card number as it is typed and keeps the parsed digits', async ({ page }) => {
    await gotoStory(page, 'components-input-textinput--formatted');
    const input = page.getByTestId('card-number');
    await input.click();
    await page.keyboard.type('4111111111111111');
    await expect(input).toHaveValue('4111 1111 1111 1111');
    await expect(page.getByTestId('card-value')).toHaveText('"4111111111111111"');
  });

  test('typing in the middle keeps the caret after what was typed', async ({ page }) => {
    await gotoStory(page, 'components-input-textinput--formatted');
    const input = page.getByTestId('card-number');
    await input.click();
    await page.keyboard.type('41112222');
    await expect(input).toHaveValue('4111 2222');
    // Caret after "4111 ", then a digit: the rest shifts, the caret follows it.
    await input.evaluate((node: HTMLInputElement) => node.setSelectionRange(5, 5));
    await page.keyboard.type('5');
    await expect.poll(() => caret(input)).toEqual({ value: '4111 5222 2', at: 6 });
  });

  test('an expiry pads the month and adds its separator', async ({ page }) => {
    await gotoStory(page, 'components-input-textinput--formatted');
    const input = page.getByTestId('expiry');
    await input.click();
    await page.keyboard.type('5');
    await expect(input).toHaveValue('05');
    await page.keyboard.type('27');
    await expect(input).toHaveValue('05 / 27');
    await expect(page.getByTestId('expiry-value')).toHaveText('"0527"');
  });
});

test.describe('PhoneNumberInput', () => {
  test('the picker is a sheet on a phone and a modal from 768px; picking a country keeps the number', async ({
    page,
  }) => {
    await gotoStory(page, 'components-input-phonenumberinput--basic', { withSearch: true });
    const number = page.getByTestId('phone');
    await number.click();
    await page.keyboard.type('123456789');

    await page.getByTestId('phone-country').click();
    const picker = page.getByTestId('phone-picker');
    await expect(picker).toBeVisible();
    const isPhone = (page.viewportSize()?.width ?? 0) < 768;
    // The lazily loaded body arrives, then the form follows the viewport.
    await expect(page.getByTestId('phone-search')).toBeVisible();
    await expect(page.getByTestId('phone-picker-drag-zone')).toHaveCount(isPhone ? 1 : 0);

    await page.getByTestId('phone-search').fill('malay');
    await page.getByTestId('phone-countries').getByText('Malaysia').click();
    await expect(picker).toBeHidden();
    await expect(page.getByTestId('country')).toHaveText('MY');
    await expect(page.getByTestId('value')).toHaveText('+60123456789');
  });
});
