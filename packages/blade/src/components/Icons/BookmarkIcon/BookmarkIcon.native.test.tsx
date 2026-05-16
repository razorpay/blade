import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BookmarkIcon from '.';

describe('<BookmarkIcon />', () => {
  it('should render BookmarkIcon', () => {
    const renderTree = renderWithTheme(
      <BookmarkIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
