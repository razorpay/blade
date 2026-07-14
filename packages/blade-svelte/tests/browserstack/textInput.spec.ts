import { test, expect } from '@playwright/test';
import { registerBrowserStackStatusReporter } from './reportStatus';

registerBrowserStackStatusReporter(test);

test('TextInput accepts typed input', async ({ page }) => {
  // BrowserStack mobile SDK's keystroke simulation reliably drops the space
  // character on both Google Pixel and iPhone, regardless of typing strategy
  // tried. Not reproducible on desktop. See MOBILE_TESTS_STATUS.md.
  test.skip(
    !!process.env.BROWSERSTACK_MOBILE,
    'Space character dropped by BrowserStack mobile SDK keystroke simulation',
  );
  // The default "TextInput" story's `type` arg is `url`, and `input[type=url]`
  // strips whitespace from typed values in every browser. Use the dedicated
  // "type number" story instead — TextInput coerces its DOM `type` to `text`
  // for anything other than `password`/`url`/etc, so it accepts spaces.
  await page.goto('iframe.html?id=components-input-textinput--text-input-with-type-number');
  const input = page.getByRole('textbox').first();
  await expect(input).toBeVisible();
  await input.pressSequentially('Hello Blade', { delay: 50 });
  // BrowserStack's mobile SDK doesn't support the toHaveValue assertion proxy,
  // so read the value directly instead.
  await expect(async () => {
    expect(await input.inputValue()).toBe('Hello Blade');
  }).toPass({ timeout: 5000 });
});
