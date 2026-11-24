import { RayChatOutput } from '../RayChatOutput';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<RayChatOutput />', () => {
  it('renders on the server', () => {
    // react-markdown is mocked in Jest, so the text comes through as written; the snapshot
    // keeps the chat rules' styles (type, colours, gaps).
    const { container } = renderWithSSR(
      <RayChatOutput testID="answer">Your payouts are on time.</RayChatOutput>,
    );
    expect(container).toHaveTextContent('Your payouts are on time.');
    expect(container).toMatchSnapshot();
  });
});
