import renderWithTheme from '~utils/testing/renderWithTheme.native';

import LeftCircularCornerIcon from '.';

describe('<LeftCircularCornerIcon />', () => {
  it('should render LeftCircularCornerIcon', () => {
    const renderTree = renderWithTheme(
      <LeftCircularCornerIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
