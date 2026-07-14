import type { TestType } from '@playwright/test';

// Desktop projects connect via a raw CDP endpoint (no browserstack-node-sdk wrapper),
// so nothing reports pass/fail to BrowserStack automatically — sessions show up as
// CLIENT_STOPPED_SESSION otherwise. This marker tells BrowserStack's CDP proxy to set
// the session status explicitly. Mobile sessions already get this from the SDK, but
// executing it there too is a harmless no-op.
export function registerBrowserStackStatusReporter(
  test: TestType<Record<string, unknown>, Record<string, unknown>>,
): void {
  test.afterEach(async ({ page }, testInfo) => {
    const status = testInfo.status === 'passed' || testInfo.status === 'flaky' ? 'passed' : 'failed';
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
    } catch (error: unknown) {
      console.warn('Failed to report BrowserStack session status:', error);
    }
  });
}
