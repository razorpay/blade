import renderWithTheme from '~utils/testing/renderWithTheme.web';

import RotateClockWiseIcon from '.';

describe('<RotateClockWiseIcon />', () => {
  it('should render RotateClockWiseIcon', () => {
    const { container } = renderWithTheme(
      <RotateClockWiseIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
