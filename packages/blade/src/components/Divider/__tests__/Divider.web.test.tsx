import { Divider } from '../Divider';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Divider />', () => {
  it('should render Divider', () => {
    const { container } = renderWithTheme(<Divider />);
    expect(container).toMatchSnapshot();
  });
});
