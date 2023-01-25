import WifiIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<WifiIcon />', () => {
  it('should render WifiIcon', () => {
    const renderTree = renderWithTheme(
      <WifiIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
