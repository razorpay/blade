import TopLeftSharpCornerIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TopLeftSharpCornerIcon />', () => {
  it('should render TopLeftSharpCornerIcon', () => {
    const renderTree = renderWithTheme(
      <TopLeftSharpCornerIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
