import BookmarkFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BookmarkFilledIcon />', () => {
  it('should render BookmarkFilledIcon', () => {
    const renderTree = renderWithTheme(
      <BookmarkFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
