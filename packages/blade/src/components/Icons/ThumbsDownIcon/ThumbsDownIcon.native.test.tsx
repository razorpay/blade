import ThumbsDownIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ThumbsDownIcon />', () => {
  it('should render ThumbsDownIcon', () => {
    const renderTree = renderWithTheme(
      <ThumbsDownIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
