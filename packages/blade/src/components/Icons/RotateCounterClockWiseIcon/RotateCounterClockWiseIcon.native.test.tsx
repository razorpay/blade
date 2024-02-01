import RotateCounterClockWiseIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RotateCounterClockWiseIcon />', () => {
  it('should render RotateCounterClockWiseIcon', () => {
    const renderTree = renderWithTheme(
      <RotateCounterClockWiseIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
