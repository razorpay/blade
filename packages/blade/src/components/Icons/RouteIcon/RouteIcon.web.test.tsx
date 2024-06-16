import RouteIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RouteIcon />', () => {
  it('should render RouteIcon', () => {
    const { container } = renderWithTheme(
      <RouteIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
