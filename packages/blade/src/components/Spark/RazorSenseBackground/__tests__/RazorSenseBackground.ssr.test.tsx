import { RazorSenseBackground } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

// (on the server: its markup, with no canvas and no GPU work; on the client it hydrates without a mismatch)
describe('<RazorSenseBackground />', () => {
  it('should render RazorSenseBackground on server', () => {
    const { container } = renderWithSSR(<RazorSenseBackground />);
    expect(
      container.querySelector('[data-blade-component="razorsense-background"]'),
    ).not.toBeNull();
  });
});
