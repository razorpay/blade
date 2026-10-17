import { renderToString } from 'react-dom/server';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';
import { ChatInput } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<ChatInput />', () => {
  it('should render ChatInput', () => {
    const { container } = renderWithSSR(
      <ChatInput placeholder="Ask a question..." accessibilityLabel="Chat input" />,
    );
    expect(container).toMatchSnapshot();
  });
});

it('renders the ambient composer on the server', () => {
  const html = renderToString(
    <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
      <ChatInput borderEffect="ambient" />
    </BladeProvider>,
  );
  expect(html).toContain('<textarea');
  expect(html).toContain('aria-hidden="true"');
});
