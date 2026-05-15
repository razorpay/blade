import renderWithTheme from '~utils/testing/renderWithTheme.native';

import RotateClockWiseIcon from '.';

describe('<RotateClockWiseIcon />', () => {
  it('should render RotateClockWiseIcon', () => {
    const renderTree = renderWithTheme(
      <RotateClockWiseIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
