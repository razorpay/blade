import RotateClockWiseIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RotateClockWiseIcon />', () => {
  it('should render RotateClockWiseIcon', () => {
    const { container } = renderWithTheme(
      <RotateClockWiseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
