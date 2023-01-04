import NavigationIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<NavigationIcon />', () => {
  it('should render NavigationIcon', () => {
    const renderTree = renderWithTheme(
      <NavigationIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
