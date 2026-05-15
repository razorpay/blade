import renderWithTheme from '~utils/testing/renderWithTheme.native';

import HomeIcon from '.';

describe('<HomeIcon />', () => {
  it('should render HomeIcon', () => {
    const renderTree = renderWithTheme(
      <HomeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
