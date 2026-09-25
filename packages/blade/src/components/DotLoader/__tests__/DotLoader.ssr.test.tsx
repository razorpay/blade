import { DotLoader } from '../DotLoader';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<DotLoader />', () => {
  it('should render DotLoader on server', () => {
    const { container } = renderWithSSR(<DotLoader accessibilityLabel="Loading" />);
    expect(container).toMatchSnapshot();
  });
});
