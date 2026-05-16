import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ShoppingCartIcon from '.';

describe('<ShoppingCartIcon />', () => {
  it('should render ShoppingCartIcon', () => {
    const renderTree = renderWithTheme(
      <ShoppingCartIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
