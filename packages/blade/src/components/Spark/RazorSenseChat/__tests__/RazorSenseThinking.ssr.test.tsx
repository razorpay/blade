import { RazorSenseThinking } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

// (on the server: its markup, with no canvas and no GPU work; on the client it hydrates without a mismatch)
describe('<RazorSenseThinking />', () => {
  it('should render RazorSenseThinking on server', () => {
    const { container } = renderWithSSR(
      <RazorSenseThinking>Searching your settlements…</RazorSenseThinking>,
    );
    expect(container.querySelector('[data-blade-component="razorsense-thinking"]')).not.toBeNull();
  });
});
