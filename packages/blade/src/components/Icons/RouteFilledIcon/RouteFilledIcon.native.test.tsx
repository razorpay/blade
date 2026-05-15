import renderWithTheme from '~utils/testing/renderWithTheme.native';

import RouteFilledIcon from '.';

describe('<RouteFilledIcon />', () => {
  it('should render RouteFilledIcon', () => {
    const renderTree = renderWithTheme(
      <RouteFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
