import { renderToString } from 'react-dom/server';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';
import { ChatInput } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

// Run before renderWithSSR, whose hydration helper installs JSDOM globals.
it('renders the ambient composer on the server', () => {
  expect(typeof window).toBe('undefined');
  expect(typeof document).toBe('undefined');
  const html = renderToString(
    <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
      <ChatInput borderEffect="ambient" />
    </BladeProvider>,
  );
  expect(html).toContain('<textarea');
  expect(html).toMatch(/<span[^>]*aria-hidden="true"/);

  const defaultHtml = renderToString(
    <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
      <ChatInput />
    </BladeProvider>,
  );
  expect(defaultHtml).toMatch(/<input(?=[^>]*type="file")(?=[^>]*aria-hidden="true")[^>]*>/);
  expect(defaultHtml).not.toMatch(/<span[^>]*aria-hidden="true"/);
});

describe('<ChatInput />', () => {
  it('should render ChatInput', () => {
    const { container } = renderWithSSR(
      <ChatInput placeholder="Ask a question..." accessibilityLabel="Chat input" />,
    );
    expect(container).toMatchSnapshot();
  });
});
