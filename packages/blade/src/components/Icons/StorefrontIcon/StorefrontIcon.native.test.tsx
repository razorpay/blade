import renderWithTheme from '~utils/testing/renderWithTheme.native';

import StorefrontIcon from '.';

describe('<StorefrontIcon />', () => {
  it('should render StorefrontIcon', () => {
    const renderTree = renderWithTheme(
      <StorefrontIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
