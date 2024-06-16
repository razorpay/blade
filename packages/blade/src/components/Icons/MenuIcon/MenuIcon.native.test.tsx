import MenuIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MenuIcon />', () => {
  it('should render MenuIcon', () => {
    const renderTree = renderWithTheme(
      <MenuIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
