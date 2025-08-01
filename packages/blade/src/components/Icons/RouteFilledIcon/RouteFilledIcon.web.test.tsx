import RouteFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RouteFilledIcon />', () => {
  it('should render RouteFilledIcon', () => {
    const { container } = renderWithTheme(
      <RouteFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
