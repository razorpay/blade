import MobileAppFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MobileAppFilledIcon />', () => {
  it('should render MobileAppFilledIcon', () => {
    const renderTree = renderWithTheme(
      <MobileAppFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
