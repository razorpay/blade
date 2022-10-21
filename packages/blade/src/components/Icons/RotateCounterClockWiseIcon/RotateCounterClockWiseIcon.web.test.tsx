import RotateCounterClockWiseIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<RotateCounterClockWiseIcon />', () => {
  it('should render RotateCounterClockWiseIcon', () => {
    const { container } = renderWithTheme(
      <RotateCounterClockWiseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
