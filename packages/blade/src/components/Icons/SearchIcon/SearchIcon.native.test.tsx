import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SearchIcon from '.';

describe('<SearchIcon />', () => {
  it('should render SearchIcon', () => {
    const renderTree = renderWithTheme(
      <SearchIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
