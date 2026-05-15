import renderWithTheme from '~utils/testing/renderWithTheme.native';

import AlignRightIcon from '.';

describe('<AlignRightIcon />', () => {
  it('should render AlignRightIcon', () => {
    const renderTree = renderWithTheme(
      <AlignRightIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
