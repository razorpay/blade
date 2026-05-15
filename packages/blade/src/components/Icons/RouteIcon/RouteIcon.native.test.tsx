import renderWithTheme from '~utils/testing/renderWithTheme.native';

import RouteIcon from '.';

describe('<RouteIcon />', () => {
  it('should render RouteIcon', () => {
    const renderTree = renderWithTheme(
      <RouteIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
