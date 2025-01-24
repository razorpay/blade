import RoundedCornerIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RoundedCornerIcon />', () => {
  it('should render RoundedCornerIcon', () => {
    const renderTree = renderWithTheme(
      <RoundedCornerIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
