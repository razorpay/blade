import renderWithTheme from '~utils/testing/renderWithTheme.native';

import TagIcon from '.';

describe('<TagIcon />', () => {
  it('should render TagIcon', () => {
    const renderTree = renderWithTheme(
      <TagIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
