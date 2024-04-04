import { browser, $ } from '@wdio/globals';

beforeEach(async () => {
  await browser.url('?args=&id=components-button--button-test&viewMode=story');
  await browser.waitUntil(async () => (await browser.getTitle()).match(/button/i), {
    timeout: 5000,
  });
});

describe('Button', () => {
  it('should click', async () => {
    const counter = await $('[data-testid="counter"]');
    expect(await counter.getText()).toBe('Clicked: 0');

    const button1 = await $('button*=Increase');
    await button1.click();
    await button1.click();
    await button1.click();

    expect(await counter.getText()).toBe('Clicked: 3');

    await browser.pause(1000);
  });
});
