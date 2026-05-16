import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MoonIcon from '.';

describe('<MoonIcon />', () => {
  it('should render MoonIcon', () => {
    const renderTree = renderWithTheme(
      <MoonIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
