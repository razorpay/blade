import type { RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import jsdom from 'jsdom';
import { BladeProvider } from '~components/BladeProvider';
import { paymentTheme } from '~tokens/theme';

const renderWithSSR = (ui: ReactElement): RenderResult => {
  const App = (): ReactElement => (
    <BladeProvider themeTokens={paymentTheme} colorScheme="light">
      {ui}
    </BladeProvider>
  );

  const html = renderToString(
    <div id="root">
      <App />
    </div>,
  );

  const { JSDOM } = jsdom;
  const dom = new JSDOM(html);
  // @ts-expect-error ignoring this error since we are trying to make tests work between node and jsdom environments
  global.window = dom.window;
  global.document = dom.window.document;

  expect(html).toMatchSnapshot();

  return render(<App />, {
    hydrate: true,
    container: document.getElementById('root') ?? undefined,
  });
};

export default renderWithSSR;
