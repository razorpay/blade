import renderWithTheme from '~utils/testing/renderWithTheme.native';

import AppleIcon from '.';

describe('<AppleIcon />', () => {
  it('should render AppleIcon', () => {
    const renderTree = renderWithTheme(
      <AppleIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
