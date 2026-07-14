import { ChatInput } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<ChatInput />', () => {
  it('should render the default and single-line variants', () => {
    const { container } = renderWithSSR(
      <>
        <ChatInput placeholder="Ask a question..." accessibilityLabel="Chat input" />
        <ChatInput
          variant="single-line"
          placeholder="Ask anything..."
          accessibilityLabel="Single-line chat input"
        />
      </>,
    );
    expect(container).toMatchSnapshot();
  });
});
