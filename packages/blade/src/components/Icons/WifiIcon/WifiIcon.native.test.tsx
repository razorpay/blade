import WifiIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<WifiIcon />', () => {
  it('should render WifiIcon', () => {
    const renderTree = renderWithTheme(
      <WifiIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
