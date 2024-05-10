import WifiOffIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<WifiOffIcon />', () => {
  it('should render WifiOffIcon', () => {
    const renderTree = renderWithTheme(
      <WifiOffIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
