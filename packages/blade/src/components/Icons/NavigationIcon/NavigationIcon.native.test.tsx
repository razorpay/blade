import NavigationIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<NavigationIcon />', () => {
  it('should render NavigationIcon', () => {
    const renderTree = renderWithTheme(
      <NavigationIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
