import HomeIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<HomeIcon />', () => {
  it('should render HomeIcon', () => {
    const renderTree = renderWithTheme(
      <HomeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
