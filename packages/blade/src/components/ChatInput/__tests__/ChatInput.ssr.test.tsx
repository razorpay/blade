import renderWithSSR from '~utils/testing/renderWithSSR.web';

import { ChatInput } from '../index';

describe('<ChatInput />', () => {
  it('should render ChatInput', () => {
    const { container } = renderWithSSR(
      <ChatInput placeholder="Ask a question..." accessibilityLabel="Chat input" />,
    );
    expect(container).toMatchSnapshot();
  });
});
