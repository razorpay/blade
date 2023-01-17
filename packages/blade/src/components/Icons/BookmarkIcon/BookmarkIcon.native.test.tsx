import BookmarkIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<BookmarkIcon />', () => {
  it('should render BookmarkIcon', () => {
    const renderTree = renderWithTheme(
      <BookmarkIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
