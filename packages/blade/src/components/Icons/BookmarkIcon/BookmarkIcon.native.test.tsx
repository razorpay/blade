import BookmarkIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BookmarkIcon />', () => {
  it('should render BookmarkIcon', () => {
    const renderTree = renderWithTheme(
      <BookmarkIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
