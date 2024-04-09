/* eslint-disable @typescript-eslint/no-floating-promises */
import { expect, browser } from '@wdio/globals';
import { setupBrowser } from '@testing-library/webdriverio';

before(async () => {
  await browser.url('?args=&id=components-button--button-test&viewMode=story');
  await browser.waitUntil(async () => (await browser.getTitle()).match(/button/i), {
    timeout: 5000,
  });
});

describe('Button', () => {
  it('should click', async () => {
    const { getByTestId, getByRole } = setupBrowser(browser);

    expect(await getByTestId('counter')).toHaveText('Clicked: 0');

    const button1 = await getByRole('button', { name: /increase/i });
    await button1.click();
    await button1.click();
    await button1.click();

    expect(await getByTestId('counter')).toHaveText('Clicked: 3');
  });
});
