import renderWithTheme from '~utils/testing/renderWithTheme.native';

import TopLeftRoundedCornerIcon from '.';

describe('<TopLeftRoundedCornerIcon />', () => {
  it('should render TopLeftRoundedCornerIcon', () => {
    const renderTree = renderWithTheme(
      <TopLeftRoundedCornerIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
