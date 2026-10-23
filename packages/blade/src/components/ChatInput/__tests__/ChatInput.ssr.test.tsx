import { ChatInput } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<ChatInput />', () => {
  it('should render ChatInput', () => {
    const { container } = renderWithSSR(
      <>
        <ChatInput placeholder="Ask a question..." accessibilityLabel="Chat input" />
        <ChatInput size="small" placeholder="Ask a question..." accessibilityLabel="Chat input" />
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
