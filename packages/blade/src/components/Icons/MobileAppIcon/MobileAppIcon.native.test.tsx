import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MobileAppIcon from '.';

describe('<MobileAppIcon />', () => {
  it('should render MobileAppIcon', () => {
    const renderTree = renderWithTheme(
      <MobileAppIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
