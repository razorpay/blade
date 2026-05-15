import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BookIcon from '.';

describe('<BookIcon />', () => {
  it('should render BookIcon', () => {
    const renderTree = renderWithTheme(
      <BookIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
