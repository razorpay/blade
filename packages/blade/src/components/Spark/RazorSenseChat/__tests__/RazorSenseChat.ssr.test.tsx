import { RazorSenseChat, RazorSenseBottomWave } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

// (on the server: its markup, with no canvas and no GPU work; on the client it hydrates without a mismatch)
describe('<RazorSenseChat />', () => {
  it('should render RazorSenseChat on server', () => {
    const { container } = renderWithSSR(
      <RazorSenseChat>
        <RazorSenseBottomWave>
          <textarea aria-label="Ask" />
        </RazorSenseBottomWave>
      </RazorSenseChat>,
    );
    expect(container.querySelector('[data-blade-component="razorsense-chat"]')).not.toBeNull();
  });
});
