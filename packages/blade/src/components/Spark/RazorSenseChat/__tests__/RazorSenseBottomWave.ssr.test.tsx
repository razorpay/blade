import { RazorSenseBottomWave } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

// (on the server: its markup, with no canvas and no GPU work; on the client it hydrates without a mismatch)
describe('<RazorSenseBottomWave />', () => {
  it('should render RazorSenseBottomWave on server', () => {
    const { container } = renderWithSSR(
      <RazorSenseBottomWave>
        <textarea aria-label="Ask" />
      </RazorSenseBottomWave>,
    );
    expect(
      container.querySelector('[data-blade-component="razorsense-bottom-wave"]'),
    ).not.toBeNull();
  });
});
