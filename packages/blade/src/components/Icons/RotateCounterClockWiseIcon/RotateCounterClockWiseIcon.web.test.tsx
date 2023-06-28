import RotateCounterClockWiseIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RotateCounterClockWiseIcon />', () => {
  it('should render RotateCounterClockWiseIcon', () => {
    const { container } = renderWithTheme(
      <RotateCounterClockWiseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
