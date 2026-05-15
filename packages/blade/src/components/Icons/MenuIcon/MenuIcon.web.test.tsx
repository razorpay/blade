import renderWithTheme from '~utils/testing/renderWithTheme.web';

import MenuIcon from './';

describe('<MenuIcon />', () => {
  it('should render MenuIcon', () => {
    const { container } = renderWithTheme(
      <MenuIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
