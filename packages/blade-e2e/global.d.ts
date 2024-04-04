import type { WebdriverIOQueries } from '@testing-library/webdriverio';
import type { BrowserBase } from 'webdriverio';

declare module '@testing-library/webdriverio' {
  function setupBrowser<Browser extends BrowserBase>(browser: Browser): WebdriverIOQueries;
}
