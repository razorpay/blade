import ShoppingBagIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ShoppingBagIcon />', () => {
  it('should render ShoppingBagIcon', () => {
    const { container } = renderWithTheme(
      <ShoppingBagIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
