import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CornerRightDownIcon from '.';

describe('<CornerRightDownIcon />', () => {
  it('should render CornerRightDownIcon', () => {
    const renderTree = renderWithTheme(
      <CornerRightDownIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
