/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { expect, browser } from '@wdio/globals';
import { setupBrowser } from '@testing-library/webdriverio';
import { Key } from 'webdriverio';

const goTo = async (test: string): Promise<void> => {
  await browser.url(`?args=&id=${test}&viewMode=story`);
  await browser.waitUntil(async () => (await browser.getTitle()).match(test), {
    timeout: 20000,
  });
};

const label = 'Phone Number';

describe('PhoneNumberInput', () => {
  it.skip('Should select a country', async () => {
    if (browser.isMobile) return;

    await goTo('components-e2e-tests-phonenumberinput--select-a-country');
    const { getByLabelText, getByRole, queryByRole } = setupBrowser(browser);

    // Ensure the country selector is closed
    await expect(await queryByRole('menu')).not.toExist();

    // Click on the country selector and open it
    const button = await getByRole('button', { name: /select country/i });
    await button.click();
    await browser.pause(300);

    // Use arrow keys to navigate to a country
    await browser.keys(['ArrowDown', 'ArrowDown']);

    // Click on the country to select it
    await browser.keys(['Enter']);
    await browser.pause(300);

    // Ensure the country selector is closed
    await expect(await queryByRole('menu')).not.toExist();

    // expect albania to be selected
    await expect(await getByRole('button', { name: /albania/i })).toExist();
    await browser.pause(300);

    // Ensure that input is in focus, input is tel type;
    await expect(await getByLabelText(label)).toBeFocused();
  });

  it('should work with uncontrolled state', async () => {
    await goTo('components-e2e-tests-phonenumberinput--uncontrolled-state');
    const { getByLabelText } = setupBrowser(browser);

    const input = await getByLabelText(label);

    // Focus on input
    await input.click();

    // Ensure default value is set
    await expect(input).toHaveValue('9876543210');

    // Type inside input
    await input.clearValue();
    await input.setValue('1234567890');

    // Ensure the value of the input updates
    // Some issue with iOS wdio, toHaveValue is not working
    // https://github.com/webdriverio/webdriverio/issues/7039
    await expect(input).toHaveValue('1234567890');

    // expect onChange to be called
    const onChangeData = await browser.execute(() => (window as any).onChangeData);
    expect(onChangeData).toEqual({
      country: 'IN',
      dialCode: '+91',
      name: null,
      phoneNumber: '1234 567890',
      value: '1234567890',
    });
  });

  it('should work with controlled state', async () => {
    await goTo('components-e2e-tests-phonenumberinput--controlled-state');
    const { getByLabelText } = setupBrowser(browser);

    await browser.pause(300);
    const input = await getByLabelText(label);

    // Focus on input
    await input.click();

    // Ensure default value is set
    await expect(input).toHaveValue('9876543210');

    // Type inside input
    // browser.keys doesn't work on iOS for some reason
    // related issue: https://github.com/appium/appium/issues/19670
    const length = (await input.getValue()).length;
    for (let i = 0; i < length; i++) {
      await driver.elementSendKeys(input.elementId, Key.Backspace);
    }
    await input.setValue('1234567890');

    // Ensure the value of the input updates
    await expect(input).toHaveValue('1234567890');

    // expect onChange to be called
    const onChangeData = await browser.execute(() => (window as any).onChangeData);
    expect(onChangeData).toEqual({
      country: 'IN',
      dialCode: '+91',
      name: null,
      phoneNumber: '1234 567890',
      value: '1234567890',
    });
  });

  it('should not respond to events if disabled', async () => {
    await goTo('components-e2e-tests-phonenumberinput--disabled');
    const { getByLabelText } = setupBrowser(browser);

    const input = await getByLabelText(label);

    await expect(input).toHaveValue('');

    // Ensure the input is disabled
    await expect(input).toBeDisabled();

    // expect input to not be focused
    await expect(input).not.toBeFocused();
  });

  it('should be autofocused', async () => {
    await goTo('components-e2e-tests-phonenumberinput--auto-focus');
    const { getByLabelText } = setupBrowser(browser);

    const input = await getByLabelText(label);
    await browser.pause(300);
    await expect(input).toBeFocused();
  });
});
