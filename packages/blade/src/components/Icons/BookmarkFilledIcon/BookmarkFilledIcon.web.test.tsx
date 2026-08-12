import BookmarkFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BookmarkFilledIcon />', () => {
  it('should render BookmarkFilledIcon', () => {
    const { container } = renderWithTheme(
      <BookmarkFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
