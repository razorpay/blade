import RayIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RayIcon />', () => {
  it('should render RayIcon', () => {
    const renderTree = renderWithTheme(
      <RayIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
