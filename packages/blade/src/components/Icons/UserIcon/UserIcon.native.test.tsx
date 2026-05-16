import renderWithTheme from '~utils/testing/renderWithTheme.native';

import UserIcon from '.';

describe('<UserIcon />', () => {
  it('should render UserIcon', () => {
    const renderTree = renderWithTheme(
      <UserIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
