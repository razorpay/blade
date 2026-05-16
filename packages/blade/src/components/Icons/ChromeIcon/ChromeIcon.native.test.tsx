import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ChromeIcon from '.';

describe('<ChromeIcon />', () => {
  it('should render ChromeIcon', () => {
    const renderTree = renderWithTheme(
      <ChromeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
