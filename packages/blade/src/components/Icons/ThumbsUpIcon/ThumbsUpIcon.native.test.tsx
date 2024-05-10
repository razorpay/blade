import ThumbsUpIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ThumbsUpIcon />', () => {
  it('should render ThumbsUpIcon', () => {
    const renderTree = renderWithTheme(
      <ThumbsUpIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
