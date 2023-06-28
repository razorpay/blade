import ShoppingCartIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ShoppingCartIcon />', () => {
  it('should render ShoppingCartIcon', () => {
    const { container } = renderWithTheme(
      <ShoppingCartIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
