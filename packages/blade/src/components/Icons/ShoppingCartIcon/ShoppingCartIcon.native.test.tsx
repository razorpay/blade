import ShoppingCartIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ShoppingCartIcon />', () => {
  it('should render ShoppingCartIcon', () => {
    const renderTree = renderWithTheme(
      <ShoppingCartIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
