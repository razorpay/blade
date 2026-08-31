# Browser Compatibility Report

BrowserStack device/browser matrix used to test `blade-svelte` components, sourced
from `playwright.config.cts` (desktop) and `browserstack.yml` (mobile, via
`browserstack-node-sdk`).

## Desktop

| OS | Version | Browser |
| --- | --- | --- |
| Windows | 11 | Chrome (latest) |
| OS X | Ventura | Playwright-WebKit (latest) |

## Mobile

| OS | Version | Browser / Device |
| --- | --- | --- |
| Android | 13.0 | Chrome — Google Pixel 7 |
| iOS | latest | Safari — iPhone 15 Pro |

See [`MOBILE_TESTS_STATUS.md`](./MOBILE_TESTS_STATUS.md) for known mobile-SDK-specific
test gaps against this matrix.
