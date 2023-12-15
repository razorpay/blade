import RotateClockWiseIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RotateClockWiseIcon />', () => {
  it('should render RotateClockWiseIcon', () => {
    const { container } = renderWithTheme(
      <RotateClockWiseIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
