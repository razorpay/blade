import ShoppingBagIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ShoppingBagIcon />', () => {
  it('should render ShoppingBagIcon', () => {
    const renderTree = renderWithTheme(
      <ShoppingBagIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
