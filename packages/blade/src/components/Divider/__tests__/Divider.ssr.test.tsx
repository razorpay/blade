import { Divider } from '../Divider';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<Divider />', () => {
  it('should render Divider on server', () => {
    const { container } = renderWithSSR(<Divider />);

    expect(container).toMatchSnapshot();
  });
});
