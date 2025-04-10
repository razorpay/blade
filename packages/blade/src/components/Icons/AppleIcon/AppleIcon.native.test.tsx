import AppleIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AppleIcon />', () => {
  it('should render AppleIcon', () => {
    const renderTree = renderWithTheme(
      <AppleIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
