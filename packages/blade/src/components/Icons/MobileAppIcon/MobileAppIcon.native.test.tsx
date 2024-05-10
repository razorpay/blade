import MobileAppIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MobileAppIcon />', () => {
  it('should render MobileAppIcon', () => {
    const renderTree = renderWithTheme(
      <MobileAppIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
