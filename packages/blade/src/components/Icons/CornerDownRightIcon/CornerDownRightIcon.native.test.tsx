import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CornerDownRightIcon from '.';

describe('<CornerDownRightIcon />', () => {
  it('should render CornerDownRightIcon', () => {
    const renderTree = renderWithTheme(
      <CornerDownRightIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
