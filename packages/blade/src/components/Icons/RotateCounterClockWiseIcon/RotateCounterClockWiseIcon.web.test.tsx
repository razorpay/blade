import renderWithTheme from '~utils/testing/renderWithTheme.web';

import RotateCounterClockWiseIcon from '.';

describe('<RotateCounterClockWiseIcon />', () => {
  it('should render RotateCounterClockWiseIcon', () => {
    const { container } = renderWithTheme(
      <RotateCounterClockWiseIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
