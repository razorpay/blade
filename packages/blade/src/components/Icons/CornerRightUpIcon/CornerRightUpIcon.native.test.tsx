import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CornerRightUpIcon from '.';

describe('<CornerRightUpIcon />', () => {
  it('should render CornerRightUpIcon', () => {
    const renderTree = renderWithTheme(
      <CornerRightUpIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
