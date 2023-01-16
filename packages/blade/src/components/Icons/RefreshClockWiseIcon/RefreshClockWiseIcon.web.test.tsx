import RefreshClockWiseIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<RefreshClockWiseIcon />', () => {
  it('should render RefreshClockWiseIcon', () => {
    const { container } = renderWithTheme(
      <RefreshClockWiseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
