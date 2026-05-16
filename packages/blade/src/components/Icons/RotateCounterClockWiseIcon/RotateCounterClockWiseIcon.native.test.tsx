import renderWithTheme from '~utils/testing/renderWithTheme.native';

import RotateCounterClockWiseIcon from '.';

describe('<RotateCounterClockWiseIcon />', () => {
  it('should render RotateCounterClockWiseIcon', () => {
    const renderTree = renderWithTheme(
      <RotateCounterClockWiseIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
