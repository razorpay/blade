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

/** The text of the row holding the focused control. */
const focusedRow = (page: Page): Promise<string> =>
  page.evaluate(() => document.activeElement?.closest('label')?.textContent?.trim() ?? '');

/**
 * Picks a country in the open list the keyboard's way: Tab into the rows
 * (past a sheet's close button), type the name (the list scrolls to rows it
 * has not mounted), then Enter.
 */
async function pickByTypeahead(page: Page, name: string): Promise<void> {
  const inRows = (): Promise<boolean> =>
    page.evaluate(() =>
      Boolean(document.activeElement?.closest('[data-testid="phone-countries"]')),
    );
  // One Tab at a time, checking where each lands.
  /* eslint-disable no-await-in-loop */
  for (let tabs = 0; tabs < 3 && !(await inRows()); tabs += 1) {
    await page.keyboard.press('Tab');
  }
  /* eslint-enable no-await-in-loop */
  await page.keyboard.type(name);
  await expect.poll(() => focusedRow(page)).toContain(name);
  await page.keyboard.press('Enter');
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
  test('groups a card number as it is typed; the value is the formatted text, as Blade', async ({
    page,
  }) => {
    await gotoStory(page, 'components-input-textinput--formatted');
    const input = page.getByTestId('card-number');
    await input.click();
    await page.keyboard.type('4111111111111111');
    await expect(input).toHaveValue('4111 1111 1111 1111');
    await expect(page.getByTestId('card-value')).toHaveText('"4111 1111 1111 1111"');
  });

  test('typing in the middle keeps the caret after what was typed', async ({ page }) => {
    await gotoStory(page, 'components-input-textinput--formatted');
    const input = page.getByTestId('card-number');
    await input.click();
    await page.keyboard.type('41112222');
    // A full group places the next delimiter, as Blade's formatter does.
    await expect(input).toHaveValue('4111 2222 ');
    // Caret after "4111 ", then a digit: the rest shifts, the caret follows it.
    await input.evaluate((node: HTMLInputElement) => node.setSelectionRange(5, 5));
    await page.keyboard.type('5');
    await expect.poll(() => caret(input)).toEqual({ value: '4111 5222 2', at: 6 });
  });

  test('an expiry places its separator, and the mask caps the length', async ({ page }) => {
    await gotoStory(page, 'components-input-textinput--formatted');
    const input = page.getByTestId('expiry');
    await input.click();
    await page.keyboard.type('12');
    // A full group places its delimiter, as Blade's formatter does.
    await expect(input).toHaveValue('12/');
    await page.keyboard.type('2599');
    await expect(input).toHaveValue('12/25');
    await expect(page.getByTestId('expiry-value')).toHaveText('"12/25"');
  });
});

test.describe('PhoneNumberInput', () => {
  test('the countries drop down under the field, as wide as it; picking one keeps the number', async ({
    page,
  }) => {
    await gotoStory(page, 'components-input-phonenumberinput--basic');
    const number = page.getByTestId('phone');
    await number.click();
    await page.keyboard.type('123456789');

    await page.getByTestId('phone-country').click();
    const picker = page.getByTestId('phone-picker');
    await expect(picker).toBeVisible();
    // The list arrives in a dropdown as wide as the field's frame.
    await expect(page.getByTestId('phone-countries')).toBeVisible();
    const frame = await number.locator('xpath=..').boundingBox();
    const panel = await picker.boundingBox();
    expect(Math.round(panel!.width)).toBe(Math.round(frame!.width));
    expect(panel!.y).toBeGreaterThan(frame!.y + frame!.height);

    // The list is virtual and opens at the pick: Malaysia is not mounted yet.
    // Typeahead scrolls to it, and focus follows the jump.
    await pickByTypeahead(page, 'Malaysia');
    await expect(picker).toBeHidden();
    await expect(page.getByTestId('country')).toHaveText('MY');
    await expect(page.getByTestId('value')).toHaveText('+60123456789');
  });

  test('an app presenter shows the list its own way (a sheet here)', async ({ page }) => {
    await gotoStory(page, 'components-input-phonenumberinput--basic', { presentAsSheet: true });
    await page.getByTestId('phone-country').click();
    await expect(page.getByTestId('phone-picker-drag-zone')).toHaveCount(1);
    await pickByTypeahead(page, 'Malaysia');
    await expect(page.getByTestId('country')).toHaveText('MY');
  });
});
