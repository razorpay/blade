import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ListSearchIcon from '.';

describe('<ListSearchIcon />', () => {
  it('should render ListSearchIcon', () => {
    const renderTree = renderWithTheme(
      <ListSearchIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
