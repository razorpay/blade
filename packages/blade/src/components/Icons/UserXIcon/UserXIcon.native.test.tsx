import renderWithTheme from '~utils/testing/renderWithTheme.native';

import UserXIcon from '.';

describe('<UserXIcon />', () => {
  it('should render UserXIcon', () => {
    const renderTree = renderWithTheme(
      <UserXIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
