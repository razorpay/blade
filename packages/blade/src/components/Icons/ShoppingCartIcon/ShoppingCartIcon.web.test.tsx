import ShoppingCartIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ShoppingCartIcon />', () => {
  it('should render ShoppingCartIcon', () => {
    const { container } = renderWithTheme(
      <ShoppingCartIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
