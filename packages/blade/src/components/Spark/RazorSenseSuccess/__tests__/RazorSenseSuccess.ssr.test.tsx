import { RazorSenseSuccess } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

// (on the server: its markup, with no canvas and no GPU work; on the client it hydrates without a mismatch)
describe('<RazorSenseSuccess />', () => {
  it('should render RazorSenseSuccess on server', () => {
    const { container } = renderWithSSR(<RazorSenseSuccess label="Payment received" />);
    expect(container.querySelector('[data-blade-component="razorsense-success"]')).not.toBeNull();
  });
});
