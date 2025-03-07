import TopLeftRoundedCornerIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TopLeftRoundedCornerIcon />', () => {
  it('should render TopLeftRoundedCornerIcon', () => {
    const renderTree = renderWithTheme(
      <TopLeftRoundedCornerIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
