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
  const container = document.createElement('div');
  container.innerHTML = html;
  expect(container.querySelector('span[aria-hidden="true"]')).not.toBeNull();

  const defaultHtml = renderToString(
    <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
      <ChatInput />
    </BladeProvider>,
  );
  container.innerHTML = defaultHtml;
  expect(container.querySelector('input[type="file"][aria-hidden="true"]')).not.toBeNull();
  expect(container.querySelector('span[aria-hidden="true"]')).toBeNull();
});
