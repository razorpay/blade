import RouteIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RouteIcon />', () => {
  it('should render RouteIcon', () => {
    const renderTree = renderWithTheme(
      <RouteIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
