import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SortIcon from '.';

describe('<SortIcon />', () => {
  it('should render SortIcon', () => {
    const renderTree = renderWithTheme(
      <SortIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
