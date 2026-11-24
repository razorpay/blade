import { RayLoader } from '../RayLoader';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<RayLoader />', () => {
  it('should render the loader on server', () => {
    const { container } = renderWithSSR(<RayLoader accessibilityLabel="Loading" />);
    expect(container).toMatchSnapshot();
  });
});
