import { RazorSenseLoader } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

// (on the server: its markup, with no canvas and no GPU work; on the client it hydrates without a mismatch)
describe('<RazorSenseLoader />', () => {
  it('should render RazorSenseLoader on server', () => {
    const { container } = renderWithSSR(<RazorSenseLoader isLoading />);
    expect(container.querySelector('[data-blade-component="razorsense-loader"]')).not.toBeNull();
  });
});
