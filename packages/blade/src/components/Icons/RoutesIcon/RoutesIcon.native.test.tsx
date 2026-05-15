import renderWithTheme from '~utils/testing/renderWithTheme.native';

import RoutesIcon from '.';

describe('<RoutesIcon />', () => {
  it('should render RoutesIcon', () => {
    const renderTree = renderWithTheme(
      <RoutesIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
