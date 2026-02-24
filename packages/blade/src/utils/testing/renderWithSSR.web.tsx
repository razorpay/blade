/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-implicit-any-catch */
import util from 'util';
import type { RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import jsdom from 'jsdom';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';

const globalNames = new Set(Object.getOwnPropertyNames(global));

const renderWithSSR = (ui: ReactElement): RenderResult => {
  const App = (): ReactElement => (
    <BladeProvider themeTokens={bladeTheme} colorScheme="light">
      {ui}
    </BladeProvider>
  );

  // Set up jsdom globals BEFORE renderToString so that browser APIs like `window`
  // are available during SSR. This prevents hydration mismatches caused by libraries
  // (e.g. i18nify-js) that check for `window` and behave differently without it.
  const { JSDOM } = jsdom;
  const dom = new JSDOM('<!DOCTYPE html><div id="root"></div>', {
    pretendToBeVisual: true,
    url: 'http://localhost/',
  });
  // Copy all JSDOM globals into node globals so that React can access them.
  // This is needed because just assigning JSDOM `window` object to the `global.window` isn't sufficient.
  // If we don't do this, for example:
  // `window.requestAnimationFrame()` will work
  //  but calling: `requestAnimationFrame()` without the window prefix will not work
  Object.getOwnPropertyNames(dom.window).forEach((key) => {
    if (!globalNames.has(key)) {
      Object.defineProperty(global, key, Object.getOwnPropertyDescriptor(dom.window, key)!);
    }
  });

  const html = renderToString(
    <div id="root">
      <App />
    </div>,
  );

  // Inject SSR HTML into the jsdom document so hydration has the correct DOM to work with
  dom.window.document.body.innerHTML = html;

  expect(html).toMatchSnapshot();

  let result: RenderResult;
  const errors = [];
  const oldConsoleError = console.error;
  const oldConsoleWarn = console.warn;
  // eslint-disable-next-line no-multi-assign
  console.error = console.warn = (...messages) => {
    errors.push(util.format(...messages));
  };

  // Catch any hydration errors
  try {
    result = render(<App />, {
      hydrate: true,
      container: document.getElementById('root') ?? undefined,
    });
  } catch (err: any) {
    errors.push(err.stack);
  }

  if (errors.length > 0) {
    throw new Error(errors[0]);
  }

  // reset console
  console.error = oldConsoleError;
  console.warn = oldConsoleWarn;
  errors.length = 0;

  // @ts-expect-error
  return result;
};

export default renderWithSSR;
