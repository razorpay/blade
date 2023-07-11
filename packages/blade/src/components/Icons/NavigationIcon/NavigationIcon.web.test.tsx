import NavigationIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<NavigationIcon />', () => {
  it('should render NavigationIcon', () => {
    const { container } = renderWithTheme(
      <NavigationIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
