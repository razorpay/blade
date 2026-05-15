import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ShoppingCartIcon from './';

describe('<ShoppingCartIcon />', () => {
  it('should render ShoppingCartIcon', () => {
    const { container } = renderWithTheme(
      <ShoppingCartIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
