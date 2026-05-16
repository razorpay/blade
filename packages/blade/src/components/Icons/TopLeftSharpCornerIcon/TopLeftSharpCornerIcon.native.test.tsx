import renderWithTheme from '~utils/testing/renderWithTheme.native';

import TopLeftSharpCornerIcon from '.';

describe('<TopLeftSharpCornerIcon />', () => {
  it('should render TopLeftSharpCornerIcon', () => {
    const renderTree = renderWithTheme(
      <TopLeftSharpCornerIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
