import { Divider } from '../Divider';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Divider />', () => {
  it('should render Divider', () => {
    const { toJSON } = renderWithTheme(<Divider />);
    expect(toJSON()).toMatchSnapshot();
  });
});
