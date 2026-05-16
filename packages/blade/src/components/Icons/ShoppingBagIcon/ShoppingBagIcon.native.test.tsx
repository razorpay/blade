import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ShoppingBagIcon from '.';

describe('<ShoppingBagIcon />', () => {
  it('should render ShoppingBagIcon', () => {
    const renderTree = renderWithTheme(
      <ShoppingBagIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
