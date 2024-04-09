// import original module declarations
import 'styled-components';
import 'styled-components/native';
import '@testing-library/jest-dom';
import '@testing-library/jest-native/extend-expect';
import type { WebdriverIOQueries } from '@testing-library/webdriverio';
import type { BrowserBase } from 'webdriverio';
import type { Theme } from '~components/BladeProvider';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
declare module 'styled-components/native' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}

declare module '@testing-library/webdriverio' {
  function setupBrowser<Browser extends BrowserBase>(browser: Browser): WebdriverIOQueries;
}
