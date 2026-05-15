import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CookieIcon from '.';

describe('<CookieIcon />', () => {
  it('should render CookieIcon', () => {
    const renderTree = renderWithTheme(
      <CookieIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
