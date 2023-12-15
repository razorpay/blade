import RoutesIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RoutesIcon />', () => {
  it('should render RoutesIcon', () => {
    const { container } = renderWithTheme(
      <RoutesIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
