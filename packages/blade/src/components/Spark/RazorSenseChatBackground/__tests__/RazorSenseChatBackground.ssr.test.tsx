import { RazorSenseChatBackground } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

// (on the server: its markup, with no canvas and no GPU work; on the client it hydrates without a mismatch)
describe('<RazorSenseChatBackground />', () => {
  it('should render RazorSenseChatBackground on server', () => {
    const { container } = renderWithSSR(
      <RazorSenseChatBackground>
        <textarea aria-label="Ask" />
      </RazorSenseChatBackground>,
    );
    expect(
      container.querySelector('[data-blade-component="razorsense-chat-background"]'),
    ).not.toBeNull();
  });
});
