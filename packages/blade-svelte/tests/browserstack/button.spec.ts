import { test, expect } from '@playwright/test';

const stories = [
  'components-button--playground',
  'components-button--disabled',
  'components-button--icon-only',
];

// Desktop projects connect via a raw CDP endpoint (no browserstack-node-sdk wrapper),
// so nothing reports pass/fail to BrowserStack automatically — sessions show up as
// CLIENT_STOPPED_SESSION otherwise. This marker tells BrowserStack's CDP proxy to set
// the session status explicitly. Mobile sessions already get this from the SDK, but
// executing it there too is a harmless no-op.
test.afterEach(async ({ page }, testInfo) => {
  const status = testInfo.status === 'passed' ? 'passed' : 'failed';
  const reason = testInfo.error?.message ?? '';
  const marker = `browserstack_executor: ${JSON.stringify({
    action: 'setSessionStatus',
    arguments: { status, reason },
  })}`;
  try {
    // Playwright's evaluate(string) runs the string as an expression, but the
    // BrowserStack marker is a labeled statement — only valid as a JS *statement*.
    // Running it through an indirect eval() inside a function body allows statements.
    await page.evaluate((m) => {
      // eslint-disable-next-line no-eval
      (0, eval)(m);
    }, marker);
  } catch (error) {
    console.warn('Failed to report BrowserStack session status:', error);
  }
});

// BrowserStack mobile SDK sessions allow only one browser context per test run,
// so all stories are checked within a single test/context instead of one test each.
test('Button stories render and are interactive', async ({ page }) => {
  for (const storyId of stories) {
    await page.goto(`iframe.html?id=${storyId}`);
    const button = page.getByRole('button').first();
    await expect(button).toBeVisible();
    if (await button.isEnabled()) {
      await button.click();
    }
  }
});
